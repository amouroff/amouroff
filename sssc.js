(function() {
    'use strict';
    
    // Получаем UTM метки из URL
    function getUTM() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source'),
            medium: urlParams.get('utm_medium'),
            campaign: urlParams.get('utm_campaign')
        };
    }

    // Проверяем нужные UTM метки
    const utm = getUTM();
    
    if (utm.source === 'yandex' && utm.medium === 'organic' && utm.campaign === 'promo') {
        
        // Рандомная задержка 3-5 секунд
        const delay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
        
        setTimeout(function() {
            
            // Функция для проверки наличия контента
            function getMaxScroll() {
                return Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight,
                    document.documentElement.clientHeight
                ) - window.innerHeight;
            }
            
            // Человеческий скролл
            let steps = 15 + Math.floor(Math.random() * 20); // 15-35 шагов
            let currentStep = 0;
            let lastPosition = 0;
            
            function doScroll() {
                // Проверяем, не загрузился ли еще контент динамически
                const maxScroll = getMaxScroll();
                
                if (currentStep < steps && maxScroll > 0) {
                    
                    // Прогресс скролла (0-1)
                    let progress = currentStep / steps;
                    
                    // Easing функции для разных фаз
                    let position;
                    
                    if (progress < 0.2) {
                        // Начало - быстро
                        position = maxScroll * (progress * 3);
                    } else if (progress < 0.6) {
                        // Середина - плавно
                        position = maxScroll * (0.2 + (progress - 0.2) * 1.2);
                    } else {
                        // Конец - замедление
                        const endProgress = (progress - 0.6) / 0.4;
                        position = maxScroll * (0.6 + endProgress * 0.4);
                        // Easing для замедления
                        position = maxScroll * (0.6 + Math.sin(endProgress * Math.PI / 2) * 0.4);
                    }
                    
                    // Добавляем небольшие отклонения (дрожание)
                    if (Math.random() > 0.7) {
                        position += (Math.random() - 0.5) * 40;
                    }
                    
                    // Гарантируем, что позиция не выходит за границы
                    position = Math.max(0, Math.min(position, maxScroll));
                    
                    // Плавный скролл
                    window.scrollTo({
                        top: position,
                        behavior: 'smooth'
                    });
                    
                    // Запоминаем позицию
                    lastPosition = position;
                    currentStep++;
                    
                    // Базовая задержка между шагами
                    let nextDelay = 100 + Math.floor(Math.random() * 200); // 100-300 мс
                    
                    // Иногда делаем паузу подольше (читаем контент)
                    if (Math.random() < 0.25) {
                        nextDelay += 500 + Math.floor(Math.random() * 1500); // +0.5-2 сек
                    }
                    
                    // Иногда чуть прокручиваем назад (перечитываем)
                    if (Math.random() < 0.1) {
                        setTimeout(function() {
                            window.scrollBy({
                                top: -40 - Math.floor(Math.random() * 60),
                                behavior: 'smooth'
                            });
                        }, nextDelay / 2);
                    }
                    
                    // Продолжаем скролл
                    setTimeout(doScroll, nextDelay);
                    
                } else {
                    // Если контент еще грузится, но скролл закончился
                    if (maxScroll > lastPosition + 100) {
                        // Появился новый контент - доскроллим
                        currentStep = steps - 5; // Добавляем еще несколько шагов
                        steps += 5;
                        doScroll();
                    }
                }
            }
            
            // Запускаем скролл
            doScroll();
            
            // Следим за появлением нового контента
            let lastScrollHeight = getMaxScroll();
            setInterval(function() {
                const currentScrollHeight = getMaxScroll();
                if (currentScrollHeight > lastScrollHeight + 100) {
                    // Появился новый контент - продолжаем скролл
                    steps = currentStep + 10;
                    lastScrollHeight = currentScrollHeight;
                }
            }, 500);
            
        }, delay);
        
    } else {
        // Для отладки - можно удалить
        console.log('Скрипт не активирован. UTM метки не совпадают:', utm);
    }
    
})();
