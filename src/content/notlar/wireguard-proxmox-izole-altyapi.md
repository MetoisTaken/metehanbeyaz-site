---
title: "WireGuard + Proxmox ile İzole Sunucu ve CS2 Altyapısı"
description: "Yönetim ağı ile dışa açık servis ağını ayırarak düşük gecikmeli, fail-closed WireGuard geçidi arkasında CS2 ve medya servislerini nasıl kurduğumun özeti."
date: 2026-11-20
tags: ["proxmox", "wireguard", "nftables", "cs2", "linux"]
---

Kişisel sunucu ve oyun altyapısını kurarken temel hedefim, dışa açık servisleri
yönetim ağından tamamen izole etmek ve en az kaynak tüketimiyle kararlı bir yapı kurmaktı.

## Mimari Özeti

- **Edge Geçidi:** Modüler `nftables` kuralları ve WireGuard tüneli üzerinden yalnızca izin verilen portları servis ağına iletir.
- **İzole Servis Ağı:** Oyun sunucuları ve ters vekil ayrı bir sanal köprüde çalışır; yönetim ağına erişimleri güvenlik duvarı seviyesinde tamamen kapalıdır.
- **Bağımsız İzleme:** Durum izleme sistemi (`Gatus`) tek bir Go binary'si olarak ~32 MB RAM ile çalışır ve tüm servisleri dahili adresleri dışarıya yansıtmadan kontrol eder.

## Öğrendiğim Küçük Ama Kritik Detaylar

1. **Proxmox `balloon: 0` yanılsaması:** Sabit RAM verirken `balloon: 0` yapmak yerine `balloon == memory` bırakmak, misafir bellek kullanımını düşürmeden arayüzde gerçek RAM istatistiğini doğru gösterir.
2. **P-Core çekirdek sabitleme (`affinity`):** Hibrit Intel işlemcilerde (P-Core + E-Core) oyun sunucularını performans çekirdeklerine sabitlemek kare süresi tutarlılığını belirgin biçimde iyileştiriyor.
3. **Sade kaynak bütçesi:** Docker veya ağır çalışma zamanları yerine tek binary servisler ve statik site üreticileri kullanarak bellek tüketimini onda birine indirmek mümkün.
