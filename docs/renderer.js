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

  function validateProfile(profile) {
    const findings = [];
    const error = (code, message) => findings.push({ level: "error", code, message });
    const warn = (code, message) => findings.push({ level: "warning", code, message });

    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      error("TYPE", "profile must be an object");
      return findings;
    }
    if (profile.schema_version !== SCHEMA_VERSION) {
      error("SCHEMA_VERSION", profile.schema_version === "1.0" ? "schema_version 1.0 requires migration to v2" : `schema_version must be ${SCHEMA_VERSION}`);
    }
    if (typeof profile.name !== "string" || !profile.name.trim()) error("NAME", "name must be a non-empty string");

    const product = profile.product;
    if (!product || typeof product !== "object" || Array.isArray(product)) {
      error("PRODUCT", "product must be an object");
    } else {
      if (!PERSONALITIES.has(product.personality)) error("PERSONALITY", "product.personality is not supported by this schema");
      const characteristics = product.characteristics;
      if (!characteristics || typeof characteristics !== "object" || Array.isArray(characteristics)) {
        error("CHARACTERISTICS", "product.characteristics must be an object");
      } else {
        ["warm", "enthusiastic", "headers_and_lists", "emojis"].forEach((key) => {
          if (!RELATIVE.has(characteristics[key])) error("CHARACTERISTIC", `product.characteristics.${key} has an unsupported value`);
        });
      }
      const memory = product.memory;
      if (!memory || typeof memory !== "object" || Array.isArray(memory)) {
        error("MEMORY", "product.memory must be an object");
      } else {
        ["saved_memories", "reference_chat_history"].forEach((key) => {
          if (typeof memory[key] !== "boolean") error("MEMORY", `product.memory.${key} must be boolean`);
        });
      }
    }

    const identity = profile.identity;
    if (!identity || typeof identity !== "object" || Array.isArray(identity)) {
      error("IDENTITY", "identity must be an object");
    } else {
      if (typeof identity.occupation !== "string") error("IDENTITY", "identity.occupation must be a string");
      ["background", "recurring_uses", "stable_preferences"].forEach((key) => {
        if (!Array.isArray(identity[key]) || identity[key].some((item) => typeof item !== "string")) error("IDENTITY", `identity.${key} must be an array of strings`);
      });
      if (typeof identity.experience !== "string") error("IDENTITY", "identity.experience must be a string");
    }

    const instructions = profile.instructions;
    if (!instructions || typeof instructions !== "object" || Array.isArray(instructions)) {
      error("INSTRUCTIONS", "instructions must be an object");
    } else {
      if (typeof instructions.language !== "string") error("INSTRUCTIONS", "instructions.language must be a string");
      if (!Array.isArray(instructions.tone) || instructions.tone.some((item) => typeof item !== "string")) error("INSTRUCTIONS", "instructions.tone must be an array of strings");
      if (typeof instructions.audience !== "string") error("INSTRUCTIONS", "instructions.audience must be a string");
      ["technical", "research", "ui_ux", "writing", "avoid"].forEach((key) => {
        if (!Array.isArray(instructions[key]) || instructions[key].some((item) => typeof item !== "string")) error("INSTRUCTIONS", `instructions.${key} must be an array of strings`);
      });
      const explanation = instructions.explanation;
      if (!explanation || typeof explanation !== "object" || Array.isArray(explanation)) {
        error("EXPLANATION", "instructions.explanation must be an object");
      } else {
        ["principle", "terminology", "depth"].forEach((key) => {
          if (typeof explanation[key] !== "string") error("EXPLANATION", `instructions.explanation.${key} must be a string`);
        });
        if (!Array.isArray(explanation.sequence) || explanation.sequence.some((item) => typeof item !== "string")) error("EXPLANATION", "instructions.explanation.sequence must be an array of strings");
      }
      const structure = instructions.structure;
      if (!structure || typeof structure !== "object" || Array.isArray(structure)) {
        error("STRUCTURE", "instructions.structure must be an object");
      } else {
        ["default", "headings", "lists", "tables"].forEach((key) => {
          if (typeof structure[key] !== "string") error("STRUCTURE", `instructions.structure.${key} must be a string`);
        });
        const combined = [structure.default, structure.headings, structure.lists, structure.tables].join(" ");
        const outlineSentences = combined.split(/(?<=[.!?])\s+/);
        const biased = outlineSentences.some((text) => {
          const lowered = text.toLowerCase();
          const negated = ["do not", "don't", "avoid", "without", "not use", "not create"].some((phrase) => lowered.includes(phrase));
          return !negated && /\b(always|prefer|use|create|format|organize)\b.{0,40}\bnumbered (sections?|headings?)\b/i.test(text);
        });
        if (biased) warn("OUTLINE_BIAS", "structure may force outline-style answers");
      }
    }
    return findings;
  }

  root.PersonalizationRenderer = { renderProfile, validateProfile, SCHEMA_VERSION };
  if (typeof module !== "undefined" && module.exports) module.exports = root.PersonalizationRenderer;
})(typeof globalThis !== "undefined" ? globalThis : this);
