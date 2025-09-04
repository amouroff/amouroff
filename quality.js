(function(window, document){
  function getParam(name){
    try { return new URLSearchParams(window.location.search).get(name) || ""; }
    catch(e){ return ""; }
  }

  // Берем токен
  var cntToken = getParam("cnt_token") || sessionStorage.getItem("rubza_cnt_token") || "";

  // Метрики
  var startTime = Date.now();
  var maxScroll = 0;
  var mouseMoves = 0;
  var clicks = 0;

  // Слушатели
  window.addEventListener("scroll", function(){
    var scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    maxScroll = Math.max(maxScroll, Math.round(scrolled));
  });

  window.addEventListener("mousemove", function(){ mouseMoves++; });
  window.addEventListener("click", function(){ clicks++; });

  // Отправка данных
  function sendReport(){
    var duration = Math.round((Date.now() - startTime)/1000);
    var payload = {
      token: cntToken,
      duration: duration,
      scroll: maxScroll,
      mouse: mouseMoves,
      clicks: clicks,
      url: window.location.href
    };

    // Отправляем через Beacon (работает при закрытии вкладки)
    navigator.sendBeacon(
      "https://fastfaucet.pro/pages/track_quality.php",
      JSON.stringify(payload)
    );
  }

  // каждые 30 сек + при закрытии
  setInterval(sendReport, 30000);
  window.addEventListener("beforeunload", sendReport);
})(window, document);
