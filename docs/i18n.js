(() => {
  "use strict";

  const dictionaries = {
    en: {
      skip_builder: "Skip to builder",
      brand_subtitle: "Builder · schema v2",
      nav_guide: "Guide",
      nav_testing: "Testing",
      language_label: "Interface language",
      hero_eyebrow: "Reusable ChatGPT personalization profiles",
      hero_title: "ChatGPT Personalization Builder",
      hero_lede: "Create, validate, and export a reusable personalization profile. Start with General for a balanced English/Indonesian setup, or Blank for no behavioral defaults.",
      trust_no_signin: "No sign-in",
      trust_no_runtime: "No runtime dependencies",
      trust_local: "Edits stay in your browser",
      workflow_choose: "Choose a preset",
      workflow_edit: "Customize your profile",
      workflow_export: "Validate and apply",
      sheet_ready: "PROFILE",
      sheet_product: "Product",
      sheet_product_detail: "Personality · Characteristics · Memory",
      sheet_identity: "Identity",
      sheet_identity_detail: "Occupation · background · durable context",
      sheet_instructions: "Instructions",
      sheet_instructions_detail: "Explanation · research · technical · writing",
      sheet_footer: "validate → render → evaluate",
      sheet_fields: "4 OUTPUT FIELDS",
      chip_local: "local editing",
      chip_eval: "behavioral evals",
      profile_controls: "Profile controls",
      starting_point: "Starting point",
      presets_group: "Public presets",
      preset_general: "General",
      preset_general_desc: "Balanced everyday setup for English or Indonesian",
      preset_blank: "Blank",
      preset_blank_desc: "No behavioral defaults; build from scratch",
      preset_tech: "Technology generalist",
      preset_tech_desc: "Technical work, troubleshooting, UI/UX, assisted development",
      preset_knowledge: "Knowledge worker",
      preset_knowledge_desc: "Research, planning, analysis, and everyday knowledge work",
      preset_student: "Student",
      preset_student_desc: "Learning, explanation, study, and structured understanding",
      preset_product: "Product designer",
      preset_product_desc: "Product thinking, interface critique, and design decisions",
      preset_writer: "Writer and editor",
      preset_writer_desc: "Drafting, editing, tone, and language-sensitive work",
      validation_target: "Validation target",
      limit_1500_desc: "Custom Instructions target: 1,500 characters",
      limit_5000_desc: "Custom Instructions target: 5,000 characters",
      reset_preset: "Reset to preset",
      save_json: "Save profile JSON ↓",
      loading_profile: "Loading profile…",
      workspace_label: "Profile builder workspace",
      source_truth: "Profile",
      edit_profile: "Edit profile",
      edit_caption: "Change structured profile fields. The rendered output updates automatically.",
      check_profile: "Check profile",
      json_summary: "Advanced JSON editor",
      json_summary_detail: "Direct schema-level control",
      json_help: "Edit the complete v2 document directly. Applying JSON rebuilds the visual editor and preview.",
      json_aria: "Profile JSON",
      format_json: "Format JSON",
      apply_json: "Apply JSON changes",
      rendered_output: "Rendered output",
      use_chatgpt: "Apply to ChatGPT",
      use_caption: "Apply the product settings manually, then copy the generated text into the matching Personalization fields.",
      output_product: "Product settings",
      output_occupation: "Occupation",
      output_about: "More about you",
      output_instructions: "Custom Instructions",
      target_settings: "Apply manually",
      target_occupation: "Paste → Occupation",
      target_about: "Paste → More about you",
      target_instructions: "Paste → Custom Instructions",
      recommended_order_label: "Recommended order:",
      recommended_order_text: "Match Product settings first, then paste Occupation, More about you, and Custom Instructions into the corresponding ChatGPT Personalization fields.",
      copy: "Copy",
      copied: "Copied ✓",
      apply_steps_title: "Where to put these fields",
      apply_steps_text: "Open ChatGPT → Settings → Personalization. Match the product settings above, then paste Occupation, More about you, and Custom Instructions into their corresponding fields. Product labels can change over time; use the closest current field.",
      advanced_path: "Need version control?",
      advanced_path_text: "Download the profile JSON or use the repository CLI to lint, render, compare, and evaluate profiles locally.",
      design_boundary: "Profile roles",
      public_design_title: "Reusable presets stay separate from personal profiles.",
      public_design_p1: "General and the role presets are reusable starting points. Blank contains no behavioral defaults. Maintainer and operational profiles are public examples or account targets, not presets for other users.",
      public_design_p2: "Structural validation checks configuration and character limits. Behavioral changes still need representative evaluation.",
      footer_privacy: "Static builder for man612/chatgpt-personalization. Profile edits are not uploaded by this page.",
      footer_independent: "Independent project · not affiliated with or endorsed by OpenAI.",
      update_title: "Builder update available",
      update_body: "Your current edits are untouched. Refresh when you are ready.",
      refresh: "Refresh",
      primary_nav: "Primary navigation",
      builder_properties: "Builder properties",
      workflow: "Workflow",
      profile_diagram: "A personalization profile separates product settings, identity, and instructions before rendering four output fields.",
      profile_valid: "Profile structure is valid in the browser renderer.",
      ready_sync: "Ready · profile and preview are in sync",
      fix_errors: "Fix validation errors to preview this output.",
      loading_file: "Loading {file}…",
      load_failed: "Could not load {file}",
      field_limit: "Custom Instructions are {length} characters; selected target is {limit}.",
      field_near_limit: "Custom Instructions are {length} characters; selected target is {limit}.",
      char_summary: "About {about} · Instructions {instructions}/{limit}",
      option_on: "On",
      option_off: "Off",
      option_enabled: "Enabled for this profile",
      option_disabled: "Disabled for this profile",
      choose_one: "Choose one",
      options: "Options",
      close: "Close",
      choose_option: "Choose an option",
      previous_step: "Previous step",
      next: "Next",
      done: "Done",
      step_meta: "Step {current} of {total}",
      jump_steps: "Jump to a builder step",
      mobile_steps: "Personalization builder steps",
      go_step: "Go to step {number}: {label}",
      step_setup_label: "Setup",
      step_setup_title: "Choose a starting point",
      step_setup_caption: "Pick a reusable preset and the Custom Instructions character target.",
      step_product_label: "Product",
      step_product_title: "Product settings",
      step_product_caption: "Match ChatGPT controls such as Personality, Characteristics, and Memory.",
      step_identity_label: "About you",
      step_identity_title: "About you",
      step_identity_caption: "Add durable context that helps ChatGPT understand your work, background, and recurring use.",
      step_instructions_label: "Response",
      step_instructions_title: "Response behavior",
      step_instructions_caption: "Define how explanations, research, technical work, UI/UX reviews, and writing should behave.",
      step_output_label: "Use",
      step_output_title: "Apply to ChatGPT",
      step_output_caption: "Match product controls, then paste each rendered text field into the corresponding Personalization field.",
      placeholder_occupation: "Example: Office operations staff and freelance UI/UX designer",
      placeholder_background: "One relevant background detail per line",
      placeholder_experience: "What you already know, how you learned, or where you are still a beginner",
      placeholder_uses: "One recurring ChatGPT use per line",
      placeholder_preferences: "One long-term preference per line"
    },
    id: {
      skip_builder: "Lewati ke builder",
      brand_subtitle: "Builder · skema v2",
      nav_guide: "Panduan",
      nav_testing: "Pengujian",
      language_label: "Bahasa antarmuka",
      hero_eyebrow: "Profil personalisasi ChatGPT yang dapat digunakan ulang",
      hero_title: "ChatGPT Personalization Builder",
      hero_lede: "Buat, validasi, dan ekspor profil personalisasi yang dapat digunakan ulang. Mulai dari General untuk pengaturan seimbang bahasa Indonesia/Inggris, atau Blank jika tidak ingin membawa default perilaku apa pun.",
      trust_no_signin: "Tanpa login",
      trust_no_runtime: "Tanpa dependensi runtime",
      trust_local: "Edit tetap di browser Anda",
      workflow_choose: "Pilih preset",
      workflow_edit: "Sesuaikan profil",
      workflow_export: "Validasi dan terapkan",
      sheet_ready: "PROFIL",
      sheet_product: "Produk",
      sheet_product_detail: "Personality · Characteristics · Memory",
      sheet_identity: "Identitas",
      sheet_identity_detail: "Pekerjaan · latar belakang · konteks tahan lama",
      sheet_instructions: "Instruksi",
      sheet_instructions_detail: "Penjelasan · riset · teknis · penulisan",
      sheet_footer: "validasi → render → evaluasi",
      sheet_fields: "4 HASIL",
      chip_local: "edit lokal",
      chip_eval: "evaluasi perilaku",
      profile_controls: "Kontrol profil",
      starting_point: "Titik awal",
      presets_group: "Preset publik",
      preset_general: "General",
      preset_general_desc: "Pengaturan harian seimbang untuk bahasa Indonesia atau Inggris",
      preset_blank: "Blank",
      preset_blank_desc: "Tanpa default perilaku; mulai dari nol",
      preset_tech: "Generalis teknologi",
      preset_tech_desc: "Pekerjaan teknis, troubleshooting, UI/UX, dan pengembangan berbantuan AI",
      preset_knowledge: "Knowledge worker",
      preset_knowledge_desc: "Riset, perencanaan, analisis, dan pekerjaan pengetahuan sehari-hari",
      preset_student: "Pelajar",
      preset_student_desc: "Belajar, penjelasan, latihan, dan pemahaman terstruktur",
      preset_product: "Product designer",
      preset_product_desc: "Pemikiran produk, kritik antarmuka, dan keputusan desain",
      preset_writer: "Penulis dan editor",
      preset_writer_desc: "Penyusunan draf, penyuntingan, tone, dan pekerjaan yang sensitif terhadap bahasa",
      validation_target: "Target validasi",
      limit_1500_desc: "Target Instruksi Kustom: 1.500 karakter",
      limit_5000_desc: "Target Instruksi Kustom: 5.000 karakter",
      reset_preset: "Reset ke preset",
      save_json: "Simpan profil JSON ↓",
      loading_profile: "Memuat profil…",
      workspace_label: "Area kerja builder profil",
      source_truth: "Profil",
      edit_profile: "Edit profil",
      edit_caption: "Ubah field profil terstruktur. Hasil render diperbarui otomatis.",
      check_profile: "Periksa profil",
      json_summary: "Editor JSON lanjutan",
      json_summary_detail: "Kontrol langsung pada level skema",
      json_help: "Edit dokumen v2 lengkap secara langsung. Menerapkan JSON akan membangun ulang editor visual dan pratinjau.",
      json_aria: "JSON profil",
      format_json: "Rapikan JSON",
      apply_json: "Terapkan perubahan JSON",
      rendered_output: "Hasil render",
      use_chatgpt: "Terapkan ke ChatGPT",
      use_caption: "Terapkan pengaturan produk secara manual, lalu salin teks yang dihasilkan ke field Personalisasi yang sesuai.",
      output_product: "Pengaturan produk",
      output_occupation: "Pekerjaan",
      output_about: "Tentang Anda",
      output_instructions: "Instruksi Kustom",
      target_settings: "Terapkan manual",
      target_occupation: "Tempel → Pekerjaan",
      target_about: "Tempel → Tentang Anda",
      target_instructions: "Tempel → Instruksi Kustom",
      recommended_order_label: "Urutan yang disarankan:",
      recommended_order_text: "Samakan pengaturan Produk terlebih dahulu, lalu tempel Pekerjaan, Tentang Anda, dan Instruksi Kustom ke field Personalisasi ChatGPT yang sesuai.",
      copy: "Salin",
      copied: "Tersalin ✓",
      apply_steps_title: "Tempat menaruh field ini",
      apply_steps_text: "Buka ChatGPT → Pengaturan → Personalisasi. Samakan pengaturan produk di atas, lalu tempel Pekerjaan, Tentang Anda, dan Instruksi Kustom ke field yang sesuai. Nama field dapat berubah dari waktu ke waktu; gunakan padanan terdekat pada tampilan ChatGPT Anda.",
      advanced_path: "Butuh kontrol versi?",
      advanced_path_text: "Unduh profil JSON atau gunakan CLI repository untuk lint, render, membandingkan, dan mengevaluasi profil secara lokal.",
      design_boundary: "Peran profil",
      public_design_title: "Preset yang dapat digunakan ulang tetap dipisahkan dari profil pribadi.",
      public_design_p1: "General dan preset berdasarkan peran adalah titik awal yang dapat digunakan ulang. Blank tidak membawa default perilaku. Profil maintainer dan operational adalah contoh publik atau target akun, bukan preset untuk pengguna lain.",
      public_design_p2: "Validasi struktural memeriksa konfigurasi dan batas karakter. Perubahan perilaku tetap perlu diuji dengan skenario yang representatif.",
      footer_privacy: "Builder statis untuk man612/chatgpt-personalization. Edit profil tidak diunggah oleh halaman ini.",
      footer_independent: "Proyek independen · tidak terafiliasi dengan atau mendapat endorsement dari OpenAI.",
      update_title: "Pembaruan builder tersedia",
      update_body: "Edit Anda saat ini tidak disentuh. Muat ulang saat sudah siap.",
      refresh: "Muat ulang",
      primary_nav: "Navigasi utama",
      builder_properties: "Karakteristik builder",
      workflow: "Alur kerja",
      profile_diagram: "Profil personalisasi memisahkan pengaturan produk, identitas, dan instruksi sebelum menghasilkan empat field output.",
      profile_valid: "Struktur profil valid pada renderer browser.",
      ready_sync: "Siap · profil dan pratinjau sudah sinkron",
      fix_errors: "Perbaiki error validasi untuk melihat pratinjau hasil.",
      loading_file: "Memuat {file}…",
      load_failed: "Tidak dapat memuat {file}",
      field_limit: "Instruksi Kustom berisi {length} karakter; target yang dipilih {limit}.",
      field_near_limit: "Instruksi Kustom berisi {length} karakter; target yang dipilih {limit}.",
      char_summary: "Tentang Anda {about} · Instruksi {instructions}/{limit}",
      option_on: "Aktif",
      option_off: "Nonaktif",
      option_enabled: "Diaktifkan untuk profil ini",
      option_disabled: "Dinonaktifkan untuk profil ini",
      choose_one: "Pilih satu",
      options: "Pilihan",
      close: "Tutup",
      choose_option: "Pilih opsi",
      previous_step: "Langkah sebelumnya",
      next: "Lanjut",
      done: "Selesai",
      step_meta: "Langkah {current} dari {total}",
      jump_steps: "Pindah ke langkah builder",
      mobile_steps: "Langkah builder personalisasi",
      go_step: "Ke langkah {number}: {label}",
      step_setup_label: "Setup",
      step_setup_title: "Pilih titik awal",
      step_setup_caption: "Pilih preset yang dapat digunakan ulang dan target karakter Instruksi Kustom.",
      step_product_label: "Produk",
      step_product_title: "Pengaturan produk",
      step_product_caption: "Samakan kontrol ChatGPT seperti Personality, Characteristics, dan Memory.",
      step_identity_label: "Tentang Anda",
      step_identity_title: "Tentang Anda",
      step_identity_caption: "Tambahkan konteks tahan lama yang membantu ChatGPT memahami pekerjaan, latar belakang, dan penggunaan berulang Anda.",
      step_instructions_label: "Respons",
      step_instructions_title: "Perilaku respons",
      step_instructions_caption: "Atur bagaimana penjelasan, riset, pekerjaan teknis, review UI/UX, dan penulisan harus dilakukan.",
      step_output_label: "Terapkan",
      step_output_title: "Terapkan ke ChatGPT",
      step_output_caption: "Samakan kontrol produk, lalu tempel setiap teks hasil render ke field Personalisasi yang sesuai.",
      placeholder_occupation: "Contoh: Staf operasional kantor dan freelancer UI/UX",
      placeholder_background: "Satu detail latar belakang relevan per baris",
      placeholder_experience: "Apa yang sudah Anda pahami, cara belajar, atau area yang masih baru",
      placeholder_uses: "Satu penggunaan ChatGPT yang berulang per baris",
      placeholder_preferences: "Satu preferensi jangka panjang per baris"
    }
  };

  const fieldLabels = {
    en: { schema_version: "Schema version", name: "Name", description: "Description", product: "Product", personality: "Personality", characteristics: "Characteristics", warm: "Warm", enthusiastic: "Enthusiastic", headers_and_lists: "Headers & Lists", emojis: "Emojis", memory: "Memory", saved_memories: "Saved memories", reference_chat_history: "Reference chat history", identity: "Identity", occupation: "Occupation", background: "Background", experience: "Experience", recurring_uses: "Recurring uses", stable_preferences: "Stable preferences", instructions: "Instructions", language: "Language", tone: "Tone", audience: "Audience", explanation: "Explanation", principle: "Principle", sequence: "Sequence", terminology: "Terminology", depth: "Depth", structure: "Structure", default: "Default", headings: "Headings", lists: "Lists", tables: "Tables", technical: "Technical", research: "Research", ui_ux: "UI/UX", writing: "Writing", avoid: "Avoid" },
    id: { schema_version: "Versi skema", name: "Nama", description: "Deskripsi", product: "Produk", personality: "Personality", characteristics: "Characteristics", warm: "Hangat", enthusiastic: "Antusias", headers_and_lists: "Heading & Daftar", emojis: "Emoji", memory: "Memory", saved_memories: "Saved memories", reference_chat_history: "Riwayat chat", identity: "Identitas", occupation: "Pekerjaan", background: "Latar belakang", experience: "Pengalaman", recurring_uses: "Penggunaan berulang", stable_preferences: "Preferensi tetap", instructions: "Instruksi", language: "Bahasa", tone: "Tone", audience: "Audiens", explanation: "Penjelasan", principle: "Prinsip", sequence: "Urutan", terminology: "Terminologi", depth: "Kedalaman", structure: "Struktur", default: "Default", headings: "Heading", lists: "Daftar", tables: "Tabel", technical: "Teknis", research: "Riset", ui_ux: "UI/UX", writing: "Penulisan", avoid: "Hindari" }
  };

  const fieldHelp = {
    en: {
      "product.personality": "Base style and tone. Keep response rules in Instructions instead of duplicating them here.",
      "product.characteristics.headers_and_lists": "Lower this for paragraph-first answers while still allowing lists when they genuinely help.",
      "instructions.explanation.principle": "The main teaching rule for unfamiliar concepts.",
      "instructions.explanation.sequence": "One step per line. This is dependency order, not a rigid answer template.",
      "instructions.explanation.depth": "What must remain intact when language becomes simpler.",
      "instructions.structure.headings": "Describe when headings help; avoid rules triggered only by answer length."
    },
    id: {
      "product.personality": "Gaya dan tone dasar. Simpan aturan respons di Instruksi agar tidak diduplikasi di sini.",
      "product.characteristics.headers_and_lists": "Turunkan jika ingin respons lebih banyak berbentuk paragraf, tanpa melarang daftar saat memang membantu.",
      "instructions.explanation.principle": "Aturan utama untuk menjelaskan konsep yang belum familiar.",
      "instructions.explanation.sequence": "Satu langkah per baris. Ini urutan dependensi, bukan template jawaban yang kaku.",
      "instructions.explanation.depth": "Hal yang harus tetap dipertahankan saat bahasanya disederhanakan.",
      "instructions.structure.headings": "Jelaskan kapan heading membantu; hindari aturan yang hanya dipicu oleh panjang jawaban."
    }
  };

  const sectionHelp = {
    en: {
      product: "ChatGPT product controls that should not be duplicated into prompt text.",
      identity: "Durable context that changes how answers should be shaped.",
      instructions: "Global response behavior rendered into Custom Instructions.",
      "product.characteristics": "Directional preferences for presentation and tone.",
      "product.memory": "Intended Memory state; product availability can vary.",
      "instructions.explanation": "How unfamiliar material should become understandable without losing depth.",
      "instructions.structure": "Formatting defaults that follow information shape rather than answer length."
    },
    id: {
      product: "Kontrol produk ChatGPT yang tidak perlu diduplikasi ke teks prompt.",
      identity: "Konteks tahan lama yang memengaruhi bagaimana jawaban dibentuk.",
      instructions: "Perilaku respons global yang dirender menjadi Instruksi Kustom.",
      "product.characteristics": "Preferensi arah untuk penyajian dan tone.",
      "product.memory": "Target kondisi Memory; ketersediaan fitur dapat berbeda.",
      "instructions.explanation": "Cara membuat materi yang belum familiar menjadi mudah dipahami tanpa kehilangan kedalaman.",
      "instructions.structure": "Default format mengikuti bentuk informasi, bukan sekadar panjang jawaban."
    }
  };

  const personalityLabels = {
    en: { Default: "Default", Professional: "Professional", Friendly: "Friendly", Candid: "Candid", Quirky: "Quirky", Efficient: "Efficient", Cynical: "Cynical" },
    id: { Default: "Default", Professional: "Profesional", Friendly: "Ramah", Candid: "Terus terang", Quirky: "Unik", Efficient: "Efisien", Cynical: "Sinis" }
  };
  const relativeLabels = {
    en: { less: "Less", slightly_less: "Slightly less", neutral: "Neutral", slightly_more: "Slightly more", more: "More" },
    id: { less: "Lebih sedikit", slightly_less: "Sedikit lebih sedikit", neutral: "Netral", slightly_more: "Sedikit lebih banyak", more: "Lebih banyak" }
  };

  function initialLocale() {
    try {
      const saved = localStorage.getItem("chatgpt-personalization:locale");
      if (saved === "en" || saved === "id") return saved;
    } catch (_) {}
    return String(navigator.language || "en").toLowerCase().startsWith("id") ? "id" : "en";
  }

  let locale = initialLocale();

  function format(text, vars = {}) {
    return String(text).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
  }

  function t(key, vars, fallback) {
    const value = dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? fallback ?? key;
    return format(value, vars);
  }

  function label(key) { return fieldLabels[locale]?.[key] ?? fieldLabels.en[key] ?? key; }
  function help(path) { return fieldHelp[locale]?.[path] ?? fieldHelp.en[path] ?? ""; }
  function section(path) { return sectionHelp[locale]?.[path] ?? sectionHelp.en[path] ?? ""; }
  function personality(value) { return personalityLabels[locale]?.[value] ?? personalityLabels.en[value] ?? value; }
  function relative(value) { return relativeLabels[locale]?.[value] ?? relativeLabels.en[value] ?? value; }

  function applyStatic() {
    document.documentElement.lang = locale;
    document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
    document.querySelectorAll("[data-i18n-title]").forEach((node) => { node.setAttribute("title", t(node.dataset.i18nTitle)); });
    document.querySelectorAll("option[data-i18n-label]").forEach((node) => { node.textContent = t(node.dataset.i18nLabel); });
    document.querySelectorAll("option[data-i18n-description]").forEach((node) => { node.dataset.description = t(node.dataset.i18nDescription); });
    document.querySelectorAll("optgroup[data-i18n-label]").forEach((node) => { node.label = t(node.dataset.i18nLabel); });
    document.querySelectorAll("[data-locale]").forEach((node) => {
      const active = node.dataset.locale === locale;
      node.classList.toggle("active", active);
      node.setAttribute("aria-pressed", String(active));
    });
  }

  function setLocale(next) {
    if (next !== "en" && next !== "id") return;
    locale = next;
    try { localStorage.setItem("chatgpt-personalization:locale", locale); } catch (_) {}
    applyStatic();
    document.dispatchEvent(new CustomEvent("builder:localechange", { detail: { locale } }));
  }

  window.BuilderI18n = { t, label, help, section, personality, relative, applyStatic, setLocale, get locale() { return locale; } };
  document.addEventListener("DOMContentLoaded", () => {
    applyStatic();
    document.querySelectorAll("[data-locale]").forEach((button) => {
      button.addEventListener("pointerdown", () => {
        const active = document.activeElement;
        if (active && active !== button && typeof active.blur === "function") active.blur();
      });
      button.addEventListener("click", () => setLocale(button.dataset.locale));
    });
  });
})();
