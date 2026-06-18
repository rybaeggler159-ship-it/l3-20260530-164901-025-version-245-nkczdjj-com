document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var searchInput = document.getElementById('siteSearch');
  if (searchInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
    var grid = document.querySelector('.archive-grid') || document.querySelector('.movie-grid') || document.querySelector('.rank-list');
    var empty = document.createElement('div');
    empty.className = 'no-results';
    empty.textContent = '没有找到匹配的影片';

    searchInput.addEventListener('input', function () {
      var keyword = searchInput.value.trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var matched = haystack.indexOf(keyword) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visibleCount += 1;
        }
      });

      if (grid) {
        if (visibleCount === 0 && keyword) {
          if (!empty.parentNode) {
            grid.appendChild(empty);
          }
        } else if (empty.parentNode) {
          empty.parentNode.removeChild(empty);
        }
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play]');
    var hlsInstance = null;

    if (!video || !button) {
      return;
    }

    function loadAndPlay() {
      var stream = video.getAttribute('data-stream');

      function begin() {
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            button.classList.remove('is-hidden');
          });
        }
      }

      button.classList.add('is-hidden');
      video.controls = true;

      if (!video.getAttribute('src') && !video.dataset.ready) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          video.dataset.ready = '1';
          begin();
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(stream);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.dataset.ready = '1';
            begin();
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal && hlsInstance) {
              hlsInstance.destroy();
              hlsInstance = null;
              video.src = stream;
              video.dataset.ready = '1';
              begin();
            }
          });
        } else {
          video.src = stream;
          video.dataset.ready = '1';
          begin();
        }
      } else {
        begin();
      }
    }

    button.addEventListener('click', loadAndPlay);
    video.addEventListener('click', function () {
      if (video.paused) {
        loadAndPlay();
      }
    });
  });
});
