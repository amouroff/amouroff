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

    // Определяем тип устройства
    function getDeviceType() {
        const ua = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
        
        if (isTablet) return 'tablet';
        if (isMobile) return 'mobile';
        return 'desktop';
    }

    // Проверяем нужные UTM метки
    const utm = getUTM();
    
    if (utm.source === 'yandex' && utm.medium === 'organic' && utm.campaign === 'promo') {
        
        const deviceType = getDeviceType();
        
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
            
            // Настройки в зависимости от устройства
            let settings = {
                steps: { min: 10, max: 25 },        // количество шагов
                baseDelay: { min: 80, max: 250 },    // базовая задержка между шагами (мс)
                readPause: { min: 800, max: 3000 },  // пауза на чтение (мс)
                backScroll: { min: 30, max: 80 },    // возврат назад (пиксели)
                variance: 30,                         // вариация позиции
                microPause: 0.3                        // вероятность микропаузы
            };
            
            // Корректируем настройки для мобильных
            if (deviceType === 'mobile') {
                settings = {
                    steps: { min: 8, max: 20 },        // меньше шагов (пальцем быстрее)
                    baseDelay: { min: 120, max: 350 },  // медленнее (инерция)
                    readPause: { min: 1000, max: 4000 }, // дольше читают
                    backScroll: { min: 20, max: 50 },    // меньше возврат
                    variance: 20,                         // меньше дрожания
                    microPause: 0.4                        // чаще микропаузы
                };
            } else if (deviceType === 'tablet') {
                settings = {
                    steps: { min: 12, max: 22 },
                    baseDelay: { min: 100, max: 300 },
                    readPause: { min: 900, max: 3500 },
                    backScroll: { min: 25, max: 60 },
                    variance: 25,
                    microPause: 0.35
                };
            }
            
            // Человеческий скролл
            let steps = settings.steps.min + Math.floor(Math.random() * (settings.steps.max - settings.steps.min + 1));
            let currentStep = 0;
            let lastPosition = 0;
            let lastScrollTime = Date.now();
            let scrollDirection = 1; // 1 = вниз, -1 = вверх
            
            // Функция для получения случайной задержки
            function getRandomDelay(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            // Easing функции для разных устройств
            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            }
            
            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }
            
            function doScroll() {
                const maxScroll = getMaxScroll();
                const currentTime = Date.now();
                const timeSinceLastScroll = currentTime - lastScrollTime;
                
                // Проверяем, не зависла ли страница
                if (timeSinceLastScroll > 10000) { // 10 секунд без скролла
                    currentStep = steps; // принудительно завершаем
                    return;
                }
                
                if (currentStep < steps && maxScroll > 0) {
                    
                    // Прогресс скролла (0-1) с учетом возможных возвратов
                    let baseProgress = currentStep / steps;
                    let progress = baseProgress;
                    
                    // Добавляем случайные отклонения в прогрессе (имитация неравномерного чтения)
                    if (Math.random() > 0.8) {
                        progress += (Math.random() - 0.5) * 0.1;
                        progress = Math.max(0, Math.min(1, progress));
                    }
                    
                    // Выбираем easing в зависимости от фазы
                    let position;
                    if (progress < 0.2) {
                        // Начало - быстрое погружение
                        position = maxScroll * easeOutCubic(progress * 5);
                    } else if (progress < 0.7) {
                        // Середина - плавное чтение
                        position = maxScroll * (0.2 + easeInOutQuad((progress - 0.2) / 0.5) * 0.5);
                    } else {
                        // Конец - замедление
                        const endT = (progress - 0.7) / 0.3;
                        position = maxScroll * (0.7 + (1 - Math.pow(1 - endT, 2)) * 0.3);
                    }
                    
                    // Добавляем естественные отклонения (дрожание пальца/мыши)
                    if (Math.random() > 0.6) {
                        position += (Math.random() - 0.5) * settings.variance;
                    }
                    
                    // Иногда делаем микро-коррекции (как будто поправляем скролл)
                    if (Math.random() > 0.8) {
                        position += (Math.random() - 0.5) * 15;
                    }
                    
                    position = Math.max(0, Math.min(position, maxScroll));
                    
                    // Определяем направление скролла
                    if (position > lastPosition) {
                        scrollDirection = 1;
                    } else if (position < lastPosition) {
                        scrollDirection = -1;
                    }
                    
                    // Выбираем поведение скролла в зависимости от устройства
                    if (deviceType === 'mobile' || deviceType === 'tablet') {
                        // На мобильных используем плавный скролл с инерцией
                        window.scrollTo({
                            top: position,
                            behavior: 'smooth'
                        });
                    } else {
                        // На ПК иногда используем мгновенный скролл (колесико)
                        if (Math.random() > 0.7) {
                            window.scrollTo({
                                top: position,
                                behavior: 'auto'
                            });
                        } else {
                            window.scrollTo({
                                top: position,
                                behavior: 'smooth'
                            });
                        }
                    }
                    
                    lastPosition = position;
                    lastScrollTime = Date.now();
                    currentStep++;
                    
                    // Базовая задержка с вариациями
                    let nextDelay = getRandomDelay(settings.baseDelay.min, settings.baseDelay.max);
                    
                    // Вариации в зависимости от направления и устройства
                    if (scrollDirection === 1) {
                        // Скролл вниз обычно быстрее
                        nextDelay = Math.floor(nextDelay * 0.9);
                    } else {
                        // Скролл вверх медленнее (перечитывание)
                        nextDelay = Math.floor(nextDelay * 1.3);
                    }
                    
                    // Имитация чтения контента
                    const readProbability = deviceType === 'mobile' ? 0.35 : 0.25;
                    if (Math.random() < readProbability) {
                        // Длинная пауза на чтение
                        nextDelay += getRandomDelay(settings.readPause.min, settings.readPause.max);
                        
                        // Иногда во время чтения немного дергаем скролл
                        if (Math.random() > 0.7) {
                            setTimeout(function() {
                                window.scrollBy({
                                    top: (Math.random() - 0.5) * 20,
                                    behavior: 'smooth'
                                });
                            }, nextDelay / 3);
                        }
                    }
                    
                    // Микропаузы (задумался)
                    if (Math.random() < settings.microPause) {
                        nextDelay += getRandomDelay(100, 300);
                    }
                    
                    // Имитация возврата назад (перечитывание)
                    if (Math.random() < 0.12 && position > 100) {
                        const backAmount = getRandomDelay(settings.backScroll.min, settings.backScroll.max);
                        setTimeout(function() {
                            window.scrollBy({
                                top: -backAmount,
                                behavior: 'smooth'
                            });
                            
                            // После возврата небольшая пауза
                            setTimeout(function() {
                                // Продолжаем скролл вниз
                                if (currentStep < steps) {
                                    doScroll();
                                }
                            }, getRandomDelay(300, 800));
                        }, nextDelay / 2);
                        
                        // Увеличиваем задержку перед следующим шагом
                        nextDelay += getRandomDelay(400, 1000);
                    }
                    
                    // Имитация ускорения в конце страницы (пользователь понимает, что контент заканчивается)
                    if (progress > 0.85 && Math.random() > 0.5) {
                        nextDelay = Math.floor(nextDelay * 0.6);
                    }
                    
                    setTimeout(doScroll, nextDelay);
                    
                } else {
                    // Достигли конца страницы
                    
                    // Имитация поведения в конце страницы
                    setTimeout(function() {
                        // 40% вероятность прокрутить немного вверх и остановиться
                        if (Math.random() < 0.4) {
                            const finalPosition = maxScroll * (0.7 + Math.random() * 0.2);
                            window.scrollTo({
                                top: finalPosition,
                                behavior: 'smooth'
                            });
                            
                            // Иногда еще раз дергаем в конце
                            if (Math.random() > 0.5) {
                                setTimeout(function() {
                                    window.scrollBy({
                                        top: (Math.random() - 0.5) * 30,
                                        behavior: 'smooth'
                                    });
                                }, 1000);
                            }
                        }
                    }, 500);
                    
                    // Проверяем появление нового контента
                    if (maxScroll > lastPosition + 150) {
                        currentStep = steps - 3;
                        steps += 5;
                        setTimeout(doScroll, getRandomDelay(800, 2000));
                    }
                }
            }
            
            // Запускаем скролл
            doScroll();
            
            // Следим за появлением нового контента
            let lastScrollHeight = getMaxScroll();
            let contentCheckInterval = setInterval(function() {
                const currentScrollHeight = getMaxScroll();
                if (currentScrollHeight > lastScrollHeight + 150) {
                    // Появился новый контент
                    if (currentStep >= steps) {
                        // Если скролл уже закончился, начинаем заново с задержкой
                        setTimeout(function() {
                            steps = currentStep + getRandomDelay(8, 15);
                            doScroll();
                        }, getRandomDelay(1000, 3000));
                    } else {
                        // Если скролл еще идет, продлеваем его
                        steps = currentStep + getRandomDelay(5, 10);
                    }
                    lastScrollHeight = currentScrollHeight;
                }
            }, 800);
            
            // Очищаем интервал через 5 минут
            setTimeout(function() {
                clearInterval(contentCheckInterval);
            }, 300000);
            
        }, delay);
        
    }
    
})();
