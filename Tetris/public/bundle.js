/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 322);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , core      = __webpack_require__(14)
  , hide      = __webpack_require__(15)
  , redefine  = __webpack_require__(18)
  , ctx       = __webpack_require__(25)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target)redefine(target, key, out, type & $export.U);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ },
/* 2 */
/***/ function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var store      = __webpack_require__(65)('wks')
  , uid        = __webpack_require__(45)
  , Symbol     = __webpack_require__(2).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(1)
  , IE8_DOM_DEFINE = __webpack_require__(108)
  , toPrimitive    = __webpack_require__(27)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(7) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(3)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(35)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(22);
module.exports = function(it){
  return Object(defined(it));
};

/***/ },
/* 10 */
/***/ function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(49)
  , defined = __webpack_require__(22);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol__ = __webpack_require__(32);
/* unused harmony export NonDeclaredType *//* unused harmony export Any *//* unused harmony export Unit *//* unused harmony export Option *//* unused harmony export Array *//* unused harmony export Tuple *//* unused harmony export GenericParam *//* unused harmony export Interface *//* harmony export */ exports["f"] = makeGeneric;/* unused harmony export isGeneric *//* unused harmony export getDefinition *//* unused harmony export extendInfo *//* unused harmony export hasInterface *//* unused harmony export getPropertyNames *//* unused harmony export isArray *//* unused harmony export getRestParams *//* harmony export */ exports["a"] = toString;/* unused harmony export hash *//* harmony export */ exports["b"] = equals;/* harmony export */ exports["c"] = compare;/* harmony export */ exports["d"] = equalsRecords;/* harmony export */ exports["e"] = compareRecords;/* harmony export */ exports["g"] = equalsUnions;/* harmony export */ exports["h"] = compareUnions;/* harmony export */ exports["i"] = createDisposable;/* unused harmony export createObj *//* unused harmony export toPlainJsObj *//* unused harmony export round *//* unused harmony export randomNext *//* harmony export */ exports["j"] = defaultArg;
var NonDeclaredType = (function () {
    function NonDeclaredType(kind, definition, generics) {
        this.kind = kind;
        this.definition = definition;
        this.generics = generics;
    }
    NonDeclaredType.prototype.Equals = function (other) {
        if (this.kind === other.kind && this.definition === other.definition) {
            return typeof this.generics === "object"
                ? equalsRecords(this.generics, other.generics)
                : this.generics === other.generics;
        }
        return false;
    };
    return NonDeclaredType;
}());

var Any = new NonDeclaredType("Any");
var Unit = new NonDeclaredType("Unit");
function Option(t) {
    return new NonDeclaredType("Option", null, t);
}
function FableArray(t, isTypedArray) {
    if (isTypedArray === void 0) { isTypedArray = false; }
    var def = null, genArg = null;
    if (isTypedArray) {
        def = t;
    }
    else {
        genArg = t;
    }
    return new NonDeclaredType("Array", def, genArg);
}

function Tuple(ts) {
    return new NonDeclaredType("Tuple", null, ts);
}
function GenericParam(definition) {
    return new NonDeclaredType("GenericParam", definition);
}
function Interface(definition) {
    return new NonDeclaredType("Interface", definition);
}
function makeGeneric(typeDef, genArgs) {
    return new NonDeclaredType("GenericType", typeDef, genArgs);
}
function isGeneric(typ) {
    return typ instanceof NonDeclaredType && typ.kind === "GenericType";
}
function getDefinition(typ) {
    return isGeneric(typ) ? typ.definition : typ;
}
function extendInfo(cons, info) {
    var parent = Object.getPrototypeOf(cons.prototype);
    if (typeof parent[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection] === "function") {
        var newInfo_1 = {}, parentInfo_1 = parent[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection]();
        Object.getOwnPropertyNames(info).forEach(function (k) {
            var i = info[k];
            if (typeof i === "object") {
                newInfo_1[k] = Array.isArray(i)
                    ? (parentInfo_1[k] || []).concat(i)
                    : Object.assign(parentInfo_1[k] || {}, i);
            }
            else {
                newInfo_1[k] = i;
            }
        });
        return newInfo_1;
    }
    return info;
}
function hasInterface(obj, interfaceName) {
    if (interfaceName === "System.Collections.Generic.IEnumerable") {
        return typeof obj[Symbol.iterator] === "function";
    }
    else if (typeof obj[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection] === "function") {
        var interfaces = obj[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection]().interfaces;
        return Array.isArray(interfaces) && interfaces.indexOf(interfaceName) > -1;
    }
    return false;
}
function getPropertyNames(obj) {
    if (obj == null) {
        return [];
    }
    var propertyMap = typeof obj[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection] === "function" ? obj[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection]().properties || [] : obj;
    return Object.getOwnPropertyNames(propertyMap);
}
function isArray(obj) {
    return Array.isArray(obj) || ArrayBuffer.isView(obj);
}
function getRestParams(args, idx) {
    for (var _len = args.length, restArgs = Array(_len > idx ? _len - idx : 0), _key = idx; _key < _len; _key++)
        restArgs[_key - idx] = args[_key];
    return restArgs;
}
function toString(o) {
    return o != null && typeof o.ToString == "function" ? o.ToString() : String(o);
}
function hash(x) {
    var s = JSON.stringify(x);
    var h = 5381, i = 0, len = s.length;
    while (i < len) {
        h = (h * 33) ^ s.charCodeAt(i++);
    }
    return h;
}
function equals(x, y) {
    if (x === y)
        return true;
    else if (x == null)
        return y == null;
    else if (y == null)
        return false;
    else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y))
        return false;
    else if (typeof x.Equals === "function")
        return x.Equals(y);
    else if (Array.isArray(x)) {
        if (x.length != y.length)
            return false;
        for (var i = 0; i < x.length; i++)
            if (!equals(x[i], y[i]))
                return false;
        return true;
    }
    else if (ArrayBuffer.isView(x)) {
        if (x.byteLength !== y.byteLength)
            return false;
        var dv1 = new DataView(x.buffer), dv2 = new DataView(y.buffer);
        for (var i = 0; i < x.byteLength; i++)
            if (dv1.getUint8(i) !== dv2.getUint8(i))
                return false;
        return true;
    }
    else if (x instanceof Date)
        return x.getTime() == y.getTime();
    else
        return false;
}
function compare(x, y) {
    if (x === y)
        return 0;
    if (x == null)
        return y == null ? 0 : -1;
    else if (y == null)
        return 1;
    else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y))
        return -1;
    else if (typeof x.CompareTo === "function")
        return x.CompareTo(y);
    else if (Array.isArray(x)) {
        if (x.length != y.length)
            return x.length < y.length ? -1 : 1;
        for (var i = 0, j = 0; i < x.length; i++)
            if ((j = compare(x[i], y[i])) !== 0)
                return j;
        return 0;
    }
    else if (ArrayBuffer.isView(x)) {
        if (x.byteLength != y.byteLength)
            return x.byteLength < y.byteLength ? -1 : 1;
        var dv1 = new DataView(x.buffer), dv2 = new DataView(y.buffer);
        for (var i = 0, b1 = 0, b2 = 0; i < x.byteLength; i++) {
            b1 = dv1.getUint8(i), b2 = dv2.getUint8(i);
            if (b1 < b2)
                return -1;
            if (b1 > b2)
                return 1;
        }
        return 0;
    }
    else if (x instanceof Date)
        return compare(x.getTime(), y.getTime());
    else
        return x < y ? -1 : 1;
}
function equalsRecords(x, y) {
    if (x === y) {
        return true;
    }
    else {
        var keys = getPropertyNames(x);
        for (var i = 0; i < keys.length; i++) {
            if (!equals(x[keys[i]], y[keys[i]]))
                return false;
        }
        return true;
    }
}
function compareRecords(x, y) {
    if (x === y) {
        return 0;
    }
    else {
        var keys = getPropertyNames(x);
        for (var i = 0; i < keys.length; i++) {
            var res = compare(x[keys[i]], y[keys[i]]);
            if (res !== 0)
                return res;
        }
        return 0;
    }
}
function equalsUnions(x, y) {
    if (x === y) {
        return true;
    }
    else if (x.Case !== y.Case) {
        return false;
    }
    else {
        for (var i = 0; i < x.Fields.length; i++) {
            if (!equals(x.Fields[i], y.Fields[i]))
                return false;
        }
        return true;
    }
}
function compareUnions(x, y) {
    if (x === y) {
        return 0;
    }
    else {
        var res = compare(x.Case, y.Case);
        if (res !== 0)
            return res;
        for (var i = 0; i < x.Fields.length; i++) {
            res = compare(x.Fields[i], y.Fields[i]);
            if (res !== 0)
                return res;
        }
        return 0;
    }
}
function createDisposable(f) {
    return _a = {
            Dispose: f
        },
        _a[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection] = function () { return { interfaces: ["System.IDisposable"] }; },
        _a;
    var _a;
}
function createObj(fields) {
    var iter = fields[Symbol.iterator]();
    var cur = iter.next(), o = {};
    while (!cur.done) {
        o[cur.value[0]] = cur.value[1];
        cur = iter.next();
    }
    return o;
}
function toPlainJsObj(source) {
    if (source != null && source.constructor != Object) {
        var target = {};
        var props = Object.getOwnPropertyNames(source);
        for (var i = 0; i < props.length; i++) {
            target[props[i]] = source[props[i]];
        }
        var proto = Object.getPrototypeOf(source);
        if (proto != null) {
            props = Object.getOwnPropertyNames(proto);
            for (var i = 0; i < props.length; i++) {
                var prop = Object.getOwnPropertyDescriptor(proto, props[i]);
                if (prop.value) {
                    target[props[i]] = prop.value;
                }
                else if (prop.get) {
                    target[props[i]] = prop.get.apply(source);
                }
            }
        }
        return target;
    }
    else {
        return source;
    }
}
function round(value, digits) {
    if (digits === void 0) { digits = 0; }
    var m = Math.pow(10, digits);
    var n = +(digits ? value * m : value).toFixed(8);
    var i = Math.floor(n), f = n - i;
    var e = 1e-8;
    var r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 == 0) ? i : i + 1) : Math.round(n);
    return digits ? r / m : r;
}
function randomNext(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function defaultArg(arg, defaultValue, f) {
    return arg == null ? defaultValue : (f != null ? f(arg) : arg);
}


/***/ },
/* 14 */
/***/ function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(6)
  , createDesc = __webpack_require__(30);
module.exports = __webpack_require__(7) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(50)
  , createDesc     = __webpack_require__(30)
  , toIObject      = __webpack_require__(11)
  , toPrimitive    = __webpack_require__(27)
  , has            = __webpack_require__(10)
  , IE8_DOM_DEFINE = __webpack_require__(108)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(7) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(10)
  , toObject    = __webpack_require__(9)
  , IE_PROTO    = __webpack_require__(87)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , hide      = __webpack_require__(15)
  , has       = __webpack_require__(10)
  , SRC       = __webpack_require__(45)('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

__webpack_require__(14).inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  var isFunction = typeof val == 'function';
  if(isFunction)has(val, 'name') || hide(val, 'name', key);
  if(O[key] === val)return;
  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if(O === global){
    O[key] = val;
  } else {
    if(!safe){
      delete O[key];
      hide(O, key, val);
    } else {
      if(O[key])O[key] = val;
      else hide(O, key, val);
    }
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , fails   = __webpack_require__(3)
  , defined = __webpack_require__(22)
  , quot    = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function(string, tag, attribute, value) {
  var S  = String(defined(string))
    , p1 = '<' + tag;
  if(attribute !== '')p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function(NAME, exec){
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function(){
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Array__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ListClass__ = __webpack_require__(52);
/* unused harmony export Enumerator *//* unused harmony export getEnumerator *//* unused harmony export toIterator *//* harmony export */ exports["g"] = toList;/* unused harmony export ofList *//* unused harmony export ofArray *//* unused harmony export append *//* unused harmony export average *//* unused harmony export averageBy *//* unused harmony export concat *//* unused harmony export collect *//* harmony export */ exports["n"] = choose;/* harmony export */ exports["a"] = compareWith;/* unused harmony export delay *//* unused harmony export empty *//* unused harmony export enumerateWhile *//* unused harmony export enumerateThenFinally *//* unused harmony export enumerateUsing *//* unused harmony export exactlyOne *//* unused harmony export except *//* harmony export */ exports["j"] = exists;/* unused harmony export exists2 *//* unused harmony export filter *//* unused harmony export where *//* harmony export */ exports["c"] = fold;/* harmony export */ exports["f"] = foldBack;/* unused harmony export fold2 *//* unused harmony export foldBack2 *//* unused harmony export forAll *//* unused harmony export forAll2 *//* unused harmony export tryHead *//* unused harmony export head *//* unused harmony export initialize *//* unused harmony export initializeInfinite *//* unused harmony export tryItem *//* harmony export */ exports["k"] = item;/* harmony export */ exports["i"] = iterate;/* unused harmony export iterate2 *//* unused harmony export iterateIndexed *//* unused harmony export iterateIndexed2 *//* unused harmony export isEmpty *//* unused harmony export tryLast *//* unused harmony export last *//* harmony export */ exports["m"] = count;/* harmony export */ exports["b"] = map;/* unused harmony export mapIndexed *//* unused harmony export map2 *//* unused harmony export mapIndexed2 *//* unused harmony export map3 *//* unused harmony export mapFold *//* unused harmony export mapFoldBack *//* unused harmony export max *//* unused harmony export maxBy *//* unused harmony export min *//* unused harmony export minBy *//* unused harmony export pairwise *//* unused harmony export permute *//* unused harmony export rangeStep *//* unused harmony export rangeChar *//* unused harmony export range *//* unused harmony export readOnly *//* harmony export */ exports["h"] = reduce;/* unused harmony export reduceBack *//* unused harmony export replicate *//* unused harmony export reverse *//* unused harmony export scan *//* unused harmony export scanBack *//* unused harmony export singleton *//* unused harmony export skip *//* unused harmony export skipWhile *//* harmony export */ exports["l"] = sortWith;/* unused harmony export sum *//* unused harmony export sumBy *//* unused harmony export tail *//* unused harmony export take *//* unused harmony export truncate *//* unused harmony export takeWhile *//* unused harmony export tryFind *//* unused harmony export find *//* unused harmony export tryFindBack *//* unused harmony export findBack *//* unused harmony export tryFindIndex *//* unused harmony export findIndex *//* unused harmony export tryFindIndexBack *//* unused harmony export findIndexBack *//* harmony export */ exports["e"] = tryPick;/* harmony export */ exports["d"] = pick;/* unused harmony export unfold *//* unused harmony export zip *//* unused harmony export zip3 */



var Enumerator = (function () {
    function Enumerator(iter) {
        this.iter = iter;
    }
    Enumerator.prototype.MoveNext = function () {
        var cur = this.iter.next();
        this.current = cur.value;
        return !cur.done;
    };
    Object.defineProperty(Enumerator.prototype, "Current", {
        get: function () {
            return this.current;
        },
        enumerable: true,
        configurable: true
    });
    Enumerator.prototype.Reset = function () {
        throw new Error("JS iterators cannot be reset");
    };
    Enumerator.prototype.Dispose = function () { };
    return Enumerator;
}());

function getEnumerator(o) {
    return typeof o.GetEnumerator === "function"
        ? o.GetEnumerator() : new Enumerator(o[Symbol.iterator]());
}
function toIterator(en) {
    return {
        next: function () {
            return en.MoveNext()
                ? { done: false, value: en.Current }
                : { done: true, value: null };
        }
    };
}
function __failIfNone(res) {
    if (res == null)
        throw new Error("Seq did not contain any matching element");
    return res;
}
function toList(xs) {
    return foldBack(function (x, acc) {
        return new __WEBPACK_IMPORTED_MODULE_2__ListClass__["a" /* default */](x, acc);
    }, xs, new __WEBPACK_IMPORTED_MODULE_2__ListClass__["a" /* default */]());
}
function ofList(xs) {
    return delay(function () { return unfold(function (x) { return x.tail != null ? [x.head, x.tail] : null; }, xs); });
}
function ofArray(xs) {
    return delay(function () { return unfold(function (i) { return i < xs.length ? [xs[i], i + 1] : null; }, 0); });
}
function append(xs, ys) {
    return delay(function () {
        var firstDone = false;
        var i = xs[Symbol.iterator]();
        var iters = [i, null];
        return unfold(function () {
            var cur;
            if (!firstDone) {
                cur = iters[0].next();
                if (!cur.done) {
                    return [cur.value, iters];
                }
                else {
                    firstDone = true;
                    iters = [null, ys[Symbol.iterator]()];
                }
            }
            cur = iters[1].next();
            return !cur.done ? [cur.value, iters] : null;
        }, iters);
    });
}
function average(xs) {
    var count = 1;
    var sum = reduce(function (acc, x) {
        count++;
        return acc + x;
    }, xs);
    return sum / count;
}
function averageBy(f, xs) {
    var count = 1;
    var sum = reduce(function (acc, x) {
        count++;
        return (count === 2 ? f(acc) : acc) + f(x);
    }, xs);
    return sum / count;
}
function concat(xs) {
    return delay(function () {
        var iter = xs[Symbol.iterator]();
        var output = { value: null };
        return unfold(function (innerIter) {
            var hasFinished = false;
            while (!hasFinished) {
                if (innerIter == null) {
                    var cur = iter.next();
                    if (!cur.done) {
                        innerIter = cur.value[Symbol.iterator]();
                    }
                    else {
                        hasFinished = true;
                    }
                }
                else {
                    var cur = innerIter.next();
                    if (!cur.done) {
                        output = { value: cur.value };
                        hasFinished = true;
                    }
                    else {
                        innerIter = null;
                    }
                }
            }
            return innerIter != null && output != null ? [output.value, innerIter] : null;
        }, null);
    });
}
function collect(f, xs) {
    return concat(map(f, xs));
}
function choose(f, xs) {
    var trySkipToNext = function (iter) {
        var cur = iter.next();
        if (!cur.done) {
            var y = f(cur.value);
            return y != null ? [y, iter] : trySkipToNext(iter);
        }
        return void 0;
    };
    return delay(function () {
        return unfold(function (iter) {
            return trySkipToNext(iter);
        }, xs[Symbol.iterator]());
    });
}
function compareWith(f, xs, ys) {
    var nonZero = tryFind(function (i) { return i != 0; }, map2(function (x, y) { return f(x, y); }, xs, ys));
    return nonZero != null ? nonZero : count(xs) - count(ys);
}
function delay(f) {
    return _a = {},
        _a[Symbol.iterator] = function () { return f()[Symbol.iterator](); },
        _a;
    var _a;
}
function empty() {
    return unfold(function () { return void 0; });
}
function enumerateWhile(cond, xs) {
    return concat(unfold(function () { return cond() ? [xs, true] : null; }));
}
function enumerateThenFinally(xs, finalFn) {
    return delay(function () {
        var iter;
        try {
            iter = xs[Symbol.iterator]();
        }
        catch (err) {
            return void 0;
        }
        finally {
            finalFn();
        }
        return unfold(function (iter) {
            try {
                var cur = iter.next();
                return !cur.done ? [cur.value, iter] : null;
            }
            catch (err) {
                return void 0;
            }
            finally {
                finalFn();
            }
        }, iter);
    });
}
function enumerateUsing(disp, work) {
    var isDisposed = false;
    var disposeOnce = function () {
        if (!isDisposed) {
            isDisposed = true;
            disp.Dispose();
        }
    };
    try {
        return enumerateThenFinally(work(disp), disposeOnce);
    }
    catch (err) {
        return void 0;
    }
    finally {
        disposeOnce();
    }
}
function exactlyOne(xs) {
    var iter = xs[Symbol.iterator]();
    var fst = iter.next();
    if (fst.done)
        throw new Error("Seq was empty");
    var snd = iter.next();
    if (!snd.done)
        throw new Error("Seq had multiple items");
    return fst.value;
}
function except(itemsToExclude, source) {
    var exclusionItems = Array.from(itemsToExclude);
    var testIsNotInExclusionItems = function (element) { return !exclusionItems.some(function (excludedItem) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["b" /* equals */])(excludedItem, element); }); };
    return filter(testIsNotInExclusionItems, source);
}
function exists(f, xs) {
    function aux(iter) {
        var cur = iter.next();
        return !cur.done && (f(cur.value) || aux(iter));
    }
    return aux(xs[Symbol.iterator]());
}
function exists2(f, xs, ys) {
    function aux(iter1, iter2) {
        var cur1 = iter1.next(), cur2 = iter2.next();
        return !cur1.done && !cur2.done && (f(cur1.value, cur2.value) || aux(iter1, iter2));
    }
    return aux(xs[Symbol.iterator](), ys[Symbol.iterator]());
}
function filter(f, xs) {
    function trySkipToNext(iter) {
        var cur = iter.next();
        while (!cur.done) {
            if (f(cur.value)) {
                return [cur.value, iter];
            }
            cur = iter.next();
        }
        return void 0;
    }
    return delay(function () { return unfold(trySkipToNext, xs[Symbol.iterator]()); });
}
function where(f, xs) {
    return filter(f, xs);
}
function fold(f, acc, xs) {
    if (Array.isArray(xs) || ArrayBuffer.isView(xs)) {
        return xs.reduce(f, acc);
    }
    else {
        var cur = void 0;
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            cur = iter.next();
            if (cur.done)
                break;
            acc = f(acc, cur.value, i);
        }
        return acc;
    }
}
function foldBack(f, xs, acc) {
    var arr = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
    for (var i = arr.length - 1; i >= 0; i--) {
        acc = f(arr[i], acc, i);
    }
    return acc;
}
function fold2(f, acc, xs, ys) {
    var iter1 = xs[Symbol.iterator](), iter2 = ys[Symbol.iterator]();
    var cur1, cur2;
    for (var i = 0;; i++) {
        cur1 = iter1.next();
        cur2 = iter2.next();
        if (cur1.done || cur2.done) {
            break;
        }
        acc = f(acc, cur1.value, cur2.value, i);
    }
    return acc;
}
function foldBack2(f, xs, ys, acc) {
    var ar1 = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
    var ar2 = Array.isArray(ys) || ArrayBuffer.isView(ys) ? ys : Array.from(ys);
    for (var i = ar1.length - 1; i >= 0; i--) {
        acc = f(ar1[i], ar2[i], acc, i);
    }
    return acc;
}
function forAll(f, xs) {
    return fold(function (acc, x) { return acc && f(x); }, true, xs);
}
function forAll2(f, xs, ys) {
    return fold2(function (acc, x, y) { return acc && f(x, y); }, true, xs, ys);
}
function tryHead(xs) {
    var iter = xs[Symbol.iterator]();
    var cur = iter.next();
    return cur.done ? null : cur.value;
}
function head(xs) {
    return __failIfNone(tryHead(xs));
}
function initialize(n, f) {
    return delay(function () {
        return unfold(function (i) { return i < n ? [f(i), i + 1] : null; }, 0);
    });
}
function initializeInfinite(f) {
    return delay(function () {
        return unfold(function (i) { return [f(i), i + 1]; }, 0);
    });
}
function tryItem(i, xs) {
    if (i < 0)
        return null;
    if (Array.isArray(xs) || ArrayBuffer.isView(xs))
        return i < xs.length ? xs[i] : null;
    for (var j = 0, iter = xs[Symbol.iterator]();; j++) {
        var cur = iter.next();
        if (cur.done)
            return null;
        if (j === i)
            return cur.value;
    }
}
function item(i, xs) {
    return __failIfNone(tryItem(i, xs));
}
function iterate(f, xs) {
    fold(function (_, x) { return f(x); }, null, xs);
}
function iterate2(f, xs, ys) {
    fold2(function (_, x, y) { return f(x, y); }, null, xs, ys);
}
function iterateIndexed(f, xs) {
    fold(function (_, x, i) { return f(i, x); }, null, xs);
}
function iterateIndexed2(f, xs, ys) {
    fold2(function (_, x, y, i) { return f(i, x, y); }, null, xs, ys);
}
function isEmpty(xs) {
    var i = xs[Symbol.iterator]();
    return i.next().done;
}
function tryLast(xs) {
    try {
        return reduce(function (_, x) { return x; }, xs);
    }
    catch (err) {
        return null;
    }
}
function last(xs) {
    return __failIfNone(tryLast(xs));
}
function count(xs) {
    return Array.isArray(xs) || ArrayBuffer.isView(xs)
        ? xs.length
        : fold(function (acc, x) { return acc + 1; }, 0, xs);
}
function map(f, xs) {
    return delay(function () { return unfold(function (iter) {
        var cur = iter.next();
        return !cur.done ? [f(cur.value), iter] : null;
    }, xs[Symbol.iterator]()); });
}
function mapIndexed(f, xs) {
    return delay(function () {
        var i = 0;
        return unfold(function (iter) {
            var cur = iter.next();
            return !cur.done ? [f(i++, cur.value), iter] : null;
        }, xs[Symbol.iterator]());
    });
}
function map2(f, xs, ys) {
    return delay(function () {
        var iter1 = xs[Symbol.iterator]();
        var iter2 = ys[Symbol.iterator]();
        return unfold(function () {
            var cur1 = iter1.next(), cur2 = iter2.next();
            return !cur1.done && !cur2.done ? [f(cur1.value, cur2.value), null] : null;
        });
    });
}
function mapIndexed2(f, xs, ys) {
    return delay(function () {
        var i = 0;
        var iter1 = xs[Symbol.iterator]();
        var iter2 = ys[Symbol.iterator]();
        return unfold(function () {
            var cur1 = iter1.next(), cur2 = iter2.next();
            return !cur1.done && !cur2.done ? [f(i++, cur1.value, cur2.value), null] : null;
        });
    });
}
function map3(f, xs, ys, zs) {
    return delay(function () {
        var iter1 = xs[Symbol.iterator]();
        var iter2 = ys[Symbol.iterator]();
        var iter3 = zs[Symbol.iterator]();
        return unfold(function () {
            var cur1 = iter1.next(), cur2 = iter2.next(), cur3 = iter3.next();
            return !cur1.done && !cur2.done && !cur3.done ? [f(cur1.value, cur2.value, cur3.value), null] : null;
        });
    });
}
function mapFold(f, acc, xs) {
    var result = [];
    var r;
    var cur;
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        cur = iter.next();
        if (cur.done)
            break;
        _a = f(acc, cur.value), r = _a[0], acc = _a[1];
        result.push(r);
    }
    return [result, acc];
    var _a;
}
function mapFoldBack(f, xs, acc) {
    var arr = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
    var result = [];
    var r;
    for (var i = arr.length - 1; i >= 0; i--) {
        _a = f(arr[i], acc), r = _a[0], acc = _a[1];
        result.push(r);
    }
    return [result, acc];
    var _a;
}
function max(xs) {
    return reduce(function (acc, x) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["c" /* compare */])(acc, x) === 1 ? acc : x; }, xs);
}
function maxBy(f, xs) {
    return reduce(function (acc, x) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["c" /* compare */])(f(acc), f(x)) === 1 ? acc : x; }, xs);
}
function min(xs) {
    return reduce(function (acc, x) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["c" /* compare */])(acc, x) === -1 ? acc : x; }, xs);
}
function minBy(f, xs) {
    return reduce(function (acc, x) { return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["c" /* compare */])(f(acc), f(x)) === -1 ? acc : x; }, xs);
}
function pairwise(xs) {
    return skip(2, scan(function (last, next) { return [last[1], next]; }, [0, 0], xs));
}
function permute(f, xs) {
    return ofArray(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Array__["a" /* permute */])(f, Array.from(xs)));
}
function rangeStep(first, step, last) {
    if (step === 0)
        throw new Error("Step cannot be 0");
    return delay(function () { return unfold(function (x) { return step > 0 && x <= last || step < 0 && x >= last ? [x, x + step] : null; }, first); });
}
function rangeChar(first, last) {
    return delay(function () { return unfold(function (x) { return x <= last ? [x, String.fromCharCode(x.charCodeAt(0) + 1)] : null; }, first); });
}
function range(first, last) {
    return rangeStep(first, 1, last);
}
function readOnly(xs) {
    return map(function (x) { return x; }, xs);
}
function reduce(f, xs) {
    if (Array.isArray(xs) || ArrayBuffer.isView(xs))
        return xs.reduce(f);
    var iter = xs[Symbol.iterator]();
    var cur = iter.next();
    if (cur.done)
        throw new Error("Seq was empty");
    var acc = cur.value;
    for (;;) {
        cur = iter.next();
        if (cur.done)
            break;
        acc = f(acc, cur.value);
    }
    return acc;
}
function reduceBack(f, xs) {
    var ar = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
    if (ar.length === 0)
        throw new Error("Seq was empty");
    var acc = ar[ar.length - 1];
    for (var i = ar.length - 2; i >= 0; i--)
        acc = f(ar[i], acc, i);
    return acc;
}
function replicate(n, x) {
    return initialize(n, function () { return x; });
}
function reverse(xs) {
    var ar = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs.slice(0) : Array.from(xs);
    return ofArray(ar.reverse());
}
function scan(f, seed, xs) {
    return delay(function () {
        var iter = xs[Symbol.iterator]();
        return unfold(function (acc) {
            if (acc == null)
                return [seed, seed];
            var cur = iter.next();
            if (!cur.done) {
                acc = f(acc, cur.value);
                return [acc, acc];
            }
            return void 0;
        }, null);
    });
}
function scanBack(f, xs, seed) {
    return reverse(scan(function (acc, x) { return f(x, acc); }, seed, reverse(xs)));
}
function singleton(x) {
    return unfold(function (x) { return x != null ? [x, null] : null; }, x);
}
function skip(n, xs) {
    return _a = {},
        _a[Symbol.iterator] = function () {
            var iter = xs[Symbol.iterator]();
            for (var i = 1; i <= n; i++)
                if (iter.next().done)
                    throw new Error("Seq has not enough elements");
            return iter;
        },
        _a;
    var _a;
}
function skipWhile(f, xs) {
    return delay(function () {
        var hasPassed = false;
        return filter(function (x) { return hasPassed || (hasPassed = !f(x)); }, xs);
    });
}
function sortWith(f, xs) {
    var ys = Array.from(xs);
    return ofArray(ys.sort(f));
}
function sum(xs) {
    return fold(function (acc, x) { return acc + x; }, 0, xs);
}
function sumBy(f, xs) {
    return fold(function (acc, x) { return acc + f(x); }, 0, xs);
}
function tail(xs) {
    var iter = xs[Symbol.iterator]();
    var cur = iter.next();
    if (cur.done)
        throw new Error("Seq was empty");
    return _a = {},
        _a[Symbol.iterator] = function () { return iter; },
        _a;
    var _a;
}
function take(n, xs, truncate) {
    if (truncate === void 0) { truncate = false; }
    return delay(function () {
        var iter = xs[Symbol.iterator]();
        return unfold(function (i) {
            if (i < n) {
                var cur = iter.next();
                if (!cur.done)
                    return [cur.value, i + 1];
                if (!truncate)
                    throw new Error("Seq has not enough elements");
            }
            return void 0;
        }, 0);
    });
}
function truncate(n, xs) {
    return take(n, xs, true);
}
function takeWhile(f, xs) {
    return delay(function () {
        var iter = xs[Symbol.iterator]();
        return unfold(function (i) {
            var cur = iter.next();
            if (!cur.done && f(cur.value))
                return [cur.value, null];
            return void 0;
        }, 0);
    });
}
function tryFind(f, xs, defaultValue) {
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        var cur = iter.next();
        if (cur.done)
            return defaultValue === void 0 ? null : defaultValue;
        if (f(cur.value, i))
            return cur.value;
    }
}
function find(f, xs) {
    return __failIfNone(tryFind(f, xs));
}
function tryFindBack(f, xs, defaultValue) {
    var match = null;
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        var cur = iter.next();
        if (cur.done)
            return match === null ? (defaultValue === void 0 ? null : defaultValue) : match;
        if (f(cur.value, i))
            match = cur.value;
    }
}
function findBack(f, xs) {
    return __failIfNone(tryFindBack(f, xs));
}
function tryFindIndex(f, xs) {
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        var cur = iter.next();
        if (cur.done)
            return null;
        if (f(cur.value, i))
            return i;
    }
}
function findIndex(f, xs) {
    return __failIfNone(tryFindIndex(f, xs));
}
function tryFindIndexBack(f, xs) {
    var match = -1;
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        var cur = iter.next();
        if (cur.done)
            return match === -1 ? null : match;
        if (f(cur.value, i))
            match = i;
    }
}
function findIndexBack(f, xs) {
    return __failIfNone(tryFindIndexBack(f, xs));
}
function tryPick(f, xs) {
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        var cur = iter.next();
        if (cur.done)
            break;
        var y = f(cur.value, i);
        if (y != null)
            return y;
    }
    return void 0;
}
function pick(f, xs) {
    return __failIfNone(tryPick(f, xs));
}
function unfold(f, acc) {
    return _a = {},
        _a[Symbol.iterator] = function () {
            return {
                next: function () {
                    var res = f(acc);
                    if (res != null) {
                        acc = res[1];
                        return { done: false, value: res[0] };
                    }
                    return { done: true };
                }
            };
        },
        _a;
    var _a;
}
function zip(xs, ys) {
    return map2(function (x, y) { return [x, y]; }, xs, ys);
}
function zip3(xs, ys, zs) {
    return map3(function (x, y, z) { return [x, y, z]; }, xs, ys, zs);
}


