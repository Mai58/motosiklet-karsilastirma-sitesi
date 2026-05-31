# 🚀 [OTOM] - Akıllı Motosiklet Karşılaştırma Platformu

Bu proje, iki farklı motosikleti yan yana getirerek teknik özelliklerini, donanımlarını, performans metriklerini ve görsellerini dinamik olarak karşılaştıran premium bir web uygulamasıdır. Epey.com mantığıyla çalışan akıllı bir kıyaslama motoruna sahiptir.

---

### 📂 Proje Gelişim Günlüğü (Versiyon Notları)

- **V8 (2026-05-31):**
  - **Dinamik ve Akıllı Kıyaslama Motoru:** İki motor seçildiğinde özellikler anında kapıştırılır. Sayısal veriler (Beygir, tork vb.) otomatik ayıklanır; kazanan özellik kalın fontla öne çıkarılır.
  - **Katmanlı JSON & Döngü Mimarisi:** Satır satır HTML yazma hamallığı bitti. JSON'daki iç içe (nested) tüm teknik özellikler dinamik bir döngüyle HTML ID'leri üzerinden otomatik eşleştirilerek ekrana basılır.
  - **Boolean Donanım Görselleştirmesi:** Elektronik ve güvenlik özelliklerindeki `true` / `false` verileri ekranda otomatik olarak "Var ✅" / "Yok ❌" şeklinde şık birer görsel kritere dönüştürülür.
  - **Gelişmiş Arama ve Temizleme Modu:** Girdi alanları temizlendiğinde veya eşleşme bozulduğunda tüm hücreler, stiller ve görseller otomatik olarak sıfırlanır.

- **V7 (2026-05-09):**
  - Resim yön tuşları (Galeri navigasyonu) eklendi.
  - Demo resim entegrasyonu sağlandı.

---

### 🛠️ Teknik Özellikler

- **HTML5 & CSS3:** Modern ve responsive arayüz, Grid & Flexbox yapısıyla esnek konumlandırma.
- **Vanilla JavaScript (ES6+):** Harici kütüphane (JQuery vb.) kullanmadan, saf JS ile DOM manipülasyonu, gelişmiş event listener yönetimi ve regex tabanlı veri işleme.
- **Dinamik JSON Data Fetching:** Asenkron veri yönetimi (`fetch` API), yerel veritabanı mantığıyla çalışan katmanlı veri mimarisi.

---

### 📖 Nasıl Çalıştırılır?

1. Bu depoyu bilgisayarınıza klonlayın veya indirin.
2. Proje klasörünün içinde ana dizinde yer alan `data.json` dosyasının eksiksiz olduğundan emin olun.
3. Tarayıcı güvenliği (CORS politikaları) nedeniyle `fetch` API'sinin çalışabilmesi için projeyi bir yerel sunucu ile açmanız gerekir:
   - VS Code kullanıyorsanız **Live Server** eklentisiyle `index.html` dosyasını başlatın.
   - Ya da terminalden `python -m http.server` komutuyla ayağa kaldırın.

---

### 🎯 Gelecek Hedefler (To-Do)

- [ ] **Dinamik URL & Dynamic Routing (?sol=h2r&sag=r1):** Kullanıcıların yaptıkları karşılaştırmaları direkt link olarak paylaşabilmesi ve Google botlarının bu kombinasyonları indeksleyebilmesi için URL parametre okuyucu entegre edilecek.
- [ ] **SEO & Sitemap Entegrasyonu:** `sitemap.xml` ile popüler motor kombinasyonlarının Google aramalarında (Örn: "R25 vs Ninja 250") doğrudan listelenmesi sağlanacak.
- [ ] Çoklu resimler arası geçiş ve detaylı inceleme modu optimize edilecek.

---

### 📜 Lisans

Bu proje **Unlicense** lisansı altındadır. Herkes özgürce kullanabilir, kopyalayabilir, değiştirebilir ve geliştirebilir.
