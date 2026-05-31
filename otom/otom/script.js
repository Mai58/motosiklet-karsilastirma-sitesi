// 1. ADIM: JSON verisini arka planda hafızaya alacak boş bir depo tanımlıyoruz
let motorVerileri = {};

// --- GALERİ VE SAYAÇ DEPOLARI ---
let solAktifIndeks = 0;
let sagAktifIndeks = 0;

// =======================================================
// 🔥 [YENİ] AKILLI KIYASLAMA ŞEMASI (METRİK DEPOSU)
// =======================================================
// Hangi özelliğin yüksek, hangisinin düşük olması gerektiğini burada belirliyoruz kral.
// "yuksek_iyi": true -> Sayı ne kadar büyükse o kadar iyi (Örn: Beygir)
// "yuksek_iyi": false -> Sayı ne kadar küçükse o kadar iyi (Örn: Ağırlık, Yakıt)
const kiyaslamaMetrikleri = {
    // Motor ve Performans
    "motor_hacmi": { yuksek_iyi: true },
    "beygir_gucu": { yuksek_iyi: true },
    "azami_tork": { yuksek_iyi: true },
    "max_hiz": { yuksek_iyi: true },
    "sifir_yuz": { yuksek_iyi: false }, // 0-100 saniyesi ne kadar azsa o kadar iyi!
    
    // Tüketim ve Ölçüler
    "yakit_tuketimi": { yuksek_iyi: false }, // Az yakan kazanır!
    "islak_agirlik": { yuksek_iyi: false }, // Hafif olan motor daha seridir, az olan kazanır!
    "sele_yuksekligi": { yuksek_iyi: false }, // Genelde yere yakınlık kontrolü kolaylaştırır (tercihe bağlı ama küçüğü seçtik)
    "depo_hacmi": { yuksek_iyi: true }, // Büyük depo = daha çok menzil
    
    // Garanti ve Fiyat (İleride eklersen diye altyapı hazır)
    "garanti_suresi": { yuksek_iyi: true }
};

// 2. ADIM: data.json dosyasını çekip depoya atıyoruz
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Dosya bulunamadı reis!");
        }
        return response.json();
    })
    .then(data => {
        motorVerileri = data;
        console.log("Motor verileri başarıyla yüklendi!", motorVerileri);
    })
    .catch(error => console.error("Veri çekilirken patladık:", error));

// 3. ADIM: HTML'deki elemanları senin HTML'ine göre cımbızla seçiyoruz
const solInput = document.getElementById('left');
const sagInput = document.getElementById('right');
const solOneriKutusu = document.getElementById('sol-oneriler');
const sagOneriKutusu = document.getElementById('sag-oneriler');

// --- RESİM VE LIGHTBOX ELEMENTLERİ ---
const solResimElementi = document.getElementById("resim-sol"); 
const sagResimElementi = document.getElementById("resim-sag"); 

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxKapat = document.getElementById("lightbox-kapat");

// --- MOTOR İSİM KUTULARINI SEÇİYORUZ ---
const solIsimElementi = document.getElementById("sol-motor-adi");
const sagIsimElementi = document.getElementById("sag-motor-adi");


