(() => {
  "use strict";

  const renderer = window.PersonalizationRenderer;
  const profileForm = document.querySelector("#profile-form");
  const templateSelect = document.querySelector("#template-select");
  const status = document.querySelector("#status");
  const validationSummary = document.querySelector("#validation-summary");
  const jsonEditor = document.querySelector("#json-editor");
  const characterSummary = document.querySelector("#character-summary");
  let profile = null;
  let loadedProfile = null;

  const outputs = {
    settings: document.querySelector("#settings-output"),
    occupation: document.querySelector("#occupation-output"),
    more_about_you: document.querySelector("#about-output"),
    custom_instructions: document.querySelector("#instructions-output"),
  };

  const titleCase = (value) => value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function fieldHelp(path) {
    const help = {
      "product.personality": "Base style and tone. Keep global response behavior in instructions rather than duplicating it here.",
      "product.characteristics.headers_and_lists": "Lower this when you prefer paragraph-first answers. Lists should still be allowed when naturally useful.",
      "instructions.explanation.principle": "Main rule for how unfamiliar concepts should become understandable.",
      "instructions.explanation.sequence": "One step per line. This is dependency order, not a rigid output template.",
      "instructions.explanation.depth": "State what must not be lost when language becomes simpler.",
      "instructions.structure.headings": "Describe when headings help. Avoid rules triggered only by answer length.",
    };
    return help[path] || "";
  }

  function setAtPath(path, value) {
    const parts = path.split(".");
    let cursor = profile;
    for (let index = 0; index < parts.length - 1; index += 1) cursor = cursor[parts[index]];
    cursor[parts[parts.length - 1]] = value;
    sync(false);
  }

  function buildField(key, value, path) {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = titleCase(key);
    wrapper.appendChild(label);

    const helpText = fieldHelp(path);
    if (helpText) {
      const help = document.createElement("p");
      help.className = "field-help";
      help.textContent = helpText;
      wrapper.appendChild(help);
    }

    let input;
    if (typeof value === "boolean") {
      input = document.createElement("select");
      [true, false].forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = String(optionValue);
        option.textContent = optionValue ? "On" : "Off";
        if (value === optionValue) option.selected = true;
        input.appendChild(option);
      });
      input.addEventListener("change", () => setAtPath(path, input.value === "true"));
    } else if (Array.isArray(value)) {
      input = document.createElement("textarea");
      input.rows = Math.max(3, Math.min(10, value.length + 1));
      input.value = value.join("\n");
      input.addEventListener("input", () => setAtPath(path, input.value.split("\n").map((item) => item.trim()).filter(Boolean)));
    } else {
      const useTextarea = typeof value === "string" && (value.length > 80 || path.startsWith("instructions.") || path.startsWith("identity."));
      input = document.createElement(useTextarea ? "textarea" : "input");
      if (useTextarea) input.rows = value.length > 220 ? 5 : 3;
      input.value = value == null ? "" : String(value);

      if (path === "product.personality") {
        input = document.createElement("select");
        ["Default", "Professional", "Friendly", "Candid", "Quirky", "Efficient", "Cynical"].forEach((item) => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = item;
          if (item === value) option.selected = true;
          input.appendChild(option);
        });
      } else if (path.startsWith("product.characteristics.")) {
        input = document.createElement("select");
        ["less", "slightly_less", "neutral", "slightly_more", "more"].forEach((item) => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = titleCase(item);
          if (item === value) option.selected = true;
          input.appendChild(option);
        });
      }
      input.addEventListener("input", () => setAtPath(path, input.value));
    }

    input.id = `field-${path.replaceAll(".", "-")}`;
    label.htmlFor = input.id;
    wrapper.appendChild(input);
    return wrapper;
  }

  function buildObject(object, container, prefix = "") {
    Object.entries(object).forEach(([key, value]) => {
      if (key === "$schema") return;
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const section = document.createElement("fieldset");
        section.className = prefix ? "nested-section" : "root-section";
        const legend = document.createElement("legend");
        legend.textContent = titleCase(key);
        section.appendChild(legend);
        buildObject(value, section, path);
        container.appendChild(section);
      } else {
        container.appendChild(buildField(key, value, path));
      }
    });
  }

  function renderForm() {
    profileForm.innerHTML = "";
    buildObject(profile, profileForm);
  }

  function renderValidation(findings) {
    if (!findings.length) {
      validationSummary.className = "validation-summary valid";
      validationSummary.textContent = "Profile shape looks valid in the browser renderer.";
      return;
    }
    validationSummary.className = "validation-summary invalid";
    validationSummary.innerHTML = findings.map((item) => `<div><strong>${item.level.toUpperCase()} ${item.code}</strong> — ${item.message}</div>`).join("");
  }

  function sync(updateEditor = true) {
    const findings = renderer.validateProfile(profile);
    renderValidation(findings);
    if (updateEditor) jsonEditor.value = JSON.stringify(profile, null, 2);

    try {
      const rendered = renderer.renderProfile(profile);
      Object.entries(outputs).forEach(([key, element]) => { element.textContent = rendered[key]; });
      characterSummary.textContent = `About ${rendered.more_about_you.length} · Instructions ${rendered.custom_instructions.length} chars`;
      status.textContent = "Ready";
      status.className = "status ready";
    } catch (error) {
      Object.values(outputs).forEach((element) => { element.textContent = "Fix validation errors to preview this output."; });
      characterSummary.textContent = "";
      status.textContent = error.message;
      status.className = "status error";
    }
  }

  async function loadTemplate(filename) {
    status.textContent = `Loading ${filename}…`;
    status.className = "status";
    const response = await fetch(`https://raw.githubusercontent.com/man612/chatgpt-personalization/main/profiles/${filename}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${filename}`);
    profile = await response.json();
    loadedProfile = clone(profile);
    renderForm();
    sync(true);
  }

  templateSelect.addEventListener("change", () => loadTemplate(templateSelect.value).catch(showError));
  document.querySelector("#reset-button").addEventListener("click", () => {
    if (!loadedProfile) return;
    profile = clone(loadedProfile);
    renderForm();
    sync(true);
  });
  document.querySelector("#validate-button").addEventListener("click", () => sync(true));
  document.querySelector("#format-json-button").addEventListener("click", () => {
    try { jsonEditor.value = JSON.stringify(JSON.parse(jsonEditor.value), null, 2); } catch (error) { showError(error); }
  });
  document.querySelector("#apply-json-button").addEventListener("click", () => {
    try {
      profile = JSON.parse(jsonEditor.value);
      renderForm();
      sync(true);
    } catch (error) { showError(error); }
  });
  document.querySelector("#download-button").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(profile, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${String(profile.name || "profile").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profile"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(`#${button.dataset.copy}`);
      await navigator.clipboard.writeText(target.textContent);
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => { button.textContent = original; }, 1000);
    });
  });

  function showError(error) {
    status.textContent = error.message || String(error);
    status.className = "status error";
  }

  loadTemplate(templateSelect.value).catch(showError);
})();
