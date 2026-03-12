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
        "https://www.byudzhetnyydekor.ru/2023/05/5-essential-diy-home-improvement.html",
		"https://www.byudzhetnyydekor.ru/2023/05/10-budget-friendly-home-renovation.html",
		"https://www.byudzhetnyydekor.ru/2023/05/how-to-create-cozy-and-inviting-living.html",
		"https://www.byudzhetnyydekor.ru/2023/05/10-clever-storage-solutions-to-maximize.html",
		"https://www.byudzhetnyydekor.ru/2023/05/easy-and-affordable-ways-to-refresh.html",
		"https://www.byudzhetnyydekor.ru/2023/05/the-ultimate-guide-to-decorating-your.html",
		"https://www.byudzhetnyydekor.ru/2023/05/transform-your-outdoor-space-budget.html",
		"https://www.byudzhetnyydekor.ru/2023/05/diy-home-decor-creative-and-inexpensive.html",
		"https://www.byudzhetnyydekor.ru/2023/05/10-tips-for-stylish-and-affordable-home.html",
        "https://www.byudzhetnyydekor.ru/2023/05/budget-friendly-bathroom-upgrades.html"
    ];

    const externalLinks = [
    "https://www.kulinariyaklassika.ru/2024/10/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/blog-post_3.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/blog-post_19.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/blog-post_18.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/blog-post_71.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/30.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/blog-post_48.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/blog-post_93.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinariyaklassika.ru/2024/10/blog-post_59.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.kulinariyaklassika.ru/2024/10/blog-post_21.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

