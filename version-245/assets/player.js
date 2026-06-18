function initMoviePlayer(src) {
  var video = document.getElementById("movie-player");
  var cover = document.getElementById("play-cover");
  var attached = false;

  if (!video || !cover || !src) {
    return;
  }

  function attach() {
    if (attached) {
      return;
    }

    attached = true;

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      video.src = src;
    }
  }

  function hideCover() {
    cover.style.display = "none";
  }

  function play() {
    attach();
    hideCover();
    var action = video.play();

    if (action && typeof action.catch === "function") {
      action.catch(function () {
        cover.style.display = "grid";
      });
    }
  }

  cover.addEventListener("click", play);

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener("play", hideCover);
}
