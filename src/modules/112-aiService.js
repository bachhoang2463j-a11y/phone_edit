// webpack 模块 112（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.d(n, {
    D6: () => ae,
    callAiWithPreset: () => j,
    e4: () => V,
    e_: () => Fe,
    fetchBrowserDataFromAi: () => Be,
    fetchCalendarDataFromAi: () => we,
    fetchDiaryDataFromAi: () => Ne,
    fetchDynamicDataFromAi: () => ie,
    fetchDynamicHomeDataFromAi: () => se,
    fetchEmailDataFromAi: () => he,
    fetchForumDataFromAi: () => me,
    fetchForumPostDataFromAi: () => ge,
    fetchGroupChatDataFromAi: () => ke,
    fetchLiveDataFromAi: () => fe,
    fetchLiveListDataFromAi: () => ue,
    fetchMapDataFromAi: () => re,
    fetchPrivateChatDataFromAi: () => ye,
    fetchShopHomeDataFromAi: () => Ae,
    fetchShopProductDataFromAi: () => de,
    fetchShopSearchDataFromAi: () => Ce,
    fetchShopSellerDataFromAi: () => pe,
    fetchVoiceCallDataFromAi: () => Ee,
    fv: () => oe,
    generateDynamicReplyFromAi: () => ee,
    generateForumPostForumCommentFromAi: () => J,
    loadApiConfigForView: () => k,
    parseJsonFromResponse: () => te,
    parseYamlFromResponse: () => ne,
    postUserDynamic: () => be,
    postUserForumPost: () => ve,
    sendUserEmail: () => xe,
  });
  var a = t(2224),
    o = t.n(a),
    r = t(7856),
    i = t.n(r),
    s = t(4592),
    l = t(8700),
    c = t(920),
    A = t(2213),
    d = t(5756),
    p = t(5130),
    C = t(1243);
  function m() {
    return new Promise((e) => setTimeout(e, 0));
  }
  const g = '禁止复述用户的输入内容',
    u = 8e3,
    f = ['shopHome', 'shopProduct', 'shopSeller', 'shopSearch'];
  function b(e) {
    if (!e || 'object' != typeof e) return;
    const n = o().cloneDeep(e);
    for (const e of ['tags', 'natural', 'naturalEn']) {
      const t = n[e];
      if (t && 'object' == typeof t) for (const e of f) delete t[e];
    }
    return n;
  }
  function v(e) {
    const n = String(e ?? '').trim();
    switch (n) {
      case 'text-image':
      case 'textImage':
      case 'imgDesc':
        return 'imgdesc';
      case 'browser-share':
      case 'browserShare':
        return 'link';
      default:
        return n;
    }
  }
  function x(e) {
    if (!e || 'object' != typeof e) return e;
    const n = {
      ...e,
    };
    if (
      (null == n.t && null != n.type && (n.t = n.type),
      null == n.c && null != n.content && (n.c = n.content),
      (n.t = v(n.t)),
      null != n.time && (n.time = String(n.time)),
      'file' === n.t &&
        (null == n.name && null != n.filename && (n.name = n.filename),
        null == n.size && null != n.filesize && (n.size = n.filesize),
        null == n.desc && null != n.description && (n.desc = n.description)),
      'link' === n.t && null == n.preview && null != n.description && (n.preview = n.description),
      'quote' === n.t)
    ) {
      null != n.c && (n.c = String(n.c));
      const e = n.quote;
      if (e && 'object' == typeof e) {
        const t = {
          ...e,
        };
        (null == t.t && null != t.type && (t.t = t.type),
          null == t.c && null != t.content && (t.c = t.content),
          (t.t = v(t.t || 'text')),
          null != t.name && (t.name = String(t.name)),
          null != t.c && (t.c = String(t.c)),
          (n.quote = t));
      }
    }
    return ('quote' !== n.t && null != n.c && 'string' != typeof n.c && (n.c = String(n.c)), n);
  }
  function h(e) {
    if (!Array.isArray(e)) return e;
    const n = e.length,
      t = e.filter((e) => {
        const n = e.t || e.type || '',
          t = e.c || e.content,
          a = null != t ? String(t) : '';
        if ('sticker' === n || 'image' === n) {
          const e = (function (e, n) {
            if (!n) return !1;
            if (n.startsWith('http://') || n.startsWith('https://')) return !0;
            if ('sticker' === e) return !!(0, A.bX)(n) || (console.info(`[AI Service] 表情包不存在于库中: ${n}`), !1);
            if ('image' === e) return !!(0, A.Gf)(n) || (console.info(`[AI Service] 图片不存在于库中: ${n}`), !1);
            return !0;
          })(n, a);
          return (e || console.warn(`[AI Service] 过滤无效媒体消息: type=${n}, content=${a}`), e);
        }
        return !0;
      });
    return (t.length < n && console.info(`[AI Service] 消息过滤完成: 原始${n}条, 保留${t.length}条`), t);
  }
  function B(e) {
    if (!e) return e;
    const n = o().cloneDeep(e);
    return (
      Array.isArray(n.messages) && ((n.messages = n.messages.map(x)), (n.messages = h(n.messages))),
      n.group_message &&
        Array.isArray(n.group_message.messages) &&
        ((n.group_message.messages = n.group_message.messages.map(x)),
        (n.group_message.messages = h(n.group_message.messages))),
      n
    );
  }
  function y(e) {
    const n = e ?? {},
      t = 'number' == typeof n.maxTokens ? n.maxTokens : u,
      a = Number.isFinite(t) ? Math.max(1, Math.floor(t)) : u;
    return {
      url: n.url || '',
      key: n.key || '',
      model: n.model || '',
      apiFormat: 'gemini' === n.apiFormat ? 'gemini' : 'openai',
      temperature: 'number' == typeof n.temperature ? n.temperature : 1,
      maxTokens: a,
    };
  }
  function k(e) {
    const n = (function () {
        const e = {
            version: 2,
            enableSecondApi: !1,
            primary: y({}),
            secondary: y({}),
            viewApiMap: {},
          },
          n = localStorage.getItem('phone_api_config');
        if (!n) return e;
        try {
          const e = JSON.parse(n);
          return e && 'object' == typeof e && e.primary
            ? {
                version: 2,
                enableSecondApi: Boolean(e.enableSecondApi),
                primary: y(e.primary),
                secondary: y(e.secondary),
                viewApiMap: e.viewApiMap && 'object' == typeof e.viewApiMap ? e.viewApiMap : {},
              }
            : {
                version: 2,
                enableSecondApi: !1,
                primary: y(e),
                secondary: y({}),
                viewApiMap: {},
              };
        } catch {
          return e;
        }
      })(),
      t = Boolean(e) && n.enableSecondApi && n.viewApiMap && 'secondary' === n.viewApiMap[e],
      a = n.primary,
      o = n.secondary;
    return t && o.url && o.key && o.model ? o : a;
  }
  function E() {
    const e = F(),
      n = (0, c.loadNovelAiConfig)().promptComposeMode,
      t = N(e.formatGuide, e.formatGuideDrawing, n),
      a = w(p.blocks || []);
    return {
      id: 'default',
      name: p.name,
      blocks: a,
      formatGuide: t,
      formatGuideDrawing: e.formatGuideDrawing,
      historyConfig: e.historyConfig,
      createdAt: p.exportedAt || Date.now(),
      updatedAt: p.exportedAt || Date.now(),
    };
  }
  function w(e) {
    const n = Array.isArray(e) ? e : [],
      t = (p?.blocks || []).filter((e) => Boolean(e?.fixed)),
      a = new Set(n.map((e) => e.id)),
      o = t.filter((e) => !a.has(e.id));
    return 0 === o.length
      ? n
      : [
          ...o.map((e) => ({
            ...e,
          })),
          ...n,
        ];
  }
  function N(e, n, t) {
    if (!n) return e;
    if ('none' === t) return e;
    const a = 'tags' === t ? n.tags : 'natural' === t ? n.natural : n.naturalEn;
    return a
      ? {
          ...e,
          ...a,
        }
      : e;
  }
  function F() {
    const e = {
      formatGuide: d.formatGuide,
      formatGuideDrawing: b(d.formatGuideDrawing),
      historyConfig: d.historyConfig,
      stickerRecognitionEnabled: !1,
    };
    try {
      const n = localStorage.getItem('phone_other_settings');
      if (n) {
        const t = JSON.parse(n),
          a =
            t?.formatGuide && 'object' == typeof t.formatGuide
              ? {
                  ...e.formatGuide,
                  ...t.formatGuide,
                }
              : e.formatGuide,
          o =
            t?.formatGuideDrawing && 'object' == typeof t.formatGuideDrawing
              ? b(t.formatGuideDrawing)
              : e.formatGuideDrawing,
          r =
            t?.historyConfig && 'object' == typeof t.historyConfig
              ? {
                  ...e.historyConfig,
                  ...t.historyConfig,
                }
              : e.historyConfig;
        return {
          formatGuide: a,
          formatGuideDrawing: o,
          historyConfig: r,
          stickerRecognitionEnabled: !0 === t?.stickerRecognitionEnabled,
        };
      }
    } catch {}
    try {
      const n = localStorage.getItem('phone_presets');
      if (!n) return e;
      const t = JSON.parse(n),
        a = t?.activePresetId,
        o = Array.isArray(t?.presets) ? t.presets : [],
        r = 'string' == typeof a ? o.find((e) => e?.id === a) : null,
        i = r?.formatGuide,
        s = r?.historyConfig,
        l = r?.formatGuideDrawing;
      return {
        formatGuide:
          i && 'object' == typeof i
            ? {
                ...e.formatGuide,
                ...i,
              }
            : e.formatGuide,
        formatGuideDrawing: l && 'object' == typeof l ? b(l) : e.formatGuideDrawing,
        historyConfig:
          s && 'object' == typeof s
            ? {
                ...e.historyConfig,
                ...s,
              }
            : e.historyConfig,
        stickerRecognitionEnabled: !1,
      };
    } catch {
      return e;
    }
  }
  function V() {
    const e = localStorage.getItem('phone_presets');
    if (!e) return E();
    const n = E();
    try {
      const t = JSON.parse(e),
        a = t.presets || [],
        o = t.activePresetId,
        r = 'builtin_drawing_tags' === o || 'builtin_drawing_natural' === o ? 'builtin_default' : o;
      if (!r) return n;
      const i =
          ('string' == typeof r
            ? 'builtin_default' === r
              ? {
                  ...E(),
                  id: 'builtin_default',
                }
              : null
            : null) ||
          a.find((e) => e.id === r) ||
          n,
        s = F(),
        l = (0, c.loadNovelAiConfig)().promptComposeMode,
        A = N(s.formatGuide, s.formatGuideDrawing, l);
      return {
        ...i,
        blocks: w(i.blocks),
        formatGuide: A,
        formatGuideDrawing: s.formatGuideDrawing,
        historyConfig: s.historyConfig,
      };
    } catch {
      return n;
    }
  }
  function D(e, n, t, a) {
    const o = e
        .filter((e) => 'system' === e.role)
        .map((e) => (e.content || '').trim())
        .filter(Boolean)
        .join('\n\n'),
      r = e
        .filter((e) => 'system' !== e.role)
        .map((e) => {
          const n = (e.content || '').trim();
          return n
            ? {
                role: 'assistant' === e.role ? 'model' : 'user',
                parts: [
                  {
                    text: n,
                  },
                ],
              }
            : null;
        })
        .filter(Boolean);
    if (Array.isArray(a) && a.length > 0) {
      const e = r;
      let n = null;
      for (let t = e.length - 1; t >= 0; t--)
        if (e[t] && 'user' === e[t].role) {
          n = e[t];
          break;
        }
      if (n) {
        const e = Array.isArray(n.parts) ? n.parts : [];
        n.parts = [...e, ...a];
      } else
        e.push({
          role: 'user',
          parts: a,
        });
    }
    const i = {
      contents: r,
      generationConfig: {
        temperature: n,
        ...('number' == typeof t && Number.isFinite(t)
          ? {
              maxOutputTokens: t,
            }
          : {}),
      },
    };
    return (
      o &&
        (i.systemInstruction = {
          parts: [
            {
              text: o,
            },
          ],
        }),
      i
    );
  }
  function S(e) {
    const n = String(e ?? '');
    return n.includes('data:image/')
      ? n.replace(/data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=]+/g, (e) =>
          e.length > 300 ? `[data:image;base64 omitted, length=${e.length}]` : e,
        )
      : n;
  }
  const M = 5242880;
  function I(e) {
    const n = String(e ?? '').match(/^data:([^;]*);base64,([\s\S]+)$/i);
    if (!n) return null;
    const t = String(n[1] || '').trim() || 'image/png',
      a = String(n[2] || '').replace(/\s+/g, '');
    return a
      ? {
          mime: t,
          base64: a,
        }
      : null;
  }
  async function T(e, n) {
    const t = String(e || '').trim();
    if (!t) return null;
    if (t.startsWith('data:image/')) {
      const e = I(t);
      if (!e) return null;
      const n = Math.floor(0.75 * e.base64.length);
      return n > M
        ? null
        : {
            dataUrl: t,
            mime: e.mime,
            base64: e.base64,
            bytes: n,
          };
    }
    try {
      const e = (() => {
          try {
            return new URL(t, window.location.href).toString();
          } catch {
            return t;
          }
        })(),
        a = await fetch(e, {
          method: 'GET',
          signal: n?.signal,
        });
      if (!a.ok) return null;
      const o = (
          String(a.headers.get('content-type') || '')
            .split(';')
            .map((e) => e.trim())
            .find(Boolean) || ''
        ).toLowerCase(),
        r = (function (e) {
          const n = String(e || '')
            .trim()
            .toLowerCase()
            .split('?')[0]
            .split('#')[0];
          return n.endsWith('.png')
            ? 'image/png'
            : n.endsWith('.jpg') || n.endsWith('.jpeg')
              ? 'image/jpeg'
              : n.endsWith('.webp')
                ? 'image/webp'
                : n.endsWith('.gif')
                  ? 'image/gif'
                  : null;
        })(t);
      if (!o.startsWith('image/') && !r) return null;
      const i = await a.blob(),
        s = 'number' == typeof i.size ? i.size : 0;
      if (s > M) return null;
      const l = await (function (e) {
          return new Promise((n, t) => {
            const a = new FileReader();
            ((a.onload = () => n(String(a.result || ''))),
              (a.onerror = () => t(new Error('读取图片失败'))),
              a.readAsDataURL(e));
          });
        })(i),
        c = I(l);
      if (!c) return null;
      let A = c.mime;
      A.toLowerCase().startsWith('image/') || (o.startsWith('image/') ? (A = o) : r && (A = r));
      return {
        dataUrl: A === c.mime ? l : `data:${A};base64,${c.base64}`,
        mime: A,
        base64: c.base64,
        bytes: s,
      };
    } catch {
      return null;
    }
  }
  async function Y(e, n, t, a) {
    const o = (function (e) {
        const n = W();
        return n
          ? (Array.isArray(e) ? e : []).map((e) => ({
              ...e,
              content: P(e.content, n),
            }))
          : e;
      })(e),
      r = {
        ...k(t),
        ...n,
      },
      i = `[AI] ${String(t ?? 'unknown')} (${r.apiFormat}/${r.model || 'no-model'})`,
      l = 'number' == typeof r.maxTokens && Number.isFinite(r.maxTokens) ? Math.max(1, Math.floor(r.maxTokens)) : u;
    let c = !1;
    try {
      if (
        (console.groupCollapsed(i),
        (c = !0),
        console.info('[AI] request', {
          viewType: t ?? 'unknown',
          apiFormat: r.apiFormat,
          model: r.model,
          temperature: r.temperature,
          maxTokens: l,
        }),
        console.info(
          '[AI] messages',
          (function (e) {
            return (Array.isArray(e) ? e : []).map((e) => ({
              role: e.role,
              content: S(String(e.content ?? '')),
            }));
          })(o),
        ),
        !r.url || !r.key || !r.model)
      ) {
        const e = {
          success: !1,
          content: '',
          error: '请先配置 API URL、API Key 和模型',
        };
        return (console.info('[AI] response', e), e);
      }
      const e =
          'gemini' === r.apiFormat
            ? (function (e, n, t) {
                const a = `${(function (e) {
                  let n = e.trim().replace(/\/+$/, '');
                  return (
                    n.endsWith('/v1beta/models') ? (n = n.slice(0, -7)) : n.endsWith('/v1beta') || (n = `${n}/v1beta`),
                    n
                  );
                })(e)}/models/${n.startsWith('models/') ? n.slice(7) : n}:generateContent`;
                try {
                  const e = new URL(a);
                  return (e.searchParams.set('key', t), e.toString());
                } catch {
                  const e = a.includes('?') ? '&' : '?';
                  return `${a}${e}key=${encodeURIComponent(t)}`;
                }
              })(r.url, r.model, r.key)
            : (function (e) {
                let n = e.trim();
                return (
                  n.endsWith('/') && (n = n.slice(0, -1)),
                  n.endsWith('/chat/completions')
                    ? n
                    : n.endsWith('/v1')
                      ? `${n}/chat/completions`
                      : `${n}/v1/chat/completions`
                );
              })(r.url),
        n = (0, s.jY)(),
        d = (e) => {
          try {
            return e ? JSON.parse(e) : null;
          } catch {
            return null;
          }
        },
        p = (e) => {
          const n = e?.error?.message || e?.message || e?.detail;
          return n ? String(n) : '';
        },
        C = (e) => 401 === e || 403 === e,
        m = (e) => /max_tokens|maxOutputTokens|maximum context length|context length|上下文长度|输出长度/i.test(e),
        g = async (e, t, a) => {
          const o = await fetch(e, {
              method: 'POST',
              headers: t,
              body: JSON.stringify(a),
              signal: n.signal,
            }),
            r = await o.text().catch(() => ''),
            i = d(r);
          return {
            ok: o.ok,
            status: o.status,
            statusText: o.statusText,
            text: r,
            data: i,
          };
        };
      try {
        const t = Array.isArray(a?.visionInputs) ? a.visionInputs : [],
          i =
            t.length > 0
              ? await (async function (e, n) {
                  const t = [],
                    a = Array.isArray(e) ? e : [],
                    o = !0 === n?.stickerRecognitionEnabled;
                  for (const e of a.slice(0, 4))
                    if (e && 'object' == typeof e) {
                      if ('image' === e.kind) {
                        const a = String(e.url || '').trim(),
                          o = String(e.desc || '').trim(),
                          r = await T(a, {
                            signal: n?.signal,
                          });
                        if (!r) continue;
                        t.push({
                          label: o ? `图片：${o}` : '图片',
                          dataUrl: r.dataUrl,
                          mime: r.mime,
                          base64: r.base64,
                          bytes: r.bytes,
                        });
                        continue;
                      }
                      if ('sticker' === e.kind) {
                        if (!o) continue;
                        const a = String(e.name || '').trim();
                        if (!a) continue;
                        const r = (0, A.bX)(a);
                        if (!r) continue;
                        const i = await T(r, {
                          signal: n?.signal,
                        });
                        if (!i) continue;
                        t.push({
                          label: `表情包：${a}`,
                          dataUrl: i.dataUrl,
                          mime: i.mime,
                          base64: i.base64,
                          bytes: i.bytes,
                        });
                      }
                    }
                  return t;
                })(t, {
                  stickerRecognitionEnabled: F().stickerRecognitionEnabled,
                  signal: n.signal,
                })
              : [],
          s =
            i.length > 0
              ? (function (e) {
                  const n = [],
                    t = Array.isArray(e) ? e : [];
                  if (0 === t.length) return n;
                  n.push({
                    type: 'text',
                    text: `以下包含用户新发送的图片/表情包（共${t.length}个）。请结合图片内容理解用户消息。`,
                  });
                  for (const e of t)
                    (n.push({
                      type: 'text',
                      text: e.label,
                    }),
                      n.push({
                        type: 'image_url',
                        image_url: {
                          url: e.dataUrl,
                        },
                      }));
                  return n;
                })(i)
              : [],
          c =
            i.length > 0
              ? (function (e) {
                  const n = [],
                    t = Array.isArray(e) ? e : [];
                  if (0 === t.length) return n;
                  n.push({
                    text: `以下包含用户新发送的图片/表情包（共${t.length}个）。请结合图片内容理解用户消息。`,
                  });
                  for (const e of t)
                    (n.push({
                      text: e.label,
                    }),
                      n.push({
                        inline_data: {
                          mime_type: e.mime,
                          data: e.base64,
                        },
                      }));
                  return n;
                })(i)
              : [],
          d = i.length > 0;
        d
          ? console.info(
              '[AI] vision',
              i.map((e) => ({
                label: e.label,
                mime: e.mime,
                bytes: e.bytes,
                dataUrlHead: e.dataUrl.slice(0, 32),
                dataUrlLen: e.dataUrl.length,
              })),
            )
          : t.length > 0 &&
            console.warn('[AI] vision inputs 已提供，但图片未能解析为 dataURL，将回退为纯文本（不影响现有功能）');
        const u = (e) =>
            /image_url|inline_data|content.+(array|object)|expected.+string|Invalid.+content|not supported|unsupported/i.test(
              String(e || ''),
            ),
          f = async (n) => {
            let t = null;
            if ('gemini' === r.apiFormat) {
              const a = D(o, r.temperature, l, n ? c : void 0),
                i = D(o, r.temperature, void 0, n ? c : void 0),
                s = {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                A = {
                  ...s,
                  Authorization: `Bearer ${r.key}`,
                  'x-api-key': r.key,
                };
              ((t = await g(e, s, a)), !t.ok && C(t.status) && (t = await g(e, A, a)));
              const d = p(t.data) || t.text || t.statusText;
              if (!t.ok && m(d)) {
                const n = t.status && C(t.status) ? A : s;
                ((t = await g(e, n, i)), !t.ok && C(t.status) && n === s && (t = await g(e, A, i)));
              }
            } else {
              const a =
                  n && s.length > 0
                    ? (() => {
                        const e = [...o];
                        let n = -1;
                        for (let t = e.length - 1; t >= 0; t--)
                          if (e[t] && 'user' === e[t].role) {
                            n = t;
                            break;
                          }
                        if (n >= 0) {
                          const t = e[n],
                            a = String(t?.content ?? '');
                          return (
                            (e[n] = {
                              ...t,
                              content: [
                                {
                                  type: 'text',
                                  text: a,
                                },
                                ...s,
                              ],
                            }),
                            e
                          );
                        }
                        return [
                          ...e,
                          {
                            role: 'user',
                            content: s,
                          },
                        ];
                      })()
                    : o,
                i = {
                  model: r.model,
                  messages: a,
                  temperature: r.temperature,
                  stream: !1,
                  max_tokens: l,
                },
                { max_tokens: c, ...A } = i,
                d = {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: `Bearer ${r.key}`,
                },
                u = {
                  ...d,
                  'x-api-key': r.key,
                };
              ((t = await g(e, d, i)), !t.ok && C(t.status) && (t = await g(e, u, i)));
              const f = p(t.data) || t.text || t.statusText;
              if (!t.ok && m(f)) {
                const n = t.status && C(t.status) ? u : d;
                ((t = await g(e, n, A)), !t.ok && C(t.status) && n === d && (t = await g(e, u, A)));
              }
            }
            return (
              t || {
                ok: !1,
                status: 0,
                statusText: '',
                text: '',
                data: null,
              }
            );
          };
        let b = await f(d);
        if (d && !b.ok) {
          const e = p(b.data) || b.text || b.statusText;
          u(e) && (console.warn('[AI] vision 请求失败，已自动回退为纯文本请求:', e), (b = await f(!1)));
        }
        if (!b.ok) {
          const e = b?.status ?? 0,
            n = b?.statusText || '',
            t = (b && (p(b.data) || b.text)) || n || '未知错误',
            a = {
              success: !1,
              content: '',
              error: e ? `API 请求失败: ${e} - ${t}` : `API 请求失败: ${t}`,
            };
          return (console.info('[AI] response', a), a);
        }
        const v = b.data;
        if (!v || 'object' != typeof v) {
          const e = {
            success: !1,
            content: '',
            error: '无法解析 API 响应（不是 JSON）',
          };
          return (console.info('[AI] response', e), e);
        }
        const x =
            'gemini' === r.apiFormat
              ? (v?.candidates?.[0]?.content?.parts || []).map((e) => e.text || '').join('')
              : v?.choices?.[0]?.message?.content || '',
          h = {
            success: !0,
            content: x,
          };
        return (
          console.info('[AI] response', {
            success: !0,
          }),
          console.info('[AI] content', S(x)),
          h
        );
      } catch (e) {
        if (e instanceof Error && 'AbortError' === e.name) {
          const e = {
            success: !1,
            content: '',
            error: '请求已被用户终止',
          };
          return (console.info('[AI] response', e), e);
        }
        const n = {
          success: !1,
          content: '',
          error: `网络错误: ${e instanceof Error ? e.message : '未知错误'}`,
        };
        return (console.info('[AI] response', n), n);
      } finally {
        (0, s.AM)();
      }
    } finally {
      c && console.groupEnd();
    }
  }
  async function j(e, n, t) {
    const a = V(),
      o = {
        currentView: n,
        currentPage: t?.currentPage || n,
        userInput: e,
        formatGuide: a.formatGuide,
        historyConfig: a.historyConfig,
        ...t,
      },
      r = await (0, C.hm)(a.blocks, o);
    return Y((0, C.g0)(r), void 0, n);
  }
  function G() {
    try {
      const e =
          getVariables({
            type: 'character',
          }) || {},
        n = o().get(e, 'phone_data') || {};
      if (n?.user?.name) return `用户${n.user.name}`;
      const t = SillyTavern.name1;
      if (t) return `用户${t}`;
    } catch (e) {
      console.warn('[AI Service] 无法读取用户姓名:', e);
    }
    return '用户';
  }
  function W() {
    try {
      const e =
          getVariables({
            type: 'character',
          }) || {},
        n = o().get(e, 'phone_data') || {},
        t = String(n?.user?.nickname || '').trim();
      if (t) return t;
      return String(n?.user?.name || SillyTavern.name1 || '').trim() || '用户';
    } catch {
      return String(SillyTavern.name1 || '').trim() || '用户';
    }
  }
  function P(e, n) {
    const t = String(e ?? '');
    return t
      ? t
          .replace(/\{\{User\}\}/g, n)
          .replace(/\{\{user\}\}/g, n)
          .replace(/<User>/g, n)
          .replace(/<user>/g, n)
      : t;
  }
  function U(e, n) {
    const t = W();
    let a = '',
      r = '';
    try {
      const n =
          getVariables({
            type: 'character',
          }) || {},
        t = o().get(n, 'phone_data') || {},
        i = (Array.isArray(t?.groups) ? t.groups : []).find(
          (n) => String(n?.name || '').trim() === String(e || '').trim(),
        );
      ((a = String(i?.otherMembers || '').trim()), (r = String(i?.description || '').trim()));
    } catch {}
    const i = Array.isArray(n) ? n.map((e) => String(e || '').trim()).filter(Boolean) : [],
      s = i.includes(t),
      l = [];
    return (
      l.push('【群聊基本信息】'),
      l.push(`群聊名称: ${e}`),
      l.push(`群聊成员包含我方(${t}): 是`),
      l.push(`重要人物: ${i.length > 0 ? i.join('、') : '无'}`),
      l.push('重要人物是否包含我方: ' + (s ? '是' : '否')),
      a && l.push(`其他成员: ${a}`),
      r && l.push(`群聊简介: ${r}`),
      l.join('\n')
    );
  }
  function q(e) {
    const n = String(e || '').split('\n');
    if (0 === n.length) return '';
    const t = [];
    let a = !1;
    for (const e of n) {
      const n = e.trim();
      '<group_message>' !== n
        ? '</group_message>' !== n
          ? (a && /^(name|id)\s*:/.test(n)) || t.push(e)
          : ((a = !1), t.push(e))
        : ((a = !0), t.push(e));
    }
    return t.join('\n');
  }
  function L(e) {
    const n = [
      'message',
      'group_message',
      'chat_history',
      'camera',
      'phone_data',
      'phone-data',
      'plot_characters',
      'plot-characters',
      'map',
      'dynamic',
      'homepage',
      'forum',
      'forum_post',
      'live_list',
      'live',
      'email',
      'browser',
      'music',
      'shop_home',
      'shop-home',
      'shop_product',
      'shop-product',
      'shop_seller',
      'shop-seller',
      'shop_search',
      'shop-search',
      'ai_analysis',
      'ai-analysis',
      'phone_module',
      'call',
      'calendar',
      'diary',
      'listen_together',
      'listen-together',
      'forum_comment',
      'forum-comment',
      'dynamic_reply',
      'dynamic-reply',
      'Xml',
    ];
    let t = e,
      a = !0,
      o = 5;
    for (; a && o > 0;) {
      ((a = !1), o--);
      for (const e of n) {
        const n = new RegExp(`<${e}(?:\\s[^>]*)?>([\\s\\S]*?)</${e}>`, 'i'),
          o = t.match(n);
        if (o) {
          (console.info(`[AI Service] 从 <${e}> 标签中提取内容`), (t = o[1].trim()), (a = !0));
          break;
        }
      }
    }
    if (t !== e) return t;
    for (const t of n) {
      const n = new RegExp(`<${t}(?:\\s[^>]*)?>`, 'i').exec(e);
      if (!n || 'number' != typeof n.index) continue;
      const a = n.index + n[0].length,
        o = e.slice(a),
        r = new RegExp(`</${t}>`, 'i'),
        i = o.search(r),
        s = -1 === i ? o : o.slice(0, i);
      return (console.info(`[AI Service] 从 <${t}> 标签中提取内容(容错：缺失闭合标签)`), s.trim());
    }
    return e;
  }
  function O(e) {
    let n = e;
    return (
      (n = n.replace(/^(\s*[A-Za-z_\u4e00-\u9fa5][\w\u4e00-\u9fa5-]*)：/gm, '$1:')),
      (n = (function (e) {
        const n = '[A-Za-z_\\u4e00-\\u9fa5][\\w\\u4e00-\\u9fa5-]*',
          t = new RegExp(`^(\\s*)(${n}:\\s*.+?)\\s+(${n}:\\s*.+)$`),
          a = e.split('\n'),
          o = [];
        for (const e of a) {
          const n = e.trim();
          if (!n || n.startsWith('#') || n.startsWith('- ') || n.includes('://')) {
            o.push(e);
            continue;
          }
          let a = e,
            r = 0;
          for (; r < 6;) {
            const e = a.match(t);
            if (!e) break;
            const [, n, i, s] = e;
            if (i.includes('://') || s.includes('://')) break;
            (o.push(`${n}${i.trim()}`), (a = `${n}${s.trim()}`), (r += 1));
          }
          o.push(a);
        }
        return o.join('\n');
      })(n)),
      (n = (function (e) {
        const n = e.split('\n'),
          t = [];
        let a = '';
        const o = /^\s*[A-Za-z_\u4e00-\u9fa5][\w\u4e00-\u9fa5-]*:\s*\S/;
        for (const e of n) {
          const n = e.trim();
          if (!n) {
            t.push(e);
            continue;
          }
          const r = n.startsWith('#'),
            i = e.length - e.trimStart().length,
            s = o.test(e);
          if (!r && s && i > 0 && a) {
            const n = a.trim(),
              r = a.length - a.trimStart().length,
              i = o.test(a),
              s = /:\s*$/.test(n) || /[>|]-?\s*$/.test(n),
              l = n.startsWith('- ');
            if (0 === r && i && !s && !l) {
              (t.push(e.trimStart()), (a = e.trimStart()));
              continue;
            }
          }
          (t.push(e), r || (a = e));
        }
        return t.join('\n');
      })(n)),
      n
    );
  }
  function R(e, n, t) {
    if (!e || 'object' != typeof e) return null;
    const a = String(e.name ?? e.user ?? e.author ?? '').trim(),
      o = e.time,
      r = null == o ? void 0 : String(o).trim(),
      i = e.c ?? e.content ?? e.text ?? '';
    let s = 'string' == typeof i ? i : String(i ?? '');
    if (((s = s.trim()), !a || !s)) return null;
    const l = (function (e) {
      if (!e || 'object' != typeof e) return;
      const n = String(e.name ?? e.user ?? e.author ?? '').trim();
      if (!n) return;
      const t = e.time ?? e.t ?? e.date;
      return {
        name: n,
        time: null == t ? void 0 : String(t).trim(),
      };
    })(e.reply);
    return n
      ? {
          name: a,
          time: r,
          c: s,
          reply: {
            name: n,
            time: t,
          },
        }
      : {
          name: a,
          time: r,
          c: s,
          reply: l,
        };
  }
  function X(e) {
    const n = [];
    for (const t of e) {
      const e = R(t);
      e && n.push(e);
      const a = t?.replies;
      if (Array.isArray(a) && e)
        for (const t of a) {
          const a = R(t, e.name, e.time);
          a && n.push(a);
        }
    }
    return n;
  }
  function Q(e) {
    const n = e.reply;
    if (!n?.name) return e;
    const t = (0, A.FI)(n.name);
    return t && t !== n.name
      ? {
          ...e,
          reply: {
            ...n,
            name: t,
          },
        }
      : e;
  }
  function H() {
    const e = new Date();
    return `${String(e.getHours()).padStart(2, '0')}:${String(e.getMinutes()).padStart(2, '0')}`;
  }
  function Z(e) {
    if (!e || 'object' != typeof e) return e;
    const n = {
      ...e,
    };
    return (
      Array.isArray(n.comments) && (n.comments = X(n.comments)),
      null == n.commentCount && Array.isArray(n.comments) && (n.commentCount = n.comments.length),
      n
    );
  }
  function K(e) {
    return Array.isArray(e)
      ? e
          .map((e) => ({
            name: String(e?.name ?? e?.user ?? e?.author ?? '').trim(),
            c: String(e?.c ?? e?.content ?? e?.text ?? '').trim(),
          }))
          .filter((e) => e.name && e.c)
      : [];
  }
  async function J(e, n) {
    console.info('[AI Service] generateForumPostForumCommentFromAi 被调用');
    const t = V(),
      a = G(),
      o = X(e.comments),
      r = o
        .map((e, n) => {
          const t = e.time ? `（${e.time}）` : '',
            a = e.reply?.name ? `（回复 ${e.reply.name}${e.reply.time ? ` ${e.reply.time}` : ''}）` : '';
          return `${n + 1}. ${e.name}${t}${a}: ${e.c}`;
        })
        .join('\n'),
      i =
        n.replyTo?.name && n.replyTo.time
          ? `${n.replyTo.name}（${n.replyTo.time}）`
          : n.replyTo?.name
            ? n.replyTo.name
            : '',
      s = `你正在为“论坛帖子详情页”生成评论的后续回复。\n\n帖子标题：${e.title}\n帖子作者：${e.author}\n帖子内容：\n${e.content}\n\n全部评论（包含用户刚发表的评论，按顺序）：\n${r || '（暂无）'}\n\n用户（${a}）刚发表的评论（禁止在输出中重复这条评论）：\n- 指向：${i ? `回复评论 ${i}` : '直接评论帖子内容'}\n- 内容：${n.content}\n\n任务：\n1) 只生成后续新增评论 1-3 条（来自其他角色），禁止代替用户（${a}）发表评论\n2) 不要重复输出任何已有评论，也不要输出用户这条评论\n3) 若回复某条评论，用 reply 字段（reply.name + reply.time）定位被回复评论；不要使用 replies 数组\n4) 每条新增评论必须包含 time（格式 HH:MM）`,
      l = Array.from(
        new Set(
          [e.author, ...o.map((e) => e.name)]
            .map((e) => String(e || '').trim())
            .filter(Boolean)
            .filter((e) => e !== a)
            .slice(0, 10),
        ),
      ),
      c = {
        currentView: 'forumComment',
        currentPage: '论坛帖子',
        userInput: s,
        formatGuide: t.formatGuide,
        historyConfig: t.historyConfig,
        targetCharacters: l.length > 0 ? l : void 0,
      },
      A = await (0, C.hm)(t.blocks, c),
      d = (0, C.g0)(A);
    console.info('[AI Service] 论坛评论 - 发送的消息:', d);
    const p = await Y(d, void 0, 'forumComment');
    if (!p.success)
      return {
        success: !1,
        data: null,
        error: p.error,
      };
    console.info('[AI Service] 论坛评论 - AI响应原始内容:', p.content);
    const m = await ne(p.content),
      g = te(p.content),
      u = m || g;
    if (!u)
      return (
        console.error('[AI Service] 论坛评论 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const f =
      (function (e) {
        if (!e || 'object' != typeof e) return null;
        const n =
            e?.forum_comment && 'object' == typeof e.forum_comment
              ? e.forum_comment
              : e?.forumComment && 'object' == typeof e.forumComment
                ? e.forumComment
                : e,
          t = n?.comments;
        return Array.isArray(t) ? t : null;
      })(u) || [];
    return {
      success: !0,
      data: {
        comments: X(f)
          .filter((e) => String(e.name || '').trim() !== a)
          .map((e) => ({
            ...e,
            time: e.time || H(),
          })),
      },
    };
  }
  async function ee(e) {
    console.info('[AI Service] generateDynamicReplyFromAi 被调用');
    const n = V(),
      t = G(),
      a = K(e.post.comments),
      o = a.map((e, n) => `${n + 1}. ${e.name}: ${e.c}`).join('\n'),
      r = `你正在为“${e.currentPage}”生成评论的后续回复。\n\n动态发布者：${e.post.author}\n动态正文：\n${e.post.content}\n\n全部评论（包含用户刚发表的评论，按顺序）：\n${o || '（暂无）'}\n\n用户（${t}）刚发表的评论（禁止在输出中重复这条评论）：\n- 内容：${e.userComment.content}\n\n任务：\n1) 只生成后续新增评论 1-3 条（来自其他角色），禁止代替用户（${t}）发表评论\n2) 不要重复输出任何已有评论，也不要输出用户这条评论\n3) 如需回复他人：在评论正文 c 的开头使用 @{{被回复评论者网名/姓名}}，不使用 reply 字段\n4) 每条新增评论必须包含 name + c`,
      i = Array.from(
        new Set(
          [e.post.author, ...a.map((e) => e.name)]
            .map((e) => String(e || '').trim())
            .filter(Boolean)
            .filter((e) => e !== t)
            .slice(0, 10),
        ),
      ),
      s = {
        currentView: 'dynamicReply',
        currentPage: e.currentPage,
        userInput: r,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
        targetCharacters: i.length > 0 ? i : void 0,
      },
      l = await (0, C.hm)(n.blocks, s),
      c = (0, C.g0)(l);
    console.info('[AI Service] 动态回复 - 发送的消息:', c);
    const A = await Y(c, void 0, 'dynamicReply');
    if (!A.success)
      return {
        success: !1,
        data: null,
        error: A.error,
      };
    console.info('[AI Service] 动态回复 - AI响应原始内容:', A.content);
    const d = await ne(A.content),
      p = te(A.content),
      m = d || p;
    if (!m)
      return (
        console.error('[AI Service] 动态回复 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const g =
      (function (e) {
        if (!e || 'object' != typeof e) return null;
        const n =
            e?.dynamic_reply && 'object' == typeof e.dynamic_reply
              ? e.dynamic_reply
              : e?.dynamicReply && 'object' == typeof e.dynamicReply
                ? e.dynamicReply
                : e,
          t = n?.comments;
        return Array.isArray(t) ? t : null;
      })(m) || [];
    return {
      success: !0,
      data: {
        comments: K(g).filter((e) => String(e.name || '').trim() !== t),
      },
    };
  }
  async function ne(e) {
    console.info('[AI Service] parseYamlFromResponse 输入长度:', e.length);
    let n = e;
    const t = n.indexOf('</think>');
    -1 !== t && ((n = n.substring(t + 8).trim()), console.info('[AI Service] 移除think标签后长度:', n.length));
    const a = n.match(/```ya?ml?\s*([\s\S]*?)```/);
    (a && ((n = a[1].trim()), console.info('[AI Service] 代码块提取后长度:', n.length)), await m());
    const o = L(n);
    o !== n && ((n = o), console.info('[AI Service] XML提取后长度:', n.length));
    const r = n.split('\n'),
      s = [];
    let l = !1;
    for (let e = 0; e < r.length; e++) {
      const n = r[e],
        t = n.trim();
      t.endsWith('|') || t.endsWith('>')
        ? ((l = !0), s.push(n))
        : (l && t && !n.startsWith(' ') && !n.startsWith('\t') && (l = !1),
          (!l && t.startsWith('#')) || (s.push(n), (e + 1) % 100 == 0 && (await m())));
    }
    ((n = s.join('\n').trim()),
      await m(),
      (n = (function (e) {
        const n = e.split('\n');
        if (0 === n.length) return e;
        const t = n[0],
          a = t.match(/^(\s+)/);
        if (!a) return e;
        const o = a[1].length;
        if (o > 4)
          return (
            console.info('[AI Service] 顶层缩进过大，去掉所有行的前导空格'),
            n
              .map((e) => e.trimStart())
              .join('\n')
              .trim()
          );
        const r = n.filter((e) => e.trim().length > 0);
        if (r.every((e) => e.startsWith(' '.repeat(o)) || e.startsWith('\t'.repeat(o))) && r.length > 0) {
          const e = t.trim();
          if (/^[a-zA-Z_]/.test(e) && e.includes(':'))
            return (
              console.info(`[AI Service] 检测到统一的顶层缩进 (${o} 空格)，去除顶层缩进`),
              n
                .map((e) => (e.startsWith(' '.repeat(o)) || e.startsWith('\t'.repeat(o)) ? e.slice(o) : e))
                .join('\n')
                .trim()
            );
        }
        return e;
      })(n)),
      await m(),
      (n = (function (e) {
        const n = (e) => `'${String(e ?? '').replace(/'/g, "''")}'`,
          t = e.split('\n'),
          a = [];
        let o = !1;
        for (const e of t) {
          const t = e.trim();
          if (t.endsWith('|') || t.endsWith('>')) {
            ((o = !0), a.push(e));
            continue;
          }
          if (o) {
            if (!t || e.startsWith(' ') || e.startsWith('\t')) {
              a.push(e);
              continue;
            }
            o = !1;
          }
          const r = e.match(/^(\s*[\w\u4e00-\u9fa5]+:\s*)\[([^\]]*)\](.*)$/);
          if (r) {
            const [, t, o, i] = r,
              s = i.trim(),
              l = String(o || '').trim(),
              c = t.match(/([\w\u4e00-\u9fa5]+):\s*$/)?.[1] ?? '';
            if (s) {
              a.push(`${t}${n(`[${o}]${i}`)}`);
              continue;
            }
            if ('keywords' === c || 'keys' === c) {
              a.push(e);
              continue;
            }
            if (!/[,，]/.test(l) && !/["']/.test(l)) {
              a.push(`${t}${n(`[${o}]`)}`);
              continue;
            }
          }
          const i = e.match(/^(\s*[\w\u4e00-\u9fa5]+:\s*)([^"'|>\n][^"\n]*:.*)$/);
          if (i && !i[2].startsWith('"') && !i[2].startsWith("'")) {
            const [, e, n] = i;
            if (!n.includes('://')) {
              a.push(`${e}"${n}"`);
              continue;
            }
          }
          const s = e.match(/^(\s*[\w\u4e00-\u9fa5]+:\s*)(@.*)$/);
          if (s) {
            const [, e, n] = s;
            a.push(`${e}"${n}"`);
            continue;
          }
          a.push(e);
        }
        return a.join('\n');
      })(n)),
      (n = n.replace(/^(\s*)(\w+):([^\s\n])/gm, '$1$2: $3')),
      (n = (function (e) {
        let n = e;
        return (
          (n = n.replace(/(^|\n)([ \t]*)messages:\s*-\s*/g, '$1$2messages:\n$2  - ')),
          (n = n.replace(/(^|\n)([ \t]*)-\s*t:\s*quote\s+quote:/g, '$1$2- t: quote\n$2  quote:')),
          (n = n.replace(/(^|\n)([ \t]*)quote:\s+name:/g, '$1$2quote:\n$2  name:')),
          n
        );
      })(n)),
      await m());
    try {
      const e = i().parse(n);
      if (e) return e;
    } catch (e) {
      const t = O(n);
      if (t !== n)
        try {
          const e = i().parse(t);
          if (e) return (console.info('[AI Service] YAML 自动纠错后解析成功'), e);
        } catch (e) {
          return (
            console.error('[AI Service] YAML 自动纠错后仍解析失败:', e),
            console.error('[AI Service] 自动纠错后内容长度:', t.length),
            console.error('[AI Service] 自动纠错后内容预览(前500字):', t.substring(0, 500)),
            null
          );
        }
      (console.error('[AI Service] YAML 解析失败:', e),
        console.error('[AI Service] 实际内容长度:', n.length),
        console.error('[AI Service] 内容预览(前500字):', n.substring(0, 500)));
    }
    return null;
  }
  function te(e) {
    try {
      const n = JSON.parse(e);
      if (n) return n;
    } catch {
      const n = e.match(/```json?\n([\s\S]*?)```/);
      if (n)
        try {
          return JSON.parse(n[1]);
        } catch {
          console.error('[AI Service] 无法解析 JSON 代码块');
        }
    }
    return null;
  }
  async function ae(e) {
    const n = V(),
      t = {
        currentView: 'data',
        currentPage: '数据',
        userInput: e.userInput,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
        extraInfo: e.extraInfo,
        worldbookReadMode: e.worldbookReadMode,
      },
      a = await (0, C.hm)(n.blocks, t),
      o = (0, C.g0)(a);
    console.info('[AI Service] 数据 - 发送的消息:', o);
    const r = await Y(o, void 0, 'data');
    return (
      console.info('[AI Service] 数据 - AI响应:', r),
      r.success && console.info('[AI Service] 数据 - AI响应原始内容:', r.content),
      r
    );
  }
  async function oe(e) {
    const n = String(e.userInput || '').trim();
    if (!n)
      return {
        success: !1,
        content: '',
        error: '用户输入不能为空',
      };
    const t = V(),
      a = (Array.isArray(e.historyMessages) ? e.historyMessages : [])
        .map((e) => ({
          role: 'assistant' === e?.role ? 'assistant' : 'user',
          content: String(e?.content ?? '').trim(),
        }))
        .filter((e) => e.content)
        .slice(-20),
      o = a.map((e, n) => `${n + 1}. ${'user' === e.role ? '用户' : '助手'}：${e.content}`).join('\n'),
      r = o ? `## AI 分析历史（最近 ${a.length} 条）\n${o}` : '',
      i = {
        currentView: 'aiAnalysis',
        currentPage: 'AI分析',
        userInput: n,
        formatGuide: t.formatGuide,
        historyConfig: t.historyConfig,
        extraInfo: r,
      },
      s = await (0, C.hm)(t.blocks, i),
      l = (0, C.g0)(s);
    console.info('[AI Service] AI分析 - 发送的消息:', l);
    const c = await Y(l, void 0, 'aiAnalysis');
    if (!c.success)
      return {
        success: !1,
        content: '',
        error: c.error || 'AI 请求失败',
      };
    const A = String(c.content || '').trim();
    if (!A)
      return {
        success: !1,
        content: '',
        error: 'AI 返回内容为空',
      };
    const d = L(A).trim() || A;
    return d
      ? {
          success: !0,
          content: d,
        }
      : {
          success: !1,
          content: '',
          error: '未提取到有效分析内容',
        };
  }
  async function re(e) {
    const n = V();
    let t = '请根据当前剧情生成地图数据，包括各地点的状态、事件和人物位置。';
    e && (t = `请详细描述"${e}"这个地点的当前状态、正在发生的事件、在场人物等信息。`);
    const a = {
        currentView: 'map',
        currentPage: '地图',
        userInput: t,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
      },
      o = await (0, C.hm)(n.blocks, a),
      r = (0, C.g0)(o);
    console.info('[AI Service] 发送的消息:', r);
    const i = await Y(r, void 0, 'map');
    if ((console.info('[AI Service] AI响应:', i), !i.success))
      return {
        success: !1,
        data: null,
        error: i.error,
      };
    console.info('[AI Service] AI响应原始内容:', i.content);
    const s = await ne(i.content),
      c = te(i.content);
    (console.info('[AI Service] YAML解析结果:', s), console.info('[AI Service] JSON解析结果:', c));
    const A = s || c;
    return A
      ? ((0, l.uH)(A),
        {
          success: !0,
          data: A,
        })
      : (console.error('[AI Service] 无法解析响应，原始内容:', i.content),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function ie() {
    console.info('[AI Service] fetchDynamicDataFromAi 被调用');
    const e = V();
    (console.info('[AI Service] 动态 - 加载的预设:', e),
      console.info('[AI Service] 动态 - 格式指导配置:', e.formatGuide),
      console.info('[AI Service] 动态 - dynamic格式指导:', e.formatGuide?.dynamic));
    const n = {
        currentView: 'dynamic',
        currentPage: '动态',
        userInput: `请按照格式生成动态界面数据，包括多个用户发布的动态帖子及评论。禁止主动发送用户${G()}的动态。`,
        formatGuide: e.formatGuide,
        historyConfig: e.historyConfig,
      },
      t = await (0, C.hm)(e.blocks, n),
      a = (0, C.g0)(t);
    console.info('[AI Service] 动态 - 发送的消息:', a);
    const o = await Y(a, void 0, 'dynamic');
    if ((console.info('[AI Service] 动态 - AI响应:', o), !o.success))
      return {
        success: !1,
        data: null,
        error: o.error,
      };
    console.info('[AI Service] 动态 - AI响应原始内容:', o.content);
    const r = await ne(o.content),
      i = te(o.content);
    (console.info('[AI Service] 动态 - YAML解析结果:', r), console.info('[AI Service] 动态 - JSON解析结果:', i));
    const s = r || i;
    if (!s)
      return (
        console.error('[AI Service] 动态 - 无法解析响应，原始内容:', o.content),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const c = (function (e) {
      if (!e || 'object' != typeof e) return e;
      const n = {
        ...e,
      };
      return (
        Array.isArray(n.posts) &&
          (n.posts = n.posts.map((e) => {
            if (!e || 'object' != typeof e) return e;
            const n = {
              ...e,
            };
            return (Array.isArray(n.comments) && (n.comments = X(n.comments).map(Q)), n);
          })),
        n
      );
    })(s?.dynamic && 'object' == typeof s.dynamic ? s.dynamic : s);
    return (
      (0, l.uH)(c),
      {
        success: !0,
        data: c,
      }
    );
  }
  async function se(e) {
    console.info('[AI Service] fetchDynamicHomeDataFromAi 被调用，人物:', e);
    const n = V(),
      t = {
        currentView: 'dynamicHome',
        currentPage: '动态主页',
        userInput: `请按照格式生成${e}的个人动态主页`,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
        targetCharacters: [e],
      },
      a = await (0, C.hm)(n.blocks, t),
      o = (0, C.g0)(a);
    console.info('[AI Service] 动态主页 - 发送的消息:', o);
    const r = await Y(o, void 0, 'dynamicHome');
    if (!r.success)
      return {
        success: !1,
        data: null,
        error: r.error,
      };
    console.info('[AI Service] 动态主页 - AI响应原始内容:', r.content);
    const i = await ne(r.content),
      s = te(r.content),
      c = i || s;
    if (!c)
      return (
        console.error('[AI Service] 动态主页 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const A = (function (e) {
      if (!e || 'object' != typeof e) return e;
      const n = {
        ...e,
      };
      return (
        Array.isArray(n.posts) &&
          (n.posts = n.posts.map((e) => {
            if (!e || 'object' != typeof e) return e;
            const n = {
              ...e,
            };
            return (Array.isArray(n.comments) && (n.comments = X(n.comments).map(Q)), n);
          })),
        n
      );
    })(c?.homepage && 'object' == typeof c.homepage ? c.homepage : c);
    return (
      (0, l.uH)(A),
      {
        success: !0,
        data: A,
      }
    );
  }
  function le(e, n) {
    if (!e || 'object' != typeof e) return e;
    for (const t of n) {
      const n = e[t];
      if (n && 'object' == typeof n) return n;
    }
    return e;
  }
  function ce(e) {
    return Array.isArray(e) ? e.map((e) => String(e ?? '').trim()).filter(Boolean) : [];
  }
  async function Ae(e) {
    console.info('[AI Service] fetchShopHomeDataFromAi 被调用', e?.trigger || 'refresh');
    const n = V(),
      t = {
        currentView: 'shopHome',
        currentPage: '网购主页',
        userInput: `用户点击了网购主页${'manual' === e?.trigger ? '手动触发' : '刷新按钮'}，请按照格式要求生成最新 shopHome 数据（商铺/二手/分类）。`,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
      },
      a = await (0, C.hm)(n.blocks, t),
      o = (0, C.g0)(a);
    console.info('[AI Service] 网购主页 - 发送的消息:', o);
    const r = await Y(o, void 0, 'shopHome');
    if (!r.success)
      return {
        success: !1,
        data: null,
        error: r.error,
      };
    console.info('[AI Service] 网购主页 - AI响应原始内容:', r.content);
    const i = await ne(r.content),
      s = te(r.content),
      c = i || s;
    if (!c)
      return (
        console.error('[AI Service] 网购主页 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const A = (function (e) {
      if (!e || 'object' != typeof e) return e;
      const n = {
          ...e,
        },
        t = n.shopHome && 'object' == typeof n.shopHome,
        a = n.banner || Array.isArray(n.flashDeals) || Array.isArray(n.recommendList);
      return (
        !t &&
          a &&
          (n.shopHome = {
            banner: n.banner && 'object' == typeof n.banner ? n.banner : void 0,
            flashDeals: Array.isArray(n.flashDeals) ? n.flashDeals : void 0,
            recommendList: Array.isArray(n.recommendList) ? n.recommendList : void 0,
          }),
        n.usedHome ||
          (!Array.isArray(n.usedList) && !Array.isArray(n.categories)) ||
          (n.usedHome = {
            categories: Array.isArray(n.categories) ? n.categories : void 0,
            list: Array.isArray(n.usedList) ? n.usedList : void 0,
          }),
        !n.categoryPanel &&
          Array.isArray(n.allCategories) &&
          (n.categoryPanel = {
            allCategories: n.allCategories,
          }),
        n
      );
    })(le(c, ['shop_home', 'shop-home']));
    return (
      (0, l.uH)(A),
      {
        success: !0,
        data: A,
      }
    );
  }
  async function de(e) {
    console.info('[AI Service] fetchShopProductDataFromAi 被调用', e);
    const n = V(),
      t = 'used' === e.bizType ? '二手商品' : '商铺商品',
      a = String(e.price || '').trim(),
      o = String(e.sellerName || '').trim(),
      r = String(e.kind || '').trim(),
      i = {
        currentView: 'shopProduct',
        currentPage: '网购商品详情',
        userInput:
          `用户点击了${t}：${e.title || '未命名商品'}\n商品类型：${e.bizType}\n商品种类：${r || ('used' === e.bizType ? 'used' : 'official')}\n` +
          (a ? `当前价格：${a}\n` : '') +
          (o ? `卖家：${o}\n` : '') +
          '请按照格式要求生成该商品的 shopProduct 详情。',
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
      },
      s = await (0, C.hm)(n.blocks, i),
      c = (0, C.g0)(s);
    console.info('[AI Service] 网购商品详情 - 发送的消息:', c);
    const A = await Y(c, void 0, 'shopProduct');
    if (!A.success)
      return {
        success: !1,
        data: null,
        error: A.error,
      };
    console.info('[AI Service] 网购商品详情 - AI响应原始内容:', A.content);
    const d = await ne(A.content),
      p = te(A.content),
      m = d || p;
    if (!m)
      return (
        console.error('[AI Service] 网购商品详情 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const g = (function (e) {
        if (!e || 'object' != typeof e) return e;
        const n = {
            ...e,
          },
          t = String(n.bizType ?? '')
            .trim()
            .toLowerCase();
        (('shop' !== t && 'used' !== t) || (n.bizType = t),
          (n.sellerName = String(n.sellerName ?? '').trim()),
          (n.images = ce(n.images)));
        const a =
            n.shopFields && 'object' == typeof n.shopFields
              ? {
                  ...n.shopFields,
                }
              : {},
          o =
            n.usedFields && 'object' == typeof n.usedFields
              ? {
                  ...n.usedFields,
                }
              : {};
        return (
          (Object.keys(a).length > 0 || 'shop' === t) && (n.shopFields = a),
          (Object.keys(o).length > 0 || 'used' === t) && (n.usedFields = o),
          n
        );
      })(le(m, ['shop_product', 'shopProduct', 'shop-product'])),
      u = String(e.sellerName ?? '').trim();
    String(g?.sellerName ?? '').trim() || (g.sellerName = u);
    const f = (function (e, n) {
      if (!e || 'object' != typeof e)
        return {
          valid: !1,
          error: 'shopProduct 数据不是有效对象',
        };
      const t = String(e.bizType ?? '')
        .trim()
        .toLowerCase();
      if ('shop' !== t && 'used' !== t)
        return {
          valid: !1,
          error: 'shopProduct.bizType 必须是 shop 或 used',
        };
      if (n && t !== n)
        return {
          valid: !1,
          error: `shopProduct.bizType 与当前页面不一致（期望 ${n}，实际 ${t}）`,
        };
      const a = String(e?.sellerName ?? '').trim();
      if (!a)
        return {
          valid: !1,
          error: 'shopProduct.sellerName 不能为空',
        };
      e.sellerName = a;
      const o = ce(e?.images);
      return o.length < 3 || o.length > 5
        ? {
            valid: !1,
            error: 'shopProduct.images 必须为 3-5 条图片描述',
          }
        : ((e.images = o),
          {
            valid: !0,
          });
    })(g, e.bizType);
    return f.valid
      ? ((0, l.uH)(g),
        {
          success: !0,
          data: g,
        })
      : (console.error('[AI Service] 网购商品详情 - 数据校验失败:', f.error),
        {
          success: !1,
          data: null,
          error: f.error || 'shopProduct 数据格式不正确',
        });
  }
  async function pe(e) {
    console.info('[AI Service] fetchShopSellerDataFromAi 被调用', e);
    const n = V(),
      t = 'store' === e.sellerType ? '店铺卖家' : '个人卖家',
      a = String(e.sourceTitle || '').trim(),
      o = String(e.sourceKind || '').trim(),
      r = {
        currentView: 'shopSeller',
        currentPage: '网购卖家页',
        userInput:
          `用户点击了${t}：${e.sellerName || '未命名卖家'}\n卖家类型：${e.sellerType}\n` +
          (a ? `来源商品：${a}\n` : '') +
          (o ? `来源商品种类：${o}\n` : '') +
          '请按照格式要求生成该卖家的 shopSeller 页面数据。',
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
      },
      i = await (0, C.hm)(n.blocks, r),
      s = (0, C.g0)(i);
    console.info('[AI Service] 网购卖家页 - 发送的消息:', s);
    const c = await Y(s, void 0, 'shopSeller');
    if (!c.success)
      return {
        success: !1,
        data: null,
        error: c.error,
      };
    console.info('[AI Service] 网购卖家页 - AI响应原始内容:', c.content);
    const A = await ne(c.content),
      d = te(c.content),
      p = A || d;
    if (!p)
      return (
        console.error('[AI Service] 网购卖家页 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const m = le(p, ['shop_seller', 'shopSeller', 'shop-seller']);
    return (
      (0, l.uH)(m),
      {
        success: !0,
        data: m,
      }
    );
  }
  async function Ce(e) {
    console.info('[AI Service] fetchShopSearchDataFromAi 被调用', e);
    const n = V(),
      t = String(e.keyword || '').trim() || '全部',
      a = e.source || 'search',
      o = {
        currentView: 'shopSearch',
        currentPage: '网购搜索页',
        userInput:
          'search' === a
            ? `生成以下内容的搜索结果：${t}`
            : `用户点击了${
                {
                  search: '搜索',
                  category: '分类',
                  activity: '活动',
                }[a]
              }内容：${t}，请按照格式要求生成 shopSearch 搜索结果。`,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
      },
      r = await (0, C.hm)(n.blocks, o),
      i = (0, C.g0)(r);
    console.info('[AI Service] 网购搜索 - 发送的消息:', i);
    const s = await Y(i, void 0, 'shopSearch');
    if (!s.success)
      return {
        success: !1,
        data: null,
        error: s.error,
      };
    console.info('[AI Service] 网购搜索 - AI响应原始内容:', s.content);
    const c = await ne(s.content),
      A = te(s.content),
      d = c || A;
    if (!d)
      return (
        console.error('[AI Service] 网购搜索 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const p = le(d, ['shop_search', 'shopSearch', 'shop-search']);
    return (
      (0, l.uH)(p),
      {
        success: !0,
        data: p,
      }
    );
  }
  async function me() {
    console.info('[AI Service] fetchForumDataFromAi 被调用');
    const e = V(),
      n = {
        currentView: 'forum',
        currentPage: '论坛',
        userInput: '请按照格式生成论坛',
        formatGuide: e.formatGuide,
        historyConfig: e.historyConfig,
      },
      t = await (0, C.hm)(e.blocks, n),
      a = (0, C.g0)(t);
    console.info('[AI Service] 论坛 - 发送的消息:', a);
    const o = await Y(a, void 0, 'forum');
    if (!o.success)
      return {
        success: !1,
        data: null,
        error: o.error,
      };
    console.info('[AI Service] 论坛 - AI响应原始内容:', o.content);
    const r = await ne(o.content),
      i = te(o.content),
      s = r || i;
    return s
      ? ((0, l.uH)(s),
        {
          success: !0,
          data: s,
        })
      : (console.error('[AI Service] 论坛 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function ge(e) {
    console.info('[AI Service] fetchForumPostDataFromAi 被调用，帖子:', e);
    const n = V(),
      t = {
        currentView: 'forumPost',
        currentPage: '论坛帖子',
        userInput: `请按照格式生成${e}的帖子具体内容`,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
      },
      a = await (0, C.hm)(n.blocks, t),
      o = (0, C.g0)(a);
    console.info('[AI Service] 论坛帖子 - 发送的消息:', o);
    const r = await Y(o, void 0, 'forumPost');
    if (!r.success)
      return {
        success: !1,
        data: null,
        error: r.error,
      };
    console.info('[AI Service] 论坛帖子 - AI响应原始内容:', r.content);
    const i = await ne(r.content),
      s = te(r.content),
      c = i || s;
    if (!c)
      return (
        console.error('[AI Service] 论坛帖子 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const A = Z(
      c?.forum_post && 'object' == typeof c.forum_post
        ? c.forum_post
        : c?.forumPost && 'object' == typeof c.forumPost
          ? c.forumPost
          : c,
    );
    return (
      (0, l.uH)(A),
      {
        success: !0,
        data: A,
      }
    );
  }
  async function ue() {
    console.info('[AI Service] fetchLiveListDataFromAi 被调用');
    const e = V(),
      n = (function () {
        try {
          const e = getVariables({
              type: 'character',
            }),
            n = o().get(e, 'phone_character_live_images');
          return n && 'object' == typeof n ? Object.keys(n) : [];
        } catch {
          return [];
        }
      })(),
      t = {
        currentView: 'liveList',
        currentPage: '直播列表',
        userInput: '按照格式要求生成直播列表',
        formatGuide: e.formatGuide,
        historyConfig: e.historyConfig,
        allCharacters: n,
      },
      a = await (0, C.hm)(e.blocks, t),
      r = (0, C.g0)(a);
    console.info('[AI Service] 直播列表 - 发送的消息:', r);
    const i = await Y(r, void 0, 'liveList');
    if (!i.success)
      return {
        success: !1,
        data: null,
        error: i.error,
      };
    console.info('[AI Service] 直播列表 - AI响应原始内容:', i.content);
    const s = await ne(i.content),
      c = te(i.content),
      A = s || c;
    return A
      ? ((0, l.uH)(A),
        {
          success: !0,
          data: A,
        })
      : (console.error('[AI Service] 直播列表 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function fe(e, n, t) {
    console.info('[AI Service] fetchLiveDataFromAi 被调用，主播:', e, '标题:', n, '用户行为:', t);
    const a = V(),
      r = (0, A.nC)(e)?.name,
      i = o().uniq([e, r].filter(Boolean));
    let s;
    s = t ? `${t}\n\n请按照格式生成${e}的直播"${n}"的最新状态` : `按照格式生成${e}的直播"${n}"`;
    const c = {
        currentView: 'live',
        currentPage: '直播',
        userInput: s,
        formatGuide: a.formatGuide,
        historyConfig: a.historyConfig,
        targetCharacters: i,
      },
      d = await (0, C.hm)(a.blocks, c),
      p = (0, C.g0)(d);
    console.info('[AI Service] 直播详情 - 发送的消息:', p);
    const m = await Y(p, void 0, 'live');
    if (!m.success)
      return {
        success: !1,
        data: null,
        error: m.error,
      };
    console.info('[AI Service] 直播详情 - AI响应原始内容:', m.content);
    const g = await ne(m.content),
      u = te(m.content),
      f = g || u;
    return f
      ? ((0, l.uH)(f),
        {
          success: !0,
          data: f,
        })
      : (console.error('[AI Service] 直播详情 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function be(e, n, t, a) {
    console.info('[AI Service] postUserDynamic 被调用');
    const r = V(),
      i = t
        .slice(0, 5)
        .map((e, n) => `${n + 1}. ${e.name}: ${e.content.substring(0, 50)}...`)
        .join('\n'),
      s = n ? `，配图为：${n}` : '',
      c = {
        currentView: 'dynamic',
        currentPage: '动态',
        userInput: `只允许生成一条用户（${G()}）的动态，禁止生成任何额外动态（包括新增其他帖子、或生成多条用户动态）。\n需要有丰富的角色回复：为这条动态生成6-8条来自主要角色的评论回复（尽量覆盖主要角色，内容具体自然，符合角色口吻）。\n\n用户发送的内容如下：\n${e}${s}\n\n请在保持现有动态列表（共${t.length}条）顺序与内容不变的前提下，将用户这条动态插入到 posts[0]（isMyPost: true）。\n\n用户主动发送动态专用格式（仅本次使用）：\n<dynamic>\n# 生成一条用户的动态\n\nposts:\n  - name: {{用户网名}}\n    content: {{动态内容，约50-100字}}\n    image: {{配图文字描述，如无配图填null}}\n    likes: {{点赞数}}\n    shares: {{转发数}}\n    commentCount: {{评论数}}\n    isMyPost: true          # 必须有这个字段且为true\n    comments:\n      # 每条动态有【3-8条评论】\n      - name: {{评论者姓名}}\n        c: {{评论内容，约10-30字}}\n</dynamic>\n\n动态要求如下：保持与当前已有动态要求一致。\n\n现有动态列表（简要）：\n${i}`,
        formatGuide: r.formatGuide,
        historyConfig: r.historyConfig,
      },
      A = await (0, C.hm)(r.blocks, c),
      d = (0, C.g0)(A);
    console.info('[AI Service] 发布动态 - 发送的消息:', d);
    const p = await Y(d, void 0, 'dynamic');
    if (!p.success)
      return {
        success: !1,
        data: null,
        error: p.error,
      };
    console.info('[AI Service] 发布动态 - AI响应原始内容:', p.content);
    const m = await ne(p.content),
      g = te(p.content),
      u = m || g,
      f = u?.dynamic && 'object' == typeof u.dynamic ? u.dynamic : u;
    if (!f)
      return (
        console.error('[AI Service] 发布动态 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const b = String(a?.imageUrl || '').trim();
    if (b)
      try {
        const e = Array.isArray(f?.posts) ? f.posts : [];
        if (e.length > 0) {
          const t = (e) => {
              const n = String(e ?? '').trim();
              return n.startsWith('用户') ? n.slice(2).trim() : n;
            },
            a = new Set(),
            r = W(),
            i = G(),
            s = t(r),
            l = t(i);
          (r && a.add(r), i && a.add(i), s && a.add(s), l && a.add(l));
          try {
            const e =
                getVariables({
                  type: 'character',
                }) || {},
              n = String(o().get(e, 'phone_data.user.nickname') ?? '').trim(),
              r = t(n);
            (n && a.add(n), r && a.add(r), n && a.add(`用户${n}`));
          } catch {}
          const c = (e) => {
              const n = String(e?.name ?? '').trim();
              if (!n) return !1;
              if (a.has(n)) return !0;
              const o = t(n);
              return a.has(o);
            },
            A = 1 === e.length ? e[0] : e.find(c) || e.find((e) => !0 === e?.isMyPost) || e[0];
          A && ((A.imageUrl = b), n && (A.image = n), (A.isMyPost = !0));
        }
      } catch (e) {
        console.warn('[AI Service] 发布动态 - 追加图片失败(忽略):', e);
      }
    return (
      (0, l.uH)(f),
      {
        success: !0,
        data: f,
      }
    );
  }
  async function ve(e, n, t, a) {
    console.info('[AI Service] postUserForumPost 被调用');
    const o = V(),
      r = a
        .slice(0, 5)
        .map((e, n) => `${n + 1}. [${e.category || '未知'}] ${e.title}`)
        .join('\n'),
      i = G(),
      s = {
        currentView: 'forumPost',
        currentPage: '论坛帖子',
        userInput: `${i}在论坛发布了一个新帖子，分类：${n}，标题：${e}，正文内容大意：${t}。\n请生成这个帖子的详情内容，包括完整的正文和3-5条来自主要角色的评论回复。帖子作者是${i}。\n\n现有帖子列表：\n${r}`,
        formatGuide: o.formatGuide,
        historyConfig: o.historyConfig,
      },
      c = await (0, C.hm)(o.blocks, s),
      A = (0, C.g0)(c);
    console.info('[AI Service] 发布帖子 - 发送的消息:', A);
    const d = await Y(A, void 0, 'forumPost');
    if (!d.success)
      return {
        success: !1,
        data: null,
        error: d.error,
      };
    console.info('[AI Service] 发布帖子 - AI响应原始内容:', d.content);
    const p = await ne(d.content),
      m = te(d.content),
      g = p || m;
    return g
      ? ((0, l.uH)(g),
        {
          success: !0,
          data: g,
        })
      : (console.error('[AI Service] 发布帖子 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function xe(e, n, t, a) {
    console.info('[AI Service] sendUserEmail 被调用');
    const o = V(),
      r = a
        .slice(0, 5)
        .map((e, n) => `${n + 1}. ${e.sender?.name || '未知'}: ${e.title}`)
        .join('\n'),
      i = G(),
      s = {
        currentView: 'email',
        currentPage: '邮箱',
        userInput: `${i}发送了一封邮件，收件人：${e}，主题：${n}，内容：${t}。\n请在保持以下现有邮件不变的同时，在最顶部生成一封来自收件人的回信邮件。回信应该是收件人对${i}邮件的回复。\n\n现有邮件列表：\n${r}`,
        formatGuide: o.formatGuide,
        historyConfig: o.historyConfig,
        targetCharacters: [e],
      },
      l = await (0, C.hm)(o.blocks, s),
      c = (0, C.g0)(l);
    console.info('[AI Service] 发送邮件 - 发送的消息:', c);
    const A = await Y(c, void 0, 'email');
    if (!A.success)
      return {
        success: !1,
        data: null,
        error: A.error,
      };
    console.info('[AI Service] 发送邮件 - AI响应原始内容:', A.content);
    const d = await ne(A.content),
      p = te(A.content),
      m = d || p;
    return m
      ? {
          success: !0,
          data: m,
        }
      : (console.error('[AI Service] 发送邮件 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function he() {
    console.info('[AI Service] fetchEmailDataFromAi 被调用');
    const e = V();
    let n = '用户';
    try {
      const e = getVariables({
          type: 'character',
        }),
        t = o().get(e, 'phone_data');
      t?.user?.name && (n = t.user.name);
    } catch (e) {
      console.warn('[AI Service] 无法读取用户姓名:', e);
    }
    const t = {
        currentView: 'email',
        currentPage: '邮箱',
        userInput: `按照格式要求生成${n}的邮箱内容`,
        formatGuide: e.formatGuide,
        historyConfig: e.historyConfig,
      },
      a = await (0, C.hm)(e.blocks, t),
      r = (0, C.g0)(a);
    console.info('[AI Service] 邮箱 - 发送的消息:', r);
    const i = await Y(r, void 0, 'email');
    if (!i.success)
      return {
        success: !1,
        data: null,
        error: i.error,
      };
    console.info('[AI Service] 邮箱 - AI响应原始内容:', i.content);
    const s = await ne(i.content),
      c = te(i.content),
      A = s || c;
    return A
      ? ((0, l.uH)(A),
        {
          success: !0,
          data: A,
        })
      : (console.error('[AI Service] 邮箱 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function Be(e) {
    console.info('[AI Service] fetchBrowserDataFromAi 被调用，搜索词:', e);
    const n = V(),
      t = {
        currentView: 'browser',
        currentPage: '浏览器',
        userInput: `用户搜索：${e}，按照格式要求生成浏览器内容`,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
      },
      a = await (0, C.hm)(n.blocks, t),
      o = (0, C.g0)(a);
    console.info('[AI Service] 浏览器 - 发送的消息:', o);
    const r = await Y(o, void 0, 'browser');
    if (!r.success)
      return {
        success: !1,
        data: null,
        error: r.error,
      };
    console.info('[AI Service] 浏览器 - AI响应原始内容:', r.content);
    const i = await ne(r.content),
      s = te(r.content),
      c = i || s;
    return c
      ? ((0, l.uH)(c),
        {
          success: !0,
          data: c,
        })
      : (console.error('[AI Service] 浏览器 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function ye(e, n, t) {
    console.info('[AI Service] fetchPrivateChatDataFromAi 被调用，对象:', e);
    const a = V();
    let o;
    if (0 === n.length) o = `和${e}的私聊\n我方没有回复，让对方继续发送消息，请按照格式要求生成回复内容`;
    else {
      const t = n.join('\n');
      o = `和${e}的私聊\n${G()}（我方）发送：\n${t}\n请按照格式要求生成回复内容`;
    }
    o += `\n${g}`;
    const r = {
        currentView: 'privateChat',
        currentPage: '私聊',
        userInput: o,
        formatGuide: a.formatGuide,
        historyConfig: a.historyConfig,
        targetCharacters: [e],
      },
      i = await (0, C.hm)(a.blocks, r),
      s = (0, C.g0)(i);
    console.info('[AI Service] 私聊 - 发送的消息:', s);
    const c = await Y(s, void 0, 'privateChat', {
      visionInputs: t?.visionInputs,
    });
    if (!c.success)
      return {
        success: !1,
        data: null,
        error: c.error,
      };
    console.info('[AI Service] 私聊 - AI响应原始内容:', c.content);
    const A = await ne(c.content),
      d = te(c.content),
      p = A || d;
    if (!p)
      return (
        console.error('[AI Service] 私聊 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const m = B(p);
    if (m && Array.isArray(m.messages)) for (const e of m.messages) e && 'object' == typeof e && e.me && (e.me = !1);
    return (
      (0, l.uH)(m),
      {
        success: !0,
        data: m,
      }
    );
  }
  async function ke(e, n, t, a) {
    console.info('[AI Service] fetchGroupChatDataFromAi 被调用，群聊:', e, '成员:', n);
    const o = V();
    let r;
    if (a?.userInGroup ?? !0) {
      if (0 === t.length) r = `群聊"${e}"中\n我方没有发言，让群成员继续聊天，请按照格式要求生成群聊消息`;
      else {
        const n = t.join('\n');
        r = `群聊"${e}"中\n${G()}（我方）发送：\n${n}\n请按照格式要求生成群聊消息`;
      }
    } else
      r = `这个群聊中的人认为用户看不到群聊中的内容。\n群聊"${e}"中\n用户不在群聊里，让群成员继续聊天，请按照格式要求生成群聊消息`;
    r += `\n${g}`;
    const i = {
        currentView: 'groupChat',
        currentPage: '群聊',
        userInput: r,
        formatGuide: o.formatGuide
          ? {
              ...o.formatGuide,
              groupChat: q(o.formatGuide.groupChat),
            }
          : o.formatGuide,
        historyConfig: o.historyConfig,
        targetCharacters: n,
        extraInfo: U(e, n),
      },
      s = await (0, C.hm)(o.blocks, i),
      c = (0, C.g0)(s);
    console.info('[AI Service] 群聊 - 发送的消息:', c);
    const A = await Y(c, void 0, 'groupChat', {
      visionInputs: a?.visionInputs,
    });
    if (!A.success)
      return {
        success: !1,
        data: null,
        error: A.error,
      };
    console.info('[AI Service] 群聊 - AI响应原始内容:', A.content);
    const d = await ne(A.content),
      p = te(A.content),
      m = d || p;
    if (!m)
      return (
        console.error('[AI Service] 群聊 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const u = B(m),
      f =
        u?.group_message?.messages && Array.isArray(u.group_message.messages) ? u.group_message.messages : u?.messages;
    if (Array.isArray(f)) for (const e of f) e && 'object' == typeof e && e.me && (e.me = !1);
    return (
      (0, l.uH)(u),
      {
        success: !0,
        data: u,
      }
    );
  }
  async function Ee(e, n) {
    console.info('[AI Service] fetchVoiceCallDataFromAi 被调用，对象:', e);
    const t = V();
    let a;
    const o = G();
    a = n
      ? `${o}正在与${e}进行语音通话，${o}说：${n}\n请按照格式要求生成${e}的通话回复`
      : `${o}向${e}发起语音通话，按照格式要求生成语音通话内容`;
    const r = {
        currentView: 'voiceCall',
        currentPage: '通话',
        userInput: a,
        formatGuide: t.formatGuide,
        historyConfig: t.historyConfig,
        targetCharacters: [e],
      },
      i = await (0, C.hm)(t.blocks, r),
      s = (0, C.g0)(i);
    console.info('[AI Service] 语音通话 - 发送的消息:', s);
    const c = await Y(s, void 0, 'voiceCall');
    if (!c.success)
      return {
        success: !1,
        data: null,
        error: c.error,
      };
    console.info('[AI Service] 语音通话 - AI响应原始内容:', c.content);
    const A = await ne(c.content),
      d = te(c.content),
      p = A || d;
    return p
      ? ((0, l.uH)(p),
        {
          success: !0,
          data: p,
        })
      : (console.error('[AI Service] 语音通话 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function we() {
    console.info('[AI Service] fetchCalendarDataFromAi 被调用');
    const e = V(),
      n = {
        currentView: 'calendar',
        currentPage: '日历',
        userInput:
          '根据历史聊天内容，生成符合剧情走向和世界观的日历事件表。包括世界事件、大型事件、用户事件和角色事件。请确保日期、时间和星期的一致性。',
        formatGuide: e.formatGuide,
        historyConfig: e.historyConfig,
      },
      t = await (0, C.hm)(e.blocks, n),
      a = (0, C.g0)(t);
    console.info('[AI Service] 日历 - 发送的消息:', a);
    const o = await Y(a, void 0, 'calendar');
    if (!o.success)
      return {
        success: !1,
        data: null,
        error: o.error,
      };
    console.info('[AI Service] 日历 - AI响应原始内容:', o.content);
    const r = await ne(o.content),
      i = te(o.content),
      s = r || i;
    return s
      ? ((0, l.uH)(s),
        {
          success: !0,
          data: s,
        })
      : (console.error('[AI Service] 日历 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function Ne(e) {
    console.info('[AI Service] fetchDiaryDataFromAi 被调用，角色:', e);
    const n = V(),
      t = {
        currentView: 'diary',
        currentPage: '日记',
        userInput: `请按照格式生成${e}的最新日记，第一人称视角书写，包含日期、天气、日记内容以及可能收集到的纪念品。`,
        formatGuide: n.formatGuide,
        historyConfig: n.historyConfig,
        targetCharacters: [e],
      },
      a = await (0, C.hm)(n.blocks, t),
      o = (0, C.g0)(a);
    console.info('[AI Service] 日记 - 发送的消息:', o);
    const r = await Y(o, void 0, 'diary');
    if (!r.success)
      return {
        success: !1,
        data: null,
        error: r.error,
      };
    console.info('[AI Service] 日记 - AI响应原始内容:', r.content);
    const i = await ne(r.content),
      s = te(r.content),
      c = i || s;
    return c
      ? ((0, l.uH)(c),
        {
          success: !0,
          data: c,
        })
      : (console.error('[AI Service] 日记 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        });
  }
  async function Fe(e, n, t) {
    console.info('[AI Service] fetchListenTogetherDataFromAi 被调用，对象:', e);
    const a = V(),
      o = G(),
      r = t.playlist
        .map((e, n) => `${n + 1}. ${e.title} - ${e.artist}${n === t.currentIndex ? ' (正在播放)' : ''}`)
        .join('\n'),
      i = t.playlist[t.currentIndex],
      s = i ? `${i.title} - ${i.artist}` : '无',
      c = `${Math.floor(t.totalPlayTime / 60)}分${t.totalPlayTime % 60}秒`,
      A = `【一起听状态】\n歌单（共${t.playlist.length}首）:\n${r}\n\n当前播放: ${s}\n播放总时长: ${c}\n已播放完成: ${t.completedCount}首`;
    let d;
    if (0 === n.length) d = `${o}正在和${e}一起听歌，暂无新消息，请按照格式要求生成回复内容`;
    else {
      d = `${o}正在和${e}一起听歌\n消息记录：\n${n.join('\n')}\n请按照格式要求生成回复内容`;
    }
    const p = {
        currentView: 'listenTogether',
        currentPage: '一起听',
        userInput: d,
        formatGuide: a.formatGuide,
        historyConfig: a.historyConfig,
        targetCharacters: [e],
        extraInfo: A,
      },
      m = await (0, C.hm)(a.blocks, p),
      g = (0, C.g0)(m);
    console.info('[AI Service] 一起听 - 发送的消息:', g);
    const u = await Y(g, void 0, 'listenTogether');
    if (!u.success)
      return {
        success: !1,
        data: null,
        error: u.error,
      };
    console.info('[AI Service] 一起听 - AI响应原始内容:', u.content);
    const f = await ne(u.content),
      b = te(u.content),
      v = f || b;
    if (!v)
      return (
        console.error('[AI Service] 一起听 - 无法解析响应'),
        {
          success: !1,
          data: null,
          error: '无法解析 AI 响应数据',
        }
      );
    const x = B(
      v?.listen_together && 'object' == typeof v.listen_together
        ? v.listen_together
        : v?.['listen-together'] && 'object' == typeof v['listen-together']
          ? v['listen-together']
          : v,
    );
    return (
      (0, l.uH)(x),
      {
        success: !0,
        data: x,
      }
    );
  }
}
