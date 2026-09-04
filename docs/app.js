(() => {
  "use strict";

  const renderer = window.PersonalizationRenderer;
  const i18n = window.BuilderI18n;
  i18n?.applyStatic?.();

  const profileForm = document.querySelector("#profile-form");
  const templateSelect = document.querySelector("#template-select");
  const limitSelect = document.querySelector("#limit-select");
  const status = document.querySelector("#status");
  const statusText = status.querySelector(".status-text");
  const validationSummary = document.querySelector("#validation-summary");
  const jsonEditor = document.querySelector("#json-editor");
  const characterSummary = document.querySelector("#character-summary");
  let profile = null;
  let loadedProfile = null;
  let openSelect = null;

  const outputs = {
    settings: document.querySelector("#settings-output"),
    occupation: document.querySelector("#occupation-output"),
    more_about_you: document.querySelector("#about-output"),
    custom_instructions: document.querySelector("#instructions-output"),
  };

  const fallbackTitle = (value) => String(value).replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const displayLabel = (key) => i18n?.label?.(key) || fallbackTitle(key);
  const tr = (key, vars, fallback) => i18n?.t?.(key, vars, fallback) || fallback || key;
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function setStatus(kind, message) {
    status.className = `status ${kind}`;
    statusText.textContent = message;
  }

  function fieldHelp(path) { return i18n?.help?.(path) || ""; }
  function sectionHelp(path) { return i18n?.section?.(path) || ""; }

  function enhanceSelect(select) {
    if (!select || select.dataset.enhanced === "true") return;
    select.dataset.enhanced = "true";
    select.classList.add("native-select");

    const shell = document.createElement("div");
    shell.className = "smart-select";
    const trigger = document.createElement("div");
    trigger.className = "select-trigger";
    trigger.id = `${select.id}-combobox`;
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    const valueLabel = document.createElement("span");
    valueLabel.className = "select-value";
    const detailLabel = document.createElement("span");
    detailLabel.className = "select-detail";
    const chevron = document.createElement("span");
    chevron.className = "select-chevron";
    chevron.setAttribute("aria-hidden", "true");
    trigger.append(valueLabel, detailLabel, chevron);

    const menu = document.createElement("div");
    menu.className = "select-menu";
    menu.id = `${select.id}-listbox`;
    menu.setAttribute("role", "listbox");
    trigger.setAttribute("aria-controls", menu.id);

    const labelledBy = select.getAttribute("aria-labelledby");
    const fieldLabel = select.closest(".field")?.querySelector("label");
    if (fieldLabel) {
      fieldLabel.id ||= `${select.id}-label`;
      fieldLabel.removeAttribute("for");
      fieldLabel.addEventListener("click", () => trigger.focus());
      trigger.setAttribute("aria-labelledby", fieldLabel.id);
      menu.setAttribute("aria-labelledby", fieldLabel.id);
    } else if (labelledBy) {
      trigger.setAttribute("aria-labelledby", labelledBy);
      menu.setAttribute("aria-labelledby", labelledBy);
    } else {
      trigger.setAttribute("aria-label", select.name || select.id || tr("choose_option", {}, "Choose an option"));
      menu.setAttribute("aria-label", select.name || select.id || tr("options", {}, "Options"));
    }

    const optionItems = [];
    const groupItems = [];
    let optionIndex = 0;

    function appendOption(option) {
      const item = document.createElement("div");
      item.className = "select-option";
      item.id = `${select.id}-option-${optionIndex}`;
      item.setAttribute("role", "option");
      item.dataset.value = option.value;
      item.dataset.index = String(optionIndex);
      const title = document.createElement("span");
      title.className = "select-option-title";
      const detail = document.createElement("span");
      detail.className = "select-option-detail";
      item.append(title, detail);
      item.addEventListener("pointerdown", (event) => event.preventDefault());
      item.addEventListener("click", () => commit(optionItems.indexOf(item)));
      menu.appendChild(item);
      optionItems.push({ item, option, title, detail });
      optionIndex += 1;
    }

    Array.from(select.children).forEach((child) => {
      if (child.tagName === "OPTGROUP") {
        const groupLabel = document.createElement("div");
        groupLabel.className = "select-group-label";
        menu.appendChild(groupLabel);
        groupItems.push({ node: groupLabel, source: child });
        Array.from(child.children).forEach(appendOption);
      } else if (child.tagName === "OPTION") {
        appendOption(child);
      }
    });

    select.parentNode.insertBefore(shell, select);
    shell.append(select, trigger, menu);

    let activeIndex = Math.max(0, Array.from(select.options).findIndex((option) => option.value === select.value));
    let typeBuffer = "";
    let typeTimer = null;

    function selectedOption() {
      return Array.from(select.options).find((option) => option.value === select.value) || select.options[0];
    }

    function refreshCopy() {
      groupItems.forEach(({ node, source }) => { node.textContent = source.label; });
      optionItems.forEach(({ item, option, title, detail }, index) => {
        title.textContent = option.textContent;
        detail.textContent = option.dataset.description || "";
        detail.hidden = !option.dataset.description;
        item.setAttribute("aria-selected", String(index === Array.from(select.options).indexOf(selectedOption())));
      });
    }

    function updateVisualState() {
      refreshCopy();
      const selected = selectedOption();
      if (!selected) return;
      valueLabel.textContent = selected.textContent;
      detailLabel.textContent = selected.dataset.description || "";
      const selectedIndex = Array.from(select.options).indexOf(selected);
      activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
      syncActiveOption();
    }

    function syncActiveOption() {
      optionItems.forEach(({ item }, index) => item.classList.toggle("active", index === activeIndex && shell.classList.contains("open")));
      const active = optionItems[activeIndex]?.item;
      if (shell.classList.contains("open") && active) {
        trigger.setAttribute("aria-activedescendant", active.id);
        active.scrollIntoView({ block: "nearest" });
      } else {
        trigger.removeAttribute("aria-activedescendant");
      }
    }

    function openMenu() {
      if (openSelect && openSelect !== api) openSelect.close();
      const rect = shell.getBoundingClientRect();
      const shouldOpenUp = window.innerHeight - rect.bottom < 280 && rect.top > 300;
      shell.classList.toggle("open-up", shouldOpenUp);
      shell.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      activeIndex = Math.max(0, Array.from(select.options).findIndex((option) => option.value === select.value));
      openSelect = api;
      syncActiveOption();
    }

    function closeMenu() {
      shell.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.removeAttribute("aria-activedescendant");
      shell.classList.remove("open-up");
      if (openSelect === api) openSelect = null;
      optionItems.forEach(({ item }) => item.classList.remove("active"));
    }

    function moveActive(delta) {
      if (!shell.classList.contains("open")) openMenu();
      activeIndex = (activeIndex + delta + optionItems.length) % optionItems.length;
      syncActiveOption();
    }

    function commit(index) {
      const record = optionItems[index];
      if (!record) return;
      select.value = record.option.value;
      updateVisualState();
      select.dispatchEvent(new Event("change", { bubbles: true }));
      closeMenu();
      trigger.focus();
    }

    function typeAhead(key) {
      clearTimeout(typeTimer);
      typeBuffer += key.toLowerCase();
      typeTimer = setTimeout(() => { typeBuffer = ""; }, 450);
      const options = Array.from(select.options);
      const match = options.findIndex((option) => option.textContent.trim().toLowerCase().startsWith(typeBuffer));
      if (match >= 0) {
        if (!shell.classList.contains("open")) openMenu();
        activeIndex = match;
        syncActiveOption();
      }
    }

    trigger.addEventListener("click", () => shell.classList.contains("open") ? closeMenu() : openMenu());
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") { event.preventDefault(); moveActive(1); return; }
      if (event.key === "ArrowUp") { event.preventDefault(); moveActive(-1); return; }
      if (event.key === "Home") { event.preventDefault(); openMenu(); activeIndex = 0; syncActiveOption(); return; }
      if (event.key === "End") { event.preventDefault(); openMenu(); activeIndex = optionItems.length - 1; syncActiveOption(); return; }
      if (event.key === "Escape") { if (shell.classList.contains("open")) { event.preventDefault(); closeMenu(); } return; }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (shell.classList.contains("open")) commit(activeIndex); else openMenu();
        return;
      }
      if (event.key.length === 1 && /\S/.test(event.key)) typeAhead(event.key);
    });

    select.addEventListener("change", updateVisualState);
    updateVisualState();

    const api = {
      close: closeMenu,
      update: updateVisualState,
      contains: (target) => shell.contains(target),
    };
    select._smartSelect = api;
  }

  // One document-level listener is enough for every smart select. Keeping this
  // inside enhanceSelect() leaks a listener (and its detached DOM) after every
  // form rebuild caused by locale changes, resets, preset loads, or JSON apply.
  document.addEventListener("pointerdown", (event) => {
    if (openSelect && !openSelect.contains(event.target)) openSelect.close();
  });

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
    label.textContent = displayLabel(key);
    wrapper.appendChild(label);

    const helpText = fieldHelp(path);
    if (helpText) {
      const help = document.createElement("p");
      help.className = "field-help";
      help.textContent = helpText;
      wrapper.appendChild(help);
    }

    let input;
    let isSelect = false;

    if (typeof value === "boolean") {
      input = document.createElement("select");
      isSelect = true;
      [true, false].forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = String(optionValue);
        option.textContent = optionValue ? tr("option_on", {}, "On") : tr("option_off", {}, "Off");
        if (value === optionValue) option.selected = true;
        input.appendChild(option);
      });
    } else if (Array.isArray(value)) {
      input = document.createElement("textarea");
      input.rows = Math.max(3, Math.min(10, value.length + 1));
      input.value = value.join("\n");
    } else {
      const useTextarea = typeof value === "string" && (value.length > 80 || path.startsWith("instructions.") || path.startsWith("identity."));
      input = document.createElement(useTextarea ? "textarea" : "input");
      if (useTextarea) input.rows = value.length > 220 ? 5 : 3;
      input.value = value == null ? "" : String(value);

      if (path === "product.personality") {
        input = document.createElement("select");
        isSelect = true;
        ["Default", "Professional", "Friendly", "Candid", "Quirky", "Efficient", "Cynical"].forEach((item) => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = i18n?.personality?.(item) || item;
          if (item === value) option.selected = true;
          input.appendChild(option);
        });
      } else if (path.startsWith("product.characteristics.")) {
        input = document.createElement("select");
        isSelect = true;
        ["less", "slightly_less", "neutral", "slightly_more", "more"].forEach((item) => {
          const option = document.createElement("option");
          option.value = item;
          option.textContent = i18n?.relative?.(item) || fallbackTitle(item);
          if (item === value) option.selected = true;
          input.appendChild(option);
        });
      }
    }

    input.id = `field-${path.replaceAll(".", "-")}`;
    label.htmlFor = input.id;
    wrapper.appendChild(input);

    if (isSelect) {
      input.addEventListener("change", () => setAtPath(path, typeof value === "boolean" ? input.value === "true" : input.value));
      enhanceSelect(input);
    } else if (Array.isArray(value)) {
      input.addEventListener("input", () => setAtPath(path, input.value.split("\n").map((item) => item.trim()).filter(Boolean)));
    } else {
      input.addEventListener("input", () => setAtPath(path, input.value));
    }

    return wrapper;
  }

  function buildObject(object, container, prefix = "") {
    Object.entries(object).forEach(([key, value]) => {
      if (key === "$schema") return;
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const section = document.createElement("fieldset");
        section.className = `${prefix ? "nested-section" : "root-section"} section-${key}`;
        const legend = document.createElement("legend");
        legend.textContent = displayLabel(key);
        section.appendChild(legend);
        const noteText = sectionHelp(path);
        if (noteText) {
          const note = document.createElement("p");
          note.className = "section-note";
          note.textContent = noteText;
          section.appendChild(note);
        }
        buildObject(value, section, path);
        container.appendChild(section);
      } else {
        container.appendChild(buildField(key, value, path));
      }
    });
  }

  function renderForm() {
    if (!profile) return;
    profileForm.innerHTML = "";
    buildObject(profile, profileForm);
  }

  function renderValidation(findings) {
    if (!findings.length) {
      validationSummary.className = "validation-summary valid";
      validationSummary.textContent = tr("profile_valid", {}, "Profile structure is valid in the browser renderer.");
      return;
    }
    validationSummary.className = "validation-summary invalid";
    validationSummary.replaceChildren();
    findings.forEach((item) => {
      const row = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = `${item.level.toUpperCase()} ${item.code}`;
      row.append(strong, document.createTextNode(` — ${item.message}`));
      validationSummary.appendChild(row);
    });
  }

  function setOutput(element, text) {
    if (element.textContent === text) return;
    element.textContent = text;
    const card = element.closest(".output-card");
    if (!card) return;
    card.classList.remove("is-updated");
    requestAnimationFrame(() => card.classList.add("is-updated"));
    setTimeout(() => card.classList.remove("is-updated"), 420);
  }

  function sync(updateEditor = true) {
    if (!profile) return;
    const findings = renderer.validateProfile(profile);
    if (updateEditor) jsonEditor.value = JSON.stringify(profile, null, 2);

    try {
      const rendered = renderer.renderProfile(profile);
      const limit = Number(limitSelect.value);
      const instructionLength = rendered.custom_instructions.length;
      if (Number.isFinite(limit) && limit > 0) {
        if (instructionLength > limit) {
          findings.push({ level: "error", code: "FIELD_LIMIT", message: tr("field_limit", { length: instructionLength, limit }, `Custom Instructions are ${instructionLength} characters; selected target is ${limit}.`) });
        } else if (instructionLength > Math.floor(limit * 0.9)) {
          findings.push({ level: "warning", code: "FIELD_NEAR_LIMIT", message: tr("field_near_limit", { length: instructionLength, limit }, `Custom Instructions are ${instructionLength} characters; selected target is ${limit}.`) });
        }
      }
      Object.entries(outputs).forEach(([key, element]) => setOutput(element, rendered[key]));
      characterSummary.textContent = tr("char_summary", { about: rendered.more_about_you.length, instructions: instructionLength, limit }, `About ${rendered.more_about_you.length} · Instructions ${instructionLength}/${limit}`);
      setStatus("ready", tr("ready_sync", {}, "Ready · profile and preview are in sync"));
    } catch (error) {
      Object.values(outputs).forEach((element) => setOutput(element, tr("fix_errors", {}, "Fix validation errors to preview this output.")));
      characterSummary.textContent = "";
      setStatus("error", error.message);
    }
    renderValidation(findings);
  }

  async function loadTemplate(filename) {
    const file = filename.split("/").pop();
    setStatus("loading", tr("loading_file", { file }, `Loading ${file}…`));
    const response = await fetch(`profiles/${filename}`, { cache: "no-store" });
    if (!response.ok) throw new Error(tr("load_failed", { file: filename }, `Could not load ${filename}`));
    profile = await response.json();
    loadedProfile = clone(profile);
    renderForm();
    sync(true);
  }

  enhanceSelect(templateSelect);
  enhanceSelect(limitSelect);

  templateSelect.addEventListener("change", () => loadTemplate(templateSelect.value).catch(showError));
  limitSelect.addEventListener("change", () => sync(false));

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
      button.classList.add("copied");
      button.textContent = tr("copied", {}, "Copied ✓");
      setTimeout(() => {
        button.classList.remove("copied");
        button.textContent = tr("copy", {}, "Copy");
      }, 1100);
    });
  });

  document.addEventListener("builder:localechange", () => {
    templateSelect._smartSelect?.update?.();
    limitSelect._smartSelect?.update?.();
    renderForm();
    sync(false);
  });

  function showError(error) {
    setStatus("error", error.message || String(error));
  }

  loadTemplate(templateSelect.value).catch(showError);
})();
