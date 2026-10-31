// webpack 运行时（提取自 phone_index_fixed.js，共享绑定已重命名）
const __webpackCache = {};
let __webpackModules__ = {};
export function registerModules(mods) {
  __webpackModules__ = mods;
}
function __webpackRequire__(e) {
  var o = __webpackCache__[e];
  if (void 0 !== o) return o.exports;
  var r = __webpackCache__[e] = {
    id: e,
    exports: {}
  };
  return __webpackModules__[e](r, r.exports, __webpackRequire__), r.exports;
}
__webpackRequire__.n = e => {
  var n = e && e.__esModule ? () => e.default : () => e;
  return __webpackRequire__.d(n, {
    a: n
  }), n;
}, __webpackRequire__.d = (e, n) => {
  for (var t in n) __webpackRequire__.o(n, t) && !__webpackRequire__.o(e, t) && Object.defineProperty(e, t, {
    enumerable: !0,
    get: n[t]
  });
}, __webpackRequire__.o = (e, n) => Object.prototype.hasOwnProperty.call(e, n), __webpackRequire__.r = e => {
  'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
    value: 'Module'
  }), Object.defineProperty(e, '__esModule', {
    value: !0
  });
};;
export default __webpackRequire__;
