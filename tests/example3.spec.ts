import { test, type Page } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { TopMenuPage } from '../pages/top-menu-page';
import {
    BatchInfo, //group multiple visual tests
    Configuration, //sets up browser/device settings for visual tests
    EyesRunner, //manages test execution (classic or ultrafast grid)
    ClassicRunner,//run tests one at a time
    VisualGridRunner, //run tests concurrently
    BrowserType, //chrome, firefox
    DeviceName, //predefined devices (e.g., iPhone 11)
    ScreenOrientation, //landscape, portrait
    Eyes, //manages visual testing (e.g., screenshots)
    Target //specifies what parts of a page to test visually
  } from '@applitools/eyes-playwright';

const URL = 'https://playwright.dev/';
let homePage: HomePage;
let topMenuPage: TopMenuPage;
const pageUrl = /.*intro/; //ensures that the URL contains the word 'intro'

// Applitools -> visual testing features
// export const USE_ULTRAFAST_GRID: boolean = true;
export const USE_ULTRAFAST_GRID: boolean = false; //use classic runner by default
export let Batch: BatchInfo; //batch info for grouping tests
export let Config: Configuration; //stores the configuration settings for visual tests
export let Runner: EyesRunner; //the runner that executes the tests (classic or ultrafast grid)
let eyes: Eyes; //eyes instance for managing visual tests
// end of Applitools

// beforeAll for Applitools
test.beforeAll(async() => {
    //choose runner type: classic or ultrafast grid
    if (USE_ULTRAFAST_GRID) {
        Runner = new VisualGridRunner({ testConcurrency: 5 }); //run tests concurrently
    }
    else {
        Runner = new ClassicRunner(); //run tests one at a time
    }
    
    //define the batch name based on the runner type
    const runnerName = (USE_ULTRAFAST_GRID) ? 'Ultrafast Grid' : 'Classic runner';
    Batch = new BatchInfo({name: `Playwright website - ${runnerName}`});
    
    //initialise applitools configuration
    Config = new Configuration();
    // Config.setApiKey("<your-api-key>");
    
    Config.setBatch(Batch); //assign batch to configuration
    //add browser/device settings if using ultrafast grid
    if (USE_ULTRAFAST_GRID) {
        Config.addBrowser(800, 600, BrowserType.CHROME);
        Config.addBrowser(1600, 1200, BrowserType.FIREFOX);
        Config.addBrowser(1024, 768, BrowserType.SAFARI);
        Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT);
        Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
    }

});


test.beforeEach(async ({page}) => {
    //initialise applitools eyes for the test
    eyes = new Eyes(Runner, Config);
    await eyes.open(
      page, //playwright page object
      'Playwright', //the app name
      test.info().title, //the test name
      { width: 1024, height: 768 } //browser window size
    );
    //end of Applitools

    await page.goto(URL); //navigate to the Playwright website
    homePage = new HomePage(page); //create a new HomePage object
});

test.afterEach(async () => {
    await eyes.close(); //close the eyes instance
});

test.afterAll(async() => {
  // forces Playwright to wait synchronously for all visual checkpoints to complete.
  const results = await Runner.getAllTestResults();
  console.log('Visual test results', results);
});

async function clickGetStarted(page: Page) {
    await homePage.clickGetStarted();
    topMenuPage = new TopMenuPage(page);
}

test.describe('Playwright website', () => {

    test('has title', async () => {
        await homePage.assertPageTitle();
        // https://applitools.com/docs/api-ref/sdk-api/playwright/js-intro/checksettings
        await eyes.check('Home page', Target.window().fully()); //take a screenshot of the entire page
    });
    
    test('get started link', async ({ page }) => {
        await clickGetStarted(page);
        await topMenuPage.assertPageUrl(pageUrl);
        // https://applitools.com/docs/api-ref/sdk-api/playwright/js-intro/checksettings#region-match-levels
        // Layout: Check only the layout and ignore actual text and graphics.
        await eyes.check('Get Started page', Target.window().fully().layout());
    });
    
    test('check Java page', async ({ page }) => {
         // Step 1: Act - Perform actions
        await test.step('Act', async () => {
            await clickGetStarted(page);
            await topMenuPage.hoverNode();
            await topMenuPage.clickJava();
        });    
         // Step 2: Assert - Verify the results
        await test.step('Assert', async () => {
            await topMenuPage.assertPageUrl(pageUrl);
            await topMenuPage.assertNodeDescriptionNotVisible();
            await topMenuPage.assertJavaDescriptionVisible();
            // https://applitools.com/docs/api-ref/sdk-api/playwright/js-intro/checksettings#region-match-levels
            // Ignore colors: Similar to the strict match level but ignores changes in colors.
            await eyes.check('Java page', Target.window().fully().ignoreColors());
        });
    });
});