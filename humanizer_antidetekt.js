(() => {
  // ===== Fake navigator fingerprint =====
  try {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['ru-RU', 'ru'] });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 });
  } catch (e) {}

  // ===== Fake screen fingerprint =====
  try {
    Object.defineProperty(screen, 'width', { get: () => 1920 });
    Object.defineProperty(screen, 'height', { get: () => 1080 });
    Object.defineProperty(screen, 'colorDepth', { get: () => 24 });
  } catch (e) {}

  // ===== Fake canvas fingerprint =====
  const getFakeCanvas = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("fake-canvas", 2, 15);
    return canvas.toDataURL();
  };

  // ===== Real click simulation on real element =====
  const ghostBtn = document.createElement('a');
  ghostBtn.href = "#";
  ghostBtn.innerText = "go";
  ghostBtn.style = "position:absolute;top:-9999px;left:-9999px;";
  ghostBtn.id = "ghostLink";
  document.body.appendChild(ghostBtn);
  setTimeout(() => {
    ghostBtn.click();
  }, 1500);

  // ===== Real referer simulation via pushState =====
  if (history.pushState) {
    history.pushState({}, "", location.pathname + location.search + "#real");
  }

  // ===== Simulate user events =====
  function fireMouseEvent() {
    const evt = new MouseEvent("mousemove", {
      bubbles: true,
      cancelable: true,
      clientX: Math.random() * window.innerWidth,
      clientY: Math.random() * window.innerHeight
    });
    document.dispatchEvent(evt);
  }

  function simulateScroll() {
    window.scrollTo({ top: Math.random() * document.body.scrollHeight, behavior: 'smooth' });
  }

  function simulateKeydown() {
    const evt = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
    document.dispatchEvent(evt);
  }

  fireMouseEvent();
  simulateScroll();
  simulateKeydown();

  setInterval(fireMouseEvent, 5000);
  setInterval(simulateScroll, 7000);
})();