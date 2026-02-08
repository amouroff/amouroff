(function () {

  /* ===============================
     НАСТРОЙКИ
  =============================== */
  var scrollStartDelay = 8000;
  var lockTime = 12000;

  var enableFakeMouse = true;
  var mouseMoveIntervalMin = 800;
  var mouseMoveIntervalMax = 2000;

  // Проверка UTM меток
  var hasUTM = window.location.search.includes('utm_');
  
  // Настройки кнопки AGREE
  var checkAgreeInterval = 1000; // Интервал проверки кнопки
  var clickDelay = 1500; // Задержка перед кликом
  var agreeButtonFound = false;

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* ===============================
     КНОПКА AGREE - ПОИСК И КЛИК
  =============================== */
  function findAndClickAgreeButton() {
    // Если нет UTM меток, выходим
    if (!hasUTM) return;
    
    // Если кнопка уже найдена и обработана, выходим
    if (agreeButtonFound) return;

    // Поиск кнопки AGREE по разным селекторам
    var agreeSelectors = [
      'button:contains("AGREE")',
      'button span:contains("AGREE")',
      '[class*="agree"]',
      '[class*="Agree"]',
      '[class*="AGREE"]',
      'button[class*="css-"] span:contains("AGREE")',
      'button:has(span:contains("AGREE"))',
      'button[class*="primary"]:has(span:contains("AGREE"))'
    ];

    var button = null;

    // Поиск по селекторам
    for (var i = 0; i < agreeSelectors.length; i++) {
      try {
        if (agreeSelectors[i].includes(':contains')) {
          // Поиск по тексту
          var allButtons = document.querySelectorAll('button');
          for (var j = 0; j < allButtons.length; j++) {
            if (allButtons[j].textContent.includes('AGREE') || 
                allButtons[j].innerText.includes('AGREE') ||
                allButtons[j].innerHTML.includes('AGREE')) {
              button = allButtons[j];
              break;
            }
          }
        } else {
          // Поиск по CSS селектору
          button = document.querySelector(agreeSelectors[i]);
        }
        if (button) break;
      } catch (e) {
        continue;
      }
    }

    if (button && !agreeButtonFound) {
      console.log('Кнопка AGREE найдена, готовлю клик...');
      agreeButtonFound = true;

      // Добавляем задержку перед кликом для реалистичности
      setTimeout(function() {
        try {
          // Создаем событие клика
          var mouseDown = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          
          var mouseUp = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          
          var clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });

          // Инициируем события
          button.dispatchEvent(mouseDown);
          setTimeout(function() {
            button.dispatchEvent(mouseUp);
            button.dispatchEvent(clickEvent);
            
            // Дополнительно вызываем нативный click
            button.click();
            
            console.log('Кнопка AGREE нажата!');
            
            // После клика можно добавить дополнительную логику
            setTimeout(function() {
              console.log('Подтверждение принято');
            }, 1000);

          }, 100);
          
        } catch (error) {
          console.log('Ошибка при клике на кнопку:', error);
        }
      }, clickDelay);
    }
  }

  // Запуск проверки кнопки AGREE если есть UTM метки
  if (hasUTM) {
    console.log('UTM метки обнаружены, запускаю мониторинг кнопки AGREE...');
    
    // Немедленная проверка
    findAndClickAgreeButton();
    
    // Периодическая проверка
    var agreeCheckInterval = setInterval(function() {
      if (!agreeButtonFound) {
        findAndClickAgreeButton();
      } else {
        // Останавливаем проверку после нахождения кнопки
        clearInterval(agreeCheckInterval);
      }
    }, checkAgreeInterval);

    // Также проверяем при изменениях DOM
    var observer = new MutationObserver(function() {
      if (!agreeButtonFound) {
        findAndClickAgreeButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

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
    mouse.style.background = 'rgba(0,0,0,0.0)'; // невидимая, но события есть
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

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > window.innerWidth) x = window.innerWidth;
      if (y > window.innerHeight) y = window.innerHeight;

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
    if (isLocked) {
      history.pushState(null, null, location.href);
    }
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