/***/ },
/* 21 */
/***/ function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ },
/* 22 */
/***/ function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

var fails = __webpack_require__(3);

module.exports = function(method, arg){
  return !!method && fails(function(){
    arg ? method.call(null, function(){}, 1) : method.call(null);
  });
};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = __webpack_require__(25)
  , IObject  = __webpack_require__(49)
  , toObject = __webpack_require__(9)
  , toLength = __webpack_require__(8)
  , asc      = __webpack_require__(131);
module.exports = function(TYPE, $create){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
    , create        = $create || asc;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(12);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(0)
  , core    = __webpack_require__(14)
  , fails   = __webpack_require__(3);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

var Map     = __webpack_require__(125)
  , $export = __webpack_require__(0)
  , shared  = __webpack_require__(65)('metadata')
  , store   = shared.store || (shared.store = new (__webpack_require__(128)));

var getOrCreateMetadataMap = function(target, targetKey, create){
  var targetMetadata = store.get(target);
  if(!targetMetadata){
    if(!create)return undefined;
    store.set(target, targetMetadata = new Map);
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if(!keyMetadata){
    if(!create)return undefined;
    targetMetadata.set(targetKey, keyMetadata = new Map);
  } return keyMetadata;
};
var ordinaryHasOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};
var ordinaryGetOwnMetadata = function(MetadataKey, O, P){
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};
var ordinaryDefineOwnMetadata = function(MetadataKey, MetadataValue, O, P){
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};
var ordinaryOwnMetadataKeys = function(target, targetKey){
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false)
    , keys        = [];
  if(metadataMap)metadataMap.forEach(function(_, key){ keys.push(key); });
  return keys;
};
var toMetaKey = function(it){
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};
var exp = function(O){
  $export($export.S, 'Reflect', O);
};

module.exports = {
  store: store,
  map: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  key: toMetaKey,
  exp: exp
};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(1)
  , dPs         = __webpack_require__(114)
  , enumBugKeys = __webpack_require__(72)
  , IE_PROTO    = __webpack_require__(87)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(71)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(74).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ },
/* 30 */
/***/ function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
if(__webpack_require__(7)){
  var LIBRARY             = __webpack_require__(40)
    , global              = __webpack_require__(2)
    , fails               = __webpack_require__(3)
    , $export             = __webpack_require__(0)
    , $typed              = __webpack_require__(66)
    , $buffer             = __webpack_require__(94)
    , ctx                 = __webpack_require__(25)
    , anInstance          = __webpack_require__(36)
    , propertyDesc        = __webpack_require__(30)
    , hide                = __webpack_require__(15)
    , redefineAll         = __webpack_require__(42)
    , toInteger           = __webpack_require__(35)
    , toLength            = __webpack_require__(8)
    , toIndex             = __webpack_require__(44)
    , toPrimitive         = __webpack_require__(27)
    , has                 = __webpack_require__(10)
    , same                = __webpack_require__(121)
    , classof             = __webpack_require__(37)
    , isObject            = __webpack_require__(4)
    , toObject            = __webpack_require__(9)
    , isArrayIter         = __webpack_require__(76)
    , create              = __webpack_require__(29)
    , getPrototypeOf      = __webpack_require__(17)
    , gOPN                = __webpack_require__(41).f
    , getIterFn           = __webpack_require__(51)
    , uid                 = __webpack_require__(45)
    , wks                 = __webpack_require__(5)
    , createArrayMethod   = __webpack_require__(24)
    , createArrayIncludes = __webpack_require__(54)
    , speciesConstructor  = __webpack_require__(88)
    , ArrayIterators      = __webpack_require__(96)
    , Iterators           = __webpack_require__(39)
    , $iterDetect         = __webpack_require__(62)
    , setSpecies          = __webpack_require__(43)
    , arrayFill           = __webpack_require__(69)
    , arrayCopyWithin     = __webpack_require__(101)
    , $DP                 = __webpack_require__(6)
    , $GOPD               = __webpack_require__(16)
    , dP                  = $DP.f
    , gOPD                = $GOPD.f
    , RangeError          = global.RangeError
    , TypeError           = global.TypeError
    , Uint8Array          = global.Uint8Array
    , ARRAY_BUFFER        = 'ArrayBuffer'
    , SHARED_BUFFER       = 'Shared' + ARRAY_BUFFER
    , BYTES_PER_ELEMENT   = 'BYTES_PER_ELEMENT'
    , PROTOTYPE           = 'prototype'
    , ArrayProto          = Array[PROTOTYPE]
    , $ArrayBuffer        = $buffer.ArrayBuffer
    , $DataView           = $buffer.DataView
    , arrayForEach        = createArrayMethod(0)
    , arrayFilter         = createArrayMethod(2)
    , arraySome           = createArrayMethod(3)
    , arrayEvery          = createArrayMethod(4)
    , arrayFind           = createArrayMethod(5)
    , arrayFindIndex      = createArrayMethod(6)
    , arrayIncludes       = createArrayIncludes(true)
    , arrayIndexOf        = createArrayIncludes(false)
    , arrayValues         = ArrayIterators.values
    , arrayKeys           = ArrayIterators.keys
    , arrayEntries        = ArrayIterators.entries
    , arrayLastIndexOf    = ArrayProto.lastIndexOf
    , arrayReduce         = ArrayProto.reduce
    , arrayReduceRight    = ArrayProto.reduceRight
    , arrayJoin           = ArrayProto.join
    , arraySort           = ArrayProto.sort
    , arraySlice          = ArrayProto.slice
    , arrayToString       = ArrayProto.toString
    , arrayToLocaleString = ArrayProto.toLocaleString
    , ITERATOR            = wks('iterator')
    , TAG                 = wks('toStringTag')
    , TYPED_CONSTRUCTOR   = uid('typed_constructor')
    , DEF_CONSTRUCTOR     = uid('def_constructor')
    , ALL_CONSTRUCTORS    = $typed.CONSTR
    , TYPED_ARRAY         = $typed.TYPED
    , VIEW                = $typed.VIEW
    , WRONG_LENGTH        = 'Wrong length!';

  var $map = createArrayMethod(1, function(O, length){
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function(){
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function(){
    new Uint8Array(1).set({});
  });

  var strictToLength = function(it, SAME){
    if(it === undefined)throw TypeError(WRONG_LENGTH);
    var number = +it
      , length = toLength(it);
    if(SAME && !same(number, length))throw RangeError(WRONG_LENGTH);
    return length;
  };

  var toOffset = function(it, BYTES){
    var offset = toInteger(it);
    if(offset < 0 || offset % BYTES)throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function(it){
    if(isObject(it) && TYPED_ARRAY in it)return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function(C, length){
    if(!(isObject(C) && TYPED_CONSTRUCTOR in C)){
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function(O, list){
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function(C, list){
    var index  = 0
      , length = list.length
      , result = allocate(C, length);
    while(length > index)result[index] = list[index++];
    return result;
  };

  var addGetter = function(it, key, internal){
    dP(it, key, {get: function(){ return this._d[internal]; }});
  };

  var $from = function from(source /*, mapfn, thisArg */){
    var O       = toObject(source)
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , iterFn  = getIterFn(O)
      , i, length, values, result, step, iterator;
    if(iterFn != undefined && !isArrayIter(iterFn)){
      for(iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++){
        values.push(step.value);
      } O = values;
    }
    if(mapping && aLen > 2)mapfn = ctx(mapfn, arguments[2], 2);
    for(i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++){
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/*...items*/){
    var index  = 0
      , length = arguments.length
      , result = allocate(this, length);
    while(length > index)result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function(){ arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString(){
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /*, end */){
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /*, thisArg */){
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /*, start, end */){ // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /*, thisArg */){
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /*, thisArg */){
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /*, thisArg */){
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /*, thisArg */){
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /*, fromIndex */){
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /*, fromIndex */){
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator){ // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */){ // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /*, thisArg */){
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /*, initialValue */){ // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse(){
      var that   = this
        , length = validate(that).length
        , middle = Math.floor(length / 2)
        , index  = 0
        , value;
      while(index < middle){
        value         = that[index];
        that[index++] = that[--length];
        that[length]  = value;
      } return that;
    },
    some: function some(callbackfn /*, thisArg */){
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn){
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end){
      var O      = validate(this)
        , length = O.length
        , $begin = toIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end){
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /*, offset */){
    validate(this);
    var offset = toOffset(arguments[1], 1)
      , length = this.length
      , src    = toObject(arrayLike)
      , len    = toLength(src.length)
      , index  = 0;
    if(len + offset > length)throw RangeError(WRONG_LENGTH);
    while(index < len)this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries(){
      return arrayEntries.call(validate(this));
    },
    keys: function keys(){
      return arrayKeys.call(validate(this));
    },
    values: function values(){
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function(target, key){
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key){
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc){
    if(isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ){
      target[key] = desc.value;
      return target;
    } else return dP(target, key, desc);
  };

  if(!ALL_CONSTRUCTORS){
    $GOPD.f = $getDesc;
    $DP.f   = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty:           $setDesc
  });

  if(fails(function(){ arrayToString.call({}); })){
    arrayToString = arrayToLocaleString = function toString(){
      return arrayJoin.call(this);
    }
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice:          $slice,
    set:            $set,
    constructor:    function(){ /* noop */ },
    toString:       arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function(){ return this[TYPED_ARRAY]; }
  });

  module.exports = function(KEY, BYTES, wrapper, CLAMPED){
    CLAMPED = !!CLAMPED;
    var NAME       = KEY + (CLAMPED ? 'Clamped' : '') + 'Array'
      , ISNT_UINT8 = NAME != 'Uint8Array'
      , GETTER     = 'get' + KEY
      , SETTER     = 'set' + KEY
      , TypedArray = global[NAME]
      , Base       = TypedArray || {}
      , TAC        = TypedArray && getPrototypeOf(TypedArray)
      , FORCED     = !TypedArray || !$typed.ABV
      , O          = {}
      , TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function(that, index){
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function(that, index, value){
      var data = that._d;
      if(CLAMPED)value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function(that, index){
      dP(that, index, {
        get: function(){
          return getter(this, index);
        },
        set: function(value){
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if(FORCED){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME, '_d');
        var index  = 0
          , offset = 0
          , buffer, byteLength, length, klass;
        if(!isObject(data)){
          length     = strictToLength(data, true)
          byteLength = length * BYTES;
          buffer     = new $ArrayBuffer(byteLength);
        } else if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if($length === undefined){
            if($len % BYTES)throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if(byteLength < 0)throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if(byteLength + offset > $len)throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if(TYPED_ARRAY in data){
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while(index < length)addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if(!$iterDetect(function(iter){
      // V8 works with iterators, but fails in many other cases
      // https://code.google.com/p/v8/issues/detail?id=4552
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)){
      TypedArray = wrapper(function(that, data, $offset, $length){
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if(!isObject(data))return new Base(strictToLength(data, ISNT_UINT8));
        if(data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER){
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if(TYPED_ARRAY in data)return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function(key){
        if(!(key in TypedArray))hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if(!LIBRARY)TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator   = TypedArrayPrototype[ITERATOR]
      , CORRECT_ITER_NAME = !!$nativeIterator && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined)
      , $iterator         = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if(CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)){
      dP(TypedArrayPrototype, TAG, {
        get: function(){ return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES,
      from: $from,
      of: $of
    });

    if(!(BYTES_PER_ELEMENT in TypedArrayPrototype))hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, {set: $set});

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    $export($export.P + $export.F * (TypedArrayPrototype.toString != arrayToString), NAME, {toString: arrayToString});

    $export($export.P + $export.F * fails(function(){
      new TypedArray(1).slice();
    }), NAME, {slice: $slice});

    $export($export.P + $export.F * (fails(function(){
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString()
    }) || !fails(function(){
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, {toLocaleString: $toLocaleString});

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if(!LIBRARY && !CORRECT_ITER_NAME)hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function(){ /* empty */ };

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export */ exports["b"] = setType;/* unused harmony export getType */var fableGlobal = function () {
    var globalObj = typeof window !== "undefined" ? window
        : (typeof global !== "undefined" ? global
            : (typeof self !== "undefined" ? self : {}));
    if (typeof globalObj.__FABLE_CORE__ === "undefined") {
        globalObj.__FABLE_CORE__ = {
            types: new Map(),
            symbols: {
                reflection: Symbol("reflection"),
            }
        };
    }
    return globalObj.__FABLE_CORE__;
}();
function setType(fullName, cons) {
    fableGlobal.types.set(fullName, cons);
}
function getType(fullName) {
    return fableGlobal.types.get(fullName);
}
/* harmony default export */ exports["a"] = fableGlobal.symbols;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(321)))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

var META     = __webpack_require__(45)('meta')
  , isObject = __webpack_require__(4)
  , has      = __webpack_require__(10)
  , setDesc  = __webpack_require__(6).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(3)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(116)
  , enumBugKeys = __webpack_require__(72);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ },
/* 35 */
/***/ function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ },
/* 36 */
/***/ function(module, exports) {

module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(21)
  , TAG = __webpack_require__(5)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(25)
  , call        = __webpack_require__(110)
  , isArrayIter = __webpack_require__(76)
  , anObject    = __webpack_require__(1)
  , toLength    = __webpack_require__(8)
  , getIterFn   = __webpack_require__(51)
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;

/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = {};

/***/ },
/* 40 */
/***/ function(module, exports) {

module.exports = false;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(116)
  , hiddenKeys = __webpack_require__(72).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(18);
module.exports = function(target, src, safe){
  for(var key in src)redefine(target, key, src[key], safe);
  return target;
};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var global      = __webpack_require__(2)
  , dP          = __webpack_require__(6)
  , DESCRIPTORS = __webpack_require__(7)
  , SPECIES     = __webpack_require__(5)('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(35)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ },
/* 45 */
/***/ function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(5)('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)__webpack_require__(15)(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

var def = __webpack_require__(6).f
  , has = __webpack_require__(10)
  , TAG = __webpack_require__(5)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , defined = __webpack_require__(22)
  , fails   = __webpack_require__(3)
  , spaces  = __webpack_require__(92)
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec, ALIAS){
  var exp   = {};
  var FORCE = fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if(ALIAS)exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(21);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ },
/* 50 */
/***/ function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(37)
  , ITERATOR  = __webpack_require__(5)('iterator')
  , Iterators = __webpack_require__(39);
module.exports = __webpack_require__(14).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Util__ = __webpack_require__(13);
/* harmony export */ exports["b"] = ofArray;



function ofArray(args, base) {
    var acc = base || new List();
    for (var i = args.length - 1; i >= 0; i--) {
        acc = new List(args[i], acc);
    }
    return acc;
}
var List = (function () {
    function List(head, tail) {
        this.head = head;
        this.tail = tail;
    }
    List.prototype.ToString = function () {
        return "[" + Array.from(this).map(__WEBPACK_IMPORTED_MODULE_1__Util__["a" /* toString */]).join("; ") + "]";
    };
    List.prototype.Equals = function (x) {
        if (this === x) {
            return true;
        }
        else {
            var iter1 = this[Symbol.iterator](), iter2 = x[Symbol.iterator]();
            for (;;) {
                var cur1 = iter1.next(), cur2 = iter2.next();
                if (cur1.done)
                    return cur2.done ? true : false;
                else if (cur2.done)
                    return false;
                else if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Util__["b" /* equals */])(cur1.value, cur2.value))
                    return false;
            }
        }
    };
    List.prototype.CompareTo = function (x) {
        if (this === x) {
            return 0;
        }
        else {
            var acc = 0;
            var iter1 = this[Symbol.iterator](), iter2 = x[Symbol.iterator]();
            for (;;) {
                var cur1 = iter1.next(), cur2 = iter2.next();
                if (cur1.done)
                    return cur2.done ? acc : -1;
                else if (cur2.done)
                    return 1;
                else {
                    acc = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Util__["c" /* compare */])(cur1.value, cur2.value);
                    if (acc != 0)
                        return acc;
                }
            }
        }
    };
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            var cur = this, acc = 0;
            while (cur.tail != null) {
                cur = cur.tail;
                acc++;
            }
            return acc;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype[Symbol.iterator] = function () {
        var cur = this;
        return {
            next: function () {
                var tmp = cur;
                cur = cur.tail;
                return { done: tmp.tail == null, value: tmp.head };
            }
        };
    };
    List.prototype[__WEBPACK_IMPORTED_MODULE_0__Symbol__["a" /* default */].reflection] = function () {
        return {
            type: "Microsoft.FSharp.Collections.FSharpList",
            interfaces: ["System.IEquatable", "System.IComparable"]
        };
    };
    return List;
}());
/* harmony default export */ exports["a"] = List;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(316);
__webpack_require__(135);
__webpack_require__(51);
__webpack_require__(137);
__webpack_require__(124);
__webpack_require__(134);
__webpack_require__(136);
__webpack_require__(141);
__webpack_require__(139);
__webpack_require__(140);
__webpack_require__(142);
__webpack_require__(138);
__webpack_require__(143);
__webpack_require__(144);
__webpack_require__(145);
module.exports = __webpack_require__(14);

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(11)
  , toLength  = __webpack_require__(8)
  , toIndex   = __webpack_require__(44);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var global            = __webpack_require__(2)
  , $export           = __webpack_require__(0)
  , redefine          = __webpack_require__(18)
  , redefineAll       = __webpack_require__(42)
  , meta              = __webpack_require__(33)
  , forOf             = __webpack_require__(38)
  , anInstance        = __webpack_require__(36)
  , isObject          = __webpack_require__(4)
  , fails             = __webpack_require__(3)
  , $iterDetect       = __webpack_require__(62)
  , setToStringTag    = __webpack_require__(47)
  , inheritIfRequired = __webpack_require__(75);

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO = !IS_WEAK && fails(function(){
        // V8 ~ Chromium 42- fails only with 5+ elements
        var $instance = new C()
          , index     = 5;
        while(index--)$instance[ADDER](index, index);
        return !$instance.has(-0);
      });
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base, target, C);
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var hide     = __webpack_require__(15)
  , redefine = __webpack_require__(18)
  , fails    = __webpack_require__(3)
  , defined  = __webpack_require__(22)
  , wks      = __webpack_require__(5);

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , fns      = exec(defined, SYMBOL, ''[KEY])
    , strfn    = fns[0]
    , rxfn     = fns[1];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return rxfn.call(string, this); }
    );
  }
};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(1);
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};

/***/ },
/* 58 */
/***/ function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(4)
  , cof      = __webpack_require__(21)
  , MATCH    = __webpack_require__(5)('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var create         = __webpack_require__(29)
  , descriptor     = __webpack_require__(30)
  , setToStringTag = __webpack_require__(47)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(15)(IteratorPrototype, __webpack_require__(5)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var LIBRARY        = __webpack_require__(40)
  , $export        = __webpack_require__(0)
  , redefine       = __webpack_require__(18)
  , hide           = __webpack_require__(15)
  , has            = __webpack_require__(10)
  , Iterators      = __webpack_require__(39)
  , $iterCreate    = __webpack_require__(60)
  , setToStringTag = __webpack_require__(47)
  , getPrototypeOf = __webpack_require__(17)
  , ITERATOR       = __webpack_require__(5)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(5)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

// Forced replacement prototype accessors methods
module.exports = __webpack_require__(40)|| !__webpack_require__(3)(function(){
  var K = Math.random();
  // In FF throws only define methods
  __defineSetter__.call(null, K, function(){ /* empty */});
  delete __webpack_require__(2)[K];
});

/***/ },
/* 64 */
/***/ function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

var global = __webpack_require__(2)
  , hide   = __webpack_require__(15)
  , uid    = __webpack_require__(45)
  , TYPED  = uid('typed_array')
  , VIEW   = uid('view')
  , ABV    = !!(global.ArrayBuffer && global.DataView)
  , CONSTR = ABV
  , i = 0, l = 9, Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while(i < l){
  if(Typed = global[TypedArrayConstructors[i++]]){
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV:    ABV,
  CONSTR: CONSTR,
  TYPED:  TYPED,
  VIEW:   VIEW
};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ListClass__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Seq__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Map__ = __webpack_require__(68);
/* unused harmony export append *//* unused harmony export choose *//* harmony export */ exports["e"] = collect;/* unused harmony export concat *//* harmony export */ exports["d"] = filter;/* unused harmony export where *//* unused harmony export initialize *//* harmony export */ exports["c"] = map;/* unused harmony export mapIndexed *//* unused harmony export partition *//* unused harmony export replicate *//* unused harmony export reverse *//* unused harmony export singleton *//* unused harmony export slice *//* unused harmony export unzip *//* unused harmony export unzip3 *//* unused harmony export groupBy *//* harmony reexport */ if(__webpack_require__.o(__WEBPACK_IMPORTED_MODULE_0__ListClass__, "b")) __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__ListClass__["b"]; });






/* harmony default export */ exports["b"] = __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */];

function append(xs, ys) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x) { return new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](x, acc); }, ys, reverse(xs));
}
function choose(f, xs) {
    var r = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x) {
        var y = f(x);
        return y != null ? new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](y, acc) : acc;
    }, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), xs);
    return reverse(r);
}
function collect(f, xs) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x) { return append(acc, f(x)); }, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), xs);
}
function concat(xs) {
    return collect(function (x) { return x; }, xs);
}
function filter(f, xs) {
    return reverse(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x) { return f(x) ? new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](x, acc) : acc; }, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), xs));
}
function where(f, xs) {
    return filter(f, xs);
}
function initialize(n, f) {
    if (n < 0) {
        throw new Error("List length must be non-negative");
    }
    var xs = new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */]();
    for (var i = 1; i <= n; i++) {
        xs = new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](f(n - i), xs);
    }
    return xs;
}
function map(f, xs) {
    return reverse(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x) { return new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](f(x), acc); }, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), xs));
}
function mapIndexed(f, xs) {
    return reverse(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x, i) { return new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](f(i, x), acc); }, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), xs));
}
function partition(f, xs) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x) {
        var lacc = acc[0], racc = acc[1];
        return f(x) ? [new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](x, lacc), racc] : [lacc, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](x, racc)];
    }, [new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */]()], reverse(xs));
}
function replicate(n, x) {
    return initialize(n, function () { return x; });
}
function reverse(xs) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x) { return new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](x, acc); }, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), xs);
}
function singleton(x) {
    return new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](x, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */]());
}
function slice(lower, upper, xs) {
    var noLower = (lower == null);
    var noUpper = (upper == null);
    return reverse(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["c" /* fold */])(function (acc, x, i) { return (noLower || lower <= i) && (noUpper || i <= upper) ? new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](x, acc) : acc; }, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), xs));
}
function unzip(xs) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["f" /* foldBack */])(function (xy, acc) {
        return [new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](xy[0], acc[0]), new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](xy[1], acc[1])];
    }, xs, [new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */]()]);
}
function unzip3(xs) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["f" /* foldBack */])(function (xyz, acc) {
        return [new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](xyz[0], acc[0]), new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](xyz[1], acc[1]), new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](xyz[2], acc[2])];
    }, xs, [new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */]()]);
}
function groupBy(f, xs) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["g" /* toList */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["b" /* map */])(function (k) { return [k[0], __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["g" /* toList */])(k[1])]; }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Map__["a" /* groupBy */])(f, xs)));
}


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ListClass__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__GenericComparer__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Symbol__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Seq__ = __webpack_require__(20);
/* harmony export */ exports["a"] = groupBy;/* unused harmony export countBy *//* unused harmony export MapTree *//* harmony export */ exports["c"] = create;/* harmony export */ exports["e"] = add;/* harmony export */ exports["g"] = remove;/* unused harmony export containsValue *//* unused harmony export tryGetValue *//* harmony export */ exports["d"] = exists;/* unused harmony export find *//* harmony export */ exports["f"] = tryFind;/* unused harmony export filter *//* unused harmony export fold *//* unused harmony export foldBack *//* unused harmony export forAll *//* unused harmony export isEmpty *//* unused harmony export iterate *//* harmony export */ exports["h"] = map;/* unused harmony export partition *//* unused harmony export findKey *//* unused harmony export tryFindKey *//* unused harmony export pick *//* unused harmony export tryPick */











