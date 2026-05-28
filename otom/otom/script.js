// 1. ADIM: JSON verisini arka planda hafızaya alacak bir değişken tanımlıyoruz
let motorVerileri = {};

// 2. ADIM: Tarayıcının güvenliğini aşmak için data.json dosyasını fetch ile çekiyoruz
fetch('dataa.json')
    .then(response => response.json())
    .then(data => {
        motorVerileri = data; // Verileri başarıyla aldık, artık elimizde!
        console.log("Motor verileri yüklendi reis!", motorVerileri);
    })
    .catch(error => console.error("Veri çekilirken patladık:", error));

// 3. ADIM: HTML'deki elemanları cımbızla (id ile) seçiyoruz
const solInput = document.getElementById('left');
const sagInput = document.getElementById('right');

// 4. ADIM: Sol arama çubuğunda yazı yazıldıkça tetiklenecek fonksiyon
solInput.addEventListener('input', () => {
    // Kullanıcının yazdığı motor adını küçük harfe çeviriyoruz (R1 yazarsa r1 olsun diye)
    const secilenMotor = solInput.value.toLowerCase().trim();

    // Eğer yazdığı motor bizim JSON'da varsa özellikleri ekrana basıyoruz
    if (motorVerileri[secilenMotor]) {
        document.getElementById('sol-motor-hacmi').innerText = motorVerileri[secilenMotor].hacim;
        document.getElementById('sol-motor-gucu').innerText = motorVerileri[secilenMotor].beygir;
        document.getElementById('sol-agirlik').innerText = motorVerileri[secilenMotor].agirlik;
    }
});

// 5. ADIM: Sağ arama çubuğunda yazı yazıldıkça tetiklenecek fonksiyon
sagInput.addEventListener('input', () => {
    const secilenMotor = sagInput.value.toLowerCase().trim();

    if (motorVerileri[secilenMotor]) {
        document.getElementById('sag-motor-hacmi').innerText = motorVerileri[secilenMotor].hacim;
        document.getElementById('sag-motor-gucu').innerText = motorVerileri[secilenMotor].beygir;
        document.getElementById('sag-agirlik').innerText = motorVerileri[secilenMotor].agirlik;
    }
});