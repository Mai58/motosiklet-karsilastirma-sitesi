// 1. ADIM: JSON verisini arka planda hafızaya alacak boş bir depo tanımlıyoruz
let motorVerileri = {};

// --- GALERİ VE SAYAÇ DEPOLARI ---
let solAktifIndeks = 0;
let sagAktifIndeks = 0;

// =======================================================
// 🔥 DEVASA KIYASLAMA ŞEMASI (METRİK DEPOSU)
// =======================================================
// yuksek_iyi: false -> Değeri küçük olan motor yeşil yanar (Örn: Tüketim, Hızlanma süresi, Ağırlık)
// yuksek_iyi: true  -> Değeri büyük olan motor yeşil yanar (Örn: Beygir, Tork, Depo)
const kiyaslamaMetrikleri = {
    // 📊 Performans ve Hız Verileri
    "max_hiz": { yuksek_iyi: true, tip: "sayi" },
    "hizlanma_0_100": { yuksek_iyi: false, tip: "sayi" },
    "80_120_hizlanma": { yuksek_iyi: false, tip: "sayi" },
    "100_200_hizlanma": { yuksek_iyi: false, tip: "sayi" },
    "son_hiz_test": { yuksek_iyi: true, tip: "sayi" },
    
    // ⚙️ Motor Bloku Verileri
    "motor_hacmi": { yuksek_iyi: true, tip: "sayi" },
    "beygir_gucu_hp": { yuksek_iyi: true, tip: "sayi" },
    "maks_tork_nm": { yuksek_iyi: true, tip: "sayi" },
    "silindir_sayisi": { yuksek_iyi: true, tip: "sayi" },
    "vites_sayisi": { yuksek_iyi: true, tip: "sayi" },

    // ⛽ Yakıt Tüketim Standartları (İstediğin Neon Yeşil Ayarları Burada)
    "sehir_ici_tuketim": { yuksek_iyi: false, tip: "sayi" },  // Az yakan kazanır!
    "sehir_disi_tuketim": { yuksek_iyi: false, tip: "sayi" }, // Az yakan kazanır!
    "karma_tuketim": { yuksek_iyi: false, tip: "sayi" },      // Az yakan kazanır!
    "tahmini_menzil": { yuksek_iyi: true, tip: "sayi" },     // Menzili çok olan kazanır!
    
    // ⚖️ Ölçü ve Hacimler
    "agirlik": { yuksek_iyi: false, tip: "sayi" },            // Hafif olan motor kazanır!
    "kuru_agirlik": { yuksek_iyi: false, tip: "sayi" },       // Hafif olan motor kazanır!
    "depo_hacmi": { yuksek_iyi: true, tip: "sayi" },

    // 💻 Elektronik Sürücü Asistanları (Var/Yok Kontrolü)
    "abs_sistemi": { yuksek_iyi: true, tip: "teknoloji" },
    "abs_viraj_destekli": { yuksek_iyi: true, tip: "teknoloji" },
    "viraj_abs": { yuksek_iyi: true, tip: "teknoloji" },
    "cekis_kontrol": { yuksek_iyi: true, tip: "teknoloji" },
    "viraj_cekis_kontrol": { yuksek_iyi: true, tip: "teknoloji" },
    "wheelie_control": { yuksek_iyi: true, tip: "teknoloji" },
    "launch_control": { yuksek_iyi: true, tip: "teknoloji" },
    "hiz_sabitleyici": { yuksek_iyi: true, tip: "teknoloji" },
    "adaptif_hiz_sabitleyici": { yuksek_iyi: true, tip: "teknoloji" },
    "surus_modlari": { yuksek_iyi: true, tip: "teknoloji" },
    "quickshifter_tipi": { yuksek_iyi: true, tip: "teknoloji" },
    
    // 🛠️ Konfor Donanımları
    "akilli_telefon_baglanti": { yuksek_iyi: true, tip: "teknoloji" },
    "anahtarsiz_calistirma": { yuksek_iyi: true, tip: "teknoloji" },
    "elcik_isitma": { yuksek_iyi: true, tip: "teknoloji" },
    "koltuk_isitma": { yuksek_iyi: true, tip: "teknoloji" },
    "lastik_basincli_sensor": { yuksek_iyi: true, tip: "teknoloji" }
};
// =======================================================
// 🗺️ HTML ID EŞLEME HARİTASI (GÜNCELLENDİ)
// =======================================================
const idHaritasi = {
    // Kimlik
    "marka": "marka", "model": "model", "tam_model_adi": "tam_model_adi", "versiyon": "versiyon", "segment": "segment", "uretim_durumu": "uretim_durumu", "ulke": "ulke",
    // Performans
    "max_hiz": "max_hiz", "hizlanma_0_100": "hizlanma_0_100", "80_120_hizlanma": "80_120_hizlanma", "100_200_hizlanma": "100_200_hizlanma", "son_hiz_test": "son_hiz_test", "guc_agirlik_orani": "guc_agirlik_orani", "tork_agirlik_orani": "tork_agirlik_orani", "yaklasik_fiyat": "yaklasik_fiyat",
    
    // 🪪 EHLİYET VE PROFİL BÖLÜMÜ (BURASI DÜZELTİLDİ 🎯)
    // JSON'daki anahtar kelimeler sırasıyla senin HTML'indeki ID'lere bağlanıyor:
"ehliyet seviyesi": "ehliyet_seviyesi", 
    "ehliyet_sinifi": "ehliyet_sinifi",
    "gerekli_ehliyet_sinifi": "ehliyet_sinifi",
    "gerekli_ehliyet": "ehliyet_sinifi",
    
    "offroad_uygun": "offroad_uygun", "uzun_yol_uygun": "uzun_yol_uygun", "sehir_ici_uygun": "sehir_ici_uygun", "boy_kisa_surucu_uygun": "boy_kisa_surucu_uygun",
    // Mekanik
    "motor_hacmi": "motor-hacmi", "beygir_gucu_hp": "beygir_gucu_hp", "guc_devri_rpm": "guc_devri_rpm", "maks_tork_nm": "maks_tork_nm", "tork_devri_rpm": "tork_devri_rpm", "uretici_guc_verisi": "uretici_guc_verisi", "uretici_tork_verisi": "uretici_tork_verisi", "silindir_sayisi": "silindir_sayisi", "silindir_dizilimi": "silindir_dizilimi", "zamanlama_tipi": "zamanlama_tipi", "supap_sayisi": "supap_sayisi", "eksantrik_tipi": "eksantrik_tipi", "cap_strok": "cap_strok", "sikistirma_orani": "sikistirma_orani", "sogutma_sistemi": "sogutma_sistemi", "yakit_besleme": "yakit_besleme", "gaz_kontrolu": "gaz_kontrolu", "atesleme_tipi": "atesleme_tipi", "yaglama_tipi": "yaglama_tipi", "euro_standardi": "euro_standardi", "co2_salinimi": "co2_salinimi",
    // Aktarma
    "vites_sayisi": "vites_sayisi", "sanziman_tipi": "sanziman_tipi", "son_aktarma": "son_aktarma", "debriyaj_yapisi": "debriyaj_yapisi", "kaydirmali_debriyaj": "kaydirmali_debriyaj", "zincir_ebati": "zincir_ebati",
    // Ölçüler
    "sele_yuksekligi": "sele_yuksekligi", "yolcu_sele_yuksekligi": "yolcu_sele_yuksekligi", "sele_genisligi": "sele_genisligi", "agirlik": "agirlik", "kuru_agirlik": "kuru_agirlik", "depo_hacmi": "depo_hacmi", "tahmini_menzil": "tahmini_menzil", "toplam_uzunluk": "toplam_uzunluk", "toplam_genislik": "toplam_genislik", "toplam_yukseklik": "toplam_yukseklik", "yerden_yukseklik": "yerden_yukseklik", "aks_mesafesi": "aks_mesafesi", "tasima_kapasitesi": "tasima_kapasitesi",
    // Tüketim
    "sehir_ici_tuketim": "sehir_ici_tuketim", "sehir_disi_tuketim": "sehir_disi_tuketim", "karma_tuketim": "karma_tuketim", "yillik_tahmini_yakit_maliyeti": "yillik_tahmini_yakit_maliyeti",
    // Yürüyen
    "on_suspansiyon": "on_suspansiyon", "on_suspansiyon_cap": "on_suspansiyon_cap", "on_suspansiyon_hareket": "on_suspansiyon_hareket", "on_suspansiyon_ayarlanabilirlik": "on_suspansiyon_ayarlanabilirlik", "arka_suspansiyon": "arka_suspansiyon", "arka_suspansiyon_ayarlanabilirlik": "arka_suspansiyon_ayarlanabilirlik", "suspansiyon_ayari_genel": "suspansiyon_ayari_genel", "on_fren_tipi": "on_fren_tipi", "on_fren_disk_sayisi": "on_fren_disk_sayisi", "on_disk_cap": "on_disk_cap", "on_kaliper_tipi": "on_kaliper_tipi", "arka_fren_tipi": "arka_fren_tipi", "arka_fren_disk_sayisi": "arka_fren_disk_sayisi", "arka_disk_cap": "arka_disk_cap", "kaster_acisi": "kaster_acisi", "iz_mesafesi": "iz_mesafesi",
    // Lastik
    "on_lastik_ebat": "on_lastik_ebat", "arka_lastik_ebat": "arka_lastik_ebat", "on_jant_olcusu": "on_jant_olcusu", "arka_jant_olcusu": "arka_jant_olcusu", "jant_malzemesi": "jant_malzemesi", "lastik_tipi": "lastik_tipi", "lastik_markasi": "lastik_markasi", "lastik_modeli": "lastik_modeli",
    // Elektronik Asistanlar
    "abs_sistemi": "abs_sistemi", "abs_viraj_destekli": "abs_viraj_destekli", "viraj_abs": "viraj_abs", "cekis_kontrol": "cekis_kontrol", "viraj_cekis_kontrol": "viraj_cekis_kontrol", "arka_kalkis_onleme": "arka_kalkis_onleme", "wheelie_control": "wheelie_control", "launch_control": "launch_control", "motor_fren_kontrol": "motor_fren_kontrol", "semi_aktif_suspansiyon": "semi_aktif_suspansiyon", "radar_sistemi": "radar_sistemi", "hiz_sabitleyici": "hiz_sabitleyici", "adaptif_hiz_sabitleyici": "adaptif_hiz_sabitleyici", "yokus_kalkis": "yokus_kalkis", "acil_fren_uyarisi": "acil_fren_uyarisi", "imu_sensoru": "imu_sensoru", "surus_modlari": "surus_modlari", "quickshifter_tipi": "quickshifter_tipi",
    // Konfor
    "gosterge_ekrani": "gosterge_ekrani", "ekran_boyutu": "ekran_boyutu", "akilli_telefon_baglanti": "akilli_telefon_baglanti", "aydinlatma_teknolojisi": "aydinlatma_teknolojisi", "viraj_aydinlatma": "viraj_aydinlatma", "anahtarsiz_calistirma": "anahtarsiz_calistirma", "usb_soketi": "usb_soketi", "elcik_isitma": "elcik_isitma", "koltuk_isitma": "koltuk_isitma", "lastik_basincli_sensor": "lastik_basincli_sensor", "kor_nokta_uyari": "kor_nokta_uyari", "ayarlanabilir_cam": "ayarlanabilir_cam", "geri_vites": "geri_vites", "ruzgar_koruma_seviyesi": "ruzgar_koruma_seviyesi", "yan_canta_destegi": "yan_canta_destegi", "ust_canta_destegi": "ust_canta_destegi", "orta_sehpa": "orta_sehpa"
};
// 2. ADIM: data.json dosyasını çekip depoya atıyoruz
fetch('data.json')
    .then(response => {
        if (!response.ok) throw new Error("Dosya bulunamadı reis!");
        return response.json();
    })
    .then(data => {
        motorVerileri = data;
        console.log("Motor verileri başarıyla yüklendi kral!", motorVerileri);
    })
    .catch(error => console.error("Veri çekilirken patladık:", error));

