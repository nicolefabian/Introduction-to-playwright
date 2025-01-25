import { test, expect, Page } from '@playwright/test'; //test -> to define test, expect for assertions, Page -> represents a webpage to interact with the page 
import {HomePage} from '../pages/home-page';

//MAIN TEST FILE  
//AAA Pattern
//Arrange
//Act
//Assert

//Page Object Model -> POM
//representation of a page or a group of elemts in a page
//can be reused in multiple tests\
// can be used to abstract the page elements
//example:
//top heading, content, footer, login form, etc.

const url = 'https://playwright.dev/';
let homePage:HomePage; //storing an instance or object of type of the HomePage class to access its methods and properties

test.beforeEach(async ({ page }) => {
    await page.goto(url); // Navigate to the website before each test.
    homePage = new HomePage(page);// Create a new `HomePage` object using the current page to interact with the page.

});

async function clickGetStarted(page:Page){
    //await page.getByRole('link', { name: 'Get started' }).click();
    await homePage.clickGetStarted(); //using POM
}

//-------------------TESTS-------------------
//group related tests together
test.describe('Playwright website', () => {
    test('has title', async ({ page }) => {
        test('has title', async () => {
            //await page.goto('https://playwright.dev/'); -> THIS IS REMOVED BECAUSE OF THE beforeEach
          
            // Expect a title "to contain" a substring.
            await homePage.assertPageTitle(); //using POM
          });
          
          test('get started link', async ({ page }) => {
            await clickGetStarted(page); 
            await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
          });
          
          
          //written exercise
          test.only('check Java page', async ({ page }) => {
            await clickGetStarted(page);
            await page.getByRole('button', {name: 'Node.js'}).hover();
            await page.getByText('Java', {exact:true}).click();
          
            //assertion
            await expect(page).toHaveURL('https://playwright.dev/java/docs/intro');
            await expect(page.getByText('Installing Playwright', {exact:true})).not.toBeVisible();
            
            const javaDescription = `Playwright is distributed as a set of Maven modules. The easiest way to use it is to add one dependency to your project's pom.xml as described below. If you're not familiar with Maven please refer to its documentation.`;
            await expect(page.getByText(javaDescription)).toBeVisible();
          
          });
        });
    });

