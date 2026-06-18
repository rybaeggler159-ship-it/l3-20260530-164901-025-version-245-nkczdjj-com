(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var toggle = $("[data-mobile-toggle]");
    var panel = $("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = $("[data-hero]");
    if (!root) {
      return;
    }
    var slides = $all("[data-hero-slide]", root);
    var dots = $all("[data-hero-dot]", root);
    var prev = $("[data-hero-prev]", root);
    var next = $("[data-hero-next]", root);
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot") || 0));
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function loadHls() {
    return new Promise(function (resolve, reject) {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function bindPlayer(source) {
    var video = $("#movie-player");
    var button = $("#player-start");
    if (!video || !source) {
      return;
    }
    var started = false;
    var hlsInstance = null;

    function showMessage(text) {
      if (button) {
        button.innerHTML = "<span class=\"play-icon\">!</span><span>" + text + "</span>";
        button.classList.remove("is-hidden");
      }
    }

    function attachSource() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        return Promise.resolve();
      }
      return loadHls().then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          return;
        }
        video.src = source;
      });
    }

    function startPlayback() {
      if (started) {
        video.play().catch(function () {});
        return;
      }
      started = true;
      attachSource()
        .then(function () {
          if (button) {
            button.classList.add("is-hidden");
          }
          return video.play();
        })
        .catch(function () {
          started = false;
          showMessage("播放暂时无法加载");
        });
    }

    if (button) {
      button.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.initMoviePlayer = bindPlayer;

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupHero();
  });
})();
