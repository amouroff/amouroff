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
        "https://www.gidrossii.ru/2024/09/10.html",
		"https://www.gidrossii.ru/2024/09/blog-post.html",
		"https://www.gidrossii.ru/2024/09/blog-post_26.html",
		"https://www.gidrossii.ru/2024/09/blog-post_73.html",
		"https://www.gidrossii.ru/2024/09/blog-post_34.html",
		"https://www.gidrossii.ru/2024/09/blog-post_79.html",
		"https://www.gidrossii.ru/2024/09/blog-post_14.html",
		"https://www.gidrossii.ru/2024/09/blog-post_4.html",
		"https://www.gidrossii.ru/2024/09/blog-post_59.html",
        "https://www.gidrossii.ru/2024/09/blog-post_39.html"
    ];

    const externalLinks = [
    "https://lista4.ru/2023/05/the-ultimate-guide-to-choosing-right.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/exploring-evolution-of-paper-from.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/paper-conservation-101-preserving-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/the-art-of-paper-crafting-inspiring.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/choosing-perfect-stationery-tips-for.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/the-environmental-impact-of-paper.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/understanding-paper-weight-and.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/inkjet-or-laser-printing-decoding-best.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://lista4.ru/2023/05/unlocking-mysteries-of-specialty-papers.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://lista4.ru/2023/05/the-science-behind-paper-quality.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

