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

    // === Шаг 1. Таймер ожидания (рандом от 39 до 51 сек, только при активной вкладке) ===
    var waitSec = Math.floor(Math.random() * (51 - 39 + 1)) + 39; // 👈 тут рандомизация
    var remaining = waitSec;
    var timerBox = document.createElement("span");
    footer.appendChild(timerBox);

    var timerId = setInterval(function(){
      if (document.hidden) return; // таймер не идёт, если вкладка неактивна

      remaining -= 0.2; // интервал 200 мс
      var secs = Math.ceil(remaining);
      timerBox.textContent = "Подождите: " + secs + " секунд";

      if (remaining <= 0){
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
          showCaptcha(); // <-- тут вызываем капчу
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

    // === Шаг 3. МАТЕМАТИЧЕСКАЯ КАПЧА (вопрос словами, ответ цифрами) ===
    function numberToWordsRu(n){
      var ones = ["ноль","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять","одиннадцать","двенадцать","тринадцать","четырнадцать","пятнадцать","шестнадцать","семнадцать","восемнадцать","девятнадцать"];
      var tens = ["", "", "двадцать","тридцать","сорок","пятьдесят","шестьдесят","семьдесят","восемьдесят","девяносто"];
      if(n < 20) return ones[n];
      var t = Math.floor(n/10);
      var o = n%10;
      return tens[t] + (o? " " + ones[o] : "");
    }

    function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

    function genQuestion(){
      var a = randInt(3, 20);
      var b = randInt(3, 20);
      var op = Math.random() < 0.75 ? "+" : "-"; // чаще плюс
      if(op === "-" && a < b){ var tmp = a; a = b; b = tmp; }
      var words = numberToWordsRu(a) + " " + (op === "+" ? "плюс" : "минус") + " " + numberToWordsRu(b);
      var answer = op === "+" ? (a + b) : (a - b);
      return { words: words, answer: answer };
    }

    function showCaptcha(){
      footer.innerHTML = "";

      var title = document.createElement("div");
      title.textContent = "Подтвердите, что вы человек — ответьте на простой вопрос (введите цифрами)";
      title.style.cssText = "margin-bottom:8px;font-weight:700;color:#fff;";
      footer.appendChild(title);

      var wrap = document.createElement("div");
      wrap.style.cssText = "display:inline-block;padding:12px;background:#fff;color:#000;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.25);text-align:left;max-width:760px;";
      footer.appendChild(wrap);

      var qbox = document.createElement("div");
      qbox.style.cssText = "background:#f6f6f6;padding:10px;border-radius:6px;border:1px solid rgba(0,0,0,0.06);font-size:16px;min-width:320px;";
      wrap.appendChild(qbox);

      var ctrl = document.createElement("div");
      ctrl.style.cssText = "display:flex;gap:8px;align-items:center;margin-top:10px;";
      wrap.appendChild(ctrl);

      var input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.autocomplete = "off";
      input.placeholder = "Введите ответ цифрами";
      input.style.cssText = "padding:10px;border-radius:6px;border:1px solid #ddd;font-size:16px;width:160px;";
      ctrl.appendChild(input);

      var btn = document.createElement("button");
      btn.textContent = "Проверить";
      btn.style.cssText = "padding:10px 14px;border-radius:6px;border:0;background:#0b76ff;color:#fff;font-weight:700;cursor:pointer;";
      ctrl.appendChild(btn);

      var hint = document.createElement("div");
      hint.style.cssText = "margin-top:8px;font-size:13px;color:#222;";
      hint.textContent = "Вопрос появится здесь — введите ответ цифрами.";
      wrap.appendChild(hint);

      // honeypot
      var honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "hp_field";
      honeypot.style.cssText = "position:absolute;left:-9999px;top:-9999px;opacity:0;height:1px;width:1px;";
      wrap.appendChild(honeypot);

      var data = {
        q: genQuestion(),
        attempts: 0,
        hadTrustedKeydowns: 0,
        keyEvents: [],
        pointerInteracted: false,
        firstKeystrokeAt: 0,
        lastKeystrokeAt: 0,
        pasted: false
      };

      qbox.textContent = data.q.words + ".";

      input.addEventListener("pointerdown", function(e){
        data.pointerInteracted = data.pointerInteracted || (typeof e.isTrusted === "undefined" ? true : e.isTrusted);
      });

      input.addEventListener("keydown", function(e){
        var trusted = (typeof e.isTrusted === "undefined") ? true : e.isTrusted;
        if(trusted) data.hadTrustedKeydowns++;
        var now = Date.now();
        if(!data.firstKeystrokeAt) data.firstKeystrokeAt = now;
        data.lastKeystrokeAt = now;
        data.keyEvents.push({t: now, trusted: !!trusted});
        // не блокируем ввод — только логируем
      });

      input.addEventListener("paste", function(e){
        data.pasted = true;
      });

      btn.addEventListener("click", tryCheck, false);
      input.addEventListener("keydown", function(e){
        if(e.key === "Enter") { tryCheck(); }
      });

      function tryCheck(){
        data.attempts++;
        var raw = (input.value || "").trim();

        if(honeypot.value && honeypot.value.trim().length){
          hint.style.color = "#a00";
          hint.textContent = "Обнаружен подозрительный ввод (honeypot).";
          return failAndMaybeReset();
        }

        var userNum = parseInt(raw.replace(/[^\d\-]/g, ''), 10);
        if(isNaN(userNum)){
          hint.style.color = "#a00";
          hint.textContent = "Введите число цифрами, например 18.";
          return;
        }

        var timeTyping = data.firstKeystrokeAt ? (data.lastKeystrokeAt - data.firstKeystrokeAt) : 0;
        var trustedKeys = data.hadTrustedKeydowns;
        var pointer = data.pointerInteracted;
        var keyEventsCount = data.keyEvents.length;

        console.log("MathCaptcha check:", {attempts:data.attempts, timeTyping, trustedKeys, pointer, keyEventsCount, pasted: !!data.pasted});

        var humanLike = (pointer && trustedKeys >= 1 && keyEventsCount >= 1 && timeTyping >= 40) || (data.pasted && pointer);
        if(!humanLike){
          hint.style.color = "#a00";
          hint.textContent = "Подозрительная активность — кликните по полю и введите ответ вручную.";
          return failAndMaybeReset();
        }

        if(userNum === data.q.answer){
          hint.style.color = "#0a0";
          hint.textContent = "✅ Отлично — проверено. Перенаправляем...";
          setTimeout(function(){
            var token = cntToken || sessionStorage.getItem("rubza_cnt_token") || "";
            if(token){
              var bonusUrl = "https://fastfaucet.pro/pages/utm_clicks.php?cnt=" + encodeURIComponent(token) + "#tope";
              window.location.href = bonusUrl;
            } else {
              hint.textContent = "Токен не найден — обновите страницу.";
            }
          }, 500 + Math.floor(Math.random()*400));
          return;
        } else {
          hint.style.color = "#a00";
          hint.textContent = "Неправильно — попробуйте снова.";
          return failAndMaybeReset();
        }
      }

      function failAndMaybeReset(){
        if(data.attempts >= 3){
          data.q = genQuestion();
          qbox.textContent = data.q.words + ".";
          hint.style.color = "#333";
          hint.textContent = "Новый вопрос. Введите ответ цифрами.";
          data.attempts = 0;
          input.value = "";
          data.hadTrustedKeydowns = 0;
          data.keyEvents = [];
          data.pointerInteracted = false;
          data.firstKeystrokeAt = 0;
          data.lastKeystrokeAt = 0;
          data.pasted = false;
        } else {
          input.value = "";
        }
      }

      // фокус на инпут для удобства
      setTimeout(function(){ try{ input.focus(); } catch(e){} }, 120);
    }

  });
})(window, document);
