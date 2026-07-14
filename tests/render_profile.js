"use strict";

const fs = require("node:fs");
const path = require("node:path");
const renderer = require(path.join(__dirname, "..", "docs", "renderer.js"));

const input = fs.readFileSync(0, "utf8");
const profile = JSON.parse(input);
process.stdout.write(`${JSON.stringify(renderer.renderProfile(profile))}\n`);
