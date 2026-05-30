// 1. ADIM: JSON verisini arka planda hafızaya alacak boş bir depo tanımlıyoruz
let motorVerileri = {};

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

// 3. ADIM: HTML'deki elemanları cımbızla seçiyoruz
const solInput = document.getElementById('left');
const sagInput = document.getElementById('right');
const solOneriKutusu = document.getElementById('sol-oneriler');
const sagOneriKutusu = document.getElementById('sag-oneriler');

// Ortak fonksiyon: Özellikleri ekrana basar veya temizler
function ozellikleriGuncelle(yon, veri = null) {
    if (veri) {
        document.getElementById(`${yon}-motor-hacmi`).innerText = veri.hacim;
        document.getElementById(`${yon}-motor-gucu`).innerText = veri.beygir;
        document.getElementById(`${yon}-agirlik`).innerText = veri.agirlik;
    } else {
        document.getElementById(`${yon}-motor-hacmi`).innerText = "-";
        document.getElementById(`${yon}-motor-gucu`).innerText = "-";
        document.getElementById(`${yon}-agirlik`).innerText = "-";
    }
}

// ==========================================
// 4. ADIM: SOL İNPUT VE KLAVYE DİNLEYİCİLERİ
// ==========================================
solInput.addEventListener('input', () => {
    const secilenMotor = solInput.value.toLowerCase().trim();
    solOneriKutusu.innerHTML = ""; 

    if (secilenMotor === "") {
        ozellikleriGuncelle('sol');
        return;
    }

    Object.keys(motorVerileri).forEach(motorAdi => {
        if (motorAdi.startsWith(secilenMotor)) {
            const oneriElemani = document.createElement('div');
            oneriElemani.innerText = motorAdi.toUpperCase();
            oneriElemani.style.padding = "10px";
            oneriElemani.style.cursor = "pointer";

            // Fare üzerine gelince: Geçici ön izleme yap
            oneriElemani.addEventListener('mouseenter', () => {
                ozellikleriGuncelle('sol', motorVerileri[motorAdi]);
            });

            // Fare üzerinden çekilince: Eğer tıklanmadıysa temizle
            oneriElemani.addEventListener('mouseleave', () => {
                if (solInput.value.toLowerCase().trim() !== motorAdi) {
                    ozellikleriGuncelle('sol');
                }
            });

            // Tıklayınca: Kalıcı olarak kilitle ve listeyi kapat
            oneriElemani.addEventListener('click', () => {
                solInput.value = motorAdi.toUpperCase();
                solOneriKutusu.innerHTML = ""; 
                ozellikleriGuncelle('sol', motorVerileri[motorAdi]);
            });

            solOneriKutusu.appendChild(oneriElemani);
        }
    });
});

// Sol taraf için Enter ve Tab kontrolü
solInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
        const ilkOneri = solOneriKutusu.querySelector('div');
        if (ilkOneri) {
            event.preventDefault();
            ilkOneri.click(); // En üstteki öneriye kalıcı olarak tıkla
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
        ozellikleriGuncelle('sag');
        return;
    }

    Object.keys(motorVerileri).forEach(motorAdi => {
        if (motorAdi.startsWith(secilenMotor)) {
            const oneriElemani = document.createElement('div');
            oneriElemani.innerText = motorAdi.toUpperCase();
            oneriElemani.style.padding = "10px";
            oneriElemani.style.cursor = "pointer";

            // Fare üzerine gelince
            oneriElemani.addEventListener('mouseenter', () => {
                ozellikleriGuncelle('sag', motorVerileri[motorAdi]);
            });

            // Fare çekilince
            oneriElemani.addEventListener('mouseleave', () => {
                if (sagInput.value.toLowerCase().trim() !== motorAdi) {
                    ozellikleriGuncelle('sag');
                }
            });

            // Tıklayınca
            oneriElemani.addEventListener('click', () => {
                sagInput.value = motorAdi.toUpperCase();
                sagOneriKutusu.innerHTML = ""; 
                ozellikleriGuncelle('sag', motorVerileri[motorAdi]);
            });

            sagOneriKutusu.appendChild(oneriElemani);
        }
    });
});

// Sağ taraf için Enter ve Tab kontrolü
sagInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
        const ilkOneri = sagOneriKutusu.querySelector('div');
        if (ilkOneri) {
            event.preventDefault();
            ilkOneri.click(); // En üstteki öneriye kalıcı olarak tıkla
        }
    }
});