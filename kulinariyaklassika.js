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
        "https://www.kulinariyaklassika.ru/2024/10/blog-post.html",
		"https://www.kulinariyaklassika.ru/2024/10/blog-post_3.html",
		"https://www.kulinariyaklassika.ru/2024/10/blog-post_19.html",
		"https://www.kulinariyaklassika.ru/2024/10/blog-post_18.html",
		"https://www.kulinariyaklassika.ru/2024/10/blog-post_71.html",
		"https://www.kulinariyaklassika.ru/2024/10/30.html",
		"https://www.kulinariyaklassika.ru/2024/10/blog-post_48.html",
		"https://www.kulinariyaklassika.ru/2024/10/blog-post_59.html",
		"https://www.kulinariyaklassika.ru/2024/10/blog-post_93.html",
        "https://www.kulinariyaklassika.ru/2024/10/blog-post_21.html"
    ];

    const externalLinks = [
    "https://www.kulinarnyesovety.ru/2024/11/how-to-create-restaurant-quality-dishes.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/best-baking-tips-for-beginners-and-pros.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/understanding-flavor-profiles-to.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/quick-one-pot-meals-for-effortless.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/fresh-herbs-vs-dried-when-and-how-to.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/step-by-step-guide-to-meal-prepping.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/exploring-world-cuisines-recipes-to.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/top-kitchen-mistakes-and-how-to-avoid.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.kulinarnyesovety.ru/2024/11/homemade-pasta-made-easy-tips-and-tricks.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.kulinarnyesovety.ru/2024/11/cooking-with-seasonal-ingredients-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

