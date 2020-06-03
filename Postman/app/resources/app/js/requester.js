webpackJsonp([28],{

/***/ 1024:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_sync_SyncManagerProxy__ = __webpack_require__(1025);


/**
                                                                    *
                                                                    */
function bootSyncProxy(cb) {
  _.assign(window.pm, { syncManager: new __WEBPACK_IMPORTED_MODULE_0__models_sync_SyncManagerProxy__["a" /* default */]() });
  pm.logger.info('SyncProxy~boot - Success');
  cb && cb(null);
}

/* harmony default export */ __webpack_exports__["a"] = (bootSyncProxy);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1025:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_backbone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stores_get_store__ = __webpack_require__(2);




/**
                                                    * Handles the socket, and is the interface for sending and receiving changesets
                                                    *
                                                    * @class SyncManager
                                                    */
var SyncManagerProxy = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model.extend({
  defaults: function () {
    return {
      loggedIn: false,
      nextReconnectTime: null,
      timeTillReconnect: null };

  },

  sendEventToSyncShared: function (event) {
    this.syncInternalChannel.publish(event);
  },

  attachInternalChannelSubscription: function () {
    this.syncManagerInternalDispose = this.syncInternalChannel.subscribe(event => {
      let eventNamespace = Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["getEventNamespace"])(event),
      eventName = Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["getEventName"])(event),
      eventData = Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["getEventData"])(event);

      if (eventNamespace === 'timeTillReconnect' && eventName === 'updated') {
        this.set('timeTillReconnect', eventData.timeTillReconnect);
        return;
      }

      if (eventNamespace === 'loggedIn' && eventName === 'updated') {
        this.set('loggedIn', eventData.loggedIn);
        return;
      }

      if (eventNamespace === 'conflicts' && eventName === 'show') {
        this.showConflicts(eventData.conflicts);
        return;
      }

      if (eventNamespace === 'issue' && eventName === 'show') {
        this.showSyncIssue(eventData.issue);
        return;
      }
    });
  },

  initialize: function () {
    this.syncInternalChannel = pm.eventBus.channel('sync-manager-internal');
    this.attachInternalChannelSubscription();
  },

  showConflicts: function (conflicts) {
    this.trigger('showConflicts', conflicts);
  },

  showSyncIssue: function (issue) {
    pm.mediator.trigger('showSyncIssue', issue);
  },

  syncIconClick: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('syncIconClicked', 'command'));
  },

  restoreCollection: function (restoreTarget, cb) {
    let isSocketConnected = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('SyncStatusStore').isSocketConnected;
    if (!isSocketConnected) {
      pm.toasts.error('You need to be connected to Postman Sync to restore a collection.');
      _.isFunction(cb) && cb(new Error('No sync connection to restore collection'));
      return;
    }
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('restoreCollection', 'command', { restoreTarget: restoreTarget }));
    cb();
  },

  conflictsResolved: function (resolution) {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('conflictsResolved', 'command', { resolution: resolution }));
  },

  forceSync: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('forceSync', 'command'));
  },

  forceSyncCollectionAndContinue: function (id) {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('forceSyncCollectionAndContinue', 'command', { collection: id }));
  },

  forceConnect: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('forceConnect', 'command'));
  },

  fetchPendingConflicts: function () {
    this.sendEventToSyncShared(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('fetchPendingConflicts', 'command'));
  } });


/* harmony default export */ __webpack_exports__["a"] = (SyncManagerProxy);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1026:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__models_ConsoleInterface__ = __webpack_require__(1027);


/**
                                                               * Boots up the console interface
                                                               * @param {Function} cb - The callback with error
                                                               */
function bootConsoleInterface(cb) {
  _.assign(window.pm, {
    console: new __WEBPACK_IMPORTED_MODULE_0__models_ConsoleInterface__["a" /* default */]() // @todo: Change to pm.console when we replace the current console
  });

  // Initialize the new console interface with current window information
  window.pm.console.initialize(pm && pm.window && pm.window.id).
  then(() => {
    pm.logger.info('NewConsole~boot - Success');

    // using `setTimeout` here to ensure that we take the errors in `cb` out
    // of the stack trace and do not call the `catch` block (which calls the
    // `cb` again!)
    return cb && setTimeout(cb, 0);
  }).
  catch(err => {
    pm.logger.error('NewConsole~boot - Failed');

    return cb && cb(err);
  });
}

/* harmony default export */ __webpack_exports__["a"] = (bootConsoleInterface);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1027:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConsoleInterface; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_uuid__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_pipelines_app_action__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants_ConsoleEventSeverity__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__constants_ConsoleEventTypes__ = __webpack_require__(287);


// @note: remove the below imports when removing the `clear` method. The console
// service should be responsible for interacting with the pipeline.
// see the comment for `clear` method for details





let

ConsoleInterface = class ConsoleInterface {





































  /**
                                            * Constructor
                                            */ /**
                                                * The ID of the window that is associated for an instance
                                                * @type {String}
                                                * @private
                                                */ /**
                                                    * The types of events that we're handling.
                                                    * @default
                                                    * @type {Set<String>}
                                                    * @private
                                                    */constructor() {this.initialized = false;this._eventTypes = new Set([__WEBPACK_IMPORTED_MODULE_4__constants_ConsoleEventTypes__["b" /* CONSOLE_EVENT_LOG */], __WEBPACK_IMPORTED_MODULE_4__constants_ConsoleEventTypes__["c" /* CONSOLE_EVENT_NETWORK */], __WEBPACK_IMPORTED_MODULE_4__constants_ConsoleEventTypes__["a" /* CONSOLE_EVENT_EXCEPTION */]]);this._timelineId = null;this._windowId = null;this._sequence = 0; // Initialize the sugar helper methods over write
    this.log = this.write.bind(this, __WEBPACK_IMPORTED_MODULE_3__constants_ConsoleEventSeverity__["CONSOLE_LEVEL_LOG"]);this.info = this.write.bind(this, __WEBPACK_IMPORTED_MODULE_3__constants_ConsoleEventSeverity__["CONSOLE_LEVEL_INFO"]);this.warn = this.write.bind(this, __WEBPACK_IMPORTED_MODULE_3__constants_ConsoleEventSeverity__["CONSOLE_LEVEL_WARN"]);this.error = this.write.bind(this, __WEBPACK_IMPORTED_MODULE_3__constants_ConsoleEventSeverity__["CONSOLE_LEVEL_ERROR"]);} /**
                                                                                                                                                                                                                               * Connect to the timeline and register event types
                                                                                                                                                                                                                               *
                                                                                                                                                                                                                               * @param {String} windowId - The window id for attaching to the console stream
                                                                                                                                                                                                                               * @return {Promise} - A promise that resolves if connected to a timeline successfully
                                                                                                                                                                                                                               */ /**
                                                                                                                                                                                                                                   * A counter maintained to establish strict order of logs
                                                                                                                                                                                                                                   * @type {number}
                                                                                                                                                                                                                                   * @private
                                                                                                                                                                                                                                   */ /**
                                                                                                                                                                                                                                       * The ID of the console stream (timeline) that we're connected to.
                                                                                                                                                                                                                                       * @type {String}
                                                                                                                                                                                                                                       */ /**
                                                                                                                                                                                                                                           * The state of the console interface. It is true if the console is attached to a timeline.
                                                                                                                                                                                                                                           * @default
                                                                                                                                                                                                                                           * @type {Boolean}
                                                                                                                                                                                                                                           */initialize(windowId) {if (this.initialized) {return Promise.reject(new Error('Console has already been initialized'));}if (!windowId || typeof windowId !== 'string') {return Promise.reject(new TypeError('Invalid value for argument `windowId`'));}this._windowId = windowId;this._timelineId = __WEBPACK_IMPORTED_MODULE_0_uuid___default.a.v4();
    this._sequence = 0;

    return Object(__WEBPACK_IMPORTED_MODULE_2__modules_pipelines_app_action__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('createTimeline', 'console', {
      id: this._timelineId,
      window: this._windowId })).

    then(result => {
      if (!result || result.status !== 'OK') {
        return Promise.reject(new Error('Could not create a timeline for the window'));
      }

      this.initialized = true;

      return Promise.resolve();
    });
  }

  /**
     * Check if we're handling the event that was sent
     *
     * @param {String} eventType - the event type to check
     * @return {Boolean} - true if we're handling the event type
     */
  canHandleEvent(eventType) {
    if (typeof eventType !== 'string') {
      return false;
    }

    return this._eventTypes.has(eventType);
  }

  /**
     * Writes a log to console
     *
     * @param {String} severity - One of several severity levels for the console message (defined in constants/ConsoleEventSeverity.js)
     * @param {String} eventType - One of the several available types for a console message. This must be one which was sent while instantiating the console
     * @param {Object} source - TBD
     * @param {Object} log - A detailed description for this log
     * @param {Number} [timestamp] - A timestamp to be used when logging this value
     */
  write(severity, eventType, source, log, timestamp = Date.now()) {
    if (!this.canHandleEvent(eventType)) {
      throw new Error('ConsoleInterface~write: Could not handle event type: ' + eventType);
    }

    if (!severity || typeof severity !== 'string') {
      return new Error('Invalid value for argument `severity`');
    }

    if (!source || typeof source !== 'object') {
      return new Error('Invalid value for argument `source`');
    }

    if (!log) {
      return new Error('Invalid value for argument `log`');
    }

    if (timestamp && (typeof timestamp !== 'number' || timestamp < 0)) {
      return new Error('Invalid value for argument `timestamp`');
    }

    if (!this.initialized) {
      pm.logger.warn('ConsoleInterface~write: Cannot write as interface has not been initialized');

      return;
    }

    return Object(__WEBPACK_IMPORTED_MODULE_2__modules_pipelines_app_action__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('createEvent', 'console', {
      id: __WEBPACK_IMPORTED_MODULE_0_uuid___default.a.v4(),
      timeline: this._timelineId,
      sequence: this._sequence++,
      timestamp: timestamp,
      type: eventType,
      severity: severity,
      source: source,
      details: log }));

  }

  /**
     * Clears console events from the persistence storage for all timelines.
     */
  clear() {
    if (!this.initialized) {
      pm.logger.warn('ConsoleInterface~clear: Cannot clear as interface has not been initialized');

      return;
    }

    // we're calling the dispatchAppAction directly to clear all console events
    // because:
    //   the clear event is supposed to be just like another event in a timeline
    //   to allow exporting timelines with info before the clear event was
    //   fired. Until the export capabilities are not added to the console, it's
    //   useless to keep the events in the storage which impacts performance.
    return Object(__WEBPACK_IMPORTED_MODULE_2__modules_pipelines_app_action__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('deleteEvents', 'console', { timeline: this._timelineId }));
  }

  /**
     * Disconnect from the console stream. Once this method is called, the window
     * will not be able to send any logs to this stream.
     */
  destroy() {
    if (!this.initialized) {
      pm.logger.warn('ConsoleInterface~destroy: Cannot destroy as interface has not been initialized');

      return;
    }

    this.initialized = false;

    return Object(__WEBPACK_IMPORTED_MODULE_2__modules_pipelines_app_action__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_1__modules_model_event__["createEvent"])('deleteTimeline', 'console', { id: this._timelineId }));
  }};

/***/ }),

/***/ 1029:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProxyListManager; });
const WHITELISTED_PROPS = ['disabled', 'httpProxy', 'httpsProxy', 'host', 'port',
'authenticate', 'username', 'password', 'bypass'];

/**
                                                    * Transform older proxy settings to newer version (globalProxies -> globalProxy).
                                                    *
                                                    * @param {Object[]} config
                                                    * @returns {Object}
                                                    */
function transformOlderSettings(config) {
  const defaultConfig = {
    disabled: true,
    httpProxy: true,
    httpsProxy: true,
    port: 8080 };


  if (!(Array.isArray(config) && config.length > 0)) {
    return defaultConfig;
  }

  config = config[0];

  if (!(config && config.host)) {
    return defaultConfig;
  }

  let pattern = String(_.get(config, 'match.pattern', '')),
  httpProxy = pattern.includes('http:') || pattern.includes('http+'),
  httpsProxy = pattern.includes('https');

  return {
    httpProxy: !httpProxy && !httpsProxy ? true : httpProxy, // unlikely but, set at-least HTTP proxy
    httpsProxy: httpsProxy,
    host: config.host,
    port: config.port,
    authenticate: config.authenticate,
    username: config.username,
    password: config.password,
    disabled: config.disabled };

}

/**
   * SDK compatible url mach for which the proxy has been associated with.
   *
   * @param {Boolean} httpProxy
   * @param {Boolean} httpsProxy
   * @returns {String}
   */
function getMatchPattern(httpProxy, httpsProxy) {
  const suffix = '://*:*/*';

  if (httpsProxy) {
    if (httpProxy) {
      return 'http+https' + suffix;
    }

    return 'https' + suffix;
  }

  return 'http' + suffix;
}

/**
   * Get bypass list for the proxy setting.
   *
   * @param {String} bypass
   * @returns {String[]}
   */
function getBypassList(bypass) {
  if (!(bypass && typeof bypass === 'string')) {return;}

  // split by ',' and '\n' and filter empty strings
  bypass = bypass.split(/,|\n/g).map(h => h.trim()).filter(Boolean);

  let host,
  i,
  ii = bypass.length,
  bypassList = new Array(ii);

  for (i = 0; i < ii; i++) {
    host = bypass[i];

    if (host.includes('://')) {// protocol is specified
      host = host.endsWith('/') ?
      host : // already a complete URL
      host + ':*/*'; // match all ports and paths
    } else
    {// just hostname
      host = `http+https://${host}:*/*`;
    }

    bypassList[i] = host;
  }

  return bypassList;
}let

ProxyListManager = class ProxyListManager {
  constructor() {
    this.globalProxy = this.getFromDB();
  }

  getFromDB() {
    let config = pm.settings.getSetting('ProxyListManager');

    !_.isObject(config) && (config = {});

    // migrate to newer global proxy configuration (< v7.9.0)
    // @note this migrate as well as set default config for newer versions
    if (!config.globalProxy) {
      config.globalProxy = transformOlderSettings(config.globalProxies);

      // update local storage to avoid this migration on every load
      this.saveToDB({ globalProxy: config.globalProxy });
    }

    return config.globalProxy;
  }

  saveToDB(config) {
    // bail out if not a valid config object (if present)
    if (config && !config.globalProxy) {
      return;
    }

    pm.settings.setSetting('ProxyListManager', config || { globalProxy: this.globalProxy });
  }

  update(config) {
    // bail out if not a valid config object
    if (!(config && config.globalProxy)) {
      return;
    }

    this.globalProxy = Object.assign(this.globalProxy, _.pick(config.globalProxy, WHITELISTED_PROPS));
  }

  /**
     * @returns {Object[]} - SDK compatible ProxyConfigList object
     */
  getGlobalProxyConfigList() {
    let globalProxy = this.globalProxy;

    return [{
      match: getMatchPattern(globalProxy.httpProxy, globalProxy.httpsProxy),
      host: globalProxy.host,
      port: globalProxy.port,
      authenticate: globalProxy.authenticate,
      username: globalProxy.username,
      password: globalProxy.password,
      disabled: globalProxy.disabled,
      bypass: getBypassList(globalProxy.bypass) }];

  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1030:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_backbone__);

const Certificate = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Model.extend({
  defaults: function () {
    return {
      host: '',
      pemPath: '',
      keyPath: '',
      pfxPath: '',
      passphrase: null,
      _pemData: null,
      _keyData: null };

  },

  resolve: function (cb) {
    if (this.get('_pemData') && this.get('_keyData')) {
      _.isFunction(cb) && cb();
      return;
    }

    const fs = __webpack_require__(30);
    fs.readFile(this.get('pemPath'), (err, _pemData) => {
      fs.readFile(this.get('keyPath'), (err, _keyData) => {
        fs.readFile(this.get('pfxPath'), (err, _pfxData) => {
          this.set({
            '_pemData': _pemData,
            '_keyData': _keyData,
            '_pfxData': _pfxData },
          { silent: true });

          _.isFunction(cb) && cb();
        });
      });
    });
  },

  toJSON: function () {
    return {
      host: this.get('host'),
      pemPath: this.get('pemPath'),
      keyPath: this.get('keyPath'),
      pfxPath: this.get('pfxPath'),
      passphrase: this.get('passphrase') };

  } });



const CertificateManager = __WEBPACK_IMPORTED_MODULE_0_backbone___default.a.Collection.extend({
  model: Certificate,

  initialize: function () {
    this.loadCertificates();
    this.getCertificateContents = this.getCertificateContents.bind(this);
    pm.settings.on('setSetting:clientCertificates', this.loadCertificates, this);
  },

  loadCertificates: function () {
    let serialisedStore = pm.settings.getSetting('clientCertificates'),
    certificateStore = {};

    try {
      certificateStore = JSON.parse(serialisedStore);
      let certificates = _.get(certificateStore, 'certificates', []);
      let sanitizedCertificates = _.map(certificates, certificate => {
        let sanitizedHost = certificate.host.
        replace(/.*?:\/\//g, '') // strip protocol
        .replace(/\?.*/, '') // strip query
        .replace(/\/.*/, '') // strip path
        .replace(/^\./, ''); // strip leading period

        return _.assign({}, certificate, { host: sanitizedHost });
      });
      this.reset(sanitizedCertificates);
    }
    catch (e) {
      pm.logger.error('Error loading certificates', e);
    }
  },

  saveCertificates: function () {
    let certificateStore = { certificates: this.toJSON() };

    try {
      let serialisedStore = JSON.stringify(certificateStore);
      pm.settings.setSetting('clientCertificates', serialisedStore);
    }
    catch (e) {
      pm.logger.error('Error saving certificates', e);
    }
  },

  findCertificateByDomain: function (host) {
    return _.find(this.models, certificateModel => {
      return host === certificateModel.get('host');
    });
  },

  getCertificateContents: function (host, cb) {
    if (!host) {
      cb(new Error('Only supported in Electron'));
    }

    let certificate = this.findCertificateByDomain(host);

    if (!certificate) {
      cb(new Error('No Certificate found for host:' + host));
      return;
    }

    certificate.resolve(err => {
      if (err) {
        _.isFunction(cb) && cb(err);
        return;
      }

      _.isFunction(cb) && cb(null, {
        host: host,
        pem: certificate.get('_pemData'),
        key: certificate.get('_keyData'),
        pfx: certificate.get('_pfxData'),
        passphrase: certificate.get('passphrase'),
        pemPath: certificate.get('pemPath'),
        keyPath: certificate.get('keyPath'),
        pfxPath: certificate.get('pfxPath') });

    });
  },

  addCertificate(host, pemPath, keyPath, pfxPath, passphrase) {
    if (!host) {
      pm.logger.error('Error adding certificate', arguments);
      return;
    }

    let certificate = this.findCertificateByDomain(host);

    if (certificate) {
      this.updateCertificate(host, pemPath, keyPath, pfxPath, passphrase);
    } else
    {
      this.add({
        host: host,
        pemPath: pemPath,
        keyPath: keyPath,
        pfxPath: pfxPath,
        passphrase: passphrase });

    }

    this.saveCertificates();
    return true;
  },

  updateCertificate(host, pemPath, keyPath, pfxPath, passphrase) {
    let certificate = this.findCertificateByDomain(host);

    if (!certificate) {
      return false;
    }

    certificate.set({
      pemPath: pemPath,
      keyPath: keyPath,
      pfxPath: pfxPath,
      passphrase: passphrase });


    certificate.resolve();
    this.saveCertificates();

    return true;
  },

  removeCertificate(host) {
    let certificate = this.findCertificateByDomain(host);

    if (!certificate) {
      return false;
    }

    this.remove(certificate);

    this.saveCertificates();

    return true;
  } });


/* harmony default export */ __webpack_exports__["a"] = (CertificateManager);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 1031:
/***/ (function(module, exports) {

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(){
  "use strict";

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Use a lookup table to find the index.
  var lookup = new Uint8Array(256);
  for (var i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = lookup[base64.charCodeAt(i)];
      encoded2 = lookup[base64.charCodeAt(i+1)];
      encoded3 = lookup[base64.charCodeAt(i+2)];
      encoded4 = lookup[base64.charCodeAt(i+3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})();


/***/ }),

/***/ 1032:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (immutable) */ __webpack_exports__["a"] = initializeRollbackNotifications;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_async__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_EnvironmentController__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_controllers_HeaderPresetController__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_controllers_WorkspaceController__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_controllers_GlobalsController__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_controllers_HistoryController__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_controllers_HistoryResponseController__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_controllers_CollectionRunController__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__modules_services_AnalyticsService__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__modules_sync_helpers_sync_api__ = __webpack_require__(898);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__ = __webpack_require__(209);













let pendingNotifyChanges = [];

const controllerMap = {
  workspace: __WEBPACK_IMPORTED_MODULE_4__modules_controllers_WorkspaceController__["a" /* default */].get.bind(__WEBPACK_IMPORTED_MODULE_4__modules_controllers_WorkspaceController__["a" /* default */]),
  globals: __WEBPACK_IMPORTED_MODULE_5__modules_controllers_GlobalsController__["a" /* default */].get.bind(__WEBPACK_IMPORTED_MODULE_5__modules_controllers_GlobalsController__["a" /* default */]),
  environment: __WEBPACK_IMPORTED_MODULE_2__modules_controllers_EnvironmentController__["a" /* default */].get.bind(__WEBPACK_IMPORTED_MODULE_2__modules_controllers_EnvironmentController__["a" /* default */]),
  headerpreset: __WEBPACK_IMPORTED_MODULE_3__modules_controllers_HeaderPresetController__["a" /* default */].get.bind(__WEBPACK_IMPORTED_MODULE_3__modules_controllers_HeaderPresetController__["a" /* default */]),
  collection: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getCollection.bind(__WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */]),
  folder: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getFolder.bind(__WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */]),
  request: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getRequest.bind(__WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */]),
  response: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getResponse.bind(__WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */]),
  history: __WEBPACK_IMPORTED_MODULE_6__modules_controllers_HistoryController__["a" /* default */].get.bind(__WEBPACK_IMPORTED_MODULE_6__modules_controllers_HistoryController__["a" /* default */]),
  historyresponse: __WEBPACK_IMPORTED_MODULE_7__modules_controllers_HistoryResponseController__["a" /* default */].get.bind(__WEBPACK_IMPORTED_MODULE_7__modules_controllers_HistoryResponseController__["a" /* default */]),
  collectionrun: __WEBPACK_IMPORTED_MODULE_8__modules_controllers_CollectionRunController__["a" /* default */].get.bind(__WEBPACK_IMPORTED_MODULE_8__modules_controllers_CollectionRunController__["a" /* default */]) },

SUPPORTED_MODELS = _.keys(controllerMap),
SUPPORTED_ACTIONS = ['create', 'import', 'update', 'transfer', 'destroy'],
COLLECTION_CHILDREN_MODELS = ['folder', 'request', 'response'],
WS_DEPS_MODELS = new Set(['collection', 'environment', 'headerpreset']),
COLLECTION_OR_ENVIRONMENT = new Set(['collection', 'environment']),

TOAST_DEBOUNCE_TIME = 1000, // 1 sec
TOAST_MAX_DEBOUNCE = 60 * 1000, // 1 min
debouncedShowNotification = _.debounce(_showNotification, TOAST_DEBOUNCE_TIME, { 'maxWait': TOAST_MAX_DEBOUNCE }),
TOAST_TITLE_SUFFIX = 'changes could not be saved',
TOAST_MESSAGE = 'You don\'t seem to have the required permissions to perform these actions';

/**
                                                                                              * Rolls back the action performed by the changeset
                                                                                              * @param {Object} changeset
                                                                                              * @param {Function} callback
                                                                                              */
function rollbackWorker(changeset, callback = _.noop) {
  pm.logger.info(`DbRollbackService~rollbackWorker: rollingback ${changeset.model}:${changeset.action}`);

  let { model, action } = changeset;

  if (!_.includes(SUPPORTED_MODELS, model) || !_.includes(SUPPORTED_ACTIONS, action)) {
    pm.logger.warn('DbRollbackService~rollbackWorker: entity model/action not supported', { model, action });
    return callback();
  }

  __WEBPACK_IMPORTED_MODULE_9__modules_services_AnalyticsService__["a" /* default */].addEvent(model, 'rollback', action);

  Promise.resolve()

  // get the remote entity
  .then(() => {
    // For the actions where an entity was created, it won't exist on remote
    if (!_.includes(['import', 'create'], action)) {
      return _getEntityFromRemote(changeset);
    }
  })

  // perform the rollback
  .then(remoteEntitySyncMessage => {
    return _rollback(changeset, remoteEntitySyncMessage);
  })

  // log and call the callback
  .then(() => {
    pm.logger.info(`DbRollbackService~rollbackWorker: completed rollback for ${changeset.model}:${changeset.action}`);
    callback();
  })

  // on errors just log it and call the callback without error
  .catch(err => {
    pm.logger.error('DbRollbackService~rollbackWorker: error while processsing rollback', err);

    // Do not bubble the error up
    callback();
  });
}

/**
   * For a given changeset, returns the remote entity
   * For update/destroy operations: remote entity will be the same
   *     transfer operations: remote entity will be a common ancestor of the source and destination
   *     create operations: should not be called since it will not exist on remote (if called anyway, will return undefined)
   * @param {Object} changeset
   * @returns {Promise<Object>} Resolved value is the remote entity
   */
