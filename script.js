(function () {
  "use strict";

  /* =====================================================
     PENGATURAN: UBAH SESUAI KAFE KAMU
     ===================================================== */
  var CONFIG = {
    namaCafe: "Rumah Senja",
    nomorWA: "6281234567890",   // awali 62, tanpa + dan tanpa 0
    jamBuka: 8,
    jamTutup: 22,
    gratisMin: 100000,          // minimal belanja gratis ongkir (zona pertama)
    zona: [
      { nama: "Radius 0 – 2 km", ongkir: 5000 },
      { nama: "Radius 2 – 4 km", ongkir: 10000 },
      { nama: "Radius 4 – 6 km", ongkir: 15000 }
    ]
  };

  /* =====================================================
     DATA MENU  (foto bisa diganti file lokal: "foto/kopi.jpg")
     ===================================================== */
  function U(id) { return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=700&q=80"; }

  var KATEGORI = {
    kopi:    { nama: "Kopi",     emoji: "☕" },
    nonkopi: { nama: "Non-Kopi", emoji: "🍵" },
    makanan: { nama: "Makanan",  emoji: "🍝" },
    snack:   { nama: "Snack",    emoji: "🥐" },
    dessert: { nama: "Dessert",  emoji: "🍰" }
  };

  var MENU = [
    { id: 1,  nama: "Kopi Susu Gula Aren", harga: 22000, kat: "kopi", badge: "Best Seller", desk: "Espresso, susu segar, dan gula aren asli. Manisnya pas.", foto: U("1461023058943-07fcbe16d735") },
    { id: 2,  nama: "Americano", harga: 18000, kat: "kopi", desk: "Espresso double shot dengan air panas. Bold dan bersih.", foto: U("1447933601403-0c6688de566e") },
    { id: 3,  nama: "Cappuccino", harga: 25000, kat: "kopi", desk: "Espresso dengan susu steamed dan foam tebal yang lembut.", foto: U("1509042239860-f550ce710b93") },
    { id: 4,  nama: "Caramel Macchiato", harga: 30000, kat: "kopi", badge: "Baru", desk: "Vanila, susu, espresso, dan saus karamel buatan sendiri.", foto: U("1495474472287-4d71bcdd2085") },

    { id: 5,  nama: "Matcha Latte", harga: 27000, kat: "nonkopi", desk: "Matcha Jepang dengan susu creamy, tersedia panas atau dingin.", foto: U("1515823064-d6e0c04616a7") },
    { id: 6,  nama: "Choco Hazelnut", harga: 26000, kat: "nonkopi", desk: "Cokelat pekat dengan sirup hazelnut dan whipped cream.", foto: U("1542990253-0d0f5be5f0ed") },
    { id: 7,  nama: "Jus Jeruk Segar", harga: 20000, kat: "nonkopi", desk: "Jeruk peras asli tanpa tambahan gula.", foto: U("1600271886742-f049cd451bba") },

    { id: 8,  nama: "Nasi Goreng Senja", harga: 32000, kat: "makanan", badge: "Best Seller", desk: "Nasi goreng bumbu rempah, telur mata sapi, ayam suwir, dan kerupuk.", foto: U("1512058564366-18510be2db19") },
    { id: 9,  nama: "Spaghetti Carbonara", harga: 38000, kat: "makanan", desk: "Spaghetti saus krim keju dengan smoked beef dan jamur.", foto: U("1473093295043-cdd812d0e601") },
    { id: 10, nama: "Beef Burger Senja", harga: 45000, kat: "makanan", desk: "Patty sapi 150 gr, keju leleh, selada, dan saus rumahan.", foto: U("1568901346375-23c9450c58cd") },
    { id: 11, nama: "Chicken Curry Rice", harga: 36000, kat: "makanan", badge: "Pedas", desk: "Nasi hangat dengan kari ayam kental dan acar segar.", foto: U("1565557623262-b51c2513a641") },
    { id: 12, nama: "Chicken Steak", harga: 42000, kat: "makanan", desk: "Dada ayam panggang saus lada hitam, kentang, dan sayuran.", foto: U("1600891964092-4316c288032e") },

    { id: 13, nama: "French Fries", harga: 20000, kat: "snack", desk: "Kentang goreng renyah dengan saus sambal dan mayones.", foto: U("1573080496219-bb080dd4f877") },
    { id: 14, nama: "Croissant Butter", harga: 22000, kat: "snack", desk: "Croissant berlapis dipanggang tiap pagi, harum mentega.", foto: U("1555507036-ab1f4038808a") },
    { id: 15, nama: "Roti Bakar Cokelat Keju", harga: 20000, kat: "snack", desk: "Roti tebal bakar dengan cokelat leleh dan parutan keju.", foto: U("1484723091739-30a097e8f929") },

    { id: 16, nama: "Pancake Berry", harga: 30000, kat: "dessert", badge: "Baru", desk: "Pancake fluffy dengan buah beri, madu, dan es krim vanila.", foto: U("1567620905732-2d1ec7ab7445") },
    { id: 17, nama: "Chocolate Cake", harga: 28000, kat: "dessert", desk: "Kue cokelat lembut dengan ganache tebal. Teman ngopi terbaik.", foto: U("1578985545062-69928b1d9587") },
    { id: 18, nama: "Donut Glaze", harga: 18000, kat: "dessert", desk: "Donut empuk dengan glaze manis dan taburan warna-warni.", foto: U("1551024601-bec78aea704b") }
  ];

  var byId = {};
  MENU.forEach(function (m) { byId[m.id] = m; });

  /* =====================================================
     FUNGSI BANTU
     ===================================================== */
  function $(id) { return document.getElementById(id); }
  function rupiah(n) { return "Rp " + Number(n).toLocaleString("id-ID"); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function nomorValid(hp) { return String(hp).replace(/\D/g, "").length >= 9; }

  function tanggalLokal() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function bacaLS(k, bawaan) {
    try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : bawaan; }
    catch (e) { return bawaan; }
  }
  function tulisLS(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* abaikan */ }
  }

  // tampilkan error di layar agar mudah dilacak
  function tampilGalat(nama, err) {
    if (window.console) console.error("[" + nama + "]", err);
    var el = $("galat");
    if (!el) return;
    el.hidden = false;
    el.textContent = "Error di '" + nama + "': " + (err && err.message ? err.message : err);
  }

  // jalankan tiap bagian terpisah: satu gagal tidak mematikan yang lain
  function aman(nama, fn) {
    try { fn(); } catch (err) { tampilGalat(nama, err); }
  }

  // gambar gagal dimuat -> sembunyikan, placeholder emoji di belakangnya muncul
  document.addEventListener("error", function (e) {
    var el = e.target;
    if (el && el.tagName === "IMG") el.classList.add("gagal");
  }, true);

  /* =====================================================
     STATE
     ===================================================== */
  var state = { kat: "semua", q: "", mode: "antar", lokasi: "" };
  var cart = {};

  aman("memuat keranjang", function () {
    var raw = bacaLS("rs_cart", {});
    if (!raw || typeof raw !== "object") return;
    Object.keys(raw).forEach(function (k) {
      var id = Number(k), q = Math.floor(Number(raw[k]));
      if (byId[id] && q > 0) cart[id] = Math.min(q, 99);
    });
  });

  var dataPelanggan = bacaLS("rs_data", {});
  if (!dataPelanggan || typeof dataPelanggan !== "object") dataPelanggan = {};

  /* =====================================================
     TOAST & WHATSAPP
     ===================================================== */
  var timerToast;
  function toast(teks) {
    var t = $("toast");
    t.textContent = teks;
    t.classList.add("tampil");
    clearTimeout(timerToast);
    timerToast = setTimeout(function () { t.classList.remove("tampil"); }, 2400);
  }

  function bukaWA(pesan) {
    var url = "https://wa.me/" + CONFIG.nomorWA + "?text=" + encodeURIComponent(pesan);
    var w = window.open(url, "_blank");
    if (!w) window.location.href = url; // popup diblokir -> buka di tab ini
  }

  /* =====================================================
     MENU
     ===================================================== */
  function aksiHTML(id) {
    var q = cart[id];
    if (q) {
      return '<div class="qty">' +
        '<button data-aksi="kurang" data-id="' + id + '" aria-label="Kurangi">−</button>' +
        '<span>' + q + '</span>' +
        '<button data-aksi="tambah" data-id="' + id + '" aria-label="Tambah">+</button></div>';
    }
    return '<button class="btn-tambah" data-aksi="tambah" data-id="' + id + '">+ Tambah</button>';
  }

  function kartuHTML(m) {
    var kat = KATEGORI[m.kat] || { nama: m.kat, emoji: "🍽️" };
    return '<article class="kartu">' +
      '<div class="foto">' +
        '<span class="emo">' + kat.emoji + '</span>' +
        '<img src="' + m.foto + '" alt="' + m.nama + '" loading="lazy">' +
        '<span class="tag">' + kat.nama + '</span>' +
        (m.badge ? '<span class="badge">' + m.badge + '</span>' : '') +
      '</div>' +
      '<div class="kartu-isi">' +
        '<h3>' + m.nama + '</h3>' +
        '<p>' + m.desk + '</p>' +
        '<div class="kartu-bawah">' +
          '<span class="harga">' + rupiah(m.harga) + '</span>' +
          '<div class="aksi" data-id="' + m.id + '">' + aksiHTML(m.id) + '</div>' +
        '</div>' +
      '</div></article>';
  }

  function renderMenu() {
    var q = state.q;
    var hasil = MENU.filter(function (m) {
      var cocokKat = state.kat === "semua" || m.kat === state.kat;
      var cocokCari = (m.nama + " " + m.desk).toLowerCase().indexOf(q) !== -1;
      return cocokKat && cocokCari;
    });
    $("grid-menu").innerHTML = hasil.map(kartuHTML).join("");
    $("menu-kosong").hidden = hasil.length > 0;
  }

  function sinkronKartu() {
    var els = document.querySelectorAll(".aksi");
    for (var i = 0; i < els.length; i++) {
      els[i].innerHTML = aksiHTML(Number(els[i].getAttribute("data-id")));
    }
  }

  /* =====================================================
     KERANJANG
     ===================================================== */
  function ubah(id, delta) {
    if (!byId[id]) return;
    var sekarang = (cart[id] || 0) + delta;
    if (sekarang <= 0) delete cart[id];
    else cart[id] = Math.min(sekarang, 99);

    if (delta > 0 && sekarang === 1) toast(byId[id].nama + " ditambahkan 🛒");

    tulisLS("rs_cart", cart);
    renderCart();
    sinkronKartu();
  }

  function zonaIndex() {
    var i = parseInt($("p-zona").value, 10);
    return (i >= 0 && i < CONFIG.zona.length) ? i : 0;
  }

  function hitung() {
    var sub = 0, jumlah = 0;
    Object.keys(cart).forEach(function (k) {
      var m = byId[k];
      if (m) { sub += m.harga * cart[k]; jumlah += cart[k]; }
    });
    var ongkir = 0, gratis = false;
    if (state.mode === "antar" && sub > 0) {
      var z = zonaIndex();
      gratis = z === 0 && sub >= CONFIG.gratisMin;
      ongkir = gratis ? 0 : CONFIG.zona[z].ongkir;
    }
    return { sub: sub, jumlah: jumlah, ongkir: ongkir, gratis: gratis, total: sub + ongkir };
  }

  function renderCart() {
    var ids = Object.keys(cart);
    var wadah = $("isi-keranjang");

    if (!ids.length) {
      wadah.innerHTML = '<p class="kosong">Keranjang masih kosong.<br>Yuk pilih menu favoritmu dulu ☕</p>';
    } else {
      wadah.innerHTML = ids.map(function (k) {
        var m = byId[k], q = cart[k];
        var emo = (KATEGORI[m.kat] || {}).emoji || "🍽️";
        return '<div class="item-keranjang">' +
          '<div class="thumb">' + emo + '<img src="' + m.foto + '" alt="' + m.nama + '"></div>' +
          '<div class="item-info"><h4>' + m.nama + '</h4><span>' + rupiah(m.harga * q) + '</span></div>' +
          '<div class="qty">' +
            '<button data-aksi="kurang" data-id="' + m.id + '" aria-label="Kurangi">−</button>' +
            '<span>' + q + '</span>' +
            '<button data-aksi="tambah" data-id="' + m.id + '" aria-label="Tambah">+</button>' +
          '</div></div>';
      }).join("");
    }

    var h = hitung();
    $("subtotal").textContent = rupiah(h.sub);
    $("ongkir").textContent = state.mode === "ambil" ? "-" : (h.gratis ? "GRATIS" : rupiah(h.ongkir));
    $("total-harga").textContent = rupiah(h.total);
    $("badge").textContent = h.jumlah;

    $("fab").hidden = h.jumlah === 0;
    $("fab-info").textContent = h.jumlah + " item • " + rupiah(h.sub);

    var capai = h.sub >= CONFIG.gratisMin;
    var kotak = $("gratis");
    kotak.hidden = state.mode !== "antar" || h.sub === 0;
    kotak.classList.toggle("sukses", capai);
    $("bar").style.width = Math.min(100, (h.sub / CONFIG.gratisMin) * 100) + "%";
    $("teks-gratis").textContent = capai
      ? "🎉 Selamat! Gratis ongkir untuk radius 0 – 2 km"
      : "Belanja " + rupiah(CONFIG.gratisMin - h.sub) + " lagi untuk gratis ongkir (radius 0 – 2 km)";
  }

  function bukaPanel() {
    $("panel").classList.add("buka");
    $("overlay").classList.add("tampil");
    document.body.style.overflow = "hidden";
  }
  function tutupPanel() {
    $("panel").classList.remove("buka");
    $("overlay").classList.remove("tampil");
    document.body.style.overflow = "";
  }

  /* =====================================================
     FORM PESANAN
     ===================================================== */
  function isiZona() {
    $("p-zona").innerHTML = CONFIG.zona.map(function (z, i) {
      return '<option value="' + i + '">' + z.nama + ' (' + rupiah(z.ongkir) + ')</option>';
    }).join("");
  }

  function muatData() {
    $("p-nama").value = dataPelanggan.nama || "";
    $("p-hp").value = dataPelanggan.hp || "";
    $("p-alamat").value = dataPelanggan.alamat || "";
    var z = parseInt(dataPelanggan.zona, 10);
    if (z >= 0 && z < CONFIG.zona.length) $("p-zona").value = String(z);
    if (dataPelanggan.bayar) $("p-bayar").value = dataPelanggan.bayar;
  }

  function simpanData() {
    dataPelanggan = {
      nama: $("p-nama").value, hp: $("p-hp").value, alamat: $("p-alamat").value,
      zona: $("p-zona").value, bayar: $("p-bayar").value
    };
    tulisLS("rs_data", dataPelanggan);
  }

  function salah(id, pesan) {
    toast(pesan);
    var el = $(id);
    el.classList.add("salah");
    el.focus();
  }

  function kodePesanan() {
    var d = new Date();
    return "RS-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) +
           "-" + pad(d.getHours()) + pad(d.getMinutes());
  }

  function kirimPesanan() {
    var salahEls = document.querySelectorAll(".field.salah");
    for (var i = 0; i < salahEls.length; i++) salahEls[i].classList.remove("salah");

    var ids = Object.keys(cart);
    if (!ids.length) return toast("Keranjang masih kosong");

    var nama = $("p-nama").value.trim();
    var hp = $("p-hp").value.trim();
    var alamat = $("p-alamat").value.trim();

    if (!nama) return salah("p-nama", "Nama wajib diisi");
    if (!nomorValid(hp)) return salah("p-hp", "Nomor WhatsApp belum benar");
    if (state.mode === "antar" && alamat.length < 10) return salah("p-alamat", "Alamat pengantaran belum lengkap");

    var h = hitung();
    var zona = CONFIG.zona[zonaIndex()];
    var catatan = $("p-catatan").value.trim();
    var garis = "━━━━━━━━━━━━━━\n";

    var p = "*PESANAN BARU - " + CONFIG.namaCafe.toUpperCase() + "*\n";
    p += "No: " + kodePesanan() + "\n" + garis;
    p += "*Nama:* " + nama + "\n";
    p += "*No. HP:* " + hp + "\n";
    p += "*Tipe:* " + (state.mode === "antar" ? "Diantar" : "Ambil sendiri") + "\n";
    if (state.mode === "antar") {
      p += "*Alamat:* " + alamat + "\n";
      p += "*Area:* " + zona.nama + "\n";
      if (state.lokasi) p += "*Lokasi:* " + state.lokasi + "\n";
    }
    p += garis + "*Pesanan:*\n";
    ids.forEach(function (k, i) {
      var m = byId[k];
      p += (i + 1) + ". " + m.nama + " x" + cart[k] + " = " + rupiah(m.harga * cart[k]) + "\n";
    });
    p += garis;
    p += "Subtotal: " + rupiah(h.sub) + "\n";
    if (state.mode === "antar") p += "Ongkir: " + (h.gratis ? "GRATIS" : rupiah(h.ongkir)) + "\n";
    p += "*TOTAL: " + rupiah(h.total) + "*\n\n";
    p += "*Pembayaran:* " + $("p-bayar").value + "\n";
    if (catatan) p += "*Catatan:* " + catatan + "\n";
    p += "\nTerima kasih, mohon dikonfirmasi ya 🙏";

    bukaWA(p);
    toast("Membuka WhatsApp...");
  }

  /* =====================================================
     STATUS BUKA / TUTUP
     ===================================================== */
  function cekBuka() {
    var j = new Date().getHours(), b = CONFIG.jamBuka, t = CONFIG.jamTutup;
    return b < t ? (j >= b && j < t) : (j >= b || j < t);
  }
  function perbaruiStatus() {
    var buka = cekBuka();
    var els = document.querySelectorAll("[data-status]");
    for (var i = 0; i < els.length; i++) {
      els[i].classList.toggle("buka", buka);
      els[i].classList.toggle("tutup", !buka);
      els[i].textContent = buka
        ? "● Buka sekarang • sampai " + pad(CONFIG.jamTutup) + ".00"
        : "● Tutup • buka lagi pukul " + pad(CONFIG.jamBuka) + ".00 (pesanan tetap bisa dikirim)";
    }
  }

  /* =====================================================
     INISIALISASI  (menu dirender PERTAMA)
     ===================================================== */
  aman("menu", renderMenu);
  aman("keranjang", function () { isiZona(); muatData(); renderCart(); });
  aman("status buka", function () { perbaruiStatus(); setInterval(perbaruiStatus, 60000); });

  // aktifkan animasi scroll hanya setelah menu aman
  aman("animasi scroll", function () {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js");
    var io = new IntersectionObserver(function (entri) {
      entri.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("tampil"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1 });
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
    // pengaman: jika observer macet, tampilkan semua setelah 4 detik
    setTimeout(function () {
      for (var j = 0; j < els.length; j++) els[j].classList.add("tampil");
    }, 4000);
  });

  /* =====================================================
     EVENT
     ===================================================== */
  aman("event navbar", function () {
    var header = $("header"), nav = $("nav");
    var links = nav.querySelectorAll("a");
    var sections = [];
    for (var i = 0; i < links.length; i++) {
      var s = document.querySelector(links[i].getAttribute("href"));
      if (s) sections.push({ el: s, link: links[i] });
    }

    function onScroll() {
      header.classList.toggle("scroll", window.scrollY > 60 || nav.classList.contains("buka"));
      var pos = window.scrollY + 140, aktif = null;
      sections.forEach(function (x) { if (x.el.offsetTop <= pos) aktif = x; });
      sections.forEach(function (x) { x.link.classList.toggle("aktif", x === aktif); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    $("hamburger").addEventListener("click", function () { nav.classList.toggle("buka"); onScroll(); });
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener("click", function () { nav.classList.remove("buka"); onScroll(); });
    }
  });

  aman("event menu", function () {
    $("filter").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var semua = document.querySelectorAll("#filter button");
      for (var i = 0; i < semua.length; i++) semua[i].classList.remove("aktif");
      b.classList.add("aktif");
      state.kat = b.getAttribute("data-kat");
      renderMenu();
    });

    $("cari").addEventListener("input", function (e) {
      state.q = e.target.value.trim().toLowerCase();
      renderMenu();
    });

    // tombol tambah / kurang (kartu menu & keranjang)
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-aksi]");
      if (!b) return;
      ubah(Number(b.getAttribute("data-id")), b.getAttribute("data-aksi") === "tambah" ? 1 : -1);
    });
  });

  aman("event keranjang", function () {
    $("buka-keranjang").addEventListener("click", bukaPanel);
    $("fab").addEventListener("click", bukaPanel);
    $("tutup-keranjang").addEventListener("click", tutupPanel);
    $("overlay").addEventListener("click", tutupPanel);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") tutupPanel(); });

    $("tipe").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var semua = document.querySelectorAll("#tipe button");
      for (var i = 0; i < semua.length; i++) semua[i].classList.remove("aktif");
      b.classList.add("aktif");
      state.mode = b.getAttribute("data-tipe");
      $("blok-antar").hidden = state.mode !== "antar";
      renderCart();
    });

    ["p-nama", "p-hp", "p-alamat", "p-bayar"].forEach(function (id) {
      $(id).addEventListener("input", function () { $(id).classList.remove("salah"); simpanData(); });
      $(id).addEventListener("change", simpanData);
    });
    $("p-zona").addEventListener("change", function () { simpanData(); renderCart(); });

    $("btn-lokasi").addEventListener("click", function () {
      var btn = $("btn-lokasi");
      if (!navigator.geolocation) return toast("Browser tidak mendukung fitur lokasi");
      btn.disabled = true;
      btn.textContent = "Mencari lokasi...";
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          state.lokasi = "https://maps.google.com/?q=" + pos.coords.latitude + "," + pos.coords.longitude;
          btn.textContent = "✓ Lokasi tersimpan";
          btn.classList.add("ok");
          btn.disabled = false;
        },
        function () {
          state.lokasi = "";
          btn.textContent = "📍 Gunakan lokasi saya";
          btn.classList.remove("ok");
          btn.disabled = false;
          toast("Lokasi tidak bisa diakses, isi alamat manual ya");
        },
        { timeout: 10000 }
      );
    });

    $("btn-wa").addEventListener("click", kirimPesanan);
  });

  aman("reservasi", function () {
    $("r-tanggal").min = tanggalLokal();

    $("form-reservasi").addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = $("r-nama").value.trim();
      var hp = $("r-hp").value.trim();
      var tgl = $("r-tanggal").value;
      var jam = $("r-jam").value;

      if (!nama) return toast("Nama wajib diisi");
      if (!nomorValid(hp)) return toast("Nomor WhatsApp belum benar");
      if (!tgl || !jam) return toast("Pilih tanggal dan jam dulu");

      var t = tgl.split("-").map(Number), w = jam.split(":").map(Number);
      if (new Date(t[0], t[1] - 1, t[2], w[0], w[1]) < new Date()) return toast("Waktu reservasi sudah lewat");
      if (w[0] < CONFIG.jamBuka || w[0] >= CONFIG.jamTutup) {
        return toast("Reservasi hanya pukul " + pad(CONFIG.jamBuka) + ".00 – " + pad(CONFIG.jamTutup) + ".00");
      }

      var tanggal = new Date(t[0], t[1] - 1, t[2]).toLocaleDateString("id-ID",
        { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      var catatan = $("r-catatan").value.trim();

      var p = "*RESERVASI MEJA - " + CONFIG.namaCafe.toUpperCase() + "*\n━━━━━━━━━━━━━━\n";
      p += "*Nama:* " + nama + "\n*No. HP:* " + hp + "\n";
      p += "*Tanggal:* " + tanggal + "\n*Jam:* " + jam + " WIB\n";
      p += "*Jumlah tamu:* " + $("r-orang").value + " orang\n*Area:* " + $("r-area").value + "\n";
      if (catatan) p += "*Catatan:* " + catatan + "\n";
      p += "\nMohon konfirmasi ketersediaan meja ya 🙏";

      bukaWA(p);
      toast("Membuka WhatsApp...");
    });
  });

  aman("link whatsapp", function () {
    var link = "https://wa.me/" + CONFIG.nomorWA + "?text=" +
      encodeURIComponent("Halo " + CONFIG.namaCafe + ", saya mau tanya...");
    $("wa-float").href = link;
    $("wa-tanya").href = link;
  });

})();
```

---
