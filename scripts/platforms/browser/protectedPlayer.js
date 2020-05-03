browserProtectedPlayer = {
  uiVideo: null,
  shakaPlayer: null,
  debug: true,

  appendPlayer: function (uiParentElement) {
    uiVideoElement = document.createElement('video');
    if (uiParentElement) {
      uiParentElement.appendChild(uiVideoElement);
      this.uiVideo = uiVideoElement;
      this.shakaPlayer = new shaka.Player(this.uiVideo);
      this.setupPlayer();
    }
  },

  load: function (playbackInfo) {
    this.shakaPlayer.configure({
      drm: {
        servers: {
          'com.widevine.alpha': playbackInfo.drm.widevine.LA_URL,
          'com.microsoft.playready': playbackInfo.drm.playready.LA_URL,
        },
      },
    });

    this.shakaPlayer
      .load(playbackInfo.dash)
      .then(
        function () {
          console.log('The video has now been loaded!');
        }.bind(this)
      )
      .catch(this.errorHandler.bind(this));
  },

  play: function () {
    this.uiVideo.play();
  },

  pause: function () {
    this.uiVideo.pause();
  },

  /* just for debug */
  log: function (msg) {
    if (this.debug) console.log(msg);
    uiLogStash = document.getElementById('log_stash');
    if (uiLogStash) uiLogStash.innerHTML = msg + '<br>' + uiLogStash.innerHTML;
  },

  setupPlayer: function () {
    this.shakaPlayer.addEventListener('error', this.errorHandler.bind(this));
  },

  errorHandler: function (event) {
    this.log('shakaPlayer:error -> ' + JSON.stringify(event));
  },
};
