(function(window, document){
  "use strict";

  function getParam(name){
    try { 
      return new URLSearchParams(window.location.search).get(name) || ""; 
    } catch(e){ 
      return ""; 
    }
  }

  var utm_source = getParam("utm_source");
  var utm_medium = getParam("utm_medium"); 
  var utm_campaign = getParam("utm_campaign");

  // Проверяем UTM-метки
  if (utm_source !== "yandex" || utm_medium !== "organic" || utm_campaign !== "ads") {
    console.log("UTM parameters don't match, exiting");
    return;
  }

  // Получаем защищенный токен
  var secureToken = getParam("st") || "";
  
  if(secureToken) {
    // Сохраняем защищенный токен для использования после капчи
    try{ 
      sessionStorage.setItem("secure_rubza_token", secureToken);
      console.log("Secure token stored successfully");
    } catch(e){ 
      console.error("Storage error:", e);
    }
  } else {
    console.error("No secure token found in URL");
    return;
  }

  // Функция для генерации динамического маркера
  function generateDynamicMarker() {
    var timestamp = Math.floor(Date.now() / 1000);
    
    // Генерируем случайные компоненты
    var randomPart1 = Math.random().toString(36).substring(2, 8);
    var randomPart2 = Math.random().toString(36).substring(2, 8);
    
    // Создаем хэш времени
    var timeString = timestamp.toString();
    var timeHash = '';
    for (var i = 0; i < timeString.length; i++) {
      timeHash += String.fromCharCode(97 + parseInt(timeString[i])); // преобразуем цифры в буквы
    }
    timeHash = timeHash.substring(0, 6);
    
    return "cazxh_" + randomPart1 + "_" + randomPart2 + "_" + timeHash;
  }

  // Ждем загрузки DOM
  document.addEventListener("DOMContentLoaded", function(){
    console.log("UTM script loaded");
    
    // Создаем фиксированный футер
    var footer = document.createElement("div");
    footer.style.cssText = "position:fixed;bottom:0;left:0;width:100%;background:#2196F3;color:#fff;font-family:Segoe UI,Tahoma,sans-serif;padding:12px;text-align:center;z-index:999999;font-size:18px;box-shadow:0 -2px 10px rgba(0,0,0,0.2);";
    document.body.appendChild(footer);

    // Рандомный таймер от 30 до 53 секунд
    var waitSec = Math.floor(Math.random() * (53 - 30 + 1)) + 30;
    var needMs = waitSec * 1000;
    var gainedMs = 0;
    var lastTick = Date.now();
    var isActive = !document.hidden;
    var scrollTriggered = false;

    var timerBox = document.createElement("span");
    timerBox.style.fontWeight = "bold";
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
      
      // Красивое отображение таймера
      var minutes = Math.floor(secs / 60);
      var seconds = secs % 60;
      var timeString = minutes > 0 ? 
        minutes + ":" + (seconds < 10 ? "0" : "") + seconds : 
        seconds + " сек";
        
      timerBox.textContent = "⏳ Ожидание: " + timeString + " (вкладка должна быть активна)";

      // Триггер скролла через 5-10 секунд после старта
      var elapsedMs = needMs - remainMs;
      if (!scrollTriggered && elapsedMs > 5000 && elapsedMs < 10000) {
        var scrollChance = Math.random();
        if (scrollChance > 0.3) { // 70% вероятность скролла
          triggerHumanLikeScroll();
          scrollTriggered = true;
        }
      }

      if (remainMs <= 0) {
        clearInterval(timerId);
        timerBox.textContent = "✅ Время вышло! Загружаем проверку...";
        setTimeout(showMathCaptcha, 1000);
      }
    }, 200);

    // ===========================
    // ФУНКЦИЯ ЧЕЛОВЕЧЕСКОГО СКРОЛЛА
    // ===========================
    function triggerHumanLikeScroll() {
      console.log("Запуск человеческого скролла...");
      
      // Случайная цель скролла (может быть вверх или вниз)
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      var maxScroll = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight,
        document.body.offsetHeight, 
        document.documentElement.offsetHeight,
        document.body.clientHeight, 
        document.documentElement.clientHeight
      ) - window.innerHeight;
      
      // Выбираем случайную позицию для скролла
      var targetScroll;
      var scrollDirection = Math.random() > 0.5 ? 'down' : 'up';
      
      if (scrollDirection === 'down') {
        // Скролл вниз - от текущей позиции до случайной точки ниже
        var minTarget = Math.min(currentScroll + 100, maxScroll);
        var maxTarget = Math.min(currentScroll + 600, maxScroll);
        targetScroll = Math.floor(Math.random() * (maxTarget - minTarget + 1)) + minTarget;
      } else {
        // Скролл вверх - от текущей позиции до случайной точки выше
        var minTarget = Math.max(0, currentScroll - 600);
        var maxTarget = Math.max(0, currentScroll - 100);
        targetScroll = Math.floor(Math.random() * (maxTarget - minTarget + 1)) + minTarget;
      }
      
      // Ограничиваем целевую позицию
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
      
      // Плавный скролл с человеческим поведением
      var startTime = null;
      var startPosition = currentScroll;
      var duration = Math.random() * (4000 - 2000) + 2000; // 2-4 секунды
      
      // Функция плавного скролла с "дрожанием" как у человека
      function smoothScroll(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var percent = Math.min(progress / duration, 1);
        
        // easing function для более естественного движения
        var easeInOutCubic = function(t) {
          return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };
        
        var easedPercent = easeInOutCubic(percent);
        
        // Добавляем небольшое случайное дрожание для реалистичности
        var jitter = (Math.random() - 0.5) * 3; // ±1.5 пикселя дрожания
        var newScroll = startPosition + (targetScroll - startPosition) * easedPercent + jitter;
        
        window.scrollTo(0, newScroll);
        
        if (progress < duration) {
          // Случайная задержка между кадрами для имитации человеческого поведения
          var nextDelay = Math.random() * (20 - 10) + 10;
          setTimeout(function() {
            requestAnimationFrame(smoothScroll);
          }, nextDelay);
        } else {
          // После завершения основного скролла - небольшой дополнительный микродвижения
          setTimeout(function() {
            microAdjustments();
          }, 500);
        }
      }
      
      // Микрокоррекции позиции после основного скролла
      function microAdjustments() {
        var finalPosition = window.pageYOffset || document.documentElement.scrollTop;
        var smallMovement = Math.random() > 0.5 ? 
          Math.min(finalPosition + 30, maxScroll) : 
          Math.max(finalPosition - 30, 0);
        
        if (smallMovement !== finalPosition) {
          window.scrollTo({
            top: smallMovement,
            behavior: 'smooth'
          });
        }
      }
      
      // Запускаем скролл
      requestAnimationFrame(smoothScroll);
      
      // Обновляем текст в футере на время скролла
      var originalText = timerBox.textContent;
      timerBox.textContent = "👀 Просматриваем страницу...";
      
      setTimeout(function() {
        timerBox.textContent = originalText;
      }, duration + 1000);
    }

    // ===========================
    // МАТЕМАТИЧЕСКАЯ КАПЧА
    // ===========================
    function numberToWordsRu(n){
      var ones = ["ноль","один","два","три","четыре","пять","шесть","семь","восемь","девять","десять",
                 "одиннадцать","двенадцать","тринадцать","четырнадцать","пятнадцать","шестнадцать",
                 "семнадцать","восемнадцать","девятнадцать"];
      var tens = ["", "", "двадцать","тридцать","сорок","пятьдесят","шестьдесят","семьдесят","восемьдесят","девяносто"];
      
      if(n < 20) return ones[n];
      var t = Math.floor(n/10);
      var o = n%10;
      return tens[t] + (o ? " " + ones[o] : "");
    }

    function randInt(min, max){ 
      return Math.floor(Math.random()*(max-min+1))+min; 
    }

    function genQuestion(){
      var a = randInt(5, 25);
      var b = randInt(5, 25);
      var op = Math.random() < 0.7 ? "+" : "-";
      
      // Для вычитания гарантируем неотрицательный результат
      if(op === "-" && a < b){ 
        var tmp = a; 
        a = b; 
        b = tmp; 
      }
      
      var words = numberToWordsRu(a) + " " + (op === "+" ? "плюс" : "минус") + " " + numberToWordsRu(b);
      var answer = op === "+" ? (a + b) : (a - b);
      
      return { 
        words: words, 
        answer: answer,
        numbers: {a: a, b: b, op: op}
      };
    }

    function showMathCaptcha(){
      console.log("Showing math captcha");
      footer.innerHTML = "";

      var overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:999998;display:flex;align-items:center;justify-content:center;";
      document.body.appendChild(overlay);

      var box = document.createElement("div");
      box.style.cssText = "background:#fff;color:#333;border-radius:12px;padding:24px;max-width:500px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,0.3);text-align:center;";
      overlay.appendChild(box);

      var title = document.createElement("h3");
      title.textContent = "🤖 Подтвердите, что вы человек";
      title.style.cssText = "margin:0 0 16px 0;color:#2196F3;font-size:20px;";
      box.appendChild(title);

      var description = document.createElement("p");
      description.textContent = "Решите простую математическую задачу и введите ответ цифрами:";
      description.style.cssText = "margin:0 0 20px 0;color:#666;font-size:16px;";
      box.appendChild(description);

      var questionBox = document.createElement("div");
      questionBox.style.cssText = "background:#f8f9fa;padding:16px;border-radius:8px;border:2px solid #e9ecef;margin:0 0 20px 0;font-size:18px;font-weight:bold;";
      box.appendChild(questionBox);

      var controls = document.createElement("div");
      controls.style.cssText = "display:flex;gap:12px;align-items:center;justify-content:center;margin:0 0 15px 0;flex-wrap:wrap;";
      box.appendChild(controls);

      var input = document.createElement("input");
      input.type = "text";
      input.inputMode = "numeric";
      input.autocomplete = "off";
      input.placeholder = "Введите ответ";
      input.style.cssText = "padding:12px 16px;border-radius:8px;border:2px solid #ddd;font-size:16px;width:150px;text-align:center;outline:none;transition:border-color 0.3s;";
      input.addEventListener('focus', function() {
        this.style.borderColor = '#2196F3';
      });
      input.addEventListener('blur', function() {
        this.style.borderColor = '#ddd';
      });
      controls.appendChild(input);

      var btn = document.createElement("button");
      btn.textContent = "✅ Проверить";
      btn.style.cssText = "padding:12px 24px;border-radius:8px;border:none;background:#4CAF50;color:white;font-size:16px;font-weight:bold;cursor:pointer;transition:background 0.3s;";
      btn.addEventListener('mouseover', function() {
        this.style.background = '#45a049';
      });
      btn.addEventListener('mouseout', function() {
        this.style.background = '#4CAF50';
      });
      controls.appendChild(btn);

      var hint = document.createElement("div");
      hint.style.cssText = "font-size:14px;color:#666;margin:10px 0;min-height:20px;";
      box.appendChild(hint);

      var attemptsInfo = document.createElement("div");
      attemptsInfo.style.cssText = "font-size:12px;color:#999;";
      box.appendChild(attemptsInfo);

      // Honeypot поле
      var honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "hp_field";
      honeypot.autocomplete = "off";
      honeypot.style.cssText = "position:absolute;left:-9999px;top:-9999px;opacity:0;height:1px;width:1px;";
      box.appendChild(honeypot);

      // Состояние капчи
      var data = {
        q: genQuestion(),
        attempts: 0,
        maxAttempts: 3,
        hadTrustedKeydowns: 0,
        keyEvents: [],
        pointerInteracted: false,
        firstKeystrokeAt: 0,
        lastKeystrokeAt: 0,
        pasted: false
      };

      questionBox.textContent = data.q.words + " = ?";
      attemptsInfo.textContent = `Попытки: ${data.attempts}/${data.maxAttempts}`;

      // Отслеживание взаимодействий
      input.addEventListener("pointerdown", function(e){
        data.pointerInteracted = true;
      });

      input.addEventListener("keydown", function(e){
        var trusted = e.isTrusted !== false;
        if(trusted) data.hadTrustedKeydowns++;
        
        var now = Date.now();
        if(!data.firstKeystrokeAt) data.firstKeystrokeAt = now;
        data.lastKeystrokeAt = now;
        data.keyEvents.push({t: now, trusted: trusted});
      });

      input.addEventListener("paste", function(e){
        data.pasted = true;
      });

      function tryCheck(){
        data.attempts++;
        attemptsInfo.textContent = `Попытки: ${data.attempts}/${data.maxAttempts}`;
        
        var raw = (input.value || "").trim();
        
        // Проверка honeypot
        if(honeypot.value && honeypot.value.trim().length > 0){
          showError("Обнаружена подозрительная активность");
          return resetCaptcha();
        }

        // Парсинг числа
        var userNum = parseInt(raw.replace(/[^\d\-]/g, ''), 10);
        if(isNaN(userNum)){
          showError("Пожалуйста, введите число цифрами");
          return;
        }

        // Проверка человеческого поведения
        var timeTyping = data.firstKeystrokeAt ? (data.lastKeystrokeAt - data.firstKeystrokeAt) : 0;
        var trustedKeys = data.hadTrustedKeydowns;
        var humanLike = data.pointerInteracted && trustedKeys >= 1 && timeTyping >= 100;

        if(!humanLike && data.attempts > 1){
          showError("Пожалуйста, кликните в поле и введите ответ вручную");
          return resetInput();
        }

        // Проверка ответа
        if(userNum === data.q.answer){
          showSuccess("✅ Верно! Перенаправляем...");
          
          setTimeout(function(){
            var secureToken = sessionStorage.getItem("secure_rubza_token");
            if(secureToken){
              // ГЕНЕРИРУЕМ ДИНАМИЧЕСКИЙ МАРКЕР
              var dynamicMarker = generateDynamicMarker();
              console.log("Generated dynamic marker: " + dynamicMarker);
              
              // ПЕРЕДАЕМ И ТОКЕН И МАРКЕР ОТДЕЛЬНО
              var bonusUrl = "https://fastfaucet.pro/pages/utm_loto.php?st=" + encodeURIComponent(secureToken) + "&dm=" + encodeURIComponent(dynamicMarker);
              console.log("Redirecting to bonus URL: " + bonusUrl);
              window.location.href = bonusUrl;
            } else {
              showError("Токен не найден. Обновите страницу и попробуйте снова.");
            }
          }, 1500);
          
        } else {
          showError("❌ Неправильный ответ. Попробуйте еще раз.");
          resetInput();
        }
      }

      function showError(message){
        hint.style.color = "#d32f2f";
        hint.textContent = message;
      }

      function showSuccess(message){
        hint.style.color = "#388e3c";
        hint.textContent = message;
        btn.disabled = true;
        input.disabled = true;
      }

      function resetInput(){
        input.value = "";
        input.focus();
      }

      function resetCaptcha(){
        if(data.attempts >= data.maxAttempts){
          overlay.remove();
          footer.innerHTML = "<div style='color:#d32f2f;font-weight:bold;'>❌ Слишком много попыток. Обновите страницу.</div>";
          return;
        }
        
        data.q = genQuestion();
        questionBox.textContent = data.q.words + " = ?";
        resetInput();
        data.hadTrustedKeydowns = 0;
        data.keyEvents = [];
        data.pointerInteracted = false;
        data.firstKeystrokeAt = 0;
        data.lastKeystrokeAt = 0;
        data.pasted = false;
        hint.textContent = "";
      }

      // Обработчики событий
      btn.addEventListener("click", tryCheck);
      input.addEventListener("keydown", function(e){
        if(e.key === "Enter") tryCheck();
      });

      // Фокусировка на поле ввода
      setTimeout(function(){ 
        input.focus(); 
      }, 100);
    }
  });
})(window, document);