function groupBy(f, xs) {
    var keys = [], iter = xs[Symbol.iterator]();
    var acc = create(), cur = iter.next();
    while (!cur.done) {
        var k = f(cur.value), vs = tryFind(k, acc);
        if (vs == null) {
            keys.push(k);
            acc = add(k, [cur.value], acc);
        }
        else {
            vs.push(cur.value);
        }
        cur = iter.next();
    }
    return keys.map(function (k) { return [k, acc.get(k)]; });
}
function countBy(f, xs) {
    return groupBy(f, xs).map(function (kv) { return [kv[0], kv[1].length]; });
}
var MapTree = (function () {
    function MapTree(caseName, fields) {
        this.Case = caseName;
        this.Fields = fields;
    }
    return MapTree;
}());

function tree_sizeAux(acc, m) {
    return m.Case === "MapOne"
        ? acc + 1
        : m.Case === "MapNode"
            ? tree_sizeAux(tree_sizeAux(acc + 1, m.Fields[2]), m.Fields[3])
            : acc;
}
function tree_size(x) {
    return tree_sizeAux(0, x);
}
function tree_empty() {
    return new MapTree("MapEmpty", []);
}
function tree_height(_arg1) {
    return _arg1.Case === "MapOne" ? 1 : _arg1.Case === "MapNode" ? _arg1.Fields[4] : 0;
}
function tree_isEmpty(m) {
    return m.Case === "MapEmpty" ? true : false;
}
function tree_mk(l, k, v, r) {
    var matchValue = [l, r];
    var $target1 = function () {
        var hl = tree_height(l);
        var hr = tree_height(r);
        var m = hl < hr ? hr : hl;
        return new MapTree("MapNode", [k, v, l, r, m + 1]);
    };
    if (matchValue[0].Case === "MapEmpty") {
        if (matchValue[1].Case === "MapEmpty") {
            return new MapTree("MapOne", [k, v]);
        }
        else {
            return $target1();
        }
    }
    else {
        return $target1();
    }
}
;
function tree_rebalance(t1, k, v, t2) {
    var t1h = tree_height(t1);
    var t2h = tree_height(t2);
    if (t2h > t1h + 2) {
        if (t2.Case === "MapNode") {
            if (tree_height(t2.Fields[2]) > t1h + 1) {
                if (t2.Fields[2].Case === "MapNode") {
                    return tree_mk(tree_mk(t1, k, v, t2.Fields[2].Fields[2]), t2.Fields[2].Fields[0], t2.Fields[2].Fields[1], tree_mk(t2.Fields[2].Fields[3], t2.Fields[0], t2.Fields[1], t2.Fields[3]));
                }
                else {
                    throw new Error("rebalance");
                }
            }
            else {
                return tree_mk(tree_mk(t1, k, v, t2.Fields[2]), t2.Fields[0], t2.Fields[1], t2.Fields[3]);
            }
        }
        else {
            throw new Error("rebalance");
        }
    }
    else {
        if (t1h > t2h + 2) {
            if (t1.Case === "MapNode") {
                if (tree_height(t1.Fields[3]) > t2h + 1) {
                    if (t1.Fields[3].Case === "MapNode") {
                        return tree_mk(tree_mk(t1.Fields[2], t1.Fields[0], t1.Fields[1], t1.Fields[3].Fields[2]), t1.Fields[3].Fields[0], t1.Fields[3].Fields[1], tree_mk(t1.Fields[3].Fields[3], k, v, t2));
                    }
                    else {
                        throw new Error("rebalance");
                    }
                }
                else {
                    return tree_mk(t1.Fields[2], t1.Fields[0], t1.Fields[1], tree_mk(t1.Fields[3], k, v, t2));
                }
            }
            else {
                throw new Error("rebalance");
            }
        }
        else {
            return tree_mk(t1, k, v, t2);
        }
    }
}
function tree_add(comparer, k, v, m) {
    if (m.Case === "MapOne") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return new MapTree("MapNode", [k, v, new MapTree("MapEmpty", []), m, 2]);
        }
        else if (c === 0) {
            return new MapTree("MapOne", [k, v]);
        }
        return new MapTree("MapNode", [k, v, m, new MapTree("MapEmpty", []), 2]);
    }
    else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_rebalance(tree_add(comparer, k, v, m.Fields[2]), m.Fields[0], m.Fields[1], m.Fields[3]);
        }
        else if (c === 0) {
            return new MapTree("MapNode", [k, v, m.Fields[2], m.Fields[3], m.Fields[4]]);
        }
        return tree_rebalance(m.Fields[2], m.Fields[0], m.Fields[1], tree_add(comparer, k, v, m.Fields[3]));
    }
    return new MapTree("MapOne", [k, v]);
}
function tree_find(comparer, k, m) {
    var res = tree_tryFind(comparer, k, m);
    if (res != null)
        return res;
    throw new Error("key not found");
}
function tree_tryFind(comparer, k, m) {
    if (m.Case === "MapOne") {
        var c = comparer.Compare(k, m.Fields[0]);
        return c === 0 ? m.Fields[1] : null;
    }
    else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_tryFind(comparer, k, m.Fields[2]);
        }
        else {
            if (c === 0) {
                return m.Fields[1];
            }
            else {
                return tree_tryFind(comparer, k, m.Fields[3]);
            }
        }
    }
    return null;
}
function tree_partition1(comparer, f, k, v, acc1, acc2) {
    return f(k, v) ? [tree_add(comparer, k, v, acc1), acc2] : [acc1, tree_add(comparer, k, v, acc2)];
}
function tree_partitionAux(comparer, f, s, acc_0, acc_1) {
    var acc = [acc_0, acc_1];
    if (s.Case === "MapOne") {
        return tree_partition1(comparer, f, s.Fields[0], s.Fields[1], acc[0], acc[1]);
    }
    else if (s.Case === "MapNode") {
        var acc_2 = tree_partitionAux(comparer, f, s.Fields[3], acc[0], acc[1]);
        var acc_3 = tree_partition1(comparer, f, s.Fields[0], s.Fields[1], acc_2[0], acc_2[1]);
        return tree_partitionAux(comparer, f, s.Fields[2], acc_3[0], acc_3[1]);
    }
    return acc;
}
function tree_partition(comparer, f, s) {
    return tree_partitionAux(comparer, f, s, tree_empty(), tree_empty());
}
function tree_filter1(comparer, f, k, v, acc) {
    return f(k, v) ? tree_add(comparer, k, v, acc) : acc;
}
function tree_filterAux(comparer, f, s, acc) {
    return s.Case === "MapOne" ? tree_filter1(comparer, f, s.Fields[0], s.Fields[1], acc) : s.Case === "MapNode" ? tree_filterAux(comparer, f, s.Fields[3], tree_filter1(comparer, f, s.Fields[0], s.Fields[1], tree_filterAux(comparer, f, s.Fields[2], acc))) : acc;
}
function tree_filter(comparer, f, s) {
    return tree_filterAux(comparer, f, s, tree_empty());
}
function tree_spliceOutSuccessor(m) {
    if (m.Case === "MapOne") {
        return [m.Fields[0], m.Fields[1], new MapTree("MapEmpty", [])];
    }
    else if (m.Case === "MapNode") {
        if (m.Fields[2].Case === "MapEmpty") {
            return [m.Fields[0], m.Fields[1], m.Fields[3]];
        }
        else {
            var kvl = tree_spliceOutSuccessor(m.Fields[2]);
            return [kvl[0], kvl[1], tree_mk(kvl[2], m.Fields[0], m.Fields[1], m.Fields[3])];
        }
    }
    throw new Error("internal error: Map.spliceOutSuccessor");
}
function tree_remove(comparer, k, m) {
    if (m.Case === "MapOne") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c === 0) {
            return new MapTree("MapEmpty", []);
        }
        else {
            return m;
        }
    }
    else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_rebalance(tree_remove(comparer, k, m.Fields[2]), m.Fields[0], m.Fields[1], m.Fields[3]);
        }
        else {
            if (c === 0) {
                var matchValue = [m.Fields[2], m.Fields[3]];
                if (matchValue[0].Case === "MapEmpty") {
                    return m.Fields[3];
                }
                else {
                    if (matchValue[1].Case === "MapEmpty") {
                        return m.Fields[2];
                    }
                    else {
                        var patternInput = tree_spliceOutSuccessor(m.Fields[3]);
                        var sv = patternInput[1];
                        var sk = patternInput[0];
                        var r_ = patternInput[2];
                        return tree_mk(m.Fields[2], sk, sv, r_);
                    }
                }
            }
            else {
                return tree_rebalance(m.Fields[2], m.Fields[0], m.Fields[1], tree_remove(comparer, k, m.Fields[3]));
            }
        }
    }
    else {
        return tree_empty();
    }
}
function tree_mem(comparer, k, m) {
    if (m.Case === "MapOne") {
        return comparer.Compare(k, m.Fields[0]) === 0;
    }
    else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_mem(comparer, k, m.Fields[2]);
        }
        else {
            if (c === 0) {
                return true;
            }
            else {
                return tree_mem(comparer, k, m.Fields[3]);
            }
        }
    }
    else {
        return false;
    }
}
function tree_iter(f, m) {
    if (m.Case === "MapOne") {
        f(m.Fields[0], m.Fields[1]);
    }
    else if (m.Case === "MapNode") {
        tree_iter(f, m.Fields[2]);
        f(m.Fields[0], m.Fields[1]);
        tree_iter(f, m.Fields[3]);
    }
}
function tree_tryPick(f, m) {
    if (m.Case === "MapOne") {
        return f(m.Fields[0], m.Fields[1]);
    }
    else if (m.Case === "MapNode") {
        var matchValue = tree_tryPick(f, m.Fields[2]);
        if (matchValue == null) {
            var matchValue_1 = f(m.Fields[0], m.Fields[1]);
            if (matchValue_1 == null) {
                return tree_tryPick(f, m.Fields[3]);
            }
            else {
                var res = matchValue_1;
                return res;
            }
        }
        else {
            var res = matchValue;
            return res;
        }
    }
    else {
        return null;
    }
}
function tree_exists(f, m) {
    return m.Case === "MapOne" ? f(m.Fields[0], m.Fields[1]) : m.Case === "MapNode" ? (tree_exists(f, m.Fields[2]) ? true : f(m.Fields[0], m.Fields[1])) ? true : tree_exists(f, m.Fields[3]) : false;
}
function tree_forall(f, m) {
    return m.Case === "MapOne" ? f(m.Fields[0], m.Fields[1]) : m.Case === "MapNode" ? (tree_forall(f, m.Fields[2]) ? f(m.Fields[0], m.Fields[1]) : false) ? tree_forall(f, m.Fields[3]) : false : true;
}
function tree_mapi(f, m) {
    return m.Case === "MapOne" ? new MapTree("MapOne", [m.Fields[0], f(m.Fields[0], m.Fields[1])]) : m.Case === "MapNode" ? new MapTree("MapNode", [m.Fields[0], f(m.Fields[0], m.Fields[1]), tree_mapi(f, m.Fields[2]), tree_mapi(f, m.Fields[3]), m.Fields[4]]) : tree_empty();
}
function tree_foldBack(f, m, x) {
    return m.Case === "MapOne" ? f(m.Fields[0], m.Fields[1], x) : m.Case === "MapNode" ? tree_foldBack(f, m.Fields[2], f(m.Fields[0], m.Fields[1], tree_foldBack(f, m.Fields[3], x))) : x;
}
function tree_fold(f, x, m) {
    return m.Case === "MapOne" ? f(x, m.Fields[0], m.Fields[1]) : m.Case === "MapNode" ? tree_fold(f, f(tree_fold(f, x, m.Fields[2]), m.Fields[0], m.Fields[1]), m.Fields[3]) : x;
}
function tree_mkFromEnumerator(comparer, acc, e) {
    var cur = e.next();
    while (!cur.done) {
        acc = tree_add(comparer, cur.value[0], cur.value[1], acc);
        cur = e.next();
    }
    return acc;
}
function tree_ofSeq(comparer, c) {
    var ie = c[Symbol.iterator]();
    return tree_mkFromEnumerator(comparer, tree_empty(), ie);
}
function tree_collapseLHS(stack) {
    if (stack.tail != null) {
        if (stack.head.Case === "MapOne") {
            return stack;
        }
        else if (stack.head.Case === "MapNode") {
            return tree_collapseLHS(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ListClass__["b" /* ofArray */])([
                stack.head.Fields[2],
                new MapTree("MapOne", [stack.head.Fields[0], stack.head.Fields[1]]),
                stack.head.Fields[3]
            ], stack.tail));
        }
        else {
            return tree_collapseLHS(stack.tail);
        }
    }
    else {
        return new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */]();
    }
}
function tree_mkIterator(s) {
    return { stack: tree_collapseLHS(new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */](s, new __WEBPACK_IMPORTED_MODULE_0__ListClass__["a" /* default */]())), started: false };
}
function tree_moveNext(i) {
    function current(i) {
        if (i.stack.tail == null) {
            return null;
        }
        else if (i.stack.head.Case === "MapOne") {
            return [i.stack.head.Fields[0], i.stack.head.Fields[1]];
        }
        throw new Error("Please report error: Map iterator, unexpected stack for current");
    }
    if (i.started) {
        if (i.stack.tail == null) {
            return { done: true, value: null };
        }
        else {
            if (i.stack.head.Case === "MapOne") {
                i.stack = tree_collapseLHS(i.stack.tail);
                return {
                    done: i.stack.tail == null,
                    value: current(i)
                };
            }
            else {
                throw new Error("Please report error: Map iterator, unexpected stack for moveNext");
            }
        }
    }
    else {
        i.started = true;
        return {
            done: i.stack.tail == null,
            value: current(i)
        };
    }
    ;
}
var FableMap = (function () {
    function FableMap() {
    }
    FableMap.prototype.ToString = function () {
        return "map [" + Array.from(this).map(__WEBPACK_IMPORTED_MODULE_1__Util__["a" /* toString */]).join("; ") + "]";
    };
    FableMap.prototype.Equals = function (m2) {
        return this.CompareTo(m2) === 0;
    };
    FableMap.prototype.CompareTo = function (m2) {
        var _this = this;
        return this === m2 ? 0 : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Seq__["a" /* compareWith */])(function (kvp1, kvp2) {
            var c = _this.comparer.Compare(kvp1[0], kvp2[0]);
            return c !== 0 ? c : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Util__["c" /* compare */])(kvp1[1], kvp2[1]);
        }, this, m2);
    };
    FableMap.prototype[Symbol.iterator] = function () {
        var i = tree_mkIterator(this.tree);
        return {
            next: function () { return tree_moveNext(i); }
        };
    };
    FableMap.prototype.entries = function () {
        return this[Symbol.iterator]();
    };
    FableMap.prototype.keys = function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Seq__["b" /* map */])(function (kv) { return kv[0]; }, this);
    };
    FableMap.prototype.values = function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Seq__["b" /* map */])(function (kv) { return kv[1]; }, this);
    };
    FableMap.prototype.get = function (k) {
        return tree_find(this.comparer, k, this.tree);
    };
    FableMap.prototype.has = function (k) {
        return tree_mem(this.comparer, k, this.tree);
    };
    FableMap.prototype.set = function (k, v) {
        throw new Error("not supported");
    };
    FableMap.prototype.delete = function (k) {
        throw new Error("not supported");
    };
    FableMap.prototype.clear = function () {
        throw new Error("not supported");
    };
    Object.defineProperty(FableMap.prototype, "size", {
        get: function () {
            return tree_size(this.tree);
        },
        enumerable: true,
        configurable: true
    });
    FableMap.prototype[__WEBPACK_IMPORTED_MODULE_3__Symbol__["a" /* default */].reflection] = function () {
        return {
            type: "Microsoft.FSharp.Collections.FSharpMap",
            interfaces: ["System.IEquatable", "System.IComparable", "System.Collections.Generic.IDictionary"]
        };
    };
    return FableMap;
}());
/* harmony default export */ exports["b"] = FableMap;
function from(comparer, tree) {
    var map = new FableMap();
    map.tree = tree;
    map.comparer = comparer || new __WEBPACK_IMPORTED_MODULE_2__GenericComparer__["a" /* default */]();
    return map;
}
function create(ie, comparer) {
    comparer = comparer || new __WEBPACK_IMPORTED_MODULE_2__GenericComparer__["a" /* default */]();
    return from(comparer, ie ? tree_ofSeq(comparer, ie) : tree_empty());
}
function add(k, v, map) {
    return from(map.comparer, tree_add(map.comparer, k, v, map.tree));
}
function remove(item, map) {
    return from(map.comparer, tree_remove(map.comparer, item, map.tree));
}
function containsValue(v, map) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Seq__["c" /* fold */])(function (acc, k) { return acc || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Util__["b" /* equals */])(map.get(k), v); }, false, map.keys());
}
function tryGetValue(map, key, defaultValue) {
    return map.has(key) ? [true, map.get(key)] : [false, defaultValue];
}
function exists(f, map) {
    return tree_exists(f, map.tree);
}
function find(k, map) {
    return tree_find(map.comparer, k, map.tree);
}
function tryFind(k, map) {
    return tree_tryFind(map.comparer, k, map.tree);
}
function filter(f, map) {
    return from(map.comparer, tree_filter(map.comparer, f, map.tree));
}
function fold(f, seed, map) {
    return tree_fold(f, seed, map.tree);
}
function foldBack(f, map, seed) {
    return tree_foldBack(f, map.tree, seed);
}
function forAll(f, map) {
    return tree_forall(f, map.tree);
}
function isEmpty(map) {
    return tree_isEmpty(map.tree);
}
function iterate(f, map) {
    tree_iter(f, map.tree);
}
function map(f, map) {
    return from(map.comparer, tree_mapi(f, map.tree));
}
function partition(f, map) {
    var rs = tree_partition(map.comparer, f, map.tree);
    return [from(map.comparer, rs[0]), from(map.comparer, rs[1])];
}
function findKey(f, map) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Seq__["d" /* pick */])(function (kv) { return f(kv[0], kv[1]) ? kv[0] : null; }, map);
}
function tryFindKey(f, map) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__Seq__["e" /* tryPick */])(function (kv) { return f(kv[0], kv[1]) ? kv[0] : null; }, map);
}
function pick(f, map) {
    var res = tryPick(f, map);
    if (res != null)
        return res;
    throw new Error("key not found");
}
function tryPick(f, map) {
    return tree_tryPick(f, map.tree);
}


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = __webpack_require__(9)
  , toIndex  = __webpack_require__(44)
  , toLength = __webpack_require__(8);
module.exports = function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , aLen   = arguments.length
    , index  = toIndex(aLen > 1 ? arguments[1] : undefined, length)
    , end    = aLen > 2 ? arguments[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $defineProperty = __webpack_require__(6)
  , createDesc      = __webpack_require__(30);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4)
  , document = __webpack_require__(2).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ },
/* 72 */
/***/ function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__(5)('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2).document && document.documentElement;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

var isObject       = __webpack_require__(4)
  , setPrototypeOf = __webpack_require__(86).set;
module.exports = function(that, target, C){
  var P, S = target.constructor;
  if(S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf){
    setPrototypeOf(that, P);
  } return that;
};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(39)
  , ITERATOR   = __webpack_require__(5)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(21);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ },
/* 78 */
/***/ function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ },
/* 79 */
/***/ function(module, exports) {

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

/***/ },
/* 80 */
/***/ function(module, exports) {

// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

var global    = __webpack_require__(2)
  , macrotask = __webpack_require__(93).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(21)(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(34)
  , gOPS     = __webpack_require__(64)
  , pIE      = __webpack_require__(50)
  , toObject = __webpack_require__(9)
  , IObject  = __webpack_require__(49)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(3)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN     = __webpack_require__(41)
  , gOPS     = __webpack_require__(64)
  , anObject = __webpack_require__(1)
  , Reflect  = __webpack_require__(2).Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = gOPN.f(anObject(it))
    , getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var path      = __webpack_require__(120)
  , invoke    = __webpack_require__(58)
  , aFunction = __webpack_require__(12);
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that = this
      , aLen = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !aLen)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(aLen > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};

/***/ },
/* 85 */
/***/ function(module, exports) {

module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(4)
  , anObject = __webpack_require__(1);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(25)(Function.call, __webpack_require__(16).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

var shared = __webpack_require__(65)('keys')
  , uid    = __webpack_require__(45);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(1)
  , aFunction = __webpack_require__(12)
  , SPECIES   = __webpack_require__(5)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(35)
  , defined   = __webpack_require__(22);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__(59)
  , defined  = __webpack_require__(22);

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var toInteger = __webpack_require__(35)
  , defined   = __webpack_require__(22);

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};

/***/ },
/* 92 */
/***/ function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(25)
  , invoke             = __webpack_require__(58)
  , html               = __webpack_require__(74)
  , cel                = __webpack_require__(71)
  , global             = __webpack_require__(2)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(21)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var global         = __webpack_require__(2)
  , DESCRIPTORS    = __webpack_require__(7)
  , LIBRARY        = __webpack_require__(40)
  , $typed         = __webpack_require__(66)
  , hide           = __webpack_require__(15)
  , redefineAll    = __webpack_require__(42)
  , fails          = __webpack_require__(3)
  , anInstance     = __webpack_require__(36)
  , toInteger      = __webpack_require__(35)
  , toLength       = __webpack_require__(8)
  , gOPN           = __webpack_require__(41).f
  , dP             = __webpack_require__(6).f
  , arrayFill      = __webpack_require__(69)
  , setToStringTag = __webpack_require__(47)
  , ARRAY_BUFFER   = 'ArrayBuffer'
  , DATA_VIEW      = 'DataView'
  , PROTOTYPE      = 'prototype'
  , WRONG_LENGTH   = 'Wrong length!'
  , WRONG_INDEX    = 'Wrong index!'
  , $ArrayBuffer   = global[ARRAY_BUFFER]
  , $DataView      = global[DATA_VIEW]
  , Math           = global.Math
  , RangeError     = global.RangeError
  , Infinity       = global.Infinity
  , BaseBuffer     = $ArrayBuffer
  , abs            = Math.abs
  , pow            = Math.pow
  , floor          = Math.floor
  , log            = Math.log
  , LN2            = Math.LN2
  , BUFFER         = 'buffer'
  , BYTE_LENGTH    = 'byteLength'
  , BYTE_OFFSET    = 'byteOffset'
  , $BUFFER        = DESCRIPTORS ? '_b' : BUFFER
  , $LENGTH        = DESCRIPTORS ? '_l' : BYTE_LENGTH
  , $OFFSET        = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
