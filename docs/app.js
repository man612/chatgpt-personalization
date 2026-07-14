"use strict";

const RAW_ROOT = "https://raw.githubusercontent.com/man612/chatgpt-personalization/main";
const PROFILE_ROOT = `${RAW_ROOT}/profiles`;
const SCHEMA_URL = `${RAW_ROOT}/spec/profile.schema.json`;

const elements = {
  templateSelect: document.querySelector("#template-select"),
  resetButton: document.querySelector("#reset-button"),
  downloadButton: document.querySelector("#download-button"),
  validateButton: document.querySelector("#validate-button"),
  form: document.querySelector("#profile-form"),
  status: document.querySelector("#status"),
  validation: document.querySelector("#validation-summary"),
  jsonEditor: document.querySelector("#json-editor"),
  formatJsonButton: document.querySelector("#format-json-button"),
  applyJsonButton: document.querySelector("#apply-json-button"),
  occupationOutput: document.querySelector("#occupation-output"),
  aboutOutput: document.querySelector("#about-output"),
  responseOutput: document.querySelector("#response-output"),
  characterSummary: document.querySelector("#character-summary"),
};

const state = {
  profile: null,
  originalProfile: null,
  schema: null,
  templateName: "tech-generalist.json",
};

const fallbackProfile = {
  "$schema": "../spec/profile.schema.json",
  "schema_version": "1.0",
  "name": "Blank profile",
  "description": "A minimal starting point.",
  "occupation": "",
  "about": {
    "background": [],
    "experience": "",
    "recurring_uses": [],
    "stable_preferences": []
  },
  "response": {
    "language": "",
    "tone": [],
    "audience": "",
    "structure": {
      "long_answers": "",
      "body": "",
      "lists": "",
      "tables": ""
    },
    "technical": [],
    "research": [],
    "avoid": []
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function humanize(key) {
  return String(key)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function fieldId(path) {
  return `field-${path.join("-").replace(/[^a-zA-Z0-9-_]/g, "-")}`;
}

function setAtPath(object, path, value) {
  let target = object;
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index];
    if (!target[key] || typeof target[key] !== "object") target[key] = {};
    target = target[key];
  }
  target[path[path.length - 1]] = value;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.json();
}

function setStatus(message, type = "ready") {
  elements.status.textContent = message;
  elements.status.className = `status ${type}`;
}

async function loadTemplate(name) {
  setStatus("Loading profile and schema…", "loading");
  state.templateName = name;

  try {
    const [profileResult, schemaResult] = await Promise.allSettled([
      fetchJson(`${PROFILE_ROOT}/${name}`),
      state.schema ? Promise.resolve(state.schema) : fetchJson(SCHEMA_URL),
    ]);

    if (profileResult.status === "fulfilled") {
      state.profile = profileResult.value;
    } else if (name === "blank.json") {
      state.profile = clone(fallbackProfile);
    } else {
      throw profileResult.reason;
    }

    if (schemaResult.status === "fulfilled") state.schema = schemaResult.value;

    state.originalProfile = clone(state.profile);
    renderAll();

    const schemaNote = state.schema
      ? "Profile and schema loaded from the repository."
      : "Profile loaded. Schema fetch failed, so only fallback checks are active.";
    setStatus(schemaNote, state.schema ? "ready" : "error");
  } catch (error) {
    state.profile = clone(fallbackProfile);
    state.originalProfile = clone(state.profile);
    renderAll();
    setStatus(`Could not load the selected template. A blank local profile is open instead. ${error.message}`, "error");
  }
}

function resolveSchema(node) {
  if (!node || !node.$ref || !state.schema) return node;
  if (!node.$ref.startsWith("#/")) return node;
  return node.$ref
    .slice(2)
    .split("/")
    .reduce((value, segment) => value?.[segment.replace(/~1/g, "/").replace(/~0/g, "~")], state.schema) || node;
}

function schemaForPath(path) {
  if (!state.schema) return null;
  let node = state.schema;
  for (const key of path) {
    node = resolveSchema(node);
    if (!node?.properties?.[key]) return null;
    node = node.properties[key];
  }
  return resolveSchema(node);
}

function createField(key, value, path) {
  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const id = fieldId(path);
  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = humanize(key);
  wrapper.append(label);

  const fieldSchema = schemaForPath(path);
  let input;

  if (Array.isArray(value)) {
    input = document.createElement("textarea");
    input.className = "array-input";
    input.value = value.join("\n");
    input.dataset.valueType = "array";
    input.placeholder = "One item per line";
  } else if (typeof value === "boolean") {
    input = document.createElement("select");
    input.dataset.valueType = "boolean";
    for (const optionValue of [true, false]) {
      const option = document.createElement("option");
      option.value = String(optionValue);
      option.textContent = String(optionValue);
      option.selected = value === optionValue;
      input.append(option);
    }
  } else if (typeof value === "number") {
    input = document.createElement("input");
    input.type = "number";
    input.value = String(value);
    input.dataset.valueType = "number";
  } else {
    const useTextarea = key === "occupation" || key === "description" || String(value ?? "").length > 80;
    input = document.createElement(useTextarea ? "textarea" : "input");
    if (!useTextarea) input.type = "text";
    input.value = value ?? "";
    input.dataset.valueType = "string";
  }

  input.id = id;
  input.dataset.path = JSON.stringify(path);
  if (fieldSchema?.maxLength) input.maxLength = fieldSchema.maxLength;
  if (fieldSchema?.description) input.setAttribute("aria-describedby", `${id}-help`);
  input.addEventListener("input", onFieldInput);
  input.addEventListener("change", onFieldInput);
  wrapper.append(input);

  if (fieldSchema?.description || fieldSchema?.maxLength) {
    const help = document.createElement("p");
    help.className = "field-help";
    help.id = `${id}-help`;
    const parts = [];
    if (fieldSchema.description) parts.push(fieldSchema.description);
    if (fieldSchema.maxLength) parts.push(`Maximum ${fieldSchema.maxLength} characters.`);
    help.textContent = parts.join(" ");
    wrapper.append(help);
  }

  return wrapper;
}

function createObjectFields(object, path = []) {
  const fragment = document.createDocumentFragment();

  for (const [key, value] of Object.entries(object)) {
    const currentPath = [...path, key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "fieldset";
      const legend = document.createElement("legend");
      legend.textContent = humanize(key);
      fieldset.append(legend, createObjectFields(value, currentPath));
      fragment.append(fieldset);
    } else {
      fragment.append(createField(key, value, currentPath));
    }
  }

  return fragment;
}

function onFieldInput(event) {
  const path = JSON.parse(event.currentTarget.dataset.path);
  const type = event.currentTarget.dataset.valueType;
  let value = event.currentTarget.value;

  if (type === "array") {
    value = value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  } else if (type === "boolean") {
    value = value === "true";
  } else if (type === "number") {
    value = Number(value);
  }

  setAtPath(state.profile, path, value);
  syncOutputs();
}

function renderForm() {
  elements.form.replaceChildren(createObjectFields(state.profile));
}

function syncOutputs() {
  const rendered = ProfileRenderer.renderProfile(state.profile);
  elements.occupationOutput.textContent = rendered.occupation;
  elements.aboutOutput.textContent = rendered.more_about_you;
  elements.responseOutput.textContent = rendered.response_preferences;
  elements.jsonEditor.value = JSON.stringify(state.profile, null, 2);
  elements.characterSummary.textContent = [
    rendered.occupation.length,
    rendered.more_about_you.length,
    rendered.response_preferences.length,
  ].join(" · ") + " chars";
  showValidation(validateProfile(state.profile, rendered));
}

function renderAll() {
  renderForm();
  syncOutputs();
}

function valueMatchesType(value, type) {
  if (Array.isArray(type)) return type.some((candidate) => valueMatchesType(value, candidate));
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "array") return Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  if (type === "null") return value === null;
  return typeof value === type;
}

