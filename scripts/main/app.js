const app = {
  platform: null,
  system: null,

  player: null,

  verifySystem: function () {
    const isTV = document.location.href.lastIndexOf('tv') > -1;
    if (isTV) {
      const isTizen = document.location.href.lastIndexOf('tizen') > -1;
      const isWebOS = document.location.href.lastIndexOf('webos') > -1;

      this.platform = enumPlatform.TV;
      if (isTizen) this.system = enumSystem.TIZEN;
      else this.system = enumSystem.WEBOS;
    } else {
      this.platform = enumPlatform.BROWSER;
    }
  },

  preparePlayer: function () {
    if (this.platform === enumPlatform.TV) {
      switch (this.system) {
        case enumSystem.TIZEN:
          if (typeof tizenProtectedPlayer !== 'undefined')
            this.player = tizenProtectedPlayer;
          break;

        case enumSystem.WEBOS:
          if (typeof webosProtectedPlayer !== 'undefined')
            this.player = webosProtectedPlayer;
          break;

        default:
          break;
      }
    } else {
      if (typeof browserProtectedPlayer !== 'undefined')
        this.player = browserProtectedPlayer;
    }
  },
};

window.app = app;
