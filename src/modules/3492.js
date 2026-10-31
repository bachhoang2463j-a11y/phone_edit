// webpack 模块 3492（提取自 phone_index_fixed.js）
export default function (e) {
  e.exports = function (e) {
    var n = e[1],
      t = e[3];
    if (!t) return n;
    if ('function' == typeof btoa) {
      var a = btoa(unescape(encodeURIComponent(JSON.stringify(t)))),
        o = 'sourceMappingURL=data:application/json;charset=utf-8;base64,'.concat(a),
        r = '/*# '.concat(o, ' */');
      return [n].concat([r]).join('\n');
    }
    return [n].join('\n');
  };
}
