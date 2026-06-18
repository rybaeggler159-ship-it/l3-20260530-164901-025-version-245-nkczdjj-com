(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function initNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initCarousel() {
    var carousels = document.querySelectorAll("[data-carousel]");
    carousels.forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-dot]"));
      var prev = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          show(dotIndex);
          start();
        });
      });

      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      show(0);
      start();
    });
  }

  function initSearch() {
    var input = document.querySelector("[data-search-input]");
    var resultWrap = document.querySelector("[data-search-results]");
    if (!input || !resultWrap) {
      return;
    }
    var cards = Array.prototype.slice.call(resultWrap.querySelectorAll(".movie-card"));
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    function filter(value) {
      var keyword = value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search-text") || "").toLowerCase();
        card.style.display = !keyword || text.indexOf(keyword) !== -1 ? "" : "none";
      });
    }

    input.value = query;
    filter(query);
    input.addEventListener("input", function () {
      filter(input.value);
    });

    document.querySelectorAll("[data-chip]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        input.value = chip.getAttribute("data-chip") || "";
        filter(input.value);
        input.focus();
      });
    });
  }

  function initPlayers() {
    document.querySelectorAll(".movie-player[data-video]").forEach(function (video) {
      var url = video.getAttribute("data-video");
      var box = video.closest(".player-box");
      var button = box ? box.querySelector("[data-player-button]") : null;
      var loaded = false;
      var hls = null;

      function loadVideo() {
        if (loaded || !url) {
          return;
        }
        loaded = true;
        if (url.indexOf(".m3u8") !== -1) {
          if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            video.src = url;
          }
        } else {
          video.src = url;
        }
        video.load();
      }

      function playVideo() {
        loadVideo();
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }

      loadVideo();

      if (button) {
        button.addEventListener("click", playVideo);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          playVideo();
        }
      });

      video.addEventListener("play", function () {
        if (box) {
          box.classList.add("is-playing");
        }
      });

      video.addEventListener("pause", function () {
        if (box) {
          box.classList.remove("is-playing");
        }
      });

      window.addEventListener("pagehide", function () {
        if (hls && hls.destroy) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    initNavigation();
    initCarousel();
    initSearch();
    initPlayers();
  });
})();
