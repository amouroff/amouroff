(function() {
    'use strict';

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const utmSource = getQueryParam('utm_source');
    const utmMedium = getQueryParam('utm_medium');
    const utmCampaign = getQueryParam('utm_campaign');

    if (utmSource === 'yandex' && utmMedium === 'organic' && utmCampaign === 'promo') {

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

        const minTime = 5000;
        const maxTime = 10000;
        const delay = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        setTimeout(() => {
            forceAlfaBanners();

            const interval1 = setInterval(forceAlfaBanners, 8000);
            const interval2 = setInterval(() => {
                navigator.sendBeacon('https://httpbin.org/status/200', '');
            }, 25000);

            setTimeout(() => {
                clearInterval(interval1);
                clearInterval(interval2);
            }, 10000);

        }, delay);
    }

})();
