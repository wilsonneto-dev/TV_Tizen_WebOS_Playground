webosProtectedPlayer = {
  uiVideo: null,
  debug: true,
  drmType: 'playready',
  appId: 'example.webos',
  drmLunaClientId: '',
  drmPlayreadyLaUrl: '',
  mediaDashSrc: '',

  appendPlayer: function (uiParentElement) {
    uiVideoElement = document.createElement('video');
    uiVideoElement.setAttribute('controls', 'controls');

    setInterval(
      function () {
        console.log(
          'Ping: ReadyState => ' +
            this.uiVideo.readyState +
            ' - currentTime: ' +
            this.uiVideo.currentTime
        );
        console.log(this.uiVideo.error);
        console.log(this.uiVideo.readyState);
      }.bind(this),
      30000
    );

    uiVideoElement.addEventListener(
      'canplay',
      function (p) {
        this.log('canplay');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'abort',
      function (p) {
        this.log('abort');
        this.log(p);
      }.bind(this)
    );
    uiVideoElement.addEventListener(
      'canplaythrough',
      function (p) {
        this.log('canplaythrough');
        this.log(p);
      }.bind(this)
    );
    uiVideoElement.addEventListener(
      'durationchange',
      function (p) {
        this.log('durationchange');
        this.log(p);
      }.bind(this)
    );
    uiVideoElement.addEventListener(
      'emptied',
      function (p) {
        this.log('emptied');
        this.log(p);
      }.bind(this)
    );
    uiVideoElement.addEventListener(
      'ended',
      function (p) {
        this.log('ended');
        this.log(p);
      }.bind(this)
    );
    uiVideoElement.addEventListener(
      'error',
      function (p) {
        this.log('error');
        this.log(p);
      }.bind(this)
    );
    uiVideoElement.addEventListener(
      'loadeddata',
      function (p) {
        this.log('loadeddata');
        this.log(p);
      }.bind(this)
    );
    uiVideoElement.addEventListener(
      'loadedmetadata',
      function (p) {
        this.log('loadedmetadata');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'pause',
      function (p) {
        this.log('pause');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'loadstart',
      function (p) {
        this.log('loadstart');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'play',
      function (p) {
        this.log('play');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'playing',
      function (p) {
        this.log('playing');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'progress',
      function (p) {
        this.log('progress');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'ratechange',
      function (p) {
        this.log('ratechange');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'seeked',
      function (p) {
        this.log('seeked');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'seeking',
      function (p) {
        this.log('seeking');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'stalled',
      function (p) {
        this.log('stalled');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'seeking',
      function (p) {
        this.log('seeking');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'suspend',
      function (p) {
        this.log('suspend');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'timeupdate',
      function (p) {
        // this.log('timeupdate');
        // this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'volumechange',
      function (p) {
        this.log('volumechange');
        this.log(p);
      }.bind(this)
    );

    uiVideoElement.addEventListener(
      'waiting',
      function (p) {
        this.log('waiting');
        this.log(p);
      }.bind(this)
    );

    if (uiParentElement) {
      uiParentElement.appendChild(uiVideoElement);
      this.uiVideo = uiVideoElement;
    }
  },

  /* controls */
  load: function (playbackInfo) {
    this.mediaDashSrc = playbackInfo.dash;
    this.drmPlayreadyLaUrl = playbackInfo.drm.playready.LA_URL;
    this.loadDrmClient(
      function () {
        this.sendRightInformation();
      }.bind(this)
    );
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

  /* webos particularities */
  loadDrmClient: function (successCallback, failedCallback) {
    this.log('--loadDrmClient function:');
    webOS.service.request('luna://com.webos.service.drm', {
      method: 'load',
      parameters: {
        drmType: this.drmType,
        appId: this.appId,
      },
      onSuccess: function (result) {
        this.log('load method. onSuccess.');
        this.log('clientId: ' + result.clientId);
        this.log('returnValue: ' + result.returnValue);
        this.drmLunaClientId = result.clientId;
        this.registerDRMErrorHandler();
        if (successCallback) successCallback(result);
      }.bind(this),
      onFailure: function (result) {
        this.log('[load][' + result.errorCode + '] ' + result.errorText);
        if (failedCallback) failedCallback(result);
      }.bind(this),
    });
  },

  setPlaybackOptions: function () {
    this.log('--setPlaybackOptions function:');
    var options = {};
    options.option = {};
    options.option.drm = {};
    options.option.drm.type = this.drmType;
    options.option.drm.clientId = this.drmLunaClientId;
    var source = document.createElement('source');
    source.setAttribute('src', this.mediaDashSrc);
    this.log('dash: ' + this.mediaDashSrc);
    source.setAttribute(
      'type',
      'application/dash+xml;mediaOption=' + escape(JSON.stringify(options))
    );
    this.log('Set Playback option');
    this.uiVideo.appendChild(source);
    this.uiVideo.play();
    this.log('Mediaoption: ' + JSON.stringify(options));
  },

  sendRightInformation: function () {
    this.log('--sendRightInformation function:');
    var msg =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">' +
      '<LicenseServerUriOverride>' +
      '<LA_URL>' +
      this.drmPlayreadyLaUrl +
      '</LA_URL> ' +
      '</LicenseServerUriOverride> ' +
      '</PlayReadyInitiator>';

    this.log('clientId:' + this.drmLunaClientId);
    this.log('Message:' + msg);

    webOS.service.request('luna://com.webos.service.drm', {
      method: 'sendDrmMessage',
      parameters: {
        clientId: this.drmLunaClientId,
        msgType: 'application/vnd.ms-playready.initiator+xml',
        msg: msg,
        drmSystemId: 'urn:dvb:casystemid:19219',
      },
      onSuccess: function (result) {
        msgId = result.msgId;
        this.log('sendDrmMessage method. onSuccess.');
        this.log('result.resultCode: ' + result.resultCode);
        this.log('result.resultMsg: ' + result.resultMsg);
        this.log('result.msgId: ' + result.msgId);
        // insert source element
        this.setPlaybackOptions();
      }.bind(this),
      onFailure: function (result) {
        this.log('sendDrmMessage method. onFailure.');
        this.log('result.returnValue: ' + result.returnValue);
        this.log('result.errorCode: ' + result.errorCode);
        this.log('result.errorText: ' + result.errorText);
      }.bind(this),
    });
  },

  registerDRMErrorHandler: function () {
    this.log('--registerDRMErrorHandler function:');
    var request = webOS.service.request('luna://com.webos.service.drm', {
      method: 'getRightsError',
      parameters: {
        clientId: this.drmLunaClientId,
        subscribe: true,
      },
      onSuccess: function (result) {
        this.log('registerDRMErrorHandler:success');
        if (0 == result.errorState) {
          this.log('*** No license');
        } else if (1 == result.errorState) {
          this.log('**** Invalid License');
        }
        console.log('DRM System ID: ' + result.drmSystemId);
        console.log('License Server URL: ' + result.rightIssueUrl);
        this.log(result);
      }.bind(this),
      onFailure: function (result) {
        this.log('registerDRMErrorHandler:failure');
        this.log(result);
      }.bind(this),
    });
  },
};
