(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero-carousel]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-search-panel]"));
        panels.forEach(function (panel) {
            var targetId = panel.getAttribute("data-target");
            var target = document.getElementById(targetId);
            if (!target) {
                return;
            }
            var input = panel.querySelector("[data-search-input]");
            var year = panel.querySelector("[data-year-filter]");
            var type = panel.querySelector("[data-type-filter]");
            var sort = panel.querySelector("[data-sort-filter]");
            var originalCards = Array.prototype.slice.call(target.querySelectorAll(".searchable-card"));

            function valueOf(node, name) {
                return (node.getAttribute(name) || "").toLowerCase();
            }

            function apply() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var yearValue = year ? year.value : "";
                var typeValue = type ? type.value : "";
                var cards = Array.prototype.slice.call(target.querySelectorAll(".searchable-card"));

                cards.forEach(function (card) {
                    var text = [
                        valueOf(card, "data-title"),
                        valueOf(card, "data-region"),
                        valueOf(card, "data-type"),
                        valueOf(card, "data-genre"),
                        valueOf(card, "data-year")
                    ].join(" ");
                    var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchedYear = !yearValue || card.getAttribute("data-year") === yearValue;
                    var matchedType = !typeValue || card.getAttribute("data-type") === typeValue;
                    card.classList.toggle("is-hidden", !(matchedKeyword && matchedYear && matchedType));
                });
            }

            function sortCards() {
                if (!sort) {
                    return;
                }
                var mode = sort.value;
                var cards = Array.prototype.slice.call(target.querySelectorAll(".searchable-card"));
                cards.sort(function (a, b) {
                    if (mode === "year-asc") {
                        return Number(a.getAttribute("data-year") || 0) - Number(b.getAttribute("data-year") || 0);
                    }
                    if (mode === "title-asc") {
                        return valueOf(a, "data-title").localeCompare(valueOf(b, "data-title"), "zh-CN");
                    }
                    return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                });
                cards.forEach(function (card) {
                    target.appendChild(card);
                });
                apply();
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            if (year) {
                year.addEventListener("change", apply);
            }
            if (type) {
                type.addEventListener("change", apply);
            }
            if (sort) {
                sort.addEventListener("change", sortCards);
            }
            originalCards.forEach(function (card) {
                target.appendChild(card);
            });
            apply();
        });
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (player) {
            var video = player.querySelector("video[data-stream]");
            var button = player.querySelector("[data-play-button]");
            if (!video || !button) {
                return;
            }
            var stream = video.getAttribute("data-stream");

            function hideButton() {
                button.classList.add("is-hidden");
            }

            function playVideo() {
                if (!stream) {
                    return;
                }
                hideButton();
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    if (video.src !== stream) {
                        video.src = stream;
                    }
                    video.play().catch(function () {});
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    if (!video._hlsInstance) {
                        video._hlsInstance = new window.Hls();
                        video._hlsInstance.loadSource(stream);
                        video._hlsInstance.attachMedia(video);
                        video._hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {});
                        });
                    } else {
                        video.play().catch(function () {});
                    }
                    return;
                }
                if (video.src !== stream) {
                    video.src = stream;
                }
                video.play().catch(function () {});
            }

            button.addEventListener("click", playVideo);
            video.addEventListener("play", hideButton);
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupPlayers();
    });
})();
