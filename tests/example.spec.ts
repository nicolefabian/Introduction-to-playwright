import { test, expect } from '@playwright/test'; //test -> test object for the test case, expect -> assertion library

//test('name of the test', async ({ page }) => { ... });
//page -> browser tab where the test runs, the page object allows u to access functions and perform actions on the page
//test is composed of an action and an assertion
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

//defines a test named "get started link"
//this test checks if the "Get started" link is present on the page and clicks it
//then it checks if the page has a heading with the name "Installation"
//page object represents a browser page
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  //getByRole -> finds an element by its role attribute and accesible name
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


//1. Click the "Get started" link
//2. Mouse hover the language dropdown
//3. Click the Java link
//4. Check if the URL is correct
//5. Check the text "Installing Playwright" is not being displayed
//6. Check the text below is displayed

//written exercise
test.only('check Java page', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', {name: 'Get started'}).click();
  await page.getByRole('button', {name: 'Node.js'}).hover();
  await page.getByText('Java', {exact:true}).click();

  //assertion
  await expect(page).toHaveURL('https://playwright.dev/java/docs/intro');
  await expect(page.getByText('Installing Playwright', {exact:true})).not.toBeVisible();
  
  const javaDescription = `Playwright is distributed as a set of Maven modules. The easiest way to use it is to add one dependency to your project's pom.xml as described below. If you're not familiar with Maven please refer to its documentation.`;
  await expect(page.getByText(javaDescription)).toBeVisible();

});