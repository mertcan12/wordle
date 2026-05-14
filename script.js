let oyunBitti = false;
function mesajGoster(yazi, kazandi) {
  const kutu = document.getElementById("mesaj-kutu");
  const yaziEl = document.getElementById("mesaj-yazi");
  yaziEl.textContent = yazi;
  kutu.style.display = "block";

  const popup = document.getElementById("popup");
  const popupYazi = document.getElementById("popup-yazi");
  const popupBaslik = document.getElementById("popup-baslik");

  popupYazi.textContent = yazi;
  popupBaslik.textContent = kazandi ? "🎉 Tebrikler!" : "😔 Kaybettiniz!";
  popup.style.display = "flex";

  if (kazandi) konfetiBaslat();
}

function konfetiBaslat() {
  const canvas = document.getElementById("konfeti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const parcalar = [];
  const renkler = ["#6aaa64", "#c9b458", "#787c7e", "#ff6b6b", "#4ecdc4", "#ffe66d"];

  for (let i = 0; i < 150; i++) {
    parcalar.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 8 + 4,
      renk: renkler[Math.floor(Math.random() * renkler.length)],
      hiz: Math.random() * 3 + 2,
      salinti: Math.random() * 2 - 1
    });
  }

  function ciz() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parcalar.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.renk;
      ctx.fill();
      p.y += p.hiz;
      p.x += p.salinti;
      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(ciz);
  }
  ciz();
}
let animasyonDevam = false;

const KELIMELER = [
  "MASAL", "KALEM", "TOPUK", "YILAN", "BULUT",
  "DENIZ", "KAPAK", "MOTOR", "TAVAN", "SALON",
  "PERDE", "LIMON", "FENER", "ZAMAN", "KANAT",
  "BALIK", "TARAK", "YANAK", "BOYUN", "BILEK",
  "DUMAN", "ALTIN", "GUMUS", "DEMIR", "BAKIR",
  "ORMAN", "KONAK", "KEMER", "KOPRU", "TABAN",
  "DUVAR", "MARUL", "HAVUC", "TURPU", "ELMAS",
  "ASLAN", "KAZAN", "BAHAR", "RADAR", "TAKIM",
  "TABAK", "DOLAP", "RESIM", "KUZEY", "GUNEY",
  "KOYUN", "KARGA", "KAYIK", "TEKNE", "TAKSI",
  "PEMBE", "YESIL", "BEYAZ", "KAHVE", "SOGUK",
  "SICAK", "EKMEK", "NOHUT", "PILAV", "KEBAP",
  "KOFTE", "ARMUT", "KIRAZ", "KAVUN", "CEVIZ",
  "TAHTA", "SAMAN", "MAKAS", "YUZUK", "KOLYE",
  "KOPEK", "KOVAN", "TUZAK", "YATAK", "KADIN",
  "ERKEK", "COCUK", "BEBEK", "ARABA", "SABAH",
  "AKSAM", "OGLEN", "HAFTA", "TARAF", "YOLCU"
];

const KELIME = KELIMELER[Math.floor(Math.random() * KELIMELER.length)];
let aktifSatir = 0;
let aktifSutun = 0;

function tusRenkAta(tus, renk) {
  if (tus.style.backgroundColor === "#6aaa64") return;
  if (renk === "yesil") {
    tus.style.backgroundColor = "#6aaa64";
    tus.style.color = "white";
  } else if (renk === "sari" && tus.style.backgroundColor !== "#6aaa64") {
    tus.style.backgroundColor = "#c9b458";
    tus.style.color = "white";
  } else if (renk === "gri" && !tus.style.backgroundColor) {
    tus.style.backgroundColor = "#787c7e";
    tus.style.color = "white";
  }
}

function satiriAnimas(satirHucreleri, sonuclar, callback) {
  for (let i = 0; i < 5; i++) {
    const hucre = satirHucreleri[i];
    const renk = sonuclar[i];

    setTimeout(function() {
      hucre.style.transition = "transform 0.25s ease-in";
      hucre.style.transform = "rotateX(90deg)";

      setTimeout(function() {
        if (renk === "yesil") {
          hucre.style.backgroundColor = "#6aaa64";
          hucre.style.borderColor = "#6aaa64";
        } else if (renk === "sari") {
          hucre.style.backgroundColor = "#c9b458";
          hucre.style.borderColor = "#c9b458";
        } else {
          hucre.style.backgroundColor = "#787c7e";
          hucre.style.borderColor = "#787c7e";
        }
        hucre.style.color = "white";
        hucre.style.transition = "transform 0.25s ease-out";
        hucre.style.transform = "rotateX(0deg)";

        if (i === 4) {
          setTimeout(callback, 300);
        }
      }, 250);
    }, i * 300);
  }
}

document.addEventListener("keydown", function(e) {
  const harf = e.key.toUpperCase();
  if (oyunBitti) return;
  if (animasyonDevam) return;

  if (harf === "BACKSPACE") {
    if (aktifSutun > 0) {
      aktifSutun--;
      const hucre = document.querySelectorAll(".row")[aktifSatir]
                    .querySelectorAll(".cell")[aktifSutun];
      hucre.textContent = "";
    }
    return;
  }

  if (harf.length === 1 && harf >= "A" && harf <= "Z") {
    if (aktifSutun < 5) {
      const hucre = document.querySelectorAll(".row")[aktifSatir]
                    .querySelectorAll(".cell")[aktifSutun];
      hucre.textContent = harf;
      aktifSutun++;
    }
  }

  if (harf === "ENTER") {
    if (aktifSutun < 5) return;

    const satirHucreleri = document.querySelectorAll(".row")[aktifSatir]
                           .querySelectorAll(".cell");

    const sonuclar = Array(5).fill("gri");
    const kelimeKalan = KELIME.split("");
    const girilenKalan = [];

    for (let i = 0; i < 5; i++) {
      const girilen = satirHucreleri[i].textContent;
      if (girilen === KELIME[i]) {
        sonuclar[i] = "yesil";
        kelimeKalan[i] = null;
      } else {
        girilenKalan.push({ harf: girilen, index: i });
      }
    }

    for (const { harf, index } of girilenKalan) {
      const bul = kelimeKalan.indexOf(harf);
      if (bul !== -1) {
        sonuclar[index] = "sari";
        kelimeKalan[bul] = null;
      }
    }

    animasyonDevam = true;

    satiriAnimas(satirHucreleri, sonuclar, function() {
      for (let i = 0; i < 5; i++) {
        const tus = [...document.querySelectorAll(".tus")]
                    .find(t => t.textContent === satirHucreleri[i].textContent);
        if (tus) tusRenkAta(tus, sonuclar[i]);
      }

      const kazandi = [...satirHucreleri].every(
        (h, i) => h.textContent === KELIME[i]
      );

      animasyonDevam = false;

      if (kazandi) {
        oyunBitti = true;
        setTimeout(() => mesajGoster("Tebrikler! Kazandınız! 🎉", true), 300);
        return;
      }

      aktifSatir++;
      aktifSutun = 0;

      if (aktifSatir === 6) {
        oyunBitti = true;
        setTimeout(() => mesajGoster("Kaybettiniz! Kelime: " + KELIME, false), 300);
      }
    });
  }
});

document.querySelectorAll(".tus").forEach(function(tus) {
  tus.addEventListener("click", function() {
    const harf = tus.textContent;
    if (harf === "ENTER") {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    } else if (harf === "⌫") {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    } else {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: harf }));
    }
  });
});

document.getElementById("yeniOyun").addEventListener("click", function() {
  window.location.reload();
});