async function _getEntityFromRemote(changeset) {
  let { action } = changeset,
  data = changeset.data || {},
  entityModel,

  // Get the populated entity for actions: destroy and transfer
  populate = _.includes(['destroy', 'transfer'], action),
  query = {}, // will be using to pass `populate` & `owner` query params
  criteria = {};

  // For create operation, there cannot be an entity on remote
  if (action === 'create') {
    return;
  }

  populate && (query.populate = true);

  if (action === 'transfer') {
    let parent = await _getCommonAncestor(data.from, data.to);

    if (!parent) {
      return;
    }

    // for transfer changeset, the entity to fetch is the parent entity
    entityModel = parent.type;

    if (entityModel === 'collection') {
      let collection = await __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getCollection({ id: parent.id });

      if (!collection) {
        return;
      }

      criteria.id = _getEntityUid(collection);
    } else

    if (entityModel === 'folder') {
      let folder = await __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getFolder({ id: parent.id }),
      collection = folder && (await __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getCollection({ id: folder.collection }));

      if (!collection) {
        return;
      }

      criteria.id = parent.id;
      query.owner = collection.owner;
    }
  } else

  {
    entityModel = changeset.model;
    criteria = _getCriteriaFromChangeset(changeset);

    if (!criteria) {
      return;
    }

    // for collection and environment, the id should be uid
    if (entityModel === 'environment' || entityModel === 'collection') {
      let entityUid = data.owner && data.modelId && _getEntityUid(data);

      if (!entityUid) {
        let entity = await controllerMap[entityModel]({ id: criteria.id });
        entityUid = entity && _getEntityUid(entity);
      }

      if (!entityUid) {
        return;
      }

      criteria.id = entityUid;
    }

    // for request/folder/response either id should be UID or query should have owner as the parent collection ID
    // we are going with "adding the owner in query" approach
    else if (_.includes(COLLECTION_CHILDREN_MODELS, entityModel)) {
        let collectionId,
        collection;

        // when entity is deleted, first get the parent (can be request, folder or collection)
        if (action === 'destroy') {
          let parent = data.parent || {};

          if (parent.model === 'collection') {
            collectionId = parent.modelId;
          } else {// folder or request
            let requestOrFolder = await controllerMap[parent.model]({ id: parent.modelId });
            collectionId = requestOrFolder && requestOrFolder.collection;
          }
        }

        // otherwise get the entity first (request, response or folder) and get the collectionId from it
        else {
            let entity = await controllerMap[entityModel]({ id: criteria.id });
            collectionId = entity && entity.collection;
          }

        if (!collectionId) {
          return;
        }

        collection = await __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getCollection({ id: collectionId });

        if (!collection) {
          return;
        }

        query.owner = collection.owner;
      }
  }

  return new Promise(resolve => {
    __WEBPACK_IMPORTED_MODULE_10__modules_sync_helpers_sync_api__["b" /* findOne */](entityModel, criteria, query, (err, entitySyncMessageData, entitySyncMessage) => {
      err ? resolve() : resolve(entitySyncMessage);
    });
  });
}

/**
   * Returns the common ancestor for given two entities
   * @param {Object} entity1 has model and modelId
   * @param {Object} entity2 has model and modelId
   * @returns {Promise<Object>} resolved value has type and id
   */
async function _getCommonAncestor(entity1, entity2) {
  // if one of the two entities is collection, then that is the common ancestor
  if (entity1.model === 'collection') {
    return {
      type: 'collection',
      id: entity1.modelId };

  }

  if (entity2.model === 'collection') {
    return {
      type: 'collection',
      id: entity2.modelId };

  }

  // Both the entities are folder: a request/folder was moved from a folder to another folder
  // @TODO-rbac: for now we return the parent collection, but can be optimized to return the least common ancestor
  let folder = await __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getFolder({ id: entity1.modelId });

  return folder && {
    type: 'collection',
    id: folder.collection };

}

/**
   * Returns the criteria with which an entity can be queried from remote server (sync)
   * @param {Object} changeset
   * @returns {Object} criteria
   */
function _getCriteriaFromChangeset(changeset) {
  switch (changeset.action) {
    case 'import':
    case 'create':
      return; // for these actions no entity exists on remote

    case 'destroy':
      return {
        id: _.get(changeset, 'data.modelId') // @TODO-rbac fix this for history destroy where there are multiple items
      };

    case 'update':{
        // globals are fetched using the workspaceId
        if (changeset.model === 'globals') {
          return {
            workspace: _.get(changeset, 'data.instance.workspace') };

        }

        return {
          id: _.get(changeset, 'data.modelId') };

      }}


  pm.logger.warn('action not supported for getting entity id from changeset', changeset.action);
}

/**
   * Returns the UID for an environment or a collection
   * @param {Object} entity
   */
function _getEntityUid(entity = {}) {
  return `${entity.owner}-${entity.id || entity.modelId}`;
}

/**
   * Rollback the action performed by the changeset using the remote entity
   * @param {Object} changeset
   * @param {Object} remoteEntitySyncMessage
   */
async function _rollback(changeset, remoteEntitySyncMessage) {
  let { model, action } = changeset,
  data = changeset.data || {};

  // If the entity does not exist on remote for the actions that needs it for reverting, bail out
  // All actions expect where an entity was created needs the remote entity to revert
  if (!_.includes(['create', 'import'], action) && !remoteEntitySyncMessage) {
    pm.logger.warn(`DbRollbackService~_rollback: could not rollback ${model}:${action} since entity does not exist on remote`);
    return;
  }

  switch (action) {

    // if creating an entity failed, just delete it locally
    case 'create':
    case 'import':{
        let entityDestroyChangeset = Object.assign({}, changeset, { action: _getActionForDestroy(model) });

        pm.logger.info('DbRollbackService~_rollback: rolling back an import by deleting the entity');

        await Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["c" /* processIncomingChangeset */])(entityDestroyChangeset);
        _queueNotification(model, data.instance, action);
        break;
      }

    // if updating an entity failed, update the skeleton locally
    case 'update':{
        _.set(remoteEntitySyncMessage, ['meta', 'action'], 'update');
        let remoteEntityChangeset = Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["a" /* buildChangesetFromMessage */])(remoteEntitySyncMessage);

        pm.logger.info('DbRollbackService~_rollback: rolling back an update by updating the entity');

        await Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["c" /* processIncomingChangeset */])(remoteEntityChangeset);
        _queueNotification(model, _.assign({ id: data.modelId }, data.instance), action);
        break;
      }

    // if deleting an entity failed, import it back
    case 'destroy':
    case 'delete':{
        let metaAction = _getActionForImport(model),
        remoteEntityChangeset;

        _.set(remoteEntitySyncMessage, ['meta', 'action'], metaAction);
        remoteEntityChangeset = Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["a" /* buildChangesetFromMessage */])(remoteEntitySyncMessage);

        pm.logger.info('DbRollbackService~_rollback: rolling back an destroy by #1 importing the entity');

        // import the entity
        await Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["c" /* processIncomingChangeset */])(remoteEntityChangeset);

        // update the workspace dependencies: it was removed from all workspaces during the action we are rolling back
        if (WS_DEPS_MODELS.has(remoteEntitySyncMessage.meta.model)) {
          let uId = _getEntityUid(remoteEntitySyncMessage.data),
          model = _.get(remoteEntitySyncMessage, 'meta.model');

          pm.logger.info('DbRollbackService~_rollback: rolling back an destroy by #2 updating the ws dependencies', model, uId);
          await _rollbackWorkspaceDependency(model, uId);
        }

        _queueNotification(model, { id: data.modelId }, action);
        break;
      }

    // for transfer changeset, we need to drop and import the common ancestor
    case 'transfer':{
        let entityDestroySyncMessage = {
          model: remoteEntitySyncMessage.meta.model,
          model_id: remoteEntitySyncMessage.model_id,
          action: _getActionForDestroy(model) },

        entityDestroyChangeset = Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["a" /* buildChangesetFromMessage */])(entityDestroySyncMessage),
        entityImportChangeset;


        // delete the common ancestor
        pm.logger.info('DbRollbackService~_rollback: rolling back a transfer by #1 deleting the common ancestor', entityDestroySyncMessage);
        await Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["c" /* processIncomingChangeset */])(entityDestroyChangeset);

        // import the common ancestor back
        pm.logger.info('DbRollbackService~_rollback: rolling back a transfer by #2 importing the common ancestor');
        _.set(remoteEntitySyncMessage, ['meta', 'action'], _getActionForImport(model));
        entityImportChangeset = Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["a" /* buildChangesetFromMessage */])(remoteEntitySyncMessage);
        await Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["c" /* processIncomingChangeset */])(entityImportChangeset);

        // update the workspace dependencies: during the delete operation as part of rollback, this was removed from all workspaces
        if (WS_DEPS_MODELS.has(remoteEntitySyncMessage.meta.model)) {
          let uId = _getEntityUid(remoteEntitySyncMessage.data),
          model = _.get(remoteEntitySyncMessage, 'meta.model');

          pm.logger.info('DbRollbackService~_rollback: rolling back a transfer by #3 updating the ws dependencies', model, uId);

          await _rollbackWorkspaceDependency(model, uId);
        }

        _queueNotification(model, { id: data.modelId }, action);
        break;
      }}

}

/**
   * Returns the action to be used to create sync changeset for deleting an entity
   * @param {String} model
   */
function _getActionForDestroy(model) {
  return COLLECTION_OR_ENVIRONMENT.has(model) ? 'unsubscribe' : 'destroy';
}

/**
   * Returns the action to be used to create sync changeset for importing an entity
   * @param {String} model
   */
function _getActionForImport(model) {
  return COLLECTION_OR_ENVIRONMENT.has(model) ? 'subscribe' : 'import';
}

/**
   * Will update all the workspaces' dependencies for a given collection/environment
   * @param {String} type collection or environment
   * @param {String} uId
   */
async function _rollbackWorkspaceDependency(type, uId) {
  let remoteWorkspaceMessages = await new Promise(resolve => {
    __WEBPACK_IMPORTED_MODULE_10__modules_sync_helpers_sync_api__["a" /* find */]('workspace', { dependencies: true }, (err, data) => {
      err ? resolve([]) : resolve(data);
    });
  }),
  localWorkspacesById = _.keyBy((await __WEBPACK_IMPORTED_MODULE_4__modules_controllers_WorkspaceController__["a" /* default */].getAll()), 'id'),
  wsUpdateChangesets = [];

  // Generate the sync messages
  _.each(remoteWorkspaceMessages, remoteWorkspaceMessage => {
    let wsId = remoteWorkspaceMessage.data.id,
    localWorkspace = localWorkspacesById[wsId],
    remoteWsDeps = _.get(remoteWorkspaceMessage, ['data', 'dependencies', type + 's']),
    localWsDeps = _.get(localWorkspace, ['dependencies', type + 's']),
    wsUpdateChangeset;

    // if the dependency exists on remote but not on local, update the workspace
    if (_.includes(remoteWsDeps, uId) && !_.includes(localWsDeps, uId)) {
      _.set(remoteWorkspaceMessage, ['meta', 'action'], 'update');
      wsUpdateChangeset = Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["a" /* buildChangesetFromMessage */])(remoteWorkspaceMessage);
      wsUpdateChangesets.push(wsUpdateChangeset);
    }
  });

  console.log('DbRollbackService~_rollbackWorkspaceDependency: ws dependencies update changesets', wsUpdateChangesets);

  // Apply the sync messages in parallel
  return Promise.all(_.map(wsUpdateChangesets, wsUpdateChangeset => {
    return Object(__WEBPACK_IMPORTED_MODULE_11__models_sync_services_SyncIncomingHandler__["c" /* processIncomingChangeset */])(wsUpdateChangeset);
  })).
  catch(err => {
    pm.logger.error('DbRollbackService~_rollbackWorkspaceDependency: error while updating workspace dependencies during rollback', err);
  });
}

function _getRollbackNotificationChannel() {
  return pm.eventBus.channel('rollback-notifications');
}

/**
   * Queues a rollback notification
   * Notifications are collated together based on time and then flushed
   * @param {String} model
   * @param {Object} entity
   * @param {String} action
   */
function _queueNotification(model, entity, action) {
  let rollbackChannel = _getRollbackNotificationChannel();

  rollbackChannel.publish({ model, entity, action });
}

/**
   * Subscribes to a channel to get the rollback notifications
   * It will collate then collate those notifications and flush them later
   */
function initializeRollbackNotifications() {
  let rollbackChannel = _getRollbackNotificationChannel();

  rollbackChannel.subscribe((message = {}) => {
    let { model, entity, action } = message;

    if (!model || !action) {
      return;
    }

    pendingNotifyChanges.push({ model, entity, action });
    debouncedShowNotification();
  });
}

/**
   * Shows the notification for all the collated actions
   */
function _showNotification() {
  if (_.isEmpty(pendingNotifyChanges)) {
    return;
  }

  pm.toasts.error(TOAST_MESSAGE, {
    persist: false,
    title: `${pendingNotifyChanges.length} ${TOAST_TITLE_SUFFIX}`

    // @TODO-rbac: Implement this
    // primaryAction: {
    //  label: 'See details',
    //  onClick: _handleNotificationClickDetails.bind(null, pendingNotifyChanges)
    // }
  });

  __WEBPACK_IMPORTED_MODULE_9__modules_services_AnalyticsService__["a" /* default */].addEvent('rollback', 'view_toast', _.toString(_.size(pendingNotifyChanges)));

  pendingNotifyChanges = [];
}

const rollbackQueue = __WEBPACK_IMPORTED_MODULE_0_async___default.a.queue(rollbackWorker, 1);
/* harmony export (immutable) */ __webpack_exports__["b"] = rollbackQueue;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 1694:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = __webpack_require__(1);
var PropTypes = __webpack_require__(3);

var ALL_INITIALIZERS = [];
var READY_INITIALIZERS = [];

function isWebpackReady(getModuleIds) {
  if (( false ? 'undefined' : _typeof(__webpack_require__.m)) !== 'object') {
    return false;
  }

  return getModuleIds().every(function (moduleId) {
    return typeof moduleId !== 'undefined' && typeof __webpack_require__.m[moduleId] !== 'undefined';
  });
}

function load(loader) {
  var promise = loader();

  var state = {
    loading: true,
    loaded: null,
    error: null
  };

  state.promise = promise.then(function (loaded) {
    state.loading = false;
    state.loaded = loaded;
    return loaded;
  }).catch(function (err) {
    state.loading = false;
    state.error = err;
    throw err;
  });

  return state;
}

function loadMap(obj) {
  var state = {
    loading: false,
    loaded: {},
    error: null
  };

  var promises = [];

  try {
    Object.keys(obj).forEach(function (key) {
      var result = load(obj[key]);

      if (!result.loading) {
        state.loaded[key] = result.loaded;
        state.error = result.error;
      } else {
        state.loading = true;
      }

      promises.push(result.promise);

      result.promise.then(function (res) {
        state.loaded[key] = res;
      }).catch(function (err) {
        state.error = err;
      });
    });
  } catch (err) {
    state.error = err;
  }

  state.promise = Promise.all(promises).then(function (res) {
    state.loading = false;
    return res;
  }).catch(function (err) {
    state.loading = false;
    throw err;
  });

  return state;
}

function resolve(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

function render(loaded, props) {
  return React.createElement(resolve(loaded), props);
}

function createLoadableComponent(loadFn, options) {
  var _class, _temp;

  if (!options.loading) {
    throw new Error('react-loadable requires a `loading` component');
  }

  var opts = Object.assign({
    loader: null,
    loading: null,
    delay: 200,
    timeout: null,
    render: render,
    webpack: null,
    modules: null
  }, options);

  var res = null;

  function init() {
    if (!res) {
      res = loadFn(opts.loader);
    }
    return res.promise;
  }

  ALL_INITIALIZERS.push(init);

  if (typeof opts.webpack === 'function') {
    READY_INITIALIZERS.push(function () {
      if (isWebpackReady(opts.webpack)) {
        return init();
      }
    });
  }

  return _temp = _class = function (_React$Component) {
    _inherits(LoadableComponent, _React$Component);

    function LoadableComponent(props) {
      _classCallCheck(this, LoadableComponent);

      var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

      init();

      _this.state = {
        error: res.error,
        pastDelay: false,
        timedOut: false,
        loading: res.loading,
        loaded: res.loaded
      };
      return _this;
    }

    LoadableComponent.preload = function preload() {
      return init();
    };

    LoadableComponent.prototype.componentWillMount = function componentWillMount() {
      var _this2 = this;

      this._mounted = true;

      if (this.context.loadable && Array.isArray(opts.modules)) {
        opts.modules.forEach(function (moduleName) {
          _this2.context.loadable.report(moduleName);
        });
      }

      if (!res.loading) {
        return;
      }

      if (typeof opts.delay === 'number') {
        if (opts.delay === 0) {
          this.setState({ pastDelay: true });
        } else {
          this._delay = setTimeout(function () {
            _this2.setState({ pastDelay: true });
          }, opts.delay);
        }
      }

      if (typeof opts.timeout === 'number') {
        this._timeout = setTimeout(function () {
          _this2.setState({ timedOut: true });
        }, opts.timeout);
      }

      var update = function update() {
        if (!_this2._mounted) {
          return;
        }

        _this2.setState({
          error: res.error,
          loaded: res.loaded,
          loading: res.loading
        });

        _this2._clearTimeouts();
      };

      res.promise.then(function () {
        update();
      }).catch(function (err) {
        update();
        throw err;
      });
    };

    LoadableComponent.prototype.componentWillUnmount = function componentWillUnmount() {
      this._mounted = false;
      this._clearTimeouts();
    };

    LoadableComponent.prototype._clearTimeouts = function _clearTimeouts() {
      clearTimeout(this._delay);
      clearTimeout(this._timeout);
    };

    LoadableComponent.prototype.render = function render() {
      if (this.state.loading || this.state.error) {
        return React.createElement(opts.loading, {
          isLoading: this.state.loading,
          pastDelay: this.state.pastDelay,
          timedOut: this.state.timedOut,
          error: this.state.error
        });
      } else if (this.state.loaded) {
        return opts.render(this.state.loaded, this.props);
      } else {
        return null;
      }
    };

    return LoadableComponent;
  }(React.Component), _class.contextTypes = {
    loadable: PropTypes.shape({
      report: PropTypes.func.isRequired
    })
  }, _temp;
}

function Loadable(opts) {
  return createLoadableComponent(load, opts);
}

function LoadableMap(opts) {
  if (typeof opts.render !== 'function') {
    throw new Error('LoadableMap requires a `render(loaded, props)` function');
  }

  return createLoadableComponent(loadMap, opts);
}

Loadable.Map = LoadableMap;

var Capture = function (_React$Component2) {
  _inherits(Capture, _React$Component2);

  function Capture() {
    _classCallCheck(this, Capture);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  Capture.prototype.getChildContext = function getChildContext() {
    return {
      loadable: {
        report: this.props.report
      }
    };
  };

  Capture.prototype.render = function render() {
    return React.Children.only(this.props.children);
  };

  return Capture;
}(React.Component);

Capture.propTypes = {
  report: PropTypes.func.isRequired
};
Capture.childContextTypes = {
  loadable: PropTypes.shape({
    report: PropTypes.func.isRequired
  }).isRequired
};


Loadable.Capture = Capture;

function flushInitializers(initializers) {
  var promises = [];

  while (initializers.length) {
    var init = initializers.pop();
    promises.push(init());
  }

  return Promise.all(promises).then(function () {
    if (initializers.length) {
      return flushInitializers(initializers);
    }
  });
}

Loadable.preloadAll = function () {
  return new Promise(function (resolve, reject) {
    flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
  });
};

Loadable.preloadReady = function () {
  return new Promise(function (resolve, reject) {
    // We always will resolve, errors should be handled within loading UIs.
    flushInitializers(READY_INITIALIZERS).then(resolve, resolve);
  });
};

module.exports = Loadable;

/***/ }),

/***/ 1774:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let InterceptorInstaller = class InterceptorInstaller {

  constructor() {

    // checking intermediate states for interceptor bridge installation
    pm.appWindow.trigger('registerInternalEvent', 'interceptorBridgeInstallationStatusUpdate', function (data) {
      pm.mediator.trigger('onMessageExternal', data);
      if (data.status === 'downloadStarted') {
        console.log('Downloading Interceptor Bridge...');
      } else
      if (data.status === 'downloadFinished') {
        console.log('Downloaded Interceptor Bridge');
      } else
      if (data.status === 'installationStarted') {
        console.log('Installing Interceptor Bridge');
      } else
      if (data.status === 'manifestAdded') {
        console.log('Added manifest');
      } else
      if (data.status === 'registryKeyAdded') {
        console.log('Added registry key');
      } else
      if (data.status === 'installationFinished') {
        pm.settings.setSetting('interceptor.interceptorBridgeInstalled', true);
        console.log('InterceptorBridge is installed successfully');
      } else
      if (data.status === 'error') {
        pm.settings.setSetting('interceptor.interceptorBridgeInstalled', false);
        console.log('Error occured while installing Interceptor Bridge: ', data.errorMessage);
      }
    }, this);

    // checking intermediate states for node installation
    pm.appWindow.trigger('registerInternalEvent', 'nodeInstallationStatusUpdate', function (data) {
      if (data.status === 'downloadStarted') {
        console.log('Downloading Node...');
      } else
      if (data.status === 'downloadFinished') {
        console.log('Node is downloaded successfully');
      } else
      if (data.status === 'installationFinished') {
        console.log('Node is installed successfully');
      } else
      if (data.status === 'installationNotFinished') {
        console.log('Node installation is not finished');
      } else
      if (data.status === 'error') {
        console.log(data.errorMessage);
      }
    }, this);

    pm.appWindow.trigger('registerInternalEvent', 'interceptorBridgeResetStatusUpdate', function (data) {
      if (data.status === 'success') {
        console.log('Interceptor Bridge installation is reset successfully');
      } else
      if (data.status === 'error') {
        console.log(data.errorMessage);
      }
    }, this);

  }

  /**
     * sets up the Native App ~ Interceptor integration
     * i.e. puts the native server in Applications/ folder
     * puts the manifest at chrome-specific location
     *
     */
  installInterceptorBridge() {
    pm.appWindow.sendToElectron({
      event: 'installInterceptorBridge' });

    return 'InterceptorBridge installation initiated';
  }

  /**
     * checks for the presence of manifest and Interceptor Bridge executable
     * checks for the presence of registry key in case of windows
     * checks for the presence of node in case of macOS
     */
  checkInstallationStatus() {
    pm.appWindow.sendToElectron({
      event: 'checkInstallationStatus' });

    return 'Check Installation initiated';
  }

  /**
     * it downloads node installer in case of macOS if it doesn't exist
     */
  installNode() {
    pm.appWindow.sendToElectron({
      event: 'installNode' });

    return 'Node installation initiated';
  }

  /**
     *
     * resets interceptor bridge installation by initiating
     *
     * 1. removal of `InterceptorBridge` directory
     * 2. removal of manifest present at os-specific location
     * 3. removal of registry key (only in case of windows)
     *
     */
  reset() {
    pm.appWindow.sendToElectron({
      event: 'resetInterceptorBridgeInstallation' });

    return 'Resetting Interceptor Bridge installation';
  }};



/* harmony default export */ __webpack_exports__["a"] = (InterceptorInstaller);

/***/ }),

/***/ 1775:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1776);


/***/ }),

/***/ 1776:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__init__ = __webpack_require__(1784);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__styles_requester_scss__ = __webpack_require__(3694);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__styles_requester_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__styles_requester_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_loadable__ = __webpack_require__(1694);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_loadable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_loadable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_TelemetryHelpers__ = __webpack_require__(734);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_empty_states_CrashHandler__ = __webpack_require__(252);









const Requester = __WEBPACK_IMPORTED_MODULE_4_react_loadable___default()({
  loader: () => __webpack_require__.e/* import() */(24).then(__webpack_require__.bind(null, 3959)),
  loading: () => __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', null) });


if (false) {
  window.React = React;
} else {
  window.onbeforeunload = () => {
    return false;
  };
}

const rootEl = document.getElementsByClassName('app-root')[0];

__WEBPACK_IMPORTED_MODULE_2__init__["a" /* default */].init(err => {
  if (err) {
    Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["render"])(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__components_empty_states_CrashHandler__["a" /* default */], { showError: true }), rootEl);
    return;
  }
  Object(__WEBPACK_IMPORTED_MODULE_1_react_dom__["render"])(
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__components_empty_states_CrashHandler__["a" /* default */], null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Requester, null)),

  rootEl,
  () => {
    let loadTime = Object(__WEBPACK_IMPORTED_MODULE_5__utils_TelemetryHelpers__["a" /* getWindowLoadTime */])();
    __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app_performance_metric', 'requester_window_loaded', null, null, { load_time: loadTime });
  });

});

/***/ }),

/***/ 1784:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_async_series__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__boot_bootConfig__ = __webpack_require__(629);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__boot_bootConfig___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__boot_bootConfig__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__boot_bootLogger__ = __webpack_require__(630);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__boot_bootMessaging__ = __webpack_require__(631);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__boot_bootWLModels__ = __webpack_require__(632);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__boot_bootDBWatcher__ = __webpack_require__(2128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__boot_bootAppModels__ = __webpack_require__(651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__boot_bootSettings__ = __webpack_require__(728);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__boot_bootTelemetry__ = __webpack_require__(729);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__boot_bootCrashReporter__ = __webpack_require__(730);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__boot_bootIndependentServices__ = __webpack_require__(3656);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__boot_bootSession__ = __webpack_require__(1021);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__boot_bootRequester__ = __webpack_require__(3667);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__boot_booted__ = __webpack_require__(733);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__boot_bootThemeManager__ = __webpack_require__(1033);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__boot_bootConfigurations__ = __webpack_require__(594);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__boot_bootRuntimeListeners__ = __webpack_require__(3688);



















const windowConfig = {
  process: 'requester',
  ui: true };


window.pm = {};

pm.init = done => {
  __WEBPACK_IMPORTED_MODULE_0_async_series___default()([
  __WEBPACK_IMPORTED_MODULE_1__boot_bootConfig___default.a.init(windowConfig),
  __WEBPACK_IMPORTED_MODULE_2__boot_bootLogger__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_3__boot_bootMessaging__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_9__boot_bootCrashReporter__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_8__boot_bootTelemetry__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_15__boot_bootConfigurations__["a" /* initializeConfigurations */],
  __WEBPACK_IMPORTED_MODULE_7__boot_bootSettings__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_4__boot_bootWLModels__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_11__boot_bootSession__["a" /* bootSession */],
  __WEBPACK_IMPORTED_MODULE_10__boot_bootIndependentServices__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_6__boot_bootAppModels__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_16__boot_bootRuntimeListeners__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_5__boot_bootDBWatcher__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_14__boot_bootThemeManager__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_12__boot_bootRequester__["a" /* default */]],
  err => {
    Object(__WEBPACK_IMPORTED_MODULE_13__boot_booted__["a" /* default */])(err);
    if (err) {
      pm.logger.error('Error in requester boot sequence', err);
    }
    done && done(err);
  });
};

/* harmony default export */ __webpack_exports__["a"] = (pm);

/***/ }),

