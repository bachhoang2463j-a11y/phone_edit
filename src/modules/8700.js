// webpack 模块 8700（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.d(n, {
    I: () => B,
    Mr: () => u,
    Ms: () => h,
    NX: () => y,
    b0: () => b,
    fg: () => A,
    k$: () => x,
    n6: () => F,
    qQ: () => v,
    uH: () => w,
    vM: () => f,
    xm: () => N,
  });
  var a = t(2224),
    o = t.n(a),
    r = t(8846);
  const i = 'phone_date_time',
    s = '2025年1月1日',
    l = '12:00';
  let c = null;
  function A(e) {
    c = e;
  }
  function d(e) {
    if (c)
      try {
        c(e);
      } catch (e) {
        console.warn('[DateTimeVariables] 更新手机时间显示失败(忽略):', e);
      }
  }
  function p(e, n, t) {
    if (!Number.isFinite(e) || !Number.isFinite(n) || !Number.isFinite(t)) return !1;
    if (e < 1 || e > 9999) return !1;
    if (n < 1 || n > 12) return !1;
    if (t < 1 || t > 31) return !1;
    const a = new Date(e, n - 1, t);
    return a.getFullYear() === e && a.getMonth() === n - 1 && a.getDate() === t;
  }
  function C(e) {
    const n = e.trim();
    if (!n) return n;
    const t = n.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
    if (t) {
      const e = Number(t[1]),
        a = Number(t[2]),
        o = Number(t[3]);
      return p(e, a, o) ? `${e}年${a}月${o}日` : n;
    }
    const a = n.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (!a) return n;
    const o = Number(a[1]),
      r = Number(a[2]),
      i = Number(a[3]);
    return p(o, r, i) ? `${o}年${r}月${i}日` : n;
  }
  function m(e) {
    if (null == e) return null;
    if ('string' == typeof e) {
      const n = e.trim();
      return n || null;
    }
    return 'number' == typeof e || 'boolean' == typeof e ? String(e) : null;
  }
  function g(e) {
    if (!e || 'object' != typeof e) return null;
    const n = e.type,
      t = e.path;
    if ('chat' !== n && 'message' !== n) return null;
    const a = 'string' == typeof t ? t.trim() : '';
    return a
      ? {
          type: n,
          path: a,
        }
      : null;
  }
  function u() {
    try {
      const e =
          getVariables({
            type: 'chat',
          }) || {},
        n = o().get(e, `${i}.settings`);
      return {
        enabled: Boolean(n?.enabled),
        dateVariableBinding: g(n?.dateVariableBinding),
        timeVariableBinding: g(n?.timeVariableBinding),
      };
    } catch (e) {
      return (
        console.warn('[DateTimeVariables] 读取时间设置失败(忽略):', e),
        {
          enabled: !1,
          dateVariableBinding: null,
          timeVariableBinding: null,
        }
      );
    }
  }
  function f(e) {
    try {
      const n =
          getVariables({
            type: 'chat',
          }) || {},
        t = o().get(n, `${i}.settings`),
        a =
          t && 'object' == typeof t && !Array.isArray(t)
            ? {
                ...t,
              }
            : {};
      ('boolean' == typeof e.enabled && o().set(a, 'enabled', e.enabled),
        'dateVariableBinding' in e && o().set(a, 'dateVariableBinding', e.dateVariableBinding),
        'timeVariableBinding' in e && o().set(a, 'timeVariableBinding', e.timeVariableBinding),
        o().set(n, `${i}.settings`, a),
        replaceVariables(n, {
          type: 'chat',
        }));
    } catch (e) {
      console.warn('[DateTimeVariables] 保存时间设置失败(忽略):', e);
    }
  }
  function b() {
    try {
      const e =
          getVariables({
            type: 'chat',
          }) || {},
        n = m(o().get(e, `${i}.date`)),
        t = m(o().get(e, `${i}.time`)),
        a = {};
      return (n && (a.date = n), t && (a.time = t), a);
    } catch (e) {
      return (console.warn('[DateTimeVariables] 读取聊天变量失败(忽略):', e), {});
    }
  }
  function v() {
    try {
      const e =
          getVariables({
            type: 'chat',
          }) || {},
        n = o().get(e, i),
        t =
          n && 'object' == typeof n && !Array.isArray(n)
            ? {
                ...n,
              }
            : {};
      (m(o().get(t, 'date')) || o().set(t, 'date', s), m(o().get(t, 'time')) || o().set(t, 'time', l));
      const a = o().get(t, 'settings'),
        r =
          a && 'object' == typeof a && !Array.isArray(a)
            ? {
                ...a,
              }
            : {};
      ('boolean' != typeof r.enabled && (r.enabled = !1),
        'dateVariableBinding' in r || (r.dateVariableBinding = null),
        'timeVariableBinding' in r || (r.timeVariableBinding = null),
        o().set(t, 'settings', r),
        o().set(e, i, t),
        replaceVariables(e, {
          type: 'chat',
        }));
    } catch (e) {
      console.warn('[DateTimeVariables] 初始化聊天变量失败(忽略):', e);
    }
  }
  function x(e) {
    const n = m(e.date),
      t = n ? C(n) : null,
      a = m(e.time);
    if (t || a)
      try {
        const e =
            getVariables({
              type: 'chat',
            }) || {},
          n = o().get(e, i),
          r =
            n && 'object' == typeof n && !Array.isArray(n)
              ? {
                  ...n,
                }
              : {};
        (t && o().set(r, 'date', t),
          a && o().set(r, 'time', a),
          o().set(e, i, r),
          replaceVariables(e, {
            type: 'chat',
          }));
      } catch (e) {
        console.warn('[DateTimeVariables] 保存聊天变量失败(忽略):', e);
      }
  }
  function h() {
    v();
    if (!u().enabled)
      return void d({
        date: s,
        time: l,
      });
    const e = b();
    d({
      date: e.date ? C(e.date) : s,
      time: e.time || l,
    });
  }
  function B() {
    if (!u().enabled) return s;
    const e = b().date;
    return e ? C(e) : s;
  }
  function y() {
    return (u().enabled && b().time) || l;
  }
  function k(e, n) {
    if (!e) return null;
    const t = (e.path || '').trim();
    if (!t) return null;
    try {
      if ('chat' === e.type) {
        const e =
          getVariables({
            type: 'chat',
          }) || {};
        return m(o().get(e, t));
      }
      if ('message' === e.type) {
        const e = 'number' == typeof n && n >= 0 ? n : getLastMessageId();
        if (e < 0) return null;
        const a =
          getVariables({
            type: 'message',
            message_id: e,
          }) || {};
        return m(o().get(a, t));
      }
    } catch (n) {
      console.warn('[DateTimeVariables] 读取绑定变量失败(忽略):', e.type, t, n);
    }
    return null;
  }
  function E(e) {
    if (!e || 'object' != typeof e)
      return {
        dateValue: null,
        timeValue: null,
      };
    return {
      dateValue: m(o().get(e, 'date')),
      timeValue: m(o().get(e, 'time')),
    };
  }
  function w(e) {
    v();
    const n = u(),
      t = (function (e) {
        const n = E(e);
        if (n.dateValue || n.timeValue) return n;
        if (!e || 'object' != typeof e) return n;
        const t = [];
        for (const n of [
          'group_message',
          'listen_together',
          'listen-together',
          'dynamic',
          'homepage',
          'forum',
          'forum_post',
          'email',
          'browser',
          'call',
          'phone_module',
        ]) {
          const a = e[n];
          a && 'object' == typeof a && t.push(a);
        }
        for (const e of t) {
          const n = E(e);
          if (n.dateValue || n.timeValue) return n;
        }
        return {
          dateValue: null,
          timeValue: null,
        };
      })(e),
      a = t.dateValue ? C(t.dateValue) : null,
      o = t.timeValue;
    (a || o) &&
      (x({
        date: a ?? void 0,
        time: o ?? void 0,
      }),
      n.enabled &&
        d({
          date: a ?? void 0,
          time: o ?? void 0,
        }));
  }
  function N(e) {
    v();
    const n = u();
    if (!n.enabled) return;
    const t = k(n.dateVariableBinding, e),
      a = t ? C(t) : null,
      o = k(n.timeVariableBinding, e);
    (a || o) &&
      (x({
        date: a ?? void 0,
        time: o ?? void 0,
      }),
      d({
        date: a ?? void 0,
        time: o ?? void 0,
      }));
  }
  function F() {
    (v(),
      h(),
      eventOn(tavern_events.GENERATION_ENDED, (e) => {
        if (u().enabled) {
          if ('number' == typeof e) {
            const n = SillyTavern.getCurrentChatId?.();
            if ((0, r.v)(n, e)) return;
          }
          N(e);
        }
      }));
  }
}
