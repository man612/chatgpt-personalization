"use strict";

const { test, expect } = require("@playwright/test");

async function openBuilder(page) {
  await page.goto("/");
  await expect(page.locator("#profile-form > .root-section")).toHaveCount(3, { timeout: 10000 });
  await expect(page.locator("#status .status-text")).toContainText(/Ready|Siap/, { timeout: 10000 });
}

test("desktop builder preserves state, localizes dynamic UI, and rejects invalid JSON", async ({ page }) => {
  const presetRequests = [];
  page.on("request", (request) => {
    if (request.url().includes("/profiles/presets/")) presetRequests.push(request.url());
  });

  await openBuilder(page);
  expect(presetRequests.some((url) => url.startsWith("http://127.0.0.1:4173/profiles/presets/"))).toBeTruthy();
  await page.locator("#field-identity-occupation").fill("QA tester");
  await page.locator('[data-locale="id"]').click();
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.locator("#field-identity-occupation")).toHaveValue("QA tester");
  await expect(page.locator('[data-i18n="target_settings"]')).toHaveText("Terapkan manual");
  await expect(page.locator('[data-i18n="recommended_order_label"]')).toHaveText("Urutan yang disarankan:");

  const presetTrigger = page.locator("#template-select-combobox");
  await presetTrigger.scrollIntoViewIfNeeded();
  const triggerBox = await presetTrigger.boundingBox();
  await page.mouse.click(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2);
  const blankOption = page.locator('.smart-select.open .select-option[data-value="presets/blank.json"]');
  const optionBox = await blankOption.boundingBox();
  await page.mouse.click(optionBox.x + 12, optionBox.y + optionBox.height / 2);
  await expect(page.locator("#template-select")).toHaveValue("presets/blank.json");
  const jsonEditor = page.locator("#json-editor");
  await page.locator(".json-details > summary").click();
  await expect(jsonEditor).toBeVisible();
  const profile = JSON.parse(await jsonEditor.inputValue());
  profile.unexpected = "<img src=x onerror=alert(1)>";
  await jsonEditor.fill(JSON.stringify(profile, null, 2));
  await page.locator("#apply-json-button").click();
  await expect(page.locator("#validation-summary")).toContainText("UNKNOWN_FIELD");
  await expect(page.locator("#validation-summary")).toContainText("unexpected");
  await expect(page.locator("#validation-summary img")).toHaveCount(0);
});

test("mobile flow remains navigable after locale changes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openBuilder(page);
  await page.locator('[data-locale="id"]').click();
  await expect(page.locator(".mobile-flow-nav")).toBeVisible();
  await page.locator('.mobile-step-tab[data-step-index="1"]').click();
  await expect(page.locator("body")).toHaveAttribute("data-mobile-step", "product");
  await page.locator('.mobile-step-tab[data-step-index="2"]').click();
  await expect(page.locator("body")).toHaveAttribute("data-mobile-step", "identity");
  await page.locator("#field-identity-occupation").fill("Penguji");
  await page.locator('[data-locale="en"]').click();
  await expect(page.locator("#field-identity-occupation")).toHaveValue("Penguji");
  await page.locator('[data-locale="id"]').click();
  await expect(page.locator("#field-identity-occupation")).toHaveValue("Penguji");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});
