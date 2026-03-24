(function () {

  /* ===============================
     НАСТРОЙКИ
  =============================== */
  var scrollStartDelay = 8000;
  var lockTime = 12000;
  var enableFakeMouse = true;
  var mouseMoveIntervalMin = 800;
  var mouseMoveIntervalMax = 2000;
  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  var clickDelay = 300; // Минимальная задержка
  var agreeButtonFound = false;

  /* ===============================
     РАСШИРЕННЫЙ ПОИСК КНОПКИ
  =============================== */
  
  // Ключевые слова на всех языках
  var consentKeywords = [
    'согласен', 'согласна', 'согласие', 'принимаю', 'разрешаю',
    'келісемін', 'келісу', 'макул',
    'agree', 'accept', 'consent', 'allow',
    'zustimmen', 'akzeptieren',
    'accepter', 'aceptar', 'accettare',
    '同意', 'موافق'
  ];
  
  // Проверка, является ли элемент кнопкой согласия
  function isConsentElement(el) {
    if (!el) return false;
    
    // Проверяем текст
    var text = (el.textContent || el.innerText || '').trim().toLowerCase();
    for (var i = 0; i < consentKeywords.length; i++) {
      if (text === consentKeywords[i].toLowerCase() || 
          text.includes(consentKeywords[i].toLowerCase())) {
        return true;
      }
    }
    
    // Проверяем атрибуты
    var attrs = ['title', 'aria-label', 'data-text', 'data-button-text', 'name', 'id', 'class'];
    for (var j = 0; j < attrs.length; j++) {
      var attrVal = (el.getAttribute(attrs[j]) || '').toLowerCase();
      for (var k = 0; k < consentKeywords.length; k++) {
        if (attrVal.includes(consentKeywords[k].toLowerCase())) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Поиск кнопки всеми возможными способами
  function findConsentButton() {
    // Способ 1: Все возможные кликабельные элементы
    var clickableSelectors = [
      'button', 
      'input[type="submit"]', 
      'input[type="button"]',
      'a', 
      'div[role="button"]', 
      'span[role="button"]',
      '[onclick]',
      '[class*="btn"]',
      '[class*="button"]',
      '[class*="agree"]',
      '[class*="consent"]',
      '[class*="accept"]',
      '[class*="келіс"]',
      '[class*="соглас"]'
    ];
    
    var allClickable = document.querySelectorAll(clickableSelectors.join(','));
    for (var i = 0; i < allClickable.length; i++) {
      if (isConsentElement(allClickable[i])) {
        return allClickable[i];
      }
    }
    
    // Способ 2: Любой элемент с точным текстом
    var allElements = document.querySelectorAll('*');
    for (var j = 0; j < allElements.length; j++) {
      var text = (allElements[j].textContent || '').trim();
      // Ищем элементы с коротким текстом (до 20 символов)
      if (text.length > 0 && text.length < 20) {
        if (isConsentElement(allElements[j])) {
          return allElements[j];
        }
      }
    }
    
    // Способ 3: Поиск по XPath (более точный)
    try {
      var xpathResults = document.evaluate(
        "//*[contains(text(),'СОГЛАСЕН') or contains(text(),'AGREE') or contains(text(),'КЕЛІСЕМІН')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      if (xpathResults.singleNodeValue) {
        return xpathResults.singleNodeValue;
      }
    } catch(e) {}
    
    return null;
  }
  
  // Поиск в iframe
  function findInIframes() {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      try {
        var iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
        if (iframeDoc) {
          var btn = iframeDoc.querySelector('button, [role="button"], [class*="btn"], [class*="agree"]');
          if (btn && isConsentElement(btn)) {
            return btn;
          }
        }
      } catch(e) {}
    }
    return null;
  }
  
  // Поиск в Shadow DOM
  function findInShadowDom(root = document.body) {
    if (root.shadowRoot) {
      var btn = root.shadowRoot.querySelector('button, [role="button"], [class*="btn"]');
      if (btn && isConsentElement(btn)) {
        return btn;
      }
      var children = root.shadowRoot.querySelectorAll('*');
      for (var i = 0; i < children.length; i++) {
        var found = findInShadowDom(children[i]);
        if (found) return found;
      }
    }
    var children = root.children;
    for (var j = 0; j < children.length; j++) {
      var found = findInShadowDom(children[j]);
      if (found) return found;
    }
    return null;
  }
  
  /* ===============================
     УНИВЕРСАЛЬНЫЙ КЛИК
  =============================== */
  
  function universalClick(element) {
    if (!element || agreeButtonFound) return false;
    
    console.log('🎯 Найден элемент:', element.tagName, 'Текст:', element.textContent);
    agreeButtonFound = true;
    
    // Прокручиваем к элементу
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(function() {
      try {
        // 1. Нативный клик
        element.click();
        console.log('✓ Метод 1: click()');
        
        // 2. Событие MouseEvent
        var rect = element.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        
        var clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: centerX,
          clientY: centerY
        });
        element.dispatchEvent(clickEvent);
        console.log('✓ Метод 2: MouseEvent');
        
        // 3. Эмуляция полной цепочки событий
        var events = ['mouseenter', 'mousedown', 'mouseup', 'click'];
        events.forEach(function(eventType) {
          var event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY
          });
          element.dispatchEvent(event);
        });
        console.log('✓ Метод 3: Полная цепочка событий');
        
        // 4. Если это div/span - ищем родительскую кнопку
        if (element.tagName !== 'BUTTON' && element.tagName !== 'INPUT') {
          var parent = element.closest('button, a, [role="button"], .btn, .button');
          if (parent && parent !== element) {
            setTimeout(function() {
              parent.click();
              console.log('✓ Метод 4: Родительский элемент');
            }, 50);
          }
        }
        
        // 5. Trigger через jQuery если есть
        if (typeof jQuery !== 'undefined') {
          jQuery(element).trigger('click');
          console.log('✓ Метод 5: jQuery trigger');
        }
        
        // 6. Эмулируем нажатие Enter (для некоторых элементов)
        var enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        element.dispatchEvent(enterEvent);
        console.log('✓ Метод 6: KeyboardEvent Enter');
        
        // Визуальное подтверждение
        var originalBg = element.style.backgroundColor;
        element.style.backgroundColor = '#4CAF50';
        element.style.transition = '0.3s';
        setTimeout(function() {
          element.style.backgroundColor = originalBg;
        }, 500);
        
        console.log('✅ Все методы клика выполнены!');
        
      } catch (error) {
        console.log('❌ Ошибка клика:', error);
      }
    }, clickDelay);
    
    return true;
  }
  
  /* ===============================
     ОСНОВНОЙ ЦИКЛ ПОИСКА
  =============================== */
  
  function searchAndClick() {
    if (agreeButtonFound) return true;
    
    var button = findConsentButton();
    if (!button) button = findInIframes();
    if (!button) button = findInShadowDom();
    
    if (button) {
      return universalClick(button);
    }
    return false;
  }
  
  /* ===============================
     ЗАПУСК
  =============================== */
  
  console.log('🚀 Скрипт запущен. Ищем кнопку "СОГЛАСЕН"...');
  
  // Многократные попытки с увеличивающимися интервалами
  var delays = [100, 500, 1000, 2000, 3000, 5000, 8000, 12000, 15000, 20000];
  
  delays.forEach(function(delay) {
    setTimeout(function() {
      if (!agreeButtonFound) {
        var found = searchAndClick();
        if (found) {
          console.log('✅ Кнопка найдена и нажата на ' + delay + 'ms');
        }
      }
    }, delay);
  });
  
  // MutationObserver для отслеживания появления кнопки
  var observer = new MutationObserver(function(mutations) {
    if (!agreeButtonFound) {
      searchAndClick();
    } else {
      observer.disconnect();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
  
  // Проверка каждые 2 секунды
  var interval = setInterval(function() {
    if (agreeButtonFound) {
      clearInterval(interval);
    } else {
      searchAndClick();
    }
  }, 2000);
  
  /* ===============================
     ОСТАЛЬНОЙ ФУНКЦИОНАЛ
  =============================== */
  
  // Human Scroll
  setTimeout(function() {
    var currentScroll = window.pageYOffset;
    var maxScroll = document.body.scrollHeight - window.innerHeight;
    
    function scrollStep() {
      if (currentScroll >= maxScroll) return;
      currentScroll += Math.floor(Math.random() * 120) + 60;
      window.scrollTo({ top: currentScroll, behavior: 'smooth' });
      setTimeout(scrollStep, Math.floor(Math.random() * 800) + 400);
    }
    scrollStep();
  }, scrollStartDelay);
  
  // Fake Mouse
  setTimeout(function() {
    if (enableFakeMouse && !isMobile) {
      var mouse = document.createElement('div');
      mouse.style.cssText = 'position:fixed;width:6px;height:6px;background:transparent;z-index:999999;pointer-events:none';
      document.body.appendChild(mouse);
      var x = Math.random() * window.innerWidth;
      var y = Math.random() * window.innerHeight;
      
      function moveMouse() {
        x += (Math.random() - 0.5) * 300;
        y += (Math.random() - 0.5) * 200;
        x = Math.max(0, Math.min(x, window.innerWidth));
        y = Math.max(0, Math.min(y, window.innerHeight));
        mouse.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y, bubbles: true }));
        setTimeout(moveMouse, Math.floor(Math.random() * 1200) + 800);
      }
      moveMouse();
    }
  }, 3000);
  
  // Back Lock
  var isLocked = true;
  history.pushState(null, null, location.href);
  history.pushState(null, null, location.href);
  window.addEventListener("popstate", function() { if (isLocked) history.pushState(null, null, location.href); });
  window.addEventListener("beforeunload", function(e) { if (isLocked) { e.preventDefault(); e.returnValue = ''; } });
  setTimeout(function() { isLocked = false; }, lockTime);

})();