/***/ 203:
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),

/***/ 2128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_services_DBResourceWatcher__ = __webpack_require__(1201);


/**
                                                                           *
                                                                           */
function bootWLModels(cb) {
  __WEBPACK_IMPORTED_MODULE_0__modules_services_DBResourceWatcher__["a" /* default */].subscribeToEventBus();
  pm.logger.info('DBWatcher~boot - Success');
  cb();
}

/* harmony default export */ __webpack_exports__["a"] = (bootWLModels);

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseConfigurationService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_events__);
let

BaseConfigurationService = class BaseConfigurationService extends __WEBPACK_IMPORTED_MODULE_0_events___default.a {
  _getLayerNamespaces() {
    return _.map(this.layers, layer => layer.namespace);
  }

  _getResolved(key) {
    if (this.resolvedConfiguration[key] === undefined) {
      return Promise.reject(new Error('ConfigurationService: Could not get config. Key does not exist'));
    }
    return Promise.resolve(this.resolvedConfiguration[key]);
  }

  // Single level access support
  get(key) {
    // cache hit
    if (this.resolvedConfiguration) {
      return this._getResolved(key);
    }

    // cache miss
    return this.
    resolveConfigurationLayers().
    then(resolvedConfiguration => {
      this.resolvedConfiguration = resolvedConfiguration;
      return this._getResolved(key);
    });
  }

  // @todo Lazy loading implementation
  //
  // NOTE: PREVENT MISUSE OF THIS METHOD.
  // USE THE GET METHOD TO GET SPECIFIED KEYS.
  _getAll() {
    // cache hit
    if (this.resolvedConfiguration) {
      return Promise.resolve(this.resolvedConfiguration);
    }

    // cache miss
    return this.
    resolveConfigurationLayers().
    then(resolvedConfiguration => {
      this.resolvedConfiguration = resolvedConfiguration;
      return this.resolvedConfiguration;
    });
  }

  /**
     * Resolves single level JSON
     */
  resolveConfigurationLayers() {
    return Promise.all(_.map(this.resolutionOrder, i => this.layers[i].controller.getAll())).
    then(configurations => {
      let resolvedConfiguration = {};
      _.forEach(configurations, configuration => {
        Object.assign(resolvedConfiguration, configuration);
      });
      return resolvedConfiguration;
    });
  }

  invalidateCache() {
    this.resolvedConfiguration = null;
    this.emit('changed');
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 3656:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_async_series__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controllers_Shortcuts__ = __webpack_require__(1618);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_ToastManager__ = __webpack_require__(1019);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_helpers_OAuth2Tokens__ = __webpack_require__(3658);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_cookies_CookieManager__ = __webpack_require__(3659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_helpers_OAuth2Manager__ = __webpack_require__(3660);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controllers_ElectronContextMenu__ = __webpack_require__(3663);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_collections_CollectionClipboard__ = __webpack_require__(3665);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_Toasts__ = __webpack_require__(1020);










/**
                                                *
                                                * @param {*} cb
                                                */
function bootIndependentServices(cb) {
  _.assign(window.pm, {
    toasts: __WEBPACK_IMPORTED_MODULE_8__models_Toasts__,
    toastManager: new __WEBPACK_IMPORTED_MODULE_2__models_ToastManager__["a" /* default */](),
    cookieManager: new __WEBPACK_IMPORTED_MODULE_4__models_cookies_CookieManager__["a" /* default */](),
    oAuth2Tokens: new __WEBPACK_IMPORTED_MODULE_3__models_helpers_OAuth2Tokens__["a" /* default */](),
    oAuth2Manager: new __WEBPACK_IMPORTED_MODULE_5__models_helpers_OAuth2Manager__["a" /* default */](),
    contextMenuManager: new __WEBPACK_IMPORTED_MODULE_6__controllers_ElectronContextMenu__["a" /* default */](),
    clipboard: new __WEBPACK_IMPORTED_MODULE_7__models_collections_CollectionClipboard__["a" /* default */]() });

  pm.logger.info('IndependentServices~boot - Success');
  cb && cb(null);
}

/* harmony default export */ __webpack_exports__["a"] = (bootIndependentServices);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3658:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_backbone__);




var OAuth2Token = __WEBPACK_IMPORTED_MODULE_2_backbone___default.a.Model.extend({
  defaults: function () {
    return {
      'id': '',
      'name': 'OAuth2 Token',
      'access_token': '',
      'expires_in': 0,
      'timestamp': 0 };

  } });


var OAuth2Tokens = __WEBPACK_IMPORTED_MODULE_2_backbone___default.a.Collection.extend({
  model: OAuth2Token,

  comparator: function (a, b) {
    var at = a.get('timestamp'),
    bt = b.get('timestamp');

    return at > bt;
  },

  initialize: function () {
    pm.mediator.on('addOAuth2Token', this.addAccessToken, this);
    pm.mediator.on('updateOAuth2Token', this.updateAccessToken, this);
    pm.mediator.on('deleteOAuth2Token', this.deleteAccessToken, this);
    this.loadAllAccessTokens();
  },

  loadAllAccessTokens: function () {
    __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
    find('oauth2accesstoken', {}).
    then(accessTokens => {
      accessTokens.forEach(token => {
        this.add(token, { merge: true });
      });
      pm.mediator.trigger('loadedAllStoredOAuth2Tokens');
    }).
    catch(e => {
      pm.logger.error('Error in fetching oauth2 access tokens', e);
    });
  },

  /**
      * @param {Object} tokenData - object having access_token and other optional attributes like scope, token_type, etc
      */
  addAccessToken: function (tokenData) {
    var accessToken = {
      'id': __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].guid(),
      'timestamp': new Date().getTime(),
      'data': [],
      'name': tokenData.name };


    // make sure data is added to token response for any response
    // openID and other implementations may have different keys for access token
    // this allows users to manually copy the key from the response
    _.forOwn(tokenData, function (value, key) {
      if (key !== 'result') {
        accessToken.data.push({
          key: key,
          value: value });

      }
    });

    tokenData.access_token && (accessToken.access_token = tokenData.access_token);

    // @todo: the result is not being used anywhere, confirm with kane before removing
    if (tokenData.hasOwnProperty('access_token')) {
      accessToken.data.push({
        key: 'result',
        value: 'success' });

    }
    __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
    create('oauth2accesstoken', accessToken).
    then(() => {
      var at = new OAuth2Token(accessToken);
      this.add(at, { merge: true });
      pm.mediator.trigger('addedOAuth2Token', accessToken);
    }).
    catch(e => {
      pm.logger.error('Error in adding access token', e);
    });
  },

  updateAccessToken: function (params) {
    var token = this.get(params.id);

    token.set('name', params.name);
    __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
    findOne('oauth2accesstoken', { id: params.id }).
    then(tokenFromDb => {
      if (tokenFromDb) {
        return __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
        update('oauth2accesstoken', token.toJSON());
      }

      // @todo Will this ever be called? This flow is only used to update the name of an already saved accessToken @samvel
      return __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
      create('oauth2accesstoken', token);
    }).
    then(() => {
      pm.mediator.trigger('updatedOAuth2Token', token.id);
    }).
    catch(e => {
      pm.logger.error('Error in updating access token', e);
    });
  },

  deleteAccessToken: function (id) {
    __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
    delete('oauth2accesstoken', { id }).
    then(() => {
      this.remove(id);
    }).
    catch(e => {
      console.log('Error in deleting access token', e);
    });
  },

  deleteAllAccessTokens: function (callback) {
    __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
    delete('oauth2accesstoken', {}).
    then(() => {
      this.reset();
      _.isFunction(callback) && callback();
    }).
    catch(e => {
      console.log('Error in deleting access tokens');
      this.reset();
      _.isFunction(callback) && callback(e);
    });
  } });


/* harmony default export */ __webpack_exports__["a"] = (OAuth2Tokens);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3659:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_async__);



const session = __webpack_require__(22).remote.session;

/**
                                                     * @typedef {Object} Cookie
                                                     */

/**
                                                         * Handles the 'Manage Cookies' modal in electron
                                                         *
                                                         * @class CookieManager
                                                         *
                                                         * @todo Incomplete
                                                         */let
CookieManager = class CookieManager {

  constructor() {
    this.cookies = {};

    this.loadCookiesDebounced = _.debounce(this.loadCookies, 300);
    this.callbackAccumulator = [];
  }

  /**
     * @private
     *
     * @param {string} url - URL of the cookie
     * @param {string} host - Host (domain) name of the cookie
     * @param {Object} cookie - Cookie object
     * @param {Function} [callback] - Callback function to be triggered
     */
  _writeToCookieStore(url, host, cookie, callback) {
    let cookieStore = session.fromPartition(__WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getCookiePartition()).cookies;
    if (!host) {return;}

    var urlKey = host;
    urlKey[0] == '.' && (urlKey = urlKey.substring(1));
    if (!this.cookies.hasOwnProperty(urlKey)) {
      this.cookies[urlKey] = {};
    }

    // cookie will be loaded once the callback is successful
    if (cookie.url.indexOf('http://') !== 0 && cookie.url.indexOf('https://') !== 0) {
      cookie.url = 'http://' + cookie.url;
    }

    if (!cookie.domain) {
      cookie.domain = host;
    }
    if (!cookie.Path) {
      cookie.Path = '/';
    }

    if (host[0] == '.') {
      host = host.substring(1);
    }
    var cookieToSet = {
      url: cookie.url,
      name: cookie.name,
      value: cookie.value,
      domain: host,
      path: cookie.path,
      secure: cookie.secure,
      expirationDate: cookie.expires,
      httpOnly: cookie.httpOnly };


    cookieStore.set(cookieToSet, err => {
      _.isFunction(callback) && callback(err);
    });
  }

  /**
     * `loadCookiesBulk` accumulates all the callbacks and uses debounced `loadCookies`.
     * Once `loadCookies` is triggered, all the callbacks are called and the accumulator is cleared.
     *
     * @param {Function} callback - Callback function to be triggered
     */
  loadCookiesBulk(callback) {
    this.callbackAccumulator.push(callback);

    this.loadCookiesDebounced(() => {
      const callbacks = this.callbackAccumulator;

      // Empty the callback accumulator so that we do not miss any callback during flushing of
      // other callbacks
      this.callbackAccumulator = [];

      _.forEach(callbacks, callback => {
        _.isFunction(callback) && callback();
      });
    });
  }

  // when the app loads
  // load all session cookies into this.cookies

  // when a request is being sent
  // if the cookies header is present > (call webContent.cookies.set)
  // and add to this.cookies

  // when a response is received
  // for each set cookie header, parse the Set-Cookie header and add it to .set and the store > NOTE- this might never be called
  // also get the cookies for the request's domain, and re-add to this.cookies (if electron parses response headers on it's own)

  loadCookies(callback) {
    let cookieStore = session.fromPartition(__WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getCookiePartition()).cookies;

    // This makes sure we clear all the cookies in each domain, but retain the domain
    // We ignore the cache because, now the main process can delete cookies
    // and we have no means to update out cache.
    _.forEach(_.keys(this.cookies), domain => {
      this.cookies[domain] = {};
    });

    cookieStore.get({}, (error, cookies) => {
      try {
        if (error) {
          throw error;
        }

        _.each(cookies, cookie => {
          var domain = cookie.domain;
          if (domain[0] == '.') {
            domain = domain.substring(1);
          }
          if (!this.cookies.hasOwnProperty(domain)) {
            this.cookies[domain] = {};
          }
          !this.cookies[domain][cookie.name] && (this.cookies[domain][cookie.name] = []);
          this.cookies[domain][cookie.name].push(cookie);
        });
        pm.mediator.trigger('loadedCookies', this.getDomainList());
      }
      catch (e) {
        pm.logger.error(e);
      } finally
      {
        _.isFunction(callback) && callback();
      }
    });
  }

  /**
    * @private
     * @param requestUrl - the URL as seen in the UI. Electron will do the domain resolution
     */
  reloadCookiesForDomain(requestUrl) {
    let cookieStore = session.fromPartition(__WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getCookiePartition()).cookies;

    cookieStore.get({ url: requestUrl }, (error, cookies) => {
      if (error) {throw error;}

      _.each(cookies, cookie => {
        if (!this.cookies.hasOwnProperty(cookie.domain)) {
          this.cookies[cookie.domain] = {};
        }
        this.cookies[cookie.domain][cookie.name] = cookie;
      });
    });
  }

  getAllCookies() {
    return _.cloneDeep(this.cookies);
  }

  getAllCookiesAsync(cb) {
    let self = this,
    cookieStore = session.fromPartition(__WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getCookiePartition()).cookies;

    cookieStore.get({}, (error, cookies) => {
      if (error) {
        return cb(error);
      }

      _.each(cookies, cookie => {
        var domain = cookie.domain;
        if (domain[0] == '.') {
          domain = domain.substring(1);
        }
        if (!this.cookies.hasOwnProperty(domain)) {
          this.cookies[domain] = {};
        }
        this.cookies[domain][cookie.name] = cookie;
      });

      cb(null, this.cookies);
    });
  }

  getCookiesForDomain(domain) {
    if (domain[0] === '.') {
      domain = domain.slice(1);
    }
    return this.cookies[domain];
  }

  getDomainList() {
    var retVal = [];
    for (var domain in this.cookies) {
      if (this.cookies.hasOwnProperty(domain)) {
        retVal.push(domain);
      }
    }
    return retVal;
  }

  // Acc. to the spec at https://tools.ietf.org/html/rfc6265#section-5.1.4
  getCookiesForUrl(url) {
    if (!url) {return [];}
    url = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].ensureProperUrl(url);
    try {
      var urlObject = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getURLProps(url),
      hostname = urlObject.hostname,
      domainCookies = _.values(this.getCookiesForDomain(hostname));
      return _.filter(domainCookies, function (domainCookie) {
        return (
          !urlObject.pathname ||
          urlObject.pathname == domainCookie.path ||
          urlObject.pathname.indexOf(domainCookie.path) == 0 && (
          urlObject.pathname[domainCookie.path.length] == '/' ||
          _.last(domainCookie.path) == '/'));


      });
    }
    catch (e) {
      // invalid URL
      return [];
    }
  }

  /*
    * cookie string is the value of the Cookies header
    * add these cookies to URL
    */
  addCookies(url, cookieString) {
    try {
      var urlObject = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getURLProps(url);
      var host = urlObject.host;
      var cookies = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */]._parseCookieHeader(host, cookieString);
      _.each(cookies, cookie => {
        this.addSingleCookie(url, host, cookie);
      });
    }
    catch (e) {
      pm.logger.error('Could not add cookies for invalid URL');
      pm.logger.error(e);
    }
  }

  /**
     * `cookies` param has a similar structure to `addSingleCookie` method's params
     *
     * @param {Object[]} cookies - Array of Objects containing cookies
     * @param {string} cookies[].url - URL of the cookie
     * @param {string} cookies[].host - Host (domain) name of the cookie
     * @param {Object} cookies[].cookie - Cookie object
     * @param {Function} [callback] - Callback function to be triggered
     */
  addBulkCookies(cookies, callback) {
    __WEBPACK_IMPORTED_MODULE_1_async___default.a.each(cookies, (cookieItem, next) => {
      this._writeToCookieStore(cookieItem.url, cookieItem.host, cookieItem.cookie, next);
    }, err => {
      if (err) {
        return _.isFunction(callback) && callback(err);
      }

      this.loadCookiesBulk(() => {
        _.isFunction(callback) && callback();
      });
    });
  }

  /**
     *
     * @param {string} url - URL of the cookie
     * @param {string} host - Host (domain) name of the cookie
     * @param {Object} cookie - Cookie object
     * @param {Function} [callback] - Callback function to be triggered
     */
  addSingleCookie(url, host, cookie, callback) {
    this._writeToCookieStore(url, host, cookie, err => {
      if (err) {
        return _.isFunction(callback) && callback(err);
      }

      this.loadCookies(() => {
        _.isFunction(callback) && callback();
      });
    });
  }

  /**
    * Called when a New domain is added from the Cookie Modal
    * @private
    */
  addNewDomain(domainName) {
    if (!domainName || domainName == '') {
      return;
    }
    domainName = domainName.toLowerCase();
    if (!this.cookies.hasOwnProperty(domainName)) {
      this.cookies[domainName] = {};
    }
  }

  editCookie(domain, oldCookie, newCookie, callback) {
    let cookieName = oldCookie.name,
    cookiePath = oldCookie.path;

    let cookieStore = session.fromPartition(__WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getCookiePartition()).cookies;
    cookieStore.get({}, (error, cookies) => {
      _.each(cookies, cookie => {
        if (!cookie) {
          return;
        }

        cookie.domain = cookie.domain[0] === '.' ? cookie.domain.slice(1) : cookie.domain;

        _.isEqual(cookie.domain, domain) && _.isEqual(cookie.path, cookiePath) && _.isEqual(cookie.name, cookieName) && this.deleteCookie(domain, cookieName, cookie.path, error => {
          error && _.isFunction(callback) && callback(error);

          this.addSingleCookie(newCookie.url, newCookie.domain, newCookie, error => {
            _.isFunction(callback) && callback(error);
          });
        });
      });
    });
  }

  deleteDomain(domain, callback) {
    let cookiesForDomain = this.cookies[domain],
    cookiesToDelete = _.flatMap(cookiesForDomain); // take the values and flatten them

    // The delete single cookie logic deletes multiple cookies with same name
    // and then adds back the ones which shouldn't have been deleted. So we should do this
    // in series, otherwise because of concurrency we will end up with some cookies non-deleted
    __WEBPACK_IMPORTED_MODULE_1_async___default.a.eachSeries(cookiesToDelete, (cookie, next) => {
      this.deleteCookie(domain, cookie.name, cookie.path, next);
    }, res => {
      // wait for all cookies to be deleted, then delete the domain too from UI
      if (res && res.type === 'RemoveCookieError') {
        res['domain'] = domain;
        _.isFunction(callback) && callback(res);

        return;
      }

      delete this.cookies[domain];

      this.loadCookies(() => {
        let res = {
          type: 'Success',
          domain: domain };


        _.isFunction(callback) && callback(res);
      });
    });
  }

  deleteCookie(domain, cookieName, path, callback) {
    let cookieStore = session.fromPartition(__WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].getCookiePartition()).cookies,
    url = domain + path,
    matchingCookies = _.get(this.cookies, [domain[0] === '.' ? domain.slice(1) : domain, cookieName]);

    if (!matchingCookies) {
      return;
    }

    if (url[0] === '.') {
      url = 'www' + url;
    }

    var httpUrl = url,
    httpsUrl = url,
    index = _.findIndex(matchingCookies, { path });

    if (index === -1) {
      _.isFunction(callback) && callback();
      return;
    }

    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      httpUrl = 'http://' + url;
      httpsUrl = 'https://' + url;
    }

    cookieStore.remove(httpUrl, cookieName, error => {
      if (error) {
        error['type'] = 'removeCookieError';
        _.isFunction(callback) && callback(error);
        return;
      }

      cookieStore.remove(httpsUrl, cookieName, error => {
        if (error) {
          error['type'] = 'removeCookieError';
          _.isFunction(callback) && callback(error);
          return;
        }

        if (_.size(matchingCookies) <= 1) {
          this.loadCookies(() => {
            _.isFunction(callback) && callback();
          });
          return;
        }

        // If there were multiple cookies with same name & different paths,
        // this would have deleted all those cookies, adding them back
        matchingCookies.splice(index, 1); // remove the one which was intended to be deleted

        let bulkCookies = _.map(matchingCookies, cookie => {
          cookie.url = cookie.domain + cookie.path;
          cookie.secure ? cookie.url = 'https://' + cookie.url : cookie.url = 'http://' + cookie.url;

          return {
            url: cookie.url,
            host: cookie.domain,
            cookie };

        });

        this.addBulkCookies(bulkCookies, () => {
          _.isFunction(callback) && callback();
        });
      });
    });
  }};



/* harmony default export */ __webpack_exports__["a"] = (CookieManager);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3660:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__OAuth2TokenFetcher__ = __webpack_require__(3661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_backbone__);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};



var DEFAULT_TOKEN_NAME = 'OAuth2 Token',
OAuth2Manager = __WEBPACK_IMPORTED_MODULE_2_backbone___default.a.Model.extend({
  defaults: function () {
    return {
      oAuth2: {
        accessTokenUrl: '',
        addTokenTo: 'url',
        client_authentication: 'header',
        authUrl: '',
        clientId: '',
        clientSecret: '',
        grant_type: 'authorization_code',
        name: 'Token Name',
        password: '',
        redirect_uri: '',
        scope: '',
        state: '',
        useBrowser: false,
        username: '',
        algorithm: 'S256',
        code_verifier: '' },

      savedOAuth2Tokens: [] };

  },

  initialize: function () {
    pm.mediator.on('addedOAuth2Token', this.addOAuth2Token, this);
    pm.mediator.on('loadedAllStoredOAuth2Tokens', this.loadCurrentTokens, this);
    this.oAuth2TokenFetcher = new __WEBPACK_IMPORTED_MODULE_0__OAuth2TokenFetcher__["a" /* default */]();
    this.loadCurrentTokens();
    this.on('change:oAuth2', this.updateDB);
    __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
    findOne('authhelperstate', { id: 'oAuth2-meta' }).
    then(helper => {
      if (helper) {
        this.set('oAuth2', this.translateFromLegacy.oAuth2(helper.auth));
      }
    }).
    catch(e => {
      console.log('Error in fetching oauth2-meta');
    });
  },

  updateDB: function () {
    var helper = { id: 'oAuth2-meta' };
    helper.auth = this.translateIntoLegacy.oAuth2(this.toJSON().oAuth2);
    __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
    findOne('authhelperstate', { id: 'oAuth2-meta' }).
    then(helperFromDb => {
      if (helperFromDb) {
        return __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
        update('authhelperstate', helper);
      }
      return __WEBPACK_IMPORTED_MODULE_1__modules_services_ModelService__["a" /* default */].
      create('authhelperstate', helper);
    }).
    catch(e => {
      console.log('Error in fetching oauth2-meta', e);
    });
  },

  setToDefault: function () {
    this.set(this.defaults());
  },

  processOAuth2RequestToken: function (collectionId) {
    let params = this.get('oAuth2'); // Currently entered parameters on the UI
    this.oAuth2TokenFetcher.trigger('startAuthorization', this.translateIntoLegacy.oAuth2(params), collectionId);
  },

  processOAuth2DeleteToken: function (token) {
    let currentTokens = _.clone(this.get('savedOAuth2Tokens'));

    pm.mediator.trigger('deleteOAuth2Token', token.id);

    currentTokens = currentTokens.filter(function (tk) {
      return tk.id !== token.id;
    });
    this.set('savedOAuth2Tokens', currentTokens);
  },

  loadOAuth2Token: function (rawToken) {
    let currentTokens = _.clone(this.get('savedOAuth2Tokens'));
    var newTokenData = _.zipObject(_.map(rawToken.data, 'key'), _.map(rawToken.data, 'value'));
    newTokenData.id = rawToken.id;
    newTokenData.name = rawToken.name;
    currentTokens.push(newTokenData);
    this.set('savedOAuth2Tokens', currentTokens);
  },

  addOAuth2Token: function (newToken) {
    let currentTokens = _.clone(this.get('savedOAuth2Tokens')),
    currentTokenDataInForm = this.get('oAuth2'),
    newTokenData;

    if (!_.isEmpty(currentTokenDataInForm.name) && _.isEmpty(newToken.name)) {
      let params = {
        id: newToken.id,
        name: currentTokenDataInForm.name };

      pm.mediator.trigger('updateOAuth2Token', params);
      newTokenData = _.zipObject(_.map(newToken.data, 'key'), _.map(newToken.data, 'value'));
      newTokenData.id = newToken.id;
      newTokenData.name = currentTokenDataInForm.name || DEFAULT_TOKEN_NAME;
      currentTokens.push(newTokenData);
      pm.mediator.trigger('newOAuth2Token', newTokenData);
      this.set('savedOAuth2Tokens', currentTokens);
    } else
    {
      newTokenData = _.zipObject(_.map(newToken.data, 'key'), _.map(newToken.data, 'value'));
      newTokenData.id = newToken.id;
      newTokenData.name = newToken.name || DEFAULT_TOKEN_NAME;
      currentTokens.push(newTokenData);
      pm.mediator.trigger('newOAuth2Token', newTokenData);
      this.set('savedOAuth2Tokens', currentTokens);
    }
  },

  updateOAauth2Token: function (updatedToken) {
    let currentTokens = this.get('savedOAuth2Tokens');

    pm.mediator.trigger('updateOAuth2Token', updatedToken);

    currentTokens = currentTokens.map(function (tk) {
      if (tk.id === updatedToken.id) {
        let token = _extends({},
        tk, {
          name: updatedToken.name });


        return token;
      }

      return tk;
    });

    this.set('savedOAuth2Tokens', currentTokens);
  },

  loadCurrentTokens: function () {
    if (typeof pm.oAuth2Tokens !== 'undefined') {
      let currentTokens = pm.oAuth2Tokens.models || [];
      currentTokens.forEach(token => {
        let rawToken = token.toJSON();
        this.loadOAuth2Token(rawToken);
      });
    }
  },

  deleteAllTokens: function (callback) {
    pm.oAuth2Tokens && pm.oAuth2Tokens.
    deleteAllAccessTokens(() => {
      this.setToDefault();
      _.isFunction(callback) && callback();
    });
  },

  translateIntoLegacy: {
    oAuth2: function (newParams) {
      return {
        access_token_url: newParams.accessTokenUrl,
        add_token_to: newParams.addTokenTo || 'url',
        authorization_url: newParams.authUrl,
        client_authentication: newParams.client_authentication,
        client_id: newParams.clientId,
        client_secret: newParams.clientSecret,
        grant_type: newParams.grant_type,
        name: newParams.name,
        password: newParams.password,
        redirect_uri: newParams.redirect_uri,
        scope: newParams.scope,
        state: newParams.state,
        useBrowser: newParams.useBrowser,
        username: newParams.username,
        algorithm: newParams.algorithm,
        code_verifier: newParams.code_verifier };

    } },


  translateFromLegacy: {
    oAuth2: function (newParams) {
      return {
        accessTokenUrl: newParams.access_token_url,
        addTokenTo: newParams.add_token_to || 'url',
        authUrl: newParams.authorization_url,
        client_authentication: newParams.client_authentication,
        clientId: newParams.client_id,
        clientSecret: newParams.client_secret,
        grant_type: newParams.grant_type,
        name: newParams.name,
        password: newParams.password,
        redirect_uri: newParams.redirect_uri,
        scope: newParams.scope,
        state: newParams.state,
        useBrowser: newParams.useBrowser,
        username: newParams.username,
        algorithm: newParams.algorithm || 'S256',
        code_verifier: newParams.code_verifier || '' };

    } } });



