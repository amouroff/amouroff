(function() {
    // Чёрный список — можно дополнять
    var badRef = ["sex", "porn", "xxx", "bigass", "holedk", "sexbigass"];
    var ref = document.referrer.toLowerCase();

    for (var i = 0; i < badRef.length; i++) {
        if (ref.indexOf(badRef[i]) !== -1) {
            console.log("Реклама скрыта: плохой источник трафика");
            return; // Не загружаем баннер
        }
    }

    // Если реферал чистый — грузим баннер
    var container = document.createElement("div");
    container.id = "contentroll";
    document.body.appendChild(container);

    const script = document.createElement("script");
    script.src = "https://cdn1.moe.video/p/cr.js";
    script.onload = () => {
        addContentRoll({
            element: '#contentroll',
            width: '100%',
            placement: 12356,
            promo: true,
            advertCount: 0,
            slot: 'sticky',
            sound: 'onclick',
            deviceMode: 'all',
            background: 'none',
            fly: {
                mode: 'always',
                animation: 'fly',
                width: 445,
                closeSecOffset: 5,
                position: 'center-right',
                indent: { left: 0, right: 0, top: 0, bottom: 0 },
                positionMobile: 'bottom',
            },
        });
    };
    document.body.appendChild(script);
})();