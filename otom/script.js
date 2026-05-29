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

// ==========================================
// 4. ADIM: SOL İNPUT DİNLEYİCİSİ
// ==========================================
solInput.addEventListener('input', () => {
    const secilenMotor = solInput.value.toLowerCase().trim();
    
    // Her harf yazıldığında önce eski listeyi temizle
    solOneriKutusu.innerHTML = ""; 

    if (secilenMotor === "") return;

    // JSON'daki motorların isimlerinde arama yapıyoruz
    Object.keys(motorVerileri).forEach(motorAdi => {
        if (motorAdi.startsWith(secilenMotor)) {
            // Havadan bir tıklama listesi elemanı yarat
            const oneriElemani = document.createElement('div');
            oneriElemani.innerText = motorAdi.toUpperCase();
            oneriElemani.style.padding = "10px";
            oneriElemani.style.cursor = "pointer";

            // Listeden bir motora tıklandığında:
            oneriElemani.addEventListener('click', () => {
                solInput.value = motorAdi.toUpperCase(); // İnputun içine adı yaz
                solOneriKutusu.innerHTML = ""; // Listeyi kapat
                
                // Özellikleri ekrana bas
                document.getElementById('sol-motor-hacmi').innerText = motorVerileri[motorAdi].hacim;
                document.getElementById('sol-motor-gucu').innerText = motorVerileri[motorAdi].beygir;
                document.getElementById('sol-agirlik').innerText = motorVerileri[motorAdi].agirlik;
            });

            solOneriKutusu.appendChild(oneriElemani);
        }
    });
});

// ==========================================
// 5. ADIM: SAĞ İNPUT DİNLEYİCİSİ
// ==========================================
sagInput.addEventListener('input', () => {
    const secilenMotor = sagInput.value.toLowerCase().trim();
    
    // Her harf yazıldığında önce eski listeyi temizle
    sagOneriKutusu.innerHTML = ""; 

    if (secilenMotor === "") return;

    Object.keys(motorVerileri).forEach(motorAdi => {
        if (motorAdi.startsWith(secilenMotor)) {
            const oneriElemani = document.createElement('div');
            oneriElemani.innerText = motorAdi.toUpperCase();
            oneriElemani.style.padding = "10px";
            oneriElemani.style.cursor = "pointer";

            oneriElemani.addEventListener('click', () => {
                sagInput.value = motorAdi.toUpperCase();
                sagOneriKutusu.innerHTML = "";
                
                document.getElementById('sag-motor-hacmi').innerText = motorVerileri[motorAdi].hacim;
                document.getElementById('sag-motor-gucu').innerText = motorVerileri[motorAdi].beygir;
                document.getElementById('sag-agirlik').innerText = motorVerileri[motorAdi].agirlik;
            });

            sagOneriKutusu.appendChild(oneriElemani);
        }
    });
});