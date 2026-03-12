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
        "https://www.finansylife.ru/2024/09/blog-post.html",
		"https://www.finansylife.ru/2024/09/blog-post_22.html",
		"https://www.finansylife.ru/2024/09/blog-post_31.html",
		"https://www.finansylife.ru/2024/09/blog-post_62.html",
		"https://www.finansylife.ru/2024/09/blog-post_89.html",
		"https://www.finansylife.ru/2024/09/blog-post_16.html",
		"https://www.finansylife.ru/2024/09/blog-post_59.html",
		"https://www.finansylife.ru/2024/09/blog-post_18.html",
		"https://www.finansylife.ru/2024/09/blog-post_74.html",
        "https://www.finansylife.ru/2024/09/blog-post_52.html"
    ];

    const externalLinks = [
    "https://www.biznessuspeh.ru/2023/05/unlocking-success-essential-strategies.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/the-future-of-work-embracing-remote.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/navigating-new-normal-adapting-your.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/building-sustainable-brand-strategies.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/from-idea-to-market-step-by-step-guide.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/harnessing-power-of-data-how-analytics.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/winning-customer-experience-game.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/mastering-art-of-effective-leadership.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.biznessuspeh.ru/2023/05/embracing-digital-transformation.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.biznessuspeh.ru/2023/05/the-power-of-networking-how-building.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

