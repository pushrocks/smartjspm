System.registerDynamic("npm:lik@1.0.24/dist/lik.stringmap.js", ["npm:lik@1.0.24/dist/lik.plugins.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  const plugins = $__require("npm:lik@1.0.24/dist/lik.plugins.js");
  class Stringmap {
    constructor() {
      this._stringArray = [];
      this._triggerUntilTrueFunctionArray = [];
    }
    addString(stringArg) {
      this._stringArray.push(stringArg);
      this.notifyTrigger();
    }
    addStringArray(stringArrayArg) {
      for (let stringItem of stringArrayArg) {
        this.addString(stringItem);
      }
    }
    removeString(stringArg) {
      for (let keyArg in this._stringArray) {
        if (this._stringArray[keyArg] === stringArg) {
          this._stringArray.splice(parseInt(keyArg), 1);
        }
      }
      this.notifyTrigger();
    }
    wipe() {
      this._stringArray = [];
      this.notifyTrigger();
    }
    checkString(stringArg) {
      return this._stringArray.indexOf(stringArg) !== -1;
    }
    checkMinimatch(miniMatchStringArg) {
      let foundMatch = false;
      for (let stringItem of this._stringArray) {
        if (plugins.minimatch(stringItem, miniMatchStringArg)) {
          foundMatch = true;
        }
      }
      return foundMatch;
    }
    checkIsEmpty() {
      return this._stringArray.length === 0;
    }
    getStringArray() {
      return plugins.lodash.cloneDeep(this._stringArray);
    }
    registerUntilTrue(functionArg, doFunctionArg) {
      this._triggerUntilTrueFunctionArray.push(() => {
        let result = functionArg();
        if (result === true) {
          doFunctionArg();
        }
        return result;
      });
      this.notifyTrigger();
    }
    notifyTrigger() {
      let filteredArray = this._triggerUntilTrueFunctionArray.filter(functionArg => {
        return !functionArg();
      });
      this._triggerUntilTrueFunctionArray = filteredArray;
    }
  }
  exports.Stringmap = Stringmap;
  return module.exports;
});
System.registerDynamic("npm:typings-global@1.0.14/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function () {};
  return module.exports;
});
System.registerDynamic("npm:typings-global@1.0.14.js", ["npm:typings-global@1.0.14/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:typings-global@1.0.14/index.js");
  return module.exports;
});
System.registerDynamic('npm:events@1.0.2/events.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  function EventEmitter() {
    this._events = this._events || {};
    this._maxListeners = this._maxListeners || undefined;
  }
  module.exports = EventEmitter;

  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function (n) {
    if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
    this._maxListeners = n;
    return this;
  };

  EventEmitter.prototype.emit = function (type) {
    var er, handler, len, args, i, listeners;

    if (!this._events) this._events = {};

    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
        er = arguments[1];
        if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        }
        throw TypeError('Uncaught, unspecified "error" event.');
      }
    }

    handler = this._events[type];

    if (isUndefined(handler)) return false;

    if (isFunction(handler)) {
      switch (arguments.length) {
        // fast cases
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        // slower
        default:
          len = arguments.length;
          args = new Array(len - 1);
          for (i = 1; i < len; i++) args[i - 1] = arguments[i];
          handler.apply(this, args);
      }
    } else if (isObject(handler)) {
      len = arguments.length;
      args = new Array(len - 1);
      for (i = 1; i < len; i++) args[i - 1] = arguments[i];

      listeners = handler.slice();
      len = listeners.length;
      for (i = 0; i < len; i++) listeners[i].apply(this, args);
    }

    return true;
  };

  EventEmitter.prototype.addListener = function (type, listener) {
    var m;

    if (!isFunction(listener)) throw TypeError('listener must be a function');

    if (!this._events) this._events = {};

    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

    if (!this._events[type])
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;else if (isObject(this._events[type]))
      // If we've already got an array, just append.
      this._events[type].push(listener);else
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];

    // Check for listener leak
    if (isObject(this._events[type]) && !this._events[type].warned) {
      var m;
      if (!isUndefined(this._maxListeners)) {
        m = this._maxListeners;
      } else {
        m = EventEmitter.defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
        if (typeof console.trace === 'function') {
          // not supported in IE 10
          console.trace();
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.once = function (type, listener) {
    if (!isFunction(listener)) throw TypeError('listener must be a function');

    var fired = false;

    function g() {
      this.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(this, arguments);
      }
    }

    g.listener = listener;
    this.on(type, g);

    return this;
  };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener = function (type, listener) {
    var list, position, length, i;

    if (!isFunction(listener)) throw TypeError('listener must be a function');

    if (!this._events || !this._events[type]) return this;

    list = this._events[type];
    length = list.length;
    position = -1;

    if (list === listener || isFunction(list.listener) && list.listener === listener) {
      delete this._events[type];
      if (this._events.removeListener) this.emit('removeListener', type, listener);
    } else if (isObject(list)) {
      for (i = length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list.length = 0;
        delete this._events[type];
      } else {
        list.splice(position, 1);
      }

      if (this._events.removeListener) this.emit('removeListener', type, listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function (type) {
    var key, listeners;

    if (!this._events) return this;

    // not listening for removeListener, no need to emit
    if (!this._events.removeListener) {
      if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
      return this;
    }

    // emit removeListener for all listeners on all events
    if (arguments.length === 0) {
      for (key in this._events) {
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners('removeListener');
      this._events = {};
      return this;
    }

    listeners = this._events[type];

    if (isFunction(listeners)) {
      this.removeListener(type, listeners);
    } else {
      // LIFO order
      while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
    }
    delete this._events[type];

    return this;
  };

  EventEmitter.prototype.listeners = function (type) {
    var ret;
    if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    var ret;
    if (!emitter._events || !emitter._events[type]) ret = 0;else if (isFunction(emitter._events[type])) ret = 1;else ret = emitter._events[type].length;
    return ret;
  };

  function isFunction(arg) {
    return typeof arg === 'function';
  }

  function isNumber(arg) {
    return typeof arg === 'number';
  }

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  function isUndefined(arg) {
    return arg === void 0;
  }
  return module.exports;
});
System.registerDynamic("npm:events@1.0.2.js", ["npm:events@1.0.2/events.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:events@1.0.2/events.js");
  return module.exports;
});
System.registerDynamic('github:jspm/nodelibs-events@0.1.1/index.js', ['npm:events@1.0.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = System._nodeRequire ? System._nodeRequire('events') : $__require('npm:events@1.0.2.js');
  return module.exports;
});
System.registerDynamic("github:jspm/nodelibs-events@0.1.1.js", ["github:jspm/nodelibs-events@0.1.1/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("github:jspm/nodelibs-events@0.1.1/index.js");
  return module.exports;
});
System.registerDynamic('npm:lodash@4.16.2/lodash.js', ['@empty'], true, function ($__require, exports, module) {
  /* */
  "format cjs";

  var define,
      global = this || self,
      GLOBAL = global;
  (function (Buffer, process) {
    ;
    (function () {
      var undefined;
      var VERSION = '4.16.2';
      var LARGE_ARRAY_SIZE = 200;
      var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://github.com/es-shims.',
          FUNC_ERROR_TEXT = 'Expected a function';
      var HASH_UNDEFINED = '__lodash_hash_undefined__';
      var MAX_MEMOIZE_SIZE = 500;
      var PLACEHOLDER = '__lodash_placeholder__';
      var BIND_FLAG = 1,
          BIND_KEY_FLAG = 2,
          CURRY_BOUND_FLAG = 4,
          CURRY_FLAG = 8,
          CURRY_RIGHT_FLAG = 16,
          PARTIAL_FLAG = 32,
          PARTIAL_RIGHT_FLAG = 64,
          ARY_FLAG = 128,
          REARG_FLAG = 256,
          FLIP_FLAG = 512;
      var UNORDERED_COMPARE_FLAG = 1,
          PARTIAL_COMPARE_FLAG = 2;
      var DEFAULT_TRUNC_LENGTH = 30,
          DEFAULT_TRUNC_OMISSION = '...';
      var HOT_COUNT = 500,
          HOT_SPAN = 16;
      var LAZY_FILTER_FLAG = 1,
          LAZY_MAP_FLAG = 2,
          LAZY_WHILE_FLAG = 3;
      var INFINITY = 1 / 0,
          MAX_SAFE_INTEGER = 9007199254740991,
          MAX_INTEGER = 1.7976931348623157e+308,
          NAN = 0 / 0;
      var MAX_ARRAY_LENGTH = 4294967295,
          MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
          HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
      var wrapFlags = [['ary', ARY_FLAG], ['bind', BIND_FLAG], ['bindKey', BIND_KEY_FLAG], ['curry', CURRY_FLAG], ['curryRight', CURRY_RIGHT_FLAG], ['flip', FLIP_FLAG], ['partial', PARTIAL_FLAG], ['partialRight', PARTIAL_RIGHT_FLAG], ['rearg', REARG_FLAG]];
      var argsTag = '[object Arguments]',
          arrayTag = '[object Array]',
          boolTag = '[object Boolean]',
          dateTag = '[object Date]',
          errorTag = '[object Error]',
          funcTag = '[object Function]',
          genTag = '[object GeneratorFunction]',
          mapTag = '[object Map]',
          numberTag = '[object Number]',
          objectTag = '[object Object]',
          promiseTag = '[object Promise]',
          regexpTag = '[object RegExp]',
          setTag = '[object Set]',
          stringTag = '[object String]',
          symbolTag = '[object Symbol]',
          weakMapTag = '[object WeakMap]',
          weakSetTag = '[object WeakSet]';
      var arrayBufferTag = '[object ArrayBuffer]',
          dataViewTag = '[object DataView]',
          float32Tag = '[object Float32Array]',
          float64Tag = '[object Float64Array]',
          int8Tag = '[object Int8Array]',
          int16Tag = '[object Int16Array]',
          int32Tag = '[object Int32Array]',
          uint8Tag = '[object Uint8Array]',
          uint8ClampedTag = '[object Uint8ClampedArray]',
          uint16Tag = '[object Uint16Array]',
          uint32Tag = '[object Uint32Array]';
      var reEmptyStringLeading = /\b__p \+= '';/g,
          reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
          reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
      var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
          reUnescapedHtml = /[&<>"']/g,
          reHasEscapedHtml = RegExp(reEscapedHtml.source),
          reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
      var reEscape = /<%-([\s\S]+?)%>/g,
          reEvaluate = /<%([\s\S]+?)%>/g,
          reInterpolate = /<%=([\s\S]+?)%>/g;
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          reIsPlainProp = /^\w*$/,
          reLeadingDot = /^\./,
          rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
          reHasRegExpChar = RegExp(reRegExpChar.source);
      var reTrim = /^\s+|\s+$/g,
          reTrimStart = /^\s+/,
          reTrimEnd = /\s+$/;
      var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
          reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
          reSplitDetails = /,? & /;
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      var reEscapeChar = /\\(\\)?/g;
      var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
      var reFlags = /\w*$/;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsOctal = /^0o[0-7]+$/i;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var reNoMatch = /($^)/;
      var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
      var rsAstralRange = '\\ud800-\\udfff',
          rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
          rsComboSymbolsRange = '\\u20d0-\\u20f0',
          rsDingbatRange = '\\u2700-\\u27bf',
          rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
          rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
          rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
          rsPunctuationRange = '\\u2000-\\u206f',
          rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
          rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
          rsVarRange = '\\ufe0e\\ufe0f',
          rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos = "['\u2019]",
          rsAstral = '[' + rsAstralRange + ']',
          rsBreak = '[' + rsBreakRange + ']',
          rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
          rsDigits = '\\d+',
          rsDingbat = '[' + rsDingbatRange + ']',
          rsLower = '[' + rsLowerRange + ']',
          rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
          rsFitz = '\\ud83c[\\udffb-\\udfff]',
          rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
          rsNonAstral = '[^' + rsAstralRange + ']',
          rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
          rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
          rsUpper = '[' + rsUpperRange + ']',
          rsZWJ = '\\u200d';
      var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
          rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
          rsOptLowerContr = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
          rsOptUpperContr = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
          reOptMod = rsModifier + '?',
          rsOptVar = '[' + rsVarRange + ']?',
          rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
          rsSeq = rsOptVar + reOptMod + rsOptJoin,
          rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
          rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
      var reApos = RegExp(rsApos, 'g');
      var reComboMark = RegExp(rsCombo, 'g');
      var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
      var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptLowerContr + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsUpperMisc + '+' + rsOptUpperContr + '(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')', rsUpper + '?' + rsLowerMisc + '+' + rsOptLowerContr, rsUpper + '+' + rsOptUpperContr, rsDigits, rsEmoji].join('|'), 'g');
      var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      var contextProps = ['Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object', 'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'];
      var templateCounter = -1;
      var typedArrayTags = {};
      typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
      typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var deburredLetters = {
        '\xc0': 'A',
        '\xc1': 'A',
        '\xc2': 'A',
        '\xc3': 'A',
        '\xc4': 'A',
        '\xc5': 'A',
        '\xe0': 'a',
        '\xe1': 'a',
        '\xe2': 'a',
        '\xe3': 'a',
        '\xe4': 'a',
        '\xe5': 'a',
        '\xc7': 'C',
        '\xe7': 'c',
        '\xd0': 'D',
        '\xf0': 'd',
        '\xc8': 'E',
        '\xc9': 'E',
        '\xca': 'E',
        '\xcb': 'E',
        '\xe8': 'e',
        '\xe9': 'e',
        '\xea': 'e',
        '\xeb': 'e',
        '\xcc': 'I',
        '\xcd': 'I',
        '\xce': 'I',
        '\xcf': 'I',
        '\xec': 'i',
        '\xed': 'i',
        '\xee': 'i',
        '\xef': 'i',
        '\xd1': 'N',
        '\xf1': 'n',
        '\xd2': 'O',
        '\xd3': 'O',
        '\xd4': 'O',
        '\xd5': 'O',
        '\xd6': 'O',
        '\xd8': 'O',
        '\xf2': 'o',
        '\xf3': 'o',
        '\xf4': 'o',
        '\xf5': 'o',
        '\xf6': 'o',
        '\xf8': 'o',
        '\xd9': 'U',
        '\xda': 'U',
        '\xdb': 'U',
        '\xdc': 'U',
        '\xf9': 'u',
        '\xfa': 'u',
        '\xfb': 'u',
        '\xfc': 'u',
        '\xdd': 'Y',
        '\xfd': 'y',
        '\xff': 'y',
        '\xc6': 'Ae',
        '\xe6': 'ae',
        '\xde': 'Th',
        '\xfe': 'th',
        '\xdf': 'ss',
        '\u0100': 'A',
        '\u0102': 'A',
        '\u0104': 'A',
        '\u0101': 'a',
        '\u0103': 'a',
        '\u0105': 'a',
        '\u0106': 'C',
        '\u0108': 'C',
        '\u010a': 'C',
        '\u010c': 'C',
        '\u0107': 'c',
        '\u0109': 'c',
        '\u010b': 'c',
        '\u010d': 'c',
        '\u010e': 'D',
        '\u0110': 'D',
        '\u010f': 'd',
        '\u0111': 'd',
        '\u0112': 'E',
        '\u0114': 'E',
        '\u0116': 'E',
        '\u0118': 'E',
        '\u011a': 'E',
        '\u0113': 'e',
        '\u0115': 'e',
        '\u0117': 'e',
        '\u0119': 'e',
        '\u011b': 'e',
        '\u011c': 'G',
        '\u011e': 'G',
        '\u0120': 'G',
        '\u0122': 'G',
        '\u011d': 'g',
        '\u011f': 'g',
        '\u0121': 'g',
        '\u0123': 'g',
        '\u0124': 'H',
        '\u0126': 'H',
        '\u0125': 'h',
        '\u0127': 'h',
        '\u0128': 'I',
        '\u012a': 'I',
        '\u012c': 'I',
        '\u012e': 'I',
        '\u0130': 'I',
        '\u0129': 'i',
        '\u012b': 'i',
        '\u012d': 'i',
        '\u012f': 'i',
        '\u0131': 'i',
        '\u0134': 'J',
        '\u0135': 'j',
        '\u0136': 'K',
        '\u0137': 'k',
        '\u0138': 'k',
        '\u0139': 'L',
        '\u013b': 'L',
        '\u013d': 'L',
        '\u013f': 'L',
        '\u0141': 'L',
        '\u013a': 'l',
        '\u013c': 'l',
        '\u013e': 'l',
        '\u0140': 'l',
        '\u0142': 'l',
        '\u0143': 'N',
        '\u0145': 'N',
        '\u0147': 'N',
        '\u014a': 'N',
        '\u0144': 'n',
        '\u0146': 'n',
        '\u0148': 'n',
        '\u014b': 'n',
        '\u014c': 'O',
        '\u014e': 'O',
        '\u0150': 'O',
        '\u014d': 'o',
        '\u014f': 'o',
        '\u0151': 'o',
        '\u0154': 'R',
        '\u0156': 'R',
        '\u0158': 'R',
        '\u0155': 'r',
        '\u0157': 'r',
        '\u0159': 'r',
        '\u015a': 'S',
        '\u015c': 'S',
        '\u015e': 'S',
        '\u0160': 'S',
        '\u015b': 's',
        '\u015d': 's',
        '\u015f': 's',
        '\u0161': 's',
        '\u0162': 'T',
        '\u0164': 'T',
        '\u0166': 'T',
        '\u0163': 't',
        '\u0165': 't',
        '\u0167': 't',
        '\u0168': 'U',
        '\u016a': 'U',
        '\u016c': 'U',
        '\u016e': 'U',
        '\u0170': 'U',
        '\u0172': 'U',
        '\u0169': 'u',
        '\u016b': 'u',
        '\u016d': 'u',
        '\u016f': 'u',
        '\u0171': 'u',
        '\u0173': 'u',
        '\u0174': 'W',
        '\u0175': 'w',
        '\u0176': 'Y',
        '\u0177': 'y',
        '\u0178': 'Y',
        '\u0179': 'Z',
        '\u017b': 'Z',
        '\u017d': 'Z',
        '\u017a': 'z',
        '\u017c': 'z',
        '\u017e': 'z',
        '\u0132': 'IJ',
        '\u0133': 'ij',
        '\u0152': 'Oe',
        '\u0153': 'oe',
        '\u0149': "'n",
        '\u017f': 's'
      };
      var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      var htmlUnescapes = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
      };
      var stringEscapes = {
        '\\': '\\',
        "'": "'",
        '\n': 'n',
        '\r': 'r',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
      };
      var freeParseFloat = parseFloat,
          freeParseInt = parseInt;
      var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
      var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function('return this')();
      var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var nodeUtil = function () {
        try {
          return freeProcess && freeProcess.binding('util');
        } catch (e) {}
      }();
      var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
          nodeIsDate = nodeUtil && nodeUtil.isDate,
          nodeIsMap = nodeUtil && nodeUtil.isMap,
          nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
          nodeIsSet = nodeUtil && nodeUtil.isSet,
          nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      function addMapEntry(map, pair) {
        map.set(pair[0], pair[1]);
        return map;
      }
      function addSetEntry(set, value) {
        set.add(value);
        return set;
      }
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      function arrayAggregator(array, setter, iteratee, accumulator) {
        var index = -1,
            length = array ? array.length : 0;
        while (++index < length) {
          var value = array[index];
          setter(accumulator, value, iteratee(value), array);
        }
        return accumulator;
      }
      function arrayEach(array, iteratee) {
        var index = -1,
            length = array ? array.length : 0;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEachRight(array, iteratee) {
        var length = array ? array.length : 0;
        while (length--) {
          if (iteratee(array[length], length, array) === false) {
            break;
          }
        }
        return array;
      }
      function arrayEvery(array, predicate) {
        var index = -1,
            length = array ? array.length : 0;
        while (++index < length) {
          if (!predicate(array[index], index, array)) {
            return false;
          }
        }
        return true;
      }
      function arrayFilter(array, predicate) {
        var index = -1,
            length = array ? array.length : 0,
            resIndex = 0,
            result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function arrayIncludes(array, value) {
        var length = array ? array.length : 0;
        return !!length && baseIndexOf(array, value, 0) > -1;
      }
      function arrayIncludesWith(array, value, comparator) {
        var index = -1,
            length = array ? array.length : 0;
        while (++index < length) {
          if (comparator(value, array[index])) {
            return true;
          }
        }
        return false;
      }
      function arrayMap(array, iteratee) {
        var index = -1,
            length = array ? array.length : 0,
            result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      function arrayPush(array, values) {
        var index = -1,
            length = values.length,
            offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1,
            length = array ? array.length : 0;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      function arrayReduceRight(array, iteratee, accumulator, initAccum) {
        var length = array ? array.length : 0;
        if (initAccum && length) {
          accumulator = array[--length];
        }
        while (length--) {
          accumulator = iteratee(accumulator, array[length], length, array);
        }
        return accumulator;
      }
      function arraySome(array, predicate) {
        var index = -1,
            length = array ? array.length : 0;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      var asciiSize = baseProperty('length');
      function asciiToArray(string) {
        return string.split('');
      }
      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }
      function baseFindKey(collection, predicate, eachFunc) {
        var result;
        eachFunc(collection, function (value, key, collection) {
          if (predicate(value, key, collection)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      function baseFindIndex(array, predicate, fromIndex, fromRight) {
        var length = array.length,
            index = fromIndex + (fromRight ? 1 : -1);
        while (fromRight ? index-- : ++index < length) {
          if (predicate(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
      function baseIndexOf(array, value, fromIndex) {
        return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
      }
      function baseIndexOfWith(array, value, fromIndex, comparator) {
        var index = fromIndex - 1,
            length = array.length;
        while (++index < length) {
          if (comparator(array[index], value)) {
            return index;
          }
        }
        return -1;
      }
      function baseIsNaN(value) {
        return value !== value;
      }
      function baseMean(array, iteratee) {
        var length = array ? array.length : 0;
        return length ? baseSum(array, iteratee) / length : NAN;
      }
      function baseProperty(key) {
        return function (object) {
          return object == null ? undefined : object[key];
        };
      }
      function basePropertyOf(object) {
        return function (key) {
          return object == null ? undefined : object[key];
        };
      }
      function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
        eachFunc(collection, function (value, index, collection) {
          accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
        });
        return accumulator;
      }
      function baseSortBy(array, comparer) {
        var length = array.length;
        array.sort(comparer);
        while (length--) {
          array[length] = array[length].value;
        }
        return array;
      }
      function baseSum(array, iteratee) {
        var result,
            index = -1,
            length = array.length;
        while (++index < length) {
          var current = iteratee(array[index]);
          if (current !== undefined) {
            result = result === undefined ? current : result + current;
          }
        }
        return result;
      }
      function baseTimes(n, iteratee) {
        var index = -1,
            result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      function baseToPairs(object, props) {
        return arrayMap(props, function (key) {
          return [key, object[key]];
        });
      }
      function baseUnary(func) {
        return function (value) {
          return func(value);
        };
      }
      function baseValues(object, props) {
        return arrayMap(props, function (key) {
          return object[key];
        });
      }
      function cacheHas(cache, key) {
        return cache.has(key);
      }
      function charsStartIndex(strSymbols, chrSymbols) {
        var index = -1,
            length = strSymbols.length;
        while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
        return index;
      }
      function charsEndIndex(strSymbols, chrSymbols) {
        var index = strSymbols.length;
        while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
        return index;
      }
      function countHolders(array, placeholder) {
        var length = array.length,
            result = 0;
        while (length--) {
          if (array[length] === placeholder) {
            ++result;
          }
        }
        return result;
      }
      var deburrLetter = basePropertyOf(deburredLetters);
      var escapeHtmlChar = basePropertyOf(htmlEscapes);
      function escapeStringChar(chr) {
        return '\\' + stringEscapes[chr];
      }
      function getValue(object, key) {
        return object == null ? undefined : object[key];
      }
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }
      function iteratorToArray(iterator) {
        var data,
            result = [];
        while (!(data = iterator.next()).done) {
          result.push(data.value);
        }
        return result;
      }
      function mapToArray(map) {
        var index = -1,
            result = Array(map.size);
        map.forEach(function (value, key) {
          result[++index] = [key, value];
        });
        return result;
      }
      function overArg(func, transform) {
        return function (arg) {
          return func(transform(arg));
        };
      }
      function replaceHolders(array, placeholder) {
        var index = -1,
            length = array.length,
            resIndex = 0,
            result = [];
        while (++index < length) {
          var value = array[index];
          if (value === placeholder || value === PLACEHOLDER) {
            array[index] = PLACEHOLDER;
            result[resIndex++] = index;
          }
        }
        return result;
      }
      function setToArray(set) {
        var index = -1,
            result = Array(set.size);
        set.forEach(function (value) {
          result[++index] = value;
        });
        return result;
      }
      function setToPairs(set) {
        var index = -1,
            result = Array(set.size);
        set.forEach(function (value) {
          result[++index] = [value, value];
        });
        return result;
      }
      function strictIndexOf(array, value, fromIndex) {
        var index = fromIndex - 1,
            length = array.length;
        while (++index < length) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
      function strictLastIndexOf(array, value, fromIndex) {
        var index = fromIndex + 1;
        while (index--) {
          if (array[index] === value) {
            return index;
          }
        }
        return index;
      }
      function stringSize(string) {
        return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
      }
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
      function unicodeSize(string) {
        var result = reUnicode.lastIndex = 0;
        while (reUnicode.test(string)) {
          ++result;
        }
        return result;
      }
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }
      var runInContext = function runInContext(context) {
        context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
        var Array = context.Array,
            Date = context.Date,
            Error = context.Error,
            Function = context.Function,
            Math = context.Math,
            Object = context.Object,
            RegExp = context.RegExp,
            String = context.String,
            TypeError = context.TypeError;
        var arrayProto = Array.prototype,
            funcProto = Function.prototype,
            objectProto = Object.prototype;
        var coreJsData = context['__core-js_shared__'];
        var maskSrcKey = function () {
          var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
          return uid ? 'Symbol(src)_1.' + uid : '';
        }();
        var funcToString = funcProto.toString;
        var hasOwnProperty = objectProto.hasOwnProperty;
        var idCounter = 0;
        var objectCtorString = funcToString.call(Object);
        var objectToString = objectProto.toString;
        var oldDash = root._;
        var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
        var Buffer = moduleExports ? context.Buffer : undefined,
            Symbol = context.Symbol,
            Uint8Array = context.Uint8Array,
            allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
            defineProperty = Object.defineProperty,
            getPrototype = overArg(Object.getPrototypeOf, Object),
            iteratorSymbol = Symbol ? Symbol.iterator : undefined,
            objectCreate = Object.create,
            propertyIsEnumerable = objectProto.propertyIsEnumerable,
            splice = arrayProto.splice,
            spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
        var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
            ctxNow = Date && Date.now !== root.Date.now && Date.now,
            ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
        var nativeCeil = Math.ceil,
            nativeFloor = Math.floor,
            nativeGetSymbols = Object.getOwnPropertySymbols,
            nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
            nativeIsFinite = context.isFinite,
            nativeJoin = arrayProto.join,
            nativeKeys = overArg(Object.keys, Object),
            nativeMax = Math.max,
            nativeMin = Math.min,
            nativeNow = Date.now,
            nativeParseInt = context.parseInt,
            nativeRandom = Math.random,
            nativeReverse = arrayProto.reverse;
        var DataView = getNative(context, 'DataView'),
            Map = getNative(context, 'Map'),
            Promise = getNative(context, 'Promise'),
            Set = getNative(context, 'Set'),
            WeakMap = getNative(context, 'WeakMap'),
            nativeCreate = getNative(Object, 'create'),
            nativeDefineProperty = getNative(Object, 'defineProperty');
        var metaMap = WeakMap && new WeakMap();
        var realNames = {};
        var dataViewCtorString = toSource(DataView),
            mapCtorString = toSource(Map),
            promiseCtorString = toSource(Promise),
            setCtorString = toSource(Set),
            weakMapCtorString = toSource(WeakMap);
        var symbolProto = Symbol ? Symbol.prototype : undefined,
            symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
            symbolToString = symbolProto ? symbolProto.toString : undefined;
        function lodash(value) {
          if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
            if (value instanceof LodashWrapper) {
              return value;
            }
            if (hasOwnProperty.call(value, '__wrapped__')) {
              return wrapperClone(value);
            }
          }
          return new LodashWrapper(value);
        }
        var baseCreate = function () {
          function object() {}
          return function (proto) {
            if (!isObject(proto)) {
              return {};
            }
            if (objectCreate) {
              return objectCreate(proto);
            }
            object.prototype = prototype;
            var result = new object();
            object.prototype = undefined;
            return result;
          };
        }();
        function baseLodash() {}
        function LodashWrapper(value, chainAll) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__chain__ = !!chainAll;
          this.__index__ = 0;
          this.__values__ = undefined;
        }
        lodash.templateSettings = {
          'escape': reEscape,
          'evaluate': reEvaluate,
          'interpolate': reInterpolate,
          'variable': '',
          'imports': { '_': lodash }
        };
        lodash.prototype = baseLodash.prototype;
        lodash.prototype.constructor = lodash;
        LodashWrapper.prototype = baseCreate(baseLodash.prototype);
        LodashWrapper.prototype.constructor = LodashWrapper;
        function LazyWrapper(value) {
          this.__wrapped__ = value;
          this.__actions__ = [];
          this.__dir__ = 1;
          this.__filtered__ = false;
          this.__iteratees__ = [];
          this.__takeCount__ = MAX_ARRAY_LENGTH;
          this.__views__ = [];
        }
        function lazyClone() {
          var result = new LazyWrapper(this.__wrapped__);
          result.__actions__ = copyArray(this.__actions__);
          result.__dir__ = this.__dir__;
          result.__filtered__ = this.__filtered__;
          result.__iteratees__ = copyArray(this.__iteratees__);
          result.__takeCount__ = this.__takeCount__;
          result.__views__ = copyArray(this.__views__);
          return result;
        }
        function lazyReverse() {
          if (this.__filtered__) {
            var result = new LazyWrapper(this);
            result.__dir__ = -1;
            result.__filtered__ = true;
          } else {
            result = this.clone();
            result.__dir__ *= -1;
          }
          return result;
        }
        function lazyValue() {
          var array = this.__wrapped__.value(),
              dir = this.__dir__,
              isArr = isArray(array),
              isRight = dir < 0,
              arrLength = isArr ? array.length : 0,
              view = getView(0, arrLength, this.__views__),
              start = view.start,
              end = view.end,
              length = end - start,
              index = isRight ? end : start - 1,
              iteratees = this.__iteratees__,
              iterLength = iteratees.length,
              resIndex = 0,
              takeCount = nativeMin(length, this.__takeCount__);
          if (!isArr || arrLength < LARGE_ARRAY_SIZE || arrLength == length && takeCount == length) {
            return baseWrapperValue(array, this.__actions__);
          }
          var result = [];
          outer: while (length-- && resIndex < takeCount) {
            index += dir;
            var iterIndex = -1,
                value = array[index];
            while (++iterIndex < iterLength) {
              var data = iteratees[iterIndex],
                  iteratee = data.iteratee,
                  type = data.type,
                  computed = iteratee(value);
              if (type == LAZY_MAP_FLAG) {
                value = computed;
              } else if (!computed) {
                if (type == LAZY_FILTER_FLAG) {
                  continue outer;
                } else {
                  break outer;
                }
              }
            }
            result[resIndex++] = value;
          }
          return result;
        }
        LazyWrapper.prototype = baseCreate(baseLodash.prototype);
        LazyWrapper.prototype.constructor = LazyWrapper;
        function Hash(entries) {
          var index = -1,
              length = entries ? entries.length : 0;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
          this.size = 0;
        }
        function hashDelete(key) {
          var result = this.has(key) && delete this.__data__[key];
          this.size -= result ? 1 : 0;
          return result;
        }
        function hashGet(key) {
          var data = this.__data__;
          if (nativeCreate) {
            var result = data[key];
            return result === HASH_UNDEFINED ? undefined : result;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined;
        }
        function hashHas(key) {
          var data = this.__data__;
          return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
        }
        function hashSet(key, value) {
          var data = this.__data__;
          this.size += this.has(key) ? 0 : 1;
          data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
          return this;
        }
        Hash.prototype.clear = hashClear;
        Hash.prototype['delete'] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;
        function ListCache(entries) {
          var index = -1,
              length = entries ? entries.length : 0;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function listCacheClear() {
          this.__data__ = [];
          this.size = 0;
        }
        function listCacheDelete(key) {
          var data = this.__data__,
              index = assocIndexOf(data, key);
          if (index < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          --this.size;
          return true;
        }
        function listCacheGet(key) {
          var data = this.__data__,
              index = assocIndexOf(data, key);
          return index < 0 ? undefined : data[index][1];
        }
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }
        function listCacheSet(key, value) {
          var data = this.__data__,
              index = assocIndexOf(data, key);
          if (index < 0) {
            ++this.size;
            data.push([key, value]);
          } else {
            data[index][1] = value;
          }
          return this;
        }
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype['delete'] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;
        function MapCache(entries) {
          var index = -1,
              length = entries ? entries.length : 0;
          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }
        function mapCacheClear() {
          this.size = 0;
          this.__data__ = {
            'hash': new Hash(),
            'map': new (Map || ListCache)(),
            'string': new Hash()
          };
        }
        function mapCacheDelete(key) {
          var result = getMapData(this, key)['delete'](key);
          this.size -= result ? 1 : 0;
          return result;
        }
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }
        function mapCacheSet(key, value) {
          var data = getMapData(this, key),
              size = data.size;
          data.set(key, value);
          this.size += data.size == size ? 0 : 1;
          return this;
        }
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype['delete'] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;
        function SetCache(values) {
          var index = -1,
              length = values ? values.length : 0;
          this.__data__ = new MapCache();
          while (++index < length) {
            this.add(values[index]);
          }
        }
        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }
        function setCacheHas(value) {
          return this.__data__.has(value);
        }
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;
        function Stack(entries) {
          var data = this.__data__ = new ListCache(entries);
          this.size = data.size;
        }
        function stackClear() {
          this.__data__ = new ListCache();
          this.size = 0;
        }
        function stackDelete(key) {
          var data = this.__data__,
              result = data['delete'](key);
          this.size = data.size;
          return result;
        }
        function stackGet(key) {
          return this.__data__.get(key);
        }
        function stackHas(key) {
          return this.__data__.has(key);
        }
        function stackSet(key, value) {
          var data = this.__data__;
          if (data instanceof ListCache) {
            var pairs = data.__data__;
            if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
              pairs.push([key, value]);
              this.size = ++data.size;
              return this;
            }
            data = this.__data__ = new MapCache(pairs);
          }
          data.set(key, value);
          this.size = data.size;
          return this;
        }
        Stack.prototype.clear = stackClear;
        Stack.prototype['delete'] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;
        function arrayLikeKeys(value, inherited) {
          var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
          var length = result.length,
              skipIndexes = !!length;
          for (var key in value) {
            if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
              result.push(key);
            }
          }
          return result;
        }
        function arraySample(array) {
          var length = array.length;
          return length ? array[baseRandom(0, length - 1)] : undefined;
        }
        function arraySampleSize(array, n) {
          return shuffleSelf(copyArray(array), n);
        }
        function arrayShuffle(array) {
          return shuffleSelf(copyArray(array));
        }
        function assignInDefaults(objValue, srcValue, key, object) {
          if (objValue === undefined || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
            return srcValue;
          }
          return objValue;
        }
        function assignMergeValue(object, key, value) {
          if (value !== undefined && !eq(object[key], value) || typeof key == 'number' && value === undefined && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assignValue(object, key, value) {
          var objValue = object[key];
          if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
            baseAssignValue(object, key, value);
          }
        }
        function assocIndexOf(array, key) {
          var length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }
        function baseAggregator(collection, setter, iteratee, accumulator) {
          baseEach(collection, function (value, key, collection) {
            setter(accumulator, value, iteratee(value), collection);
          });
          return accumulator;
        }
        function baseAssign(object, source) {
          return object && copyObject(source, keys(source), object);
        }
        function baseAssignValue(object, key, value) {
          if (key == '__proto__' && defineProperty) {
            defineProperty(object, key, {
              'configurable': true,
              'enumerable': true,
              'value': value,
              'writable': true
            });
          } else {
            object[key] = value;
          }
        }
        function baseAt(object, paths) {
          var index = -1,
              isNil = object == null,
              length = paths.length,
              result = Array(length);
          while (++index < length) {
            result[index] = isNil ? undefined : get(object, paths[index]);
          }
          return result;
        }
        function baseClamp(number, lower, upper) {
          if (number === number) {
            if (upper !== undefined) {
              number = number <= upper ? number : upper;
            }
            if (lower !== undefined) {
              number = number >= lower ? number : lower;
            }
          }
          return number;
        }
        function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
          var result;
          if (customizer) {
            result = object ? customizer(value, key, object, stack) : customizer(value);
          }
          if (result !== undefined) {
            return result;
          }
          if (!isObject(value)) {
            return value;
          }
          var isArr = isArray(value);
          if (isArr) {
            result = initCloneArray(value);
            if (!isDeep) {
              return copyArray(value, result);
            }
          } else {
            var tag = getTag(value),
                isFunc = tag == funcTag || tag == genTag;
            if (isBuffer(value)) {
              return cloneBuffer(value, isDeep);
            }
            if (tag == objectTag || tag == argsTag || isFunc && !object) {
              result = initCloneObject(isFunc ? {} : value);
              if (!isDeep) {
                return copySymbols(value, baseAssign(result, value));
              }
            } else {
              if (!cloneableTags[tag]) {
                return object ? value : {};
              }
              result = initCloneByTag(value, tag, baseClone, isDeep);
            }
          }
          stack || (stack = new Stack());
          var stacked = stack.get(value);
          if (stacked) {
            return stacked;
          }
          stack.set(value, result);
          if (!isArr) {
            var props = isFull ? getAllKeys(value) : keys(value);
          }
          arrayEach(props || value, function (subValue, key) {
            if (props) {
              key = subValue;
              subValue = value[key];
            }
            assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
          });
          return result;
        }
        function baseConforms(source) {
          var props = keys(source);
          return function (object) {
            return baseConformsTo(object, source, props);
          };
        }
        function baseConformsTo(object, source, props) {
          var length = props.length;
          if (object == null) {
            return !length;
          }
          object = Object(object);
          while (length--) {
            var key = props[length],
                predicate = source[key],
                value = object[key];
            if (value === undefined && !(key in object) || !predicate(value)) {
              return false;
            }
          }
          return true;
        }
        function baseDelay(func, wait, args) {
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          return setTimeout(function () {
            func.apply(undefined, args);
          }, wait);
        }
        function baseDifference(array, values, iteratee, comparator) {
          var index = -1,
              includes = arrayIncludes,
              isCommon = true,
              length = array.length,
              result = [],
              valuesLength = values.length;
          if (!length) {
            return result;
          }
          if (iteratee) {
            values = arrayMap(values, baseUnary(iteratee));
          }
          if (comparator) {
            includes = arrayIncludesWith;
            isCommon = false;
          } else if (values.length >= LARGE_ARRAY_SIZE) {
            includes = cacheHas;
            isCommon = false;
            values = new SetCache(values);
          }
          outer: while (++index < length) {
            var value = array[index],
                computed = iteratee ? iteratee(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var valuesIndex = valuesLength;
              while (valuesIndex--) {
                if (values[valuesIndex] === computed) {
                  continue outer;
                }
              }
              result.push(value);
            } else if (!includes(values, computed, comparator)) {
              result.push(value);
            }
          }
          return result;
        }
        var baseEach = createBaseEach(baseForOwn);
        var baseEachRight = createBaseEach(baseForOwnRight, true);
        function baseEvery(collection, predicate) {
          var result = true;
          baseEach(collection, function (value, index, collection) {
            result = !!predicate(value, index, collection);
            return result;
          });
          return result;
        }
        function baseExtremum(array, iteratee, comparator) {
          var index = -1,
              length = array.length;
          while (++index < length) {
            var value = array[index],
                current = iteratee(value);
            if (current != null && (computed === undefined ? current === current && !isSymbol(current) : comparator(current, computed))) {
              var computed = current,
                  result = value;
            }
          }
          return result;
        }
        function baseFill(array, value, start, end) {
          var length = array.length;
          start = toInteger(start);
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end === undefined || end > length ? length : toInteger(end);
          if (end < 0) {
            end += length;
          }
          end = start > end ? 0 : toLength(end);
          while (start < end) {
            array[start++] = value;
          }
          return array;
        }
        function baseFilter(collection, predicate) {
          var result = [];
          baseEach(collection, function (value, index, collection) {
            if (predicate(value, index, collection)) {
              result.push(value);
            }
          });
          return result;
        }
        function baseFlatten(array, depth, predicate, isStrict, result) {
          var index = -1,
              length = array.length;
          predicate || (predicate = isFlattenable);
          result || (result = []);
          while (++index < length) {
            var value = array[index];
            if (depth > 0 && predicate(value)) {
              if (depth > 1) {
                baseFlatten(value, depth - 1, predicate, isStrict, result);
              } else {
                arrayPush(result, value);
              }
            } else if (!isStrict) {
              result[result.length] = value;
            }
          }
          return result;
        }
        var baseFor = createBaseFor();
        var baseForRight = createBaseFor(true);
        function baseForOwn(object, iteratee) {
          return object && baseFor(object, iteratee, keys);
        }
        function baseForOwnRight(object, iteratee) {
          return object && baseForRight(object, iteratee, keys);
        }
        function baseFunctions(object, props) {
          return arrayFilter(props, function (key) {
            return isFunction(object[key]);
          });
        }
        function baseGet(object, path) {
          path = isKey(path, object) ? [path] : castPath(path);
          var index = 0,
              length = path.length;
          while (object != null && index < length) {
            object = object[toKey(path[index++])];
          }
          return index && index == length ? object : undefined;
        }
        function baseGetAllKeys(object, keysFunc, symbolsFunc) {
          var result = keysFunc(object);
          return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
        }
        function baseGetTag(value) {
          return objectToString.call(value);
        }
        function baseGt(value, other) {
          return value > other;
        }
        function baseHas(object, key) {
          return object != null && hasOwnProperty.call(object, key);
        }
        function baseHasIn(object, key) {
          return object != null && key in Object(object);
        }
        function baseInRange(number, start, end) {
          return number >= nativeMin(start, end) && number < nativeMax(start, end);
        }
        function baseIntersection(arrays, iteratee, comparator) {
          var includes = comparator ? arrayIncludesWith : arrayIncludes,
              length = arrays[0].length,
              othLength = arrays.length,
              othIndex = othLength,
              caches = Array(othLength),
              maxLength = Infinity,
              result = [];
          while (othIndex--) {
            var array = arrays[othIndex];
            if (othIndex && iteratee) {
              array = arrayMap(array, baseUnary(iteratee));
            }
            maxLength = nativeMin(array.length, maxLength);
            caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined;
          }
          array = arrays[0];
          var index = -1,
              seen = caches[0];
          outer: while (++index < length && result.length < maxLength) {
            var value = array[index],
                computed = iteratee ? iteratee(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
              othIndex = othLength;
              while (--othIndex) {
                var cache = caches[othIndex];
                if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
                  continue outer;
                }
              }
              if (seen) {
                seen.push(computed);
              }
              result.push(value);
            }
          }
          return result;
        }
        function baseInverter(object, setter, iteratee, accumulator) {
          baseForOwn(object, function (value, key, object) {
            setter(accumulator, iteratee(value), key, object);
          });
          return accumulator;
        }
        function baseInvoke(object, path, args) {
          if (!isKey(path, object)) {
            path = castPath(path);
            object = parent(object, path);
            path = last(path);
          }
          var func = object == null ? object : object[toKey(path)];
          return func == null ? undefined : apply(func, object, args);
        }
        function baseIsArrayBuffer(value) {
          return isObjectLike(value) && objectToString.call(value) == arrayBufferTag;
        }
        function baseIsDate(value) {
          return isObjectLike(value) && objectToString.call(value) == dateTag;
        }
        function baseIsEqual(value, other, customizer, bitmask, stack) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || !isObject(value) && !isObjectLike(other)) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
        }
        function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
          var objIsArr = isArray(object),
              othIsArr = isArray(other),
              objTag = arrayTag,
              othTag = arrayTag;
          if (!objIsArr) {
            objTag = getTag(object);
            objTag = objTag == argsTag ? objectTag : objTag;
          }
          if (!othIsArr) {
            othTag = getTag(other);
            othTag = othTag == argsTag ? objectTag : othTag;
          }
          var objIsObj = objTag == objectTag,
              othIsObj = othTag == objectTag,
              isSameTag = objTag == othTag;
          if (isSameTag && !objIsObj) {
            stack || (stack = new Stack());
            return objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
          }
          if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
                othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object,
                  othUnwrapped = othIsWrapped ? other.value() : other;
              stack || (stack = new Stack());
              return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack || (stack = new Stack());
          return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
        }
        function baseIsMap(value) {
          return isObjectLike(value) && getTag(value) == mapTag;
        }
        function baseIsMatch(object, source, matchData, customizer) {
          var index = matchData.length,
              length = index,
              noCustomizer = !customizer;
          if (object == null) {
            return !length;
          }
          object = Object(object);
          while (index--) {
            var data = matchData[index];
            if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
              return false;
            }
          }
          while (++index < length) {
            data = matchData[index];
            var key = data[0],
                objValue = object[key],
                srcValue = data[1];
            if (noCustomizer && data[2]) {
              if (objValue === undefined && !(key in object)) {
                return false;
              }
            } else {
              var stack = new Stack();
              if (customizer) {
                var result = customizer(objValue, srcValue, key, object, source, stack);
              }
              if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
                return false;
              }
            }
          }
          return true;
        }
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }
        function baseIsRegExp(value) {
          return isObject(value) && objectToString.call(value) == regexpTag;
        }
        function baseIsSet(value) {
          return isObjectLike(value) && getTag(value) == setTag;
        }
        function baseIsTypedArray(value) {
          return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
        }
        function baseIteratee(value) {
          if (typeof value == 'function') {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == 'object') {
            return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
          }
          return property(value);
        }
        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result = [];
          for (var key in Object(object)) {
            if (hasOwnProperty.call(object, key) && key != 'constructor') {
              result.push(key);
            }
          }
          return result;
        }
        function baseKeysIn(object) {
          if (!isObject(object)) {
            return nativeKeysIn(object);
          }
          var isProto = isPrototype(object),
              result = [];
          for (var key in object) {
            if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
              result.push(key);
            }
          }
          return result;
        }
        function baseLt(value, other) {
          return value < other;
        }
        function baseMap(collection, iteratee) {
          var index = -1,
              result = isArrayLike(collection) ? Array(collection.length) : [];
          baseEach(collection, function (value, key, collection) {
            result[++index] = iteratee(value, key, collection);
          });
          return result;
        }
        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function (object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }
        function baseMatchesProperty(path, srcValue) {
          if (isKey(path) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path), srcValue);
          }
          return function (object) {
            var objValue = get(object, path);
            return objValue === undefined && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
          };
        }
        function baseMerge(object, source, srcIndex, customizer, stack) {
          if (object === source) {
            return;
          }
          if (!(isArray(source) || isTypedArray(source))) {
            var props = baseKeysIn(source);
          }
          arrayEach(props || source, function (srcValue, key) {
            if (props) {
              key = srcValue;
              srcValue = source[key];
            }
            if (isObject(srcValue)) {
              stack || (stack = new Stack());
              baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
            } else {
              var newValue = customizer ? customizer(object[key], srcValue, key + '', object, source, stack) : undefined;
              if (newValue === undefined) {
                newValue = srcValue;
              }
              assignMergeValue(object, key, newValue);
            }
          });
        }
        function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
          var objValue = object[key],
              srcValue = source[key],
              stacked = stack.get(srcValue);
          if (stacked) {
            assignMergeValue(object, key, stacked);
            return;
          }
          var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;
          var isCommon = newValue === undefined;
          if (isCommon) {
            newValue = srcValue;
            if (isArray(srcValue) || isTypedArray(srcValue)) {
              if (isArray(objValue)) {
                newValue = objValue;
              } else if (isArrayLikeObject(objValue)) {
                newValue = copyArray(objValue);
              } else {
                isCommon = false;
                newValue = baseClone(srcValue, true);
              }
            } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
              if (isArguments(objValue)) {
                newValue = toPlainObject(objValue);
              } else if (!isObject(objValue) || srcIndex && isFunction(objValue)) {
                isCommon = false;
                newValue = baseClone(srcValue, true);
              } else {
                newValue = objValue;
              }
            } else {
              isCommon = false;
            }
          }
          if (isCommon) {
            stack.set(srcValue, newValue);
            mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
            stack['delete'](srcValue);
          }
          assignMergeValue(object, key, newValue);
        }
        function baseNth(array, n) {
          var length = array.length;
          if (!length) {
            return;
          }
          n += n < 0 ? length : 0;
          return isIndex(n, length) ? array[n] : undefined;
        }
        function baseOrderBy(collection, iteratees, orders) {
          var index = -1;
          iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(getIteratee()));
          var result = baseMap(collection, function (value, key, collection) {
            var criteria = arrayMap(iteratees, function (iteratee) {
              return iteratee(value);
            });
            return {
              'criteria': criteria,
              'index': ++index,
              'value': value
            };
          });
          return baseSortBy(result, function (object, other) {
            return compareMultiple(object, other, orders);
          });
        }
        function basePick(object, props) {
          object = Object(object);
          return basePickBy(object, props, function (value, key) {
            return key in object;
          });
        }
        function basePickBy(object, props, predicate) {
          var index = -1,
              length = props.length,
              result = {};
          while (++index < length) {
            var key = props[index],
                value = object[key];
            if (predicate(value, key)) {
              baseAssignValue(result, key, value);
            }
          }
          return result;
        }
        function basePropertyDeep(path) {
          return function (object) {
            return baseGet(object, path);
          };
        }
        function basePullAll(array, values, iteratee, comparator) {
          var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
              index = -1,
              length = values.length,
              seen = array;
          if (array === values) {
            values = copyArray(values);
          }
          if (iteratee) {
            seen = arrayMap(array, baseUnary(iteratee));
          }
          while (++index < length) {
            var fromIndex = 0,
                value = values[index],
                computed = iteratee ? iteratee(value) : value;
            while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
              if (seen !== array) {
                splice.call(seen, fromIndex, 1);
              }
              splice.call(array, fromIndex, 1);
            }
          }
          return array;
        }
        function basePullAt(array, indexes) {
          var length = array ? indexes.length : 0,
              lastIndex = length - 1;
          while (length--) {
            var index = indexes[length];
            if (length == lastIndex || index !== previous) {
              var previous = index;
              if (isIndex(index)) {
                splice.call(array, index, 1);
              } else if (!isKey(index, array)) {
                var path = castPath(index),
                    object = parent(array, path);
                if (object != null) {
                  delete object[toKey(last(path))];
                }
              } else {
                delete array[toKey(index)];
              }
            }
          }
          return array;
        }
        function baseRandom(lower, upper) {
          return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
        }
        function baseRange(start, end, step, fromRight) {
          var index = -1,
              length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
              result = Array(length);
          while (length--) {
            result[fromRight ? length : ++index] = start;
            start += step;
          }
          return result;
        }
        function baseRepeat(string, n) {
          var result = '';
          if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
            return result;
          }
          do {
            if (n % 2) {
              result += string;
            }
            n = nativeFloor(n / 2);
            if (n) {
              string += string;
            }
          } while (n);
          return result;
        }
        function baseRest(func, start) {
          return setToString(overRest(func, start, identity), func + '');
        }
        function baseSample(collection) {
          return arraySample(values(collection));
        }
        function baseSampleSize(collection, n) {
          return shuffleSelf(values(collection), n);
        }
        function baseSet(object, path, value, customizer) {
          if (!isObject(object)) {
            return object;
          }
          path = isKey(path, object) ? [path] : castPath(path);
          var index = -1,
              length = path.length,
              lastIndex = length - 1,
              nested = object;
          while (nested != null && ++index < length) {
            var key = toKey(path[index]),
                newValue = value;
            if (index != lastIndex) {
              var objValue = nested[key];
              newValue = customizer ? customizer(objValue, key, nested) : undefined;
              if (newValue === undefined) {
                newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
              }
            }
            assignValue(nested, key, newValue);
            nested = nested[key];
          }
          return object;
        }
        var baseSetData = !metaMap ? identity : function (func, data) {
          metaMap.set(func, data);
          return func;
        };
        var baseSetToString = !nativeDefineProperty ? identity : function (func, string) {
          return nativeDefineProperty(func, 'toString', {
            'configurable': true,
            'enumerable': false,
            'value': constant(string),
            'writable': true
          });
        };
        function baseShuffle(collection) {
          return shuffleSelf(values(collection));
        }
        function baseSlice(array, start, end) {
          var index = -1,
              length = array.length;
          if (start < 0) {
            start = -start > length ? 0 : length + start;
          }
          end = end > length ? length : end;
          if (end < 0) {
            end += length;
          }
          length = start > end ? 0 : end - start >>> 0;
          start >>>= 0;
          var result = Array(length);
          while (++index < length) {
            result[index] = array[index + start];
          }
          return result;
        }
        function baseSome(collection, predicate) {
          var result;
          baseEach(collection, function (value, index, collection) {
            result = predicate(value, index, collection);
            return !result;
          });
          return !!result;
        }
        function baseSortedIndex(array, value, retHighest) {
          var low = 0,
              high = array ? array.length : low;
          if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
            while (low < high) {
              var mid = low + high >>> 1,
                  computed = array[mid];
              if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
                low = mid + 1;
              } else {
                high = mid;
              }
            }
            return high;
          }
          return baseSortedIndexBy(array, value, identity, retHighest);
        }
        function baseSortedIndexBy(array, value, iteratee, retHighest) {
          value = iteratee(value);
          var low = 0,
              high = array ? array.length : 0,
              valIsNaN = value !== value,
              valIsNull = value === null,
              valIsSymbol = isSymbol(value),
              valIsUndefined = value === undefined;
          while (low < high) {
            var mid = nativeFloor((low + high) / 2),
                computed = iteratee(array[mid]),
                othIsDefined = computed !== undefined,
                othIsNull = computed === null,
                othIsReflexive = computed === computed,
                othIsSymbol = isSymbol(computed);
            if (valIsNaN) {
              var setLow = retHighest || othIsReflexive;
            } else if (valIsUndefined) {
              setLow = othIsReflexive && (retHighest || othIsDefined);
            } else if (valIsNull) {
              setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
            } else if (valIsSymbol) {
              setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
            } else if (othIsNull || othIsSymbol) {
              setLow = false;
            } else {
              setLow = retHighest ? computed <= value : computed < value;
            }
            if (setLow) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return nativeMin(high, MAX_ARRAY_INDEX);
        }
        function baseSortedUniq(array, iteratee) {
          var index = -1,
              length = array.length,
              resIndex = 0,
              result = [];
          while (++index < length) {
            var value = array[index],
                computed = iteratee ? iteratee(value) : value;
            if (!index || !eq(computed, seen)) {
              var seen = computed;
              result[resIndex++] = value === 0 ? 0 : value;
            }
          }
          return result;
        }
        function baseToNumber(value) {
          if (typeof value == 'number') {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          return +value;
        }
        function baseToString(value) {
          if (typeof value == 'string') {
            return value;
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : '';
          }
          var result = value + '';
          return result == '0' && 1 / value == -INFINITY ? '-0' : result;
        }
        function baseUniq(array, iteratee, comparator) {
          var index = -1,
              includes = arrayIncludes,
              length = array.length,
              isCommon = true,
              result = [],
              seen = result;
          if (comparator) {
            isCommon = false;
            includes = arrayIncludesWith;
          } else if (length >= LARGE_ARRAY_SIZE) {
            var set = iteratee ? null : createSet(array);
            if (set) {
              return setToArray(set);
            }
            isCommon = false;
            includes = cacheHas;
            seen = new SetCache();
          } else {
            seen = iteratee ? [] : result;
          }
          outer: while (++index < length) {
            var value = array[index],
                computed = iteratee ? iteratee(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var seenIndex = seen.length;
              while (seenIndex--) {
                if (seen[seenIndex] === computed) {
                  continue outer;
                }
              }
              if (iteratee) {
                seen.push(computed);
              }
              result.push(value);
            } else if (!includes(seen, computed, comparator)) {
              if (seen !== result) {
                seen.push(computed);
              }
              result.push(value);
            }
          }
          return result;
        }
        function baseUnset(object, path) {
          path = isKey(path, object) ? [path] : castPath(path);
          object = parent(object, path);
          var key = toKey(last(path));
          return !(object != null && hasOwnProperty.call(object, key)) || delete object[key];
        }
        function baseUpdate(object, path, updater, customizer) {
          return baseSet(object, path, updater(baseGet(object, path)), customizer);
        }
        function baseWhile(array, predicate, isDrop, fromRight) {
          var length = array.length,
              index = fromRight ? length : -1;
          while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
          return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
        }
        function baseWrapperValue(value, actions) {
          var result = value;
          if (result instanceof LazyWrapper) {
            result = result.value();
          }
          return arrayReduce(actions, function (result, action) {
            return action.func.apply(action.thisArg, arrayPush([result], action.args));
          }, result);
        }
        function baseXor(arrays, iteratee, comparator) {
          var index = -1,
              length = arrays.length;
          while (++index < length) {
            var result = result ? arrayPush(baseDifference(result, arrays[index], iteratee, comparator), baseDifference(arrays[index], result, iteratee, comparator)) : arrays[index];
          }
          return result && result.length ? baseUniq(result, iteratee, comparator) : [];
        }
        function baseZipObject(props, values, assignFunc) {
          var index = -1,
              length = props.length,
              valsLength = values.length,
              result = {};
          while (++index < length) {
            var value = index < valsLength ? values[index] : undefined;
            assignFunc(result, props[index], value);
          }
          return result;
        }
        function castArrayLikeObject(value) {
          return isArrayLikeObject(value) ? value : [];
        }
        function castFunction(value) {
          return typeof value == 'function' ? value : identity;
        }
        function castPath(value) {
          return isArray(value) ? value : stringToPath(value);
        }
        var castRest = baseRest;
        function castSlice(array, start, end) {
          var length = array.length;
          end = end === undefined ? length : end;
          return !start && end >= length ? array : baseSlice(array, start, end);
        }
        var clearTimeout = ctxClearTimeout || function (id) {
          return root.clearTimeout(id);
        };
        function cloneBuffer(buffer, isDeep) {
          if (isDeep) {
            return buffer.slice();
          }
          var length = buffer.length,
              result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
          buffer.copy(result);
          return result;
        }
        function cloneArrayBuffer(arrayBuffer) {
          var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
          new Uint8Array(result).set(new Uint8Array(arrayBuffer));
          return result;
        }
        function cloneDataView(dataView, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
          return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
        }
        function cloneMap(map, isDeep, cloneFunc) {
          var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
          return arrayReduce(array, addMapEntry, new map.constructor());
        }
        function cloneRegExp(regexp) {
          var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
          result.lastIndex = regexp.lastIndex;
          return result;
        }
        function cloneSet(set, isDeep, cloneFunc) {
          var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
          return arrayReduce(array, addSetEntry, new set.constructor());
        }
        function cloneSymbol(symbol) {
          return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
        }
        function cloneTypedArray(typedArray, isDeep) {
          var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
          return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
        }
        function compareAscending(value, other) {
          if (value !== other) {
            var valIsDefined = value !== undefined,
                valIsNull = value === null,
                valIsReflexive = value === value,
                valIsSymbol = isSymbol(value);
            var othIsDefined = other !== undefined,
                othIsNull = other === null,
                othIsReflexive = other === other,
                othIsSymbol = isSymbol(other);
            if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
              return 1;
            }
            if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
              return -1;
            }
          }
          return 0;
        }
        function compareMultiple(object, other, orders) {
          var index = -1,
              objCriteria = object.criteria,
              othCriteria = other.criteria,
              length = objCriteria.length,
              ordersLength = orders.length;
          while (++index < length) {
            var result = compareAscending(objCriteria[index], othCriteria[index]);
            if (result) {
              if (index >= ordersLength) {
                return result;
              }
              var order = orders[index];
              return result * (order == 'desc' ? -1 : 1);
            }
          }
          return object.index - other.index;
        }
        function composeArgs(args, partials, holders, isCurried) {
          var argsIndex = -1,
              argsLength = args.length,
              holdersLength = holders.length,
              leftIndex = -1,
              leftLength = partials.length,
              rangeLength = nativeMax(argsLength - holdersLength, 0),
              result = Array(leftLength + rangeLength),
              isUncurried = !isCurried;
          while (++leftIndex < leftLength) {
            result[leftIndex] = partials[leftIndex];
          }
          while (++argsIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result[holders[argsIndex]] = args[argsIndex];
            }
          }
          while (rangeLength--) {
            result[leftIndex++] = args[argsIndex++];
          }
          return result;
        }
        function composeArgsRight(args, partials, holders, isCurried) {
          var argsIndex = -1,
              argsLength = args.length,
              holdersIndex = -1,
              holdersLength = holders.length,
              rightIndex = -1,
              rightLength = partials.length,
              rangeLength = nativeMax(argsLength - holdersLength, 0),
              result = Array(rangeLength + rightLength),
              isUncurried = !isCurried;
          while (++argsIndex < rangeLength) {
            result[argsIndex] = args[argsIndex];
          }
          var offset = argsIndex;
          while (++rightIndex < rightLength) {
            result[offset + rightIndex] = partials[rightIndex];
          }
          while (++holdersIndex < holdersLength) {
            if (isUncurried || argsIndex < argsLength) {
              result[offset + holders[holdersIndex]] = args[argsIndex++];
            }
          }
          return result;
        }
        function copyArray(source, array) {
          var index = -1,
              length = source.length;
          array || (array = Array(length));
          while (++index < length) {
            array[index] = source[index];
          }
          return array;
        }
        function copyObject(source, props, object, customizer) {
          var isNew = !object;
          object || (object = {});
          var index = -1,
              length = props.length;
          while (++index < length) {
            var key = props[index];
            var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
            if (newValue === undefined) {
              newValue = source[key];
            }
            if (isNew) {
              baseAssignValue(object, key, newValue);
            } else {
              assignValue(object, key, newValue);
            }
          }
          return object;
        }
        function copySymbols(source, object) {
          return copyObject(source, getSymbols(source), object);
        }
        function createAggregator(setter, initializer) {
          return function (collection, iteratee) {
            var func = isArray(collection) ? arrayAggregator : baseAggregator,
                accumulator = initializer ? initializer() : {};
            return func(collection, setter, getIteratee(iteratee, 2), accumulator);
          };
        }
        function createAssigner(assigner) {
          return baseRest(function (object, sources) {
            var index = -1,
                length = sources.length,
                customizer = length > 1 ? sources[length - 1] : undefined,
                guard = length > 2 ? sources[2] : undefined;
            customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;
            if (guard && isIterateeCall(sources[0], sources[1], guard)) {
              customizer = length < 3 ? undefined : customizer;
              length = 1;
            }
            object = Object(object);
            while (++index < length) {
              var source = sources[index];
              if (source) {
                assigner(object, source, index, customizer);
              }
            }
            return object;
          });
        }
        function createBaseEach(eachFunc, fromRight) {
          return function (collection, iteratee) {
            if (collection == null) {
              return collection;
            }
            if (!isArrayLike(collection)) {
              return eachFunc(collection, iteratee);
            }
            var length = collection.length,
                index = fromRight ? length : -1,
                iterable = Object(collection);
            while (fromRight ? index-- : ++index < length) {
              if (iteratee(iterable[index], index, iterable) === false) {
                break;
              }
            }
            return collection;
          };
        }
        function createBaseFor(fromRight) {
          return function (object, iteratee, keysFunc) {
            var index = -1,
                iterable = Object(object),
                props = keysFunc(object),
                length = props.length;
            while (length--) {
              var key = props[fromRight ? length : ++index];
              if (iteratee(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }
        function createBind(func, bitmask, thisArg) {
          var isBind = bitmask & BIND_FLAG,
              Ctor = createCtor(func);
          function wrapper() {
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return fn.apply(isBind ? thisArg : this, arguments);
          }
          return wrapper;
        }
        function createCaseFirst(methodName) {
          return function (string) {
            string = toString(string);
            var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined;
            var chr = strSymbols ? strSymbols[0] : string.charAt(0);
            var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);
            return chr[methodName]() + trailing;
          };
        }
        function createCompounder(callback) {
          return function (string) {
            return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
          };
        }
        function createCtor(Ctor) {
          return function () {
            var args = arguments;
            switch (args.length) {
              case 0:
                return new Ctor();
              case 1:
                return new Ctor(args[0]);
              case 2:
                return new Ctor(args[0], args[1]);
              case 3:
                return new Ctor(args[0], args[1], args[2]);
              case 4:
                return new Ctor(args[0], args[1], args[2], args[3]);
              case 5:
                return new Ctor(args[0], args[1], args[2], args[3], args[4]);
              case 6:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
              case 7:
                return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            }
            var thisBinding = baseCreate(Ctor.prototype),
                result = Ctor.apply(thisBinding, args);
            return isObject(result) ? result : thisBinding;
          };
        }
        function createCurry(func, bitmask, arity) {
          var Ctor = createCtor(func);
          function wrapper() {
            var length = arguments.length,
                args = Array(length),
                index = length,
                placeholder = getHolder(wrapper);
            while (index--) {
              args[index] = arguments[index];
            }
            var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
            length -= holders.length;
            if (length < arity) {
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined, args, holders, undefined, undefined, arity - length);
            }
            var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            return apply(fn, this, args);
          }
          return wrapper;
        }
        function createFind(findIndexFunc) {
          return function (collection, predicate, fromIndex) {
            var iterable = Object(collection);
            if (!isArrayLike(collection)) {
              var iteratee = getIteratee(predicate, 3);
              collection = keys(collection);
              predicate = function (key) {
                return iteratee(iterable[key], key, iterable);
              };
            }
            var index = findIndexFunc(collection, predicate, fromIndex);
            return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
          };
        }
        function createFlow(fromRight) {
          return flatRest(function (funcs) {
            var length = funcs.length,
                index = length,
                prereq = LodashWrapper.prototype.thru;
            if (fromRight) {
              funcs.reverse();
            }
            while (index--) {
              var func = funcs[index];
              if (typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
              }
              if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
                var wrapper = new LodashWrapper([], true);
              }
            }
            index = wrapper ? index : length;
            while (++index < length) {
              func = funcs[index];
              var funcName = getFuncName(func),
                  data = funcName == 'wrapper' ? getData(func) : undefined;
              if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
                wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
              } else {
                wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
              }
            }
            return function () {
              var args = arguments,
                  value = args[0];
              if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
                return wrapper.plant(value).value();
              }
              var index = 0,
                  result = length ? funcs[index].apply(this, args) : value;
              while (++index < length) {
                result = funcs[index].call(this, result);
              }
              return result;
            };
          });
        }
        function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
          var isAry = bitmask & ARY_FLAG,
              isBind = bitmask & BIND_FLAG,
              isBindKey = bitmask & BIND_KEY_FLAG,
              isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
              isFlip = bitmask & FLIP_FLAG,
              Ctor = isBindKey ? undefined : createCtor(func);
          function wrapper() {
            var length = arguments.length,
                args = Array(length),
                index = length;
            while (index--) {
              args[index] = arguments[index];
            }
            if (isCurried) {
              var placeholder = getHolder(wrapper),
                  holdersCount = countHolders(args, placeholder);
            }
            if (partials) {
              args = composeArgs(args, partials, holders, isCurried);
            }
            if (partialsRight) {
              args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
            }
            length -= holdersCount;
            if (isCurried && length < arity) {
              var newHolders = replaceHolders(args, placeholder);
              return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
            }
            var thisBinding = isBind ? thisArg : this,
                fn = isBindKey ? thisBinding[func] : func;
            length = args.length;
            if (argPos) {
              args = reorder(args, argPos);
            } else if (isFlip && length > 1) {
              args.reverse();
            }
            if (isAry && ary < length) {
              args.length = ary;
            }
            if (this && this !== root && this instanceof wrapper) {
              fn = Ctor || createCtor(fn);
            }
            return fn.apply(thisBinding, args);
          }
          return wrapper;
        }
        function createInverter(setter, toIteratee) {
          return function (object, iteratee) {
            return baseInverter(object, setter, toIteratee(iteratee), {});
          };
        }
        function createMathOperation(operator, defaultValue) {
          return function (value, other) {
            var result;
            if (value === undefined && other === undefined) {
              return defaultValue;
            }
            if (value !== undefined) {
              result = value;
            }
            if (other !== undefined) {
              if (result === undefined) {
                return other;
              }
              if (typeof value == 'string' || typeof other == 'string') {
                value = baseToString(value);
                other = baseToString(other);
              } else {
                value = baseToNumber(value);
                other = baseToNumber(other);
              }
              result = operator(value, other);
            }
            return result;
          };
        }
        function createOver(arrayFunc) {
          return flatRest(function (iteratees) {
            iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
            return baseRest(function (args) {
              var thisArg = this;
              return arrayFunc(iteratees, function (iteratee) {
                return apply(iteratee, thisArg, args);
              });
            });
          });
        }
        function createPadding(length, chars) {
          chars = chars === undefined ? ' ' : baseToString(chars);
          var charsLength = chars.length;
          if (charsLength < 2) {
            return charsLength ? baseRepeat(chars, length) : chars;
          }
          var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
          return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join('') : result.slice(0, length);
        }
        function createPartial(func, bitmask, thisArg, partials) {
          var isBind = bitmask & BIND_FLAG,
              Ctor = createCtor(func);
          function wrapper() {
            var argsIndex = -1,
                argsLength = arguments.length,
                leftIndex = -1,
                leftLength = partials.length,
                args = Array(leftLength + argsLength),
                fn = this && this !== root && this instanceof wrapper ? Ctor : func;
            while (++leftIndex < leftLength) {
              args[leftIndex] = partials[leftIndex];
            }
            while (argsLength--) {
              args[leftIndex++] = arguments[++argsIndex];
            }
            return apply(fn, isBind ? thisArg : this, args);
          }
          return wrapper;
        }
        function createRange(fromRight) {
          return function (start, end, step) {
            if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
              end = step = undefined;
            }
            start = toFinite(start);
            if (end === undefined) {
              end = start;
              start = 0;
            } else {
              end = toFinite(end);
            }
            step = step === undefined ? start < end ? 1 : -1 : toFinite(step);
            return baseRange(start, end, step, fromRight);
          };
        }
        function createRelationalOperation(operator) {
          return function (value, other) {
            if (!(typeof value == 'string' && typeof other == 'string')) {
              value = toNumber(value);
              other = toNumber(other);
            }
            return operator(value, other);
          };
        }
        function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
          var isCurry = bitmask & CURRY_FLAG,
              newHolders = isCurry ? holders : undefined,
              newHoldersRight = isCurry ? undefined : holders,
              newPartials = isCurry ? partials : undefined,
              newPartialsRight = isCurry ? undefined : partials;
          bitmask |= isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG;
          bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
          if (!(bitmask & CURRY_BOUND_FLAG)) {
            bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
          }
          var newData = [func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity];
          var result = wrapFunc.apply(undefined, newData);
          if (isLaziable(func)) {
            setData(result, newData);
          }
          result.placeholder = placeholder;
          return setWrapToString(result, func, bitmask);
        }
        function createRound(methodName) {
          var func = Math[methodName];
          return function (number, precision) {
            number = toNumber(number);
            precision = nativeMin(toInteger(precision), 292);
            if (precision) {
              var pair = (toString(number) + 'e').split('e'),
                  value = func(pair[0] + 'e' + (+pair[1] + precision));
              pair = (toString(value) + 'e').split('e');
              return +(pair[0] + 'e' + (+pair[1] - precision));
            }
            return func(number);
          };
        }
        var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function (values) {
          return new Set(values);
        };
        function createToPairs(keysFunc) {
          return function (object) {
            var tag = getTag(object);
            if (tag == mapTag) {
              return mapToArray(object);
            }
            if (tag == setTag) {
              return setToPairs(object);
            }
            return baseToPairs(object, keysFunc(object));
          };
        }
        function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
          var isBindKey = bitmask & BIND_KEY_FLAG;
          if (!isBindKey && typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          var length = partials ? partials.length : 0;
          if (!length) {
            bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
            partials = holders = undefined;
          }
          ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
          arity = arity === undefined ? arity : toInteger(arity);
          length -= holders ? holders.length : 0;
          if (bitmask & PARTIAL_RIGHT_FLAG) {
            var partialsRight = partials,
                holdersRight = holders;
            partials = holders = undefined;
          }
          var data = isBindKey ? undefined : getData(func);
          var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];
          if (data) {
            mergeData(newData, data);
          }
          func = newData[0];
          bitmask = newData[1];
          thisArg = newData[2];
          partials = newData[3];
          holders = newData[4];
          arity = newData[9] = newData[9] == null ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
          if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
            bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
          }
          if (!bitmask || bitmask == BIND_FLAG) {
            var result = createBind(func, bitmask, thisArg);
          } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
            result = createCurry(func, bitmask, arity);
          } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
            result = createPartial(func, bitmask, thisArg, partials);
          } else {
            result = createHybrid.apply(undefined, newData);
          }
          var setter = data ? baseSetData : setData;
          return setWrapToString(setter(result, newData), func, bitmask);
        }
        function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
              arrLength = array.length,
              othLength = other.length;
          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          var stacked = stack.get(array);
          if (stacked && stack.get(other)) {
            return stacked == other;
          }
          var index = -1,
              result = true,
              seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : undefined;
          stack.set(array, other);
          stack.set(other, array);
          while (++index < arrLength) {
            var arrValue = array[index],
                othValue = other[index];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
            }
            if (compared !== undefined) {
              if (compared) {
                continue;
              }
              result = false;
              break;
            }
            if (seen) {
              if (!arraySome(other, function (othValue, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
                  return seen.push(othIndex);
                }
              })) {
                result = false;
                break;
              }
            } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              result = false;
              break;
            }
          }
          stack['delete'](array);
          stack['delete'](other);
          return result;
        }
        function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
          switch (tag) {
            case dataViewTag:
              if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;
            case arrayBufferTag:
              if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
                return false;
              }
              return true;
            case boolTag:
            case dateTag:
            case numberTag:
              return eq(+object, +other);
            case errorTag:
              return object.name == other.name && object.message == other.message;
            case regexpTag:
            case stringTag:
              return object == other + '';
            case mapTag:
              var convert = mapToArray;
            case setTag:
              var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
              convert || (convert = setToArray);
              if (object.size != other.size && !isPartial) {
                return false;
              }
              var stacked = stack.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= UNORDERED_COMPARE_FLAG;
              stack.set(object, other);
              var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
              stack['delete'](object);
              return result;
            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }
        function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
              objProps = keys(object),
              objLength = objProps.length,
              othProps = keys(other),
              othLength = othProps.length;
          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index = objLength;
          while (index--) {
            var key = objProps[index];
            if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
              return false;
            }
          }
          var stacked = stack.get(object);
          if (stacked && stack.get(other)) {
            return stacked == other;
          }
          var result = true;
          stack.set(object, other);
          stack.set(other, object);
          var skipCtor = isPartial;
          while (++index < objLength) {
            key = objProps[index];
            var objValue = object[key],
                othValue = other[key];
            if (customizer) {
              var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
            }
            if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
              result = false;
              break;
            }
            skipCtor || (skipCtor = key == 'constructor');
          }
          if (result && !skipCtor) {
            var objCtor = object.constructor,
                othCtor = other.constructor;
            if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
              result = false;
            }
          }
          stack['delete'](object);
          stack['delete'](other);
          return result;
        }
        function flatRest(func) {
          return setToString(overRest(func, undefined, flatten), func + '');
        }
        function getAllKeys(object) {
          return baseGetAllKeys(object, keys, getSymbols);
        }
        function getAllKeysIn(object) {
          return baseGetAllKeys(object, keysIn, getSymbolsIn);
        }
        var getData = !metaMap ? noop : function (func) {
          return metaMap.get(func);
        };
        function getFuncName(func) {
          var result = func.name + '',
              array = realNames[result],
              length = hasOwnProperty.call(realNames, result) ? array.length : 0;
          while (length--) {
            var data = array[length],
                otherFunc = data.func;
            if (otherFunc == null || otherFunc == func) {
              return data.name;
            }
          }
          return result;
        }
        function getHolder(func) {
          var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
          return object.placeholder;
        }
        function getIteratee() {
          var result = lodash.iteratee || iteratee;
          result = result === iteratee ? baseIteratee : result;
          return arguments.length ? result(arguments[0], arguments[1]) : result;
        }
        function getMapData(map, key) {
          var data = map.__data__;
          return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
        }
        function getMatchData(object) {
          var result = keys(object),
              length = result.length;
          while (length--) {
            var key = result[length],
                value = object[key];
            result[length] = [key, value, isStrictComparable(value)];
          }
          return result;
        }
        function getNative(object, key) {
          var value = getValue(object, key);
          return baseIsNative(value) ? value : undefined;
        }
        var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
        var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
          var result = [];
          while (object) {
            arrayPush(result, getSymbols(object));
            object = getPrototype(object);
          }
          return result;
        };
        var getTag = baseGetTag;
        if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
          getTag = function (value) {
            var result = objectToString.call(value),
                Ctor = result == objectTag ? value.constructor : undefined,
                ctorString = Ctor ? toSource(Ctor) : undefined;
            if (ctorString) {
              switch (ctorString) {
                case dataViewCtorString:
                  return dataViewTag;
                case mapCtorString:
                  return mapTag;
                case promiseCtorString:
                  return promiseTag;
                case setCtorString:
                  return setTag;
                case weakMapCtorString:
                  return weakMapTag;
              }
            }
            return result;
          };
        }
        function getView(start, end, transforms) {
          var index = -1,
              length = transforms.length;
          while (++index < length) {
            var data = transforms[index],
                size = data.size;
            switch (data.type) {
              case 'drop':
                start += size;
                break;
              case 'dropRight':
                end -= size;
                break;
              case 'take':
                end = nativeMin(end, start + size);
                break;
              case 'takeRight':
                start = nativeMax(start, end - size);
                break;
            }
          }
          return {
            'start': start,
            'end': end
          };
        }
        function getWrapDetails(source) {
          var match = source.match(reWrapDetails);
          return match ? match[1].split(reSplitDetails) : [];
        }
        function hasPath(object, path, hasFunc) {
          path = isKey(path, object) ? [path] : castPath(path);
          var index = -1,
              length = path.length,
              result = false;
          while (++index < length) {
            var key = toKey(path[index]);
            if (!(result = object != null && hasFunc(object, key))) {
              break;
            }
            object = object[key];
          }
          if (result || ++index != length) {
            return result;
          }
          length = object ? object.length : 0;
          return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
        }
        function initCloneArray(array) {
          var length = array.length,
              result = array.constructor(length);
          if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
            result.index = array.index;
            result.input = array.input;
          }
          return result;
        }
        function initCloneObject(object) {
          return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
        }
        function initCloneByTag(object, tag, cloneFunc, isDeep) {
          var Ctor = object.constructor;
          switch (tag) {
            case arrayBufferTag:
              return cloneArrayBuffer(object);
            case boolTag:
            case dateTag:
              return new Ctor(+object);
            case dataViewTag:
              return cloneDataView(object, isDeep);
            case float32Tag:
            case float64Tag:
            case int8Tag:
            case int16Tag:
            case int32Tag:
            case uint8Tag:
            case uint8ClampedTag:
            case uint16Tag:
            case uint32Tag:
              return cloneTypedArray(object, isDeep);
            case mapTag:
              return cloneMap(object, isDeep, cloneFunc);
            case numberTag:
            case stringTag:
              return new Ctor(object);
            case regexpTag:
              return cloneRegExp(object);
            case setTag:
              return cloneSet(object, isDeep, cloneFunc);
            case symbolTag:
              return cloneSymbol(object);
          }
        }
        function insertWrapDetails(source, details) {
          var length = details.length;
          if (!length) {
            return source;
          }
          var lastIndex = length - 1;
          details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
          details = details.join(length > 2 ? ', ' : ' ');
          return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
        }
        function isFlattenable(value) {
          return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
        }
        function isIndex(value, length) {
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
        }
        function isIterateeCall(value, index, object) {
          if (!isObject(object)) {
            return false;
          }
          var type = typeof index;
          if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
            return eq(object[index], value);
          }
          return false;
        }
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          var type = typeof value;
          if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
        }
        function isKeyable(value) {
          var type = typeof value;
          return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
        }
        function isLaziable(func) {
          var funcName = getFuncName(func),
              other = lodash[funcName];
          if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
            return false;
          }
          if (func === other) {
            return true;
          }
          var data = getData(other);
          return !!data && func === data[0];
        }
        function isMasked(func) {
          return !!maskSrcKey && maskSrcKey in func;
        }
        var isMaskable = coreJsData ? isFunction : stubFalse;
        function isPrototype(value) {
          var Ctor = value && value.constructor,
              proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
          return value === proto;
        }
        function isStrictComparable(value) {
          return value === value && !isObject(value);
        }
        function matchesStrictComparable(key, srcValue) {
          return function (object) {
            if (object == null) {
              return false;
            }
            return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
          };
        }
        function memoizeCapped(func) {
          var result = memoize(func, function (key) {
            if (cache.size === MAX_MEMOIZE_SIZE) {
              cache.clear();
            }
            return key;
          });
          var cache = result.cache;
          return result;
        }
        function mergeData(data, source) {
          var bitmask = data[1],
              srcBitmask = source[1],
              newBitmask = bitmask | srcBitmask,
              isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);
          var isCombo = srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG || srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8] || srcBitmask == (ARY_FLAG | REARG_FLAG) && source[7].length <= source[8] && bitmask == CURRY_FLAG;
          if (!(isCommon || isCombo)) {
            return data;
          }
          if (srcBitmask & BIND_FLAG) {
            data[2] = source[2];
            newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
          }
          var value = source[3];
          if (value) {
            var partials = data[3];
            data[3] = partials ? composeArgs(partials, value, source[4]) : value;
            data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
          }
          value = source[5];
          if (value) {
            partials = data[5];
            data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
            data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
          }
          value = source[7];
          if (value) {
            data[7] = value;
          }
          if (srcBitmask & ARY_FLAG) {
            data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
          }
          if (data[9] == null) {
            data[9] = source[9];
          }
          data[0] = source[0];
          data[1] = newBitmask;
          return data;
        }
        function mergeDefaults(objValue, srcValue, key, object, source, stack) {
          if (isObject(objValue) && isObject(srcValue)) {
            stack.set(srcValue, objValue);
            baseMerge(objValue, srcValue, undefined, mergeDefaults, stack);
            stack['delete'](srcValue);
          }
          return objValue;
        }
        function nativeKeysIn(object) {
          var result = [];
          if (object != null) {
            for (var key in Object(object)) {
              result.push(key);
            }
          }
          return result;
        }
        function overRest(func, start, transform) {
          start = nativeMax(start === undefined ? func.length - 1 : start, 0);
          return function () {
            var args = arguments,
                index = -1,
                length = nativeMax(args.length - start, 0),
                array = Array(length);
            while (++index < length) {
              array[index] = args[start + index];
            }
            index = -1;
            var otherArgs = Array(start + 1);
            while (++index < start) {
              otherArgs[index] = args[index];
            }
            otherArgs[start] = transform(array);
            return apply(func, this, otherArgs);
          };
        }
        function parent(object, path) {
          return path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        }
        function reorder(array, indexes) {
          var arrLength = array.length,
              length = nativeMin(indexes.length, arrLength),
              oldArray = copyArray(array);
          while (length--) {
            var index = indexes[length];
            array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
          }
          return array;
        }
        var setData = shortOut(baseSetData);
        var setTimeout = ctxSetTimeout || function (func, wait) {
          return root.setTimeout(func, wait);
        };
        var setToString = shortOut(baseSetToString);
        function setWrapToString(wrapper, reference, bitmask) {
          var source = reference + '';
          return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
        }
        function shortOut(func) {
          var count = 0,
              lastCalled = 0;
          return function () {
            var stamp = nativeNow(),
                remaining = HOT_SPAN - (stamp - lastCalled);
            lastCalled = stamp;
            if (remaining > 0) {
              if (++count >= HOT_COUNT) {
                return arguments[0];
              }
            } else {
              count = 0;
            }
            return func.apply(undefined, arguments);
          };
        }
        function shuffleSelf(array, size) {
          var index = -1,
              length = array.length,
              lastIndex = length - 1;
          size = size === undefined ? length : baseClamp(size, 0, length);
          while (++index < size) {
            var rand = baseRandom(index, lastIndex),
                value = array[rand];
            array[rand] = array[index];
            array[index] = value;
          }
          array.length = size;
          return array;
        }
        var stringToPath = memoizeCapped(function (string) {
          string = toString(string);
          var result = [];
          if (reLeadingDot.test(string)) {
            result.push('');
          }
          string.replace(rePropName, function (match, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, '$1') : number || match);
          });
          return result;
        });
        function toKey(value) {
          if (typeof value == 'string' || isSymbol(value)) {
            return value;
          }
          var result = value + '';
          return result == '0' && 1 / value == -INFINITY ? '-0' : result;
        }
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {}
            try {
              return func + '';
            } catch (e) {}
          }
          return '';
        }
        function updateWrapDetails(details, bitmask) {
          arrayEach(wrapFlags, function (pair) {
            var value = '_.' + pair[0];
            if (bitmask & pair[1] && !arrayIncludes(details, value)) {
              details.push(value);
            }
          });
          return details.sort();
        }
        function wrapperClone(wrapper) {
          if (wrapper instanceof LazyWrapper) {
            return wrapper.clone();
          }
          var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
          result.__actions__ = copyArray(wrapper.__actions__);
          result.__index__ = wrapper.__index__;
          result.__values__ = wrapper.__values__;
          return result;
        }
        function chunk(array, size, guard) {
          if (guard ? isIterateeCall(array, size, guard) : size === undefined) {
            size = 1;
          } else {
            size = nativeMax(toInteger(size), 0);
          }
          var length = array ? array.length : 0;
          if (!length || size < 1) {
            return [];
          }
          var index = 0,
              resIndex = 0,
              result = Array(nativeCeil(length / size));
          while (index < length) {
            result[resIndex++] = baseSlice(array, index, index += size);
          }
          return result;
        }
        function compact(array) {
          var index = -1,
              length = array ? array.length : 0,
              resIndex = 0,
              result = [];
          while (++index < length) {
            var value = array[index];
            if (value) {
              result[resIndex++] = value;
            }
          }
          return result;
        }
        function concat() {
          var length = arguments.length;
          if (!length) {
            return [];
          }
          var args = Array(length - 1),
              array = arguments[0],
              index = length;
          while (index--) {
            args[index - 1] = arguments[index];
          }
          return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
        }
        var difference = baseRest(function (array, values) {
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
        });
        var differenceBy = baseRest(function (array, values) {
          var iteratee = last(values);
          if (isArrayLikeObject(iteratee)) {
            iteratee = undefined;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2)) : [];
        });
        var differenceWith = baseRest(function (array, values) {
          var comparator = last(values);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined;
          }
          return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator) : [];
        });
        function drop(array, n, guard) {
          var length = array ? array.length : 0;
          if (!length) {
            return [];
          }
          n = guard || n === undefined ? 1 : toInteger(n);
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function dropRight(array, n, guard) {
          var length = array ? array.length : 0;
          if (!length) {
            return [];
          }
          n = guard || n === undefined ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function dropRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
        }
        function dropWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
        }
        function fill(array, value, start, end) {
          var length = array ? array.length : 0;
          if (!length) {
            return [];
          }
          if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
            start = 0;
            end = length;
          }
          return baseFill(array, value, start, end);
        }
        function findIndex(array, predicate, fromIndex) {
          var length = array ? array.length : 0;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index);
        }
        function findLastIndex(array, predicate, fromIndex) {
          var length = array ? array.length : 0;
          if (!length) {
            return -1;
          }
          var index = length - 1;
          if (fromIndex !== undefined) {
            index = toInteger(fromIndex);
            index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return baseFindIndex(array, getIteratee(predicate, 3), index, true);
        }
        function flatten(array) {
          var length = array ? array.length : 0;
          return length ? baseFlatten(array, 1) : [];
        }
        function flattenDeep(array) {
          var length = array ? array.length : 0;
          return length ? baseFlatten(array, INFINITY) : [];
        }
        function flattenDepth(array, depth) {
          var length = array ? array.length : 0;
          if (!length) {
            return [];
          }
          depth = depth === undefined ? 1 : toInteger(depth);
          return baseFlatten(array, depth);
        }
        function fromPairs(pairs) {
          var index = -1,
              length = pairs ? pairs.length : 0,
              result = {};
          while (++index < length) {
            var pair = pairs[index];
            result[pair[0]] = pair[1];
          }
          return result;
        }
        function head(array) {
          return array && array.length ? array[0] : undefined;
        }
        function indexOf(array, value, fromIndex) {
          var length = array ? array.length : 0;
          if (!length) {
            return -1;
          }
          var index = fromIndex == null ? 0 : toInteger(fromIndex);
          if (index < 0) {
            index = nativeMax(length + index, 0);
          }
          return baseIndexOf(array, value, index);
        }
        function initial(array) {
          var length = array ? array.length : 0;
          return length ? baseSlice(array, 0, -1) : [];
        }
        var intersection = baseRest(function (arrays) {
          var mapped = arrayMap(arrays, castArrayLikeObject);
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
        });
        var intersectionBy = baseRest(function (arrays) {
          var iteratee = last(arrays),
              mapped = arrayMap(arrays, castArrayLikeObject);
          if (iteratee === last(mapped)) {
            iteratee = undefined;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee, 2)) : [];
        });
        var intersectionWith = baseRest(function (arrays) {
          var comparator = last(arrays),
              mapped = arrayMap(arrays, castArrayLikeObject);
          if (comparator === last(mapped)) {
            comparator = undefined;
          } else {
            mapped.pop();
          }
          return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined, comparator) : [];
        });
        function join(array, separator) {
          return array ? nativeJoin.call(array, separator) : '';
        }
        function last(array) {
          var length = array ? array.length : 0;
          return length ? array[length - 1] : undefined;
        }
        function lastIndexOf(array, value, fromIndex) {
          var length = array ? array.length : 0;
          if (!length) {
            return -1;
          }
          var index = length;
          if (fromIndex !== undefined) {
            index = toInteger(fromIndex);
            index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
          }
          return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
        }
        function nth(array, n) {
          return array && array.length ? baseNth(array, toInteger(n)) : undefined;
        }
        var pull = baseRest(pullAll);
        function pullAll(array, values) {
          return array && array.length && values && values.length ? basePullAll(array, values) : array;
        }
        function pullAllBy(array, values, iteratee) {
          return array && array.length && values && values.length ? basePullAll(array, values, getIteratee(iteratee, 2)) : array;
        }
        function pullAllWith(array, values, comparator) {
          return array && array.length && values && values.length ? basePullAll(array, values, undefined, comparator) : array;
        }
        var pullAt = flatRest(function (array, indexes) {
          var length = array ? array.length : 0,
              result = baseAt(array, indexes);
          basePullAt(array, arrayMap(indexes, function (index) {
            return isIndex(index, length) ? +index : index;
          }).sort(compareAscending));
          return result;
        });
        function remove(array, predicate) {
          var result = [];
          if (!(array && array.length)) {
            return result;
          }
          var index = -1,
              indexes = [],
              length = array.length;
          predicate = getIteratee(predicate, 3);
          while (++index < length) {
            var value = array[index];
            if (predicate(value, index, array)) {
              result.push(value);
              indexes.push(index);
            }
          }
          basePullAt(array, indexes);
          return result;
        }
        function reverse(array) {
          return array ? nativeReverse.call(array) : array;
        }
        function slice(array, start, end) {
          var length = array ? array.length : 0;
          if (!length) {
            return [];
          }
          if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
            start = 0;
            end = length;
          } else {
            start = start == null ? 0 : toInteger(start);
            end = end === undefined ? length : toInteger(end);
          }
          return baseSlice(array, start, end);
        }
        function sortedIndex(array, value) {
          return baseSortedIndex(array, value);
        }
        function sortedIndexBy(array, value, iteratee) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
        }
        function sortedIndexOf(array, value) {
          var length = array ? array.length : 0;
          if (length) {
            var index = baseSortedIndex(array, value);
            if (index < length && eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedLastIndex(array, value) {
          return baseSortedIndex(array, value, true);
        }
        function sortedLastIndexBy(array, value, iteratee) {
          return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
        }
        function sortedLastIndexOf(array, value) {
          var length = array ? array.length : 0;
          if (length) {
            var index = baseSortedIndex(array, value, true) - 1;
            if (eq(array[index], value)) {
              return index;
            }
          }
          return -1;
        }
        function sortedUniq(array) {
          return array && array.length ? baseSortedUniq(array) : [];
        }
        function sortedUniqBy(array, iteratee) {
          return array && array.length ? baseSortedUniq(array, getIteratee(iteratee, 2)) : [];
        }
        function tail(array) {
          var length = array ? array.length : 0;
          return length ? baseSlice(array, 1, length) : [];
        }
        function take(array, n, guard) {
          if (!(array && array.length)) {
            return [];
          }
          n = guard || n === undefined ? 1 : toInteger(n);
          return baseSlice(array, 0, n < 0 ? 0 : n);
        }
        function takeRight(array, n, guard) {
          var length = array ? array.length : 0;
          if (!length) {
            return [];
          }
          n = guard || n === undefined ? 1 : toInteger(n);
          n = length - n;
          return baseSlice(array, n < 0 ? 0 : n, length);
        }
        function takeRightWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
        }
        function takeWhile(array, predicate) {
          return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
        }
        var union = baseRest(function (arrays) {
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
        });
        var unionBy = baseRest(function (arrays) {
          var iteratee = last(arrays);
          if (isArrayLikeObject(iteratee)) {
            iteratee = undefined;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
        });
        var unionWith = baseRest(function (arrays) {
          var comparator = last(arrays);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined;
          }
          return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
        });
        function uniq(array) {
          return array && array.length ? baseUniq(array) : [];
        }
        function uniqBy(array, iteratee) {
          return array && array.length ? baseUniq(array, getIteratee(iteratee, 2)) : [];
        }
        function uniqWith(array, comparator) {
          return array && array.length ? baseUniq(array, undefined, comparator) : [];
        }
        function unzip(array) {
          if (!(array && array.length)) {
            return [];
          }
          var length = 0;
          array = arrayFilter(array, function (group) {
            if (isArrayLikeObject(group)) {
              length = nativeMax(group.length, length);
              return true;
            }
          });
          return baseTimes(length, function (index) {
            return arrayMap(array, baseProperty(index));
          });
        }
        function unzipWith(array, iteratee) {
          if (!(array && array.length)) {
            return [];
          }
          var result = unzip(array);
          if (iteratee == null) {
            return result;
          }
          return arrayMap(result, function (group) {
            return apply(iteratee, undefined, group);
          });
        }
        var without = baseRest(function (array, values) {
          return isArrayLikeObject(array) ? baseDifference(array, values) : [];
        });
        var xor = baseRest(function (arrays) {
          return baseXor(arrayFilter(arrays, isArrayLikeObject));
        });
        var xorBy = baseRest(function (arrays) {
          var iteratee = last(arrays);
          if (isArrayLikeObject(iteratee)) {
            iteratee = undefined;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
        });
        var xorWith = baseRest(function (arrays) {
          var comparator = last(arrays);
          if (isArrayLikeObject(comparator)) {
            comparator = undefined;
          }
          return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
        });
        var zip = baseRest(unzip);
        function zipObject(props, values) {
          return baseZipObject(props || [], values || [], assignValue);
        }
        function zipObjectDeep(props, values) {
          return baseZipObject(props || [], values || [], baseSet);
        }
        var zipWith = baseRest(function (arrays) {
          var length = arrays.length,
              iteratee = length > 1 ? arrays[length - 1] : undefined;
          iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
          return unzipWith(arrays, iteratee);
        });
        function chain(value) {
          var result = lodash(value);
          result.__chain__ = true;
          return result;
        }
        function tap(value, interceptor) {
          interceptor(value);
          return value;
        }
        function thru(value, interceptor) {
          return interceptor(value);
        }
        var wrapperAt = flatRest(function (paths) {
          var length = paths.length,
              start = length ? paths[0] : 0,
              value = this.__wrapped__,
              interceptor = function (object) {
            return baseAt(object, paths);
          };
          if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
            return this.thru(interceptor);
          }
          value = value.slice(start, +start + (length ? 1 : 0));
          value.__actions__.push({
            'func': thru,
            'args': [interceptor],
            'thisArg': undefined
          });
          return new LodashWrapper(value, this.__chain__).thru(function (array) {
            if (length && !array.length) {
              array.push(undefined);
            }
            return array;
          });
        });
        function wrapperChain() {
          return chain(this);
        }
        function wrapperCommit() {
          return new LodashWrapper(this.value(), this.__chain__);
        }
        function wrapperNext() {
          if (this.__values__ === undefined) {
            this.__values__ = toArray(this.value());
          }
          var done = this.__index__ >= this.__values__.length,
              value = done ? undefined : this.__values__[this.__index__++];
          return {
            'done': done,
            'value': value
          };
        }
        function wrapperToIterator() {
          return this;
        }
        function wrapperPlant(value) {
          var result,
              parent = this;
          while (parent instanceof baseLodash) {
            var clone = wrapperClone(parent);
            clone.__index__ = 0;
            clone.__values__ = undefined;
            if (result) {
              previous.__wrapped__ = clone;
            } else {
              result = clone;
            }
            var previous = clone;
            parent = parent.__wrapped__;
          }
          previous.__wrapped__ = value;
          return result;
        }
        function wrapperReverse() {
          var value = this.__wrapped__;
          if (value instanceof LazyWrapper) {
            var wrapped = value;
            if (this.__actions__.length) {
              wrapped = new LazyWrapper(this);
            }
            wrapped = wrapped.reverse();
            wrapped.__actions__.push({
              'func': thru,
              'args': [reverse],
              'thisArg': undefined
            });
            return new LodashWrapper(wrapped, this.__chain__);
          }
          return this.thru(reverse);
        }
        function wrapperValue() {
          return baseWrapperValue(this.__wrapped__, this.__actions__);
        }
        var countBy = createAggregator(function (result, value, key) {
          if (hasOwnProperty.call(result, key)) {
            ++result[key];
          } else {
            baseAssignValue(result, key, 1);
          }
        });
        function every(collection, predicate, guard) {
          var func = isArray(collection) ? arrayEvery : baseEvery;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        function filter(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, getIteratee(predicate, 3));
        }
        var find = createFind(findIndex);
        var findLast = createFind(findLastIndex);
        function flatMap(collection, iteratee) {
          return baseFlatten(map(collection, iteratee), 1);
        }
        function flatMapDeep(collection, iteratee) {
          return baseFlatten(map(collection, iteratee), INFINITY);
        }
        function flatMapDepth(collection, iteratee, depth) {
          depth = depth === undefined ? 1 : toInteger(depth);
          return baseFlatten(map(collection, iteratee), depth);
        }
        function forEach(collection, iteratee) {
          var func = isArray(collection) ? arrayEach : baseEach;
          return func(collection, getIteratee(iteratee, 3));
        }
        function forEachRight(collection, iteratee) {
          var func = isArray(collection) ? arrayEachRight : baseEachRight;
          return func(collection, getIteratee(iteratee, 3));
        }
        var groupBy = createAggregator(function (result, value, key) {
          if (hasOwnProperty.call(result, key)) {
            result[key].push(value);
          } else {
            baseAssignValue(result, key, [value]);
          }
        });
        function includes(collection, value, fromIndex, guard) {
          collection = isArrayLike(collection) ? collection : values(collection);
          fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
          var length = collection.length;
          if (fromIndex < 0) {
            fromIndex = nativeMax(length + fromIndex, 0);
          }
          return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
        }
        var invokeMap = baseRest(function (collection, path, args) {
          var index = -1,
              isFunc = typeof path == 'function',
              isProp = isKey(path),
              result = isArrayLike(collection) ? Array(collection.length) : [];
          baseEach(collection, function (value) {
            var func = isFunc ? path : isProp && value != null ? value[path] : undefined;
            result[++index] = func ? apply(func, value, args) : baseInvoke(value, path, args);
          });
          return result;
        });
        var keyBy = createAggregator(function (result, value, key) {
          baseAssignValue(result, key, value);
        });
        function map(collection, iteratee) {
          var func = isArray(collection) ? arrayMap : baseMap;
          return func(collection, getIteratee(iteratee, 3));
        }
        function orderBy(collection, iteratees, orders, guard) {
          if (collection == null) {
            return [];
          }
          if (!isArray(iteratees)) {
            iteratees = iteratees == null ? [] : [iteratees];
          }
          orders = guard ? undefined : orders;
          if (!isArray(orders)) {
            orders = orders == null ? [] : [orders];
          }
          return baseOrderBy(collection, iteratees, orders);
        }
        var partition = createAggregator(function (result, value, key) {
          result[key ? 0 : 1].push(value);
        }, function () {
          return [[], []];
        });
        function reduce(collection, iteratee, accumulator) {
          var func = isArray(collection) ? arrayReduce : baseReduce,
              initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
        }
        function reduceRight(collection, iteratee, accumulator) {
          var func = isArray(collection) ? arrayReduceRight : baseReduce,
              initAccum = arguments.length < 3;
          return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
        }
        function reject(collection, predicate) {
          var func = isArray(collection) ? arrayFilter : baseFilter;
          return func(collection, negate(getIteratee(predicate, 3)));
        }
        function sample(collection) {
          var func = isArray(collection) ? arraySample : baseSample;
          return func(collection);
        }
        function sampleSize(collection, n, guard) {
          if (guard ? isIterateeCall(collection, n, guard) : n === undefined) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          var func = isArray(collection) ? arraySampleSize : baseSampleSize;
          return func(collection, n);
        }
        function shuffle(collection) {
          var func = isArray(collection) ? arrayShuffle : baseShuffle;
          return func(collection);
        }
        function size(collection) {
          if (collection == null) {
            return 0;
          }
          if (isArrayLike(collection)) {
            return isString(collection) ? stringSize(collection) : collection.length;
          }
          var tag = getTag(collection);
          if (tag == mapTag || tag == setTag) {
            return collection.size;
          }
          return baseKeys(collection).length;
        }
        function some(collection, predicate, guard) {
          var func = isArray(collection) ? arraySome : baseSome;
          if (guard && isIterateeCall(collection, predicate, guard)) {
            predicate = undefined;
          }
          return func(collection, getIteratee(predicate, 3));
        }
        var sortBy = baseRest(function (collection, iteratees) {
          if (collection == null) {
            return [];
          }
          var length = iteratees.length;
          if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
            iteratees = [];
          } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
            iteratees = [iteratees[0]];
          }
          return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
        });
        var now = ctxNow || function () {
          return root.Date.now();
        };
        function after(n, func) {
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function () {
            if (--n < 1) {
              return func.apply(this, arguments);
            }
          };
        }
        function ary(func, n, guard) {
          n = guard ? undefined : n;
          n = func && n == null ? func.length : n;
          return createWrap(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
        }
        function before(n, func) {
          var result;
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          n = toInteger(n);
          return function () {
            if (--n > 0) {
              result = func.apply(this, arguments);
            }
            if (n <= 1) {
              func = undefined;
            }
            return result;
          };
        }
        var bind = baseRest(function (func, thisArg, partials) {
          var bitmask = BIND_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bind));
            bitmask |= PARTIAL_FLAG;
          }
          return createWrap(func, bitmask, thisArg, partials, holders);
        });
        var bindKey = baseRest(function (object, key, partials) {
          var bitmask = BIND_FLAG | BIND_KEY_FLAG;
          if (partials.length) {
            var holders = replaceHolders(partials, getHolder(bindKey));
            bitmask |= PARTIAL_FLAG;
          }
          return createWrap(key, bitmask, object, partials, holders);
        });
        function curry(func, arity, guard) {
          arity = guard ? undefined : arity;
          var result = createWrap(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
          result.placeholder = curry.placeholder;
          return result;
        }
        function curryRight(func, arity, guard) {
          arity = guard ? undefined : arity;
          var result = createWrap(func, CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
          result.placeholder = curryRight.placeholder;
          return result;
        }
        function debounce(func, wait, options) {
          var lastArgs,
              lastThis,
              maxWait,
              result,
              timerId,
              lastCallTime,
              lastInvokeTime = 0,
              leading = false,
              maxing = false,
              trailing = true;
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          wait = toNumber(wait) || 0;
          if (isObject(options)) {
            leading = !!options.leading;
            maxing = 'maxWait' in options;
            maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
          }
          function invokeFunc(time) {
            var args = lastArgs,
                thisArg = lastThis;
            lastArgs = lastThis = undefined;
            lastInvokeTime = time;
            result = func.apply(thisArg, args);
            return result;
          }
          function leadingEdge(time) {
            lastInvokeTime = time;
            timerId = setTimeout(timerExpired, wait);
            return leading ? invokeFunc(time) : result;
          }
          function remainingWait(time) {
            var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime,
                result = wait - timeSinceLastCall;
            return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
          }
          function shouldInvoke(time) {
            var timeSinceLastCall = time - lastCallTime,
                timeSinceLastInvoke = time - lastInvokeTime;
            return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
          }
          function timerExpired() {
            var time = now();
            if (shouldInvoke(time)) {
              return trailingEdge(time);
            }
            timerId = setTimeout(timerExpired, remainingWait(time));
          }
          function trailingEdge(time) {
            timerId = undefined;
            if (trailing && lastArgs) {
              return invokeFunc(time);
            }
            lastArgs = lastThis = undefined;
            return result;
          }
          function cancel() {
            if (timerId !== undefined) {
              clearTimeout(timerId);
            }
            lastInvokeTime = 0;
            lastArgs = lastCallTime = lastThis = timerId = undefined;
          }
          function flush() {
            return timerId === undefined ? result : trailingEdge(now());
          }
          function debounced() {
            var time = now(),
                isInvoking = shouldInvoke(time);
            lastArgs = arguments;
            lastThis = this;
            lastCallTime = time;
            if (isInvoking) {
              if (timerId === undefined) {
                return leadingEdge(lastCallTime);
              }
              if (maxing) {
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
              }
            }
            if (timerId === undefined) {
              timerId = setTimeout(timerExpired, wait);
            }
            return result;
          }
          debounced.cancel = cancel;
          debounced.flush = flush;
          return debounced;
        }
        var defer = baseRest(function (func, args) {
          return baseDelay(func, 1, args);
        });
        var delay = baseRest(function (func, wait, args) {
          return baseDelay(func, toNumber(wait) || 0, args);
        });
        function flip(func) {
          return createWrap(func, FLIP_FLAG);
        }
        function memoize(func, resolver) {
          if (typeof func != 'function' || resolver && typeof resolver != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          var memoized = function () {
            var args = arguments,
                key = resolver ? resolver.apply(this, args) : args[0],
                cache = memoized.cache;
            if (cache.has(key)) {
              return cache.get(key);
            }
            var result = func.apply(this, args);
            memoized.cache = cache.set(key, result) || cache;
            return result;
          };
          memoized.cache = new (memoize.Cache || MapCache)();
          return memoized;
        }
        memoize.Cache = MapCache;
        function negate(predicate) {
          if (typeof predicate != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          return function () {
            var args = arguments;
            switch (args.length) {
              case 0:
                return !predicate.call(this);
              case 1:
                return !predicate.call(this, args[0]);
              case 2:
                return !predicate.call(this, args[0], args[1]);
              case 3:
                return !predicate.call(this, args[0], args[1], args[2]);
            }
            return !predicate.apply(this, args);
          };
        }
        function once(func) {
          return before(2, func);
        }
        var overArgs = castRest(function (func, transforms) {
          transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
          var funcsLength = transforms.length;
          return baseRest(function (args) {
            var index = -1,
                length = nativeMin(args.length, funcsLength);
            while (++index < length) {
              args[index] = transforms[index].call(this, args[index]);
            }
            return apply(func, this, args);
          });
        });
        var partial = baseRest(function (func, partials) {
          var holders = replaceHolders(partials, getHolder(partial));
          return createWrap(func, PARTIAL_FLAG, undefined, partials, holders);
        });
        var partialRight = baseRest(function (func, partials) {
          var holders = replaceHolders(partials, getHolder(partialRight));
          return createWrap(func, PARTIAL_RIGHT_FLAG, undefined, partials, holders);
        });
        var rearg = flatRest(function (func, indexes) {
          return createWrap(func, REARG_FLAG, undefined, undefined, undefined, indexes);
        });
        function rest(func, start) {
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          start = start === undefined ? start : toInteger(start);
          return baseRest(func, start);
        }
        function spread(func, start) {
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          start = start === undefined ? 0 : nativeMax(toInteger(start), 0);
          return baseRest(function (args) {
            var array = args[start],
                otherArgs = castSlice(args, 0, start);
            if (array) {
              arrayPush(otherArgs, array);
            }
            return apply(func, this, otherArgs);
          });
        }
        function throttle(func, wait, options) {
          var leading = true,
              trailing = true;
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (isObject(options)) {
            leading = 'leading' in options ? !!options.leading : leading;
            trailing = 'trailing' in options ? !!options.trailing : trailing;
          }
          return debounce(func, wait, {
            'leading': leading,
            'maxWait': wait,
            'trailing': trailing
          });
        }
        function unary(func) {
          return ary(func, 1);
        }
        function wrap(value, wrapper) {
          wrapper = wrapper == null ? identity : wrapper;
          return partial(wrapper, value);
        }
        function castArray() {
          if (!arguments.length) {
            return [];
          }
          var value = arguments[0];
          return isArray(value) ? value : [value];
        }
        function clone(value) {
          return baseClone(value, false, true);
        }
        function cloneWith(value, customizer) {
          return baseClone(value, false, true, customizer);
        }
        function cloneDeep(value) {
          return baseClone(value, true, true);
        }
        function cloneDeepWith(value, customizer) {
          return baseClone(value, true, true, customizer);
        }
        function conformsTo(object, source) {
          return source == null || baseConformsTo(object, source, keys(source));
        }
        function eq(value, other) {
          return value === other || value !== value && other !== other;
        }
        var gt = createRelationalOperation(baseGt);
        var gte = createRelationalOperation(function (value, other) {
          return value >= other;
        });
        function isArguments(value) {
          return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
        }
        var isArray = Array.isArray;
        var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction(value);
        }
        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }
        function isBoolean(value) {
          return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
        }
        var isBuffer = nativeIsBuffer || stubFalse;
        var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
        function isElement(value) {
          return value != null && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
        }
        function isEmpty(value) {
          if (isArrayLike(value) && (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isArguments(value))) {
            return !value.length;
          }
          var tag = getTag(value);
          if (tag == mapTag || tag == setTag) {
            return !value.size;
          }
          if (isPrototype(value)) {
            return !nativeKeys(value).length;
          }
          for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
              return false;
            }
          }
          return true;
        }
        function isEqual(value, other) {
          return baseIsEqual(value, other);
        }
        function isEqualWith(value, other, customizer) {
          customizer = typeof customizer == 'function' ? customizer : undefined;
          var result = customizer ? customizer(value, other) : undefined;
          return result === undefined ? baseIsEqual(value, other, customizer) : !!result;
        }
        function isError(value) {
          if (!isObjectLike(value)) {
            return false;
          }
          return objectToString.call(value) == errorTag || typeof value.message == 'string' && typeof value.name == 'string';
        }
        function isFinite(value) {
          return typeof value == 'number' && nativeIsFinite(value);
        }
        function isFunction(value) {
          var tag = isObject(value) ? objectToString.call(value) : '';
          return tag == funcTag || tag == genTag;
        }
        function isInteger(value) {
          return typeof value == 'number' && value == toInteger(value);
        }
        function isLength(value) {
          return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }
        function isObject(value) {
          var type = typeof value;
          return value != null && (type == 'object' || type == 'function');
        }
        function isObjectLike(value) {
          return value != null && typeof value == 'object';
        }
        var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
        function isMatch(object, source) {
          return object === source || baseIsMatch(object, source, getMatchData(source));
        }
        function isMatchWith(object, source, customizer) {
          customizer = typeof customizer == 'function' ? customizer : undefined;
          return baseIsMatch(object, source, getMatchData(source), customizer);
        }
        function isNaN(value) {
          return isNumber(value) && value != +value;
        }
        function isNative(value) {
          if (isMaskable(value)) {
            throw new Error(CORE_ERROR_TEXT);
          }
          return baseIsNative(value);
        }
        function isNull(value) {
          return value === null;
        }
        function isNil(value) {
          return value == null;
        }
        function isNumber(value) {
          return typeof value == 'number' || isObjectLike(value) && objectToString.call(value) == numberTag;
        }
        function isPlainObject(value) {
          if (!isObjectLike(value) || objectToString.call(value) != objectTag) {
            return false;
          }
          var proto = getPrototype(value);
          if (proto === null) {
            return true;
          }
          var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
          return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
        }
        var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
        function isSafeInteger(value) {
          return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
        }
        var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
        function isString(value) {
          return typeof value == 'string' || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
        }
        function isSymbol(value) {
          return typeof value == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
        }
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
        function isUndefined(value) {
          return value === undefined;
        }
        function isWeakMap(value) {
          return isObjectLike(value) && getTag(value) == weakMapTag;
        }
        function isWeakSet(value) {
          return isObjectLike(value) && objectToString.call(value) == weakSetTag;
        }
        var lt = createRelationalOperation(baseLt);
        var lte = createRelationalOperation(function (value, other) {
          return value <= other;
        });
        function toArray(value) {
          if (!value) {
            return [];
          }
          if (isArrayLike(value)) {
            return isString(value) ? stringToArray(value) : copyArray(value);
          }
          if (iteratorSymbol && value[iteratorSymbol]) {
            return iteratorToArray(value[iteratorSymbol]());
          }
          var tag = getTag(value),
              func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
          return func(value);
        }
        function toFinite(value) {
          if (!value) {
            return value === 0 ? value : 0;
          }
          value = toNumber(value);
          if (value === INFINITY || value === -INFINITY) {
            var sign = value < 0 ? -1 : 1;
            return sign * MAX_INTEGER;
          }
          return value === value ? value : 0;
        }
        function toInteger(value) {
          var result = toFinite(value),
              remainder = result % 1;
          return result === result ? remainder ? result - remainder : result : 0;
        }
        function toLength(value) {
          return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
        }
        function toNumber(value) {
          if (typeof value == 'number') {
            return value;
          }
          if (isSymbol(value)) {
            return NAN;
          }
          if (isObject(value)) {
            var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
            value = isObject(other) ? other + '' : other;
          }
          if (typeof value != 'string') {
            return value === 0 ? value : +value;
          }
          value = value.replace(reTrim, '');
          var isBinary = reIsBinary.test(value);
          return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
        }
        function toPlainObject(value) {
          return copyObject(value, keysIn(value));
        }
        function toSafeInteger(value) {
          return baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
        }
        function toString(value) {
          return value == null ? '' : baseToString(value);
        }
        var assign = createAssigner(function (object, source) {
          if (isPrototype(source) || isArrayLike(source)) {
            copyObject(source, keys(source), object);
            return;
          }
          for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
              assignValue(object, key, source[key]);
            }
          }
        });
        var assignIn = createAssigner(function (object, source) {
          copyObject(source, keysIn(source), object);
        });
        var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
          copyObject(source, keysIn(source), object, customizer);
        });
        var assignWith = createAssigner(function (object, source, srcIndex, customizer) {
          copyObject(source, keys(source), object, customizer);
        });
        var at = flatRest(baseAt);
        function create(prototype, properties) {
          var result = baseCreate(prototype);
          return properties ? baseAssign(result, properties) : result;
        }
        var defaults = baseRest(function (args) {
          args.push(undefined, assignInDefaults);
          return apply(assignInWith, undefined, args);
        });
        var defaultsDeep = baseRest(function (args) {
          args.push(undefined, mergeDefaults);
          return apply(mergeWith, undefined, args);
        });
        function findKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
        }
        function findLastKey(object, predicate) {
          return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
        }
        function forIn(object, iteratee) {
          return object == null ? object : baseFor(object, getIteratee(iteratee, 3), keysIn);
        }
        function forInRight(object, iteratee) {
          return object == null ? object : baseForRight(object, getIteratee(iteratee, 3), keysIn);
        }
        function forOwn(object, iteratee) {
          return object && baseForOwn(object, getIteratee(iteratee, 3));
        }
        function forOwnRight(object, iteratee) {
          return object && baseForOwnRight(object, getIteratee(iteratee, 3));
        }
        function functions(object) {
          return object == null ? [] : baseFunctions(object, keys(object));
        }
        function functionsIn(object) {
          return object == null ? [] : baseFunctions(object, keysIn(object));
        }
        function get(object, path, defaultValue) {
          var result = object == null ? undefined : baseGet(object, path);
          return result === undefined ? defaultValue : result;
        }
        function has(object, path) {
          return object != null && hasPath(object, path, baseHas);
        }
        function hasIn(object, path) {
          return object != null && hasPath(object, path, baseHasIn);
        }
        var invert = createInverter(function (result, value, key) {
          result[value] = key;
        }, constant(identity));
        var invertBy = createInverter(function (result, value, key) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }, getIteratee);
        var invoke = baseRest(baseInvoke);
        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }
        function keysIn(object) {
          return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
        }
        function mapKeys(object, iteratee) {
          var result = {};
          iteratee = getIteratee(iteratee, 3);
          baseForOwn(object, function (value, key, object) {
            baseAssignValue(result, iteratee(value, key, object), value);
          });
          return result;
        }
        function mapValues(object, iteratee) {
          var result = {};
          iteratee = getIteratee(iteratee, 3);
          baseForOwn(object, function (value, key, object) {
            baseAssignValue(result, key, iteratee(value, key, object));
          });
          return result;
        }
        var merge = createAssigner(function (object, source, srcIndex) {
          baseMerge(object, source, srcIndex);
        });
        var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
          baseMerge(object, source, srcIndex, customizer);
        });
        var omit = flatRest(function (object, props) {
          if (object == null) {
            return {};
          }
          props = arrayMap(props, toKey);
          return basePick(object, baseDifference(getAllKeysIn(object), props));
        });
        function omitBy(object, predicate) {
          return pickBy(object, negate(getIteratee(predicate)));
        }
        var pick = flatRest(function (object, props) {
          return object == null ? {} : basePick(object, arrayMap(props, toKey));
        });
        function pickBy(object, predicate) {
          return object == null ? {} : basePickBy(object, getAllKeysIn(object), getIteratee(predicate));
        }
        function result(object, path, defaultValue) {
          path = isKey(path, object) ? [path] : castPath(path);
          var index = -1,
              length = path.length;
          if (!length) {
            object = undefined;
            length = 1;
          }
          while (++index < length) {
            var value = object == null ? undefined : object[toKey(path[index])];
            if (value === undefined) {
              index = length;
              value = defaultValue;
            }
            object = isFunction(value) ? value.call(object) : value;
          }
          return object;
        }
        function set(object, path, value) {
          return object == null ? object : baseSet(object, path, value);
        }
        function setWith(object, path, value, customizer) {
          customizer = typeof customizer == 'function' ? customizer : undefined;
          return object == null ? object : baseSet(object, path, value, customizer);
        }
        var toPairs = createToPairs(keys);
        var toPairsIn = createToPairs(keysIn);
        function transform(object, iteratee, accumulator) {
          var isArr = isArray(object) || isTypedArray(object);
          iteratee = getIteratee(iteratee, 4);
          if (accumulator == null) {
            if (isArr || isObject(object)) {
              var Ctor = object.constructor;
              if (isArr) {
                accumulator = isArray(object) ? new Ctor() : [];
              } else {
                accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
              }
            } else {
              accumulator = {};
            }
          }
          (isArr ? arrayEach : baseForOwn)(object, function (value, index, object) {
            return iteratee(accumulator, value, index, object);
          });
          return accumulator;
        }
        function unset(object, path) {
          return object == null ? true : baseUnset(object, path);
        }
        function update(object, path, updater) {
          return object == null ? object : baseUpdate(object, path, castFunction(updater));
        }
        function updateWith(object, path, updater, customizer) {
          customizer = typeof customizer == 'function' ? customizer : undefined;
          return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
        }
        function values(object) {
          return object ? baseValues(object, keys(object)) : [];
        }
        function valuesIn(object) {
          return object == null ? [] : baseValues(object, keysIn(object));
        }
        function clamp(number, lower, upper) {
          if (upper === undefined) {
            upper = lower;
            lower = undefined;
          }
          if (upper !== undefined) {
            upper = toNumber(upper);
            upper = upper === upper ? upper : 0;
          }
          if (lower !== undefined) {
            lower = toNumber(lower);
            lower = lower === lower ? lower : 0;
          }
          return baseClamp(toNumber(number), lower, upper);
        }
        function inRange(number, start, end) {
          start = toFinite(start);
          if (end === undefined) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          number = toNumber(number);
          return baseInRange(number, start, end);
        }
        function random(lower, upper, floating) {
          if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
            upper = floating = undefined;
          }
          if (floating === undefined) {
            if (typeof upper == 'boolean') {
              floating = upper;
              upper = undefined;
            } else if (typeof lower == 'boolean') {
              floating = lower;
              lower = undefined;
            }
          }
          if (lower === undefined && upper === undefined) {
            lower = 0;
            upper = 1;
          } else {
            lower = toFinite(lower);
            if (upper === undefined) {
              upper = lower;
              lower = 0;
            } else {
              upper = toFinite(upper);
            }
          }
          if (lower > upper) {
            var temp = lower;
            lower = upper;
            upper = temp;
          }
          if (floating || lower % 1 || upper % 1) {
            var rand = nativeRandom();
            return nativeMin(lower + rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1))), upper);
          }
          return baseRandom(lower, upper);
        }
        var camelCase = createCompounder(function (result, word, index) {
          word = word.toLowerCase();
          return result + (index ? capitalize(word) : word);
        });
        function capitalize(string) {
          return upperFirst(toString(string).toLowerCase());
        }
        function deburr(string) {
          string = toString(string);
          return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
        }
        function endsWith(string, target, position) {
          string = toString(string);
          target = baseToString(target);
          var length = string.length;
          position = position === undefined ? length : baseClamp(toInteger(position), 0, length);
          var end = position;
          position -= target.length;
          return position >= 0 && string.slice(position, end) == target;
        }
        function escape(string) {
          string = toString(string);
          return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
        }
        function escapeRegExp(string) {
          string = toString(string);
          return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
        }
        var kebabCase = createCompounder(function (result, word, index) {
          return result + (index ? '-' : '') + word.toLowerCase();
        });
        var lowerCase = createCompounder(function (result, word, index) {
          return result + (index ? ' ' : '') + word.toLowerCase();
        });
        var lowerFirst = createCaseFirst('toLowerCase');
        function pad(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          if (!length || strLength >= length) {
            return string;
          }
          var mid = (length - strLength) / 2;
          return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
        }
        function padEnd(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
        }
        function padStart(string, length, chars) {
          string = toString(string);
          length = toInteger(length);
          var strLength = length ? stringSize(string) : 0;
          return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
        }
        function parseInt(string, radix, guard) {
          if (guard || radix == null) {
            radix = 0;
          } else if (radix) {
            radix = +radix;
          }
          return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
        }
        function repeat(string, n, guard) {
          if (guard ? isIterateeCall(string, n, guard) : n === undefined) {
            n = 1;
          } else {
            n = toInteger(n);
          }
          return baseRepeat(toString(string), n);
        }
        function replace() {
          var args = arguments,
              string = toString(args[0]);
          return args.length < 3 ? string : string.replace(args[1], args[2]);
        }
        var snakeCase = createCompounder(function (result, word, index) {
          return result + (index ? '_' : '') + word.toLowerCase();
        });
        function split(string, separator, limit) {
          if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
            separator = limit = undefined;
          }
          limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
          if (!limit) {
            return [];
          }
          string = toString(string);
          if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
            separator = baseToString(separator);
            if (!separator && hasUnicode(string)) {
              return castSlice(stringToArray(string), 0, limit);
            }
          }
          return string.split(separator, limit);
        }
        var startCase = createCompounder(function (result, word, index) {
          return result + (index ? ' ' : '') + upperFirst(word);
        });
        function startsWith(string, target, position) {
          string = toString(string);
          position = baseClamp(toInteger(position), 0, string.length);
          target = baseToString(target);
          return string.slice(position, position + target.length) == target;
        }
        function template(string, options, guard) {
          var settings = lodash.templateSettings;
          if (guard && isIterateeCall(string, options, guard)) {
            options = undefined;
          }
          string = toString(string);
          options = assignInWith({}, options, settings, assignInDefaults);
          var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
              importsKeys = keys(imports),
              importsValues = baseValues(imports, importsKeys);
          var isEscaping,
              isEvaluating,
              index = 0,
              interpolate = options.interpolate || reNoMatch,
              source = "__p += '";
          var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
          var sourceURL = '//# sourceURL=' + ('sourceURL' in options ? options.sourceURL : 'lodash.templateSources[' + ++templateCounter + ']') + '\n';
          string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
            interpolateValue || (interpolateValue = esTemplateValue);
            source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
            if (escapeValue) {
              isEscaping = true;
              source += "' +\n__e(" + escapeValue + ") +\n'";
            }
            if (evaluateValue) {
              isEvaluating = true;
              source += "';\n" + evaluateValue + ";\n__p += '";
            }
            if (interpolateValue) {
              source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
            }
            index = offset + match.length;
            return match;
          });
          source += "';\n";
          var variable = options.variable;
          if (!variable) {
            source = 'with (obj) {\n' + source + '\n}\n';
          }
          source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
          source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
          var result = attempt(function () {
            return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
          });
          result.source = source;
          if (isError(result)) {
            throw result;
          }
          return result;
        }
        function toLower(value) {
          return toString(value).toLowerCase();
        }
        function toUpper(value) {
          return toString(value).toUpperCase();
        }
        function trim(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined)) {
            return string.replace(reTrim, '');
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string),
              chrSymbols = stringToArray(chars),
              start = charsStartIndex(strSymbols, chrSymbols),
              end = charsEndIndex(strSymbols, chrSymbols) + 1;
          return castSlice(strSymbols, start, end).join('');
        }
        function trimEnd(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined)) {
            return string.replace(reTrimEnd, '');
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string),
              end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
          return castSlice(strSymbols, 0, end).join('');
        }
        function trimStart(string, chars, guard) {
          string = toString(string);
          if (string && (guard || chars === undefined)) {
            return string.replace(reTrimStart, '');
          }
          if (!string || !(chars = baseToString(chars))) {
            return string;
          }
          var strSymbols = stringToArray(string),
              start = charsStartIndex(strSymbols, stringToArray(chars));
          return castSlice(strSymbols, start).join('');
        }
        function truncate(string, options) {
          var length = DEFAULT_TRUNC_LENGTH,
              omission = DEFAULT_TRUNC_OMISSION;
          if (isObject(options)) {
            var separator = 'separator' in options ? options.separator : separator;
            length = 'length' in options ? toInteger(options.length) : length;
            omission = 'omission' in options ? baseToString(options.omission) : omission;
          }
          string = toString(string);
          var strLength = string.length;
          if (hasUnicode(string)) {
            var strSymbols = stringToArray(string);
            strLength = strSymbols.length;
          }
          if (length >= strLength) {
            return string;
          }
          var end = length - stringSize(omission);
          if (end < 1) {
            return omission;
          }
          var result = strSymbols ? castSlice(strSymbols, 0, end).join('') : string.slice(0, end);
          if (separator === undefined) {
            return result + omission;
          }
          if (strSymbols) {
            end += result.length - end;
          }
          if (isRegExp(separator)) {
            if (string.slice(end).search(separator)) {
              var match,
                  substring = result;
              if (!separator.global) {
                separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
              }
              separator.lastIndex = 0;
              while (match = separator.exec(substring)) {
                var newEnd = match.index;
              }
              result = result.slice(0, newEnd === undefined ? end : newEnd);
            }
          } else if (string.indexOf(baseToString(separator), end) != end) {
            var index = result.lastIndexOf(separator);
            if (index > -1) {
              result = result.slice(0, index);
            }
          }
          return result + omission;
        }
        function unescape(string) {
          string = toString(string);
          return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
        }
        var upperCase = createCompounder(function (result, word, index) {
          return result + (index ? ' ' : '') + word.toUpperCase();
        });
        var upperFirst = createCaseFirst('toUpperCase');
        function words(string, pattern, guard) {
          string = toString(string);
          pattern = guard ? undefined : pattern;
          if (pattern === undefined) {
            return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
          }
          return string.match(pattern) || [];
        }
        var attempt = baseRest(function (func, args) {
          try {
            return apply(func, undefined, args);
          } catch (e) {
            return isError(e) ? e : new Error(e);
          }
        });
        var bindAll = flatRest(function (object, methodNames) {
          arrayEach(methodNames, function (key) {
            key = toKey(key);
            baseAssignValue(object, key, bind(object[key], object));
          });
          return object;
        });
        function cond(pairs) {
          var length = pairs ? pairs.length : 0,
              toIteratee = getIteratee();
          pairs = !length ? [] : arrayMap(pairs, function (pair) {
            if (typeof pair[1] != 'function') {
              throw new TypeError(FUNC_ERROR_TEXT);
            }
            return [toIteratee(pair[0]), pair[1]];
          });
          return baseRest(function (args) {
            var index = -1;
            while (++index < length) {
              var pair = pairs[index];
              if (apply(pair[0], this, args)) {
                return apply(pair[1], this, args);
              }
            }
          });
        }
        function conforms(source) {
          return baseConforms(baseClone(source, true));
        }
        function constant(value) {
          return function () {
            return value;
          };
        }
        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }
        var flow = createFlow();
        var flowRight = createFlow(true);
        function identity(value) {
          return value;
        }
        function iteratee(func) {
          return baseIteratee(typeof func == 'function' ? func : baseClone(func, true));
        }
        function matches(source) {
          return baseMatches(baseClone(source, true));
        }
        function matchesProperty(path, srcValue) {
          return baseMatchesProperty(path, baseClone(srcValue, true));
        }
        var method = baseRest(function (path, args) {
          return function (object) {
            return baseInvoke(object, path, args);
          };
        });
        var methodOf = baseRest(function (object, args) {
          return function (path) {
            return baseInvoke(object, path, args);
          };
        });
        function mixin(object, source, options) {
          var props = keys(source),
              methodNames = baseFunctions(source, props);
          if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
            options = source;
            source = object;
            object = this;
            methodNames = baseFunctions(source, keys(source));
          }
          var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
              isFunc = isFunction(object);
          arrayEach(methodNames, function (methodName) {
            var func = source[methodName];
            object[methodName] = func;
            if (isFunc) {
              object.prototype[methodName] = function () {
                var chainAll = this.__chain__;
                if (chain || chainAll) {
                  var result = object(this.__wrapped__),
                      actions = result.__actions__ = copyArray(this.__actions__);
                  actions.push({
                    'func': func,
                    'args': arguments,
                    'thisArg': object
                  });
                  result.__chain__ = chainAll;
                  return result;
                }
                return func.apply(object, arrayPush([this.value()], arguments));
              };
            }
          });
          return object;
        }
        function noConflict() {
          if (root._ === this) {
            root._ = oldDash;
          }
          return this;
        }
        function noop() {}
        function nthArg(n) {
          n = toInteger(n);
          return baseRest(function (args) {
            return baseNth(args, n);
          });
        }
        var over = createOver(arrayMap);
        var overEvery = createOver(arrayEvery);
        var overSome = createOver(arraySome);
        function property(path) {
          return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }
        function propertyOf(object) {
          return function (path) {
            return object == null ? undefined : baseGet(object, path);
          };
        }
        var range = createRange();
        var rangeRight = createRange(true);
        function stubArray() {
          return [];
        }
        function stubFalse() {
          return false;
        }
        function stubObject() {
          return {};
        }
        function stubString() {
          return '';
        }
        function stubTrue() {
          return true;
        }
        function times(n, iteratee) {
          n = toInteger(n);
          if (n < 1 || n > MAX_SAFE_INTEGER) {
            return [];
          }
          var index = MAX_ARRAY_LENGTH,
              length = nativeMin(n, MAX_ARRAY_LENGTH);
          iteratee = getIteratee(iteratee);
          n -= MAX_ARRAY_LENGTH;
          var result = baseTimes(length, iteratee);
          while (++index < n) {
            iteratee(index);
          }
          return result;
        }
        function toPath(value) {
          if (isArray(value)) {
            return arrayMap(value, toKey);
          }
          return isSymbol(value) ? [value] : copyArray(stringToPath(value));
        }
        function uniqueId(prefix) {
          var id = ++idCounter;
          return toString(prefix) + id;
        }
        var add = createMathOperation(function (augend, addend) {
          return augend + addend;
        }, 0);
        var ceil = createRound('ceil');
        var divide = createMathOperation(function (dividend, divisor) {
          return dividend / divisor;
        }, 1);
        var floor = createRound('floor');
        function max(array) {
          return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
        }
        function maxBy(array, iteratee) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseGt) : undefined;
        }
        function mean(array) {
          return baseMean(array, identity);
        }
        function meanBy(array, iteratee) {
          return baseMean(array, getIteratee(iteratee, 2));
        }
        function min(array) {
          return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
        }
        function minBy(array, iteratee) {
          return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseLt) : undefined;
        }
        var multiply = createMathOperation(function (multiplier, multiplicand) {
          return multiplier * multiplicand;
        }, 1);
        var round = createRound('round');
        var subtract = createMathOperation(function (minuend, subtrahend) {
          return minuend - subtrahend;
        }, 0);
        function sum(array) {
          return array && array.length ? baseSum(array, identity) : 0;
        }
        function sumBy(array, iteratee) {
          return array && array.length ? baseSum(array, getIteratee(iteratee, 2)) : 0;
        }
        lodash.after = after;
        lodash.ary = ary;
        lodash.assign = assign;
        lodash.assignIn = assignIn;
        lodash.assignInWith = assignInWith;
        lodash.assignWith = assignWith;
        lodash.at = at;
        lodash.before = before;
        lodash.bind = bind;
        lodash.bindAll = bindAll;
        lodash.bindKey = bindKey;
        lodash.castArray = castArray;
        lodash.chain = chain;
        lodash.chunk = chunk;
        lodash.compact = compact;
        lodash.concat = concat;
        lodash.cond = cond;
        lodash.conforms = conforms;
        lodash.constant = constant;
        lodash.countBy = countBy;
        lodash.create = create;
        lodash.curry = curry;
        lodash.curryRight = curryRight;
        lodash.debounce = debounce;
        lodash.defaults = defaults;
        lodash.defaultsDeep = defaultsDeep;
        lodash.defer = defer;
        lodash.delay = delay;
        lodash.difference = difference;
        lodash.differenceBy = differenceBy;
        lodash.differenceWith = differenceWith;
        lodash.drop = drop;
        lodash.dropRight = dropRight;
        lodash.dropRightWhile = dropRightWhile;
        lodash.dropWhile = dropWhile;
        lodash.fill = fill;
        lodash.filter = filter;
        lodash.flatMap = flatMap;
        lodash.flatMapDeep = flatMapDeep;
        lodash.flatMapDepth = flatMapDepth;
        lodash.flatten = flatten;
        lodash.flattenDeep = flattenDeep;
        lodash.flattenDepth = flattenDepth;
        lodash.flip = flip;
        lodash.flow = flow;
        lodash.flowRight = flowRight;
        lodash.fromPairs = fromPairs;
        lodash.functions = functions;
        lodash.functionsIn = functionsIn;
        lodash.groupBy = groupBy;
        lodash.initial = initial;
        lodash.intersection = intersection;
        lodash.intersectionBy = intersectionBy;
        lodash.intersectionWith = intersectionWith;
        lodash.invert = invert;
        lodash.invertBy = invertBy;
        lodash.invokeMap = invokeMap;
        lodash.iteratee = iteratee;
        lodash.keyBy = keyBy;
        lodash.keys = keys;
        lodash.keysIn = keysIn;
        lodash.map = map;
        lodash.mapKeys = mapKeys;
        lodash.mapValues = mapValues;
        lodash.matches = matches;
        lodash.matchesProperty = matchesProperty;
        lodash.memoize = memoize;
        lodash.merge = merge;
        lodash.mergeWith = mergeWith;
        lodash.method = method;
        lodash.methodOf = methodOf;
        lodash.mixin = mixin;
        lodash.negate = negate;
        lodash.nthArg = nthArg;
        lodash.omit = omit;
        lodash.omitBy = omitBy;
        lodash.once = once;
        lodash.orderBy = orderBy;
        lodash.over = over;
        lodash.overArgs = overArgs;
        lodash.overEvery = overEvery;
        lodash.overSome = overSome;
        lodash.partial = partial;
        lodash.partialRight = partialRight;
        lodash.partition = partition;
        lodash.pick = pick;
        lodash.pickBy = pickBy;
        lodash.property = property;
        lodash.propertyOf = propertyOf;
        lodash.pull = pull;
        lodash.pullAll = pullAll;
        lodash.pullAllBy = pullAllBy;
        lodash.pullAllWith = pullAllWith;
        lodash.pullAt = pullAt;
        lodash.range = range;
        lodash.rangeRight = rangeRight;
        lodash.rearg = rearg;
        lodash.reject = reject;
        lodash.remove = remove;
        lodash.rest = rest;
        lodash.reverse = reverse;
        lodash.sampleSize = sampleSize;
        lodash.set = set;
        lodash.setWith = setWith;
        lodash.shuffle = shuffle;
        lodash.slice = slice;
        lodash.sortBy = sortBy;
        lodash.sortedUniq = sortedUniq;
        lodash.sortedUniqBy = sortedUniqBy;
        lodash.split = split;
        lodash.spread = spread;
        lodash.tail = tail;
        lodash.take = take;
        lodash.takeRight = takeRight;
        lodash.takeRightWhile = takeRightWhile;
        lodash.takeWhile = takeWhile;
        lodash.tap = tap;
        lodash.throttle = throttle;
        lodash.thru = thru;
        lodash.toArray = toArray;
        lodash.toPairs = toPairs;
        lodash.toPairsIn = toPairsIn;
        lodash.toPath = toPath;
        lodash.toPlainObject = toPlainObject;
        lodash.transform = transform;
        lodash.unary = unary;
        lodash.union = union;
        lodash.unionBy = unionBy;
        lodash.unionWith = unionWith;
        lodash.uniq = uniq;
        lodash.uniqBy = uniqBy;
        lodash.uniqWith = uniqWith;
        lodash.unset = unset;
        lodash.unzip = unzip;
        lodash.unzipWith = unzipWith;
        lodash.update = update;
        lodash.updateWith = updateWith;
        lodash.values = values;
        lodash.valuesIn = valuesIn;
        lodash.without = without;
        lodash.words = words;
        lodash.wrap = wrap;
        lodash.xor = xor;
        lodash.xorBy = xorBy;
        lodash.xorWith = xorWith;
        lodash.zip = zip;
        lodash.zipObject = zipObject;
        lodash.zipObjectDeep = zipObjectDeep;
        lodash.zipWith = zipWith;
        lodash.entries = toPairs;
        lodash.entriesIn = toPairsIn;
        lodash.extend = assignIn;
        lodash.extendWith = assignInWith;
        mixin(lodash, lodash);
        lodash.add = add;
        lodash.attempt = attempt;
        lodash.camelCase = camelCase;
        lodash.capitalize = capitalize;
        lodash.ceil = ceil;
        lodash.clamp = clamp;
        lodash.clone = clone;
        lodash.cloneDeep = cloneDeep;
        lodash.cloneDeepWith = cloneDeepWith;
        lodash.cloneWith = cloneWith;
        lodash.conformsTo = conformsTo;
        lodash.deburr = deburr;
        lodash.defaultTo = defaultTo;
        lodash.divide = divide;
        lodash.endsWith = endsWith;
        lodash.eq = eq;
        lodash.escape = escape;
        lodash.escapeRegExp = escapeRegExp;
        lodash.every = every;
        lodash.find = find;
        lodash.findIndex = findIndex;
        lodash.findKey = findKey;
        lodash.findLast = findLast;
        lodash.findLastIndex = findLastIndex;
        lodash.findLastKey = findLastKey;
        lodash.floor = floor;
        lodash.forEach = forEach;
        lodash.forEachRight = forEachRight;
        lodash.forIn = forIn;
        lodash.forInRight = forInRight;
        lodash.forOwn = forOwn;
        lodash.forOwnRight = forOwnRight;
        lodash.get = get;
        lodash.gt = gt;
        lodash.gte = gte;
        lodash.has = has;
        lodash.hasIn = hasIn;
        lodash.head = head;
        lodash.identity = identity;
        lodash.includes = includes;
        lodash.indexOf = indexOf;
        lodash.inRange = inRange;
        lodash.invoke = invoke;
        lodash.isArguments = isArguments;
        lodash.isArray = isArray;
        lodash.isArrayBuffer = isArrayBuffer;
        lodash.isArrayLike = isArrayLike;
        lodash.isArrayLikeObject = isArrayLikeObject;
        lodash.isBoolean = isBoolean;
        lodash.isBuffer = isBuffer;
        lodash.isDate = isDate;
        lodash.isElement = isElement;
        lodash.isEmpty = isEmpty;
        lodash.isEqual = isEqual;
        lodash.isEqualWith = isEqualWith;
        lodash.isError = isError;
        lodash.isFinite = isFinite;
        lodash.isFunction = isFunction;
        lodash.isInteger = isInteger;
        lodash.isLength = isLength;
        lodash.isMap = isMap;
        lodash.isMatch = isMatch;
        lodash.isMatchWith = isMatchWith;
        lodash.isNaN = isNaN;
        lodash.isNative = isNative;
        lodash.isNil = isNil;
        lodash.isNull = isNull;
        lodash.isNumber = isNumber;
        lodash.isObject = isObject;
        lodash.isObjectLike = isObjectLike;
        lodash.isPlainObject = isPlainObject;
        lodash.isRegExp = isRegExp;
        lodash.isSafeInteger = isSafeInteger;
        lodash.isSet = isSet;
        lodash.isString = isString;
        lodash.isSymbol = isSymbol;
        lodash.isTypedArray = isTypedArray;
        lodash.isUndefined = isUndefined;
        lodash.isWeakMap = isWeakMap;
        lodash.isWeakSet = isWeakSet;
        lodash.join = join;
        lodash.kebabCase = kebabCase;
        lodash.last = last;
        lodash.lastIndexOf = lastIndexOf;
        lodash.lowerCase = lowerCase;
        lodash.lowerFirst = lowerFirst;
        lodash.lt = lt;
        lodash.lte = lte;
        lodash.max = max;
        lodash.maxBy = maxBy;
        lodash.mean = mean;
        lodash.meanBy = meanBy;
        lodash.min = min;
        lodash.minBy = minBy;
        lodash.stubArray = stubArray;
        lodash.stubFalse = stubFalse;
        lodash.stubObject = stubObject;
        lodash.stubString = stubString;
        lodash.stubTrue = stubTrue;
        lodash.multiply = multiply;
        lodash.nth = nth;
        lodash.noConflict = noConflict;
        lodash.noop = noop;
        lodash.now = now;
        lodash.pad = pad;
        lodash.padEnd = padEnd;
        lodash.padStart = padStart;
        lodash.parseInt = parseInt;
        lodash.random = random;
        lodash.reduce = reduce;
        lodash.reduceRight = reduceRight;
        lodash.repeat = repeat;
        lodash.replace = replace;
        lodash.result = result;
        lodash.round = round;
        lodash.runInContext = runInContext;
        lodash.sample = sample;
        lodash.size = size;
        lodash.snakeCase = snakeCase;
        lodash.some = some;
        lodash.sortedIndex = sortedIndex;
        lodash.sortedIndexBy = sortedIndexBy;
        lodash.sortedIndexOf = sortedIndexOf;
        lodash.sortedLastIndex = sortedLastIndex;
        lodash.sortedLastIndexBy = sortedLastIndexBy;
        lodash.sortedLastIndexOf = sortedLastIndexOf;
        lodash.startCase = startCase;
        lodash.startsWith = startsWith;
        lodash.subtract = subtract;
        lodash.sum = sum;
        lodash.sumBy = sumBy;
        lodash.template = template;
        lodash.times = times;
        lodash.toFinite = toFinite;
        lodash.toInteger = toInteger;
        lodash.toLength = toLength;
        lodash.toLower = toLower;
        lodash.toNumber = toNumber;
        lodash.toSafeInteger = toSafeInteger;
        lodash.toString = toString;
        lodash.toUpper = toUpper;
        lodash.trim = trim;
        lodash.trimEnd = trimEnd;
        lodash.trimStart = trimStart;
        lodash.truncate = truncate;
        lodash.unescape = unescape;
        lodash.uniqueId = uniqueId;
        lodash.upperCase = upperCase;
        lodash.upperFirst = upperFirst;
        lodash.each = forEach;
        lodash.eachRight = forEachRight;
        lodash.first = head;
        mixin(lodash, function () {
          var source = {};
          baseForOwn(lodash, function (func, methodName) {
            if (!hasOwnProperty.call(lodash.prototype, methodName)) {
              source[methodName] = func;
            }
          });
          return source;
        }(), { 'chain': false });
        lodash.VERSION = VERSION;
        arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function (methodName) {
          lodash[methodName].placeholder = lodash;
        });
        arrayEach(['drop', 'take'], function (methodName, index) {
          LazyWrapper.prototype[methodName] = function (n) {
            var filtered = this.__filtered__;
            if (filtered && !index) {
              return new LazyWrapper(this);
            }
            n = n === undefined ? 1 : nativeMax(toInteger(n), 0);
            var result = this.clone();
            if (filtered) {
              result.__takeCount__ = nativeMin(n, result.__takeCount__);
            } else {
              result.__views__.push({
                'size': nativeMin(n, MAX_ARRAY_LENGTH),
                'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
              });
            }
            return result;
          };
          LazyWrapper.prototype[methodName + 'Right'] = function (n) {
            return this.reverse()[methodName](n).reverse();
          };
        });
        arrayEach(['filter', 'map', 'takeWhile'], function (methodName, index) {
          var type = index + 1,
              isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
          LazyWrapper.prototype[methodName] = function (iteratee) {
            var result = this.clone();
            result.__iteratees__.push({
              'iteratee': getIteratee(iteratee, 3),
              'type': type
            });
            result.__filtered__ = result.__filtered__ || isFilter;
            return result;
          };
        });
        arrayEach(['head', 'last'], function (methodName, index) {
          var takeName = 'take' + (index ? 'Right' : '');
          LazyWrapper.prototype[methodName] = function () {
            return this[takeName](1).value()[0];
          };
        });
        arrayEach(['initial', 'tail'], function (methodName, index) {
          var dropName = 'drop' + (index ? '' : 'Right');
          LazyWrapper.prototype[methodName] = function () {
            return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
          };
        });
        LazyWrapper.prototype.compact = function () {
          return this.filter(identity);
        };
        LazyWrapper.prototype.find = function (predicate) {
          return this.filter(predicate).head();
        };
        LazyWrapper.prototype.findLast = function (predicate) {
          return this.reverse().find(predicate);
        };
        LazyWrapper.prototype.invokeMap = baseRest(function (path, args) {
          if (typeof path == 'function') {
            return new LazyWrapper(this);
          }
          return this.map(function (value) {
            return baseInvoke(value, path, args);
          });
        });
        LazyWrapper.prototype.reject = function (predicate) {
          return this.filter(negate(getIteratee(predicate)));
        };
        LazyWrapper.prototype.slice = function (start, end) {
          start = toInteger(start);
          var result = this;
          if (result.__filtered__ && (start > 0 || end < 0)) {
            return new LazyWrapper(result);
          }
          if (start < 0) {
            result = result.takeRight(-start);
          } else if (start) {
            result = result.drop(start);
          }
          if (end !== undefined) {
            end = toInteger(end);
            result = end < 0 ? result.dropRight(-end) : result.take(end - start);
          }
          return result;
        };
        LazyWrapper.prototype.takeRightWhile = function (predicate) {
          return this.reverse().takeWhile(predicate).reverse();
        };
        LazyWrapper.prototype.toArray = function () {
          return this.take(MAX_ARRAY_LENGTH);
        };
        baseForOwn(LazyWrapper.prototype, function (func, methodName) {
          var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
              isTaker = /^(?:head|last)$/.test(methodName),
              lodashFunc = lodash[isTaker ? 'take' + (methodName == 'last' ? 'Right' : '') : methodName],
              retUnwrapped = isTaker || /^find/.test(methodName);
          if (!lodashFunc) {
            return;
          }
          lodash.prototype[methodName] = function () {
            var value = this.__wrapped__,
                args = isTaker ? [1] : arguments,
                isLazy = value instanceof LazyWrapper,
                iteratee = args[0],
                useLazy = isLazy || isArray(value);
            var interceptor = function (value) {
              var result = lodashFunc.apply(lodash, arrayPush([value], args));
              return isTaker && chainAll ? result[0] : result;
            };
            if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
              isLazy = useLazy = false;
            }
            var chainAll = this.__chain__,
                isHybrid = !!this.__actions__.length,
                isUnwrapped = retUnwrapped && !chainAll,
                onlyLazy = isLazy && !isHybrid;
            if (!retUnwrapped && useLazy) {
              value = onlyLazy ? value : new LazyWrapper(this);
              var result = func.apply(value, args);
              result.__actions__.push({
                'func': thru,
                'args': [interceptor],
                'thisArg': undefined
              });
              return new LodashWrapper(result, chainAll);
            }
            if (isUnwrapped && onlyLazy) {
              return func.apply(this, args);
            }
            result = this.thru(interceptor);
            return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
          };
        });
        arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function (methodName) {
          var func = arrayProto[methodName],
              chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
              retUnwrapped = /^(?:pop|shift)$/.test(methodName);
          lodash.prototype[methodName] = function () {
            var args = arguments;
            if (retUnwrapped && !this.__chain__) {
              var value = this.value();
              return func.apply(isArray(value) ? value : [], args);
            }
            return this[chainName](function (value) {
              return func.apply(isArray(value) ? value : [], args);
            });
          };
        });
        baseForOwn(LazyWrapper.prototype, function (func, methodName) {
          var lodashFunc = lodash[methodName];
          if (lodashFunc) {
            var key = lodashFunc.name + '',
                names = realNames[key] || (realNames[key] = []);
            names.push({
              'name': methodName,
              'func': lodashFunc
            });
          }
        });
        realNames[createHybrid(undefined, BIND_KEY_FLAG).name] = [{
          'name': 'wrapper',
          'func': undefined
        }];
        LazyWrapper.prototype.clone = lazyClone;
        LazyWrapper.prototype.reverse = lazyReverse;
        LazyWrapper.prototype.value = lazyValue;
        lodash.prototype.at = wrapperAt;
        lodash.prototype.chain = wrapperChain;
        lodash.prototype.commit = wrapperCommit;
        lodash.prototype.next = wrapperNext;
        lodash.prototype.plant = wrapperPlant;
        lodash.prototype.reverse = wrapperReverse;
        lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
        lodash.prototype.first = lodash.prototype.head;
        if (iteratorSymbol) {
          lodash.prototype[iteratorSymbol] = wrapperToIterator;
        }
        return lodash;
      };
      var _ = runInContext();
      if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        root._ = _;
        define(function () {
          return _;
        });
      } else if (freeModule) {
        (freeModule.exports = _)._ = _;
        freeExports._ = _;
      } else {
        root._ = _;
      }
    }).call(this);
  })($__require('@empty').Buffer, $__require('@empty'));
  return module.exports;
});
System.registerDynamic("npm:lodash@4.16.2.js", ["npm:lodash@4.16.2/lodash.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:lodash@4.16.2/lodash.js");
  return module.exports;
});
System.registerDynamic('npm:path-browserify@0.0.0/index.js', ['github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    function normalizeArray(parts, allowAboveRoot) {
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }
      return parts;
    }
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function (filename) {
      return splitPathRe.exec(filename).slice(1);
    };
    exports.resolve = function () {
      var resolvedPath = '',
          resolvedAbsolute = false;
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = i >= 0 ? arguments[i] : process.cwd();
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          continue;
        }
        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
      }
      resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
        return !!p;
      }), !resolvedAbsolute).join('/');
      return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
    };
    exports.normalize = function (path) {
      var isAbsolute = exports.isAbsolute(path),
          trailingSlash = substr(path, -1) === '/';
      path = normalizeArray(filter(path.split('/'), function (p) {
        return !!p;
      }), !isAbsolute).join('/');
      if (!path && !isAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }
      return (isAbsolute ? '/' : '') + path;
    };
    exports.isAbsolute = function (path) {
      return path.charAt(0) === '/';
    };
    exports.join = function () {
      var paths = Array.prototype.slice.call(arguments, 0);
      return exports.normalize(filter(paths, function (p, index) {
        if (typeof p !== 'string') {
          throw new TypeError('Arguments to path.join must be strings');
        }
        return p;
      }).join('/'));
    };
    exports.relative = function (from, to) {
      from = exports.resolve(from).substr(1);
      to = exports.resolve(to).substr(1);
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }
        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }
      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join('/');
    };
    exports.sep = '/';
    exports.delimiter = ':';
    exports.dirname = function (path) {
      var result = splitPath(path),
          root = result[0],
          dir = result[1];
      if (!root && !dir) {
        return '.';
      }
      if (dir) {
        dir = dir.substr(0, dir.length - 1);
      }
      return root + dir;
    };
    exports.basename = function (path, ext) {
      var f = splitPath(path)[2];
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    };
    exports.extname = function (path) {
      return splitPath(path)[3];
    };
    function filter(xs, f) {
      if (xs.filter) return xs.filter(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
      }
      return res;
    }
    var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
      return str.substr(start, len);
    } : function (str, start, len) {
      if (start < 0) start = str.length + start;
      return str.substr(start, len);
    };
    ;
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic("npm:path-browserify@0.0.0.js", ["npm:path-browserify@0.0.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:path-browserify@0.0.0/index.js");
  return module.exports;
});
System.registerDynamic('github:jspm/nodelibs-path@0.1.0/index.js', ['npm:path-browserify@0.0.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = System._nodeRequire ? System._nodeRequire('path') : $__require('npm:path-browserify@0.0.0.js');
  return module.exports;
});
System.registerDynamic("github:jspm/nodelibs-path@0.1.0.js", ["github:jspm/nodelibs-path@0.1.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("github:jspm/nodelibs-path@0.1.0/index.js");
  return module.exports;
});
System.registerDynamic('npm:concat-map@0.0.1/index.js', [], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    module.exports = function (xs, fn) {
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            var x = fn(xs[i], i);
            if (isArray(x)) res.push.apply(res, x);else res.push(x);
        }
        return res;
    };

    var isArray = Array.isArray || function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]';
    };
    return module.exports;
});
System.registerDynamic("npm:concat-map@0.0.1.js", ["npm:concat-map@0.0.1/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:concat-map@0.0.1/index.js");
  return module.exports;
});
System.registerDynamic("npm:balanced-match@0.4.2/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = balanced;
  function balanced(a, b, str) {
    if (a instanceof RegExp) a = maybeMatch(a, str);
    if (b instanceof RegExp) b = maybeMatch(b, str);

    var r = range(a, b, str);

    return r && {
      start: r[0],
      end: r[1],
      pre: str.slice(0, r[0]),
      body: str.slice(r[0] + a.length, r[1]),
      post: str.slice(r[1] + b.length)
    };
  }

  function maybeMatch(reg, str) {
    var m = str.match(reg);
    return m ? m[0] : null;
  }

  balanced.range = range;
  function range(a, b, str) {
    var begs, beg, left, right, result;
    var ai = str.indexOf(a);
    var bi = str.indexOf(b, ai + 1);
    var i = ai;

    if (ai >= 0 && bi > 0) {
      begs = [];
      left = str.length;

      while (i >= 0 && !result) {
        if (i == ai) {
          begs.push(i);
          ai = str.indexOf(a, i + 1);
        } else if (begs.length == 1) {
          result = [begs.pop(), bi];
        } else {
          beg = begs.pop();
          if (beg < left) {
            left = beg;
            right = bi;
          }

          bi = str.indexOf(b, i + 1);
        }

        i = ai < bi && ai >= 0 ? ai : bi;
      }

      if (begs.length) {
        result = [left, right];
      }
    }

    return result;
  }
  return module.exports;
});
System.registerDynamic("npm:balanced-match@0.4.2.js", ["npm:balanced-match@0.4.2/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:balanced-match@0.4.2/index.js");
  return module.exports;
});
System.registerDynamic('npm:brace-expansion@1.1.6/index.js', ['npm:concat-map@0.0.1.js', 'npm:balanced-match@0.4.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var concatMap = $__require('npm:concat-map@0.0.1.js');
  var balanced = $__require('npm:balanced-match@0.4.2.js');

  module.exports = expandTop;

  var escSlash = '\0SLASH' + Math.random() + '\0';
  var escOpen = '\0OPEN' + Math.random() + '\0';
  var escClose = '\0CLOSE' + Math.random() + '\0';
  var escComma = '\0COMMA' + Math.random() + '\0';
  var escPeriod = '\0PERIOD' + Math.random() + '\0';

  function numeric(str) {
    return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
  }

  function escapeBraces(str) {
    return str.split('\\\\').join(escSlash).split('\\{').join(escOpen).split('\\}').join(escClose).split('\\,').join(escComma).split('\\.').join(escPeriod);
  }

  function unescapeBraces(str) {
    return str.split(escSlash).join('\\').split(escOpen).join('{').split(escClose).join('}').split(escComma).join(',').split(escPeriod).join('.');
  }

  // Basically just str.split(","), but handling cases
  // where we have nested braced sections, which should be
  // treated as individual members, like {a,{b,c},d}
  function parseCommaParts(str) {
    if (!str) return [''];

    var parts = [];
    var m = balanced('{', '}', str);

    if (!m) return str.split(',');

    var pre = m.pre;
    var body = m.body;
    var post = m.post;
    var p = pre.split(',');

    p[p.length - 1] += '{' + body + '}';
    var postParts = parseCommaParts(post);
    if (post.length) {
      p[p.length - 1] += postParts.shift();
      p.push.apply(p, postParts);
    }

    parts.push.apply(parts, p);

    return parts;
  }

  function expandTop(str) {
    if (!str) return [];

    // I don't know why Bash 4.3 does this, but it does.
    // Anything starting with {} will have the first two bytes preserved
    // but *only* at the top level, so {},a}b will not expand to anything,
    // but a{},b}c will be expanded to [a}c,abc].
    // One could argue that this is a bug in Bash, but since the goal of
    // this module is to match Bash's rules, we escape a leading {}
    if (str.substr(0, 2) === '{}') {
      str = '\\{\\}' + str.substr(2);
    }

    return expand(escapeBraces(str), true).map(unescapeBraces);
  }

  function identity(e) {
    return e;
  }

  function embrace(str) {
    return '{' + str + '}';
  }
  function isPadded(el) {
    return (/^-?0\d/.test(el)
    );
  }

  function lte(i, y) {
    return i <= y;
  }
  function gte(i, y) {
    return i >= y;
  }

  function expand(str, isTop) {
    var expansions = [];

    var m = balanced('{', '}', str);
    if (!m || /\$$/.test(m.pre)) return [str];

    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = /^(.*,)+(.+)?$/.test(m.body);
    if (!isSequence && !isOptions) {
      // {a},b}
      if (m.post.match(/,.*\}/)) {
        str = m.pre + '{' + m.body + escClose + m.post;
        return expand(str);
      }
      return [str];
    }

    var n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        // x{{a,b}}y ==> x{a}y x{b}y
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) {
          var post = m.post.length ? expand(m.post, false) : [''];
          return post.map(function (p) {
            return m.pre + n[0] + p;
          });
        }
      }
    }

    // at this point, n is the parts, and we know it's not a comma set
    // with a single entry.

    // no need to expand pre, since it is guaranteed to be free of brace-sets
    var pre = m.pre;
    var post = m.post.length ? expand(m.post, false) : [''];

    var N;

    if (isSequence) {
      var x = numeric(n[0]);
      var y = numeric(n[1]);
      var width = Math.max(n[0].length, n[1].length);
      var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
      var test = lte;
      var reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      var pad = n.some(isPadded);

      N = [];

      for (var i = x; test(i, y); i += incr) {
        var c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === '\\') c = '';
        } else {
          c = String(i);
          if (pad) {
            var need = width - c.length;
            if (need > 0) {
              var z = new Array(need + 1).join('0');
              if (i < 0) c = '-' + z + c.slice(1);else c = z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = concatMap(n, function (el) {
        return expand(el, false);
      });
    }

    for (var j = 0; j < N.length; j++) {
      for (var k = 0; k < post.length; k++) {
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion) expansions.push(expansion);
      }
    }

    return expansions;
  }
  return module.exports;
});
System.registerDynamic("npm:brace-expansion@1.1.6.js", ["npm:brace-expansion@1.1.6/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:brace-expansion@1.1.6/index.js");
  return module.exports;
});
System.registerDynamic('npm:minimatch@3.0.3/minimatch.js', ['github:jspm/nodelibs-path@0.1.0.js', 'npm:brace-expansion@1.1.6.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = minimatch;
  minimatch.Minimatch = Minimatch;
  var path = { sep: '/' };
  try {
    path = $__require('github:jspm/nodelibs-path@0.1.0.js');
  } catch (er) {}
  var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
  var expand = $__require('npm:brace-expansion@1.1.6.js');
  var plTypes = {
    '!': {
      open: '(?:(?!(?:',
      close: '))[^/]*?)'
    },
    '?': {
      open: '(?:',
      close: ')?'
    },
    '+': {
      open: '(?:',
      close: ')+'
    },
    '*': {
      open: '(?:',
      close: ')*'
    },
    '@': {
      open: '(?:',
      close: ')'
    }
  };
  var qmark = '[^/]';
  var star = qmark + '*?';
  var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';
  var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';
  var reSpecials = charSet('().*{}+?[]^$\\!');
  function charSet(s) {
    return s.split('').reduce(function (set, c) {
      set[c] = true;
      return set;
    }, {});
  }
  var slashSplit = /\/+/;
  minimatch.filter = filter;
  function filter(pattern, options) {
    options = options || {};
    return function (p, i, list) {
      return minimatch(p, pattern, options);
    };
  }
  function ext(a, b) {
    a = a || {};
    b = b || {};
    var t = {};
    Object.keys(b).forEach(function (k) {
      t[k] = b[k];
    });
    Object.keys(a).forEach(function (k) {
      t[k] = a[k];
    });
    return t;
  }
  minimatch.defaults = function (def) {
    if (!def || !Object.keys(def).length) return minimatch;
    var orig = minimatch;
    var m = function minimatch(p, pattern, options) {
      return orig.minimatch(p, pattern, ext(def, options));
    };
    m.Minimatch = function Minimatch(pattern, options) {
      return new orig.Minimatch(pattern, ext(def, options));
    };
    return m;
  };
  Minimatch.defaults = function (def) {
    if (!def || !Object.keys(def).length) return Minimatch;
    return minimatch.defaults(def).Minimatch;
  };
  function minimatch(p, pattern, options) {
    if (typeof pattern !== 'string') {
      throw new TypeError('glob pattern string required');
    }
    if (!options) options = {};
    if (!options.nocomment && pattern.charAt(0) === '#') {
      return false;
    }
    if (pattern.trim() === '') return p === '';
    return new Minimatch(pattern, options).match(p);
  }
  function Minimatch(pattern, options) {
    if (!(this instanceof Minimatch)) {
      return new Minimatch(pattern, options);
    }
    if (typeof pattern !== 'string') {
      throw new TypeError('glob pattern string required');
    }
    if (!options) options = {};
    pattern = pattern.trim();
    if (path.sep !== '/') {
      pattern = pattern.split(path.sep).join('/');
    }
    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;
    this.make();
  }
  Minimatch.prototype.debug = function () {};
  Minimatch.prototype.make = make;
  function make() {
    if (this._made) return;
    var pattern = this.pattern;
    var options = this.options;
    if (!options.nocomment && pattern.charAt(0) === '#') {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    var set = this.globSet = this.braceExpand();
    if (options.debug) this.debug = console.error;
    this.debug(this.pattern, set);
    set = this.globParts = set.map(function (s) {
      return s.split(slashSplit);
    });
    this.debug(this.pattern, set);
    set = set.map(function (s, si, set) {
      return s.map(this.parse, this);
    }, this);
    this.debug(this.pattern, set);
    set = set.filter(function (s) {
      return s.indexOf(false) === -1;
    });
    this.debug(this.pattern, set);
    this.set = set;
  }
  Minimatch.prototype.parseNegate = parseNegate;
  function parseNegate() {
    var pattern = this.pattern;
    var negate = false;
    var options = this.options;
    var negateOffset = 0;
    if (options.nonegate) return;
    for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === '!'; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset) this.pattern = pattern.substr(negateOffset);
    this.negate = negate;
  }
  minimatch.braceExpand = function (pattern, options) {
    return braceExpand(pattern, options);
  };
  Minimatch.prototype.braceExpand = braceExpand;
  function braceExpand(pattern, options) {
    if (!options) {
      if (this instanceof Minimatch) {
        options = this.options;
      } else {
        options = {};
      }
    }
    pattern = typeof pattern === 'undefined' ? this.pattern : pattern;
    if (typeof pattern === 'undefined') {
      throw new TypeError('undefined pattern');
    }
    if (options.nobrace || !pattern.match(/\{.*\}/)) {
      return [pattern];
    }
    return expand(pattern);
  }
  Minimatch.prototype.parse = parse;
  var SUBPARSE = {};
  function parse(pattern, isSub) {
    if (pattern.length > 1024 * 64) {
      throw new TypeError('pattern is too long');
    }
    var options = this.options;
    if (!options.noglobstar && pattern === '**') return GLOBSTAR;
    if (pattern === '') return '';
    var re = '';
    var hasMagic = !!options.nocase;
    var escaping = false;
    var patternListStack = [];
    var negativeLists = [];
    var stateChar;
    var inClass = false;
    var reClassStart = -1;
    var classStart = -1;
    var patternStart = pattern.charAt(0) === '.' ? '' : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))' : '(?!\\.)';
    var self = this;
    function clearStateChar() {
      if (stateChar) {
        switch (stateChar) {
          case '*':
            re += star;
            hasMagic = true;
            break;
          case '?':
            re += qmark;
            hasMagic = true;
            break;
          default:
            re += '\\' + stateChar;
            break;
        }
        self.debug('clearStateChar %j %j', stateChar, re);
        stateChar = false;
      }
    }
    for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
      this.debug('%s\t%s %s %j', pattern, i, re, c);
      if (escaping && reSpecials[c]) {
        re += '\\' + c;
        escaping = false;
        continue;
      }
      switch (c) {
        case '/':
          return false;
        case '\\':
          clearStateChar();
          escaping = true;
          continue;
        case '?':
        case '*':
        case '+':
        case '@':
        case '!':
          this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);
          if (inClass) {
            this.debug('  in class');
            if (c === '!' && i === classStart + 1) c = '^';
            re += c;
            continue;
          }
          self.debug('call clearStateChar %j', stateChar);
          clearStateChar();
          stateChar = c;
          if (options.noext) clearStateChar();
          continue;
        case '(':
          if (inClass) {
            re += '(';
            continue;
          }
          if (!stateChar) {
            re += '\\(';
            continue;
          }
          patternListStack.push({
            type: stateChar,
            start: i - 1,
            reStart: re.length,
            open: plTypes[stateChar].open,
            close: plTypes[stateChar].close
          });
          re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
          this.debug('plType %j %j', stateChar, re);
          stateChar = false;
          continue;
        case ')':
          if (inClass || !patternListStack.length) {
            re += '\\)';
            continue;
          }
          clearStateChar();
          hasMagic = true;
          var pl = patternListStack.pop();
          re += pl.close;
          if (pl.type === '!') {
            negativeLists.push(pl);
          }
          pl.reEnd = re.length;
          continue;
        case '|':
          if (inClass || !patternListStack.length || escaping) {
            re += '\\|';
            escaping = false;
            continue;
          }
          clearStateChar();
          re += '|';
          continue;
        case '[':
          clearStateChar();
          if (inClass) {
            re += '\\' + c;
            continue;
          }
          inClass = true;
          classStart = i;
          reClassStart = re.length;
          re += c;
          continue;
        case ']':
          if (i === classStart + 1 || !inClass) {
            re += '\\' + c;
            escaping = false;
            continue;
          }
          if (inClass) {
            var cs = pattern.substring(classStart + 1, i);
            try {
              RegExp('[' + cs + ']');
            } catch (er) {
              var sp = this.parse(cs, SUBPARSE);
              re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
              hasMagic = hasMagic || sp[1];
              inClass = false;
              continue;
            }
          }
          hasMagic = true;
          inClass = false;
          re += c;
          continue;
        default:
          clearStateChar();
          if (escaping) {
            escaping = false;
          } else if (reSpecials[c] && !(c === '^' && inClass)) {
            re += '\\';
          }
          re += c;
      }
    }
    if (inClass) {
      cs = pattern.substr(classStart + 1);
      sp = this.parse(cs, SUBPARSE);
      re = re.substr(0, reClassStart) + '\\[' + sp[0];
      hasMagic = hasMagic || sp[1];
    }
    for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
      var tail = re.slice(pl.reStart + pl.open.length);
      this.debug('setting tail', re, pl);
      tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
        if (!$2) {
          $2 = '\\';
        }
        return $1 + $1 + $2 + '|';
      });
      this.debug('tail=%j\n   %s', tail, tail, pl, re);
      var t = pl.type === '*' ? star : pl.type === '?' ? qmark : '\\' + pl.type;
      hasMagic = true;
      re = re.slice(0, pl.reStart) + t + '\\(' + tail;
    }
    clearStateChar();
    if (escaping) {
      re += '\\\\';
    }
    var addPatternStart = false;
    switch (re.charAt(0)) {
      case '.':
      case '[':
      case '(':
        addPatternStart = true;
    }
    for (var n = negativeLists.length - 1; n > -1; n--) {
      var nl = negativeLists[n];
      var nlBefore = re.slice(0, nl.reStart);
      var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
      var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
      var nlAfter = re.slice(nl.reEnd);
      nlLast += nlAfter;
      var openParensBefore = nlBefore.split('(').length - 1;
      var cleanAfter = nlAfter;
      for (i = 0; i < openParensBefore; i++) {
        cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
      }
      nlAfter = cleanAfter;
      var dollar = '';
      if (nlAfter === '' && isSub !== SUBPARSE) {
        dollar = '$';
      }
      var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
      re = newRe;
    }
    if (re !== '' && hasMagic) {
      re = '(?=.)' + re;
    }
    if (addPatternStart) {
      re = patternStart + re;
    }
    if (isSub === SUBPARSE) {
      return [re, hasMagic];
    }
    if (!hasMagic) {
      return globUnescape(pattern);
    }
    var flags = options.nocase ? 'i' : '';
    try {
      var regExp = new RegExp('^' + re + '$', flags);
    } catch (er) {
      return new RegExp('$.');
    }
    regExp._glob = pattern;
    regExp._src = re;
    return regExp;
  }
  minimatch.makeRe = function (pattern, options) {
    return new Minimatch(pattern, options || {}).makeRe();
  };
  Minimatch.prototype.makeRe = makeRe;
  function makeRe() {
    if (this.regexp || this.regexp === false) return this.regexp;
    var set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    var options = this.options;
    var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
    var flags = options.nocase ? 'i' : '';
    var re = set.map(function (pattern) {
      return pattern.map(function (p) {
        return p === GLOBSTAR ? twoStar : typeof p === 'string' ? regExpEscape(p) : p._src;
      }).join('\\\/');
    }).join('|');
    re = '^(?:' + re + ')$';
    if (this.negate) re = '^(?!' + re + ').*$';
    try {
      this.regexp = new RegExp(re, flags);
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  minimatch.match = function (list, pattern, options) {
    options = options || {};
    var mm = new Minimatch(pattern, options);
    list = list.filter(function (f) {
      return mm.match(f);
    });
    if (mm.options.nonull && !list.length) {
      list.push(pattern);
    }
    return list;
  };
  Minimatch.prototype.match = match;
  function match(f, partial) {
    this.debug('match', f, this.pattern);
    if (this.comment) return false;
    if (this.empty) return f === '';
    if (f === '/' && partial) return true;
    var options = this.options;
    if (path.sep !== '/') {
      f = f.split(path.sep).join('/');
    }
    f = f.split(slashSplit);
    this.debug(this.pattern, 'split', f);
    var set = this.set;
    this.debug(this.pattern, 'set', set);
    var filename;
    var i;
    for (i = f.length - 1; i >= 0; i--) {
      filename = f[i];
      if (filename) break;
    }
    for (i = 0; i < set.length; i++) {
      var pattern = set[i];
      var file = f;
      if (options.matchBase && pattern.length === 1) {
        file = [filename];
      }
      var hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate) return true;
        return !this.negate;
      }
    }
    if (options.flipNegate) return false;
    return this.negate;
  }
  Minimatch.prototype.matchOne = function (file, pattern, partial) {
    var options = this.options;
    this.debug('matchOne', {
      'this': this,
      file: file,
      pattern: pattern
    });
    this.debug('matchOne', file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug('matchOne loop');
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false) return false;
      if (p === GLOBSTAR) {
        this.debug('GLOBSTAR', [pattern, p, f]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug('** at the end');
          for (; fi < fl; fi++) {
            if (file[fi] === '.' || file[fi] === '..' || !options.dot && file[fi].charAt(0) === '.') return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug('globstar found match!', fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === '.' || swallowee === '..' || !options.dot && swallowee.charAt(0) === '.') {
              this.debug('dot detected!', file, fr, pattern, pr);
              break;
            }
            this.debug('globstar swallow a segment, and continue');
            fr++;
          }
        }
        if (partial) {
          this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
          if (fr === fl) return true;
        }
        return false;
      }
      var hit;
      if (typeof p === 'string') {
        if (options.nocase) {
          hit = f.toLowerCase() === p.toLowerCase();
        } else {
          hit = f === p;
        }
        this.debug('string match', p, f, hit);
      } else {
        hit = f.match(p);
        this.debug('pattern match', p, f, hit);
      }
      if (!hit) return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      var emptyFileEnd = fi === fl - 1 && file[fi] === '';
      return emptyFileEnd;
    }
    throw new Error('wtf?');
  };
  function globUnescape(s) {
    return s.replace(/\\(.)/g, '$1');
  }
  function regExpEscape(s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  return module.exports;
});
System.registerDynamic("npm:minimatch@3.0.3.js", ["npm:minimatch@3.0.3/minimatch.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:minimatch@3.0.3/minimatch.js");
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/BoundCallbackObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/AsyncSubject.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var AsyncSubject_1 = $__require('npm:rxjs@5.0.0-beta.12/AsyncSubject.js');
  var BoundCallbackObservable = function (_super) {
    __extends(BoundCallbackObservable, _super);
    function BoundCallbackObservable(callbackFunc, selector, args, scheduler) {
      _super.call(this);
      this.callbackFunc = callbackFunc;
      this.selector = selector;
      this.args = args;
      this.scheduler = scheduler;
    }
    BoundCallbackObservable.create = function (func, selector, scheduler) {
      if (selector === void 0) {
        selector = undefined;
      }
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i - 0] = arguments[_i];
        }
        return new BoundCallbackObservable(func, selector, args, scheduler);
      };
    };
    BoundCallbackObservable.prototype._subscribe = function (subscriber) {
      var callbackFunc = this.callbackFunc;
      var args = this.args;
      var scheduler = this.scheduler;
      var subject = this.subject;
      if (!scheduler) {
        if (!subject) {
          subject = this.subject = new AsyncSubject_1.AsyncSubject();
          var handler = function handlerFn() {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              innerArgs[_i - 0] = arguments[_i];
            }
            var source = handlerFn.source;
            var selector = source.selector,
                subject = source.subject;
            if (selector) {
              var result_1 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
              if (result_1 === errorObject_1.errorObject) {
                subject.error(errorObject_1.errorObject.e);
              } else {
                subject.next(result_1);
                subject.complete();
              }
            } else {
              subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
              subject.complete();
            }
          };
          handler.source = this;
          var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
          if (result === errorObject_1.errorObject) {
            subject.error(errorObject_1.errorObject.e);
          }
        }
        return subject.subscribe(subscriber);
      } else {
        return scheduler.schedule(BoundCallbackObservable.dispatch, 0, {
          source: this,
          subscriber: subscriber
        });
      }
    };
    BoundCallbackObservable.dispatch = function (state) {
      var self = this;
      var source = state.source,
          subscriber = state.subscriber;
      var callbackFunc = source.callbackFunc,
          args = source.args,
          scheduler = source.scheduler;
      var subject = source.subject;
      if (!subject) {
        subject = source.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function handlerFn() {
          var innerArgs = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            innerArgs[_i - 0] = arguments[_i];
          }
          var source = handlerFn.source;
          var selector = source.selector,
              subject = source.subject;
          if (selector) {
            var result_2 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
            if (result_2 === errorObject_1.errorObject) {
              self.add(scheduler.schedule(dispatchError, 0, {
                err: errorObject_1.errorObject.e,
                subject: subject
              }));
            } else {
              self.add(scheduler.schedule(dispatchNext, 0, {
                value: result_2,
                subject: subject
              }));
            }
          } else {
            var value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
            self.add(scheduler.schedule(dispatchNext, 0, {
              value: value,
              subject: subject
            }));
          }
        };
        handler.source = source;
        var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
        if (result === errorObject_1.errorObject) {
          subject.error(errorObject_1.errorObject.e);
        }
      }
      self.add(subject.subscribe(subscriber));
    };
    return BoundCallbackObservable;
  }(Observable_1.Observable);
  exports.BoundCallbackObservable = BoundCallbackObservable;
  function dispatchNext(arg) {
    var value = arg.value,
        subject = arg.subject;
    subject.next(value);
    subject.complete();
  }
  function dispatchError(arg) {
    var err = arg.err,
        subject = arg.subject;
    subject.error(err);
  }
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/bindCallback.js", ["npm:rxjs@5.0.0-beta.12/observable/BoundCallbackObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var BoundCallbackObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/BoundCallbackObservable.js");
  exports.bindCallback = BoundCallbackObservable_1.BoundCallbackObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/bindCallback.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/bindCallback.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var bindCallback_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/bindCallback.js');
  Observable_1.Observable.bindCallback = bindCallback_1.bindCallback;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/BoundNodeCallbackObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/AsyncSubject.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var AsyncSubject_1 = $__require('npm:rxjs@5.0.0-beta.12/AsyncSubject.js');
  var BoundNodeCallbackObservable = function (_super) {
    __extends(BoundNodeCallbackObservable, _super);
    function BoundNodeCallbackObservable(callbackFunc, selector, args, scheduler) {
      _super.call(this);
      this.callbackFunc = callbackFunc;
      this.selector = selector;
      this.args = args;
      this.scheduler = scheduler;
    }
    BoundNodeCallbackObservable.create = function (func, selector, scheduler) {
      if (selector === void 0) {
        selector = undefined;
      }
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i - 0] = arguments[_i];
        }
        return new BoundNodeCallbackObservable(func, selector, args, scheduler);
      };
    };
    BoundNodeCallbackObservable.prototype._subscribe = function (subscriber) {
      var callbackFunc = this.callbackFunc;
      var args = this.args;
      var scheduler = this.scheduler;
      var subject = this.subject;
      if (!scheduler) {
        if (!subject) {
          subject = this.subject = new AsyncSubject_1.AsyncSubject();
          var handler = function handlerFn() {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              innerArgs[_i - 0] = arguments[_i];
            }
            var source = handlerFn.source;
            var selector = source.selector,
                subject = source.subject;
            var err = innerArgs.shift();
            if (err) {
              subject.error(err);
            } else if (selector) {
              var result_1 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
              if (result_1 === errorObject_1.errorObject) {
                subject.error(errorObject_1.errorObject.e);
              } else {
                subject.next(result_1);
                subject.complete();
              }
            } else {
              subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
              subject.complete();
            }
          };
          handler.source = this;
          var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
          if (result === errorObject_1.errorObject) {
            subject.error(errorObject_1.errorObject.e);
          }
        }
        return subject.subscribe(subscriber);
      } else {
        return scheduler.schedule(dispatch, 0, {
          source: this,
          subscriber: subscriber
        });
      }
    };
    return BoundNodeCallbackObservable;
  }(Observable_1.Observable);
  exports.BoundNodeCallbackObservable = BoundNodeCallbackObservable;
  function dispatch(state) {
    var self = this;
    var source = state.source,
        subscriber = state.subscriber;
    var _a = source,
        callbackFunc = _a.callbackFunc,
        args = _a.args,
        scheduler = _a.scheduler;
    var subject = source.subject;
    if (!subject) {
      subject = source.subject = new AsyncSubject_1.AsyncSubject();
      var handler = function handlerFn() {
        var innerArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          innerArgs[_i - 0] = arguments[_i];
        }
        var source = handlerFn.source;
        var selector = source.selector,
            subject = source.subject;
        var err = innerArgs.shift();
        if (err) {
          subject.error(err);
        } else if (selector) {
          var result_2 = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
          if (result_2 === errorObject_1.errorObject) {
            self.add(scheduler.schedule(dispatchError, 0, {
              err: errorObject_1.errorObject.e,
              subject: subject
            }));
          } else {
            self.add(scheduler.schedule(dispatchNext, 0, {
              value: result_2,
              subject: subject
            }));
          }
        } else {
          var value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
          self.add(scheduler.schedule(dispatchNext, 0, {
            value: value,
            subject: subject
          }));
        }
      };
      handler.source = source;
      var result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
      if (result === errorObject_1.errorObject) {
        subject.error(errorObject_1.errorObject.e);
      }
    }
    self.add(subject.subscribe(subscriber));
  }
  function dispatchNext(arg) {
    var value = arg.value,
        subject = arg.subject;
    subject.next(value);
    subject.complete();
  }
  function dispatchError(arg) {
    var err = arg.err,
        subject = arg.subject;
    subject.error(err);
  }
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/bindNodeCallback.js", ["npm:rxjs@5.0.0-beta.12/observable/BoundNodeCallbackObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var BoundNodeCallbackObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/BoundNodeCallbackObservable.js");
  exports.bindNodeCallback = BoundNodeCallbackObservable_1.BoundNodeCallbackObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/bindNodeCallback.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/bindNodeCallback.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var bindNodeCallback_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/bindNodeCallback.js');
  Observable_1.Observable.bindNodeCallback = bindNodeCallback_1.bindNodeCallback;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/combineLatest.js', ['npm:rxjs@5.0.0-beta.12/util/isScheduler.js', 'npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/operator/combineLatest.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var combineLatest_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/combineLatest.js');
  function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    var project = null;
    var scheduler = null;
    if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
      scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
      project = observables.pop();
    }
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
      observables = observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new combineLatest_1.CombineLatestOperator(project));
  }
  exports.combineLatest = combineLatest;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/combineLatest.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/combineLatest.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var combineLatest_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/combineLatest.js');
  Observable_1.Observable.combineLatest = combineLatest_1.combineLatest;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/concat.js", ["npm:rxjs@5.0.0-beta.12/operator/concat.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var concat_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/concat.js");
  exports.concat = concat_1.concatStatic;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/concat.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/concat.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var concat_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/concat.js');
  Observable_1.Observable.concat = concat_1.concat;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/DeferObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var DeferObservable = function (_super) {
    __extends(DeferObservable, _super);
    function DeferObservable(observableFactory) {
      _super.call(this);
      this.observableFactory = observableFactory;
    }
    DeferObservable.create = function (observableFactory) {
      return new DeferObservable(observableFactory);
    };
    DeferObservable.prototype._subscribe = function (subscriber) {
      return new DeferSubscriber(subscriber, this.observableFactory);
    };
    return DeferObservable;
  }(Observable_1.Observable);
  exports.DeferObservable = DeferObservable;
  var DeferSubscriber = function (_super) {
    __extends(DeferSubscriber, _super);
    function DeferSubscriber(destination, factory) {
      _super.call(this, destination);
      this.factory = factory;
      this.tryDefer();
    }
    DeferSubscriber.prototype.tryDefer = function () {
      try {
        this._callFactory();
      } catch (err) {
        this._error(err);
      }
    };
    DeferSubscriber.prototype._callFactory = function () {
      var result = this.factory();
      if (result) {
        this.add(subscribeToResult_1.subscribeToResult(this, result));
      }
    };
    return DeferSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/defer.js", ["npm:rxjs@5.0.0-beta.12/observable/DeferObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var DeferObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/DeferObservable.js");
  exports.defer = DeferObservable_1.DeferObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/defer.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/defer.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var defer_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/defer.js');
  Observable_1.Observable.defer = defer_1.defer;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/empty.js", ["npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var EmptyObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js");
  exports.empty = EmptyObservable_1.EmptyObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/empty.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/empty.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var empty_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/empty.js');
  Observable_1.Observable.empty = empty_1.empty;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/ForkJoinObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js', 'npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var EmptyObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js');
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var ForkJoinObservable = function (_super) {
    __extends(ForkJoinObservable, _super);
    function ForkJoinObservable(sources, resultSelector) {
      _super.call(this);
      this.sources = sources;
      this.resultSelector = resultSelector;
    }
    ForkJoinObservable.create = function () {
      var sources = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i - 0] = arguments[_i];
      }
      if (sources === null || arguments.length === 0) {
        return new EmptyObservable_1.EmptyObservable();
      }
      var resultSelector = null;
      if (typeof sources[sources.length - 1] === 'function') {
        resultSelector = sources.pop();
      }
      if (sources.length === 1 && isArray_1.isArray(sources[0])) {
        sources = sources[0];
      }
      if (sources.length === 0) {
        return new EmptyObservable_1.EmptyObservable();
      }
      return new ForkJoinObservable(sources, resultSelector);
    };
    ForkJoinObservable.prototype._subscribe = function (subscriber) {
      return new ForkJoinSubscriber(subscriber, this.sources, this.resultSelector);
    };
    return ForkJoinObservable;
  }(Observable_1.Observable);
  exports.ForkJoinObservable = ForkJoinObservable;
  var ForkJoinSubscriber = function (_super) {
    __extends(ForkJoinSubscriber, _super);
    function ForkJoinSubscriber(destination, sources, resultSelector) {
      _super.call(this, destination);
      this.sources = sources;
      this.resultSelector = resultSelector;
      this.completed = 0;
      this.haveValues = 0;
      var len = sources.length;
      this.total = len;
      this.values = new Array(len);
      for (var i = 0; i < len; i++) {
        var source = sources[i];
        var innerSubscription = subscribeToResult_1.subscribeToResult(this, source, null, i);
        if (innerSubscription) {
          innerSubscription.outerIndex = i;
          this.add(innerSubscription);
        }
      }
    }
    ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.values[outerIndex] = innerValue;
      if (!innerSub._hasValue) {
        innerSub._hasValue = true;
        this.haveValues++;
      }
    };
    ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
      var destination = this.destination;
      var _a = this,
          haveValues = _a.haveValues,
          resultSelector = _a.resultSelector,
          values = _a.values;
      var len = values.length;
      if (!innerSub._hasValue) {
        destination.complete();
        return;
      }
      this.completed++;
      if (this.completed !== len) {
        return;
      }
      if (haveValues === len) {
        var value = resultSelector ? resultSelector.apply(this, values) : values;
        destination.next(value);
      }
      destination.complete();
    };
    return ForkJoinSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/forkJoin.js", ["npm:rxjs@5.0.0-beta.12/observable/ForkJoinObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var ForkJoinObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/ForkJoinObservable.js");
  exports.forkJoin = ForkJoinObservable_1.ForkJoinObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/forkJoin.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/forkJoin.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var forkJoin_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/forkJoin.js');
  Observable_1.Observable.forkJoin = forkJoin_1.forkJoin;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/from.js", ["npm:rxjs@5.0.0-beta.12/observable/FromObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var FromObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/FromObservable.js");
  exports.from = FromObservable_1.FromObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/from.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/from.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var from_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/from.js');
  Observable_1.Observable.from = from_1.from;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/FromEventObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/isFunction.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
    var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
    var isFunction_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isFunction.js');
    var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
    var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
    function isNodeStyleEventEmmitter(sourceObj) {
      return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
    }
    function isJQueryStyleEventEmitter(sourceObj) {
      return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
    }
    function isNodeList(sourceObj) {
      return !!sourceObj && sourceObj.toString() === '[object NodeList]';
    }
    function isHTMLCollection(sourceObj) {
      return !!sourceObj && sourceObj.toString() === '[object HTMLCollection]';
    }
    function isEventTarget(sourceObj) {
      return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
    }
    var FromEventObservable = function (_super) {
      __extends(FromEventObservable, _super);
      function FromEventObservable(sourceObj, eventName, selector, options) {
        _super.call(this);
        this.sourceObj = sourceObj;
        this.eventName = eventName;
        this.selector = selector;
        this.options = options;
      }
      FromEventObservable.create = function (target, eventName, options, selector) {
        if (isFunction_1.isFunction(options)) {
          selector = options;
          options = undefined;
        }
        return new FromEventObservable(target, eventName, selector, options);
      };
      FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber, options) {
        var unsubscribe;
        if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
          for (var i = 0, len = sourceObj.length; i < len; i++) {
            FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
          }
        } else if (isEventTarget(sourceObj)) {
          var source_1 = sourceObj;
          sourceObj.addEventListener(eventName, handler, options);
          unsubscribe = function () {
            return source_1.removeEventListener(eventName, handler);
          };
        } else if (isJQueryStyleEventEmitter(sourceObj)) {
          var source_2 = sourceObj;
          sourceObj.on(eventName, handler);
          unsubscribe = function () {
            return source_2.off(eventName, handler);
          };
        } else if (isNodeStyleEventEmmitter(sourceObj)) {
          var source_3 = sourceObj;
          sourceObj.addListener(eventName, handler);
          unsubscribe = function () {
            return source_3.removeListener(eventName, handler);
          };
        }
        subscriber.add(new Subscription_1.Subscription(unsubscribe));
      };
      FromEventObservable.prototype._subscribe = function (subscriber) {
        var sourceObj = this.sourceObj;
        var eventName = this.eventName;
        var options = this.options;
        var selector = this.selector;
        var handler = selector ? function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
          }
          var result = tryCatch_1.tryCatch(selector).apply(void 0, args);
          if (result === errorObject_1.errorObject) {
            subscriber.error(errorObject_1.errorObject.e);
          } else {
            subscriber.next(result);
          }
        } : function (e) {
          return subscriber.next(e);
        };
        FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options);
      };
      return FromEventObservable;
    }(Observable_1.Observable);
    exports.FromEventObservable = FromEventObservable;
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/fromEvent.js", ["npm:rxjs@5.0.0-beta.12/observable/FromEventObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var FromEventObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/FromEventObservable.js");
  exports.fromEvent = FromEventObservable_1.FromEventObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/fromEvent.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/fromEvent.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var fromEvent_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/fromEvent.js');
  Observable_1.Observable.fromEvent = fromEvent_1.fromEvent;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/FromEventPatternObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
    var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
    var FromEventPatternObservable = function (_super) {
      __extends(FromEventPatternObservable, _super);
      function FromEventPatternObservable(addHandler, removeHandler, selector) {
        _super.call(this);
        this.addHandler = addHandler;
        this.removeHandler = removeHandler;
        this.selector = selector;
      }
      FromEventPatternObservable.create = function (addHandler, removeHandler, selector) {
        return new FromEventPatternObservable(addHandler, removeHandler, selector);
      };
      FromEventPatternObservable.prototype._subscribe = function (subscriber) {
        var _this = this;
        var removeHandler = this.removeHandler;
        var handler = !!this.selector ? function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
          }
          _this._callSelector(subscriber, args);
        } : function (e) {
          subscriber.next(e);
        };
        this._callAddHandler(handler, subscriber);
        subscriber.add(new Subscription_1.Subscription(function () {
          removeHandler(handler);
        }));
      };
      FromEventPatternObservable.prototype._callSelector = function (subscriber, args) {
        try {
          var result = this.selector.apply(this, args);
          subscriber.next(result);
        } catch (e) {
          subscriber.error(e);
        }
      };
      FromEventPatternObservable.prototype._callAddHandler = function (handler, errorSubscriber) {
        try {
          this.addHandler(handler);
        } catch (e) {
          errorSubscriber.error(e);
        }
      };
      return FromEventPatternObservable;
    }(Observable_1.Observable);
    exports.FromEventPatternObservable = FromEventPatternObservable;
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/fromEventPattern.js", ["npm:rxjs@5.0.0-beta.12/observable/FromEventPatternObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var FromEventPatternObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/FromEventPatternObservable.js");
  exports.fromEventPattern = FromEventPatternObservable_1.FromEventPatternObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/fromEventPattern.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/fromEventPattern.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var fromEventPattern_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/fromEventPattern.js');
  Observable_1.Observable.fromEventPattern = fromEventPattern_1.fromEventPattern;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/fromPromise.js", ["npm:rxjs@5.0.0-beta.12/observable/PromiseObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var PromiseObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/PromiseObservable.js");
  exports.fromPromise = PromiseObservable_1.PromiseObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/fromPromise.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/fromPromise.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var fromPromise_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/fromPromise.js');
  Observable_1.Observable.fromPromise = fromPromise_1.fromPromise;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/GenerateObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/isScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
  var selfSelector = function (value) {
    return value;
  };
  var GenerateObservable = function (_super) {
    __extends(GenerateObservable, _super);
    function GenerateObservable(initialState, condition, iterate, resultSelector, scheduler) {
      _super.call(this);
      this.initialState = initialState;
      this.condition = condition;
      this.iterate = iterate;
      this.resultSelector = resultSelector;
      this.scheduler = scheduler;
    }
    GenerateObservable.create = function (initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
      if (arguments.length == 1) {
        return new GenerateObservable(initialStateOrOptions.initialState, initialStateOrOptions.condition, initialStateOrOptions.iterate, initialStateOrOptions.resultSelector || selfSelector, initialStateOrOptions.scheduler);
      }
      if (resultSelectorOrObservable === undefined || isScheduler_1.isScheduler(resultSelectorOrObservable)) {
        return new GenerateObservable(initialStateOrOptions, condition, iterate, selfSelector, resultSelectorOrObservable);
      }
      return new GenerateObservable(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler);
    };
    GenerateObservable.prototype._subscribe = function (subscriber) {
      var state = this.initialState;
      if (this.scheduler) {
        return this.scheduler.schedule(GenerateObservable.dispatch, 0, {
          subscriber: subscriber,
          iterate: this.iterate,
          condition: this.condition,
          resultSelector: this.resultSelector,
          state: state
        });
      }
      var _a = this,
          condition = _a.condition,
          resultSelector = _a.resultSelector,
          iterate = _a.iterate;
      do {
        if (condition) {
          var conditionResult = void 0;
          try {
            conditionResult = condition(state);
          } catch (err) {
            subscriber.error(err);
            return;
          }
          if (!conditionResult) {
            subscriber.complete();
            break;
          }
        }
        var value = void 0;
        try {
          value = resultSelector(state);
        } catch (err) {
          subscriber.error(err);
          return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
          break;
        }
        try {
          state = iterate(state);
        } catch (err) {
          subscriber.error(err);
          return;
        }
      } while (true);
    };
    GenerateObservable.dispatch = function (state) {
      var subscriber = state.subscriber,
          condition = state.condition;
      if (subscriber.closed) {
        return;
      }
      if (state.needIterate) {
        try {
          state.state = state.iterate(state.state);
        } catch (err) {
          subscriber.error(err);
          return;
        }
      } else {
        state.needIterate = true;
      }
      if (condition) {
        var conditionResult = void 0;
        try {
          conditionResult = condition(state.state);
        } catch (err) {
          subscriber.error(err);
          return;
        }
        if (!conditionResult) {
          subscriber.complete();
          return;
        }
        if (subscriber.closed) {
          return;
        }
      }
      var value;
      try {
        value = state.resultSelector(state.state);
      } catch (err) {
        subscriber.error(err);
        return;
      }
      if (subscriber.closed) {
        return;
      }
      subscriber.next(value);
      if (subscriber.closed) {
        return;
      }
      return this.schedule(state);
    };
    return GenerateObservable;
  }(Observable_1.Observable);
  exports.GenerateObservable = GenerateObservable;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/generate.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/GenerateObservable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var GenerateObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/GenerateObservable.js');
  Observable_1.Observable.generate = GenerateObservable_1.GenerateObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/IfObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var IfObservable = function (_super) {
    __extends(IfObservable, _super);
    function IfObservable(condition, thenSource, elseSource) {
      _super.call(this);
      this.condition = condition;
      this.thenSource = thenSource;
      this.elseSource = elseSource;
    }
    IfObservable.create = function (condition, thenSource, elseSource) {
      return new IfObservable(condition, thenSource, elseSource);
    };
    IfObservable.prototype._subscribe = function (subscriber) {
      var _a = this,
          condition = _a.condition,
          thenSource = _a.thenSource,
          elseSource = _a.elseSource;
      return new IfSubscriber(subscriber, condition, thenSource, elseSource);
    };
    return IfObservable;
  }(Observable_1.Observable);
  exports.IfObservable = IfObservable;
  var IfSubscriber = function (_super) {
    __extends(IfSubscriber, _super);
    function IfSubscriber(destination, condition, thenSource, elseSource) {
      _super.call(this, destination);
      this.condition = condition;
      this.thenSource = thenSource;
      this.elseSource = elseSource;
      this.tryIf();
    }
    IfSubscriber.prototype.tryIf = function () {
      var _a = this,
          condition = _a.condition,
          thenSource = _a.thenSource,
          elseSource = _a.elseSource;
      var result;
      try {
        result = condition();
        var source = result ? thenSource : elseSource;
        if (source) {
          this.add(subscribeToResult_1.subscribeToResult(this, source));
        } else {
          this._complete();
        }
      } catch (err) {
        this._error(err);
      }
    };
    return IfSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/if.js", ["npm:rxjs@5.0.0-beta.12/observable/IfObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var IfObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/IfObservable.js");
  exports._if = IfObservable_1.IfObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/if.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/if.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var if_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/if.js');
  Observable_1.Observable.if = if_1._if;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/IntervalObservable.js', ['npm:rxjs@5.0.0-beta.12/util/isNumeric.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var isNumeric_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isNumeric.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  var IntervalObservable = function (_super) {
    __extends(IntervalObservable, _super);
    function IntervalObservable(period, scheduler) {
      if (period === void 0) {
        period = 0;
      }
      if (scheduler === void 0) {
        scheduler = async_1.async;
      }
      _super.call(this);
      this.period = period;
      this.scheduler = scheduler;
      if (!isNumeric_1.isNumeric(period) || period < 0) {
        this.period = 0;
      }
      if (!scheduler || typeof scheduler.schedule !== 'function') {
        this.scheduler = async_1.async;
      }
    }
    IntervalObservable.create = function (period, scheduler) {
      if (period === void 0) {
        period = 0;
      }
      if (scheduler === void 0) {
        scheduler = async_1.async;
      }
      return new IntervalObservable(period, scheduler);
    };
    IntervalObservable.dispatch = function (state) {
      var index = state.index,
          subscriber = state.subscriber,
          period = state.period;
      subscriber.next(index);
      if (subscriber.closed) {
        return;
      }
      state.index += 1;
      this.schedule(state, period);
    };
    IntervalObservable.prototype._subscribe = function (subscriber) {
      var index = 0;
      var period = this.period;
      var scheduler = this.scheduler;
      subscriber.add(scheduler.schedule(IntervalObservable.dispatch, period, {
        index: index,
        subscriber: subscriber,
        period: period
      }));
    };
    return IntervalObservable;
  }(Observable_1.Observable);
  exports.IntervalObservable = IntervalObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/interval.js", ["npm:rxjs@5.0.0-beta.12/observable/IntervalObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var IntervalObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/IntervalObservable.js");
  exports.interval = IntervalObservable_1.IntervalObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/interval.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/interval.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var interval_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/interval.js');
  Observable_1.Observable.interval = interval_1.interval;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/merge.js", ["npm:rxjs@5.0.0-beta.12/operator/merge.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var merge_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/merge.js");
  exports.merge = merge_1.mergeStatic;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/merge.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/merge.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var merge_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/merge.js');
  Observable_1.Observable.merge = merge_1.merge;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/race.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/race.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var race_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/race.js');
  Observable_1.Observable.race = race_1.raceStatic;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/NeverObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/noop.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var noop_1 = $__require('npm:rxjs@5.0.0-beta.12/util/noop.js');
  var NeverObservable = function (_super) {
    __extends(NeverObservable, _super);
    function NeverObservable() {
      _super.call(this);
    }
    NeverObservable.create = function () {
      return new NeverObservable();
    };
    NeverObservable.prototype._subscribe = function (subscriber) {
      noop_1.noop();
    };
    return NeverObservable;
  }(Observable_1.Observable);
  exports.NeverObservable = NeverObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/never.js", ["npm:rxjs@5.0.0-beta.12/observable/NeverObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var NeverObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/NeverObservable.js");
  exports.never = NeverObservable_1.NeverObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/never.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/never.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var never_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/never.js');
  Observable_1.Observable.never = never_1.never;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/of.js", ["npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var ArrayObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js");
  exports.of = ArrayObservable_1.ArrayObservable.of;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/of.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/of.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var of_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/of.js');
  Observable_1.Observable.of = of_1.of;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/onErrorResumeNext.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/onErrorResumeNext.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var onErrorResumeNext_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/onErrorResumeNext.js');
  Observable_1.Observable.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNextStatic;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/PairsObservable.js", ["npm:rxjs@5.0.0-beta.12/Observable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require("npm:rxjs@5.0.0-beta.12/Observable.js");
  function dispatch(state) {
    var obj = state.obj,
        keys = state.keys,
        length = state.length,
        index = state.index,
        subscriber = state.subscriber;
    if (index === length) {
      subscriber.complete();
      return;
    }
    var key = keys[index];
    subscriber.next([key, obj[key]]);
    state.index = index + 1;
    this.schedule(state);
  }
  var PairsObservable = function (_super) {
    __extends(PairsObservable, _super);
    function PairsObservable(obj, scheduler) {
      _super.call(this);
      this.obj = obj;
      this.scheduler = scheduler;
      this.keys = Object.keys(obj);
    }
    PairsObservable.create = function (obj, scheduler) {
      return new PairsObservable(obj, scheduler);
    };
    PairsObservable.prototype._subscribe = function (subscriber) {
      var _a = this,
          keys = _a.keys,
          scheduler = _a.scheduler;
      var length = keys.length;
      if (scheduler) {
        return scheduler.schedule(dispatch, 0, {
          obj: this.obj,
          keys: keys,
          length: length,
          index: 0,
          subscriber: subscriber
        });
      } else {
        for (var idx = 0; idx < length; idx++) {
          var key = keys[idx];
          subscriber.next([key, this.obj[key]]);
        }
        subscriber.complete();
      }
    };
    return PairsObservable;
  }(Observable_1.Observable);
  exports.PairsObservable = PairsObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/pairs.js", ["npm:rxjs@5.0.0-beta.12/observable/PairsObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var PairsObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/PairsObservable.js");
  exports.pairs = PairsObservable_1.PairsObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/pairs.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/pairs.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var pairs_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/pairs.js');
  Observable_1.Observable.pairs = pairs_1.pairs;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/RangeObservable.js", ["npm:rxjs@5.0.0-beta.12/Observable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require("npm:rxjs@5.0.0-beta.12/Observable.js");
  var RangeObservable = function (_super) {
    __extends(RangeObservable, _super);
    function RangeObservable(start, count, scheduler) {
      _super.call(this);
      this.start = start;
      this._count = count;
      this.scheduler = scheduler;
    }
    RangeObservable.create = function (start, count, scheduler) {
      if (start === void 0) {
        start = 0;
      }
      if (count === void 0) {
        count = 0;
      }
      return new RangeObservable(start, count, scheduler);
    };
    RangeObservable.dispatch = function (state) {
      var start = state.start,
          index = state.index,
          count = state.count,
          subscriber = state.subscriber;
      if (index >= count) {
        subscriber.complete();
        return;
      }
      subscriber.next(start);
      if (subscriber.closed) {
        return;
      }
      state.index = index + 1;
      state.start = start + 1;
      this.schedule(state);
    };
    RangeObservable.prototype._subscribe = function (subscriber) {
      var index = 0;
      var start = this.start;
      var count = this._count;
      var scheduler = this.scheduler;
      if (scheduler) {
        return scheduler.schedule(RangeObservable.dispatch, 0, {
          index: index,
          count: count,
          start: start,
          subscriber: subscriber
        });
      } else {
        do {
          if (index++ >= count) {
            subscriber.complete();
            break;
          }
          subscriber.next(start++);
          if (subscriber.closed) {
            break;
          }
        } while (true);
      }
    };
    return RangeObservable;
  }(Observable_1.Observable);
  exports.RangeObservable = RangeObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/range.js", ["npm:rxjs@5.0.0-beta.12/observable/RangeObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var RangeObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/RangeObservable.js");
  exports.range = RangeObservable_1.RangeObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/range.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/range.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var range_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/range.js');
  Observable_1.Observable.range = range_1.range;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/UsingObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var UsingObservable = function (_super) {
    __extends(UsingObservable, _super);
    function UsingObservable(resourceFactory, observableFactory) {
      _super.call(this);
      this.resourceFactory = resourceFactory;
      this.observableFactory = observableFactory;
    }
    UsingObservable.create = function (resourceFactory, observableFactory) {
      return new UsingObservable(resourceFactory, observableFactory);
    };
    UsingObservable.prototype._subscribe = function (subscriber) {
      var _a = this,
          resourceFactory = _a.resourceFactory,
          observableFactory = _a.observableFactory;
      var resource;
      try {
        resource = resourceFactory();
        return new UsingSubscriber(subscriber, resource, observableFactory);
      } catch (err) {
        subscriber.error(err);
      }
    };
    return UsingObservable;
  }(Observable_1.Observable);
  exports.UsingObservable = UsingObservable;
  var UsingSubscriber = function (_super) {
    __extends(UsingSubscriber, _super);
    function UsingSubscriber(destination, resource, observableFactory) {
      _super.call(this, destination);
      this.resource = resource;
      this.observableFactory = observableFactory;
      destination.add(resource);
      this.tryUse();
    }
    UsingSubscriber.prototype.tryUse = function () {
      try {
        var source = this.observableFactory.call(this, this.resource);
        if (source) {
          this.add(subscribeToResult_1.subscribeToResult(this, source));
        }
      } catch (err) {
        this._error(err);
      }
    };
    return UsingSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/using.js", ["npm:rxjs@5.0.0-beta.12/observable/UsingObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var UsingObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/UsingObservable.js");
  exports.using = UsingObservable_1.UsingObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/using.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/using.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var using_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/using.js');
  Observable_1.Observable.using = using_1.using;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/ErrorObservable.js", ["npm:rxjs@5.0.0-beta.12/Observable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require("npm:rxjs@5.0.0-beta.12/Observable.js");
  var ErrorObservable = function (_super) {
    __extends(ErrorObservable, _super);
    function ErrorObservable(error, scheduler) {
      _super.call(this);
      this.error = error;
      this.scheduler = scheduler;
    }
    ErrorObservable.create = function (error, scheduler) {
      return new ErrorObservable(error, scheduler);
    };
    ErrorObservable.dispatch = function (arg) {
      var error = arg.error,
          subscriber = arg.subscriber;
      subscriber.error(error);
    };
    ErrorObservable.prototype._subscribe = function (subscriber) {
      var error = this.error;
      var scheduler = this.scheduler;
      if (scheduler) {
        return scheduler.schedule(ErrorObservable.dispatch, 0, {
          error: error,
          subscriber: subscriber
        });
      } else {
        subscriber.error(error);
      }
    };
    return ErrorObservable;
  }(Observable_1.Observable);
  exports.ErrorObservable = ErrorObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/throw.js", ["npm:rxjs@5.0.0-beta.12/observable/ErrorObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var ErrorObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/ErrorObservable.js");
  exports._throw = ErrorObservable_1.ErrorObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/throw.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/throw.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var throw_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/throw.js');
  Observable_1.Observable.throw = throw_1._throw;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/TimerObservable.js', ['npm:rxjs@5.0.0-beta.12/util/isNumeric.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/util/isScheduler.js', 'npm:rxjs@5.0.0-beta.12/util/isDate.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var isNumeric_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isNumeric.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
  var isDate_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isDate.js');
  var TimerObservable = function (_super) {
    __extends(TimerObservable, _super);
    function TimerObservable(dueTime, period, scheduler) {
      if (dueTime === void 0) {
        dueTime = 0;
      }
      _super.call(this);
      this.period = -1;
      this.dueTime = 0;
      if (isNumeric_1.isNumeric(period)) {
        this.period = Number(period) < 1 && 1 || Number(period);
      } else if (isScheduler_1.isScheduler(period)) {
        scheduler = period;
      }
      if (!isScheduler_1.isScheduler(scheduler)) {
        scheduler = async_1.async;
      }
      this.scheduler = scheduler;
      this.dueTime = isDate_1.isDate(dueTime) ? +dueTime - this.scheduler.now() : dueTime;
    }
    TimerObservable.create = function (initialDelay, period, scheduler) {
      if (initialDelay === void 0) {
        initialDelay = 0;
      }
      return new TimerObservable(initialDelay, period, scheduler);
    };
    TimerObservable.dispatch = function (state) {
      var index = state.index,
          period = state.period,
          subscriber = state.subscriber;
      var action = this;
      subscriber.next(index);
      if (subscriber.closed) {
        return;
      } else if (period === -1) {
        return subscriber.complete();
      }
      state.index = index + 1;
      action.schedule(state, period);
    };
    TimerObservable.prototype._subscribe = function (subscriber) {
      var index = 0;
      var _a = this,
          period = _a.period,
          dueTime = _a.dueTime,
          scheduler = _a.scheduler;
      return scheduler.schedule(TimerObservable.dispatch, dueTime, {
        index: index,
        period: period,
        subscriber: subscriber
      });
    };
    return TimerObservable;
  }(Observable_1.Observable);
  exports.TimerObservable = TimerObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/timer.js", ["npm:rxjs@5.0.0-beta.12/observable/TimerObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var TimerObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/TimerObservable.js");
  exports.timer = TimerObservable_1.TimerObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/timer.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/timer.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var timer_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/timer.js');
  Observable_1.Observable.timer = timer_1.timer;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/zip.js", ["npm:rxjs@5.0.0-beta.12/operator/zip.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var zip_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/zip.js");
  exports.zip = zip_1.zipStatic;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/zip.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/zip.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var zip_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/zip.js');
  Observable_1.Observable.zip = zip_1.zip;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/dom/ajax.js", ["npm:rxjs@5.0.0-beta.12/observable/dom/AjaxObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var AjaxObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/dom/AjaxObservable.js");
  exports.ajax = AjaxObservable_1.AjaxObservable.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/dom/ajax.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/dom/ajax.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var ajax_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/dom/ajax.js');
  Observable_1.Observable.ajax = ajax_1.ajax;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/assign.js', ['npm:rxjs@5.0.0-beta.12/util/root.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var Object = root_1.root.Object;
  if (typeof Object.assign != 'function') {
    (function () {
      Object.assign = function assignPolyfill(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          sources[_i - 1] = arguments[_i];
        }
        if (target === undefined || target === null) {
          throw new TypeError('cannot convert undefined or null to object');
        }
        var output = Object(target);
        var len = sources.length;
        for (var index = 0; index < len; index++) {
          var source = sources[index];
          if (source !== undefined && source !== null) {
            for (var key in source) {
              if (source.hasOwnProperty(key)) {
                output[key] = source[key];
              }
            }
          }
        }
        return output;
      };
    })();
  }
  exports.assign = Object.assign;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/dom/WebSocketSubject.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/ReplaySubject.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/util/assign.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var ReplaySubject_1 = $__require('npm:rxjs@5.0.0-beta.12/ReplaySubject.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var assign_1 = $__require('npm:rxjs@5.0.0-beta.12/util/assign.js');
  var WebSocketSubject = function (_super) {
    __extends(WebSocketSubject, _super);
    function WebSocketSubject(urlConfigOrSource, destination) {
      if (urlConfigOrSource instanceof Observable_1.Observable) {
        _super.call(this, destination, urlConfigOrSource);
      } else {
        _super.call(this);
        this.WebSocketCtor = root_1.root.WebSocket;
        this._output = new Subject_1.Subject();
        if (typeof urlConfigOrSource === 'string') {
          this.url = urlConfigOrSource;
        } else {
          assign_1.assign(this, urlConfigOrSource);
        }
        if (!this.WebSocketCtor) {
          throw new Error('no WebSocket constructor can be found');
        }
        this.destination = new ReplaySubject_1.ReplaySubject();
      }
    }
    WebSocketSubject.prototype.resultSelector = function (e) {
      return JSON.parse(e.data);
    };
    WebSocketSubject.create = function (urlConfigOrSource) {
      return new WebSocketSubject(urlConfigOrSource);
    };
    WebSocketSubject.prototype.lift = function (operator) {
      var sock = new WebSocketSubject(this, this.destination);
      sock.operator = operator;
      return sock;
    };
    WebSocketSubject.prototype.multiplex = function (subMsg, unsubMsg, messageFilter) {
      var self = this;
      return new Observable_1.Observable(function (observer) {
        var result = tryCatch_1.tryCatch(subMsg)();
        if (result === errorObject_1.errorObject) {
          observer.error(errorObject_1.errorObject.e);
        } else {
          self.next(result);
        }
        var subscription = self.subscribe(function (x) {
          var result = tryCatch_1.tryCatch(messageFilter)(x);
          if (result === errorObject_1.errorObject) {
            observer.error(errorObject_1.errorObject.e);
          } else if (result) {
            observer.next(x);
          }
        }, function (err) {
          return observer.error(err);
        }, function () {
          return observer.complete();
        });
        return function () {
          var result = tryCatch_1.tryCatch(unsubMsg)();
          if (result === errorObject_1.errorObject) {
            observer.error(errorObject_1.errorObject.e);
          } else {
            self.next(result);
          }
          subscription.unsubscribe();
        };
      });
    };
    WebSocketSubject.prototype._connectSocket = function () {
      var _this = this;
      var WebSocketCtor = this.WebSocketCtor;
      var observer = this._output;
      var socket = null;
      try {
        socket = this.protocol ? new WebSocketCtor(this.url, this.protocol) : new WebSocketCtor(this.url);
        this.socket = socket;
      } catch (e) {
        observer.error(e);
        return;
      }
      var subscription = new Subscription_1.Subscription(function () {
        _this.socket = null;
        if (socket && socket.readyState === 1) {
          socket.close();
        }
      });
      socket.onopen = function (e) {
        var openObserver = _this.openObserver;
        if (openObserver) {
          openObserver.next(e);
        }
        var queue = _this.destination;
        _this.destination = Subscriber_1.Subscriber.create(function (x) {
          return socket.readyState === 1 && socket.send(x);
        }, function (e) {
          var closingObserver = _this.closingObserver;
          if (closingObserver) {
            closingObserver.next(undefined);
          }
          if (e && e.code) {
            socket.close(e.code, e.reason);
          } else {
            observer.error(new TypeError('WebSocketSubject.error must be called with an object with an error code, ' + 'and an optional reason: { code: number, reason: string }'));
          }
          _this.destination = new ReplaySubject_1.ReplaySubject();
          _this.socket = null;
        }, function () {
          var closingObserver = _this.closingObserver;
          if (closingObserver) {
            closingObserver.next(undefined);
          }
          socket.close();
          _this.destination = new ReplaySubject_1.ReplaySubject();
          _this.socket = null;
        });
        if (queue && queue instanceof ReplaySubject_1.ReplaySubject) {
          subscription.add(queue.subscribe(_this.destination));
        }
      };
      socket.onerror = function (e) {
        return observer.error(e);
      };
      socket.onclose = function (e) {
        var closeObserver = _this.closeObserver;
        if (closeObserver) {
          closeObserver.next(e);
        }
        if (e.wasClean) {
          observer.complete();
        } else {
          observer.error(e);
        }
      };
      socket.onmessage = function (e) {
        var result = tryCatch_1.tryCatch(_this.resultSelector)(e);
        if (result === errorObject_1.errorObject) {
          observer.error(errorObject_1.errorObject.e);
        } else {
          observer.next(result);
        }
      };
    };
    WebSocketSubject.prototype._subscribe = function (subscriber) {
      var _this = this;
      var source = this.source;
      if (source) {
        return source.subscribe(subscriber);
      }
      if (!this.socket) {
        this._connectSocket();
      }
      var subscription = new Subscription_1.Subscription();
      subscription.add(this._output.subscribe(subscriber));
      subscription.add(function () {
        var socket = _this.socket;
        if (_this._output.observers.length === 0 && socket && socket.readyState === 1) {
          socket.close();
          _this.socket = null;
        }
      });
      return subscription;
    };
    WebSocketSubject.prototype.unsubscribe = function () {
      var _a = this,
          source = _a.source,
          socket = _a.socket;
      if (socket && socket.readyState === 1) {
        socket.close();
        this.socket = null;
      }
      _super.prototype.unsubscribe.call(this);
      if (!source) {
        this.destination = new ReplaySubject_1.ReplaySubject();
      }
    };
    return WebSocketSubject;
  }(Subject_1.AnonymousSubject);
  exports.WebSocketSubject = WebSocketSubject;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/dom/webSocket.js", ["npm:rxjs@5.0.0-beta.12/observable/dom/WebSocketSubject.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var WebSocketSubject_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/dom/WebSocketSubject.js");
  exports.webSocket = WebSocketSubject_1.WebSocketSubject.create;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/observable/dom/webSocket.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/dom/webSocket.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var webSocket_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/dom/webSocket.js');
  Observable_1.Observable.webSocket = webSocket_1.webSocket;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/buffer.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
    var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
    function buffer(closingNotifier) {
      return this.lift(new BufferOperator(closingNotifier));
    }
    exports.buffer = buffer;
    var BufferOperator = function () {
      function BufferOperator(closingNotifier) {
        this.closingNotifier = closingNotifier;
      }
      BufferOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
      };
      return BufferOperator;
    }();
    var BufferSubscriber = function (_super) {
      __extends(BufferSubscriber, _super);
      function BufferSubscriber(destination, closingNotifier) {
        _super.call(this, destination);
        this.buffer = [];
        this.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
      }
      BufferSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
      };
      BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
      };
      return BufferSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/buffer.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/buffer.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var buffer_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/buffer.js');
  Observable_1.Observable.prototype.buffer = buffer_1.buffer;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/bufferCount.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
    function bufferCount(bufferSize, startBufferEvery) {
      if (startBufferEvery === void 0) {
        startBufferEvery = null;
      }
      return this.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    }
    exports.bufferCount = bufferCount;
    var BufferCountOperator = function () {
      function BufferCountOperator(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
      }
      BufferCountOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new BufferCountSubscriber(subscriber, this.bufferSize, this.startBufferEvery));
      };
      return BufferCountOperator;
    }();
    var BufferCountSubscriber = function (_super) {
      __extends(BufferCountSubscriber, _super);
      function BufferCountSubscriber(destination, bufferSize, startBufferEvery) {
        _super.call(this, destination);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffers = [[]];
        this.count = 0;
      }
      BufferCountSubscriber.prototype._next = function (value) {
        var count = this.count += 1;
        var destination = this.destination;
        var bufferSize = this.bufferSize;
        var startBufferEvery = this.startBufferEvery == null ? bufferSize : this.startBufferEvery;
        var buffers = this.buffers;
        var len = buffers.length;
        var remove = -1;
        if (count % startBufferEvery === 0) {
          buffers.push([]);
        }
        for (var i = 0; i < len; i++) {
          var buffer = buffers[i];
          buffer.push(value);
          if (buffer.length === bufferSize) {
            remove = i;
            destination.next(buffer);
          }
        }
        if (remove !== -1) {
          buffers.splice(remove, 1);
        }
      };
      BufferCountSubscriber.prototype._complete = function () {
        var destination = this.destination;
        var buffers = this.buffers;
        while (buffers.length > 0) {
          var buffer = buffers.shift();
          if (buffer.length > 0) {
            destination.next(buffer);
          }
        }
        _super.prototype._complete.call(this);
      };
      return BufferCountSubscriber;
    }(Subscriber_1.Subscriber);
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/bufferCount.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/bufferCount.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var bufferCount_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/bufferCount.js');
  Observable_1.Observable.prototype.bufferCount = bufferCount_1.bufferCount;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/bufferTime.js', ['npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/isScheduler.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
    var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
    var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
    function bufferTime(bufferTimeSpan) {
      var length = arguments.length;
      var scheduler = async_1.async;
      if (isScheduler_1.isScheduler(arguments[arguments.length - 1])) {
        scheduler = arguments[arguments.length - 1];
        length--;
      }
      var bufferCreationInterval = null;
      if (length >= 2) {
        bufferCreationInterval = arguments[1];
      }
      var maxBufferSize = Number.POSITIVE_INFINITY;
      if (length >= 3) {
        maxBufferSize = arguments[2];
      }
      return this.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
    }
    exports.bufferTime = bufferTime;
    var BufferTimeOperator = function () {
      function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
      }
      BufferTimeOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
      };
      return BufferTimeOperator;
    }();
    var Context = function () {
      function Context() {
        this.buffer = [];
      }
      return Context;
    }();
    var BufferTimeSubscriber = function (_super) {
      __extends(BufferTimeSubscriber, _super);
      function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        _super.call(this, destination);
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
        this.contexts = [];
        var context = this.openContext();
        this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
        if (this.timespanOnly) {
          var timeSpanOnlyState = {
            subscriber: this,
            context: context,
            bufferTimeSpan: bufferTimeSpan
          };
          this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        } else {
          var closeState = {
            subscriber: this,
            context: context
          };
          var creationState = {
            bufferTimeSpan: bufferTimeSpan,
            bufferCreationInterval: bufferCreationInterval,
            subscriber: this,
            scheduler: scheduler
          };
          this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
          this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
      }
      BufferTimeSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        var filledBufferContext;
        for (var i = 0; i < len; i++) {
          var context = contexts[i];
          var buffer = context.buffer;
          buffer.push(value);
          if (buffer.length == this.maxBufferSize) {
            filledBufferContext = context;
          }
        }
        if (filledBufferContext) {
          this.onBufferFull(filledBufferContext);
        }
      };
      BufferTimeSubscriber.prototype._error = function (err) {
        this.contexts.length = 0;
        _super.prototype._error.call(this, err);
      };
      BufferTimeSubscriber.prototype._complete = function () {
        var _a = this,
            contexts = _a.contexts,
            destination = _a.destination;
        while (contexts.length > 0) {
          var context = contexts.shift();
          destination.next(context.buffer);
        }
        _super.prototype._complete.call(this);
      };
      BufferTimeSubscriber.prototype._unsubscribe = function () {
        this.contexts = null;
      };
      BufferTimeSubscriber.prototype.onBufferFull = function (context) {
        this.closeContext(context);
        var closeAction = context.closeAction;
        closeAction.unsubscribe();
        this.remove(closeAction);
        if (this.timespanOnly) {
          context = this.openContext();
          var bufferTimeSpan = this.bufferTimeSpan;
          var timeSpanOnlyState = {
            subscriber: this,
            context: context,
            bufferTimeSpan: bufferTimeSpan
          };
          this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
      };
      BufferTimeSubscriber.prototype.openContext = function () {
        var context = new Context();
        this.contexts.push(context);
        return context;
      };
      BufferTimeSubscriber.prototype.closeContext = function (context) {
        this.destination.next(context.buffer);
        var contexts = this.contexts;
        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
        if (spliceIndex >= 0) {
          contexts.splice(contexts.indexOf(context), 1);
        }
      };
      return BufferTimeSubscriber;
    }(Subscriber_1.Subscriber);
    function dispatchBufferTimeSpanOnly(state) {
      var subscriber = state.subscriber;
      var prevContext = state.context;
      if (prevContext) {
        subscriber.closeContext(prevContext);
      }
      if (!subscriber.closed) {
        state.context = subscriber.openContext();
        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
      }
    }
    function dispatchBufferCreation(state) {
      var bufferCreationInterval = state.bufferCreationInterval,
          bufferTimeSpan = state.bufferTimeSpan,
          subscriber = state.subscriber,
          scheduler = state.scheduler;
      var context = subscriber.openContext();
      var action = this;
      if (!subscriber.closed) {
        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, {
          subscriber: subscriber,
          context: context
        }));
        action.schedule(state, bufferCreationInterval);
      }
    }
    function dispatchBufferClose(arg) {
      var subscriber = arg.subscriber,
          context = arg.context;
      subscriber.closeContext(context);
    }
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/bufferTime.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/bufferTime.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var bufferTime_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/bufferTime.js');
  Observable_1.Observable.prototype.bufferTime = bufferTime_1.bufferTime;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/bufferToggle.js', ['npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
    var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
    var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
    function bufferToggle(openings, closingSelector) {
      return this.lift(new BufferToggleOperator(openings, closingSelector));
    }
    exports.bufferToggle = bufferToggle;
    var BufferToggleOperator = function () {
      function BufferToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
      }
      BufferToggleOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
      };
      return BufferToggleOperator;
    }();
    var BufferToggleSubscriber = function (_super) {
      __extends(BufferToggleSubscriber, _super);
      function BufferToggleSubscriber(destination, openings, closingSelector) {
        _super.call(this, destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(subscribeToResult_1.subscribeToResult(this, openings));
      }
      BufferToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        for (var i = 0; i < len; i++) {
          contexts[i].buffer.push(value);
        }
      };
      BufferToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        while (contexts.length > 0) {
          var context = contexts.shift();
          context.subscription.unsubscribe();
          context.buffer = null;
          context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._error.call(this, err);
      };
      BufferToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        while (contexts.length > 0) {
          var context = contexts.shift();
          this.destination.next(context.buffer);
          context.subscription.unsubscribe();
          context.buffer = null;
          context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._complete.call(this);
      };
      BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
      };
      BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
        this.closeBuffer(innerSub.context);
      };
      BufferToggleSubscriber.prototype.openBuffer = function (value) {
        try {
          var closingSelector = this.closingSelector;
          var closingNotifier = closingSelector.call(this, value);
          if (closingNotifier) {
            this.trySubscribe(closingNotifier);
          }
        } catch (err) {
          this._error(err);
        }
      };
      BufferToggleSubscriber.prototype.closeBuffer = function (context) {
        var contexts = this.contexts;
        if (contexts && context) {
          var buffer = context.buffer,
              subscription = context.subscription;
          this.destination.next(buffer);
          contexts.splice(contexts.indexOf(context), 1);
          this.remove(subscription);
          subscription.unsubscribe();
        }
      };
      BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
        var contexts = this.contexts;
        var buffer = [];
        var subscription = new Subscription_1.Subscription();
        var context = {
          buffer: buffer,
          subscription: subscription
        };
        contexts.push(context);
        var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
          this.closeBuffer(context);
        } else {
          innerSubscription.context = context;
          this.add(innerSubscription);
          subscription.add(innerSubscription);
        }
      };
      return BufferToggleSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/bufferToggle.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/bufferToggle.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var bufferToggle_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/bufferToggle.js');
  Observable_1.Observable.prototype.bufferToggle = bufferToggle_1.bufferToggle;
  return module.exports;
});
System.registerDynamic('npm:base64-js@0.0.8/lib/b64.js', [], true, function ($__require, exports, module) {
	var define,
	    global = this || self,
	    GLOBAL = global;
	/* */
	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);

		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			var L = 0;

			function push(v) {
				arr[L++] = v;
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 0xFF0000) >> 16);
				push((tmp & 0xFF00) >> 8);
				push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 0xFF);
				push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = "",
			    temp,
			    length;

			function encode(num) {
				return lookup.charAt(num);
			}

			function tripletToBase64(num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 0x3F);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 0x3F);
					output += encode(temp << 2 & 0x3F);
					output += '=';
					break;
			}

			return output;
		}

		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})(typeof exports === 'undefined' ? this.base64js = {} : exports);
	return module.exports;
});
System.registerDynamic("npm:base64-js@0.0.8.js", ["npm:base64-js@0.0.8/lib/b64.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:base64-js@0.0.8/lib/b64.js");
  return module.exports;
});
System.registerDynamic("npm:ieee754@1.1.8/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  exports.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];

    i += d;

    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };

  exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
  };
  return module.exports;
});
System.registerDynamic("npm:ieee754@1.1.8.js", ["npm:ieee754@1.1.8/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:ieee754@1.1.8/index.js");
  return module.exports;
});
System.registerDynamic('npm:isarray@1.0.0/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toString = {}.toString;

  module.exports = Array.isArray || function (arr) {
    return toString.call(arr) == '[object Array]';
  };
  return module.exports;
});
System.registerDynamic("npm:isarray@1.0.0.js", ["npm:isarray@1.0.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:isarray@1.0.0/index.js");
  return module.exports;
});
System.registerDynamic('npm:buffer@3.6.0/index.js', ['npm:base64-js@0.0.8.js', 'npm:ieee754@1.1.8.js', 'npm:isarray@1.0.0.js'], true, function ($__require, exports, module) {
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  /* eslint-disable no-proto */

  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var base64 = $__require('npm:base64-js@0.0.8.js');
  var ieee754 = $__require('npm:ieee754@1.1.8.js');
  var isArray = $__require('npm:isarray@1.0.0.js');

  exports.Buffer = Buffer;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  Buffer.poolSize = 8192; // not used by this implementation

  var rootParent = {};

  /**
   * If `Buffer.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Use Object implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * Due to various browser bugs, sometimes the Object implementation will be used even
   * when the browser supports typed arrays.
   *
   * Note:
   *
   *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
   *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
   *
   *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
   *     on objects.
   *
   *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
   *
   *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
   *     incorrect length in some situations.
  
   * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
   * get the Object implementation, which is slower but behaves correctly.
   */
  Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

  function typedArraySupport() {
    function Bar() {}
    try {
      var arr = new Uint8Array(1);
      arr.foo = function () {
        return 42;
      };
      arr.constructor = Bar;
      return arr.foo() === 42 && // typed array instances can be augmented
      arr.constructor === Bar && // constructor can be set
      typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
      arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
    } catch (e) {
      return false;
    }
  }

  function kMaxLength() {
    return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
  }

  /**
   * Class: Buffer
   * =============
   *
   * The Buffer constructor returns instances of `Uint8Array` that are augmented
   * with function properties for all the node `Buffer` API functions. We use
   * `Uint8Array` so that square bracket notation works as expected -- it returns
   * a single octet.
   *
   * By augmenting the instances, we can avoid modifying the `Uint8Array`
   * prototype.
   */
  function Buffer(arg) {
    if (!(this instanceof Buffer)) {
      // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
      if (arguments.length > 1) return new Buffer(arg, arguments[1]);
      return new Buffer(arg);
    }

    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      this.length = 0;
      this.parent = undefined;
    }

    // Common case.
    if (typeof arg === 'number') {
      return fromNumber(this, arg);
    }

    // Slightly less common case.
    if (typeof arg === 'string') {
      return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
    }

    // Unusual.
    return fromObject(this, arg);
  }

  function fromNumber(that, length) {
    that = allocate(that, length < 0 ? 0 : checked(length) | 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      for (var i = 0; i < length; i++) {
        that[i] = 0;
      }
    }
    return that;
  }

  function fromString(that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';

    // Assumption: byteLength() return value is always < kMaxLength.
    var length = byteLength(string, encoding) | 0;
    that = allocate(that, length);

    that.write(string, encoding);
    return that;
  }

  function fromObject(that, object) {
    if (Buffer.isBuffer(object)) return fromBuffer(that, object);

    if (isArray(object)) return fromArray(that, object);

    if (object == null) {
      throw new TypeError('must start with number, buffer, array or string');
    }

    if (typeof ArrayBuffer !== 'undefined') {
      if (object.buffer instanceof ArrayBuffer) {
        return fromTypedArray(that, object);
      }
      if (object instanceof ArrayBuffer) {
        return fromArrayBuffer(that, object);
      }
    }

    if (object.length) return fromArrayLike(that, object);

    return fromJsonObject(that, object);
  }

  function fromBuffer(that, buffer) {
    var length = checked(buffer.length) | 0;
    that = allocate(that, length);
    buffer.copy(that, 0, 0, length);
    return that;
  }

  function fromArray(that, array) {
    var length = checked(array.length) | 0;
    that = allocate(that, length);
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  // Duplicate of fromArray() to keep fromArray() monomorphic.
  function fromTypedArray(that, array) {
    var length = checked(array.length) | 0;
    that = allocate(that, length);
    // Truncating the elements is probably not what people expect from typed
    // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
    // of the old Buffer constructor.
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  function fromArrayBuffer(that, array) {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      array.byteLength;
      that = Buffer._augment(new Uint8Array(array));
    } else {
      // Fallback: Return an object instance of the Buffer class
      that = fromTypedArray(that, new Uint8Array(array));
    }
    return that;
  }

  function fromArrayLike(that, array) {
    var length = checked(array.length) | 0;
    that = allocate(that, length);
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  // Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
  // Returns a zero-length buffer for inputs that don't conform to the spec.
  function fromJsonObject(that, object) {
    var array;
    var length = 0;

    if (object.type === 'Buffer' && isArray(object.data)) {
      array = object.data;
      length = checked(array.length) | 0;
    }
    that = allocate(that, length);

    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype;
    Buffer.__proto__ = Uint8Array;
  } else {
    // pre-set for values that may exist in the future
    Buffer.prototype.length = undefined;
    Buffer.prototype.parent = undefined;
  }

  function allocate(that, length) {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = Buffer._augment(new Uint8Array(length));
      that.__proto__ = Buffer.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      that.length = length;
      that._isBuffer = true;
    }

    var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
    if (fromPool) that.parent = rootParent;

    return that;
  }

  function checked(length) {
    // Note: cannot use `length < kMaxLength` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength()) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
    }
    return length | 0;
  }

  function SlowBuffer(subject, encoding) {
    if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);

    var buf = new Buffer(subject, encoding);
    delete buf.parent;
    return buf;
  }

  Buffer.isBuffer = function isBuffer(b) {
    return !!(b != null && b._isBuffer);
  };

  Buffer.compare = function compare(a, b) {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError('Arguments must be Buffers');
    }

    if (a === b) return 0;

    var x = a.length;
    var y = b.length;

    var i = 0;
    var len = Math.min(x, y);
    while (i < len) {
      if (a[i] !== b[i]) break;

      ++i;
    }

    if (i !== len) {
      x = a[i];
      y = b[i];
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };

  Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'binary':
      case 'base64':
      case 'raw':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true;
      default:
        return false;
    }
  };

  Buffer.concat = function concat(list, length) {
    if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');

    if (list.length === 0) {
      return new Buffer(0);
    }

    var i;
    if (length === undefined) {
      length = 0;
      for (i = 0; i < list.length; i++) {
        length += list[i].length;
      }
    }

    var buf = new Buffer(length);
    var pos = 0;
    for (i = 0; i < list.length; i++) {
      var item = list[i];
      item.copy(buf, pos);
      pos += item.length;
    }
    return buf;
  };

  function byteLength(string, encoding) {
    if (typeof string !== 'string') string = '' + string;

    var len = string.length;
    if (len === 0) return 0;

    // Use a for loop to avoid recursion
    var loweredCase = false;
    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'binary':
        // Deprecated
        case 'raw':
        case 'raws':
          return len;
        case 'utf8':
        case 'utf-8':
          return utf8ToBytes(string).length;
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2;
        case 'hex':
          return len >>> 1;
        case 'base64':
          return base64ToBytes(string).length;
        default:
          if (loweredCase) return utf8ToBytes(string).length; // assume utf8
          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer.byteLength = byteLength;

  function slowToString(encoding, start, end) {
    var loweredCase = false;

    start = start | 0;
    end = end === undefined || end === Infinity ? this.length : end | 0;

    if (!encoding) encoding = 'utf8';
    if (start < 0) start = 0;
    if (end > this.length) end = this.length;
    if (end <= start) return '';

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end);

        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end);

        case 'ascii':
          return asciiSlice(this, start, end);

        case 'binary':
          return binarySlice(this, start, end);

        case 'base64':
          return base64Slice(this, start, end);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end);

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
          encoding = (encoding + '').toLowerCase();
          loweredCase = true;
      }
    }
  }

  Buffer.prototype.toString = function toString() {
    var length = this.length | 0;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };

  Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
  };

  Buffer.prototype.inspect = function inspect() {
    var str = '';
    var max = exports.INSPECT_MAX_BYTES;
    if (this.length > 0) {
      str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
      if (this.length > max) str += ' ... ';
    }
    return '<Buffer ' + str + '>';
  };

  Buffer.prototype.compare = function compare(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return 0;
    return Buffer.compare(this, b);
  };

  Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
    if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;else if (byteOffset < -0x80000000) byteOffset = -0x80000000;
    byteOffset >>= 0;

    if (this.length === 0) return -1;
    if (byteOffset >= this.length) return -1;

    // Negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);

    if (typeof val === 'string') {
      if (val.length === 0) return -1; // special case: looking for empty string always fails
      return String.prototype.indexOf.call(this, val, byteOffset);
    }
    if (Buffer.isBuffer(val)) {
      return arrayIndexOf(this, val, byteOffset);
    }
    if (typeof val === 'number') {
      if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
        return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
      }
      return arrayIndexOf(this, [val], byteOffset);
    }

    function arrayIndexOf(arr, val, byteOffset) {
      var foundIndex = -1;
      for (var i = 0; byteOffset + i < arr.length; i++) {
        if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
        } else {
          foundIndex = -1;
        }
      }
      return -1;
    }

    throw new TypeError('val must be string, number or Buffer');
  };

  // `get` is deprecated
  Buffer.prototype.get = function get(offset) {
    console.log('.get() is deprecated. Access using array indexes instead.');
    return this.readUInt8(offset);
  };

  // `set` is deprecated
  Buffer.prototype.set = function set(v, offset) {
    console.log('.set() is deprecated. Access using array indexes instead.');
    return this.writeUInt8(v, offset);
  };

  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }

    // must be an even number of digits
    var strLen = string.length;
    if (strLen % 2 !== 0) throw new Error('Invalid hex string');

    if (length > strLen / 2) {
      length = strLen / 2;
    }
    for (var i = 0; i < length; i++) {
      var parsed = parseInt(string.substr(i * 2, 2), 16);
      if (isNaN(parsed)) throw new Error('Invalid hex string');
      buf[offset + i] = parsed;
    }
    return i;
  }

  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
  }

  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }

  function binaryWrite(buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length);
  }

  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }

  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }

  Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8';
      length = this.length;
      offset = 0;
      // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset;
      length = this.length;
      offset = 0;
      // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset | 0;
      if (isFinite(length)) {
        length = length | 0;
        if (encoding === undefined) encoding = 'utf8';
      } else {
        encoding = length;
        length = undefined;
      }
      // legacy write(string, encoding, offset, length) - remove in v0.13
    } else {
      var swap = encoding;
      encoding = offset;
      offset = length | 0;
      length = swap;
    }

    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError('attempt to write outside buffer bounds');
    }

    if (!encoding) encoding = 'utf8';

    var loweredCase = false;
    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length);

        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length);

        case 'ascii':
          return asciiWrite(this, string, offset, length);

        case 'binary':
          return binaryWrite(this, string, offset, length);

        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length);

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };

  Buffer.prototype.toJSON = function toJSON() {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };

  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }

  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];

    var i = start;
    while (i < end) {
      var firstByte = buf[i];
      var codePoint = null;
      var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;

        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
              if (tempCodePoint > 0x7F) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint;
              }
            }
        }
      }

      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xFFFD;
        bytesPerSequence = 1;
      } else if (codePoint > 0xFFFF) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000;
        res.push(codePoint >>> 10 & 0x3FF | 0xD800);
        codePoint = 0xDC00 | codePoint & 0x3FF;
      }

      res.push(codePoint);
      i += bytesPerSequence;
    }

    return decodeCodePointsArray(res);
  }

  // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety
  var MAX_ARGUMENTS_LENGTH = 0x1000;

  function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
    }

    // Decode in chunks to avoid "call stack size exceeded".
    var res = '';
    var i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
  }

  function asciiSlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; i++) {
      ret += String.fromCharCode(buf[i] & 0x7F);
    }
    return ret;
  }

  function binarySlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; i++) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }

  function hexSlice(buf, start, end) {
    var len = buf.length;

    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;

    var out = '';
    for (var i = start; i < end; i++) {
      out += toHex(buf[i]);
    }
    return out;
  }

  function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = '';
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }

  Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;

    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }

    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }

    if (end < start) end = start;

    var newBuf;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      newBuf = Buffer._augment(this.subarray(start, end));
    } else {
      var sliceLen = end - start;
      newBuf = new Buffer(sliceLen, undefined);
      for (var i = 0; i < sliceLen; i++) {
        newBuf[i] = this[i + start];
      }
    }

    if (newBuf.length) newBuf.parent = this.parent || this;

    return newBuf;
  };

  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
  }

  Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    return val;
  };

  Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) {
      checkOffset(offset, byteLength, this.length);
    }

    var val = this[offset + --byteLength];
    var mul = 1;
    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul;
    }

    return val;
  };

  Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
  };

  Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };

  Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };

  Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
  };

  Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };

  Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val;
  };

  Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];
    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val;
  };

  Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
  };

  Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
  };

  Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
  };

  Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };

  Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };

  Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
  };

  Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
  };

  Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
  };

  Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
  };

  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('value is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('index out of range');
  }

  Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

    var mul = 1;
    var i = 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    this[offset] = value & 0xff;
    return offset + 1;
  };

  function objectWriteUInt16(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffff + value + 1;
    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
      buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
    }
  }

  Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2;
  };

  Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
    } else {
      objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2;
  };

  function objectWriteUInt32(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffffffff + value + 1;
    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
      buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
    }
  }

  Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 0xff;
    } else {
      objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4;
  };

  Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
    } else {
      objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4;
  };

  Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);

      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = 0;
    var mul = 1;
    var sub = value < 0 ? 1 : 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);

      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = byteLength - 1;
    var mul = 1;
    var sub = value < 0 ? 1 : 0;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
  };

  Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2;
  };

  Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
    } else {
      objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2;
  };

  Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
    } else {
      objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4;
  };

  Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (value < 0) value = 0xffffffff + value + 1;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
    } else {
      objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4;
  };

  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (value > max || value < min) throw new RangeError('value is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('index out of range');
    if (offset < 0) throw new RangeError('index out of range');
  }

  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }

  Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };

  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }

  Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };

  // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
  Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;

    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;

    // Fatal error conditions
    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds');
    }
    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');

    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }

    var len = end - start;
    var i;

    if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (i = len - 1; i >= 0; i--) {
        target[i + targetStart] = this[i + start];
      }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; i++) {
        target[i + targetStart] = this[i + start];
      }
    } else {
      target._set(this.subarray(start, start + len), targetStart);
    }

    return len;
  };

  // fill(value, start=0, end=buffer.length)
  Buffer.prototype.fill = function fill(value, start, end) {
    if (!value) value = 0;
    if (!start) start = 0;
    if (!end) end = this.length;

    if (end < start) throw new RangeError('end < start');

    // Fill 0 bytes; we're done
    if (end === start) return;
    if (this.length === 0) return;

    if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
    if (end < 0 || end > this.length) throw new RangeError('end out of bounds');

    var i;
    if (typeof value === 'number') {
      for (i = start; i < end; i++) {
        this[i] = value;
      }
    } else {
      var bytes = utf8ToBytes(value.toString());
      var len = bytes.length;
      for (i = start; i < end; i++) {
        this[i] = bytes[i % len];
      }
    }

    return this;
  };

  /**
   * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
   * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
   */
  Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
    if (typeof Uint8Array !== 'undefined') {
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        return new Buffer(this).buffer;
      } else {
        var buf = new Uint8Array(this.length);
        for (var i = 0, len = buf.length; i < len; i += 1) {
          buf[i] = this[i];
        }
        return buf.buffer;
      }
    } else {
      throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
    }
  };

  // HELPER FUNCTIONS
  // ================

  var BP = Buffer.prototype;

  /**
   * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
   */
  Buffer._augment = function _augment(arr) {
    arr.constructor = Buffer;
    arr._isBuffer = true;

    // save reference to original Uint8Array set method before overwriting
    arr._set = arr.set;

    // deprecated
    arr.get = BP.get;
    arr.set = BP.set;

    arr.write = BP.write;
    arr.toString = BP.toString;
    arr.toLocaleString = BP.toString;
    arr.toJSON = BP.toJSON;
    arr.equals = BP.equals;
    arr.compare = BP.compare;
    arr.indexOf = BP.indexOf;
    arr.copy = BP.copy;
    arr.slice = BP.slice;
    arr.readUIntLE = BP.readUIntLE;
    arr.readUIntBE = BP.readUIntBE;
    arr.readUInt8 = BP.readUInt8;
    arr.readUInt16LE = BP.readUInt16LE;
    arr.readUInt16BE = BP.readUInt16BE;
    arr.readUInt32LE = BP.readUInt32LE;
    arr.readUInt32BE = BP.readUInt32BE;
    arr.readIntLE = BP.readIntLE;
    arr.readIntBE = BP.readIntBE;
    arr.readInt8 = BP.readInt8;
    arr.readInt16LE = BP.readInt16LE;
    arr.readInt16BE = BP.readInt16BE;
    arr.readInt32LE = BP.readInt32LE;
    arr.readInt32BE = BP.readInt32BE;
    arr.readFloatLE = BP.readFloatLE;
    arr.readFloatBE = BP.readFloatBE;
    arr.readDoubleLE = BP.readDoubleLE;
    arr.readDoubleBE = BP.readDoubleBE;
    arr.writeUInt8 = BP.writeUInt8;
    arr.writeUIntLE = BP.writeUIntLE;
    arr.writeUIntBE = BP.writeUIntBE;
    arr.writeUInt16LE = BP.writeUInt16LE;
    arr.writeUInt16BE = BP.writeUInt16BE;
    arr.writeUInt32LE = BP.writeUInt32LE;
    arr.writeUInt32BE = BP.writeUInt32BE;
    arr.writeIntLE = BP.writeIntLE;
    arr.writeIntBE = BP.writeIntBE;
    arr.writeInt8 = BP.writeInt8;
    arr.writeInt16LE = BP.writeInt16LE;
    arr.writeInt16BE = BP.writeInt16BE;
    arr.writeInt32LE = BP.writeInt32LE;
    arr.writeInt32BE = BP.writeInt32BE;
    arr.writeFloatLE = BP.writeFloatLE;
    arr.writeFloatBE = BP.writeFloatBE;
    arr.writeDoubleLE = BP.writeDoubleLE;
    arr.writeDoubleBE = BP.writeDoubleBE;
    arr.fill = BP.fill;
    arr.inspect = BP.inspect;
    arr.toArrayBuffer = BP.toArrayBuffer;

    return arr;
  };

  var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

  function base64clean(str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, '');
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return '';
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '=';
    }
    return str;
  }

  function stringtrim(str) {
    if (str.trim) return str.trim();
    return str.replace(/^\s+|\s+$/g, '');
  }

  function toHex(n) {
    if (n < 16) return '0' + n.toString(16);
    return n.toString(16);
  }

  function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];

    for (var i = 0; i < length; i++) {
      codePoint = string.charCodeAt(i);

      // is surrogate component
      if (codePoint > 0xD7FF && codePoint < 0xE000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xDBFF) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue;
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue;
          }

          // valid lead
          leadSurrogate = codePoint;

          continue;
        }

        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          leadSurrogate = codePoint;
          continue;
        }

        // valid surrogate pair
        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
      } else if (leadSurrogate) {
        // valid bmp char, but last char was a lead
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
      }

      leadSurrogate = null;

      // encode utf8
      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break;
        bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break;
        bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break;
        bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
      } else {
        throw new Error('Invalid code point');
      }
    }

    return bytes;
  }

  function asciiToBytes(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; i++) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF);
    }
    return byteArray;
  }

  function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for (var i = 0; i < str.length; i++) {
      if ((units -= 2) < 0) break;

      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }

    return byteArray;
  }

  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }

  function blitBuffer(src, dst, offset, length) {
    for (var i = 0; i < length; i++) {
      if (i + offset >= dst.length || i >= src.length) break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  return module.exports;
});
System.registerDynamic("npm:buffer@3.6.0.js", ["npm:buffer@3.6.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:buffer@3.6.0/index.js");
  return module.exports;
});
System.registerDynamic('github:jspm/nodelibs-buffer@0.1.0/index.js', ['npm:buffer@3.6.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = System._nodeRequire ? System._nodeRequire('buffer') : $__require('npm:buffer@3.6.0.js');
  return module.exports;
});
System.registerDynamic("github:jspm/nodelibs-buffer@0.1.0.js", ["github:jspm/nodelibs-buffer@0.1.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("github:jspm/nodelibs-buffer@0.1.0/index.js");
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/bufferWhen.js', ['npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'github:jspm/nodelibs-buffer@0.1.0.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer, process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
    var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
    var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
    var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
    var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
    function bufferWhen(closingSelector) {
      return this.lift(new BufferWhenOperator(closingSelector));
    }
    exports.bufferWhen = bufferWhen;
    var BufferWhenOperator = function () {
      function BufferWhenOperator(closingSelector) {
        this.closingSelector = closingSelector;
      }
      BufferWhenOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
      };
      return BufferWhenOperator;
    }();
    var BufferWhenSubscriber = function (_super) {
      __extends(BufferWhenSubscriber, _super);
      function BufferWhenSubscriber(destination, closingSelector) {
        _super.call(this, destination);
        this.closingSelector = closingSelector;
        this.subscribing = false;
        this.openBuffer();
      }
      BufferWhenSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
      };
      BufferWhenSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer) {
          this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
      };
      BufferWhenSubscriber.prototype._unsubscribe = function () {
        this.buffer = null;
        this.subscribing = false;
      };
      BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
      };
      BufferWhenSubscriber.prototype.notifyComplete = function () {
        if (this.subscribing) {
          this.complete();
        } else {
          this.openBuffer();
        }
      };
      BufferWhenSubscriber.prototype.openBuffer = function () {
        var closingSubscription = this.closingSubscription;
        if (closingSubscription) {
          this.remove(closingSubscription);
          closingSubscription.unsubscribe();
        }
        var buffer = this.buffer;
        if (this.buffer) {
          this.destination.next(buffer);
        }
        this.buffer = [];
        var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject_1.errorObject) {
          this.error(errorObject_1.errorObject.e);
        } else {
          closingSubscription = new Subscription_1.Subscription();
          this.closingSubscription = closingSubscription;
          this.add(closingSubscription);
          this.subscribing = true;
          closingSubscription.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
          this.subscribing = false;
        }
      };
      return BufferWhenSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer, $__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/bufferWhen.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/bufferWhen.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var bufferWhen_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/bufferWhen.js');
  Observable_1.Observable.prototype.bufferWhen = bufferWhen_1.bufferWhen;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/cache.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/ReplaySubject.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var ReplaySubject_1 = $__require('npm:rxjs@5.0.0-beta.12/ReplaySubject.js');
  function cache(bufferSize, windowTime, scheduler) {
    if (bufferSize === void 0) {
      bufferSize = Number.POSITIVE_INFINITY;
    }
    if (windowTime === void 0) {
      windowTime = Number.POSITIVE_INFINITY;
    }
    var subject;
    var source = this;
    var refs = 0;
    var outerSub;
    var getSubject = function () {
      subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
      return subject;
    };
    return new Observable_1.Observable(function (observer) {
      if (!subject) {
        subject = getSubject();
        outerSub = source.subscribe(function (value) {
          return subject.next(value);
        }, function (err) {
          var s = subject;
          subject = null;
          s.error(err);
        }, function () {
          return subject.complete();
        });
      }
      refs++;
      if (!subject) {
        subject = getSubject();
      }
      var innerSub = subject.subscribe(observer);
      return function () {
        refs--;
        if (innerSub) {
          innerSub.unsubscribe();
        }
        if (refs === 0) {
          outerSub.unsubscribe();
        }
      };
    });
  }
  exports.cache = cache;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/cache.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/cache.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var cache_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/cache.js');
  Observable_1.Observable.prototype.cache = cache_1.cache;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/catch.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function _catch(selector) {
    var operator = new CatchOperator(selector);
    var caught = this.lift(operator);
    return operator.caught = caught;
  }
  exports._catch = _catch;
  var CatchOperator = function () {
    function CatchOperator(selector) {
      this.selector = selector;
    }
    CatchOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
    };
    return CatchOperator;
  }();
  var CatchSubscriber = function (_super) {
    __extends(CatchSubscriber, _super);
    function CatchSubscriber(destination, selector, caught) {
      _super.call(this, destination);
      this.selector = selector;
      this.caught = caught;
    }
    CatchSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var result = void 0;
        try {
          result = this.selector(err, this.caught);
        } catch (err) {
          this.destination.error(err);
          return;
        }
        this.unsubscribe();
        this.destination.remove(this);
        subscribeToResult_1.subscribeToResult(this, result);
      }
    };
    return CatchSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/catch.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/catch.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var catch_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/catch.js');
  Observable_1.Observable.prototype.catch = catch_1._catch;
  Observable_1.Observable.prototype._catch = catch_1._catch;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/combineAll.js", ["npm:rxjs@5.0.0-beta.12/operator/combineLatest.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var combineLatest_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/combineLatest.js");
  function combineAll(project) {
    return this.lift(new combineLatest_1.CombineLatestOperator(project));
  }
  exports.combineAll = combineAll;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/combineAll.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/combineAll.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var combineAll_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/combineAll.js');
  Observable_1.Observable.prototype.combineAll = combineAll_1.combineAll;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/combineLatest.js', ['npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var none = {};
  function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    var project = null;
    if (typeof observables[observables.length - 1] === 'function') {
      project = observables.pop();
    }
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
      observables = observables[0];
    }
    observables.unshift(this);
    return new ArrayObservable_1.ArrayObservable(observables).lift(new CombineLatestOperator(project));
  }
  exports.combineLatest = combineLatest;
  var CombineLatestOperator = function () {
    function CombineLatestOperator(project) {
      this.project = project;
    }
    CombineLatestOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new CombineLatestSubscriber(subscriber, this.project));
    };
    return CombineLatestOperator;
  }();
  exports.CombineLatestOperator = CombineLatestOperator;
  var CombineLatestSubscriber = function (_super) {
    __extends(CombineLatestSubscriber, _super);
    function CombineLatestSubscriber(destination, project) {
      _super.call(this, destination);
      this.project = project;
      this.active = 0;
      this.values = [];
      this.observables = [];
    }
    CombineLatestSubscriber.prototype._next = function (observable) {
      this.values.push(none);
      this.observables.push(observable);
    };
    CombineLatestSubscriber.prototype._complete = function () {
      var observables = this.observables;
      var len = observables.length;
      if (len === 0) {
        this.destination.complete();
      } else {
        this.active = len;
        this.toRespond = len;
        for (var i = 0; i < len; i++) {
          var observable = observables[i];
          this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
        }
      }
    };
    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
      if ((this.active -= 1) === 0) {
        this.destination.complete();
      }
    };
    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      var values = this.values;
      var oldVal = values[outerIndex];
      var toRespond = !this.toRespond ? 0 : oldVal === none ? --this.toRespond : this.toRespond;
      values[outerIndex] = innerValue;
      if (toRespond === 0) {
        if (this.project) {
          this._tryProject(values);
        } else {
          this.destination.next(values.slice());
        }
      }
    };
    CombineLatestSubscriber.prototype._tryProject = function (values) {
      var result;
      try {
        result = this.project.apply(this, values);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.destination.next(result);
    };
    return CombineLatestSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.CombineLatestSubscriber = CombineLatestSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/combineLatest.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/combineLatest.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var combineLatest_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/combineLatest.js');
  Observable_1.Observable.prototype.combineLatest = combineLatest_1.combineLatest;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/concat.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/concat.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var concat_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/concat.js');
  Observable_1.Observable.prototype.concat = concat_1.concat;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/concatAll.js", ["npm:rxjs@5.0.0-beta.12/operator/mergeAll.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var mergeAll_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/mergeAll.js");
  function concatAll() {
    return this.lift(new mergeAll_1.MergeAllOperator(1));
  }
  exports.concatAll = concatAll;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/concatAll.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/concatAll.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var concatAll_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/concatAll.js');
  Observable_1.Observable.prototype.concatAll = concatAll_1.concatAll;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/concatMap.js", ["npm:rxjs@5.0.0-beta.12/operator/mergeMap.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var mergeMap_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/mergeMap.js");
  function concatMap(project, resultSelector) {
    return this.lift(new mergeMap_1.MergeMapOperator(project, resultSelector, 1));
  }
  exports.concatMap = concatMap;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/concatMap.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/concatMap.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var concatMap_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/concatMap.js');
  Observable_1.Observable.prototype.concatMap = concatMap_1.concatMap;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/concatMapTo.js", ["npm:rxjs@5.0.0-beta.12/operator/mergeMapTo.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var mergeMapTo_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/mergeMapTo.js");
  function concatMapTo(innerObservable, resultSelector) {
    return this.lift(new mergeMapTo_1.MergeMapToOperator(innerObservable, resultSelector, 1));
  }
  exports.concatMapTo = concatMapTo;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/concatMapTo.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/concatMapTo.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var concatMapTo_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/concatMapTo.js');
  Observable_1.Observable.prototype.concatMapTo = concatMapTo_1.concatMapTo;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/count.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function count(predicate) {
    return this.lift(new CountOperator(predicate, this));
  }
  exports.count = count;
  var CountOperator = function () {
    function CountOperator(predicate, source) {
      this.predicate = predicate;
      this.source = source;
    }
    CountOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    };
    return CountOperator;
  }();
  var CountSubscriber = function (_super) {
    __extends(CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.source = source;
      this.count = 0;
      this.index = 0;
    }
    CountSubscriber.prototype._next = function (value) {
      if (this.predicate) {
        this._tryPredicate(value);
      } else {
        this.count++;
      }
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
      var result;
      try {
        result = this.predicate(value, this.index++, this.source);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      if (result) {
        this.count++;
      }
    };
    CountSubscriber.prototype._complete = function () {
      this.destination.next(this.count);
      this.destination.complete();
    };
    return CountSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/count.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/count.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var count_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/count.js');
  Observable_1.Observable.prototype.count = count_1.count;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/dematerialize.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function dematerialize() {
    return this.lift(new DeMaterializeOperator());
  }
  exports.dematerialize = dematerialize;
  var DeMaterializeOperator = function () {
    function DeMaterializeOperator() {}
    DeMaterializeOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DeMaterializeSubscriber(subscriber));
    };
    return DeMaterializeOperator;
  }();
  var DeMaterializeSubscriber = function (_super) {
    __extends(DeMaterializeSubscriber, _super);
    function DeMaterializeSubscriber(destination) {
      _super.call(this, destination);
    }
    DeMaterializeSubscriber.prototype._next = function (value) {
      value.observe(this.destination);
    };
    return DeMaterializeSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/dematerialize.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/dematerialize.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var dematerialize_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/dematerialize.js');
  Observable_1.Observable.prototype.dematerialize = dematerialize_1.dematerialize;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/debounce.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function debounce(durationSelector) {
    return this.lift(new DebounceOperator(durationSelector));
  }
  exports.debounce = debounce;
  var DebounceOperator = function () {
    function DebounceOperator(durationSelector) {
      this.durationSelector = durationSelector;
    }
    DebounceOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
    };
    return DebounceOperator;
  }();
  var DebounceSubscriber = function (_super) {
    __extends(DebounceSubscriber, _super);
    function DebounceSubscriber(destination, durationSelector) {
      _super.call(this, destination);
      this.durationSelector = durationSelector;
      this.hasValue = false;
      this.durationSubscription = null;
    }
    DebounceSubscriber.prototype._next = function (value) {
      try {
        var result = this.durationSelector.call(this, value);
        if (result) {
          this._tryNext(value, result);
        }
      } catch (err) {
        this.destination.error(err);
      }
    };
    DebounceSubscriber.prototype._complete = function () {
      this.emitValue();
      this.destination.complete();
    };
    DebounceSubscriber.prototype._tryNext = function (value, duration) {
      var subscription = this.durationSubscription;
      this.value = value;
      this.hasValue = true;
      if (subscription) {
        subscription.unsubscribe();
        this.remove(subscription);
      }
      subscription = subscribeToResult_1.subscribeToResult(this, duration);
      if (!subscription.closed) {
        this.add(this.durationSubscription = subscription);
      }
    };
    DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.emitValue();
    };
    DebounceSubscriber.prototype.notifyComplete = function () {
      this.emitValue();
    };
    DebounceSubscriber.prototype.emitValue = function () {
      if (this.hasValue) {
        var value = this.value;
        var subscription = this.durationSubscription;
        if (subscription) {
          this.durationSubscription = null;
          subscription.unsubscribe();
          this.remove(subscription);
        }
        this.value = null;
        this.hasValue = false;
        _super.prototype._next.call(this, value);
      }
    };
    return DebounceSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/debounce.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/debounce.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var debounce_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/debounce.js');
  Observable_1.Observable.prototype.debounce = debounce_1.debounce;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/debounceTime.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    return this.lift(new DebounceTimeOperator(dueTime, scheduler));
  }
  exports.debounceTime = debounceTime;
  var DebounceTimeOperator = function () {
    function DebounceTimeOperator(dueTime, scheduler) {
      this.dueTime = dueTime;
      this.scheduler = scheduler;
    }
    DebounceTimeOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
    };
    return DebounceTimeOperator;
  }();
  var DebounceTimeSubscriber = function (_super) {
    __extends(DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
      _super.call(this, destination);
      this.dueTime = dueTime;
      this.scheduler = scheduler;
      this.debouncedSubscription = null;
      this.lastValue = null;
      this.hasValue = false;
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
      this.clearDebounce();
      this.lastValue = value;
      this.hasValue = true;
      this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    };
    DebounceTimeSubscriber.prototype._complete = function () {
      this.debouncedNext();
      this.destination.complete();
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
      this.clearDebounce();
      if (this.hasValue) {
        this.destination.next(this.lastValue);
        this.lastValue = null;
        this.hasValue = false;
      }
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
      var debouncedSubscription = this.debouncedSubscription;
      if (debouncedSubscription !== null) {
        this.remove(debouncedSubscription);
        debouncedSubscription.unsubscribe();
        this.debouncedSubscription = null;
      }
    };
    return DebounceTimeSubscriber;
  }(Subscriber_1.Subscriber);
  function dispatchNext(subscriber) {
    subscriber.debouncedNext();
  }
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/debounceTime.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/debounceTime.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var debounceTime_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/debounceTime.js');
  Observable_1.Observable.prototype.debounceTime = debounceTime_1.debounceTime;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/defaultIfEmpty.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function defaultIfEmpty(defaultValue) {
    if (defaultValue === void 0) {
      defaultValue = null;
    }
    return this.lift(new DefaultIfEmptyOperator(defaultValue));
  }
  exports.defaultIfEmpty = defaultIfEmpty;
  var DefaultIfEmptyOperator = function () {
    function DefaultIfEmptyOperator(defaultValue) {
      this.defaultValue = defaultValue;
    }
    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
    };
    return DefaultIfEmptyOperator;
  }();
  var DefaultIfEmptySubscriber = function (_super) {
    __extends(DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
      _super.call(this, destination);
      this.defaultValue = defaultValue;
      this.isEmpty = true;
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
      this.isEmpty = false;
      this.destination.next(value);
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
      if (this.isEmpty) {
        this.destination.next(this.defaultValue);
      }
      this.destination.complete();
    };
    return DefaultIfEmptySubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/defaultIfEmpty.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/defaultIfEmpty.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var defaultIfEmpty_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/defaultIfEmpty.js');
  Observable_1.Observable.prototype.defaultIfEmpty = defaultIfEmpty_1.defaultIfEmpty;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/delay.js', ['npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/util/isDate.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Notification.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  var isDate_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isDate.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Notification_1 = $__require('npm:rxjs@5.0.0-beta.12/Notification.js');
  function delay(delay, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    var absoluteDelay = isDate_1.isDate(delay);
    var delayFor = absoluteDelay ? +delay - scheduler.now() : Math.abs(delay);
    return this.lift(new DelayOperator(delayFor, scheduler));
  }
  exports.delay = delay;
  var DelayOperator = function () {
    function DelayOperator(delay, scheduler) {
      this.delay = delay;
      this.scheduler = scheduler;
    }
    DelayOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
    };
    return DelayOperator;
  }();
  var DelaySubscriber = function (_super) {
    __extends(DelaySubscriber, _super);
    function DelaySubscriber(destination, delay, scheduler) {
      _super.call(this, destination);
      this.delay = delay;
      this.scheduler = scheduler;
      this.queue = [];
      this.active = false;
      this.errored = false;
    }
    DelaySubscriber.dispatch = function (state) {
      var source = state.source;
      var queue = source.queue;
      var scheduler = state.scheduler;
      var destination = state.destination;
      while (queue.length > 0 && queue[0].time - scheduler.now() <= 0) {
        queue.shift().notification.observe(destination);
      }
      if (queue.length > 0) {
        var delay_1 = Math.max(0, queue[0].time - scheduler.now());
        this.schedule(state, delay_1);
      } else {
        source.active = false;
      }
    };
    DelaySubscriber.prototype._schedule = function (scheduler) {
      this.active = true;
      this.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
        source: this,
        destination: this.destination,
        scheduler: scheduler
      }));
    };
    DelaySubscriber.prototype.scheduleNotification = function (notification) {
      if (this.errored === true) {
        return;
      }
      var scheduler = this.scheduler;
      var message = new DelayMessage(scheduler.now() + this.delay, notification);
      this.queue.push(message);
      if (this.active === false) {
        this._schedule(scheduler);
      }
    };
    DelaySubscriber.prototype._next = function (value) {
      this.scheduleNotification(Notification_1.Notification.createNext(value));
    };
    DelaySubscriber.prototype._error = function (err) {
      this.errored = true;
      this.queue = [];
      this.destination.error(err);
    };
    DelaySubscriber.prototype._complete = function () {
      this.scheduleNotification(Notification_1.Notification.createComplete());
    };
    return DelaySubscriber;
  }(Subscriber_1.Subscriber);
  var DelayMessage = function () {
    function DelayMessage(time, notification) {
      this.time = time;
      this.notification = notification;
    }
    return DelayMessage;
  }();
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/delay.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/delay.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var delay_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/delay.js');
  Observable_1.Observable.prototype.delay = delay_1.delay;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/delayWhen.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
      return new SubscriptionDelayObservable(this, subscriptionDelay).lift(new DelayWhenOperator(delayDurationSelector));
    }
    return this.lift(new DelayWhenOperator(delayDurationSelector));
  }
  exports.delayWhen = delayWhen;
  var DelayWhenOperator = function () {
    function DelayWhenOperator(delayDurationSelector) {
      this.delayDurationSelector = delayDurationSelector;
    }
    DelayWhenOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
    };
    return DelayWhenOperator;
  }();
  var DelayWhenSubscriber = function (_super) {
    __extends(DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
      _super.call(this, destination);
      this.delayDurationSelector = delayDurationSelector;
      this.completed = false;
      this.delayNotifierSubscriptions = [];
      this.values = [];
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.destination.next(outerValue);
      this.removeSubscription(innerSub);
      this.tryComplete();
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
      this._error(error);
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
      var value = this.removeSubscription(innerSub);
      if (value) {
        this.destination.next(value);
      }
      this.tryComplete();
    };
    DelayWhenSubscriber.prototype._next = function (value) {
      try {
        var delayNotifier = this.delayDurationSelector(value);
        if (delayNotifier) {
          this.tryDelay(delayNotifier, value);
        }
      } catch (err) {
        this.destination.error(err);
      }
    };
    DelayWhenSubscriber.prototype._complete = function () {
      this.completed = true;
      this.tryComplete();
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
      subscription.unsubscribe();
      var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
      var value = null;
      if (subscriptionIdx !== -1) {
        value = this.values[subscriptionIdx];
        this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
        this.values.splice(subscriptionIdx, 1);
      }
      return value;
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
      var notifierSubscription = subscribeToResult_1.subscribeToResult(this, delayNotifier, value);
      this.add(notifierSubscription);
      this.delayNotifierSubscriptions.push(notifierSubscription);
      this.values.push(value);
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
      if (this.completed && this.delayNotifierSubscriptions.length === 0) {
        this.destination.complete();
      }
    };
    return DelayWhenSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  var SubscriptionDelayObservable = function (_super) {
    __extends(SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(source, subscriptionDelay) {
      _super.call(this);
      this.source = source;
      this.subscriptionDelay = subscriptionDelay;
    }
    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
      this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    };
    return SubscriptionDelayObservable;
  }(Observable_1.Observable);
  var SubscriptionDelaySubscriber = function (_super) {
    __extends(SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
      _super.call(this);
      this.parent = parent;
      this.source = source;
      this.sourceSubscribed = false;
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
      this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
      this.unsubscribe();
      this.parent.error(err);
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
      this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
      if (!this.sourceSubscribed) {
        this.sourceSubscribed = true;
        this.unsubscribe();
        this.source.subscribe(this.parent);
      }
    };
    return SubscriptionDelaySubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/delayWhen.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/delayWhen.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var delayWhen_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/delayWhen.js');
  Observable_1.Observable.prototype.delayWhen = delayWhen_1.delayWhen;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/distinct.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/distinct.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var distinct_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/distinct.js');
  Observable_1.Observable.prototype.distinct = distinct_1.distinct;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/distinct.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function distinct(compare, flushes) {
    return this.lift(new DistinctOperator(compare, flushes));
  }
  exports.distinct = distinct;
  var DistinctOperator = function () {
    function DistinctOperator(compare, flushes) {
      this.compare = compare;
      this.flushes = flushes;
    }
    DistinctOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DistinctSubscriber(subscriber, this.compare, this.flushes));
    };
    return DistinctOperator;
  }();
  var DistinctSubscriber = function (_super) {
    __extends(DistinctSubscriber, _super);
    function DistinctSubscriber(destination, compare, flushes) {
      _super.call(this, destination);
      this.values = [];
      if (typeof compare === 'function') {
        this.compare = compare;
      }
      if (flushes) {
        this.add(subscribeToResult_1.subscribeToResult(this, flushes));
      }
    }
    DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.values.length = 0;
    };
    DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
      this._error(error);
    };
    DistinctSubscriber.prototype._next = function (value) {
      var found = false;
      var values = this.values;
      var len = values.length;
      try {
        for (var i = 0; i < len; i++) {
          if (this.compare(values[i], value)) {
            found = true;
            return;
          }
        }
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.values.push(value);
      this.destination.next(value);
    };
    DistinctSubscriber.prototype.compare = function (x, y) {
      return x === y;
    };
    return DistinctSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.DistinctSubscriber = DistinctSubscriber;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/distinctKey.js", ["npm:rxjs@5.0.0-beta.12/operator/distinct.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var distinct_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/distinct.js");
  function distinctKey(key, compare, flushes) {
    return distinct_1.distinct.call(this, function (x, y) {
      if (compare) {
        return compare(x[key], y[key]);
      }
      return x[key] === y[key];
    }, flushes);
  }
  exports.distinctKey = distinctKey;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/distinctKey.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/distinctKey.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var distinctKey_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/distinctKey.js');
  Observable_1.Observable.prototype.distinctKey = distinctKey_1.distinctKey;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/distinctUntilChanged.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/distinctUntilChanged.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var distinctUntilChanged_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/distinctUntilChanged.js');
  Observable_1.Observable.prototype.distinctUntilChanged = distinctUntilChanged_1.distinctUntilChanged;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/distinctUntilChanged.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  function distinctUntilChanged(compare, keySelector) {
    return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
  }
  exports.distinctUntilChanged = distinctUntilChanged;
  var DistinctUntilChangedOperator = function () {
    function DistinctUntilChangedOperator(compare, keySelector) {
      this.compare = compare;
      this.keySelector = keySelector;
    }
    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    };
    return DistinctUntilChangedOperator;
  }();
  var DistinctUntilChangedSubscriber = function (_super) {
    __extends(DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
      _super.call(this, destination);
      this.keySelector = keySelector;
      this.hasKey = false;
      if (typeof compare === 'function') {
        this.compare = compare;
      }
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
      return x === y;
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
      var keySelector = this.keySelector;
      var key = value;
      if (keySelector) {
        key = tryCatch_1.tryCatch(this.keySelector)(value);
        if (key === errorObject_1.errorObject) {
          return this.destination.error(errorObject_1.errorObject.e);
        }
      }
      var result = false;
      if (this.hasKey) {
        result = tryCatch_1.tryCatch(this.compare)(this.key, key);
        if (result === errorObject_1.errorObject) {
          return this.destination.error(errorObject_1.errorObject.e);
        }
      } else {
        this.hasKey = true;
      }
      if (Boolean(result) === false) {
        this.key = key;
        this.destination.next(value);
      }
    };
    return DistinctUntilChangedSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/distinctUntilKeyChanged.js", ["npm:rxjs@5.0.0-beta.12/operator/distinctUntilChanged.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var distinctUntilChanged_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/distinctUntilChanged.js");
  function distinctUntilKeyChanged(key, compare) {
    return distinctUntilChanged_1.distinctUntilChanged.call(this, function (x, y) {
      if (compare) {
        return compare(x[key], y[key]);
      }
      return x[key] === y[key];
    });
  }
  exports.distinctUntilKeyChanged = distinctUntilKeyChanged;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/distinctUntilKeyChanged.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/distinctUntilKeyChanged.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var distinctUntilKeyChanged_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/distinctUntilKeyChanged.js');
  Observable_1.Observable.prototype.distinctUntilKeyChanged = distinctUntilKeyChanged_1.distinctUntilKeyChanged;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/do.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function _do(nextOrObserver, error, complete) {
    return this.lift(new DoOperator(nextOrObserver, error, complete));
  }
  exports._do = _do;
  var DoOperator = function () {
    function DoOperator(nextOrObserver, error, complete) {
      this.nextOrObserver = nextOrObserver;
      this.error = error;
      this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
  }();
  var DoSubscriber = function (_super) {
    __extends(DoSubscriber, _super);
    function DoSubscriber(destination, nextOrObserver, error, complete) {
      _super.call(this, destination);
      var safeSubscriber = new Subscriber_1.Subscriber(nextOrObserver, error, complete);
      safeSubscriber.syncErrorThrowable = true;
      this.add(safeSubscriber);
      this.safeSubscriber = safeSubscriber;
    }
    DoSubscriber.prototype._next = function (value) {
      var safeSubscriber = this.safeSubscriber;
      safeSubscriber.next(value);
      if (safeSubscriber.syncErrorThrown) {
        this.destination.error(safeSubscriber.syncErrorValue);
      } else {
        this.destination.next(value);
      }
    };
    DoSubscriber.prototype._error = function (err) {
      var safeSubscriber = this.safeSubscriber;
      safeSubscriber.error(err);
      if (safeSubscriber.syncErrorThrown) {
        this.destination.error(safeSubscriber.syncErrorValue);
      } else {
        this.destination.error(err);
      }
    };
    DoSubscriber.prototype._complete = function () {
      var safeSubscriber = this.safeSubscriber;
      safeSubscriber.complete();
      if (safeSubscriber.syncErrorThrown) {
        this.destination.error(safeSubscriber.syncErrorValue);
      } else {
        this.destination.complete();
      }
    };
    return DoSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/do.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/do.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var do_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/do.js');
  Observable_1.Observable.prototype.do = do_1._do;
  Observable_1.Observable.prototype._do = do_1._do;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/exhaust.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
    var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
    function exhaust() {
      return this.lift(new SwitchFirstOperator());
    }
    exports.exhaust = exhaust;
    var SwitchFirstOperator = function () {
      function SwitchFirstOperator() {}
      SwitchFirstOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new SwitchFirstSubscriber(subscriber));
      };
      return SwitchFirstOperator;
    }();
    var SwitchFirstSubscriber = function (_super) {
      __extends(SwitchFirstSubscriber, _super);
      function SwitchFirstSubscriber(destination) {
        _super.call(this, destination);
        this.hasCompleted = false;
        this.hasSubscription = false;
      }
      SwitchFirstSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
          this.hasSubscription = true;
          this.add(subscribeToResult_1.subscribeToResult(this, value));
        }
      };
      SwitchFirstSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
          this.destination.complete();
        }
      };
      SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
          this.destination.complete();
        }
      };
      return SwitchFirstSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/exhaust.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/exhaust.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var exhaust_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/exhaust.js');
  Observable_1.Observable.prototype.exhaust = exhaust_1.exhaust;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/exhaustMap.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
    var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
    function exhaustMap(project, resultSelector) {
      return this.lift(new SwitchFirstMapOperator(project, resultSelector));
    }
    exports.exhaustMap = exhaustMap;
    var SwitchFirstMapOperator = function () {
      function SwitchFirstMapOperator(project, resultSelector) {
        this.project = project;
        this.resultSelector = resultSelector;
      }
      SwitchFirstMapOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new SwitchFirstMapSubscriber(subscriber, this.project, this.resultSelector));
      };
      return SwitchFirstMapOperator;
    }();
    var SwitchFirstMapSubscriber = function (_super) {
      __extends(SwitchFirstMapSubscriber, _super);
      function SwitchFirstMapSubscriber(destination, project, resultSelector) {
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.hasSubscription = false;
        this.hasCompleted = false;
        this.index = 0;
      }
      SwitchFirstMapSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
          this.tryNext(value);
        }
      };
      SwitchFirstMapSubscriber.prototype.tryNext = function (value) {
        var index = this.index++;
        var destination = this.destination;
        try {
          var result = this.project(value, index);
          this.hasSubscription = true;
          this.add(subscribeToResult_1.subscribeToResult(this, result, value, index));
        } catch (err) {
          destination.error(err);
        }
      };
      SwitchFirstMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
          this.destination.complete();
        }
      };
      SwitchFirstMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _a = this,
            resultSelector = _a.resultSelector,
            destination = _a.destination;
        if (resultSelector) {
          this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
        } else {
          destination.next(innerValue);
        }
      };
      SwitchFirstMapSubscriber.prototype.trySelectResult = function (outerValue, innerValue, outerIndex, innerIndex) {
        var _a = this,
            resultSelector = _a.resultSelector,
            destination = _a.destination;
        try {
          var result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
          destination.next(result);
        } catch (err) {
          destination.error(err);
        }
      };
      SwitchFirstMapSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
      };
      SwitchFirstMapSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
          this.destination.complete();
        }
      };
      return SwitchFirstMapSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/exhaustMap.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/exhaustMap.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var exhaustMap_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/exhaustMap.js');
  Observable_1.Observable.prototype.exhaustMap = exhaustMap_1.exhaustMap;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/expand.js', ['npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function expand(project, concurrent, scheduler) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }
    if (scheduler === void 0) {
      scheduler = undefined;
    }
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return this.lift(new ExpandOperator(project, concurrent, scheduler));
  }
  exports.expand = expand;
  var ExpandOperator = function () {
    function ExpandOperator(project, concurrent, scheduler) {
      this.project = project;
      this.concurrent = concurrent;
      this.scheduler = scheduler;
    }
    ExpandOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
    };
    return ExpandOperator;
  }();
  exports.ExpandOperator = ExpandOperator;
  var ExpandSubscriber = function (_super) {
    __extends(ExpandSubscriber, _super);
    function ExpandSubscriber(destination, project, concurrent, scheduler) {
      _super.call(this, destination);
      this.project = project;
      this.concurrent = concurrent;
      this.scheduler = scheduler;
      this.index = 0;
      this.active = 0;
      this.hasCompleted = false;
      if (concurrent < Number.POSITIVE_INFINITY) {
        this.buffer = [];
      }
    }
    ExpandSubscriber.dispatch = function (arg) {
      var subscriber = arg.subscriber,
          result = arg.result,
          value = arg.value,
          index = arg.index;
      subscriber.subscribeToProjection(result, value, index);
    };
    ExpandSubscriber.prototype._next = function (value) {
      var destination = this.destination;
      if (destination.closed) {
        this._complete();
        return;
      }
      var index = this.index++;
      if (this.active < this.concurrent) {
        destination.next(value);
        var result = tryCatch_1.tryCatch(this.project)(value, index);
        if (result === errorObject_1.errorObject) {
          destination.error(errorObject_1.errorObject.e);
        } else if (!this.scheduler) {
          this.subscribeToProjection(result, value, index);
        } else {
          var state = {
            subscriber: this,
            result: result,
            value: value,
            index: index
          };
          this.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
        }
      } else {
        this.buffer.push(value);
      }
    };
    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
      this.active++;
      this.add(subscribeToResult_1.subscribeToResult(this, result, value, index));
    };
    ExpandSubscriber.prototype._complete = function () {
      this.hasCompleted = true;
      if (this.hasCompleted && this.active === 0) {
        this.destination.complete();
      }
    };
    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this._next(innerValue);
    };
    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
      var buffer = this.buffer;
      this.remove(innerSub);
      this.active--;
      if (buffer && buffer.length > 0) {
        this._next(buffer.shift());
      }
      if (this.hasCompleted && this.active === 0) {
        this.destination.complete();
      }
    };
    return ExpandSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.ExpandSubscriber = ExpandSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/expand.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/expand.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var expand_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/expand.js');
  Observable_1.Observable.prototype.expand = expand_1.expand;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/elementAt.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var ArgumentOutOfRangeError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js');
  function elementAt(index, defaultValue) {
    return this.lift(new ElementAtOperator(index, defaultValue));
  }
  exports.elementAt = elementAt;
  var ElementAtOperator = function () {
    function ElementAtOperator(index, defaultValue) {
      this.index = index;
      this.defaultValue = defaultValue;
      if (index < 0) {
        throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
      }
    }
    ElementAtOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new ElementAtSubscriber(subscriber, this.index, this.defaultValue));
    };
    return ElementAtOperator;
  }();
  var ElementAtSubscriber = function (_super) {
    __extends(ElementAtSubscriber, _super);
    function ElementAtSubscriber(destination, index, defaultValue) {
      _super.call(this, destination);
      this.index = index;
      this.defaultValue = defaultValue;
    }
    ElementAtSubscriber.prototype._next = function (x) {
      if (this.index-- === 0) {
        this.destination.next(x);
        this.destination.complete();
      }
    };
    ElementAtSubscriber.prototype._complete = function () {
      var destination = this.destination;
      if (this.index >= 0) {
        if (typeof this.defaultValue !== 'undefined') {
          destination.next(this.defaultValue);
        } else {
          destination.error(new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError());
        }
      }
      destination.complete();
    };
    return ElementAtSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/elementAt.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/elementAt.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var elementAt_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/elementAt.js');
  Observable_1.Observable.prototype.elementAt = elementAt_1.elementAt;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/filter.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/filter.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var filter_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/filter.js');
  Observable_1.Observable.prototype.filter = filter_1.filter;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/finally.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  function _finally(callback) {
    return this.lift(new FinallyOperator(callback));
  }
  exports._finally = _finally;
  var FinallyOperator = function () {
    function FinallyOperator(callback) {
      this.callback = callback;
    }
    FinallyOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new FinallySubscriber(subscriber, this.callback));
    };
    return FinallyOperator;
  }();
  var FinallySubscriber = function (_super) {
    __extends(FinallySubscriber, _super);
    function FinallySubscriber(destination, callback) {
      _super.call(this, destination);
      this.add(new Subscription_1.Subscription(callback));
    }
    return FinallySubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/finally.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/finally.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var finally_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/finally.js');
  Observable_1.Observable.prototype.finally = finally_1._finally;
  Observable_1.Observable.prototype._finally = finally_1._finally;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/find.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/find.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var find_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/find.js');
  Observable_1.Observable.prototype.find = find_1.find;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/find.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate is not a function');
    }
    return this.lift(new FindValueOperator(predicate, this, false, thisArg));
  }
  exports.find = find;
  var FindValueOperator = function () {
    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
      this.predicate = predicate;
      this.source = source;
      this.yieldIndex = yieldIndex;
      this.thisArg = thisArg;
    }
    FindValueOperator.prototype.call = function (observer, source) {
      return source._subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    };
    return FindValueOperator;
  }();
  exports.FindValueOperator = FindValueOperator;
  var FindValueSubscriber = function (_super) {
    __extends(FindValueSubscriber, _super);
    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.source = source;
      this.yieldIndex = yieldIndex;
      this.thisArg = thisArg;
      this.index = 0;
    }
    FindValueSubscriber.prototype.notifyComplete = function (value) {
      var destination = this.destination;
      destination.next(value);
      destination.complete();
    };
    FindValueSubscriber.prototype._next = function (value) {
      var _a = this,
          predicate = _a.predicate,
          thisArg = _a.thisArg;
      var index = this.index++;
      try {
        var result = predicate.call(thisArg || this, value, index, this.source);
        if (result) {
          this.notifyComplete(this.yieldIndex ? index : value);
        }
      } catch (err) {
        this.destination.error(err);
      }
    };
    FindValueSubscriber.prototype._complete = function () {
      this.notifyComplete(this.yieldIndex ? -1 : undefined);
    };
    return FindValueSubscriber;
  }(Subscriber_1.Subscriber);
  exports.FindValueSubscriber = FindValueSubscriber;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/findIndex.js", ["npm:rxjs@5.0.0-beta.12/operator/find.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var find_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/find.js");
  function findIndex(predicate, thisArg) {
    return this.lift(new find_1.FindValueOperator(predicate, this, true, thisArg));
  }
  exports.findIndex = findIndex;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/findIndex.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/findIndex.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var findIndex_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/findIndex.js');
  Observable_1.Observable.prototype.findIndex = findIndex_1.findIndex;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/first.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/EmptyError.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var EmptyError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/EmptyError.js');
  function first(predicate, resultSelector, defaultValue) {
    return this.lift(new FirstOperator(predicate, resultSelector, defaultValue, this));
  }
  exports.first = first;
  var FirstOperator = function () {
    function FirstOperator(predicate, resultSelector, defaultValue, source) {
      this.predicate = predicate;
      this.resultSelector = resultSelector;
      this.defaultValue = defaultValue;
      this.source = source;
    }
    FirstOperator.prototype.call = function (observer, source) {
      return source._subscribe(new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
    };
    return FirstOperator;
  }();
  var FirstSubscriber = function (_super) {
    __extends(FirstSubscriber, _super);
    function FirstSubscriber(destination, predicate, resultSelector, defaultValue, source) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.resultSelector = resultSelector;
      this.defaultValue = defaultValue;
      this.source = source;
      this.index = 0;
      this.hasCompleted = false;
    }
    FirstSubscriber.prototype._next = function (value) {
      var index = this.index++;
      if (this.predicate) {
        this._tryPredicate(value, index);
      } else {
        this._emit(value, index);
      }
    };
    FirstSubscriber.prototype._tryPredicate = function (value, index) {
      var result;
      try {
        result = this.predicate(value, index, this.source);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      if (result) {
        this._emit(value, index);
      }
    };
    FirstSubscriber.prototype._emit = function (value, index) {
      if (this.resultSelector) {
        this._tryResultSelector(value, index);
        return;
      }
      this._emitFinal(value);
    };
    FirstSubscriber.prototype._tryResultSelector = function (value, index) {
      var result;
      try {
        result = this.resultSelector(value, index);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this._emitFinal(result);
    };
    FirstSubscriber.prototype._emitFinal = function (value) {
      var destination = this.destination;
      destination.next(value);
      destination.complete();
      this.hasCompleted = true;
    };
    FirstSubscriber.prototype._complete = function () {
      var destination = this.destination;
      if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
        destination.next(this.defaultValue);
        destination.complete();
      } else if (!this.hasCompleted) {
        destination.error(new EmptyError_1.EmptyError());
      }
    };
    return FirstSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/first.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/first.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var first_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/first.js');
  Observable_1.Observable.prototype.first = first_1.first;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/MapPolyfill.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var MapPolyfill = function () {
        function MapPolyfill() {
            this.size = 0;
            this._values = [];
            this._keys = [];
        }
        MapPolyfill.prototype.get = function (key) {
            var i = this._keys.indexOf(key);
            return i === -1 ? undefined : this._values[i];
        };
        MapPolyfill.prototype.set = function (key, value) {
            var i = this._keys.indexOf(key);
            if (i === -1) {
                this._keys.push(key);
                this._values.push(value);
                this.size++;
            } else {
                this._values[i] = value;
            }
            return this;
        };
        MapPolyfill.prototype.delete = function (key) {
            var i = this._keys.indexOf(key);
            if (i === -1) {
                return false;
            }
            this._values.splice(i, 1);
            this._keys.splice(i, 1);
            this.size--;
            return true;
        };
        MapPolyfill.prototype.clear = function () {
            this._keys.length = 0;
            this._values.length = 0;
            this.size = 0;
        };
        MapPolyfill.prototype.forEach = function (cb, thisArg) {
            for (var i = 0; i < this.size; i++) {
                cb.call(thisArg, this._values[i], this._keys[i]);
            }
        };
        return MapPolyfill;
    }();
    exports.MapPolyfill = MapPolyfill;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/Map.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/util/MapPolyfill.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var MapPolyfill_1 = $__require('npm:rxjs@5.0.0-beta.12/util/MapPolyfill.js');
  exports.Map = root_1.root.Map || function () {
    return MapPolyfill_1.MapPolyfill;
  }();
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/FastMap.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var FastMap = function () {
        function FastMap() {
            this.values = {};
        }
        FastMap.prototype.delete = function (key) {
            this.values[key] = null;
            return true;
        };
        FastMap.prototype.set = function (key, value) {
            this.values[key] = value;
            return this;
        };
        FastMap.prototype.get = function (key) {
            return this.values[key];
        };
        FastMap.prototype.forEach = function (cb, thisArg) {
            var values = this.values;
            for (var key in values) {
                if (values.hasOwnProperty(key) && values[key] !== null) {
                    cb.call(thisArg, values[key], key);
                }
            }
        };
        FastMap.prototype.clear = function () {
            this.values = {};
        };
        return FastMap;
    }();
    exports.FastMap = FastMap;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/groupBy.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/util/Map.js', 'npm:rxjs@5.0.0-beta.12/util/FastMap.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var Map_1 = $__require('npm:rxjs@5.0.0-beta.12/util/Map.js');
  var FastMap_1 = $__require('npm:rxjs@5.0.0-beta.12/util/FastMap.js');
  function groupBy(keySelector, elementSelector, durationSelector) {
    return this.lift(new GroupByOperator(this, keySelector, elementSelector, durationSelector));
  }
  exports.groupBy = groupBy;
  var GroupByOperator = function () {
    function GroupByOperator(source, keySelector, elementSelector, durationSelector) {
      this.source = source;
      this.keySelector = keySelector;
      this.elementSelector = elementSelector;
      this.durationSelector = durationSelector;
    }
    GroupByOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector));
    };
    return GroupByOperator;
  }();
  var GroupBySubscriber = function (_super) {
    __extends(GroupBySubscriber, _super);
    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector) {
      _super.call(this, destination);
      this.keySelector = keySelector;
      this.elementSelector = elementSelector;
      this.durationSelector = durationSelector;
      this.groups = null;
      this.attemptedToUnsubscribe = false;
      this.count = 0;
    }
    GroupBySubscriber.prototype._next = function (value) {
      var key;
      try {
        key = this.keySelector(value);
      } catch (err) {
        this.error(err);
        return;
      }
      this._group(value, key);
    };
    GroupBySubscriber.prototype._group = function (value, key) {
      var groups = this.groups;
      if (!groups) {
        groups = this.groups = typeof key === 'string' ? new FastMap_1.FastMap() : new Map_1.Map();
      }
      var group = groups.get(key);
      var element;
      if (this.elementSelector) {
        try {
          element = this.elementSelector(value);
        } catch (err) {
          this.error(err);
        }
      } else {
        element = value;
      }
      if (!group) {
        groups.set(key, group = new Subject_1.Subject());
        var groupedObservable = new GroupedObservable(key, group, this);
        this.destination.next(groupedObservable);
        if (this.durationSelector) {
          var duration = void 0;
          try {
            duration = this.durationSelector(new GroupedObservable(key, group));
          } catch (err) {
            this.error(err);
            return;
          }
          this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
        }
      }
      if (!group.closed) {
        group.next(element);
      }
    };
    GroupBySubscriber.prototype._error = function (err) {
      var groups = this.groups;
      if (groups) {
        groups.forEach(function (group, key) {
          group.error(err);
        });
        groups.clear();
      }
      this.destination.error(err);
    };
    GroupBySubscriber.prototype._complete = function () {
      var groups = this.groups;
      if (groups) {
        groups.forEach(function (group, key) {
          group.complete();
        });
        groups.clear();
      }
      this.destination.complete();
    };
    GroupBySubscriber.prototype.removeGroup = function (key) {
      this.groups.delete(key);
    };
    GroupBySubscriber.prototype.unsubscribe = function () {
      if (!this.closed && !this.attemptedToUnsubscribe) {
        this.attemptedToUnsubscribe = true;
        if (this.count === 0) {
          _super.prototype.unsubscribe.call(this);
        }
      }
    };
    return GroupBySubscriber;
  }(Subscriber_1.Subscriber);
  var GroupDurationSubscriber = function (_super) {
    __extends(GroupDurationSubscriber, _super);
    function GroupDurationSubscriber(key, group, parent) {
      _super.call(this);
      this.key = key;
      this.group = group;
      this.parent = parent;
    }
    GroupDurationSubscriber.prototype._next = function (value) {
      this._complete();
    };
    GroupDurationSubscriber.prototype._error = function (err) {
      var group = this.group;
      if (!group.closed) {
        group.error(err);
      }
      this.parent.removeGroup(this.key);
    };
    GroupDurationSubscriber.prototype._complete = function () {
      var group = this.group;
      if (!group.closed) {
        group.complete();
      }
      this.parent.removeGroup(this.key);
    };
    return GroupDurationSubscriber;
  }(Subscriber_1.Subscriber);
  var GroupedObservable = function (_super) {
    __extends(GroupedObservable, _super);
    function GroupedObservable(key, groupSubject, refCountSubscription) {
      _super.call(this);
      this.key = key;
      this.groupSubject = groupSubject;
      this.refCountSubscription = refCountSubscription;
    }
    GroupedObservable.prototype._subscribe = function (subscriber) {
      var subscription = new Subscription_1.Subscription();
      var _a = this,
          refCountSubscription = _a.refCountSubscription,
          groupSubject = _a.groupSubject;
      if (refCountSubscription && !refCountSubscription.closed) {
        subscription.add(new InnerRefCountSubscription(refCountSubscription));
      }
      subscription.add(groupSubject.subscribe(subscriber));
      return subscription;
    };
    return GroupedObservable;
  }(Observable_1.Observable);
  exports.GroupedObservable = GroupedObservable;
  var InnerRefCountSubscription = function (_super) {
    __extends(InnerRefCountSubscription, _super);
    function InnerRefCountSubscription(parent) {
      _super.call(this);
      this.parent = parent;
      parent.count++;
    }
    InnerRefCountSubscription.prototype.unsubscribe = function () {
      var parent = this.parent;
      if (!parent.closed && !this.closed) {
        _super.prototype.unsubscribe.call(this);
        parent.count -= 1;
        if (parent.count === 0 && parent.attemptedToUnsubscribe) {
          parent.unsubscribe();
        }
      }
    };
    return InnerRefCountSubscription;
  }(Subscription_1.Subscription);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/groupBy.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/groupBy.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var groupBy_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/groupBy.js');
  Observable_1.Observable.prototype.groupBy = groupBy_1.groupBy;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/noop.js", [], true, function ($__require, exports, module) {
  /* */
  "use strict";
  /* tslint:disable:no-empty */

  var define,
      global = this || self,
      GLOBAL = global;
  function noop() {}
  exports.noop = noop;
  

  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/ignoreElements.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/noop.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var noop_1 = $__require('npm:rxjs@5.0.0-beta.12/util/noop.js');
  function ignoreElements() {
    return this.lift(new IgnoreElementsOperator());
  }
  exports.ignoreElements = ignoreElements;
  ;
  var IgnoreElementsOperator = function () {
    function IgnoreElementsOperator() {}
    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new IgnoreElementsSubscriber(subscriber));
    };
    return IgnoreElementsOperator;
  }();
  var IgnoreElementsSubscriber = function (_super) {
    __extends(IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
      _super.apply(this, arguments);
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
      noop_1.noop();
    };
    return IgnoreElementsSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/ignoreElements.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/ignoreElements.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var ignoreElements_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/ignoreElements.js');
  Observable_1.Observable.prototype.ignoreElements = ignoreElements_1.ignoreElements;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/isEmpty.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function isEmpty() {
    return this.lift(new IsEmptyOperator());
  }
  exports.isEmpty = isEmpty;
  var IsEmptyOperator = function () {
    function IsEmptyOperator() {}
    IsEmptyOperator.prototype.call = function (observer, source) {
      return source._subscribe(new IsEmptySubscriber(observer));
    };
    return IsEmptyOperator;
  }();
  var IsEmptySubscriber = function (_super) {
    __extends(IsEmptySubscriber, _super);
    function IsEmptySubscriber(destination) {
      _super.call(this, destination);
    }
    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
      var destination = this.destination;
      destination.next(isEmpty);
      destination.complete();
    };
    IsEmptySubscriber.prototype._next = function (value) {
      this.notifyComplete(false);
    };
    IsEmptySubscriber.prototype._complete = function () {
      this.notifyComplete(true);
    };
    return IsEmptySubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/isEmpty.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/isEmpty.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var isEmpty_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/isEmpty.js');
  Observable_1.Observable.prototype.isEmpty = isEmpty_1.isEmpty;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/audit.js', ['npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
    var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
    var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
    var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
    function audit(durationSelector) {
      return this.lift(new AuditOperator(durationSelector));
    }
    exports.audit = audit;
    var AuditOperator = function () {
      function AuditOperator(durationSelector) {
        this.durationSelector = durationSelector;
      }
      AuditOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new AuditSubscriber(subscriber, this.durationSelector));
      };
      return AuditOperator;
    }();
    var AuditSubscriber = function (_super) {
      __extends(AuditSubscriber, _super);
      function AuditSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
      }
      AuditSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
          var duration = tryCatch_1.tryCatch(this.durationSelector)(value);
          if (duration === errorObject_1.errorObject) {
            this.destination.error(errorObject_1.errorObject.e);
          } else {
            this.add(this.throttled = subscribeToResult_1.subscribeToResult(this, duration));
          }
        }
      };
      AuditSubscriber.prototype.clearThrottle = function () {
        var _a = this,
            value = _a.value,
            hasValue = _a.hasValue,
            throttled = _a.throttled;
        if (throttled) {
          this.remove(throttled);
          this.throttled = null;
          throttled.unsubscribe();
        }
        if (hasValue) {
          this.value = null;
          this.hasValue = false;
          this.destination.next(value);
        }
      };
      AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
      };
      AuditSubscriber.prototype.notifyComplete = function () {
        this.clearThrottle();
      };
      return AuditSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/audit.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/audit.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var audit_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/audit.js');
  Observable_1.Observable.prototype.audit = audit_1.audit;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/auditTime.js', ['npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
    var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
    function auditTime(duration, scheduler) {
      if (scheduler === void 0) {
        scheduler = async_1.async;
      }
      return this.lift(new AuditTimeOperator(duration, scheduler));
    }
    exports.auditTime = auditTime;
    var AuditTimeOperator = function () {
      function AuditTimeOperator(duration, scheduler) {
        this.duration = duration;
        this.scheduler = scheduler;
      }
      AuditTimeOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new AuditTimeSubscriber(subscriber, this.duration, this.scheduler));
      };
      return AuditTimeOperator;
    }();
    var AuditTimeSubscriber = function (_super) {
      __extends(AuditTimeSubscriber, _super);
      function AuditTimeSubscriber(destination, duration, scheduler) {
        _super.call(this, destination);
        this.duration = duration;
        this.scheduler = scheduler;
        this.hasValue = false;
      }
      AuditTimeSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
          this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, this));
        }
      };
      AuditTimeSubscriber.prototype.clearThrottle = function () {
        var _a = this,
            value = _a.value,
            hasValue = _a.hasValue,
            throttled = _a.throttled;
        if (throttled) {
          this.remove(throttled);
          this.throttled = null;
          throttled.unsubscribe();
        }
        if (hasValue) {
          this.value = null;
          this.hasValue = false;
          this.destination.next(value);
        }
      };
      return AuditTimeSubscriber;
    }(Subscriber_1.Subscriber);
    function dispatchNext(subscriber) {
      subscriber.clearThrottle();
    }
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/auditTime.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/auditTime.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var auditTime_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/auditTime.js');
  Observable_1.Observable.prototype.auditTime = auditTime_1.auditTime;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/last.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/EmptyError.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var EmptyError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/EmptyError.js');
  function last(predicate, resultSelector, defaultValue) {
    return this.lift(new LastOperator(predicate, resultSelector, defaultValue, this));
  }
  exports.last = last;
  var LastOperator = function () {
    function LastOperator(predicate, resultSelector, defaultValue, source) {
      this.predicate = predicate;
      this.resultSelector = resultSelector;
      this.defaultValue = defaultValue;
      this.source = source;
    }
    LastOperator.prototype.call = function (observer, source) {
      return source._subscribe(new LastSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source));
    };
    return LastOperator;
  }();
  var LastSubscriber = function (_super) {
    __extends(LastSubscriber, _super);
    function LastSubscriber(destination, predicate, resultSelector, defaultValue, source) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.resultSelector = resultSelector;
      this.defaultValue = defaultValue;
      this.source = source;
      this.hasValue = false;
      this.index = 0;
      if (typeof defaultValue !== 'undefined') {
        this.lastValue = defaultValue;
        this.hasValue = true;
      }
    }
    LastSubscriber.prototype._next = function (value) {
      var index = this.index++;
      if (this.predicate) {
        this._tryPredicate(value, index);
      } else {
        if (this.resultSelector) {
          this._tryResultSelector(value, index);
          return;
        }
        this.lastValue = value;
        this.hasValue = true;
      }
    };
    LastSubscriber.prototype._tryPredicate = function (value, index) {
      var result;
      try {
        result = this.predicate(value, index, this.source);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      if (result) {
        if (this.resultSelector) {
          this._tryResultSelector(value, index);
          return;
        }
        this.lastValue = value;
        this.hasValue = true;
      }
    };
    LastSubscriber.prototype._tryResultSelector = function (value, index) {
      var result;
      try {
        result = this.resultSelector(value, index);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.lastValue = result;
      this.hasValue = true;
    };
    LastSubscriber.prototype._complete = function () {
      var destination = this.destination;
      if (this.hasValue) {
        destination.next(this.lastValue);
        destination.complete();
      } else {
        destination.error(new EmptyError_1.EmptyError());
      }
    };
    return LastSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/last.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/last.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var last_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/last.js');
  Observable_1.Observable.prototype.last = last_1.last;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/let.js", [], true, function ($__require, exports, module) {
  /* */
  "use strict";
  /**
   * @param func
   * @return {Observable<R>}
   * @method let
   * @owner Observable
   */

  var define,
      global = this || self,
      GLOBAL = global;
  function letProto(func) {
    return func(this);
  }
  exports.letProto = letProto;
  

  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/let.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/let.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var let_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/let.js');
  Observable_1.Observable.prototype.let = let_1.letProto;
  Observable_1.Observable.prototype.letBind = let_1.letProto;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/every.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function every(predicate, thisArg) {
    return this.lift(new EveryOperator(predicate, thisArg, this));
  }
  exports.every = every;
  var EveryOperator = function () {
    function EveryOperator(predicate, thisArg, source) {
      this.predicate = predicate;
      this.thisArg = thisArg;
      this.source = source;
    }
    EveryOperator.prototype.call = function (observer, source) {
      return source._subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
    };
    return EveryOperator;
  }();
  var EverySubscriber = function (_super) {
    __extends(EverySubscriber, _super);
    function EverySubscriber(destination, predicate, thisArg, source) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.thisArg = thisArg;
      this.source = source;
      this.index = 0;
      this.thisArg = thisArg || this;
    }
    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
      this.destination.next(everyValueMatch);
      this.destination.complete();
    };
    EverySubscriber.prototype._next = function (value) {
      var result = false;
      try {
        result = this.predicate.call(this.thisArg, value, this.index++, this.source);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      if (!result) {
        this.notifyComplete(false);
      }
    };
    EverySubscriber.prototype._complete = function () {
      this.notifyComplete(true);
    };
    return EverySubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/every.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/every.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var every_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/every.js');
  Observable_1.Observable.prototype.every = every_1.every;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/map.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/map.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var map_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/map.js');
  Observable_1.Observable.prototype.map = map_1.map;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/mapTo.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function mapTo(value) {
    return this.lift(new MapToOperator(value));
  }
  exports.mapTo = mapTo;
  var MapToOperator = function () {
    function MapToOperator(value) {
      this.value = value;
    }
    MapToOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new MapToSubscriber(subscriber, this.value));
    };
    return MapToOperator;
  }();
  var MapToSubscriber = function (_super) {
    __extends(MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
      _super.call(this, destination);
      this.value = value;
    }
    MapToSubscriber.prototype._next = function (x) {
      this.destination.next(this.value);
    };
    return MapToSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/mapTo.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/mapTo.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var mapTo_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/mapTo.js');
  Observable_1.Observable.prototype.mapTo = mapTo_1.mapTo;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/materialize.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Notification.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Notification_1 = $__require('npm:rxjs@5.0.0-beta.12/Notification.js');
  function materialize() {
    return this.lift(new MaterializeOperator());
  }
  exports.materialize = materialize;
  var MaterializeOperator = function () {
    function MaterializeOperator() {}
    MaterializeOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new MaterializeSubscriber(subscriber));
    };
    return MaterializeOperator;
  }();
  var MaterializeSubscriber = function (_super) {
    __extends(MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
      _super.call(this, destination);
    }
    MaterializeSubscriber.prototype._next = function (value) {
      this.destination.next(Notification_1.Notification.createNext(value));
    };
    MaterializeSubscriber.prototype._error = function (err) {
      var destination = this.destination;
      destination.next(Notification_1.Notification.createError(err));
      destination.complete();
    };
    MaterializeSubscriber.prototype._complete = function () {
      var destination = this.destination;
      destination.next(Notification_1.Notification.createComplete());
      destination.complete();
    };
    return MaterializeSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/materialize.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/materialize.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var materialize_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/materialize.js');
  Observable_1.Observable.prototype.materialize = materialize_1.materialize;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/max.js', ['npm:rxjs@5.0.0-beta.12/operator/reduce.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var reduce_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/reduce.js');
  function max(comparer) {
    var max = typeof comparer === 'function' ? function (x, y) {
      return comparer(x, y) > 0 ? x : y;
    } : function (x, y) {
      return x > y ? x : y;
    };
    return this.lift(new reduce_1.ReduceOperator(max));
  }
  exports.max = max;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/max.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/max.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var max_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/max.js');
  Observable_1.Observable.prototype.max = max_1.max;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/merge.js', ['npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/operator/mergeAll.js', 'npm:rxjs@5.0.0-beta.12/util/isScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var mergeAll_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/mergeAll.js');
  var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
  function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    observables.unshift(this);
    return mergeStatic.apply(this, observables);
  }
  exports.merge = merge;
  function mergeStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if (isScheduler_1.isScheduler(last)) {
      scheduler = observables.pop();
      if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
        concurrent = observables.pop();
      }
    } else if (typeof last === 'number') {
      concurrent = observables.pop();
    }
    if (observables.length === 1) {
      return observables[0];
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(concurrent));
  }
  exports.mergeStatic = mergeStatic;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/merge.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/merge.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var merge_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/merge.js');
  Observable_1.Observable.prototype.merge = merge_1.merge;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/mergeAll.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/mergeAll.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var mergeAll_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/mergeAll.js');
  Observable_1.Observable.prototype.mergeAll = mergeAll_1.mergeAll;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/mergeMap.js', ['npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }
    if (typeof resultSelector === 'number') {
      concurrent = resultSelector;
      resultSelector = null;
    }
    return this.lift(new MergeMapOperator(project, resultSelector, concurrent));
  }
  exports.mergeMap = mergeMap;
  var MergeMapOperator = function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
      if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
      }
      this.project = project;
      this.resultSelector = resultSelector;
      this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
      return source._subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
    };
    return MergeMapOperator;
  }();
  exports.MergeMapOperator = MergeMapOperator;
  var MergeMapSubscriber = function (_super) {
    __extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
      if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
      }
      _super.call(this, destination);
      this.project = project;
      this.resultSelector = resultSelector;
      this.concurrent = concurrent;
      this.hasCompleted = false;
      this.buffer = [];
      this.active = 0;
      this.index = 0;
    }
    MergeMapSubscriber.prototype._next = function (value) {
      if (this.active < this.concurrent) {
        this._tryNext(value);
      } else {
        this.buffer.push(value);
      }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
      var result;
      var index = this.index++;
      try {
        result = this.project(value, index);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.active++;
      this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
      this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
      this.hasCompleted = true;
      if (this.active === 0 && this.buffer.length === 0) {
        this.destination.complete();
      }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      if (this.resultSelector) {
        this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
      } else {
        this.destination.next(innerValue);
      }
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
      var result;
      try {
        result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.destination.next(result);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
      var buffer = this.buffer;
      this.remove(innerSub);
      this.active--;
      if (buffer.length > 0) {
        this._next(buffer.shift());
      } else if (this.active === 0 && this.hasCompleted) {
        this.destination.complete();
      }
    };
    return MergeMapSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.MergeMapSubscriber = MergeMapSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/mergeMap.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/mergeMap.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var mergeMap_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/mergeMap.js');
  Observable_1.Observable.prototype.mergeMap = mergeMap_1.mergeMap;
  Observable_1.Observable.prototype.flatMap = mergeMap_1.mergeMap;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/mergeMapTo.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function mergeMapTo(innerObservable, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }
    if (typeof resultSelector === 'number') {
      concurrent = resultSelector;
      resultSelector = null;
    }
    return this.lift(new MergeMapToOperator(innerObservable, resultSelector, concurrent));
  }
  exports.mergeMapTo = mergeMapTo;
  var MergeMapToOperator = function () {
    function MergeMapToOperator(ish, resultSelector, concurrent) {
      if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
      }
      this.ish = ish;
      this.resultSelector = resultSelector;
      this.concurrent = concurrent;
    }
    MergeMapToOperator.prototype.call = function (observer, source) {
      return source._subscribe(new MergeMapToSubscriber(observer, this.ish, this.resultSelector, this.concurrent));
    };
    return MergeMapToOperator;
  }();
  exports.MergeMapToOperator = MergeMapToOperator;
  var MergeMapToSubscriber = function (_super) {
    __extends(MergeMapToSubscriber, _super);
    function MergeMapToSubscriber(destination, ish, resultSelector, concurrent) {
      if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
      }
      _super.call(this, destination);
      this.ish = ish;
      this.resultSelector = resultSelector;
      this.concurrent = concurrent;
      this.hasCompleted = false;
      this.buffer = [];
      this.active = 0;
      this.index = 0;
    }
    MergeMapToSubscriber.prototype._next = function (value) {
      if (this.active < this.concurrent) {
        var resultSelector = this.resultSelector;
        var index = this.index++;
        var ish = this.ish;
        var destination = this.destination;
        this.active++;
        this._innerSub(ish, destination, resultSelector, value, index);
      } else {
        this.buffer.push(value);
      }
    };
    MergeMapToSubscriber.prototype._innerSub = function (ish, destination, resultSelector, value, index) {
      this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeMapToSubscriber.prototype._complete = function () {
      this.hasCompleted = true;
      if (this.active === 0 && this.buffer.length === 0) {
        this.destination.complete();
      }
    };
    MergeMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      var _a = this,
          resultSelector = _a.resultSelector,
          destination = _a.destination;
      if (resultSelector) {
        this.trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
      } else {
        destination.next(innerValue);
      }
    };
    MergeMapToSubscriber.prototype.trySelectResult = function (outerValue, innerValue, outerIndex, innerIndex) {
      var _a = this,
          resultSelector = _a.resultSelector,
          destination = _a.destination;
      var result;
      try {
        result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
      } catch (err) {
        destination.error(err);
        return;
      }
      destination.next(result);
    };
    MergeMapToSubscriber.prototype.notifyError = function (err) {
      this.destination.error(err);
    };
    MergeMapToSubscriber.prototype.notifyComplete = function (innerSub) {
      var buffer = this.buffer;
      this.remove(innerSub);
      this.active--;
      if (buffer.length > 0) {
        this._next(buffer.shift());
      } else if (this.active === 0 && this.hasCompleted) {
        this.destination.complete();
      }
    };
    return MergeMapToSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.MergeMapToSubscriber = MergeMapToSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/mergeMapTo.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/mergeMapTo.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var mergeMapTo_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/mergeMapTo.js');
  Observable_1.Observable.prototype.flatMapTo = mergeMapTo_1.mergeMapTo;
  Observable_1.Observable.prototype.mergeMapTo = mergeMapTo_1.mergeMapTo;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/mergeScan.js', ['npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  function mergeScan(project, seed, concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }
    return this.lift(new MergeScanOperator(project, seed, concurrent));
  }
  exports.mergeScan = mergeScan;
  var MergeScanOperator = function () {
    function MergeScanOperator(project, seed, concurrent) {
      this.project = project;
      this.seed = seed;
      this.concurrent = concurrent;
    }
    MergeScanOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new MergeScanSubscriber(subscriber, this.project, this.seed, this.concurrent));
    };
    return MergeScanOperator;
  }();
  exports.MergeScanOperator = MergeScanOperator;
  var MergeScanSubscriber = function (_super) {
    __extends(MergeScanSubscriber, _super);
    function MergeScanSubscriber(destination, project, acc, concurrent) {
      _super.call(this, destination);
      this.project = project;
      this.acc = acc;
      this.concurrent = concurrent;
      this.hasValue = false;
      this.hasCompleted = false;
      this.buffer = [];
      this.active = 0;
      this.index = 0;
    }
    MergeScanSubscriber.prototype._next = function (value) {
      if (this.active < this.concurrent) {
        var index = this.index++;
        var ish = tryCatch_1.tryCatch(this.project)(this.acc, value);
        var destination = this.destination;
        if (ish === errorObject_1.errorObject) {
          destination.error(errorObject_1.errorObject.e);
        } else {
          this.active++;
          this._innerSub(ish, value, index);
        }
      } else {
        this.buffer.push(value);
      }
    };
    MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
      this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeScanSubscriber.prototype._complete = function () {
      this.hasCompleted = true;
      if (this.active === 0 && this.buffer.length === 0) {
        if (this.hasValue === false) {
          this.destination.next(this.acc);
        }
        this.destination.complete();
      }
    };
    MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      var destination = this.destination;
      this.acc = innerValue;
      this.hasValue = true;
      destination.next(innerValue);
    };
    MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
      var buffer = this.buffer;
      this.remove(innerSub);
      this.active--;
      if (buffer.length > 0) {
        this._next(buffer.shift());
      } else if (this.active === 0 && this.hasCompleted) {
        if (this.hasValue === false) {
          this.destination.next(this.acc);
        }
        this.destination.complete();
      }
    };
    return MergeScanSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.MergeScanSubscriber = MergeScanSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/mergeScan.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/mergeScan.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var mergeScan_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/mergeScan.js');
  Observable_1.Observable.prototype.mergeScan = mergeScan_1.mergeScan;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/min.js', ['npm:rxjs@5.0.0-beta.12/operator/reduce.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var reduce_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/reduce.js');
  function min(comparer) {
    var min = typeof comparer === 'function' ? function (x, y) {
      return comparer(x, y) < 0 ? x : y;
    } : function (x, y) {
      return x < y ? x : y;
    };
    return this.lift(new reduce_1.ReduceOperator(min));
  }
  exports.min = min;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/min.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/min.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var min_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/min.js');
  Observable_1.Observable.prototype.min = min_1.min;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/multicast.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/multicast.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var multicast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/multicast.js');
  Observable_1.Observable.prototype.multicast = multicast_1.multicast;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/observeOn.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/observeOn.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var observeOn_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/observeOn.js');
  Observable_1.Observable.prototype.observeOn = observeOn_1.observeOn;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/PromiseObservable.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/Observable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var PromiseObservable = function (_super) {
    __extends(PromiseObservable, _super);
    function PromiseObservable(promise, scheduler) {
      _super.call(this);
      this.promise = promise;
      this.scheduler = scheduler;
    }
    PromiseObservable.create = function (promise, scheduler) {
      return new PromiseObservable(promise, scheduler);
    };
    PromiseObservable.prototype._subscribe = function (subscriber) {
      var _this = this;
      var promise = this.promise;
      var scheduler = this.scheduler;
      if (scheduler == null) {
        if (this._isScalar) {
          if (!subscriber.closed) {
            subscriber.next(this.value);
            subscriber.complete();
          }
        } else {
          promise.then(function (value) {
            _this.value = value;
            _this._isScalar = true;
            if (!subscriber.closed) {
              subscriber.next(value);
              subscriber.complete();
            }
          }, function (err) {
            if (!subscriber.closed) {
              subscriber.error(err);
            }
          }).then(null, function (err) {
            root_1.root.setTimeout(function () {
              throw err;
            });
          });
        }
      } else {
        if (this._isScalar) {
          if (!subscriber.closed) {
            return scheduler.schedule(dispatchNext, 0, {
              value: this.value,
              subscriber: subscriber
            });
          }
        } else {
          promise.then(function (value) {
            _this.value = value;
            _this._isScalar = true;
            if (!subscriber.closed) {
              subscriber.add(scheduler.schedule(dispatchNext, 0, {
                value: value,
                subscriber: subscriber
              }));
            }
          }, function (err) {
            if (!subscriber.closed) {
              subscriber.add(scheduler.schedule(dispatchError, 0, {
                err: err,
                subscriber: subscriber
              }));
            }
          }).then(null, function (err) {
            root_1.root.setTimeout(function () {
              throw err;
            });
          });
        }
      }
    };
    return PromiseObservable;
  }(Observable_1.Observable);
  exports.PromiseObservable = PromiseObservable;
  function dispatchNext(arg) {
    var value = arg.value,
        subscriber = arg.subscriber;
    if (!subscriber.closed) {
      subscriber.next(value);
      subscriber.complete();
    }
  }
  function dispatchError(arg) {
    var err = arg.err,
        subscriber = arg.subscriber;
    if (!subscriber.closed) {
      subscriber.error(err);
    }
  }
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/IteratorObservable.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/symbol/iterator.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var iterator_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/iterator.js');
  var IteratorObservable = function (_super) {
    __extends(IteratorObservable, _super);
    function IteratorObservable(iterator, scheduler) {
      _super.call(this);
      this.scheduler = scheduler;
      if (iterator == null) {
        throw new Error('iterator cannot be null.');
      }
      this.iterator = getIterator(iterator);
    }
    IteratorObservable.create = function (iterator, scheduler) {
      return new IteratorObservable(iterator, scheduler);
    };
    IteratorObservable.dispatch = function (state) {
      var index = state.index,
          hasError = state.hasError,
          iterator = state.iterator,
          subscriber = state.subscriber;
      if (hasError) {
        subscriber.error(state.error);
        return;
      }
      var result = iterator.next();
      if (result.done) {
        subscriber.complete();
        return;
      }
      subscriber.next(result.value);
      state.index = index + 1;
      if (subscriber.closed) {
        return;
      }
      this.schedule(state);
    };
    IteratorObservable.prototype._subscribe = function (subscriber) {
      var index = 0;
      var _a = this,
          iterator = _a.iterator,
          scheduler = _a.scheduler;
      if (scheduler) {
        return scheduler.schedule(IteratorObservable.dispatch, 0, {
          index: index,
          iterator: iterator,
          subscriber: subscriber
        });
      } else {
        do {
          var result = iterator.next();
          if (result.done) {
            subscriber.complete();
            break;
          } else {
            subscriber.next(result.value);
          }
          if (subscriber.closed) {
            break;
          }
        } while (true);
      }
    };
    return IteratorObservable;
  }(Observable_1.Observable);
  exports.IteratorObservable = IteratorObservable;
  var StringIterator = function () {
    function StringIterator(str, idx, len) {
      if (idx === void 0) {
        idx = 0;
      }
      if (len === void 0) {
        len = str.length;
      }
      this.str = str;
      this.idx = idx;
      this.len = len;
    }
    StringIterator.prototype[iterator_1.$$iterator] = function () {
      return this;
    };
    StringIterator.prototype.next = function () {
      return this.idx < this.len ? {
        done: false,
        value: this.str.charAt(this.idx++)
      } : {
        done: true,
        value: undefined
      };
    };
    return StringIterator;
  }();
  var ArrayIterator = function () {
    function ArrayIterator(arr, idx, len) {
      if (idx === void 0) {
        idx = 0;
      }
      if (len === void 0) {
        len = toLength(arr);
      }
      this.arr = arr;
      this.idx = idx;
      this.len = len;
    }
    ArrayIterator.prototype[iterator_1.$$iterator] = function () {
      return this;
    };
    ArrayIterator.prototype.next = function () {
      return this.idx < this.len ? {
        done: false,
        value: this.arr[this.idx++]
      } : {
        done: true,
        value: undefined
      };
    };
    return ArrayIterator;
  }();
  function getIterator(obj) {
    var i = obj[iterator_1.$$iterator];
    if (!i && typeof obj === 'string') {
      return new StringIterator(obj);
    }
    if (!i && obj.length !== undefined) {
      return new ArrayIterator(obj);
    }
    if (!i) {
      throw new TypeError('object is not iterable');
    }
    return obj[iterator_1.$$iterator]();
  }
  var maxSafeInteger = Math.pow(2, 53) - 1;
  function toLength(o) {
    var len = +o.length;
    if (isNaN(len)) {
      return 0;
    }
    if (len === 0 || !numberIsFinite(len)) {
      return len;
    }
    len = sign(len) * Math.floor(Math.abs(len));
    if (len <= 0) {
      return 0;
    }
    if (len > maxSafeInteger) {
      return maxSafeInteger;
    }
    return len;
  }
  function numberIsFinite(value) {
    return typeof value === 'number' && root_1.root.isFinite(value);
  }
  function sign(value) {
    var valueAsNumber = +value;
    if (valueAsNumber === 0) {
      return valueAsNumber;
    }
    if (isNaN(valueAsNumber)) {
      return valueAsNumber;
    }
    return valueAsNumber < 0 ? -1 : 1;
  }
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/ArrayLikeObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/ScalarObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var ScalarObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ScalarObservable.js');
  var EmptyObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js');
  var ArrayLikeObservable = function (_super) {
    __extends(ArrayLikeObservable, _super);
    function ArrayLikeObservable(arrayLike, scheduler) {
      _super.call(this);
      this.arrayLike = arrayLike;
      this.scheduler = scheduler;
      if (!scheduler && arrayLike.length === 1) {
        this._isScalar = true;
        this.value = arrayLike[0];
      }
    }
    ArrayLikeObservable.create = function (arrayLike, scheduler) {
      var length = arrayLike.length;
      if (length === 0) {
        return new EmptyObservable_1.EmptyObservable();
      } else if (length === 1) {
        return new ScalarObservable_1.ScalarObservable(arrayLike[0], scheduler);
      } else {
        return new ArrayLikeObservable(arrayLike, scheduler);
      }
    };
    ArrayLikeObservable.dispatch = function (state) {
      var arrayLike = state.arrayLike,
          index = state.index,
          length = state.length,
          subscriber = state.subscriber;
      if (subscriber.closed) {
        return;
      }
      if (index >= length) {
        subscriber.complete();
        return;
      }
      subscriber.next(arrayLike[index]);
      state.index = index + 1;
      this.schedule(state);
    };
    ArrayLikeObservable.prototype._subscribe = function (subscriber) {
      var index = 0;
      var _a = this,
          arrayLike = _a.arrayLike,
          scheduler = _a.scheduler;
      var length = arrayLike.length;
      if (scheduler) {
        return scheduler.schedule(ArrayLikeObservable.dispatch, 0, {
          arrayLike: arrayLike,
          index: index,
          length: length,
          subscriber: subscriber
        });
      } else {
        for (var i = 0; i < length && !subscriber.closed; i++) {
          subscriber.next(arrayLike[i]);
        }
        subscriber.complete();
      }
    };
    return ArrayLikeObservable;
  }(Observable_1.Observable);
  exports.ArrayLikeObservable = ArrayLikeObservable;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/FromObservable.js', ['npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/util/isPromise.js', 'npm:rxjs@5.0.0-beta.12/observable/PromiseObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/IteratorObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/ArrayLikeObservable.js', 'npm:rxjs@5.0.0-beta.12/symbol/iterator.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/observeOn.js', 'npm:rxjs@5.0.0-beta.12/symbol/observable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var isPromise_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isPromise.js');
  var PromiseObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/PromiseObservable.js');
  var IteratorObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/IteratorObservable.js');
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var ArrayLikeObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayLikeObservable.js');
  var iterator_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/iterator.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var observeOn_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/observeOn.js');
  var observable_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/observable.js');
  var isArrayLike = function (x) {
    return x && typeof x.length === 'number';
  };
  var FromObservable = function (_super) {
    __extends(FromObservable, _super);
    function FromObservable(ish, scheduler) {
      _super.call(this, null);
      this.ish = ish;
      this.scheduler = scheduler;
    }
    FromObservable.create = function (ish, scheduler) {
      if (ish != null) {
        if (typeof ish[observable_1.$$observable] === 'function') {
          if (ish instanceof Observable_1.Observable && !scheduler) {
            return ish;
          }
          return new FromObservable(ish, scheduler);
        } else if (isArray_1.isArray(ish)) {
          return new ArrayObservable_1.ArrayObservable(ish, scheduler);
        } else if (isPromise_1.isPromise(ish)) {
          return new PromiseObservable_1.PromiseObservable(ish, scheduler);
        } else if (typeof ish[iterator_1.$$iterator] === 'function' || typeof ish === 'string') {
          return new IteratorObservable_1.IteratorObservable(ish, scheduler);
        } else if (isArrayLike(ish)) {
          return new ArrayLikeObservable_1.ArrayLikeObservable(ish, scheduler);
        }
      }
      throw new TypeError((ish !== null && typeof ish || ish) + ' is not observable');
    };
    FromObservable.prototype._subscribe = function (subscriber) {
      var ish = this.ish;
      var scheduler = this.scheduler;
      if (scheduler == null) {
        return ish[observable_1.$$observable]().subscribe(subscriber);
      } else {
        return ish[observable_1.$$observable]().subscribe(new observeOn_1.ObserveOnSubscriber(subscriber, scheduler, 0));
      }
    };
    return FromObservable;
  }(Observable_1.Observable);
  exports.FromObservable = FromObservable;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/onErrorResumeNext.js', ['npm:rxjs@5.0.0-beta.12/observable/FromObservable.js', 'npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var FromObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/FromObservable.js');
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function onErrorResumeNext() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      nextSources[_i - 0] = arguments[_i];
    }
    if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
      nextSources = nextSources[0];
    }
    return this.lift(new OnErrorResumeNextOperator(nextSources));
  }
  exports.onErrorResumeNext = onErrorResumeNext;
  function onErrorResumeNextStatic() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      nextSources[_i - 0] = arguments[_i];
    }
    var source = null;
    if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
      nextSources = nextSources[0];
    }
    source = nextSources.shift();
    return new FromObservable_1.FromObservable(source, null).lift(new OnErrorResumeNextOperator(nextSources));
  }
  exports.onErrorResumeNextStatic = onErrorResumeNextStatic;
  var OnErrorResumeNextOperator = function () {
    function OnErrorResumeNextOperator(nextSources) {
      this.nextSources = nextSources;
    }
    OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
    };
    return OnErrorResumeNextOperator;
  }();
  var OnErrorResumeNextSubscriber = function (_super) {
    __extends(OnErrorResumeNextSubscriber, _super);
    function OnErrorResumeNextSubscriber(destination, nextSources) {
      _super.call(this, destination);
      this.destination = destination;
      this.nextSources = nextSources;
    }
    OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
      this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
      this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._error = function (err) {
      this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._complete = function () {
      this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
      var next = this.nextSources.shift();
      if (next) {
        this.add(subscribeToResult_1.subscribeToResult(this, next));
      } else {
        this.destination.complete();
      }
    };
    return OnErrorResumeNextSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/onErrorResumeNext.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/onErrorResumeNext.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var onErrorResumeNext_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/onErrorResumeNext.js');
  Observable_1.Observable.prototype.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNext;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/pairwise.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function pairwise() {
    return this.lift(new PairwiseOperator());
  }
  exports.pairwise = pairwise;
  var PairwiseOperator = function () {
    function PairwiseOperator() {}
    PairwiseOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new PairwiseSubscriber(subscriber));
    };
    return PairwiseOperator;
  }();
  var PairwiseSubscriber = function (_super) {
    __extends(PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
      _super.call(this, destination);
      this.hasPrev = false;
    }
    PairwiseSubscriber.prototype._next = function (value) {
      if (this.hasPrev) {
        this.destination.next([this.prev, value]);
      } else {
        this.hasPrev = true;
      }
      this.prev = value;
    };
    return PairwiseSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/pairwise.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/pairwise.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var pairwise_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/pairwise.js');
  Observable_1.Observable.prototype.pairwise = pairwise_1.pairwise;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/not.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function not(pred, thisArg) {
        function notPred() {
            return !notPred.pred.apply(notPred.thisArg, arguments);
        }
        notPred.pred = pred;
        notPred.thisArg = thisArg;
        return notPred;
    }
    exports.not = not;
    

    return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/filter.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function filter(predicate, thisArg) {
    return this.lift(new FilterOperator(predicate, thisArg));
  }
  exports.filter = filter;
  var FilterOperator = function () {
    function FilterOperator(predicate, thisArg) {
      this.predicate = predicate;
      this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    };
    return FilterOperator;
  }();
  var FilterSubscriber = function (_super) {
    __extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.thisArg = thisArg;
      this.count = 0;
      this.predicate = predicate;
    }
    FilterSubscriber.prototype._next = function (value) {
      var result;
      try {
        result = this.predicate.call(this.thisArg, value, this.count++);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      if (result) {
        this.destination.next(value);
      }
    };
    return FilterSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/partition.js', ['npm:rxjs@5.0.0-beta.12/util/not.js', 'npm:rxjs@5.0.0-beta.12/operator/filter.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var not_1 = $__require('npm:rxjs@5.0.0-beta.12/util/not.js');
  var filter_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/filter.js');
  function partition(predicate, thisArg) {
    return [filter_1.filter.call(this, predicate), filter_1.filter.call(this, not_1.not(predicate, thisArg))];
  }
  exports.partition = partition;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/partition.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/partition.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var partition_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/partition.js');
  Observable_1.Observable.prototype.partition = partition_1.partition;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/pluck.js', ['npm:rxjs@5.0.0-beta.12/operator/map.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var map_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/map.js');
  function pluck() {
    var properties = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      properties[_i - 0] = arguments[_i];
    }
    var length = properties.length;
    if (length === 0) {
      throw new Error('list of properties cannot be empty.');
    }
    return map_1.map.call(this, plucker(properties, length));
  }
  exports.pluck = pluck;
  function plucker(props, length) {
    var mapper = function (x) {
      var currentProp = x;
      for (var i = 0; i < length; i++) {
        var p = currentProp[props[i]];
        if (typeof p !== 'undefined') {
          currentProp = p;
        } else {
          return undefined;
        }
      }
      return currentProp;
    };
    return mapper;
  }
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/pluck.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/pluck.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var pluck_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/pluck.js');
  Observable_1.Observable.prototype.pluck = pluck_1.pluck;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/publish.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/operator/multicast.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var multicast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/multicast.js');
  function publish(selector) {
    return selector ? multicast_1.multicast.call(this, function () {
      return new Subject_1.Subject();
    }, selector) : multicast_1.multicast.call(this, new Subject_1.Subject());
  }
  exports.publish = publish;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/publish.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/publish.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var publish_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/publish.js');
  Observable_1.Observable.prototype.publish = publish_1.publish;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/publishBehavior.js', ['npm:rxjs@5.0.0-beta.12/BehaviorSubject.js', 'npm:rxjs@5.0.0-beta.12/operator/multicast.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var BehaviorSubject_1 = $__require('npm:rxjs@5.0.0-beta.12/BehaviorSubject.js');
  var multicast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/multicast.js');
  function publishBehavior(value) {
    return multicast_1.multicast.call(this, new BehaviorSubject_1.BehaviorSubject(value));
  }
  exports.publishBehavior = publishBehavior;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/publishBehavior.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/publishBehavior.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var publishBehavior_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/publishBehavior.js');
  Observable_1.Observable.prototype.publishBehavior = publishBehavior_1.publishBehavior;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/publishReplay.js', ['npm:rxjs@5.0.0-beta.12/ReplaySubject.js', 'npm:rxjs@5.0.0-beta.12/operator/multicast.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var ReplaySubject_1 = $__require('npm:rxjs@5.0.0-beta.12/ReplaySubject.js');
  var multicast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/multicast.js');
  function publishReplay(bufferSize, windowTime, scheduler) {
    if (bufferSize === void 0) {
      bufferSize = Number.POSITIVE_INFINITY;
    }
    if (windowTime === void 0) {
      windowTime = Number.POSITIVE_INFINITY;
    }
    return multicast_1.multicast.call(this, new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler));
  }
  exports.publishReplay = publishReplay;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/publishReplay.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/publishReplay.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var publishReplay_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/publishReplay.js');
  Observable_1.Observable.prototype.publishReplay = publishReplay_1.publishReplay;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/publishLast.js', ['npm:rxjs@5.0.0-beta.12/AsyncSubject.js', 'npm:rxjs@5.0.0-beta.12/operator/multicast.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var AsyncSubject_1 = $__require('npm:rxjs@5.0.0-beta.12/AsyncSubject.js');
  var multicast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/multicast.js');
  function publishLast() {
    return multicast_1.multicast.call(this, new AsyncSubject_1.AsyncSubject());
  }
  exports.publishLast = publishLast;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/publishLast.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/publishLast.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var publishLast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/publishLast.js');
  Observable_1.Observable.prototype.publishLast = publishLast_1.publishLast;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/race.js', ['npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
      observables = observables[0];
    }
    observables.unshift(this);
    return raceStatic.apply(this, observables);
  }
  exports.race = race;
  function raceStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    if (observables.length === 1) {
      if (isArray_1.isArray(observables[0])) {
        observables = observables[0];
      } else {
        return observables[0];
      }
    }
    return new ArrayObservable_1.ArrayObservable(observables).lift(new RaceOperator());
  }
  exports.raceStatic = raceStatic;
  var RaceOperator = function () {
    function RaceOperator() {}
    RaceOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new RaceSubscriber(subscriber));
    };
    return RaceOperator;
  }();
  exports.RaceOperator = RaceOperator;
  var RaceSubscriber = function (_super) {
    __extends(RaceSubscriber, _super);
    function RaceSubscriber(destination) {
      _super.call(this, destination);
      this.hasFirst = false;
      this.observables = [];
      this.subscriptions = [];
    }
    RaceSubscriber.prototype._next = function (observable) {
      this.observables.push(observable);
    };
    RaceSubscriber.prototype._complete = function () {
      var observables = this.observables;
      var len = observables.length;
      if (len === 0) {
        this.destination.complete();
      } else {
        for (var i = 0; i < len; i++) {
          var observable = observables[i];
          var subscription = subscribeToResult_1.subscribeToResult(this, observable, observable, i);
          if (this.subscriptions) {
            this.subscriptions.push(subscription);
            this.add(subscription);
          }
        }
        this.observables = null;
      }
    };
    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      if (!this.hasFirst) {
        this.hasFirst = true;
        for (var i = 0; i < this.subscriptions.length; i++) {
          if (i !== outerIndex) {
            var subscription = this.subscriptions[i];
            subscription.unsubscribe();
            this.remove(subscription);
          }
        }
        this.subscriptions = null;
      }
      this.destination.next(innerValue);
    };
    return RaceSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.RaceSubscriber = RaceSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/race.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/race.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var race_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/race.js');
  Observable_1.Observable.prototype.race = race_1.race;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/reduce.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  function reduce(accumulator, seed) {
    return this.lift(new ReduceOperator(accumulator, seed));
  }
  exports.reduce = reduce;
  var ReduceOperator = function () {
    function ReduceOperator(accumulator, seed) {
      this.accumulator = accumulator;
      this.seed = seed;
    }
    ReduceOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new ReduceSubscriber(subscriber, this.accumulator, this.seed));
    };
    return ReduceOperator;
  }();
  exports.ReduceOperator = ReduceOperator;
  var ReduceSubscriber = function (_super) {
    __extends(ReduceSubscriber, _super);
    function ReduceSubscriber(destination, accumulator, seed) {
      _super.call(this, destination);
      this.accumulator = accumulator;
      this.hasValue = false;
      this.acc = seed;
      this.accumulator = accumulator;
      this.hasSeed = typeof seed !== 'undefined';
    }
    ReduceSubscriber.prototype._next = function (value) {
      if (this.hasValue || (this.hasValue = this.hasSeed)) {
        this._tryReduce(value);
      } else {
        this.acc = value;
        this.hasValue = true;
      }
    };
    ReduceSubscriber.prototype._tryReduce = function (value) {
      var result;
      try {
        result = this.accumulator(this.acc, value);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.acc = result;
    };
    ReduceSubscriber.prototype._complete = function () {
      if (this.hasValue || this.hasSeed) {
        this.destination.next(this.acc);
      }
      this.destination.complete();
    };
    return ReduceSubscriber;
  }(Subscriber_1.Subscriber);
  exports.ReduceSubscriber = ReduceSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/reduce.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/reduce.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var reduce_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/reduce.js');
  Observable_1.Observable.prototype.reduce = reduce_1.reduce;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/repeat.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var EmptyObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js');
  function repeat(count) {
    if (count === void 0) {
      count = -1;
    }
    if (count === 0) {
      return new EmptyObservable_1.EmptyObservable();
    } else if (count < 0) {
      return this.lift(new RepeatOperator(-1, this));
    } else {
      return this.lift(new RepeatOperator(count - 1, this));
    }
  }
  exports.repeat = repeat;
  var RepeatOperator = function () {
    function RepeatOperator(count, source) {
      this.count = count;
      this.source = source;
    }
    RepeatOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    };
    return RepeatOperator;
  }();
  var RepeatSubscriber = function (_super) {
    __extends(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
      _super.call(this, destination);
      this.count = count;
      this.source = source;
    }
    RepeatSubscriber.prototype.complete = function () {
      if (!this.isStopped) {
        var _a = this,
            source = _a.source,
            count = _a.count;
        if (count === 0) {
          return _super.prototype.complete.call(this);
        } else if (count > -1) {
          this.count = count - 1;
        }
        this.unsubscribe();
        this.isStopped = false;
        this.closed = false;
        source.subscribe(this);
      }
    };
    return RepeatSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/repeat.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/repeat.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var repeat_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/repeat.js');
  Observable_1.Observable.prototype.repeat = repeat_1.repeat;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/repeatWhen.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function repeatWhen(notifier) {
    return this.lift(new RepeatWhenOperator(notifier, this));
  }
  exports.repeatWhen = repeatWhen;
  var RepeatWhenOperator = function () {
    function RepeatWhenOperator(notifier, source) {
      this.notifier = notifier;
      this.source = source;
    }
    RepeatWhenOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, this.source));
    };
    return RepeatWhenOperator;
  }();
  var RepeatWhenSubscriber = function (_super) {
    __extends(RepeatWhenSubscriber, _super);
    function RepeatWhenSubscriber(destination, notifier, source) {
      _super.call(this, destination);
      this.notifier = notifier;
      this.source = source;
    }
    RepeatWhenSubscriber.prototype.complete = function () {
      if (!this.isStopped) {
        var notifications = this.notifications;
        var retries = this.retries;
        var retriesSubscription = this.retriesSubscription;
        if (!retries) {
          notifications = new Subject_1.Subject();
          retries = tryCatch_1.tryCatch(this.notifier)(notifications);
          if (retries === errorObject_1.errorObject) {
            return _super.prototype.complete.call(this);
          }
          retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
        } else {
          this.notifications = null;
          this.retriesSubscription = null;
        }
        this.unsubscribe();
        this.closed = false;
        this.notifications = notifications;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        notifications.next();
      }
    };
    RepeatWhenSubscriber.prototype._unsubscribe = function () {
      var _a = this,
          notifications = _a.notifications,
          retriesSubscription = _a.retriesSubscription;
      if (notifications) {
        notifications.unsubscribe();
        this.notifications = null;
      }
      if (retriesSubscription) {
        retriesSubscription.unsubscribe();
        this.retriesSubscription = null;
      }
      this.retries = null;
    };
    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      var _a = this,
          notifications = _a.notifications,
          retries = _a.retries,
          retriesSubscription = _a.retriesSubscription;
      this.notifications = null;
      this.retries = null;
      this.retriesSubscription = null;
      this.unsubscribe();
      this.isStopped = false;
      this.closed = false;
      this.notifications = notifications;
      this.retries = retries;
      this.retriesSubscription = retriesSubscription;
      this.source.subscribe(this);
    };
    return RepeatWhenSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/repeatWhen.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/repeatWhen.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var repeatWhen_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/repeatWhen.js');
  Observable_1.Observable.prototype.repeatWhen = repeatWhen_1.repeatWhen;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/retry.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function retry(count) {
    if (count === void 0) {
      count = -1;
    }
    return this.lift(new RetryOperator(count, this));
  }
  exports.retry = retry;
  var RetryOperator = function () {
    function RetryOperator(count, source) {
      this.count = count;
      this.source = source;
    }
    RetryOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new RetrySubscriber(subscriber, this.count, this.source));
    };
    return RetryOperator;
  }();
  var RetrySubscriber = function (_super) {
    __extends(RetrySubscriber, _super);
    function RetrySubscriber(destination, count, source) {
      _super.call(this, destination);
      this.count = count;
      this.source = source;
    }
    RetrySubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var _a = this,
            source = _a.source,
            count = _a.count;
        if (count === 0) {
          return _super.prototype.error.call(this, err);
        } else if (count > -1) {
          this.count = count - 1;
        }
        this.unsubscribe();
        this.isStopped = false;
        this.closed = false;
        source.subscribe(this);
      }
    };
    return RetrySubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/retry.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/retry.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var retry_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/retry.js');
  Observable_1.Observable.prototype.retry = retry_1.retry;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/retryWhen.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function retryWhen(notifier) {
    return this.lift(new RetryWhenOperator(notifier, this));
  }
  exports.retryWhen = retryWhen;
  var RetryWhenOperator = function () {
    function RetryWhenOperator(notifier, source) {
      this.notifier = notifier;
      this.source = source;
    }
    RetryWhenOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    };
    return RetryWhenOperator;
  }();
  var RetryWhenSubscriber = function (_super) {
    __extends(RetryWhenSubscriber, _super);
    function RetryWhenSubscriber(destination, notifier, source) {
      _super.call(this, destination);
      this.notifier = notifier;
      this.source = source;
    }
    RetryWhenSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var errors = this.errors;
        var retries = this.retries;
        var retriesSubscription = this.retriesSubscription;
        if (!retries) {
          errors = new Subject_1.Subject();
          retries = tryCatch_1.tryCatch(this.notifier)(errors);
          if (retries === errorObject_1.errorObject) {
            return _super.prototype.error.call(this, errorObject_1.errorObject.e);
          }
          retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
        } else {
          this.errors = null;
          this.retriesSubscription = null;
        }
        this.unsubscribe();
        this.closed = false;
        this.errors = errors;
        this.retries = retries;
        this.retriesSubscription = retriesSubscription;
        errors.next(err);
      }
    };
    RetryWhenSubscriber.prototype._unsubscribe = function () {
      var _a = this,
          errors = _a.errors,
          retriesSubscription = _a.retriesSubscription;
      if (errors) {
        errors.unsubscribe();
        this.errors = null;
      }
      if (retriesSubscription) {
        retriesSubscription.unsubscribe();
        this.retriesSubscription = null;
      }
      this.retries = null;
    };
    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      var _a = this,
          errors = _a.errors,
          retries = _a.retries,
          retriesSubscription = _a.retriesSubscription;
      this.errors = null;
      this.retries = null;
      this.retriesSubscription = null;
      this.unsubscribe();
      this.isStopped = false;
      this.closed = false;
      this.errors = errors;
      this.retries = retries;
      this.retriesSubscription = retriesSubscription;
      this.source.subscribe(this);
    };
    return RetryWhenSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/retryWhen.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/retryWhen.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var retryWhen_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/retryWhen.js');
  Observable_1.Observable.prototype.retryWhen = retryWhen_1.retryWhen;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/sample.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function sample(notifier) {
    return this.lift(new SampleOperator(notifier));
  }
  exports.sample = sample;
  var SampleOperator = function () {
    function SampleOperator(notifier) {
      this.notifier = notifier;
    }
    SampleOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SampleSubscriber(subscriber, this.notifier));
    };
    return SampleOperator;
  }();
  var SampleSubscriber = function (_super) {
    __extends(SampleSubscriber, _super);
    function SampleSubscriber(destination, notifier) {
      _super.call(this, destination);
      this.hasValue = false;
      this.add(subscribeToResult_1.subscribeToResult(this, notifier));
    }
    SampleSubscriber.prototype._next = function (value) {
      this.value = value;
      this.hasValue = true;
    };
    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.emitValue();
    };
    SampleSubscriber.prototype.notifyComplete = function () {
      this.emitValue();
    };
    SampleSubscriber.prototype.emitValue = function () {
      if (this.hasValue) {
        this.hasValue = false;
        this.destination.next(this.value);
      }
    };
    return SampleSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/sample.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/sample.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var sample_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/sample.js');
  Observable_1.Observable.prototype.sample = sample_1.sample;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/sampleTime.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  function sampleTime(period, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    return this.lift(new SampleTimeOperator(period, scheduler));
  }
  exports.sampleTime = sampleTime;
  var SampleTimeOperator = function () {
    function SampleTimeOperator(period, scheduler) {
      this.period = period;
      this.scheduler = scheduler;
    }
    SampleTimeOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
    };
    return SampleTimeOperator;
  }();
  var SampleTimeSubscriber = function (_super) {
    __extends(SampleTimeSubscriber, _super);
    function SampleTimeSubscriber(destination, period, scheduler) {
      _super.call(this, destination);
      this.period = period;
      this.scheduler = scheduler;
      this.hasValue = false;
      this.add(scheduler.schedule(dispatchNotification, period, {
        subscriber: this,
        period: period
      }));
    }
    SampleTimeSubscriber.prototype._next = function (value) {
      this.lastValue = value;
      this.hasValue = true;
    };
    SampleTimeSubscriber.prototype.notifyNext = function () {
      if (this.hasValue) {
        this.hasValue = false;
        this.destination.next(this.lastValue);
      }
    };
    return SampleTimeSubscriber;
  }(Subscriber_1.Subscriber);
  function dispatchNotification(state) {
    var subscriber = state.subscriber,
        period = state.period;
    subscriber.notifyNext();
    this.schedule(state, period);
  }
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/sampleTime.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/sampleTime.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var sampleTime_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/sampleTime.js');
  Observable_1.Observable.prototype.sampleTime = sampleTime_1.sampleTime;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/scan.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  function scan(accumulator, seed) {
    return this.lift(new ScanOperator(accumulator, seed));
  }
  exports.scan = scan;
  var ScanOperator = function () {
    function ScanOperator(accumulator, seed) {
      this.accumulator = accumulator;
      this.seed = seed;
    }
    ScanOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed));
    };
    return ScanOperator;
  }();
  var ScanSubscriber = function (_super) {
    __extends(ScanSubscriber, _super);
    function ScanSubscriber(destination, accumulator, seed) {
      _super.call(this, destination);
      this.accumulator = accumulator;
      this.index = 0;
      this.accumulatorSet = false;
      this.seed = seed;
      this.accumulatorSet = typeof seed !== 'undefined';
    }
    Object.defineProperty(ScanSubscriber.prototype, "seed", {
      get: function () {
        return this._seed;
      },
      set: function (value) {
        this.accumulatorSet = true;
        this._seed = value;
      },
      enumerable: true,
      configurable: true
    });
    ScanSubscriber.prototype._next = function (value) {
      if (!this.accumulatorSet) {
        this.seed = value;
        this.destination.next(value);
      } else {
        return this._tryNext(value);
      }
    };
    ScanSubscriber.prototype._tryNext = function (value) {
      var index = this.index++;
      var result;
      try {
        result = this.accumulator(this.seed, value, index);
      } catch (err) {
        this.destination.error(err);
      }
      this.seed = result;
      this.destination.next(result);
    };
    return ScanSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/scan.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/scan.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var scan_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/scan.js');
  Observable_1.Observable.prototype.scan = scan_1.scan;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/sequenceEqual.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  function sequenceEqual(compareTo, comparor) {
    return this.lift(new SequenceEqualOperator(compareTo, comparor));
  }
  exports.sequenceEqual = sequenceEqual;
  var SequenceEqualOperator = function () {
    function SequenceEqualOperator(compareTo, comparor) {
      this.compareTo = compareTo;
      this.comparor = comparor;
    }
    SequenceEqualOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparor));
    };
    return SequenceEqualOperator;
  }();
  exports.SequenceEqualOperator = SequenceEqualOperator;
  var SequenceEqualSubscriber = function (_super) {
    __extends(SequenceEqualSubscriber, _super);
    function SequenceEqualSubscriber(destination, compareTo, comparor) {
      _super.call(this, destination);
      this.compareTo = compareTo;
      this.comparor = comparor;
      this._a = [];
      this._b = [];
      this._oneComplete = false;
      this.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, this)));
    }
    SequenceEqualSubscriber.prototype._next = function (value) {
      if (this._oneComplete && this._b.length === 0) {
        this.emit(false);
      } else {
        this._a.push(value);
        this.checkValues();
      }
    };
    SequenceEqualSubscriber.prototype._complete = function () {
      if (this._oneComplete) {
        this.emit(this._a.length === 0 && this._b.length === 0);
      } else {
        this._oneComplete = true;
      }
    };
    SequenceEqualSubscriber.prototype.checkValues = function () {
      var _c = this,
          _a = _c._a,
          _b = _c._b,
          comparor = _c.comparor;
      while (_a.length > 0 && _b.length > 0) {
        var a = _a.shift();
        var b = _b.shift();
        var areEqual = false;
        if (comparor) {
          areEqual = tryCatch_1.tryCatch(comparor)(a, b);
          if (areEqual === errorObject_1.errorObject) {
            this.destination.error(errorObject_1.errorObject.e);
          }
        } else {
          areEqual = a === b;
        }
        if (!areEqual) {
          this.emit(false);
        }
      }
    };
    SequenceEqualSubscriber.prototype.emit = function (value) {
      var destination = this.destination;
      destination.next(value);
      destination.complete();
    };
    SequenceEqualSubscriber.prototype.nextB = function (value) {
      if (this._oneComplete && this._a.length === 0) {
        this.emit(false);
      } else {
        this._b.push(value);
        this.checkValues();
      }
    };
    return SequenceEqualSubscriber;
  }(Subscriber_1.Subscriber);
  exports.SequenceEqualSubscriber = SequenceEqualSubscriber;
  var SequenceEqualCompareToSubscriber = function (_super) {
    __extends(SequenceEqualCompareToSubscriber, _super);
    function SequenceEqualCompareToSubscriber(destination, parent) {
      _super.call(this, destination);
      this.parent = parent;
    }
    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
      this.parent.nextB(value);
    };
    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
      this.parent.error(err);
    };
    SequenceEqualCompareToSubscriber.prototype._complete = function () {
      this.parent._complete();
    };
    return SequenceEqualCompareToSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/sequenceEqual.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/sequenceEqual.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var sequenceEqual_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/sequenceEqual.js');
  Observable_1.Observable.prototype.sequenceEqual = sequenceEqual_1.sequenceEqual;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/multicast.js', ['npm:rxjs@5.0.0-beta.12/observable/MulticastObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/ConnectableObservable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var MulticastObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/MulticastObservable.js');
  var ConnectableObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ConnectableObservable.js');
  function multicast(subjectOrSubjectFactory, selector) {
    var subjectFactory;
    if (typeof subjectOrSubjectFactory === 'function') {
      subjectFactory = subjectOrSubjectFactory;
    } else {
      subjectFactory = function subjectFactory() {
        return subjectOrSubjectFactory;
      };
    }
    return !selector ? new ConnectableObservable_1.ConnectableObservable(this, subjectFactory) : new MulticastObservable_1.MulticastObservable(this, subjectFactory, selector);
  }
  exports.multicast = multicast;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/share.js', ['npm:rxjs@5.0.0-beta.12/operator/multicast.js', 'npm:rxjs@5.0.0-beta.12/Subject.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var multicast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/multicast.js');
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  function shareSubjectFactory() {
    return new Subject_1.Subject();
  }
  function share() {
    return multicast_1.multicast.call(this, shareSubjectFactory).refCount();
  }
  exports.share = share;
  ;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/share.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/share.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var share_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/share.js');
  Observable_1.Observable.prototype.share = share_1.share;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/single.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/EmptyError.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var EmptyError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/EmptyError.js');
  function single(predicate) {
    return this.lift(new SingleOperator(predicate, this));
  }
  exports.single = single;
  var SingleOperator = function () {
    function SingleOperator(predicate, source) {
      this.predicate = predicate;
      this.source = source;
    }
    SingleOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
    };
    return SingleOperator;
  }();
  var SingleSubscriber = function (_super) {
    __extends(SingleSubscriber, _super);
    function SingleSubscriber(destination, predicate, source) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.source = source;
      this.seenValue = false;
      this.index = 0;
    }
    SingleSubscriber.prototype.applySingleValue = function (value) {
      if (this.seenValue) {
        this.destination.error('Sequence contains more than one element');
      } else {
        this.seenValue = true;
        this.singleValue = value;
      }
    };
    SingleSubscriber.prototype._next = function (value) {
      var predicate = this.predicate;
      this.index++;
      if (predicate) {
        this.tryNext(value);
      } else {
        this.applySingleValue(value);
      }
    };
    SingleSubscriber.prototype.tryNext = function (value) {
      try {
        var result = this.predicate(value, this.index, this.source);
        if (result) {
          this.applySingleValue(value);
        }
      } catch (err) {
        this.destination.error(err);
      }
    };
    SingleSubscriber.prototype._complete = function () {
      var destination = this.destination;
      if (this.index > 0) {
        destination.next(this.seenValue ? this.singleValue : undefined);
        destination.complete();
      } else {
        destination.error(new EmptyError_1.EmptyError());
      }
    };
    return SingleSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/single.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/single.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var single_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/single.js');
  Observable_1.Observable.prototype.single = single_1.single;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/skip.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function skip(total) {
    return this.lift(new SkipOperator(total));
  }
  exports.skip = skip;
  var SkipOperator = function () {
    function SkipOperator(total) {
      this.total = total;
    }
    SkipOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SkipSubscriber(subscriber, this.total));
    };
    return SkipOperator;
  }();
  var SkipSubscriber = function (_super) {
    __extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
      _super.call(this, destination);
      this.total = total;
      this.count = 0;
    }
    SkipSubscriber.prototype._next = function (x) {
      if (++this.count > this.total) {
        this.destination.next(x);
      }
    };
    return SkipSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/skip.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/skip.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var skip_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/skip.js');
  Observable_1.Observable.prototype.skip = skip_1.skip;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/skipUntil.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function skipUntil(notifier) {
    return this.lift(new SkipUntilOperator(notifier));
  }
  exports.skipUntil = skipUntil;
  var SkipUntilOperator = function () {
    function SkipUntilOperator(notifier) {
      this.notifier = notifier;
    }
    SkipUntilOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SkipUntilSubscriber(subscriber, this.notifier));
    };
    return SkipUntilOperator;
  }();
  var SkipUntilSubscriber = function (_super) {
    __extends(SkipUntilSubscriber, _super);
    function SkipUntilSubscriber(destination, notifier) {
      _super.call(this, destination);
      this.hasValue = false;
      this.isInnerStopped = false;
      this.add(subscribeToResult_1.subscribeToResult(this, notifier));
    }
    SkipUntilSubscriber.prototype._next = function (value) {
      if (this.hasValue) {
        _super.prototype._next.call(this, value);
      }
    };
    SkipUntilSubscriber.prototype._complete = function () {
      if (this.isInnerStopped) {
        _super.prototype._complete.call(this);
      } else {
        this.unsubscribe();
      }
    };
    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.hasValue = true;
    };
    SkipUntilSubscriber.prototype.notifyComplete = function () {
      this.isInnerStopped = true;
      if (this.isStopped) {
        _super.prototype._complete.call(this);
      }
    };
    return SkipUntilSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/skipUntil.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/skipUntil.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var skipUntil_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/skipUntil.js');
  Observable_1.Observable.prototype.skipUntil = skipUntil_1.skipUntil;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/skipWhile.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function skipWhile(predicate) {
    return this.lift(new SkipWhileOperator(predicate));
  }
  exports.skipWhile = skipWhile;
  var SkipWhileOperator = function () {
    function SkipWhileOperator(predicate) {
      this.predicate = predicate;
    }
    SkipWhileOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
    };
    return SkipWhileOperator;
  }();
  var SkipWhileSubscriber = function (_super) {
    __extends(SkipWhileSubscriber, _super);
    function SkipWhileSubscriber(destination, predicate) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.skipping = true;
      this.index = 0;
    }
    SkipWhileSubscriber.prototype._next = function (value) {
      var destination = this.destination;
      if (this.skipping) {
        this.tryCallPredicate(value);
      }
      if (!this.skipping) {
        destination.next(value);
      }
    };
    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
      try {
        var result = this.predicate(value, this.index++);
        this.skipping = Boolean(result);
      } catch (err) {
        this.destination.error(err);
      }
    };
    return SkipWhileSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/skipWhile.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/skipWhile.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var skipWhile_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/skipWhile.js');
  Observable_1.Observable.prototype.skipWhile = skipWhile_1.skipWhile;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/mergeAll.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function mergeAll(concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }
    return this.lift(new MergeAllOperator(concurrent));
  }
  exports.mergeAll = mergeAll;
  var MergeAllOperator = function () {
    function MergeAllOperator(concurrent) {
      this.concurrent = concurrent;
    }
    MergeAllOperator.prototype.call = function (observer, source) {
      return source._subscribe(new MergeAllSubscriber(observer, this.concurrent));
    };
    return MergeAllOperator;
  }();
  exports.MergeAllOperator = MergeAllOperator;
  var MergeAllSubscriber = function (_super) {
    __extends(MergeAllSubscriber, _super);
    function MergeAllSubscriber(destination, concurrent) {
      _super.call(this, destination);
      this.concurrent = concurrent;
      this.hasCompleted = false;
      this.buffer = [];
      this.active = 0;
    }
    MergeAllSubscriber.prototype._next = function (observable) {
      if (this.active < this.concurrent) {
        this.active++;
        this.add(subscribeToResult_1.subscribeToResult(this, observable));
      } else {
        this.buffer.push(observable);
      }
    };
    MergeAllSubscriber.prototype._complete = function () {
      this.hasCompleted = true;
      if (this.active === 0 && this.buffer.length === 0) {
        this.destination.complete();
      }
    };
    MergeAllSubscriber.prototype.notifyComplete = function (innerSub) {
      var buffer = this.buffer;
      this.remove(innerSub);
      this.active--;
      if (buffer.length > 0) {
        this._next(buffer.shift());
      } else if (this.active === 0 && this.hasCompleted) {
        this.destination.complete();
      }
    };
    return MergeAllSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  exports.MergeAllSubscriber = MergeAllSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/concat.js', ['npm:rxjs@5.0.0-beta.12/util/isScheduler.js', 'npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/operator/mergeAll.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var mergeAll_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/mergeAll.js');
  function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    return concatStatic.apply(void 0, [this].concat(observables));
  }
  exports.concat = concat;
  function concatStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    var scheduler = null;
    var args = observables;
    if (isScheduler_1.isScheduler(args[observables.length - 1])) {
      scheduler = args.pop();
    }
    return new ArrayObservable_1.ArrayObservable(observables, scheduler).lift(new mergeAll_1.MergeAllOperator(1));
  }
  exports.concatStatic = concatStatic;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/startWith.js', ['npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/ScalarObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js', 'npm:rxjs@5.0.0-beta.12/operator/concat.js', 'npm:rxjs@5.0.0-beta.12/util/isScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var ScalarObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ScalarObservable.js');
  var EmptyObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js');
  var concat_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/concat.js');
  var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
  function startWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      array[_i - 0] = arguments[_i];
    }
    var scheduler = array[array.length - 1];
    if (isScheduler_1.isScheduler(scheduler)) {
      array.pop();
    } else {
      scheduler = null;
    }
    var len = array.length;
    if (len === 1) {
      return concat_1.concatStatic(new ScalarObservable_1.ScalarObservable(array[0], scheduler), this);
    } else if (len > 1) {
      return concat_1.concatStatic(new ArrayObservable_1.ArrayObservable(array, scheduler), this);
    } else {
      return concat_1.concatStatic(new EmptyObservable_1.EmptyObservable(scheduler), this);
    }
  }
  exports.startWith = startWith;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/startWith.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/startWith.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var startWith_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/startWith.js');
  Observable_1.Observable.prototype.startWith = startWith_1.startWith;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/isNumeric.js", ["npm:rxjs@5.0.0-beta.12/util/isArray.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var isArray_1 = $__require("npm:rxjs@5.0.0-beta.12/util/isArray.js");
  function isNumeric(val) {
    return !isArray_1.isArray(val) && val - parseFloat(val) + 1 >= 0;
  }
  exports.isNumeric = isNumeric;
  ;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/SubscribeOnObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/scheduler/asap.js', 'npm:rxjs@5.0.0-beta.12/util/isNumeric.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var asap_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/asap.js');
  var isNumeric_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isNumeric.js');
  var SubscribeOnObservable = function (_super) {
    __extends(SubscribeOnObservable, _super);
    function SubscribeOnObservable(source, delayTime, scheduler) {
      if (delayTime === void 0) {
        delayTime = 0;
      }
      if (scheduler === void 0) {
        scheduler = asap_1.asap;
      }
      _super.call(this);
      this.source = source;
      this.delayTime = delayTime;
      this.scheduler = scheduler;
      if (!isNumeric_1.isNumeric(delayTime) || delayTime < 0) {
        this.delayTime = 0;
      }
      if (!scheduler || typeof scheduler.schedule !== 'function') {
        this.scheduler = asap_1.asap;
      }
    }
    SubscribeOnObservable.create = function (source, delay, scheduler) {
      if (delay === void 0) {
        delay = 0;
      }
      if (scheduler === void 0) {
        scheduler = asap_1.asap;
      }
      return new SubscribeOnObservable(source, delay, scheduler);
    };
    SubscribeOnObservable.dispatch = function (arg) {
      var source = arg.source,
          subscriber = arg.subscriber;
      return source.subscribe(subscriber);
    };
    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
      var delay = this.delayTime;
      var source = this.source;
      var scheduler = this.scheduler;
      return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
        source: source,
        subscriber: subscriber
      });
    };
    return SubscribeOnObservable;
  }(Observable_1.Observable);
  exports.SubscribeOnObservable = SubscribeOnObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/subscribeOn.js", ["npm:rxjs@5.0.0-beta.12/observable/SubscribeOnObservable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var SubscribeOnObservable_1 = $__require("npm:rxjs@5.0.0-beta.12/observable/SubscribeOnObservable.js");
  function subscribeOn(scheduler, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return new SubscribeOnObservable_1.SubscribeOnObservable(this, delay, scheduler);
  }
  exports.subscribeOn = subscribeOn;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/subscribeOn.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/subscribeOn.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var subscribeOn_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/subscribeOn.js');
  Observable_1.Observable.prototype.subscribeOn = subscribeOn_1.subscribeOn;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/switch.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function _switch() {
    return this.lift(new SwitchOperator());
  }
  exports._switch = _switch;
  var SwitchOperator = function () {
    function SwitchOperator() {}
    SwitchOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SwitchSubscriber(subscriber));
    };
    return SwitchOperator;
  }();
  var SwitchSubscriber = function (_super) {
    __extends(SwitchSubscriber, _super);
    function SwitchSubscriber(destination) {
      _super.call(this, destination);
      this.active = 0;
      this.hasCompleted = false;
    }
    SwitchSubscriber.prototype._next = function (value) {
      this.unsubscribeInner();
      this.active++;
      this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, value));
    };
    SwitchSubscriber.prototype._complete = function () {
      this.hasCompleted = true;
      if (this.active === 0) {
        this.destination.complete();
      }
    };
    SwitchSubscriber.prototype.unsubscribeInner = function () {
      this.active = this.active > 0 ? this.active - 1 : 0;
      var innerSubscription = this.innerSubscription;
      if (innerSubscription) {
        innerSubscription.unsubscribe();
        this.remove(innerSubscription);
      }
    };
    SwitchSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.destination.next(innerValue);
    };
    SwitchSubscriber.prototype.notifyError = function (err) {
      this.destination.error(err);
    };
    SwitchSubscriber.prototype.notifyComplete = function () {
      this.unsubscribeInner();
      if (this.hasCompleted && this.active === 0) {
        this.destination.complete();
      }
    };
    return SwitchSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/switch.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/switch.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var switch_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/switch.js');
  Observable_1.Observable.prototype.switch = switch_1._switch;
  Observable_1.Observable.prototype._switch = switch_1._switch;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/switchMap.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function switchMap(project, resultSelector) {
    return this.lift(new SwitchMapOperator(project, resultSelector));
  }
  exports.switchMap = switchMap;
  var SwitchMapOperator = function () {
    function SwitchMapOperator(project, resultSelector) {
      this.project = project;
      this.resultSelector = resultSelector;
    }
    SwitchMapOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SwitchMapSubscriber(subscriber, this.project, this.resultSelector));
    };
    return SwitchMapOperator;
  }();
  var SwitchMapSubscriber = function (_super) {
    __extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project, resultSelector) {
      _super.call(this, destination);
      this.project = project;
      this.resultSelector = resultSelector;
      this.index = 0;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
      var result;
      var index = this.index++;
      try {
        result = this.project(value, index);
      } catch (error) {
        this.destination.error(error);
        return;
      }
      this._innerSub(result, value, index);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
      var innerSubscription = this.innerSubscription;
      if (innerSubscription) {
        innerSubscription.unsubscribe();
      }
      this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, value, index));
    };
    SwitchMapSubscriber.prototype._complete = function () {
      var innerSubscription = this.innerSubscription;
      if (!innerSubscription || innerSubscription.closed) {
        _super.prototype._complete.call(this);
      }
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
      this.innerSubscription = null;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
      this.remove(innerSub);
      this.innerSubscription = null;
      if (this.isStopped) {
        _super.prototype._complete.call(this);
      }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      if (this.resultSelector) {
        this._tryNotifyNext(outerValue, innerValue, outerIndex, innerIndex);
      } else {
        this.destination.next(innerValue);
      }
    };
    SwitchMapSubscriber.prototype._tryNotifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
      var result;
      try {
        result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.destination.next(result);
    };
    return SwitchMapSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/switchMap.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/switchMap.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var switchMap_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/switchMap.js');
  Observable_1.Observable.prototype.switchMap = switchMap_1.switchMap;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/switchMapTo.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function switchMapTo(innerObservable, resultSelector) {
    return this.lift(new SwitchMapToOperator(innerObservable, resultSelector));
  }
  exports.switchMapTo = switchMapTo;
  var SwitchMapToOperator = function () {
    function SwitchMapToOperator(observable, resultSelector) {
      this.observable = observable;
      this.resultSelector = resultSelector;
    }
    SwitchMapToOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new SwitchMapToSubscriber(subscriber, this.observable, this.resultSelector));
    };
    return SwitchMapToOperator;
  }();
  var SwitchMapToSubscriber = function (_super) {
    __extends(SwitchMapToSubscriber, _super);
    function SwitchMapToSubscriber(destination, inner, resultSelector) {
      _super.call(this, destination);
      this.inner = inner;
      this.resultSelector = resultSelector;
      this.index = 0;
    }
    SwitchMapToSubscriber.prototype._next = function (value) {
      var innerSubscription = this.innerSubscription;
      if (innerSubscription) {
        innerSubscription.unsubscribe();
      }
      this.add(this.innerSubscription = subscribeToResult_1.subscribeToResult(this, this.inner, value, this.index++));
    };
    SwitchMapToSubscriber.prototype._complete = function () {
      var innerSubscription = this.innerSubscription;
      if (!innerSubscription || innerSubscription.closed) {
        _super.prototype._complete.call(this);
      }
    };
    SwitchMapToSubscriber.prototype._unsubscribe = function () {
      this.innerSubscription = null;
    };
    SwitchMapToSubscriber.prototype.notifyComplete = function (innerSub) {
      this.remove(innerSub);
      this.innerSubscription = null;
      if (this.isStopped) {
        _super.prototype._complete.call(this);
      }
    };
    SwitchMapToSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      var _a = this,
          resultSelector = _a.resultSelector,
          destination = _a.destination;
      if (resultSelector) {
        this.tryResultSelector(outerValue, innerValue, outerIndex, innerIndex);
      } else {
        destination.next(innerValue);
      }
    };
    SwitchMapToSubscriber.prototype.tryResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
      var _a = this,
          resultSelector = _a.resultSelector,
          destination = _a.destination;
      var result;
      try {
        result = resultSelector(outerValue, innerValue, outerIndex, innerIndex);
      } catch (err) {
        destination.error(err);
        return;
      }
      destination.next(result);
    };
    return SwitchMapToSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/switchMapTo.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/switchMapTo.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var switchMapTo_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/switchMapTo.js');
  Observable_1.Observable.prototype.switchMapTo = switchMapTo_1.switchMapTo;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/take.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js', 'npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var ArgumentOutOfRangeError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js');
  var EmptyObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js');
  function take(count) {
    if (count === 0) {
      return new EmptyObservable_1.EmptyObservable();
    } else {
      return this.lift(new TakeOperator(count));
    }
  }
  exports.take = take;
  var TakeOperator = function () {
    function TakeOperator(total) {
      this.total = total;
      if (this.total < 0) {
        throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
      }
    }
    TakeOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new TakeSubscriber(subscriber, this.total));
    };
    return TakeOperator;
  }();
  var TakeSubscriber = function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
      _super.call(this, destination);
      this.total = total;
      this.count = 0;
    }
    TakeSubscriber.prototype._next = function (value) {
      var total = this.total;
      if (++this.count <= total) {
        this.destination.next(value);
        if (this.count === total) {
          this.destination.complete();
          this.unsubscribe();
        }
      }
    };
    return TakeSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/take.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/take.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var take_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/take.js');
  Observable_1.Observable.prototype.take = take_1.take;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/takeLast.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js', 'npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var ArgumentOutOfRangeError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js');
  var EmptyObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js');
  function takeLast(count) {
    if (count === 0) {
      return new EmptyObservable_1.EmptyObservable();
    } else {
      return this.lift(new TakeLastOperator(count));
    }
  }
  exports.takeLast = takeLast;
  var TakeLastOperator = function () {
    function TakeLastOperator(total) {
      this.total = total;
      if (this.total < 0) {
        throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
      }
    }
    TakeLastOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new TakeLastSubscriber(subscriber, this.total));
    };
    return TakeLastOperator;
  }();
  var TakeLastSubscriber = function (_super) {
    __extends(TakeLastSubscriber, _super);
    function TakeLastSubscriber(destination, total) {
      _super.call(this, destination);
      this.total = total;
      this.ring = new Array();
      this.count = 0;
    }
    TakeLastSubscriber.prototype._next = function (value) {
      var ring = this.ring;
      var total = this.total;
      var count = this.count++;
      if (ring.length < total) {
        ring.push(value);
      } else {
        var index = count % total;
        ring[index] = value;
      }
    };
    TakeLastSubscriber.prototype._complete = function () {
      var destination = this.destination;
      var count = this.count;
      if (count > 0) {
        var total = this.count >= this.total ? this.total : this.count;
        var ring = this.ring;
        for (var i = 0; i < total; i++) {
          var idx = count++ % total;
          destination.next(ring[idx]);
        }
      }
      destination.complete();
    };
    return TakeLastSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/takeLast.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/takeLast.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var takeLast_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/takeLast.js');
  Observable_1.Observable.prototype.takeLast = takeLast_1.takeLast;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/takeUntil.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function takeUntil(notifier) {
    return this.lift(new TakeUntilOperator(notifier));
  }
  exports.takeUntil = takeUntil;
  var TakeUntilOperator = function () {
    function TakeUntilOperator(notifier) {
      this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new TakeUntilSubscriber(subscriber, this.notifier));
    };
    return TakeUntilOperator;
  }();
  var TakeUntilSubscriber = function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination, notifier) {
      _super.call(this, destination);
      this.notifier = notifier;
      this.add(subscribeToResult_1.subscribeToResult(this, notifier));
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {};
    return TakeUntilSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/takeUntil.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/takeUntil.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var takeUntil_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/takeUntil.js');
  Observable_1.Observable.prototype.takeUntil = takeUntil_1.takeUntil;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/takeWhile.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function takeWhile(predicate) {
    return this.lift(new TakeWhileOperator(predicate));
  }
  exports.takeWhile = takeWhile;
  var TakeWhileOperator = function () {
    function TakeWhileOperator(predicate) {
      this.predicate = predicate;
    }
    TakeWhileOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new TakeWhileSubscriber(subscriber, this.predicate));
    };
    return TakeWhileOperator;
  }();
  var TakeWhileSubscriber = function (_super) {
    __extends(TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate) {
      _super.call(this, destination);
      this.predicate = predicate;
      this.index = 0;
    }
    TakeWhileSubscriber.prototype._next = function (value) {
      var destination = this.destination;
      var result;
      try {
        result = this.predicate(value, this.index++);
      } catch (err) {
        destination.error(err);
        return;
      }
      this.nextOrComplete(value, result);
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
      var destination = this.destination;
      if (Boolean(predicateResult)) {
        destination.next(value);
      } else {
        destination.complete();
      }
    };
    return TakeWhileSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/takeWhile.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/takeWhile.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var takeWhile_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/takeWhile.js');
  Observable_1.Observable.prototype.takeWhile = takeWhile_1.takeWhile;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/throttle.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
    var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
    function throttle(durationSelector) {
      return this.lift(new ThrottleOperator(durationSelector));
    }
    exports.throttle = throttle;
    var ThrottleOperator = function () {
      function ThrottleOperator(durationSelector) {
        this.durationSelector = durationSelector;
      }
      ThrottleOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new ThrottleSubscriber(subscriber, this.durationSelector));
      };
      return ThrottleOperator;
    }();
    var ThrottleSubscriber = function (_super) {
      __extends(ThrottleSubscriber, _super);
      function ThrottleSubscriber(destination, durationSelector) {
        _super.call(this, destination);
        this.destination = destination;
        this.durationSelector = durationSelector;
      }
      ThrottleSubscriber.prototype._next = function (value) {
        if (!this.throttled) {
          this.tryDurationSelector(value);
        }
      };
      ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
        var duration = null;
        try {
          duration = this.durationSelector(value);
        } catch (err) {
          this.destination.error(err);
          return;
        }
        this.emitAndThrottle(value, duration);
      };
      ThrottleSubscriber.prototype.emitAndThrottle = function (value, duration) {
        this.add(this.throttled = subscribeToResult_1.subscribeToResult(this, duration));
        this.destination.next(value);
      };
      ThrottleSubscriber.prototype._unsubscribe = function () {
        var throttled = this.throttled;
        if (throttled) {
          this.remove(throttled);
          this.throttled = null;
          throttled.unsubscribe();
        }
      };
      ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._unsubscribe();
      };
      ThrottleSubscriber.prototype.notifyComplete = function () {
        this._unsubscribe();
      };
      return ThrottleSubscriber;
    }(OuterSubscriber_1.OuterSubscriber);
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/throttle.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/throttle.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var throttle_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/throttle.js');
  Observable_1.Observable.prototype.throttle = throttle_1.throttle;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/throttleTime.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var __extends = this && this.__extends || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
    var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
    function throttleTime(duration, scheduler) {
      if (scheduler === void 0) {
        scheduler = async_1.async;
      }
      return this.lift(new ThrottleTimeOperator(duration, scheduler));
    }
    exports.throttleTime = throttleTime;
    var ThrottleTimeOperator = function () {
      function ThrottleTimeOperator(duration, scheduler) {
        this.duration = duration;
        this.scheduler = scheduler;
      }
      ThrottleTimeOperator.prototype.call = function (subscriber, source) {
        return source._subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler));
      };
      return ThrottleTimeOperator;
    }();
    var ThrottleTimeSubscriber = function (_super) {
      __extends(ThrottleTimeSubscriber, _super);
      function ThrottleTimeSubscriber(destination, duration, scheduler) {
        _super.call(this, destination);
        this.duration = duration;
        this.scheduler = scheduler;
      }
      ThrottleTimeSubscriber.prototype._next = function (value) {
        if (!this.throttled) {
          this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
          this.destination.next(value);
        }
      };
      ThrottleTimeSubscriber.prototype.clearThrottle = function () {
        var throttled = this.throttled;
        if (throttled) {
          throttled.unsubscribe();
          this.remove(throttled);
          this.throttled = null;
        }
      };
      return ThrottleTimeSubscriber;
    }(Subscriber_1.Subscriber);
    function dispatchNext(arg) {
      var subscriber = arg.subscriber;
      subscriber.clearThrottle();
    }
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/throttleTime.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/throttleTime.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var throttleTime_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/throttleTime.js');
  Observable_1.Observable.prototype.throttleTime = throttleTime_1.throttleTime;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/timeInterval.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/timeInterval.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var timeInterval_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/timeInterval.js');
  Observable_1.Observable.prototype.timeInterval = timeInterval_1.timeInterval;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/timeout.js', ['npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/util/isDate.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  var isDate_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isDate.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  function timeout(due, errorToSend, scheduler) {
    if (errorToSend === void 0) {
      errorToSend = null;
    }
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    var absoluteTimeout = isDate_1.isDate(due);
    var waitFor = absoluteTimeout ? +due - scheduler.now() : Math.abs(due);
    return this.lift(new TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler));
  }
  exports.timeout = timeout;
  var TimeoutOperator = function () {
    function TimeoutOperator(waitFor, absoluteTimeout, errorToSend, scheduler) {
      this.waitFor = waitFor;
      this.absoluteTimeout = absoluteTimeout;
      this.errorToSend = errorToSend;
      this.scheduler = scheduler;
    }
    TimeoutOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.errorToSend, this.scheduler));
    };
    return TimeoutOperator;
  }();
  var TimeoutSubscriber = function (_super) {
    __extends(TimeoutSubscriber, _super);
    function TimeoutSubscriber(destination, absoluteTimeout, waitFor, errorToSend, scheduler) {
      _super.call(this, destination);
      this.absoluteTimeout = absoluteTimeout;
      this.waitFor = waitFor;
      this.errorToSend = errorToSend;
      this.scheduler = scheduler;
      this.index = 0;
      this._previousIndex = 0;
      this._hasCompleted = false;
      this.scheduleTimeout();
    }
    Object.defineProperty(TimeoutSubscriber.prototype, "previousIndex", {
      get: function () {
        return this._previousIndex;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(TimeoutSubscriber.prototype, "hasCompleted", {
      get: function () {
        return this._hasCompleted;
      },
      enumerable: true,
      configurable: true
    });
    TimeoutSubscriber.dispatchTimeout = function (state) {
      var source = state.subscriber;
      var currentIndex = state.index;
      if (!source.hasCompleted && source.previousIndex === currentIndex) {
        source.notifyTimeout();
      }
    };
    TimeoutSubscriber.prototype.scheduleTimeout = function () {
      var currentIndex = this.index;
      this.scheduler.schedule(TimeoutSubscriber.dispatchTimeout, this.waitFor, {
        subscriber: this,
        index: currentIndex
      });
      this.index++;
      this._previousIndex = currentIndex;
    };
    TimeoutSubscriber.prototype._next = function (value) {
      this.destination.next(value);
      if (!this.absoluteTimeout) {
        this.scheduleTimeout();
      }
    };
    TimeoutSubscriber.prototype._error = function (err) {
      this.destination.error(err);
      this._hasCompleted = true;
    };
    TimeoutSubscriber.prototype._complete = function () {
      this.destination.complete();
      this._hasCompleted = true;
    };
    TimeoutSubscriber.prototype.notifyTimeout = function () {
      this.error(this.errorToSend || new Error('timeout'));
    };
    return TimeoutSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/timeout.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/timeout.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var timeout_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/timeout.js');
  Observable_1.Observable.prototype.timeout = timeout_1.timeout;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/isDate.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isDate(value) {
        return value instanceof Date && !isNaN(+value);
    }
    exports.isDate = isDate;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/timeoutWith.js', ['npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/util/isDate.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  var isDate_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isDate.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function timeoutWith(due, withObservable, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    var absoluteTimeout = isDate_1.isDate(due);
    var waitFor = absoluteTimeout ? +due - scheduler.now() : Math.abs(due);
    return this.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
  }
  exports.timeoutWith = timeoutWith;
  var TimeoutWithOperator = function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
      this.waitFor = waitFor;
      this.absoluteTimeout = absoluteTimeout;
      this.withObservable = withObservable;
      this.scheduler = scheduler;
    }
    TimeoutWithOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    };
    return TimeoutWithOperator;
  }();
  var TimeoutWithSubscriber = function (_super) {
    __extends(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
      _super.call(this);
      this.destination = destination;
      this.absoluteTimeout = absoluteTimeout;
      this.waitFor = waitFor;
      this.withObservable = withObservable;
      this.scheduler = scheduler;
      this.timeoutSubscription = undefined;
      this.index = 0;
      this._previousIndex = 0;
      this._hasCompleted = false;
      destination.add(this);
      this.scheduleTimeout();
    }
    Object.defineProperty(TimeoutWithSubscriber.prototype, "previousIndex", {
      get: function () {
        return this._previousIndex;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(TimeoutWithSubscriber.prototype, "hasCompleted", {
      get: function () {
        return this._hasCompleted;
      },
      enumerable: true,
      configurable: true
    });
    TimeoutWithSubscriber.dispatchTimeout = function (state) {
      var source = state.subscriber;
      var currentIndex = state.index;
      if (!source.hasCompleted && source.previousIndex === currentIndex) {
        source.handleTimeout();
      }
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
      var currentIndex = this.index;
      var timeoutState = {
        subscriber: this,
        index: currentIndex
      };
      this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, timeoutState);
      this.index++;
      this._previousIndex = currentIndex;
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
      this.destination.next(value);
      if (!this.absoluteTimeout) {
        this.scheduleTimeout();
      }
    };
    TimeoutWithSubscriber.prototype._error = function (err) {
      this.destination.error(err);
      this._hasCompleted = true;
    };
    TimeoutWithSubscriber.prototype._complete = function () {
      this.destination.complete();
      this._hasCompleted = true;
    };
    TimeoutWithSubscriber.prototype.handleTimeout = function () {
      if (!this.closed) {
        var withObservable = this.withObservable;
        this.unsubscribe();
        this.destination.add(this.timeoutSubscription = subscribeToResult_1.subscribeToResult(this, withObservable));
      }
    };
    return TimeoutWithSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/timeoutWith.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/timeoutWith.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var timeoutWith_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/timeoutWith.js');
  Observable_1.Observable.prototype.timeoutWith = timeoutWith_1.timeoutWith;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/timestamp.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/timestamp.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var timestamp_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/timestamp.js');
  Observable_1.Observable.prototype.timestamp = timestamp_1.timestamp;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/toArray.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  function toArray() {
    return this.lift(new ToArrayOperator());
  }
  exports.toArray = toArray;
  var ToArrayOperator = function () {
    function ToArrayOperator() {}
    ToArrayOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new ToArraySubscriber(subscriber));
    };
    return ToArrayOperator;
  }();
  var ToArraySubscriber = function (_super) {
    __extends(ToArraySubscriber, _super);
    function ToArraySubscriber(destination) {
      _super.call(this, destination);
      this.array = [];
    }
    ToArraySubscriber.prototype._next = function (x) {
      this.array.push(x);
    };
    ToArraySubscriber.prototype._complete = function () {
      this.destination.next(this.array);
      this.destination.complete();
    };
    return ToArraySubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/toArray.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/toArray.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var toArray_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/toArray.js');
  Observable_1.Observable.prototype.toArray = toArray_1.toArray;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/toPromise.js', ['npm:rxjs@5.0.0-beta.12/util/root.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  function toPromise(PromiseCtor) {
    var _this = this;
    if (!PromiseCtor) {
      if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
        PromiseCtor = root_1.root.Rx.config.Promise;
      } else if (root_1.root.Promise) {
        PromiseCtor = root_1.root.Promise;
      }
    }
    if (!PromiseCtor) {
      throw new Error('no Promise impl found');
    }
    return new PromiseCtor(function (resolve, reject) {
      var value;
      _this.subscribe(function (x) {
        return value = x;
      }, function (err) {
        return reject(err);
      }, function () {
        return resolve(value);
      });
    });
  }
  exports.toPromise = toPromise;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/toPromise.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/toPromise.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var toPromise_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/toPromise.js');
  Observable_1.Observable.prototype.toPromise = toPromise_1.toPromise;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/window.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function window(windowBoundaries) {
    return this.lift(new WindowOperator(windowBoundaries));
  }
  exports.window = window;
  var WindowOperator = function () {
    function WindowOperator(windowBoundaries) {
      this.windowBoundaries = windowBoundaries;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
      var windowSubscriber = new WindowSubscriber(subscriber);
      var sourceSubscription = source._subscribe(windowSubscriber);
      if (!sourceSubscription.closed) {
        windowSubscriber.add(subscribeToResult_1.subscribeToResult(windowSubscriber, this.windowBoundaries));
      }
      return sourceSubscription;
    };
    return WindowOperator;
  }();
  var WindowSubscriber = function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination) {
      _super.call(this, destination);
      this.window = new Subject_1.Subject();
      destination.next(this.window);
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.openWindow();
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
      this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
      this._complete();
    };
    WindowSubscriber.prototype._next = function (value) {
      this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
      this.window.error(err);
      this.destination.error(err);
    };
    WindowSubscriber.prototype._complete = function () {
      this.window.complete();
      this.destination.complete();
    };
    WindowSubscriber.prototype._unsubscribe = function () {
      this.window = null;
    };
    WindowSubscriber.prototype.openWindow = function () {
      var prevWindow = this.window;
      if (prevWindow) {
        prevWindow.complete();
      }
      var destination = this.destination;
      var newWindow = this.window = new Subject_1.Subject();
      destination.next(newWindow);
    };
    return WindowSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/window.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/window.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var window_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/window.js');
  Observable_1.Observable.prototype.window = window_1.window;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/windowCount.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Subject.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  function windowCount(windowSize, startWindowEvery) {
    if (startWindowEvery === void 0) {
      startWindowEvery = 0;
    }
    return this.lift(new WindowCountOperator(windowSize, startWindowEvery));
  }
  exports.windowCount = windowCount;
  var WindowCountOperator = function () {
    function WindowCountOperator(windowSize, startWindowEvery) {
      this.windowSize = windowSize;
      this.startWindowEvery = startWindowEvery;
    }
    WindowCountOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
    };
    return WindowCountOperator;
  }();
  var WindowCountSubscriber = function (_super) {
    __extends(WindowCountSubscriber, _super);
    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
      _super.call(this, destination);
      this.destination = destination;
      this.windowSize = windowSize;
      this.startWindowEvery = startWindowEvery;
      this.windows = [new Subject_1.Subject()];
      this.count = 0;
      destination.next(this.windows[0]);
    }
    WindowCountSubscriber.prototype._next = function (value) {
      var startWindowEvery = this.startWindowEvery > 0 ? this.startWindowEvery : this.windowSize;
      var destination = this.destination;
      var windowSize = this.windowSize;
      var windows = this.windows;
      var len = windows.length;
      for (var i = 0; i < len && !this.closed; i++) {
        windows[i].next(value);
      }
      var c = this.count - windowSize + 1;
      if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
        windows.shift().complete();
      }
      if (++this.count % startWindowEvery === 0 && !this.closed) {
        var window_1 = new Subject_1.Subject();
        windows.push(window_1);
        destination.next(window_1);
      }
    };
    WindowCountSubscriber.prototype._error = function (err) {
      var windows = this.windows;
      if (windows) {
        while (windows.length > 0 && !this.closed) {
          windows.shift().error(err);
        }
      }
      this.destination.error(err);
    };
    WindowCountSubscriber.prototype._complete = function () {
      var windows = this.windows;
      if (windows) {
        while (windows.length > 0 && !this.closed) {
          windows.shift().complete();
        }
      }
      this.destination.complete();
    };
    WindowCountSubscriber.prototype._unsubscribe = function () {
      this.count = 0;
      this.windows = null;
    };
    return WindowCountSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/windowCount.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/windowCount.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var windowCount_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/windowCount.js');
  Observable_1.Observable.prototype.windowCount = windowCount_1.windowCount;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/windowTime.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  function windowTime(windowTimeSpan, windowCreationInterval, scheduler) {
    if (windowCreationInterval === void 0) {
      windowCreationInterval = null;
    }
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    return this.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler));
  }
  exports.windowTime = windowTime;
  var WindowTimeOperator = function () {
    function WindowTimeOperator(windowTimeSpan, windowCreationInterval, scheduler) {
      this.windowTimeSpan = windowTimeSpan;
      this.windowCreationInterval = windowCreationInterval;
      this.scheduler = scheduler;
    }
    WindowTimeOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.scheduler));
    };
    return WindowTimeOperator;
  }();
  var WindowTimeSubscriber = function (_super) {
    __extends(WindowTimeSubscriber, _super);
    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, scheduler) {
      _super.call(this, destination);
      this.destination = destination;
      this.windowTimeSpan = windowTimeSpan;
      this.windowCreationInterval = windowCreationInterval;
      this.scheduler = scheduler;
      this.windows = [];
      if (windowCreationInterval !== null && windowCreationInterval >= 0) {
        var window_1 = this.openWindow();
        var closeState = {
          subscriber: this,
          window: window_1,
          context: null
        };
        var creationState = {
          windowTimeSpan: windowTimeSpan,
          windowCreationInterval: windowCreationInterval,
          subscriber: this,
          scheduler: scheduler
        };
        this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
        this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
      } else {
        var window_2 = this.openWindow();
        var timeSpanOnlyState = {
          subscriber: this,
          window: window_2,
          windowTimeSpan: windowTimeSpan
        };
        this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
      }
    }
    WindowTimeSubscriber.prototype._next = function (value) {
      var windows = this.windows;
      var len = windows.length;
      for (var i = 0; i < len; i++) {
        var window_3 = windows[i];
        if (!window_3.closed) {
          window_3.next(value);
        }
      }
    };
    WindowTimeSubscriber.prototype._error = function (err) {
      var windows = this.windows;
      while (windows.length > 0) {
        windows.shift().error(err);
      }
      this.destination.error(err);
    };
    WindowTimeSubscriber.prototype._complete = function () {
      var windows = this.windows;
      while (windows.length > 0) {
        var window_4 = windows.shift();
        if (!window_4.closed) {
          window_4.complete();
        }
      }
      this.destination.complete();
    };
    WindowTimeSubscriber.prototype.openWindow = function () {
      var window = new Subject_1.Subject();
      this.windows.push(window);
      var destination = this.destination;
      destination.next(window);
      return window;
    };
    WindowTimeSubscriber.prototype.closeWindow = function (window) {
      window.complete();
      var windows = this.windows;
      windows.splice(windows.indexOf(window), 1);
    };
    return WindowTimeSubscriber;
  }(Subscriber_1.Subscriber);
  function dispatchWindowTimeSpanOnly(state) {
    var subscriber = state.subscriber,
        windowTimeSpan = state.windowTimeSpan,
        window = state.window;
    if (window) {
      window.complete();
    }
    state.window = subscriber.openWindow();
    this.schedule(state, windowTimeSpan);
  }
  function dispatchWindowCreation(state) {
    var windowTimeSpan = state.windowTimeSpan,
        subscriber = state.subscriber,
        scheduler = state.scheduler,
        windowCreationInterval = state.windowCreationInterval;
    var window = subscriber.openWindow();
    var action = this;
    var context = {
      action: action,
      subscription: null
    };
    var timeSpanState = {
      subscriber: subscriber,
      window: window,
      context: context
    };
    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
    action.add(context.subscription);
    action.schedule(state, windowCreationInterval);
  }
  function dispatchWindowClose(arg) {
    var subscriber = arg.subscriber,
        window = arg.window,
        context = arg.context;
    if (context && context.action && context.subscription) {
      context.action.remove(context.subscription);
    }
    subscriber.closeWindow(window);
  }
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/windowTime.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/windowTime.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var windowTime_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/windowTime.js');
  Observable_1.Observable.prototype.windowTime = windowTime_1.windowTime;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/windowToggle.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function windowToggle(openings, closingSelector) {
    return this.lift(new WindowToggleOperator(openings, closingSelector));
  }
  exports.windowToggle = windowToggle;
  var WindowToggleOperator = function () {
    function WindowToggleOperator(openings, closingSelector) {
      this.openings = openings;
      this.closingSelector = closingSelector;
    }
    WindowToggleOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
    };
    return WindowToggleOperator;
  }();
  var WindowToggleSubscriber = function (_super) {
    __extends(WindowToggleSubscriber, _super);
    function WindowToggleSubscriber(destination, openings, closingSelector) {
      _super.call(this, destination);
      this.openings = openings;
      this.closingSelector = closingSelector;
      this.contexts = [];
      this.add(this.openSubscription = subscribeToResult_1.subscribeToResult(this, openings, openings));
    }
    WindowToggleSubscriber.prototype._next = function (value) {
      var contexts = this.contexts;
      if (contexts) {
        var len = contexts.length;
        for (var i = 0; i < len; i++) {
          contexts[i].window.next(value);
        }
      }
    };
    WindowToggleSubscriber.prototype._error = function (err) {
      var contexts = this.contexts;
      this.contexts = null;
      if (contexts) {
        var len = contexts.length;
        var index = -1;
        while (++index < len) {
          var context = contexts[index];
          context.window.error(err);
          context.subscription.unsubscribe();
        }
      }
      _super.prototype._error.call(this, err);
    };
    WindowToggleSubscriber.prototype._complete = function () {
      var contexts = this.contexts;
      this.contexts = null;
      if (contexts) {
        var len = contexts.length;
        var index = -1;
        while (++index < len) {
          var context = contexts[index];
          context.window.complete();
          context.subscription.unsubscribe();
        }
      }
      _super.prototype._complete.call(this);
    };
    WindowToggleSubscriber.prototype._unsubscribe = function () {
      var contexts = this.contexts;
      this.contexts = null;
      if (contexts) {
        var len = contexts.length;
        var index = -1;
        while (++index < len) {
          var context = contexts[index];
          context.window.unsubscribe();
          context.subscription.unsubscribe();
        }
      }
    };
    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      if (outerValue === this.openings) {
        var closingSelector = this.closingSelector;
        var closingNotifier = tryCatch_1.tryCatch(closingSelector)(innerValue);
        if (closingNotifier === errorObject_1.errorObject) {
          return this.error(errorObject_1.errorObject.e);
        } else {
          var window_1 = new Subject_1.Subject();
          var subscription = new Subscription_1.Subscription();
          var context = {
            window: window_1,
            subscription: subscription
          };
          this.contexts.push(context);
          var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
          if (innerSubscription.closed) {
            this.closeWindow(this.contexts.length - 1);
          } else {
            innerSubscription.context = context;
            subscription.add(innerSubscription);
          }
          this.destination.next(window_1);
        }
      } else {
        this.closeWindow(this.contexts.indexOf(outerValue));
      }
    };
    WindowToggleSubscriber.prototype.notifyError = function (err) {
      this.error(err);
    };
    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
      if (inner !== this.openSubscription) {
        this.closeWindow(this.contexts.indexOf(inner.context));
      }
    };
    WindowToggleSubscriber.prototype.closeWindow = function (index) {
      if (index === -1) {
        return;
      }
      var contexts = this.contexts;
      var context = contexts[index];
      var window = context.window,
          subscription = context.subscription;
      contexts.splice(index, 1);
      window.complete();
      subscription.unsubscribe();
    };
    return WindowToggleSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/windowToggle.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/windowToggle.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var windowToggle_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/windowToggle.js');
  Observable_1.Observable.prototype.windowToggle = windowToggle_1.windowToggle;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/windowWhen.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function windowWhen(closingSelector) {
    return this.lift(new WindowOperator(closingSelector));
  }
  exports.windowWhen = windowWhen;
  var WindowOperator = function () {
    function WindowOperator(closingSelector) {
      this.closingSelector = closingSelector;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new WindowSubscriber(subscriber, this.closingSelector));
    };
    return WindowOperator;
  }();
  var WindowSubscriber = function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination, closingSelector) {
      _super.call(this, destination);
      this.destination = destination;
      this.closingSelector = closingSelector;
      this.openWindow();
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.openWindow(innerSub);
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
      this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
      this.openWindow(innerSub);
    };
    WindowSubscriber.prototype._next = function (value) {
      this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
      this.window.error(err);
      this.destination.error(err);
      this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype._complete = function () {
      this.window.complete();
      this.destination.complete();
      this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
      if (this.closingNotification) {
        this.closingNotification.unsubscribe();
      }
    };
    WindowSubscriber.prototype.openWindow = function (innerSub) {
      if (innerSub === void 0) {
        innerSub = null;
      }
      if (innerSub) {
        this.remove(innerSub);
        innerSub.unsubscribe();
      }
      var prevWindow = this.window;
      if (prevWindow) {
        prevWindow.complete();
      }
      var window = this.window = new Subject_1.Subject();
      this.destination.next(window);
      var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
      if (closingNotifier === errorObject_1.errorObject) {
        var err = errorObject_1.errorObject.e;
        this.destination.error(err);
        this.window.error(err);
      } else {
        this.add(this.closingNotification = subscribeToResult_1.subscribeToResult(this, closingNotifier));
      }
    };
    return WindowSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/windowWhen.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/windowWhen.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var windowWhen_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/windowWhen.js');
  Observable_1.Observable.prototype.windowWhen = windowWhen_1.windowWhen;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/withLatestFrom.js', ['npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  function withLatestFrom() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i - 0] = arguments[_i];
    }
    var project;
    if (typeof args[args.length - 1] === 'function') {
      project = args.pop();
    }
    var observables = args;
    return this.lift(new WithLatestFromOperator(observables, project));
  }
  exports.withLatestFrom = withLatestFrom;
  var WithLatestFromOperator = function () {
    function WithLatestFromOperator(observables, project) {
      this.observables = observables;
      this.project = project;
    }
    WithLatestFromOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
    };
    return WithLatestFromOperator;
  }();
  var WithLatestFromSubscriber = function (_super) {
    __extends(WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
      _super.call(this, destination);
      this.observables = observables;
      this.project = project;
      this.toRespond = [];
      var len = observables.length;
      this.values = new Array(len);
      for (var i = 0; i < len; i++) {
        this.toRespond.push(i);
      }
      for (var i = 0; i < len; i++) {
        var observable = observables[i];
        this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
      }
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.values[outerIndex] = innerValue;
      var toRespond = this.toRespond;
      if (toRespond.length > 0) {
        var found = toRespond.indexOf(outerIndex);
        if (found !== -1) {
          toRespond.splice(found, 1);
        }
      }
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {};
    WithLatestFromSubscriber.prototype._next = function (value) {
      if (this.toRespond.length === 0) {
        var args = [value].concat(this.values);
        if (this.project) {
          this._tryProject(args);
        } else {
          this.destination.next(args);
        }
      }
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
      var result;
      try {
        result = this.project.apply(this, args);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.destination.next(result);
    };
    return WithLatestFromSubscriber;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/withLatestFrom.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/withLatestFrom.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var withLatestFrom_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/withLatestFrom.js');
  Observable_1.Observable.prototype.withLatestFrom = withLatestFrom_1.withLatestFrom;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/zip.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/zip.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var zip_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/zip.js');
  Observable_1.Observable.prototype.zip = zip_1.zipProto;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/ScalarObservable.js", ["npm:rxjs@5.0.0-beta.12/Observable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require("npm:rxjs@5.0.0-beta.12/Observable.js");
  var ScalarObservable = function (_super) {
    __extends(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
      _super.call(this);
      this.value = value;
      this.scheduler = scheduler;
      this._isScalar = true;
      if (scheduler) {
        this._isScalar = false;
      }
    }
    ScalarObservable.create = function (value, scheduler) {
      return new ScalarObservable(value, scheduler);
    };
    ScalarObservable.dispatch = function (state) {
      var done = state.done,
          value = state.value,
          subscriber = state.subscriber;
      if (done) {
        subscriber.complete();
        return;
      }
      subscriber.next(value);
      if (subscriber.closed) {
        return;
      }
      state.done = true;
      this.schedule(state);
    };
    ScalarObservable.prototype._subscribe = function (subscriber) {
      var value = this.value;
      var scheduler = this.scheduler;
      if (scheduler) {
        return scheduler.schedule(ScalarObservable.dispatch, 0, {
          done: false,
          value: value,
          subscriber: subscriber
        });
      } else {
        subscriber.next(value);
        if (!subscriber.closed) {
          subscriber.complete();
        }
      }
    };
    return ScalarObservable;
  }(Observable_1.Observable);
  exports.ScalarObservable = ScalarObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js", ["npm:rxjs@5.0.0-beta.12/Observable.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require("npm:rxjs@5.0.0-beta.12/Observable.js");
  var EmptyObservable = function (_super) {
    __extends(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
      _super.call(this);
      this.scheduler = scheduler;
    }
    EmptyObservable.create = function (scheduler) {
      return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (arg) {
      var subscriber = arg.subscriber;
      subscriber.complete();
    };
    EmptyObservable.prototype._subscribe = function (subscriber) {
      var scheduler = this.scheduler;
      if (scheduler) {
        return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
      } else {
        subscriber.complete();
      }
    };
    return EmptyObservable;
  }(Observable_1.Observable);
  exports.EmptyObservable = EmptyObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/isScheduler.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }
    exports.isScheduler = isScheduler;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/ScalarObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js', 'npm:rxjs@5.0.0-beta.12/util/isScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var ScalarObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ScalarObservable.js');
  var EmptyObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/EmptyObservable.js');
  var isScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isScheduler.js');
  var ArrayObservable = function (_super) {
    __extends(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
      _super.call(this);
      this.array = array;
      this.scheduler = scheduler;
      if (!scheduler && array.length === 1) {
        this._isScalar = true;
        this.value = array[0];
      }
    }
    ArrayObservable.create = function (array, scheduler) {
      return new ArrayObservable(array, scheduler);
    };
    ArrayObservable.of = function () {
      var array = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        array[_i - 0] = arguments[_i];
      }
      var scheduler = array[array.length - 1];
      if (isScheduler_1.isScheduler(scheduler)) {
        array.pop();
      } else {
        scheduler = null;
      }
      var len = array.length;
      if (len > 1) {
        return new ArrayObservable(array, scheduler);
      } else if (len === 1) {
        return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
      } else {
        return new EmptyObservable_1.EmptyObservable(scheduler);
      }
    };
    ArrayObservable.dispatch = function (state) {
      var array = state.array,
          index = state.index,
          count = state.count,
          subscriber = state.subscriber;
      if (index >= count) {
        subscriber.complete();
        return;
      }
      subscriber.next(array[index]);
      if (subscriber.closed) {
        return;
      }
      state.index = index + 1;
      this.schedule(state);
    };
    ArrayObservable.prototype._subscribe = function (subscriber) {
      var index = 0;
      var array = this.array;
      var count = array.length;
      var scheduler = this.scheduler;
      if (scheduler) {
        return scheduler.schedule(ArrayObservable.dispatch, 0, {
          array: array,
          index: index,
          count: count,
          subscriber: subscriber
        });
      } else {
        for (var i = 0; i < count && !subscriber.closed; i++) {
          subscriber.next(array[i]);
        }
        subscriber.complete();
      }
    };
    return ArrayObservable;
  }(Observable_1.Observable);
  exports.ArrayObservable = ArrayObservable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/OuterSubscriber.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  var OuterSubscriber = function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
      _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
      this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
      this.destination.complete();
    };
    return OuterSubscriber;
  }(Subscriber_1.Subscriber);
  exports.OuterSubscriber = OuterSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/isPromise.js', [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isPromise(value) {
        return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }
    exports.isPromise = isPromise;
    

    return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/InnerSubscriber.js", ["npm:rxjs@5.0.0-beta.12/Subscriber.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscriber.js");
  var InnerSubscriber = function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
      _super.call(this);
      this.parent = parent;
      this.outerValue = outerValue;
      this.outerIndex = outerIndex;
      this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
      this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
      this.parent.notifyError(error, this);
      this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
      this.parent.notifyComplete(this);
      this.unsubscribe();
    };
    return InnerSubscriber;
  }(Subscriber_1.Subscriber);
  exports.InnerSubscriber = InnerSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/util/isPromise.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/symbol/iterator.js', 'npm:rxjs@5.0.0-beta.12/InnerSubscriber.js', 'npm:rxjs@5.0.0-beta.12/symbol/observable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var isPromise_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isPromise.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var iterator_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/iterator.js');
  var InnerSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/InnerSubscriber.js');
  var observable_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/observable.js');
  function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
      return null;
    }
    if (result instanceof Observable_1.Observable) {
      if (result._isScalar) {
        destination.next(result.value);
        destination.complete();
        return null;
      } else {
        return result.subscribe(destination);
      }
    }
    if (isArray_1.isArray(result)) {
      for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
        destination.next(result[i]);
      }
      if (!destination.closed) {
        destination.complete();
      }
    } else if (isPromise_1.isPromise(result)) {
      result.then(function (value) {
        if (!destination.closed) {
          destination.next(value);
          destination.complete();
        }
      }, function (err) {
        return destination.error(err);
      }).then(null, function (err) {
        root_1.root.setTimeout(function () {
          throw err;
        });
      });
      return destination;
    } else if (typeof result[iterator_1.$$iterator] === 'function') {
      var iterator = result[iterator_1.$$iterator]();
      do {
        var item = iterator.next();
        if (item.done) {
          destination.complete();
          break;
        }
        destination.next(item.value);
        if (destination.closed) {
          break;
        }
      } while (true);
    } else if (typeof result[observable_1.$$observable] === 'function') {
      var obs = result[observable_1.$$observable]();
      if (typeof obs.subscribe !== 'function') {
        destination.error(new Error('invalid observable'));
      } else {
        return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
      }
    } else {
      destination.error(new TypeError('unknown type returned'));
    }
    return null;
  }
  exports.subscribeToResult = subscribeToResult;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/zip.js', ['npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js', 'npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/OuterSubscriber.js', 'npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js', 'npm:rxjs@5.0.0-beta.12/symbol/iterator.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ArrayObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ArrayObservable.js');
  var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var OuterSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/OuterSubscriber.js');
  var subscribeToResult_1 = $__require('npm:rxjs@5.0.0-beta.12/util/subscribeToResult.js');
  var iterator_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/iterator.js');
  function zipProto() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    observables.unshift(this);
    return zipStatic.apply(this, observables);
  }
  exports.zipProto = zipProto;
  function zipStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      observables[_i - 0] = arguments[_i];
    }
    var project = observables[observables.length - 1];
    if (typeof project === 'function') {
      observables.pop();
    }
    return new ArrayObservable_1.ArrayObservable(observables).lift(new ZipOperator(project));
  }
  exports.zipStatic = zipStatic;
  var ZipOperator = function () {
    function ZipOperator(project) {
      this.project = project;
    }
    ZipOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new ZipSubscriber(subscriber, this.project));
    };
    return ZipOperator;
  }();
  exports.ZipOperator = ZipOperator;
  var ZipSubscriber = function (_super) {
    __extends(ZipSubscriber, _super);
    function ZipSubscriber(destination, project, values) {
      if (values === void 0) {
        values = Object.create(null);
      }
      _super.call(this, destination);
      this.index = 0;
      this.iterators = [];
      this.active = 0;
      this.project = typeof project === 'function' ? project : null;
      this.values = values;
    }
    ZipSubscriber.prototype._next = function (value) {
      var iterators = this.iterators;
      var index = this.index++;
      if (isArray_1.isArray(value)) {
        iterators.push(new StaticArrayIterator(value));
      } else if (typeof value[iterator_1.$$iterator] === 'function') {
        iterators.push(new StaticIterator(value[iterator_1.$$iterator]()));
      } else {
        iterators.push(new ZipBufferIterator(this.destination, this, value, index));
      }
    };
    ZipSubscriber.prototype._complete = function () {
      var iterators = this.iterators;
      var len = iterators.length;
      this.active = len;
      for (var i = 0; i < len; i++) {
        var iterator = iterators[i];
        if (iterator.stillUnsubscribed) {
          this.add(iterator.subscribe(iterator, i));
        } else {
          this.active--;
        }
      }
    };
    ZipSubscriber.prototype.notifyInactive = function () {
      this.active--;
      if (this.active === 0) {
        this.destination.complete();
      }
    };
    ZipSubscriber.prototype.checkIterators = function () {
      var iterators = this.iterators;
      var len = iterators.length;
      var destination = this.destination;
      for (var i = 0; i < len; i++) {
        var iterator = iterators[i];
        if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
          return;
        }
      }
      var shouldComplete = false;
      var args = [];
      for (var i = 0; i < len; i++) {
        var iterator = iterators[i];
        var result = iterator.next();
        if (iterator.hasCompleted()) {
          shouldComplete = true;
        }
        if (result.done) {
          destination.complete();
          return;
        }
        args.push(result.value);
      }
      if (this.project) {
        this._tryProject(args);
      } else {
        destination.next(args);
      }
      if (shouldComplete) {
        destination.complete();
      }
    };
    ZipSubscriber.prototype._tryProject = function (args) {
      var result;
      try {
        result = this.project.apply(this, args);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.destination.next(result);
    };
    return ZipSubscriber;
  }(Subscriber_1.Subscriber);
  exports.ZipSubscriber = ZipSubscriber;
  var StaticIterator = function () {
    function StaticIterator(iterator) {
      this.iterator = iterator;
      this.nextResult = iterator.next();
    }
    StaticIterator.prototype.hasValue = function () {
      return true;
    };
    StaticIterator.prototype.next = function () {
      var result = this.nextResult;
      this.nextResult = this.iterator.next();
      return result;
    };
    StaticIterator.prototype.hasCompleted = function () {
      var nextResult = this.nextResult;
      return nextResult && nextResult.done;
    };
    return StaticIterator;
  }();
  var StaticArrayIterator = function () {
    function StaticArrayIterator(array) {
      this.array = array;
      this.index = 0;
      this.length = 0;
      this.length = array.length;
    }
    StaticArrayIterator.prototype[iterator_1.$$iterator] = function () {
      return this;
    };
    StaticArrayIterator.prototype.next = function (value) {
      var i = this.index++;
      var array = this.array;
      return i < this.length ? {
        value: array[i],
        done: false
      } : {
        value: null,
        done: true
      };
    };
    StaticArrayIterator.prototype.hasValue = function () {
      return this.array.length > this.index;
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
      return this.array.length === this.index;
    };
    return StaticArrayIterator;
  }();
  var ZipBufferIterator = function (_super) {
    __extends(ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable, index) {
      _super.call(this, destination);
      this.parent = parent;
      this.observable = observable;
      this.index = index;
      this.stillUnsubscribed = true;
      this.buffer = [];
      this.isComplete = false;
    }
    ZipBufferIterator.prototype[iterator_1.$$iterator] = function () {
      return this;
    };
    ZipBufferIterator.prototype.next = function () {
      var buffer = this.buffer;
      if (buffer.length === 0 && this.isComplete) {
        return {
          value: null,
          done: true
        };
      } else {
        return {
          value: buffer.shift(),
          done: false
        };
      }
    };
    ZipBufferIterator.prototype.hasValue = function () {
      return this.buffer.length > 0;
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
      return this.buffer.length === 0 && this.isComplete;
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
      if (this.buffer.length > 0) {
        this.isComplete = true;
        this.parent.notifyInactive();
      } else {
        this.destination.complete();
      }
    };
    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
      this.buffer.push(innerValue);
      this.parent.checkIterators();
    };
    ZipBufferIterator.prototype.subscribe = function (value, index) {
      return subscribeToResult_1.subscribeToResult(this, this.observable, this, index);
    };
    return ZipBufferIterator;
  }(OuterSubscriber_1.OuterSubscriber);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/operator/zipAll.js", ["npm:rxjs@5.0.0-beta.12/operator/zip.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var zip_1 = $__require("npm:rxjs@5.0.0-beta.12/operator/zip.js");
  function zipAll(project) {
    return this.lift(new zip_1.ZipOperator(project));
  }
  exports.zipAll = zipAll;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/add/operator/zipAll.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/operator/zipAll.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var zipAll_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/zipAll.js');
  Observable_1.Observable.prototype.zipAll = zipAll_1.zipAll;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/AsyncSubject.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var AsyncSubject = function (_super) {
    __extends(AsyncSubject, _super);
    function AsyncSubject() {
      _super.apply(this, arguments);
      this.value = null;
      this.hasNext = false;
      this.hasCompleted = false;
    }
    AsyncSubject.prototype._subscribe = function (subscriber) {
      if (this.hasCompleted && this.hasNext) {
        subscriber.next(this.value);
        subscriber.complete();
        return Subscription_1.Subscription.EMPTY;
      } else if (this.hasError) {
        subscriber.error(this.thrownError);
        return Subscription_1.Subscription.EMPTY;
      }
      return _super.prototype._subscribe.call(this, subscriber);
    };
    AsyncSubject.prototype.next = function (value) {
      if (!this.hasCompleted) {
        this.value = value;
        this.hasNext = true;
      }
    };
    AsyncSubject.prototype.complete = function () {
      this.hasCompleted = true;
      if (this.hasNext) {
        _super.prototype.next.call(this, this.value);
      }
      _super.prototype.complete.call(this);
    };
    return AsyncSubject;
  }(Subject_1.Subject);
  exports.AsyncSubject = AsyncSubject;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/observeOn.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Notification.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Notification_1 = $__require('npm:rxjs@5.0.0-beta.12/Notification.js');
  function observeOn(scheduler, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return this.lift(new ObserveOnOperator(scheduler, delay));
  }
  exports.observeOn = observeOn;
  var ObserveOnOperator = function () {
    function ObserveOnOperator(scheduler, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      this.scheduler = scheduler;
      this.delay = delay;
    }
    ObserveOnOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    };
    return ObserveOnOperator;
  }();
  exports.ObserveOnOperator = ObserveOnOperator;
  var ObserveOnSubscriber = function (_super) {
    __extends(ObserveOnSubscriber, _super);
    function ObserveOnSubscriber(destination, scheduler, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      _super.call(this, destination);
      this.scheduler = scheduler;
      this.delay = delay;
    }
    ObserveOnSubscriber.dispatch = function (arg) {
      var notification = arg.notification,
          destination = arg.destination;
      notification.observe(destination);
    };
    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
      this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    };
    ObserveOnSubscriber.prototype._next = function (value) {
      this.scheduleMessage(Notification_1.Notification.createNext(value));
    };
    ObserveOnSubscriber.prototype._error = function (err) {
      this.scheduleMessage(Notification_1.Notification.createError(err));
    };
    ObserveOnSubscriber.prototype._complete = function () {
      this.scheduleMessage(Notification_1.Notification.createComplete());
    };
    return ObserveOnSubscriber;
  }(Subscriber_1.Subscriber);
  exports.ObserveOnSubscriber = ObserveOnSubscriber;
  var ObserveOnMessage = function () {
    function ObserveOnMessage(notification, destination) {
      this.notification = notification;
      this.destination = destination;
    }
    return ObserveOnMessage;
  }();
  exports.ObserveOnMessage = ObserveOnMessage;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/ReplaySubject.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/scheduler/queue.js', 'npm:rxjs@5.0.0-beta.12/operator/observeOn.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var queue_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/queue.js');
  var observeOn_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/observeOn.js');
  var ReplaySubject = function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
      if (bufferSize === void 0) {
        bufferSize = Number.POSITIVE_INFINITY;
      }
      if (windowTime === void 0) {
        windowTime = Number.POSITIVE_INFINITY;
      }
      _super.call(this);
      this.scheduler = scheduler;
      this._events = [];
      this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
      this._windowTime = windowTime < 1 ? 1 : windowTime;
    }
    ReplaySubject.prototype.next = function (value) {
      var now = this._getNow();
      this._events.push(new ReplayEvent(now, value));
      this._trimBufferThenGetEvents();
      _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype._subscribe = function (subscriber) {
      var _events = this._trimBufferThenGetEvents();
      var scheduler = this.scheduler;
      if (scheduler) {
        subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
      }
      var len = _events.length;
      for (var i = 0; i < len && !subscriber.closed; i++) {
        subscriber.next(_events[i].value);
      }
      return _super.prototype._subscribe.call(this, subscriber);
    };
    ReplaySubject.prototype._getNow = function () {
      return (this.scheduler || queue_1.queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
      var now = this._getNow();
      var _bufferSize = this._bufferSize;
      var _windowTime = this._windowTime;
      var _events = this._events;
      var eventsCount = _events.length;
      var spliceCount = 0;
      while (spliceCount < eventsCount) {
        if (now - _events[spliceCount].time < _windowTime) {
          break;
        }
        spliceCount++;
      }
      if (eventsCount > _bufferSize) {
        spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
      }
      if (spliceCount > 0) {
        _events.splice(0, spliceCount);
      }
      return _events;
    };
    return ReplaySubject;
  }(Subject_1.Subject);
  exports.ReplaySubject = ReplaySubject;
  var ReplayEvent = function () {
    function ReplayEvent(time, value) {
      this.time = time;
      this.value = value;
    }
    return ReplayEvent;
  }();
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/BehaviorSubject.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/util/ObjectUnsubscribedError.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var ObjectUnsubscribedError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/ObjectUnsubscribedError.js');
  var BehaviorSubject = function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
      _super.call(this);
      this._value = _value;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
      get: function () {
        return this.getValue();
      },
      enumerable: true,
      configurable: true
    });
    BehaviorSubject.prototype._subscribe = function (subscriber) {
      var subscription = _super.prototype._subscribe.call(this, subscriber);
      if (subscription && !subscription.closed) {
        subscriber.next(this._value);
      }
      return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
      if (this.hasError) {
        throw this.thrownError;
      } else if (this.closed) {
        throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
      } else {
        return this._value;
      }
    };
    BehaviorSubject.prototype.next = function (value) {
      _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject;
  }(Subject_1.Subject);
  exports.BehaviorSubject = BehaviorSubject;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/MulticastObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/observable/ConnectableObservable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var ConnectableObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ConnectableObservable.js');
  var MulticastObservable = function (_super) {
    __extends(MulticastObservable, _super);
    function MulticastObservable(source, subjectFactory, selector) {
      _super.call(this);
      this.source = source;
      this.subjectFactory = subjectFactory;
      this.selector = selector;
    }
    MulticastObservable.prototype._subscribe = function (subscriber) {
      var _a = this,
          selector = _a.selector,
          source = _a.source;
      var connectable = new ConnectableObservable_1.ConnectableObservable(source, this.subjectFactory);
      var subscription = selector(connectable).subscribe(subscriber);
      subscription.add(connectable.connect());
      return subscription;
    };
    return MulticastObservable;
  }(Observable_1.Observable);
  exports.MulticastObservable = MulticastObservable;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/ConnectableObservable.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var ConnectableObservable = function (_super) {
    __extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
      _super.call(this);
      this.source = source;
      this.subjectFactory = subjectFactory;
      this._refCount = 0;
    }
    ConnectableObservable.prototype._subscribe = function (subscriber) {
      return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
      var subject = this._subject;
      if (!subject || subject.isStopped) {
        this._subject = this.subjectFactory();
      }
      return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
      var connection = this._connection;
      if (!connection) {
        connection = this._connection = new Subscription_1.Subscription();
        connection.add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this)));
        if (connection.closed) {
          this._connection = null;
          connection = Subscription_1.Subscription.EMPTY;
        } else {
          this._connection = connection;
        }
      }
      return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
      return this.lift(new RefCountOperator(this));
    };
    return ConnectableObservable;
  }(Observable_1.Observable);
  exports.ConnectableObservable = ConnectableObservable;
  var ConnectableSubscriber = function (_super) {
    __extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
      _super.call(this, destination);
      this.connectable = connectable;
    }
    ConnectableSubscriber.prototype._error = function (err) {
      this._unsubscribe();
      _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
      this._unsubscribe();
      _super.prototype._complete.call(this);
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
      var connectable = this.connectable;
      if (connectable) {
        this.connectable = null;
        var connection = connectable._connection;
        connectable._refCount = 0;
        connectable._subject = null;
        connectable._connection = null;
        if (connection) {
          connection.unsubscribe();
        }
      }
    };
    return ConnectableSubscriber;
  }(Subject_1.SubjectSubscriber);
  var RefCountOperator = function () {
    function RefCountOperator(connectable) {
      this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
      var connectable = this.connectable;
      connectable._refCount++;
      var refCounter = new RefCountSubscriber(subscriber, connectable);
      var subscription = source._subscribe(refCounter);
      if (!refCounter.closed) {
        refCounter.connection = connectable.connect();
      }
      return subscription;
    };
    return RefCountOperator;
  }();
  var RefCountSubscriber = function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
      _super.call(this, destination);
      this.connectable = connectable;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
      var connectable = this.connectable;
      if (!connectable) {
        this.connection = null;
        return;
      }
      this.connectable = null;
      var refCount = connectable._refCount;
      if (refCount <= 0) {
        this.connection = null;
        return;
      }
      connectable._refCount = refCount - 1;
      if (refCount > 1) {
        this.connection = null;
        return;
      }
      var connection = this.connection;
      var sharedConnection = connectable._connection;
      this.connection = null;
      if (sharedConnection && (!connection || sharedConnection === connection)) {
        sharedConnection.unsubscribe();
      }
    };
    return RefCountSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/EmptyError.js', [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when an Observable or a sequence was queried but has no
     * elements.
     *
     * @see {@link first}
     * @see {@link last}
     * @see {@link single}
     *
     * @class EmptyError
     */
    var EmptyError = function (_super) {
        __extends(EmptyError, _super);
        function EmptyError() {
            var err = _super.call(this, 'no elements in sequence');
            this.name = err.name = 'EmptyError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return EmptyError;
    }(Error);
    exports.EmptyError = EmptyError;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js', [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when an element was queried at a certain index of an
     * Observable, but no such index or position exists in that sequence.
     *
     * @see {@link elementAt}
     * @see {@link take}
     * @see {@link takeLast}
     *
     * @class ArgumentOutOfRangeError
     */
    var ArgumentOutOfRangeError = function (_super) {
        __extends(ArgumentOutOfRangeError, _super);
        function ArgumentOutOfRangeError() {
            var err = _super.call(this, 'argument out of range');
            this.name = err.name = 'ArgumentOutOfRangeError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return ArgumentOutOfRangeError;
    }(Error);
    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/timeInterval.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  function timeInterval(scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    return this.lift(new TimeIntervalOperator(scheduler));
  }
  exports.timeInterval = timeInterval;
  var TimeInterval = function () {
    function TimeInterval(value, interval) {
      this.value = value;
      this.interval = interval;
    }
    return TimeInterval;
  }();
  exports.TimeInterval = TimeInterval;
  ;
  var TimeIntervalOperator = function () {
    function TimeIntervalOperator(scheduler) {
      this.scheduler = scheduler;
    }
    TimeIntervalOperator.prototype.call = function (observer, source) {
      return source._subscribe(new TimeIntervalSubscriber(observer, this.scheduler));
    };
    return TimeIntervalOperator;
  }();
  var TimeIntervalSubscriber = function (_super) {
    __extends(TimeIntervalSubscriber, _super);
    function TimeIntervalSubscriber(destination, scheduler) {
      _super.call(this, destination);
      this.scheduler = scheduler;
      this.lastTime = 0;
      this.lastTime = scheduler.now();
    }
    TimeIntervalSubscriber.prototype._next = function (value) {
      var now = this.scheduler.now();
      var span = now - this.lastTime;
      this.lastTime = now;
      this.destination.next(new TimeInterval(value, span));
    };
    return TimeIntervalSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/timestamp.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
  function timestamp(scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    return this.lift(new TimestampOperator(scheduler));
  }
  exports.timestamp = timestamp;
  var Timestamp = function () {
    function Timestamp(value, timestamp) {
      this.value = value;
      this.timestamp = timestamp;
    }
    return Timestamp;
  }();
  exports.Timestamp = Timestamp;
  ;
  var TimestampOperator = function () {
    function TimestampOperator(scheduler) {
      this.scheduler = scheduler;
    }
    TimestampOperator.prototype.call = function (observer, source) {
      return source._subscribe(new TimestampSubscriber(observer, this.scheduler));
    };
    return TimestampOperator;
  }();
  var TimestampSubscriber = function (_super) {
    __extends(TimestampSubscriber, _super);
    function TimestampSubscriber(destination, scheduler) {
      _super.call(this, destination);
      this.scheduler = scheduler;
    }
    TimestampSubscriber.prototype._next = function (value) {
      var now = this.scheduler.now();
      this.destination.next(new Timestamp(value, now));
    };
    return TimestampSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/Notification.js', ['npm:rxjs@5.0.0-beta.12/Observable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Notification = function () {
    function Notification(kind, value, exception) {
      this.kind = kind;
      this.value = value;
      this.exception = exception;
      this.hasValue = kind === 'N';
    }
    Notification.prototype.observe = function (observer) {
      switch (this.kind) {
        case 'N':
          return observer.next && observer.next(this.value);
        case 'E':
          return observer.error && observer.error(this.exception);
        case 'C':
          return observer.complete && observer.complete();
      }
    };
    Notification.prototype.do = function (next, error, complete) {
      var kind = this.kind;
      switch (kind) {
        case 'N':
          return next && next(this.value);
        case 'E':
          return error && error(this.exception);
        case 'C':
          return complete && complete();
      }
    };
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
      if (nextOrObserver && typeof nextOrObserver.next === 'function') {
        return this.observe(nextOrObserver);
      } else {
        return this.do(nextOrObserver, error, complete);
      }
    };
    Notification.prototype.toObservable = function () {
      var kind = this.kind;
      switch (kind) {
        case 'N':
          return Observable_1.Observable.of(this.value);
        case 'E':
          return Observable_1.Observable.throw(this.exception);
        case 'C':
          return Observable_1.Observable.empty();
      }
      throw new Error('unexpected notification kind value');
    };
    Notification.createNext = function (value) {
      if (typeof value !== 'undefined') {
        return new Notification('N', value);
      }
      return this.undefinedValueNotification;
    };
    Notification.createError = function (err) {
      return new Notification('E', undefined, err);
    };
    Notification.createComplete = function () {
      return this.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
  }();
  exports.Notification = Notification;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/testing/ColdObservable.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/testing/SubscriptionLoggable.js', 'npm:rxjs@5.0.0-beta.12/util/applyMixins.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var SubscriptionLoggable_1 = $__require('npm:rxjs@5.0.0-beta.12/testing/SubscriptionLoggable.js');
  var applyMixins_1 = $__require('npm:rxjs@5.0.0-beta.12/util/applyMixins.js');
  var ColdObservable = function (_super) {
    __extends(ColdObservable, _super);
    function ColdObservable(messages, scheduler) {
      _super.call(this, function (subscriber) {
        var observable = this;
        var index = observable.logSubscribedFrame();
        subscriber.add(new Subscription_1.Subscription(function () {
          observable.logUnsubscribedFrame(index);
        }));
        observable.scheduleMessages(subscriber);
        return subscriber;
      });
      this.messages = messages;
      this.subscriptions = [];
      this.scheduler = scheduler;
    }
    ColdObservable.prototype.scheduleMessages = function (subscriber) {
      var messagesLength = this.messages.length;
      for (var i = 0; i < messagesLength; i++) {
        var message = this.messages[i];
        subscriber.add(this.scheduler.schedule(function (_a) {
          var message = _a.message,
              subscriber = _a.subscriber;
          message.notification.observe(subscriber);
        }, message.frame, {
          message: message,
          subscriber: subscriber
        }));
      }
    };
    return ColdObservable;
  }(Observable_1.Observable);
  exports.ColdObservable = ColdObservable;
  applyMixins_1.applyMixins(ColdObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/ObjectUnsubscribedError.js', [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when an action is invalid because the object has been
     * unsubscribed.
     *
     * @see {@link Subject}
     * @see {@link BehaviorSubject}
     *
     * @class ObjectUnsubscribedError
     */
    var ObjectUnsubscribedError = function (_super) {
        __extends(ObjectUnsubscribedError, _super);
        function ObjectUnsubscribedError() {
            var err = _super.call(this, 'object unsubscribed');
            this.name = err.name = 'ObjectUnsubscribedError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return ObjectUnsubscribedError;
    }(Error);
    exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
    

    return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/SubjectSubscription.js", ["npm:rxjs@5.0.0-beta.12/Subscription.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscription_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscription.js");
  var SubjectSubscription = function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
      _super.call(this);
      this.subject = subject;
      this.subscriber = subscriber;
      this.closed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
      if (this.closed) {
        return;
      }
      this.closed = true;
      var subject = this.subject;
      var observers = subject.observers;
      this.subject = null;
      if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
        return;
      }
      var subscriberIndex = observers.indexOf(this.subscriber);
      if (subscriberIndex !== -1) {
        observers.splice(subscriberIndex, 1);
      }
    };
    return SubjectSubscription;
  }(Subscription_1.Subscription);
  exports.SubjectSubscription = SubjectSubscription;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/Subject.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/util/ObjectUnsubscribedError.js', 'npm:rxjs@5.0.0-beta.12/SubjectSubscription.js', 'npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var ObjectUnsubscribedError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/ObjectUnsubscribedError.js');
  var SubjectSubscription_1 = $__require('npm:rxjs@5.0.0-beta.12/SubjectSubscription.js');
  var rxSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js');
  var SubjectSubscriber = function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
      _super.call(this, destination);
      this.destination = destination;
    }
    return SubjectSubscriber;
  }(Subscriber_1.Subscriber);
  exports.SubjectSubscriber = SubjectSubscriber;
  var Subject = function (_super) {
    __extends(Subject, _super);
    function Subject() {
      _super.call(this);
      this.observers = [];
      this.closed = false;
      this.isStopped = false;
      this.hasError = false;
      this.thrownError = null;
    }
    Subject.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
      return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };
    Subject.prototype.next = function (value) {
      if (this.closed) {
        throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
      }
      if (!this.isStopped) {
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
          copy[i].next(value);
        }
      }
    };
    Subject.prototype.error = function (err) {
      if (this.closed) {
        throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
      }
      this.hasError = true;
      this.thrownError = err;
      this.isStopped = true;
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();
      for (var i = 0; i < len; i++) {
        copy[i].error(err);
      }
      this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
      if (this.closed) {
        throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
      }
      this.isStopped = true;
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();
      for (var i = 0; i < len; i++) {
        copy[i].complete();
      }
      this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
      this.isStopped = true;
      this.closed = true;
      this.observers = null;
    };
    Subject.prototype._subscribe = function (subscriber) {
      if (this.closed) {
        throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
      } else if (this.hasError) {
        subscriber.error(this.thrownError);
        return Subscription_1.Subscription.EMPTY;
      } else if (this.isStopped) {
        subscriber.complete();
        return Subscription_1.Subscription.EMPTY;
      } else {
        this.observers.push(subscriber);
        return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
      }
    };
    Subject.prototype.asObservable = function () {
      var observable = new Observable_1.Observable();
      observable.source = this;
      return observable;
    };
    Subject.create = function (destination, source) {
      return new AnonymousSubject(destination, source);
    };
    return Subject;
  }(Observable_1.Observable);
  exports.Subject = Subject;
  var AnonymousSubject = function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
      _super.call(this);
      this.destination = destination;
      this.source = source;
    }
    AnonymousSubject.prototype.next = function (value) {
      var destination = this.destination;
      if (destination && destination.next) {
        destination.next(value);
      }
    };
    AnonymousSubject.prototype.error = function (err) {
      var destination = this.destination;
      if (destination && destination.error) {
        this.destination.error(err);
      }
    };
    AnonymousSubject.prototype.complete = function () {
      var destination = this.destination;
      if (destination && destination.complete) {
        this.destination.complete();
      }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
      var source = this.source;
      if (source) {
        return this.source.subscribe(subscriber);
      } else {
        return Subscription_1.Subscription.EMPTY;
      }
    };
    return AnonymousSubject;
  }(Subject);
  exports.AnonymousSubject = AnonymousSubject;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/testing/SubscriptionLoggable.js", ["npm:rxjs@5.0.0-beta.12/testing/SubscriptionLog.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var SubscriptionLog_1 = $__require("npm:rxjs@5.0.0-beta.12/testing/SubscriptionLog.js");
  var SubscriptionLoggable = function () {
    function SubscriptionLoggable() {
      this.subscriptions = [];
    }
    SubscriptionLoggable.prototype.logSubscribedFrame = function () {
      this.subscriptions.push(new SubscriptionLog_1.SubscriptionLog(this.scheduler.now()));
      return this.subscriptions.length - 1;
    };
    SubscriptionLoggable.prototype.logUnsubscribedFrame = function (index) {
      var subscriptionLogs = this.subscriptions;
      var oldSubscriptionLog = subscriptionLogs[index];
      subscriptionLogs[index] = new SubscriptionLog_1.SubscriptionLog(oldSubscriptionLog.subscribedFrame, this.scheduler.now());
    };
    return SubscriptionLoggable;
  }();
  exports.SubscriptionLoggable = SubscriptionLoggable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/applyMixins.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function applyMixins(derivedCtor, baseCtors) {
        for (var i = 0, len = baseCtors.length; i < len; i++) {
            var baseCtor = baseCtors[i];
            var propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
            for (var j = 0, len2 = propertyKeys.length; j < len2; j++) {
                var name_1 = propertyKeys[j];
                derivedCtor.prototype[name_1] = baseCtor.prototype[name_1];
            }
        }
    }
    exports.applyMixins = applyMixins;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/testing/HotObservable.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/testing/SubscriptionLoggable.js', 'npm:rxjs@5.0.0-beta.12/util/applyMixins.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var SubscriptionLoggable_1 = $__require('npm:rxjs@5.0.0-beta.12/testing/SubscriptionLoggable.js');
  var applyMixins_1 = $__require('npm:rxjs@5.0.0-beta.12/util/applyMixins.js');
  var HotObservable = function (_super) {
    __extends(HotObservable, _super);
    function HotObservable(messages, scheduler) {
      _super.call(this);
      this.messages = messages;
      this.subscriptions = [];
      this.scheduler = scheduler;
    }
    HotObservable.prototype._subscribe = function (subscriber) {
      var subject = this;
      var index = subject.logSubscribedFrame();
      subscriber.add(new Subscription_1.Subscription(function () {
        subject.logUnsubscribedFrame(index);
      }));
      return _super.prototype._subscribe.call(this, subscriber);
    };
    HotObservable.prototype.setup = function () {
      var subject = this;
      var messagesLength = subject.messages.length;
      for (var i = 0; i < messagesLength; i++) {
        (function () {
          var message = subject.messages[i];
          subject.scheduler.schedule(function () {
            message.notification.observe(subject);
          }, message.frame);
        })();
      }
    };
    return HotObservable;
  }(Subject_1.Subject);
  exports.HotObservable = HotObservable;
  applyMixins_1.applyMixins(HotObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/testing/SubscriptionLog.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var SubscriptionLog = function () {
        function SubscriptionLog(subscribedFrame, unsubscribedFrame) {
            if (unsubscribedFrame === void 0) {
                unsubscribedFrame = Number.POSITIVE_INFINITY;
            }
            this.subscribedFrame = subscribedFrame;
            this.unsubscribedFrame = unsubscribedFrame;
        }
        return SubscriptionLog;
    }();
    exports.SubscriptionLog = SubscriptionLog;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/testing/TestScheduler.js', ['npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Notification.js', 'npm:rxjs@5.0.0-beta.12/testing/ColdObservable.js', 'npm:rxjs@5.0.0-beta.12/testing/HotObservable.js', 'npm:rxjs@5.0.0-beta.12/testing/SubscriptionLog.js', 'npm:rxjs@5.0.0-beta.12/scheduler/VirtualTimeScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Notification_1 = $__require('npm:rxjs@5.0.0-beta.12/Notification.js');
  var ColdObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/testing/ColdObservable.js');
  var HotObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/testing/HotObservable.js');
  var SubscriptionLog_1 = $__require('npm:rxjs@5.0.0-beta.12/testing/SubscriptionLog.js');
  var VirtualTimeScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/VirtualTimeScheduler.js');
  var defaultMaxFrame = 750;
  var TestScheduler = function (_super) {
    __extends(TestScheduler, _super);
    function TestScheduler(assertDeepEqual) {
      _super.call(this, VirtualTimeScheduler_1.VirtualAction, defaultMaxFrame);
      this.assertDeepEqual = assertDeepEqual;
      this.hotObservables = [];
      this.coldObservables = [];
      this.flushTests = [];
    }
    TestScheduler.prototype.createTime = function (marbles) {
      var indexOf = marbles.indexOf('|');
      if (indexOf === -1) {
        throw new Error('marble diagram for time should have a completion marker "|"');
      }
      return indexOf * TestScheduler.frameTimeFactor;
    };
    TestScheduler.prototype.createColdObservable = function (marbles, values, error) {
      if (marbles.indexOf('^') !== -1) {
        throw new Error('cold observable cannot have subscription offset "^"');
      }
      if (marbles.indexOf('!') !== -1) {
        throw new Error('cold observable cannot have unsubscription marker "!"');
      }
      var messages = TestScheduler.parseMarbles(marbles, values, error);
      var cold = new ColdObservable_1.ColdObservable(messages, this);
      this.coldObservables.push(cold);
      return cold;
    };
    TestScheduler.prototype.createHotObservable = function (marbles, values, error) {
      if (marbles.indexOf('!') !== -1) {
        throw new Error('hot observable cannot have unsubscription marker "!"');
      }
      var messages = TestScheduler.parseMarbles(marbles, values, error);
      var subject = new HotObservable_1.HotObservable(messages, this);
      this.hotObservables.push(subject);
      return subject;
    };
    TestScheduler.prototype.materializeInnerObservable = function (observable, outerFrame) {
      var _this = this;
      var messages = [];
      observable.subscribe(function (value) {
        messages.push({
          frame: _this.frame - outerFrame,
          notification: Notification_1.Notification.createNext(value)
        });
      }, function (err) {
        messages.push({
          frame: _this.frame - outerFrame,
          notification: Notification_1.Notification.createError(err)
        });
      }, function () {
        messages.push({
          frame: _this.frame - outerFrame,
          notification: Notification_1.Notification.createComplete()
        });
      });
      return messages;
    };
    TestScheduler.prototype.expectObservable = function (observable, unsubscriptionMarbles) {
      var _this = this;
      if (unsubscriptionMarbles === void 0) {
        unsubscriptionMarbles = null;
      }
      var actual = [];
      var flushTest = {
        actual: actual,
        ready: false
      };
      var unsubscriptionFrame = TestScheduler.parseMarblesAsSubscriptions(unsubscriptionMarbles).unsubscribedFrame;
      var subscription;
      this.schedule(function () {
        subscription = observable.subscribe(function (x) {
          var value = x;
          if (x instanceof Observable_1.Observable) {
            value = _this.materializeInnerObservable(value, _this.frame);
          }
          actual.push({
            frame: _this.frame,
            notification: Notification_1.Notification.createNext(value)
          });
        }, function (err) {
          actual.push({
            frame: _this.frame,
            notification: Notification_1.Notification.createError(err)
          });
        }, function () {
          actual.push({
            frame: _this.frame,
            notification: Notification_1.Notification.createComplete()
          });
        });
      }, 0);
      if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
        this.schedule(function () {
          return subscription.unsubscribe();
        }, unsubscriptionFrame);
      }
      this.flushTests.push(flushTest);
      return { toBe: function (marbles, values, errorValue) {
          flushTest.ready = true;
          flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true);
        } };
    };
    TestScheduler.prototype.expectSubscriptions = function (actualSubscriptionLogs) {
      var flushTest = {
        actual: actualSubscriptionLogs,
        ready: false
      };
      this.flushTests.push(flushTest);
      return { toBe: function (marbles) {
          var marblesArray = typeof marbles === 'string' ? [marbles] : marbles;
          flushTest.ready = true;
          flushTest.expected = marblesArray.map(function (marbles) {
            return TestScheduler.parseMarblesAsSubscriptions(marbles);
          });
        } };
    };
    TestScheduler.prototype.flush = function () {
      var hotObservables = this.hotObservables;
      while (hotObservables.length > 0) {
        hotObservables.shift().setup();
      }
      _super.prototype.flush.call(this);
      var readyFlushTests = this.flushTests.filter(function (test) {
        return test.ready;
      });
      while (readyFlushTests.length > 0) {
        var test = readyFlushTests.shift();
        this.assertDeepEqual(test.actual, test.expected);
      }
    };
    TestScheduler.parseMarblesAsSubscriptions = function (marbles) {
      if (typeof marbles !== 'string') {
        return new SubscriptionLog_1.SubscriptionLog(Number.POSITIVE_INFINITY);
      }
      var len = marbles.length;
      var groupStart = -1;
      var subscriptionFrame = Number.POSITIVE_INFINITY;
      var unsubscriptionFrame = Number.POSITIVE_INFINITY;
      for (var i = 0; i < len; i++) {
        var frame = i * this.frameTimeFactor;
        var c = marbles[i];
        switch (c) {
          case '-':
          case ' ':
            break;
          case '(':
            groupStart = frame;
            break;
          case ')':
            groupStart = -1;
            break;
          case '^':
            if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
              throw new Error('found a second subscription point \'^\' in a ' + 'subscription marble diagram. There can only be one.');
            }
            subscriptionFrame = groupStart > -1 ? groupStart : frame;
            break;
          case '!':
            if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
              throw new Error('found a second subscription point \'^\' in a ' + 'subscription marble diagram. There can only be one.');
            }
            unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
            break;
          default:
            throw new Error('there can only be \'^\' and \'!\' markers in a ' + 'subscription marble diagram. Found instead \'' + c + '\'.');
        }
      }
      if (unsubscriptionFrame < 0) {
        return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame);
      } else {
        return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
      }
    };
    TestScheduler.parseMarbles = function (marbles, values, errorValue, materializeInnerObservables) {
      if (materializeInnerObservables === void 0) {
        materializeInnerObservables = false;
      }
      if (marbles.indexOf('!') !== -1) {
        throw new Error('conventional marble diagrams cannot have the ' + 'unsubscription marker "!"');
      }
      var len = marbles.length;
      var testMessages = [];
      var subIndex = marbles.indexOf('^');
      var frameOffset = subIndex === -1 ? 0 : subIndex * -this.frameTimeFactor;
      var getValue = typeof values !== 'object' ? function (x) {
        return x;
      } : function (x) {
        if (materializeInnerObservables && values[x] instanceof ColdObservable_1.ColdObservable) {
          return values[x].messages;
        }
        return values[x];
      };
      var groupStart = -1;
      for (var i = 0; i < len; i++) {
        var frame = i * this.frameTimeFactor + frameOffset;
        var notification = void 0;
        var c = marbles[i];
        switch (c) {
          case '-':
          case ' ':
            break;
          case '(':
            groupStart = frame;
            break;
          case ')':
            groupStart = -1;
            break;
          case '|':
            notification = Notification_1.Notification.createComplete();
            break;
          case '^':
            break;
          case '#':
            notification = Notification_1.Notification.createError(errorValue || 'error');
            break;
          default:
            notification = Notification_1.Notification.createNext(getValue(c));
            break;
        }
        if (notification) {
          testMessages.push({
            frame: groupStart > -1 ? groupStart : frame,
            notification: notification
          });
        }
      }
      return testMessages;
    };
    return TestScheduler;
  }(VirtualTimeScheduler_1.VirtualTimeScheduler);
  exports.TestScheduler = TestScheduler;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/VirtualTimeScheduler.js', ['npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js', 'npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AsyncAction_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js');
  var AsyncScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js');
  var VirtualTimeScheduler = function (_super) {
    __extends(VirtualTimeScheduler, _super);
    function VirtualTimeScheduler(SchedulerAction, maxFrames) {
      var _this = this;
      if (SchedulerAction === void 0) {
        SchedulerAction = VirtualAction;
      }
      if (maxFrames === void 0) {
        maxFrames = Number.POSITIVE_INFINITY;
      }
      _super.call(this, SchedulerAction, function () {
        return _this.frame;
      });
      this.maxFrames = maxFrames;
      this.frame = 0;
      this.index = -1;
    }
    VirtualTimeScheduler.prototype.flush = function () {
      var _a = this,
          actions = _a.actions,
          maxFrames = _a.maxFrames;
      var error, action;
      while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      }
      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    VirtualTimeScheduler.frameTimeFactor = 10;
    return VirtualTimeScheduler;
  }(AsyncScheduler_1.AsyncScheduler);
  exports.VirtualTimeScheduler = VirtualTimeScheduler;
  var VirtualAction = function (_super) {
    __extends(VirtualAction, _super);
    function VirtualAction(scheduler, work, index) {
      if (index === void 0) {
        index = scheduler.index += 1;
      }
      _super.call(this, scheduler, work);
      this.scheduler = scheduler;
      this.work = work;
      this.index = index;
      this.index = scheduler.index = index;
    }
    VirtualAction.prototype.schedule = function (state, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      return !this.id ? _super.prototype.schedule.call(this, state, delay) : this.add(new VirtualAction(this.scheduler, this.work)).schedule(state, delay);
    };
    VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      this.delay = scheduler.frame + delay;
      var actions = scheduler.actions;
      actions.push(this);
      actions.sort(VirtualAction.sortActions);
      return true;
    };
    VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      return undefined;
    };
    VirtualAction.sortActions = function (a, b) {
      if (a.delay === b.delay) {
        if (a.index === b.index) {
          return 0;
        } else if (a.index > b.index) {
          return 1;
        } else {
          return -1;
        }
      } else if (a.delay > b.delay) {
        return 1;
      } else {
        return -1;
      }
    };
    return VirtualAction;
  }(AsyncAction_1.AsyncAction);
  exports.VirtualAction = VirtualAction;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/toSubscriber.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var rxSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js');
  function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
      if (nextOrObserver instanceof Subscriber_1.Subscriber) {
        return nextOrObserver;
      }
      if (nextOrObserver[rxSubscriber_1.$$rxSubscriber]) {
        return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
      }
    }
    if (!nextOrObserver && !error && !complete) {
      return new Subscriber_1.Subscriber();
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
  }
  exports.toSubscriber = toSubscriber;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/Observable.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/util/toSubscriber.js', 'npm:rxjs@5.0.0-beta.12/symbol/observable.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var toSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/util/toSubscriber.js');
  var observable_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/observable.js');
  var Observable = function () {
    function Observable(subscribe) {
      this._isScalar = false;
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable.prototype.lift = function (operator) {
      var observable = new Observable();
      observable.source = this;
      observable.operator = operator;
      return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
      var operator = this.operator;
      var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
      if (operator) {
        operator.call(sink, this);
      } else {
        sink.add(this._subscribe(sink));
      }
      if (sink.syncErrorThrowable) {
        sink.syncErrorThrowable = false;
        if (sink.syncErrorThrown) {
          throw sink.syncErrorValue;
        }
      }
      return sink;
    };
    Observable.prototype.forEach = function (next, PromiseCtor) {
      var _this = this;
      if (!PromiseCtor) {
        if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
          PromiseCtor = root_1.root.Rx.config.Promise;
        } else if (root_1.root.Promise) {
          PromiseCtor = root_1.root.Promise;
        }
      }
      if (!PromiseCtor) {
        throw new Error('no Promise impl found');
      }
      return new PromiseCtor(function (resolve, reject) {
        var subscription = _this.subscribe(function (value) {
          if (subscription) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscription.unsubscribe();
            }
          } else {
            next(value);
          }
        }, reject, resolve);
      });
    };
    Observable.prototype._subscribe = function (subscriber) {
      return this.source.subscribe(subscriber);
    };
    Observable.prototype[observable_1.$$observable] = function () {
      return this;
    };
    Observable.create = function (subscribe) {
      return new Observable(subscribe);
    };
    return Observable;
  }();
  exports.Observable = Observable;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/Observer.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    exports.empty = {
        closed: true,
        next: function (value) {},
        error: function (err) {
            throw err;
        },
        complete: function () {}
    };
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/Subscriber.js', ['npm:rxjs@5.0.0-beta.12/util/isFunction.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/Observer.js', 'npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var isFunction_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isFunction.js');
  var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
  var Observer_1 = $__require('npm:rxjs@5.0.0-beta.12/Observer.js');
  var rxSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js');
  var Subscriber = function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
      _super.call(this);
      this.syncErrorValue = null;
      this.syncErrorThrown = false;
      this.syncErrorThrowable = false;
      this.isStopped = false;
      switch (arguments.length) {
        case 0:
          this.destination = Observer_1.empty;
          break;
        case 1:
          if (!destinationOrNext) {
            this.destination = Observer_1.empty;
            break;
          }
          if (typeof destinationOrNext === 'object') {
            if (destinationOrNext instanceof Subscriber) {
              this.destination = destinationOrNext;
              this.destination.add(this);
            } else {
              this.syncErrorThrowable = true;
              this.destination = new SafeSubscriber(this, destinationOrNext);
            }
            break;
          }
        default:
          this.syncErrorThrowable = true;
          this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
          break;
      }
    }
    Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
      return this;
    };
    Subscriber.create = function (next, error, complete) {
      var subscriber = new Subscriber(next, error, complete);
      subscriber.syncErrorThrowable = false;
      return subscriber;
    };
    Subscriber.prototype.next = function (value) {
      if (!this.isStopped) {
        this._next(value);
      }
    };
    Subscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber.prototype.complete = function () {
      if (!this.isStopped) {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber.prototype.unsubscribe = function () {
      if (this.closed) {
        return;
      }
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
      this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
      this.destination.error(err);
      this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
      this.destination.complete();
      this.unsubscribe();
    };
    return Subscriber;
  }(Subscription_1.Subscription);
  exports.Subscriber = Subscriber;
  var SafeSubscriber = function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parent, observerOrNext, error, complete) {
      _super.call(this);
      this._parent = _parent;
      var next;
      var context = this;
      if (isFunction_1.isFunction(observerOrNext)) {
        next = observerOrNext;
      } else if (observerOrNext) {
        context = observerOrNext;
        next = observerOrNext.next;
        error = observerOrNext.error;
        complete = observerOrNext.complete;
        if (isFunction_1.isFunction(context.unsubscribe)) {
          this.add(context.unsubscribe.bind(context));
        }
        context.unsubscribe = this.unsubscribe.bind(this);
      }
      this._context = context;
      this._next = next;
      this._error = error;
      this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
      if (!this.isStopped && this._next) {
        var _parent = this._parent;
        if (!_parent.syncErrorThrowable) {
          this.__tryOrUnsub(this._next, value);
        } else if (this.__tryOrSetError(_parent, this._next, value)) {
          this.unsubscribe();
        }
      }
    };
    SafeSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var _parent = this._parent;
        if (this._error) {
          if (!_parent.syncErrorThrowable) {
            this.__tryOrUnsub(this._error, err);
            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parent, this._error, err);
            this.unsubscribe();
          }
        } else if (!_parent.syncErrorThrowable) {
          this.unsubscribe();
          throw err;
        } else {
          _parent.syncErrorValue = err;
          _parent.syncErrorThrown = true;
          this.unsubscribe();
        }
      }
    };
    SafeSubscriber.prototype.complete = function () {
      if (!this.isStopped) {
        var _parent = this._parent;
        if (this._complete) {
          if (!_parent.syncErrorThrowable) {
            this.__tryOrUnsub(this._complete);
            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parent, this._complete);
            this.unsubscribe();
          }
        } else {
          this.unsubscribe();
        }
      }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
      try {
        fn.call(this._context, value);
      } catch (err) {
        this.unsubscribe();
        throw err;
      }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
      try {
        fn.call(this._context, value);
      } catch (err) {
        parent.syncErrorValue = err;
        parent.syncErrorThrown = true;
        return true;
      }
      return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
      var _parent = this._parent;
      this._context = null;
      this._parent = null;
      _parent.unsubscribe();
    };
    return SafeSubscriber;
  }(Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/operator/map.js', ['npm:rxjs@5.0.0-beta.12/Subscriber.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  function map(project, thisArg) {
    if (typeof project !== 'function') {
      throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
    }
    return this.lift(new MapOperator(project, thisArg));
  }
  exports.map = map;
  var MapOperator = function () {
    function MapOperator(project, thisArg) {
      this.project = project;
      this.thisArg = thisArg;
    }
    MapOperator.prototype.call = function (subscriber, source) {
      return source._subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
    };
    return MapOperator;
  }();
  exports.MapOperator = MapOperator;
  var MapSubscriber = function (_super) {
    __extends(MapSubscriber, _super);
    function MapSubscriber(destination, project, thisArg) {
      _super.call(this, destination);
      this.project = project;
      this.count = 0;
      this.thisArg = thisArg || this;
    }
    MapSubscriber.prototype._next = function (value) {
      var result;
      try {
        result = this.project.call(this.thisArg, value, this.count++);
      } catch (err) {
        this.destination.error(err);
        return;
      }
      this.destination.next(result);
    };
    return MapSubscriber;
  }(Subscriber_1.Subscriber);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/observable/dom/AjaxObservable.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/operator/map.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
  var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
  var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
  var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
  var map_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/map.js');
  function getCORSRequest() {
    if (root_1.root.XMLHttpRequest) {
      var xhr = new root_1.root.XMLHttpRequest();
      if ('withCredentials' in xhr) {
        xhr.withCredentials = !!this.withCredentials;
      }
      return xhr;
    } else if (!!root_1.root.XDomainRequest) {
      return new root_1.root.XDomainRequest();
    } else {
      throw new Error('CORS is not supported by your browser');
    }
  }
  function getXMLHttpRequest() {
    if (root_1.root.XMLHttpRequest) {
      return new root_1.root.XMLHttpRequest();
    } else {
      var progId = void 0;
      try {
        var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
        for (var i = 0; i < 3; i++) {
          try {
            progId = progIds[i];
            if (new root_1.root.ActiveXObject(progId)) {
              break;
            }
          } catch (e) {}
        }
        return new root_1.root.ActiveXObject(progId);
      } catch (e) {
        throw new Error('XMLHttpRequest is not supported by your browser');
      }
    }
  }
  function ajaxGet(url, headers) {
    if (headers === void 0) {
      headers = null;
    }
    return new AjaxObservable({
      method: 'GET',
      url: url,
      headers: headers
    });
  }
  exports.ajaxGet = ajaxGet;
  ;
  function ajaxPost(url, body, headers) {
    return new AjaxObservable({
      method: 'POST',
      url: url,
      body: body,
      headers: headers
    });
  }
  exports.ajaxPost = ajaxPost;
  ;
  function ajaxDelete(url, headers) {
    return new AjaxObservable({
      method: 'DELETE',
      url: url,
      headers: headers
    });
  }
  exports.ajaxDelete = ajaxDelete;
  ;
  function ajaxPut(url, body, headers) {
    return new AjaxObservable({
      method: 'PUT',
      url: url,
      body: body,
      headers: headers
    });
  }
  exports.ajaxPut = ajaxPut;
  ;
  function ajaxGetJSON(url, headers) {
    return new AjaxObservable({
      method: 'GET',
      url: url,
      responseType: 'json',
      headers: headers
    }).lift(new map_1.MapOperator(function (x, index) {
      return x.response;
    }, null));
  }
  exports.ajaxGetJSON = ajaxGetJSON;
  ;
  var AjaxObservable = function (_super) {
    __extends(AjaxObservable, _super);
    function AjaxObservable(urlOrRequest) {
      _super.call(this);
      var request = {
        async: true,
        createXHR: function () {
          return this.crossDomain ? getCORSRequest.call(this) : getXMLHttpRequest();
        },
        crossDomain: false,
        withCredentials: false,
        headers: {},
        method: 'GET',
        responseType: 'json',
        timeout: 0
      };
      if (typeof urlOrRequest === 'string') {
        request.url = urlOrRequest;
      } else {
        for (var prop in urlOrRequest) {
          if (urlOrRequest.hasOwnProperty(prop)) {
            request[prop] = urlOrRequest[prop];
          }
        }
      }
      this.request = request;
    }
    AjaxObservable.prototype._subscribe = function (subscriber) {
      return new AjaxSubscriber(subscriber, this.request);
    };
    AjaxObservable.create = function () {
      var create = function (urlOrRequest) {
        return new AjaxObservable(urlOrRequest);
      };
      create.get = ajaxGet;
      create.post = ajaxPost;
      create.delete = ajaxDelete;
      create.put = ajaxPut;
      create.getJSON = ajaxGetJSON;
      return create;
    }();
    return AjaxObservable;
  }(Observable_1.Observable);
  exports.AjaxObservable = AjaxObservable;
  var AjaxSubscriber = function (_super) {
    __extends(AjaxSubscriber, _super);
    function AjaxSubscriber(destination, request) {
      _super.call(this, destination);
      this.request = request;
      this.done = false;
      var headers = request.headers = request.headers || {};
      if (!request.crossDomain && !headers['X-Requested-With']) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
      }
      if (!('Content-Type' in headers) && !(root_1.root.FormData && request.body instanceof root_1.root.FormData) && typeof request.body !== 'undefined') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      }
      request.body = this.serializeBody(request.body, request.headers['Content-Type']);
      this.send();
    }
    AjaxSubscriber.prototype.next = function (e) {
      this.done = true;
      var _a = this,
          xhr = _a.xhr,
          request = _a.request,
          destination = _a.destination;
      var response = new AjaxResponse(e, xhr, request);
      destination.next(response);
    };
    AjaxSubscriber.prototype.send = function () {
      var _a = this,
          request = _a.request,
          _b = _a.request,
          user = _b.user,
          method = _b.method,
          url = _b.url,
          async = _b.async,
          password = _b.password,
          headers = _b.headers,
          body = _b.body;
      var createXHR = request.createXHR;
      var xhr = tryCatch_1.tryCatch(createXHR).call(request);
      if (xhr === errorObject_1.errorObject) {
        this.error(errorObject_1.errorObject.e);
      } else {
        this.xhr = xhr;
        var result = void 0;
        if (user) {
          result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async, user, password);
        } else {
          result = tryCatch_1.tryCatch(xhr.open).call(xhr, method, url, async);
        }
        if (result === errorObject_1.errorObject) {
          this.error(errorObject_1.errorObject.e);
          return null;
        }
        xhr.timeout = request.timeout;
        xhr.responseType = request.responseType;
        this.setHeaders(xhr, headers);
        this.setupEvents(xhr, request);
        if (body) {
          xhr.send(body);
        } else {
          xhr.send();
        }
      }
      return xhr;
    };
    AjaxSubscriber.prototype.serializeBody = function (body, contentType) {
      if (!body || typeof body === 'string') {
        return body;
      } else if (root_1.root.FormData && body instanceof root_1.root.FormData) {
        return body;
      }
      if (contentType) {
        var splitIndex = contentType.indexOf(';');
        if (splitIndex !== -1) {
          contentType = contentType.substring(0, splitIndex);
        }
      }
      switch (contentType) {
        case 'application/x-www-form-urlencoded':
          return Object.keys(body).map(function (key) {
            return encodeURI(key) + "=" + encodeURI(body[key]);
          }).join('&');
        case 'application/json':
          return JSON.stringify(body);
        default:
          return body;
      }
    };
    AjaxSubscriber.prototype.setHeaders = function (xhr, headers) {
      for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }
    };
    AjaxSubscriber.prototype.setupEvents = function (xhr, request) {
      var progressSubscriber = request.progressSubscriber;
      xhr.ontimeout = function xhrTimeout(e) {
        var _a = xhrTimeout,
            subscriber = _a.subscriber,
            progressSubscriber = _a.progressSubscriber,
            request = _a.request;
        if (progressSubscriber) {
          progressSubscriber.error(e);
        }
        subscriber.error(new AjaxTimeoutError(this, request));
      };
      xhr.ontimeout.request = request;
      xhr.ontimeout.subscriber = this;
      xhr.ontimeout.progressSubscriber = progressSubscriber;
      if (xhr.upload && 'withCredentials' in xhr && root_1.root.XDomainRequest) {
        if (progressSubscriber) {
          xhr.onprogress = function xhrProgress(e) {
            var progressSubscriber = xhrProgress.progressSubscriber;
            progressSubscriber.next(e);
          };
          xhr.onprogress.progressSubscriber = progressSubscriber;
        }
        xhr.onerror = function xhrError(e) {
          var _a = xhrError,
              progressSubscriber = _a.progressSubscriber,
              subscriber = _a.subscriber,
              request = _a.request;
          if (progressSubscriber) {
            progressSubscriber.error(e);
          }
          subscriber.error(new AjaxError('ajax error', this, request));
        };
        xhr.onerror.request = request;
        xhr.onerror.subscriber = this;
        xhr.onerror.progressSubscriber = progressSubscriber;
      }
      xhr.onreadystatechange = function xhrReadyStateChange(e) {
        var _a = xhrReadyStateChange,
            subscriber = _a.subscriber,
            progressSubscriber = _a.progressSubscriber,
            request = _a.request;
        if (this.readyState === 4) {
          var status_1 = this.status === 1223 ? 204 : this.status;
          var response = this.responseType === 'text' ? this.response || this.responseText : this.response;
          if (status_1 === 0) {
            status_1 = response ? 200 : 0;
          }
          if (200 <= status_1 && status_1 < 300) {
            if (progressSubscriber) {
              progressSubscriber.complete();
            }
            subscriber.next(e);
            subscriber.complete();
          } else {
            if (progressSubscriber) {
              progressSubscriber.error(e);
            }
            subscriber.error(new AjaxError('ajax error ' + status_1, this, request));
          }
        }
      };
      xhr.onreadystatechange.subscriber = this;
      xhr.onreadystatechange.progressSubscriber = progressSubscriber;
      xhr.onreadystatechange.request = request;
    };
    AjaxSubscriber.prototype.unsubscribe = function () {
      var _a = this,
          done = _a.done,
          xhr = _a.xhr;
      if (!done && xhr && xhr.readyState !== 4) {
        xhr.abort();
      }
      _super.prototype.unsubscribe.call(this);
    };
    return AjaxSubscriber;
  }(Subscriber_1.Subscriber);
  exports.AjaxSubscriber = AjaxSubscriber;
  var AjaxResponse = function () {
    function AjaxResponse(originalEvent, xhr, request) {
      this.originalEvent = originalEvent;
      this.xhr = xhr;
      this.request = request;
      this.status = xhr.status;
      this.responseType = xhr.responseType || request.responseType;
      switch (this.responseType) {
        case 'json':
          if ('response' in xhr) {
            this.response = xhr.responseType ? xhr.response : JSON.parse(xhr.response || xhr.responseText || 'null');
          } else {
            this.response = JSON.parse(xhr.responseText || 'null');
          }
          break;
        case 'xml':
          this.response = xhr.responseXML;
          break;
        case 'text':
        default:
          this.response = 'response' in xhr ? xhr.response : xhr.responseText;
          break;
      }
    }
    return AjaxResponse;
  }();
  exports.AjaxResponse = AjaxResponse;
  var AjaxError = function (_super) {
    __extends(AjaxError, _super);
    function AjaxError(message, xhr, request) {
      _super.call(this, message);
      this.message = message;
      this.xhr = xhr;
      this.request = request;
      this.status = xhr.status;
    }
    return AjaxError;
  }(Error);
  exports.AjaxError = AjaxError;
  var AjaxTimeoutError = function (_super) {
    __extends(AjaxTimeoutError, _super);
    function AjaxTimeoutError(xhr, request) {
      _super.call(this, 'ajax timeout', xhr, request);
    }
    return AjaxTimeoutError;
  }(AjaxError);
  exports.AjaxTimeoutError = AjaxTimeoutError;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/Immediate.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
    var ImmediateDefinition = function () {
      function ImmediateDefinition(root) {
        this.root = root;
        if (root.setImmediate && typeof root.setImmediate === 'function') {
          this.setImmediate = root.setImmediate.bind(root);
          this.clearImmediate = root.clearImmediate.bind(root);
        } else {
          this.nextHandle = 1;
          this.tasksByHandle = {};
          this.currentlyRunningATask = false;
          if (this.canUseProcessNextTick()) {
            this.setImmediate = this.createProcessNextTickSetImmediate();
          } else if (this.canUsePostMessage()) {
            this.setImmediate = this.createPostMessageSetImmediate();
          } else if (this.canUseMessageChannel()) {
            this.setImmediate = this.createMessageChannelSetImmediate();
          } else if (this.canUseReadyStateChange()) {
            this.setImmediate = this.createReadyStateChangeSetImmediate();
          } else {
            this.setImmediate = this.createSetTimeoutSetImmediate();
          }
          var ci = function clearImmediate(handle) {
            delete clearImmediate.instance.tasksByHandle[handle];
          };
          ci.instance = this;
          this.clearImmediate = ci;
        }
      }
      ImmediateDefinition.prototype.identify = function (o) {
        return this.root.Object.prototype.toString.call(o);
      };
      ImmediateDefinition.prototype.canUseProcessNextTick = function () {
        return this.identify(this.root.process) === '[object process]';
      };
      ImmediateDefinition.prototype.canUseMessageChannel = function () {
        return Boolean(this.root.MessageChannel);
      };
      ImmediateDefinition.prototype.canUseReadyStateChange = function () {
        var document = this.root.document;
        return Boolean(document && 'onreadystatechange' in document.createElement('script'));
      };
      ImmediateDefinition.prototype.canUsePostMessage = function () {
        var root = this.root;
        if (root.postMessage && !root.importScripts) {
          var postMessageIsAsynchronous_1 = true;
          var oldOnMessage = root.onmessage;
          root.onmessage = function () {
            postMessageIsAsynchronous_1 = false;
          };
          root.postMessage('', '*');
          root.onmessage = oldOnMessage;
          return postMessageIsAsynchronous_1;
        }
        return false;
      };
      ImmediateDefinition.prototype.partiallyApplied = function (handler) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments[_i];
        }
        var fn = function result() {
          var _a = result,
              handler = _a.handler,
              args = _a.args;
          if (typeof handler === 'function') {
            handler.apply(undefined, args);
          } else {
            new Function('' + handler)();
          }
        };
        fn.handler = handler;
        fn.args = args;
        return fn;
      };
      ImmediateDefinition.prototype.addFromSetImmediateArguments = function (args) {
        this.tasksByHandle[this.nextHandle] = this.partiallyApplied.apply(undefined, args);
        return this.nextHandle++;
      };
      ImmediateDefinition.prototype.createProcessNextTickSetImmediate = function () {
        var fn = function setImmediate() {
          var instance = setImmediate.instance;
          var handle = instance.addFromSetImmediateArguments(arguments);
          instance.root.process.nextTick(instance.partiallyApplied(instance.runIfPresent, handle));
          return handle;
        };
        fn.instance = this;
        return fn;
      };
      ImmediateDefinition.prototype.createPostMessageSetImmediate = function () {
        var root = this.root;
        var messagePrefix = 'setImmediate$' + root.Math.random() + '$';
        var onGlobalMessage = function globalMessageHandler(event) {
          var instance = globalMessageHandler.instance;
          if (event.source === root && typeof event.data === 'string' && event.data.indexOf(messagePrefix) === 0) {
            instance.runIfPresent(+event.data.slice(messagePrefix.length));
          }
        };
        onGlobalMessage.instance = this;
        root.addEventListener('message', onGlobalMessage, false);
        var fn = function setImmediate() {
          var _a = setImmediate,
              messagePrefix = _a.messagePrefix,
              instance = _a.instance;
          var handle = instance.addFromSetImmediateArguments(arguments);
          instance.root.postMessage(messagePrefix + handle, '*');
          return handle;
        };
        fn.instance = this;
        fn.messagePrefix = messagePrefix;
        return fn;
      };
      ImmediateDefinition.prototype.runIfPresent = function (handle) {
        if (this.currentlyRunningATask) {
          this.root.setTimeout(this.partiallyApplied(this.runIfPresent, handle), 0);
        } else {
          var task = this.tasksByHandle[handle];
          if (task) {
            this.currentlyRunningATask = true;
            try {
              task();
            } finally {
              this.clearImmediate(handle);
              this.currentlyRunningATask = false;
            }
          }
        }
      };
      ImmediateDefinition.prototype.createMessageChannelSetImmediate = function () {
        var _this = this;
        var channel = new this.root.MessageChannel();
        channel.port1.onmessage = function (event) {
          var handle = event.data;
          _this.runIfPresent(handle);
        };
        var fn = function setImmediate() {
          var _a = setImmediate,
              channel = _a.channel,
              instance = _a.instance;
          var handle = instance.addFromSetImmediateArguments(arguments);
          channel.port2.postMessage(handle);
          return handle;
        };
        fn.channel = channel;
        fn.instance = this;
        return fn;
      };
      ImmediateDefinition.prototype.createReadyStateChangeSetImmediate = function () {
        var fn = function setImmediate() {
          var instance = setImmediate.instance;
          var root = instance.root;
          var doc = root.document;
          var html = doc.documentElement;
          var handle = instance.addFromSetImmediateArguments(arguments);
          var script = doc.createElement('script');
          script.onreadystatechange = function () {
            instance.runIfPresent(handle);
            script.onreadystatechange = null;
            html.removeChild(script);
            script = null;
          };
          html.appendChild(script);
          return handle;
        };
        fn.instance = this;
        return fn;
      };
      ImmediateDefinition.prototype.createSetTimeoutSetImmediate = function () {
        var fn = function setImmediate() {
          var instance = setImmediate.instance;
          var handle = instance.addFromSetImmediateArguments(arguments);
          instance.root.setTimeout(instance.partiallyApplied(instance.runIfPresent, handle), 0);
          return handle;
        };
        fn.instance = this;
        return fn;
      };
      return ImmediateDefinition;
    }();
    exports.ImmediateDefinition = ImmediateDefinition;
    exports.Immediate = new ImmediateDefinition(root_1.root);
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/AsapAction.js', ['npm:rxjs@5.0.0-beta.12/util/Immediate.js', 'npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Immediate_1 = $__require('npm:rxjs@5.0.0-beta.12/util/Immediate.js');
  var AsyncAction_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js');
  var AsapAction = function (_super) {
    __extends(AsapAction, _super);
    function AsapAction(scheduler, work) {
      _super.call(this, scheduler, work);
      this.scheduler = scheduler;
      this.work = work;
    }
    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay !== null && delay > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
      }
      scheduler.actions.push(this);
      return scheduler.scheduled || (scheduler.scheduled = Immediate_1.Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
    };
    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay !== null && delay > 0) {
        return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
      }
      if (scheduler.actions.length === 0) {
        Immediate_1.Immediate.clearImmediate(id);
        scheduler.scheduled = undefined;
      }
      return undefined;
    };
    return AsapAction;
  }(AsyncAction_1.AsyncAction);
  exports.AsapAction = AsapAction;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/scheduler/AsapScheduler.js", ["npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AsyncScheduler_1 = $__require("npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js");
  var AsapScheduler = function (_super) {
    __extends(AsapScheduler, _super);
    function AsapScheduler() {
      _super.apply(this, arguments);
    }
    AsapScheduler.prototype.flush = function () {
      this.active = true;
      this.scheduled = undefined;
      var actions = this.actions;
      var error;
      var index = -1;
      var count = actions.length;
      var action = actions.shift();
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (++index < count && (action = actions.shift()));
      this.active = false;
      if (error) {
        while (++index < count && (action = actions.shift())) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    return AsapScheduler;
  }(AsyncScheduler_1.AsyncScheduler);
  exports.AsapScheduler = AsapScheduler;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/asap.js', ['npm:rxjs@5.0.0-beta.12/scheduler/AsapAction.js', 'npm:rxjs@5.0.0-beta.12/scheduler/AsapScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var AsapAction_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsapAction.js');
  var AsapScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsapScheduler.js');
  exports.asap = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/async.js', ['npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js', 'npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var AsyncAction_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js');
  var AsyncScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js');
  exports.async = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/scheduler/QueueAction.js", ["npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AsyncAction_1 = $__require("npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js");
  var QueueAction = function (_super) {
    __extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
      _super.call(this, scheduler, work);
      this.scheduler = scheduler;
      this.work = work;
    }
    QueueAction.prototype.schedule = function (state, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay > 0) {
        return _super.prototype.schedule.call(this, state, delay);
      }
      this.delay = delay;
      this.state = state;
      this.scheduler.flush(this);
      return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
      return delay > 0 || this.closed ? _super.prototype.execute.call(this, state, delay) : this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay !== null && delay > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
      }
      return scheduler.flush(this);
    };
    return QueueAction;
  }(AsyncAction_1.AsyncAction);
  exports.QueueAction = QueueAction;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/scheduler/QueueScheduler.js", ["npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AsyncScheduler_1 = $__require("npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js");
  var QueueScheduler = function (_super) {
    __extends(QueueScheduler, _super);
    function QueueScheduler() {
      _super.apply(this, arguments);
    }
    return QueueScheduler;
  }(AsyncScheduler_1.AsyncScheduler);
  exports.QueueScheduler = QueueScheduler;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/queue.js', ['npm:rxjs@5.0.0-beta.12/scheduler/QueueAction.js', 'npm:rxjs@5.0.0-beta.12/scheduler/QueueScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var QueueAction_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/QueueAction.js');
  var QueueScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/QueueScheduler.js');
  exports.queue = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/isArray.js", [], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  exports.isArray = Array.isArray || function (x) {
    return x && typeof x.length === 'number';
  };
  

  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/isObject.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isObject(x) {
        return x != null && typeof x === 'object';
    }
    exports.isObject = isObject;
    

    return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/isFunction.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    function isFunction(x) {
        return typeof x === 'function';
    }
    exports.isFunction = isFunction;
    

    return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/tryCatch.js", ["npm:rxjs@5.0.0-beta.12/util/errorObject.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var errorObject_1 = $__require("npm:rxjs@5.0.0-beta.12/util/errorObject.js");
  var tryCatchTarget;
  function tryCatcher() {
    try {
      return tryCatchTarget.apply(this, arguments);
    } catch (e) {
      errorObject_1.errorObject.e = e;
      return errorObject_1.errorObject;
    }
  }
  function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
  }
  exports.tryCatch = tryCatch;
  ;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/errorObject.js", [], true, function ($__require, exports, module) {
  /* */
  "use strict";
  // typeof any so that it we don't have to cast when comparing a result to the error object

  var define,
      global = this || self,
      GLOBAL = global;
  exports.errorObject = { e: {} };
  

  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/UnsubscriptionError.js", [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var __extends = this && this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    /**
     * An error thrown when one or more errors have occurred during the
     * `unsubscribe` of a {@link Subscription}.
     */
    var UnsubscriptionError = function (_super) {
        __extends(UnsubscriptionError, _super);
        function UnsubscriptionError(errors) {
            _super.call(this);
            this.errors = errors;
            var err = Error.call(this, errors ? errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) {
                return i + 1 + ") " + err.toString();
            }).join('\n  ') : '');
            this.name = err.name = 'UnsubscriptionError';
            this.stack = err.stack;
            this.message = err.message;
        }
        return UnsubscriptionError;
    }(Error);
    exports.UnsubscriptionError = UnsubscriptionError;
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/Subscription.js', ['npm:rxjs@5.0.0-beta.12/util/isArray.js', 'npm:rxjs@5.0.0-beta.12/util/isObject.js', 'npm:rxjs@5.0.0-beta.12/util/isFunction.js', 'npm:rxjs@5.0.0-beta.12/util/tryCatch.js', 'npm:rxjs@5.0.0-beta.12/util/errorObject.js', 'npm:rxjs@5.0.0-beta.12/util/UnsubscriptionError.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var isArray_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isArray.js');
    var isObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isObject.js');
    var isFunction_1 = $__require('npm:rxjs@5.0.0-beta.12/util/isFunction.js');
    var tryCatch_1 = $__require('npm:rxjs@5.0.0-beta.12/util/tryCatch.js');
    var errorObject_1 = $__require('npm:rxjs@5.0.0-beta.12/util/errorObject.js');
    var UnsubscriptionError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/UnsubscriptionError.js');
    var Subscription = function () {
      function Subscription(unsubscribe) {
        this.closed = false;
        if (unsubscribe) {
          this._unsubscribe = unsubscribe;
        }
      }
      Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
          return;
        }
        this.closed = true;
        var _a = this,
            _unsubscribe = _a._unsubscribe,
            _subscriptions = _a._subscriptions;
        this._subscriptions = null;
        if (isFunction_1.isFunction(_unsubscribe)) {
          var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
          if (trial === errorObject_1.errorObject) {
            hasErrors = true;
            (errors = errors || []).push(errorObject_1.errorObject.e);
          }
        }
        if (isArray_1.isArray(_subscriptions)) {
          var index = -1;
          var len = _subscriptions.length;
          while (++index < len) {
            var sub = _subscriptions[index];
            if (isObject_1.isObject(sub)) {
              var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
              if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || [];
                var err = errorObject_1.errorObject.e;
                if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                  errors = errors.concat(err.errors);
                } else {
                  errors.push(err);
                }
              }
            }
          }
        }
        if (hasErrors) {
          throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
      };
      Subscription.prototype.add = function (teardown) {
        if (!teardown || teardown === Subscription.EMPTY) {
          return Subscription.EMPTY;
        }
        if (teardown === this) {
          return this;
        }
        var sub = teardown;
        switch (typeof teardown) {
          case 'function':
            sub = new Subscription(teardown);
          case 'object':
            if (sub.closed || typeof sub.unsubscribe !== 'function') {
              break;
            } else if (this.closed) {
              sub.unsubscribe();
            } else {
              (this._subscriptions || (this._subscriptions = [])).push(sub);
            }
            break;
          default:
            throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        return sub;
      };
      Subscription.prototype.remove = function (subscription) {
        if (subscription == null || subscription === this || subscription === Subscription.EMPTY) {
          return;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions) {
          var subscriptionIndex = subscriptions.indexOf(subscription);
          if (subscriptionIndex !== -1) {
            subscriptions.splice(subscriptionIndex, 1);
          }
        }
      };
      Subscription.EMPTY = function (empty) {
        empty.closed = true;
        return empty;
      }(new Subscription());
      return Subscription;
    }();
    exports.Subscription = Subscription;
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/scheduler/Action.js", ["npm:rxjs@5.0.0-beta.12/Subscription.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Subscription_1 = $__require("npm:rxjs@5.0.0-beta.12/Subscription.js");
  var Action = function (_super) {
    __extends(Action, _super);
    function Action(scheduler, work) {
      _super.call(this);
    }
    Action.prototype.schedule = function (state, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      return this;
    };
    return Action;
  }(Subscription_1.Subscription);
  exports.Action = Action;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js', ['npm:rxjs@5.0.0-beta.12/util/root.js', 'npm:rxjs@5.0.0-beta.12/scheduler/Action.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var Action_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/Action.js');
  var AsyncAction = function (_super) {
    __extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
      _super.call(this, scheduler, work);
      this.scheduler = scheduler;
      this.work = work;
      this.pending = false;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (this.closed) {
        return this;
      }
      this.state = state;
      this.pending = true;
      var id = this.id;
      var scheduler = this.scheduler;
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, delay);
      }
      this.delay = delay;
      this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
      return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      return root_1.root.setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay !== null && this.delay === delay) {
        return id;
      }
      return root_1.root.clearInterval(id) && undefined || undefined;
    };
    AsyncAction.prototype.execute = function (state, delay) {
      if (this.closed) {
        return new Error('executing a cancelled action');
      }
      this.pending = false;
      var error = this._execute(state, delay);
      if (error) {
        return error;
      } else if (this.pending === false && this.id != null) {
        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
      }
    };
    AsyncAction.prototype._execute = function (state, delay) {
      var errored = false;
      var errorValue = undefined;
      try {
        this.work(state);
      } catch (e) {
        errored = true;
        errorValue = !!e && e || new Error(e);
      }
      if (errored) {
        this.unsubscribe();
        return errorValue;
      }
    };
    AsyncAction.prototype._unsubscribe = function () {
      var id = this.id;
      var scheduler = this.scheduler;
      var actions = scheduler.actions;
      var index = actions.indexOf(this);
      this.work = null;
      this.delay = null;
      this.state = null;
      this.pending = false;
      this.scheduler = null;
      if (index !== -1) {
        actions.splice(index, 1);
      }
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, null);
      }
    };
    return AsyncAction;
  }(Action_1.Action);
  exports.AsyncAction = AsyncAction;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/util/AnimationFrame.js", ["npm:rxjs@5.0.0-beta.12/util/root.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require("npm:rxjs@5.0.0-beta.12/util/root.js");
  var RequestAnimationFrameDefinition = function () {
    function RequestAnimationFrameDefinition(root) {
      if (root.requestAnimationFrame) {
        this.cancelAnimationFrame = root.cancelAnimationFrame.bind(root);
        this.requestAnimationFrame = root.requestAnimationFrame.bind(root);
      } else if (root.mozRequestAnimationFrame) {
        this.cancelAnimationFrame = root.mozCancelAnimationFrame.bind(root);
        this.requestAnimationFrame = root.mozRequestAnimationFrame.bind(root);
      } else if (root.webkitRequestAnimationFrame) {
        this.cancelAnimationFrame = root.webkitCancelAnimationFrame.bind(root);
        this.requestAnimationFrame = root.webkitRequestAnimationFrame.bind(root);
      } else if (root.msRequestAnimationFrame) {
        this.cancelAnimationFrame = root.msCancelAnimationFrame.bind(root);
        this.requestAnimationFrame = root.msRequestAnimationFrame.bind(root);
      } else if (root.oRequestAnimationFrame) {
        this.cancelAnimationFrame = root.oCancelAnimationFrame.bind(root);
        this.requestAnimationFrame = root.oRequestAnimationFrame.bind(root);
      } else {
        this.cancelAnimationFrame = root.clearTimeout.bind(root);
        this.requestAnimationFrame = function (cb) {
          return root.setTimeout(cb, 1000 / 60);
        };
      }
    }
    return RequestAnimationFrameDefinition;
  }();
  exports.RequestAnimationFrameDefinition = RequestAnimationFrameDefinition;
  exports.AnimationFrame = new RequestAnimationFrameDefinition(root_1.root);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/AnimationFrameAction.js', ['npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js', 'npm:rxjs@5.0.0-beta.12/util/AnimationFrame.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AsyncAction_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AsyncAction.js');
  var AnimationFrame_1 = $__require('npm:rxjs@5.0.0-beta.12/util/AnimationFrame.js');
  var AnimationFrameAction = function (_super) {
    __extends(AnimationFrameAction, _super);
    function AnimationFrameAction(scheduler, work) {
      _super.call(this, scheduler, work);
      this.scheduler = scheduler;
      this.work = work;
    }
    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay !== null && delay > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
      }
      scheduler.actions.push(this);
      return scheduler.scheduled || (scheduler.scheduled = AnimationFrame_1.AnimationFrame.requestAnimationFrame(scheduler.flush.bind(scheduler, null)));
    };
    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
      if (delay === void 0) {
        delay = 0;
      }
      if (delay !== null && delay > 0) {
        return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
      }
      if (scheduler.actions.length === 0) {
        AnimationFrame_1.AnimationFrame.cancelAnimationFrame(id);
        scheduler.scheduled = undefined;
      }
      return undefined;
    };
    return AnimationFrameAction;
  }(AsyncAction_1.AsyncAction);
  exports.AnimationFrameAction = AnimationFrameAction;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/Scheduler.js", ["github:jspm/nodelibs-process@0.1.2.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var Scheduler = function () {
      function Scheduler(SchedulerAction, now) {
        if (now === void 0) {
          now = Scheduler.now;
        }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
      }
      Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) {
          delay = 0;
        }
        return new this.SchedulerAction(this, work).schedule(state, delay);
      };
      Scheduler.now = Date.now ? Date.now : function () {
        return +new Date();
      };
      return Scheduler;
    }();
    exports.Scheduler = Scheduler;
  })($__require("github:jspm/nodelibs-process@0.1.2.js"));
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js", ["npm:rxjs@5.0.0-beta.12/Scheduler.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Scheduler_1 = $__require("npm:rxjs@5.0.0-beta.12/Scheduler.js");
  var AsyncScheduler = function (_super) {
    __extends(AsyncScheduler, _super);
    function AsyncScheduler() {
      _super.apply(this, arguments);
      this.actions = [];
      this.active = false;
      this.scheduled = undefined;
    }
    AsyncScheduler.prototype.flush = function (action) {
      var actions = this.actions;
      if (this.active) {
        actions.push(action);
        return;
      }
      var error;
      this.active = true;
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (action = actions.shift());
      this.active = false;
      if (error) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    return AsyncScheduler;
  }(Scheduler_1.Scheduler);
  exports.AsyncScheduler = AsyncScheduler;
  return module.exports;
});
System.registerDynamic("npm:rxjs@5.0.0-beta.12/scheduler/AnimationFrameScheduler.js", ["npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var __extends = this && this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AsyncScheduler_1 = $__require("npm:rxjs@5.0.0-beta.12/scheduler/AsyncScheduler.js");
  var AnimationFrameScheduler = function (_super) {
    __extends(AnimationFrameScheduler, _super);
    function AnimationFrameScheduler() {
      _super.apply(this, arguments);
    }
    AnimationFrameScheduler.prototype.flush = function () {
      this.active = true;
      this.scheduled = undefined;
      var actions = this.actions;
      var error;
      var index = -1;
      var count = actions.length;
      var action = actions.shift();
      do {
        if (error = action.execute(action.state, action.delay)) {
          break;
        }
      } while (++index < count && (action = actions.shift()));
      this.active = false;
      if (error) {
        while (++index < count && (action = actions.shift())) {
          action.unsubscribe();
        }
        throw error;
      }
    };
    return AnimationFrameScheduler;
  }(AsyncScheduler_1.AsyncScheduler);
  exports.AnimationFrameScheduler = AnimationFrameScheduler;
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/scheduler/animationFrame.js', ['npm:rxjs@5.0.0-beta.12/scheduler/AnimationFrameAction.js', 'npm:rxjs@5.0.0-beta.12/scheduler/AnimationFrameScheduler.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var AnimationFrameAction_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AnimationFrameAction.js');
  var AnimationFrameScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/AnimationFrameScheduler.js');
  exports.animationFrame = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js', ['npm:rxjs@5.0.0-beta.12/util/root.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var Symbol = root_1.root.Symbol;
  exports.$$rxSubscriber = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('rxSubscriber') : '@@rxSubscriber';
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/symbol/iterator.js', ['npm:rxjs@5.0.0-beta.12/util/root.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  var Symbol = root_1.root.Symbol;
  if (typeof Symbol === 'function') {
    if (Symbol.iterator) {
      exports.$$iterator = Symbol.iterator;
    } else if (typeof Symbol.for === 'function') {
      exports.$$iterator = Symbol.for('iterator');
    }
  } else {
    if (root_1.root.Set && typeof new root_1.root.Set()['@@iterator'] === 'function') {
      exports.$$iterator = '@@iterator';
    } else if (root_1.root.Map) {
      var keys = Object.getOwnPropertyNames(root_1.root.Map.prototype);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key !== 'entries' && key !== 'size' && root_1.root.Map.prototype[key] === root_1.root.Map.prototype['entries']) {
          exports.$$iterator = key;
          break;
        }
      }
    } else {
      exports.$$iterator = '@@iterator';
    }
  }
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/util/root.js', [], true, function ($__require, exports, module) {
    /* */
    "use strict";

    var define,
        global = this || self,
        GLOBAL = global;
    var objectTypes = {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    };
    exports.root = objectTypes[typeof self] && self || objectTypes[typeof window] && window;
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
        exports.root = freeGlobal;
    }
    

    return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/symbol/observable.js', ['npm:rxjs@5.0.0-beta.12/util/root.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var root_1 = $__require('npm:rxjs@5.0.0-beta.12/util/root.js');
  function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
      if (Symbol.observable) {
        $$observable = Symbol.observable;
      } else {
        $$observable = Symbol('observable');
        Symbol.observable = $$observable;
      }
    } else {
      $$observable = '@@observable';
    }
    return $$observable;
  }
  exports.getSymbolObservable = getSymbolObservable;
  exports.$$observable = getSymbolObservable(root_1.root);
  return module.exports;
});
System.registerDynamic('npm:rxjs@5.0.0-beta.12/Rx.js', ['npm:rxjs@5.0.0-beta.12/Subject.js', 'npm:rxjs@5.0.0-beta.12/Observable.js', 'npm:rxjs@5.0.0-beta.12/add/observable/bindCallback.js', 'npm:rxjs@5.0.0-beta.12/add/observable/bindNodeCallback.js', 'npm:rxjs@5.0.0-beta.12/add/observable/combineLatest.js', 'npm:rxjs@5.0.0-beta.12/add/observable/concat.js', 'npm:rxjs@5.0.0-beta.12/add/observable/defer.js', 'npm:rxjs@5.0.0-beta.12/add/observable/empty.js', 'npm:rxjs@5.0.0-beta.12/add/observable/forkJoin.js', 'npm:rxjs@5.0.0-beta.12/add/observable/from.js', 'npm:rxjs@5.0.0-beta.12/add/observable/fromEvent.js', 'npm:rxjs@5.0.0-beta.12/add/observable/fromEventPattern.js', 'npm:rxjs@5.0.0-beta.12/add/observable/fromPromise.js', 'npm:rxjs@5.0.0-beta.12/add/observable/generate.js', 'npm:rxjs@5.0.0-beta.12/add/observable/if.js', 'npm:rxjs@5.0.0-beta.12/add/observable/interval.js', 'npm:rxjs@5.0.0-beta.12/add/observable/merge.js', 'npm:rxjs@5.0.0-beta.12/add/observable/race.js', 'npm:rxjs@5.0.0-beta.12/add/observable/never.js', 'npm:rxjs@5.0.0-beta.12/add/observable/of.js', 'npm:rxjs@5.0.0-beta.12/add/observable/onErrorResumeNext.js', 'npm:rxjs@5.0.0-beta.12/add/observable/pairs.js', 'npm:rxjs@5.0.0-beta.12/add/observable/range.js', 'npm:rxjs@5.0.0-beta.12/add/observable/using.js', 'npm:rxjs@5.0.0-beta.12/add/observable/throw.js', 'npm:rxjs@5.0.0-beta.12/add/observable/timer.js', 'npm:rxjs@5.0.0-beta.12/add/observable/zip.js', 'npm:rxjs@5.0.0-beta.12/add/observable/dom/ajax.js', 'npm:rxjs@5.0.0-beta.12/add/observable/dom/webSocket.js', 'npm:rxjs@5.0.0-beta.12/add/operator/buffer.js', 'npm:rxjs@5.0.0-beta.12/add/operator/bufferCount.js', 'npm:rxjs@5.0.0-beta.12/add/operator/bufferTime.js', 'npm:rxjs@5.0.0-beta.12/add/operator/bufferToggle.js', 'npm:rxjs@5.0.0-beta.12/add/operator/bufferWhen.js', 'npm:rxjs@5.0.0-beta.12/add/operator/cache.js', 'npm:rxjs@5.0.0-beta.12/add/operator/catch.js', 'npm:rxjs@5.0.0-beta.12/add/operator/combineAll.js', 'npm:rxjs@5.0.0-beta.12/add/operator/combineLatest.js', 'npm:rxjs@5.0.0-beta.12/add/operator/concat.js', 'npm:rxjs@5.0.0-beta.12/add/operator/concatAll.js', 'npm:rxjs@5.0.0-beta.12/add/operator/concatMap.js', 'npm:rxjs@5.0.0-beta.12/add/operator/concatMapTo.js', 'npm:rxjs@5.0.0-beta.12/add/operator/count.js', 'npm:rxjs@5.0.0-beta.12/add/operator/dematerialize.js', 'npm:rxjs@5.0.0-beta.12/add/operator/debounce.js', 'npm:rxjs@5.0.0-beta.12/add/operator/debounceTime.js', 'npm:rxjs@5.0.0-beta.12/add/operator/defaultIfEmpty.js', 'npm:rxjs@5.0.0-beta.12/add/operator/delay.js', 'npm:rxjs@5.0.0-beta.12/add/operator/delayWhen.js', 'npm:rxjs@5.0.0-beta.12/add/operator/distinct.js', 'npm:rxjs@5.0.0-beta.12/add/operator/distinctKey.js', 'npm:rxjs@5.0.0-beta.12/add/operator/distinctUntilChanged.js', 'npm:rxjs@5.0.0-beta.12/add/operator/distinctUntilKeyChanged.js', 'npm:rxjs@5.0.0-beta.12/add/operator/do.js', 'npm:rxjs@5.0.0-beta.12/add/operator/exhaust.js', 'npm:rxjs@5.0.0-beta.12/add/operator/exhaustMap.js', 'npm:rxjs@5.0.0-beta.12/add/operator/expand.js', 'npm:rxjs@5.0.0-beta.12/add/operator/elementAt.js', 'npm:rxjs@5.0.0-beta.12/add/operator/filter.js', 'npm:rxjs@5.0.0-beta.12/add/operator/finally.js', 'npm:rxjs@5.0.0-beta.12/add/operator/find.js', 'npm:rxjs@5.0.0-beta.12/add/operator/findIndex.js', 'npm:rxjs@5.0.0-beta.12/add/operator/first.js', 'npm:rxjs@5.0.0-beta.12/add/operator/groupBy.js', 'npm:rxjs@5.0.0-beta.12/add/operator/ignoreElements.js', 'npm:rxjs@5.0.0-beta.12/add/operator/isEmpty.js', 'npm:rxjs@5.0.0-beta.12/add/operator/audit.js', 'npm:rxjs@5.0.0-beta.12/add/operator/auditTime.js', 'npm:rxjs@5.0.0-beta.12/add/operator/last.js', 'npm:rxjs@5.0.0-beta.12/add/operator/let.js', 'npm:rxjs@5.0.0-beta.12/add/operator/every.js', 'npm:rxjs@5.0.0-beta.12/add/operator/map.js', 'npm:rxjs@5.0.0-beta.12/add/operator/mapTo.js', 'npm:rxjs@5.0.0-beta.12/add/operator/materialize.js', 'npm:rxjs@5.0.0-beta.12/add/operator/max.js', 'npm:rxjs@5.0.0-beta.12/add/operator/merge.js', 'npm:rxjs@5.0.0-beta.12/add/operator/mergeAll.js', 'npm:rxjs@5.0.0-beta.12/add/operator/mergeMap.js', 'npm:rxjs@5.0.0-beta.12/add/operator/mergeMapTo.js', 'npm:rxjs@5.0.0-beta.12/add/operator/mergeScan.js', 'npm:rxjs@5.0.0-beta.12/add/operator/min.js', 'npm:rxjs@5.0.0-beta.12/add/operator/multicast.js', 'npm:rxjs@5.0.0-beta.12/add/operator/observeOn.js', 'npm:rxjs@5.0.0-beta.12/add/operator/onErrorResumeNext.js', 'npm:rxjs@5.0.0-beta.12/add/operator/pairwise.js', 'npm:rxjs@5.0.0-beta.12/add/operator/partition.js', 'npm:rxjs@5.0.0-beta.12/add/operator/pluck.js', 'npm:rxjs@5.0.0-beta.12/add/operator/publish.js', 'npm:rxjs@5.0.0-beta.12/add/operator/publishBehavior.js', 'npm:rxjs@5.0.0-beta.12/add/operator/publishReplay.js', 'npm:rxjs@5.0.0-beta.12/add/operator/publishLast.js', 'npm:rxjs@5.0.0-beta.12/add/operator/race.js', 'npm:rxjs@5.0.0-beta.12/add/operator/reduce.js', 'npm:rxjs@5.0.0-beta.12/add/operator/repeat.js', 'npm:rxjs@5.0.0-beta.12/add/operator/repeatWhen.js', 'npm:rxjs@5.0.0-beta.12/add/operator/retry.js', 'npm:rxjs@5.0.0-beta.12/add/operator/retryWhen.js', 'npm:rxjs@5.0.0-beta.12/add/operator/sample.js', 'npm:rxjs@5.0.0-beta.12/add/operator/sampleTime.js', 'npm:rxjs@5.0.0-beta.12/add/operator/scan.js', 'npm:rxjs@5.0.0-beta.12/add/operator/sequenceEqual.js', 'npm:rxjs@5.0.0-beta.12/add/operator/share.js', 'npm:rxjs@5.0.0-beta.12/add/operator/single.js', 'npm:rxjs@5.0.0-beta.12/add/operator/skip.js', 'npm:rxjs@5.0.0-beta.12/add/operator/skipUntil.js', 'npm:rxjs@5.0.0-beta.12/add/operator/skipWhile.js', 'npm:rxjs@5.0.0-beta.12/add/operator/startWith.js', 'npm:rxjs@5.0.0-beta.12/add/operator/subscribeOn.js', 'npm:rxjs@5.0.0-beta.12/add/operator/switch.js', 'npm:rxjs@5.0.0-beta.12/add/operator/switchMap.js', 'npm:rxjs@5.0.0-beta.12/add/operator/switchMapTo.js', 'npm:rxjs@5.0.0-beta.12/add/operator/take.js', 'npm:rxjs@5.0.0-beta.12/add/operator/takeLast.js', 'npm:rxjs@5.0.0-beta.12/add/operator/takeUntil.js', 'npm:rxjs@5.0.0-beta.12/add/operator/takeWhile.js', 'npm:rxjs@5.0.0-beta.12/add/operator/throttle.js', 'npm:rxjs@5.0.0-beta.12/add/operator/throttleTime.js', 'npm:rxjs@5.0.0-beta.12/add/operator/timeInterval.js', 'npm:rxjs@5.0.0-beta.12/add/operator/timeout.js', 'npm:rxjs@5.0.0-beta.12/add/operator/timeoutWith.js', 'npm:rxjs@5.0.0-beta.12/add/operator/timestamp.js', 'npm:rxjs@5.0.0-beta.12/add/operator/toArray.js', 'npm:rxjs@5.0.0-beta.12/add/operator/toPromise.js', 'npm:rxjs@5.0.0-beta.12/add/operator/window.js', 'npm:rxjs@5.0.0-beta.12/add/operator/windowCount.js', 'npm:rxjs@5.0.0-beta.12/add/operator/windowTime.js', 'npm:rxjs@5.0.0-beta.12/add/operator/windowToggle.js', 'npm:rxjs@5.0.0-beta.12/add/operator/windowWhen.js', 'npm:rxjs@5.0.0-beta.12/add/operator/withLatestFrom.js', 'npm:rxjs@5.0.0-beta.12/add/operator/zip.js', 'npm:rxjs@5.0.0-beta.12/add/operator/zipAll.js', 'npm:rxjs@5.0.0-beta.12/Subscription.js', 'npm:rxjs@5.0.0-beta.12/Subscriber.js', 'npm:rxjs@5.0.0-beta.12/AsyncSubject.js', 'npm:rxjs@5.0.0-beta.12/ReplaySubject.js', 'npm:rxjs@5.0.0-beta.12/BehaviorSubject.js', 'npm:rxjs@5.0.0-beta.12/observable/MulticastObservable.js', 'npm:rxjs@5.0.0-beta.12/observable/ConnectableObservable.js', 'npm:rxjs@5.0.0-beta.12/Notification.js', 'npm:rxjs@5.0.0-beta.12/util/EmptyError.js', 'npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js', 'npm:rxjs@5.0.0-beta.12/util/ObjectUnsubscribedError.js', 'npm:rxjs@5.0.0-beta.12/util/UnsubscriptionError.js', 'npm:rxjs@5.0.0-beta.12/operator/timeInterval.js', 'npm:rxjs@5.0.0-beta.12/operator/timestamp.js', 'npm:rxjs@5.0.0-beta.12/testing/TestScheduler.js', 'npm:rxjs@5.0.0-beta.12/scheduler/VirtualTimeScheduler.js', 'npm:rxjs@5.0.0-beta.12/observable/dom/AjaxObservable.js', 'npm:rxjs@5.0.0-beta.12/scheduler/asap.js', 'npm:rxjs@5.0.0-beta.12/scheduler/async.js', 'npm:rxjs@5.0.0-beta.12/scheduler/queue.js', 'npm:rxjs@5.0.0-beta.12/scheduler/animationFrame.js', 'npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js', 'npm:rxjs@5.0.0-beta.12/symbol/iterator.js', 'npm:rxjs@5.0.0-beta.12/symbol/observable.js', 'github:jspm/nodelibs-process@0.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (process) {
    "use strict";

    var Subject_1 = $__require('npm:rxjs@5.0.0-beta.12/Subject.js');
    exports.Subject = Subject_1.Subject;
    var Observable_1 = $__require('npm:rxjs@5.0.0-beta.12/Observable.js');
    exports.Observable = Observable_1.Observable;
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/bindCallback.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/bindNodeCallback.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/combineLatest.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/concat.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/defer.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/empty.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/forkJoin.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/from.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/fromEvent.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/fromEventPattern.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/fromPromise.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/generate.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/if.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/interval.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/merge.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/race.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/never.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/of.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/onErrorResumeNext.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/pairs.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/range.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/using.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/throw.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/timer.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/zip.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/dom/ajax.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/observable/dom/webSocket.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/buffer.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/bufferCount.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/bufferTime.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/bufferToggle.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/bufferWhen.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/cache.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/catch.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/combineAll.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/combineLatest.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/concat.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/concatAll.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/concatMap.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/concatMapTo.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/count.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/dematerialize.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/debounce.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/debounceTime.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/defaultIfEmpty.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/delay.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/delayWhen.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/distinct.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/distinctKey.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/distinctUntilChanged.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/distinctUntilKeyChanged.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/do.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/exhaust.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/exhaustMap.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/expand.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/elementAt.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/filter.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/finally.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/find.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/findIndex.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/first.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/groupBy.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/ignoreElements.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/isEmpty.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/audit.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/auditTime.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/last.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/let.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/every.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/map.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/mapTo.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/materialize.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/max.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/merge.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/mergeAll.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/mergeMap.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/mergeMapTo.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/mergeScan.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/min.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/multicast.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/observeOn.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/onErrorResumeNext.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/pairwise.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/partition.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/pluck.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/publish.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/publishBehavior.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/publishReplay.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/publishLast.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/race.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/reduce.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/repeat.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/repeatWhen.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/retry.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/retryWhen.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/sample.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/sampleTime.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/scan.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/sequenceEqual.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/share.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/single.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/skip.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/skipUntil.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/skipWhile.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/startWith.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/subscribeOn.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/switch.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/switchMap.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/switchMapTo.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/take.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/takeLast.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/takeUntil.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/takeWhile.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/throttle.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/throttleTime.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/timeInterval.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/timeout.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/timeoutWith.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/timestamp.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/toArray.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/toPromise.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/window.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/windowCount.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/windowTime.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/windowToggle.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/windowWhen.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/withLatestFrom.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/zip.js');
    $__require('npm:rxjs@5.0.0-beta.12/add/operator/zipAll.js');
    var Subscription_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscription.js');
    exports.Subscription = Subscription_1.Subscription;
    var Subscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/Subscriber.js');
    exports.Subscriber = Subscriber_1.Subscriber;
    var AsyncSubject_1 = $__require('npm:rxjs@5.0.0-beta.12/AsyncSubject.js');
    exports.AsyncSubject = AsyncSubject_1.AsyncSubject;
    var ReplaySubject_1 = $__require('npm:rxjs@5.0.0-beta.12/ReplaySubject.js');
    exports.ReplaySubject = ReplaySubject_1.ReplaySubject;
    var BehaviorSubject_1 = $__require('npm:rxjs@5.0.0-beta.12/BehaviorSubject.js');
    exports.BehaviorSubject = BehaviorSubject_1.BehaviorSubject;
    var MulticastObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/MulticastObservable.js');
    exports.MulticastObservable = MulticastObservable_1.MulticastObservable;
    var ConnectableObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/ConnectableObservable.js');
    exports.ConnectableObservable = ConnectableObservable_1.ConnectableObservable;
    var Notification_1 = $__require('npm:rxjs@5.0.0-beta.12/Notification.js');
    exports.Notification = Notification_1.Notification;
    var EmptyError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/EmptyError.js');
    exports.EmptyError = EmptyError_1.EmptyError;
    var ArgumentOutOfRangeError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/ArgumentOutOfRangeError.js');
    exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
    var ObjectUnsubscribedError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/ObjectUnsubscribedError.js');
    exports.ObjectUnsubscribedError = ObjectUnsubscribedError_1.ObjectUnsubscribedError;
    var UnsubscriptionError_1 = $__require('npm:rxjs@5.0.0-beta.12/util/UnsubscriptionError.js');
    exports.UnsubscriptionError = UnsubscriptionError_1.UnsubscriptionError;
    var timeInterval_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/timeInterval.js');
    exports.TimeInterval = timeInterval_1.TimeInterval;
    var timestamp_1 = $__require('npm:rxjs@5.0.0-beta.12/operator/timestamp.js');
    exports.Timestamp = timestamp_1.Timestamp;
    var TestScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/testing/TestScheduler.js');
    exports.TestScheduler = TestScheduler_1.TestScheduler;
    var VirtualTimeScheduler_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/VirtualTimeScheduler.js');
    exports.VirtualTimeScheduler = VirtualTimeScheduler_1.VirtualTimeScheduler;
    var AjaxObservable_1 = $__require('npm:rxjs@5.0.0-beta.12/observable/dom/AjaxObservable.js');
    exports.AjaxResponse = AjaxObservable_1.AjaxResponse;
    exports.AjaxError = AjaxObservable_1.AjaxError;
    exports.AjaxTimeoutError = AjaxObservable_1.AjaxTimeoutError;
    var asap_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/asap.js');
    var async_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/async.js');
    var queue_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/queue.js');
    var animationFrame_1 = $__require('npm:rxjs@5.0.0-beta.12/scheduler/animationFrame.js');
    var rxSubscriber_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/rxSubscriber.js');
    var iterator_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/iterator.js');
    var observable_1 = $__require('npm:rxjs@5.0.0-beta.12/symbol/observable.js');
    var Scheduler = {
      asap: asap_1.asap,
      queue: queue_1.queue,
      animationFrame: animationFrame_1.animationFrame,
      async: async_1.async
    };
    exports.Scheduler = Scheduler;
    var Symbol = {
      rxSubscriber: rxSubscriber_1.$$rxSubscriber,
      observable: observable_1.$$observable,
      iterator: iterator_1.$$iterator
    };
    exports.Symbol = Symbol;
  })($__require('github:jspm/nodelibs-process@0.1.2.js'));
  return module.exports;
});
System.registerDynamic('npm:lik@1.0.24/dist/lik.plugins.js', ['npm:typings-global@1.0.14.js', 'npm:q@1.4.1.js', 'github:jspm/nodelibs-events@0.1.1.js', 'npm:lodash@4.16.2.js', 'npm:minimatch@3.0.3.js', 'npm:rxjs@5.0.0-beta.12/Rx.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  $__require('npm:typings-global@1.0.14.js');
  exports.q = $__require('npm:q@1.4.1.js');
  exports.events = $__require('github:jspm/nodelibs-events@0.1.1.js');
  exports.lodash = $__require('npm:lodash@4.16.2.js');
  exports.minimatch = $__require('npm:minimatch@3.0.3.js');
  exports.rx = $__require('npm:rxjs@5.0.0-beta.12/Rx.js');
  return module.exports;
});
System.registerDynamic("npm:lik@1.0.24/dist/lik.objectmap.js", ["npm:lik@1.0.24/dist/lik.plugins.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  const plugins = $__require("npm:lik@1.0.24/dist/lik.plugins.js");
  class Objectmap {
    constructor() {
      this.objectArray = [];
    }
    add(objectArg) {
      this.objectArray.push(objectArg);
    }
    addArray(objectArrayArg) {
      for (let item of objectArrayArg) {
        this.add(item);
      }
    }
    remove(objectArg) {
      let replacmentArray = [];
      for (let item of this.objectArray) {
        if (item !== objectArg) {
          replacmentArray.push(item);
        }
      }
      this.objectArray = replacmentArray;
    }
    checkForObject(objectArg) {
      return this.objectArray.indexOf(objectArg) !== -1;
    }
    find(findFunction) {
      let resultArray = this.objectArray.filter(findFunction);
      if (resultArray.length > 0) {
        return resultArray[0];
      } else {
        return null;
      }
    }
    forEach(functionArg) {
      return this.objectArray.forEach(functionArg);
    }
    wipe() {
      this.objectArray = [];
    }
    getArray() {
      return plugins.lodash.cloneDeep(this.objectArray);
    }
  }
  exports.Objectmap = Objectmap;
  return module.exports;
});
System.registerDynamic('npm:lik@1.0.24/dist/lik.observablemap.js', ['npm:lik@1.0.24/dist/lik.plugins.js', 'npm:lik@1.0.24/dist/lik.objectmap.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  const plugins = $__require('npm:lik@1.0.24/dist/lik.plugins.js');
  const lik_objectmap_1 = $__require('npm:lik@1.0.24/dist/lik.objectmap.js');
  class Observablemap {
    constructor() {
      this.ObservableEmitterBundleObjectmap = new lik_objectmap_1.Objectmap();
    }
    getObservableForEmitterEvent(emitterArg, eventArg) {
      let existingBundle = this.ObservableEmitterBundleObjectmap.find(bundleArg => {
        return bundleArg.emitter === emitterArg && bundleArg.event === eventArg;
      });
      if (existingBundle) {
        return existingBundle.observable;
      } else {
        let emitterObservable = plugins.rx.Observable.fromEvent(emitterArg, eventArg);
        this.ObservableEmitterBundleObjectmap.add({
          observable: emitterObservable,
          emitter: emitterArg,
          event: eventArg
        });
        return emitterObservable;
      }
    }
  }
  exports.Observablemap = Observablemap;
  return module.exports;
});
System.registerDynamic('npm:lik@1.0.24/dist/index.js', ['npm:lik@1.0.24/dist/lik.stringmap.js', 'npm:lik@1.0.24/dist/lik.objectmap.js', 'npm:lik@1.0.24/dist/lik.observablemap.js'], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
  __export($__require('npm:lik@1.0.24/dist/lik.stringmap.js'));
  __export($__require('npm:lik@1.0.24/dist/lik.objectmap.js'));
  __export($__require('npm:lik@1.0.24/dist/lik.observablemap.js'));
  return module.exports;
});
System.registerDynamic("npm:lik@1.0.24.js", ["npm:lik@1.0.24/dist/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:lik@1.0.24/dist/index.js");
  return module.exports;
});
System.registerDynamic('npm:process@0.11.9/browser.js', [], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    // shim for using process in browser
    var process = module.exports = {};

    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    })();
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch (e) {
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e) {
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;

    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
        return '/';
    };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function () {
        return 0;
    };
    return module.exports;
});
System.registerDynamic("npm:process@0.11.9.js", ["npm:process@0.11.9/browser.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:process@0.11.9/browser.js");
  return module.exports;
});
System.registerDynamic('github:jspm/nodelibs-process@0.1.2/index.js', ['npm:process@0.11.9.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = System._nodeRequire ? process : $__require('npm:process@0.11.9.js');
  return module.exports;
});
System.registerDynamic("github:jspm/nodelibs-process@0.1.2.js", ["github:jspm/nodelibs-process@0.1.2/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("github:jspm/nodelibs-process@0.1.2/index.js");
  return module.exports;
});
System.registerDynamic("npm:q@1.4.1/q.js", ["github:jspm/nodelibs-process@0.1.2.js"], true, function ($__require, exports, module) {
  /* */
  "format cjs";

  var define,
      global = this || self,
      GLOBAL = global;
  (function (process) {
    (function (definition) {
      "use strict";

      if (typeof bootstrap === "function") {
        bootstrap("promise", definition);
      } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();
      } else if (typeof define === "function" && define.amd) {
        define(definition);
      } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
          return;
        } else {
          ses.makeQ = definition;
        }
      } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        var global = typeof window !== "undefined" ? window : self;
        var previousQ = global.Q;
        global.Q = definition();
        global.Q.noConflict = function () {
          global.Q = previousQ;
          return this;
        };
      } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
      }
    })(function () {
      "use strict";

      var hasStacks = false;
      try {
        throw new Error();
      } catch (e) {
        hasStacks = !!e.stack;
      }
      var qStartingLine = captureLine();
      var qFileName;
      var noop = function () {};
      var nextTick = function () {
        var head = {
          task: void 0,
          next: null
        };
        var tail = head;
        var flushing = false;
        var requestTick = void 0;
        var isNodeJS = false;
        var laterQueue = [];
        function flush() {
          var task, domain;
          while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;
            if (domain) {
              head.domain = void 0;
              domain.enter();
            }
            runSingle(task, domain);
          }
          while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
          }
          flushing = false;
        }
        function runSingle(task, domain) {
          try {
            task();
          } catch (e) {
            if (isNodeJS) {
              if (domain) {
                domain.exit();
              }
              setTimeout(flush, 0);
              if (domain) {
                domain.enter();
              }
              throw e;
            } else {
              setTimeout(function () {
                throw e;
              }, 0);
            }
          }
          if (domain) {
            domain.exit();
          }
        }
        nextTick = function (task) {
          tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
          };
          if (!flushing) {
            flushing = true;
            requestTick();
          }
        };
        if (typeof process === "object" && process.toString() === "[object process]" && process.nextTick) {
          isNodeJS = true;
          requestTick = function () {
            process.nextTick(flush);
          };
        } else if (typeof setImmediate === "function") {
          if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
          } else {
            requestTick = function () {
              setImmediate(flush);
            };
          }
        } else if (typeof MessageChannel !== "undefined") {
          var channel = new MessageChannel();
          channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
          };
          var requestPortTick = function () {
            channel.port2.postMessage(0);
          };
          requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
          };
        } else {
          requestTick = function () {
            setTimeout(flush, 0);
          };
        }
        nextTick.runAfter = function (task) {
          laterQueue.push(task);
          if (!flushing) {
            flushing = true;
            requestTick();
          }
        };
        return nextTick;
      }();
      var call = Function.call;
      function uncurryThis(f) {
        return function () {
          return call.apply(f, arguments);
        };
      }
      var array_slice = uncurryThis(Array.prototype.slice);
      var array_reduce = uncurryThis(Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        if (arguments.length === 1) {
          do {
            if (index in this) {
              basis = this[index++];
              break;
            }
            if (++index >= length) {
              throw new TypeError();
            }
          } while (1);
        }
        for (; index < length; index++) {
          if (index in this) {
            basis = callback(basis, this[index], index);
          }
        }
        return basis;
      });
      var array_indexOf = uncurryThis(Array.prototype.indexOf || function (value) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] === value) {
            return i;
          }
        }
        return -1;
      });
      var array_map = uncurryThis(Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
          collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
      });
      var object_create = Object.create || function (prototype) {
        function Type() {}
        Type.prototype = prototype;
        return new Type();
      };
      var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
      var object_keys = Object.keys || function (object) {
        var keys = [];
        for (var key in object) {
          if (object_hasOwnProperty(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      var object_toString = uncurryThis(Object.prototype.toString);
      function isObject(value) {
        return value === Object(value);
      }
      function isStopIteration(exception) {
        return object_toString(exception) === "[object StopIteration]" || exception instanceof QReturnValue;
      }
      var QReturnValue;
      if (typeof ReturnValue !== "undefined") {
        QReturnValue = ReturnValue;
      } else {
        QReturnValue = function (value) {
          this.value = value;
        };
      }
      var STACK_JUMP_SEPARATOR = "From previous event:";
      function makeStackTraceLong(error, promise) {
        if (hasStacks && promise.stack && typeof error === "object" && error !== null && error.stack && error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1) {
          var stacks = [];
          for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
              stacks.unshift(p.stack);
            }
          }
          stacks.unshift(error.stack);
          var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
          error.stack = filterStackString(concatedStacks);
        }
      }
      function filterStackString(stackString) {
        var lines = stackString.split("\n");
        var desiredLines = [];
        for (var i = 0; i < lines.length; ++i) {
          var line = lines[i];
          if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
          }
        }
        return desiredLines.join("\n");
      }
      function isNodeFrame(stackLine) {
        return stackLine.indexOf("(module.js:") !== -1 || stackLine.indexOf("(node.js:") !== -1;
      }
      function getFileNameAndLineNumber(stackLine) {
        var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
        if (attempt1) {
          return [attempt1[1], Number(attempt1[2])];
        }
        var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
        if (attempt2) {
          return [attempt2[1], Number(attempt2[2])];
        }
        var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
        if (attempt3) {
          return [attempt3[1], Number(attempt3[2])];
        }
      }
      function isInternalFrame(stackLine) {
        var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
        if (!fileNameAndLineNumber) {
          return false;
        }
        var fileName = fileNameAndLineNumber[0];
        var lineNumber = fileNameAndLineNumber[1];
        return fileName === qFileName && lineNumber >= qStartingLine && lineNumber <= qEndingLine;
      }
      function captureLine() {
        if (!hasStacks) {
          return;
        }
        try {
          throw new Error();
        } catch (e) {
          var lines = e.stack.split("\n");
          var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
          var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
          if (!fileNameAndLineNumber) {
            return;
          }
          qFileName = fileNameAndLineNumber[0];
          return fileNameAndLineNumber[1];
        }
      }
      function deprecate(callback, name, alternative) {
        return function () {
          if (typeof console !== "undefined" && typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative + " instead.", new Error("").stack);
          }
          return callback.apply(callback, arguments);
        };
      }
      function Q(value) {
        if (value instanceof Promise) {
          return value;
        }
        if (isPromiseAlike(value)) {
          return coerce(value);
        } else {
          return fulfill(value);
        }
      }
      Q.resolve = Q;
      Q.nextTick = nextTick;
      Q.longStackSupport = false;
      if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
        Q.longStackSupport = true;
      }
      Q.defer = defer;
      function defer() {
        var messages = [],
            progressListeners = [],
            resolvedPromise;
        var deferred = object_create(defer.prototype);
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, operands) {
          var args = array_slice(arguments);
          if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) {
              progressListeners.push(operands[1]);
            }
          } else {
            Q.nextTick(function () {
              resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
          }
        };
        promise.valueOf = function () {
          if (messages) {
            return promise;
          }
          var nearerValue = nearer(resolvedPromise);
          if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue;
          }
          return nearerValue;
        };
        promise.inspect = function () {
          if (!resolvedPromise) {
            return { state: "pending" };
          }
          return resolvedPromise.inspect();
        };
        if (Q.longStackSupport && hasStacks) {
          try {
            throw new Error();
          } catch (e) {
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
          }
        }
        function become(newPromise) {
          resolvedPromise = newPromise;
          promise.source = newPromise;
          array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
              newPromise.promiseDispatch.apply(newPromise, message);
            });
          }, void 0);
          messages = void 0;
          progressListeners = void 0;
        }
        deferred.promise = promise;
        deferred.resolve = function (value) {
          if (resolvedPromise) {
            return;
          }
          become(Q(value));
        };
        deferred.fulfill = function (value) {
          if (resolvedPromise) {
            return;
          }
          become(fulfill(value));
        };
        deferred.reject = function (reason) {
          if (resolvedPromise) {
            return;
          }
          become(reject(reason));
        };
        deferred.notify = function (progress) {
          if (resolvedPromise) {
            return;
          }
          array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
              progressListener(progress);
            });
          }, void 0);
        };
        return deferred;
      }
      defer.prototype.makeNodeResolver = function () {
        var self = this;
        return function (error, value) {
          if (error) {
            self.reject(error);
          } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
          } else {
            self.resolve(value);
          }
        };
      };
      Q.Promise = promise;
      Q.promise = promise;
      function promise(resolver) {
        if (typeof resolver !== "function") {
          throw new TypeError("resolver must be a function.");
        }
        var deferred = defer();
        try {
          resolver(deferred.resolve, deferred.reject, deferred.notify);
        } catch (reason) {
          deferred.reject(reason);
        }
        return deferred.promise;
      }
      promise.race = race;
      promise.all = all;
      promise.reject = reject;
      promise.resolve = Q;
      Q.passByCopy = function (object) {
        return object;
      };
      Promise.prototype.passByCopy = function () {
        return this;
      };
      Q.join = function (x, y) {
        return Q(x).join(y);
      };
      Promise.prototype.join = function (that) {
        return Q([this, that]).spread(function (x, y) {
          if (x === y) {
            return x;
          } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
          }
        });
      };
      Q.race = race;
      function race(answerPs) {
        return promise(function (resolve, reject) {
          for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
          }
        });
      }
      Promise.prototype.race = function () {
        return this.then(Q.race);
      };
      Q.makePromise = Promise;
      function Promise(descriptor, fallback, inspect) {
        if (fallback === void 0) {
          fallback = function (op) {
            return reject(new Error("Promise does not support operation: " + op));
          };
        }
        if (inspect === void 0) {
          inspect = function () {
            return { state: "unknown" };
          };
        }
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, args) {
          var result;
          try {
            if (descriptor[op]) {
              result = descriptor[op].apply(promise, args);
            } else {
              result = fallback.call(promise, op, args);
            }
          } catch (exception) {
            result = reject(exception);
          }
          if (resolve) {
            resolve(result);
          }
        };
        promise.inspect = inspect;
        if (inspect) {
          var inspected = inspect();
          if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
          }
          promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" || inspected.state === "rejected") {
              return promise;
            }
            return inspected.value;
          };
        }
        return promise;
      }
      Promise.prototype.toString = function () {
        return "[object Promise]";
      };
      Promise.prototype.then = function (fulfilled, rejected, progressed) {
        var self = this;
        var deferred = defer();
        var done = false;
        function _fulfilled(value) {
          try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
          } catch (exception) {
            return reject(exception);
          }
        }
        function _rejected(exception) {
          if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
              return rejected(exception);
            } catch (newException) {
              return reject(newException);
            }
          }
          return reject(exception);
        }
        function _progressed(value) {
          return typeof progressed === "function" ? progressed(value) : value;
        }
        Q.nextTick(function () {
          self.promiseDispatch(function (value) {
            if (done) {
              return;
            }
            done = true;
            deferred.resolve(_fulfilled(value));
          }, "when", [function (exception) {
            if (done) {
              return;
            }
            done = true;
            deferred.resolve(_rejected(exception));
          }]);
        });
        self.promiseDispatch(void 0, "when", [void 0, function (value) {
          var newValue;
          var threw = false;
          try {
            newValue = _progressed(value);
          } catch (e) {
            threw = true;
            if (Q.onerror) {
              Q.onerror(e);
            } else {
              throw e;
            }
          }
          if (!threw) {
            deferred.notify(newValue);
          }
        }]);
        return deferred.promise;
      };
      Q.tap = function (promise, callback) {
        return Q(promise).tap(callback);
      };
      Promise.prototype.tap = function (callback) {
        callback = Q(callback);
        return this.then(function (value) {
          return callback.fcall(value).thenResolve(value);
        });
      };
      Q.when = when;
      function when(value, fulfilled, rejected, progressed) {
        return Q(value).then(fulfilled, rejected, progressed);
      }
      Promise.prototype.thenResolve = function (value) {
        return this.then(function () {
          return value;
        });
      };
      Q.thenResolve = function (promise, value) {
        return Q(promise).thenResolve(value);
      };
      Promise.prototype.thenReject = function (reason) {
        return this.then(function () {
          throw reason;
        });
      };
      Q.thenReject = function (promise, reason) {
        return Q(promise).thenReject(reason);
      };
      Q.nearer = nearer;
      function nearer(value) {
        if (isPromise(value)) {
          var inspected = value.inspect();
          if (inspected.state === "fulfilled") {
            return inspected.value;
          }
        }
        return value;
      }
      Q.isPromise = isPromise;
      function isPromise(object) {
        return object instanceof Promise;
      }
      Q.isPromiseAlike = isPromiseAlike;
      function isPromiseAlike(object) {
        return isObject(object) && typeof object.then === "function";
      }
      Q.isPending = isPending;
      function isPending(object) {
        return isPromise(object) && object.inspect().state === "pending";
      }
      Promise.prototype.isPending = function () {
        return this.inspect().state === "pending";
      };
      Q.isFulfilled = isFulfilled;
      function isFulfilled(object) {
        return !isPromise(object) || object.inspect().state === "fulfilled";
      }
      Promise.prototype.isFulfilled = function () {
        return this.inspect().state === "fulfilled";
      };
      Q.isRejected = isRejected;
      function isRejected(object) {
        return isPromise(object) && object.inspect().state === "rejected";
      }
      Promise.prototype.isRejected = function () {
        return this.inspect().state === "rejected";
      };
      var unhandledReasons = [];
      var unhandledRejections = [];
      var reportedUnhandledRejections = [];
      var trackUnhandledRejections = true;
      function resetUnhandledRejections() {
        unhandledReasons.length = 0;
        unhandledRejections.length = 0;
        if (!trackUnhandledRejections) {
          trackUnhandledRejections = true;
        }
      }
      function trackRejection(promise, reason) {
        if (!trackUnhandledRejections) {
          return;
        }
        if (typeof process === "object" && typeof process.emit === "function") {
          Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
              process.emit("unhandledRejection", reason, promise);
              reportedUnhandledRejections.push(promise);
            }
          });
        }
        unhandledRejections.push(promise);
        if (reason && typeof reason.stack !== "undefined") {
          unhandledReasons.push(reason.stack);
        } else {
          unhandledReasons.push("(no stack) " + reason);
        }
      }
      function untrackRejection(promise) {
        if (!trackUnhandledRejections) {
          return;
        }
        var at = array_indexOf(unhandledRejections, promise);
        if (at !== -1) {
          if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
              var atReport = array_indexOf(reportedUnhandledRejections, promise);
              if (atReport !== -1) {
                process.emit("rejectionHandled", unhandledReasons[at], promise);
                reportedUnhandledRejections.splice(atReport, 1);
              }
            });
          }
          unhandledRejections.splice(at, 1);
          unhandledReasons.splice(at, 1);
        }
      }
      Q.resetUnhandledRejections = resetUnhandledRejections;
      Q.getUnhandledReasons = function () {
        return unhandledReasons.slice();
      };
      Q.stopUnhandledRejectionTracking = function () {
        resetUnhandledRejections();
        trackUnhandledRejections = false;
      };
      resetUnhandledRejections();
      Q.reject = reject;
      function reject(reason) {
        var rejection = Promise({ "when": function (rejected) {
            if (rejected) {
              untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
          } }, function fallback() {
          return this;
        }, function inspect() {
          return {
            state: "rejected",
            reason: reason
          };
        });
        trackRejection(rejection, reason);
        return rejection;
      }
      Q.fulfill = fulfill;
      function fulfill(value) {
        return Promise({
          "when": function () {
            return value;
          },
          "get": function (name) {
            return value[name];
          },
          "set": function (name, rhs) {
            value[name] = rhs;
          },
          "delete": function (name) {
            delete value[name];
          },
          "post": function (name, args) {
            if (name === null || name === void 0) {
              return value.apply(void 0, args);
            } else {
              return value[name].apply(value, args);
            }
          },
          "apply": function (thisp, args) {
            return value.apply(thisp, args);
          },
          "keys": function () {
            return object_keys(value);
          }
        }, void 0, function inspect() {
          return {
            state: "fulfilled",
            value: value
          };
        });
      }
      function coerce(promise) {
        var deferred = defer();
        Q.nextTick(function () {
          try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
          } catch (exception) {
            deferred.reject(exception);
          }
        });
        return deferred.promise;
      }
      Q.master = master;
      function master(object) {
        return Promise({ "isDef": function () {} }, function fallback(op, args) {
          return dispatch(object, op, args);
        }, function () {
          return Q(object).inspect();
        });
      }
      Q.spread = spread;
      function spread(value, fulfilled, rejected) {
        return Q(value).spread(fulfilled, rejected);
      }
      Promise.prototype.spread = function (fulfilled, rejected) {
        return this.all().then(function (array) {
          return fulfilled.apply(void 0, array);
        }, rejected);
      };
      Q.async = async;
      function async(makeGenerator) {
        return function () {
          function continuer(verb, arg) {
            var result;
            if (typeof StopIteration === "undefined") {
              try {
                result = generator[verb](arg);
              } catch (exception) {
                return reject(exception);
              }
              if (result.done) {
                return Q(result.value);
              } else {
                return when(result.value, callback, errback);
              }
            } else {
              try {
                result = generator[verb](arg);
              } catch (exception) {
                if (isStopIteration(exception)) {
                  return Q(exception.value);
                } else {
                  return reject(exception);
                }
              }
              return when(result, callback, errback);
            }
          }
          var generator = makeGenerator.apply(this, arguments);
          var callback = continuer.bind(continuer, "next");
          var errback = continuer.bind(continuer, "throw");
          return callback();
        };
      }
      Q.spawn = spawn;
      function spawn(makeGenerator) {
        Q.done(Q.async(makeGenerator)());
      }
      Q["return"] = _return;
      function _return(value) {
        throw new QReturnValue(value);
      }
      Q.promised = promised;
      function promised(callback) {
        return function () {
          return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
          });
        };
      }
      Q.dispatch = dispatch;
      function dispatch(object, op, args) {
        return Q(object).dispatch(op, args);
      }
      Promise.prototype.dispatch = function (op, args) {
        var self = this;
        var deferred = defer();
        Q.nextTick(function () {
          self.promiseDispatch(deferred.resolve, op, args);
        });
        return deferred.promise;
      };
      Q.get = function (object, key) {
        return Q(object).dispatch("get", [key]);
      };
      Promise.prototype.get = function (key) {
        return this.dispatch("get", [key]);
      };
      Q.set = function (object, key, value) {
        return Q(object).dispatch("set", [key, value]);
      };
      Promise.prototype.set = function (key, value) {
        return this.dispatch("set", [key, value]);
      };
      Q.del = Q["delete"] = function (object, key) {
        return Q(object).dispatch("delete", [key]);
      };
      Promise.prototype.del = Promise.prototype["delete"] = function (key) {
        return this.dispatch("delete", [key]);
      };
      Q.mapply = Q.post = function (object, name, args) {
        return Q(object).dispatch("post", [name, args]);
      };
      Promise.prototype.mapply = Promise.prototype.post = function (name, args) {
        return this.dispatch("post", [name, args]);
      };
      Q.send = Q.mcall = Q.invoke = function (object, name) {
        return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
      };
      Promise.prototype.send = Promise.prototype.mcall = Promise.prototype.invoke = function (name) {
        return this.dispatch("post", [name, array_slice(arguments, 1)]);
      };
      Q.fapply = function (object, args) {
        return Q(object).dispatch("apply", [void 0, args]);
      };
      Promise.prototype.fapply = function (args) {
        return this.dispatch("apply", [void 0, args]);
      };
      Q["try"] = Q.fcall = function (object) {
        return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
      };
      Promise.prototype.fcall = function () {
        return this.dispatch("apply", [void 0, array_slice(arguments)]);
      };
      Q.fbind = function (object) {
        var promise = Q(object);
        var args = array_slice(arguments, 1);
        return function fbound() {
          return promise.dispatch("apply", [this, args.concat(array_slice(arguments))]);
        };
      };
      Promise.prototype.fbind = function () {
        var promise = this;
        var args = array_slice(arguments);
        return function fbound() {
          return promise.dispatch("apply", [this, args.concat(array_slice(arguments))]);
        };
      };
      Q.keys = function (object) {
        return Q(object).dispatch("keys", []);
      };
      Promise.prototype.keys = function () {
        return this.dispatch("keys", []);
      };
      Q.all = all;
      function all(promises) {
        return when(promises, function (promises) {
          var pendingCount = 0;
          var deferred = defer();
          array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (isPromise(promise) && (snapshot = promise.inspect()).state === "fulfilled") {
              promises[index] = snapshot.value;
            } else {
              ++pendingCount;
              when(promise, function (value) {
                promises[index] = value;
                if (--pendingCount === 0) {
                  deferred.resolve(promises);
                }
              }, deferred.reject, function (progress) {
                deferred.notify({
                  index: index,
                  value: progress
                });
              });
            }
          }, void 0);
          if (pendingCount === 0) {
            deferred.resolve(promises);
          }
          return deferred.promise;
        });
      }
      Promise.prototype.all = function () {
        return all(this);
      };
      Q.any = any;
      function any(promises) {
        if (promises.length === 0) {
          return Q.resolve();
        }
        var deferred = Q.defer();
        var pendingCount = 0;
        array_reduce(promises, function (prev, current, index) {
          var promise = promises[index];
          pendingCount++;
          when(promise, onFulfilled, onRejected, onProgress);
          function onFulfilled(result) {
            deferred.resolve(result);
          }
          function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
              deferred.reject(new Error("Can't get fulfillment value from any promise, all " + "promises were rejected."));
            }
          }
          function onProgress(progress) {
            deferred.notify({
              index: index,
              value: progress
            });
          }
        }, undefined);
        return deferred.promise;
      }
      Promise.prototype.any = function () {
        return any(this);
      };
      Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
      function allResolved(promises) {
        return when(promises, function (promises) {
          promises = array_map(promises, Q);
          return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
          })), function () {
            return promises;
          });
        });
      }
      Promise.prototype.allResolved = function () {
        return allResolved(this);
      };
      Q.allSettled = allSettled;
      function allSettled(promises) {
        return Q(promises).allSettled();
      }
      Promise.prototype.allSettled = function () {
        return this.then(function (promises) {
          return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
              return promise.inspect();
            }
            return promise.then(regardless, regardless);
          }));
        });
      };
      Q.fail = Q["catch"] = function (object, rejected) {
        return Q(object).then(void 0, rejected);
      };
      Promise.prototype.fail = Promise.prototype["catch"] = function (rejected) {
        return this.then(void 0, rejected);
      };
      Q.progress = progress;
      function progress(object, progressed) {
        return Q(object).then(void 0, void 0, progressed);
      }
      Promise.prototype.progress = function (progressed) {
        return this.then(void 0, void 0, progressed);
      };
      Q.fin = Q["finally"] = function (object, callback) {
        return Q(object)["finally"](callback);
      };
      Promise.prototype.fin = Promise.prototype["finally"] = function (callback) {
        callback = Q(callback);
        return this.then(function (value) {
          return callback.fcall().then(function () {
            return value;
          });
        }, function (reason) {
          return callback.fcall().then(function () {
            throw reason;
          });
        });
      };
      Q.done = function (object, fulfilled, rejected, progress) {
        return Q(object).done(fulfilled, rejected, progress);
      };
      Promise.prototype.done = function (fulfilled, rejected, progress) {
        var onUnhandledError = function (error) {
          Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
              Q.onerror(error);
            } else {
              throw error;
            }
          });
        };
        var promise = fulfilled || rejected || progress ? this.then(fulfilled, rejected, progress) : this;
        if (typeof process === "object" && process && process.domain) {
          onUnhandledError = process.domain.bind(onUnhandledError);
        }
        promise.then(void 0, onUnhandledError);
      };
      Q.timeout = function (object, ms, error) {
        return Q(object).timeout(ms, error);
      };
      Promise.prototype.timeout = function (ms, error) {
        var deferred = defer();
        var timeoutId = setTimeout(function () {
          if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
          }
          deferred.reject(error);
        }, ms);
        this.then(function (value) {
          clearTimeout(timeoutId);
          deferred.resolve(value);
        }, function (exception) {
          clearTimeout(timeoutId);
          deferred.reject(exception);
        }, deferred.notify);
        return deferred.promise;
      };
      Q.delay = function (object, timeout) {
        if (timeout === void 0) {
          timeout = object;
          object = void 0;
        }
        return Q(object).delay(timeout);
      };
      Promise.prototype.delay = function (timeout) {
        return this.then(function (value) {
          var deferred = defer();
          setTimeout(function () {
            deferred.resolve(value);
          }, timeout);
          return deferred.promise;
        });
      };
      Q.nfapply = function (callback, args) {
        return Q(callback).nfapply(args);
      };
      Promise.prototype.nfapply = function (args) {
        var deferred = defer();
        var nodeArgs = array_slice(args);
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
      };
      Q.nfcall = function (callback) {
        var args = array_slice(arguments, 1);
        return Q(callback).nfapply(args);
      };
      Promise.prototype.nfcall = function () {
        var nodeArgs = array_slice(arguments);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
      };
      Q.nfbind = Q.denodeify = function (callback) {
        var baseArgs = array_slice(arguments, 1);
        return function () {
          var nodeArgs = baseArgs.concat(array_slice(arguments));
          var deferred = defer();
          nodeArgs.push(deferred.makeNodeResolver());
          Q(callback).fapply(nodeArgs).fail(deferred.reject);
          return deferred.promise;
        };
      };
      Promise.prototype.nfbind = Promise.prototype.denodeify = function () {
        var args = array_slice(arguments);
        args.unshift(this);
        return Q.denodeify.apply(void 0, args);
      };
      Q.nbind = function (callback, thisp) {
        var baseArgs = array_slice(arguments, 2);
        return function () {
          var nodeArgs = baseArgs.concat(array_slice(arguments));
          var deferred = defer();
          nodeArgs.push(deferred.makeNodeResolver());
          function bound() {
            return callback.apply(thisp, arguments);
          }
          Q(bound).fapply(nodeArgs).fail(deferred.reject);
          return deferred.promise;
        };
      };
      Promise.prototype.nbind = function () {
        var args = array_slice(arguments, 0);
        args.unshift(this);
        return Q.nbind.apply(void 0, args);
      };
      Q.nmapply = Q.npost = function (object, name, args) {
        return Q(object).npost(name, args);
      };
      Promise.prototype.nmapply = Promise.prototype.npost = function (name, args) {
        var nodeArgs = array_slice(args || []);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
        return deferred.promise;
      };
      Q.nsend = Q.nmcall = Q.ninvoke = function (object, name) {
        var nodeArgs = array_slice(arguments, 2);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
        return deferred.promise;
      };
      Promise.prototype.nsend = Promise.prototype.nmcall = Promise.prototype.ninvoke = function (name) {
        var nodeArgs = array_slice(arguments, 1);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
        return deferred.promise;
      };
      Q.nodeify = nodeify;
      function nodeify(object, nodeback) {
        return Q(object).nodeify(nodeback);
      }
      Promise.prototype.nodeify = function (nodeback) {
        if (nodeback) {
          this.then(function (value) {
            Q.nextTick(function () {
              nodeback(null, value);
            });
          }, function (error) {
            Q.nextTick(function () {
              nodeback(error);
            });
          });
        } else {
          return this;
        }
      };
      Q.noConflict = function () {
        throw new Error("Q.noConflict only works when Q is used as a global");
      };
      var qEndingLine = captureLine();
      return Q;
    });
  })($__require("github:jspm/nodelibs-process@0.1.2.js"));
  return module.exports;
});
System.registerDynamic("npm:q@1.4.1.js", ["npm:q@1.4.1/q.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:q@1.4.1/q.js");
  return module.exports;
});
System.register('main.js', ['npm:lik@1.0.24.js', 'npm:q@1.4.1.js'], function (_export) {
    'use strict';

    var lik, q;
    return {
        setters: [function (_npmLik1024Js) {
            lik = _npmLik1024Js;
        }, function (_npmQ141Js) {
            q = _npmQ141Js;
        }],
        execute: function () {}
    };
});
