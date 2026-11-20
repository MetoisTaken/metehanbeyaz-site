---
title: "Jellyfin Samsung Tizen TV'de Neden Sürekli Transcode Yapıyor?"
description: "10-bit HEVC + AAC dosyanın video ve sesi desteklendiği halde neden kod dönüştürdüğünü loglardan nasıl tespit ettiğim ve kalıcı çözümü."
date: 2026-11-19
tags: ["jellyfin", "tizen", "ffmpeg", "vaapi", "linux"]
---

Samsung Smart TV'deki **Jellyfin for Tizen** uygulamasında 1080p HEVC 10-bit bir diziyi açtığımda,
TV hem HEVC 10-bit videoyu hem de AAC 5.1 sesi desteklemesine rağmen sunucu videoyu sürekli yeniden kodluyordu.

## Kök Neden: Resim Tabanlı Blu-Ray Altyazı (`PGSSUB`)

FFmpeg transcode kayıtlarını incelediğimde sesin zaten `-codec:a:0 copy` ile doğrudan geçtiğini,
ancak Blu-Ray MKV içindeki Türkçe altyazının metin (`.srt`) değil **bitmap görüntü (`hdmv_pgs_subtitle`)**
olduğunu gördüm.

Tizen'deki HTML5 oynatıcı resim tabanlı `PGSSUB` altyazıları yerel olarak ekrana çizemediği için
Jellyfin sırf altyazıyı görüntünün üzerine yakabilmek (`overlay_vaapi`) adına tüm videoyu
10-bit'ten 8-bit'e düşürüp yeniden kodlamak zorunda kalıyordu.

## Uyguladığım İki Çözüm

1. **Otomatik Metin Altyazı (`.srt`):** Jellyfin'e `subbuzz` ve `Open Subtitles` eklentilerini kurup
   kütüphane ayarlarında `SkipSubtitlesIfEmbeddedSubtitlesPresent = false` yaptım. Böylece MKV içinde
   `PGSSUB` olsa bile yanına UTF-8 Türkçe `.srt` indiriliyor ve TV **%100 Direct Play** oynatıyor.
2. **Transcode Throttling & Segment Temizliği:** `encoding.xml` içinde `EnableThrottling` ve
   `EnableSegmentDeletion` açılarak zorunlu dönüştürme durumlarında tüm bölümün tek seferde diske yazılıp
   container diskini şişirmesi engellendi.
