(function(window, document){
  function getParam(name){
    try { return new URLSearchParams(window.location.search).get(name) || ""; }
    catch(e){ return ""; }
  }

  // --- UTM фильтр ---
  var utm_source = getParam("utm_source");
  var utm_medium = getParam("utm_medium");
  var utm_campaign = getParam("utm_campaign");
  if (utm_source !== "yandex" || utm_medium !== "organic" || utm_campaign !== "search") {
    return;
  }

  // --- Сохраняем cnt_token ---
  var cntToken = getParam("cnt_token") || "";
  if (cntToken) { try { sessionStorage.setItem("rubza_cnt_token", cntToken); } catch(e){} }

  document.addEventListener("DOMContentLoaded", function(){
    var footer = document.createElement("div");
    footer.style.cssText = "position:fixed;bottom:0;left:0;width:100%;background:#F00;color:#fff;font-family:Segoe UI,Tahoma,sans-serif;padding:12px;text-align:center;z-index:999999;font-size:18px;";
    document.body.appendChild(footer);

    // === Шаг 1. Таймер ожидания 20 сек ===
    var waitSec = 20;
    var target = Date.now() + waitSec*1000;
    var timerBox = document.createElement("span");
    footer.appendChild(timerBox);

    var timerId = setInterval(function(){
      var diff = Math.max(0, target - Date.now());
      var secs = Math.ceil(diff/1000);
      timerBox.textContent = "Подождите: " + secs + " секунд";
      if (secs <= 0){
        clearInterval(timerId);
        step2();
      }
    }, 200);

    // === Шаг 2. Клик по баннеру ===
    var needSec = 10;
    var leavingAt = 0;
    var watching = false;
    var finished = false;
    var titleTimerId = null;
    var originalTitle = document.title;

    function step2(){
      footer.innerHTML = `
        <div style="margin-bottom:10px;font-size:18px;font-weight:bold;">
          👉 Откройте любой рекламный баннер в новой вкладке.
          Держите вкладку открытой ${needSec} секунд, затем вернитесь сюда.
        </div>
        <div id="bannerStatus" style="margin-top:6px;color:#22c55e;font-weight:bold;"></div>
        <div style="margin-top:6px;font-size:14px;opacity:.9;">
          Если новая вкладка не фокусируется, отключите блокировку всплывающих окон или откройте баннер обычным кликом.
        </div>
      `;
      attachWatchers();
    }

    function startTitleTimer(sec){
      var remain = sec;
      clearInterval(titleTimerId);
      titleTimerId = setInterval(function(){
        document.title = " " + remain + " сек";
        remain--;
        if (remain < 0){
          clearInterval(titleTimerId);
          document.title = "Готово! " + originalTitle;
        }
      }, 1000);
    }

    function stopTitleTimer(success){
      clearInterval(titleTimerId);
      document.title = success ? "Просмотр засчитан!" : originalTitle;
    }

    function attachWatchers(){
      function startWatch(){
        if (finished || watching) return;
        if (!document.hidden) return;
        watching = true;
        leavingAt = Date.now();
        var bs = document.getElementById("bannerStatus");
        if (bs) bs.textContent = "Засчитываем просмотр... осталось " + needSec + " сек";
        startTitleTimer(needSec);
      }

      function stopWatch(){
        if (finished || !watching) return;
        var spent = Math.round((Date.now() - leavingAt)/1000);
        var bs = document.getElementById("bannerStatus");
        if (spent >= needSec){
          finished = true;
          watching = false;
          if (bs) bs.textContent = "Просмотр засчитан! Теперь пройдите капчу ниже.";
          cleanup();
          stopTitleTimer(true);
          showCaptcha();
        } else {
          watching = false;
          if (bs) bs.textContent = "Баннер закрыт слишком рано! Держите вкладку открытой " + needSec + " сек и вернитесь.";
          stopTitleTimer(false);
        }
      }

      function onBlur(){ startWatch(); }
      function onVisibility(){ 
        if (document.hidden) startWatch(); 
        else stopWatch(); 
      }
      function onFocus(){ stopWatch(); }

      window.__rubz_handlers = { onBlur, onVisibility, onFocus };

      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);
      document.addEventListener("visibilitychange", onVisibility);
    }

    function cleanup(){
      var H = window.__rubz_handlers || {};
      if (H.onBlur) window.removeEventListener("blur", H.onBlur);
      if (H.onFocus) window.removeEventListener("focus", H.onFocus);
      if (H.onVisibility) document.removeEventListener("visibilitychange", H.onVisibility);
      window.__rubz_handlers = null;
    }

    // === Шаг 3. Математическая капча ===
    function showCaptcha(){
      footer.innerHTML = "";

      var num1 = Math.floor(Math.random()*10)+1;
      var num2 = Math.floor(Math.random()*10)+1;
      var correctAnswer = num1 + num2;

      var question = document.createElement("div");
      question.style.cssText = "margin-bottom:10px;font-size:18px;font-weight:bold;";
      question.textContent = "Решите пример: " + num1 + " + " + num2 + " = ?";
      footer.appendChild(question);

      var input = document.createElement("input");
      input.type = "number";
      input.style.cssText = "padding:6px 10px;font-size:16px;width:100px;text-align:center;border-radius:6px;border:1px solid #333;background:#fff;color:#000;";
      footer.appendChild(input);

      var btn = document.createElement("button");
      btn.style.cssText = "margin-left:10px;padding:6px 14px;font-size:16px;border:none;border-radius:6px;cursor:pointer;background:#22c55e;color:#fff;";
      btn.textContent = "Проверить";
      footer.appendChild(btn);

      btn.onclick = function(){
        if(parseInt(input.value,10) === correctAnswer){
          footer.textContent = "Верно! Перенаправляем...";
          var token = cntToken || sessionStorage.getItem("rubza_cnt_token") || "";
          if(token){
            var bonusUrl = "https://fastfaucet.pro/pages/utm_clicks.php?cnt=" + encodeURIComponent(token) + "#tope";
            window.location.href = bonusUrl;
          }
        } else {
          footer.textContent = "Неверно! Попробуйте снова.";
          setTimeout(showCaptcha,1500); // новая капча
        }
      };
    }
  });
})(window, document);
