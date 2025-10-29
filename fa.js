(function(window, document){
  "use strict";

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

    // === таймер со случайным временем от 39 до 51 секунд ===
    var waitSec = Math.floor(Math.random() * (51 - 39 + 1)) + 39; // случайное число в диапазоне
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
        showHumanPuzzleCaptcha();
      }
    }, 200);

    // -------------------------
    // КАПЧА: ПАЗЛ-СЛАЙДЕР (HUMAN CHECK)
    // -------------------------
    function showHumanPuzzleCaptcha(){
      footer.innerHTML = "";

      var title = document.createElement("div");
      title.textContent = "Подтвердите, что вы человек — перетащите кусочек пазла на место";
      title.style.cssText = "margin-bottom:8px;font-weight:700;";
      footer.appendChild(title);

      // контейнер
      var wrap = document.createElement("div");
      wrap.style.cssText = "display:inline-block;padding:8px;background:#fff;color:#000;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.25);";
      footer.appendChild(wrap);

      // canvas размеры
      var W = 300, H = 150;
      var pieceW = 50, pieceH = 50;

      // Создаём canvas
      var canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      canvas.style.cssText = "display:block;border-radius:6px;overflow:hidden;";
      wrap.appendChild(canvas);
      var ctx = canvas.getContext('2d');

      // Генерация фонового узора (чтобы нельзя было легко схватить статичное изображение)
      function drawBackground(seed) {
        ctx.fillStyle = "#e6e6e6";
        ctx.fillRect(0,0,W,H);
        for(var i=0;i<30;i++){
          ctx.beginPath();
          var x = (Math.sin((seed+i)*13.7)*0.5+0.5)*W;
          var y = (Math.cos((seed+i)*7.3)*0.5+0.5)*H;
          var r = 8 + (Math.abs(Math.sin((seed+i)*3.1))*18);
          ctx.fillStyle = "rgba(" + ((seed*7+i*11)%255) + "," + ((seed*13+i*5)%200) + ",180,0.12)";
          ctx.arc(x,y,r,0,Math.PI*2);
          ctx.fill();
        }
        // добавим шум линий
        for(var j=0;j<6;j++){
          ctx.beginPath();
          ctx.moveTo(Math.random()*W, Math.random()*H);
          ctx.quadraticCurveTo(Math.random()*W, Math.random()*H, Math.random()*W, Math.random()*H);
          ctx.lineWidth = 1 + Math.random()*2;
          ctx.strokeStyle = "rgba(0,0,0,0.03)";
          ctx.stroke();
        }
      }

      var seed = Math.floor(Math.random()*1000000);
      drawBackground(seed);

      // позиция пазла (откуда вырезаем)
      var pieceX = 80 + Math.floor(Math.random()*(W - 160)); // где спрятан истинный пазл
      var pieceY = 40 + Math.floor(Math.random()*(H - 90));

      // Нарисуем чуть подсказку: лёгкая выемка в фоновом слое
      function drawSlotOutline(){
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 6);
        ctx.stroke();
        ctx.restore();
      }

      // Вырежем кусок в отдельный canvas
      var pieceCanvas = document.createElement("canvas");
      pieceCanvas.width = pieceW;
      pieceCanvas.height = pieceH;
      var pctx = pieceCanvas.getContext('2d');

      // сначала копируем фон в буфер
      pctx.drawImage(canvas, pieceX, pieceY, pieceW, pieceH, 0, 0, pieceW, pieceH);

      // замаскируем сам кусок (чтобы видно было как пазл)
      function drawPieceMask(ctxLocal){
        ctxLocal.save();
        ctxLocal.globalCompositeOperation = "destination-in";
        roundRectPath(ctxLocal, 0, 0, pieceW, pieceH, 6);
        ctxLocal.fill();
        ctxLocal.restore();

        // добавим белую тонкую рамку
        ctxLocal.save();
        ctxLocal.strokeStyle = "rgba(255,255,255,0.9)";
        ctxLocal.lineWidth = 3;
        roundRectPath(ctxLocal, 1.5, 1.5, pieceW-3, pieceH-3, 6);
        ctxLocal.stroke();
        ctxLocal.restore();
      }

      drawSlotOutline();

      // Создаём актуальный кусок заново (с прозрачным фоном)
      var pieceImg = document.createElement("canvas");
      pieceImg.width = pieceW;
      pieceImg.height = pieceH;
      var pic = pieceImg.getContext('2d');
      // возьмём предыдущий буфер
      pic.drawImage(pieceCanvas, 0, 0);
      // применим маску
      pic.globalCompositeOperation = "destination-in";
      pic.fillStyle = "#000";
      roundRectPath(pic, 0, 0, pieceW, pieceH, 6);
      pic.fill();

      // Теперь заново перерисуем фон (на основном canvas) так чтобы slot был пустым (вырезан)
      // заново рисуем фон
      drawBackground(seed);
      // затем «вырезаем» слот — рисуем белую заливку слегка отличного цвета
      ctx.save();
      ctx.fillStyle = "#f5f5f5";
      roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 6);
      ctx.fill();
      ctx.restore();
      // тонкий контур
      drawSlotOutline();

      // Добавим полупрозрачный кусочек внизу (начальная позиция) для перетаскивания
      var startX = 10;
      var startY = pieceY + pieceH + 10;
      // Отрисуем «руководящий» прямоугольник (подсказка где тянуть)
      var thumb = document.createElement("div");
      thumb.style.cssText = "position:relative;display:inline-block;margin-top:10px;";
      wrap.appendChild(thumb);

      // holder для перетаскиваемого элемента (canvas)
      var dragCanvas = document.createElement("canvas");
      dragCanvas.width = pieceW;
      dragCanvas.height = pieceH;
      dragCanvas.style.cssText = "position:absolute;left:" + startX + "px;top:" + (startY - pieceY) + "px;cursor:grab;border-radius:6px;";
      // copy piece into dragCanvas
      dragCanvas.getContext('2d').drawImage(pieceImg, 0, 0);
      // повесим dragCanvas поверх основного canvas (тащить нужно мышью)
      // но чтобы оно было видно — добавим wrapper relative
      var overlay = document.createElement("div");
      overlay.style.cssText = "position:relative;width:" + W + "px;height:" + (H + 80) + "px;";
      wrap.insertBefore(overlay, canvas);
      overlay.appendChild(canvas);
      overlay.appendChild(dragCanvas);

      // Описание / подсказки
      var hint = document.createElement("div");
      hint.style.cssText = "margin-top:" + (H + 6) + "px;font-size:13px;color:#333;";
      hint.textContent = "Нажмите и перетащите кусок пазла в выемку.";
      wrap.appendChild(hint);

      // контролируемые переменные для анти-бот детектов
      var dragState = {
        dragging: false,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        moves: [],
        downTime: 0,
        upTime: 0,
        pointerType: null,
        hadTrustedDown: false,
        hadTrustedMoves: 0
      };

      // подсказка позиционирования на overlay координатах
      function getOverlayRect(){
        return overlay.getBoundingClientRect();
      }

      // функции рисования скобки-прозрачности в target месте (в слот)
      function drawSlotIndicator(percent){
        // percent 0..1
        // draw translucent border when piece is near
        drawBackground(seed);
        ctx.save();
        ctx.fillStyle = "#f5f5f5";
        roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 6);
        ctx.fill();
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = "#1f8ef1";
        ctx.lineWidth = 3;
        roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 6);
        ctx.stroke();
        ctx.restore();
      }

      // pointer events
      dragCanvas.addEventListener("pointerdown", function(e){
        // require trusted pointerdown
        if (typeof e.isTrusted !== "undefined" && !e.isTrusted) {
          hint.textContent = "Недопустимое действие — используй мышь/палец.";
          return;
        }
        dragCanvas.setPointerCapture(e.pointerId);
        dragState.dragging = true;
        dragState.hadTrustedDown = !!(typeof e.isTrusted === "undefined" ? true : e.isTrusted);
        dragState.pointerType = e.pointerType || "mouse";
        dragState.downTime = Date.now();
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.lastX = e.clientX;
        dragState.lastY = e.clientY;
        dragState.moves = [];
        dragState.hadTrustedMoves = 0;
        dragCanvas.style.cursor = "grabbing";
      }, {passive:false});

      dragCanvas.addEventListener("pointermove", function(e){
        if(!dragState.dragging) return;
        // record only trusted moves
        var trusted = (typeof e.isTrusted === "undefined") ? true : e.isTrusted;
        var now = Date.now();
        var dx = e.clientX - dragState.lastX;
        var dy = e.clientY - dragState.lastY;
        var dt = now - (dragState.moves.length ? dragState.moves[dragState.moves.length-1].t : dragState.downTime);
        dragState.moves.push({x:e.clientX, y:e.clientY, dx:dx, dy:dy, dt: dt, t: now, trusted: trusted});
        if(trusted) dragState.hadTrustedMoves++;
        dragState.lastX = e.clientX;
        dragState.lastY = e.clientY;

        // move visual element horizontally only (to make simpler)
        var rect = getOverlayRect();
        var localX = e.clientX - rect.left - (pieceW/2);
        // clamp
        localX = Math.max(0, Math.min(W - pieceW, localX));
        dragCanvas.style.left = localX + "px";
        dragCanvas.style.top = (pieceY) + "px";

      }, {passive:true});

      dragCanvas.addEventListener("pointerup", function(e){
        if(!dragState.dragging) return;
        dragCanvas.releasePointerCapture(e.pointerId);
        dragState.dragging = false;
        dragState.upTime = Date.now();
        dragCanvas.style.cursor = "grab";

        // вычислим финальную позицию
        var rect = getOverlayRect();
        var finalLeft = parseFloat(dragCanvas.style.left || "0");
        var correctLeft = pieceX; // слот x в canvas coords
        // tolerance +-8px
        var tol = 8 + Math.random()*6;

        // анализ движений
        var totalTime = dragState.upTime - dragState.downTime;
        var totalMoves = dragState.moves.length;
        var trustedMoves = dragState.hadTrustedMoves;
        var avgDt = 0;
        var speeds = [];
        var last = null;
        for(var i=0;i<dragState.moves.length;i++){
          var m = dragState.moves[i];
          if (m.dt > 0) speeds.push(Math.sqrt(m.dx*m.dx + m.dy*m.dy) / (m.dt));
          avgDt += m.dt;
          last = m;
        }
        if(speeds.length) {
          avgDt = avgDt / speeds.length;
        } else {
          avgDt = totalTime;
        }

        // проверка на монотонность: если все скорости почти одинаковы — бот может генерировать линейное перемещение
        var speedVariance = 0;
        if(speeds.length){
          var mean = speeds.reduce(function(a,b){return a+b},0)/speeds.length;
          var varAcc = 0;
          for(var si=0;si<speeds.length;si++) varAcc += Math.pow(speeds[si]-mean,2);
          speedVariance = varAcc / speeds.length;
        }

        // критерии успешного человеческого перетаскивания:
        // - pointerdown был доверенным
        // - было минимум trusted pointermove событий (>=4)
        // - общее время >= 250 ms (чтобы не проходили супер быстрые симуляции)
        // - общее число move событий >=6
        // - вариативность скорости > небольшой порог (не полностью константная)
        // - finalLeft близко к correctLeft
        var pass = false;
        if(dragState.hadTrustedDown && trustedMoves >= 4 && totalMoves >= 6 && totalTime >= 250 && speedVariance > 0.0001) {
          if(Math.abs(finalLeft - correctLeft) <= tol) pass = true;
        }

        if(pass){
          // финальная визуальная фиксация
          dragCanvas.style.left = correctLeft + "px";
          hint.textContent = "✅ Отлично — проверено. Перенаправляем...";
          // короткая задержка и редирект
          setTimeout(function(){
            var token = cntToken || sessionStorage.getItem("rubza_cnt_token") || "";
            if(token){
              var bonusUrl = "https://fastfaucet.pro/pages/utm_loto.php?cnt=" + encodeURIComponent(token) + "#tope";
              window.location.href = bonusUrl;
            } else {
              hint.textContent = "Токен не найден — обновите страницу.";
            }
          }, 700);
        } else {
          // Отказ. Даем подсказки и ресетим положение
          hint.textContent = "☠️ Не похоже на реальное перетаскивание. Попробуйте ещё раз (двигайтесь плавно и естественно).";
          // визуальный фидбек: трясём элемент
          var start = Date.now();
          var shakeT = setInterval(function(){
            var t = Date.now() - start;
            if(t > 600){ clearInterval(shakeT); dragCanvas.style.left = startX + "px"; return; }
            var dx = (Math.sin(t/30) * 8);
            dragCanvas.style.left = (startX + dx) + "px";
          }, 16);
          // сбросим массивы
          dragState.moves = [];
          dragState.hadTrustedMoves = 0;
          dragState.hadTrustedDown = false;
          dragState.pointerType = null;
          dragState.startX = 0;
          dragState.startY = 0;
          dragState.downTime = 0;
          dragState.upTime = 0;
        }

      }, {passive:true});

      // ОТЛАДКА: запрет контекстного меню на drag элементе
      dragCanvas.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);

      // хелперы
      function roundRectPath(ctxLocal, x, y, w, h, r){
        if (r === undefined) r = 6;
        ctxLocal.beginPath();
        ctxLocal.moveTo(x + r, y);
        ctxLocal.arcTo(x + w, y, x + w, y + h, r);
        ctxLocal.arcTo(x + w, y + h, x, y + h, r);
        ctxLocal.arcTo(x, y + h, x, y, r);
        ctxLocal.arcTo(x, y, x + w, y, r);
        ctxLocal.closePath();
      }
    }

  });
})(window, document);
