// webpack 模块 4592（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.d(n, {
    AM: () => i,
    jY: () => o,
    lP: () => r,
  });
  let a = null;
  function o() {
    return (a || (a = new AbortController()), a);
  }
  function r() {
    a && (a.abort(), (a = null), console.info('[AbortController] AI 请求已终止'));
  }
  function i() {
    a = null;
  }
}
