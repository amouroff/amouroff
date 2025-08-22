(function() {
    // Скрываем страницу сразу
    document.documentElement.style.display = "none";

    if (window.top === window.self) {
        // Если открыто напрямую — показываем
        document.documentElement.style.display = "block";
    } else {
        // Если во фрейме — редиректим
        window.top.location.href = window.location.href;
    }
})();
