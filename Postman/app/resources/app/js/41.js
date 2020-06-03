webpackJsonp([41],{

/***/ 5234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "conf", function() { return conf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "language", function() { return language; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__ = __webpack_require__(4497);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// Allow for running under nodejs/requirejs in tests
var _monaco = typeof monaco === 'undefined' ? self.monaco : monaco;
var conf = __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["conf"];
var language = {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',
    tokenPostfix: '.js',
    keywords: [
    'break', 'case', 'catch', 'class', 'continue', 'const',
    'constructor', 'debugger', 'default', 'delete', 'do', 'else',
    'export', 'extends', 'false', 'finally', 'for', 'from', 'function',
    'get', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null',
    'return', 'set', 'super', 'switch', 'symbol', 'this', 'throw', 'true',
    'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield',
    'async', 'await', 'of'],

    typeKeywords: [],
    operators: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].operators,
    symbols: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].symbols,
    escapes: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].escapes,
    digits: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].digits,
    octaldigits: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].octaldigits,
    binarydigits: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].binarydigits,
    hexdigits: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].hexdigits,
    regexpctl: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].regexpctl,
    regexpesc: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].regexpesc,
    tokenizer: __WEBPACK_IMPORTED_MODULE_0__typescript_typescript_js__["language"].tokenizer };

/***/ })

});