(function () {
  "use strict";

  var navToggle = document.querySelector("[data-nav-toggle]");

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5000);
  }

  var homeSearchForms = document.querySelectorAll("[data-search-form]");

  homeSearchForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='q']");
      var query = input ? input.value.trim() : "";
      var target = form.getAttribute("action") || "search.html";
      window.location.href = target + (query ? "?q=" + encodeURIComponent(query) : "");
    });
  });

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, "");
  }

  function setupFilter(area) {
    var input = area.querySelector("[data-filter-input]");
    var year = area.querySelector("[data-filter-year]");
    var region = area.querySelector("[data-filter-region]");
    var category = area.querySelector("[data-filter-category]");
    var cards = Array.prototype.slice.call(area.querySelectorAll(".movie-card"));

    if (!cards.length) {
      return;
    }

    function applyFilter() {
      var queryValue = normalize(input ? input.value : "");
      var yearValue = year ? year.value : "";
      var regionValue = region ? region.value : "";
      var categoryValue = category ? category.value : "";

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var cardYear = card.getAttribute("data-year") || "";
        var cardRegion = card.getAttribute("data-region") || "";
        var cardCategory = card.getAttribute("data-category") || "";
        var matched = true;

        if (queryValue && text.indexOf(queryValue) === -1) {
          matched = false;
        }

        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }

        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }

        if (categoryValue && cardCategory !== categoryValue) {
          matched = false;
        }

        card.classList.toggle("is-hidden", !matched);
      });
    }

    [input, year, region, category].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query && input) {
      input.value = query;
      applyFilter();
    }
  }

  document.querySelectorAll("[data-filter-area]").forEach(setupFilter);
})();