// 3. ADIM: HTML elemanlarını tanımlıyoruz
const solInput = document.getElementById('left');
const sagInput = document.getElementById('right');
const solOneriKutusu = document.getElementById('sol-oneriler');
const sagOneriKutusu = document.getElementById('sag-oneriler');
const solResimElementi = document.getElementById("resim-sol"); 
const sagResimElementi = document.getElementById("resim-sag"); 
const solIsimElementi = document.getElementById("sol-motor-adi");
const sagIsimElementi = document.getElementById("sag-motor-adi");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxKapat = document.getElementById("lightbox-kapat");

// =======================================================
// 🔥 KATMANLI VERİLERİ EKRANA BASMA MOTORU
// =======================================================
function katmanliVerileriEkranaBas(yon, motorData) {
    if (!motorData) return;

    Object.keys(motorData).forEach(kategoriKey => {
        const kategoriIcerigi = motorData[kategoriKey];
        
        if (typeof kategoriIcerigi === 'object' && kategoriIcerigi !== null && !Array.isArray(kategoriIcerigi)) {
            Object.keys(kategoriIcerigi).forEach(ozellikKey => {
                let deger = kategoriIcerigi[ozellikKey];
                let idSufix = idHaritasi[ozellikKey] || ozellikKey;
                let htmlId = `${yon}-${idSufix}`;

                const element = document.getElementById(htmlId);
                
                if (element) {
                    element.style.fontWeight = "normal";
                    element.style.color = "";

                    // Boolean (Var/Yok) Kontrolü
                    if (deger === true || String(deger).toLowerCase() === "var") {
                        element.innerHTML = '<span style="color:#00ff66; font-weight:bold;">Var ✅</span>';
                    } else if (deger === false || String(deger).toLowerCase() === "yok") {
                        element.innerHTML = '<span style="color:#ff3333; font-weight:bold;">Yok ❌</span>';
                    } else if (deger === "" || deger === "-") {
                        element.innerText = "-";
                    } else {
                        element.innerText = deger; 
                    }
                }
            });
        }
    });
}

