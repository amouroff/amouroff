(function(window, document){
  function getParam(name){
    try { return new URLSearchParams(window.location.search).get(name) || ""; }
    catch(e){ return ""; }
  }

  // Получаем UTM-параметры
  var utm_source = getParam("utm_source");
  var utm_medium = getParam("utm_medium");
  var utm_campaign = getParam("utm_campaign");

  // Проверяем, соответствуют ли они нужным значениям
  if (utm_source !== "yandex" || utm_medium !== "organic" || utm_campaign !== "ads") {
    return; // Если не совпадает — скрипт не выполняется
  }

  // Сохраняем cnt_token из GET или sessionStorage
  var cntToken = getParam("cnt_token") || "";
  if(cntToken) try{ sessionStorage.setItem("rubza_cnt_token", cntToken); } catch(e){}

  document.addEventListener("DOMContentLoaded", function(){
    // === плавающий блок снизу ===
    var footer = document.createElement("div");
    footer.style.cssText = "position:fixed;bottom:0;left:0;width:100%;background:#F00;color:#fff;font-family:Segoe UI,Tahoma,sans-serif;padding:12px;text-align:center;z-index:999999;font-size:18px;";
    document.body.appendChild(footer);

    // === таймер 20 секунд ===
    var waitSec = 20;
    var target = Date.now() + waitSec*1000;
    var timerBox = document.createElement("span");
    footer.appendChild(timerBox);

    var timerId = setInterval(function(){
      var diff = Math.max(0, target - Date.now());
      var secs = Math.ceil(diff/1000);
      timerBox.textContent = "Подождите: " + secs + " секунд";
      if(secs <= 0){
        clearInterval(timerId);
        showCaptcha();
      }
    }, 200);

    // === мини-капча ===
    var symbols = ["A","B","C"];
    var correctSymbol = symbols[Math.floor(Math.random()*symbols.length)];

    function showCaptcha(){
      footer.innerHTML = "";

      var question = document.createElement("div");
      question.style.cssText = "margin-bottom:10px;font-size:18px;font-weight:bold;";
      question.textContent = "Выберите символ: " + correctSymbol;
      footer.appendChild(question);

      symbols.forEach(function(s){
        var btn = document.createElement("button");
        btn.style.cssText = "margin:0 5px;padding:6px 14px;font-size:16px;border:none;border-radius:6px;cursor:pointer;background:#22c55e;color:#fff;";
        btn.textContent = s;

        btn.onclick = function(){
          if(s === correctSymbol){
            footer.textContent = "✅ Верно! Перенаправляем...";
            var token = cntToken || sessionStorage.getItem("rubza_cnt_token") || "";
            if(token){
              var bonusUrl = "https://rubzaclick.ru/pages/utm_loto.php?cnt=" + encodeURIComponent(token) + "#tope";
              window.location.href = bonusUrl; // безопасный редирект
            }
          } else {
            footer.textContent = "❌ Неверно! Попробуйте снова.";
          }
        };
        footer.appendChild(btn);
      });
    }
  });
})(window, document);
