(function(window, document){
  "use strict";

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

  // Получаем защищенный токен
  var secureToken = getParam("st") || "";
  
  if(secureToken) {
    // Валидируем токен через API
    validateAndStoreToken(secureToken);
  }

  function validateAndStoreToken(secureToken) {
    fetch('https://fastfaucet.pro/api/validate-token.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secure_token: secureToken })
    })
    .then(response => response.json())
    .then(data => {
        if(data.valid && data.token) {
            // Сохраняем оригинальный токен
            try{ 
                sessionStorage.setItem("rubza_cnt_token", data.token);
                console.log("Token validated and stored successfully");
            } catch(e){ 
                console.error("Storage error:", e);
            }
        } else {
            console.error("Token validation failed:", data.error);
        }
    })
    .catch(error => {
        console.error("Token validation request failed:", error);
    });
  }

  // ОСТАЛЬНАЯ ЧАСТЬ СКРИПТА ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ
  document.addEventListener("DOMContentLoaded", function(){
    var footer = document.createElement("div");
    footer.style.cssText = "position:fixed;bottom:0;left:0;width:100%;background:#F00;color:#fff;font-family:Segoe UI,Tahoma,sans-serif;padding:12px;text-align:center;z-index:999999;font-size:18px;";
    document.body.appendChild(footer);

    var waitSec = Math.floor(Math.random() * (51 - 39 + 1)) + 39;
    var needMs = waitSec * 1000;
    var gainedMs = 0;
    var lastTick = Date.now();
    var isActive = !document.hidden;

    var timerBox = document.createElement("span");
    footer.appendChild(timerBox);

    function setActive(state){
      isActive = state;
      lastTick = Date.now();
    }
    document.addEventListener("visibilitychange", function(){
      setActive(!document.hidden);
    });
    window.addEventListener("focus", function(){ setActive(true); });
    window.addEventListener("blur",  function(){ setActive(false); });

    var timerId = setInterval(function(){
      var now = Date.now();
      if (isActive) {
        gainedMs += (now - lastTick);
      }
      lastTick = now;

      var remainMs = Math.max(0, needMs - gainedMs);
      var secs = Math.ceil(remainMs / 1000);
      timerBox.textContent = "Подождите: " + secs + " секунд (вкладка должна быть активна)";

      if (remainMs <= 0) {
        clearInterval(timerId);
        showMathCaptcha();
      }
    }, 200);

    // ===========================
    // НОВАЯ КАПЧА: МАТЕМАТИЧЕСКАЯ (словами)
    // ===========================
    function numberToWordsRu(n){
      // работает для 0..99 (достаточно для нашей капчи)
      var ones = ["ноль","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять","одиннадцать","двенадцать","тринадцать","четырнадцать","пятнадцать","шестнадцать","семнадцать","восемнадцать","девятнадцать"];
      var tens = ["", "", "двадцать","тридцать","сорок","пятьдесят","шестьдесят","семьдесят","восемьдесят","девяносто"];
      if(n < 20) return ones[n];
      var t = Math.floor(n/10);
      var o = n%10;
      return tens[t] + (o? " " + ones[o] : "");
    }

    function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

    function genQuestion(){
      // генерируем простую арифметику двумя числами (3..20), операторы + или -
      var a = randInt(3, 20);
      var b = randInt(3, 20);
      var op = Math.random() < 0.7 ? "+" : "-"; // чаще плюс
      // чтобы не получить отрицательный результат при минусе — делаем a >= b
      if(op === "-" && a < b){ var tmp = a; a = b; b = tmp; }
      var words = numberToWordsRu(a) + " " + (op === "+" ? "плюс" : "минус") + " " + numberToWordsRu(b);
      var answer = op === "+" ? (a + b) : (a - b);
      return { words: words, answer: answer };
    }

    function showMathCaptcha(){
      footer.innerHTML = "";

      var box = document.createElement("div");
      box.style.cssText = "display:inline-block;padding:14px;background:#fff;color:#000;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.25);text-align:left;max-width:760px;";
      footer.appendChild(box);

      var title = document.createElement("div");
      title.textContent = "Подтвердите, что вы человек — ответьте на простой вопрос (введите цифрами)";
      title.style.cssText = "font-weight:700;margin-bottom:8px;font-size:15px;";
      box.appendChild(title);

      // поле для подсказки вопроса
      var qwrap = document.createElement("div");
      qwrap.style.cssText = "display:flex;align-items:center;gap:12px;";
      box.appendChild(qwrap);

      var qbox = document.createElement("div");
      qbox.style.cssText = "background:#f6f6f6;padding:10px;border-radius:6px;border:1px solid rgba(0,0,0,0.06);font-size:16px;min-width:320px;";
      qwrap.appendChild(qbox);

      // поле ввода и кнопка
      var ctrl = document.createElement("div");
      ctrl.style.cssText = "display:flex;gap:8px;align-items:center;margin-top:10px;";
      box.appendChild(ctrl);

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
      hint.style.cssText = "margin-top:8px;font-size:13px;color:#333;";
      box.appendChild(hint);

      // honeypot (скрытое поле — боты часто заполняют все поля)
      var honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "hp_field";
      honeypot.style.cssText = "position:absolute;left:-9999px;top:-9999px;opacity:0;height:1px;width:1px;";
      box.appendChild(honeypot);

      // состояние и stats поведения
      var data = {
        q: genQuestion(),
        attempts: 0,
        hadTrustedKeydowns: 0,
        keyEvents: [],
        pointerInteracted: false,
        firstKeystrokeAt: 0,
        lastKeystrokeAt: 0
      };

      qbox.textContent = data.q.words + ".";

      // события: pointer down on input or click button considered human interaction
      input.addEventListener("pointerdown", function(e){
        data.pointerInteracted = data.pointerInteracted || (typeof e.isTrusted === "undefined" ? true : e.isTrusted);
      });

      // key events tracking (isTrusted important)
      input.addEventListener("keydown", function(e){
        var trusted = (typeof e.isTrusted === "undefined") ? true : e.isTrusted;
        if(trusted) data.hadTrustedKeydowns++;
        var now = Date.now();
        if(!data.firstKeystrokeAt) data.firstKeystrokeAt = now;
        data.lastKeystrokeAt = now;
        data.keyEvents.push({t: now, trusted: !!trusted});
      });

      // also track paste (bots may paste)
      input.addEventListener("paste", function(e){
        data.pasted = true;
      });

      // click handler
      btn.addEventListener("click", tryCheck, false);
      input.addEventListener("keydown", function(e){
        if(e.key === "Enter") { tryCheck(); }
      });

      function tryCheck(){
        data.attempts++;
        var raw = (input.value || "").trim();
        // quick honeypot reject
        if(honeypot.value && honeypot.value.trim().length){
          hint.style.color = "#a00";
          hint.textContent = "Обнаружен подозрительный ввод (honeypot).";
          return failAndMaybeReset();
        }

        // basic number parse
        var userNum = parseInt(raw.replace(/[^\d\-]/g, ''), 10);
        if(isNaN(userNum)){
          hint.style.color = "#a00";
          hint.textContent = "Введите число цифрами, например 18.";
          return;
        }

        // simple heuristics
        var timeTyping = data.firstKeystrokeAt ? (data.lastKeystrokeAt - data.firstKeystrokeAt) : 0;
        var trustedKeys = data.hadTrustedKeydowns;
        var pointer = data.pointerInteracted;
        var keyEventsCount = data.keyEvents.length;

        console.log("MathCaptcha check:", {attempts:data.attempts, timeTyping, trustedKeys, pointer, keyEventsCount, pasted: !!data.pasted});

        var humanLike = (pointer && trustedKeys >= 1 && keyEventsCount >= 1 && timeTyping >= 50) || (data.pasted && pointer);
        // more strict for instant typed answers without pointer
        if(!humanLike){
          hint.style.color = "#a00";
          hint.textContent = "Подозрительная активность — кликните по полю и введите ответ вручную.";
          return failAndMaybeReset();
        }

        // final check
        if(userNum === data.q.answer){
          hint.style.color = "#0a0";
          hint.textContent = "✅ Отлично — проверено. Перенаправляем...";
          // success — небольшая защита против автоматов: ещё проверим token и redirect
          setTimeout(function(){
            var token = sessionStorage.getItem("rubza_cnt_token") || "";
            if(token){
              var bonusUrl = "https://fastfaucet.pro/pages/utm_loto.php?cnt=" + encodeURIComponent(token) + "#tope";
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

      setTimeout(function(){ try{ input.focus(); } catch(e){} }, 120);
    }
  });
})(window, document);