// =======================================================
// 🔥 GELİŞMİŞ HİBRİT KIYASLAMA VE NEON YEŞİL YAKMA MOTORU
// =======================================================
function motorlariKiyasla() {
    const solGiris = solInput.value.toLowerCase().trim();
    const sagGiris = sagInput.value.toLowerCase().trim();

    if (!solGiris || !sagGiris) return;

    // Stilleri tamamen sıfırla
    Object.keys(idHaritasi).forEach(ozellikKey => {
        const idSufix = idHaritasi[ozellikKey];
        const solElement = document.getElementById(`sol-${idSufix}`);
        const sagElement = document.getElementById(`sag-${idSufix}`);
        if (solElement) { solElement.style.fontWeight = "normal"; solElement.style.color = ""; }
        if (sagElement) { sagElement.style.fontWeight = "normal"; sagElement.style.color = ""; }
    });

    // Ana kıyaslama döngüsü
    Object.keys(kiyaslamaMetrikleri).forEach(ozellikKey => {
        const kural = kiyaslamaMetrikleri[ozellikKey];
        const idSufix = idHaritasi[ozellikKey];

        const solElement = document.getElementById(`sol-${idSufix}`);
        const sagElement = document.getElementById(`sag-${idSufix}`);

        if (solElement && sagElement) {
            
            // 🚥 TEKNOLOJİK DONANIM KIYASLAMASI (Var/Yok)
            if (kural.tip === "teknoloji") {
                const solVarMi = solElement.innerHTML.includes("Var ✅");
                const sagVarMi = sagElement.innerHTML.includes("Var ✅");

                if (solVarMi && !sagVarMi) {
                    solElement.style.setProperty("font-weight", "900", "important");
                    solElement.style.setProperty("color", "#00ff88", "important");
                } else if (!solVarMi && sagVarMi) {
                    sagElement.style.setProperty("font-weight", "900", "important");
                    sagElement.style.setProperty("color", "#00ff88", "important");
                }
                return;
            }

            // 🔢 SAYISAL VERİ KIYASLAMASI (Yakıt Tüketimi, Beygir vs.)
            const solTemiz = solElement.innerText.replace(/[^0-9.,]/g, '').replace(',', '.');
            const sagTemiz = sagElement.innerText.replace(/[^0-9.,]/g, '').replace(',', '.');

            const solSayi = parseFloat(solTemiz);
            const sagSayi = parseFloat(sagTemiz);

            if (!isNaN(solSayi) && !isNaN(sagSayi)) {
                if (solSayi === sagSayi) return;

                let solKazandi = false;
                if (kural.yuksek_iyi) {
                    solKazandi = solSayi > sagSayi;
                } else {
                    solKazandi = solSayi < sagSayi; // Az olan iyi (Örn: Tüketimler)
                }

                if (solKazandi) {
                    solElement.style.setProperty("font-weight", "900", "important");
                    solElement.style.setProperty("color", "#00ff88", "important");
                } else {
                    sagElement.style.setProperty("font-weight", "900", "important");
                    sagElement.style.setProperty("color", "#00ff88", "important");
                }
            }
        }
    });
}

