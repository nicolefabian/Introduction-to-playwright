import {test, expect} from '@playwright/test';

//AAA Pattern
//Arrange
//Act
//Assert

//represents as the arrange step
const password = process.env.PASSWORD;

//The beforeAll method, which is present in the test object, is the method that will be executed by default before all the tests within a file.
test.beforeAll(async ({ playwright }) => {
    test.skip(//skip the test if the environment is production, could also start a server, create a db connection, reuse a sign in state
      !!process.env.PROD,
      'Test intentionally skipped in production due to data dependency.'
    );
    // start a server
    // create a db connection
    // reuse a sign in state
});

//The beforeEach method, which is present in the test object, is the method that will be executed by default before each test within a file.
test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    // open a URL
    // clean up the DB
    // create a page object
    // dismiss a modal
    // load params
});


test.afterAll(async ({ page }, testInfo) => {
    console.log('Test file completed.');
    // close a DB connection
});

test.afterEach( async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus)
        console.log(`Did not run as expected, ended up at ${page.url()}`);
    // clean up all the data we created for this test through API calls
});

test.describe.skip('Test Case', () => {
    test('Test Scenario One', async ({ page }) => {
        await test.step('Step One', async () => {
            // ...
        });

        await test.step('Step Two', async () => {
            // ...
        });

        // ...
    });
});