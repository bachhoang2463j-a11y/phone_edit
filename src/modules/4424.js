// webpack 模块 4424（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  function a(e, n) {
    for (var t = [], a = {}, o = 0; o < n.length; o++) {
      var r = n[o],
        i = r[0],
        s = {
          id: e + ':' + o,
          css: r[1],
          media: r[2],
          sourceMap: r[3]
        };
      a[i] ? a[i].parts.push(s) : t.push(a[i] = {
        id: i,
        parts: [s]
      });
    }
    return t;
  }
  t.d(n, {
    A: () => m
  });
  var o = 'undefined' != typeof document;
  if ('undefined' != typeof DEBUG && DEBUG && !o) throw new Error('vue-style-loader cannot be used in a non-browser environment. Use { target: \'node\' } in your Webpack config to indicate a server-rendering environment.');
  var r = {},
    i = o && (document.head || document.getElementsByTagName('head')[0]),
    s = null,
    l = 0,
    c = !1,
    A = function () {},
    d = null,
    p = 'data-vue-ssr-id',
    C = 'undefined' != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
  function m(e, n, t, o) {
    c = t, d = o || {};
    var i = a(e, n);
    return g(i), function (n) {
      for (var t = [], o = 0; o < i.length; o++) {
        var s = i[o];
        (l = r[s.id]).refs--, t.push(l);
      }
      n ? g(i = a(e, n)) : i = [];
      for (o = 0; o < t.length; o++) {
        var l;
        if (0 === (l = t[o]).refs) {
          for (var c = 0; c < l.parts.length; c++) l.parts[c]();
          delete r[l.id];
        }
      }
    };
  }
  function g(e) {
    for (var n = 0; n < e.length; n++) {
      var t = e[n],
        a = r[t.id];
      if (a) {
        a.refs++;
        for (var o = 0; o < a.parts.length; o++) a.parts[o](t.parts[o]);
        for (; o < t.parts.length; o++) a.parts.push(f(t.parts[o]));
        a.parts.length > t.parts.length && (a.parts.length = t.parts.length);
      } else {
        var i = [];
        for (o = 0; o < t.parts.length; o++) i.push(f(t.parts[o]));
        r[t.id] = {
          id: t.id,
          refs: 1,
          parts: i
        };
      }
    }
  }
  function u() {
    var e = document.createElement('style');
    return e.type = 'text/css', i.appendChild(e), e;
  }
  function f(e) {
    var n,
      t,
      a = document.querySelector('style[' + p + '~="' + e.id + '"]');
    if (a) {
      if (c) return A;
      a.parentNode.removeChild(a);
    }
    if (C) {
      var o = l++;
      a = s || (s = u()), n = x.bind(null, a, o, !1), t = x.bind(null, a, o, !0);
    } else a = u(), n = h.bind(null, a), t = function () {
      a.parentNode.removeChild(a);
    };
    return n(e), function (a) {
      if (a) {
        if (a.css === e.css && a.media === e.media && a.sourceMap === e.sourceMap) return;
        n(e = a);
      } else t();
    };
  }
  var b,
    v = (b = [], function (e, n) {
      return b[e] = n, b.filter(Boolean).join('\n');
    });
  function x(e, n, t, a) {
    var o = t ? '' : a.css;
    if (e.styleSheet) e.styleSheet.cssText = v(n, o);else {
      var r = document.createTextNode(o),
        i = e.childNodes;
      i[n] && e.removeChild(i[n]), i.length ? e.insertBefore(r, i[n]) : e.appendChild(r);
    }
  }
  function h(e, n) {
    var t = n.css,
      a = n.media,
      o = n.sourceMap;
    if (a && e.setAttribute('media', a), d.ssrId && e.setAttribute(p, n.id), o && (t += '\n/*# sourceURL=' + o.sources[0] + ' */', t += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))) + ' */'), e.styleSheet) e.styleSheet.cssText = t;else {
      for (; e.firstChild;) e.removeChild(e.firstChild);
      e.appendChild(document.createTextNode(t));
    }
  }
}