// =======================================================
// 🔄 EKRAN GÜNCELLEME ORTAK FONKSİYONU
// =======================================================
function ozellikleriGuncelle(yon, veri = null, profesyonelIsim = "") {
    const isimElementi = (yon === 'sol') ? solIsimElementi : sagIsimElementi;
    const resimElementi = (yon === 'sol') ? solResimElementi : sagResimElementi;

    if (veri) {
        katmanliVerileriEkranaBas(yon, veri);
        
        if (isimElementi) {
            const tamAd = (veri.kimlik_bilgileri && veri.kimlik_bilgileri.tam_model_adi) 
                          ? veri.kimlik_bilgileri.tam_model_adi 
                          : profesyonelIsim;
            isimElementi.innerText = tamAd; 
        }
        
        const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
        
        if (resimListesi && resimListesi.length > 0) {
            const aktifIndeks = (yon === 'sol') ? solAktifIndeks : sagAktifIndeks;
            resimElementi.src = resimListesi[aktifIndeks % resimListesi.length];
        } else {
            resimElementi.src = "https://placehold.co/600x400?text=Görsel+Yok";
        }

        motorlariKiyasla();

    } else {
        // Temizleme modu
        const tumContentAlanlari = document.querySelectorAll(`[id^="${yon}-"]`);
        tumContentAlanlari.forEach(el => {
            el.innerText = "-";
            el.style.fontWeight = "normal";
            el.style.color = "";
        });
        
        if (isimElementi) isimElementi.innerText = "-";
        if (resimElementi) resimElementi.src = "";

        motorlariKiyasla();
    }
}

