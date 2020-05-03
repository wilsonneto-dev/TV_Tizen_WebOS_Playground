tizenProtectedPlayer = {
  uiVideo: null,
  debug: true,
  playerWidth: 450,
  playerHeight: 300,

  appendPlayer: function (uiParentElement) {
    this.log('--appendPlayer');
    uiVideoElement = document.createElement('object');
    uiVideoElement.type = 'application/avplayer';
    uiVideoElement.width = this.playerWidth;
    uiVideoElement.height = this.playerHeight;

    if (uiParentElement) {
      uiParentElement.appendChild(uiVideoElement);
      this.uiVideo = uiVideoElement;
    }
  },

  /* controls */
  load: function (playbackInfo) {
    this.log('--load - avplay:open');
    webapis.avplay.open(playbackInfo.smooth);

    this.log('--avplay: setup listenners');
    webapis.avplay.setListener(avPlayerlisteners);

    this.log('--drm properties');
    var drmProperties = {
      DeleteLicenseAfterUse: false,
      LicenseServer: playbackInfo.drm.playready.LA_URL,
    };

    this.log('--set drm');
    webapis.avplay.setDrm(
      'PLAYREADY',
      'SetProperties',
      JSON.stringify(drmProperties)
    );

    this.log('--drm properties');
    webapis.avplay.prepare();

    this.log('--setting up the rects');
    const rect = this.getPlayerRect(this.playerWidth, this.playerHeight);
    webapis.avplay.setDisplayRect(rect.left, rect.top, rect.width, rect.height);
  },

  play: function () {
    webapis.avplay.play();
  },

  pause: function () {
    webapis.avplay.pause();
  },

  /* just for debug */
  log: function (msg) {
    if (this.debug) console.log(msg);
    uiLogStash = document.getElementById('log_stash');
    if (uiLogStash) uiLogStash.innerHTML = msg + '<br>' + uiLogStash.innerHTML;
  },

  /* Tizen particularities */
  getPlayerRect: function (width, height) {
    var screenwidth = window.document.documentElement.clientWidth;
    var center = screenwidth / 2;
    var leftPosition = center - width / 2;
    return { left: leftPosition, width: width, top: 0, height: height };
  },
};

avPlayerlisteners = {
  onbufferingstart: function () {
    this.log('Buffering start.');
  }.bind(tizenProtectedPlayer),

  onbufferingprogress: function (percent) {
    // this.log('Buffering progress data : ' + percent);
  }.bind(tizenProtectedPlayer),

  onbufferingcomplete: function () {
    this.log('Buffering complete.');
  }.bind(tizenProtectedPlayer),
  onstreamcompleted: function () {
    this.log('Stream Completed');
    webapis.avplay.stop();
  }.bind(tizenProtectedPlayer),

  oncurrentplaytime: function (currentTime) {
    // this.log('Current playtime: ' + currentTime);
  }.bind(tizenProtectedPlayer),

  onerror: function (eventType) {
    this.log('event type error : ' + eventType);
  }.bind(tizenProtectedPlayer),

  onevent: function (eventType, eventData) {
    this.log('event type: ' + eventType + ', data: ' + eventData);
  }.bind(tizenProtectedPlayer),

  onsubtitlechange: function (duration, text, data3, data4) {
    this.log('subtitleText: ' + text);
  }.bind(tizenProtectedPlayer),
  ondrmevent: function (drmEvent, drmData) {
    this.log('DRM callback: ' + drmEvent + ', data: ' + drmData);
  }.bind(tizenProtectedPlayer),
};