/* harmony default export */ __webpack_exports__["a"] = (OAuth2Manager);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3661:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_ModelToSdkTransformer__ = __webpack_require__(928);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_postman_collection__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_postman_collection___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_postman_collection__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__ = __webpack_require__(3662);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_backbone__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__modules_services_VariableSessionService__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__constants_ConsoleEventTypes__ = __webpack_require__(287);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};









/**
                                      * Interface that talks to {@link OAuth2TokenRequester} for completing OAuth 2.0 token generation flows.
                                      *
                                      * @class OAuth2TokenFetcher
                                      */
var OAuth2TokenFetcher = __WEBPACK_IMPORTED_MODULE_6_backbone___default.a.Model.extend( /** @lends OAuth2TokenFetcher.prototype */{
  defaults: function () {
    return {
      id: 'oAuth2',
      authorization_url: '',
      access_token_url: '',
      client_id: '',
      client_secret: '',
      grant_type: 'authorization_code',
      scope: '' };

  },

  initialize: function () {
    this.on('startAuthorization', this.startAuthorization);
    __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].on('oauth2TokenRequestCallback', this.onOAuth2TokenRequestCallback);
    __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].on('oauth2CodeRequestResponse', this.onOAuth2CodeRequestResponse);
    __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].on('oauth2TokenRequestResponse', this.onOAuth2TokenRequestResponse);
    pm.mediator.on('oauth2CancelBrowserAuth', () => {
      __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].send('oauth2CancelBrowserAuth');
    });
  },

  /**
      * Sends IPC event to start OAuth 2.0 token request flow.
      * Also takes care or resolving environment variables in params.
      * @param {Object} params unresolved auth definition
      * @param {String} collectionId
      *
      * @fires IPC#oauth2GetNewToken
      */
  startAuthorization: function (params, collectionId) {
    let environmentId = Object(__WEBPACK_IMPORTED_MODULE_4__stores_get_store__["getStore"])('ActiveEnvironmentStore').id,
    globalsId = Object(__WEBPACK_IMPORTED_MODULE_4__stores_get_store__["getStore"])('ActiveGlobalsStore').id,
    workspaceId = Object(__WEBPACK_IMPORTED_MODULE_4__stores_get_store__["getStore"])('ActiveWorkspaceStore').id;

    pm.mediator.trigger('oauth2Start');

    Object(__WEBPACK_IMPORTED_MODULE_7__modules_services_VariableSessionService__["e" /* getVariableSessionMap */])({ environmentId, globalsId, workspaceId, collectionId }).
    then(variablesMap => {
      let authParams = {
        grant_type: params.grant_type,
        useBrowser: params.useBrowser,
        algorithm: params.algorithm,
        access_token_url: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.access_token_url), variablesMap),
        authorization_url: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.authorization_url), variablesMap),
        client_authentication: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.client_authentication), variablesMap),
        client_id: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.client_id), variablesMap),
        client_secret: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.client_secret), variablesMap),
        password: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.password), variablesMap),
        redirect_uri: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.redirect_uri), variablesMap) || '/',
        scope: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.scope), variablesMap),
        state: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.state), variablesMap),
        username: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.username), variablesMap),
        name: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.name), variablesMap),
        code_verifier: __WEBPACK_IMPORTED_MODULE_5__utils_ResolveVariableHelper__["a" /* default */].resolve(_.clone(params.code_verifier), variablesMap) };


      __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].send('oauth2GetNewToken', authParams,
      {
        useSystemProxy: pm.settings.getSetting('useSystemProxy'),
        proxies: pm.proxyListManager.getGlobalProxyConfigList(),
        ignoreProxyEnvironmentVariables: !__WEBPACK_IMPORTED_MODULE_3__utils_util__["a" /* default */].useProxyEnvironmentVariables(),
        certificates: __WEBPACK_IMPORTED_MODULE_1__utils_ModelToSdkTransformer__["a" /* default */].getClientSslCerts(pm.certificateManager),
        requester: {
          useWhatWGUrlParser: pm.settings.getSetting('useWhatWGUrlParser'),
          strictSSL: pm.settings.getSetting('SSLCertVerify'),
          extendedRootCA: pm.settings.getSetting('isCACertEnabled') && pm.settings.getSetting('CACertPath') || undefined,
          verbose: true },

        script: {
          serializeLogs: true } },


      { cookiePartitionId: __WEBPACK_IMPORTED_MODULE_3__utils_util__["a" /* default */].getCookiePartition(),
        strictSSL: pm.settings.getSetting('SSLCertVerify') });


    });
  },

  /**
      * Listens to OAuth 2.0 token request success and adds the token to the OAuth 2 token list.
      *
      * @param {Object} event Ipc event
      * @param {String} rawErr stringified error
      * @param {String} rawResponse stringified token response
      *
      * @listens IPC#oauth2TokenRequestCallback
      * @fires Mediator#addOAuth2Token
      */
  onOAuth2TokenRequestCallback: function (event, rawErr, rawResponse) {
    if (rawErr) {
      let err = JSON.parse(rawErr),
      errMessage = err && err.message || String(err);

      pm.mediator.trigger('oauth2Error', errMessage);
      pm.toasts.error('Could not complete OAuth 2.0 login. Check Postman Console for more details.');

      if (rawResponse) {
        errMessage += ': ' + String(rawResponse);
      }

      pm.console.error(__WEBPACK_IMPORTED_MODULE_8__constants_ConsoleEventTypes__["a" /* CONSOLE_EVENT_EXCEPTION */], {}, {
        name: err && err.name,
        message: errMessage });


      return;
    }

    pm.mediator.trigger('addOAuth2Token', rawResponse && JSON.parse(rawResponse));
  },

  onOAuth2CodeRequestResponse: function (event, payload) {
    let consolePayload = {};

    if (!payload.request) {
      return;
    }

    consolePayload = _extends({}, payload, { indirect: 'auth', browserRequest: true });
    pm.console.log(__WEBPACK_IMPORTED_MODULE_8__constants_ConsoleEventTypes__["c" /* CONSOLE_EVENT_NETWORK */], {}, consolePayload);
  },

  /**
      * Listens to OAuth 2.0 Token Request API response and logs it Postman Console.
      *
      * @param {Object} event IPC event
      * @param {String} rawErr stringified error
      * @param {Object} trace trace from runtime `io` event
      * @param {Object} cursor collection run cursor
      * @param {SDKResponse~definition} responseJSON json representation of sdk response
      * @param {SDKRequest~definition} requestJSON json representation of sdk request
      */
  onOAuth2TokenRequestResponse: function (event, rawErr, cursor, responseJSON, requestJSON, history) {
    let err = rawErr && JSON.parse(rawErr),
    request = requestJSON && new __WEBPACK_IMPORTED_MODULE_2_postman_collection__["Request"](requestJSON),
    response = responseJSON && new __WEBPACK_IMPORTED_MODULE_2_postman_collection__["Response"](responseJSON),
    consolePayload = {};

    if (!request) {
      return;
    }

    consolePayload.request = {
      url: _.invoke(request, 'url.toString'),
      method: requestJSON.method,
      headers: _.invoke(request, 'headers.toJSON'),
      body: requestJSON.body,
      certificate: requestJSON.certificate,
      proxy: requestJSON.proxy };


    if (response) {
      consolePayload.response = {
        responseTime: response.responseTime,
        code: response.code,
        headers: _.invoke(response, 'headers.toJSON'),
        body: response.text(),
        contentInfo: _.isFunction(response.contentInfo) && response.contentInfo() };

    }

    consolePayload.indirect = 'auth';
    consolePayload.history = history;

    if (err) {
      consolePayload.error = err.message;
      pm.console.error(__WEBPACK_IMPORTED_MODULE_8__constants_ConsoleEventTypes__["c" /* CONSOLE_EVENT_NETWORK */], {}, consolePayload);
    } else
    {
      pm.console.log(__WEBPACK_IMPORTED_MODULE_8__constants_ConsoleEventTypes__["c" /* CONSOLE_EVENT_NETWORK */], {}, consolePayload);
    }
  } });


/* harmony default export */ __webpack_exports__["a"] = (OAuth2TokenFetcher);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3662:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_postman_collection__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_postman_collection___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_postman_collection__);


// Add Unit tests
let ResolveVariableHelper = class ResolveVariableHelper {
  constructor() {
  }

  resolve(string, variables = {}) {
    if (typeof string === 'number') {
      return string;
    }

    if (string == null) {
      return '';
    }

    return __WEBPACK_IMPORTED_MODULE_0_postman_collection__["Property"].replaceSubstitutions(string, variables);
  }};


/* harmony default export */ __webpack_exports__["a"] = (new ResolveVariableHelper());

/***/ }),

/***/ 3663:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ElectronContextMenu; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_DraftJsHelper__ = __webpack_require__(3664);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_pipelines_user_action__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_services_VariableSessionService__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_VariableSessionHelper__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_EditorService__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__electron_ElectronService__ = __webpack_require__(149);










/**
                                                                 * Handles context menu creation for Electron
                                                                 * Currently, the context menu supports:
                                                                 * 1. Encode/Decode URI Component for selected text
                                                                 * 2. Set as env var
                                                                 * 3. Set as global var
                                                                 * @private
                                                                 */let
ElectronContextMenu = class ElectronContextMenu {
  constructor() {
    this.Remote = __webpack_require__(22).remote;
    this.Menu = this.Remote.Menu;
    this.MenuItem = this.Remote.MenuItem;

    this.currentSelection = '';
    this.currentAceSelection = '';
    this.activeComponent = null;
    this.attachEventListeners();

    /**
                                  * On right click in any input field, text gets automatically selected even if there was no explicit selection made before.
                                  * The text which gets automatically selected on right click, depends on the cursor position.
                                  */
    window.addEventListener('contextmenu', e => {
      e.preventDefault();
      this.currentSelection = window.getSelection().toString();
      let menu = this.buildMenu(e);

      // Empty menu fix for windows native app
      if (menu && _.size(menu.items)) {
        menu.popup(Object(__WEBPACK_IMPORTED_MODULE_8__electron_ElectronService__["c" /* getCurrentWindow */])());
      }
    }, false);
  }

  attachEventListeners() {
    pm.mediator.on('textEditor:selectionChange', this.handleSelectionChange, this);
    pm.mediator.on('contextMenu:inputActivated', this.handleActiveInputChange, this);
  }

  handleSelectionChange(value) {
    this.currentAceSelection = value;
  }

  handleActiveInputChange(component) {
    this.currentSelection = window.getSelection().toString();
    this.activeComponent = component;
  }

  buildMenu(e) {
    let menu = new this.Menu(),
    isInput = _.get(e, 'target.nodeName') === 'INPUT' || _.get(e, 'target.nodeName') === 'TEXTAREA',
    hasAutoSuggest = _.get(this.activeComponent, 'refs.autoSuggest') ? true : false,
    isAceEditor = _.get(e, 'target.className') === 'ace_text-input',
    isMonacoEditor = e.target.closest('.monaco-editor'),
    requesterTab,
    selectedText = this.currentAceSelection || this.currentSelection; // Fetching the non empty string

    // Resetting values so that context menu is not triggered on right clicking anywhere on the screen
    this.currentSelection = '';
    this.currentAceSelection = '';

    if (_.get(e, 'target.closest') && (requesterTab = e.target.closest('.requester-tab'))) {

      this.buildTabMenu(menu, _.get(requesterTab, 'dataset.tabId'));
    } else
    if (!isInput && _.get(e, 'target.closest') && (e.target.closest('.collection-sidebar-list-item') ||
    e.target.closest('.collection-browser-list-item__folder') ||
    e.target.closest('.collection-browser-list-item__request'))) {
      return null;
    } else
    if (_.get(e, 'target.classList')) {
      if (e.target.classList.contains('requester-tab')) {
        this.buildTabMenu(menu, _.get(e.target, 'dataset.tabId'));
      } else
      if (e.target.classList.contains('requester-tab__name')) {
        this.buildTabMenu(menu, _.get(e.target, 'dataset.tabId'));
      }
    }

    if (!_.isEmpty(selectedText)) {
      this.buildEnvironmentMenu(menu, selectedText);
      this.buildGlobalMenu(menu, selectedText);
      this.buildGenericMenu(menu);
      _.trim(selectedText) && this.buildFindMenu(menu, selectedText);
      this.buildEncodeDecodeMenu(menu);
    }

    // Display generic input menu for input
    else if (isInput) {
        this.buildGenericMenu(menu);
      } else

      if (hasAutoSuggest || isAceEditor) {
        this.buildGenericMenu(menu);
        this.buildEncodeDecodeMenu(menu);
        this.activeComponent = null;
      } else
      if (isMonacoEditor) {
        this.buildTextEditorMenu(menu, e);
        this.activeComponent = null;
      }

    return menu;
  }

  buildTabMenu(menu, id) {

    // dont need isPreview, duplicate can be done for all cases
    menu.append(new this.MenuItem({
      label: 'Duplicate Tab',
      click: () => {
        __WEBPACK_IMPORTED_MODULE_7__services_EditorService__["a" /* default */].duplicate({ id: id });
      } }));

    menu.append(new this.MenuItem({ type: 'separator' }));

    menu.append(new this.MenuItem({
      label: 'Close',
      accelerator: 'CommandOrControl+W',
      click: () => {
        __WEBPACK_IMPORTED_MODULE_7__services_EditorService__["a" /* default */].close({ id: id });
      } }));

    menu.append(new this.MenuItem({
      label: 'Force Close',
      accelerator: 'CommandOrControl+Alt+W',
      click: () => {
        __WEBPACK_IMPORTED_MODULE_7__services_EditorService__["a" /* default */].close({ id: id }, { force: true });
      } }));

    menu.append(new this.MenuItem({
      label: 'Close Other Tabs',
      click: () => {
        __WEBPACK_IMPORTED_MODULE_7__services_EditorService__["a" /* default */].closeAllButCurrent();
      } }));

    menu.append(new this.MenuItem({
      label: 'Close All Tabs',
      click: () => {
        __WEBPACK_IMPORTED_MODULE_7__services_EditorService__["a" /* default */].closeAll();
      } }));

    menu.append(new this.MenuItem({
      label: 'Force Close All Tabs',
      click: () => {
        __WEBPACK_IMPORTED_MODULE_7__services_EditorService__["a" /* default */].requestForceCloseAll();
      } }));

  }

  buildFindMenu(menu, selectedText) {
    menu.append(new this.MenuItem({
      label: `Find: ${selectedText}`,
      click: () => pm.mediator.trigger('findSelectedText', selectedText) }));

  }

  buildGenericMenu(menu) {

    menu.append(new this.MenuItem({
      label: 'Undo',
      role: 'undo' }));

    menu.append(new this.MenuItem({
      label: 'Redo',
      role: 'redo' }));

    menu.append(new this.MenuItem({ type: 'separator' }));
    menu.append(new this.MenuItem({
      label: 'Cut',
      role: 'cut' }));

    menu.append(new this.MenuItem({
      label: 'Copy',
      role: 'copy' }));

    menu.append(new this.MenuItem({
      label: 'Paste',
      role: 'paste' }));

    menu.append(new this.MenuItem({
      label: 'Select All',
      role: 'selectall' }));

    menu.append(new this.MenuItem({ type: 'separator' }));
  }

  buildTextEditorMenu(menu, event) {

    menu.append(new this.MenuItem({
      label: 'Undo',
      click: () => {pm.mediator.trigger('textEditor:undo', event.target);} }));

    menu.append(new this.MenuItem({
      label: 'Redo',
      click: () => {pm.mediator.trigger('textEditor:redo', event.target);} }));

    menu.append(new this.MenuItem({ type: 'separator' }));
    menu.append(new this.MenuItem({
      label: 'Cut',
      role: 'cut' }));

    menu.append(new this.MenuItem({
      label: 'Copy',
      role: 'copy' }));

    menu.append(new this.MenuItem({
      label: 'Paste',
      role: 'paste' }));

    menu.append(new this.MenuItem({
      label: 'Select All',
      click: () => {pm.mediator.trigger('textEditor:selectAll', event.target);} }));

  }

  buildEncodeDecodeMenu(menu) {
    menu.append(new this.MenuItem({
      label: 'EncodeURIComponent',
      click: () => {this.encodeURI();} }));

    menu.append(new this.MenuItem({
      label: 'DecodeURIComponent',
      click: () => {this.decodeURI();} }));

  }

  buildEnvironmentMenu(menu, selectionText) {
    let environment = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveEnvironmentStore');
    if (!environment || _.isEmpty(environment.values)) {
      return;
    }
    let environmentName = environment.name;
    let submenu = new this.Menu();

    let environmentVars = _.reject(environment.values, { enabled: false }),
    environmentKeys = _.map(environmentVars, 'key');

    _.forEach(environmentKeys, (key, index) => {
      submenu.append(new this.MenuItem({
        label: key,
        click: () => {this.updateEnvironmentVariableFromContextMenu(index, selectionText);} }));

    });

    menu.append(new this.MenuItem({
      label: 'Set: ' + environmentName,
      type: 'submenu',
      submenu: submenu }));

  }

  buildGlobalMenu(menu, selectionText) {
    let globals = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveGlobalsStore');
    if (!globals || _.isEmpty(globals.values)) {
      return;
    }
    let submenu = new this.Menu();

    let globalVars = _.reject(globals.values, { enabled: false });
    let globalKeys = _.map(globalVars, 'key');

    _.forEach(globalKeys, (key, index) => {
      submenu.append(new this.MenuItem({
        label: key,
        click: () => {this.updateGlobalVariableFromContextMenu(index, selectionText);} }));

    });

    // Show Set:Globals only if globals are present
    if (_.size(globalKeys)) {
      menu.append(new this.MenuItem({
        label: 'Set: Globals',
        type: 'submenu',
        submenu: submenu }));

    }
  }

  encodeURI() {
    var selectionStart, selectionEnd, oldValue, newValue, args;
    if (_.get(this.activeComponent, 'refs.autoSuggest')) {
      var editorState = this.activeComponent.state.editorState,
      selectionObj = __WEBPACK_IMPORTED_MODULE_0__utils_DraftJsHelper__["a" /* default */].getAutoSuggestSelectionRange(editorState);
      oldValue = selectionObj.oldValue;
      selectionStart = selectionObj.selectionStart;
      selectionEnd = selectionObj.selectionEnd;
      args = [];
    } else
    {
      var inputBox = document.activeElement;
      selectionStart = inputBox.selectionStart;
      selectionEnd = inputBox.selectionEnd;
      if (!inputBox || !inputBox.value) {
        return;
      }
      oldValue = inputBox.value;
      args = [null];
    }
    try {
      newValue = oldValue.substring(0, selectionStart) +
      encodeURIComponent(oldValue.substring(selectionStart, selectionEnd)) +
      oldValue.substring(selectionEnd, oldValue.length);
    }
    catch (e) {
      return;
    }
    args.push(newValue);
    if (this.activeComponent && this.activeComponent.handleChange) {
      this.activeComponent.handleChange.apply(this.activeComponent, args);
    }
  }

  decodeURI() {
    var selectionStart, selectionEnd, oldValue, newValue, args;
    if (_.get(this.activeComponent, 'refs.autoSuggest')) {
      var editorState = this.activeComponent.state.editorState,
      selectionObj = __WEBPACK_IMPORTED_MODULE_0__utils_DraftJsHelper__["a" /* default */].getAutoSuggestSelectionRange(editorState);
      oldValue = selectionObj.oldValue;
      selectionStart = selectionObj.selectionStart;
      selectionEnd = selectionObj.selectionEnd;
      args = [];
    } else
    {
      var inputBox = document.activeElement;
      selectionStart = inputBox.selectionStart;
      selectionEnd = inputBox.selectionEnd;
      if (!inputBox || !inputBox.value) {
        return;
      }
      oldValue = inputBox.value;
      args = [null];
    }

    try {
      var newValue = oldValue.substring(0, selectionStart) +
      decodeURIComponent(oldValue.substring(selectionStart, selectionEnd)) +
      oldValue.substring(selectionEnd, oldValue.length);
    }
    catch (e) {
      return;
    }
    args.push(newValue);
    if (this.activeComponent && this.activeComponent.handleChange) {
      this.activeComponent.handleChange.apply(this.activeComponent, args);
    }
  }

  updateGlobalVariableFromContextMenu(index, selectionText) {
    let model = 'globals',
    modelId = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveGlobalsStore').id,
    activeWorkspaceId = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveWorkspaceStore').id,
    sessionId = Object(__WEBPACK_IMPORTED_MODULE_4__utils_VariableSessionHelper__["b" /* getSessionId */])(model, modelId, activeWorkspaceId);

    Object(__WEBPACK_IMPORTED_MODULE_3__modules_services_VariableSessionService__["d" /* getSessionFor */])(sessionId).
    then(session => {
      if (!session) {
        return;
      }

      let values = _.clone(session.values),
      enabledVariables = _.reject(values, { enabled: false });

      enabledVariables[index].value = selectionText;

      let data = {
        id: sessionId,
        model: model,
        modelId: modelId,
        workspace: activeWorkspaceId,
        values: values };


      let updateSessionEvent = Object(__WEBPACK_IMPORTED_MODULE_5__modules_model_event__["createEvent"])('update', 'variablesession', data);
      __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('session', 'user_edit', model);
      return Object(__WEBPACK_IMPORTED_MODULE_1__modules_pipelines_user_action__["a" /* default */])(updateSessionEvent);
    }).
    catch(err => {
      pm.logger.warn('Failed to update global value through context menu', err);
      pm.toasts.error('Something went wrong. Please check DevTools.');
    });
  }

  updateEnvironmentVariableFromContextMenu(index, selectionText) {
    let model = 'environment',
    modelId = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveEnvironmentStore').id,
    activeWorkspaceId = Object(__WEBPACK_IMPORTED_MODULE_2__stores_get_store__["getStore"])('ActiveWorkspaceStore').id,
    sessionId = Object(__WEBPACK_IMPORTED_MODULE_4__utils_VariableSessionHelper__["b" /* getSessionId */])(model, modelId, activeWorkspaceId);

    Object(__WEBPACK_IMPORTED_MODULE_3__modules_services_VariableSessionService__["d" /* getSessionFor */])(sessionId).
    then(session => {
      if (!session) {
        return;
      }

      let values = _.clone(session.values),
      enabledVariables = _.reject(values, { enabled: false });

      enabledVariables[index].value = selectionText;

      let data = {
        id: sessionId,
        model: model,
        modelId: modelId,
        workspace: activeWorkspaceId,
        values: values };


      let updateSessionEvent = Object(__WEBPACK_IMPORTED_MODULE_5__modules_model_event__["createEvent"])('update', 'variablesession', data);
      __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('session', 'user_edit', model);
      return Object(__WEBPACK_IMPORTED_MODULE_1__modules_pipelines_user_action__["a" /* default */])(updateSessionEvent);
    }).
    catch(err => {
      pm.logger.warn('Failed to update session through context menu', err);
      pm.toasts.error('Something went wrong. Please check DevTools.');
    });
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3664:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_draft_js_lib_getContentStateFragment__ = __webpack_require__(570);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_draft_js_lib_getContentStateFragment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_draft_js_lib_getContentStateFragment__);
let

DraftJsHelper = class DraftJsHelper {
  getAutoSuggestSelectionRange(editorState) {
    var fragment = __WEBPACK_IMPORTED_MODULE_0_draft_js_lib_getContentStateFragment___default()(editorState.getCurrentContent(), editorState.getSelection()),
    oldValue = editorState.getCurrentContent().getPlainText(),
    selectedValue = fragment // eslint-disable-line lodash/prefer-lodash-method
    .map(block => {
      return block.getText();
    }).join('\n'),
    selectionStart = oldValue.indexOf(selectedValue),
    selectionEnd = selectionStart + selectedValue.length;
    return {
      oldValue,
      selectionStart,
      selectionEnd };

  }};


/* harmony default export */ __webpack_exports__["a"] = (new DraftJsHelper());

/***/ }),

/***/ 3665:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectionClipboard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_pipelines_user_action__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__ = __webpack_require__(40);

let

