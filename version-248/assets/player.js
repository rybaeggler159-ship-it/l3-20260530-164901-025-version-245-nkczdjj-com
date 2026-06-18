(function () {
  var Hls = window.Hls;
  var data = document.getElementById('play-data');
  var video = document.getElementById('movie-video');
  var button = document.getElementById('player-start');
  var errorBox = document.getElementById('player-error');

  if (!data || !video || !button) {
    return;
  }

  var config;

  try {
    config = JSON.parse(data.textContent || '{}');
  } catch (error) {
    config = {};
  }

  var streamUrl = config.url || '';
  var attached = false;
  var hlsInstance = null;

  function showError() {
    if (errorBox) {
      errorBox.textContent = '视频加载失败，请稍后再试';
      errorBox.classList.add('show');
    }
  }

  function attach() {
    if (attached || !streamUrl) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.ERROR, function (event, detail) {
        if (detail && detail.fatal) {
          showError();
        }
      });
    } else {
      showError();
    }
  }

  function begin() {
    attach();
    button.classList.add('is-hidden');
    video.controls = true;

    var playResult = video.play();

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        button.classList.remove('is-hidden');
      });
    }
  }

  button.addEventListener('click', begin);

  video.addEventListener('click', function () {
    if (video.paused) {
      begin();
    }
  });

  video.addEventListener('error', showError);

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
})();
