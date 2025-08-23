(function() {
    if (window.top === window.self) {
        document.documentElement.style.display = "block";
    } else {
        window.top.location.href = window.location.href;
    }
})();