CollectionClipboard = class CollectionClipboard {
  cutItem(item, collectionId) {
    if (_.isEmpty(item)) {
      return;
    }
    this.clipboard = {
      id: item.id,
      type: item.type,
      collectionId: collectionId,
      action: 'cut' };

  }

  copyItem(item, collectionId) {
    if (_.isEmpty(item)) {
      return;
    }
    this.clipboard = {
      id: item.id,
      type: item.type,
      collectionId: collectionId,
      action: 'copy' };

  }

  async pasteItem(destination) {
    let source = this.getClipboard();

    if (_.isEmpty(source)) {
      return;
    }

    if (source.action === 'cut') {
      this.clearClipboard();
      let moveEvent = {};

      if (destination.type === 'request' && source.type === 'request') {
        moveEvent = {
          name: 'move',
          namespace: 'request',
          data: {
            model: 'request',
            request: { id: source.id },
            after: {
              model: destination.type,
              modelId: destination.id } } };



      } else

      if (_.includes(['collection', 'folder'], destination.type) && _.includes(['request', 'folder'], source.type)) {
        moveEvent = {
          name: 'move',
          namespace: source.type,
          data: {
            model: source.type,
            [source.type]: { id: source.id },
            target: {
              model: destination.type,
              modelId: destination.id } } };



      } else
      if (destination.type === 'request' && source.type === 'folder') {
        let destinationRequest = await __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getRequest({ id: destination.id });

        moveEvent = {
          name: 'move',
          namespace: source.type,
          data: {
            model: source.type,
            [source.type]: { id: source.id },
            target: {
              model: destinationRequest.folder ? 'folder' : 'collection',
              modelId: destinationRequest.folder ? destinationRequest.folder : destinationRequest.collection } } };



      }
      if (!_.isEmpty(moveEvent)) {
        Object(__WEBPACK_IMPORTED_MODULE_0__modules_pipelines_user_action__["a" /* default */])(moveEvent).
        then(response => {
          if (!_.isEmpty(_.get(response, 'error'))) {
            pm.logger.error(`Error while moving ${source.type} ${destination.type}`, response.error);
            return;
          }
        }).
        catch(err => {
          pm.logger.error(`Error in pipeline while moving ${source.type} ${destination.type}`, err);
        });
      }
    } else
    if (source.action === 'copy') {
      this.clearClipboard();
      let duplicateEvent = {};

      if (destination.type === 'request' && _.includes(['request', 'folder'], source.type)) {
        let destinationRequest = await __WEBPACK_IMPORTED_MODULE_1__modules_controllers_CollectionController__["a" /* default */].getRequest({ id: destination.id });
        duplicateEvent = {
          name: 'duplicate',
          namespace: source.type,
          data: {
            model: source.type,
            [source.type]: { id: source.id },
            target: {
              model: destinationRequest.folder ? 'folder' : 'collection',
              modelId: destinationRequest.folder ? destinationRequest.folder : destinationRequest.collection } } };



      } else

      if (_.includes(['folder', 'collection'], destination.type) && _.includes(['folder', 'request'], source.type)) {
        duplicateEvent = {
          name: 'duplicate',
          namespace: source.type,
          data: {
            model: source.type,
            [source.type]: { id: source.id },
            target: {
              model: destination.type,
              modelId: destination.id } } };



      }

      if (!_.isEmpty(duplicateEvent)) {
        Object(__WEBPACK_IMPORTED_MODULE_0__modules_pipelines_user_action__["a" /* default */])(duplicateEvent).
        then(response => {
          if (!_.isEmpty(_.get(response, 'error'))) {
            pm.logger.error(`Error while duplicating ${source.type} on ${destination.type}`, response.error);
            return;
          }
        }).
        catch(err => {
          pm.logger.error(`Error in pipeline while duplicating ${source.type} on ${destination.type}`, err);
        });
      }
    }
  }

  getClipboard() {
    return this.clipboard;
  }

  clearClipboard() {
    this.clipboard = null;
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3667:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_async_series___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_async_series__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bootStore__ = __webpack_require__(1022);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bootShortcuts__ = __webpack_require__(1023);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bootSyncProxy__ = __webpack_require__(1024);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bootConsoleInterface__ = __webpack_require__(1026);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_UIZoom__ = __webpack_require__(1028);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__controllers_ProxyListManager__ = __webpack_require__(1029);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_AppUpdateNotifier__ = __webpack_require__(3669);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_tcp_ElectronTCPReader__ = __webpack_require__(3671);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_requests_CertificateManager__ = __webpack_require__(1030);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_ProtocolHandler__ = __webpack_require__(3672);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_base_XPaths_XPathManager__ = __webpack_require__(784);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_ModelEventToUIEventService__ = __webpack_require__(3673);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__models_InterceptorManager__ = __webpack_require__(3674);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__models_InterceptorInstaller__ = __webpack_require__(1774);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__models_InterceptorBridge__ = __webpack_require__(620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__models_InterceptorBridge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__models_InterceptorBridge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__services_UIEventServiceHandler__ = __webpack_require__(3675);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_AccessControl_DbRollbackService__ = __webpack_require__(1032);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__bootAPIDevInterface__ = __webpack_require__(3676);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_CloudProxyHandler__ = __webpack_require__(3679);





















/**
                                                                   *
                                                                   * @param {*} cb
                                                                   */
function bootRequester(cb) {
  __WEBPACK_IMPORTED_MODULE_0_async_series___default()([
  __WEBPACK_IMPORTED_MODULE_1__bootStore__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_2__bootShortcuts__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_3__bootSyncProxy__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_4__bootConsoleInterface__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_18__bootAPIDevInterface__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_10__models_ProtocolHandler__["a" /* default */].initialize,
  next => {
    Object(__WEBPACK_IMPORTED_MODULE_17__services_AccessControl_DbRollbackService__["a" /* initializeRollbackNotifications */])();
    next();
  }],
  err => {
    _.assign(window.pm, {
      proxyListManager: new __WEBPACK_IMPORTED_MODULE_6__controllers_ProxyListManager__["a" /* default */](), // [settings]
      certificateManager: new __WEBPACK_IMPORTED_MODULE_9__models_requests_CertificateManager__["a" /* default */](), // [settings]
      uiZoom: new __WEBPACK_IMPORTED_MODULE_5__controllers_UIZoom__["a" /* default */](), // [settings]
      updateNotifier: new __WEBPACK_IMPORTED_MODULE_7__models_AppUpdateNotifier__["a" /* default */](), // [appwindow, settings, app]
      tcpReader: new __WEBPACK_IMPORTED_MODULE_8__models_tcp_ElectronTCPReader__["a" /* default */](), // [settings, appwindow]
      interceptorManager: new __WEBPACK_IMPORTED_MODULE_13__models_InterceptorManager__["a" /* default */](),
      interceptorBridge: __WEBPACK_IMPORTED_MODULE_15__models_InterceptorBridge___default.a,
      interceptorInstaller: new __WEBPACK_IMPORTED_MODULE_14__models_InterceptorInstaller__["a" /* default */](),
      xPathManager: __WEBPACK_IMPORTED_MODULE_11__components_base_XPaths_XPathManager__["a" /* default */],
      cloudProxyHandler: new __WEBPACK_IMPORTED_MODULE_19__services_CloudProxyHandler__["a" /* default */]() });


    __WEBPACK_IMPORTED_MODULE_12__services_ModelEventToUIEventService__["a" /* default */].initialize();
    __WEBPACK_IMPORTED_MODULE_16__services_UIEventServiceHandler__["a" /* default */].init();
    pm.appWindow.sendToElectron({ event: 'postmanInitialized' }); // Initialize protocol handline need revisit

    err ? pm.logger.error('Requester~boot - Failed', err) : pm.logger.info('Requester~boot - Success');
    return cb && cb(err);
  });
}

/* harmony default export */ __webpack_exports__["a"] = (bootRequester);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3669:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_AppSettingsDefaults__ = __webpack_require__(616);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_services_APIService__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_HttpService__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_AppReleaseService__ = __webpack_require__(1322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_controllers_CurrentUserController__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_ShellHelper__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_domain__ = __webpack_require__(3670);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_domain___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_domain__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__constants_InfobarConstants__ = __webpack_require__(420);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__controllers_Infobar__ = __webpack_require__(777);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_backbone__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_backbone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_backbone__);














const APP_UPDATE = 'appUpdate',
APP_UPDATE_EVENTS = 'app-update-events',
CHECK_FOR_ELECTRON_VERSION_UPDATED = 'checkForElectronVersionUpdated',
UPDATE_ELECTRON = 'updateElectron',
APPLY_ELECTRON_UPDATE = 'applyElectronUpdate',

ELECTRON_UPDATE_ERROR = 'electronAppUpdateError',
ELECTRON_UPDATE_NOT_AVAILABLE = 'electronAppUpdateNotAvailable',
ELECTRON_UPDATE_DOWNLOADED = 'electronAppUpdateDownloaded',
CHECK_FOR_ELECTRON_VERSION_UPDATE = 'checkForElectronVersionUpdate',
CHECK_FOR_ELECTRON_UPDATE = 'checkForElectronUpdate',
ELECTRON_VERSION_UPDATED = 'electronVersionUpdated';


const AUTO_UPDATE_TIMER = 24 * 3600 * 1000, // 24 hours
NO_UPDATE_BANNER_TIMEOUT = 7 * 24 * 3600 * 1000, // A week
NOT_UPDATED_BANNER_ID = 'not-updated-banner',
NOT_UPDATED_MESG = {
  _id: NOT_UPDATED_BANNER_ID, // not using id since that will be overridden
  message: 'An update has been downloaded for Postman. Restart now to install the update.',
  priority: 80,
  type: __WEBPACK_IMPORTED_MODULE_10__constants_InfobarConstants__["c" /* SUCCESS */],
  isDismissable: true,
  primaryAction: {
    label: 'Restart',
    onClick: () => {
      pm.updateNotifier.applyUpdate();
      __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app', 'app_restart', 'restart_banner');
    } },

  onDismiss: function (params) {
    __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app', 'dismiss_update_restart_banner');
  } },

PUBLIC_CHANNELS = ['prod', 'canary'];

var semver = __webpack_require__(903),
AppUpdateNotifier = __WEBPACK_IMPORTED_MODULE_12_backbone___default.a.Model.extend({
  defaults: function () {
    return {
      status: 'idle',
      initialized: false,
      data: null,
      releaseNotes: null,
      isAutoDownloaded: false,
      isUpdateEnabled: true };

  },
  initialize: function () {
    this.set('isUpdateEnabled', pm.app.get('isUpdateEnabled'));

    // Disable if the flag is set but only if it is not a public facing channel
    // Used while running integration tests
    if (pm.env.DISABLE_UPDATES && !_.includes(PUBLIC_CHANNELS, window.RELEASE_CHANNEL)) {
      return;
    }

    if (!this.get('isUpdateEnabled')) {
      pm.logger.info('Updater bailed! Running on Snap!');
      return;
    }

    // initialization should be idempotent
    if (this.get('initialized')) {
      return;
    }
    this.set('initialized', true);

    // migrate existing data
    if (pm.settings.getSetting('autoDownloadUpdateStatus') === 0) {
      pm.settings.setSetting('autoDownloadUpdateStatus', __WEBPACK_IMPORTED_MODULE_0__constants_AppSettingsDefaults__["a" /* default */].autoDownload.MINOR);
    }
    this.updaterEventBus = pm.eventBus.channel(APP_UPDATE_EVENTS);
    this.attachUpdaterEventsListeners();

    this.checkForVersionUpdate();

    this.version = pm.app.get('version');
    this.appId = pm.app.get('installationId');
    this.userAgent = navigator.userAgent;
    this.platform = this.getPlatform();
    this.arch = this.getArch();
    this.updateServerDomain = postman_update_server_url;

    setTimeout(() => {
      navigator.onLine && this.updateHandler();
    }, 10000); // After 10 sec

    setInterval(() => {
      // If an update is already downloaded don't check for new updates
      if (this.get('status') === 'downloaded') {
        // Show the banner if user has not restarted app for a week
        const hasCrossedNoUpdateTimeout = Date.now() - this.get('downloadedTimestamp') > NO_UPDATE_BANNER_TIMEOUT,
        isBannerAlreadyOpen = _.find(__WEBPACK_IMPORTED_MODULE_11__controllers_Infobar__["a" /* default */].infoList, { _id: NOT_UPDATED_BANNER_ID }); // same banner is already shown, don't show another

        if (hasCrossedNoUpdateTimeout && !isBannerAlreadyOpen) {
          __WEBPACK_IMPORTED_MODULE_11__controllers_Infobar__["a" /* default */].add(NOT_UPDATED_MESG);
          __WEBPACK_IMPORTED_MODULE_11__controllers_Infobar__["a" /* default */].show();
          __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app', 'show_update_restart_banner');
        }

        return;
      }

      navigator.onLine && this.updateHandler();
    }, AUTO_UPDATE_TIMER);
  },

  checkForVersionUpdate() {
    this.updaterEventBus.publish(Object(__WEBPACK_IMPORTED_MODULE_8__modules_model_event__["createEvent"])(CHECK_FOR_ELECTRON_VERSION_UPDATED, APP_UPDATE));
  },

  attachUpdaterEventsListeners() {
    this.updaterEventBus.subscribe((event = {}) => {
      console.log('App updater event', event); // Logging intentionally

      let eventName = event.name;
      if (eventName === ELECTRON_UPDATE_NOT_AVAILABLE) {
        this.noUpdateFound();
        return;
      }
      if (eventName === ELECTRON_UPDATE_ERROR) {
        this.onUpdateError(event.data);
        return;
      }
      if (eventName === ELECTRON_UPDATE_DOWNLOADED) {
        this.onUpdateDownloaded();
        return;
      }

      if (eventName === ELECTRON_VERSION_UPDATED) {
        this.notifyVersionUpdate(event.data);
        return;
      }

      if (eventName === CHECK_FOR_ELECTRON_UPDATE) {
        this.checkForUpdates(true);
        __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app', 'check_update', 'menu');
        return;
      }
    });
  },

  updateHandler() {
    // populate release notes for current version
    this.fetchReleaseNotes();
    this.checkForUpdates();
  },

  getArch: function () {
    let platform = navigator.platform;

    if (platform === 'Win32' || platform === 'Win64') {
      let userAgent = navigator.userAgent;

      if (_.includes(userAgent, 'WOW64') || _.includes(userAgent, 'Win64')) {
        return '64';
      }

      return '32';
    }

    if (_.includes(platform, 'Linux')) {
      if (_.includes(platform, '64')) {
        return '64';
      }

      return '32';
    }

    return '64';
  },

  getPlatform: function () {
    let platform = navigator.platform;

    if (platform === 'Win32' || platform === 'Win64') {
      let userAgent = navigator.userAgent;

      if (_.includes(userAgent, 'WOW64') || _.includes(userAgent, 'Win64')) {
        return 'WIN64';
      }

      return 'WIN32';
    }

    if (_.includes(platform, 'Linux')) {
      return 'LINUX';
    }

    return 'OSX';
  },

  onUpdateError: function (eventData = {}) {
    let error = eventData.error,
    label = this.get('isAutoDownloaded') ? 'auto_update' : 'manual_update';

    this.set({
      status: 'error',
      data: null,
      releaseNotes: null });

    pm.logger.error('Error in update flow: ' + JSON.stringify(error));
    __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app', 'error', label);
  },

  applyUpdate: function () {
    this.set({ status: 'applying' });

    // Sending through bus is not recommended here
    // As, the app quits in this case which triggers a crash at times
    __WEBPACK_IMPORTED_MODULE_7__utils_ShellHelper__["a" /* default */].sendToMain(APPLY_ELECTRON_UPDATE);
  },

  onUpdateDownloaded: function () {
    this.set({
      status: 'downloaded',
      downloadedTimestamp: Date.now() });

    pm.mediator.trigger('closeSettingsModal');
    !this.get('isAutoDownloaded') && pm.mediator.trigger('showUpdateModal');
  },

  notifyVersionUpdate: function (data = {}) {
    setTimeout(() => {
      let currentVersion = data.currentVersion,
      currentPlatform = window.process.platform + '-' + window.process.arch;

      // Show alert message
      pm.toasts.success('Successfully updated to version ' + currentVersion);

      // Send analytics event
      __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app', 'updated', null, null, null, { noActiveWorkspace: true });

      // Notify update information to the server.
      __WEBPACK_IMPORTED_MODULE_5__modules_controllers_CurrentUserController__["a" /* default */].
      get().
      then((user = {}) => {
        Object(__WEBPACK_IMPORTED_MODULE_1__modules_services_APIService__["l" /* NotifyServerOfVersionChange */])(user, currentVersion + '-' + currentPlatform);
      });
    }, 5000);
  },

  downloadUpdate: function (isSilent = false, options = {}) {

    this.set({
      status: 'downloading',
      isAutoDownloaded: _.isBoolean(isSilent) ? isSilent : false });

    this.getAdditionalParams(params => {
      let data = this.get('data'),
      eventPayload = {
        channel: __WEBPACK_IMPORTED_MODULE_4__services_AppReleaseService__["a" /* default */].getReleaseChannel(),
        version: this.version,
        downloadVersion: this.downloadVersion,
        appId: this.appId,
        userAgent: this.userAgent,
        platform: this.platform,
        arch: this.arch,
        downloadURL: options.downloadURL || data && data.url,
        updateServerDomain: this.updateServerDomain,
        additionalParamsString: params };

      __WEBPACK_IMPORTED_MODULE_5__modules_controllers_CurrentUserController__["a" /* default */].
      get().
      then((user = {}) => {
        _.assign(eventPayload, { userId: user.id });
        this.updaterEventBus.publish(Object(__WEBPACK_IMPORTED_MODULE_8__modules_model_event__["createEvent"])(UPDATE_ELECTRON, APP_UPDATE, eventPayload));
      }).
      catch(e => {
        this.updaterEventBus.publish(Object(__WEBPACK_IMPORTED_MODULE_8__modules_model_event__["createEvent"])(UPDATE_ELECTRON, APP_UPDATE, eventPayload));
      });
    });
  },

  noUpdateFound: function () {
    this.set({
      status: 'updateNotAvailable',
      data: null });

  },

  updateFoundWithVersion: function (data) {
    this.set({
      status: 'updateAvailable',
      data: data,
      releaseNotes: null });

    this.fetchReleaseNotes();
  },

  shouldAutoDownload: function (version) {
    let versionDiff = 'major', // Also the reason for keeping the fail proof, hence defaults to major
    autoDownloadUpdateStatus = pm.settings.getSetting('autoDownloadUpdateStatus') || __WEBPACK_IMPORTED_MODULE_0__constants_AppSettingsDefaults__["a" /* default */].autoDownload.MINOR;

    try {
      versionDiff = semver.diff(pm.app.get('version'), version);
    }

    // throws exception in case of wrong version from ARS. should not be the case as ARS also uses semver,
    // happens only if the data.version node is not available.
    catch (e) {
      console.log(e);
    } finally
    {
      if (autoDownloadUpdateStatus === __WEBPACK_IMPORTED_MODULE_0__constants_AppSettingsDefaults__["a" /* default */].autoDownload.MINOR) {
        return ['minor', 'preminor', 'patch', 'prepatch', 'prerelease'].includes(versionDiff);
      }
      return autoDownloadUpdateStatus === __WEBPACK_IMPORTED_MODULE_0__constants_AppSettingsDefaults__["a" /* default */].autoDownload.ALL;
    }
  },

  getAdditionalParams: function (cb) {
    __WEBPACK_IMPORTED_MODULE_5__modules_controllers_CurrentUserController__["a" /* default */].
    get().
    then((user = {}) => {
      let deviceInfo = pm.app && pm.app.getDeviceInfo(),
      userId = _.toString(user.id) || '0',

      // @todo: until ars starts reading syncEnabled info from service send this flag
      // this flag may or may not be accurate
      syncEnabled = user.syncEnabled || false,
      teamPlan = _.get(user, 'organizations.0.plan', '');

      cb && cb([
      `installationId=${_.get(deviceInfo, 'id')}`,
      `userId=${userId}`,
      `syncEnabled=${syncEnabled}`,
      `teamPlan=${teamPlan}`].
      join('&'));
    }).
    catch(e => {

      // Don't block if anything fails.
      return '';
    });
  },

  getUpdateStatusURL: function (cb) {
    this.getAdditionalParams(params => {
      let updateChannel = __WEBPACK_IMPORTED_MODULE_4__services_AppReleaseService__["a" /* default */].getReleaseChannel(),
      appReleaseServerEndpoint = postman_update_server_url + 'update/status?' + [
      `channel=${updateChannel}`,
      `currentVersion=${this.version}`,
      `arch=${this.arch}`,
      `platform=${this.platform.toLowerCase()}`,
      params].
      join('&');

      cb && cb(appReleaseServerEndpoint);
    });
  },

  releaseNotesEndpoint: function (cb) {
    this.getAdditionalParams(params => {
      let updateChannel = __WEBPACK_IMPORTED_MODULE_4__services_AppReleaseService__["a" /* default */].getReleaseChannel();
      cb && cb(postman_update_server_url + 'api/version/notes?' + [
      `from=${this.version}`,
      `channel=${updateChannel}`,
      `platform=${this.platform.toLowerCase()}`,
      params].
      join('&'));
    });
  },

  fetchReleaseNotes: function () {
    this.releaseNotesEndpoint(url => {
      __WEBPACK_IMPORTED_MODULE_3__utils_HttpService__["a" /* default */].request(url).then(({ body, status }) => {
        if (status === 200) {
          this.set({ releaseNotes: __WEBPACK_IMPORTED_MODULE_2__utils_util__["a" /* default */].constructReleaseNotes(body.notes) });
        }
      }).catch(error => {
        console.warn('Error while fetching releaseNotes', error);
      });
    });
  },

  checkForUpdates: function (isManual) {
    let currentStatus = this.get('status');

    this.set({
      status: 'checking',
      data: null,
      releaseNotes: null });


    if (isManual) {
      pm.mediator.trigger('closeSettingsModal');
      pm.mediator.trigger('showUpdateModal', { origin: 'manual' });
    }

    this.getUpdateStatusURL(url => {
      __WEBPACK_IMPORTED_MODULE_3__utils_HttpService__["a" /* default */].request(url).then(({ body, status }) => {
        // setting the downloaded version
        this.downloadVersion = body.version;

        if (status === 200) {
          if (!isManual && this.shouldAutoDownload(body.version)) {
            // silently download the update
            this.downloadUpdate(true, { downloadURL: body.url });
          } else {
            // either it is manual update or it is auto-update but version is major and settings is set to minor

            // show the modal for update and also show the badge over settings icon
            this.updateFoundWithVersion(body);

            // do not show this modal if the user has dismissed it already once
            if (this.get('updateModalDismissed')) {
              return;
            }

            !isManual && pm.mediator.trigger('showUpdateModal', { origin: 'auto' });
            __WEBPACK_IMPORTED_MODULE_6__modules_services_AnalyticsService__["a" /* default */].addEvent('app', 'view_update_available_modal', isManual ? 'manual' : 'auto');
          }
        } else
        if (status === 204) {
          this.noUpdateFound();
        }
      }).catch(err => {
        console.warn('Error while checking for update', err);
        this.set({
          status: 'error',
          data: null,
          releaseNotes: null });

      });
    });
  } });


/* harmony default export */ __webpack_exports__["a"] = (AppUpdateNotifier);

/**
                                   * @typedef {Object} AppUpdateNotifier~releaseNotes
                                   *
                                   * @property {String} name Version name
                                   * @property {Object} notes Release notes
                                   * @property {String[]} notes.Bugfixes bugfixes in the release
                                   * @property {String[]} notes.Improvements improvements in the release
                                   * @property {String[]} notes.Features new features in the release
                                   */
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3670:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// This file should be ES5 compatible
/* eslint prefer-spread:0, no-var:0, prefer-reflect:0, no-magic-numbers:0 */


module.exports = function () {
	// Import Events
	var events = __webpack_require__(37);

	// Export Domain
	var domain = {};
	domain.createDomain = domain.create = function () {
		var d = new events.EventEmitter();

		function emitError(e) {
			d.emit('error', e);
		}

		d.add = function (emitter) {
			emitter.on('error', emitError);
		};
		d.remove = function (emitter) {
			emitter.removeListener('error', emitError);
		};
		d.bind = function (fn) {
			return function () {
				var args = Array.prototype.slice.call(arguments);
				try {
					fn.apply(null, args);
				}
				catch (err) {
					emitError(err);
				}
			};
		};
		d.intercept = function (fn) {
			return function (err) {
				if (err) {
					emitError(err);
				} else
				{
					var args = Array.prototype.slice.call(arguments, 1);
					try {
						fn.apply(null, args);
					}
					catch (err) {
						emitError(err);
					}
				}
			};
		};
		d.run = function (fn) {
			try {
				fn();
			}
			catch (err) {
				emitError(err);
			}
			return this;
		};
		d.dispose = function () {
			this.removeAllListeners();
			return this;
		};
		d.enter = d.exit = function () {
			return this;
		};
		return d;
	};
	return domain;
}.call(this);

/***/ }),

/***/ 3671:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_pipelines_user_action__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_controllers_CurrentUserController__ = __webpack_require__(65);




let

ElectronTCPReader = class ElectronTCPReader {

  constructor() {

    _.assign(this, {
      socketId: null,
      socketInfo: null,
      port: '5005',
      target_type: 'history',
      target_id: '',
      status: 'disconnected',
      filters: {
        url: '',
        url_disabled: '',
        methods: '',
        status_codes: '',
        content_type: '' } });



    let readerSettings = localStorage.getItem('readerSettings'),
    readerSettingsJSON = null;
    try {
      if (!_.isEmpty(readerSettings)) {
        readerSettingsJSON = JSON.parse(readerSettings);
      }
    }

    catch (e) {
      pm.logger.error('Error in parsing proxy settings');
    } finally
    {
      if (!_.isEmpty(readerSettingsJSON)) {
        _.assign(this, _.pick(readerSettingsJSON, ['port', 'target_type', 'target_id', 'filters']));
      }
    }

    pm.appWindow.trigger('registerInternalEvent', 'proxyRequestCaptured', this.onProxyRequestCaptured, this);
    pm.appWindow.trigger('registerInternalEvent', 'proxyClosed', this.onProxyClosed, this);

    pm.appWindow.trigger('registerInternalEvent', 'proxyNotif', this.onProxyNotif, this);
  }

  save() {
    localStorage.setItem('readerSettings', JSON.stringify(_.pick(this, ['port', 'target_type', 'target_id', 'filters'])));
  }

  onProxyClosed() {
    this.stopListening();
    this.status = 'disconnected';
    pm.trigger('proxyStatusChanged', this.status);
  }

  onProxyNotif(action, result) {
    if (action == 'start') {
      pm.mediator.trigger(
      result == 'success' ? 'proxyStartSuccess' : 'proxyStartFailure');

    } else
    if (action == 'stop') {
      pm.mediator.trigger(
      result == 'success' ? 'proxyStopSuccess' : 'proxyStopFailure');

    }
  }

  onProxyRequestCaptured(requestObject) {
    var url = requestObject.url,
    method = requestObject.method,
    headers = requestObject.headers,
    data = requestObject.data;

    requestObject = {
      url: url,
      method: method,
      headers: headers,
      data: data,
      name: url };


    console.log('Recd request from proxy: ' + url + ', ' + method);
    this.addRequestObject(requestObject);
  }

  isAllowed(request, filters) {

    var methods;

    // Captured request URL should contain the URL in the proxy 'URL Contains' filter
    if (filters.url && filters.url.trim() && request.url.search(filters.url.trim()) < 0) {
      return false;
    }

    // Captured request URL should not contain the URL in the 'URL Does not Contain' filter
    if (filters.url_disabled && filters.url_disabled.trim() && request.url.search(filters.url_disabled.trim()) >= 0) {
      return false;
    }

    methods = filters.methods ? filters.methods.split(',') : [];

    methods = methods.map(method => {
      return method.trim().toUpperCase();
    }).filter(method => {
      return method.length > 0;
    });

    methods = _.uniq(methods);

    // Captured request method should belong to proxy 'Methods' filters (if any)
    if (methods.length > 0 && !methods.includes(request.method.toUpperCase())) {
      return false;
    }

    return true;
  }

  checkTarget(id) {
    var collections = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('ActiveWorkspaceStore').collections,
    collection = _.find(collections, item => {return item.id === id;}),
    editPermission = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('PermissionStore').can('edit', 'collection', id);

    return collection && editPermission;
  }

  addRequestObject(request) {
    var target_type = this.target_type,
    collection,
    target_id,
    filters = this.filters;

    // console.log("Settings are", this.toJSON());
    if (this.isAllowed(request, filters)) {
      // modify request for sync
      let headerData = [];
      request.headerData = _.map(_.keys(request.headers), key => {
        return {
          key,
          value: request.headers[key] };

      });

      if (request.data) {
        request.dataMode = 'raw';
      }

      if (_.find(headerData, { value: 'application/x-www-form-urlencoded' })) {
        request.dataMode = 'urlencoded';
        request.data = __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].unpackUrlEncodedData(request.data);
      }

      if (this.checkTarget(this.target_id)) {
        __WEBPACK_IMPORTED_MODULE_4__modules_controllers_CurrentUserController__["a" /* default */].
        get().
        then(user => {
          target_id = this.target_id;

          _.assign(request, {
            id: __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].guid(),
            collection: target_id,
            owner: user.id });


          let requestCreateEvent = {
            name: 'create_deep',
            namespace: 'request',
            data: { request },
            target: {
              model: 'collection',
              modelId: target_id } };


          Object(__WEBPACK_IMPORTED_MODULE_1__modules_pipelines_user_action__["a" /* default */])(requestCreateEvent).
          then(response => {
            if (!_.isEmpty(_.get(response, 'error'))) {
              pm.logger.error('Error in creating collection from tcp', response.error);
              return;
            }
          });
        }).
        catch(err => {
          pm.logger.error('Error while creating collection from tcp', err);
        });
      } else
      {
        __WEBPACK_IMPORTED_MODULE_4__modules_controllers_CurrentUserController__["a" /* default */].
        get().
        then(user => {
          if (!user) {
            pm.logger.error(new Error('ElectronTCPReader: Could not create history. Current user is missing.'));
            return;
          }

          let currentDate = new Date(),
          workspace = Object(__WEBPACK_IMPORTED_MODULE_3__stores_get_store__["getStore"])('ActiveWorkspaceSessionStore').workspace,
          historyCreateEvent = Object(__WEBPACK_IMPORTED_MODULE_2__modules_model_event__["createEvent"])(
          'create',
          'history',
          _.assign({}, request, { id: __WEBPACK_IMPORTED_MODULE_0__utils_util__["a" /* default */].guid(), createdAt: currentDate.toISOString(), workspace, owner: user.id, lastUpdatedBy: user.id }));


          return Object(__WEBPACK_IMPORTED_MODULE_1__modules_pipelines_user_action__["a" /* default */])(historyCreateEvent).
          catch(e => {console.log('Error in creating history through proxy', e);});
        });
      }
    }
  }

  startListening() {
    var model = this;

    var portToUse = this.port;

    pm.appWindow.sendToElectron({
      event: 'startProxy',
      data: { port: portToUse } });


    this.status = 'connected';
    pm.mediator.trigger('proxyStatusChanged', this.status);

  }

  stopListening() {
    pm.appWindow.sendToElectron({
      event: 'stopProxy',
      data: {} });

    this.status = 'disconnected';
    pm.mediator.trigger('proxyStatusChanged', this.status);
  }

  connect() {
    this.startListening();
    this.status = 'connected';
    pm.mediator.trigger('proxyStatusChanged', this.status);
  }

  disconnect() {
    this.stopListening();
    this.status = 'disconnected';
    pm.mediator.trigger('proxyStatusChanged', this.status);
    let interceptor = document.getElementsByClassName('icon-navbar-interceptor')[0];
    !_.isEmpty(interceptor) && interceptor.classList.remove('active');
  }};


