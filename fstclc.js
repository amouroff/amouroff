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

    // === Шаг 3. ПАЗЛ-КАПЧА (замена математической капчи) ===
    function showCaptcha(){
      footer.innerHTML = "";

      var title = document.createElement("div");
      title.textContent = "Подтвердите, что вы человек — перетащите кусочек пазла на место";
      title.style.cssText = "margin-bottom:8px;font-weight:700;color:#fff;";
      footer.appendChild(title);

      var wrap = document.createElement("div");
      wrap.style.cssText = "display:inline-block;padding:12px;background:#fff;color:#000;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.25);";
      footer.appendChild(wrap);

      var W = 320, H = 140;
      var pieceW = 56, pieceH = 56;

      var overlay = document.createElement("div");
      overlay.style.cssText = "position:relative;width:" + W + "px;height:" + (H + 80) + "px;user-select:none;";
      wrap.appendChild(overlay);

      var canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      canvas.style.cssText = "display:block;border-radius:6px;overflow:hidden;background:#eee;";
      overlay.appendChild(canvas);
      var ctx = canvas.getContext('2d');

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

      var pieceBuf = document.createElement("canvas");
      pieceBuf.width = pieceW;
      pieceBuf.height = pieceH;
      var pbCtx = pieceBuf.getContext('2d');
      pbCtx.drawImage(canvas, pieceX, pieceY, pieceW, pieceH, 0, 0, pieceW, pieceH);

      var pieceMask = document.createElement("canvas");
      pieceMask.width = pieceW;
      pieceMask.height = pieceH;
      var pm = pieceMask.getContext('2d');
      pm.drawImage(pieceBuf,0,0);
      pm.globalCompositeOperation = "destination-in";
      pm.fillStyle = "#000";
      roundRectPath(pm,0,0,pieceW,pieceH,8);
      pm.fill();

      drawBackground(seed);
      ctx.save();
      ctx.fillStyle = "#f7f7f7";
      roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 8);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 2;
      roundRectPath(ctx, pieceX, pieceY, pieceW, pieceH, 8);
      ctx.stroke();
      ctx.restore();

      var dragCanvas = document.createElement("canvas");
      dragCanvas.width = pieceW;
      dragCanvas.height = pieceH;
      dragCanvas.style.cssText = "position:absolute;left:10px;top:" + (pieceY) + "px;cursor:grab;border-radius:6px;box-shadow:0 6px 14px rgba(0,0,0,0.25);";
      overlay.appendChild(dragCanvas);
      var dctx = dragCanvas.getContext('2d');
      dctx.clearRect(0,0,pieceW,pieceH);
      dctx.drawImage(pieceMask,0,0);

      var hint = document.createElement("div");
      hint.style.cssText = "margin-top:8px;font-size:13px;color:#222;";
      hint.textContent = "Нажмите и перетащите кусок пазла в выемку.";
      wrap.appendChild(hint);

      console.log("Puzzle seed:", seed, "pieceX:", pieceX, "pieceY:", pieceY, "W,H:", W,H);

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
        dragCanvas.style.top = (pieceY) + "px";
      }, false);

      dragCanvas.addEventListener("pointerup", function(e){
        if(!state.dragging) return;
        dragCanvas.releasePointerCapture(e.pointerId);
        state.dragging = false;
        state.upTime = Date.now();
        dragCanvas.style.cursor = "grab";

        var finalLeft = parseFloat(dragCanvas.style.left || "0");
        var correctLeft = pieceX;
        var tol = 10 + Math.random()*6;

        var totalTime = state.upTime - state.downTime;
        var moves = state.moves.length;
        var trusted = state.hadTrustedMoves;
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
              var bonusUrl = "https://fastfaucet.pro/pages/utm_clicks.php?cnt=" + encodeURIComponent(token) + "#tope";
              window.location.href = bonusUrl;
            } else {
              hint.textContent = "Токен не найден — обновите страницу.";
            }
          }, 600);
        } else {
          hint.textContent = "Не похоже на реальное перетаскивание. Попробуйте ещё раз.";
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
