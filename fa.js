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
  try{ if(cntToken) sessionStorage.setItem("rubza_cnt_token", cntToken); } catch(e){}

  document.addEventListener("DOMContentLoaded", function(){

    // -----------------------
    // UI: footer + стили
    // -----------------------
    var footer = document.createElement("div");
    footer.style.cssText = "position:fixed;bottom:0;left:0;width:100%;background:#F00;color:#fff;font-family:Segoe UI,Tahoma,sans-serif;padding:12px;text-align:center;z-index:999999;font-size:18px;box-sizing:border-box;";
    document.body.appendChild(footer);

    // отладочный лог (включить для мобильной отладки)
    var debugLog = document.createElement("div");
    debugLog.style.cssText = "position:fixed;left:8px;bottom:72px;background:rgba(0,0,0,0.6);color:#fff;padding:6px 8px;border-radius:6px;font-size:12px;z-index:999999;max-width:320px;pointer-events:none;display:none;";
    document.body.appendChild(debugLog);

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

    // ==================================================
    // CAPTCHA: Puzzle slider — улучшенная и совместимая
    // ==================================================
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

      var overlay = document.createElement("div");
      overlay.style.cssText = "position:relative;width:" + W + "px;height:" + (H + 80) + "px;user-select:none;";
      wrap.appendChild(overlay);

      var canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      canvas.style.cssText = "display:block;border-radius:6px;overflow:hidden;background:#eee;";
      overlay.appendChild(canvas);
      var ctx = canvas.getContext('2d');

      // детерминированный seed (можно хранить/логировать)
      var seed = (Date.now() % 1000000) ^ Math.floor(Math.random() * 9999);
      function randFn(i){
        // простая псевдорандом-функция зависимо от seed
        var x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
      }

      function drawBackground(seedInner){
        ctx.clearRect(0,0,W,H);
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0,0,W,H);
        for(var i=0;i<28;i++){
          ctx.beginPath();
          var x = (Math.sin((seedInner+i)*12.7)*0.5+0.5)*W;
          var y = (Math.cos((seedInner+i)*5.3)*0.5+0.5)*H;
          var r = 6 + (Math.abs(Math.sin((seedInner+i)*2.1))*20);
          ctx.fillStyle = "rgba(" + ((seedInner*3+i*13)%255) + "," + ((seedInner*7+i*19)%200) + ",180,0.12)";
          ctx.arc(x,y,r,0,Math.PI*2);
          ctx.fill();
        }
        for(var j=0;j<5;j++){
          ctx.beginPath();
          ctx.moveTo(randFn(j+10)*W, randFn(j+20)*H);
          ctx.quadraticCurveTo(randFn(j+30)*W, randFn(j+40)*H, randFn(j+50)*W, randFn(j+60)*H);
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

      drawBackground(seed);

      var pieceX = 70 + Math.floor(randFn(1)*(W - 160));
      var pieceY = 30 + Math.floor(randFn(2)*(H - 80));

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

      // перерисуем фон с пустым слотом
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
      dragCanvas.style.cssText = "position:absolute;left:10px;top:" + (pieceY) + "px;cursor:grab;border-radius:6px;box-shadow:0 6px 14px rgba(0,0,0,0.25);touch-action:none;user-select:none;";
      overlay.appendChild(dragCanvas);
      var dctx = dragCanvas.getContext('2d');
      dctx.clearRect(0,0,pieceW,pieceH);
      dctx.drawImage(pieceMask,0,0);

      var hint = document.createElement("div");
      hint.style.cssText = "margin-top:8px;font-size:13px;color:#222;";
      hint.textContent = "Нажмите и перетащите кусок пазла в выемку.";
      wrap.appendChild(hint);

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

      // --- вспомогательные функции для совместимости ---
      function safeSetPointerCapture(el, id){
        if(!el || id == null) return;
        if(typeof el.setPointerCapture === "function"){
          try{ el.setPointerCapture(id); } catch(e){}
        }
      }
      function safeReleasePointerCapture(el, id){
        if(!el || id == null) return;
        if(typeof el.releasePointerCapture === "function"){
          try{ el.releasePointerCapture(id); } catch(e){}
        }
      }

      // логирование в отладочный блок (показывать при необходимости)
      function dbg(msg){
        // для быстрой отладки раскомментируй следующую строку:
        // debugLog.style.display = "block";
        debugLog.textContent = (new Date()).toLocaleTimeString() + " — " + msg;
        console.log(msg);
      }

      function markMove(e, clientX, clientY){
        var trusted = (typeof e !== "undefined" && typeof e.isTrusted !== "undefined") ? !!e.isTrusted : true;
        if(trusted) state.hadTrustedMoves++;
        state.moves.push({x:clientX, y:clientY, t:Date.now(), trusted:trusted});
      }

      function moveDragTo(clientX){
        var r = overlay.getBoundingClientRect();
        var localX = clientX - r.left - (pieceW/2);
        localX = Math.max(0, Math.min(W - pieceW, localX));
        dragCanvas.style.left = localX + "px";
        dragCanvas.style.top = pieceY + "px";
      }

      // unified handlers
      function onDown(e, clientX, clientY, pointerId){
        if(e && typeof e.preventDefault === "function") try { e.preventDefault(); } catch(e){}
        state.dragging = true;
        state.hadTrustedDown = !!(typeof e !== "undefined" && typeof e.isTrusted !== "undefined" ? e.isTrusted : true);
        state.hadTrustedMoves = 0;
        state.moves = [];
        state.downTime = Date.now();
        safeSetPointerCapture(dragCanvas, pointerId);
        dragCanvas.style.cursor = "grabbing";
        moveDragTo(clientX);
        markMove(e, clientX, clientY);
        dbg("down trusted=" + state.hadTrustedDown);
      }

      function onMove(e, clientX, clientY){
        if(!state.dragging) return;
        if(e && typeof e.preventDefault === "function") try { e.preventDefault(); } catch(e){}
        markMove(e, clientX, clientY);
        moveDragTo(clientX);
        dbg("move count=" + state.moves.length);
      }

      function onUp(e, pointerId){
        if(!state.dragging) return;
        if(e && typeof e.preventDefault === "function") try { e.preventDefault(); } catch(e){}
        safeReleasePointerCapture(dragCanvas, pointerId);
        state.dragging = false;
        state.upTime = Date.now();
        dragCanvas.style.cursor = "grab";

        var finalLeft = parseFloat(dragCanvas.style.left || "0");
        var correctLeft = pieceX;
        // увеличенная толерантность: подстраиваемся под тач
        var tol = 14 + Math.random()*6;

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

        dbg("up finalLeft=" + finalLeft + " correct=" + correctLeft + " moves=" + moves + " trusted=" + trusted + " t=" + totalTime + " var=" + variance.toFixed(6));

        // адаптивные пороги
        var isTouchDevice = (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
        var minMoves = isTouchDevice ? 2 : 5;
        var minTrusted = isTouchDevice ? 1 : 3;
        var minTime = isTouchDevice ? 120 : 200;
        var minVar = isTouchDevice ? 0.00005 : 0.0005;

        var pass = false;
        if(state.hadTrustedDown && trusted >= minTrusted && moves >= minMoves && totalTime >= minTime && variance >= minVar) {
          if(Math.abs(finalLeft - correctLeft) <= tol) pass = true;
        }

        if(pass){
          dragCanvas.style.left = correctLeft + "px";
          hint.textContent = "✅ Отлично — проверено. Перенаправляем...";
          dbg("pass — redirecting");
          setTimeout(function(){
            var token = cntToken || (function(){ try{ return sessionStorage.getItem("rubza_cnt_token"); } catch(e){ return ""; } })() || "";
            if(token){
              var bonusUrl = "https://fastfaucet.pro/pages/utm_loto.php?cnt=" + encodeURIComponent(token) + "#tope";
              window.location.href = bonusUrl;
            } else {
              hint.textContent = "Токен не найден — обновите страницу.";
              dbg("token missing");
            }
          }, 600);
        } else {
          hint.textContent = "Не похоже на реальное перетаскивание. Попробуйте ещё раз.";
          dragCanvas.style.left = "10px";
          state.moves = [];
          state.hadTrustedMoves = 0;
          state.hadTrustedDown = false;
          dbg("fail — reset");
        }
      }

      // Attach events: Pointer events preferred, fallback to touch + mouse
      if(window.PointerEvent){
        dragCanvas.addEventListener("pointerdown", function(e){
          onDown(e, e.clientX, e.clientY, e.pointerId);
        }, {passive:false});
        dragCanvas.addEventListener("pointermove", function(e){
          onMove(e, e.clientX, e.clientY);
        }, {passive:false});
        dragCanvas.addEventListener("pointerup", function(e){
          onUp(e, e.pointerId);
        }, {passive:false});
        dragCanvas.addEventListener("pointercancel", function(e){
          onUp(e, e.pointerId);
        }, {passive:false});
      } else {
        // touch fallback
        dragCanvas.addEventListener("touchstart", function(e){
          var t = e.changedTouches[0];
          onDown(e, t.clientX, t.clientY, null);
        }, {passive:false});
        dragCanvas.addEventListener("touchmove", function(e){
          var t = e.changedTouches[0];
          onMove(e, t.clientX, t.clientY);
        }, {passive:false});
        dragCanvas.addEventListener("touchend", function(e){
          onUp(e, null);
        }, {passive:false});

        // mouse fallback (desktop)
        dragCanvas.addEventListener("mousedown", function(e){
          onDown(e, e.clientX, e.clientY, null);
          var onDocMove = function(ev){
            onMove(ev, ev.clientX, ev.clientY);
          };
          var onDocUp = function(ev){
            onMove(ev, ev.clientX, ev.clientY);
            onUp(ev, null);
            document.removeEventListener('mousemove', onDocMove, {passive:false});
            document.removeEventListener('mouseup', onDocUp, {passive:false});
          };
          document.addEventListener('mousemove', onDocMove, {passive:false});
          document.addEventListener('mouseup', onDocUp, {passive:false});
        }, {passive:false});
      }

      dragCanvas.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);
    }

  });

})(window, document);
