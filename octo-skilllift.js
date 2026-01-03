(function (o, c, t, l, i) {
  for (i = 0; i < o.scripts.length; i++) {
    if (o.scripts[i].src === c) {
      return;
    }
  }
  l = o.createElement("script");
  l.src = c + "?" + Date.now();
  l.async = true;
  l.setAttribute("data-id", t);
  o.body.appendChild(l);
})(document, "https://Octo25.me/lib.js", "ia522a-7a6e07");
