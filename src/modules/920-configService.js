// webpack 模块 920（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  (t.r(n),
    t.d(n, {
      GEMINI_IMAGE_SIZE_OPTIONS: () => GEMINI_IMAGE_SIZE_OPTIONS,
      IMAGE_ASPECT_RATIO_OPTIONS: () => IMAGE_ASPECT_RATIO_OPTIONS,
      getDefaultNovelAiConfig: () => getDefaultNovelAiConfig,
      loadNovelAiConfig: () => loadNovelAiConfig,
      saveNovelAiConfig: () => saveNovelAiConfig,
    }));
  const IMAGE_ASPECT_RATIO_OPTIONS = ['auto', '1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
    GEMINI_IMAGE_SIZE_OPTIONS = ['auto', '1K', '2K', '4K'],
    STORAGE_KEY = 'phone_novelai_config',
    DEFAULT_API_FORMAT = 'novelai',
    DEFAULT_PROMPT_MODE = 'none',
    DEFAULT_NOVELAI_CONFIG = {
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
      characterReferenceFidelity: 0.8,
    },
    DEFAULT_OPENAI_CONFIG = {
      url: '',
      key: '',
      model: '',
      promptPrefix: '',
      promptSuffix: '',
      aspectRatio: 'auto',
    },
    DEFAULT_GEMINI_CONFIG = {
      url: '',
      key: '',
      model: '',
      promptPrefix: '',
      promptSuffix: '',
      aspectRatio: 'auto',
      imageSize: 'auto',
    },
    DEFAULT_POLLINATIONS_CONFIG = {
      url: 'https://gen.pollinations.ai/image',
      key: '',
      model: '',
      promptPrefix: '',
      promptSuffix: '',
    },
    DEFAULT_COMFYUI_CONFIG = {
      url: 'http://127.0.0.1:8188',
      key: '',
      model: '',
      workflowJson: '',
      positivePromptNodeId: '6',
      negativePromptNodeId: '7',
      samplerNodeId: '3',
      promptPrefix: '',
      promptSuffix: '',
      negativePrompt: '',
    };
  function getDefaultNovelAiConfig() {
    return {
      apiFormat: DEFAULT_API_FORMAT,
      promptComposeMode: DEFAULT_PROMPT_MODE,
      novelai: {
        ...DEFAULT_NOVELAI_CONFIG,
      },
      openai: {
        ...DEFAULT_OPENAI_CONFIG,
      },
      gemini: {
        ...DEFAULT_GEMINI_CONFIG,
      },
      pollinations: {
        ...DEFAULT_POLLINATIONS_CONFIG,
      },
      comfyui: {
        ...DEFAULT_COMFYUI_CONFIG,
      },
    };
  }
  function clampNumber(e, n, t) {
    return Number.isFinite(e) ? Math.min(t, Math.max(n, e)) : n;
  }
  function toFiniteNumber(e, n) {
    if ('number' == typeof e && Number.isFinite(e)) return e;
    if ('string' == typeof e && '' !== e.trim()) {
      const n = Number(e);
      if (Number.isFinite(n)) return n;
    }
    return n;
  }
  function toInteger(e, n) {
    const t = toFiniteNumber(e, n);
    return Number.isFinite(t) ? Math.trunc(t) : n;
  }
  function clampImageDimension(e, n) {
    const t = clampNumber(toInteger(e, n), 64, 4096);
    return 64 * Math.round(t / 64);
  }
  function toSeedValue(e, n) {
    const t = toInteger(e, n);
    return t < 0 ? -1 : clampNumber(t, 0, 4294967295);
  }
  function validateApiFormat(e, n) {
    const t = String(e ?? '').trim();
    return 'novelai' === t || 'openai' === t || 'gemini' === t || 'pollinations' === t || 'comfyui' === t ? t : n;
  }
  function validatePromptMode(e, n) {
    const t = String(e ?? '').trim();
    return 'tags' === t || 'natural' === t || 'natural_en' === t ? t : n;
  }
  function validateAspectRatio(e, n) {
    const t = String(e ?? '').trim();
    return 'auto' === t ? 'auto' : IMAGE_ASPECT_RATIO_OPTIONS.includes(t) ? t : n;
  }
  function validateImageSize(e, n) {
    const t = String(e ?? '').trim();
    return 'auto' === t ? 'auto' : '1K' === t || '2K' === t || '4K' === t ? t : n;
  }
  function sanitizeNovelAi(e, n) {
    const t = e && 'object' == typeof e ? e : {},
      a = String(t.referenceImageMode ?? t.reference_image_mode ?? t.referenceMode ?? t.reference_mode ?? '').trim(),
      o =
        'boolean' == typeof t.characterReferenceEnabled
          ? t.characterReferenceEnabled
          : 'character_reference' === a || 'auto' === a || ('vibe' !== a && n.characterReferenceEnabled);
    return {
      url: 'string' == typeof t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      negativePrompt: 'string' == typeof t.negativePrompt ? t.negativePrompt : n.negativePrompt,
      width: clampImageDimension(t.width, n.width),
      height: clampImageDimension(t.height, n.height),
      steps: clampNumber(toInteger(t.steps, n.steps), 1, 60),
      cfg: clampNumber(toFiniteNumber(t.cfg, n.cfg), 0, 30),
      sampler: 'string' == typeof t.sampler ? t.sampler : n.sampler,
      scheduler: 'string' == typeof t.scheduler ? t.scheduler : n.scheduler,
      seed: toSeedValue(t.seed, n.seed),
      ucPreset: clampNumber(toInteger(t.ucPreset, n.ucPreset), 0, 3),
      qualityToggle: 'boolean' == typeof t.qualityToggle ? t.qualityToggle : n.qualityToggle,
      autoSmea: 'boolean' == typeof t.autoSmea ? t.autoSmea : n.autoSmea,
      decrisper: 'boolean' == typeof t.decrisper ? t.decrisper : n.decrisper,
      sm: 'boolean' == typeof t.sm ? t.sm : n.sm,
      smDyn: 'boolean' == typeof t.smDyn ? t.smDyn : n.smDyn,
      cfgRescale: clampNumber(toFiniteNumber(t.cfgRescale, n.cfgRescale), 0, 1),
      varietyBoost: 'boolean' == typeof t.varietyBoost ? t.varietyBoost : n.varietyBoost,
      characterReferenceEnabled: o,
      characterReferenceStyleAware:
        'boolean' == typeof t.characterReferenceStyleAware
          ? t.characterReferenceStyleAware
          : n.characterReferenceStyleAware,
      characterReferenceFidelity: clampNumber(
        toFiniteNumber(t.characterReferenceFidelity, n.characterReferenceFidelity),
        0,
        1,
      ),
    };
  }
  function sanitizeOpenAi(e, n) {
    const t = e && 'object' == typeof e ? e : {};
    return {
      url: 'string' == typeof t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      aspectRatio: validateAspectRatio(t.aspectRatio, n.aspectRatio),
    };
  }
  function sanitizeGemini(e, n) {
    const t = e && 'object' == typeof e ? e : {},
      a = t.imageSize ?? t.geminiImageSize;
    return {
      url: 'string' == typeof t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      aspectRatio: validateAspectRatio(t.aspectRatio, n.aspectRatio),
      imageSize: validateImageSize(a, n.imageSize),
    };
  }
  function sanitizePollinations(e, n) {
    const t = e && 'object' == typeof e ? e : {},
      a = String('string' == typeof t.url ? t.url : n.url).trim();
    return {
      url:
        a && 'https://image.pollinations.ai/prompt' !== a && 'https://image.pollinations.ai' !== a
          ? a
          : 'https://gen.pollinations.ai/image',
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
    };
  }
  function sanitizeComfyUi(e, n) {
    const t = e && 'object' == typeof e ? e : {};
    return {
      url: 'string' == typeof t.url && t.url ? t.url : n.url,
      key: 'string' == typeof t.key ? t.key : n.key,
      model: 'string' == typeof t.model ? t.model : n.model,
      workflowJson: 'string' == typeof t.workflowJson ? t.workflowJson : n.workflowJson,
      positivePromptNodeId:
        'string' == typeof t.positivePromptNodeId && t.positivePromptNodeId
          ? t.positivePromptNodeId
          : n.positivePromptNodeId,
      negativePromptNodeId:
        'string' == typeof t.negativePromptNodeId && t.negativePromptNodeId
          ? t.negativePromptNodeId
          : n.negativePromptNodeId,
      samplerNodeId: 'string' == typeof t.samplerNodeId && t.samplerNodeId ? t.samplerNodeId : n.samplerNodeId,
      promptPrefix: 'string' == typeof t.promptPrefix ? t.promptPrefix : n.promptPrefix,
      promptSuffix: 'string' == typeof t.promptSuffix ? t.promptSuffix : n.promptSuffix,
      negativePrompt: 'string' == typeof t.negativePrompt ? t.negativePrompt : n.negativePrompt,
    };
  }
  function loadNovelAiConfig() {
    try {
      const e = localStorage.getItem(STORAGE_KEY);
      if (!e) return getDefaultNovelAiConfig();
      const n = JSON.parse(e);
      if (!n || 'object' != typeof n) return getDefaultNovelAiConfig();
      const t = validateApiFormat(n.apiFormat, DEFAULT_API_FORMAT),
        a = validatePromptMode(n.promptComposeMode, DEFAULT_PROMPT_MODE);
      if (
        (n.novelai && 'object' == typeof n.novelai) ||
        (n.openai && 'object' == typeof n.openai) ||
        (n.gemini && 'object' == typeof n.gemini) ||
        (n.pollinations && 'object' == typeof n.pollinations) ||
        (n.comfyui && 'object' == typeof n.comfyui)
      )
        return {
          apiFormat: t,
          promptComposeMode: a,
          novelai: sanitizeNovelAi(n.novelai, DEFAULT_NOVELAI_CONFIG),
          openai: sanitizeOpenAi(n.openai, DEFAULT_OPENAI_CONFIG),
          gemini: sanitizeGemini(n.gemini, DEFAULT_GEMINI_CONFIG),
          pollinations: sanitizePollinations(n.pollinations, DEFAULT_POLLINATIONS_CONFIG),
          comfyui: sanitizeComfyUi(n.comfyui, DEFAULT_COMFYUI_CONFIG),
        };
      const o = n,
        C = sanitizeNovelAi(o, DEFAULT_NOVELAI_CONFIG),
        m = sanitizeOpenAi(o, DEFAULT_OPENAI_CONFIG),
        g = sanitizeGemini(o, DEFAULT_GEMINI_CONFIG),
        u = sanitizePollinations(o, DEFAULT_POLLINATIONS_CONFIG),
        P = sanitizeComfyUi(o, DEFAULT_COMFYUI_CONFIG);
      return (
        'novelai' !== t &&
          ((C.url = DEFAULT_NOVELAI_CONFIG.url),
          (C.key = DEFAULT_NOVELAI_CONFIG.key),
          (C.model = DEFAULT_NOVELAI_CONFIG.model),
          (C.promptPrefix = DEFAULT_NOVELAI_CONFIG.promptPrefix),
          (C.promptSuffix = DEFAULT_NOVELAI_CONFIG.promptSuffix)),
        'openai' !== t &&
          ((m.url = DEFAULT_OPENAI_CONFIG.url),
          (m.key = DEFAULT_OPENAI_CONFIG.key),
          (m.model = DEFAULT_OPENAI_CONFIG.model),
          (m.promptPrefix = DEFAULT_OPENAI_CONFIG.promptPrefix),
          (m.promptSuffix = DEFAULT_OPENAI_CONFIG.promptSuffix)),
        'gemini' !== t &&
          ((g.url = DEFAULT_GEMINI_CONFIG.url),
          (g.key = DEFAULT_GEMINI_CONFIG.key),
          (g.model = DEFAULT_GEMINI_CONFIG.model),
          (g.promptPrefix = DEFAULT_GEMINI_CONFIG.promptPrefix),
          (g.promptSuffix = DEFAULT_GEMINI_CONFIG.promptSuffix)),
        'pollinations' !== t &&
          ((u.url = DEFAULT_POLLINATIONS_CONFIG.url),
          (u.key = DEFAULT_POLLINATIONS_CONFIG.key),
          (u.model = DEFAULT_POLLINATIONS_CONFIG.model),
          (u.promptPrefix = DEFAULT_POLLINATIONS_CONFIG.promptPrefix),
          (u.promptSuffix = DEFAULT_POLLINATIONS_CONFIG.promptSuffix)),
        'comfyui' !== t &&
          ((P.url = DEFAULT_COMFYUI_CONFIG.url),
          (P.key = DEFAULT_COMFYUI_CONFIG.key),
          (P.model = DEFAULT_COMFYUI_CONFIG.model),
          (P.workflowJson = DEFAULT_COMFYUI_CONFIG.workflowJson),
          (P.positivePromptNodeId = DEFAULT_COMFYUI_CONFIG.positivePromptNodeId),
          (P.negativePromptNodeId = DEFAULT_COMFYUI_CONFIG.negativePromptNodeId),
          (P.samplerNodeId = DEFAULT_COMFYUI_CONFIG.samplerNodeId),
          (P.promptPrefix = DEFAULT_COMFYUI_CONFIG.promptPrefix),
          (P.promptSuffix = DEFAULT_COMFYUI_CONFIG.promptSuffix),
          (P.negativePrompt = DEFAULT_COMFYUI_CONFIG.negativePrompt)),
        {
          apiFormat: t,
          promptComposeMode: a,
          novelai: C,
          openai: m,
          gemini: g,
          pollinations: u,
          comfyui: P,
        }
      );
    } catch {
      return getDefaultNovelAiConfig();
    }
  }
  function saveNovelAiConfig(e) {
    try {
      const n = {
        apiFormat: validateApiFormat(e?.apiFormat, DEFAULT_API_FORMAT),
        promptComposeMode: validatePromptMode(e?.promptComposeMode, DEFAULT_PROMPT_MODE),
        novelai: sanitizeNovelAi(e?.novelai, DEFAULT_NOVELAI_CONFIG),
        openai: sanitizeOpenAi(e?.openai, DEFAULT_OPENAI_CONFIG),
        gemini: sanitizeGemini(e?.gemini, DEFAULT_GEMINI_CONFIG),
        pollinations: sanitizePollinations(e?.pollinations, DEFAULT_POLLINATIONS_CONFIG),
        comfyui: sanitizeComfyUi(e?.comfyui, DEFAULT_COMFYUI_CONFIG),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
      return !0;
    } catch (n) {
      if ('QuotaExceededError' === n?.name || 22 === n?.code || 'NS_ERROR_DOM_QUOTA_REACHED' === String(n?.code)) {
        try {
          const t = {
            apiFormat: validateApiFormat(e?.apiFormat, DEFAULT_API_FORMAT),
            promptComposeMode: validatePromptMode(e?.promptComposeMode, DEFAULT_PROMPT_MODE),
            novelai: sanitizeNovelAi(e?.novelai, DEFAULT_NOVELAI_CONFIG),
            openai: sanitizeOpenAi(e?.openai, DEFAULT_OPENAI_CONFIG),
            gemini: sanitizeGemini(e?.gemini, DEFAULT_GEMINI_CONFIG),
            pollinations: sanitizePollinations(e?.pollinations, DEFAULT_POLLINATIONS_CONFIG),
            comfyui: sanitizeComfyUi(e?.comfyui, DEFAULT_COMFYUI_CONFIG),
          };
          t.comfyui && delete t.comfyui.workflowJson;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
          console.warn('[ConfigService] 配置超出存储配额，已剔除 ComfyUI 工作流 JSON 后保存');
          return 'trimmed';
        } catch (t) {
          return (console.warn('[ConfigService] 保存绘图配置失败（配额降级后仍失败）:', t), !1);
        }
      }
      return (console.warn('[ConfigService] 保存绘图配置失败:', n), !1);
    }
  }
}