// --- GALERİ DETAYLARI ---
function galeriYenile(yon) {
    const girdi = (yon === 'sol') ? solInput : sagInput;
    const girilenYazi = girdi.value.toLowerCase().trim();
    const orijinalIsim = Object.keys(motorVerileri).find(key => {
        const obj = motorVerileri[key];
        const tamAd = (obj.kimlik_bilgileri && obj.kimlik_bilgileri.tam_model_adi) ? obj.kimlik_bilgileri.tam_model_adi.toLowerCase() : "";
        return key.toLowerCase().trim() === girilenYazi || tamAd === girilenYazi;
    });
    
    if (orijinalIsim && motorVerileri[orijinalIsim]) {
        const veri = motorVerileri[orijinalIsim];
        const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
        const aktifIndeks = (yon === 'sol') ? solAktifIndeks : sagAktifIndeks;
        const resimElementi = (yon === 'sol') ? solResimElementi : sagResimElementi;
        if (resimListesi.length > 0) {
            resimElementi.src = resimListesi[aktifIndeks % resimListesi.length];
        }
    }
}

// 4. ADIM: İNPUT DİNLEYİCİLERİ VE ÖNERİ KUTULARI (HİBRİT YAPI)
[
    { yon: 'sol', input: solInput, kutu: solOneriKutusu },
    { yon: 'sag', input: sagInput, kutu: sagOneriKutusu }
].forEach(taraf => {
    taraf.input.addEventListener('input', () => {
        const secilenMotor = taraf.input.value.toLowerCase().trim();
        taraf.kutu.innerHTML = ""; 

        if (secilenMotor === "") {
            if (taraf.yon === 'sol') solAktifIndeks = 0; else sagAktifIndeks = 0;
            ozellikleriGuncelle(taraf.yon);
            return;
        }

        Object.keys(motorVerileri).forEach(motorAdi => {
            const motorObjesi = motorVerileri[motorAdi];
            const gorunurAd = (motorObjesi.kimlik_bilgileri && motorObjesi.kimlik_bilgileri.tam_model_adi) 
                               ? motorObjesi.kimlik_bilgileri.tam_model_adi 
                               : motorAdi;
            
            if (motorAdi.toLowerCase().trim().includes(secilenMotor) || gorunurAd.toLowerCase().trim().includes(secilenMotor)) {
                const oneriElemani = document.createElement('div');
                oneriElemani.innerText = gorunurAd; 
                oneriElemani.style.padding = "10px";
                oneriElemani.style.cursor = "pointer";
                oneriElemani.classList.add('oneri-satiri');
                
                oneriElemani.addEventListener('mouseenter', () => {
                    ozellikleriGuncelle(taraf.yon, motorVerileri[motorAdi], motorAdi);
                });

                oneriElemani.addEventListener('click', () => {
                    taraf.input.value = gorunurAd; 
                    taraf.kutu.innerHTML = ""; 
                    ozellikleriGuncelle(taraf.yon, motorVerileri[motorAdi], motorAdi);
                });

                taraf.kutu.appendChild(oneriElemani);
            }
        });
    });

    taraf.input.addEventListener('keydown', (event) => {
        if (event.key === "Enter" || event.key === "Tab") {
            const ilkOneri = taraf.kutu.querySelector('div');
            if (ilkOneri) {
                event.preventDefault();
                ilkOneri.click(); 
            }
        }
    });
});

