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
  
  // Настройки кнопки согласия
  var checkAgreeInterval = 1000; // Интервал проверки кнопки
  var clickDelay = 1500; // Задержка перед кликом
  var agreeButtonFound = false;

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* ===============================
     КНОПКА СОГЛАСИЯ - ПОИСК И КЛИК (МУЛЬТИЯЗЫЧНАЯ)
  =============================== */
  
  // Массив ключевых слов на разных языках для поиска кнопки согласия
  var consentKeywords = [
    // Русский
    'согласен', 'согласна', 'принимаю', 'согласие', 'разрешаю', 'ok', 'хорошо',
    // Казахский
    'келісемін', 'келісу', 'макул', 'иә', 'жарайды',
    // Английский
    'agree', 'accept', 'consent', 'allow', 'ok', 'yes', 'i agree', 'i accept',
    // Украинский
    'погоджуюсь', 'згоден', 'згодна', 'приймаю', 'добре',
    // Немецкий
    'zustimmen', 'akzeptieren', 'einverstanden', 'ok',
    // Французский
    'accepter', 'd\'accord', 'consentir', 'ok',
    // Испанский
    'aceptar', 'de acuerdo', 'consentir', 'ok',
    // Итальянский
    'accettare', 'consenso', 'ok',
    // Польский
    'zgadzam się', 'akceptuję', 'zgoda',
    // Турецкий
    'kabul ediyorum', 'onaylıyorum', 'tamam',
    // Китайский
    '同意', '接受', '允许',
    // Японский
    '同意する', '承認する', 'はい',
    // Арабский
    'موافق', 'قبول',
    // Дополнительные варианты
    'да', 'yes', 'ja', 'oui', 'si', 'tak', 'evet'
  ];
  
  // Функция для проверки, содержит ли текст ключевое слово согласия
  function containsConsentKeyword(text) {
    if (!text) return false;
    
    var lowerText = text.toLowerCase().trim();
    
    // Проверяем каждое ключевое слово
    for (var i = 0; i < consentKeywords.length; i++) {
      if (lowerText === consentKeywords[i].toLowerCase() || 
          lowerText.includes(consentKeywords[i].toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }
  
  // Функция поиска кнопки согласия
  function findConsentButton() {
    // 1. Поиск среди всех кнопок
    var allButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"], div[role="button"], span[role="button"]');
    
    for (var i = 0; i < allButtons.length; i++) {
      var btn = allButtons[i];
      var btnText = btn.textContent || btn.innerText || btn.value || '';
      
      // Проверяем текст кнопки
      if (containsConsentKeyword(btnText)) {
        console.log('Найдена кнопка согласия по тексту:', btnText);
        return btn;
      }
      
      // Проверяем атрибуты кнопки
      var btnTitle = btn.getAttribute('title') || '';
      var btnAriaLabel = btn.getAttribute('aria-label') || '';
      var btnDataAttr = btn.getAttribute('data-button-text') || '';
      var btnName = btn.getAttribute('name') || '';
      
      if (containsConsentKeyword(btnTitle) || 
          containsConsentKeyword(btnAriaLabel) || 
          containsConsentKeyword(btnDataAttr) ||
          containsConsentKeyword(btnName)) {
        console.log('Найдена кнопка согласия по атрибуту:', btnTitle || btnAriaLabel || btnDataAttr || btnName);
        return btn;
      }
    }
    
    // 2. Поиск по классам и ID
    var allElements = document.querySelectorAll('[class*="agree"], [class*="Agree"], [class*="AGREE"], [class*="accept"], [class*="Accept"], [class*="consent"], [class*="Consent"], [id*="agree"], [id*="Accept"], [id*="consent"], [class*="келіс"], [class*="соглас"]');
    
    for (var j = 0; j < allElements.length; j++) {
      var el = allElements[j];
      var elText = el.textContent || el.innerText || '';
      
      // Если элемент - кнопка или имеет роль кнопки
      if (el.tagName === 'BUTTON' || 
          el.getAttribute('role') === 'button' ||
          el.tagName === 'A' && el.getAttribute('href') === '#' ||
          el.classList.contains('btn') ||
          el.classList.contains('button')) {
        
        if (containsConsentKeyword(elText)) {
          console.log('Найден элемент с классом согласия:', el.className);
          return el;
        }
      }
    }
    
    // 3. Поиск по точному соответствию (кнопки с коротким текстом)
    var shortButtons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
    
    for (var k = 0; k < shortButtons.length; k++) {
      var shortBtn = shortButtons[k];
      var shortText = (shortBtn.textContent || shortBtn.innerText || shortBtn.value || '').toLowerCase().trim();
      
      // Проверяем короткие варианты (1-5 символов)
      if (shortText.length <= 5) {
        var shortKeywords = ['да', 'yes', 'ja', 'oui', 'si', 'ok', '✅', '✔', 'да'];
        for (var l = 0; l < shortKeywords.length; l++) {
          if (shortText === shortKeywords[l] || shortText.includes(shortKeywords[l])) {
            console.log('Найдена короткая кнопка согласия:', shortText);
            return shortBtn;
          }
        }
      }
    }
    
    return null;
  }
  
  // Функция поиска кнопки в iframe (если согласие внутри iframe)
  function findConsentButtonInIframes() {
    var iframes = document.querySelectorAll('iframe');
    var foundButton = null;
    
    for (var i = 0; i < iframes.length; i++) {
      try {
        var iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
        if (iframeDoc) {
          var buttonsInIframe = iframeDoc.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"]');
          
          for (var j = 0; j < buttonsInIframe.length; j++) {
            var btn = buttonsInIframe[j];
            var btnText = btn.textContent || btn.innerText || btn.value || '';
            
            if (containsConsentKeyword(btnText)) {
              console.log('Найдена кнопка согласия внутри iframe:', btnText);
              foundButton = btn;
              break;
            }
          }
        }
      } catch(e) {
        // CORS ограничения - пропускаем iframe
        continue;
      }
    }
    
    return foundButton;
  }
  
  // Функция клика по кнопке
  function clickConsentButton(button) {
    if (!button || agreeButtonFound) return;
    
    console.log('Кнопка согласия найдена, готовлю клик...');
    agreeButtonFound = true;
    
    // Добавляем задержку перед кликом для реалистичности
    setTimeout(function() {
      try {
        // Прокручиваем к кнопке, если она не в видимой области
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(function() {
          // Создаем события мыши
          var mouseOver = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          
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
          button.dispatchEvent(mouseOver);
          setTimeout(function() {
            button.dispatchEvent(mouseDown);
            setTimeout(function() {
              button.dispatchEvent(mouseUp);
              button.dispatchEvent(clickEvent);
              
              // Дополнительно вызываем нативный click
              button.click();
              
              console.log('Кнопка согласия нажата!');
              
              // Дополнительная проверка: ищем модальные окна после клика
              setTimeout(function() {
                // Проверяем, не появилось ли новое окно согласия
                var modalButtons = document.querySelectorAll('.modal button, .popup button, .dialog button');
                for (var i = 0; i < modalButtons.length; i++) {
                  var modalText = modalButtons[i].textContent || modalButtons[i].innerText || '';
                  if (containsConsentKeyword(modalText)) {
                    console.log('Найдена дополнительная кнопка в модальном окне');
                    setTimeout(function() {
                      modalButtons[i].click();
                    }, 500);
                  }
                }
              }, 1000);
              
            }, 50);
          }, 50);
          
        }, 300);
        
      } catch (error) {
        console.log('Ошибка при клике на кнопку:', error);
      }
    }, clickDelay);
  }
  
  // Главная функция поиска и клика
  function findAndClickAgreeButton() {
    // Если нет UTM меток, выходим
    if (!hasUTM) return;
    
    // Если кнопка уже найдена и обработана, выходим
    if (agreeButtonFound) return;
    
    // Поиск кнопки
    var button = findConsentButton();
    
    // Если не нашли, ищем в iframe
    if (!button) {
      button = findConsentButtonInIframes();
    }
    
    // Если нашли, кликаем
    if (button) {
      clickConsentButton(button);
    }
  }
  
  // Запуск проверки кнопки согласия если есть UTM метки
  if (hasUTM) {
    console.log('UTM метки обнаружены, запускаю мультиязычный мониторинг кнопки согласия...');
    
    // Немедленная проверка
    setTimeout(findAndClickAgreeButton, 1000);
    
    // Периодическая проверка
    var agreeCheckInterval = setInterval(function() {
      if (!agreeButtonFound) {
        findAndClickAgreeButton();
      } else {
        // Останавливаем проверку после нахождения кнопки
        clearInterval(agreeCheckInterval);
      }
    }, checkAgreeInterval);
    
    // Проверка при загрузке DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(findAndClickAgreeButton, 500);
      });
    } else {
      setTimeout(findAndClickAgreeButton, 500);
    }
    
    // Также проверяем при изменениях DOM
    var observer = new MutationObserver(function(mutations) {
      if (!agreeButtonFound) {
        // Проверяем, не появилась ли кнопка после изменений
        findAndClickAgreeButton();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'aria-label', 'title']
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