function validateNode(value, rawNode, path, findings) {
  const node = resolveSchema(rawNode) || {};
  const location = path || "profile";
  const addError = (message) => findings.push({ level: "error", code: "SCHEMA", message });

  if (node.type && !valueMatchesType(value, node.type)) {
    const expected = Array.isArray(node.type) ? node.type.join(" or ") : node.type;
    addError(`${location} must be ${expected}.`);
    return;
  }

  if (node.const !== undefined && value !== node.const) addError(`${location} must equal ${JSON.stringify(node.const)}.`);
  if (node.enum && !node.enum.includes(value)) addError(`${location} must be one of: ${node.enum.join(", ")}.`);

  if (typeof value === "string") {
    if (node.minLength !== undefined && value.length < node.minLength) addError(`${location} must contain at least ${node.minLength} characters.`);
    if (node.maxLength !== undefined && value.length > node.maxLength) addError(`${location} exceeds the ${node.maxLength}-character limit.`);
    if (node.pattern && !new RegExp(node.pattern).test(value)) addError(`${location} does not match the required pattern.`);
  }

  if (Array.isArray(value)) {
    if (node.minItems !== undefined && value.length < node.minItems) addError(`${location} must contain at least ${node.minItems} items.`);
    if (node.maxItems !== undefined && value.length > node.maxItems) addError(`${location} must contain no more than ${node.maxItems} items.`);
    if (node.uniqueItems) {
      const encoded = value.map((item) => JSON.stringify(item));
      if (new Set(encoded).size !== encoded.length) addError(`${location} contains duplicate items.`);
    }
    if (node.items) value.forEach((item, index) => validateNode(item, node.items, `${location}[${index}]`, findings));
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const requiredKey of node.required || []) {
      if (!(requiredKey in value)) addError(`${location}.${requiredKey} is required.`);
    }

    if (node.additionalProperties === false && node.properties) {
      for (const key of Object.keys(value)) {
        if (!(key in node.properties)) addError(`${location}.${key} is not supported.`);
      }
    }

    for (const [key, childValue] of Object.entries(value)) {
      if (node.properties?.[key]) validateNode(childValue, node.properties[key], `${location}.${key}`, findings);
    }
  }

  for (const candidate of node.allOf || []) validateNode(value, candidate, location, findings);

  if (node.anyOf) {
    const candidateResults = node.anyOf.map((candidate) => {
      const local = [];
      validateNode(value, candidate, location, local);
      return local;
    });
    if (candidateResults.every((candidate) => candidate.length)) addError(`${location} does not match any permitted shape.`);
  }

  if (node.oneOf) {
    const passing = node.oneOf.filter((candidate) => {
      const local = [];
      validateNode(value, candidate, location, local);
      return local.length === 0;
    });
    if (passing.length !== 1) addError(`${location} must match exactly one permitted shape.`);
  }
}

