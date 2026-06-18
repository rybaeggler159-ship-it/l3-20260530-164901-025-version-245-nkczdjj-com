(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-nav-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var active = 0;
        var timer = null;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === active);
            });
        }
        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(active + 1);
            }, 5200);
        }
        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                restart();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
        });
        show(0);
        restart();
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-box]"));
        if (!panels.length) {
            return;
        }
        panels.forEach(function (panel) {
            var input = panel.querySelector("[data-filter-input]");
            var year = panel.querySelector("[data-year-filter]");
            var scope = panel.parentElement || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
            function apply() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var selectedYear = year ? year.value : "";
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-tags") || "",
                        card.textContent || ""
                    ].join(" ").toLowerCase();
                    var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
                    card.hidden = !(matchKeyword && matchYear);
                });
            }
            if (input) {
                input.addEventListener("input", apply);
            }
            if (year) {
                year.addEventListener("change", apply);
            }
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