/* harmony default export */ __webpack_exports__["a"] = (ElectronTCPReader);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3672:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__apinetwork_controllers_APINetworkImporter__ = __webpack_require__(904);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_controllers_WindowController__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_controllers_WindowController___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__common_controllers_WindowController__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_services_AnalyticsService__ = __webpack_require__(16);
var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};




const POSTMAN_PROTOCOL = 'postman:',

/**
                                      * Map for model and action in postman URL to its handler function.
                                      * New handleres can be registered here.
                                      */
ACTION_HANDLER_MAP = {
  'collections': {
    'import': function () {
      return __WEBPACK_IMPORTED_MODULE_1__apinetwork_controllers_APINetworkImporter__["a" /* default */];
    } },

  'oauth2': {
    'callback': function () {
      return urlData => {
        __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].send('oauth2Callback', urlData);
      };
    } } };



const ProtocolHandler = {
  initialize: function (cb) {
    let channel = pm.eventBus.channel('protocol-handler');
    channel.subscribe(ProtocolHandler.onProtocolEvent);

    cb && cb(null);
  },

  onProtocolEvent: function (params) {
    __WEBPACK_IMPORTED_MODULE_2__common_controllers_WindowController___default.a.getCurrentWindow().
    then(window => {
      let currentWindowId = window.id;

      if (currentWindowId !== params.windowId) return;

      ProtocolHandler.handleProtocolUrl(params.url);
    });
  },

  /**
      * Creates url object for given url
      *
      * @param {string} url returns the string
      */
  getURLObject: function (url) {
    return new URL(url);
  },

  /**
      * Validates the postman URL structure and routing to specific handler function based on
      * action in URL. The format of URL should be in
      *
      * postman://app/<model>/<action>/<entityId>?<query_params>#URL_hash
      *
      * @param {string} url Custom protocol URL
      */
  handleProtocolUrl: async function (url) {
    let urlObject,
    urlParts,
    urlData,
    traceId,
    protocolHandler;

    try {
      urlObject = ProtocolHandler.getURLObject(url),
      traceId = urlObject.searchParams.get('traceId');

      if (_.get(urlObject, 'protocol') !== POSTMAN_PROTOCOL) {
        throw new Error('ProtocolHandler~handleProtocolUrl: Incorrect Protocol, url: ' + url);
      }

      urlParts = urlObject.pathname.slice(2).split('/');

      if (_.get(urlParts, '[0]') !== 'app') {
        throw new Error('ProtocolHandler~handleProtocolUrl: Incorrect URL format, url: ' + url);
      }

      __WEBPACK_IMPORTED_MODULE_3__modules_services_AnalyticsService__["a" /* default */].addEventV2(_extends({
        category: 'postman_protocol',
        action: 'parse_url',
        label: 'success',
        entityType: 'model' },
      traceId && { traceId }));

    } catch (e) {
      pm.logger.error(e);

      __WEBPACK_IMPORTED_MODULE_3__modules_services_AnalyticsService__["a" /* default */].addEventV2(_extends({
        category: 'postman_protocol',
        action: 'parse_url',
        label: 'failure',
        entityType: 'model' },
      traceId && { traceId }));


      return Promise.reject(e);
    }

    try {
      urlData = {
        model: urlParts[1],
        action: urlParts[2],
        entityId: urlParts[3],
        queryString: urlObject.search,
        hash: urlObject.hash,
        urlObject };


      protocolHandler = _.get(ACTION_HANDLER_MAP, [urlData.model, urlData.action]);

      if (!_.isFunction(protocolHandler)) {
        throw new Error('ProtocolHandler~handleProtocolUrl: Incorrect Action, url: ' + url);
      }

      __WEBPACK_IMPORTED_MODULE_3__modules_services_AnalyticsService__["a" /* default */].addEventV2(_extends({
        category: 'postman_protocol',
        action: 'find_handler',
        label: 'success',
        entityType: 'model' },
      traceId && { traceId }));


      await protocolHandler()(urlData);
    } catch (e) {
      pm.logger.error(e);

      if (_.isString(e.message) && e.message.includes('ProtocolHandler~handleProtocolUrl: Incorrect Action')) {
        __WEBPACK_IMPORTED_MODULE_3__modules_services_AnalyticsService__["a" /* default */].addEventV2(_extends({
          category: 'postman_protocol',
          action: 'find_handler',
          label: 'failure',
          entityType: 'model' },
        traceId && { traceId }));

      }

      return Promise.reject(e);
    }
  } };


/* harmony default export */ __webpack_exports__["a"] = (ProtocolHandler);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3673:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_async___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_async__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__UIEventService__ = __webpack_require__(141);





let allowedEvents = [
'created', 'updated', 'deleted', 'duplicated', 'shared', 'favorited', 'unfavorited',
'joined', 'left', 'added_dependencies', 'removed_dependencies', 'requestDispatched', 'responseMetaReceived',
'authenticated', 'skip', 'createdOnSync'],

modelEventHandlers = {
  forkedcollection: function (eventProps) {
    switch (eventProps.name) {
      case 'createdOnSync':
        return createPayload('forkCreated', eventProps.data);}

  },

  collection: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('collectionCreated', eventProps.data);
      case 'duplicated':
        return createPayload('collectionDuplicated', eventProps.data);
      case 'shared':
        return createPayload('collectionShared', eventProps.data);
      case 'favorited':
        return createPayload('collectionFavorited', eventProps.data);
      case 'unfavorited':
        return createPayload('collectionUnfavorited', eventProps.data);
      case 'deleted_deep':
        return createPayload('collectionDeleted', eventProps.data);}

  },

  environment: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('environmentCreated', eventProps.data);
      case 'duplicated':
        return createPayload('environmentDuplicated', eventProps.data);
      case 'deleted':
        return createPayload('environmentDeleted', eventProps.data);}

  },

  folder: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('folderCreated', eventProps.data);
      case 'duplicated':
        return createPayload('folderDuplicated', eventProps.data);
      case 'deleted_deep':
        return createPayload('folderDeleted', eventProps.data);}

  },

  headerpreset: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('headerpresetCreated', eventProps.data);
      case 'deleted':
        return createPayload('headerpresetDeleted', eventProps.data);}

  },

  history: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('historyCreated', eventProps.data);
      case 'deleted':
        return createPayload('historyDeleted', eventProps.data);}

  },

  response: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('exampleCreated', eventProps.data);
      case 'deleted':
        return createPayload('exampleDeleted', eventProps.data);}

  },

  request: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('requestCreated', eventProps.data);
      case 'duplicated':
        return createPayload('requestDuplicated', eventProps.data);
      case 'deleted':
        return createPayload('requestDeleted', eventProps.data);}

  },

  workspace: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('workspaceCreated', eventProps.data);
      case 'deleted':
        return createPayload('workspaceDeleted', eventProps.data);
      case 'added_dependencies':
        return createPayload('workspaceDependenciesAdded', eventProps.data);
      case 'removed_dependencies':
        return createPayload('workspaceDependenciesRemoved', eventProps.data);
      case 'joined':
        return createPayload('workspaceJoined', eventProps.data);
      case 'left':
        return createPayload('workspaceLeft', eventProps.data);}

  },

  monitor: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('monitorCreated', eventProps.data);
      case 'deleted':
        return createPayload('monitorDeleted', eventProps.data);}

  },

  mock: function (eventProps) {
    switch (eventProps.name) {
      case 'created':
        return createPayload('mockCreated', eventProps.data);
      case 'deleted':
        return createPayload('mockDeleted', eventProps.data);}

  },

  requestexecution: function (eventProps) {
    switch (eventProps.name) {
      case 'requestDispatched':
        return createPayload('requestSent', eventProps.data);
      case 'responseMetaReceived':
        return createPayload('responseMetaReceived', eventProps.data);}

  },

  authentication: function (eventProps) {
    switch (eventProps.name) {
      case 'authenticated':
        return createPayload('userSignedIn', eventProps.data);
      case 'skip':
        return createPayload('userSkippedSignIn', eventProps.data);}

  } };




const ERROR_UNSUPPORTED_ACTOR = 'UNSUPPORTED_ACTOR';

/**
                                                      * @param name {String} - Name of the event
                                                      * @param data {any} - Data associated with the event
                                                      * @param meta {object} - Any meta information associated with the event
                                                      */
function createPayload(name, data, meta) {
  return {
    name,
    data,
    meta };

}

/**
   * filter non user events
   *
   * @param {any} event
   * @param {any} callback
   */
function filterUnsupportedEvents(event, callback) {
  let actor = Object(__WEBPACK_IMPORTED_MODULE_0__modules_model_event__["getActor"])(event),
  actorType = actor && actor.type;

  // whitelist only USER actions
  if (!_.includes(['USER'], actorType)) {
    callback(new Error(ERROR_UNSUPPORTED_ACTOR));
    return;
  }

  callback(null, event);
}

/**
   * build analytics payloads from event
   *
   * @param {any} event
   * @param {any} callback
   */
function buildUIEventFromModelEvent(event, callback) {
  eventTransformer(event, (err, payloads) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, payloads);
  });
}

/**
   * queue analytic events
   *
   * @param {any} payloads
   * @param {any} callback
   */
function emitUIEvent(events, callback) {
  // bail if no payload to queue
  if (_.isEmpty(events)) {
    return callback(null);
  }

  _.each(events, event => {
    __WEBPACK_IMPORTED_MODULE_2__UIEventService__["a" /* default */].publish(event.name, event.data, event.meta);
  });
  callback(null);
}

/**
   * Job of this function is to transform events from different event buses to UIEvents
   * e.g model-event, postman-runtime.
   *
   *
   * @param event {Object} - model event
   * @param callback {function}
   */
function eventTransformer(event, callback) {
  if (!event) {
    return callback();
  }

  let payloads = [];

  Object(__WEBPACK_IMPORTED_MODULE_0__modules_model_event__["processEvent"])(event, allowedEvents, function (event, cb) {
    let namespace = Object(__WEBPACK_IMPORTED_MODULE_0__modules_model_event__["getEventNamespace"])(event),
    name = Object(__WEBPACK_IMPORTED_MODULE_0__modules_model_event__["getEventName"])(event),
    data = Object(__WEBPACK_IMPORTED_MODULE_0__modules_model_event__["getEventData"])(event),
    meta = Object(__WEBPACK_IMPORTED_MODULE_0__modules_model_event__["getEventMeta"])(event),
    handler = modelEventHandlers[namespace],
    eventProps = {
      data: data,
      name: name,
      meta: meta || {} },

    eventPayload;

    // this should never happen
    if (!handler) {
      return cb();
    }

    // convert events to payloads and accumulate
    eventPayload = handler(eventProps);
    if (!_.isEmpty(eventPayload)) {
      payloads.push(eventPayload);
    }

    return cb();
  }, function () {
    callback && callback(null, payloads);
  });
}

/**
   * handle broadcast bus event
   *
   * @param {any} event
   */
function handleBusEvent(event) {
  __WEBPACK_IMPORTED_MODULE_1_async___default.a.waterfall([
  function (callback) {
    callback(null, event);
  },

  filterUnsupportedEvents,
  buildUIEventFromModelEvent,
  emitUIEvent],
  function (err) {
    err &&
    !_.includes([ERROR_UNSUPPORTED_ACTOR], err && err.message) &&
    pm.logger.error(err);
  });
}

/**
   * @param {any} event
   */
function handleRuntimeBusEvent(event) {
  __WEBPACK_IMPORTED_MODULE_1_async___default.a.waterfall([
  function (callback) {
    callback(null, event);
  },
  buildUIEventFromModelEvent,
  emitUIEvent],
  function (err) {
    err &&
    !_.includes([ERROR_UNSUPPORTED_ACTOR], err && err.message) &&
    pm.logger.error(err);
  });
}

/**
   * @param {any} event
   */
function handleAuthHandlerEvents(event) {
  __WEBPACK_IMPORTED_MODULE_1_async___default.a.waterfall([
  function (callback) {
    callback(null, event);
  },
  buildUIEventFromModelEvent,
  emitUIEvent],
  function (err) {
    err &&
    !_.includes([ERROR_UNSUPPORTED_ACTOR], err && err.message) &&
    pm.logger.error(err);
  });
}


/**
   *
   */
/* harmony default export */ __webpack_exports__["a"] = ({
  initialize() {
    let modelEventChannel = pm.eventBus.channel('model-events'),
    runtimeEventChannel = pm.eventBus.channel('postman-runtime'),
    authHandlerEventChannel = pm.eventBus.channel('auth-handler-events');

    modelEventChannel.subscribe(handleBusEvent);
    runtimeEventChannel.subscribe(handleRuntimeBusEvent);
    authHandlerEventChannel.subscribe(handleAuthHandlerEvents);
  } });
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3674:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_util__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_pipelines_user_action__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_base64_arraybuffer__ = __webpack_require__(1031);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_base64_arraybuffer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_base64_arraybuffer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modules_controllers_CurrentUserController__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_InterceptorUtil__ = __webpack_require__(1579);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_InterceptorUtil___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__utils_InterceptorUtil__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge__ = __webpack_require__(620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__InterceptorBridge__);









const semver = __webpack_require__(903);let

