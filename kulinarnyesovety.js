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
        "https://www.kulinarnyesovety.ru/2024/11/how-to-create-restaurant-quality-dishes.html",
		"https://www.kulinarnyesovety.ru/2024/11/best-baking-tips-for-beginners-and-pros.html",
		"https://www.kulinarnyesovety.ru/2024/11/understanding-flavor-profiles-to.html",
		"https://www.kulinarnyesovety.ru/2024/11/quick-one-pot-meals-for-effortless.html",
		"https://www.kulinarnyesovety.ru/2024/11/fresh-herbs-vs-dried-when-and-how-to.html",
		"https://www.kulinarnyesovety.ru/2024/11/step-by-step-guide-to-meal-prepping.html",
		"https://www.kulinarnyesovety.ru/2024/11/exploring-world-cuisines-recipes-to.html",
		"https://www.kulinarnyesovety.ru/2024/11/top-kitchen-mistakes-and-how-to-avoid.html",
		"https://www.kulinarnyesovety.ru/2024/11/homemade-pasta-made-easy-tips-and-tricks.html",
        "https://www.kulinarnyesovety.ru/2024/11/cooking-with-seasonal-ingredients-for.html"
    ];

    const externalLinks = [
    "https://www.beg365.ru/2023/05/10-essential-tips-for-injury-free.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/the-art-of-setting-realistic-running.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/fueling-your-runs-nutrition-tips-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/from-couch-to-5k-beginners-guide-to.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/mastering-mental-game-of-running.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/exploring-trail-running-connecting-with.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/the-power-of-cross-training-enhancing.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/running-for-weight-loss-how-to-shed.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.beg365.ru/2023/05/staying-motivated-overcoming-running.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.beg365.ru/2023/05/running-in-all-seasons-tips-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