var packIEEE754 = function(value, mLen, nBytes){
  var buffer = Array(nBytes)
    , eLen   = nBytes * 8 - mLen - 1
    , eMax   = (1 << eLen) - 1
    , eBias  = eMax >> 1
    , rt     = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0
    , i      = 0
    , s      = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0
    , e, m, c;
  value = abs(value)
  if(value != value || value === Infinity){
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if(value * (c = pow(2, -e)) < 1){
      e--;
      c *= 2;
    }
    if(e + eBias >= 1){
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if(value * c >= 2){
      e++;
      c /= 2;
    }
    if(e + eBias >= eMax){
      m = 0;
      e = eMax;
    } else if(e + eBias >= 1){
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for(; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for(; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
};
var unpackIEEE754 = function(buffer, mLen, nBytes){
  var eLen  = nBytes * 8 - mLen - 1
    , eMax  = (1 << eLen) - 1
    , eBias = eMax >> 1
    , nBits = eLen - 7
    , i     = nBytes - 1
    , s     = buffer[i--]
    , e     = s & 127
    , m;
  s >>= 7;
  for(; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for(; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if(e === 0){
    e = 1 - eBias;
  } else if(e === eMax){
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
};

var unpackI32 = function(bytes){
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
};
var packI8 = function(it){
  return [it & 0xff];
};
var packI16 = function(it){
  return [it & 0xff, it >> 8 & 0xff];
};
var packI32 = function(it){
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
};
var packF64 = function(it){
  return packIEEE754(it, 52, 8);
};
var packF32 = function(it){
  return packIEEE754(it, 23, 4);
};

var addGetter = function(C, key, internal){
  dP(C[PROTOTYPE], key, {get: function(){ return this[internal]; }});
};

var get = function(view, bytes, index, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
};
var set = function(view, bytes, index, conversion, value, isLittleEndian){
  var numIndex = +index
    , intIndex = toInteger(numIndex);
  if(numIndex != intIndex || intIndex < 0 || intIndex + bytes > view[$LENGTH])throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b
    , start = intIndex + view[$OFFSET]
    , pack  = conversion(+value);
  for(var i = 0; i < bytes; i++)store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
};

var validateArrayBufferArguments = function(that, length){
  anInstance(that, $ArrayBuffer, ARRAY_BUFFER);
  var numberLength = +length
    , byteLength   = toLength(numberLength);
  if(numberLength != byteLength)throw RangeError(WRONG_LENGTH);
  return byteLength;
};

if(!$typed.ABV){
  $ArrayBuffer = function ArrayBuffer(length){
    var byteLength = validateArrayBufferArguments(this, length);
    this._b       = arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength){
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH]
      , offset       = toInteger(byteOffset);
    if(offset < 0 || offset > bufferLength)throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if(offset + byteLength > bufferLength)throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if(DESCRIPTORS){
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset){
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset){
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /*, littleEndian */){
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /*, littleEndian */){
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /*, littleEndian */){
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value){
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /*, littleEndian */){
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /*, littleEndian */){
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /*, littleEndian */){
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if(!fails(function(){
    new $ArrayBuffer;     // eslint-disable-line no-new
  }) || !fails(function(){
    new $ArrayBuffer(.5); // eslint-disable-line no-new
  })){
    $ArrayBuffer = function ArrayBuffer(length){
      return new BaseBuffer(validateArrayBufferArguments(this, length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for(var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j; ){
      if(!((key = keys[j++]) in $ArrayBuffer))hide($ArrayBuffer, key, BaseBuffer[key]);
    };
    if(!LIBRARY)ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2))
    , $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if(view.getInt8(0) || !view.getInt8(1))redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value){
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

var global         = __webpack_require__(2)
  , core           = __webpack_require__(14)
  , LIBRARY        = __webpack_require__(40)
  , wksExt         = __webpack_require__(123)
  , defineProperty = __webpack_require__(6).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var addToUnscopables = __webpack_require__(46)
  , step             = __webpack_require__(78)
  , Iterators        = __webpack_require__(39)
  , toIObject        = __webpack_require__(11);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(61)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Symbol__ = __webpack_require__(32);


var GenericComparer = (function () {
    function GenericComparer(f) {
        this.Compare = f || __WEBPACK_IMPORTED_MODULE_0__Util__["c" /* compare */];
    }
    GenericComparer.prototype[__WEBPACK_IMPORTED_MODULE_1__Symbol__["a" /* default */].reflection] = function () {
        return { interfaces: ["System.IComparer"] };
    };
    return GenericComparer;
}());
/* harmony default export */ exports["a"] = GenericComparer;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Symbol__ = __webpack_require__(32);

/* harmony export */ __webpack_require__.d(exports, "a", function() { return Observer; });/* harmony export */ exports["b"] = protect;/* harmony export */ exports["c"] = add;/* unused harmony export choose *//* unused harmony export filter *//* unused harmony export map *//* unused harmony export merge *//* unused harmony export pairwise *//* unused harmony export partition *//* unused harmony export scan *//* unused harmony export split *//* unused harmony export subscribe */

var Observer = (function () {
    function Observer(onNext, onError, onCompleted) {
        this.OnNext = onNext;
        this.OnError = onError || (function (e) { });
        this.OnCompleted = onCompleted || function () { };
    }
    Observer.prototype[__WEBPACK_IMPORTED_MODULE_1__Symbol__["a" /* default */].reflection] = function () {
        return { interfaces: ["System.IObserver"] };
    };
    return Observer;
}());

var Observable = (function () {
    function Observable(subscribe) {
        this.Subscribe = subscribe;
    }
    Observable.prototype[__WEBPACK_IMPORTED_MODULE_1__Symbol__["a" /* default */].reflection] = function () {
        return { interfaces: ["System.IObservable"] };
    };
    return Observable;
}());
function protect(f, succeed, fail) {
    try {
        return succeed(f());
    }
    catch (e) {
        fail(e);
    }
}
function add(callback, source) {
    source.Subscribe(new Observer(callback));
}
function choose(chooser, source) {
    return new Observable(function (observer) {
        return source.Subscribe(new Observer(function (t) {
            return protect(function () { return chooser(t); }, function (u) { if (u != null)
                observer.OnNext(u); }, observer.OnError);
        }, observer.OnError, observer.OnCompleted));
    });
}
function filter(predicate, source) {
    return choose(function (x) { return predicate(x) ? x : null; }, source);
}
function map(mapping, source) {
    return new Observable(function (observer) {
        return source.Subscribe(new Observer(function (t) {
            protect(function () { return mapping(t); }, observer.OnNext, observer.OnError);
        }, observer.OnError, observer.OnCompleted));
    });
}
function merge(source1, source2) {
    return new Observable(function (observer) {
        var stopped = false, completed1 = false, completed2 = false;
        var h1 = source1.Subscribe(new Observer(function (v) { if (!stopped)
            observer.OnNext(v); }, function (e) {
            if (!stopped) {
                stopped = true;
                observer.OnError(e);
            }
        }, function () {
            if (!stopped) {
                completed1 = true;
                if (completed2) {
                    stopped = true;
                    observer.OnCompleted();
                }
            }
        }));
        var h2 = source2.Subscribe(new Observer(function (v) { if (!stopped) {
            observer.OnNext(v);
        } }, function (e) {
            if (!stopped) {
                stopped = true;
                observer.OnError(e);
            }
        }, function () {
            if (!stopped) {
                completed2 = true;
                if (completed1) {
                    stopped = true;
                    observer.OnCompleted();
                }
            }
        }));
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["i" /* createDisposable */])(function () {
            h1.Dispose();
            h2.Dispose();
        });
    });
}
function pairwise(source) {
    return new Observable(function (observer) {
        var last = null;
        return source.Subscribe(new Observer(function (next) {
            if (last != null)
                observer.OnNext([last, next]);
            last = next;
        }, observer.OnError, observer.OnCompleted));
    });
}
function partition(predicate, source) {
    return [filter(predicate, source), filter(function (x) { return !predicate(x); }, source)];
}
function scan(collector, state, source) {
    return new Observable(function (observer) {
        return source.Subscribe(new Observer(function (t) {
            protect(function () { return collector(state, t); }, function (u) { state = u; observer.OnNext(u); }, observer.OnError);
        }, observer.OnError, observer.OnCompleted));
    });
}
function split(splitter, source) {
    return [choose(function (v) { return splitter(v).valueIfChoice1; }, source), choose(function (v) { return splitter(v).valueIfChoice2; }, source)];
}
function subscribe(callback, source) {
    return source.Subscribe(new Observer(callback));
}


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fable_core_Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fable_core_List__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_fable_core_Map__ = __webpack_require__(68);

/* harmony export */ __webpack_require__.d(exports, "h", function() { return Block; });/* unused harmony export TetrominoBlocks */
/* harmony export */ __webpack_require__.d(exports, "g", function() { return TetrominoRow; });
/* harmony export */ __webpack_require__.d(exports, "f", function() { return TetrominoDetail; });
/* harmony export */ __webpack_require__.d(exports, "e", function() { return Tetromino; });/* unused harmony export Row */
/* harmony export */ __webpack_require__.d(exports, "d", function() { return GameboardInMotion; });
/* harmony export */ __webpack_require__.d(exports, "i", function() { return RestingGameboard; });
/* harmony export */ __webpack_require__.d(exports, "c", function() { return Gameboard; });/* unused harmony export GameControl *//* unused harmony export ValidKeyPress */
/* harmony export */ __webpack_require__.d(exports, "b", function() { return _ValidKeyPress_; });
/* harmony export */ __webpack_require__.d(exports, "a", function() { return ValidKeyPressModule; });var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }








var Block = function () {
    function Block(bottomX, bottomY, color) {
        _classCallCheck(this, Block);

        this.BottomX = bottomX;
        this.BottomY = bottomY;
        this.Color = color;
    }

    _createClass(Block, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.Block",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    BottomX: "number",
                    BottomY: "number",
                    Color: "string"
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["d" /* equalsRecords */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["e" /* compareRecords */])(this, other);
        }
    }]);

    return Block;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.Block", Block);
var TetrominoBlocks = function () {
    function TetrominoBlocks(block1, block2, block3, block4) {
        _classCallCheck(this, TetrominoBlocks);

        this.Block1 = block1;
        this.Block2 = block2;
        this.Block3 = block3;
        this.Block4 = block4;
    }

    _createClass(TetrominoBlocks, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.TetrominoBlocks",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    Block1: Block,
                    Block2: Block,
                    Block3: Block,
                    Block4: Block
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["d" /* equalsRecords */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["e" /* compareRecords */])(this, other);
        }
    }, {
        key: "ToList",
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["a" /* ofArray */])([this.Block1, this.Block2, this.Block3, this.Block4]);
        }
    }]);

    return TetrominoBlocks;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.TetrominoBlocks", TetrominoBlocks);
var TetrominoRow = function () {
    function TetrominoRow(blocks) {
        _classCallCheck(this, TetrominoRow);

        this.Blocks = blocks;
    }

    _createClass(TetrominoRow, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.TetrominoRow",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    Blocks: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["b" /* default */], {
                        T: Block
                    })
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["d" /* equalsRecords */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["e" /* compareRecords */])(this, other);
        }
    }, {
        key: "RightMostX",
        value: function (blockSize) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["h" /* reduce */])(function (x, y) {
                return Math.max(x, y);
            }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["c" /* map */])(function (b) {
                return b.BottomX + blockSize;
            }, this.Blocks));
        }
    }, {
        key: "Width",
        value: function (blockSize) {
            return this.RightMostX(blockSize) - this.LeftMostX;
        }
    }, {
        key: "TopY",
        value: function (blockSize) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["h" /* reduce */])(function (x, y) {
                return Math.min(x, y);
            }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["c" /* map */])(function (b) {
                return b.BottomY - blockSize;
            }, this.Blocks));
        }
    }, {
        key: "Height",
        value: function (blockSize) {
            return this.BottomY - this.TopY(blockSize);
        }
    }, {
        key: "LowestBlocks",
        value: function (blockSize) {
            var _this = this;

            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["d" /* filter */])(function (b) {
                return b.BottomY === _this.BottomY;
            }, this.Blocks);
        }
    }, {
        key: "LeftMostX",
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["h" /* reduce */])(function (x, y) {
                return Math.min(x, y);
            }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["c" /* map */])(function (b) {
                return b.BottomX;
            }, this.Blocks));
        }
    }, {
        key: "BottomY",
        get: function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["h" /* reduce */])(function (x, y) {
                return Math.max(x, y);
            }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["c" /* map */])(function (b) {
                return b.BottomY;
            }, this.Blocks));
        }
    }]);

    return TetrominoRow;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.TetrominoRow", TetrominoRow);
var TetrominoDetail = function () {
    function TetrominoDetail(tetrominoRows) {
        _classCallCheck(this, TetrominoDetail);

        this.TetrominoRows = tetrominoRows;
    }

    _createClass(TetrominoDetail, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.TetrominoDetail",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    TetrominoRows: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_2_fable_core_List__["b" /* default */], {
                        T: TetrominoRow
                    })
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["d" /* equalsRecords */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["e" /* compareRecords */])(this, other);
        }
    }]);

    return TetrominoDetail;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.TetrominoDetail", TetrominoDetail);
var Tetromino = function () {
    function Tetromino(caseName, fields) {
        _classCallCheck(this, Tetromino);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(Tetromino, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.Tetromino",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    StraightDown: [TetrominoDetail],
                    StraightLeft: [TetrominoDetail],
                    StraightRight: [TetrominoDetail],
                    StraightUp: [TetrominoDetail],
                    TShapeDown: [TetrominoDetail],
                    TShapeLeft: [TetrominoDetail],
                    TShapeRight: [TetrominoDetail],
                    TShapeUp: [TetrominoDetail]
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["g" /* equalsUnions */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["h" /* compareUnions */])(this, other);
        }
    }, {
        key: "TetrominoRows",
        get: function () {
            if (this.Case === "StraightRight") {
                return this.Fields[0].TetrominoRows;
            } else if (this.Case === "StraightDown") {
                return this.Fields[0].TetrominoRows;
            } else if (this.Case === "StraightLeft") {
                return this.Fields[0].TetrominoRows;
            } else if (this.Case === "TShapeUp") {
                return this.Fields[0].TetrominoRows;
            } else if (this.Case === "TShapeRight") {
                return this.Fields[0].TetrominoRows;
            } else if (this.Case === "TShapeDown") {
                return this.Fields[0].TetrominoRows;
            } else if (this.Case === "TShapeLeft") {
                return this.Fields[0].TetrominoRows;
            } else {
                return this.Fields[0].TetrominoRows;
            }
        }
    }]);

    return Tetromino;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.Tetromino", Tetromino);
var Row = function () {
    function Row(caseName, fields) {
        _classCallCheck(this, Row);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(Row, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.Row",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    FullRow: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["b" /* default */], {
                        Key: "number",
                        Value: Block
                    })],
                    PartialRow: [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["b" /* default */], {
                        Key: "number",
                        Value: Block
                    })]
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["g" /* equalsUnions */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["h" /* compareUnions */])(this, other);
        }
    }]);

    return Row;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.Row", Row);
var GameboardInMotion = function () {
    function GameboardInMotion(height, width, blockSize, movingTetromino, rows) {
        _classCallCheck(this, GameboardInMotion);

        this.Height = height;
        this.Width = width;
        this.BlockSize = blockSize;
        this.MovingTetromino = movingTetromino;
        this.Rows = rows;
    }

    _createClass(GameboardInMotion, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.GameboardInMotion",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    Height: "number",
                    Width: "number",
                    BlockSize: "number",
                    MovingTetromino: Tetromino,
                    Rows: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["b" /* default */], {
                        Key: "number",
                        Value: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["b" /* default */], {
                            Key: "number",
                            Value: Block
                        })
                    })
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["d" /* equalsRecords */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["e" /* compareRecords */])(this, other);
        }
    }]);

    return GameboardInMotion;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.GameboardInMotion", GameboardInMotion);
var RestingGameboard = function () {
    function RestingGameboard(height, width, blockSize, placedTetromino, rows) {
        _classCallCheck(this, RestingGameboard);

        this.Height = height;
        this.Width = width;
        this.BlockSize = blockSize;
        this.PlacedTetromino = placedTetromino;
        this.Rows = rows;
    }

    _createClass(RestingGameboard, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.RestingGameboard",
                interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
                properties: {
                    Height: "number",
                    Width: "number",
                    BlockSize: "number",
                    PlacedTetromino: Tetromino,
                    Rows: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["b" /* default */], {
                        Key: "number",
                        Value: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["f" /* makeGeneric */])(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["b" /* default */], {
                            Key: "number",
                            Value: Block
                        })
                    })
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["d" /* equalsRecords */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["e" /* compareRecords */])(this, other);
        }
    }]);

    return RestingGameboard;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.RestingGameboard", RestingGameboard);
var Gameboard = function () {
    function Gameboard(caseName, fields) {
        _classCallCheck(this, Gameboard);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(Gameboard, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.Gameboard",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    GameboardInMotion: [GameboardInMotion],
                    RestingGameboard: [RestingGameboard]
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["g" /* equalsUnions */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["h" /* compareUnions */])(this, other);
        }
    }]);

    return Gameboard;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.Gameboard", Gameboard);
var GameControl = function () {
    function GameControl(caseName, fields) {
        _classCallCheck(this, GameControl);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(GameControl, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.GameControl",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Left: [],
                    Right: [],
                    Up: []
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["g" /* equalsUnions */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["h" /* compareUnions */])(this, other);
        }
    }]);

    return GameControl;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.GameControl", GameControl);
var ValidKeyPress = function () {
    function ValidKeyPress(caseName, fields) {
        _classCallCheck(this, ValidKeyPress);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(ValidKeyPress, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Definitions.ValidKeyPress",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    ValidKeyPress: [GameControl, "number"]
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["g" /* equalsUnions */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["h" /* compareUnions */])(this, other);
        }
    }]);

    return ValidKeyPress;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Definitions.ValidKeyPress", ValidKeyPress);

function _ValidKeyPress_(validKeyPress) {
    return [validKeyPress.Fields[0], validKeyPress.Fields[1]];
}


var ValidKeyPressModule = function (__exports) {
    var toValidKeyPress = __exports.toValidKeyPress = function (keyCode) {
        switch (keyCode) {
            case 37:
                return new ValidKeyPress("ValidKeyPress", [new GameControl("Left", []), 37]);

            case 38:
                return new ValidKeyPress("ValidKeyPress", [new GameControl("Up", []), 38]);

            case 39:
                return new ValidKeyPress("ValidKeyPress", [new GameControl("Right", []), 39]);

            default:
                return null;
        }
    };

    return __exports;
}({});


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

