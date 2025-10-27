(function() {
  // Вставляем твои стили
  const style = document.createElement("style");
  style.textContent = `
    .adlk_ibv_onlypc, .adlk_ibv_mobpc  {margin-bottom: 1rem; margin-top: 1rem}
    @media (max-width: 640px) {
        .adlk_ibv_onlypc { display: none; } 
        .adlk_ibv_mobpc { width: 90%; } 
    }
  `;
  document.head.appendChild(style);

  // Вставляем твой HTML
  const html = `
    <div class="adlk_ibv_container" style="display: flex; justify-content: center; gap: 20px; margin: auto;">
      <div id="adlk-embed-1" class="adlk_ibv_mobpc"></div>
      <div id="adlk-embed-2" class="adlk_ibv_onlypc"></div>
      <div id="adlk-embed-3" class="adlk_ibv_onlypc"></div>
    </div>
  `;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // Вставляем твой оригинальный JS
  const containers = ["adlk-embed-1", "adlk-embed-2", "adlk-embed-3"];    
  const init = (id) => {
    if (window.UTInventoryCore && document.getElementById(id)) {
      new window.UTInventoryCore({
        type: "embed", 
        host: 1702, 
        content: false, 
        container: id,
        width: 400, 
        height: 225, 
        playMode: "autoplay",
        collapse: "none",
        infinity: true, 
        interfaceType: 0,
        withoutIframe: true,
        infinityTimer: 1
      });
    }
  };

  const tryInit = () => {
    if (window.UTInventoryCore) containers.forEach(init);
    else setTimeout(tryInit, 100);
  };

  tryInit();
})();