// 5. ADIM: BUTON GALERİ TETİKLEYİCİLERİ
document.querySelector(".btn-left").addEventListener("click", () => {
    solAktifIndeks = (solAktifIndeks - 1 + 100) % 100; // Güvenli geri sarma
    galeriYenile('sol');
});
document.querySelector(".btn-right").addEventListener("click", () => {
    solAktifIndeks++;
    galeriYenile('sol');
});

// Sağ butonları tam hedefleme
const sagButonlar = document.querySelectorAll(".img-r button");
if(sagButonlar.length >= 2) {
    sagButonlar[0].addEventListener("click", () => { sagAktifIndeks = (sagAktifIndeks - 1 + 100) % 100; galeriYenile('sag'); });
    sagButonlar[1].addEventListener("click", () => { sagAktifIndeks++; galeriYenile('sag'); });
}

// 6. ADIM: LIGHTBOX
[solResimElementi, sagResimElementi].forEach(img => {
    if(img) {
        img.addEventListener("click", () => {
            if (img.src && !img.src.includes("placehold.co")) {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
            }
        });
    }
});
if(lightboxKapat) lightboxKapat.addEventListener("click", () => lightbox.style.display = "none");
if(lightbox) lightbox.addEventListener("click", (e) => { if(e.target === lightbox) lightbox.style.display = "none"; });