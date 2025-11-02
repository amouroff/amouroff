(function(window, document){
  "use strict";

  function getParam(name){
    try { return new URLSearchParams(window.location.search).get(name) || ""; }
    catch(e){ return ""; }
  }

  var utm_source = getParam("utm_source");
  var utm_medium = getParam("utm_medium");
  var utm_campaign = getParam("utm_campaign");

  // ограничение: только YANDEX organic ads
  if (utm_source !== "yandex" || utm_medium !== "organic" || utm_campaign !== "ads") {
    return;
  }

  var cntToken = getParam("cnt_token") || "";
  if(cntToken) try{ sessionStorage.setItem("rubza_cnt_token", cntToken); } catch(e){}

  // helper: setup canvas for crisp rendering on high-DPI screens
  function setupCanvas(canvas, cssW, cssH){
    var dpr = window.devicePixelRatio || 1;
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

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
    // RESPONSIVE КАПЧА: ВЫБЕРИ СИМВОЛ (6) — РАБОТАЕТ НА ТЕЛЕФОНАХ
    // ===========================
    function showHumanPuzzleCaptcha(){
      footer.innerHTML = "";

      // compute responsive container width
      function getContainerWidth(){
        var pad = 24; // left-right safe padding
        var maxW = 720;
        return Math.max(280, Math.min(maxW, window.innerWidth - pad));
      }

      var containerW = getContainerWidth();

      var title = document.createElement("div");
      title.textContent = "Подтвердите, что вы человек — выберите правильный символ";
      title.style.cssText = "margin-bottom:8px;font-weight:700;font-size:16px;";
      footer.appendChild(title);

      var wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:12px;background:#fff;color:#000;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,0.25);max-width:calc(100% - 24px);width:" + containerW + "px;box-sizing:border-box;";
      footer.appendChild(wrap);

      var hint = document.createElement("div");
      hint.style.cssText = "margin-bottom:8px;font-size:13px;color:#222;text-align:center;";
      hint.textContent = "Найдите и выберите символ, который показан слева сверху.";
      wrap.appendChild(hint);

      // top area with sample + instruction
      var topRow = document.createElement("div");
      topRow.style.cssText = "display:flex;align-items:center;gap:10px;width:100%;justify-content:flex-start;margin-bottom:8px;";
      wrap.appendChild(topRow);

      var sampleSize = Math.max(48, Math.floor(containerW * 0.12)); // responsive sample
      var sampleBox = document.createElement("div");
      sampleBox.style.cssText = "width:" + sampleSize + "px;height:" + sampleSize + "px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);overflow:hidden;background:#f7f7f8;display:flex;align-items:center;justify-content:center;flex:0 0 auto;";
      topRow.appendChild(sampleBox);

      var sampleCanvas = document.createElement("canvas");
      var sctx = setupCanvas(sampleCanvas, sampleSize, sampleSize);
      sampleBox.appendChild(sampleCanvas);

      var instruction = document.createElement("div");
      instruction.style.cssText = "font-size:13px;color:#444;flex:1;min-width:0;";
      instruction.textContent = "Запомните символ и выберите его среди вариантов ниже.";
      topRow.appendChild(instruction);

      // noise canvas (large but responsive)
      var noiseW = containerW - 12;
      var noiseH = Math.max(80, Math.floor(noiseW * 0.18));
      var noiseCanvas = document.createElement("canvas");
      noiseCanvas.style.cssText = "display:block;border-radius:8px;overflow:hidden;margin-bottom:10px;width:" + noiseW + "px;height:" + noiseH + "px;";
      var nctx = setupCanvas(noiseCanvas, noiseW, noiseH);
      wrap.appendChild(noiseCanvas);

      // options container: flex-wrap so it fits on small screens
      var optsRow = document.createElement("div");
      optsRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;justify-content:center;width:100%;";
      wrap.appendChild(optsRow);

      // state + tracking
      var state = {
        correctChar: null,
        correctIndex: null,
        choices: [],
        startTime: Date.now(),
        moves: [],
        hadTrusted: false
      };

      // large pool
      var pool = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
                  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя" +
                  "★☆✪✦✶✷✸✹✺✻✼✽✾✿☯☢☣☀☁☂☃☄✈✉☘♪♠♣♥♦").split('');

      function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
      function pickRandom(arr){ return arr[randInt(0,arr.length-1)]; }

      var seed = (Date.now() ^ (cntToken?cntToken.length:0)) & 0xffffffff;
      function lcg(s){ return function(){ s = (1664525*s + 1013904223) >>> 0; return s / 4294967296; }; }
      var rnd = lcg(seed);

      // DRAW NOISE
      function drawNoise(ctx, w, h){
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = "#f5f6f7";
        ctx.fillRect(0,0,w,h);

        var count = 120 + Math.floor(rnd()*120);
        for(var i=0;i<count;i++){
          var ch = pool[Math.floor(rnd()*pool.length)];
          ctx.save();
          var x = Math.floor(rnd()*w);
          var y = Math.floor(rnd()*h);
          var r = 6 + Math.floor(rnd()*22);
          ctx.font = r + "px " + (["serif","sans-serif","monospace"])[Math.floor(rnd()*3)];
          ctx.globalAlpha = 0.05 + rnd()*0.18;
          ctx.translate(x,y);
          ctx.rotate((rnd()-0.5)*0.9);
          ctx.fillStyle = "rgba(" + Math.floor(rnd()*120) + "," + Math.floor(rnd()*120) + "," + Math.floor(rnd()*120) + ",1)";
          ctx.fillText(ch, 0, 0);
          ctx.restore();
        }

        for(var j=0;j<5;j++){
          ctx.beginPath();
          ctx.moveTo(rnd()*w, rnd()*h);
          for(var p=0;p<5;p++){
            ctx.quadraticCurveTo(rnd()*w, rnd()*h, rnd()*w, rnd()*h);
          }
          ctx.lineWidth = 1 + rnd()*2;
          ctx.strokeStyle = "rgba(0,0,0,"+(0.03 + rnd()*0.05)+")";
          ctx.stroke();
        }
      }

      // draw sample symbol
      function drawSample(char){
        // sampleCanvas already scaled via setupCanvas; sctx is a high-DPI context
        sctx.clearRect(0,0,sampleCanvas.width, sampleCanvas.height);
        // But note: sctx coordinates are in CSS pixels because setTransform used dpr scaling
        sctx.fillStyle = "#fbfbfc";
        sctx.fillRect(0,0,sampleCanvas.width/(window.devicePixelRatio||1), sampleCanvas.height/(window.devicePixelRatio||1));

        sctx.save();
        var cssW = sampleCanvas.clientWidth;
        var cssH = sampleCanvas.clientHeight;
        var tx = cssW/2, ty = cssH/2;
        sctx.translate(tx, ty);
        sctx.rotate((rnd()-0.5)*0.4);
        var fsz = Math.max(18, Math.floor(cssH*0.6 + rnd()*6));
        sctx.font = "bold " + fsz + "px sans-serif";
        sctx.textAlign = "center";
        sctx.textBaseline = "middle";
        sctx.fillStyle = "#111";
        sctx.fillText(char, 0, 0);
        sctx.globalCompositeOperation = "source-atop";
        for(var i=0;i<10;i++){
          sctx.globalAlpha = 0.03 + rnd()*0.06;
          sctx.fillText(pool[Math.floor(rnd()*pool.length)], (rnd()-0.5)*cssW*0.3, (rnd()-0.5)*cssH*0.3);
        }
        sctx.restore();
      }

      // create option canvas responsive
      function makeOptionCanvas(char, optSizeCss){
        var css = Math.max(56, Math.floor(optSizeCss)); // min 56
        var cw = css, ch = css;
        var c = document.createElement("canvas");
        var ctx = setupCanvas(c, cw, ch);
        c.style.cssText = "width:" + cw + "px;height:" + ch + "px;border-radius:8px;display:inline-block;cursor:pointer;border:1px solid rgba(0,0,0,0.06);background:#fff;";
        c.width = Math.floor(cw * (window.devicePixelRatio||1));
        c.height = Math.floor(ch * (window.devicePixelRatio||1));
        // draw background gradient
        var g = ctx.createLinearGradient(0,0,cw,ch);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(1, "#f3f4f6");
        ctx.fillStyle = g;
        ctx.fillRect(0,0,cw,ch);

        // clutter glyphs
        var clutter = 18 + Math.floor(rnd()*40);
        for(var i=0;i<clutter;i++){
          ctx.save();
          ctx.globalAlpha = 0.04 + rnd()*0.12;
          var fs = 6 + Math.floor(rnd()*Math.max(8, cw*0.35));
          ctx.font = fs + "px " + (["serif","sans-serif","monospace"])[Math.floor(rnd()*3)];
          ctx.translate(rnd()*cw, rnd()*ch);
          ctx.rotate((rnd()-0.5)*1.4);
          ctx.fillStyle = "rgba(" + Math.floor(rnd()*160) + "," + Math.floor(rnd()*160) + "," + Math.floor(rnd()*160) + ",1)";
          ctx.fillText(pool[Math.floor(rnd()*pool.length)], 0, 0);
          ctx.restore();
        }

        // main char
        ctx.save();
        var offx = 8 + Math.floor(rnd()*Math.max(4, cw*0.08));
        var offy = Math.floor(ch*0.45 + rnd()*8);
        ctx.translate(offx, offy);
        ctx.rotate((rnd()-0.5)*0.6);
        var size = Math.floor(Math.max(22, cw*0.45 + rnd()*8));
        ctx.font = "bold " + size + "px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillText(char, 0, 0);
        ctx.globalCompositeOperation = "source-atop";
        for(var k=0;k<6;k++){
          ctx.globalAlpha = 0.02 + rnd()*0.06;
          ctx.fillText(pool[Math.floor(rnd()*pool.length)], (rnd()-0.5)*8, (rnd()-0.5)*8);
        }
        ctx.restore();

        // lines
        for(var l=0;l<2;l++){
          ctx.beginPath();
          ctx.moveTo(rnd()*cw, rnd()*ch);
          ctx.quadraticCurveTo(rnd()*cw, rnd()*ch, rnd()*cw, rnd()*ch);
          ctx.lineWidth = 1 + rnd()*1.6;
          ctx.strokeStyle = "rgba(0,0,0," + (0.03 + rnd()*0.06) + ")";
          ctx.stroke();
        }

        // per-pixel mild noise
        try {
          var img = ctx.getImageData(0,0,cw,ch);
          for(var p=0;p<Math.floor(cw*ch*0.03);p++){
            var x = Math.floor(rnd()*cw), y = Math.floor(rnd()*ch);
            var idx = (y*cw + x)*4;
            img.data[idx] = Math.min(255, img.data[idx] + Math.floor((rnd()-0.5)*30));
            img.data[idx+1] = Math.min(255, img.data[idx+1] + Math.floor((rnd()-0.5)*30));
            img.data[idx+2] = Math.min(255, img.data[idx+2] + Math.floor((rnd()-0.5)*30));
            img.data[idx+3] = 220;
          }
          ctx.putImageData(img,0,0);
        } catch(e){
          // some browsers may restrict putImageData on tainted canvases; ignore
        }

        return c;
      }

      // prepare 6 choices
      function prepareChoices(){
        var choices = [];
        var correct = pool[Math.floor(rnd()*pool.length)];
        state.correctChar = correct;
        var set = {};
        set[correct] = true;
        choices.push(correct);
        while(choices.length < 6){
          var ch = pool[Math.floor(rnd()*pool.length)];
          if(!set[ch]){
            set[ch] = true; choices.push(ch);
          }
        }
        // shuffle
        for(var i=choices.length-1;i>0;i--){
          var j = Math.floor(rnd()*(i+1));
          var tmp = choices[i]; choices[i] = choices[j]; choices[j] = tmp;
        }
        state.choices = choices;
        state.correctIndex = choices.indexOf(correct);
      }

      // render UI
      function renderUI(){
        // recalc container sizes on render (in case of rotation)
        containerW = getContainerWidth();
        wrap.style.width = containerW + "px";
        noiseW = containerW - 12;
        noiseH = Math.max(80, Math.floor(noiseW * 0.18));
        // resize noise canvas
        setupCanvas(noiseCanvas, noiseW, noiseH);
        // sample canvas resize
        sampleSize = Math.max(48, Math.floor(containerW * 0.12));
        setupCanvas(sampleCanvas, sampleSize, sampleSize);
        // draw noise & sample & options
        drawNoise(nctx, noiseW, noiseH);
        drawSample(state.correctChar);

        // clear options
        optsRow.innerHTML = "";
        state.optionCanvases = [];
        // pick option size relative to container
        var optCss = Math.max(64, Math.floor(containerW / 6.5));
        state.choices.forEach(function(ch, idx){
          var c = makeOptionCanvas(ch, optCss);
          c.dataset.idx = idx;
          c.title = "Выберите символ";
          // wrap each canvas with a div to add responsive shrink
          var holder = document.createElement("div");
          holder.style.cssText = "flex:0 0 auto;";
          holder.appendChild(c);
          optsRow.appendChild(holder);
          state.optionCanvases.push(c);
        });
      }

      // pointer tracking
      wrap.addEventListener("pointermove", function(e){
        var trusted = (typeof e.isTrusted === "undefined") ? true : e.isTrusted;
        if(trusted) state.hadTrusted = true;
        state.moves.push({x:e.clientX, y:e.clientY, t:Date.now(), trusted:trusted});
        if(state.moves.length > 600) state.moves.splice(0, state.moves.length-500);
      }, false);

      function attachHandlers(){
        state.optionCanvases.forEach(function(c){
          c.addEventListener("pointerdown", function(e){
            var trustedDown = (typeof e.isTrusted === "undefined") ? true : e.isTrusted;
            var pickTime = Date.now();
            var pickIdx = parseInt(c.dataset.idx,10);
            var moves = state.moves.slice();
            var duration = pickTime - state.startTime;
            var trustedMoves = moves.filter(m=>m.trusted).length;
            var moveCount = moves.length;

            var passBehavior = false;
            if(duration >= 200 && moveCount >= 5 && trustedMoves >= 2 && state.hadTrusted) passBehavior = true;

            var speeds = [];
            for(var i=1;i<moves.length;i++){
              var dx = moves[i].x - moves[i-1].x;
              var dt = moves[i].t - moves[i-1].t || 1;
              speeds.push(Math.abs(dx)/dt);
            }
            var mean = speeds.length ? speeds.reduce((a,b)=>a+b,0)/speeds.length : 0;
            var variance = speeds.length ? speeds.reduce((acc,s)=>acc + Math.pow(s-mean,2),0)/speeds.length : 0;
            if(variance < 0.00015) passBehavior = false;

            console.log("Captcha pick:", {pickIdx, duration, moveCount, trustedMoves, hadTrusted: state.hadTrusted, mean, variance, passBehavior});

            // tactile feedback
            c.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
            c.style.transform = "translateY(-4px)";
            setTimeout(function(){ c.style.boxShadow = ""; c.style.transform = ""; }, 260);

            var isCorrect = (pickIdx === state.correctIndex);
            var accepted = isCorrect && passBehavior;

            if(accepted){
              instruction.textContent = "✅ Отлично — проверено. Перенаправляем...";
              setTimeout(function(){
                var token = cntToken || sessionStorage.getItem("rubza_cnt_token") || "";
                if(token){
                  var bonusUrl = "https://fastfaucet.pro/pages/utm_loto.php?cnt=" + encodeURIComponent(token) + "#tope";
                  window.location.href = bonusUrl;
                } else {
                  instruction.textContent = "Токен не найден — обновите страницу.";
                }
              }, 650);
            } else {
              instruction.textContent = "Не похоже на корректный выбор. Попробуйте ещё раз.";
              setTimeout(function(){
                seed = (seed ^ (Date.now() & 0xffff)) >>> 0;
                rnd = lcg(seed);
                state.startTime = Date.now();
                state.moves = [];
                state.hadTrusted = false;
                prepareChoices();
                renderUI();
                attachHandlers();
                if (wrap.animate) {
                  wrap.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300});
                }
              }, 320);
            }

          }, false);
        });
      }

      // init
      prepareChoices();
      renderUI();
      attachHandlers();

      // update on orientation/resize so mobile works after rotation
      var resizeTimer;
      function onResize(){
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
          // recompute sizes and re-render
          renderUI();
          attachHandlers();
        }, 150);
      }
      window.addEventListener("resize", onResize);

      // block context menu inside widget
      wrap.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);

      if(document.hidden){
        instruction.textContent = "Вкладка должна быть активна — откройте её и попробуйте снова.";
      }

      var small = document.createElement("div");
      small.style.cssText = "margin-top:8px;font-size:11px;color:#666;";
      small.textContent = "Если проблемы с отображением — обновите страницу.";
      wrap.appendChild(small);
    }

  });

})(window, document);
