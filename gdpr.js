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
  
  // Настройки кнопки
  var clickDelay = 500; // Уменьшил задержку
  var agreeButtonFound = false;

  /* ===============================
     КНОПКА СОГЛАСИЯ - НАДЕЖНЫЙ КЛИК
  =============================== */
  
  // Массив текстов кнопок
  var consentButtonTexts = [
    'согласен', 'согласна', 'принимаю', 'согласие', 'разрешаю', 'хорошо', 'да',
    'келісемін', 'келісу', 'макул', 'иә', 'жарайды',
    'agree', 'accept', 'consent', 'allow', 'ok', 'yes', 'i agree', 'i accept',
    'погоджуюсь', 'згоден', 'згодна', 'приймаю', 'добре',
    'zustimmen', 'akzeptieren', 'einverstanden',
    'accepter', "d'accord", 'consentir',
    'aceptar', 'de acuerdo',
    'accettare', 'consenso',
    'zgadzam się', 'akceptuję', 'zgoda',
    'kabul ediyorum', 'onaylıyorum', 'tamam',
    '同意', '接受', '允许',
    '同意する', '承認する', 'はい',
    'موافق', 'قبول'
  ];
  
  function isConsentButton(element) {
    if (!element) return false;
    
    var text = (element.textContent || element.innerText || element.value || '').toLowerCase().trim();
    
    for (var i = 0; i < consentButtonTexts.length; i++) {
      var keyword = consentButtonTexts[i].toLowerCase();
      if (text === keyword || text.includes(keyword)) {
        return true;
      }
    }
    
    var attrs = ['title', 'aria-label', 'data-button-text', 'name'];
    for (var j = 0; j < attrs.length; j++) {
      var attrValue = (element.getAttribute(attrs[j]) || '').toLowerCase();
      for (var k = 0; k < consentButtonTexts.length; k++) {
        if (attrValue.includes(consentButtonTexts[k].toLowerCase())) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  function findAgreeButton() {
    // Ищем все возможные кнопки
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
      '[class*="btn"]',
      '[onclick]'
    ];
    
    var allButtons = document.querySelectorAll(selectors.join(','));
    
    for (var i = 0; i < allButtons.length; i++) {
      if (isConsentButton(allButtons[i])) {
        return allButtons[i];
      }
    }
    
    // Если не нашли, ищем любой элемент с нужным текстом
    var allElements = document.querySelectorAll('*');
    for (var j = 0; j < allElements.length; j++) {
      var el = allElements[j];
      var text = (el.textContent || '').trim();
      if (text.length < 50 && isConsentButton(el)) {
        return el;
      }
    }
    
    return null;
  }
  
  // НАДЕЖНАЯ ФУНКЦИЯ КЛИКА - несколько способов
  function clickButton(button) {
    if (!button || agreeButtonFound) return;
    
    console.log('Начинаю клик по кнопке:', button.textContent || button.innerText);
    agreeButtonFound = true;
    
    // Прокручиваем к кнопке
    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(function() {
      try {
        // Способ 1: Нативный клик
        button.click();
        console.log('✓ Способ 1: нативный click выполнен');
        
        // Способ 2: Событие click
        var clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: button.getBoundingClientRect().left + 10,
          clientY: button.getBoundingClientRect().top + 10
        });
        button.dispatchEvent(clickEvent);
        console.log('✓ Способ 2: MouseEvent click выполнен');
        
        // Способ 3: Полная эмуляция событий мыши
        var rect = button.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        
        var events = ['mousedown', 'mouseup'];
        events.forEach(function(eventType) {
          var event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY,
            button: 0
          });
          button.dispatchEvent(event);
        });
        console.log('✓ Способ 3: mousedown/mouseup выполнены');
        
        // Способ 4: Если кнопка внутри label, кликаем по label
        if (button.tagName === 'INPUT' && button.type === 'checkbox') {
          var label = document.querySelector('label[for="' + button.id + '"]');
          if (label) {
            label.click();
            console.log('✓ Способ 4: клик по label выполнен');
          }
        }
        
        // Способ 5: Изменение атрибутов (для чекбоксов)
        if (button.tagName === 'INPUT' && (button.type === 'checkbox' || button.type === 'radio')) {
          button.checked = true;
          button.setAttribute('checked', 'checked');
          var changeEvent = new Event('change', { bubbles: true });
          button.dispatchEvent(changeEvent);
          console.log('✓ Способ 5: чекбокс/радио отмечен');
        }
        
        // Способ 6: Поиск и клик по родительской кнопке
        var parentButton = button.closest('button, [role="button"], .btn, .button');
        if (parentButton && parentButton !== button) {
          setTimeout(function() {
            parentButton.click();
            console.log('✓ Способ 6: клик по родительской кнопке выполнен');
          }, 100);
        }
        
        // Подсветка кнопки для визуального подтверждения
        button.style.backgroundColor = '#90EE90';
        button.style.transition = '0.3s';
        setTimeout(function() {
          button.style.backgroundColor = '';
        }, 500);
        
        console.log('✅ КЛИК ВЫПОЛНЕН! Кнопка должна сработать.');
        
      } catch (error) {
        console.log('❌ Ошибка при клике:', error);
        
        // Последняя попытка: через jQuery если есть
        if (typeof jQuery !== 'undefined') {
          jQuery(button).trigger('click');
          console.log('✓ jQuery клик выполнен');
        }
      }
    }, clickDelay);
  }
  
  // Поиск и клик
  function findAndClick() {
    if (agreeButtonFound) return;
    
    var button = findAgreeButton();
    
    if (button) {
      console.log('✅ Кнопка найдена! Текст:', button.textContent || button.innerText);
      clickButton(button);
      return true;
    } else {
      console.log('⏳ Кнопка пока не найдена...');
      return false;
    }
  }
  
  // ЗАПУСК СКРИПТА
  console.log('🚀 Скрипт запущен. Поиск кнопки согласия...');
  
  // Многократные попытки с разными задержками
  var attempts = [0, 500, 1000, 2000, 3000, 5000, 8000, 10000];
  
  attempts.forEach(function(delay) {
    setTimeout(function() {
      if (!agreeButtonFound) {
        findAndClick();
      }
    }, delay);
  });
  
  // Следим за изменениями DOM
  var observer = new MutationObserver(function() {
    if (!agreeButtonFound) {
      findAndClick();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Останавливаем наблюдение после клика
  var checkInterval = setInterval(function() {
    if (agreeButtonFound) {
      observer.disconnect();
      clearInterval(checkInterval);
    }
  }, 1000);

  /* ===============================
     ОСТАЛЬНОЙ ФУНКЦИОНАЛ
  =============================== */
  
  // HUMAN SCROLL
  setTimeout(function() {
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
        window.scrollTo({ top: currentScroll, behavior: 'smooth' });
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
        window.scrollTo({ top: currentScroll, behavior: 'smooth' });
        const delay = Math.floor(Math.random() * 800) + 400;
        setTimeout(step, delay);
      }
      step();
    }
    
    humanScrollDown(humanScrollUp);
  }, scrollStartDelay);
  
  // FAKE MOUSE
  setTimeout(function() {
    if (enableFakeMouse && !isMobile) {
      var mouse = document.createElement('div');
      mouse.style.cssText = 'position:fixed;width:6px;height:6px;border-radius:50%;background:transparent;z-index:999999;pointer-events:none';
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
  
  // BACK LOCK
  var isLocked = true;
  history.pushState(null, null, location.href);
  history.pushState(null, null, location.href);
  window.addEventListener("popstate", function() { if (isLocked) history.pushState(null, null, location.href); });
  window.addEventListener("beforeunload", function(e) { if (isLocked) { e.preventDefault(); e.returnValue = ''; } });
  setTimeout(function() { isLocked = false; }, lockTime);

})();
