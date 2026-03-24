(function () {

  /* ===============================
     НАСТРОЙКИ
  =============================== */
  var scrollStartDelay = 8000;
  var lockTime = 12000;

  var enableFakeMouse = true;
  var mouseMoveIntervalMin = 800;
  var mouseMoveIntervalMax = 2000;

  // Проверка UTM меток - теперь НЕ ОБЯЗАТЕЛЬНА для работы
  var hasUTM = window.location.search.includes('utm_');
  
  // Настройки кнопки согласия
  var checkAgreeInterval = 1000; // Интервал проверки кнопки
  var clickDelay = 1500; // Задержка перед кликом
  var agreeButtonFound = false;
  
  // Флаг для принудительного запуска (если нужно игнорировать UTM)
  var forceRun = true; // ИЗМЕНЕНО: теперь скрипт работает всегда

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* ===============================
     КНОПКА СОГЛАСИЯ - ПОИСК И КЛИК
  =============================== */
  
  // Массив текстов кнопок на разных языках (расширенный)
  var consentButtonTexts = [
    // Русский
    'согласен', 'согласна', 'принимаю', 'согласие', 'разрешаю', 'ok', 'хорошо', 'да',
    // КАЗАХСКИЙ
    'келісемін', 'келісу', 'макул', 'иә', 'жарайды',
    // АНГЛИЙСКИЙ
    'agree', 'accept', 'consent', 'allow', 'ok', 'yes', 'i agree', 'i accept',
    // УКРАИНСКИЙ
    'погоджуюсь', 'згоден', 'згодна', 'приймаю', 'добре',
    // НЕМЕЦКИЙ
    'zustimmen', 'akzeptieren', 'einverstanden',
    // ФРАНЦУЗСКИЙ
    'accepter', "d'accord", 'consentir',
    // ИСПАНСКИЙ
    'aceptar', 'de acuerdo', 'consentir',
    // ИТАЛЬЯНСКИЙ
    'accettare', 'consenso',
    // ПОЛЬСКИЙ
    'zgadzam się', 'akceptuję', 'zgoda',
    // ТУРЕЦКИЙ
    'kabul ediyorum', 'onaylıyorum', 'tamam',
    // КИТАЙСКИЙ
    '同意', '接受', '允许',
    // ЯПОНСКИЙ
    '同意する', '承認する', 'はい',
    // АРАБСКИЙ
    'موافق', 'قبول'
  ];
  
  // Функция проверки текста кнопки
  function isConsentButton(button) {
    if (!button) return false;
    
    // Получаем текст кнопки разными способами
    var buttonText = (button.textContent || button.innerText || button.value || '').toLowerCase().trim();
    
    // Проверяем точное совпадение или вхождение
    for (var i = 0; i < consentButtonTexts.length; i++) {
      var keyword = consentButtonTexts[i].toLowerCase();
      if (buttonText === keyword || buttonText.includes(keyword)) {
        console.log('Найдена кнопка с текстом:', buttonText);
        return true;
      }
    }
    
    // Проверяем атрибуты
    var attrs = ['title', 'aria-label', 'data-button-text', 'name'];
    for (var j = 0; j < attrs.length; j++) {
      var attrValue = (button.getAttribute(attrs[j]) || '').toLowerCase();
      for (var k = 0; k < consentButtonTexts.length; k++) {
        if (attrValue.includes(consentButtonTexts[k].toLowerCase())) {
          console.log('Найдена кнопка по атрибуту', attrs[j], ':', attrValue);
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Поиск кнопки согласия
  function findAgreeButton() {
    // 1. Ищем все возможные элементы-кнопки
    var selectors = [
      'button',
      'input[type="submit"]',
      'input[type="button"]',
      'a[role="button"]',
      'div[role="button"]',
      'span[role="button"]',
      '.btn',
      '.button',
      '[class*="button"]',
      '[class*="btn"]'
    ];
    
    var allButtons = document.querySelectorAll(selectors.join(','));
    
    for (var i = 0; i < allButtons.length; i++) {
      if (isConsentButton(allButtons[i])) {
        return allButtons[i];
      }
    }
    
    // 2. Ищем элементы с классами, содержащими ключевые слова
    var classKeywords = ['agree', 'consent', 'accept', 'келіс', 'соглас'];
    for (var j = 0; j < classKeywords.length; j++) {
      var elements = document.querySelectorAll('[class*="' + classKeywords[j] + '"], [id*="' + classKeywords[j] + '"]');
      for (var k = 0; k < elements.length; k++) {
        var el = elements[k];
        // Проверяем, является ли элемент кликабельным
        if (el.tagName === 'BUTTON' || 
            el.getAttribute('role') === 'button' ||
            el.classList.contains('btn') ||
            el.classList.contains('button')) {
          if (isConsentButton(el)) {
            return el;
          }
        }
      }
    }
    
    // 3. Ищем по точному совпадению текста (для коротких кнопок)
    var allClickable = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
    for (var m = 0; m < allClickable.length; m++) {
      var text = (allClickable[m].textContent || allClickable[m].innerText || '').trim();
      if (text.length <= 10) {
        var lowerText = text.toLowerCase();
        if (lowerText === 'согласен' || 
            lowerText === 'да' || 
            lowerText === 'yes' || 
            lowerText === 'ok' ||
            lowerText === 'келісемін') {
          console.log('Найдена короткая кнопка:', text);
          return allClickable[m];
        }
      }
    }
    
    return null;
  }
  
  // Клик по кнопке
  function clickButton(button) {
    if (!button || agreeButtonFound) return;
    
    console.log('Кнопка согласия найдена, готовлю клик...');
    agreeButtonFound = true;
    
    // Прокручиваем к кнопке
    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(function() {
      try {
        // Эмулируем события мыши
        var events = ['mouseover', 'mousedown', 'mouseup', 'click'];
        
        events.forEach(function(eventType) {
          var event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: button.getBoundingClientRect().left + 10,
            clientY: button.getBoundingClientRect().top + 10
          });
          button.dispatchEvent(event);
        });
        
        // Нативный клик
        button.click();
        
        console.log('✓ Кнопка "' + (button.textContent || button.innerText) + '" успешно нажата!');
        
      } catch (error) {
        console.log('Ошибка при клике:', error);
      }
    }, clickDelay);
  }
  
  // Основная функция поиска и клика
  function findAndClickAgreeButton() {
    // Если кнопка уже найдена, не ищем повторно
    if (agreeButtonFound) return;
    
    var button = findAgreeButton();
    
    if (button) {
      clickButton(button);
    } else {
      console.log('Кнопка согласия пока не найдена, продолжаем поиск...');
    }
  }
  
  // Запуск скрипта - ИЗМЕНЕНО: теперь работает без UTM меток
  console.log('Скрипт поиска кнопки согласия запущен');
  
  // Если есть UTM метки ИЛИ включен принудительный запуск
  if (hasUTM || forceRun) {
    console.log('Запускаю поиск кнопки согласия...');
    
    // Немедленный поиск
    setTimeout(findAndClickAgreeButton, 1000);
    setTimeout(findAndClickAgreeButton, 3000);
    setTimeout(findAndClickAgreeButton, 5000);
    
    // Периодическая проверка
    var checkInterval = setInterval(function() {
      if (!agreeButtonFound) {
        findAndClickAgreeButton();
      } else {
        clearInterval(checkInterval);
      }
    }, checkAgreeInterval);
    
    // Следим за изменениями DOM
    var observer = new MutationObserver(function() {
      if (!agreeButtonFound) {
        findAndClickAgreeButton();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // Останавливаем наблюдение после нахождения кнопки
    var stopObserver = setInterval(function() {
      if (agreeButtonFound) {
        observer.disconnect();
        clearInterval(stopObserver);
      }
    }, 500);
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
