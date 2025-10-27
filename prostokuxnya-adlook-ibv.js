(function() {
  const style = document.createElement("style");
  style.textContent = `
    .adlk_ibv_onlypc, .adlk_ibv_mobpc  {margin-bottom: 1rem; margin-top: 1rem}
    @media (max-width: 640px) {
        .adlk_ibv_onlypc { display: none; }
        .adlk_ibv_mobpc { width: 90%; }
    }
  `;
  document.head.appendChild(style);

  const html = `
    <div id="adlk-embed-1" class="adlk_ibv_mobpc" style="min-height: 225px; min-width: 400px"></div>
    <div id="adlk-embed-2" class="adlk_ibv_onlypc" style="min-height: 225px; min-width: 400px"></div>
  `;
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  const containers = ["adlk-embed-1","adlk-embed-2"];
  const init = (id) => {
    if (window.UTInventoryCore && document.getElementById(id)) {
      new window.UTInventoryCore({
        type: "embed",
        host: 2294,
        content: false,
        container: id,
        adaptive: true,
        width: 400,
        height: 225,
        playMode: "autoplay",
        collapse: "none",
        infinity: true,
        infinityTimer: 1,
        withoutIframe: true,
      });
    }
  };
  const tryInit = () => {
    if (window.UTInventoryCore) containers.forEach(init);
    else setTimeout(tryInit, 100);
  };
  tryInit();
})();
