(() => {
  const script = document.createElement("script");
  script.src = "https://cdn1.moe.video/p/cr.js";
  script.onload = () => {
    // 1. Нижний левый стикер
    addContentRoll({
      width: '100%',
      placement: 12356,
      promo: true,
      advertCount: 0,
      slot: 'sticky',
      sound: 'onclick',
      deviceMode: 'all',
      background: 'none',
      fly: {
        mode: 'stick',
        width: 445,
        closeSecOffset: 5,
        position: 'bottom-left', // 🔥 изменено: теперь снизу слева
        indent: { left: 0, right: 0, top: 0, bottom: 0 },
        positionMobile: 'bottom', // на мобилках остаётся снизу
      },
    });

    // 2. Внутри #contentroll слева
    addContentRoll({
      element: '#contentroll',
      width: '100%',
      placement: 12356,
      promo: true,
      advertCount: 0,
      slot: 'page',
      sound: 'onclick',
      deviceMode: 'all',
      background: 'none',
      fly: {
        mode: 'always',
        animation: 'fly',
        width: 445,
        closeSecOffset: 5,
        position: 'center-left',
        indent: { left: 0, right: 0, top: 0, bottom: 0 },
        positionMobile: 'bottom',
      },
    });

    // 3. Внутри #contentroll справа
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
  document.body.append(script);
})();
