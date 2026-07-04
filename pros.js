(function(){
    if (window.top !== window.self) {
        window.top.location.href = window.location.href;
        return;
    }
    const p = new URLSearchParams(window.location.search);
    if(p.get('utm_source')==='yandex' && p.get('utm_medium')==='organic' && p.get('utm_campaign')==='promo'){
        const l = [
            "https://www.prostokuxnya.ru/2024/08/10.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_20.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_31.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_49.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_95.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_12.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_46.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_94.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.prostokuxnya.ru/2024/08/blog-post_62.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
        ];
        setTimeout(()=>{
            window.location.href = l[Math.floor(Math.random() * l.length)];
        }, Math.floor(Math.random() * 25000) + 15000);
    }
})();
