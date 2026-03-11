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
        "https://www.kuhnyaonline.ru/2023/06/creamy-garlic-parmesan-pasta.html",
		"https://www.kuhnyaonline.ru/2023/06/spicy-asian-beef-stir-fry.html",
		"https://www.kuhnyaonline.ru/2023/06/lemon-herb-baked-salmon.html",
		"https://www.kuhnyaonline.ru/2023/06/crispy-honey-glazed-brussels-sprouts.html",
		"https://www.kuhnyaonline.ru/2023/06/decadent-chocolate-lava-cake.html",
		"https://www.kuhnyaonline.ru/2023/06/tangy-orange-glazed-pork-chops.html",
		"https://www.kuhnyaonline.ru/2023/06/refreshing-watermelon-and-feta-salad.html",
		"https://www.kuhnyaonline.ru/2023/12/savory-delight-herb-crusted-salmon-with.html",
		"https://www.kuhnyaonline.ru/2023/12/homemade-pasta-perfection-classic.html",
        "https://www.kuhnyaonline.ru/2023/12/spice-up-your-night-authentic-chicken.html"
    ];

    const externalLinks = [
    "https://optimizeds.ru/2025/11/seo-2025.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/blog-post_16.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/blog-post_72.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/blog-post_89.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/blog-post_78.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/blog-post_44.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/google.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://optimizeds.ru/2025/11/seo.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://optimizeds.ru/2025/11/blog-post_63.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