InterceptorManager = class InterceptorManager {
  constructor() {

    // [INTERCEPT-15] maintaining a boolean variable to avoid multiple 'Disconnected from Interceptor' logs
    var isDisconnectedFromInterceptorBridge = false,
    isInterceptorBridgeInstalled = false,
    installationStatus = 'BRIDGE_NOT_YET_INSTALLED',
    connectionStatus,

    channel = pm.eventBus.channel('interceptor-store'),

    // store for interceptor settings
    interceptorSettingsStore = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('InterceptorSettingsStore'),

    // store for installation of interceptor installation states
    interceptorInstallationUIStore = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('InterceptorInstallationUIStore'),

    // fetching domain list in sync with Interceptor from store
    syncDomainList = interceptorSettingsStore.getSyncDomainList();

    // the ipcClient will be connected to the interceptorBridge
    // as soon as the main process of app loads
    pm.appWindow.sendToElectron({
      event: 'initializeInterceptorBridge' });


    // sending cookie sync options (domain list, enabled) to Interceptor as soon as App is connected to Interceptor
    this.enableCookieSyncFromInterceptor();

    // sending request capture options to Interceptor as soon as App is connected to Interceptor
    this.configureRequestCaptureFromInterceptor();

    // preserving state to avoid the multiple logs of KEY_MISMATCH errors
    // false once app loads, true after first KEY_MISMATCH error occurs
    interceptorSettingsStore.updateKeyMismatchSettings(false);

    // asking main to send the custom encryption key if it's set
    if (interceptorSettingsStore.customKeyInitialized) {
      pm.appWindow.sendToElectron({
        event: 'fetchCustomEncryptionKey' });

    }

    // handling events to update the interceptor store
    // to maintain the consistency across the multiple open renderer windows
    channel.subscribe(this.UIEventHandler);

    // handles the interceptor response based on their types
    pm.appWindow.trigger('registerInternalEvent', 'interceptorResponse', function (data) {
      pm.mediator.trigger('onMessageExternal', data);

      // if payload received from interceptor contains extension info,
      // we check for min version required
      // interceptor gets disconnected if min version criteria is not satisfied
      if (data.extensionInfo && data.extensionInfo.version) {
        if (semver.compare(data.extensionInfo.version, interceptorSettingsStore.minExtensionVersion) == -1) {
          console.log('Current extension is', data.extensionInfo.version, '. Min extension version required is ', interceptorSettingsStore.minExtensionVersion);

          // making interceptor disconnected if minVersion criteria is not satisfied
          interceptorSettingsStore.updateInterceptorBridgeConnectionStatus(false);

          // notifying interceptor that min version criteria is not satisfied
          pm.appWindow.sendToElectron({
            event: 'forwardInterceptorRequest',
            message: {
              type: 'REQUIRE_VERSION_UPDATE',
              postmanMessage: {
                satisfied: false,
                minExtensionVersion: interceptorSettingsStore.minExtensionVersion } } });



          interceptorSettingsStore.updateMinExtensionVersionSatisfiedFlag(false);
          interceptorSettingsStore.updateMinVersionSatisfied(false);

        } else
        {
          this.handleInterceptorResponse(data);
        }

        // the encryption UI will be shown only if version criteria satisfies
        if (semver.compare(data.extensionInfo.version, interceptorSettingsStore.minExtensionVersionForCustomEncryption) == -1) {
          interceptorSettingsStore.updateMinExtensionVersionForCustomEncryptionSatisfiedFlag(false);
        }
      } else
      {
        this.handleInterceptorResponse(data);
      }
    }, this);

    // logs the encryption key being used for App ~ Interceptor communication
    pm.appWindow.trigger('registerInternalEvent', 'fetchEncryptionKey', function (data) {
      console.log('InterceptorBridge Encryption Key : ', data.key);
    }, this);

    pm.appWindow.trigger('registerInternalEvent', 'fetchCustomEncryptionKey', function (data) {
      interceptorSettingsStore.updateCustomEncryptionKey(data.key);
    }, this);

    // logs the list of domains in sync
    pm.appWindow.trigger('registerInternalEvent', 'getSyncDomainListForInterceptor', function () {
      if (!syncDomainList) {
        console.log('InterceptorBridge : No domains found');
      } else
      {
        console.log('InterceptorBridge : Domain List ', syncDomainList);
      }
    }, this);

    // confirms interceptor bridge is connected
    pm.appWindow.trigger('registerInternalEvent', 'updateInterceptorBridgeConnectionStatus', function (msg) {
      connectionStatus = msg.data.connectedToPostman;

      // here, interceptor bridge is connected with postman app
      if (connectionStatus) {
        console.log('Connected to Interceptor');
        isDisconnectedFromInterceptorBridge = false;
        isInterceptorBridgeInstalled = true;

        // updates the connection status and installed status
        interceptorSettingsStore.updateInterceptorBridgeConnectionStatus(connectionStatus);
        interceptorSettingsStore.updateInterceptorBridgeInstallationStatus(isInterceptorBridgeInstalled);
      } else
      {
        if (!isDisconnectedFromInterceptorBridge) {
          console.log('Disconnected from Interceptor');
          isDisconnectedFromInterceptorBridge = true;
          pm.interceptorInstaller.checkInstallationStatus();
        }
      }

      // re-send cookie sync options to interceptor
      this.enableCookieSyncFromInterceptor();

      // re-send request capture options to interceptor
      this.configureRequestCaptureFromInterceptor();


    }, this);

    pm.appWindow.trigger('registerInternalEvent', 'interceptorBridgeInstallationStatusResponse', function (data) {
      if (isDisconnectedFromInterceptorBridge) {
        if (data.status.platformSpecific.os === 'MACOS') {
          if (!data.status.platformSpecific.nodeInstalled) {
            installationStatus = 'MACOS_NODE_NOT_YET_INSTALLED';
            isInterceptorBridgeInstalled = false;
          } else
          {
            if (data.status.manifestAdded && data.status.interceptorBridgeInstalled) {
              isInterceptorBridgeInstalled = true;
            } else
            {
              isInterceptorBridgeInstalled = false;
              installationStatus = 'BRIDGE_NOT_YET_INSTALLED';
            }
          }
        } else
        if (data.status.platformSpecific.os === 'WINDOWS') {
          if (data.status.manifestAdded && data.status.interceptorBridgeInstalled && data.status.platformSpecific.registryKeyAdded) {
            isInterceptorBridgeInstalled = true;
          } else
          {
            isInterceptorBridgeInstalled = false;
            installationStatus = 'BRIDGE_NOT_YET_INSTALLED';
          }
        } else
        if (data.status.platformSpecific.os === 'LINUX') {
          if (data.status.manifestAdded && data.status.interceptorBridgeInstalled) {
            isInterceptorBridgeInstalled = true;
          } else
          {
            isInterceptorBridgeInstalled = false;
            installationStatus = 'BRIDGE_NOT_YET_INSTALLED';
          }
        }
        interceptorSettingsStore.updateInterceptorBridgeInstallationStatus(isInterceptorBridgeInstalled);
        interceptorInstallationUIStore.updateInitialInstallationStatus(installationStatus);
        interceptorSettingsStore.updateInterceptorBridgeConnectionStatus(connectionStatus);
      }
    }, this);

    pm.appWindow.trigger('registerInternalEvent', 'refreshInterceptorBridgeConnectionStatus', function (msg) {
      if (msg.connectedToInterceptorBridge) {
        console.log('Connected to Interceptor');
        interceptorSettingsStore.updateInterceptorBridgeConnectionStatus(msg.connectedToInterceptorBridge);
      }
    }, this);

  }

  /**
     *
     * Updates `InterceptorSettingStore` according to the event.name.
     * The current renderer window publishes events for other open renderer windows
     * to update the store and hence UI.
     *
     * @param {Object} event contains namespace, name, data
     * Note: For interceptor settings store related events, event.namespace will always be `update-interceptor-store`
     */
  UIEventHandler(event) {
    var interceptorSettingsStore = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('InterceptorSettingsStore');
    if (event.namespace === 'update-interceptor-store') {
      if (event.name === 'enableCookieSync') {
        interceptorSettingsStore.updateCookieSyncEnabledSettings(true);
      } else
      if (event.name === 'disableCookieSync') {
        interceptorSettingsStore.updateCookieSyncEnabledSettings(false);
      } else
      if (event.name === 'updateDomainList') {
        interceptorSettingsStore.updateSyncDomainList(event.data);
      } else
      if (event.name === 'enableRequestCapture') {
        interceptorSettingsStore.updateCaptureRequestEnabledSettings(true);
      } else
      if (event.name === 'disableRequestCapture') {
        interceptorSettingsStore.updateCaptureRequestEnabledSettings(false);
      } else
      if (event.name === 'updateRequestFilters') {
        interceptorSettingsStore.updateRequestCaptureFilters(event.data);
      } else
      {
        console.log('Received unknown event', event);
      }
    }
  }

  handleInterceptorResponse(data) {
    var interceptorSettingsStore = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('InterceptorSettingsStore');
    if (data.type === 'COOKIE_DUMP') {
      if (interceptorSettingsStore.isCookieSyncEnabled()) {
        interceptorSettingsStore.updateKeyMismatchSettings(false);
        this.addCookiesToApp(data.message);
      }
    } else
    if (data.type === 'REQUIRE_VERSION_UPDATE') {
      console.log(`Min Postman App version required is ${data.postmanMessage.minAppVersion}, please upgrade Postman App`);

      // lower version of App is present, need an update
      interceptorSettingsStore.updateMinAppVersion(data.postmanMessage.minAppVersion);
      interceptorSettingsStore.updateMinExtensionVersionSatisfiedFlag(true);
      interceptorSettingsStore.updateMinVersionSatisfied(false);

      // changing the Interceptor connected status to false
      interceptorSettingsStore.updateInterceptorBridgeConnectionStatus(false);

    } else
    if (data.type === 'COOKIE_REMOVED') {
      if (interceptorSettingsStore.isCookieSyncEnabled()) {
        interceptorSettingsStore.updateKeyMismatchSettings(false);
        this.deleteCookiesFromApp(data.message);
      }
    } else
    if (data.type === 'COOKIE_UPDATED') {
      if (interceptorSettingsStore.isCookieSyncEnabled()) {
        interceptorSettingsStore.updateKeyMismatchSettings(false);
        this.addCookiesToApp(data.message);
      }
    } else
    if (data.type === 'UPDATED_DOMAIN_LIST') {
      if (interceptorSettingsStore.isCookieSyncEnabled()) {
        interceptorSettingsStore.updateKeyMismatchSettings(false);

        // updating local sync domain list
        this.syncDomainList = data.postmanMessage.syncDomainList;

        // updating store
        interceptorSettingsStore.updateAcknowledgedDomainList(data.postmanMessage.syncDomainList);

        console.log('INTERCEPTOR CONNECTIVITY: Updated domain list : ', this.syncDomainList);
      }
    } else
    if (data.type === 'ADD_DOMAIN_ACK') {
      if (interceptorSettingsStore.isCookieSyncEnabled()) {
        interceptorSettingsStore.updateKeyMismatchSettings(false);
        interceptorSettingsStore.addNewAcknowledgedDomain(data.postmanMessage.domain);
      }
    } else
    if (data.type === 'REMOVE_DOMAIN_ACK') {
      if (interceptorSettingsStore.isCookieSyncEnabled()) {
        interceptorSettingsStore.updateKeyMismatchSettings(false);
        interceptorSettingsStore.removeAcknowledgedDomain(data.postmanMessage.domain);
      }
    } else
    if (data.type === 'KEY_MISMATCH') {
      if (!interceptorSettingsStore.isKeymismatch()) {
        console.log('INTERCEPTOR CONNECTIVITY: Key mismatched between Interceptor and Postman App');
        interceptorSettingsStore.updateKeyMismatchSettings(true);
      }
    } else
    if (data.type === 'KEY_VALIDATION_RESULT') {
      var validationResults = data;

      // validation is true only if the keys are same at app and interceptor
      if (validationResults.data.validation) {
        console.log('INTERCEPTOR CONNECTIVITY: App / Interceptor encryption keys match');
        interceptorSettingsStore.updateKeyMismatchSettings(false);
      } else
      {
        console.log('INTERCEPTOR CONNECTIVITY: App / Interceptor encryption keys mismatch');
        interceptorSettingsStore.updateKeyMismatchSettings(true);
      }
    } else
    if (data.type === 'CONFIGURE_COOKIE_SYNC_ACK') {
      if (data.postmanMessage.enabled) {
        console.log('INTERCEPTOR CONNECTIVITY: Configure cookie sync acknowledged');
      } else
      {
        console.log('INTERCEPTOR CONNECTIVITY: Configure cookie sync stopped');
      }
      interceptorSettingsStore.updateKeyMismatchSettings(false);
    } else
    if (data.type === 'ENABLE_COOKIE_SYNC_ACK') {
      if (data.postmanMessage.enabled) {
        console.log('INTERCEPTOR CONNECTIVITY: Cookie Sync enabled for the domains - ', data.postmanMessage.syncDomainList);
      } else
      {
        console.log('INTERCEPTOR CONNECTIVITY: cookie sync disabled');
      }
      interceptorSettingsStore.updateKeyMismatchSettings(false);
      interceptorSettingsStore.updateAcknowledgedDomainList(data.postmanMessage.syncDomainList);

    } else
    if (data.type === 'CONFIGURE_REQUEST_CAPTURE_ACK') {
      if (data.postmanMessage.enabled) {
        console.log('INTERCEPTOR CONNECTIVITY: Capture requests enabled');
      } else
      {
        console.log('INTERCEPTOR CONNECTIVITY: Capture requests disabled');
      }
      interceptorSettingsStore.updateKeyMismatchSettings(false);
    } else
    if (data.type === 'CAPTURED_REQUEST') {
      interceptorSettingsStore.updateKeyMismatchSettings(false);
      if (interceptorSettingsStore.isRequestCaptureEnabled()) {
        this.addRequestObject(data.message.postmanMessage.request);
      }
    } else
    if (data.type === 'REQUEST_ENABLE_COOKIE_SYNC') {
      if (data.postmanMessage.enabled) {
        // Interceptor requesting to enable cookie sync
        __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge___default.a.cookieSync.enable();
      } else
      {
        // Interceptor requesting to disable cookie sync
        __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge___default.a.cookieSync.disable();
      }
    } else
    if (data.type === 'REQUEST_ADD_DOMAIN') {
      // Interceptor requesting to add a domain
      __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge___default.a.cookieSync.addDomain(data.postmanMessage.value);
    } else
    if (data.type === 'REQUEST_REMOVE_DOMAIN') {
      // Interceptor requesting to remove a domain
      __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge___default.a.cookieSync.removeDomain(data.postmanMessage.value);
    } else
    if (data.type === 'REQUEST_CONFIGURE_REQUEST_CAPTURE') {

      // updating filters if any
      if (data.postmanMessage.filters) {
        interceptorSettingsStore.updateRequestCaptureFilters({
          url: data.postmanMessage.filters.url,
          methods: data.postmanMessage.filters.method });

      }

      if (data.postmanMessage.enabled) {
        // Interceptor requesting to enable request capture
        __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge___default.a.requestCapture.enable();
      } else
      {
        // Interceptor requesting to disable request capture
        __WEBPACK_IMPORTED_MODULE_7__InterceptorBridge___default.a.requestCapture.disable();
      }
    } else
    {
      console.log(data);
    }
  }

  enableCookieSyncFromInterceptor() {

    var interceptorSettingsStore = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('InterceptorSettingsStore');

    // fetching domain list in sync with Interceptor from store
    var syncDomainList = interceptorSettingsStore.getSyncDomainList(),
    enabled = interceptorSettingsStore.isCookieSyncEnabled();

    // syncing back all cookies after App establishes connection with Interceptor bridge
    pm.appWindow.sendToElectron({
      event: 'forwardInterceptorRequest',
      message: {
        type: 'ENABLE_COOKIE_SYNC',
        postmanMessage: {
          enabled,
          syncDomainList } } });



  }

  configureRequestCaptureFromInterceptor() {
    var interceptorSettingsStore = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('InterceptorSettingsStore'),
    enabled = interceptorSettingsStore.isRequestCaptureEnabled(), // can be True or False
    filters = interceptorSettingsStore.getRequestCaptureFilters(), // fetching filters from store
    url = filters.url,
    methodArray = Object(__WEBPACK_IMPORTED_MODULE_6__utils_InterceptorUtil__["sanitize"])(filters.methods),
    captureResponse = false;

    pm.appWindow.sendToElectron({
      event: 'forwardInterceptorRequest',
      message: {
        type: 'CONFIGURE_REQUEST_CAPTURE',
        postmanMessage: {
          filters: {
            url,
            method: methodArray },

          captureResponse,
          enabled } } });




  }


  addCookiesToApp(cookies) {
    var newCookies = this.addUrlPropsToCookies(cookies),
    bulkCookies = _.map(newCookies, cookieItem => {
      return {
        url: cookieItem.url,
        host: cookieItem.domain,
        cookie: cookieItem };

    });

    // addBulkCookies also has a second parameter `callback` if required
    pm.cookieManager.addBulkCookies(bulkCookies);
  }

  addUrlPropsToCookies(cookies) {
    var url;
    for (var i = 0; i < cookies.length; i++) {
      url = '';
      if (cookies[i].secure) {
        url += 'https://';
      } else
      {
        url += 'http://';
      }
      if (cookies[i].domain.indexOf('.') === 0) {
        url += cookies[i].domain.substring(1);
      } else
      {
        url += cookies[i].domain;
      }
      url += cookies[i].path;
      cookies[i].url = url;
    }
    return cookies;
  }

  deleteCookiesFromApp(cookies) {
    var newCookies = this.addUrlPropsToCookies(cookies);
    for (var i = 0; i < newCookies.length; i++) {
      pm.cookieManager.deleteCookie(newCookies[i].domain, newCookies[i].name, newCookies[i].path, function () {
        // cookie is removed
      });
    }
  }

  checkTarget(id) {
    var collections = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('ActiveWorkspaceStore').collections,
    collection = _.find(collections, item => {return item.id === id;}),
    editPermission = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('PermissionStore').can('edit', 'collection', id);

    return collection && editPermission;
  }

  // Used to check if the content-type
  // in the captured request is urlencoded
  // The body needs to be split differently if this is the case
  isUrlEncodedHeaderPresent(headers) {
    for (var i = 0; i < headers.length; i++) {
      if (headers[i].name.toLowerCase() === 'content-type') {
        if (headers[i].value.search('urlencoded') >= 0) {
          return true;
        }
      }
    }

    return false;
  }

  // Used to extract form data key-value
  // pairs from the captured request
  getFormData(data) {
    var formData = [],
    i;

    if (!data) {
      return formData;
    }

    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var itemLength = data[key].length;
        for (i = 0; i < itemLength; i++) {
          formData.push({
            'key': key,
            'value': data[key][i] });

        }
      }
    }

    return formData;
  }

  getRawData(data) {
    if (!data) {
      return '';
    }

    return __WEBPACK_IMPORTED_MODULE_1__utils_util__["a" /* default */].arrayBufferToString(__WEBPACK_IMPORTED_MODULE_4_base64_arraybuffer___default.a.decode(data));
  }

  addRequestObject(requestObj) {
    var interceptorSettingsStore = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('InterceptorSettingsStore'),
    target_id = interceptorSettingsStore.requestCaptureTarget(),
    request;

    request = {
      name: requestObj.url,
      url: requestObj.url,
      method: requestObj.method,
      headers: {},
      headerData: [],
      data: '' };


    // modify request for sync
    requestObj.requestHeaders.forEach(data => {
      var headers = Object.values(data);
      request.headers[data.name] = data.value;
      request.headerData.push({
        key: data.name,
        value: data.value });

    });

    // different types of body are encoded differently at the interceptor's end
    if (requestObj.requestBody) {
      if (requestObj.requestBodyType === 'formData') {
        if (this.isUrlEncodedHeaderPresent(requestObj.requestHeaders)) {
          request.dataMode = 'urlencoded';
        } else
        {
          request.dataMode = 'params';
        }

        // TODO: Think about removing Content-Type header
        request.data = this.getFormData(_.get(requestObj, 'requestBody.formData'));
      } else
      {
        request.dataMode = 'raw';
        request.data = this.getRawData(_.get(requestObj, 'requestBody.rawData'));
      }
    }

    if (this.checkTarget(target_id)) {
      __WEBPACK_IMPORTED_MODULE_5__modules_controllers_CurrentUserController__["a" /* default */].
      get().
      then(user => {
        _.assign(request, {
          id: __WEBPACK_IMPORTED_MODULE_1__utils_util__["a" /* default */].guid(),
          collection: target_id,
          owner: user.id });


        let requestCreateEvent = {
          name: 'create_deep',
          namespace: 'request',
          data: { request },
          target: {
            model: 'collection',
            modelId: target_id } };


        Object(__WEBPACK_IMPORTED_MODULE_2__modules_pipelines_user_action__["a" /* default */])(requestCreateEvent).
        then(response => {
          if (!_.isEmpty(_.get(response, 'error'))) {
            pm.logger.error('Error in creating collection from InterceptorManager', response.error);
            return;
          }
        });
      }).
      catch(err => {
        pm.logger.error('Error while creating collection from InterceptorManager', err);
      });
    }

    // else create history
    else {
        __WEBPACK_IMPORTED_MODULE_5__modules_controllers_CurrentUserController__["a" /* default */].
        get().
        then(user => {
          if (!user) {
            pm.logger.error(new Error('InterceptorManager: Could not create history. Current user is missing.'));
            return;
          }

          let currentDate = new Date(),
          workspace = __WEBPACK_IMPORTED_MODULE_0__js_stores_get_store__["getStore"]('ActiveWorkspaceSessionStore').workspace,
          historyCreateEvent = Object(__WEBPACK_IMPORTED_MODULE_3__modules_model_event__["createEvent"])(
          'create',
          'history',
          _.assign({}, request, { id: __WEBPACK_IMPORTED_MODULE_1__utils_util__["a" /* default */].guid(), createdAt: currentDate.toISOString(), workspace, owner: user.id, lastUpdatedBy: user.id }));


          return Object(__WEBPACK_IMPORTED_MODULE_2__modules_pipelines_user_action__["a" /* default */])(historyCreateEvent).
          catch(e => {console.log('Error in creating history through proxy', e);});
        });
      }
  }};



/* harmony default export */ __webpack_exports__["a"] = (InterceptorManager);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3675:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UIEventService__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_UIEventConstants__ = __webpack_require__(216);



/**
                                                               * Initializer
                                                               * It subscribes to the UIEventService and attaches the handlers for it
                                                               */
function init() {
  __WEBPACK_IMPORTED_MODULE_0__UIEventService__["a" /* default */].subscribe(__WEBPACK_IMPORTED_MODULE_1__constants_UIEventConstants__["c" /* LOGOUT_EVENT */], _handleLogout);
}

/**
   * @private
   * @description It triggers the logout for the app.
   */
function _handleLogout() {
  pm.mediator.trigger('showUserSignoutModal');
}

/* harmony default export */ __webpack_exports__["a"] = ({ init });

/***/ }),

/***/ 3676:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__api_dev_public_APIDevInterface__ = __webpack_require__(3677);


/**
                                                                        *
                                                                        * @param {Callback} cb
                                                                        */
function bootAPIDevInterface(cb) {
  _.assign(window.pm, { apiDev: new __WEBPACK_IMPORTED_MODULE_0__api_dev_public_APIDevInterface__["a" /* default */]() });
  pm.logger.info('APIDevInterface~boot - Success');
  return cb && cb(null);
}

/* harmony default export */ __webpack_exports__["a"] = (bootAPIDevInterface);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3677:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APIDevInterface; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_APIDevInterfaceService__ = __webpack_require__(3678);
let

APIDevInterface = class APIDevInterface {

  constructor() {
    this.constants = {
      schemaType: {
        OPENAPI3: 'openapi3',
        OPENAPI2: 'openapi2',
        OPENAPI1: 'openapi1',
        RAML1: 'raml',
        RAML: 'raml0.8',
        GRAPHQL: 'graphql' },

      model: {
        COLLECTION: 'collection' } };


  }

  /**
     *
     * @param {String} model
     * @param {String} modelId
     * @param {callback} cb
     */
  getAPIForModel(model, modelId, cb) {
    if (!model) {
      return cb({
        status: 'ERR_MISSING_MODEL',
        message: 'model is a mandatory parameter' });

    }

    if (model !== 'collection') {
      return cb({
        status: 'ERR_UNSUPPORTED_MODEL',
        message: 'Specified model is not supported' });

    }

    if (!modelId) {
      return cb({
        status: 'ERR_MISSING_MODELID',
        message: 'modelId is a mandatory parameter' });

    }

    if (typeof modelId != 'string') {
      return cb({
        status: 'ERR_INVALID_MODELID',
        message: 'modelId should be string' });

    }

    Object(__WEBPACK_IMPORTED_MODULE_0__services_APIDevInterfaceService__["a" /* getRelationForModel */])(modelId, (error, res) => {
      if (error) {
        pm.logger.warn('APIDevInterface~getAPIForModel', error);
        return cb(null);
      }

      if (!_.get(res, 'apiId')) {
        pm.logger.warn('APIDevInterface~getAPIForModel: There is no API linked to the model');
        return cb(null);
      }

      let apiModel = new API(model, modelId, res);

      cb(null, apiModel);
    });
  }};let


API = class API {





  constructor(model, modelId, apiLinkedToCollection) {this.id = null;this.name = null;this.version = null;
    this.model = model;
    this.modelId = modelId;
    this.initialize(apiLinkedToCollection);
  }

  initialize(definition) {
    this.id = definition.apiId;
    this.name = definition.apiName;
    this.version = { id: definition.apiVersionId, name: definition.apiVersionName };
  }

  /**
     *
     * @param {Object} options : Additional parameters
     * @param {callback} cb: Callback that handles the response
     */
  getSchema(options, cb) {
    if (this.model === 'collection') {
      if (!options ||
      typeof _.get(options, 'schemaTypes') !== 'object') {
        return cb({
          status: 'ERR_INVALID_SCHEMA_TYPES',
          message: 'Invalid supported schema types' });

      }

      let definition = {
        apiId: this.id,
        apiVersionId: this.version.id,
        modelId: this.modelId,
        types: _.get(options, 'schemaTypes').toString() };


      Object(__WEBPACK_IMPORTED_MODULE_0__services_APIDevInterfaceService__["b" /* getSchemaForModel */])(definition, (error, res) => {
        if (!error) {
          return cb(null, res);
        }
        if (error.status === 401) {
          return cb({
            status: 'ERR_UNAUTHENTICATED_USER',
            message: _.get(error, 'error.message') });

        }
        if (error.status === 500) {
          return cb({
            status: 'SERVER_ERROR',
            message: _.get(error, 'error.message') });

        }
        if (error.status === 403) {
          return cb({
            status: 'ERR_FORBIDDEN',
            message: _.get(error, 'error.message') });

        }
        if (error.status === 404 || error.status === 400) {
          return cb(null);
        }
        cb(null);
      });
    }
  }};
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3678:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getRelationForModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getSchemaForModel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controllers_APIRelationController__ = __webpack_require__(731);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__APIDevService__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__js_modules_model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_APISchemaController__ = __webpack_require__(732);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_uuid__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_uuid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_uuid__);






const TYPE_CREATE = 'create';

/**
                               *
                               * @param {String} modelId
                               * @param {Callback} cb
                               */
function getRelationForModel(modelId, cb) {
  cb = _.once(cb);
  __WEBPACK_IMPORTED_MODULE_0__controllers_APIRelationController__["a" /* default */].get({
    id: modelId }).
  then(relation => {

    /**
                     * if relation exists in DB,
                     * call the callback with the data
                     * and return
                     */
    if (relation) {

      // if the relation does not exist on the
      // latest version of the API, then apiVersionId
      // will be undefined
      //
      // We are providing the information only if the model
      // is linked to the latest API version
      if (relation.apiId && relation.apiVersionId) {
        return cb(null, relation);
      } else {

        // return null when the relation
        // does not exist on the latest version
        return cb(null);
      }
    }

    /**
       * if relation does not exist in DB
       * ,i.e, data not found in DB,
       * then fetch the relation from server
       * call callback with the fetched data
       * and create entry in the api_relations
       */else
      {
        fetchRelationForModelFromServer(modelId).then(relationToCreate => {
          cb(null, relationToCreate);
          createAndSubscribeForRelation(modelId, relationToCreate);
        }).
        catch(error => {
          pm.logger.error('Failed to get relation for the model', error);
          cb(error);
        });
      }
  });
}

/**
   * Publish an event to the shared process
   * via realtime-db-update channel to create
   * the entry in the api_relations table
   * and subscribe for the modelId
   * @param {String} modelId
   * @param {Object} relationToCreate
   */
function createAndSubscribeForRelation(modelId, relationToCreate) {
  pm.eventBus.channel('realtime-db-update').publish(Object(__WEBPACK_IMPORTED_MODULE_2__js_modules_model_event__["createEvent"])(TYPE_CREATE, 'updateDB', {
    id: modelId,
    response: relationToCreate,
    table: 'api_relations' }));

}

/**
   * get data for the API linked
   * to the collection if the collectionId
   * is not available in DB cache
   */
function fetchRelationForModelFromServer(modelId) {
  return __WEBPACK_IMPORTED_MODULE_1__APIDevService__["a" /* default */].getAPILinkedToCollection(modelId).then(response => {
    let relationToUpdate = {
      id: modelId,
      apiId: _.get(response, 'api.id'),
      apiName: _.get(response, 'api.name'),
      apiVersionId: _.get(response, 'api.versions[0].id'),
      apiCreatedAt: _.get(response, 'api.createdAt'),
      apiUpdatedAt: _.get(response, 'api.updatedAt'),
      apiVersionName: _.get(response, 'api.versions[0].name'),
      apiVersionCreatedAt: _.get(response, 'api.versions[0].createdAt'),
      apiVersionUpdatedAt: _.get(response, 'api.versions[0].updatedAt') };

    return Promise.resolve(relationToUpdate);
  }).
  catch(error => {
    return Promise.reject(error);
  });
}

/**
   *
   * @param {Object} definition
   * @param {Callback} cb
   */
function getSchemaForModel(definition, cb) {
  cb = _.once(cb);
  __WEBPACK_IMPORTED_MODULE_3__controllers_APISchemaController__["a" /* default */].get({
    apiVersionId: definition.apiVersionId }).
  then(schema => {

    /**
                   * if schema exists in DB,
                   * call the callback with the data
                   * and return
                   */
    if (schema) {

      /**
                  * Bail out if the requested schema type
                  * does not match the schema type in DB cache
                  */
      if (!_.includes(definition.types, schema.type)) {
        return cb(null);
      }
      let schemaToBeReturned = {
        id: schema.schemaId,
        schema: schema.schema,
        type: schema.type,
        language: schema.language };


      return cb(null, schemaToBeReturned);
    }

    /**
       * if schema does not exist in DB
       * ,i.e, data not found in DB,
       * the fetch the schema from server
       * call callback with the fetched data
       * and create entry in the api_schemas
       */else
      {
        fetchSchemaForModelFromServer(definition).then(schemaToCreate => {
          let schemaToBeReturned = {
            id: schemaToCreate.schemaId,
            schema: schemaToCreate.schema,
            type: schemaToCreate.type,
            language: schemaToCreate.language };


          cb(null, schemaToBeReturned);
          createAndSubscribeForSchema(definition, schemaToCreate);
        }).
        catch(error => {
          pm.logger.error('Failed to get schema for the model', error);
          cb(error);
        });
      }
  });
}

/**
   *
   * @param {Object} definition
   */
function fetchSchemaForModelFromServer(definition) {
  return __WEBPACK_IMPORTED_MODULE_1__APIDevService__["a" /* default */].fetchSchemaForCollection(definition.modelId, definition.types).
  then(response => {
    let schemaFromResponse = _.get(response, 'body.data.schema'),
    schemaToCreate = {
      id: __WEBPACK_IMPORTED_MODULE_4_uuid___default.a.v4(),
      schemaId: schemaFromResponse.id,
      apiId: definition.apiId,
      apiVersionId: definition.apiVersionId,
      schema: schemaFromResponse.schema,
      type: schemaFromResponse.type,
      language: schemaFromResponse.language,
      updatedAt: schemaFromResponse.updatedAt };

    return Promise.resolve(schemaToCreate);
  }).
  catch(error => {
    return Promise.reject(error);
  });
}

/**
   *
   * @param {String} modelId
   * @param {Object} schemaToCreate
   */
function createAndSubscribeForSchema(definition, schemaToCreate) {
  pm.eventBus.channel('realtime-db-update').publish(Object(__WEBPACK_IMPORTED_MODULE_2__js_modules_model_event__["createEvent"])(TYPE_CREATE, 'updateDB', {
    id: definition.modelId,
    response: schemaToCreate,
    table: 'api_schemas' }));

}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3679:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CloudProxyHandler; });
let electron = __webpack_require__(22),
app = electron.remote.app,
ipcRenderer = electron.ipcRenderer,
path = __webpack_require__(15),
FileService = __webpack_require__(867),
{ decodeBase122 } = __webpack_require__(3680),
CONFIG_FILE_PATH = path.resolve(app.getPath('userData'), 'Postman_Config', 'proxy'),
DEFAULT_PROXY_CONFIG = null;

/**
                              * This acts as the point of communication for proxy settings in the renderer
                              */let
CloudProxyHandler = class CloudProxyHandler {
  constructor() {
    FileService.read(CONFIG_FILE_PATH).
    then(configData => {
      let parsedConfig = JSON.parse(decodeBase122(configData));

      this.proxyConfig = this.sanitizeConfig(parsedConfig);
    }).
    catch(e => {
      pm.logger.warn('CloudProxyHandler: Error while reading proxy configuration from user data - ', e);

      this.proxyConfig = DEFAULT_PROXY_CONFIG;
    });
  }

  /**
     * Dispatches an event to the main process when the user submits their proxy credentials
     *
     * @param {Object} credentials
     */
  handleProxyAuthSubmit(credentials) {
    ipcRenderer.send('handleProxyAuthSubmit', credentials);
  }

  /**
     * Checks if the proxy config schema is valid or not. If it is not, returns the DEFAULT_PROXY_CONFIG.
     *
     * @param {Object} proxyConfig
     *
     * @returns {Object}
     */
  sanitizeConfig(proxyConfig) {
    let isConfigValid = true;

    if (!proxyConfig || !proxyConfig.auth) {
      isConfigValid = false;
    }

    return isConfigValid ? proxyConfig : DEFAULT_PROXY_CONFIG;
  }};

/***/ }),

/***/ 3680:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {let base122 = __webpack_require__(3681);

module.exports = {
  encodeBase122: function (data) {
    let stringifiedData = JSON.stringify(data),
    base122Encoded = base122.encode(Buffer.from(stringifiedData)),
    encodedData = Buffer.from(base122Encoded).toString();

    return encodedData;
  },

  decodeBase122: function (data) {
    let base122Decoded = base122.decode(Buffer.from(data)),
    decodedData = Buffer.from(base122Decoded).toString();

    return decodedData;
  } };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).Buffer))