var cof = __webpack_require__(21);
module.exports = function(it, msg){
  if(typeof it != 'number' && cof(it) != 'Number')throw TypeError(msg);
  return +it;
};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = __webpack_require__(9)
  , toIndex  = __webpack_require__(44)
  , toLength = __webpack_require__(8);

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , end   = arguments.length > 2 ? arguments[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

var forOf = __webpack_require__(38);

module.exports = function(iter, ITERATOR){
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(12)
  , toObject  = __webpack_require__(9)
  , IObject   = __webpack_require__(49)
  , toLength  = __webpack_require__(8);

module.exports = function(that, callbackfn, aLen, memo, isRight){
  aFunction(callbackfn);
  var O      = toObject(that)
    , self   = IObject(O)
    , length = toLength(O.length)
    , index  = isRight ? length - 1 : 0
    , i      = isRight ? -1 : 1;
  if(aLen < 2)for(;;){
    if(index in self){
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if(isRight ? index < 0 : length <= index){
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for(;isRight ? index >= 0 : length > index; index += i)if(index in self){
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var aFunction  = __webpack_require__(12)
  , isObject   = __webpack_require__(4)
  , invoke     = __webpack_require__(58)
  , arraySlice = [].slice
  , factories  = {};

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /*, args... */){
  var fn       = aFunction(this)
    , partArgs = arraySlice.call(arguments, 1);
  var bound = function(/* args... */){
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if(isObject(fn.prototype))bound.prototype = fn.prototype;
  return bound;
};

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var dP          = __webpack_require__(6).f
  , create      = __webpack_require__(29)
  , redefineAll = __webpack_require__(42)
  , ctx         = __webpack_require__(25)
  , anInstance  = __webpack_require__(36)
  , defined     = __webpack_require__(22)
  , forOf       = __webpack_require__(38)
  , $iterDefine = __webpack_require__(61)
  , step        = __webpack_require__(78)
  , setSpecies  = __webpack_require__(43)
  , DESCRIPTORS = __webpack_require__(7)
  , fastKey     = __webpack_require__(33).fastKey
  , SIZE        = DESCRIPTORS ? '_s' : 'size';

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        anInstance(this, C, 'forEach');
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)dP(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(37)
  , from    = __webpack_require__(102);
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var redefineAll       = __webpack_require__(42)
  , getWeak           = __webpack_require__(33).getWeak
  , anObject          = __webpack_require__(1)
  , isObject          = __webpack_require__(4)
  , anInstance        = __webpack_require__(36)
  , forOf             = __webpack_require__(38)
  , createArrayMethod = __webpack_require__(24)
  , $has              = __webpack_require__(10)
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function(that){
  return that._l || (that._l = new UncaughtFrozenStore);
};
var UncaughtFrozenStore = function(){
  this.a = [];
};
var findUncaughtFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function(key){
    var entry = findUncaughtFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findUncaughtFrozen(this, key);
  },
  set: function(key, value){
    var entry = findUncaughtFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      anInstance(that, C, NAME, '_i');
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this)['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        var data = getWeak(key);
        if(data === true)return uncaughtFrozenStore(this).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var data = getWeak(anObject(key), true);
    if(data === true)uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(7) && !__webpack_require__(3)(function(){
  return Object.defineProperty(__webpack_require__(71)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(4)
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(1);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(34)
  , toIObject = __webpack_require__(11);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ },
/* 112 */
/***/ function(module, exports) {

// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

var dP        = __webpack_require__(6)
  , gOPD      = __webpack_require__(16)
  , ownKeys   = __webpack_require__(83)
  , toIObject = __webpack_require__(11);

module.exports = function define(target, mixin){
  var keys   = ownKeys(toIObject(mixin))
    , length = keys.length
    , i = 0, key;
  while(length > i)dP.f(target, key = keys[i++], gOPD.f(mixin, key));
  return target;
};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(6)
  , anObject = __webpack_require__(1)
  , getKeys  = __webpack_require__(34);

module.exports = __webpack_require__(7) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(11)
  , gOPN      = __webpack_require__(41).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

var has          = __webpack_require__(10)
  , toIObject    = __webpack_require__(11)
  , arrayIndexOf = __webpack_require__(54)(false)
  , IE_PROTO     = __webpack_require__(87)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(34)
  , toIObject = __webpack_require__(11)
  , isEnum    = __webpack_require__(50).f;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

var $parseFloat = __webpack_require__(2).parseFloat
  , $trim       = __webpack_require__(48).trim;

module.exports = 1 / $parseFloat(__webpack_require__(92) + '-0') !== -Infinity ? function parseFloat(str){
  var string = $trim(String(str), 3)
    , result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

var $parseInt = __webpack_require__(2).parseInt
  , $trim     = __webpack_require__(48).trim
  , ws        = __webpack_require__(92)
  , hex       = /^[\-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix){
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);

/***/ },
/* 121 */
/***/ function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-string-pad-start-end
var toLength = __webpack_require__(8)
  , repeat   = __webpack_require__(91)
  , defined  = __webpack_require__(22);

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength || fillStr == '')return S;
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(37)
  , ITERATOR  = __webpack_require__(5)('iterator')
  , Iterators = __webpack_require__(39);
module.exports = __webpack_require__(14).isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var strong = __webpack_require__(105);

// 23.1 Map Objects
module.exports = __webpack_require__(55)('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if(__webpack_require__(7) && /./g.flags != 'g')__webpack_require__(6).f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__(57)
});

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var strong = __webpack_require__(105);

// 23.2 Set Objects
module.exports = __webpack_require__(55)('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var each         = __webpack_require__(24)(0)
  , redefine     = __webpack_require__(18)
  , meta         = __webpack_require__(33)
  , assign       = __webpack_require__(82)
  , weak         = __webpack_require__(107)
  , isObject     = __webpack_require__(4)
  , getWeak      = meta.getWeak
  , isExtensible = Object.isExtensible
  , uncaughtFrozenStore = weak.ufstore
  , tmp          = {}
  , InternalMap;

var wrapper = function(get){
  return function WeakMap(){
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      var data = getWeak(key);
      if(data === true)return uncaughtFrozenStore(this).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = __webpack_require__(55)('WeakMap', wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  InternalMap = weak.getConstructor(wrapper);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on internal weakmap shim
      if(isObject(a) && !isExtensible(a)){
        if(!this._f)this._f = new InternalMap;
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fable_core_Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_fable_core_Map__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_fable_core_List__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_fable_core_GenericComparer__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Tetris_UserGameController__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Tetris_Presenter__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_fable_core_Observable__ = __webpack_require__(98);
/* unused harmony export HorizontalTransitionDirection *//* unused harmony export transitionDistance *//* unused harmony export nextXPosition *//* unused harmony export TransitionReferee *//* unused harmony export Tetromino *//* unused harmony export Gameboard *//* unused harmony export Rotations *//* unused harmony export transitionGameBoard *//* harmony export */ exports["a"] = runApp;var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }













__webpack_require__(53);

var HorizontalTransitionDirection = function () {
    function HorizontalTransitionDirection(caseName, fields) {
        _classCallCheck(this, HorizontalTransitionDirection);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(HorizontalTransitionDirection, [{
        key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
        value: function () {
            return {
                type: "Tetris.Engine.HorizontalTransitionDirection",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Left: [],
                    NoHorizontalTransition: [],
                    Right: []
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["g" /* equalsUnions */])(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["h" /* compareUnions */])(this, other);
        }
    }]);

    return HorizontalTransitionDirection;
}();
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Engine.HorizontalTransitionDirection", HorizontalTransitionDirection);
var transitionDistance = 5;
function nextXPosition(horizontalDirection, block) {
    if (horizontalDirection.Case === "Right") {
        return block.BottomX + transitionDistance;
    } else if (horizontalDirection.Case === "NoHorizontalTransition") {
        return block.BottomX;
    } else {
        return block.BottomX - transitionDistance;
    }
}
var TransitionReferee = function (__exports) {
    var RefereeDecision = __exports.RefereeDecision = function () {
        function RefereeDecision(caseName, fields) {
            _classCallCheck(this, RefereeDecision);

            this.Case = caseName;
            this.Fields = fields;
        }

        _createClass(RefereeDecision, [{
            key: __WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["a" /* default */].reflection,
            value: function () {
                return {
                    type: "Tetris.Engine.TransitionReferee.RefereeDecision",
                    interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                    cases: {
                        CheckForCompletedRowsAndReleaseAnotherBlock: [__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["i" /* RestingGameboard */]],
                        MoveAndRestOnBlockBelow: [__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */]],
                        MoveAndRestOnBottom: [__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */]],
                        MoveHorizontallyAndVertically: [__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */]],
                        MoveVerticallyOnly: [__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */]],
                        MoveVerticallyOnlyAndRestOnBlockBelow: [__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */]],
                        MoveVerticallyOnlyAndRestOnBottom: [__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */]]
                    }
                };
            }
        }, {
            key: "Equals",
            value: function (other) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["g" /* equalsUnions */])(this, other);
            }
        }, {
            key: "CompareTo",
            value: function (other) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["h" /* compareUnions */])(this, other);
            }
        }]);

        return RefereeDecision;
    }();

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_fable_core_Symbol__["b" /* setType */])("Tetris.Engine.TransitionReferee.RefereeDecision", RefereeDecision);

    var blocksOverlapHorizontally = __exports.blocksOverlapHorizontally = function (block1XPos, block2XPos, blockSize) {
        if (block1XPos > block2XPos - blockSize) {
            return block1XPos < block2XPos + blockSize;
        } else {
            return false;
        }
    };

    var tetrominoRowOverlapsWithExistingBlocks = __exports.tetrominoRowOverlapsWithExistingBlocks = function (horizontalTransitionDirection, blockSize, tetrominoRow, row) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (tetrominoBlock) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["d" /* exists */])(function (existingX, _arg1) {
                return blocksOverlapHorizontally(existingX, function (block) {
                    return nextXPosition(horizontalTransitionDirection, block);
                }(tetrominoBlock), blockSize);
            }, row);
        }, tetrominoRow.Blocks);
    };

    var otherRowsInRangeContainingBlocksInTheWay = __exports.otherRowsInRangeContainingBlocksInTheWay = function (direction, gameboard) {
        return function (gameboardRows) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (tupledArg) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (tetrominoRow) {
                    return (tupledArg[0] > tetrominoRow.TopY(gameboard.BlockSize) + transitionDistance ? tupledArg[0] < tetrominoRow.BottomY + transitionDistance + tetrominoRow.Height(gameboard.BlockSize) : false) ? tetrominoRowOverlapsWithExistingBlocks(direction, gameboard.BlockSize, tetrominoRow, tupledArg[1]) : false;
                }, gameboard.MovingTetromino.TetrominoRows);
            }, gameboardRows);
        }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function (gameboardRows_1, tetrominoRow_1) {
            return function (_arg1) {
                return _arg1 == null ? gameboardRows_1 : function () {
                    var key = tetrominoRow_1.BottomY;
                    return function (table) {
                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(key, _arg1, table);
                    };
                }()(gameboardRows_1);
            }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["j" /* defaultArg */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(tetrominoRow_1.BottomY, gameboardRows_1), null, function (gameboardRow) {
                return function () {
                    var folder = function folder(row) {
                        return function (b) {
                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(b.BottomX, row);
                        };
                    };

                    return function (list) {
                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var3, $var4) {
                            return folder($var3)($var4);
                        }, gameboardRow, list);
                    };
                }()(tetrominoRow_1.Blocks);
            }));
        }, gameboard.Rows, gameboard.MovingTetromino.TetrominoRows));
    };

    var decideTransition = __exports.decideTransition = function (direction, gameboard) {
        if (gameboard.Case === "RestingGameboard") {
            return new RefereeDecision("CheckForCompletedRowsAndReleaseAnotherBlock", [gameboard.Fields[0]]);
        } else {
            var otherRowsInRangeContainingBlocksInTheWay_1 = function otherRowsInRangeContainingBlocksInTheWay_1(direction_1) {
                return otherRowsInRangeContainingBlocksInTheWay(direction_1, gameboard.Fields[0]);
            };

            var tetrominoShouldMoveToRestOnBlocksBelow = function tetrominoShouldMoveToRestOnBlocksBelow(direction_2) {
                return function (gameboard_1) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (tetrominoRow) {
                        return function (_arg1) {
                            return _arg1 == null ? false : _arg1;
                        }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["j" /* defaultArg */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(tetrominoRow.BottomY + transitionDistance + gameboard_1.BlockSize, gameboard_1.Rows), null, function (row) {
                            return tetrominoRowOverlapsWithExistingBlocks(direction_2, gameboard_1.BlockSize, tetrominoRow, row);
                        }));
                    }, gameboard_1.MovingTetromino.TetrominoRows);
                };
            };

            if (otherRowsInRangeContainingBlocksInTheWay_1(direction)) {
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, gameboard.Fields[0].MovingTetromino.TetrominoRows).BottomY + transitionDistance === gameboard.Fields[0].Height) {
                    return new RefereeDecision("MoveVerticallyOnlyAndRestOnBottom", [gameboard.Fields[0]]);
                } else if (tetrominoShouldMoveToRestOnBlocksBelow(new HorizontalTransitionDirection("NoHorizontalTransition", []))(gameboard.Fields[0])) {
                    return new RefereeDecision("MoveVerticallyOnlyAndRestOnBlockBelow", [gameboard.Fields[0]]);
                } else {
                    return new RefereeDecision("MoveVerticallyOnly", [gameboard.Fields[0]]);
                }
            } else if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, gameboard.Fields[0].MovingTetromino.TetrominoRows).BottomY + transitionDistance === gameboard.Fields[0].Height) {
                return new RefereeDecision("MoveAndRestOnBottom", [gameboard.Fields[0]]);
            } else if (tetrominoShouldMoveToRestOnBlocksBelow(direction)(gameboard.Fields[0])) {
                return new RefereeDecision("MoveAndRestOnBlockBelow", [gameboard.Fields[0]]);
            } else {
                return new RefereeDecision("MoveHorizontallyAndVertically", [gameboard.Fields[0]]);
            }
        }
    };

    return __exports;
}({});
var Tetromino = function (__exports) {
    var updateTetrominoDetail = __exports.updateTetrominoDetail = function (f, tetrominoRows, tetrominoDetail) {
        return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["c" /* map */])(function (row) {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](function (list) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["c" /* map */])(f, list);
            }(row.Blocks));
        }, tetrominoRows));
    };

    var updateBlocks = __exports.updateBlocks = function (f, tetromino) {
        if (tetromino.Case === "StraightRight") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightRight", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        } else if (tetromino.Case === "StraightDown") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightDown", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        } else if (tetromino.Case === "StraightLeft") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightLeft", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        } else if (tetromino.Case === "TShapeUp") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeUp", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        } else if (tetromino.Case === "TShapeRight") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeRight", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        } else if (tetromino.Case === "TShapeDown") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeDown", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        } else if (tetromino.Case === "TShapeLeft") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeLeft", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        } else {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightUp", [updateTetrominoDetail(f, tetromino.TetrominoRows, tetromino.Fields[0])]);
        }
    };

    var nextTetromino = __exports.nextTetromino = function (tetromino) {
        var $var5 = tetromino.Case === "StraightDown" ? [0] : tetromino.Case === "StraightRight" ? [0] : tetromino.Case === "StraightLeft" ? [0] : tetromino.Case === "TShapeUp" ? [1] : tetromino.Case === "TShapeRight" ? [1] : tetromino.Case === "TShapeLeft" ? [1] : tetromino.Case === "TShapeDown" ? [1] : [0];

        switch ($var5[0]) {
            case 0:
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeUp", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](25, -5, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](50, -5, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](75, -5, "blue")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](50, -30, "blue")]))]))]);

            case 1:
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightUp", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](0, -5, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](25, -5, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](50, -5, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](75, -5, "green")]))]))]);
        }
    };

    return __exports;
}({});
var Gameboard = function (__exports) {
    var moveBlockHorizontally = function moveBlockHorizontally(block, columnTo, gameboard) {
        return function (updatedRowsOpt) {
            return updatedRowsOpt == null ? gameboard : new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */](gameboard.Height, gameboard.Width, gameboard.BlockSize, gameboard.MovingTetromino, updatedRowsOpt);
        }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["j" /* defaultArg */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["j" /* defaultArg */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(block.BottomY, gameboard.Rows), null, function (row_1) {
            return function (table_1) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(columnTo, block, table_1);
            }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(block.BottomX, row_1));
        }), null, function (row) {
            return function (table) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(block.BottomY, row, table);
            }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(block.BottomY, gameboard.Rows));
        }));
    };

    var moveTetrominoHorizontally = __exports.moveTetrominoHorizontally = function (direction, tetromino, gameboard) {
        if (direction.Case === "Left") {
            return function (gameboard_1) {
                var MovingTetromino = Tetromino.updateBlocks(function (b) {
                    return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b.BottomX - transitionDistance, b.BottomY, b.Color);
                }, gameboard_1.MovingTetromino);
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */](gameboard_1.Height, gameboard_1.Width, gameboard_1.BlockSize, MovingTetromino, gameboard_1.Rows);
            }(function () {
                var folder_1 = function folder_1(gameboard_2) {
                    return function (tetrominoRow) {
                        return function () {
                            var folder = function folder(gb) {
                                return function (b_1) {
                                    return moveBlockHorizontally(b_1, b_1.BottomX - transitionDistance, gb);
                                };
                            };

                            return function (list) {
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var6, $var7) {
                                    return folder($var6)($var7);
                                }, gameboard_2, list);
                            };
                        }()(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["g" /* toList */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["l" /* sortWith */])(function (x, y) {
                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["c" /* compare */])(function (b_2) {
                                return b_2.BottomX;
                            }(x), function (b_2) {
                                return b_2.BottomX;
                            }(y));
                        }, tetrominoRow.Blocks)));
                    };
                };

                return function (list_1) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var8, $var9) {
                        return folder_1($var8)($var9);
                    }, gameboard, list_1);
                };
            }()(tetromino.TetrominoRows));
        } else if (direction.Case === "NoHorizontalTransition") {
            return gameboard;
        } else {
            return function (gameboard_3) {
                var MovingTetromino_1 = Tetromino.updateBlocks(function (b_3) {
                    return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b_3.BottomX + transitionDistance, b_3.BottomY, b_3.Color);
                }, gameboard_3.MovingTetromino);
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */](gameboard_3.Height, gameboard_3.Width, gameboard_3.BlockSize, MovingTetromino_1, gameboard_3.Rows);
            }(function () {
                var folder_3 = function folder_3(gameboard_4) {
                    return function (tetrominoRow_1) {
                        return function () {
                            var folder_2 = function folder_2(gb_1) {
                                return function (b_4) {
                                    return moveBlockHorizontally(b_4, b_4.BottomX + transitionDistance, gb_1);
                                };
                            };

                            return function (list_2) {
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var10, $var11) {
                                    return folder_2($var10)($var11);
                                }, gameboard_4, list_2);
                            };
                        }()(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["g" /* toList */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["l" /* sortWith */])(function (x, y) {
                            return -__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["c" /* compare */])(function (b_5) {
                                return b_5.BottomX;
                            }(x), function (b_5) {
                                return b_5.BottomX;
                            }(y));
                        }, tetrominoRow_1.Blocks)));
                    };
                };

                return function (list_3) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var12, $var13) {
                        return folder_3($var12)($var13);
                    }, gameboard, list_3);
                };
            }()(tetromino.TetrominoRows));
        }
    };

    var moveBlockFromRowToRow = function moveBlockFromRowToRow(rowFromY, rowToY, block, rows) {
        var matchValue = [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(rowFromY, rows), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(rowToY, rows)];

        if (matchValue[0] == null) {
            if (matchValue[1] == null) {
                return function () {
                    var value = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["c" /* create */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([[block.BottomX, block]]), new __WEBPACK_IMPORTED_MODULE_6_fable_core_GenericComparer__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["c" /* compare */]));
                    return function (table) {
                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(rowToY, value, table);
                    };
                }()(rows);
            } else {
                return rows;
            }
        } else if (matchValue[1] == null) {
            return function () {
                var value_1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["c" /* create */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([[block.BottomX, block]]), new __WEBPACK_IMPORTED_MODULE_6_fable_core_GenericComparer__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["c" /* compare */]));
                return function (table_1) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(rowToY, value_1, table_1);
                };
            }()(function () {
                var value_2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(block.BottomX, matchValue[0]);
                return function (table_2) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(rowFromY, value_2, table_2);
                };
            }()(rows));
        } else {
            return function () {
                var value_3 = function (table_3) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(block.BottomX, block, table_3);
                }(matchValue[1]);

                return function (table_4) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(rowToY, value_3, table_4);
                };
            }()(function () {
                var value_4 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(block.BottomX, matchValue[0]);
                return function (table_5) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(rowFromY, value_4, table_5);
                };
            }()(rows));
        }
    };

    var moveTetrominoVertically = __exports.moveTetrominoVertically = function (gameboard) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function (gameboardRows, tetrominoRow) {
            return function () {
                var folder = function folder(rows) {
                    return function (b) {
                        return moveBlockFromRowToRow(b.BottomY, b.BottomY + transitionDistance, function () {
                            var BottomY = b.BottomY + transitionDistance;
                            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b.BottomX, BottomY, b.Color);
                        }(), rows);
                    };
                };

                return function (list) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var14, $var15) {
                        return folder($var14)($var15);
                    }, gameboardRows, list);
                };
            }()(tetrominoRow.Blocks);
        }, gameboard.Rows, gameboard.MovingTetromino.TetrominoRows);
    };

    var transition = __exports.transition = function (horizontalDirection, gameboard) {
        var matchValue = TransitionReferee.decideTransition(horizontalDirection, gameboard);

        if (matchValue.Case === "MoveVerticallyOnly") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("GameboardInMotion", [function () {
                var MovingTetromino = Tetromino.updateBlocks(function (b) {
                    var BottomY = b.BottomY + transitionDistance;
                    return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b.BottomX, BottomY, b.Color);
                }, matchValue.Fields[0].MovingTetromino);
                var Rows = moveTetrominoVertically(matchValue.Fields[0]);
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */](matchValue.Fields[0].Height, matchValue.Fields[0].Width, matchValue.Fields[0].BlockSize, MovingTetromino, Rows);
            }()]);
        } else if (matchValue.Case === "MoveVerticallyOnlyAndRestOnBlockBelow") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("RestingGameboard", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["i" /* RestingGameboard */](matchValue.Fields[0].Height, matchValue.Fields[0].Width, matchValue.Fields[0].BlockSize, Tetromino.updateBlocks(function (b_1) {
                var BottomY_1 = b_1.BottomY + transitionDistance;
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b_1.BottomX, BottomY_1, b_1.Color);
            }, matchValue.Fields[0].MovingTetromino), moveTetrominoVertically(matchValue.Fields[0]))]);
        } else if (matchValue.Case === "MoveVerticallyOnlyAndRestOnBottom") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("RestingGameboard", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["i" /* RestingGameboard */](matchValue.Fields[0].Height, matchValue.Fields[0].Width, matchValue.Fields[0].BlockSize, Tetromino.updateBlocks(function (b_2) {
                var BottomY_2 = b_2.BottomY + transitionDistance;
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b_2.BottomX, BottomY_2, b_2.Color);
            }, matchValue.Fields[0].MovingTetromino), moveTetrominoVertically(matchValue.Fields[0]))]);
        } else if (matchValue.Case === "MoveAndRestOnBlockBelow") {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("RestingGameboard", [function (gameboard_1) {
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["i" /* RestingGameboard */](gameboard_1.Height, gameboard_1.Width, gameboard_1.BlockSize, Tetromino.updateBlocks(function (b_3) {
                    var BottomY_3 = b_3.BottomY + transitionDistance;
                    return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b_3.BottomX, BottomY_3, b_3.Color);
                }, gameboard_1.MovingTetromino), moveTetrominoVertically(gameboard_1));
            }(function (gameboard_2) {
                return moveTetrominoHorizontally(horizontalDirection, matchValue.Fields[0].MovingTetromino, gameboard_2);
            }(matchValue.Fields[0]))]);
        } else if (matchValue.Case === "MoveAndRestOnBottom") {
            return function (gameboard_3) {
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("RestingGameboard", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["i" /* RestingGameboard */](gameboard_3.Height, gameboard_3.Width, gameboard_3.BlockSize, Tetromino.updateBlocks(function (b_4) {
                    var BottomY_4 = b_4.BottomY + transitionDistance;
                    return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b_4.BottomX, BottomY_4, b_4.Color);
                }, gameboard_3.MovingTetromino), moveTetrominoVertically(gameboard_3))]);
            }(function (gameboard_4) {
                return moveTetrominoHorizontally(horizontalDirection, matchValue.Fields[0].MovingTetromino, gameboard_4);
            }(matchValue.Fields[0]));
        } else if (matchValue.Case === "CheckForCompletedRowsAndReleaseAnotherBlock") {
            var rowsWithCompletedOnesClearedAndOthersShifted = function rowsWithCompletedOnesClearedAndOthersShifted(gameboard_5) {
                var rowIsCompleted = function rowIsCompleted(row) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["m" /* count */])(row) * gameboard_5.BlockSize === gameboard_5.Width;
                };

                return function (tupledArg) {
                    return function (rows) {
                        return tupledArg[1] > 0 ? function () {
                            var folder = function folder(rows_1) {
                                return function (key) {
                                    var bottomYOfLowestClearedRow = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["h" /* reduce */])(function (x, y) {
                                        return Math.min(x, y);
                                    }, tupledArg[0]);

                                    if (key < bottomYOfLowestClearedRow) {
                                        var row_1 = function (opt) {
                                            return opt == null ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["c" /* create */])(null, new __WEBPACK_IMPORTED_MODULE_6_fable_core_GenericComparer__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["c" /* compare */])) : opt;
                                        }(function (table) {
                                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(key, table);
                                        }(rows_1));

                                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(key + tupledArg[1], __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["h" /* map */])(function (blockX, block) {
                                            var BottomY_5 = block.BottomY + tupledArg[1];
                                            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](block.BottomX, BottomY_5, block.Color);
                                        }, row_1), function (table_1) {
                                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(key, table_1);
                                        }(rows_1));
                                    } else {
                                        return rows_1;
                                    }
                                };
                            };

                            return function (source) {
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var16, $var17) {
                                    return folder($var16)($var17);
                                }, rows, source);
                            };
                        }()(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["l" /* sortWith */])(function (x, y) {
                            return -__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_Util__["c" /* compare */])(x, y);
                        }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["b" /* map */])(function (tuple) {
                            return tuple[0];
                        }, rows))) : rows;
                    }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function (rows_2, rowToClear) {
                        return function (table_2) {
                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(rowToClear, table_2);
                        }(rows_2);
                    }, gameboard_5.Rows, tupledArg[0]));
                }(function (rowsToClear) {
                    var distanceBeingCleared = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["m" /* count */])(rowsToClear) * gameboard_5.BlockSize;
                    return [rowsToClear, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["m" /* count */])(rowsToClear) * gameboard_5.BlockSize];
                }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["n" /* choose */])(function (tupledArg_1) {
                    return rowIsCompleted(tupledArg_1[1]) ? tupledArg_1[0] : null;
                }, gameboard_5.Rows)));
            };

            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("GameboardInMotion", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */](matchValue.Fields[0].Height, matchValue.Fields[0].Width, matchValue.Fields[0].BlockSize, Tetromino.nextTetromino(matchValue.Fields[0].PlacedTetromino), rowsWithCompletedOnesClearedAndOthersShifted(matchValue.Fields[0]))]);
        } else {
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("GameboardInMotion", [function (gameboard_6) {
                var MovingTetromino_1 = Tetromino.updateBlocks(function (b_5) {
                    var BottomY_6 = b_5.BottomY + transitionDistance;
                    return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](b_5.BottomX, BottomY_6, b_5.Color);
                }, gameboard_6.MovingTetromino);
                var Rows_1 = moveTetrominoVertically(gameboard_6);
                return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */](gameboard_6.Height, gameboard_6.Width, gameboard_6.BlockSize, MovingTetromino_1, Rows_1);
            }(function (gameboard_7) {
                return moveTetrominoHorizontally(horizontalDirection, matchValue.Fields[0].MovingTetromino, gameboard_7);
            }(matchValue.Fields[0]))]);
        }
    };

    return __exports;
}({});
var Rotations = function (__exports) {
    var rotateTetromino = __exports.rotateTetromino = function (gameboard, tetromino) {
        if (tetromino.Case === "StraightRight") {
            var rotatedLeftMostX = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).Blocks).BottomX - gameboard.BlockSize * 2;
            var rotatedBottomY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(1, tetromino.Fields[0].TetrominoRows).BottomY;
            var updatedTetrominoX = rotatedLeftMostX < 0 ? 0 : rotatedLeftMostX + gameboard.BlockSize * 4 > gameboard.Width ? gameboard.Width - gameboard.BlockSize * 4 : rotatedLeftMostX;
            var updatedTetrominoY = rotatedBottomY > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightDown", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX, updatedTetrominoY, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX + gameboard.BlockSize, updatedTetrominoY, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX + 2 * gameboard.BlockSize, updatedTetrominoY, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX + 3 * gameboard.BlockSize, updatedTetrominoY, "green")]))]))]);
        } else if (tetromino.Case === "StraightDown") {
            var rotatedLeftMostX_1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(1, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).Blocks).BottomX;
            var rotatedBottomY_1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).BottomY + gameboard.BlockSize;
            var updatedTetrominoX_1 = rotatedLeftMostX_1 < 0 ? 0 : rotatedLeftMostX_1 + gameboard.BlockSize > gameboard.Width ? gameboard.Width - gameboard.BlockSize : rotatedLeftMostX_1;
            var updatedTetrominoY_1 = rotatedBottomY_1 > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY_1;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightLeft", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_1, updatedTetrominoY_1, "green")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_1, updatedTetrominoY_1 - gameboard.BlockSize, "green")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_1, updatedTetrominoY_1 - 2 * gameboard.BlockSize, "green")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_1, updatedTetrominoY_1 - 3 * gameboard.BlockSize, "green")]))]))]);
        } else if (tetromino.Case === "StraightLeft") {
            var rotatedLeftMostX_2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).Blocks).BottomX - gameboard.BlockSize;
            var rotatedBottomY_2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(1, tetromino.Fields[0].TetrominoRows).BottomY;
            var updatedTetrominoX_2 = rotatedLeftMostX_2 < 0 ? 0 : rotatedLeftMostX_2 + gameboard.BlockSize * 4 > gameboard.Width ? gameboard.Width - gameboard.BlockSize * 4 : rotatedLeftMostX_2;
            var updatedTetrominoY_2 = rotatedBottomY_2 > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY_2;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightUp", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_2, updatedTetrominoY_2, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_2 + gameboard.BlockSize, updatedTetrominoY_2, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_2 + 2 * gameboard.BlockSize, updatedTetrominoY_2, "green"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_2 + 3 * gameboard.BlockSize, updatedTetrominoY_2, "green")]))]))]);
        } else if (tetromino.Case === "TShapeUp") {
            var rotatedLeftMostX_3 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).Blocks).BottomX + gameboard.BlockSize;
            var rotatedBottomY_3 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).BottomY;
            var updatedTetrominoX_3 = rotatedLeftMostX_3 < 0 ? 0 : rotatedLeftMostX_3 + gameboard.BlockSize * 2 > gameboard.Width ? gameboard.Width - gameboard.BlockSize * 2 : rotatedLeftMostX_3;
            var updatedTetrominoY_3 = rotatedBottomY_3 > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY_3;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeRight", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_3, updatedTetrominoY_3, "blue")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_3, updatedTetrominoY_3 - gameboard.BlockSize, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_3 + gameboard.BlockSize, updatedTetrominoY_3 - gameboard.BlockSize, "blue")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_3, updatedTetrominoY_3 - gameboard.BlockSize * 2, "blue")]))]))]);
        } else if (tetromino.Case === "TShapeRight") {
            var rotatedLeftMostX_4 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(1, tetromino.Fields[0].TetrominoRows).Blocks).BottomX - gameboard.BlockSize;
            var rotatedBottomY_4 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).BottomY;
            var updatedTetrominoX_4 = rotatedLeftMostX_4 < 0 ? 0 : rotatedLeftMostX_4 + gameboard.BlockSize * 3 > gameboard.Width ? gameboard.Width - gameboard.BlockSize * 3 : rotatedLeftMostX_4;
            var updatedTetrominoY_4 = rotatedBottomY_4 > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY_4;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeDown", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_4 + gameboard.BlockSize, updatedTetrominoY_4, "blue")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_4, updatedTetrominoY_4 - gameboard.BlockSize, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_4 + gameboard.BlockSize, updatedTetrominoY_4 - gameboard.BlockSize, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_4 + gameboard.BlockSize * 2, updatedTetrominoY_4 - gameboard.BlockSize, "blue")]))]))]);
        } else if (tetromino.Case === "TShapeDown") {
            var rotatedLeftMostX_5 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(1, tetromino.Fields[0].TetrominoRows).Blocks).BottomX;
            var rotatedBottomY_5 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).BottomY;
            var updatedTetrominoX_5 = rotatedLeftMostX_5 < 0 ? 0 : rotatedLeftMostX_5 + gameboard.BlockSize * 2 > gameboard.Width ? gameboard.Width - gameboard.BlockSize * 2 : rotatedLeftMostX_5;
            var updatedTetrominoY_5 = rotatedBottomY_5 > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY_5;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeLeft", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_5 + gameboard.BlockSize, updatedTetrominoY_5, "blue")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_5, updatedTetrominoY_5 - gameboard.BlockSize, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_5 + gameboard.BlockSize, updatedTetrominoY_5 - gameboard.BlockSize, "blue")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_5 + gameboard.BlockSize, updatedTetrominoY_5 - gameboard.BlockSize * 2, "blue")]))]))]);
        } else if (tetromino.Case === "TShapeLeft") {
            var rotatedLeftMostX_6 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(1, tetromino.Fields[0].TetrominoRows).Blocks).BottomX;
            var rotatedBottomY_6 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).BottomY;
            var updatedTetrominoX_6 = rotatedLeftMostX_6 < 0 ? 0 : rotatedLeftMostX_6 + gameboard.BlockSize * 2 > gameboard.Width ? gameboard.Width - gameboard.BlockSize * 2 : rotatedLeftMostX_6;
            var updatedTetrominoY_6 = rotatedBottomY_6 > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY_6;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("TShapeUp", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_6, updatedTetrominoY_6, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_6 + gameboard.BlockSize, updatedTetrominoY_6, "blue"), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_6 + gameboard.BlockSize * 2, updatedTetrominoY_6, "blue")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_6 + gameboard.BlockSize, updatedTetrominoY_6 - gameboard.BlockSize, "blue")]))]))]);
        } else {
            var rotatedLeftMostX_7 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(2, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).Blocks).BottomX;
            var rotatedBottomY_7 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["k" /* item */])(0, tetromino.Fields[0].TetrominoRows).BottomY + gameboard.BlockSize;
            var updatedTetrominoX_7 = rotatedLeftMostX_7 < 0 ? 0 : rotatedLeftMostX_7 + gameboard.BlockSize > gameboard.Width ? gameboard.Width - gameboard.BlockSize : rotatedLeftMostX_7;
            var updatedTetrominoY_7 = rotatedBottomY_7 > gameboard.Height ? gameboard.Height - gameboard.BlockSize : rotatedBottomY_7;
            return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["e" /* Tetromino */]("StraightRight", [new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_7, updatedTetrominoY_7, "green")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_7, updatedTetrominoY_7 - gameboard.BlockSize, "green")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_7, updatedTetrominoY_7 - 2 * gameboard.BlockSize, "green")])), new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["h" /* Block */](updatedTetrominoX_7, updatedTetrominoY_7 - 3 * gameboard.BlockSize, "green")]))]))]);
        }
    };

    var rowsWithTetrominoRemoved = __exports.rowsWithTetrominoRemoved = function (tetromino, gameboardRows) {
        return function () {
            var folder_1 = function folder_1(gameboardRows_1) {
                return function (tetrominoRow) {
                    return function (_arg1) {
                        if (_arg1 == null) {
                            return gameboardRows_1;
                        } else {
                            var updatedGameboardRow = function () {
                                var folder = function folder(gameboardRow) {
                                    return function (tetrominoBlock) {
                                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(tetrominoBlock.BottomX, gameboardRow);
                                    };
                                };

                                return function (list) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var18, $var19) {
                                        return folder($var18)($var19);
                                    }, _arg1, list);
                                };
                            }()(tetrominoRow.Blocks);

                            return function () {
                                var key = tetrominoRow.BottomY;
                                return function (table) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(key, updatedGameboardRow, table);
                                };
                            }()(gameboardRows_1);
                        }
                    }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(tetrominoRow.BottomY, gameboardRows_1));
                };
            };

            return function (list_1) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var20, $var21) {
                    return folder_1($var20)($var21);
                }, gameboardRows, list_1);
            };
        }()(tetromino.TetrominoRows);
    };

    var rotate = __exports.rotate = function (gameboard) {
        var rotatedTetromino = rotateTetromino(gameboard, gameboard.MovingTetromino);

        var rowsWithTetrominoRemoved_1 = function () {
            var folder_1 = function folder_1(gameboardRows) {
                return function (tetrominoRow) {
                    return function (_arg1) {
                        if (_arg1 == null) {
                            return gameboardRows;
                        } else {
                            var updatedGameboardRow = function () {
                                var folder = function folder(gameboardRow) {
                                    return function (tetrominoBlock) {
                                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(tetrominoBlock.BottomX, gameboardRow);
                                    };
                                };

                                return function (list) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var22, $var23) {
                                        return folder($var22)($var23);
                                    }, _arg1, list);
                                };
                            }()(tetrominoRow.Blocks);

                            return function () {
                                var key = tetrominoRow.BottomY;
                                return function (table) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(key, updatedGameboardRow, table);
                                };
                            }()(gameboardRows);
                        }
                    }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(tetrominoRow.BottomY, gameboardRows));
                };
            };

            return function (list_1) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var24, $var25) {
                    return folder_1($var24)($var25);
                }, gameboard.Rows, list_1);
            };
        }()(gameboard.MovingTetromino.TetrominoRows);

        var rowsWithTetrominoRotated = function () {
            var folder_3 = function folder_3(gameboardRows_1) {
                return function (tetrominoRow_1) {
                    return function (_arg2) {
                        if (_arg2 == null) {
                            return gameboardRows_1;
                        } else {
                            var updatedGameboardRow_1 = function () {
                                var folder_2 = function folder_2(gameboardRow_1) {
                                    return function (tetrominoBlock_1) {
                                        return function (table_1) {
                                            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(tetrominoBlock_1.BottomX, tetrominoBlock_1, table_1);
                                        }(gameboardRow_1);
                                    };
                                };

                                return function (list_2) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var26, $var27) {
                                        return folder_2($var26)($var27);
                                    }, _arg2, list_2);
                                };
                            }()(tetrominoRow_1.Blocks);

                            return function () {
                                var key_1 = tetrominoRow_1.BottomY;
                                return function (table_2) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(key_1, updatedGameboardRow_1, table_2);
                                };
                            }()(gameboardRows_1);
                        }
                    }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(tetrominoRow_1.BottomY, gameboardRows_1));
                };
            };

            return function (list_3) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var28, $var29) {
                    return folder_3($var28)($var29);
                }, rowsWithTetrominoRemoved_1, list_3);
            };
        }()(rotatedTetromino.TetrominoRows);

        return new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["d" /* GameboardInMotion */](gameboard.Height, gameboard.Width, gameboard.BlockSize, rotatedTetromino, rowsWithTetrominoRotated);
    };

    var allowRotation = __exports.allowRotation = function (direction, gameboard) {
        var rotatedTetromino = rotateTetromino(gameboard, gameboard.MovingTetromino);

        var rowsWithInitialTetrominoRemoved = function () {
            var folder_1 = function folder_1(gameboardRows) {
                return function (tetrominoRow) {
                    return function (_arg1) {
                        if (_arg1 == null) {
                            return gameboardRows;
                        } else {
                            var updatedGameboardRow = function () {
                                var folder = function folder(gameboardRow) {
                                    return function (tetrominoBlock) {
                                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["g" /* remove */])(tetrominoBlock.BottomX, gameboardRow);
                                    };
                                };

                                return function (list) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var30, $var31) {
                                        return folder($var30)($var31);
                                    }, _arg1, list);
                                };
                            }()(tetrominoRow.Blocks);

                            return function () {
                                var key = tetrominoRow.BottomY;
                                return function (table) {
                                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["e" /* add */])(key, updatedGameboardRow, table);
                                };
                            }()(gameboardRows);
                        }
                    }(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_fable_core_Map__["f" /* tryFind */])(tetrominoRow.BottomY, gameboardRows));
                };
            };

            return function (list_1) {
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["c" /* fold */])(function ($var32, $var33) {
                    return folder_1($var32)($var33);
                }, gameboard.Rows, list_1);
            };
        }()(gameboard.MovingTetromino.TetrominoRows);

        var gameboardBlocksWithInitialTetrominoRemoved = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["e" /* collect */])(function (tupledArg) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["c" /* map */])(function (tuple) {
                return tuple[1];
            }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["g" /* toList */])(tupledArg[1]));
        }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["g" /* toList */])(rowsWithInitialTetrominoRemoved));
        var tetrominoBlocks = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_List__["e" /* collect */])(function (row) {
            return row.Blocks;
        }, rotatedTetromino.TetrominoRows);
        return !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (tb) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (gbb) {
                return ((gbb.BottomY < tb.BottomY + transitionDistance + gameboard.BlockSize ? gbb.BottomY > tb.BottomY + transitionDistance - 2 * gameboard.BlockSize : false) ? gbb.BottomX < tb.BottomX + 2 * gameboard.BlockSize : false) ? gbb.BottomX > tb.BottomX - gameboard.BlockSize : false;
            }, gameboardBlocksWithInitialTetrominoRemoved);
        }, tetrominoBlocks);
    };

    return __exports;
}({});
function transitionGameBoard(gameboard) {
    var horizontalDirection = function horizontalDirection(tetromino) {
        return function (blockSize) {
            return function (gameboardWidth) {
                var matchValue = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__Tetris_UserGameController__["a" /* getKeyPressed */])();
                var $var34 = void 0;

                if (matchValue != null) {
                    var activePatternResult461 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["b" /* $7C$ValidKeyPress$7C$ */])(matchValue);

                    if (activePatternResult461[0].Case === "Left") {
                        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (r_1) {
                            return r_1.LeftMostX === 0;
                        }, tetromino.TetrominoRows)) {
                            $var34 = [0];
                        } else {
                            $var34 = [1];
                        }
                    } else {
                        $var34 = [1];
                    }
                } else {
                    $var34 = [1];
                }

                switch ($var34[0]) {
                    case 0:
                        return new HorizontalTransitionDirection("NoHorizontalTransition", []);

                    case 1:
                        var $var35 = void 0;

                        if (matchValue != null) {
                            var activePatternResult460 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["b" /* $7C$ValidKeyPress$7C$ */])(matchValue);

                            if (activePatternResult460[0].Case === "Left") {
                                $var35 = [0];
                            } else if (activePatternResult460[0].Case === "Right") {
                                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_fable_core_Seq__["j" /* exists */])(function (r) {
                                    return r.RightMostX(blockSize) === gameboardWidth;
                                }, tetromino.TetrominoRows)) {
                                    $var35 = [1];
                                } else {
                                    $var35 = [2];
                                }
                            } else {
                                $var35 = [2];
                            }
                        } else {
                            $var35 = [2];
                        }

                        switch ($var35[0]) {
                            case 0:
                                return new HorizontalTransitionDirection("Left", []);

                            case 1:
                                return new HorizontalTransitionDirection("NoHorizontalTransition", []);

                            case 2:
                                var $var36 = void 0;

                                if (matchValue != null) {
                                    var activePatternResult459 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["b" /* $7C$ValidKeyPress$7C$ */])(matchValue);

                                    if (activePatternResult459[0].Case === "Right") {
                                        $var36 = [0];
                                    } else {
                                        $var36 = [1];
                                    }
                                } else {
                                    $var36 = [1];
                                }

                                switch ($var36[0]) {
                                    case 0:
                                        return new HorizontalTransitionDirection("Right", []);

                                    case 1:
                                        return new HorizontalTransitionDirection("NoHorizontalTransition", []);
                                }

                        }

                }
            };
        };
    };

    var gameboardWithRotatedTetromino = void 0;

    if (gameboard.Case === "GameboardInMotion") {
        var matchValue_1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__Tetris_UserGameController__["a" /* getKeyPressed */])();
        var $var37 = void 0;

        if (matchValue_1 != null) {
            var activePatternResult466 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["b" /* $7C$ValidKeyPress$7C$ */])(matchValue_1);

            if (activePatternResult466[0].Case === "Up") {
                $var37 = [0];
            } else {
                $var37 = [1];
            }
        } else {
            $var37 = [1];
        }

        switch ($var37[0]) {
            case 0:
                var rotatedGameboard = Rotations.rotate(gameboard.Fields[0]);

                if (Rotations.allowRotation(horizontalDirection(gameboard.Fields[0].MovingTetromino)(gameboard.Fields[0].BlockSize)(gameboard.Fields[0].Width), gameboard.Fields[0])) {
                    gameboardWithRotatedTetromino = new __WEBPACK_IMPORTED_MODULE_2__Tetris_Definitions__["c" /* Gameboard */]("GameboardInMotion", [rotatedGameboard]);
                } else {
                    gameboardWithRotatedTetromino = gameboard;
                }

                break;

            case 1:
                gameboardWithRotatedTetromino = gameboard;
                break;
        }
    } else {
        gameboardWithRotatedTetromino = gameboard;
    }

    var patternInput = gameboardWithRotatedTetromino.Case === "RestingGameboard" ? [gameboardWithRotatedTetromino.Fields[0].Width, gameboardWithRotatedTetromino.Fields[0].BlockSize] : [gameboardWithRotatedTetromino.Fields[0].Width, gameboardWithRotatedTetromino.Fields[0].BlockSize];
    var tetromino_1 = gameboardWithRotatedTetromino.Case === "RestingGameboard" ? gameboardWithRotatedTetromino.Fields[0].PlacedTetromino : gameboardWithRotatedTetromino.Fields[0].MovingTetromino;
    return Gameboard.transition(horizontalDirection(tetromino_1)(patternInput[1])(patternInput[0]), gameboardWithRotatedTetromino);
}
function runApp() {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__Tetris_Presenter__["a" /* startFrameClock */])();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9_fable_core_Observable__["c" /* add */])(function (gameBoard) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__Tetris_Presenter__["b" /* render */])(transitionGameBoard(gameBoard));
    }, __WEBPACK_IMPORTED_MODULE_8__Tetris_Presenter__["c" /* frameChangeEvent */].Publish);
}


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4)
  , isArray  = __webpack_require__(77)
  , SPECIES  = __webpack_require__(5)('species');

