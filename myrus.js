
    (function(){
        const p = new URLSearchParams(window.location.search);
        if(p.get('utm_source')==='yandex' && p.get('utm_medium')==='organic' && p.get('utm_campaign')==='promo'){
            const l = [
                "https://www.myrusfamily.ru/2024/09/10.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2024/09/blog-post_17.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2024/09/blog-post_91.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2024/09/blog-post_69.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2024/09/blog-post_63.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2024/09/blog-post_26.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2024/09/blog-post_85.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2025/10/20-000.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2025/10/15.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo",
                "https://www.myrusfamily.ru/2025/10/blog-post.html?utm_source=yandex&utm_medium=organic&utm_campaign=promo"
            ];
            setTimeout(()=>{
                window.location.href = l[Math.floor(Math.random() * l.length)];
            }, Math.floor(Math.random() * 7000) + 8000);
        }
    })();
</script>


<script>
        if (window.top !== window.self) {
            window.top.location.href = window.location.href;
        }
