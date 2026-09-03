<h1 align="center">ChatGPT Personalization</h1>

<p align="center">
  Buat, validasi, dan kelola profil personalisasi ChatGPT yang dapat digunakan ulang.
</p>

<p align="center">
  <a href="README.md">English</a> · <a href="README.id.md"><strong>Bahasa Indonesia</strong></a>
</p>

<p align="center">
  <a href="https://man612.github.io/chatgpt-personalization/"><strong>Buka Builder</strong></a>
  · <a href="docs/guide.md">Panduan</a>
  · <a href="docs/testing.md">Pengujian</a>
</p>

<p align="center">
  <a href="https://github.com/man612/chatgpt-personalization/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/man612/chatgpt-personalization/ci.yml?branch=main&style=flat-square&label=CI" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/man612/chatgpt-personalization?style=flat-square" alt="MIT License"></a>
  <a href="spec/profile.schema.json"><img src="https://img.shields.io/badge/schema-v2.0-8250df?style=flat-square" alt="Schema v2.0"></a>
</p>

<p align="center"><sub>Proyek open-source independen · tidak terafiliasi atau didukung oleh OpenAI</sub></p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark-v3.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-light-v3.svg">
  <img alt="Alur ChatGPT Personalization" src="assets/hero-light-v3.svg" width="100%">
</picture>

ChatGPT Personalization menyimpan pengaturan produk, konteks pengguna yang tahan lama, dan instruksi respons dalam profil JSON terstruktur. Gunakan browser builder untuk setup paling sederhana atau tool repository untuk workflow yang memakai version control.

## Mulai cepat

### Browser builder — direkomendasikan

