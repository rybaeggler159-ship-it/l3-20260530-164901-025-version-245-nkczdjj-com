(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  var topButton = document.querySelector('.back-top');

  if (topButton) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 320) {
        topButton.classList.add('show');
      } else {
        topButton.classList.remove('show');
      }
    });

    topButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  });

  var searchPage = document.querySelector('[data-search-page]');

  if (searchPage) {
    var input = searchPage.querySelector('[data-search-input]');
    var state = searchPage.querySelector('[data-search-state]');
    var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-search]'));
    var chips = Array.prototype.slice.call(searchPage.querySelectorAll('[data-filter]'));
    var params = new URLSearchParams(window.location.search);
    var activeCategory = 'all';

    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    function normalize(text) {
      return String(text || '').trim().toLowerCase();
    }

    function apply() {
      var query = normalize(input ? input.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var category = card.getAttribute('data-category') || '';
        var queryMatch = !query || haystack.indexOf(query) !== -1;
        var categoryMatch = activeCategory === 'all' || category === activeCategory;
        var show = queryMatch && categoryMatch;

        card.hidden = !show;

        if (show) {
          visible += 1;
        }
      });

      if (state) {
        state.textContent = query ? '搜索结果：' + visible + ' 部影片' : '当前展示：' + visible + ' 部影片';
      }
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeCategory = chip.getAttribute('data-filter') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        apply();
      });
    });

    apply();
  }
})();
