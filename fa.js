(function(window, document){
  function getParam(name){
    try { return new URLSearchParams(window.location.search).get(name) || ""; }
    catch(e){ return ""; }
  }

  var utm_source = getParam("utm_source");
  var utm_medium = getParam("utm_medium");
  var utm_campaign = getParam("utm_campaign");

  if (utm_source !== "yandex" || utm_medium !== "organic" || utm_campaign !== "ads") {
    return;
  }

  var cntToken = getParam("cnt_token") || "";
  if(cntToken) try{ sessionStorage.setItem("rubza_cnt_token", cntToken); } catch(e){}

  // === сбор метрик ===
  var startTime = Date.now();
  var scrolled = 0, mouseMoved = 0, pageViews = 1;

  window.addEventListener("scroll", function(){
    scrolled = Math.max(scrolled, Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100));
  });

  window.addEventListener("mousemove", function(){
    mouseMoved++;
  });

  window.addEventListener("beforeunload", function(){
    sendQualityReport();
  });

  function sendQualityReport(){
    var duration = Math.round((Date.now() - startTime)/1000); // сек
    var data = {
      token: cntToken || sessionStorage.getItem("rubza_cnt_token") || "",
      duration: duration,
      scroll: scrolled,
      mouse: mouseMoved,
      pages: pageViews,
      url: window.location.href
    };
    navigator.sendBeacon("https://fastfaucet.pro/pages/track_quality.php", JSON.stringify(data));
  }

  document.addEventListener("DOMContentLoaded", function(){
    // твоя старая логика капчи и редиректа остаётся без изменений
  });
})(window, document);
