(function() {
    'use strict';
    console.log('[Boost] Запущен для Alfasense');
    
    Object.defineProperty(document, 'hidden', { get: () => false });
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
    Object.defineProperty(document, 'webkitHidden', { get: () => false });
    Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible' });
    
    const blockedEvents = ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'];
    const originalAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockedEvents.includes(type)) return;
        return originalAdd.call(this, type, listener, options);
    };
    
    const originalObserve = IntersectionObserver.prototype.observe;
    IntersectionObserver.prototype.observe = function(element) {
        setTimeout(() => {
            const entry = {
                isIntersecting: true,
                intersectionRatio: 1,
                target: element,
                time: performance.now()
            };
            this.callback([entry], this);
        }, 50);
        return originalObserve.call(this, element);
    };
    
    function forceAlfaBanners() {
        document.querySelectorAll('[id^="alfadart_"]').forEach(banner => {
            const scriptSrc = `https://cdn.alfasense.net/js/ad_${banner.id.replace('alfadart_', '')}.js`;
            if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.async = true;
                document.head.appendChild(script);
            }
            
            banner.scrollIntoView({ behavior: 'auto', block: 'center' });
            
            ['mouseover', 'click'].forEach(eventType => {
                banner.dispatchEvent(new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            });
        });
    }
    
    setTimeout(forceAlfaBanners, 500);
    setInterval(forceAlfaBanners, 8000);
    
    setInterval(() => {
        navigator.sendBeacon('https://httpbin.org/status/200', '');
    }, 25000);
    
})();
