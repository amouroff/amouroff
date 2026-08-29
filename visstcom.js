  (function() {
    Object.defineProperty(document, 'hidden', {
      get: function() { return false; }
    });
    Object.defineProperty(document, 'visibilityState', {
      get: function() { return 'visible'; }
    });
    document.addEventListener('visibilitychange', function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }, true);
  })();
