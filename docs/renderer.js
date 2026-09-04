(function (root) {
  "use strict";

  const SCHEMA_VERSION = "2.0";
  const PERSONALITIES = new Set(["Default", "Professional", "Friendly", "Candid", "Quirky", "Efficient", "Cynical"]);
  const RELATIVE = new Set(["less", "slightly_less", "neutral", "slightly_more", "more"]);

  function nonemptyStrings(values) {
    return Array.isArray(values) ? values.filter((value) => typeof value === "string" && value.trim()).map((value) => value.trim()) : [];
  }

  function sentence(value) {
    if (typeof value !== "string") return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  }

  function sentences(values) {
    return nonemptyStrings(values).map(sentence).join(" ");
  }

  function serialList(values) {
    const cleaned = nonemptyStrings(values);
    if (!cleaned.length) return "";
    if (cleaned.length === 1) return cleaned[0];
    if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;
    return `${cleaned.slice(0, -1).join(", ")}, and ${cleaned[cleaned.length - 1]}`;
  }

  function toneText(values) {
    const cleaned = nonemptyStrings(values);
    return cleaned.length ? `Use a ${serialList(cleaned)} tone.` : "";
  }

  function displayRelative(value) {
    return typeof value === "string" ? value.replaceAll("_", " ") : "";
  }

  function onOff(value) {
    return value ? "on" : "off";
  }

  function renderProfile(profile) {
    const errors = validateProfile(profile).filter((finding) => finding.level === "error");
    if (errors.length) throw new Error(errors[0].message);

    const product = profile.product;
    const characteristics = product.characteristics;
    const memory = product.memory;
    const settings = [
      `Base personality: ${product.personality}`,
      "Characteristics:",
      `- Warm: ${displayRelative(characteristics.warm)}`,
      `- Enthusiastic: ${displayRelative(characteristics.enthusiastic)}`,
      `- Headers & Lists: ${displayRelative(characteristics.headers_and_lists)}`,
      `- Emojis: ${displayRelative(characteristics.emojis)}`,
      "Memory:",
      `- Saved memories: ${onOff(memory.saved_memories)}`,
      `- Reference chat history: ${onOff(memory.reference_chat_history)}`,
    ].join("\n");

    const identity = profile.identity;
    const about = [];
    const background = sentences(identity.background);
    if (background) about.push(background);
    const experience = sentence(identity.experience);
    if (experience) about.push(experience);
    const uses = serialList(identity.recurring_uses);
    if (uses) about.push(`Common uses include ${uses}.`);
    const preferences = sentences(identity.stable_preferences);
    if (preferences) about.push(preferences);

    const instructions = profile.instructions;
    const explanation = instructions.explanation;
    const structure = instructions.structure;
    const paragraphs = [];

    const opening = [];
    if (instructions.language && instructions.language.trim()) opening.push(sentence(instructions.language));
    const tone = toneText(instructions.tone);
    if (tone) opening.push(tone);
    if (instructions.audience && instructions.audience.trim()) opening.push(sentence(`Write for ${instructions.audience}`));
    if (opening.length) paragraphs.push(opening.join(" "));

    const explanationParts = [];
    if (explanation.principle && explanation.principle.trim()) explanationParts.push(sentence(explanation.principle));
    const sequence = serialList(explanation.sequence);
    if (sequence) explanationParts.push(sentence(`For unfamiliar topics, follow this order when useful: ${sequence}`));
    if (explanation.terminology && explanation.terminology.trim()) explanationParts.push(sentence(explanation.terminology));
    if (explanation.depth && explanation.depth.trim()) explanationParts.push(sentence(explanation.depth));
    if (explanationParts.length) paragraphs.push(explanationParts.join(" "));

    const structureText = sentences([structure.default, structure.headings, structure.lists, structure.tables]);
    if (structureText) paragraphs.push(structureText);

    ["technical", "research", "ui_ux", "writing"].forEach((key) => {
      const text = sentences(instructions[key]);
      if (text) paragraphs.push(text);
    });

    const avoid = serialList(instructions.avoid);
    if (avoid) paragraphs.push(sentence(`Avoid ${avoid}`));

    return {
      settings,
      occupation: identity.occupation.trim(),
      more_about_you: about.join("\n\n"),
      custom_instructions: paragraphs.join("\n\n"),
    };
  }

  const TOP_LEVEL_FIELDS = new Set(["$schema", "schema_version", "name", "description", "product", "identity", "instructions"]);
  const REQUIRED_TOP_LEVEL = new Set(["schema_version", "name", "product", "identity", "instructions"]);
  const PRODUCT_FIELDS = new Set(["personality", "characteristics", "memory"]);
  const CHARACTERISTIC_FIELDS = new Set(["warm", "enthusiastic", "headers_and_lists", "emojis"]);
  const MEMORY_FIELDS = new Set(["saved_memories", "reference_chat_history"]);
  const IDENTITY_FIELDS = new Set(["occupation", "background", "experience", "recurring_uses", "stable_preferences"]);
  const INSTRUCTION_FIELDS = new Set(["language", "tone", "audience", "explanation", "structure", "technical", "research", "ui_ux", "writing", "avoid"]);
  const EXPLANATION_FIELDS = new Set(["principle", "sequence", "terminology", "depth"]);
  const STRUCTURE_FIELDS = new Set(["default", "headings", "lists", "tables"]);

  function validateProfile(profile) {
    const findings = [];
    const error = (code, message) => findings.push({ level: "error", code, message });

    const unknownFields = (value, allowed, location) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return;
      Object.keys(value).filter((key) => !allowed.has(key)).sort().forEach((key) => {
        error("UNKNOWN_FIELD", `${location} contains unsupported field: ${key}`);
      });
    };

    const missingFields = (value, required, location) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return;
      const missing = [...required].filter((key) => !(key in value)).sort();
      if (missing.length) error("MISSING_FIELD", `${location} is missing: ${missing.join(", ")}`);
    };

    const requireObject = (value, location) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        error("TYPE", `${location} must be an object`);
        return null;
      }
      return value;
    };

    const requireString = (value, location, minimum = null, maximum = null) => {
      if (typeof value !== "string") {
        error("TYPE", `${location} must be a string`);
        return null;
      }
      if (minimum !== null && value.length < minimum) error("MIN_LENGTH", `${location} must contain at least ${minimum} character(s)`);
      if (maximum !== null && value.length > maximum) error("MAX_LENGTH", `${location} exceeds ${maximum} characters`);
      return value;
    };

    const requireBool = (value, location) => {
      if (typeof value !== "boolean") error("TYPE", `${location} must be a boolean`);
    };

    const requireEnum = (value, allowed, location) => {
      const text = requireString(value, location);
      if (text !== null && !allowed.has(text)) error("ENUM", `${location} must be one of: ${[...allowed].sort().join(", ")}`);
    };

    const requireStringList = (value, location) => {
      if (!Array.isArray(value)) {
        error("TYPE", `${location} must be an array of strings`);
        return;
      }
      const seen = new Set();
      value.forEach((item, index) => {
        const itemLocation = `${location}[${index}]`;
        if (typeof item !== "string") {
          error("TYPE", `${itemLocation} must be a string`);
          return;
        }
        if (!item.length) error("MIN_LENGTH", `${itemLocation} must not be empty`);
        if (seen.has(item)) error("DUPLICATE_ITEM", `${location} contains duplicate value: ${JSON.stringify(item)}`);
        seen.add(item);
      });
    };

    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      error("TYPE", "profile must be an object");
      return findings;
    }

    unknownFields(profile, TOP_LEVEL_FIELDS, "profile");
    missingFields(profile, REQUIRED_TOP_LEVEL, "profile");

    if (profile.schema_version !== SCHEMA_VERSION) {
      error("SCHEMA_VERSION", profile.schema_version === "1.0"
        ? "schema_version 1.0 is no longer supported; migrate the profile using docs/migration-v2.md"
        : `schema_version must be ${JSON.stringify(SCHEMA_VERSION)}`);
    }

    requireString(profile.name, "name", 1, 80);
    if ("description" in profile) requireString(profile.description, "description", null, 240);

    const product = requireObject(profile.product, "product");
    if (product) {
      unknownFields(product, PRODUCT_FIELDS, "product");
      missingFields(product, PRODUCT_FIELDS, "product");
      requireEnum(product.personality, PERSONALITIES, "product.personality");

      const characteristics = requireObject(product.characteristics, "product.characteristics");
      if (characteristics) {
        unknownFields(characteristics, CHARACTERISTIC_FIELDS, "product.characteristics");
        missingFields(characteristics, CHARACTERISTIC_FIELDS, "product.characteristics");
        [...CHARACTERISTIC_FIELDS].sort().forEach((key) => requireEnum(characteristics[key], RELATIVE, `product.characteristics.${key}`));
      }

      const memory = requireObject(product.memory, "product.memory");
      if (memory) {
        unknownFields(memory, MEMORY_FIELDS, "product.memory");
        missingFields(memory, MEMORY_FIELDS, "product.memory");
        [...MEMORY_FIELDS].sort().forEach((key) => requireBool(memory[key], `product.memory.${key}`));
      }
    }
    const identity = requireObject(profile.identity, "identity");
    if (identity) {
      unknownFields(identity, IDENTITY_FIELDS, "identity");
      missingFields(identity, IDENTITY_FIELDS, "identity");
      requireString(identity.occupation, "identity.occupation", null, 500);
      requireStringList(identity.background, "identity.background");
      requireString(identity.experience, "identity.experience");
      requireStringList(identity.recurring_uses, "identity.recurring_uses");
      requireStringList(identity.stable_preferences, "identity.stable_preferences");
    }

    const instructions = requireObject(profile.instructions, "instructions");
    if (instructions) {
      unknownFields(instructions, INSTRUCTION_FIELDS, "instructions");
      missingFields(instructions, INSTRUCTION_FIELDS, "instructions");
      requireString(instructions.language, "instructions.language");
      requireStringList(instructions.tone, "instructions.tone");
      requireString(instructions.audience, "instructions.audience");
      ["technical", "research", "ui_ux", "writing", "avoid"].forEach((key) => requireStringList(instructions[key], `instructions.${key}`));

      const explanation = requireObject(instructions.explanation, "instructions.explanation");
      if (explanation) {
        unknownFields(explanation, EXPLANATION_FIELDS, "instructions.explanation");
        missingFields(explanation, EXPLANATION_FIELDS, "instructions.explanation");
        requireString(explanation.principle, "instructions.explanation.principle");
        requireStringList(explanation.sequence, "instructions.explanation.sequence");
        requireString(explanation.terminology, "instructions.explanation.terminology");
        requireString(explanation.depth, "instructions.explanation.depth");
      }

      const structure = requireObject(instructions.structure, "instructions.structure");
      if (structure) {
        unknownFields(structure, STRUCTURE_FIELDS, "instructions.structure");
        missingFields(structure, STRUCTURE_FIELDS, "instructions.structure");
        [...STRUCTURE_FIELDS].sort().forEach((key) => requireString(structure[key], `instructions.structure.${key}`));
      }
    }

    return findings;
  }


  root.PersonalizationRenderer = { renderProfile, validateProfile, SCHEMA_VERSION };
  if (typeof module !== "undefined" && module.exports) module.exports = root.PersonalizationRenderer;
})(typeof globalThis !== "undefined" ? globalThis : this);
