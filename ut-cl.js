(function() {
    // Конфигурация
    const config = {
        requiredUtm: {
            utm_source: 'yandex',
            utm_medium: 'organic',
            utm_campaign: 'promo'
        },
        // Настройки кликов - только в видимой области
        minDelay: 1500,
        maxDelay: 5000,
        clickProbability: 1,
        minClicks: 1,
        maxClicks: 3,
        // Стратегии кликов
        strategies: ['random', 'interactive', 'mixed'],
        selectedStrategy: 'mixed',
        // Дополнительные опции
        simulateScroll: false, // Отключаем автоматическую прокрутку
        simulateMouseMove: true,
        // Исключаемые элементы (селекторы)
        excludeSelectors: [
            'img',          // Картинки
            'image',        // SVG images
            'picture',      // Picture elements
            'svg',          // SVG элементы
            'canvas',       // Canvas
            'video',        // Видео
            'audio',        // Аудио
            'iframe',       // Фреймы
            'object',       // Object элементы
            'embed',        // Embed элементы
            'a[href*="logout"]',
            'a[href*="delete"]',
            'a[href*="remove"]',
            'a[onclick*="confirm"]',
            '.no-auto-click',
            '.no-click'
        ],
        // Настройки видимой области
        visibleAreaPadding: 50, // Отступ от краёв экрана
        safeZonePercentage: 0.8 // 80% экрана - безопасная зона
    };
    
    // Проверяем UTM-метки
    const urlParams = new URLSearchParams(window.location.search);
    let utmMatch = true;
    
    for (const [key, value] of Object.entries(config.requiredUtm)) {
        if (urlParams.get(key) !== value) {
            utmMatch = false;
            break;
        }
    }
    
    if (!utmMatch || Math.random() > config.clickProbability) {
        return;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        const delay = config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
        const clicksCount = config.minClicks + Math.floor(Math.random() * (config.maxClicks - config.minClicks + 1));
        
        // Имитируем движение мыши (без прокрутки)
        if (config.simulateMouseMove) {
            simulateRandomMouseMovement();
        }
        
        setTimeout(() => {
            console.log(`UTM Click: Начинаем ${clicksCount} клик(ов) через ${Math.round(delay)}мс (без прокрутки)`);
            
            for (let i = 0; i < clicksCount; i++) {
                const clickDelay = i * (800 + Math.random() * 1200);
                
                setTimeout(() => {
                    executeClickStrategy(i + 1, clicksCount);
                }, clickDelay);
            }
        }, delay);
    }
    
    function simulateRandomMouseMovement() {
        // Случайные движения мыши в пределах видимой области
        const moves = 3 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < moves; i++) {
            setTimeout(() => {
                const x = getRandomVisibleX();
                const y = getRandomVisibleY();
                
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: x,
                    clientY: y,
                    bubbles: true
                });
                
                document.dispatchEvent(moveEvent);
            }, i * 200 + Math.random() * 300);
        }
    }
    
    function executeClickStrategy(clickNumber, totalClicks) {
        const strategy = config.selectedStrategy;
        
        switch(strategy) {
            case 'random':
                clickRandomVisiblePoint(clickNumber, totalClicks);
                break;
                
            case 'interactive':
                clickVisibleInteractiveElement(clickNumber, totalClicks);
                break;
                
            case 'mixed':
                if (Math.random() > 0.5) {
                    clickRandomVisiblePoint(clickNumber, totalClicks);
                } else {
                    clickVisibleInteractiveElement(clickNumber, totalClicks);
                }
                break;
        }
    }
    
    function getRandomVisibleX() {
        const padding = config.visibleAreaPadding;
        const safeWidth = window.innerWidth * config.safeZonePercentage;
        const safeStartX = (window.innerWidth - safeWidth) / 2;
        
        return safeStartX + Math.random() * safeWidth;
    }
    
    function getRandomVisibleY() {
        const padding = config.visibleAreaPadding;
        const safeHeight = window.innerHeight * config.safeZonePercentage;
        const safeStartY = (window.innerHeight - safeHeight) / 2;
        
        return safeStartY + Math.random() * safeHeight;
    }
    
    function clickRandomVisiblePoint(clickNumber, totalClicks) {
        let attempts = 0;
        const maxAttempts = 15;
        
        while (attempts < maxAttempts) {
            let x, y;
            
            // Разные зоны для разных кликов, но всегда в видимой области
            if (clickNumber === 1) {
                // Первый клик - в центре видимой области
                x = window.innerWidth * 0.4 + Math.random() * (window.innerWidth * 0.2);
                y = window.innerHeight * 0.4 + Math.random() * (window.innerHeight * 0.2);
            } else if (clickNumber === totalClicks) {
                // Последний клик - в нижней части видимой области
                x = getRandomVisibleX();
                y = window.innerHeight * 0.7 + Math.random() * (window.innerHeight * 0.25);
            } else {
                // Средние клики - случайно в безопасной зоне
                x = getRandomVisibleX();
                y = getRandomVisibleY();
            }
            
            // Проверяем, что точка в пределах видимого окна
            if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
                // Проверяем, что в этой точке нет исключенного элемента
                const element = document.elementFromPoint(x, y);
                if (!element || !isElementExcluded(element)) {
                    performClickAt(x, y, 'random-visible');
                    return;
                }
            }
            
            attempts++;
        }
        
        // Если не нашли подходящую точку - кликаем в центр видимой области
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        performClickAt(x, y, 'visible-center-fallback');
    }
    
    function clickVisibleInteractiveElement(clickNumber, totalClicks) {
        // Ищем только видимые интерактивные элементы
        const interactiveSelectors = [
            'a:not(img)', 
            'button:not(img)', 
            'input[type="button"]', 
            'input[type="submit"]',
            '[role="button"]:not(img)',
            '.clickable:not(img)',
            '[onclick]:not(img)',
            '[data-click]:not(img)'
        ];
        
        const visibleElements = [];
        interactiveSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    // Проверяем, что элемент видим и находится в видимой области
                    if (isElementVisible(el) && isElementInViewport(el) && !isElementExcluded(el)) {
                        const rect = el.getBoundingClientRect();
                        // Проверяем, что элемент хотя бы частично в видимой области
                        if (rect.top >= 0 && rect.left >= 0 && 
                            rect.bottom <= window.innerHeight && 
                            rect.right <= window.innerWidth) {
                            visibleElements.push(el);
                        }
                    }
                });
            } catch (e) {
                // Игнорируем ошибки селекторов
            }
        });
        
        if (visibleElements.length > 0) {
            // Выбираем случайный видимый элемент
            const element = visibleElements[Math.floor(Math.random() * visibleElements.length)];
            const rect = element.getBoundingClientRect();
            
            // Кликаем в случайную точку внутри видимой части элемента
            const x = Math.max(rect.left + 5, Math.min(rect.right - 5, 
                rect.left + Math.random() * rect.width));
            const y = Math.max(rect.top + 5, Math.min(rect.bottom - 5,
                rect.top + Math.random() * rect.height));
            
            performClickAt(x, y, element.tagName + '-visible');
        } else {
            // Если нет видимых интерактивных элементов - кликаем случайно в видимой области
            clickRandomVisiblePoint(clickNumber, totalClicks);
        }
    }
    
    function isElementVisible(el) {
        if (!el || !el.getBoundingClientRect) return false;
        
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        
        return rect.width > 0 && rect.height > 0 &&
               style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
    }
    
    function isElementInViewport(el) {
        if (!el || !el.getBoundingClientRect) return false;
        
        const rect = el.getBoundingClientRect();
        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function isElementExcluded(el) {
        if (!el || !el.matches) return false;
        
        // Проверяем по селекторам из конфигурации
        for (const selector of config.excludeSelectors) {
            try {
                if (el.matches(selector)) {
                    return true;
                }
            } catch (e) {
                // Игнорируем ошибки селекторов
            }
        }
        
        // Дополнительные проверки
        const tagName = el.tagName.toLowerCase();
        const className = el.className || '';
        const href = el.getAttribute('href') || '';
        const onclick = el.getAttribute('onclick') || '';
        
        // Проверяем теги картинок
        const imageTags = ['img', 'image', 'picture', 'svg', 'canvas'];
        if (imageTags.includes(tagName)) {
            return true;
        }
        
        // Проверяем по классам
        const excludedClasses = ['no-click', 'no-auto-click', 'image', 'img', 'picture', 'gallery'];
        for (const excludedClass of excludedClasses) {
            if (className.includes(excludedClass)) {
                return true;
            }
        }
        
        // Проверяем опасные ссылки
        const dangerousHrefs = ['logout', 'delete', 'remove', 'exit', 'close'];
        for (const dangerous of dangerousHrefs) {
            if (href.includes(dangerous)) {
                return true;
            }
        }
        
        // Проверяем подтверждения
        if (onclick.includes('confirm') || onclick.includes('alert')) {
            return true;
        }
        
        return false;
    }
    
    function performClickAt(x, y, targetType) {
        // Ограничиваем координаты пределами видимого окна
        x = Math.max(0, Math.min(x, window.innerWidth));
        y = Math.max(0, Math.min(y, window.innerHeight));
        
        console.log(`UTM Click: Клик ${targetType} в видимой точке (${Math.round(x)}, ${Math.round(y)})`);
        
        // Имитируем движение мыши к точке
        if (config.simulateMouseMove) {
            simulateMouseMovementToPoint(x, y);
        }
        
        // Получаем элемент в точке клика
        const element = document.elementFromPoint(x, y);
        
        // Проверяем, что элемент не исключен
        if (element && isElementExcluded(element)) {
            console.log('UTM Click: Элемент исключен, пропускаем клик');
            return;
        }
        
        // Создаем полную последовательность событий
        createRealisticClickSequence(element || document.documentElement, x, y);
        
        // Дополнительный клик на document для перехвата скрытыми системами
        setTimeout(() => {
            const docClick = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            });
            document.dispatchEvent(docClick);
        }, 50);
    }
    
    function simulateMouseMovementToPoint(targetX, targetY) {
        // Текущее положение (предполагаем центр)
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        
        // Создаем плавное движение к цели
        const steps = 4 + Math.floor(Math.random() * 3);
        
        for (let i = 1; i <= steps; i++) {
            setTimeout(() => {
                const progress = i / steps;
                const easing = 1 - Math.pow(1 - progress, 3); // Кубическое замедление
                
                const stepX = startX + (targetX - startX) * easing;
                const stepY = startY + (targetY - startY) * easing;
                
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: stepX,
                    clientY: stepY,
                    bubbles: true
                });
                
                document.dispatchEvent(moveEvent);
            }, i * 15);
        }
    }
    
    function createRealisticClickSequence(element, x, y) {
        const eventSequence = [
            { type: 'mouseover', delay: 0 },
            { type: 'mousemove', delay: 10 },
            { type: 'mousedown', delay: 30 },
            { type: 'focus', delay: 40 },
            { type: 'mouseup', delay: 50 },
            { type: 'click', delay: 60 }
        ];
        
        eventSequence.forEach(({ type, delay }) => {
            setTimeout(() => {
                let event;
                
                if (type === 'focus') {
                    event = new Event(type, { bubbles: true });
                } else {
                    event = new MouseEvent(type, {
                        view: window,
                        bubbles: true,
                        cancelable: true,
                        clientX: x,
                        clientY: y,
                        button: 0,
                        buttons: type === 'mousedown' ? 1 : 0
                    });
                }
                
                element.dispatchEvent(event);
                
                // Также отправляем событие на document и body
                if (element !== document && element !== document.body) {
                    document.dispatchEvent(event);
                    document.body.dispatchEvent(event);
                }
                
            }, delay + Math.random() * 20);
        });
        
        // Нативный click() для элементов, которые его поддерживают
        setTimeout(() => {
            if (element.click && typeof element.click === 'function') {
                try {
                    element.click();
                } catch (e) {
                    // Игнорируем ошибки
                }
            }
        }, 100);
    }
})();
