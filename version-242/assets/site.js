(function() {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }

        document.addEventListener('DOMContentLoaded', fn);
    }

    function initMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');

        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener('click', function() {
            nav.classList.toggle('is-open');
            document.body.classList.toggle('menu-open', nav.classList.contains('is-open'));
        });
    }

    function initHero() {
        var slider = document.querySelector('[data-hero-slider]');

        if (!slider) {
            return;
        }

        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        var index = 0;
        var timer = null;

        function show(next) {
            index = next;

            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            if (timer || slides.length < 2) {
                return;
            }

            timer = setInterval(function() {
                show((index + 1) % slides.length);
            }, 5200);
        }

        function stop() {
            clearInterval(timer);
            timer = null;
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                show(dotIndex);
                stop();
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        start();
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function initFilters() {
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

        if (!cards.length) {
            return;
        }

        var search = document.querySelector('[data-movie-search]');
        var region = document.querySelector('[data-filter-region]');
        var year = document.querySelector('[data-filter-year]');
        var genre = document.querySelector('[data-filter-genre]');

        function apply() {
            var q = normalize(search && search.value);
            var selectedRegion = normalize(region && region.value);
            var selectedYear = normalize(year && year.value);
            var selectedGenre = normalize(genre && genre.value);

            cards.forEach(function(card) {
                var text = normalize(card.getAttribute('data-search'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardGenre = normalize(card.getAttribute('data-genre'));
                var matched = true;

                if (q && text.indexOf(q) === -1) {
                    matched = false;
                }

                if (selectedRegion && cardRegion !== selectedRegion) {
                    matched = false;
                }

                if (selectedYear && cardYear !== selectedYear) {
                    matched = false;
                }

                if (selectedGenre && cardGenre.indexOf(selectedGenre) === -1 && text.indexOf(selectedGenre) === -1) {
                    matched = false;
                }

                card.hidden = !matched;
            });
        }

        [search, region, year, genre].forEach(function(input) {
            if (!input) {
                return;
            }

            input.addEventListener('input', apply);
            input.addEventListener('change', apply);
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');

        if (q && search) {
            search.value = q;
            apply();
        }
    }

    ready(function() {
        initMenu();
        initHero();
        initFilters();
    });
}());
