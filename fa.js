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

  var cntToken = getParam("cnt_token") || "";
  if(cntToken) try{ sessionStorage.setItem("rubza_cnt_token", cntToken); } catch(e){}

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
        showHumanPuzzleCaptcha();
      }
    }, 200);

    // ===========================
    // КАПЧА: ПАЗЛ-СЛАЙДЕР — ИСПРАВЛЕННАЯ ВЕРСИЯ
    // ===========================
    function showHumanPuzzleCaptcha(){
      footer.innerHTML = "";

      var title = document.createElement("div");
      title.textContent = "Подтвердите, что вы человек — перетащите кусочек пазла на место";
      title.style.cssText = "margin-bottom:8px;font-weight:700;";
      footer.appendChild(title);

      var wrap = document.createElement("div");
      wrap.style.cssText = "display:inline-block;padding:12px;background:#fff;color:#000;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.25);";
      footer.appendChild(wrap);

      var W = 320, H = 140;
      var pieceW = 56, pieceH = 56;

      // контейнер overlay: сначала создаём overlay, внутрь кладём canvas, затем перетащ элемент
      var overlay = document.createElement("div");
      overlay.style.cssText = "position:relative;width:" + W + "px;height:" + (H + 80) + "px;user-select:none;";
      wrap.appendChild(overlay);

      var canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      canvas.style.cssText = "display:block;border-radius:6px;overflow:hidden;background:#eee;";
      overlay.appendChild(canvas);
      var ctx = canvas.getContext('2d');

      // рисуем фон (детерминированно по seed)
      function drawBackground(seed){
        ctx.clearRect(0,0,W,H);
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0,0,W,H);
        for(var i=0;i<28;i++){
          ctx.beginPath();
          var x = (Math.sin((seed+i)*12.7)*0.5+0.5)*W;
          var y = (Math.cos((seed+i)*5.3)*0.5+0.5)*H;
          var r = 6 + (Math.abs(Math.sin((seed+i)*2.1))*20);
          ctx.fillStyle = "rgba(" + ((seed*3+i*13)%255) + "," + ((seed*7+i*19)%200) + ",180,0.12)";
          ctx.arc(x,y,r,0,Math.PI*2);
          ctx.fill();
        }
        for(var j=0;j<5;j++){
          ctx.beginPath();
          ctx.moveTo(Math.random()*W, Math.random()*H);
          ctx.quadraticCurveTo(Math.random()*W, Math.random()*H, Math.random()*W, Math.random()*H);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(0,0,0,0.03)";
          ctx.stroke();
        }
      }

      // helper
      function roundRectPath(c, x, y, w, h, r){
        if (r === undefined) r = 6;
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
      }

      var seed = Math.floor(Math.random()*999999);
      drawBackground(seed);

      var pieceX = 70 + Math.floor(Math.random()*(W - 160));
      var pieceY = 30 + Math.floor(Math.random()*(H - 80));

      // сохраняем часть в буфер
      var pieceBuf = document.createElement("canvas");
      pieceBuf.width = pieceW;
      pieceBuf.height = pieceH;
      var pbCtx = pieceBuf.getContext('2d');
      pbCtx.drawImage(canvas, pieceX, pieceY, pieceW, pieceH, 0, 0, pieceW, pieceH);

      // формируем прозрачный кусок (маска)
      var pieceMask = document.createElement("canvas");
      pieceMask.width = pieceW;
      pieceMask.height = pieceH;
      var pm = pieceMask.getContext('2d');
      pm.drawImage(pieceBuf,0,0);
      pm.globalCompositeOperation = "destination-in";
      pm.fillStyle = "#000";
      roundRectPath(pm,0,0,pieceW,pieceH,8);
      pm.fill();

      // Перерисуем фон, оставив slot пустым (слегка светлее)
      drawBackground(seed);
      ctx.save();
      ctx.fillStyle = "#f7f7f7";
      roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 8);
      ctx.fill();
      ctx.restore();
      // контур слота
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 2;
      roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 8);
      ctx.stroke();
      ctx.restore();

      // DRAG ELEMENT (скопируем pieceMask)
      var dragCanvas = document.createElement("canvas");
      dragCanvas.width = pieceW;
      dragCanvas.height = pieceH;
      dragCanvas.style.cssText = "position:absolute;left:10px;top:" + (pieceY) + "px;cursor:grab;border-radius:6px;box-shadow:0 6px 14px rgba(0,0,0,0.25);";
      overlay.appendChild(dragCanvas);
      var dctx = dragCanvas.getContext('2d');
      dctx.clearRect(0,0,pieceW,pieceH);
      dctx.drawImage(pieceMask,0,0);

      // подсказка
      var hint = document.createElement("div");
      hint.style.cssText = "margin-top:8px;font-size:13px;color:#222;";
      hint.textContent = "Нажмите и перетащите кусок пазла в выемку.";
      wrap.appendChild(hint);

      // отладка — выведем координаты в консоль
      console.log("Puzzle seed:", seed, "pieceX:", pieceX, "pieceY:", pieceY, "W,H:", W,H);

      // state
      var state = {
        dragging: false,
        hadTrustedDown: false,
        hadTrustedMoves: 0,
        moves: [],
        downTime: 0,
        upTime: 0
      };

      function overlayRect(){ return overlay.getBoundingClientRect(); }

      dragCanvas.addEventListener("pointerdown", function(e){
        if (typeof e.isTrusted !== "undefined" && !e.isTrusted) {
          hint.textContent = "Недопустимое действие — используй мышь/палец.";
          return;
        }
        state.dragging = true;
        state.hadTrustedDown = !!(typeof e.isTrusted === "undefined" ? true : e.isTrusted);
        state.hadTrustedMoves = 0;
        state.moves = [];
        state.downTime = Date.now();
        dragCanvas.setPointerCapture(e.pointerId);
        dragCanvas.style.cursor = "grabbing";
      }, false);

      dragCanvas.addEventListener("pointermove", function(e){
        if(!state.dragging) return;
        var trusted = (typeof e.isTrusted === "undefined") ? true : e.isTrusted;
        if(trusted) state.hadTrustedMoves++;
        state.moves.push({x:e.clientX, y:e.clientY, t:Date.now(), trusted:trusted});

        var r = overlayRect();
        var localX = e.clientX - r.left - (pieceW/2);
        localX = Math.max(0, Math.min(W - pieceW, localX));
        dragCanvas.style.left = localX + "px";
        // фиксируем вертикально на уровне слота
        dragCanvas.style.top = (pieceY) + "px";
      }, false);

      dragCanvas.addEventListener("pointerup", function(e){
        if(!state.dragging) return;
        dragCanvas.releasePointerCapture(e.pointerId);
        state.dragging = false;
        state.upTime = Date.now();
        dragCanvas.style.cursor = "grab";

        // вычисляем final left
        var finalLeft = parseFloat(dragCanvas.style.left || "0");
        var correctLeft = pieceX; // в координатах canvas/overlay
        var tol = 10 + Math.random()*6; // немного толерантности

        // анализ поведения
        var totalTime = state.upTime - state.downTime;
        var moves = state.moves.length;
        var trusted = state.hadTrustedMoves;
        // скорости
        var speeds = [];
        for(var i=1;i<state.moves.length;i++){
          var dx = state.moves[i].x - state.moves[i-1].x;
          var dt = state.moves[i].t - state.moves[i-1].t || 1;
          speeds.push(Math.abs(dx)/dt);
        }
        var mean = speeds.length ? speeds.reduce((a,b)=>a+b,0)/speeds.length : 0;
        var variance = 0;
        if(speeds.length){
          variance = speeds.reduce((acc,s)=>acc + Math.pow(s-mean,2),0)/speeds.length;
        }

        console.log("Puzzle result:", {finalLeft, correctLeft, tol, totalTime, moves, trusted, mean, variance});

        var pass = false;
        if(state.hadTrustedDown && trusted >= 3 && moves >= 5 && totalTime >= 200 && variance > 0.0005) {
          if(Math.abs(finalLeft - correctLeft) <= tol) pass = true;
        }

        if(pass){
          dragCanvas.style.left = correctLeft + "px";
          hint.textContent = "✅ Отлично — проверено. Перенаправляем...";
          setTimeout(function(){
            var token = cntToken || sessionStorage.getItem("rubza_cnt_token") || "";
            if(token){
              var bonusUrl = "https://fastfaucet.pro/pages/utm_loto.php?cnt=" + encodeURIComponent(token) + "#tope";
              window.location.href = bonusUrl;
            } else {
              hint.textContent = "Токен не найден — обновите страницу.";
            }
          }, 600);
        } else {
          hint.textContent = "Не похоже на реальное перетаскивание. Попробуйте ещё раз.";
          // сбросить элемент в стартовую позицию
          dragCanvas.style.left = "10px";
          state.moves = [];
          state.hadTrustedMoves = 0;
          state.hadTrustedDown = false;
        }
      }, false);

      dragCanvas.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);
    }

  });

})(window, document);
