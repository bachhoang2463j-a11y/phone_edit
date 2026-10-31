// webpack 模块 8748（提取自 phone_index_fixed.js）
export default function (e) {
  e.exports = function (e) {
    var n = [];
    return n.toString = function () {
      return this.map(function (n) {
        var t = '',
          a = void 0 !== n[5];
        return n[4] && (t += '@supports ('.concat(n[4], ') {')), n[2] && (t += '@media '.concat(n[2], ' {')), a && (t += '@layer'.concat(n[5].length > 0 ? ' '.concat(n[5]) : '', ' {')), t += e(n), a && (t += '}'), n[2] && (t += '}'), n[4] && (t += '}'), t;
      }).join('');
    }, n.i = function (e, t, a, o, r) {
      'string' == typeof e && (e = [[null, e, void 0]]);
      var i = {};
      if (a) for (var s = 0; s < this.length; s++) {
        var l = this[s][0];
        null != l && (i[l] = !0);
      }
      for (var c = 0; c < e.length; c++) {
        var A = [].concat(e[c]);
        a && i[A[0]] || (void 0 !== r && (void 0 === A[5] || (A[1] = '@layer'.concat(A[5].length > 0 ? ' '.concat(A[5]) : '', ' {').concat(A[1], '}')), A[5] = r), t && (A[2] ? (A[1] = '@media '.concat(A[2], ' {').concat(A[1], '}'), A[2] = t) : A[2] = t), o && (A[4] ? (A[1] = '@supports ('.concat(A[4], ') {').concat(A[1], '}'), A[4] = o) : A[4] = ''.concat(o)), n.push(A));
      }
    }, n;
  };
}
