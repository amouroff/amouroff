(function() {
    if (window.top === window.self) {
        // Если открыто напрямую — ничего не делаем
        document.documentElement.style.display = "block";
    } else {
        // Если во фрейме — редиректим
        window.top.location.href = window.location.href;
    }
})();
