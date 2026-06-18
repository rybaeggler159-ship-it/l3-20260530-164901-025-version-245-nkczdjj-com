var StaticMovieSite = (function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-nav]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function() {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        var next = Number(dot.getAttribute("data-hero-dot") || 0);
        show(next);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    start();
  }

  function setupFilters() {
    var panel = document.querySelector("[data-filter-panel]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    if (!panel || !cards.length) {
      return;
    }
    var search = panel.querySelector("[data-search-input]");
    var region = panel.querySelector("[data-region-filter]");
    var year = panel.querySelector("[data-year-filter]");
    var type = panel.querySelector("[data-type-filter]");
    var empty = document.querySelector("[data-empty-state]");

    function text(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year"),
        card.getAttribute("data-type"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags")
      ].join(" ").toLowerCase();
    }

    function apply() {
      var q = (search && search.value || "").trim().toLowerCase();
      var r = region && region.value || "";
      var y = year && year.value || "";
      var t = type && type.value || "";
      var shown = 0;

      cards.forEach(function(card) {
        var ok = true;
        if (q && text(card).indexOf(q) === -1) {
          ok = false;
        }
        if (r && card.getAttribute("data-region") !== r) {
          ok = false;
        }
        if (y && card.getAttribute("data-year") !== y) {
          ok = false;
        }
        if (t && card.getAttribute("data-type") !== t) {
          ok = false;
        }
        card.hidden = !ok;
        if (ok) {
          shown += 1;
        }
      });

      if (empty) {
        empty.hidden = shown !== 0;
      }
    }

    [search, region, year, type].forEach(function(el) {
      if (el) {
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
      }
    });
  }

  function mountPlayer(playUrl) {
    var video = document.querySelector("[data-player]");
    var overlay = document.querySelector("[data-start-play]");
    var detailPlay = document.querySelector("[data-detail-play]");
    if (!video || !playUrl) {
      return;
    }
    var attached = false;
    var hls = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
      } else {
        video.src = playUrl;
      }
    }

    function play() {
      attach();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var task = video.play();
      if (task && typeof task.catch === "function") {
        task.catch(function() {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }
    if (detailPlay) {
      detailPlay.addEventListener("click", function() {
        video.scrollIntoView({ behavior: "smooth", block: "center" });
        play();
      });
    }
    video.addEventListener("click", function() {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
    window.addEventListener("pagehide", function() {
      if (hls) {
        hls.destroy();
      }
    });
  }

  ready(function() {
    setupMenu();
    setupHero();
    setupFilters();
  });

  return {
    mountPlayer: mountPlayer
  };
})();
