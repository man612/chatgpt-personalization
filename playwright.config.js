"use strict";

const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
  },
  webServer: {
    command: "python -m http.server 4173 -d docs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
});
