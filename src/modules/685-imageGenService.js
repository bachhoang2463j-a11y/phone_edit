// webpack 模块 685（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  (t.d(n, {
    buildNaturalPromptText: () => buildNaturalPromptText,
    buildNaturalPromptTextEn: () => buildNaturalPromptTextEn,
    buildPromptRequestByMode: () => buildPromptRequestByMode,
    buildPromptText: () => buildPromptText,
    buildPromptTextByMode: () => buildPromptTextByMode,
    clearImageGenerationQueue: () => clearImageGenerationQueue,
    generateNovelAiImage: () => generateNovelAiImage,
    getImageGenerationQueueLength: () => getImageGenerationQueueLength,
    queueNovelAiImageGeneration: () => queueNovelAiImageGeneration,
  }),
    t.r(n));
  var a = t(920);
  function normalizeApiBaseUrl(e) {
    const n = String(e ?? '').trim();
    if (!n) return '';
    let t = n;
    /^https?:\/\//i.test(t) || (t = `https://${t}`);
    try {
      const e = new URL(t);
      ((e.hash = ''), (e.search = ''));
      let n = e.pathname || '';
      return (
        (n = n.replace(/\/+$/, '')),
        n.endsWith('/ai/generate-image')
          ? (n = n.slice(0, -18))
          : n.endsWith('/ai/module/all')
            ? (n = n.slice(0, -14))
            : /\/ai\/module\/[^/]+$/i.test(n)
              ? (n = n.replace(/\/ai\/module\/[^/]+$/i, ''))
              : n.endsWith('/ai/module')
                ? (n = n.slice(0, -10))
                : n.endsWith('/ai') && (n = n.slice(0, -3)),
        (n = n.replace(/\/+$/, '')),
        `${e.origin}${n}`
      );
    } catch {
      return '';
    }
  }
  var r = t(2178);
  function redactDataUrlForLog(e) {
    const n = String(e || '').trim();
    return n ? (n.startsWith('data:image/') ? `[data:image omitted, length=${n.length}]` : n) : '';
  }
  function redactDataUrlList(e) {
    return Array.isArray(e) ? e.map(redactDataUrlForLog).filter(Boolean) : [];
  }
  function cleanStringList(e) {
    return Array.isArray(e)
      ? e
          .map((e) => String(e ?? '').trim())
          .filter(Boolean)
          .filter((e) => '...' !== e && '…' !== e)
      : [];
  }
  function c(e) {
    const n = String(e ?? '').trim();
    return n
      ? n
          .split(/[\n\r,，]+/g)
          .map((e) => String(e ?? '').trim())
          .filter(Boolean)
          .filter((e) => '...' !== e && '…' !== e)
      : [];
  }
  function buildPromptText(e) {
    const n = [],
      t = (e) => {
        n.push(...cleanStringList(e));
      };
    t(e?.composition);
    const a = Array.isArray(e?.characters) ? e.characters : [];
    for (const e of a)
      (t(e?.traits), t(e?.outfit), t(e?.action), t(e?.body_parts_visible), t(e?.interaction), t(e?.nsfw));
    return (t(e?.entities), t(e?.background), n.join(', '));
  }
  function d(e) {
    if (null == e) return '';
    if ('string' == typeof e) return e.trim();
    if ('number' == typeof e || 'boolean' == typeof e) return String(e);
    if (Array.isArray(e)) {
      return e
        .map((e) => d(e))
        .filter(Boolean)
        .join(', ');
    }
    return '';
  }
  function p(e, n, t) {
    const a = d(t);
    a && e.push(`${n}：${a}`);
  }
  function C(e, n, t) {
    const a = d(t);
    a && e.push(`${n}: ${a}`);
  }
  function buildNaturalPromptText(e) {
    if ('string' == typeof e) return e.trim();
    if (!e || 'object' != typeof e) return '';
    const n = e,
      t = [];
    p(t, '人数构图区域焦点视角', n['人数构图区域焦点视角'] ?? n.composition);
    const a = Array.isArray(n['人物']) ? n['人物'] : null,
      o = Array.isArray(n.characters) ? n.characters : null;
    return (
      a && a.length > 0
        ? a.forEach((e, n) => {
            const a = d(e?.['姓名'] ?? e?.name);
            (t.push(a ? `人物${n + 1}（${a}）` : `人物${n + 1}`),
              p(t, '人物特征', e?.['人物特征']),
              p(t, '服装配饰', e?.['服装配饰']),
              p(t, '动作姿态神态交互', e?.['动作姿态神态交互']),
              p(t, '需强调的躯体元素', e?.['需强调的躯体元素']),
              p(t, 'NSFW相关', e?.['NSFW相关']));
          })
        : o &&
          o.length > 0 &&
          o.forEach((e, n) => {
            const a = d(e?.name);
            t.push(a ? `人物${n + 1}（${a}）` : `人物${n + 1}`);
            const o = cleanStringList(e?.traits).join(', '),
              r = cleanStringList(e?.outfit).join(', '),
              i = cleanStringList(e?.action).join(', '),
              s = cleanStringList(e?.body_parts_visible).join(', '),
              c = cleanStringList(e?.nsfw).join(', ');
            (o && t.push(`人物特征：${o}`),
              r && t.push(`服装配饰：${r}`),
              i && t.push(`动作姿态神态交互：${i}`),
              s && t.push(`需强调的躯体元素：${s}`),
              c && t.push(`NSFW相关：${c}`));
          }),
      p(t, '物品建筑生物', n['物品建筑生物'] ?? n.entities),
      p(t, '背景场景光照', n['背景场景光照'] ?? n.background),
      t.join('\n').trim()
    );
  }
  function buildNaturalPromptTextEn(e) {
    if ('string' == typeof e) return e.trim();
    if (!e || 'object' != typeof e) return '';
    const n = e,
      t = [];
    C(t, 'Composition / Focus / Perspective', n['人数构图区域焦点视角'] ?? n.composition);
    const a = Array.isArray(n['人物']) ? n['人物'] : null,
      o = Array.isArray(n.characters) ? n.characters : null;
    return (
      a && a.length > 0
        ? a.forEach((e, n) => {
            const a = d(e?.['姓名'] ?? e?.name);
            (t.push(a ? `Character ${n + 1} (${a})` : `Character ${n + 1}`),
              C(t, 'Traits', e?.['人物特征']),
              C(t, 'Outfit & Accessories', e?.['服装配饰']),
              C(t, 'Pose / Expression / Interaction', e?.['动作姿态神态交互']),
              C(t, 'Body Focus', e?.['需强调的躯体元素']),
              C(t, 'NSFW', e?.['NSFW相关']));
          })
        : o &&
          o.length > 0 &&
          o.forEach((e, n) => {
            const a = d(e?.name);
            t.push(a ? `Character ${n + 1} (${a})` : `Character ${n + 1}`);
            const o = cleanStringList(e?.traits).join(', '),
              r = cleanStringList(e?.outfit).join(', '),
              i = cleanStringList(e?.action).join(', '),
              s = cleanStringList(e?.body_parts_visible).join(', '),
              c = cleanStringList(e?.nsfw).join(', ');
            (o && t.push(`Traits: ${o}`),
              r && t.push(`Outfit & Accessories: ${r}`),
              i && t.push(`Pose / Expression / Interaction: ${i}`),
              s && t.push(`Body Focus: ${s}`),
              c && t.push(`NSFW: ${c}`));
          }),
      C(t, 'Objects / Architecture / Creatures', n['物品建筑生物'] ?? n.entities),
      C(t, 'Background / Scene / Lighting', n['背景场景光照'] ?? n.background),
      t.join('\n').trim()
    );
  }
  function buildPromptTextByMode(e, n) {
    return 'natural' === n
      ? buildNaturalPromptText(e)
      : 'natural_en' === n
        ? buildNaturalPromptTextEn(e)
        : buildPromptText(e);
  }
  function buildPromptRequestByMode(e, n) {
    const { prompt: t } = (function (e, n) {
        const t = (0, r.GO)();
        if (!e || 'object' != typeof e)
          return {
            prompt: e,
            overrides: t,
          };
        const a = e;
        if (('natural' === n || 'natural_en' === n) && Array.isArray(a['人物'])) {
          const e = {
            ...a,
          };
          return (
            (e['人物'] = a['人物'].map((e) => {
              const n = {
                  ...(e || {}),
                },
                a = String(n?.['姓名'] ?? n?.name ?? '').trim();
              if (!a) return n;
              const o = t.byName?.[a];
              if (!o?.traitsOverrideEnabled) return n;
              const r = String(o.traitsNatural || '').trim(),
                i = c(o.traitsTags).join(', '),
                s = r || i;
              return (s && (n['人物特征'] = s), n);
            })),
            {
              prompt: e,
              overrides: t,
            }
          );
        }
        if (Array.isArray(a.characters)) {
          const e = {
            ...a,
          };
          return (
            (e.characters = a.characters.map((e) => {
              const n = {
                  ...(e || {}),
                },
                a = String(n?.name ?? '').trim();
              if (!a) return n;
              const o = t.byName?.[a];
              if (!o?.traitsOverrideEnabled) return n;
              const r = c(o.traitsTags);
              return (r.length > 0 && (n.traits = r), n);
            })),
            {
              prompt: e,
              overrides: t,
            }
          );
        }
        return {
          prompt: e,
          overrides: t,
        };
      })(e, n),
      a = buildPromptTextByMode(t, n),
      o = (function (e) {
        const n = (0, r.GO)();
        if (!e || 'object' != typeof e) return [];
        const t = e,
          a = new Set();
        Array.isArray(t['人物'])
          ? t['人物'].forEach((e) => {
              const n = String(e?.['姓名'] ?? e?.name ?? '').trim();
              n && a.add(n);
            })
          : Array.isArray(t.characters) &&
            t.characters.forEach((e) => {
              const n = String(e?.name ?? '').trim();
              n && a.add(n);
            });
        const o = [];
        a.forEach((e) => {
          const t = n.byName?.[e];
          if (!t?.referenceImageEnabled) return;
          const a = String(t.referenceImage || '').trim();
          a && o.push(a);
        });
        const i = new Set();
        return o.filter((e) => !i.has(e) && (i.add(e), !0));
      })(e);
    return {
      promptText: a,
      referenceImages: o,
    };
  }
  function joinTagPrompts(...e) {
    const n = [];
    for (const t of e) {
      const e = String(t ?? '').trim();
      if (e)
        for (const t of e.split(/[，,]/)) {
          const e = t.trim();
          e && n.push(e);
        }
    }
    return n.join(', ');
  }
  function joinNaturalPrompts(...e) {
    const n = [];
    for (const t of e) {
      const e = String(t ?? '').trim();
      e && n.push(e);
    }
    return n.join('\n').trim();
  }
  async function blobToDataUrl(e) {
    return await new Promise((n, t) => {
      const a = new FileReader();
      ((a.onload = () => n(String(a.result || ''))),
        (a.onerror = () => t(a.error || new Error('读取图片失败'))),
        a.readAsDataURL(e));
    });
  }
  async function extractImageFromZip(e) {
    const n = new Uint8Array(e),
      t = new DataView(e),
      a = (function (e) {
        const n = Math.max(0, e.length - 22 - 65535);
        for (let t = e.length - 22; t >= n; t--)
          if (80 === e[t] && 75 === e[t + 1] && 5 === e[t + 2] && 6 === e[t + 3]) return t;
        return null;
      })(n);
    if (null == a) throw new Error('ZIP 结构错误：找不到 EOCD');
    const o = t.getUint16(a + 10, !0),
      r = t.getUint32(a + 16, !0),
      i = new TextDecoder();
    let s,
      l = r;
    for (let e = 0; e < o; e++) {
      if (33639248 !== t.getUint32(l, !0)) throw new Error('ZIP 结构错误：找不到中央目录文件头');
      const e = t.getUint16(l + 10, !0),
        a = t.getUint32(l + 20, !0),
        o = t.getUint16(l + 28, !0),
        r = t.getUint16(l + 30, !0),
        c = t.getUint16(l + 32, !0),
        A = t.getUint32(l + 42, !0),
        d = l + 46,
        p = n.slice(d, d + o),
        C = i.decode(p),
        m = C.endsWith('/'),
        g = C.toLowerCase(),
        u = g.endsWith('.png') || g.endsWith('.jpg') || g.endsWith('.jpeg') || g.endsWith('.webp');
      if (!s && !m && u && a > 0) {
        s = {
          fileName: C,
          compMethod: e,
          compSize: a,
          localHeaderOffset: A,
        };
        break;
      }
      l += 46 + o + r + c;
    }
    if (!s) throw new Error('ZIP 中未找到图片文件');
    if (67324752 !== t.getUint32(s.localHeaderOffset, !0)) throw new Error('ZIP 结构错误：找不到本地文件头');
    const c = t.getUint16(s.localHeaderOffset + 26, !0),
      A = t.getUint16(s.localHeaderOffset + 28, !0),
      d = s.localHeaderOffset + 30 + c + A,
      p = n.slice(d, d + s.compSize);
    let C;
    if (0 === s.compMethod) C = p;
    else {
      if (8 !== s.compMethod) throw new Error(`不支持的 ZIP 压缩算法: ${s.compMethod}`);
      C = await (async function (e) {
        const n = globalThis.DecompressionStream;
        if ('function' != typeof n) throw new Error('当前环境不支持解压 ZIP（DecompressionStream 不可用）');
        const t = new Blob([e]).stream().pipeThrough(new n('deflate-raw')),
          a = await new Response(t).arrayBuffer();
        return new Uint8Array(a);
      })(p);
    }
    const m = s.fileName.toLowerCase(),
      g = m.endsWith('.jpg') || m.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
    return new Blob([C], {
      type: g,
    });
  }
  function extractImageFromJson(e) {
    const n = /^[A-Za-z0-9+/]+={0,2}$/,
      t = /(?:data:|[a-z0-9.+-]+:)?image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=\s]+/i,
      a = (e) => {
        const t = e.replace(/\s+/g, '');
        return t.length < 256 ? null : n.test(t) ? t : null;
      },
      o = (e) => {
        if ('string' != typeof e) return null;
        const n = e.trim();
        if (!n) return null;
        if (/^https?:\/\//i.test(n)) return n;
        if (n.startsWith('data:image/')) return n;
        const t = n.match(/^(?:[a-z0-9.+-]+:)?(image\/[a-z0-9.+-]+;base64,)([\s\S]+)$/i);
        if (t) {
          const e = a(t[2]);
          return e ? `data:${t[1]}${e}` : null;
        }
        const o = a(n);
        return o ? `data:image/png;base64,${o}` : null;
      },
      r = (e) => {
        if (!e) return null;
        const n = e.match(/!\[[\s\S]*?\]\(([\s\S]*?)\)/);
        if (n && n[1]) {
          const e = o(n[1]);
          if (e) return e;
        }
        const a = e.match(t);
        if (a) {
          const e = o(a[0]);
          if (e) return e;
        }
        return o(e);
      },
      i = (e) => {
        if (!e) return null;
        const n = e.inline_data || e.inlineData,
          t = e.file_data || e.fileData;
        if (n?.data) {
          const e = n.mime_type || n.mimeType || 'image/png',
            t = a(String(n.data));
          if (t) return `data:${e};base64,${t}`;
        }
        if (t?.file_uri || t?.fileUri) {
          const e = t.file_uri || t.fileUri,
            n = o(e);
          if (n) return n;
        }
        if ('string' == typeof e.url) {
          const n = o(e.url);
          if (n) return n;
        }
        if ('string' == typeof e.text) {
          const n = r(e.text);
          if (n) return n;
        }
        return null;
      };
    if (!e) return null;
    if ('string' == typeof e) {
      const n = o(e);
      if (n) return n;
    }
    const s = e?.resultUrl ?? e?.result_url;
    if ('string' == typeof s) {
      const e = o(s);
      if (e) return e;
    }
    if (Array.isArray(e?.candidates)) {
      const n = ((e) => {
        for (const n of e) {
          const e = n?.content?.parts;
          if (Array.isArray(e))
            for (const n of e) {
              const e = i(n);
              if (e) return e;
            }
        }
        return null;
      })(e.candidates);
      if (n) return n;
    }
    const l = e?.data?.[0];
    if (l) {
      if ('string' == typeof l) {
        const e = o(l);
        if (e) return e;
      }
      if ('string' == typeof l?.url) {
        const e = o(l.url);
        if (e) return e;
      }
      if ('string' == typeof l?.b64_json) {
        const e = o(l.b64_json);
        if (e) return e;
      }
    }
    const c = e?.image_base64 ?? e?.imageBase64 ?? e?.image ?? e?.b64_json ?? e?.base64 ?? e?.b64;
    if ('string' == typeof c) {
      const e = o(c);
      if (e) return e;
    }
    const A = e?.images;
    if (Array.isArray(A) && 'string' == typeof A[0]) {
      const e = o(A[0]);
      if (e) return e;
    }
    const d = e?.choices?.[0]?.message,
      p = ((e) => {
        if (!e) return null;
        if (Array.isArray(e.content))
          for (const n of e.content) {
            if ('image_url' === n?.type) {
              const e = o(n?.image_url?.url || n?.image_url);
              if (e) return e;
            }
            if ('text' === n?.type && 'string' == typeof n.text) {
              const e = r(n.text);
              if (e) return e;
            }
          }
        if ('string' == typeof e.content) {
          const n = r(e.content);
          if (n) return n;
        }
        if ('string' == typeof e.reasoning_content) {
          const n = r(e.reasoning_content);
          if (n) return n;
        }
        return null;
      })(d);
    if (p) return p;
    const C = r(String(e?.text ?? e?.output_text ?? ''));
    return C || null;
  }
  async function generateNovelAiImage(e, n) {
    const t = n?.config || (0, a.loadNovelAiConfig)(),
      r = t.promptComposeMode || 'tags',
      l = Array.isArray(n?.referenceImages) ? n.referenceImages.map((e) => String(e ?? '').trim()).filter(Boolean) : [],
      c = (e) => {
        const n = String(e || '')
          .trim()
          .match(/^data:([^;]+);base64,([\s\S]+)$/i);
        if (!n) return null;
        const t = n[1] ? String(n[1]).trim() : 'image/png',
          a = String(n[2] || '').replace(/\s+/g, '');
        return a
          ? {
              mime: t,
              base64: a,
            }
          : null;
      },
      A = (e, n) => {
        const t = e.replace(/\/+$/, '');
        return new RegExp(`/${n}(?:/|$)`).test(t) ? t : `${t}/${n}`;
      },
      d = async (e) => {
        if (!e.ok) {
          if ((e.headers.get('content-type') || '').includes('application/json')) {
            const n = await e.json().catch(() => null),
              t = n?.error?.message || n?.message || n?.detail;
            throw new Error(t ? String(t) : `HTTP ${e.status}: ${e.statusText}`);
          }
          const n = await e.text().catch(() => '');
          throw new Error(n ? `HTTP ${e.status}: ${n}` : `HTTP ${e.status}: ${e.statusText}`);
        }
        const n = e.headers.get('content-type') || '';
        if (n.includes('application/json')) {
          const n = extractImageFromJson(await e.json());
          if (!n) throw new Error('未识别的生图返回格式（JSON）');
          return {
            dataUrl: n,
          };
        }
        if (n.startsWith('image/')) {
          const n = await e.blob();
          return {
            dataUrl: await blobToDataUrl(n),
          };
        }
        const t = await e.arrayBuffer(),
          a = new Uint8Array(t);
        if (a.length >= 4 && 80 === a[0] && 75 === a[1]) {
          const e = await extractImageFromZip(t);
          return {
            dataUrl: await blobToDataUrl(e),
          };
        }
        const o = new Blob([t], {
          type: 'image/png',
        });
        return {
          dataUrl: await blobToDataUrl(o),
        };
      };
    if ('comfyui' === t.apiFormat) {
      const cfu = t.comfyui || {},
        cfuUrl = String(cfu.url || '').trim();
      if (!cfuUrl) throw new Error('未配置 ComfyUI URL');
      const cfPrompt =
          'natural' === r || 'natural_en' === r
            ? joinNaturalPrompts(cfu.promptPrefix, e, cfu.promptSuffix)
            : joinTagPrompts(cfu.promptPrefix, e, cfu.promptSuffix),
        cfNeg = joinTagPrompts(cfu.negativePrompt),
        cfPos = String(cfu.positivePromptNodeId || '').trim() || '6',
        cfNegN = String(cfu.negativePromptNodeId || '').trim() || '7',
        cfSampler = String(cfu.samplerNodeId || '').trim() || '3',
        cfSeed = Math.floor(4294967295 * Math.random()),
        cfRaw = String(cfu.workflowJson || '').trim();
      let cfWf;
      if (cfRaw) {
        try {
          cfWf = JSON.parse(cfRaw);
        } catch (cfE) {
          throw new Error('ComfyUI 工作流 JSON 解析失败：' + String(cfE instanceof Error ? cfE.message : cfE));
        }
        if (!cfWf || 'object' != typeof cfWf || Array.isArray(cfWf)) throw new Error('ComfyUI 工作流 JSON 格式无效');
      } else {
        cfWf = {
          4: {
            class_type: 'CheckpointLoaderSimple',
            inputs: {
              ckpt_name: '',
            },
          },
          6: {
            class_type: 'CLIPTextEncode',
            inputs: {
              text: String(cfPrompt || ''),
              clip: ['4', 1],
            },
          },
          7: {
            class_type: 'CLIPTextEncode',
            inputs: {
              text: String(cfNeg || ''),
              clip: ['4', 1],
            },
          },
          3: {
            class_type: 'KSampler',
            inputs: {
              seed: cfSeed,
              steps: 20,
              cfg: 8,
              sampler_name: 'euler',
              scheduler: 'normal',
              denoise: 1,
              model: ['4', 0],
              positive: ['6', 0],
              negative: ['7', 0],
            },
          },
          8: {
            class_type: 'VAEDecode',
            inputs: {
              samples: ['3', 0],
              vae: ['4', 2],
            },
          },
          9: {
            class_type: 'SaveImage',
            inputs: {
              filename_prefix: 'improved_phone',
              images: ['8', 0],
            },
          },
        };
        const cfCk = cfWf['4'];
        if (cfCk && 'object' == typeof cfCk && 'inputs' in cfCk) {
          const cfM = String(cfu.model || '').trim();
          cfM && (cfCk.inputs.ckpt_name = cfM);
        }
      }
      const cfPT = cfWf[cfPos];
      if (cfPT && 'object' == typeof cfPT && cfPT.inputs && 'object' == typeof cfPT.inputs && 'text' in cfPT.inputs)
        cfPT.inputs.text = String(cfPrompt || '');
      const cfNT = cfWf[cfNegN];
      if (cfNT && 'object' == typeof cfNT && cfNT.inputs && 'object' == typeof cfNT.inputs && 'text' in cfNT.inputs)
        cfNT.inputs.text = String(cfNeg || '');
      if (cfSampler in cfWf && cfWf[cfSampler] && 'object' == typeof cfWf[cfSampler]) {
        const cfS = cfWf[cfSampler];
        if ('inputs' in cfS && cfS.inputs && 'object' == typeof cfS.inputs) {
          const cfO = cfS.inputs.seed;
          if (!('number' == typeof cfO && cfO >= 0)) cfS.inputs.seed = cfSeed;
        } else cfS.seed = cfSeed;
      }
      const cfBase = cfuUrl.replace(/\/+$/, '');
      let cfRes;
      try {
        cfRes = await fetch(cfBase + '/prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: cfWf,
            client_id: 'improved-phone-' + Math.random().toString(36).slice(2),
          }),
          signal: n?.signal,
        });
      } catch (cfE) {
        throw new Error(
          'ComfyUI 请求失败（请确认本地服务已启动且允许跨域 --enable-cors-header "*"）：' +
            String(cfE instanceof Error ? cfE.message : cfE),
        );
      }
      if (!cfRes.ok) {
        const cfTxt = await cfRes.text().catch(() => '');
        throw new Error('ComfyUI 提交失败 HTTP ' + cfRes.status + ': ' + (cfTxt ? cfTxt : '未知错误'));
      }
      const cfBody = await cfRes.json().catch(() => null),
        cfId = cfBody?.prompt_id;
      if (!cfId) throw new Error('ComfyUI 响应缺少 prompt_id');
      const cfDeadline = Date.now() + 120000;
      let cfHis = null;
      for (;;) {
        if (n?.signal?.aborted) throw new Error('生成已取消');
        if (Date.now() > cfDeadline) throw new Error('ComfyUI 生成超时（120 秒）');
        await new Promise((cfE) => setTimeout(cfE, 1000));
        const cfHr = await fetch(cfBase + '/history/' + cfId, {
          signal: n?.signal,
        });
        if (!cfHr.ok) continue;
        const cfH = await cfHr.json().catch(() => null),
          cfEntry = cfH?.[cfId];
        if (!cfEntry) continue;
        if (cfEntry.status?.status_str === 'error' || cfEntry.status?.error) {
          const cfMsg = cfEntry.status?.messages?.find(
            (e) => e && 'object' == typeof e && 'error' === e[0] && e[1]?.message,
          );
          throw new Error('ComfyUI 生成失败：' + String(cfMsg?.[1]?.message || '未知错误'));
        }
        if (cfEntry.status?.completed || cfEntry.outputs) {
          cfHis = cfEntry;
          break;
        }
      }
      const cfOut = cfHis?.outputs || {};
      let cfFile = '',
        cfSub = '';
      for (const cfK in cfOut) {
        const cfImg = cfOut[cfK]?.images?.[0];
        if (cfImg && cfImg.filename) {
          cfFile = cfImg.filename;
          cfSub = cfImg.subfolder || '';
          break;
        }
      }
      if (!cfFile) throw new Error('ComfyUI 输出中未找到图片');
      const cfVr = await fetch(
        cfBase +
          '/view?filename=' +
          encodeURIComponent(cfFile) +
          (cfSub ? '&subfolder=' + encodeURIComponent(cfSub) : '') +
          '&type=output',
        {
          signal: n?.signal,
        },
      );
      if (!cfVr.ok) throw new Error('ComfyUI 获取图片失败 HTTP ' + cfVr.status);
      const cfUrl = await blobToDataUrl(await cfVr.blob());
      return (
        console.info('[AI] image result', {
          url: redactDataUrlForLog(cfUrl),
          length: cfUrl.length,
        }),
        {
          dataUrl: cfUrl,
        }
      );
    }
    if ('pollinations' === t.apiFormat) {
      const n = t.pollinations,
        a =
          'natural' === r || 'natural_en' === r
            ? joinNaturalPrompts(n.promptPrefix, e, n.promptSuffix)
            : joinTagPrompts(n.promptPrefix, e, n.promptSuffix),
        o = ((e, n, t, a) => {
          const o = 'https://gen.pollinations.ai/image',
            r = String(e || '').trim() || o,
            [i] = r.split('#'),
            [s, l = ''] = i.split('?');
          let c = String(s || '')
            .trim()
            .replace(/\/+$/, '');
          (c || (c = o),
            /^https?:\/\/image\.pollinations\.ai(?:\/|$)/i.test(c) &&
              (c = c.replace(/^https?:\/\/image\.pollinations\.ai/i, 'https://gen.pollinations.ai')),
            /\/prompt(?:$|\/)/i.test(c) && (c = c.replace(/\/prompt(?:\/.*)?$/i, '/image')),
            (c = /\/image(?:$|\/)/i.test(c) ? c.replace(/\/image\/.*$/i, '/image') : `${c}/image`));
          const A = new URLSearchParams(l),
            d = String(t || '').trim(),
            p = String(a || '').trim();
          (d && A.set('model', d), p && A.set('key', p));
          const C = A.toString();
          return `${c}/${encodeURIComponent(n)}${C ? `?${C}` : ''}`;
        })(n.url, String(a || ''), n.model, n.key);
      let s = !1;
      try {
        return (
          console.groupCollapsed('[AI] image (pollinations)'),
          (s = !0),
          console.info('[AI] prompt', String(a || '')),
          console.info('[AI] request url', o),
          console.info('[AI] image result', {
            url: redactDataUrlForLog(o),
            length: o.length,
          }),
          {
            dataUrl: o,
          }
        );
      } finally {
        s && console.groupEnd();
      }
    }
    if ('openai' === t.apiFormat) {
      const a = t.openai,
        o = String(a.url || '').trim();
      if (!o) throw new Error('未配置 OpenAI Base URL');
      if (!a.key) throw new Error('未配置 OpenAI Key');
      const c = String(a.model || '').trim();
      if (!c) throw new Error('未配置 OpenAI 模型');
      const p = (() => {
          const e = o.replace(/\/+$/, '');
          if (/\/chat\/completions$/i.test(e)) return e;
          return `${A(e, 'v1')}/chat/completions`;
        })(),
        C =
          'natural' === r || 'natural_en' === r
            ? joinNaturalPrompts(a.promptPrefix, e, a.promptSuffix)
            : joinTagPrompts(a.promptPrefix, e, a.promptSuffix),
        m = a.aspectRatio && 'auto' !== a.aspectRatio ? a.aspectRatio : null,
        g = [];
      if (m) {
        const e = JSON.stringify({
          imageConfig: {
            aspectRatio: m,
          },
        });
        g.push({
          role: 'system',
          content: e,
        });
      }
      const u = [
        {
          type: 'text',
          text: String(C || ''),
        },
      ];
      (l.forEach((e) => {
        u.push({
          type: 'image_url',
          image_url: {
            url: e,
          },
        });
      }),
        g.push({
          role: 'user',
          content: u,
        }));
      const f = {
        model: c,
        stream: !1,
        messages: g,
      };
      m &&
        (f.extra_body = {
          imageConfig: {
            aspectRatio: m,
          },
        });
      let x = !1;
      try {
        (console.groupCollapsed(`[AI] image (openai/${c})`),
          (x = !0),
          console.info('[AI] prompt', String(C || '')),
          console.info('[AI] referenceImages', redactDataUrlList(l)),
          console.info('[AI] request body', f));
        const e = await fetch(p, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${a.key}`,
              'x-api-key': a.key,
              'Content-Type': 'application/json',
              Accept: 'application/json, image/png, image/jpeg, application/zip',
            },
            body: JSON.stringify(f),
            signal: n?.signal,
          }),
          t = await d(e);
        return (
          console.info('[AI] image result', {
            url: redactDataUrlForLog(t.dataUrl),
            length: t.dataUrl.length,
          }),
          t
        );
      } finally {
        x && console.groupEnd();
      }
    }
    if ('gemini' === t.apiFormat) {
      const a = t.gemini,
        o = String(a.url || '').trim();
      if (!o) throw new Error('未配置 Gemini Base URL');
      if (!a.key) throw new Error('未配置 Gemini Key');
      const p = String(a.model || '').trim();
      if (!p) throw new Error('未配置 Gemini 模型');
      const C = p.replace(/^models\//i, ''),
        m = (() => {
          const e = o.replace(/\/+$/, '');
          if (/:generateContent$/i.test(e)) return e;
          return `${A(e, 'v1beta')}/models/${C}:generateContent`;
        })(),
        g =
          'natural' === r || 'natural_en' === r
            ? joinNaturalPrompts(a.promptPrefix, e, a.promptSuffix)
            : joinTagPrompts(a.promptPrefix, e, a.promptSuffix),
        u = a.aspectRatio && 'auto' !== a.aspectRatio ? a.aspectRatio : null,
        f = a.imageSize && 'auto' !== a.imageSize ? a.imageSize : null,
        x = {
          responseModalities: ['TEXT', 'IMAGE'],
        };
      if (u || f) {
        const e = {};
        (u && (e.aspectRatio = u), f && (e.imageSize = f), (x.imageConfig = e));
      }
      const h = {
          contents: [
            {
              role: 'user',
              parts: (() => {
                const e = [
                  {
                    text: String(g || ''),
                  },
                ];
                return (
                  l.forEach((n) => {
                    const t = c(n);
                    t
                      ? e.push({
                          inline_data: {
                            mime_type: t.mime,
                            data: t.base64,
                          },
                        })
                      : /^https?:\/\//i.test(n) &&
                        e.push({
                          file_data: {
                            file_uri: n,
                          },
                        });
                  }),
                  e
                );
              })(),
            },
          ],
          generationConfig: x,
        },
        B = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
      m.includes('generativelanguage.googleapis.com')
        ? (B['x-goog-api-key'] = a.key)
        : (B.Authorization = `Bearer ${a.key}`);
      let y = !1;
      try {
        (console.groupCollapsed(`[AI] image (gemini/${C})`),
          (y = !0),
          console.info('[AI] prompt', String(g || '')),
          console.info('[AI] referenceImages', redactDataUrlList(l)),
          console.info('[AI] request body', h));
        const e = await fetch(m, {
            method: 'POST',
            headers: B,
            body: JSON.stringify(h),
            signal: n?.signal,
          }),
          t = await d(e);
        return (
          console.info('[AI] image result', {
            url: redactDataUrlForLog(t.dataUrl),
            length: t.dataUrl.length,
          }),
          t
        );
      } finally {
        y && console.groupEnd();
      }
    }
    const p = t.novelai,
      C =
        'natural' === r || 'natural_en' === r
          ? joinNaturalPrompts(p.promptPrefix, e, p.promptSuffix)
          : joinTagPrompts(p.promptPrefix, e, p.promptSuffix),
      m = joinTagPrompts(p.negativePrompt),
      g = p.width || 1024,
      u = p.height || 1024,
      f = p.seed >= 0 ? p.seed : Math.floor(4294967295 * Math.random()),
      y = (function (e) {
        const n = normalizeApiBaseUrl(e);
        return n ? `${n}/ai/generate-image` : '';
      })(p.url);
    if (!y) throw new Error('未配置 NovelAI URL');
    if (!p.key) throw new Error('未配置 NovelAI Key');
    const k = p.model || 'nai-diffusion-3',
      E = k.includes('nai-diffusion-4-5'),
      w = !!p.characterReferenceEnabled,
      N = p.characterReferenceStyleAware ?? !0,
      F = Math.max(0, Math.min(1, p.characterReferenceFidelity ?? 0.8));
    let V = null;
    if (p.varietyBoost) {
      const e = E ? 58 : 19,
        n = (g * u) / 1011712;
      V = Math.pow(n, 0.5) * e;
    }
    const D = {
        action: 'generate',
        input: String(C || ''),
        model: k,
        parameters: {
          params_version: 3,
          width: g,
          height: u,
          scale: p.cfg ?? 5,
          seed: f,
          sampler: p.sampler || 'k_euler',
          noise_schedule: p.scheduler || 'karras',
          steps: p.steps ?? 28,
          n_samples: 1,
          ucPreset: p.ucPreset ?? 0,
          qualityToggle: p.qualityToggle ?? !0,
          autoSmea: p.autoSmea ?? !1,
          cfg_rescale: p.cfgRescale ?? 0,
          dynamic_thresholding: p.decrisper ?? !1,
          controlnet_strength: 1,
          legacy: !1,
          add_original_image: !0,
          legacy_v3_extend: !1,
          use_coords: !1,
          legacy_uc: !1,
          normalize_reference_strength_multiple: !0,
          inpaintImg2ImgStrength: 1,
          deliberate_euler_ancestral_bug: !1,
          prefer_brownian: !0,
          image_format: 'png',
          skip_cfg_above_sigma: V,
          sm: p.sm ?? !1,
          sm_dyn: p.smDyn ?? !1,
          characterPrompts: [],
          v4_prompt: {
            caption: {
              base_caption: String(C || ''),
              char_captions: [],
            },
            use_coords: !1,
            use_order: !0,
          },
          v4_negative_prompt: {
            caption: {
              base_caption: String(m || ''),
              char_captions: [],
            },
            legacy_uc: !1,
          },
          negative_prompt: String(m || ''),
        },
      },
      S = {
        mode: 'none',
        count: 0,
      };
    let M,
      I = null;
    if (w && E && l.length > 0) {
      const e = l
        .map((e) => String(e || '').trim())
        .filter(Boolean)
        .filter((e) => !!c(e));
      if (e.length > 0) {
        const n = () => {
            const e = globalThis.crypto;
            if (e?.getRandomValues) {
              const n = new Uint8Array(32);
              return (e.getRandomValues(n), Array.from(n, (e) => e.toString(16).padStart(2, '0')).join(''));
            }
            let n = '';
            for (let e = 0; e < 64; e++) n += Math.floor(16 * Math.random()).toString(16);
            return n;
          },
          t = async (e) =>
            await new Promise((n, t) => {
              const a = new Image();
              ((a.onload = () => n(a)), (a.onerror = () => t(new Error('参考图加载失败'))), (a.src = e));
            }),
          a = async (e) => {
            const a = c(e)?.base64 || '',
              o = n();
            try {
              const n = await t(e),
                r = n.naturalWidth || n.width || 0,
                i = n.naturalHeight || n.height || 0;
              if (!r || !i)
                return a
                  ? {
                      cache_secret_key: o,
                      data: a,
                    }
                  : null;
              const s = r / i,
                l =
                  Math.abs(s - 1) <= 0.1
                    ? {
                        w: 1472,
                        h: 1472,
                      }
                    : s > 1
                      ? {
                          w: 1536,
                          h: 1024,
                        }
                      : {
                          w: 1024,
                          h: 1536,
                        },
                A = document.createElement('canvas');
              ((A.width = l.w), (A.height = l.h));
              const d = A.getContext('2d');
              if (!d)
                return a
                  ? {
                      cache_secret_key: o,
                      data: a,
                    }
                  : null;
              ((d.fillStyle = '#000'), d.fillRect(0, 0, l.w, l.h));
              const p = Math.min(l.w / r, l.h / i),
                C = r * p,
                m = i * p,
                g = (l.w - C) / 2,
                u = (l.h - m) / 2;
              d.drawImage(n, g, u, C, m);
              const f = A.toDataURL('image/png'),
                b = c(f)?.base64 || a;
              return b
                ? {
                    cache_secret_key: o,
                    data: b,
                  }
                : null;
            } catch {
              return a
                ? {
                    cache_secret_key: o,
                    data: a,
                  }
                : null;
            }
          },
          o = e.slice(0, 1),
          r = (await Promise.all(o.map(a))).filter(Boolean);
        if (r.length > 0) {
          const e = N ? 'character&style' : 'character',
            n = 1,
            t = Math.max(0, Math.min(1, 1 - F));
          ((D.parameters.director_reference_images_cached = r),
            (D.parameters.director_reference_information_extracted = r.map(() => 1)),
            (D.parameters.director_reference_strength_values = r.map(() => n)),
            (D.parameters.director_reference_secondary_strength_values = r.map(() => t)),
            (D.parameters.director_reference_descriptions = r.map(() => ({
              caption: {
                base_caption: e,
                char_captions: [],
              },
              legacy_uc: !1,
            }))),
            (D.parameters.skip_cfg_above_sigma = null),
            (S.mode = 'character_reference'),
            (S.count = r.length),
            (I = {
              baseCaption: e,
              fidelity: F,
              secondaryStrength: t,
            }));
        }
      }
    }
    const T = (() => {
      const e = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let n = '';
      for (let t = 0; t < 6; t++) n += e[Math.floor(62 * Math.random())];
      return n;
    })();
    console.info('[NovelAI] generate-image', {
      correlationId: T,
      model: k,
      characterReferenceEnabled: w,
      appliedReference: S,
      characterReference: I,
      skip_cfg_above_sigma: D.parameters?.skip_cfg_above_sigma ?? null,
    });
    let Y = !1;
    try {
      (console.groupCollapsed(`[AI] image (novelai/${k})`),
        (Y = !0),
        console.info('[AI] prompt', String(C || '')),
        console.info('[AI] negativePrompt', String(m || '')),
        console.info('[AI] referenceImages', redactDataUrlList(l)),
        console.info('[AI] request body', D),
        (M = await fetch(y, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${p.key}`,
            'Content-Type': 'application/json',
            Accept: 'application/zip, image/png, image/jpeg, application/json',
            'x-correlation-id': T,
          },
          body: JSON.stringify(D),
          signal: n?.signal,
        })));
    } catch (e) {
      if (
        (() => {
          try {
            return new URL(y).origin !== window.location.origin;
          } catch {
            return !1;
          }
        })()
      )
        throw new Error(
          '请求被浏览器拦截（跨域/CORS）。请使用支持 CORS 的 API URL（需响应 OPTIONS 且包含 Access-Control-Allow-Origin）。',
        );
      throw e;
    }
    try {
      const e = await d(M);
      return (
        console.info('[AI] image result', {
          url: redactDataUrlForLog(e.dataUrl),
          length: e.dataUrl.length,
        }),
        e
      );
    } catch (e) {
      const n = e instanceof Error ? e.message : '生图失败';
      throw new Error(`${n} (x-correlation-id: ${T})`);
    } finally {
      Y && console.groupEnd();
    }
  }
  const taskQueue = [];
  let isProcessingQueue = !1;
  async function queueNovelAiImageGeneration(e, n) {
    const t = n?.config || (0, a.loadNovelAiConfig)();
    return 'novelai' !== t.apiFormat
      ? generateNovelAiImage(e, {
          ...n,
          config: t,
        })
      : new Promise((a, o) => {
          (taskQueue.push({
            promptText: e,
            options: {
              ...n,
              config: t,
            },
            resolve: a,
            reject: o,
          }),
            console.info('[NovelAI] 图像生成已加入队列，当前队列长度:', taskQueue.length),
            (async function () {
              if (!isProcessingQueue) {
                for (isProcessingQueue = !0; taskQueue.length > 0;) {
                  const e = taskQueue.shift();
                  if (e)
                    if (e.options?.signal?.aborted) e.reject(new Error('生成已取消'));
                    else
                      try {
                        const n = await generateNovelAiImage(e.promptText, e.options);
                        e.resolve(n);
                      } catch (n) {
                        e.reject(n instanceof Error ? n : new Error('生图失败'));
                      }
                }
                isProcessingQueue = !1;
              }
            })());
        });
  }
  function getImageGenerationQueueLength() {
    return taskQueue.length;
  }
  function clearImageGenerationQueue() {
    for (; taskQueue.length > 0;) {
      const e = taskQueue.shift();
      e && e.reject(new Error('队列已清空'));
    }
  }
}