/***/ }),

/***/ 3681:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/* eslint-disable */

/**
                      * Github repo - https://github.com/kevinAlbs/Base122
                      *
                      * MIT License
                      * Copyright (c) 2016 Kevin Albertson
                      *
                      * Permission is hereby granted, free of charge, to any person obtaining a copy
                      * of this software and associated documentation files (the "Software"), to deal
                      * in the Software without restriction, including without limitation the rights
                      * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                      * copies of the Software, and to permit persons to whom the Software is
                      * furnished to do so, subject to the following conditions:
                      *
                      * The above copyright notice and this permission notice shall be included in all
                      * copies or substantial portions of the Software.
                      *
                      * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                      * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                      * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                      * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                      * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                      * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                      * SOFTWARE.
                      */

// Provides functions for encoding/decoding data to and from base-122.

let fs = __webpack_require__(30);

const kString = 0,
kUint8Array = 1,
kDefaultMimeType = 'image/jpeg',
kDebug = false,
kIllegals = [
0, // null
10, // newline
13, // carriage return
34, // double quote
38, // ampersand
92 // backslash
],
kShortened = 0b111 // Uses the illegal index to signify the last two-byte char encodes <= 7 bits.
;

/**
   * Encodes raw data into base-122.
   * @param {Uint8Array|Buffer|Array|String} rawData - The data to be encoded. This can be an array
   * or Buffer with raw data bytes or a string of bytes (i.e. the type of argument to btoa())
   * @returns {Array} The base-122 encoded data as a regular array of UTF-8 character byte values.
   */
function encode(rawData) {
    let dataType = typeof rawData == 'string' ? kString : kUint8Array,
    curIndex = 0,
    curBit = 0, // Points to current bit needed
    curMask = 0b10000000,
    outData = [],
    getByte = dataType == kString ? i => rawData.codePointAt(i) : i => rawData[i];


    /**
                                                                                    * Get seven bits of input data. Returns false if there is no input left.
                                                                                    */
    function get7() {
        if (curIndex >= rawData.length) return false;

        // Shift, mask, unshift to get first part.
        let firstByte = getByte(curIndex);
        let firstPart = (0b11111110 >>> curBit & firstByte) << curBit;

        // Align it to a seven bit chunk.
        firstPart >>= 1;

        // Check if we need to go to the next byte for more bits.
        curBit += 7;
        if (curBit < 8) return firstPart; // Do not need next byte.
        curBit -= 8;
        curIndex++;

        // Now we want bits [0..curBit] of the next byte if it exists.
        if (curIndex >= rawData.length) return firstPart;
        let secondByte = getByte(curIndex);
        let secondPart = 0xFF00 >>> curBit & secondByte & 0xFF;

        // Align it.
        secondPart >>= 8 - curBit;
        return firstPart | secondPart;
    }

    while (true) {
        // Grab 7 bits.
        let bits = get7();
        if (bits === false) break;
        debugLog('Seven input bits', print7Bits(bits), bits);

        let illegalIndex = kIllegals.indexOf(bits);
        if (illegalIndex != -1) {
            // Since this will be a two-byte character, get the next chunk of seven bits.
            let nextBits = get7();
            debugLog('Handle illegal sequence', print7Bits(bits), print7Bits(nextBits));

            let b1 = 0b11000010,
            b2 = 0b10000000;
            if (nextBits === false) {
                debugLog('Last seven bits are an illegal sequence.');
                b1 |= (0b111 & kShortened) << 2;
                nextBits = bits; // Encode these bits after the shortened signifier.
            } else {
                b1 |= (0b111 & illegalIndex) << 2;
            }

            // Push first bit onto first byte, remaining 6 onto second.
            let firstBit = (nextBits & 0b01000000) > 0 ? 1 : 0;
            b1 |= firstBit;
            b2 |= nextBits & 0b00111111;
            outData.push(b1);
            outData.push(b2);
        } else {
            outData.push(bits);
        }
    }
    return outData;
}


/**
   * Decodes base-122 encoded data back to the original data.
   * @param {Uint8Array|Buffer|String} rawData - The data to be decoded. This can be a Uint8Array
   * or Buffer with raw data bytes or a string of bytes (i.e. the type of argument to btoa())
   * @returns {Array} The data in a regular array representing byte values.
   */
function decode(base122Data) {
    let strData = typeof base122Data == 'string' ? base122Data : utf8DataToString(base122Data),
    decoded = [],
    decodedIndex = 0,
    curByte = 0,
    bitOfByte = 0;


    function push7(byte) {
        byte <<= 1;

        // Align this byte to offset for current byte.
        curByte |= byte >>> bitOfByte;
        bitOfByte += 7;
        if (bitOfByte >= 8) {
            decoded.push(curByte);
            bitOfByte -= 8;

            // Now, take the remainder, left shift by what has been taken.
            curByte = byte << 7 - bitOfByte & 255;
        }
    }

    for (let i = 0; i < strData.length; i++) {
        let c = strData.charCodeAt(i);

        // Check if this is a two-byte character.
        if (c > 127) {
            // Note, the charCodeAt will give the codePoint, thus
            // 0b110xxxxx 0b10yyyyyy will give => xxxxxyyyyyy
            let illegalIndex = c >>> 8 & 7; // 7 = 0b111.
            // We have to first check if this is a shortened two-byte character, i.e. if it only
            // encodes <= 7 bits.
            if (illegalIndex != kShortened) push7(kIllegals[illegalIndex]);

            // Always push the rest.
            push7(c & 127);
        } else {
            // One byte characters can be pushed directly.
            push7(c);
        }
    }
    return decoded;
}


/**
   * Converts a sequence of UTF-8 bytes to a string.
   * @param {Uint8Array|Buffer} data - The UTF-8 data.
   * @returns {String} A string with each character representing a code point.
   */
function utf8DataToString(data) {
    return Buffer.from(data).toString('utf-8');
}

// For debugging.
function debugLog() {
    if (kDebug) console.log(...arguments);
}

// For debugging.
function print7Bits(num) {
    return '0000000'.substring(num.toString(2).length) + num.toString(2);
}

// For debugging.
function print8Bits(num) {
    return '00000000'.substring(num.toString(2).length) + num.toString(2);
}

module.exports = {
    encode: encode,
    decode: decode };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10).Buffer))

/***/ }),

/***/ 3688:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bootRuntimeListeners;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_services_RuntimeRequestExecutionListener__ = __webpack_require__(3689);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_services_PersistResponseListener__ = __webpack_require__(3690);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_services_RuntimeRequestPreviewListener__ = __webpack_require__(3691);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_services_RuntimeConsoleEventsListener__ = __webpack_require__(3692);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__modules_services_RuntimeRequestDownloadListener__ = __webpack_require__(3693);






/**
                                                                                                     *
                                                                                                     *
                                                                                                     * @export
                                                                                                     */
function bootRuntimeListeners(cb) {
  if (!(pm && pm.eventBus)) {
    pm.logger.error('RuntimeListeners~boot- Failed', new Error('Could not initialize runtime listeners. Event bus not initialized'));
    cb();
    return;
  }

  pm.eventBus.channel('postman-runtime').subscribe(__WEBPACK_IMPORTED_MODULE_0__modules_services_RuntimeRequestExecutionListener__["a" /* handleRequestExecutionEvents */]);
  pm.eventBus.channel('postman-runtime').subscribe(__WEBPACK_IMPORTED_MODULE_1__modules_services_PersistResponseListener__["a" /* handleResponsePersistEvents */]);
  pm.eventBus.channel('postman-runtime').subscribe(__WEBPACK_IMPORTED_MODULE_2__modules_services_RuntimeRequestPreviewListener__["a" /* handleRequestPreviewEvents */]);
  pm.eventBus.channel('postman-runtime').subscribe(__WEBPACK_IMPORTED_MODULE_3__modules_services_RuntimeConsoleEventsListener__["a" /* handleConsoleLogEvents */]);
  pm.eventBus.channel('postman-runtime').subscribe(__WEBPACK_IMPORTED_MODULE_4__modules_services_RuntimeRequestDownloadListener__["a" /* handleRequestDownloadEvent */]);

  pm.logger.info('RuntimeListeners~boot- Success');
  cb();
}

/***/ }),

/***/ 3689:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["a"] = handleRequestExecutionEvents;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__runtime_helpers_LivePreviewHelper__ = __webpack_require__(223);




const NAMESPACE_REQUEST_EXECUTION = 'requestexecution',
MAX_RESPONSE_SIZE_ERROR_MESSAGE = 'Maximum response size reached';

let requestExecutionEventHandlers = {
  error(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    // Adding special handling for request error when response is greater than specified
    // maximum response size
    if (eventData.phase === 'request' &&
    eventData.error &&
    eventData.error.message === MAX_RESPONSE_SIZE_ERROR_MESSAGE) {

      // Return as this error is going to handled differently
      return executionStore.maxResponseReached();
    }

    executionStore.setErrors([{
      phase: eventData.phase,
      error: eventData.error }]);

  },

  exception(event) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event),
    exception = eventData.error;

    pm.toasts.error('Something went wrong while running your scripts. Check Postman Console for more info.', { dedupeId: eventData.id });

    console.warn(`Error running scripts: ${exception.name} | ${exception.message}`, exception);
  },

  requestDispatched(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.updateDispatchedRequest(eventData.request);
    executionStore.updateRequestSize(eventData.requestSize);
  },

  responseMetaReceived(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.updateResponseMeta(eventData.meta);
  },

  responseHeadersReceived(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.updateResponseHeaders(eventData.responseHeaders);
  },

  responseBodyReceived(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.updateResponseBody(eventData.responseBody);
  },

  responseBodyStreamReceived(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    // At this point we are getting the buffer from the IPC which is an UintUtf8Encoded array
    // Note: global.Buffer is used due to a problem in webpack causing buffer library to be shimmed
    executionStore.updateResponseStream(global.Buffer.from(eventData.responseBodyStream));
  },

  responseFinalized(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.updateResponseMeta(eventData.meta);
    executionStore.updateResponseContentInfo(eventData.responseContentInfo);
  },

  cookiesReceived(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.updateCookies(eventData.cookies);
  },

  assertionsReceived(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.addAssertions(eventData.assertions);
  },

  visualizerDataReceived(event, executionStore) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    executionStore.updateVisualizerData(eventData.visualizerData);
  },

  finished(event, executionStore) {
    executionStore.setFinished();

    // @LivePreview: Triggering preview request after sending request to update cookie header for next request send.
    // This trigger is put in finished callback as cookie header can be updated via test script
    __WEBPACK_IMPORTED_MODULE_2__runtime_helpers_LivePreviewHelper__["j" /* default */].previewRequest(executionStore.origin);
  },

  terminated(event) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event),
    executionStore = Object(__WEBPACK_IMPORTED_MODULE_1__stores_get_store__["getStore"])('RequestExecutionStore'),
    execution = executionStore.find(eventData.id);

    /**
                                                    * do not remove by origin, only remove by execution id
                                                    * removing by origin might cause race conditions
                                                    * BEHAVIOUR: On termination if the request is present in the staging area it's cleaned up.
                                                    * If the response has already started then it will no longer be in the staging area
                                                    * and will not be removed from the UI, instead the request will be cancelled
                                                    *
                                                    * If it was the case where a new request was started without canceling the previous request
                                                    * the `RequestExecutionStore.add` method has already cleanup the execution and this will just
                                                    * be an noop behaviour
                                                    */
    if (executionStore.hasStagingExecution(execution.origin)) {
      executionStore.remove(eventData.id);
    } else {
      execution.setCancelled();
    }
  } };


/**
        *
        *
        * @export
        */
function handleRequestExecutionEvents(event) {
  if (Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventNamespace"])(event) !== NAMESPACE_REQUEST_EXECUTION) {
    return;
  }

  let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event),
  executionStore = Object(__WEBPACK_IMPORTED_MODULE_1__stores_get_store__["getStore"])('RequestExecutionStore').find(eventData.id);

  if (!executionStore) {
    return;
  }

  requestExecutionEventHandlers[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)] && requestExecutionEventHandlers[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)](event, executionStore);
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(5)))

/***/ }),

/***/ 3690:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (immutable) */ __webpack_exports__["a"] = handleResponsePersistEvents;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_HistoryResponseService__ = __webpack_require__(929);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pipelines_user_action__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__controllers_WorkspaceController__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__controllers_HistoryController__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_EditorService__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__constants_ResponsePersistConstants__ = __webpack_require__(1578);










const NAMESPACE_REQUEST_EXECUTION = 'requestexecution',
EVENT_FINISHED = 'finished',
SAVE_HISTORY_RESPONSE_SETTING = 'settings.enableHistoryResponseSaving';

/**
                                                                         * Handles creation of history response from request execution.
                                                                         *
                                                                         * @param {Object} event
                                                                         * @param {Object} executionStore
                                                                         *
                                                                         * @returns {Promise<Object>}
                                                                         */
function handleHistoryResponseCreate(event, executionStore) {
  let historyResponse = Object(__WEBPACK_IMPORTED_MODULE_2__services_HistoryResponseService__["a" /* getHistoryResponseFromExecutionStore */])(executionStore);

  if (!historyResponse) {
    return;
  }

  // check if the workspace for the history allows saving response
  // to do this
  // 1. Find history
  // 2. Find workspace for history
  // 3. Check if workspace allows save response
  // 4. Dream about how this would have been just one SQL query joining the two tables
  return __WEBPACK_IMPORTED_MODULE_5__controllers_HistoryController__["a" /* default */].get({ id: historyResponse.history }).

  then(history => {
    // if history is missing, do not throw but force the workspace check to return falsy
    // to skip history response saving
    if (!history) {
      return;
    }

    return __WEBPACK_IMPORTED_MODULE_4__controllers_WorkspaceController__["a" /* default */].get({ id: history.workspace });
  }).

  then(workspace => {
    // validate settings
    return _.get(workspace, SAVE_HISTORY_RESPONSE_SETTING);
  }).
  then(shouldSaveResponse => {
    if (!shouldSaveResponse) {
      return;
    }

    return Object(__WEBPACK_IMPORTED_MODULE_3__pipelines_user_action__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["createEvent"])('create', 'historyresponse', historyResponse));
  }).
  catch(e => {
    pm.logger.error('HistoryResponse: Could not create history response. Something went wrong', e);

    // for crash reporting
    pm.logger.error('HistoryResponse: Could not create history response. Something went wrong', e);
  });
}

/**
   * Handle save response flows, by reacting to request execution finished events
   *
   * @export
   */
function handleResponsePersistEvents(event) {
  if (Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventNamespace"])(event) !== NAMESPACE_REQUEST_EXECUTION || Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event) !== EVENT_FINISHED) {
    return;
  }

  let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event),
  executionStore = Object(__WEBPACK_IMPORTED_MODULE_1__stores_get_store__["getStore"])('RequestExecutionStore').find(eventData.id);

  if (!executionStore) {
    return;
  }

  // After the response has been received, we cache the response in the DB. Presently, responses
  // larger than MAX_RESPONSE_SIZE are not stored. Responses are cached in the DB so that they can
  // later be restored. This would be needed for the case when the editor item is deleted from the store
  // and then restored (as a result of workspace switch / Recently closed tabs)
  __WEBPACK_IMPORTED_MODULE_6__services_EditorService__["a" /* default */].setEditorDataCache(executionStore.origin, Object(__WEBPACK_IMPORTED_MODULE_2__services_HistoryResponseService__["a" /* getHistoryResponseFromExecutionStore */])(executionStore, { maxResponseSize: __WEBPACK_IMPORTED_MODULE_7__constants_ResponsePersistConstants__["a" /* MAX_RESPONSE_SIZE */] }));

  handleHistoryResponseCreate(event, executionStore);
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3691:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = handleRequestPreviewEvents;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__runtime_helpers_LivePreviewHelper__ = __webpack_require__(223);



const NAMESPACE_REQUEST_PREVIEW = 'requestpreview';

let requestPreviewHandler = {
  previewedRequest(event) {
    // update the preview request
    __WEBPACK_IMPORTED_MODULE_1__runtime_helpers_LivePreviewHelper__["j" /* default */].updatePreviewRequest(event.data.previewedRequest, event.data.info);
  } };


/**
        * @LivePreview: Function to listen to events related to previewing a request
        * @param {Object} event
        */
function handleRequestPreviewEvents(event) {
  // bail out if invalid/unrelated event
  if (!(event && event.data && Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventNamespace"])(event) === NAMESPACE_REQUEST_PREVIEW)) {
    return;
  }

  // bail out if event is unrecognized
  if (!requestPreviewHandler[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)]) {
    return;
  }

  if (event.data.error) {
    pm.logger.error('RuntimeRequestPreviewListener~handleRequestPreviewEvents: Error in previewing the request');

    return;
  }

  requestPreviewHandler[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)](event);
}

/***/ }),

/***/ 3692:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (immutable) */ __webpack_exports__["a"] = handleConsoleLogEvents;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants_ConsoleEventTypes__ = __webpack_require__(287);




// @debt: The events for the request `net` and `netError` should not be in
// console listener. Console events listener should just listen to console
// events. This also means changing the runtime execution service in main
// process to not send console events for request. The logging of request on the
// console is renderer's responsibility.

let consoleEventListeners = {
  net(event) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    if (!(eventData && eventData.cursor)) {
      return;
    }

    let payload = { request: eventData.request };

    // If the cursor has a scriptId then we can safely assume that this was an indirect
    // sendRequest
    if (_.has(eventData, 'cursor.scriptId')) {
      payload.indirect = 'request';
    }

    if (eventData.history) {
      payload.history = eventData.history;
    }

    if (eventData.response) {
      payload.response = eventData.response;
    }

    if (eventData.error) {
      payload.error = eventData.error;

      return pm.console.error(__WEBPACK_IMPORTED_MODULE_2__constants_ConsoleEventTypes__["c" /* CONSOLE_EVENT_NETWORK */], {}, payload);
    }

    // Emit the log event to console
    return pm.console.log(__WEBPACK_IMPORTED_MODULE_2__constants_ConsoleEventTypes__["c" /* CONSOLE_EVENT_NETWORK */], {}, payload);
  },

  log(event) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    if (!(eventData && eventData.cursor)) {
      return;
    }

    pm.console.write(eventData.level, __WEBPACK_IMPORTED_MODULE_2__constants_ConsoleEventTypes__["b" /* CONSOLE_EVENT_LOG */], {}, eventData.messages);
  },

  exception(event) {
    let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event);

    if (!(eventData && eventData.cursor)) {
      return;
    }

    pm.console.error(__WEBPACK_IMPORTED_MODULE_2__constants_ConsoleEventTypes__["a" /* CONSOLE_EVENT_EXCEPTION */], {}, eventData.error);
  } };


/**
        *
        *
        * @export
        * @param {*} event
        */
function handleConsoleLogEvents(event) {
  if (!(event && Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventNamespace"])(event) === 'console')) {
    return;
  }

  let eventData = Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventData"])(event),
  executionStore = Object(__WEBPACK_IMPORTED_MODULE_1__stores_get_store__["getStore"])('RequestExecutionStore').find(eventData.id);

  if (!executionStore) {
    return;
  }

  consoleEventListeners[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)] && consoleEventListeners[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)](event);
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 3693:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = handleRequestDownloadEvent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_event__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stores_get_store__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_services_filesystem__ = __webpack_require__(623);




const NAMESPACE_REQUEST_EXECUTION = 'requestexecution';

let requestExecutionEventHandlers = {
  finished(event) {
    if (!event) {
      return;
    }

    let executionStore = Object(__WEBPACK_IMPORTED_MODULE_1__stores_get_store__["getStore"])('RequestExecutionStore').find(event.data && event.data.id);

    if (!executionStore || !executionStore.download) {
      return;
    }

    let stream = executionStore.responseStream,
    contentInfo = executionStore.responseContentInfo;

    Object(__WEBPACK_IMPORTED_MODULE_2__models_services_filesystem__["c" /* saveAndOpenFileForResponse */])(contentInfo, stream, err => {
      if (err) {
        return pm.toasts.error('Error while saving the response: ' + (err.message || ''));
      }

      pm.toasts.success('Downloaded Response');
    });
  } };


/**
        *
        *
        * @export
        */
function handleRequestDownloadEvent(event) {
  if (Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventNamespace"])(event) !== NAMESPACE_REQUEST_EXECUTION) {
    return;
  }

  requestExecutionEventHandlers[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)] && requestExecutionEventHandlers[Object(__WEBPACK_IMPORTED_MODULE_0__model_event__["getEventName"])(event)](event);
}

/***/ }),

/***/ 3694:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 594:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony export (immutable) */ __webpack_exports__["a"] = initializeConfigurations;
/* unused harmony export initializeServices */
/* unused harmony export subscribeToModelEvents */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_Configuration__ = __webpack_require__(595);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_FeatureFlags__ = __webpack_require__(598);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_model_event__ = __webpack_require__(7);





let servicesMap = [
__WEBPACK_IMPORTED_MODULE_0__services_Configuration__["a" /* default */],
__WEBPACK_IMPORTED_MODULE_1__services_FeatureFlags__["a" /* default */]];


/**
                * Initializes the configuration service
                *
                * @param {Function} cb
                */
function initializeConfigurations(cb) {
  initializeServices().
  then(({ configService, featureFlagService }) => {
    pm.configs = configService;
    pm.features = featureFlagService;
    pm.logger.info('bootConfigurations~initialize - Success');
    cb && cb(null);
  }).
  catch(e => {
    pm.logger.error('bootConfigurations~initialize - Failed', e);
    cb & cb(e);
  });
}

/**
   * Initializes the configuration caches
   */
function initializeServices() {
  return Promise.all(_.map(servicesMap, s => {
    let service = new s();
    subscribeToModelEvents(service, service._getLayerNamespaces());
    return Promise.resolve(service);
  })).
  then(values => {
    return {
      configService: values[0],
      featureFlagService: values[1] };

  });
}

/**
   * Subscribes the caches to the model-events on the event bus
   *
   * @param {*} cache
   * @param {*} namespaces
   */
function subscribeToModelEvents(service, namespaces) {
  pm.eventBus.channel('model-events').subscribe(function (event) {
    Object(__WEBPACK_IMPORTED_MODULE_2__modules_model_event__["processEvent"])(event, ['updated'], function (event, cb) {
      let eventNamespace = Object(__WEBPACK_IMPORTED_MODULE_2__modules_model_event__["getEventNamespace"])(event),
      eventName = Object(__WEBPACK_IMPORTED_MODULE_2__modules_model_event__["getEventName"])(event);

      if (!_.includes(namespaces, eventNamespace)) {
        return cb && cb();
      }

      // Bail out if any other action except updated
      if (eventName !== 'updated') {
        return cb && cb();
      }

      // Invalidate the cache if changes are made
      service.invalidateCache();
      cb && cb();
    });
  });
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 595:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserConfigurationController__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultConfigurationController__ = __webpack_require__(596);


let

Configuration = class Configuration extends __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__["a" /* default */] {constructor(...args) {var _temp;return _temp = super(...args), this.
    layers = {
      user: {
        controller: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserConfigurationController__["a" /* default */],
        namespace: 'userconfigs' },

      app: {
        controller: __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultConfigurationController__["a" /* default */],
        namespace: 'defaultconfigs' } }, this.




    resolutionOrder = ['app', 'user'], _temp;} // The order in which the layers will be resolved
};

/* harmony default export */ __webpack_exports__["a"] = (Configuration);

/***/ }),

/***/ 596:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let defaultConfiguration = __webpack_require__(597);

/* harmony default export */ __webpack_exports__["a"] = ({
  getAll: function () {
    return Promise.resolve(defaultConfiguration);
  } });

/***/ }),

/***/ 597:
/***/ (function(module, exports) {

module.exports = {"editor.requestEditorLayoutName":"layout-1-column","request.autoPersistVariables":true,"user.plansToAllowUpgrade":[],"workspace.visibilityAvailablePlans":[],"editor.openInNew":false,"editor.skipConfirmationBeforeClose":false,"editor.showIcons":true}

/***/ }),

/***/ 598:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserFeatureFlagController__ = __webpack_require__(545);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultFeatureFlagController__ = __webpack_require__(599);


let

FeatureFlags = class FeatureFlags extends __WEBPACK_IMPORTED_MODULE_0__BaseConfigurationService__["a" /* default */] {constructor(...args) {var _temp;return _temp = super(...args), this.
    layers = {
      user: {
        controller: __WEBPACK_IMPORTED_MODULE_1__modules_controllers_UserFeatureFlagController__["a" /* default */],
        namespace: 'userfeatureflags' },

      app: {
        controller: __WEBPACK_IMPORTED_MODULE_2__modules_controllers_DefaultFeatureFlagController__["a" /* default */],
        namespace: 'defaultfeatureflags' } }, this.




    resolutionOrder = ['app', 'user'], _temp;} // The order in which the layers will be resolved.

  isEnabled(key) {
    return super.get(key);
  }

  get() {
    return new Error('Feature Flags: Use the isEnabled API to get a flag');
  }};


/* harmony default export */ __webpack_exports__["a"] = (FeatureFlags);

/***/ }),

/***/ 599:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let defaultFeatureFlags = __webpack_require__(600);

/* harmony default export */ __webpack_exports__["a"] = ({
  getAll: function () {
    return Promise.resolve(defaultFeatureFlags);
  } });

/***/ }),

/***/ 600:
/***/ (function(module, exports) {

module.exports = {"inviteByNonAdmin":false,"collectionAndFolderConfigurations":false,"schemaChangelog":true,"requestValidation":true,"schemaSyncing":false}

/***/ }),

/***/ 66:
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ 731:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_modules_controllers_ListController__ = __webpack_require__(34);


/* harmony default export */ __webpack_exports__["a"] = (_.defaults({
  type: 'apirelation' },
__WEBPACK_IMPORTED_MODULE_0__js_modules_controllers_ListController__["a" /* default */]));
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 732:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__js_modules_controllers_ListController__ = __webpack_require__(34);



/* harmony default export */ __webpack_exports__["a"] = (_.defaults({
  type: 'apischema' },
__WEBPACK_IMPORTED_MODULE_0__js_modules_controllers_ListController__["a" /* default */]));
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(0)))

/***/ }),

/***/ 766:
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ })

},[1775]);