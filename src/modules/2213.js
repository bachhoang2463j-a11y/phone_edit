// webpack 模块 2213（提取自 phone_index_fixed.js）
import { createAvatar } from '@dicebear/core';
import * as avataaars from '@dicebear/avataaars';
import * as bigSmile from '@dicebear/big-smile';
import * as bottts from '@dicebear/bottts';
import * as croodles from '@dicebear/croodles';
import * as funEmoji from '@dicebear/fun-emoji';
import * as micah from '@dicebear/micah';
import * as miniavs from '@dicebear/miniavs';
import * as personas from '@dicebear/personas';
import * as pixelArt from '@dicebear/pixel-art';
import * as thumbs from '@dicebear/thumbs';
export default function (e, n, t) {
  t.d(n, {
    FI: () => u,
    Gf: () => y,
    IS: () => Y,
    KI: () => f,
    MI: () => E,
    Ns: () => S,
    Sp: () => j,
    U_: () => d,
    ar: () => A,
    bX: () => B,
    ev: () => p,
    f6: () => T,
    jH: () => k,
    nC: () => m,
    qU: () => I,
    sd: () => G,
    uk: () => M,
    wH: () => C,
    xd: () => W,
  });
  var a = t(7856),
    o = t.n(a),
    r = t(2224),
    i = t.n(r),
    s = t(8366),
    l = t(5849),
    c = t(9852);
  function A() {
    try {
      const e =
          getVariables({
            type: 'character',
          }) || {},
        n = i().get(e, 'phone_data');
      if (n && Array.isArray(n.characters))
        return {
          characters: n.characters,
          randomAvatars: n.randomAvatars || [],
        };
    } catch (e) {
      console.warn('[Data] 无法从角色变量读取基本信息:', e);
    }
    return (
      console.info('[Data] 使用示例数据'),
      {
        characters: l.hg || [],
        randomAvatars: l.I1 || [],
      }
    );
  }
  function d() {
    return A().randomAvatars || [];
  }
  // 自动兜底头像：DiceBear 开源头像库 10 风格本地渲染（按名字确定性生成，同名恒定，dataUri 内联零外部请求），
  // 与用户随机头像池（phone_data.randomAvatars）按 hash 混用，提升无专设头像角色的丰富度。
  // 每个名字只生成一次（Map 缓存），实测桌面端单次约 0.1ms，移动端可忽略。
  // 风格选取已裁剪最重的 4 个包（notionists/adventurer/open-peeps/lorelei）控制体积
  const generatedAvatarStyles = {
    avataaars,
    bigSmile,
    bottts,
    croodles,
    funEmoji,
    micah,
    miniavs,
    personas,
    pixelArt,
    thumbs,
  };
  const generatedAvatarStyleNames = Object.keys(generatedAvatarStyles);
  let generatedAvatarCache = null;
  function p(e) {
    const name = String(e ?? '匿名');
    const h = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    if (0 === h % 4) {
      const n = d();
      if (n.length > 0) return n[h % n.length];
    }
    if (!generatedAvatarCache) generatedAvatarCache = new Map();
    if (generatedAvatarCache.has(name)) return generatedAvatarCache.get(name);
    const styleName = generatedAvatarStyleNames[h % generatedAvatarStyleNames.length];
    const uri = (0, createAvatar)(generatedAvatarStyles[styleName], { seed: name, flip: h % 2 === 0 }).toDataUri();
    generatedAvatarCache.set(name, uri);
    return uri;
  }
  function C(e) {
    const n = m(e);
    if (n?.avatar) return n.avatar;
    const t = g(e);
    return t?.avatar ? t.avatar : p(e);
  }
  function m(e) {
    const { characters: n } = A();
    return n?.find((n) => n.name === e) || n?.find((n) => n.nickname === e);
  }
  function g(e) {
    try {
      const n =
          getVariables({
            type: 'character',
          }) || {},
        t = i().get(n, 'phone_data.user');
      if (t && (t.name === e || t.nickname === e)) return t;
    } catch (e) {
      console.warn('[Data] 无法读取用户信息:', e);
    }
  }
  function u(e) {
    const n = m(e);
    if (n) return n.nickname || n.name || e;
    const t = g(e);
    return (t && (t.nickname || t.name)) || e;
  }
  function f(e) {
    return m(e)?.name || e;
  }
  const b = s;
  function v(e) {
    return Array.isArray(e)
      ? e
          .filter((e) => {
            const n = 'string' == typeof e?.name ? e.name.trim() : '',
              t = 'string' == typeof e?.url ? e.url.trim() : '';
            return Boolean(n && t);
          })
          .map((e) => ({
            name: e.name.trim(),
            url: e.url.trim(),
          }))
      : [];
  }
  function x() {
    try {
      const e =
        getVariables({
          type: 'global',
        }) || {};
      return !0 === i().get(e, 'phone_use_global_sticker_library');
    } catch {
      return !1;
    }
  }
  function h() {
    const e = (function () {
      if (x()) {
        try {
          const e =
              getVariables({
                type: 'global',
              }) || {},
            n = v(i().get(e, 'phone_global_sticker_library'));
          if (n.length > 0) return n;
        } catch (e) {
          console.warn('[Data] 获取全局表情包库失败:', e);
        }
        return b;
      }
      try {
        const e = getVariables({
            type: 'character',
          }),
          n = v(i().get(e, 'phone_sticker_library'));
        if (n.length > 0) return n;
      } catch (e) {
        console.warn('[Data] 获取保存的表情包库失败:', e);
      }
      return b;
    })();
    if (x()) return e;
    const n = (function () {
        try {
          const e = getVariables({
              type: 'character',
            }),
            n = i().get(e, 'phone_character_sticker_library');
          return n && 'object' == typeof n ? n : {};
        } catch {
          return {};
        }
      })(),
      t = Object.values(n)
        .flat()
        .filter((e) => Boolean(e && 'string' == typeof e.name && 'string' == typeof e.url));
    return [...e, ...t];
  }
  function B(e) {
    const n = h().find((n) => n.name === e);
    return n?.url || null;
  }
  function y(e) {
    if (e.startsWith('http://') || e.startsWith('https://')) return e;
    const n = (function () {
      try {
        const e = getVariables({
            type: 'character',
          }),
          n = i().get(e, 'phone_character_images');
        return n && 'object' == typeof n ? n : {};
      } catch {
        return {};
      }
    })();
    for (const t of Object.values(n)) {
      const n = t.find((n) => n.name === e);
      if (n) return n.url;
    }
    return null;
  }
  function k(e) {
    if (!e) return null;
    if (e.startsWith('http://') || e.startsWith('https://')) return e;
    const n = (function () {
      try {
        const e = getVariables({
            type: 'character',
          }),
          n = i().get(e, 'phone_character_live_images');
        return n && 'object' == typeof n ? n : {};
      } catch {
        return {};
      }
    })();
    for (const t of Object.values(n)) {
      const n = t.find((n) => n.name === e);
      if (n) return n.url;
    }
    return null;
  }
  function E(e, n) {
    const t = {
      id: `${n + 1}`,
      time: e.time,
      isMe: e.me ?? !1,
    };
    switch (
      (e.sender &&
        (t.sender = {
          name: e.sender.name,
          avatar: C(e.sender.name),
        }),
      e.t)
    ) {
      case 'text':
        return {
          ...t,
          type: 'text',
          content: e.c,
        };
      case 'image':
        return {
          ...t,
          type: 'image',
          content: e.c,
          description: e.desc,
          prompt: e.prompt ?? null,
        };
      case 'sticker':
        return {
          ...t,
          type: 'sticker',
          content: e.c,
        };
      case 'imgdesc':
        return {
          ...t,
          type: 'text-image',
          content: e.c,
          description: e.c,
          prompt: e.prompt ?? null,
        };
      case 'voice':
        return {
          ...t,
          type: 'voice',
          duration: '0:15',
          voiceText: e.c,
          audioFile: e.audio,
        };
      case 'transfer':
        return {
          ...t,
          type: 'transfer',
          amount: String(e.amt || '0'),
          note: e.note,
          transferTime: e.transferTime,
        };
      case 'location':
        return {
          ...t,
          type: 'location',
          partnerLocation: e.partnerLoc,
          userLocation: e.myLoc,
          distance: e.dist,
        };
      case 'recalled':
        return {
          ...t,
          type: 'recalled',
          originalContent: e.orig,
        };
      case 'news':
        return {
          ...t,
          type: 'news',
          title: e.title,
          source: e.source,
          publishDate: e.publishDate,
          views: e.views,
          content: e.content,
          keyData: e.keyData,
          likes: e.likes,
          comments: e.comments,
        };
      case 'link':
        return {
          ...t,
          type: 'browser-share',
          title: e.title,
          source: e.source,
          description: e.preview,
          url: e.url,
        };
      case 'file':
        return {
          ...t,
          type: 'file',
          filename: e.name,
          filesize: e.size,
          description: e.desc,
        };
      case 'quote':
        return {
          ...t,
          type: 'quote',
          content: e.c,
          quote: e.quote
            ? {
                name: e.quote.name,
                type: e.quote.t,
                content: e.quote.c,
              }
            : void 0,
        };
      case 'call':
        return {
          ...t,
          type: 'call',
          callStatus: e.status || '通话中',
        };
      case 'call-ended':
        return {
          ...t,
          type: 'call-ended',
          duration: e.duration || '0:00',
        };
      case 'transfer-accepted':
        return {
          ...t,
          type: 'transfer-accepted',
          amount: String(e.amt || '0'),
        };
      case 'transfer-rejected':
        return {
          ...t,
          type: 'transfer-rejected',
          amount: String(e.amt || '0'),
        };
      case 'poke':
        return {
          ...t,
          type: 'poke',
        };
      case 'listen-together':
        return {
          ...t,
          type: 'listen-together',
        };
      case 'listen-accepted':
        return {
          ...t,
          type: 'listen-accepted',
        };
      case 'listen-rejected':
        return {
          ...t,
          type: 'listen-rejected',
        };
      case 'order':
        return {
          ...t,
          type: 'order',
          order: e.order || null,
        };
      default:
        return {
          ...t,
          type: 'text',
          content: e.c || '[未知消息]',
        };
    }
  }
  function w(e) {
    if (!e) return '暂无消息';
    switch (e.t) {
      case 'text':
      default:
        return e.c || '暂无消息';
      case 'image':
      case 'imgdesc':
        return '[图片]';
      case 'sticker':
        return '[表情]';
      case 'voice':
        return '[语音]';
      case 'transfer':
        return '[转账]';
      case 'location':
        return '[位置]';
      case 'recalled':
        return '[消息已撤回]';
      case 'news':
        return '[新闻分享]';
      case 'link':
        return '[链接]';
      case 'file':
        return '[文件]';
      case 'quote':
        return `${e.quote?.name ? `@${e.quote.name} ` : ''}${e.c || ''}`.trim() || '[引用]';
      case 'call':
        return '[语音通话]';
      case 'call-ended':
        return '[通话结束]';
      case 'transfer-accepted':
        return '[已领取转账]';
      case 'transfer-rejected':
        return '[已拒绝转账]';
      case 'listen-together':
        return '[一起听]';
      case 'listen-accepted':
        return '[已接受一起听]';
      case 'listen-rejected':
        return '[已拒绝一起听]';
      case 'order':
        return '[订单]';
    }
  }
  function N(e, n) {
    return 'private' === n
      ? (function (e) {
          const n = String(e || '').trim();
          if (!n) return '';
          if (n.includes(',')) {
            const e = n
              .split(',')
              .map((e) => e.trim())
              .filter(Boolean)
              .sort((e, n) => e.localeCompare(n, 'zh-CN'));
            return 2 === e.length ? `${e[0]},${e[1]}` : e.join(',');
          }
          if (n.includes('和')) {
            const e = n
              .split('和')
              .map((e) => e.trim())
              .filter(Boolean)
              .sort((e, n) => e.localeCompare(n, 'zh-CN'));
            if (2 === e.length) return `${e[0]},${e[1]}`;
          }
          return n;
        })(e)
      : String(e || '').trim();
  }
  function F(e, n) {
    const t = String(n?.kind || '').trim();
    if ('private' === t || 'group' === t) return t;
    return String(e || '')
      .trim()
      .includes(',')
      ? 'private'
      : 'group';
  }
  function V(e, n) {
    return 'private' === e ? n.replace(',', ' · ') : n;
  }
  function D() {
    const e = new Map();
    try {
      const n = getLastMessageId();
      if (n < 0) return e;
      const t = (0, c.Q)().historyReadCount,
        a = 0 === t ? 0 : Math.max(0, n - t + 1),
        r = getChatMessages(`${a}-${n}`);
      if (!r || 0 === r.length) return e;
      const i = /<chat_history\s+target="([^"]+)"\s+type="(private|group)"[^>]*>([\s\S]*?)<\/chat_history>/g;
      for (let n = r.length - 1; n >= 0; n--) {
        const t = r[n];
        let a;
        const s = String(t.message || '');
        for (; null !== (a = i.exec(s));) {
          const n = a[1],
            r = a[2],
            i = a[3].trim(),
            s = `${r}:${n}`;
          if (!e.has(s))
            try {
              const a = o().parse(i);
              a &&
                a.messages &&
                Array.isArray(a.messages) &&
                e.set(s, {
                  target: n,
                  type: r,
                  messages: a.messages,
                  messageId: t.message_id,
                });
            } catch (e) {
              console.warn(`[Data] 解析楼层 ${t.message_id} 的聊天记录失败:`, e);
            }
        }
        i.lastIndex = 0;
      }
    } catch (e) {
      console.error('[Data] 读取酒馆聊天历史失败:', e);
    }
    return e;
  }
  function S() {
    const e = [];
    try {
      const n = D();
      if (0 === n.size) return e;
      let t = -1;
      for (const e of n.values()) e.messageId > t && (t = e.messageId);
      const a = A().characters || [],
        o = new Set();
      for (const e of a) (e?.name && o.add(String(e.name).trim()), e?.nickname && o.add(String(e.nickname).trim()));
      try {
        const e =
            getVariables({
              type: 'character',
            }) || {},
          n = i().get(e, 'phone_data.user');
        (n?.name && o.add(String(n.name).trim()), n?.nickname && o.add(String(n.nickname).trim()));
      } catch {}
      for (const a of n.values()) {
        if ('private' !== a.type) continue;
        const n = String(a.target || '').trim();
        if (!n) continue;
        if (o.has(n)) continue;
        if (!Array.isArray(a.messages) || 0 === a.messages.length) continue;
        if (!a.messages.some((e) => !e?.me)) continue;
        const r = a.messages[a.messages.length - 1],
          i = w(r),
          s = String(r?.time || '').trim() || '00:00';
        e.push({
          id: `nf_${n}`,
          name: n,
          avatar: p(n),
          preview: i,
          time: s,
          unread: a.messageId === t,
          messageId: a.messageId,
        });
      }
      e.sort((e, n) =>
        e.unread && !n.unread
          ? -1
          : !e.unread && n.unread
            ? 1
            : e.messageId !== n.messageId
              ? n.messageId - e.messageId
              : n.time.localeCompare(e.time),
      );
    } catch (e) {
      console.error('[Data] 读取新朋友列表失败:', e);
    }
    return e;
  }
  function M() {
    const e = [];
    try {
      const n = getLastMessageId();
      if (n < 0) return e;
      const t = (0, c.Q)().historyReadCount,
        a = 0 === t ? 0 : Math.max(0, n - t + 1),
        r = getChatMessages(`${a}-${n}`);
      if (!r || 0 === r.length) return e;
      const i = new Map(),
        s = /<chat_history[^>]*\btype="peek"[^>]*>([\s\S]*?)<\/chat_history>/g;
      for (let e = r.length - 1; e >= 0; e--) {
        const n = r[e],
          t = 'number' == typeof n?.message_id ? n.message_id : e,
          a = String(n.message || '');
        let l;
        for (; null !== (l = s.exec(a));) {
          const e = a.substring(l.index, l.index + l[0].indexOf('>') + 1).match(/target="([^"]+)"/),
            n = e ? e[1] : '';
          try {
            const e = l[1].trim(),
              a = o().parse(e);
            if (!a?.messages || !Array.isArray(a.messages)) continue;
            const r = F(n, a),
              s = N(n, r);
            if (!s) continue;
            const c = `${r}:${s}`;
            i.has(c) ||
              i.set(c, {
                target: s,
                kind: r,
                messages: a.messages,
                messageId: t,
              });
          } catch (e) {
            console.warn(`[Data] 解析楼层 ${t} 的偷看记录失败:`, e);
          }
        }
        s.lastIndex = 0;
      }
      if (0 === i.size) return e;
      let l = -1;
      for (const e of i.values()) e.messageId > l && (l = e.messageId);
      for (const n of i.values()) {
        const t = n.messages[n.messages.length - 1],
          a = w(t),
          o = t?.time || '00:00',
          r = V(n.kind, n.target),
          i = ('private' === n.kind && n.target.split(',')[0]) || n.target;
        e.push({
          id: `peek_${n.kind}_${n.target}`,
          kind: n.kind,
          target: n.target,
          name: r,
          avatar: p(i),
          preview: a,
          time: o,
          unread: n.messageId === l,
          messageId: n.messageId,
        });
      }
    } catch (e) {
      console.error('[Data] 读取偷看聊天列表失败:', e);
    }
    return e;
  }
  function I(e, n, t = 100) {
    const a = [];
    try {
      const r = getLastMessageId();
      if (r < 0) return a;
      const i = (0, c.Q)().historyReadCount,
        s = 0 === i ? 0 : Math.max(0, r - i + 1),
        l = getChatMessages(`${s}-${r}`);
      if (!l || 0 === l.length) return a;
      const A = N(e, n),
        d = new RegExp('<chat_history[^>]*\\btype="peek"[^>]*>([\\s\\S]*?)</chat_history>', 'g');
      for (let e = l.length - 1; e >= 0 && a.length < t; e--) {
        const t = l[e],
          r = 'number' == typeof t?.message_id ? t.message_id : e,
          i = String(t.message || '');
        let s;
        const c = [];
        for (; null !== (s = d.exec(i));) {
          const e = i.substring(s.index, s.index + s[0].indexOf('>') + 1).match(/target="([^"]+)"/),
            t = e ? e[1] : '';
          try {
            const e = s[1].trim(),
              a = o().parse(e);
            if (!a?.messages || !Array.isArray(a.messages)) continue;
            const i = F(t, a),
              l = N(t, i);
            if (i !== n) continue;
            if (l !== A) continue;
            const d = {
              info: {
                name: a.name || V(n, A),
                kind: n,
                date: a.date,
                time: a.time,
              },
              messages: a.messages,
              messageId: r,
              blockIndex: c.length,
            };
            c.push(d);
          } catch (e) {
            console.warn(`[Data] 解析楼层 ${r} 的偷看记录失败:`, e);
          }
        }
        ((d.lastIndex = 0), a.unshift(...c));
      }
    } catch (e) {
      console.error('[Data] 读取偷看历史失败:', e);
    }
    return a;
  }
  function T() {
    const e = [],
      n = A().characters || [],
      t = D();
    let a = -1;
    for (const e of t.values()) e.messageId > a && (a = e.messageId);
    let o = {};
    try {
      o =
        getVariables({
          type: 'character',
        }) || {};
    } catch (e) {
      console.warn('[Data] 无法读取角色变量:', e);
    }
    let r = [];
    (n.length > 0 && (r = n.map((e) => e.name)),
      console.info('[Data] privateChats 来源: phone_data.characters, 数量:', r.length));
    let i = [];
    (Array.isArray(o.phone_group_chats) ? (i = o.phone_group_chats) : o.phone_data?.groups && (i = o.phone_data.groups),
      console.info('[Data] 聊天列表配置:', {
        privateChats: r,
        groupChats: i,
        tavernHistoryKeys: Array.from(t.keys()),
        latestMessageId: a,
      }));
    for (const o of r) {
      const r = n.find((e) => e.name === o),
        i = `private:${o}`,
        s = t.get(i);
      let l = '暂无消息',
        c = '00:00',
        A = 0;
      if (s && s.messages.length > 0) {
        const e = s.messages[s.messages.length - 1];
        ((l = w(e)), (c = e.time || '00:00'), s.messageId === a && (A = s.messages.length));
      }
      e.push({
        id: r?.id || `char_${o}`,
        type: 'single',
        name: o,
        avatar: r?.avatar || p(o),
        preview: l,
        time: c,
        unread: A,
      });
    }
    for (const n of i) {
      const o = `group:${n.name}`,
        r = t.get(o);
      let i = '暂无消息',
        s = '00:00',
        l = 0;
      if (r && r.messages.length > 0) {
        const e = r.messages[r.messages.length - 1];
        ((i = w(e)), (s = e.time || '00:00'), r.messageId === a && (l = r.messages.length));
      }
      e.push({
        id: n.id || `group_${n.name}`,
        type: 'group',
        name: n.name,
        avatar: n.avatar || p(n.name),
        preview: i,
        time: s,
        unread: l,
      });
    }
    return e;
  }
  function Y(e, n = 100) {
    const t = [];
    try {
      const a = getLastMessageId();
      if (a < 0) return t;
      const r = (0, c.Q)().historyReadCount,
        i = 0 === r ? 0 : Math.max(0, a - r + 1),
        s = getChatMessages(`${i}-${a}`);
      if (!s || 0 === s.length) return t;
      const l = new RegExp(`<chat_history\\s+target="${e}"\\s+type="private"[^>]*>([\\s\\S]*?)</chat_history>`, 'g');
      for (let a = s.length - 1; a >= 0 && t.length < n; a--) {
        const n = s[a];
        let r;
        const i = String(n.message || ''),
          c = [];
        for (; null !== (r = l.exec(i));)
          try {
            const t = r[1].trim(),
              a = o().parse(t);
            if (a?.messages && Array.isArray(a.messages)) {
              const t = {
                info: {
                  name: a.name || e,
                  date: a.date,
                  time: a.time,
                  emotion: a.emotion,
                  location: a.location,
                  state: a.state,
                  thought: a.thought,
                },
                messages: a.messages,
                messageId: n.message_id,
                blockIndex: c.length,
              };
              c.push(t);
            }
          } catch (e) {
            console.warn(`[Data] 解析楼层 ${n.message_id} 的私聊记录失败:`, e);
          }
        ((l.lastIndex = 0), t.unshift(...c));
      }
      const A = t.reduce((e, n) => e + n.messages.length, 0);
      console.info(`[Data] 读取 ${e} 的私聊记录: ${t.length} 层, ${A} 条消息`);
    } catch (e) {
      console.error('[Data] 读取私聊历史失败:', e);
    }
    return t;
  }
  function j(e, n = 100) {
    const t = [];
    try {
      const a = getLastMessageId();
      if ((console.info(`[Data] 群聊历史 - lastMsgId: ${a}, 群名: "${e}"`), a < 0)) return t;
      let r = '',
        s = 0;
      try {
        const n =
            getVariables({
              type: 'character',
            }) || {},
          t = Array.isArray(n.phone_group_chats) ? n.phone_group_chats : i().get(n, 'phone_data.groups');
        if (Array.isArray(t)) {
          const n = t.find((n) => String(n?.name || '').trim() === e);
          r = 'string' == typeof n?.avatar ? n.avatar : '';
          const a = Array.isArray(n?.mainMembers) ? n.mainMembers.length : Number(n?.members);
          s = Number.isFinite(a) ? a : 0;
        }
      } catch (e) {
        console.warn('[Data] 读取群聊头像失败(忽略):', e);
      }
      const l = r || p(e),
        A = (0, c.Q)().historyReadCount,
        d = 0 === A ? 0 : Math.max(0, a - A + 1),
        C = getChatMessages(`${d}-${a}`);
      if (!C || 0 === C.length) return t;
      const m = new RegExp('<chat_history[^>]*\\btype="group"[^>]*>([\\s\\S]*?)</chat_history>', 'g');
      for (let a = C.length - 1; a >= 0 && t.length < n; a--) {
        const n = C[a],
          r = 'number' == typeof n?.message_id ? n.message_id : a,
          i = String(n.message || '');
        let c;
        const A = [];
        for (; null !== (c = m.exec(i));) {
          const n = i.substring(c.index, c.index + c[0].indexOf('>') + 1).match(/target="([^"]+)"/);
          if ((n ? String(n[1]).trim() : '') === String(e || '').trim())
            try {
              const n = c[1].trim(),
                t = o().parse(n);
              if (t?.messages && Array.isArray(t.messages)) {
                const n = Number(t?.members),
                  a = {
                    info: {
                      id: e,
                      name: e,
                      avatar: l,
                      members: Number.isFinite(n) ? n : s,
                      date: t?.date,
                      time: t?.time,
                    },
                    messages: t.messages,
                    messageId: r,
                    blockIndex: A.length,
                  };
                (A.push(a), console.info(`[Data] 群聊历史 - 找到楼层 ${r}, 消息数: ${t.messages.length}`));
              }
            } catch (e) {
              console.warn(`[Data] 解析楼层 ${r} 的群聊记录失败:`, e);
            }
        }
        ((m.lastIndex = 0), t.unshift(...A));
      }
      const g = t.reduce((e, n) => e + n.messages.length, 0);
      console.info(`[Data] 读取 ${e} 的群聊记录: ${t.length} 层, ${g} 条消息`);
    } catch (e) {
      console.error('[Data] 读取群聊历史失败:', e);
    }
    return t;
  }
  function G(e) {
    const n = [];
    try {
      const t = getLastMessageId();
      if (t < 0) return n;
      const a = (0, c.Q)(),
        r = a.historyReadCount,
        i = 0 === r ? 0 : Math.max(0, t - r + 1),
        s = getChatMessages(`${i}-${t}`);
      if (!s || 0 === s.length) return n;
      const l = ((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))(String(e || '')),
        A = new RegExp(
          `<phone_module\\s+type="listenTogether"\\s+character="${l}"[^>]*>([\\s\\S]*?)</phone_module>`,
          'g',
        ),
        d = (e) => {
          const n = [],
            t = String(e?.message || ''),
            a = 'number' == typeof e?.message_id ? e.message_id : -1;
          let r;
          for (; null !== (r = A.exec(t));)
            try {
              const e = String(r?.[1] || '').trim();
              if (!e) continue;
              const t = o().parse(e);
              t?.messages &&
                Array.isArray(t.messages) &&
                n.push({
                  info: {
                    name: t.name,
                    date: t.date,
                    time: t.time,
                    state: t.state,
                    thought: t.thought,
                  },
                  messages: t.messages,
                  messageId: a,
                });
            } catch (e) {
              console.warn(`[Data] 解析楼层 ${a} 的一起听记录失败:`, e);
            }
          return ((A.lastIndex = 0), n);
        };
      if (a.appendToLastMessage)
        for (let e = 0; e < s.length; e++) {
          const t = d(s[e]);
          t.length > 0 && n.push(...t);
        }
      else
        for (let e = s.length - 1; e >= 0; e--) {
          const t = d(s[e]);
          if (0 === t.length) break;
          n.unshift(...t);
        }
      const p = n.reduce((e, n) => e + n.messages.length, 0);
      console.info(`[Data] 读取 ${e} 的一起听记录: ${n.length} 层, ${p} 条消息`);
    } catch (e) {
      console.error('[Data] 读取一起听历史失败:', e);
    }
    return n;
  }
  async function W(e, n, t, a = !1) {
    try {
      const r = Date.now(),
        i = {
          name: t.name || e,
          date: t.date,
          time: t.time,
          state: t.state || '',
          thought: t.thought || '',
          messages: n,
        },
        s = `<phone_module type="listenTogether" character="${e}" timestamp="${r}">\n${o().stringify(i)}</phone_module>`;
      if (a) {
        const e = getLastMessageId();
        if (e >= 0) {
          const n = getChatMessages(String(e)) || getChatMessages(`${e}-${e}`);
          if (n && n.length > 0) {
            const t = n[0].message + '\n\n' + s;
            return (
              await setChatMessages([
                {
                  message_id: e,
                  message: t,
                },
              ]),
              console.info('[Data] 一起听记录已追加到楼层', e),
              !0
            );
          }
        }
      }
      return (
        await createChatMessages([
          {
            role: 'assistant',
            message: s,
            is_hidden: !1,
          },
        ]),
        console.info('[Data] 一起听记录已保存到新楼层'),
        !0
      );
    } catch (e) {
      return (console.error('[Data] 保存一起听历史失败:', e), !1);
    }
  }
}