function fallbackValidation(profile) {
  const findings = [];
  const addError = (message) => findings.push({ level: "error", code: "STRUCTURE", message });
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) return [{ level: "error", code: "STRUCTURE", message: "Profile must be a JSON object." }];
  for (const key of ["schema_version", "name", "occupation", "about", "response"]) {
    if (!(key in profile)) addError(`profile.${key} is required.`);
  }
  if (typeof profile.occupation !== "string") addError("profile.occupation must be a string.");
  if (!profile.about || typeof profile.about !== "object" || Array.isArray(profile.about)) addError("profile.about must be an object.");
  if (!profile.response || typeof profile.response !== "object" || Array.isArray(profile.response)) addError("profile.response must be an object.");
  return findings;
}

function validateProfile(profile, rendered = ProfileRenderer.renderProfile(profile)) {
  const findings = [];
  if (state.schema) validateNode(profile, state.schema, "profile", findings);
  else findings.push(...fallbackValidation(profile));

  if (!findings.some((item) => item.level === "error")) {
    findings.push(...ProfileRenderer.renderedFieldFindings(rendered));
  }

  const seen = new Set();
  return findings.filter((finding) => {
    const key = `${finding.level}:${finding.code}:${finding.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function showValidation(findings) {
  elements.validation.replaceChildren();
  const errors = findings.filter((item) => item.level === "error");
  const warnings = findings.filter((item) => item.level === "warning");
  elements.validation.className = `validation-summary visible ${errors.length ? "invalid" : "valid"}`;

  const strong = document.createElement("strong");
  if (errors.length) strong.textContent = `${errors.length} validation error${errors.length === 1 ? "" : "s"}`;
  else if (warnings.length) strong.textContent = `Structurally valid with ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`;
  else strong.textContent = "Profile passes structural validation";
  elements.validation.append(strong);

  if (findings.length) {
    const list = document.createElement("ul");
    for (const finding of findings.slice(0, 12)) {
      const item = document.createElement("li");
      item.textContent = `${finding.level === "warning" ? "Warning" : "Error"}: ${finding.message}`;
      list.append(item);
    }
    if (findings.length > 12) {
      const item = document.createElement("li");
      item.textContent = `${findings.length - 12} more findings are not shown.`;
      list.append(item);
    }
    elements.validation.append(list);
  }
}

async function copyOutput(button) {
  const target = document.getElementById(button.dataset.copy);
  const text = target.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.append(temporary);
    temporary.select();
    document.execCommand("copy");
    temporary.remove();
  }

  const original = button.textContent;
  button.textContent = "Copied";
  window.setTimeout(() => { button.textContent = original; }, 1200);
}

function downloadProfile() {
  const safeName = String(state.profile?.name || state.templateName.replace(/\.json$/, "profile"))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "profile";
  const blob = new Blob([`${JSON.stringify(state.profile, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeName}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function applyJson() {
  try {
    const parsed = JSON.parse(elements.jsonEditor.value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("The root value must be an object.");
    state.profile = parsed;
    renderAll();
    setStatus("JSON applied to the form and preview.", "ready");
  } catch (error) {
    setStatus(`JSON could not be applied: ${error.message}`, "error");
  }
}

elements.templateSelect.addEventListener("change", (event) => loadTemplate(event.target.value));
elements.resetButton.addEventListener("click", () => {
  state.profile = clone(state.originalProfile || fallbackProfile);
  renderAll();
  setStatus("Profile reset to the selected template.", "ready");
});
elements.downloadButton.addEventListener("click", downloadProfile);
elements.validateButton.addEventListener("click", () => {
  const findings = validateProfile(state.profile);
  showValidation(findings);
  const hasErrors = findings.some((item) => item.level === "error");
  setStatus(hasErrors ? "Validation completed with errors." : "Validation completed without structural errors.", hasErrors ? "error" : "ready");
});
elements.formatJsonButton.addEventListener("click", () => {
  try {
    elements.jsonEditor.value = JSON.stringify(JSON.parse(elements.jsonEditor.value), null, 2);
    setStatus("JSON formatted.", "ready");
  } catch (error) {
    setStatus(`JSON could not be formatted: ${error.message}`, "error");
  }
});
elements.applyJsonButton.addEventListener("click", applyJson);
document.querySelectorAll(".copy-button").forEach((button) => button.addEventListener("click", () => copyOutput(button)));

loadTemplate(state.templateName);