Buka **[ChatGPT Personalization Builder](https://man612.github.io/chatgpt-personalization/)**.

1. Pilih preset. **General** adalah default yang direkomendasikan untuk penggunaan harian bahasa Indonesia atau Inggris.
2. Sesuaikan pengaturan produk, konteks tahan lama, dan perilaku respons.
3. Pilih target jumlah karakter Custom Instructions sesuai plan ChatGPT.
4. Validasi profil.
5. Salin hasil render ke **ChatGPT → Settings → Personalization**.
6. Simpan profil JSON jika ingin memiliki salinan yang dapat digunakan ulang.

Builder bersifat statis, tidak memerlukan login, dan edit tetap berada di browser.

### Repository / CLI

Gunakan jalur ini jika ingin version control, profil lokal, proses render yang dapat diulang, atau regression testing.

```bash
git clone https://github.com/man612/chatgpt-personalization.git
cd chatgpt-personalization

cp profiles/presets/general.json profiles/local/me.json
python tools/profile.py lint profiles/local/me.json --limit 5000
python tools/profile.py render profiles/local/me.json --out build/me --limit 5000
```

Gunakan `profiles/presets/blank.json` jika ingin memulai tanpa default perilaku apa pun.

Renderer menghasilkan:

```text
build/me/
├── settings.md
├── occupation.txt
├── more-about-you.txt
└── custom-instructions.txt
```

`settings.md` berisi checklist kontrol produk ChatGPT. File teks lainnya dipetakan ke field Personalization yang paling sesuai.

## Preset

| Preset | Penggunaan |
| --- | --- |
| [`general.json`](profiles/presets/general.json) | Titik awal seimbang yang direkomendasikan untuk penggunaan harian bahasa Indonesia atau Inggris |
| [`blank.json`](profiles/presets/blank.json) | Tanpa default perilaku |
| [`tech-generalist.json`](profiles/presets/tech-generalist.json) | Teknologi, troubleshooting, pengembangan berbantuan AI, riset, dan UI/UX |
| [`knowledge-worker.json`](profiles/presets/knowledge-worker.json) | Riset, perencanaan, dokumentasi, dan keputusan praktis |
| [`student.json`](profiles/presets/student.json) | Belajar dan penjelasan tanpa menganggap pengguna sudah memahami istilah ahli |
| [`product-designer.json`](profiles/presets/product-designer.json) | Pemikiran produk, kritik antarmuka, dan keputusan desain |
| [`writer-editor.json`](profiles/presets/writer-editor.json) | Drafting, rewriting, editing, dan pekerjaan yang sensitif terhadap tone |

Preset publik bersifat anonim dan dapat digunakan ulang. Preset tidak boleh mengandung identitas maintainer atau konteks pribadi.

## Perilaku penulisan

Semua preset publik yang opinionated menggunakan **natural-writing core** ringkas untuk bahasa Indonesia dan Inggris. Aturan ini menjaga fakta dan voice sumber, memprioritaskan contoh tulisan pengguna jika tersedia, lalu melakukan satu audit ringan terhadap residu respons AI seperti filler, struktur yang terlalu simetris, fake casualness, staged rhetoric, generic ending, dan drafting residue yang tidak didukung konteks.

Core ini mengadaptasi prinsip bernilai tinggi dari **Sepia** serta beberapa pola audit dari **Humanizer**. Tujuannya bukan mendeteksi AI atau menghindari AI detector. Tanda baca dan grammar yang spesifik bahasa tetap mengikuti bahasa serta tujuan tulisan, bukan blacklist universal.

Lihat [`docs/writing/core.md`](docs/writing/core.md) dan [`docs/writing/indonesian-ai-tells.md`](docs/writing/indonesian-ai-tells.md). **Blank** sengaja tidak mewarisi aturan ini.

## Peran profil

```text
profiles/
├── presets/       titik awal publik yang dapat digunakan ulang
├── local/         profil pribadi/eksperimental; diabaikan Git
├── maintainers/   contoh publik dari maintainer
└── operational/   target akun public-safe untuk dogfooding/audit
```

Pengguna normal sebaiknya memulai dari `profiles/presets/` lalu menyimpan profil pribadi di `profiles/local/`.

Profil maintainer dan operational bukan default dan tidak muncul sebagai titik awal di builder. File Yasman tetap disimpan sebagai contoh publik bagaimana maintainer menggunakan serta mengaudit proyek ini; pengguna lain tidak diharapkan menyalinnya sebagai profil mereka.

## Validasi dan evaluasi

Linter memeriksa validitas skema, batas field, kemungkinan secret, teks berulang, prompt bloat, over-constraint, dan outline bias. Renderer browser dan Python juga diuji agar hasilnya konsisten.

Profil yang valid secara struktural belum tentu menghasilkan perilaku model yang lebih baik. Perubahan perilaku harus diuji menggunakan prompt yang representatif sebelum dijadikan default. Skenario yang mudah dibaca manusia ada di [`tests/scenarios.md`](tests/scenarios.md), sedangkan versi machine-readable ada di [`tests/scenarios.json`](tests/scenarios.json).

## Dokumentasi

- [`docs/guide.md`](docs/guide.md) — desain dan pemeliharaan profil
- [`docs/product-mapping.md`](docs/product-mapping.md) — pemetaan field profil ke permukaan produk ChatGPT
- [`docs/testing.md`](docs/testing.md) — evaluasi perilaku
- [`docs/privacy.md`](docs/privacy.md) — kebersihan data
- [`docs/references.md`](docs/references.md) — dasar riset dan keterbatasan
- [`docs/writing/core.md`](docs/writing/core.md) — kebijakan penulisan generik
- [`profiles/operational/README.md`](profiles/operational/README.md) — cakupan profil operational

## Kontribusi

Kontribusi yang fokus sangat diterima. Tooling generik harus tetap bebas dari identitas pribadi, preset publik harus dapat digunakan ulang, dan aturan perilaku baru sebaiknya ditambahkan hanya untuk kebutuhan yang dapat diamati atau failure mode yang berulang.

Baca [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), dan [`SECURITY.md`](SECURITY.md) sebelum berkontribusi.

## Lisensi

Dirilis dengan [MIT License](LICENSE). Adaptasi pihak ketiga serta notice lisensi aslinya didokumentasikan di [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
