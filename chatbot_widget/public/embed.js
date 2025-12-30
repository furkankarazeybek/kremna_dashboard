(function () {
  // Kullanıcının sayfaya koyduğu ID'yi al
  const assistantId = window.KREMNA_ASSISTANT_ID;

  if (!assistantId) {
    console.error("Kremna Widget: Asistan ID bulunamadı!");
    return;
  }

  const iframe = document.createElement("iframe");

  // Placeholder, Docker build sırasında gerçek URL ile değişecek
  iframe.src = `__WIDGET_URL__/?assistantId=${assistantId}`;

  // --- KRİTİK AYARLAR ---
  // Başlangıçta SADECE butonun sığacağı kadar küçük bir alan açıyoruz.
  // Ve 'pointerEvents' değerini 'all' yapıyoruz ki tıklanabilsin.
  iframe.style.position = "fixed";
  iframe.style.bottom = "20px"; // Sayfanın en altından biraz yukarı
  iframe.style.right = "20px";  // Sayfanın en sağından biraz içeri
  iframe.style.width = "100px"; // Sadece buton genişliği
  iframe.style.height = "100px"; // Sadece buton yüksekliği
  iframe.style.border = "none";
  iframe.style.zIndex = "9999999"; // En üstte dursun
  iframe.style.pointerEvents = "all"; // ARTIK TIKLANABİLİR!
  iframe.style.background = "transparent"; // Arkaplan şeffaf
  iframe.style.transition = "all 0.3s ease"; // Büyürken animasyonlu olsun

  // Widget açılıp/kapanma mesajlarını dinle (App.jsx'ten gelen)
  window.addEventListener("message", (event) => {
    if (event.data.type === "KREMNA_WIDGET_RESIZE") {
      if (event.data.isOpen) {
        // Sohbet açıldığında büyüt
        iframe.style.width = "400px";
        iframe.style.height = "600px";
        iframe.style.bottom = "0"; // Tam oturması için
        iframe.style.right = "0";
      } else {
        // Sohbet kapandığında tekrar küçült (Buton haline dön)
        iframe.style.width = "100px";
        iframe.style.height = "100px";
        iframe.style.bottom = "20px";
        iframe.style.right = "20px";
      }
    }
  });

  document.body.appendChild(iframe);
})();