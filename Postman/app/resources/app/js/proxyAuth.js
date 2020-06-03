/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3800);
/******/ })
/************************************************************************/
/******/ ({

/***/ 22:
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ 3800:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3801);


/***/ }),

/***/ 3801:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_proxyAuth_scss__ = __webpack_require__(3802);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_proxyAuth_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__styles_proxyAuth_scss__);



/**
                                                      * Attach event listeners to listen for events on the DOM
                                                      */
function attachEventHandlers() {
  let submitButton = document.getElementById('proxy-submit-button'),
  cancelButton = document.getElementById('proxy-cancel-button');

  submitButton.onclick = e => {
    handleSubmit();
  };

  cancelButton.onclick = e => {
    handleCancel();
  };

  /**
      * Adding listeners for keyboard events
      */
  document.onkeydown = e => {
    if (e.code === 'Enter') {
      handleSubmit();
    }

    if (e.code === 'Escape') {
      handleCancel();
    }
  };
}

/**
   * Gets credentials from user input and dispatches and event to the main process
   */
function handleSubmit() {
  let credentials = {
    username: document.getElementById('proxy-username-input').value,
    password: document.getElementById('proxy-password-input').value };


  __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].send('handleProxyAuthSubmit', credentials);
}

/**
   * Dispatches an event to the main process when user cancels the proxy auth flow
   */
function handleCancel() {
  __WEBPACK_IMPORTED_MODULE_0_electron__["ipcRenderer"].send('handleProxyAuthCancel');
}

/**
   * Initialize the proxy authentication script
   */
function init() {
  attachEventHandlers();
}

init();

/***/ }),

/***/ 3802:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

/******/ });