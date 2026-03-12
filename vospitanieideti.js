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
    "https://www.vospitanieideti.ru/2023/08/exploring-through-taste-introducing.html",
	"https://www.vospitanieideti.ru/2023/08/sleeping-sweetly-tips-and-tricks-for.html",
	"https://www.vospitanieideti.ru/2023/08/playtime-wonders-stimulating-toys-and.html",
	"https://www.vospitanieideti.ru/2023/08/soothing-strategies-effective.html",
	"https://www.vospitanieideti.ru/2023/08/tiny-fashionistas-adorable-and.html",
	"https://www.vospitanieideti.ru/2023/08/capturing-memories-creative-ideas-for.html",
	"https://www.vospitanieideti.ru/2023/08/healthy-beginnings-expert-insights-into.html",
	"https://www.vospitanieideti.ru/2023/08/babys-firsts-capturing-milestones-and.html",
	"https://www.vospitanieideti.ru/2023/08/growing-together-building-strong-parent.html",
    "https://www.vospitanieideti.ru/2023/08/soothing-strategies-effective_30.html"
    ];

    const externalLinks = [
    "https://www.setevyetehnologii.ru/2023/08/navigating-digital-landscape-strategies.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/the-power-of-personal-branding-building.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/unlocking-success-mastering-time.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/innovative-marketing-trends-leveraging.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/from-startup-to-scale-up-essential.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/customer-centric-excellence-crafting.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/sustainable-business-practices.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/the-art-of-negotiation-winning-deals.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.setevyetehnologii.ru/2023/08/resilience-in-times-of-change.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.setevyetehnologii.ru/2026/03/2026.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