module.exports = function(original){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return C === undefined ? Array : C;
};

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(130);

module.exports = function(original, length){
  return new (speciesConstructor(original))(length);
};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var anObject    = __webpack_require__(1)
  , toPrimitive = __webpack_require__(27)
  , NUMBER      = 'number';

module.exports = function(hint){
  if(hint !== 'string' && hint !== NUMBER && hint !== 'default')throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(34)
  , gOPS    = __webpack_require__(64)
  , pIE     = __webpack_require__(50);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

var global  = __webpack_require__(2)
  , core    = __webpack_require__(14)
  , $export = __webpack_require__(0)
  , partial = __webpack_require__(84);
// https://esdiscuss.org/topic/promise-returning-delay-function
$export($export.G + $export.F, {
  delay: function delay(time){
    return new (core.Promise || global.Promise)(function(resolve){
      setTimeout(partial.call(resolve, true), time);
    });
  }
});

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var ctx            = __webpack_require__(25)
  , $export        = __webpack_require__(0)
  , createDesc     = __webpack_require__(30)
  , assign         = __webpack_require__(82)
  , create         = __webpack_require__(29)
  , getPrototypeOf = __webpack_require__(17)
  , getKeys        = __webpack_require__(34)
  , dP             = __webpack_require__(6)
  , keyOf          = __webpack_require__(111)
  , aFunction      = __webpack_require__(12)
  , forOf          = __webpack_require__(38)
  , isIterable     = __webpack_require__(124)
  , $iterCreate    = __webpack_require__(60)
  , step           = __webpack_require__(78)
  , isObject       = __webpack_require__(4)
  , toIObject      = __webpack_require__(11)
  , DESCRIPTORS    = __webpack_require__(7)
  , has            = __webpack_require__(10);

// 0 -> Dict.forEach
// 1 -> Dict.map
// 2 -> Dict.filter
// 3 -> Dict.some
// 4 -> Dict.every
// 5 -> Dict.find
// 6 -> Dict.findKey
// 7 -> Dict.mapPairs
var createDictMethod = function(TYPE){
  var IS_MAP   = TYPE == 1
    , IS_EVERY = TYPE == 4;
  return function(object, callbackfn, that /* = undefined */){
    var f      = ctx(callbackfn, that, 3)
      , O      = toIObject(object)
      , result = IS_MAP || TYPE == 7 || TYPE == 2
          ? new (typeof this == 'function' ? this : Dict) : undefined
      , key, val, res;
    for(key in O)if(has(O, key)){
      val = O[key];
      res = f(val, key, object);
      if(TYPE){
        if(IS_MAP)result[key] = res;            // map
        else if(res)switch(TYPE){
          case 2: result[key] = val; break;     // filter
          case 3: return true;                  // some
          case 5: return val;                   // find
          case 6: return key;                   // findKey
          case 7: result[res[0]] = res[1];      // mapPairs
        } else if(IS_EVERY)return false;        // every
      }
    }
    return TYPE == 3 || IS_EVERY ? IS_EVERY : result;
  };
};
var findKey = createDictMethod(6);

var createDictIter = function(kind){
  return function(it){
    return new DictIterator(it, kind);
  };
};
var DictIterator = function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._a = getKeys(iterated);   // keys
  this._i = 0;                   // next index
  this._k = kind;                // kind
};
$iterCreate(DictIterator, 'Dict', function(){
  var that = this
    , O    = that._t
    , keys = that._a
    , kind = that._k
    , key;
  do {
    if(that._i >= keys.length){
      that._t = undefined;
      return step(1);
    }
  } while(!has(O, key = keys[that._i++]));
  if(kind == 'keys'  )return step(0, key);
  if(kind == 'values')return step(0, O[key]);
  return step(0, [key, O[key]]);
});

function Dict(iterable){
  var dict = create(null);
  if(iterable != undefined){
    if(isIterable(iterable)){
      forOf(iterable, true, function(key, value){
        dict[key] = value;
      });
    } else assign(dict, iterable);
  }
  return dict;
}
Dict.prototype = null;

function reduce(object, mapfn, init){
  aFunction(mapfn);
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , i      = 0
    , memo, key;
  if(arguments.length < 3){
    if(!length)throw TypeError('Reduce of empty object with no initial value');
    memo = O[keys[i++]];
  } else memo = Object(init);
  while(length > i)if(has(O, key = keys[i++])){
    memo = mapfn(memo, O[key], key, object);
  }
  return memo;
}

function includes(object, el){
  return (el == el ? keyOf(object, el) : findKey(object, function(it){
    return it != it;
  })) !== undefined;
}

function get(object, key){
  if(has(object, key))return object[key];
}
function set(object, key, value){
  if(DESCRIPTORS && key in Object)dP.f(object, key, createDesc(0, value));
  else object[key] = value;
  return object;
}

function isDict(it){
  return isObject(it) && getPrototypeOf(it) === Dict.prototype;
}

$export($export.G + $export.F, {Dict: Dict});

$export($export.S, 'Dict', {
  keys:     createDictIter('keys'),
  values:   createDictIter('values'),
  entries:  createDictIter('entries'),
  forEach:  createDictMethod(0),
  map:      createDictMethod(1),
  filter:   createDictMethod(2),
  some:     createDictMethod(3),
  every:    createDictMethod(4),
  find:     createDictMethod(5),
  findKey:  findKey,
  mapPairs: createDictMethod(7),
  reduce:   reduce,
  keyOf:    keyOf,
  includes: includes,
  has:      has,
  get:      get,
  set:      set,
  isDict:   isDict
});

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

var path    = __webpack_require__(120)
  , $export = __webpack_require__(0);

// Placeholder
__webpack_require__(14)._ = path._ = path._ || {};

$export($export.P + $export.F, 'Function', {part: __webpack_require__(84)});

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(1)
  , get      = __webpack_require__(51);
module.exports = __webpack_require__(14).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
__webpack_require__(61)(Number, 'Number', function(iterated){
  this._l = +iterated;
  this._i = 0;
}, function(){
  var i    = this._i++
    , done = !(i < this._l);
  return {done: done, value: done ? undefined : i};
});

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', {classof: __webpack_require__(37)});

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , define  = __webpack_require__(113);

$export($export.S + $export.F, 'Object', {define: define});

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', {isObject: __webpack_require__(4)});

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , define  = __webpack_require__(113)
  , create  = __webpack_require__(29);

$export($export.S + $export.F, 'Object', {
  make: function(proto, mixin){
    return define(create(proto), mixin);
  }
});

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/benjamingr/RexExp.escape
var $export = __webpack_require__(0)
  , $re     = __webpack_require__(85)(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0);
var $re = __webpack_require__(85)(/[&<>"']/g, {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
});

$export($export.P + $export.F, 'String', {escapeHTML: function escapeHTML(){ return $re(this); }});

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0);
var $re = __webpack_require__(85)(/&(?:amp|lt|gt|quot|apos);/g, {
  '&amp;':  '&',
  '&lt;':   '<',
  '&gt;':   '>',
  '&quot;': '"',
  '&apos;': "'"
});

$export($export.P + $export.F, 'String', {unescapeHTML:  function unescapeHTML(){ return $re(this); }});

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {copyWithin: __webpack_require__(101)});

__webpack_require__(46)('copyWithin');

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0)
  , $every  = __webpack_require__(24)(4);

$export($export.P + $export.F * !__webpack_require__(23)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */){
    return $every(this, callbackfn, arguments[1]);
  }
});

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', {fill: __webpack_require__(69)});

__webpack_require__(46)('fill');

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0)
  , $filter = __webpack_require__(24)(2);

$export($export.P + $export.F * !__webpack_require__(23)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */){
    return $filter(this, callbackfn, arguments[1]);
  }
});

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0)
  , $find   = __webpack_require__(24)(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(46)(KEY);

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0)
  , $find   = __webpack_require__(24)(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(46)(KEY);

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export  = __webpack_require__(0)
  , $forEach = __webpack_require__(24)(0)
  , STRICT   = __webpack_require__(23)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */){
    return $forEach(this, callbackfn, arguments[1]);
  }
});

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var ctx            = __webpack_require__(25)
  , $export        = __webpack_require__(0)
  , toObject       = __webpack_require__(9)
  , call           = __webpack_require__(110)
  , isArrayIter    = __webpack_require__(76)
  , toLength       = __webpack_require__(8)
  , createProperty = __webpack_require__(70)
  , getIterFn      = __webpack_require__(51);

$export($export.S + $export.F * !__webpack_require__(62)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export       = __webpack_require__(0)
  , $indexOf      = __webpack_require__(54)(false)
  , $native       = [].indexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(23)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /*, fromIndex = 0 */){
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', {isArray: __webpack_require__(77)});

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export   = __webpack_require__(0)
  , toIObject = __webpack_require__(11)
  , arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(49) != Object || !__webpack_require__(23)(arrayJoin)), 'Array', {
  join: function join(separator){
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export       = __webpack_require__(0)
  , toIObject     = __webpack_require__(11)
  , toInteger     = __webpack_require__(35)
  , toLength      = __webpack_require__(8)
  , $native       = [].lastIndexOf
  , NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(23)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /*, fromIndex = @[*-1] */){
    // convert -0 to +0
    if(NEGATIVE_ZERO)return $native.apply(this, arguments) || 0;
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(arguments[1]));
    if(index < 0)index = length + index;
    for(;index >= 0; index--)if(index in O)if(O[index] === searchElement)return index || 0;
    return -1;
  }
});

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0)
  , $map    = __webpack_require__(24)(1);

$export($export.P + $export.F * !__webpack_require__(23)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */){
    return $map(this, callbackfn, arguments[1]);
  }
});

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export        = __webpack_require__(0)
  , createProperty = __webpack_require__(70);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(3)(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , aLen   = arguments.length
      , result = new (typeof this == 'function' ? this : Array)(aLen);
    while(aLen > index)createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0)
  , $reduce = __webpack_require__(103);

$export($export.P + $export.F * !__webpack_require__(23)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0)
  , $reduce = __webpack_require__(103);

$export($export.P + $export.F * !__webpack_require__(23)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */){
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export    = __webpack_require__(0)
  , html       = __webpack_require__(74)
  , cof        = __webpack_require__(21)
  , toIndex    = __webpack_require__(44)
  , toLength   = __webpack_require__(8)
  , arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(3)(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0)
  , $some   = __webpack_require__(24)(3);

$export($export.P + $export.F * !__webpack_require__(23)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */){
    return $some(this, callbackfn, arguments[1]);
  }
});

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export   = __webpack_require__(0)
  , aFunction = __webpack_require__(12)
  , toObject  = __webpack_require__(9)
  , fails     = __webpack_require__(3)
  , $sort     = [].sort
  , test      = [1, 2, 3];

