(function () {
  "use strict";

  function initPlayer(shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector(".play-cover");
    var source = shell.getAttribute("data-src");
    var hlsInstance = null;
    var initialized = false;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      if (initialized) {
        return;
      }

      initialized = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 30,
          backBufferLength: 30,
          enableWorker: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      attachSource();
      var result = video.play();

      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        playVideo();
      });
    }

    video.addEventListener("play", function () {
      shell.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      if (!video.ended) {
        shell.classList.remove("is-playing");
      }
    });

    video.addEventListener("ended", function () {
      shell.classList.remove("is-playing");
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.querySelectorAll(".video-shell").forEach(initPlayer);
})();