// =======================================================
// 🔥 [YENİ] DİNAMİK VERİ BASMA FONKSİYONU
// =======================================================
function katmanliVerileriEkranaBas(yon, motorData) {
    if (!motorData) return;

    Object.keys(motorData).forEach(kategoriKey => {
        const kategoriIcerigi = motorData[kategoriKey];
        
        if (typeof kategoriIcerigi === 'object' && kategoriIcerigi !== null && !Array.isArray(kategoriIcerigi)) {
            Object.keys(kategoriIcerigi).forEach(ozellikKey => {
                let deger = kategoriIcerigi[ozellikKey];
                
                // HTML ID eşleşme istisnalarını yönetiyoruz
                let htmlId = `${yon}-${ozellikKey}`;
                if (ozellikKey === "motor_hacmi") htmlId = `${yon}-motor-hacmi`;
                if (ozellikKey === "islak_agirlik") htmlId = `${yon}-agirlik`;

                const element = document.getElementById(htmlId);
                
                if (element) {
                    // Varsayılan stilleri sıfırla (Kıyaslamadan önce temiz sayfa)
                    element.style.fontWeight = "normal";
                    element.style.color = "";

                    // Boolean (true/false) donanım verileri
                    if (deger === true) {
                        element.innerHTML = '<span style="color:#00ff66; font-weight:bold;">Var ✅</span>';
                    } else if (deger === false) {
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
// 🔥 [YENİ] CANAVAR KIYASLAMA MOTORU (KAZANANI KALIN YAPAR)
// =======================================================
function motorlariKiyasla() {
    // İki tarafın da girdilerini alıp JSON'da var mı bakıyoruz
    const solGiris = solInput.value.toLowerCase().trim();
    const sagGiris = sagInput.value.toLowerCase().trim();

    const solKey = Object.keys(motorVerileri).find(key => {
        const obj = motorVerileri[key];
        const tamAd = (obj.kimlik_bilgileri && obj.kimlik_bilgileri.tam_model_adi) ? obj.kimlik_bilgileri.tam_model_adi.toLowerCase() : "";
        return key.toLowerCase().trim() === solGiris || tamAd === solGiris;
    });

    const sagKey = Object.keys(motorVerileri).find(key => {
        const obj = motorVerileri[key];
        const tamAd = (obj.kimlik_bilgileri && obj.kimlik_bilgileri.tam_model_adi) ? obj.kimlik_bilgileri.tam_model_adi.toLowerCase() : "";
        return key.toLowerCase().trim() === sagGiris || tamAd === sagGiris;
    });

    // Eğer iki motor da seçilmediyse kıyaslama yapma, çık.
    if (!solKey || !sagKey) return;

    const solMotor = motorVerileri[solKey];
    const sagMotor = motorVerileri[sagKey];

    // Belirlediğimiz metrik kurallarına göre özellikleri kapıştırıyoruz
    Object.keys(kiyaslamaMetrikleri).forEach(ozellikKey => {
        const kural = kiyaslamaMetrikleri[ozellikKey];
        
        // HTML ID'lerini buluyoruz
        let solHtmlId = `sol-${ozellikKey}`;
        if (ozellikKey === "motor_hacmi") solHtmlId = `sol-motor-hacmi`;
        if (ozellikKey === "islak_agirlik") solHtmlId = `sol-agirlik`;

        let sagHtmlId = `sag-${ozellikKey}`;
        if (ozellikKey === "motor_hacmi") sagHtmlId = `sag-motor-hacmi`;
        if (ozellikKey === "islak_agirlik") sagHtmlId = `sag-agirlik`;

        const solElement = document.getElementById(solHtmlId);
        const sagElement = document.getElementById(sagHtmlId);

        if (solElement && sagElement) {
            // Metinlerin içindeki sayısal değerleri cımbızlıyoruz (Örn: "198 kg" -> 198, "4.2 lt" -> 4.2)
            const solSayi = parseFloat(solElement.innerText.replace(/[^0-9.,]/g, '').replace(',', '.'));
            const sagSayi = parseFloat(sagElement.innerText.replace(/[^0-9.,]/g, '').replace(',', '.'));

            // Eğer iki değer de geçerli bir sayıysa kıyaslamaya geç
            if (!isNaN(solSayi) && !isNaN(sagSayi)) {
                
                // Önce eski kalınlıkları sıfırla
                solElement.style.fontWeight = "normal";
                sagElement.style.fontWeight = "normal";
                solElement.style.color = "";
                sagElement.style.color = "";

                if (solSayi === sagSayi) return; // Eşitlerse ellemene gerek yok abi

                // Kazanma durumu kontrolü
                let solKazandi = false;
                if (kural.yuksek_iyi) {
                    solKazandi = solSayi > sagSayi;
                } else {
                    solKazandi = solSayi < sagSayi; // Düşük olan iyiyse (Ağırlık vb.)
                }

                // Kazananı class ile işaretle
                if (solKazandi) {
                    solElement.classList.add("kazanan-ozellik");
                    sagElement.classList.remove("kazanan-ozellik");
                } else {
                    sagElement.classList.add("kazanan-ozellik");
                    solElement.classList.remove("kazanan-ozellik");
                }
            }
        }
    });
}


// Ortak fonksiyon: Özellikleri, Resimleri ve Profesyonel İsimleri ekrana basar veya temizler
function ozellikleriGuncelle(yon, veri = null, profesyonelIsim = "") {
    const isimElementi = (yon === 'sol') ? solIsimElementi : sagIsimElementi;

    if (veri) {
        katmanliVerileriEkranaBas(yon, veri);
        
        if (isimElementi && profesyonelIsim) {
            const tamAd = (veri.kimlik_bilgileri && veri.kimlik_bilgileri.tam_model_adi) 
                          ? veri.kimlik_bilgileri.tam_model_adi 
                          : profesyonelIsim;
            isimElementi.innerText = tamAd; 
        }
        
        const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
        
        if (resimListesi && resimListesi.length > 0) {
            const aktifIndeks = (yon === 'sol') ? solAktifIndeks : sagAktifIndeks;
            if (yon === 'sol') {
                solResimElementi.src = resimListesi[aktifIndeks % resimListesi.length];
            } else {
                sagResimElementi.src = resimListesi[aktifIndeks % resimListesi.length];
            }
        } else {
            if (yon === 'sol') solResimElementi.src = "https://placehold.co/600x400?text=Görsel+Yok";
            else sagResimElementi.src = "https://placehold.co/600x400?text=Görsel+Yok";
        }

        // 🔥 Her veri güncellendiğinde iki kutu da dolu mu diye bak, doluysa kıyasla!
        motorlariKiyasla();

    } else {
        // --- Temizleme Modu ---
        const tumContentAlanlari = document.querySelectorAll(`[id^="${yon}-"]`);
        tumContentAlanlari.forEach(el => {
            if (el.classList.contains('content') || el.id.includes('hacmi') || el.id.includes('agirlik')) {
                el.innerText = "-";
                el.style.fontWeight = "normal";
                el.style.color = "";
            }
        });
        
        if (isimElementi) isimElementi.innerText = "-";
        if (yon === 'sol') solResimElementi.src = ""; else sagResimElementi.src = "";

        // Bir taraf silindiyse diğer tarafın kalan kalınlık stillerini de sıfırla
        const karsiYon = (yon === 'sol') ? 'sag' : 'sol';
        const karsiAlanlar = document.querySelectorAll(`[id^="${karsiYon}-"]`);
        karsiAlanlar.forEach(el => { el.style.fontWeight = "normal"; el.style.color = ""; });
    }
}

// --- GALERİ RESİM GÜNCELLEME MOTORLARI ---
function solGaleriGuncelle() {
    const girilenYazi = solInput.value.toLowerCase().trim();
    const orijinalIsim = Object.keys(motorVerileri).find(key => key.toLowerCase().trim() === girilenYazi);
    
    if (orijinalIsim && motorVerileri[orijinalIsim]) {
        const veri = motorVerileri[orijinalIsim];
        const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
        if (resimListesi && resimListesi.length > 0) {
            solResimElementi.src = resimListesi[solAktifIndeks % resimListesi.length];
        }
    }
}

function sagGaleriGuncelle() {
    const girilenYazi = sagInput.value.toLowerCase().trim();
    const orijinalIsim = Object.keys(motorVerileri).find(key => key.toLowerCase().trim() === girilenYazi);
    
    if (orijinalIsim && motorVerileri[orijinalIsim]) {
        const veri = motorVerileri[orijinalIsim];
        const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
        if (resimListesi && resimListesi.length > 0) {
            sagResimElementi.src = resimListesi[sagAktifIndeks % resimListesi.length];
        }
    }
}

// ==========================================
// 4. ADIM: SOL İNPUT VE KLAVYE DİNLEYİCİLERİ
// ==========================================
solInput.addEventListener('input', () => {
    const secilenMotor = solInput.value.toLowerCase().trim();
    solOneriKutusu.innerHTML = ""; 

    if (secilenMotor === "") {
        solAktifIndeks = 0; 
        ozellikleriGuncelle('sol');
        return;
    }

    Object.keys(motorVerileri).forEach(motorAdi => {
        if (motorAdi.toLowerCase().trim().includes(secilenMotor)) {
            const oneriElemani = document.createElement('div');
            const motorObjesi = motorVerileri[motorAdi];
            const gorunurAd = (motorObjesi.kimlik_bilgileri && motorObjesi.kimlik_bilgileri.tam_model_adi) 
                               ? motorObjesi.kimlik_bilgileri.tam_model_adi 
                               : motorAdi;
            
            oneriElemani.innerText = gorunurAd; 
            oneriElemani.style.padding = "10px";
            oneriElemani.style.cursor = "pointer";
            oneriElemani.classList.add('oneri-satiri');
            
            oneriElemani.addEventListener('mouseenter', () => {
                solAktifIndeks = 0; 
                ozellikleriGuncelle('sol', motorVerileri[motorAdi], motorAdi);
            });

            oneriElemani.addEventListener('mouseleave', () => {
                const mevcutGiris = solInput.value.toLowerCase().trim();
                if (mevcutGiris !== motorAdi.toLowerCase().trim() && mevcutGiris !== gorunurAd.toLowerCase().trim()) {
                    solAktifIndeks = 0;
                    ozellikleriGuncelle('sol');
                }
            });

            oneriElemani.addEventListener('click', () => {
                solInput.value = gorunurAd; 
                solOneriKutusu.innerHTML = ""; 
                solAktifIndeks = 0; 
                ozellikleriGuncelle('sol', motorVerileri[motorAdi], motorAdi);
            });

            solOneriKutusu.appendChild(oneriElemani);
        }
    });
});

solInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
        const ilkOneri = solOneriKutusu.querySelector('div');
        if (ilkOneri) {
            event.preventDefault();
            ilkOneri.click(); 
        }
    }
});

// ==========================================
// 5. ADIM: SAĞ İNPUT VE KLAVYE DİNLEYİCİLERİ
// ==========================================
sagInput.addEventListener('input', () => {
    const secilenMotor = sagInput.value.toLowerCase().trim();
    sagOneriKutusu.innerHTML = ""; 

    if (secilenMotor === "") {
        sagAktifIndeks = 0; 
        ozellikleriGuncelle('sag');
        return;
    }

    Object.keys(motorVerileri).forEach(motorAdi => {
        if (motorAdi.toLowerCase().trim().includes(secilenMotor)) {
            const oneriElemani = document.createElement('div');
            const motorObjesi = motorVerileri[motorAdi];
            const gorunurAd = (motorObjesi.kimlik_bilgileri && motorObjesi.kimlik_bilgileri.tam_model_adi) 
                               ? motorObjesi.kimlik_bilgileri.tam_model_adi 
                               : motorAdi;
            
            oneriElemani.innerText = gorunurAd;
            oneriElemani.style.padding = "10px";
            oneriElemani.style.cursor = "pointer";
            oneriElemani.classList.add('oneri-satiri');

            oneriElemani.addEventListener('mouseenter', () => {
                sagAktifIndeks = 0;
                ozellikleriGuncelle('sag', motorVerileri[motorAdi], motorAdi);
            });

            oneriElemani.addEventListener('mouseleave', () => {
                const mevcutGiris = sagInput.value.toLowerCase().trim();
                if (mevcutGiris !== motorAdi.toLowerCase().trim() && mevcutGiris !== gorunurAd.toLowerCase().trim()) {
                    sagAktifIndeks = 0;
                    ozellikleriGuncelle('sag');
                }
            });

            oneriElemani.addEventListener('click', () => {
                sagInput.value = gorunurAd;
                sagOneriKutusu.innerHTML = ""; 
                sagAktifIndeks = 0; 
                ozellikleriGuncelle('sag', motorVerileri[motorAdi], motorAdi);
            });

            sagOneriKutusu.appendChild(oneriElemani);
        }
    });
});

sagInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
        const ilkOneri = sagOneriKutusu.querySelector('div');
        if (ilkOneri) {
            event.preventDefault();
            ilkOneri.click(); 
        }
    }
});

// ==========================================
// 6. ADIM: SAĞ-SOL OK BUTONLARINA BAĞLANMA MOTORU
// ==========================================
const solKutuButonlari = document.querySelector(".img").querySelectorAll("button");
const solGeriBtn = solKutuButonlari[0]; 
const solIleriBtn = solKutuButonlari[1]; 

solIleriBtn.addEventListener("click", () => {
    const girilenYazi = solInput.value.toLowerCase().trim();
    const orijinalIsim = Object.keys(motorVerileri).find(key => {
        const obj = motorVerileri[key];
        const tamAd = (obj.kimlik_bilgileri && obj.kimlik_bilgileri.tam_model_adi) ? obj.kimlik_bilgileri.tam_model_adi.toLowerCase() : "";
        return key.toLowerCase().trim() === girilenYazi || tamAd === girilenYazi;
    });
    if (!orijinalIsim || !motorVerileri[orijinalIsim]) return;
    
    const veri = motorVerileri[orijinalIsim];
    const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
    if (resimListesi.length === 0) return;

    solAktifIndeks = (solAktifIndeks + 1) % resimListesi.length; 
    solGaleriGuncelle();
});

solGeriBtn.addEventListener("click", () => {
    const girilenYazi = solInput.value.toLowerCase().trim();
    const orijinalIsim = Object.keys(motorVerileri).find(key => {
        const obj = motorVerileri[key];
        const tamAd = (obj.kimlik_bilgileri && obj.kimlik_bilgileri.tam_model_adi) ? obj.kimlik_bilgileri.tam_model_adi.toLowerCase() : "";
        return key.toLowerCase().trim() === girilenYazi || tamAd === girilenYazi;
    });
    if (!orijinalIsim || !motorVerileri[orijinalIsim]) return;
    
    const veri = motorVerileri[orijinalIsim];
    const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
    if (resimListesi.length === 0) return;

    solAktifIndeks = (solAktifIndeks - 1 + resimListesi.length) % resimListesi.length; 
    solGaleriGuncelle();
});

const sagKutuButonlari = document.querySelector(".img-r").querySelectorAll("button");
const sagGeriBtn = sagKutuButonlari[0]; 
const sagIleriBtn = sagKutuButonlari[1]; 

sagIleriBtn.addEventListener("click", () => {
    const girilenYazi = sagInput.value.toLowerCase().trim();
    const orijinalIsim = Object.keys(motorVerileri).find(key => {
        const obj = motorVerileri[key];
        const tamAd = (obj.kimlik_bilgileri && obj.kimlik_bilgileri.tam_model_adi) ? obj.kimlik_bilgileri.tam_model_adi.toLowerCase() : "";
        return key.toLowerCase().trim() === girilenYazi || tamAd === girilenYazi;
    });
    if (!orijinalIsim || !motorVerileri[orijinalIsim]) return;
    
    const veri = motorVerileri[orijinalIsim];
    const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
    if (resimListesi.length === 0) return;

    sagAktifIndeks = (sagAktifIndeks + 1) % resimListesi.length;
    sagGaleriGuncelle();
});

sagGeriBtn.addEventListener("click", () => {
    const girilenYazi = sagInput.value.toLowerCase().trim();
    const orijinalIsim = Object.keys(motorVerileri).find(key => {
        const obj = motorVerileri[key];
        const tamAd = (obj.kimlik_bilgileri && obj.kimlik_bilgileri.tam_model_adi) ? obj.kimlik_bilgileri.tam_model_adi.toLowerCase() : "";
        return key.toLowerCase().trim() === girilenYazi || tamAd === girilenYazi;
    });
    if (!orijinalIsim || !motorVerileri[orijinalIsim]) return;
    
    const veri = motorVerileri[orijinalIsim];
    const resimListesi = (veri.medya_icerik && veri.medya_icerik.galeri) ? veri.medya_icerik.galeri : (veri.resimler || []);
    if (resimListesi.length === 0) return;

    sagAktifIndeks = (sagAktifIndeks - 1 + resimListesi.length) % resimListesi.length;
    sagGaleriGuncelle();
});

// ==========================================
// 7. ADIM: LIGHTBOX MOTORU
// ==========================================
solResimElementi.addEventListener("click", () => {
    if (solResimElementi.src && solResimElementi.src !== window.location.href && !solResimElementi.src.includes("placehold.co")) {
        lightbox.style.display = "flex";
        lightboxImg.src = solResimElementi.src; 
    }
});

sagResimElementi.addEventListener("click", () => {
    if (sagResimElementi.src && sagResimElementi.src !== window.location.href && !sagResimElementi.src.includes("placehold.co")) {
        lightbox.style.display = "flex";
        lightboxImg.src = sagResimElementi.src; 
    }
});

lightboxKapat.addEventListener("click", () => {
    lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
    }
});