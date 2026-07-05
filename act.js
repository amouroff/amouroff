(function(){
    if (window.top !== window.self) {
        window.top.location.href = window.location.href;
        return;
    }
    const p = new URLSearchParams(window.location.search);
    if(p.get('utm_source')==='yandex' && p.get('utm_medium')==='organic' && p.get('utm_campaign')==='promo'){
        const l = [
        "https://www.activezozh.ru/2024/09/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/10.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/blog-post_26.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/blog-post_51.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/blog-post_97.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/blog-post_13.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/blog-post_65.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/blog-post_64.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
		"https://www.activezozh.ru/2024/09/5.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
        "https://www.activezozh.ru/2024/09/blog-post_32.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
        ];
        setTimeout(()=>{
            window.location.href = l[Math.floor(Math.random() * l.length)];
        }, Math.floor(Math.random() * 14999) + 15000);
    }
})();
