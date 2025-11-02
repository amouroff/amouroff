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
    // КАПЧА: ВЫБЕРИ ПРАВИЛЬНЫЙ СИМВОЛ (6 ВАРИАНТОВ) — УСЛОЖНЁННАЯ ВЕРСИЯ
    // ===========================
    function showHumanPuzzleCaptcha(){
      footer.innerHTML = "";
      var title = document.createElement("div");
      title.textContent = "Подтвердите, что вы человек — выберите правильный символ";
      title.style.cssText = "margin-bottom:8px;font-weight:700;";
      footer.appendChild(title);

      var wrap = document.createElement("div");
      wrap.style.cssText = "display:inline-block;padding:14px 16px;background:#fff;color:#000;border-radius:10px;box-shadow:0 8px 28px rgba(0,0,0,0.25);max-width:720px;";
      footer.appendChild(wrap);

      var hint = document.createElement("div");
      hint.style.cssText = "margin-bottom:10px;font-size:13px;color:#222;";
      hint.textContent = "Найдите и выберите символ, который показан вверху слева.";
      wrap.appendChild(hint);

      // top area: показываем "правильный" символ в маленьком окне (с искажениями)
      var topRow = document.createElement("div");
      topRow.style.cssText = "display:flex;align-items:center;gap:12px;margin-bottom:10px;";
      wrap.appendChild(topRow);

      var sampleBox = document.createElement("div");
      sampleBox.style.cssText = "width:72px;height:72px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);overflow:hidden;background:#f7f7f8;display:flex;align-items:center;justify-content:center;";
      topRow.appendChild(sampleBox);

      var sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = 72; sampleCanvas.height = 72;
      sampleBox.appendChild(sampleCanvas);
      var sctx = sampleCanvas.getContext('2d');

      var instruction = document.createElement("div");
      instruction.style.cssText = "font-size:13px;color:#444;max-width:560px;";
      instruction.textContent = "Запомните символ и выберите его среди вариантов.";
      topRow.appendChild(instruction);

      // noise canvas (затирает OCR)
      var noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = 640; noiseCanvas.height = 120;
      noiseCanvas.style.cssText = "display:block;border-radius:8px;overflow:hidden;margin-bottom:12px;";
      wrap.appendChild(noiseCanvas);
      var nctx = noiseCanvas.getContext('2d');

      // options row: 6 canvases as buttons
      var optsRow = document.createElement("div");
      optsRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;justify-content:center;";
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

      // symbols pool (большой набор)
      var pool = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
                  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя" +
                  "★☆✪✦✶✷✸✹✺✻✼✽✾✿☯☢☣☀☁☂☃☄✈✉☘♪♠♣♥♦").split('');

      function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
      function pickRandom(arr){ return arr[randInt(0,arr.length-1)]; }

      var seed = (Date.now() ^ (cntToken?cntToken.length:0)) & 0xffffffff;
      function lcg(s){ return function(){ s = (1664525*s + 1013904223) >>> 0; return s / 4294967296; }; }
      var rnd = lcg(seed);

      // draw noisy background to confuse bots/ocr
      function drawNoise(){
        nctx.clearRect(0,0,noiseCanvas.width,noiseCanvas.height);
        nctx.fillStyle = "#f5f6f7";
        nctx.fillRect(0,0,noiseCanvas.width,noiseCanvas.height);

        var count = 160 + Math.floor(rnd()*120);
        for(var i=0;i<count;i++){
          var ch = pool[Math.floor(rnd()*pool.length)];
          nctx.save();
          var x = Math.floor(rnd()*noiseCanvas.width);
          var y = Math.floor(rnd()*noiseCanvas.height);
          var r = 6 + Math.floor(rnd()*28);
          nctx.font = r + "px " + (["serif","sans-serif","monospace"])[Math.floor(rnd()*3)];
          nctx.globalAlpha = 0.05 + rnd()*0.2;
          nctx.translate(x,y);
          nctx.rotate((rnd()-0.5)*0.9);
          nctx.fillStyle = "rgba(" + Math.floor(rnd()*120) + "," + Math.floor(rnd()*120) + "," + Math.floor(rnd()*120) + ",1)";
          nctx.fillText(ch, 0, 0);
          nctx.restore();
        }

        for(var j=0;j<6;j++){
          nctx.beginPath();
          nctx.moveTo(rnd()*noiseCanvas.width, rnd()*noiseCanvas.height);
          for(var p=0;p<5;p++){
            nctx.quadraticCurveTo(rnd()*noiseCanvas.width, rnd()*noiseCanvas.height, rnd()*noiseCanvas.width, rnd()*noiseCanvas.height);
          }
          nctx.lineWidth = 1 + rnd()*2;
          nctx.strokeStyle = "rgba(0,0,0,"+(0.03 + rnd()*0.05)+")";
          nctx.stroke();
        }
      }

      // draw sample symbol
      function drawSample(char){
        sctx.clearRect(0,0,sampleCanvas.width,sampleCanvas.height);
        sctx.fillStyle = "#fbfbfc";
        sctx.fillRect(0,0,sampleCanvas.width,sampleCanvas.height);

        sctx.save();
        var tx = 36, ty = 36;
        sctx.translate(tx, ty);
        sctx.rotate((rnd()-0.5)*0.4);
        var fsz = 36 + Math.floor(rnd()*10);
        sctx.font = "bold " + fsz + "px sans-serif";
        sctx.textAlign = "center";
        sctx.textBaseline = "middle";
        sctx.fillStyle = "#111";
        sctx.fillText(char, 0, 0);
        sctx.globalCompositeOperation = "source-atop";
        for(var i=0;i<16;i++){
          sctx.globalAlpha = 0.03 + rnd()*0.06;
          sctx.fillText(pool[Math.floor(rnd()*pool.length)], (rnd()-0.5)*20, (rnd()-0.5)*20);
        }
        sctx.restore();
      }

      // create option canvas with distortions and noise
      function makeOptionCanvas(char){
        var cw = 96, ch = 96;
        var c = document.createElement("canvas");
        c.width = cw; c.height = ch;
        c.style.cssText = "width:96px;height:96px;border-radius:8px;display:inline-block;cursor:pointer;border:1px solid rgba(0,0,0,0.06);background:#fff;";
        var ctx = c.getContext('2d');

        var g = ctx.createLinearGradient(0,0,cw,ch);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(1, "#f3f4f6");
        ctx.fillStyle = g;
        ctx.fillRect(0,0,cw,ch);

        var clutter = 40 + Math.floor(rnd()*60);
        for(var i=0;i<clutter;i++){
          ctx.save();
          ctx.globalAlpha = 0.03 + rnd()*0.12;
          var fs = 6 + Math.floor(rnd()*28);
          ctx.font = fs + "px " + (["serif","sans-serif","monospace"])[Math.floor(rnd()*3)];
          ctx.translate(rnd()*cw, rnd()*ch);
          ctx.rotate((rnd()-0.5)*1.4);
          ctx.fillStyle = "rgba(" + Math.floor(rnd()*160) + "," + Math.floor(rnd()*160) + "," + Math.floor(rnd()*160) + ",1)";
          ctx.fillText(pool[Math.floor(rnd()*pool.length)], 0, 0);
          ctx.restore();
        }

        ctx.save();
        var offx = 8 + Math.floor(rnd()*16);
        var offy = 24 + Math.floor(rnd()*20);
        ctx.translate(offx, offy);
        ctx.rotate((rnd()-0.5)*0.6);
        var size = 44 + Math.floor(rnd()*18);
        ctx.font = "bold " + size + "px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fillText(char, 0, 20);
        ctx.globalCompositeOperation = "source-atop";
        for(var k=0;k<10;k++){
          ctx.globalAlpha = 0.02 + rnd()*0.06;
          ctx.fillText(pool[Math.floor(rnd()*pool.length)], (rnd()-0.5)*8, (rnd()-0.5)*8 + 20);
        }
        ctx.restore();

        for(var l=0;l<3;l++){
          ctx.beginPath();
          ctx.moveTo(rnd()*cw, rnd()*ch);
          ctx.quadraticCurveTo(rnd()*cw, rnd()*ch, rnd()*cw, rnd()*ch);
          ctx.lineWidth = 1 + rnd()*2;
          ctx.strokeStyle = "rgba(0,0,0," + (0.03 + rnd()*0.06) + ")";
          ctx.stroke();
        }

        var img = ctx.getImageData(0,0,cw,ch);
        for(var p=0;p<1200;p++){
          var x = Math.floor(rnd()*cw), y = Math.floor(rnd()*ch);
          var idx = (y*cw + x)*4;
          img.data[idx] = Math.min(255, img.data[idx] + Math.floor((rnd()-0.5)*40));
          img.data[idx+1] = Math.min(255, img.data[idx+1] + Math.floor((rnd()-0.5)*40));
          img.data[idx+2] = Math.min(255, img.data[idx+2] + Math.floor((rnd()-0.5)*40));
          img.data[idx+3] = 220;
        }
        ctx.putImageData(img,0,0);

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

      function renderUI(){
        drawNoise();
        drawSample(state.correctChar);
        optsRow.innerHTML = "";
        state.optionCanvases = [];
        state.choices.forEach(function(ch, idx){
          var c = makeOptionCanvas(ch);
          c.dataset.idx = idx;
          c.title = "Выберите символ";
          optsRow.appendChild(c);
          state.optionCanvases.push(c);
        });
      }

      // track pointer movement on wrap
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
            if(duration >= 250 && moveCount >= 6 && trustedMoves >= 2 && state.hadTrusted) passBehavior = true;

            var speeds = [];
            for(var i=1;i<moves.length;i++){
              var dx = moves[i].x - moves[i-1].x;
              var dt = moves[i].t - moves[i-1].t || 1;
              speeds.push(Math.abs(dx)/dt);
            }
            var mean = speeds.length ? speeds.reduce((a,b)=>a+b,0)/speeds.length : 0;
            var variance = speeds.length ? speeds.reduce((acc,s)=>acc + Math.pow(s-mean,2),0)/speeds.length : 0;
            if(variance < 0.0002) passBehavior = false;

            console.log("Captcha pick:", {pickIdx, duration, moveCount, trustedMoves, hadTrusted: state.hadTrusted, mean, variance, passBehavior});

            c.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
            c.style.transform = "translateY(-4px)";
            setTimeout(function(){ c.style.boxShadow = ""; c.style.transform = ""; }, 320);

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
              }, 700);
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
                  wrap.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:350});
                }
              }, 380);
            }

          }, false);
        });
      }

      // init captcha
      prepareChoices();
      renderUI();
      attachHandlers();

      // block context menu and hint if tab hidden
      wrap.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);
      if(document.hidden){
        instruction.textContent = "Вкладка должна быть активна — откройте её и попробуйте снова.";
      }

      var small = document.createElement("div");
      small.style.cssText = "margin-top:8px;font-size:11px;color:#666;";
      small.textContent = "Если у вас проблемы с отображением — обновите страницу.";
      wrap.appendChild(small);
    }

  });

})(window, document);
