(function(){
    if (window.top !== window.self) {
        window.top.location.href = window.location.href;
        return;
    }
    const p = new URLSearchParams(window.location.search);
    if(p.get('utm_source')==='yandex' && p.get('utm_medium')==='organic' && p.get('utm_campaign')==='promo'){
        const l = [
            "https://www.mindtracks.ru/2024/09/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_17.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_88.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/5.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_0.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_48.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_8.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_1.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_71.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
            "https://www.mindtracks.ru/2024/09/blog-post_36.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
        ];
        setTimeout(()=>{
            window.location.href = l[Math.floor(Math.random() * l.length)];
        }, Math.floor(Math.random() * 14999) + 15000);
    }
})();
