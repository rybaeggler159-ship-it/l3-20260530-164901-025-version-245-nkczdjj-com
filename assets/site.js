(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === active);
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    show(0);
    start();
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase().replace(/\s+/g, "");
  }

  function setupFilter(scope) {
    var input = scope.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card-grid] .movie-card, [data-card-grid] .ranking-card"));
    var empty = scope.querySelector("[data-empty-state]");
    var target = scope.nextElementSibling;

    while (!cards.length && target) {
      cards = Array.prototype.slice.call(target.querySelectorAll("[data-card-grid] .movie-card, [data-card-grid] .ranking-card"));
      empty = target.querySelector("[data-empty-state]") || empty;
      target = target.nextElementSibling;
    }

    var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-quick-filter]"));
    var quick = "";

    function cardText(card) {
      return normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-tags"),
        card.textContent
      ].join(" "));
    }

    function run() {
      var query = normalize(input ? input.value : "");
      var quickQuery = normalize(quick);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = cardText(card);
        var matched = (!query || haystack.indexOf(query) !== -1) && (!quickQuery || haystack.indexOf(quickQuery) !== -1);
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", run);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        quick = chip.getAttribute("data-quick-filter") || "";
        chips.forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        run();
      });
    });
  }

  Array.prototype.slice.call(document.querySelectorAll(".filter-scope, .quick-search")).forEach(setupFilter);
})();
