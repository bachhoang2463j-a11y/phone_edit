// webpack 模块 1243（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.d(n, {
    g0: () => R,
    hM: () => B,
    hm: () => O,
    x1: () => k,
    zC: () => y,
  });
  var a = t(2224),
    o = t.n(a),
    r = t(7856),
    i = t.n(r),
    s = t(8366),
    l = t(9852),
    c = t(2213);
  function A() {
    return new Promise((e) => setTimeout(e, 0));
  }
  function d(e) {
    const n = (function () {
      try {
        const e =
            getVariables({
              type: 'character',
            }) || {},
          n = o().get(e, 'phone_data'),
          t = String(n?.user?.nickname ?? '').trim();
        if (t) return t;
        const a = String(n?.user?.name ?? '').trim();
        if (a) return a;
        if (SillyTavern.name1) return SillyTavern.name1;
      } catch (e) {
        console.warn('[AutoFill] 获取用户名失败:', e);
      }
      return '用户';
    })();
    return e
      .replace(/\{\{User\}\}/g, n)
      .replace(/\{\{user\}\}/g, n)
      .replace(/<User>/g, n)
      .replace(/<user>/g, n);
  }
  function p() {
    try {
      const e =
        getVariables({
          type: 'global',
        }) || {};
      return !0 === o().get(e, 'phone_use_global_sticker_library');
    } catch {
      return !1;
    }
  }
  function C() {
    if (p()) {
      try {
        const e =
            getVariables({
              type: 'global',
            }) || {},
          n = o().get(e, 'phone_global_sticker_library');
        if (n && Array.isArray(n) && n.length > 0) return n.map((e) => e.name);
      } catch (e) {
        console.warn('[AutoFill] 获取全局表情包库失败:', e);
      }
      return s.map((e) => e.name);
    }
    try {
      const e = getVariables({
          type: 'character',
        }),
        n = o().get(e, 'phone_sticker_library');
      if (n && Array.isArray(n) && n.length > 0) return n.map((e) => e.name);
    } catch (e) {
      console.warn('[AutoFill] 获取保存的表情包库失败:', e);
    }
    return s.map((e) => e.name);
  }
  function m(e) {
    const n = (function () {
        try {
          const e = getVariables({
              type: 'character',
            }),
            n = o().get(e, 'phone_character_sticker_library');
          return n && 'object' == typeof n ? n : {};
        } catch {
          return {};
        }
      })(),
      t = n[e] || n[f(e)];
    return t && Array.isArray(t) ? t.map((e) => e.name) : [];
  }
  function g(e) {
    const n = (function () {
        try {
          const e = getVariables({
              type: 'character',
            }),
            n = o().get(e, 'phone_character_images');
          return n && 'object' == typeof n ? n : {};
        } catch {
          return {};
        }
      })(),
      t = n[e] || n[f(e)];
    return t && Array.isArray(t) ? t.map((e) => e.name) : [];
  }
  function u(e) {
    const n = (function () {
        try {
          const e = getVariables({
              type: 'character',
            }),
            n = o().get(e, 'phone_character_live_images');
          return n && 'object' == typeof n ? n : {};
        } catch {
          return {};
        }
      })(),
      t = n[e] || n[f(e)];
    return t && Array.isArray(t) ? t.map((e) => e.name) : [];
  }
  function f(e) {
    const n = (e || '').trim();
    if (!n) return '';
    const t = (0, c.nC)(n);
    return t?.name || n;
  }
  const b = {
    私聊: 'privateChat',
    群聊: 'groupChat',
    通话: 'voiceCall',
    动态: 'dynamic',
    动态主页: 'dynamicHome',
    论坛: 'forum',
    论坛帖子: 'forumPost',
    直播列表: 'liveList',
    直播: 'live',
    地图: 'map',
    邮箱: 'email',
    浏览器: 'browser',
    音乐: 'music',
    日历: 'calendar',
    日记: 'diary',
  };
  function v() {
    try {
      const e = getVariables({
          type: 'character',
        }),
        n = o().get(e, 'phone_data');
      if (n && n.user && n.characters) return n;
    } catch (e) {
      console.warn('[AutoFill] 获取手机基础数据失败:', e);
    }
    return null;
  }
  function x(e, n = '未设置') {
    return String(e ?? '').trim() || n;
  }
  function h(e, n) {
    let t = null;
    try {
      const e =
          getVariables({
            type: 'character',
          }) || {},
        n = o().get(e, 'phone_data');
      t = n && 'object' == typeof n ? n : null;
    } catch {
      t = null;
    }
    const a = t?.user || {},
      r = t
        ? (function (e, n) {
            const t = Array.isArray(e.characters) ? e.characters : [];
            if (0 === t.length) return null;
            const a = n.map((e) => String(e ?? '').trim()).filter(Boolean);
            for (const e of a) {
              const n = t.find((n) => String(n?.name ?? '').trim() === e || String(n?.nickname ?? '').trim() === e);
              if (n) return n;
            }
            return 1 === t.length ? t[0] : null;
          })(t, [e, ...(n || [])])
        : null;
    let i = String(a?.name ?? '').trim();
    if (!i)
      try {
        const e = String(SillyTavern?.name1 ?? '').trim();
        e && (i = e);
      } catch {}
    const s = String(e ?? '').trim() || '未设置',
      l = '未设置' === s ? '未设置' : s;
    return `用户信息：\n姓名：${x(i)}\n网名：${x(a.nickname)}\n邮箱：${x(a.email)}\n状态：${x(a.state)}\n个人简介：${x(a.bio)}\n\n好友信息：\n姓名：${x(r?.name, s)}\n网名：${x(r?.nickname, l)}\n邮箱：${x(r?.email)}\n线上聊天风格：${x(r?.onlineStyle)}`;
  }
  function B(e) {
    const n = /<(前置|后置)(?=\||>)/g.exec(e);
    if (!n || 'number' != typeof n.index) return null;
    const t = n.index;
    let a = e.indexOf('>', t + 1);
    for (; -1 !== a;) {
      const n = e.slice(t + 1, a).split('|'),
        o = String(n[0] ?? '').trim();
      if ('前置' === o || '后置' === o) {
        const e = n.length >= 2 ? String(n[1] ?? '').trim() : void 0,
          t = n.length >= 3 ? n.slice(2).join('|').trim() : void 0,
          a = n.length >= 2 && !e,
          r = n.length >= 3 && !t;
        if (!a && !r)
          return {
            type: '前置' === o ? 'before' : 'after',
            variablePath: e,
            range: t,
          };
      }
      a = e.indexOf('>', a + 1);
    }
    return null;
  }
  function y(e) {
    const n = e.indexOf('<人物|');
    if (-1 === n) return null;
    let t = e.indexOf('>', n + 1);
    for (; -1 !== t;) {
      const a = e.slice(n + 1, t).split('|');
      if ('人物' === String(a[0] ?? '').trim()) {
        const e = String(a[1] ?? '').trim(),
          n = a.length >= 3 ? String(a[2] ?? '').trim() : void 0,
          t = a.length >= 4 ? a.slice(3).join('|').trim() : void 0,
          o = !e,
          r = a.length >= 3 && !n,
          i = a.length >= 4 && !t;
        if (!o && !r && !i) {
          const a = e
            .split(/[,，、]/)
            .map((e) => e.trim())
            .filter(Boolean);
          return 0 === a.length
            ? null
            : {
                type: 'character',
                characterName: a[0],
                characterNames: a,
                variablePath: n,
                range: t,
              };
        }
      }
      t = e.indexOf('>', t + 1);
    }
    return null;
  }
  function k(e) {
    const n = e.indexOf('<页面|');
    if (-1 === n) return null;
    let t = e.indexOf('>', n + 1);
    for (; -1 !== t;) {
      const a = e.slice(n + 1, t).split('|');
      if ('页面' === String(a[0] ?? '').trim()) {
        const e = String(a[1] ?? '').trim(),
          n = a.length >= 3 ? String(a[2] ?? '').trim() : void 0,
          t = a.length >= 4 ? a.slice(3).join('|').trim() : void 0,
          o = !e,
          r = a.length >= 3 && !n,
          i = a.length >= 4 && !t;
        if (!o && !r && !i)
          return {
            type: 'page',
            pageName: e,
            variablePath: n,
            range: t,
          };
      }
      t = e.indexOf('>', t + 1);
    }
    return null;
  }
  function E(e, n) {
    const t = n.match(/^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)$/);
    if (t) {
      const [, n, a] = t;
      return e >= parseFloat(n) && e <= parseFloat(a);
    }
    const a = n.match(/^(>=?|<=?|=)\s*(-?\d+(?:\.\d+)?)$/);
    if (a) {
      const [, n, t] = a,
        o = parseFloat(t);
      switch (n) {
        case '>':
          return e > o;
        case '>=':
          return e >= o;
        case '<':
          return e < o;
        case '<=':
          return e <= o;
        case '=':
          return e === o;
      }
    }
    return (console.warn(`[AutoFill] 无法解析范围表达式: ${n}`), !0);
  }
  function w(e, n) {
    if (!e.variablePath) return !0;
    const t = o().get(n, e.variablePath);
    return (
      null != t &&
      (!e.range ||
        ('number' == typeof t
          ? E(t, e.range)
          : (console.warn(`[AutoFill] 变量 ${e.variablePath} 不是数值类型，无法检查范围`), !0)))
    );
  }
  function N(e, n, t) {
    if (!e.characterNames.some((e) => n.includes(e))) return !1;
    if (!e.variablePath) return !0;
    const a = o().get(t, e.variablePath);
    return (
      null != a &&
      (!e.range ||
        ('number' == typeof a
          ? E(a, e.range)
          : (console.warn(`[AutoFill] 变量 ${e.variablePath} 不是数值类型，无法检查范围`), !0)))
    );
  }
  function F(e, n, t) {
    if ((b[e.pageName] || e.pageName) !== (b[n] || n)) return !1;
    if (!e.variablePath) return !0;
    const a = o().get(t, e.variablePath);
    return (
      null != a &&
      (!e.range ||
        ('number' == typeof a
          ? E(a, e.range)
          : (console.warn(`[AutoFill] 变量 ${e.variablePath} 不是数值类型，无法检查范围`), !0)))
    );
  }
  async function V(e, n = {}) {
    const t = [];
    try {
      const a = getCharWorldbookNames('current'),
        o = [];
      (a.primary && o.push(a.primary), o.push(...a.additional));
      for (const a of o) {
        try {
          const o = await getWorldbook(a);
          console.info(
            `[AutoFill] 世界书 "${a}" 共 ${o.length} 个条目:`,
            o.map((e) => ({
              name: e.name,
              enabled: e.enabled,
            })),
          );
          let r = 0;
          for (const a of o) {
            const o = B(a.name);
            o &&
              o.type === e &&
              w(o, n) &&
              (a.content.trim() &&
                (t.push({
                  order: a.position.order,
                  content: a.content,
                }),
                console.info(`[AutoFill] 匹配条目: "${a.name}" (enabled=${a.enabled})`)),
              r++,
              r % 20 == 0 && (await A()));
          }
        } catch (e) {
          console.warn(`[AutoFill] 读取世界书 "${a}" 失败:`, e);
        }
        await A();
      }
    } catch (e) {
      console.error('[AutoFill] 获取世界书内容失败:', e);
    }
    return o()
      .sortBy(t, 'order')
      .map((e) => d(e.content));
  }
  async function D(e) {
    return (await V('before', e)).join('\n\n');
  }
  async function S(e) {
    return (await V('after', e)).join('\n\n');
  }
  async function M(e, n = {}) {
    const t = [];
    if (!e) return [];
    try {
      const a = getCharWorldbookNames('current'),
        o = [];
      (a.primary && o.push(a.primary), o.push(...a.additional));
      for (const a of o)
        try {
          const o = await getWorldbook(a);
          for (const a of o) {
            const o = k(a.name);
            o &&
              F(o, e, n) &&
              a.content.trim() &&
              (t.push({
                order: a.position.order,
                content: a.content,
              }),
              console.info(`[AutoFill] 页面条目匹配: "${a.name}" (enabled=${a.enabled})`));
          }
        } catch (e) {
          console.warn(`[AutoFill] 读取世界书 "${a}" 失败:`, e);
        }
    } catch (e) {
      console.error('[AutoFill] 获取页面世界书内容失败:', e);
    }
    return o()
      .sortBy(t, 'order')
      .map((e) => d(e.content));
  }
  async function I(e, n) {
    if (!e) return '';
    const t = await M(e, n || {});
    return 0 === t.length ? '' : `# 页面指导\n\n${t.join('\n\n')}`;
  }
  async function T(e, n = {}, t) {
    const a = new Map();
    for (const n of e) a.set(n, []);
    try {
      const o = getCharWorldbookNames('current'),
        r = [];
      (o.primary && r.push(o.primary), r.push(...o.additional));
      for (const o of r)
        try {
          const r = await getWorldbook(o);
          for (const o of r) {
            const r = y(o.name);
            if (r) {
              if (t?.ignoreConditions) {
                if (!r.characterNames.some((n) => e.includes(n))) continue;
              } else if (!N(r, e, n)) continue;
              if (o.content.trim()) {
                const n = r.characterNames.filter((n) => e.includes(n));
                for (const e of n) {
                  const n = a.get(e) || [];
                  (n.push({
                    order: o.position.order,
                    content: o.content,
                  }),
                    a.set(e, n));
                }
                console.info(`[AutoFill] 人物条目匹配: "${o.name}" (enabled=${o.enabled})`);
              }
            }
          }
        } catch (e) {
          console.warn(`[AutoFill] 读取世界书 "${o}" 失败:`, e);
        }
    } catch (e) {
      console.error('[AutoFill] 获取人物世界书内容失败:', e);
    }
    const r = new Map();
    for (const [e, n] of a)
      r.set(
        e,
        o()
          .sortBy(n, 'order')
          .map((e) => d(e.content)),
      );
    return r;
  }
  async function Y(e, n, t) {
    if (!e || 0 === e.length) return '';
    const a = await T(e, n || {}, t),
      o = [];
    for (const [e, n] of a) n.length > 0 && o.push(`## ${e}\n\n${n.join('\n\n')}`);
    return 0 === o.length ? '' : `# 人物指导\n\n${o.join('\n\n---\n\n')}`;
  }
  function j(e, n) {
    if (!n || 0 === n.length) return e;
    let t = e;
    for (const e of n) {
      if (!e.enabled) continue;
      const n = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        a = n(e.startTag),
        o = e.endTag ? n(e.endTag) : '';
      if ('remove' === e.mode) {
        if (o) {
          const e = new RegExp(`${a}[\\s\\S]*?${o}`, 'g');
          t = t.replace(e, '');
        }
      } else if ('keep_inside' === e.mode) {
        if (o) {
          const e = new RegExp(`${a}([\\s\\S]*?)${o}`, 'g'),
            n = [];
          let r;
          for (; null !== (r = e.exec(t));) n.push(r[1]);
          t = n.join('\n\n');
        }
      } else if ('remove_before' === e.mode) {
        const e = new RegExp(`^[\\s\\S]*?${a}`, '');
        t = t.replace(e, '');
      } else if ('remove_after' === e.mode) {
        const e = new RegExp(`${a}[\\s\\S]*$`, '');
        t = t.replace(e, '');
      }
    }
    return ((t = t.replace(/\n{3,}/g, '\n\n').trim()), t);
  }
  async function G(e = 100) {
    try {
      const n =
        'number' == typeof e
          ? {
              maxMessages: e,
              includeSystem: !1,
              includeUser: !0,
            }
          : {
              includeUser: !0,
              ...e,
            };
      let t = getChatMessages('0-{{lastMessageId}}');
      (n.includeSystem || (t = t.filter((e) => 'system' !== e.role)),
        n.includeUser || (t = t.filter((e) => 'user' !== e.role)));
      const a = 0 === n.maxMessages ? t.length : n.maxMessages,
        o = t.slice(-a),
        r = [];
      for (let e = 0; e < o.length; e++) {
        const t = o[e];
        let a;
        a = 'user' === t.role ? '用户' : 'system' === t.role ? '系统' : t.name || 'AI';
        let i = t.message.trim();
        ((i = j(i, n.tagFilters)), r.push(`【${a}】\n${i}`), (e + 1) % 15 == 0 && (await A()));
      }
      return r.join('\n\n---\n\n');
    } catch (e) {
      return (console.error('[AutoFill] 获取对话历史失败:', e), '');
    }
  }
  function W(e) {
    try {
      const e = getCharData('current');
      if (!e) return '';
      const n = [];
      return (
        e.name && n.push(`## 角色: ${e.name}`),
        e.description && n.push(`### 角色描述\n${e.description}`),
        e.personality && n.push(`### 人格特征\n${e.personality}`),
        e.scenario && n.push(`### 场景设定\n${e.scenario}`),
        n.join('\n\n')
      );
    } catch (e) {
      return (console.error('[AutoFill] 获取角色指导失败:', e), '');
    }
  }
  function P(e, n) {
    if (
      !(function () {
        try {
          const e = getVariables({
            type: 'character',
          });
          return !1 !== o().get(e, 'phone_sticker_inject_enabled');
        } catch {
          return !0;
        }
      })()
    )
      return '';
    const t = [],
      a = (function () {
        try {
          const e = getVariables({
              type: 'character',
            }),
            n = o().get(e, 'phone_sticker_char_only_mode');
          return n && 'object' == typeof n ? n : {};
        } catch {
          return {};
        }
      })(),
      r = p(),
      i = (n ? f(n) : '') || n || '',
      s = 'private' === e && i && Boolean(a[i] || a[n || '']);
    if (r) {
      const e = C();
      e.length > 0 && t.push(`### 通用表情包\n${e.join('、')}`);
    } else if ('private' === e && i) {
      if (s) {
        const e = m(i);
        e.length > 0 && t.push(`### ${i}的表情包\n${e.join('、')}`);
      } else {
        const e = C();
        e.length > 0 && t.push(`### 通用表情包\n${e.join('、')}`);
        const n = m(i);
        n.length > 0 && t.push(`### ${i}的表情包\n${n.join('、')}`);
      }
    } else {
      const e = C();
      e.length > 0 && t.push(`### 通用表情包\n${e.join('、')}`);
    }
    return 0 === t.length
      ? ''
      : `## 表情包库\n\n以下是可用的表情包名称列表，发送表情包消息时只需填写表情包名称，无需填写链接：\n\n${t.join('\n\n')}\n\n使用规则：\n- 表情包消息的 c 字段填写表情包名称即可\n- 系统会自动根据名称匹配对应的图片链接\n- 只能使用上面给出的表情包，不要使用列表之外的表情包\n- 尽量不要重复使用过去聊天中用过的表情包`;
  }
  function U(e, n = !1) {
    const t = [],
      a = u('__common__');
    if (a.length > 0) {
      const e = a.join('、');
      t.push(`### 通用直播图片库\n${e}`);
    }
    if (e && e.length > 0)
      for (const n of e) {
        const e = u(n);
        if (e.length > 0) {
          const a = e.join('、');
          t.push(`### ${n}的直播图片库\n${a}`);
        }
      }
    if (0 === t.length) return '';
    return `## 直播图片库\n\n${n ? '以下是当前主播的可用直播图片名称列表' : '以下是各主播的可用直播图片名称列表'}，在直播内容中引用图片时只需填写图片名称：\n\n${t.join('\n\n')}\n\n使用规则：\n- image 字段填写图片名称即可\n- 系统会自动根据名称匹配对应的图片链接`;
  }
  function q(e, n, t, a) {
    if (!e) return '';
    const o = [];
    if ('privateChat' === e) {
      const e = P('private', n && n.length > 0 ? n[0] : void 0);
      e && o.push(e);
    } else if ('groupChat' === e) {
      const e = P('group');
      e && o.push(e);
    }
    if (('privateChat' === e || 'groupChat' === e) && n && n.length > 0) {
      const e = (function (e) {
        if (!e || 0 === e.length) return '';
        const n = [],
          t = g('__common__');
        if (t.length > 0) {
          const e = t.join('、');
          n.push(`### 通用图片库\n${e}`);
        }
        for (const t of e) {
          const e = g(t);
          if (e.length > 0) {
            const a = e.join('、');
            n.push(`### ${t}的图片库\n${a}`);
          }
        }
        return 0 === n.length
          ? ''
          : `## 人物图片库\n\n以下是当前聊天对象的可用图片名称列表，发送图片消息时只需填写图片名称，无需填写链接：\n\n${n.join('\n\n')}\n\n使用规则：\n- 图片消息的 c 字段填写图片名称即可\n- 系统会自动根据名称匹配对应的图片链接\n- 也可以使用 imgdesc 类型描述图片内容，让系统生成描述性图片`;
      })(n);
      e && o.push(e);
    }
    if ('live' === e) {
      if (n && n.length > 0) {
        const e = U(n, !0);
        e && o.push(e);
      }
    } else if ('liveList' === e) {
      const e = t || n || [];
      if (e.length > 0) {
        const n = U(e, !1);
        n && o.push(n);
      }
    }
    if ('map' === e) {
      const e = (function (e) {
        try {
          const n =
            'function' == typeof getLastMessageId
              ? getLastMessageId()
              : globalThis?.SillyTavern?.chat?.length
                ? globalThis.SillyTavern.chat.length - 1
                : -1;
          if ('number' != typeof n || n < 0) return null;
          const t = (0, l.Q)().historyReadCount,
            a = 0 === t ? 0 : Math.max(0, n - t + 1),
            o = getChatMessages(`${a}-${n}`);
          if (!o || 0 === o.length) return null;
          const r = new RegExp(`<phone_module\\s+type="${e}"[^>]*>([\\s\\S]*?)</phone_module>`);
          for (let n = o.length - 1; n >= 0; n--) {
            const t = o[n],
              a = String(t.message || ''),
              s = r.exec(a);
            if (s)
              try {
                const e = s[1].trim();
                return i().parse(e);
              } catch (n) {
                return (console.warn(`[AutoFill] 解析历史模块失败: ${e}`, n), null);
              }
          }
          return null;
        } catch (n) {
          return (console.warn(`[AutoFill] 读取历史模块失败: ${e}`, n), null);
        }
      })('map');
      if (e && e.locations && Object.keys(e.locations).length > 0) {
        const e = (function () {
          const e = v();
          if (!e || !e.map || !e.map.districts) return '';
          const n = e.map,
            t = [];
          t.push(
            `## 地图地点框架\n\n【重要】生成地图数据时，必须严格按照以下地点框架编写，不得自行创造新地点：\n\n地图名称: ${n.name}`,
          );
          const a = [];
          for (const e of n.districts)
            if (e.subLocations && e.subLocations.length > 0) {
              const n = e.subLocations.map((e) => e.name).join('、');
              a.push(`- ${e.name}（子地点：${n}）`);
            } else a.push(`- ${e.name}`);
          return (
            t.push(`地点列表：\n${a.join('\n')}`),
            t.push(
              '规则说明：\n- locations 字段中的键名必须是上述地点列表中的地点名称\n- characters 字段中的 location 值必须使用上述地点名称\n- 如果角色在子地点，location 格式为"主地点/子地点"，如"学校/教室"\n- 不要创造不存在的地点名称',
            ),
            t.join('\n\n')
          );
        })();
        e && o.push(e);
      }
    }
    return (a && o.push(a), o.join('\n\n'));
  }
  function L(e, n) {
    if (!e || !n) return '';
    const t = (function (e, n) {
      return n || '';
    })(0, n[e]);
    return t ? `## 输出格式要求\n\n${t}` : '';
  }
  async function O(e, n) {
    let t = {};
    try {
      const e = getLastMessageId();
      if (e >= 0) {
        const n =
            getVariables({
              type: 'message',
              message_id: e,
            }) || {},
          a =
            getVariables({
              type: 'chat',
            }) || {},
          o =
            getVariables({
              type: 'character',
            }) || {},
          r =
            getVariables({
              type: 'global',
            }) || {};
        ((t = {
          ...n,
          message: n,
          chat: a,
          character: o,
          global: r,
        }),
          console.info(`[AutoFill] 从楼层 ${e} 读取变量（并附加 chat/character/global 变量）`));
      }
    } catch (e) {
      console.warn('[AutoFill] 获取楼层变量失败:', e);
    }
    return await Promise.all(
      e.map(async (e) => {
        const a = {
          ...e,
        };
        switch (e.id) {
          case 'char-description':
            {
              const e = getCharData('current');
              a.content = e?.description || '';
            }
            break;
          case 'persona-description':
            {
              const e = SillyTavern.powerUserSettings?.persona_description || '';
              a.content = e;
            }
            break;
          case 'worldbook-before':
            (n.worldbookReadMode && 'tag' !== n.worldbookReadMode) || (a.content = await D(t));
            break;
          case 'worldbook-after':
            (n.worldbookReadMode && 'tag' !== n.worldbookReadMode) || (a.content = await S(t));
            break;
          case 'user-character-info':
            a.content = h(n.characterName, n.targetCharacters);
            break;
          case 'history':
            a.content = await G(
              n.historyConfig || {
                maxMessages: 100,
                includeSystem: !1,
              },
            );
            break;
          case 'character':
            {
              const e = [],
                r = W(n.characterName);
              r && e.push(r);
              if ('tag' === (n.worldbookReadMode || 'tag'))
                if ('data' === n.currentView) {
                  const n = await (async function () {
                    const e = new Map();
                    try {
                      const n = getCharWorldbookNames('current'),
                        t = [];
                      (n.primary && t.push(n.primary), t.push(...n.additional));
                      for (const n of t)
                        try {
                          const t = await getWorldbook(n);
                          for (const n of t) {
                            const t = y(n.name);
                            if (t && n.content.trim())
                              for (const a of t.characterNames) {
                                const t = e.get(a) || [];
                                (t.push({
                                  order: n.position.order,
                                  content: n.content,
                                }),
                                  e.set(a, t));
                              }
                          }
                        } catch (e) {
                          console.warn(`[AutoFill] 读取世界书 "${n}" 失败:`, e);
                        }
                    } catch (e) {
                      console.error('[AutoFill] 获取人物世界书内容失败:', e);
                    }
                    const n = [],
                      t = Array.from(e.keys()).sort((e, n) => e.localeCompare(n, 'zh-Hans-CN'));
                    for (const a of t) {
                      const t = e.get(a) || [],
                        r = o()
                          .sortBy(t, 'order')
                          .map((e) => d(e.content));
                      r.length > 0 && n.push(`## ${a}\n\n${r.join('\n\n')}`);
                    }
                    return 0 === n.length ? '' : `# 人物指导\n\n${n.join('\n\n---\n\n')}`;
                  })(t);
                  n && e.push(n);
                } else if (n.targetCharacters && n.targetCharacters.length > 0) {
                  const a = await Y(n.targetCharacters, t);
                  a && e.push(a);
                }
              a.content = e.join('\n\n');
            }
            break;
          case 'page':
            !n.currentPage ||
              (n.worldbookReadMode && 'tag' !== n.worldbookReadMode) ||
              (a.content = await I(n.currentPage, t));
            break;
          case 'page-info':
            a.content = q(n.currentView, n.targetCharacters, n.allCharacters, n.extraInfo);
            break;
          case 'format':
            a.content = L(n.currentView, n.formatGuide);
            break;
          case 'input':
            n.userInput && (a.content = n.userInput);
        }
        return a;
      }),
    );
  }
  function R(e) {
    return e
      .filter((e) => e.content.trim())
      .map((e) => ({
        role: e.role,
        content: e.content,
      }));
  }
}
