// webpack 模块 920（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.r(n), t.d(n, {
    GEMINI_IMAGE_SIZE_OPTIONS: () => o,
    IMAGE_ASPECT_RATIO_OPTIONS: () => a,
    getDefaultNovelAiConfig: () => p,
    loadNovelAiConfig: () => w,
    saveNovelAiConfig: () => N
  });
  const a = ['auto', '1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
    o = ['auto', '1K', '2K', '4K'],
    r = 'phone_novelai_config',
    i = 'novelai',
    s = 'none',
    l = {
      url: '',
      key: '',
      model: 'nai-diffusion-4-5-full',
      promptPrefix: '',
      promptSuffix: '',
      negativePrompt: '',
      width: 1024,
      height: 1024,
      steps: 28,
      cfg: 5,
      sampler: 'k_euler',
      scheduler: 'karras',
      seed: -1,
      ucPreset: 0,
      qualityToggle: !0,
      autoSmea: !1,
      decrisper: !1,
      sm: !1,
      smDyn: !1,
      cfgRescale: 0,
      varietyBoost: !1,
      characterReferenceEnabled: !1,
      characterReferenceStyleAware: !0,
      characterReferenceFidelity: .8
    },
    c = {
      url: '',
      key: '',
      model: '',
      promptPrefix: '',
      promptSuffix: '',
      aspectRatio: 'auto'
    },
    A = {
      url: '',
      key: '',
      model: '',
      promptPrefix: '',
      promptSuffix: '',
      aspectRatio: 'auto',
      imageSize: 'auto'
    },
    d = {
      url: 'https://gen.pollinations.ai/image',
      key: '',
      model: '',
      promptPrefix: '',
      promptSuffix: ''
    },
    q = {
      url: 'http://127.0.0.1:8188',
      key: '',
      model: '',
      workflowJson: '',
      positivePromptNodeId: '6',
      negativePromptNodeId: '7',
      samplerNodeId: '3',
      promptPrefix: '',
      promptSuffix: '',
      negativePrompt: ''
    };
  function p() {
    return {
      apiFormat: i,
      promptComposeMode: s,
      novelai: {
        ...l
      },
      openai: {
        ...c
      },
      gemini: {
        ...A
      },
      pollinations: {
        ...d
      },
      comfyui: {
        ...q
      }
    };
  }
  function C(e, n, t) {
    return Number.isFinite(e) ? Math.min(t, Math.max(n, e)) : n;
  }
  function m(e, n) {
    if ('number' == typeof e && Number.isFinite(e)) return e;
    if ('string' == typeof e && '' !== e.trim()) {
      const n = Number(e);
      if (Number.isFinite(n)) return n;
    }
    return n;
  }
  function g(e, n) {
    const t = m(e, n);
    return Number.isFinite(t) ? Math.trunc(t) : n;
  }
  function u(e, n) {
    const t = C(g(e, n), 64, 4096);
    return 64 * Math.round(t / 64);
  }
  function f(e, n) {
    const t = g(e, n);
    return t < 0 ? -1 : C(t, 0, 4294967295);
  }
  function b(e, n) {
    const t = String(e ?? '').trim();
    return 'novelai' === t || 'openai' === t || 'gemini' === t || 'pollinations' === t || 'comfyui' === t ? t : n;
  }
  function v(e, n) {
    const t = String(e ?? '').trim();
    return 'tags' === t || 'natural' === t || 'natural_en' === t ? t : n;
  }
  function x(e, n) {
    const t = String(e ?? '').trim();
    return 'auto' === t ? 'auto' : a.includes(t) ? t : n;
  }
  function h(e, n) {
    const t = String(e ?? '').trim();
    return 'auto' === t ? 'auto' : '1K' === t || '2K' === t || '4K' === t ? t : n;
  }
  function B(e, n) {
    const t = e && 'object' == typeof e ? e : {},
      a = String(t.referenceImageMode ?? t.reference_image_mode ?? t.referenceMode ?? t.reference_mode ?? '').trim(),
      o = 'boolean' == typeof t.characterReferenceEnabled ? t.characterReferenceEnabled : 'character_reference' === a || 'auto' === a || 'vibe' !== a && n.characterReferenceEnabled;
    return {
      url: 'string' == typeof t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      negativePrompt: 'string' == typeof t.negativePrompt ? t.negativePrompt : n.negativePrompt,
      width: u(t.width, n.width),
      height: u(t.height, n.height),
      steps: C(g(t.steps, n.steps), 1, 60),
      cfg: C(m(t.cfg, n.cfg), 0, 30),
      sampler: 'string' == typeof t.sampler ? t.sampler : n.sampler,
      scheduler: 'string' == typeof t.scheduler ? t.scheduler : n.scheduler,
      seed: f(t.seed, n.seed),
      ucPreset: C(g(t.ucPreset, n.ucPreset), 0, 3),
      qualityToggle: 'boolean' == typeof t.qualityToggle ? t.qualityToggle : n.qualityToggle,
      autoSmea: 'boolean' == typeof t.autoSmea ? t.autoSmea : n.autoSmea,
      decrisper: 'boolean' == typeof t.decrisper ? t.decrisper : n.decrisper,
      sm: 'boolean' == typeof t.sm ? t.sm : n.sm,
      smDyn: 'boolean' == typeof t.smDyn ? t.smDyn : n.smDyn,
      cfgRescale: C(m(t.cfgRescale, n.cfgRescale), 0, 1),
      varietyBoost: 'boolean' == typeof t.varietyBoost ? t.varietyBoost : n.varietyBoost,
      characterReferenceEnabled: o,
      characterReferenceStyleAware: 'boolean' == typeof t.characterReferenceStyleAware ? t.characterReferenceStyleAware : n.characterReferenceStyleAware,
      characterReferenceFidelity: C(m(t.characterReferenceFidelity, n.characterReferenceFidelity), 0, 1)
    };
  }
  function y(e, n) {
    const t = e && 'object' == typeof e ? e : {};
    return {
      url: 'string' == typeof t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      aspectRatio: x(t.aspectRatio, n.aspectRatio)
    };
  }
  function k(e, n) {
    const t = e && 'object' == typeof e ? e : {},
      a = t.imageSize ?? t.geminiImageSize;
    return {
      url: 'string' == typeof t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      aspectRatio: x(t.aspectRatio, n.aspectRatio),
      imageSize: h(a, n.imageSize)
    };
  }
  function E(e, n) {
    const t = e && 'object' == typeof e ? e : {},
      a = String('string' == typeof t.url ? t.url : n.url).trim();
    return {
      url: a && 'https://image.pollinations.ai/prompt' !== a && 'https://image.pollinations.ai' !== a ? a : 'https://gen.pollinations.ai/image',
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix
    };
  }
  function J(e, n) {
    const t = e && 'object' == typeof e ? e : {};
    return {
      url: 'string' == typeof t.url && t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      workflowJson: 'string' == typeof t.workflowJson ? t.workflowJson : n.workflowJson,
      positivePromptNodeId: 'string' == typeof t.positivePromptNodeId && t.positivePromptNodeId ? t.positivePromptNodeId : n.positivePromptNodeId,
      negativePromptNodeId: 'string' == typeof t.negativePromptNodeId && t.negativePromptNodeId ? t.negativePromptNodeId : n.negativePromptNodeId,
      samplerNodeId: 'string' == typeof t.samplerNodeId && t.samplerNodeId ? t.samplerNodeId : n.samplerNodeId,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      negativePrompt: 'string' == typeof t.negativePrompt ? t.negativePrompt : n.negativePrompt
    };
  }
  function w() {
    try {
      const e = localStorage.getItem(r);
      if (!e) return p();
      const n = JSON.parse(e);
      if (!n || 'object' != typeof n) return p();
      const t = b(n.apiFormat, i),
        a = v(n.promptComposeMode, s);
      if (n.novelai && 'object' == typeof n.novelai || n.openai && 'object' == typeof n.openai || n.gemini && 'object' == typeof n.gemini || n.pollinations && 'object' == typeof n.pollinations || n.comfyui && 'object' == typeof n.comfyui) return {
        apiFormat: t,
        promptComposeMode: a,
        novelai: B(n.novelai, l),
        openai: y(n.openai, c),
        gemini: k(n.gemini, A),
        pollinations: E(n.pollinations, d),
        comfyui: J(n.comfyui, q)
      };
      const o = n,
        C = B(o, l),
        m = y(o, c),
        g = k(o, A),
        u = E(o, d),
        P = J(o, q);
      return 'novelai' !== t && (C.url = l.url, C.key = l.key, C.model = l.model, C.promptPrefix = l.promptPrefix, C.promptSuffix = l.promptSuffix), 'openai' !== t && (m.url = c.url, m.key = c.key, m.model = c.model, m.promptPrefix = c.promptPrefix, m.promptSuffix = c.promptSuffix), 'gemini' !== t && (g.url = A.url, g.key = A.key, g.model = A.model, g.promptPrefix = A.promptPrefix, g.promptSuffix = A.promptSuffix), 'pollinations' !== t && (u.url = d.url, u.key = d.key, u.model = d.model, u.promptPrefix = d.promptPrefix, u.promptSuffix = d.promptSuffix), 'comfyui' !== t && (P.url = q.url, P.key = q.key, P.model = q.model, P.workflowJson = q.workflowJson, P.positivePromptNodeId = q.positivePromptNodeId, P.negativePromptNodeId = q.negativePromptNodeId, P.samplerNodeId = q.samplerNodeId, P.promptPrefix = q.promptPrefix, P.promptSuffix = q.promptSuffix, P.negativePrompt = q.negativePrompt), {
        apiFormat: t,
        promptComposeMode: a,
        novelai: C,
        openai: m,
        gemini: g,
        pollinations: u,
        comfyui: P
      };
    } catch {
      return p();
    }
  }
  function N(e) {
    try {
      const n = {
        apiFormat: b(e?.apiFormat, i),
        promptComposeMode: v(e?.promptComposeMode, s),
        novelai: B(e?.novelai, l),
        openai: y(e?.openai, c),
        gemini: k(e?.gemini, A),
        pollinations: E(e?.pollinations, d),
        comfyui: J(e?.comfyui, q)
      };
      localStorage.setItem(r, JSON.stringify(n));
      return !0;
    } catch (n) {
      if ('QuotaExceededError' === n?.name || 22 === n?.code || 'NS_ERROR_DOM_QUOTA_REACHED' === String(n?.code)) {
        try {
          const t = {
            apiFormat: b(e?.apiFormat, i),
            promptComposeMode: v(e?.promptComposeMode, s),
            novelai: B(e?.novelai, l),
            openai: y(e?.openai, c),
            gemini: k(e?.gemini, A),
            pollinations: E(e?.pollinations, d),
            comfyui: J(e?.comfyui, q)
          };
          t.comfyui && delete t.comfyui.workflowJson;
          localStorage.setItem(r, JSON.stringify(t));
          console.warn('[ConfigService] 配置超出存储配额，已剔除 ComfyUI 工作流 JSON 后保存');
          return 'trimmed';
        } catch (t) {
          return console.warn('[ConfigService] 保存绘图配置失败（配额降级后仍失败）:', t), !1;
        }
      }
      return console.warn('[ConfigService] 保存绘图配置失败:', n), !1;
    }
  }
}
