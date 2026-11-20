# metehanbeyaz.com

Sade, hızlı, statik kişisel site (**Notlar**, **Projeler**, **CV**) ve canlı **Metehan's Servers Status** entegrasyonu.

## Yerel Önizleme

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:4321` açılır.

## Yeni Yazı / Not Ekleme

`src/content/notlar/` klasörüne yeni bir `.md` dosyası ekleyip `git push` yapmanız yeterli:

```markdown
---
title: "Yeni Not Başlığı"
description: "Kısa açıklama"
date: 2026-11-21
tags: ["linux", "not"]
---

Buraya içeriği yazın...
```

## Cloudflare Pages Ayarları

- **Framework preset:** `Astro`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Custom domain:** `metehanbeyaz.com`
