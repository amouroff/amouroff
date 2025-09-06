(function(window, document){
  // Генерим уникальный ID визита
  var visitId = sessionStorage.getItem("visit_id");
  if(!visitId){
    visitId = Date.now() + "_" + Math.random().toString(36).substr(2,6);
    sessionStorage.setItem("visit_id", visitId);
  }

  var cntToken = new URLSearchParams(location.search).get("cnt_token") || "";
  var startTime = Date.now();
  var maxScroll = 0;
  var mouseMoves = 0;

  // Метрики
  window.addEventListener("scroll", function(){
    var scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    maxScroll = Math.max(maxScroll, Math.round(scrolled));
  });

  window.addEventListener("mousemove", function(){ mouseMoves++; });

  function sendReport(final){
    var duration = Math.round((Date.now() - startTime)/1000);
    var payload = {
      visit_id: visitId,
      token: cntToken,
      duration: duration,
      scroll: maxScroll,
      mouse: mouseMoves,
      url: window.location.href,
      event: final ? "exit" : "interval"
    };

    navigator.sendBeacon(
      "https://fastfaucet.pro/pages/track_quality.php",
      JSON.stringify(payload)
    );
  }

  // Промежуточная отправка каждые 30 секунд
  setInterval(function(){ sendReport(false); }, 30000);

  // Финальная отправка при закрытии вкладки
  window.addEventListener("beforeunload", function(){ sendReport(true); });

})(window, document);