$export($export.P + $export.F * (fails(function(){
  // IE8-
  test.sort(undefined);
}) || !fails(function(){
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(23)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn){
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(43)('Array');

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = __webpack_require__(0);

$export($export.S, 'Date', {now: function(){ return new Date().getTime(); }});

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = __webpack_require__(0)
  , fails   = __webpack_require__(3)
  , getTime = Date.prototype.getTime;

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(getTime.call(this)))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export     = __webpack_require__(0)
  , toObject    = __webpack_require__(9)
  , toPrimitive = __webpack_require__(27);

$export($export.P + $export.F * __webpack_require__(3)(function(){
  return new Date(NaN).toJSON() !== null || Date.prototype.toJSON.call({toISOString: function(){ return 1; }}) !== 1;
}), 'Date', {
  toJSON: function toJSON(key){
    var O  = toObject(this)
      , pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

var TO_PRIMITIVE = __webpack_require__(5)('toPrimitive')
  , proto        = Date.prototype;

if(!(TO_PRIMITIVE in proto))__webpack_require__(15)(proto, TO_PRIMITIVE, __webpack_require__(132));

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

var DateProto    = Date.prototype
  , INVALID_DATE = 'Invalid Date'
  , TO_STRING    = 'toString'
  , $toString    = DateProto[TO_STRING]
  , getTime      = DateProto.getTime;
if(new Date(NaN) + '' != INVALID_DATE){
  __webpack_require__(18)(DateProto, TO_STRING, function toString(){
    var value = getTime.call(this);
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = __webpack_require__(0);

$export($export.P, 'Function', {bind: __webpack_require__(104)});

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var isObject       = __webpack_require__(4)
  , getPrototypeOf = __webpack_require__(17)
  , HAS_INSTANCE   = __webpack_require__(5)('hasInstance')
  , FunctionProto  = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))__webpack_require__(6).f(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = getPrototypeOf(O))if(this.prototype === O)return true;
  return false;
}});

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(6).f
  , createDesc = __webpack_require__(30)
  , has        = __webpack_require__(10)
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';

var isExtensible = Object.isExtensible || function(){
  return true;
};

// 19.2.4.2 name
NAME in FProto || __webpack_require__(7) && dP(FProto, NAME, {
  configurable: true,
  get: function(){
    try {
      var that = this
        , name = ('' + that).match(nameRE)[1];
      has(that, NAME) || !isExtensible(that) || dP(that, NAME, createDesc(5, name));
      return name;
    } catch(e){
      return '';
    }
  }
});

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.3 Math.acosh(x)
var $export = __webpack_require__(0)
  , log1p   = __webpack_require__(112)
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN 
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.5 Math.asinh(x)
var $export = __webpack_require__(0)
  , $asinh  = Math.asinh;

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0 
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', {asinh: asinh});

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.7 Math.atanh(x)
var $export = __webpack_require__(0)
  , $atanh  = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0 
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.9 Math.cbrt(x)
var $export = __webpack_require__(0)
  , sign    = __webpack_require__(80);

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.11 Math.clz32(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.12 Math.cosh(x)
var $export = __webpack_require__(0)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.14 Math.expm1(x)
var $export = __webpack_require__(0)
  , $expm1  = __webpack_require__(79);

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', {expm1: $expm1});

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.16 Math.fround(x)
var $export   = __webpack_require__(0)
  , sign      = __webpack_require__(80)
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = __webpack_require__(0)
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , i    = 0
      , aLen = arguments.length
      , larg = 0
      , arg, div;
    while(i < aLen){
      arg = abs(arguments[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.18 Math.imul(x, y)
var $export = __webpack_require__(0)
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * __webpack_require__(3)(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.21 Math.log10(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.20 Math.log1p(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {log1p: __webpack_require__(112)});

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.22 Math.log2(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.28 Math.sign(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {sign: __webpack_require__(80)});

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.30 Math.sinh(x)
var $export = __webpack_require__(0)
  , expm1   = __webpack_require__(79)
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * __webpack_require__(3)(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.33 Math.tanh(x)
var $export = __webpack_require__(0)
  , expm1   = __webpack_require__(79)
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

// 20.2.2.34 Math.trunc(x)
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var global            = __webpack_require__(2)
  , has               = __webpack_require__(10)
  , cof               = __webpack_require__(21)
  , inheritIfRequired = __webpack_require__(75)
  , toPrimitive       = __webpack_require__(27)
  , fails             = __webpack_require__(3)
  , gOPN              = __webpack_require__(41).f
  , gOPD              = __webpack_require__(16).f
  , dP                = __webpack_require__(6).f
  , $trim             = __webpack_require__(48).trim
  , NUMBER            = 'Number'
  , $Number           = global[NUMBER]
  , Base              = $Number
  , proto             = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF        = cof(__webpack_require__(29)(proto)) == NUMBER
  , TRIM              = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for(var keys = __webpack_require__(7) ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++){
    if(has(Base, key = keys[j]) && !has($Number, key)){
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__(18)(global, NUMBER, $Number);
}

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.1 Number.EPSILON
var $export = __webpack_require__(0);

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.2 Number.isFinite(number)
var $export   = __webpack_require__(0)
  , _isFinite = __webpack_require__(2).isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {isInteger: __webpack_require__(109)});

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(0);

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.5 Number.isSafeInteger(number)
var $export   = __webpack_require__(0)
  , isInteger = __webpack_require__(109)
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(0);

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(0)
  , $parseFloat = __webpack_require__(118);
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', {parseFloat: $parseFloat});

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , $parseInt = __webpack_require__(119);
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', {parseInt: $parseInt});

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export      = __webpack_require__(0)
  , toInteger    = __webpack_require__(35)
  , aNumberValue = __webpack_require__(100)
  , repeat       = __webpack_require__(91)
  , $toFixed     = 1..toFixed
  , floor        = Math.floor
  , data         = [0, 0, 0, 0, 0, 0]
  , ERROR        = 'Number.toFixed: incorrect invocation!'
  , ZERO         = '0';

var multiply = function(n, c){
  var i  = -1
    , c2 = c;
  while(++i < 6){
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function(n){
  var i = 6
    , c = 0;
  while(--i >= 0){
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function(){
  var i = 6
    , s = '';
  while(--i >= 0){
    if(s !== '' || i === 0 || data[i] !== 0){
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function(x, n, acc){
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function(x){
  var n  = 0
    , x2 = x;
  while(x2 >= 4096){
    n += 12;
    x2 /= 4096;
  }
  while(x2 >= 2){
    n  += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128..toFixed(0) !== '1000000000000000128'
) || !__webpack_require__(3)(function(){
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits){
    var x = aNumberValue(this, ERROR)
      , f = toInteger(fractionDigits)
      , s = ''
      , m = ZERO
      , e, z, j, k;
    if(f < 0 || f > 20)throw RangeError(ERROR);
    if(x != x)return 'NaN';
    if(x <= -1e21 || x >= 1e21)return String(x);
    if(x < 0){
      s = '-';
      x = -x;
    }
    if(x > 1e-21){
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if(e > 0){
        multiply(0, z);
        j = f;
        while(j >= 7){
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while(j >= 23){
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if(f > 0){
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export      = __webpack_require__(0)
  , $fails       = __webpack_require__(3)
  , aNumberValue = __webpack_require__(100)
  , $toPrecision = 1..toPrecision;

$export($export.P + $export.F * ($fails(function(){
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function(){
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision){
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision); 
  }
});

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(0);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(82)});

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(29)});

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', {defineProperties: __webpack_require__(114)});

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(7), 'Object', {defineProperty: __webpack_require__(6).f});

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(33).onFreeze;

__webpack_require__(26)('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = __webpack_require__(11)
  , $getOwnPropertyDescriptor = __webpack_require__(16).f;

__webpack_require__(26)('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(26)('getOwnPropertyNames', function(){
  return __webpack_require__(115).f;
});

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(9)
  , $getPrototypeOf = __webpack_require__(17);

__webpack_require__(26)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.11 Object.isExtensible(O)
var isObject = __webpack_require__(4);

__webpack_require__(26)('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.12 Object.isFrozen(O)
var isObject = __webpack_require__(4);

__webpack_require__(26)('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.13 Object.isSealed(O)
var isObject = __webpack_require__(4);

__webpack_require__(26)('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.3.10 Object.is(value1, value2)
var $export = __webpack_require__(0);
$export($export.S, 'Object', {is: __webpack_require__(121)});

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(9)
  , $keys    = __webpack_require__(34);

__webpack_require__(26)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.15 Object.preventExtensions(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(33).onFreeze;

__webpack_require__(26)('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.2.17 Object.seal(O)
var isObject = __webpack_require__(4)
  , meta     = __webpack_require__(33).onFreeze;

__webpack_require__(26)('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(0);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(86).set});

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(37)
  , test    = {};
test[__webpack_require__(5)('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  __webpack_require__(18)(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

var $export     = __webpack_require__(0)
  , $parseFloat = __webpack_require__(118);
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), {parseFloat: $parseFloat});

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , $parseInt = __webpack_require__(119);
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), {parseInt: $parseInt});

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var LIBRARY            = __webpack_require__(40)
  , global             = __webpack_require__(2)
  , ctx                = __webpack_require__(25)
  , classof            = __webpack_require__(37)
  , $export            = __webpack_require__(0)
  , isObject           = __webpack_require__(4)
  , aFunction          = __webpack_require__(12)
  , anInstance         = __webpack_require__(36)
  , forOf              = __webpack_require__(38)
  , speciesConstructor = __webpack_require__(88)
  , task               = __webpack_require__(93).set
  , microtask          = __webpack_require__(81)()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(42)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
__webpack_require__(47)($Promise, PROMISE);
__webpack_require__(43)(PROMISE);
Wrapper = __webpack_require__(14)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(62)(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export   = __webpack_require__(0)
  , aFunction = __webpack_require__(12)
  , anObject  = __webpack_require__(1)
  , rApply    = (__webpack_require__(2).Reflect || {}).apply
  , fApply    = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !__webpack_require__(3)(function(){
  rApply(function(){});
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    var T = aFunction(target)
      , L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export    = __webpack_require__(0)
  , create     = __webpack_require__(29)
  , aFunction  = __webpack_require__(12)
  , anObject   = __webpack_require__(1)
  , isObject   = __webpack_require__(4)
  , fails      = __webpack_require__(3)
  , bind       = __webpack_require__(104)
  , rConstruct = (__webpack_require__(2).Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function(){
  function F(){}
  return !(rConstruct(function(){}, [], F) instanceof F);
});
var ARGS_BUG = !fails(function(){
  rConstruct(function(){});
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(ARGS_BUG && !NEW_TARGET_BUG)return rConstruct(Target, args, newTarget);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      switch(args.length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP          = __webpack_require__(6)
  , $export     = __webpack_require__(0)
  , anObject    = __webpack_require__(1)
  , toPrimitive = __webpack_require__(27);

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * __webpack_require__(3)(function(){
  Reflect.defineProperty(dP.f({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = __webpack_require__(0)
  , gOPD     = __webpack_require__(16).f
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = __webpack_require__(0)
  , anObject = __webpack_require__(1);
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
__webpack_require__(60)(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD     = __webpack_require__(16)
  , $export  = __webpack_require__(0)
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return gOPD.f(anObject(target), propertyKey);
  }
});

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = __webpack_require__(0)
  , getProto = __webpack_require__(17)
  , anObject = __webpack_require__(1);

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(10)
  , $export        = __webpack_require__(0)
  , isObject       = __webpack_require__(4)
  , anObject       = __webpack_require__(1);

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = gOPD.f(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = getPrototypeOf(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.9 Reflect.has(target, propertyKey)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.10 Reflect.isExtensible(target)
var $export       = __webpack_require__(0)
  , anObject      = __webpack_require__(1)
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.11 Reflect.ownKeys(target)
var $export = __webpack_require__(0);

$export($export.S, 'Reflect', {ownKeys: __webpack_require__(83)});

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.12 Reflect.preventExtensions(target)
var $export            = __webpack_require__(0)
  , anObject           = __webpack_require__(1)
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = __webpack_require__(0)
  , setProto = __webpack_require__(86);

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP             = __webpack_require__(6)
  , gOPD           = __webpack_require__(16)
  , getPrototypeOf = __webpack_require__(17)
  , has            = __webpack_require__(10)
  , $export        = __webpack_require__(0)
  , createDesc     = __webpack_require__(30)
  , anObject       = __webpack_require__(1)
  , isObject       = __webpack_require__(4);

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = gOPD.f(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getPrototypeOf(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = gOPD.f(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    dP.f(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

var global            = __webpack_require__(2)
  , inheritIfRequired = __webpack_require__(75)
  , dP                = __webpack_require__(6).f
  , gOPN              = __webpack_require__(41).f
  , isRegExp          = __webpack_require__(59)
  , $flags            = __webpack_require__(57)
  , $RegExp           = global.RegExp
  , Base              = $RegExp
  , proto             = $RegExp.prototype
  , re1               = /a/g
  , re2               = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW       = new $RegExp(re1) !== re1;

if(__webpack_require__(7) && (!CORRECT_NEW || __webpack_require__(3)(function(){
  re2[__webpack_require__(5)('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var tiRE = this instanceof $RegExp
      , piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function(key){
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  };
  for(var keys = gOPN(Base), i = 0; keys.length > i; )proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(18)(global, 'RegExp', $RegExp);
}

__webpack_require__(43)('RegExp');

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

// @@match logic
__webpack_require__(56)('match', 1, function(defined, MATCH, $match){
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__(56)('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

// @@search logic
__webpack_require__(56)('search', 1, function(defined, SEARCH, $search){
  // 21.1.3.15 String.prototype.search(regexp)
  return [function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  }, $search];
});

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__(56)('split', 2, function(defined, SPLIT, $split){
  'use strict';
  var isRegExp   = __webpack_require__(59)
    , _split     = $split
    , $push      = [].push
    , $SPLIT     = 'split'
    , LENGTH     = 'length'
    , LAST_INDEX = 'lastIndex';
  if(
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ){
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function(separator, limit){
      var string = String(this);
      if(separator === undefined && limit === 0)return [];
      // If `separator` is not a regex, use native split
      if(!isRegExp(separator))return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if(!NPCG)separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while(match = separatorCopy.exec(string)){
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if(lastIndex > lastLastIndex){
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          if(!NPCG && match[LENGTH] > 1)match[0].replace(separator2, function(){
            for(i = 1; i < arguments[LENGTH] - 2; i++)if(arguments[i] === undefined)match[i] = undefined;
          });
          if(match[LENGTH] > 1 && match.index < string[LENGTH])$push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if(output[LENGTH] >= splitLimit)break;
        }
        if(separatorCopy[LAST_INDEX] === match.index)separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if(lastLastIndex === string[LENGTH]){
        if(lastLength || !separatorCopy.test(''))output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if('0'[$SPLIT](undefined, 0)[LENGTH]){
    $split = function(separator, limit){
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit){
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
__webpack_require__(126);
var anObject    = __webpack_require__(1)
  , $flags      = __webpack_require__(57)
  , DESCRIPTORS = __webpack_require__(7)
  , TO_STRING   = 'toString'
  , $toString   = /./[TO_STRING];

var define = function(fn){
  __webpack_require__(18)(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if(__webpack_require__(3)(function(){ return $toString.call({source: 'a', flags: 'b'}) != '/a/b'; })){
  define(function toString(){
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if($toString.name != TO_STRING){
  define(function toString(){
    return $toString.call(this);
  });
}

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.2 String.prototype.anchor(name)
__webpack_require__(19)('anchor', function(createHTML){
  return function anchor(name){
    return createHTML(this, 'a', 'name', name);
  }
});

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.3 String.prototype.big()
__webpack_require__(19)('big', function(createHTML){
  return function big(){
    return createHTML(this, 'big', '', '');
  }
});

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.4 String.prototype.blink()
__webpack_require__(19)('blink', function(createHTML){
  return function blink(){
    return createHTML(this, 'blink', '', '');
  }
});

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.5 String.prototype.bold()
__webpack_require__(19)('bold', function(createHTML){
  return function bold(){
    return createHTML(this, 'b', '', '');
  }
});

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export = __webpack_require__(0)
  , $at     = __webpack_require__(89)(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = __webpack_require__(0)
  , toLength  = __webpack_require__(8)
  , context   = __webpack_require__(90)
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * __webpack_require__(73)(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , endPosition = arguments.length > 1 ? arguments[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.6 String.prototype.fixed()
__webpack_require__(19)('fixed', function(createHTML){
  return function fixed(){
    return createHTML(this, 'tt', '', '');
  }
});

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
__webpack_require__(19)('fontcolor', function(createHTML){
  return function fontcolor(color){
    return createHTML(this, 'font', 'color', color);
  }
});

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
__webpack_require__(19)('fontsize', function(createHTML){
  return function fontsize(size){
    return createHTML(this, 'font', 'size', size);
  }
});

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

var $export        = __webpack_require__(0)
  , toIndex        = __webpack_require__(44)
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res  = []
      , aLen = arguments.length
      , i    = 0
      , code;
    while(aLen > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = __webpack_require__(0)
  , context  = __webpack_require__(90)
  , INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__(73)(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.9 String.prototype.italics()
__webpack_require__(19)('italics', function(createHTML){
  return function italics(){
    return createHTML(this, 'i', '', '');
  }
});

/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $at  = __webpack_require__(89)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(61)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.10 String.prototype.link(url)
__webpack_require__(19)('link', function(createHTML){
  return function link(url){
    return createHTML(this, 'a', 'href', url);
  }
});

/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

var $export   = __webpack_require__(0)
  , toIObject = __webpack_require__(11)
  , toLength  = __webpack_require__(8);

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl  = toIObject(callSite.raw)
      , len  = toLength(tpl.length)
      , aLen = arguments.length
      , res  = []
      , i    = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < aLen)res.push(String(arguments[i]));
    } return res.join('');
  }
});

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: __webpack_require__(91)
});

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.11 String.prototype.small()
__webpack_require__(19)('small', function(createHTML){
  return function small(){
    return createHTML(this, 'small', '', '');
  }
});

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = __webpack_require__(0)
  , toLength    = __webpack_require__(8)
  , context     = __webpack_require__(90)
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__(73)(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , index  = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.12 String.prototype.strike()
__webpack_require__(19)('strike', function(createHTML){
  return function strike(){
    return createHTML(this, 'strike', '', '');
  }
});

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.13 String.prototype.sub()
__webpack_require__(19)('sub', function(createHTML){
  return function sub(){
    return createHTML(this, 'sub', '', '');
  }
});

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// B.2.3.14 String.prototype.sup()
__webpack_require__(19)('sup', function(createHTML){
  return function sup(){
    return createHTML(this, 'sup', '', '');
  }
});

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// 21.1.3.25 String.prototype.trim()
__webpack_require__(48)('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// ECMAScript 6 symbols shim
var global         = __webpack_require__(2)
  , has            = __webpack_require__(10)
  , DESCRIPTORS    = __webpack_require__(7)
  , $export        = __webpack_require__(0)
  , redefine       = __webpack_require__(18)
  , META           = __webpack_require__(33).KEY
  , $fails         = __webpack_require__(3)
  , shared         = __webpack_require__(65)
  , setToStringTag = __webpack_require__(47)
  , uid            = __webpack_require__(45)
  , wks            = __webpack_require__(5)
  , wksExt         = __webpack_require__(123)
  , wksDefine      = __webpack_require__(95)
  , keyOf          = __webpack_require__(111)
  , enumKeys       = __webpack_require__(133)
  , isArray        = __webpack_require__(77)
  , anObject       = __webpack_require__(1)
  , toIObject      = __webpack_require__(11)
  , toPrimitive    = __webpack_require__(27)
  , createDesc     = __webpack_require__(30)
  , _create        = __webpack_require__(29)
  , gOPNExt        = __webpack_require__(115)
  , $GOPD          = __webpack_require__(16)
  , $DP            = __webpack_require__(6)
  , $keys          = __webpack_require__(34)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(41).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(50).f  = $propertyIsEnumerable;
  __webpack_require__(64).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(40)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export      = __webpack_require__(0)
  , $typed       = __webpack_require__(66)
  , buffer       = __webpack_require__(94)
  , anObject     = __webpack_require__(1)
  , toIndex      = __webpack_require__(44)
  , toLength     = __webpack_require__(8)
  , isObject     = __webpack_require__(4)
  , ArrayBuffer  = __webpack_require__(2).ArrayBuffer
  , speciesConstructor = __webpack_require__(88)
  , $ArrayBuffer = buffer.ArrayBuffer
  , $DataView    = buffer.DataView
  , $isView      = $typed.ABV && ArrayBuffer.isView
  , $slice       = $ArrayBuffer.prototype.slice
  , VIEW         = $typed.VIEW
  , ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), {ArrayBuffer: $ArrayBuffer});

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it){
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * __webpack_require__(3)(function(){
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end){
    if($slice !== undefined && end === undefined)return $slice.call(anObject(this), start); // FF fix
    var len    = anObject(this).byteLength
      , first  = toIndex(start, len)
      , final  = toIndex(end === undefined ? len : end, len)
      , result = new (speciesConstructor(this, $ArrayBuffer))(toLength(final - first))
      , viewS  = new $DataView(this)
      , viewT  = new $DataView(result)
      , index  = 0;
    while(first < final){
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

__webpack_require__(43)(ARRAY_BUFFER);

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0);
$export($export.G + $export.W + $export.F * !__webpack_require__(66).ABV, {
  DataView: __webpack_require__(94).DataView
});

/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Float32', 4, function(init){
  return function Float32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Float64', 8, function(init){
  return function Float64Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Int16', 2, function(init){
  return function Int16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Int32', 4, function(init){
  return function Int32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Int8', 1, function(init){
  return function Int8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint16', 2, function(init){
  return function Uint16Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint32', 4, function(init){
  return function Uint32Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint8', 1, function(init){
  return function Uint8Array(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
});

/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(31)('Uint8', 1, function(init){
  return function Uint8ClampedArray(data, byteOffset, length){
    return init(this, data, byteOffset, length);
  };
}, true);

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var weak = __webpack_require__(107);

// 23.4 WeakSet Objects
__webpack_require__(55)('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export   = __webpack_require__(0)
  , $includes = __webpack_require__(54)(true);

$export($export.P, 'Array', {
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(46)('includes');

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-09/sept-25.md#510-globalasap-for-enqueuing-a-microtask
var $export   = __webpack_require__(0)
  , microtask = __webpack_require__(81)()
  , process   = __webpack_require__(2).process
  , isNode    = __webpack_require__(21)(process) == 'process';

$export($export.G, {
  asap: function asap(fn){
    var domain = isNode && process.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-is-error
var $export = __webpack_require__(0)
  , cof     = __webpack_require__(21);

$export($export.S, 'Error', {
  isError: function isError(it){
    return cof(it) === 'Error';
  }
});

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(0);

$export($export.P + $export.R, 'Map', {toJSON: __webpack_require__(106)('Map')});

/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  iaddh: function iaddh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});

/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  imulh: function imulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >> 16
      , v1 = $v >> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  isubh: function isubh(x0, x1, y0, y1){
    var $x0 = x0 >>> 0
      , $x1 = x1 >>> 0
      , $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});

/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
var $export = __webpack_require__(0);

$export($export.S, 'Math', {
  umulh: function umulh(u, v){
    var UINT16 = 0xffff
      , $u = +u
      , $v = +v
      , u0 = $u & UINT16
      , v0 = $v & UINT16
      , u1 = $u >>> 16
      , v1 = $v >>> 16
      , t  = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});

/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export         = __webpack_require__(0)
  , toObject        = __webpack_require__(9)
  , aFunction       = __webpack_require__(12)
  , $defineProperty = __webpack_require__(6);

// B.2.2.2 Object.prototype.__defineGetter__(P, getter)
__webpack_require__(7) && $export($export.P + __webpack_require__(63), 'Object', {
  __defineGetter__: function __defineGetter__(P, getter){
    $defineProperty.f(toObject(this), P, {get: aFunction(getter), enumerable: true, configurable: true});
  }
});

/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export         = __webpack_require__(0)
  , toObject        = __webpack_require__(9)
  , aFunction       = __webpack_require__(12)
  , $defineProperty = __webpack_require__(6);

// B.2.2.3 Object.prototype.__defineSetter__(P, setter)
__webpack_require__(7) && $export($export.P + __webpack_require__(63), 'Object', {
  __defineSetter__: function __defineSetter__(P, setter){
    $defineProperty.f(toObject(this), P, {set: aFunction(setter), enumerable: true, configurable: true});
  }
});

/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export  = __webpack_require__(0)
  , $entries = __webpack_require__(117)(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export        = __webpack_require__(0)
  , ownKeys        = __webpack_require__(83)
  , toIObject      = __webpack_require__(11)
  , gOPD           = __webpack_require__(16)
  , createProperty = __webpack_require__(70);

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , getDesc = gOPD.f
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key;
    while(keys.length > i)createProperty(result, key = keys[i++], getDesc(O, key));
    return result;
  }
});

/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export                  = __webpack_require__(0)
  , toObject                 = __webpack_require__(9)
  , toPrimitive              = __webpack_require__(27)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.4 Object.prototype.__lookupGetter__(P)
__webpack_require__(7) && $export($export.P + __webpack_require__(63), 'Object', {
  __lookupGetter__: function __lookupGetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.get;
    } while(O = getPrototypeOf(O));
  }
});

/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
var $export                  = __webpack_require__(0)
  , toObject                 = __webpack_require__(9)
  , toPrimitive              = __webpack_require__(27)
  , getPrototypeOf           = __webpack_require__(17)
  , getOwnPropertyDescriptor = __webpack_require__(16).f;

// B.2.2.5 Object.prototype.__lookupSetter__(P)
__webpack_require__(7) && $export($export.P + __webpack_require__(63), 'Object', {
  __lookupSetter__: function __lookupSetter__(P){
    var O = toObject(this)
      , K = toPrimitive(P, true)
      , D;
    do {
      if(D = getOwnPropertyDescriptor(O, K))return D.set;
    } while(O = getPrototypeOf(O));
  }
});

/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__(0)
  , $values = __webpack_require__(117)(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});

/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/zenparsing/es-observable
var $export     = __webpack_require__(0)
  , global      = __webpack_require__(2)
  , core        = __webpack_require__(14)
  , microtask   = __webpack_require__(81)()
  , OBSERVABLE  = __webpack_require__(5)('observable')
  , aFunction   = __webpack_require__(12)
  , anObject    = __webpack_require__(1)
  , anInstance  = __webpack_require__(36)
  , redefineAll = __webpack_require__(42)
  , hide        = __webpack_require__(15)
  , forOf       = __webpack_require__(38)
  , RETURN      = forOf.RETURN;

var getMethod = function(fn){
  return fn == null ? undefined : aFunction(fn);
};

var cleanupSubscription = function(subscription){
  var cleanup = subscription._c;
  if(cleanup){
    subscription._c = undefined;
    cleanup();
  }
};

var subscriptionClosed = function(subscription){
  return subscription._o === undefined;
};

var closeSubscription = function(subscription){
  if(!subscriptionClosed(subscription)){
    subscription._o = undefined;
    cleanupSubscription(subscription);
  }
};

var Subscription = function(observer, subscriber){
  anObject(observer);
  this._c = undefined;
  this._o = observer;
  observer = new SubscriptionObserver(this);
  try {
    var cleanup      = subscriber(observer)
      , subscription = cleanup;
    if(cleanup != null){
      if(typeof cleanup.unsubscribe === 'function')cleanup = function(){ subscription.unsubscribe(); };
      else aFunction(cleanup);
      this._c = cleanup;
    }
  } catch(e){
    observer.error(e);
    return;
  } if(subscriptionClosed(this))cleanupSubscription(this);
};

Subscription.prototype = redefineAll({}, {
  unsubscribe: function unsubscribe(){ closeSubscription(this); }
});

var SubscriptionObserver = function(subscription){
  this._s = subscription;
};

SubscriptionObserver.prototype = redefineAll({}, {
  next: function next(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      try {
        var m = getMethod(observer.next);
        if(m)return m.call(observer, value);
      } catch(e){
        try {
          closeSubscription(subscription);
        } finally {
          throw e;
        }
      }
    }
  },
  error: function error(value){
    var subscription = this._s;
    if(subscriptionClosed(subscription))throw value;
    var observer = subscription._o;
    subscription._o = undefined;
    try {
      var m = getMethod(observer.error);
      if(!m)throw value;
      value = m.call(observer, value);
    } catch(e){
      try {
        cleanupSubscription(subscription);
      } finally {
        throw e;
      }
    } cleanupSubscription(subscription);
    return value;
  },
  complete: function complete(value){
    var subscription = this._s;
    if(!subscriptionClosed(subscription)){
      var observer = subscription._o;
      subscription._o = undefined;
      try {
        var m = getMethod(observer.complete);
        value = m ? m.call(observer, value) : undefined;
      } catch(e){
        try {
          cleanupSubscription(subscription);
        } finally {
          throw e;
        }
      } cleanupSubscription(subscription);
      return value;
    }
  }
});

var $Observable = function Observable(subscriber){
  anInstance(this, $Observable, 'Observable', '_f')._f = aFunction(subscriber);
};

redefineAll($Observable.prototype, {
  subscribe: function subscribe(observer){
    return new Subscription(observer, this._f);
  },
  forEach: function forEach(fn){
    var that = this;
    return new (core.Promise || global.Promise)(function(resolve, reject){
      aFunction(fn);
      var subscription = that.subscribe({
        next : function(value){
          try {
            return fn(value);
          } catch(e){
            reject(e);
            subscription.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
    });
  }
});

redefineAll($Observable, {
  from: function from(x){
    var C = typeof this === 'function' ? this : $Observable;
    var method = getMethod(anObject(x)[OBSERVABLE]);
    if(method){
      var observable = anObject(method.call(x));
      return observable.constructor === C ? observable : new C(function(observer){
        return observable.subscribe(observer);
      });
    }
    return new C(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          try {
            if(forOf(x, false, function(it){
              observer.next(it);
              if(done)return RETURN;
            }) === RETURN)return;
          } catch(e){
            if(done)throw e;
            observer.error(e);
            return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  },
  of: function of(){
    for(var i = 0, l = arguments.length, items = Array(l); i < l;)items[i] = arguments[i++];
    return new (typeof this === 'function' ? this : $Observable)(function(observer){
      var done = false;
      microtask(function(){
        if(!done){
          for(var i = 0; i < items.length; ++i){
            observer.next(items[i]);
            if(done)return;
          } observer.complete();
        }
      });
      return function(){ done = true; };
    });
  }
});

hide($Observable.prototype, OBSERVABLE, function(){ return this; });

$export($export.G, {Observable: $Observable});

__webpack_require__(43)('Observable');

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(28)
  , anObject                  = __webpack_require__(1)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({defineMetadata: function defineMetadata(metadataKey, metadataValue, target, targetKey){
  ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetaKey(targetKey));
}});

/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(28)
  , anObject               = __webpack_require__(1)
  , toMetaKey              = metadata.key
  , getOrCreateMetadataMap = metadata.map
  , store                  = metadata.store;

metadata.exp({deleteMetadata: function deleteMetadata(metadataKey, target /*, targetKey */){
  var targetKey   = arguments.length < 3 ? undefined : toMetaKey(arguments[2])
    , metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
  if(metadataMap === undefined || !metadataMap['delete'](metadataKey))return false;
  if(metadataMap.size)return true;
  var targetMetadata = store.get(target);
  targetMetadata['delete'](targetKey);
  return !!targetMetadata.size || store['delete'](target);
}});

/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

var Set                     = __webpack_require__(127)
  , from                    = __webpack_require__(102)
  , metadata                = __webpack_require__(28)
  , anObject                = __webpack_require__(1)
  , getPrototypeOf          = __webpack_require__(17)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

var ordinaryMetadataKeys = function(O, P){
  var oKeys  = ordinaryOwnMetadataKeys(O, P)
    , parent = getPrototypeOf(O);
  if(parent === null)return oKeys;
  var pKeys  = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? from(new Set(oKeys.concat(pKeys))) : pKeys : oKeys;
};

metadata.exp({getMetadataKeys: function getMetadataKeys(target /*, targetKey */){
  return ordinaryMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(28)
  , anObject               = __webpack_require__(1)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

var ordinaryGetMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

metadata.exp({getMetadata: function getMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

var metadata                = __webpack_require__(28)
  , anObject                = __webpack_require__(1)
  , ordinaryOwnMetadataKeys = metadata.keys
  , toMetaKey               = metadata.key;

metadata.exp({getOwnMetadataKeys: function getOwnMetadataKeys(target /*, targetKey */){
  return ordinaryOwnMetadataKeys(anObject(target), arguments.length < 2 ? undefined : toMetaKey(arguments[1]));
}});

/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(28)
  , anObject               = __webpack_require__(1)
  , ordinaryGetOwnMetadata = metadata.get
  , toMetaKey              = metadata.key;

metadata.exp({getOwnMetadata: function getOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryGetOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(28)
  , anObject               = __webpack_require__(1)
  , getPrototypeOf         = __webpack_require__(17)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

var ordinaryHasMetadata = function(MetadataKey, O, P){
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if(hasOwn)return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

metadata.exp({hasMetadata: function hasMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasMetadata(metadataKey, anObject(target), arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

var metadata               = __webpack_require__(28)
  , anObject               = __webpack_require__(1)
  , ordinaryHasOwnMetadata = metadata.has
  , toMetaKey              = metadata.key;

metadata.exp({hasOwnMetadata: function hasOwnMetadata(metadataKey, target /*, targetKey */){
  return ordinaryHasOwnMetadata(metadataKey, anObject(target)
    , arguments.length < 3 ? undefined : toMetaKey(arguments[2]));
}});

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

var metadata                  = __webpack_require__(28)
  , anObject                  = __webpack_require__(1)
  , aFunction                 = __webpack_require__(12)
  , toMetaKey                 = metadata.key
  , ordinaryDefineOwnMetadata = metadata.set;

metadata.exp({metadata: function metadata(metadataKey, metadataValue){
  return function decorator(target, targetKey){
    ordinaryDefineOwnMetadata(
      metadataKey, metadataValue,
      (targetKey !== undefined ? anObject : aFunction)(target),
      toMetaKey(targetKey)
    );
  };
}});

/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = __webpack_require__(0);

$export($export.P + $export.R, 'Set', {toJSON: __webpack_require__(106)('Set')});

/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = __webpack_require__(0)
  , $at     = __webpack_require__(89)(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});

/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://tc39.github.io/String.prototype.matchAll/
var $export     = __webpack_require__(0)
  , defined     = __webpack_require__(22)
  , toLength    = __webpack_require__(8)
  , isRegExp    = __webpack_require__(59)
  , getFlags    = __webpack_require__(57)
  , RegExpProto = RegExp.prototype;

var $RegExpStringIterator = function(regexp, string){
  this._r = regexp;
  this._s = string;
};

__webpack_require__(60)($RegExpStringIterator, 'RegExp String', function next(){
  var match = this._r.exec(this._s);
  return {value: match, done: match === null};
});

$export($export.P, 'String', {
  matchAll: function matchAll(regexp){
    defined(this);
    if(!isRegExp(regexp))throw TypeError(regexp + ' is not a regexp!');
    var S     = String(this)
      , flags = 'flags' in RegExpProto ? String(regexp.flags) : getFlags.call(regexp)
      , rx    = new RegExp(regexp.source, ~flags.indexOf('g') ? flags : 'g' + flags);
    rx.lastIndex = toLength(regexp.lastIndex);
    return new $RegExpStringIterator(rx, S);
  }
});

/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0)
  , $pad    = __webpack_require__(122);

$export($export.P, 'String', {
  padEnd: function padEnd(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = __webpack_require__(0)
  , $pad    = __webpack_require__(122);

$export($export.P, 'String', {
  padStart: function padStart(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(48)('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
}, 'trimStart');

/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
__webpack_require__(48)('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
}, 'trimEnd');

/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(95)('asyncIterator');

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(95)('observable');

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

// https://github.com/ljharb/proposal-global
var $export = __webpack_require__(0);

$export($export.S, 'System', {global: __webpack_require__(2)});

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

var $iterators    = __webpack_require__(96)
  , redefine      = __webpack_require__(18)
  , global        = __webpack_require__(2)
  , hide          = __webpack_require__(15)
  , Iterators     = __webpack_require__(39)
  , wks           = __webpack_require__(5)
  , ITERATOR      = wks('iterator')
  , TO_STRING_TAG = wks('toStringTag')
  , ArrayValues   = Iterators.Array;

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype
    , key;
  if(proto){
    if(!proto[ITERATOR])hide(proto, ITERATOR, ArrayValues);
    if(!proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    for(key in $iterators)if(!proto[key])redefine(proto, key, $iterators[key], true);
  }
}

/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

var $export = __webpack_require__(0)
  , $task   = __webpack_require__(93);
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

// ie9- setTimeout & setInterval additional parameters fix
var global     = __webpack_require__(2)
  , $export    = __webpack_require__(0)
  , invoke     = __webpack_require__(58)
  , partial    = __webpack_require__(84)
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(265);
__webpack_require__(204);
__webpack_require__(206);
__webpack_require__(205);
__webpack_require__(208);
__webpack_require__(210);
__webpack_require__(215);
__webpack_require__(209);
__webpack_require__(207);
__webpack_require__(217);
__webpack_require__(216);
__webpack_require__(212);
__webpack_require__(213);
__webpack_require__(211);
__webpack_require__(203);
__webpack_require__(214);
__webpack_require__(218);
__webpack_require__(219);
__webpack_require__(171);
__webpack_require__(173);
__webpack_require__(172);
__webpack_require__(221);
__webpack_require__(220);
__webpack_require__(191);
__webpack_require__(201);
__webpack_require__(202);
__webpack_require__(192);
__webpack_require__(193);
__webpack_require__(194);
__webpack_require__(195);
__webpack_require__(196);
__webpack_require__(197);
__webpack_require__(198);
__webpack_require__(199);
__webpack_require__(200);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
__webpack_require__(177);
__webpack_require__(178);
__webpack_require__(179);
__webpack_require__(180);
__webpack_require__(181);
__webpack_require__(182);
__webpack_require__(183);
__webpack_require__(184);
__webpack_require__(185);
__webpack_require__(186);
__webpack_require__(187);
__webpack_require__(188);
__webpack_require__(189);
__webpack_require__(190);
__webpack_require__(252);
__webpack_require__(257);
__webpack_require__(264);
__webpack_require__(255);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(253);
__webpack_require__(258);
__webpack_require__(260);
__webpack_require__(243);
__webpack_require__(244);
__webpack_require__(245);
__webpack_require__(246);
__webpack_require__(249);
__webpack_require__(250);
__webpack_require__(251);
__webpack_require__(254);
__webpack_require__(256);
__webpack_require__(259);
__webpack_require__(261);
__webpack_require__(262);
__webpack_require__(263);
__webpack_require__(166);
__webpack_require__(168);
__webpack_require__(167);
__webpack_require__(170);
__webpack_require__(169);
__webpack_require__(155);
__webpack_require__(153);
__webpack_require__(159);
__webpack_require__(156);
__webpack_require__(162);
__webpack_require__(164);
__webpack_require__(152);
__webpack_require__(158);
__webpack_require__(149);
__webpack_require__(163);
__webpack_require__(147);
__webpack_require__(161);
__webpack_require__(160);
__webpack_require__(154);
__webpack_require__(157);
__webpack_require__(146);
__webpack_require__(148);
__webpack_require__(151);
__webpack_require__(150);
__webpack_require__(165);
__webpack_require__(96);
__webpack_require__(237);
__webpack_require__(242);
__webpack_require__(126);
__webpack_require__(238);
__webpack_require__(239);
__webpack_require__(240);
__webpack_require__(241);
__webpack_require__(222);
__webpack_require__(125);
__webpack_require__(127);
__webpack_require__(128);
__webpack_require__(277);
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(272);
__webpack_require__(275);
__webpack_require__(276);
__webpack_require__(270);
__webpack_require__(273);
__webpack_require__(271);
__webpack_require__(274);
__webpack_require__(268);
__webpack_require__(269);
__webpack_require__(223);
__webpack_require__(224);
__webpack_require__(225);
__webpack_require__(226);
__webpack_require__(227);
__webpack_require__(230);
__webpack_require__(228);
__webpack_require__(229);
__webpack_require__(231);
__webpack_require__(232);
__webpack_require__(233);
__webpack_require__(234);
__webpack_require__(236);
__webpack_require__(235);
__webpack_require__(278);
__webpack_require__(304);
__webpack_require__(307);
__webpack_require__(306);
__webpack_require__(308);
__webpack_require__(309);
__webpack_require__(305);
__webpack_require__(310);
__webpack_require__(311);
__webpack_require__(289);
__webpack_require__(292);
__webpack_require__(288);
__webpack_require__(286);
__webpack_require__(287);
__webpack_require__(290);
__webpack_require__(291);
__webpack_require__(281);
__webpack_require__(303);
__webpack_require__(312);
__webpack_require__(280);
__webpack_require__(282);
__webpack_require__(284);
__webpack_require__(283);
__webpack_require__(285);
__webpack_require__(294);
__webpack_require__(295);
__webpack_require__(297);
__webpack_require__(296);
__webpack_require__(299);
__webpack_require__(298);
__webpack_require__(300);
__webpack_require__(301);
__webpack_require__(302);
__webpack_require__(279);
__webpack_require__(293);
__webpack_require__(315);
__webpack_require__(314);
__webpack_require__(313);
module.exports = __webpack_require__(14);

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* unused harmony export addRangeInPlace *//* unused harmony export copyTo *//* unused harmony export partition *//* harmony export */ exports["a"] = permute;/* unused harmony export removeInPlace *//* unused harmony export setSlice *//* unused harmony export sortInPlaceBy *//* unused harmony export unzip *//* unused harmony export unzip3 *//* unused harmony export getSubArray *//* unused harmony export fill */function addRangeInPlace(range, xs) {
    var iter = range[Symbol.iterator]();
    var cur = iter.next();
    while (!cur.done) {
        xs.push(cur.value);
        cur = iter.next();
    }
}
function copyTo(source, sourceIndex, target, targetIndex, count) {
    while (count--)
        target[targetIndex++] = source[sourceIndex++];
}
function partition(f, xs) {
    var ys = [], zs = [], j = 0, k = 0;
    for (var i = 0; i < xs.length; i++)
        if (f(xs[i]))
            ys[j++] = xs[i];
        else
            zs[k++] = xs[i];
    return [ys, zs];
}
function permute(f, xs) {
    var ys = xs.map(function () { return null; });
    var checkFlags = new Array(xs.length);
    for (var i = 0; i < xs.length; i++) {
        var j = f(i);
        if (j < 0 || j >= xs.length)
            throw new Error("Not a valid permutation");
        ys[j] = xs[i];
        checkFlags[j] = 1;
    }
    for (var i = 0; i < xs.length; i++)
        if (checkFlags[i] != 1)
            throw new Error("Not a valid permutation");
    return ys;
}
function removeInPlace(item, xs) {
    var i = xs.indexOf(item);
    if (i > -1) {
        xs.splice(i, 1);
        return true;
    }
    return false;
}
function setSlice(target, lower, upper, source) {
    var length = (upper || target.length - 1) - lower;
    if (ArrayBuffer.isView(target) && source.length <= length)
        target.set(source, lower);
    else
        for (var i = lower | 0, j = 0; j <= length; i++, j++)
            target[i] = source[j];
}
function sortInPlaceBy(f, xs, dir) {
    if (dir === void 0) { dir = 1; }
    return xs.sort(function (x, y) {
        x = f(x);
        y = f(y);
        return (x < y ? -1 : x == y ? 0 : 1) * dir;
    });
}
function unzip(xs) {
    var bs = new Array(xs.length), cs = new Array(xs.length);
    for (var i = 0; i < xs.length; i++) {
        bs[i] = xs[i][0];
        cs[i] = xs[i][1];
    }
    return [bs, cs];
}
function unzip3(xs) {
    var bs = new Array(xs.length), cs = new Array(xs.length), ds = new Array(xs.length);
    for (var i = 0; i < xs.length; i++) {
        bs[i] = xs[i][0];
        cs[i] = xs[i][1];
        ds[i] = xs[i][2];
    }
    return [bs, cs, ds];
}
function getSubArray(xs, startIndex, count) {
    return xs.slice(startIndex, startIndex + count);
}
function fill(target, targetIndex, count, value) {
    target.fill(value, targetIndex, targetIndex + count);
}


/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Seq__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Observable__ = __webpack_require__(98);
/* unused harmony export add *//* unused harmony export choose *//* unused harmony export filter *//* unused harmony export map *//* unused harmony export merge *//* unused harmony export pairwise *//* unused harmony export partition *//* unused harmony export scan *//* unused harmony export split */



var Event = (function () {
    function Event(_subscriber, delegates) {
        this._subscriber = _subscriber;
        this.delegates = delegates || new Array();
    }
    Event.prototype.Add = function (f) {
        this._addHandler(f);
    };
    Object.defineProperty(Event.prototype, "Publish", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Event.prototype.Trigger = function (value) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__Seq__["i" /* iterate */])(function (f) { return f(value); }, this.delegates);
    };
    Event.prototype._addHandler = function (f) {
        this.delegates.push(f);
    };
    Event.prototype._removeHandler = function (f) {
        var index = this.delegates.indexOf(f);
        if (index > -1)
            this.delegates.splice(index, 1);
    };
    Event.prototype.AddHandler = function (handler) {
        if (this._dotnetDelegates == null) {
            this._dotnetDelegates = new Map();
        }
        var f = function (x) { handler(null, x); };
        this._dotnetDelegates.set(handler, f);
        this._addHandler(f);
    };
    Event.prototype.RemoveHandler = function (handler) {
        if (this._dotnetDelegates != null) {
            var f = this._dotnetDelegates.get(handler);
            if (f != null) {
                this._dotnetDelegates.delete(handler);
                this._removeHandler(f);
            }
        }
    };
    Event.prototype._subscribeFromObserver = function (observer) {
        var _this = this;
        if (this._subscriber)
            return this._subscriber(observer);
        var callback = observer.OnNext;
        this._addHandler(callback);
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["i" /* createDisposable */])(function () { return _this._removeHandler(callback); });
    };
    Event.prototype._subscribeFromCallback = function (callback) {
        var _this = this;
        this._addHandler(callback);
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["i" /* createDisposable */])(function () { return _this._removeHandler(callback); });
    };
    Event.prototype.Subscribe = function (arg) {
        return typeof arg == "function"
            ? this._subscribeFromCallback(arg)
            : this._subscribeFromObserver(arg);
    };
    return Event;
}());
/* harmony default export */ exports["a"] = Event;
function add(callback, sourceEvent) {
    sourceEvent.Subscribe(new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observer */](callback));
}
function choose(chooser, sourceEvent) {
    var source = sourceEvent;
    return new Event(function (observer) {
        return source.Subscribe(new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observer */](function (t) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Observable__["b" /* protect */])(function () { return chooser(t); }, function (u) { if (u != null)
                observer.OnNext(u); }, observer.OnError);
        }, observer.OnError, observer.OnCompleted));
    }, source.delegates);
}
function filter(predicate, sourceEvent) {
    return choose(function (x) { return predicate(x) ? x : null; }, sourceEvent);
}
function map(mapping, sourceEvent) {
    var source = sourceEvent;
    return new Event(function (observer) {
        return source.Subscribe(new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observer */](function (t) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Observable__["b" /* protect */])(function () { return mapping(t); }, observer.OnNext, observer.OnError);
        }, observer.OnError, observer.OnCompleted));
    }, source.delegates);
}
function merge(event1, event2) {
    var source1 = event1;
    var source2 = event2;
    return new Event(function (observer) {
        var stopped = false, completed1 = false, completed2 = false;
        var h1 = source1.Subscribe(new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observer */](function (v) { if (!stopped)
            observer.OnNext(v); }, function (e) {
            if (!stopped) {
                stopped = true;
                observer.OnError(e);
            }
        }, function () {
            if (!stopped) {
                completed1 = true;
                if (completed2) {
                    stopped = true;
                    observer.OnCompleted();
                }
            }
        }));
        var h2 = source2.Subscribe(new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observer */](function (v) { if (!stopped)
            observer.OnNext(v); }, function (e) {
            if (!stopped) {
                stopped = true;
                observer.OnError(e);
            }
        }, function () {
            if (!stopped) {
                completed2 = true;
                if (completed1) {
                    stopped = true;
                    observer.OnCompleted();
                }
            }
        }));
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Util__["i" /* createDisposable */])(function () {
            h1.Dispose();
            h2.Dispose();
        });
    }, source1.delegates.concat(source2.delegates));
}
function pairwise(sourceEvent) {
    var source = sourceEvent;
    return new Event(function (observer) {
        var last = null;
        return source.Subscribe(new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observer */](function (next) {
            if (last != null)
                observer.OnNext([last, next]);
            last = next;
        }, observer.OnError, observer.OnCompleted));
    }, source.delegates);
}
function partition(predicate, sourceEvent) {
    return [filter(predicate, sourceEvent), filter(function (x) { return !predicate(x); }, sourceEvent)];
}
function scan(collector, state, sourceEvent) {
    var source = sourceEvent;
    return new Event(function (observer) {
        return source.Subscribe(new __WEBPACK_IMPORTED_MODULE_2__Observable__["a" /* Observer */](function (t) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Observable__["b" /* protect */])(function () { return collector(state, t); }, function (u) { state = u; observer.OnNext(u); }, observer.OnError);
        }, observer.OnError, observer.OnCompleted));
    }, source.delegates);
}
function split(splitter, sourceEvent) {
    return [choose(function (v) { return splitter(v).valueIfChoice1; }, sourceEvent), choose(function (v) { return splitter(v).valueIfChoice2; }, sourceEvent)];
}


/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fable_core_List__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fable_core_Map__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_fable_core_GenericComparer__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_fable_core_Util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_fable_core_Seq__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_fable_core_Event__ = __webpack_require__(318);
/* unused harmony export tetrisView *//* unused harmony export ctx *//* unused harmony export lastRenderedGameBoard *//* harmony export */ exports["b"] = render;
/* harmony export */ __webpack_require__.d(exports, "c", function() { return frameChangeEvent; });/* harmony export */ exports["a"] = startFrameClock;/* unused harmony export stopFrameClock */







__webpack_require__(53);

var tetrisView = document.getElementById("tetris-view");
var ctx = tetrisView.getContext('2d');
var lastRenderedGameBoard = new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["c" /* Gameboard */]("GameboardInMotion", [new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["d" /* GameboardInMotion */](350, 200, 25, new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["e" /* Tetromino */]("StraightUp", [new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["f" /* TetrominoDetail */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["g" /* TetrominoRow */](__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_fable_core_List__["a" /* ofArray */])([new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["h" /* Block */](0, -5, "green"), new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["h" /* Block */](25, -5, "green"), new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["h" /* Block */](50, -5, "green"), new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["h" /* Block */](75, -5, "green")]))]))]), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_fable_core_Map__["c" /* create */])(null, new __WEBPACK_IMPORTED_MODULE_3_fable_core_GenericComparer__["a" /* default */](__WEBPACK_IMPORTED_MODULE_4_fable_core_Util__["c" /* compare */])))]);
function render(gameboard) {
    var renderRow = function renderRow(blockSize) {
        return function (blocks) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_Seq__["i" /* iterate */])(function (block) {
                ctx.fillStyle = block.Color;
                ctx.fillRect(block.BottomX, block.BottomY - blockSize, blockSize, blockSize);
            }, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_Seq__["b" /* map */])(function (tuple) {
                return tuple[1];
            }, blocks));
        };
    };

    var renderRows = function renderRows(blockSize_1) {
        return function (rows) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_Seq__["i" /* iterate */])(renderRow(blockSize_1), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_fable_core_Seq__["b" /* map */])(function (tuple_1) {
                return tuple_1[1];
            }, rows));
        };
    };

    if (gameboard.Case === "RestingGameboard") {
        ctx.clearRect(0, 0, tetrisView.width, tetrisView.height);
        renderRows(gameboard.Fields[0].BlockSize)(gameboard.Fields[0].Rows);
        lastRenderedGameBoard = new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["c" /* Gameboard */]("RestingGameboard", [gameboard.Fields[0]]);
    } else {
        ctx.clearRect(0, 0, tetrisView.width, tetrisView.height);
        renderRows(gameboard.Fields[0].BlockSize)(gameboard.Fields[0].Rows);
        lastRenderedGameBoard = new __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["c" /* Gameboard */]("GameboardInMotion", [gameboard.Fields[0]]);
    }
}
var frameChangeEvent = new __WEBPACK_IMPORTED_MODULE_6_fable_core_Event__["a" /* default */]();
var frameClockId = 0;
function startFrameClock() {
    frameClockId = window.setInterval(function () {
        var $var1 = lastRenderedGameBoard.Case === "RestingGameboard" ? [0] : [0];

        switch ($var1[0]) {
            case 0:
                frameChangeEvent.Trigger(lastRenderedGameBoard);
                break;
        }
    }, 150);
}
function stopFrameClock() {
    window.clearInterval(frameClockId);
}


/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__ = __webpack_require__(99);
/* harmony export */ exports["a"] = getKeyPressed;

__webpack_require__(53);

var keyPressed = {
    contents: null
};

function handleKeyDown(keyCode) {
    var matchValue = __WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["a" /* ValidKeyPressModule */].toValidKeyPress(keyCode);

    if (matchValue == null) {} else {
        var activePatternResult274 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["b" /* $7C$ValidKeyPress$7C$ */])(matchValue);

        keyPressed.contents = matchValue;
    }
}

function handleKeyUp(keyCode) {
    var matchValue = keyPressed.contents;
    var $var2 = void 0;

    if (matchValue != null) {
        var activePatternResult277 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Tetris_Definitions__["b" /* $7C$ValidKeyPress$7C$ */])(matchValue);

        if (keyCode === activePatternResult277[1]) {
            $var2 = [0, activePatternResult277[1]];
        } else {
            $var2 = [1];
        }
    } else {
        $var2 = [1];
    }

    switch ($var2[0]) {
        case 0:
            keyPressed.contents = null;
            break;

        case 1:
            break;
    }
}

window.addEventListener('keydown', function (e) {
    handleKeyDown(e.keyCode);
});
window.addEventListener('keyup', function (e_1) {
    handleKeyUp(e_1.keyCode);
});
function getKeyPressed() {
    return keyPressed.contents;
}


/***/ },
/* 321 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tetris_Engine__ = __webpack_require__(129);


__webpack_require__(53);

__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Tetris_Engine__["a" /* runApp */])();


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map