const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  // Fetch text from shadow DOM
  const shadowHostSelector = "#first-label"; // Corrected typo if it was one
  const targetWithinShadowDOM = "#my-cool-text";
  try {
    const labelTextsFromShadowDOM = await fetchTextFromShadowDOM(
      page,
      shadowHostSelector,
      targetWithinShadowDOM
    );
    console.log(labelTextsFromShadowDOM);
  } catch (error) {
    console.error("Error fetching text from shadow DOM:", error);
  }

  // Traverse through nested shadow DOMs
  const nestedPath = ["#nested-component", "simple-label", "#my-cool-text"];
  try {
    const labelTextsFromNestedShadowDOM = await fetchTextFromNestedShadowDOM(
      page,
      nestedPath
    );
    console.log(labelTextsFromNestedShadowDOM);
  } catch (error) {
    console.error("Error fetching text from nested shadow DOM:", error);
  }

  // Fetch text from shadow DOM using pierce
  const pierceSelector = "pierce/#my-cool-text";
  try {
    const labelTexts = await pierceLabelElements(page, pierceSelector);
    console.log(labelTexts);
  } catch (error) {
    console.error("Error fetching text with pierce:", error);
  }

  await browser.close();
})();

async function pierceLabelElements(page, selector) {
  try {
    await page.waitForSelector(selector, { timeout: 3000 });
    const labelTexts = await page.$$eval(selector, (elements) =>
      elements.map((el) => el.textContent)
    );
    return labelTexts;
  } catch (error) {
    throw new Error(`Failed to pierce label elements: ${error.message}`);
  }
}

async function fetchTextFromShadowDOM(
  page,
  shadowHostSelector,
  targetSelector
) {
  try {
    return await page.evaluate(
      (shadowHostSelector, targetSelector) => {
        const shadowHost = document.querySelector(shadowHostSelector);
        if (!shadowHost) throw new Error("Shadow host not found");
        const targetElement =
          shadowHost.shadowRoot.querySelector(targetSelector);
        if (!targetElement) throw new Error("Target element not found");
        return targetElement.textContent;
      },
      shadowHostSelector,
      targetSelector
    );
  } catch (error) {
    throw new Error(`Failed to fetch text from shadow DOM: ${error.message}`);
  }
}

async function fetchTextFromNestedShadowDOM(page, selectors) {
  try {
    return await page.evaluate((selectors) => {
      let currentElement = document.querySelector(selectors[0]);
      if (!currentElement) throw new Error("Outermost component not found");
      for (let i = 1; i < selectors.length; i++) {
        if (!currentElement.shadowRoot)
          throw new Error(`Shadow root not found for ${selectors[i]}`);
        currentElement = currentElement.shadowRoot.querySelector(selectors[i]);
        if (!currentElement)
          throw new Error(`Element not found for ${selectors[i]}`);
      }
      return currentElement.textContent || "Label has no text content";
    }, selectors);
  } catch (error) {
    throw new Error(
      `Failed to fetch text from nested shadow DOM: ${error.message}`
    );
  }
}
