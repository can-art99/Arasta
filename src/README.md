# Arasta kaynak kodu

Oyun artık tek dosya değil; `build.py` bu klasördeki parçaları birleştirip `game.js`, `index.html` ve `style.css` üretir.
Üretilen dosyaları elle düzenleme, değişiklik burada yapılır.

- `shell.html`: sayfa iskeleti (HUD, butonlar, kütüphane bağlantıları)
- `style.css`: tüm arayüz stilleri
- `js/NN-*.js`: oyun kodu. Dosyalar ada göre sırayla birleştirilir ve tek bir kapsam paylaşır; sıra önemlidir.

| Dosya | İçerik |
|---|---|
| 01-cekirdek | sahne, kamera, temel yardımcılar (put, M, tween...) |
| 02-malzeme-modelleri | ham madde modelleri (MATS) |
| 03-urun-modelleri | ürün listesi (PRODS), adımları ve 3D modelleri |
| 04-ikon-isik | ikon üretimi, ışıklar |
| 05-dukkan | dükkân sahnesi |
| 06-atolye | atölye istasyonları (ST) ve tarifleri |
| 07-bahce | çiftlik, bostan, orman |
| 08-el-aletleri | makas, testere, balta gibi imleç aletleri (TL) |
| 09-pazar-depo-sahne | pazar, dekorcu, depo ve vitrin sahneleri |
| 10-oyun-durumu | kayıt (G), ekipmanlar |
| 11-ses | sentez sesler, müzik, ses dosyası yükleme |
| 12-hava | hava durumu |
| 13-musteri-modeller | müşteriler, GLB model yükleme (glb, place, fitM) |
| 14-ekonomi-arayuz | pazar/tedarik pencereleri, görevler, öğretici, ayarlar |
| 15-ortam-bildirim-hesap | ortam sesleri, bildirim, hesap |
| 16-kraft-cekirdek | kraft akışı: adım geçişi, kesim (trace), puanlama |
| 17-kraft-adimlar-1 | şerit, örme, çark, karıştırma, dökme vb. |
| 18a..18d | diğer kraft adımları (çekiç, taç, körük, vida, tasarım...) |
| 19-dokunma-dongu | dokunma olayları, çizim katmanı, ana döngü |

Derleme: `python3 build.py` (her parçayı ayrıca sözdizimi denetiminden geçirir).
