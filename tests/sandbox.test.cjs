#!/usr/bin/env node
/**
 * 沙箱集成测试：验证还原源码工程 src/ 中
 *  A) 配置中心 920：comfyui 保存/读取往返、配额降级、旧配置兼容
 *  B) 生图引擎 685：ComfyUI 分发分支全链路（mock fetch 三接口）
 *  C) 聊天变量存储兼容层：mock 楼层/变量 API，验证重定向、虚拟楼层、哨兵更新/删除、透传与模式开关
 * 模块体改由 tests/extract.cjs 的 extractModuleFromSrc 从 src/modules/*.js 加载（不再切分 bundle）。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { extractModuleFromSrc } = require('./extract.cjs');

const INDEX_SRC = path.join(__dirname, '..', 'src', 'index.js');
const indexSrc = fs.readFileSync(INDEX_SRC, 'utf8');

let pass = 0;
let fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${extra ? ' :: ' + extra : ''}`); }
}

// ---------------------------------------------------------------- 构造模块执行器
function buildModuleRunner() {
  const sandbox = {
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    Promise, Math, Date, JSON, String, Number, Array, Object, RegExp, Error,
    URL, URLSearchParams, TextDecoder, Uint8Array, DataView, Blob,
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    YAML: { parse: () => null, stringify: () => '' },
    Vue: { ref: (v) => ({ value: v }) },
    // DiceBear 本地渲染垫片（模块 2213 顶部 import 剥离后由沙箱提供同名绑定）
    __avatarSeeds: [],
    createAvatar: (style, options) => {
      sandbox.__avatarSeeds.push(options.seed);
      return {
        toDataUri: () => 'data:image/svg+xml;utf8,' + encodeURIComponent(options.seed),
        toString: () => '<svg>' + (options?.seed || '') + '</svg>',
      };
    },
    adventurer: {}, avataaars: {}, bigSmile: {}, bottts: {}, croodles: {}, funEmoji: {}, lorelei: {},
    micah: {}, miniavs: {}, notionists: {}, openPeeps: {}, personas: {}, pixelArt: {}, thumbs: {},
    _: {
      get: (obj, path) => String(path).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj),
      set: (obj, path, v) => {
        const keys = String(path).split('.');
        let o = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          if (o == null) return obj;
          o = o[keys[i]];
        }
        if (o != null) o[keys[keys.length - 1]] = v;
        return obj;
      },
      cloneDeep: (o) => JSON.parse(JSON.stringify(o)),
    },
    globalThis: undefined,
    localStorage: {
      _store: {},
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._store, k) ? this._store[k] : null; },
      setItem(k, v) { this._store[k] = String(v); },
      removeItem(k) { delete this._store[k]; },
    },
  };
    sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  const moduleCache = new Map(); // 已执行模块的 exports
  const builtCache = new Map(); // 已解析未执行的工厂描述符（getModule 与 requireModule 分离，避免键冲突）

  // 模块 920 的函数体
  function buildFn(moduleText, moduleId) {
    const m = /^(\d+)\(e,n,t\)\{(.*)\}$/s.exec(moduleText);
    if (!m) throw new Error('模块体解析失败: ' + moduleId);
    const head = m[1], body = m[2];
    // 包装为 (e,n,t)=>body
    const wrapped = `(function(e,n,t){${body}})`;
    // 头部 t.d 导出重定向（prettier 格式化后属性间有空白，需容错）
    const redirected = wrapped.replace(/t\.d\(n,\s*\{([\s\S]*?)\}\s*\)/, 't.d(n,{__redirect__:()=>1,$1})');
    return { head, fn: vm.runInContext('(' + redirected + ')', ctx, { filename: `module_${moduleId}.js` }) };
  }

  function getModule(id) {
    if (builtCache.has(id)) return builtCache.get(id);
    const text = extractModuleFromSrc(id);
    if (!text) throw new Error('模块 ' + id + ' 未找到于 src/modules/');
    const built = buildFnFrom(text, id);
    builtCache.set(id, built);
    return built;
  }

  function buildFnFrom(text, moduleId) {
    const m = /^(\d+)\(([^)]*)\)\{([\s\S]*)\}$/.exec(text);
    if (!m) throw new Error('模块体解析失败: ' + moduleId);
    const body = m[3];
    const wrapped = '(function(e,n,t){' + body + '})';
    const fn = vm.runInContext(wrapped, ctx, { filename: `module_${moduleId}.js` });
    return { head: m[1], fn };
  }

  function requireModule(id) {
    if (moduleCache.has(id)) return moduleCache.get(id).exports;
    const { fn } = getModule(id);
    const moduleObj = { exports: {} };
    // 构造 fake require（含 webpack 运行时 helper：t.r / t.d / t.n / t.o）
    const fakeRequire = (depId) => requireModule(depId);
    fakeRequire.r = (exports) => { Object.defineProperty(exports, '__esModule', { value: true }); };
    fakeRequire.d = (exports, defs) => {
      for (const key of Object.keys(defs)) {
        Object.defineProperty(exports, key, { enumerable: true, get: defs[key] });
      }
    };
    fakeRequire.n = (mod) => {
      // 与真实 webpack 运行时一致：CJS 模块 getter 返回模块本身，ESM 返回 default
      const getter = (mod && mod.__esModule) ? () => mod.default : () => mod;
      getter.a = getter;
      return getter;
    };
    fakeRequire.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    try {
      fn.call({}, moduleObj, moduleObj.exports, fakeRequire);
    } catch (e) {
      throw new Error('模块 ' + id + ' 执行失败: ' + (e && e.message));
    }
    moduleCache.set(id, moduleObj);
    return moduleObj.exports;
  }

  return { sandbox, requireModule, getModule, ctx };
}

// ---------------------------------------------------------------- 测试 A：配置中心 920
console.log('\n== A) Module 920 配置中心 ==');
{
  const r = buildModuleRunner();
  const mod920 = r.requireModule(920);

  // A1 默认配置含 comfyui
  const def = mod920.getDefaultNovelAiConfig();
  ok('A1 默认配置含 comfyui', def.comfyui && def.comfyui.url === 'http://127.0.0.1:8188',
    'url=' + (def.comfyui && def.comfyui.url));

  // A2 保存 comfyui 配置 → 读取往返
  def.apiFormat = 'comfyui';
  def.comfyui.url = 'http://127.0.0.1:8188';
  def.comfyui.workflowJson = '{"x":1}';
  def.comfyui.positivePromptNodeId = '5';
  def.comfyui.negativePromptNodeId = '9';
  def.comfyui.samplerNodeId = '2';
  const r1 = mod920.saveNovelAiConfig(def);
  ok('A2 保存成功返回 true', r1 === true);
  const loaded = mod920.loadNovelAiConfig();
  ok('A3 读取回 comfyui 与字段', loaded.apiFormat === 'comfyui'
    && loaded.comfyui.workflowJson === '{"x":1}'
    && loaded.comfyui.positivePromptNodeId === '5'
    && loaded.comfyui.negativePromptNodeId === '9'
    && loaded.comfyui.samplerNodeId === '2',
    JSON.stringify(loaded.comfyui));

  // A4-A6 配额降级：模拟"含 workflowJson 时超配额、剔除后放行"
  r.sandbox.localStorage.setItem = (k, v) => {
    const raw = String(v);
    if (raw.includes('workflowJson')) { const e = new Error('quota'); e.name = 'QuotaExceededError'; e.code = 22; throw e; }
    r.sandbox.localStorage._store[k] = raw;
  };
  const r2 = mod920.saveNovelAiConfig(def);
  ok('A4 配额超限返回 trimmed', r2 === 'trimmed');
  // 检查降级后写入的 JSON：不应含 workflowJson，其余保留
  const stored = r.sandbox.localStorage.getItem('phone_novelai_config');
  const parsed = JSON.parse(stored);
  ok('A5 降级后仍写入配置', !!parsed && parsed.apiFormat === 'comfyui');
  ok('A6 降级后剔除 workflowJson', !parsed.comfyui.workflowJson && parsed.comfyui.url === 'http://127.0.0.1:8188' && parsed.comfyui.positivePromptNodeId === '5');

  // A7 其他异常返回 false
  r.sandbox.localStorage.setItem = () => { throw new Error('disk full'); };
  const r3 = mod920.saveNovelAiConfig(def);
  ok('A7 未知异常返回 false', r3 === false);

  // A8 apiFormat 校验含 comfyui
  ok('A8 apiFormat 校验支持 comfyui', def.apiFormat === 'comfyui');
}

// ---------------------------------------------------------------- 测试 B：生图引擎 685
console.log('\n== B) Module 685 ComfyUI 分发 ==');
{
  // 需要完整运行环境（含 920 + 685）。685 内部使用 x() FileReader。
  // 单独构建 685 沙箱，手动注入依赖。
  const sandbox = {
    console,
    setTimeout, clearTimeout, Promise, Math, Date, JSON, String, Number, Array, Object, RegExp, Error,
    URL, URLSearchParams, TextDecoder, Uint8Array, DataView, Blob, Response: undefined,
    globalThis: undefined,
    localStorage: {
      _store: {},
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._store, k) ? this._store[k] : null; },
      setItem(k, v) { this._store[k] = String(v); },
      removeItem(k) { delete this._store[k]; },
    },
  };
  sandbox.globalThis = sandbox;
  sandbox.Response = class { constructor(body, init) { this._body = body; this.status = (init && init.status) || 200; this.ok = this.status >= 200 && this.status < 300; this.headers = new Map(Object.entries((init && init.headers) || {})); } json() { return Promise.resolve(this._body); } text() { return Promise.resolve(String(this._body)); } blob() { return Promise.resolve(this._body); } arrayBuffer() { return Promise.resolve(new Uint8Array([137, 80, 78, 71])); } };

  // mock FileReader（Node 无原生 FileReader）
  sandbox.FileReader = class {
    constructor() { this.result = null; this.onload = null; this.onerror = null; }
    readAsDataURL(blob) {
      if (blob && blob.__dataUrl) { this.result = blob.__dataUrl; }
      else if (blob && blob._text !== undefined) { this.result = 'data:image/png;base64,' + Buffer.from(blob._text).toString('base64'); }
      else { this.result = 'data:image/png;base64,AAECAwQFBgc='; }
      if (this.onload) setTimeout(() => this.onload(), 0);
    }
  };

  const ctx = vm.createContext(sandbox);

  const fake920 = (() => {
    // 构建 920 模块
    const text920 = extractModuleFromSrc(920);
    const m = /^(\d+)\(e,n,t\)\{(.*)\}$/s.exec(text920);
    const fn920 = vm.runInContext('(function(e,n,t){' + m[2] + '})', ctx);
    const mod920 = { exports: {} };
    const fakeRequire920 = () => { throw new Error('920 内部不应依赖其他模块'); };
    fakeRequire920.r = (exports) => { Object.defineProperty(exports, '__esModule', { value: true }); };
    fakeRequire920.d = (exports, defs) => { for (const key of Object.keys(defs)) Object.defineProperty(exports, key, { enumerable: true, get: defs[key] }); };
    fakeRequire920.n = (mod) => { const g = (mod && mod.__esModule) ? () => mod : () => ({ default: mod }); g.a = mod; return g; };
    fn920.call({}, mod920, mod920.exports, fakeRequire920);
    return mod920.exports;
  })();

  const text685 = extractModuleFromSrc(685);
  const m685 = /^(\d+)\(e,n,t\)\{(.*)\}$/s.exec(text685);
  const fn685 = vm.runInContext('(function(e,n,t){' + m685[2] + '})', ctx);
  const mod685 = { exports: {} };
  const fakeRequire685 = (id) => {
    if (id === 920) return fake920;
    // 685 依赖 t(2178)（prompt 库，仅 buildPromptTextByMode 等；comfyui 分支不用）
    return { GO: () => ({ byName: {}, tags: {} }) };
  };
  fakeRequire685.r = (exports) => { Object.defineProperty(exports, '__esModule', { value: true }); };
  fakeRequire685.d = (exports, defs) => { for (const key of Object.keys(defs)) Object.defineProperty(exports, key, { enumerable: true, get: defs[key] }); };
  fakeRequire685.n = (mod) => { const g = (mod && mod.__esModule) ? () => mod : () => ({ default: mod }); g.a = mod; return g; };
  fn685.call({}, mod685, mod685.exports, fakeRequire685);
  console.log('  [debug] 685 导出 keys:', Object.keys(mod685.exports).join(','));

  // 注入 comfyui 配置到 920 的 localStorage
  const cfg = fake920.getDefaultNovelAiConfig();
  cfg.apiFormat = 'comfyui';
  cfg.comfyui.url = 'http://127.0.0.1:8188';
  cfg.comfyui.workflowJson = '';
  try {
    const lsCheck = vm.runInContext('typeof localStorage', ctx);
    console.log('  [debug] B ctx typeof localStorage =', lsCheck);
    console.log('  [debug] fake920.saveNovelAiConfig type =', typeof fake920.saveNovelAiConfig);
  } catch (e) { console.log('  [debug] ctx 探测失败:', e.message); }
  fake920.saveNovelAiConfig(cfg);

  // mock fetch
  const calls = [];
  sandbox.fetch = async (url, init) => {
    calls.push({ url: String(url), method: init && init.method });
    const u = String(url);
    if (u.endsWith('/prompt')) {
      const body = JSON.parse(init.body);
      sandbox.__lastWf = body.prompt;
      sandbox.__lastClient = body.client_id;
      return new sandbox.Response({ prompt_id: 'test-123' }, { status: 200 });
    }
    if (u.includes('/history/test-123')) {
      return new sandbox.Response({
        'test-123': { status: { status_str: 'success', completed: true }, outputs: { '9': { images: [{ filename: 'out.png', subfolder: '', type: 'output' }] } } }
      }, { status: 200 });
    }
    if (u.includes('/view')) {
      // 返回一个 Blob（PNG 字节）
      const buf = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13]);
      return new sandbox.Response(new Blob([buf], { type: 'image/png' }), { status: 200 });
    }
    throw new Error('unexpected fetch ' + u);
  };

  (async () => {
    try {
      const res = await mod685.exports.generateNovelAiImage('a cat', { config: cfg });
      ok('B1 生图返回 dataUrl', !!res && typeof res.dataUrl === 'string' && res.dataUrl.startsWith('data:image/'),
        String(res && res.dataUrl && res.dataUrl.slice(0, 30)));
      ok('B2 请求了 /prompt', calls.some(c => c.url.endsWith('/prompt')));
      ok('B3 轮询了 /history', calls.some(c => c.url.includes('/history/')));
      ok('B4 请求了 /view', calls.some(c => c.url.includes('/view?') && c.url.includes('filename=')));
      // 检查注入的 prompt 节点
      const wf = sandbox.__lastWf;
      ok('B5 默认工作流结构', wf && wf['6'] && wf['7'] && wf['3'] && wf['9'],
        wf ? Object.keys(wf).join(',') : 'null');
      ok('B6 正向提示词已注入', wf && wf['6'].inputs.text === 'a cat', wf && wf['6'].inputs.text);
      ok('B7 随机 seed 已注入', wf && typeof wf['3'].inputs.seed === 'number' && wf['3'].inputs.seed >= 0, wf && String(wf['3'].inputs.seed));
    } catch (e) {
      ok('B1-B7 执行异常', false, e.message);
    }

    // B8 未配置 URL 报错
    const cfg2 = fake920.getDefaultNovelAiConfig();
    cfg2.apiFormat = 'comfyui';
    cfg2.comfyui.url = '';
    try {
      await mod685.exports.generateNovelAiImage('x', { config: cfg2 });
      ok('B8 无 URL 抛错', false);
    } catch (e) {
      ok('B8 无 URL 抛错', /未配置 ComfyUI URL/.test(e.message), e.message);
    }

    // B9 自定义工作流注入：text 节点非默认 ID
    const wfCustom = {
      '12': { class_type: 'CLIPTextEncode', inputs: { text: 'original', clip: ['4', 1] } },
      '13': { class_type: 'CLIPTextEncode', inputs: { text: 'original-neg', clip: ['4', 1] } },
      '4': { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: 'modelX.safetensors' } },
      '99': { class_type: 'KSampler', inputs: { seed: 111, model: ['4', 0] } },
      '88': { class_type: 'SaveImage', inputs: { images: ['99', 0] } },
    };
    const cfg3 = fake920.getDefaultNovelAiConfig();
    cfg3.apiFormat = 'comfyui';
    cfg3.comfyui.url = 'http://127.0.0.1:8188';
    cfg3.comfyui.workflowJson = JSON.stringify(wfCustom);
    cfg3.comfyui.positivePromptNodeId = '12';
    cfg3.comfyui.negativePromptNodeId = '13';
    cfg3.comfyui.samplerNodeId = '99';
    calls.length = 0;
    try {
      const res3 = await mod685.exports.generateNovelAiImage('hello', { config: cfg3 });
      ok('B9 自定义工作流生图成功', !!res3 && res3.dataUrl.startsWith('data:image/'));
      ok('B10 自定义节点注入文本', sandbox.__lastWf['12'].inputs.text === 'hello', sandbox.__lastWf['12'].inputs.text);
      ok('B11 自定义采样器 seed 注入', typeof sandbox.__lastWf['99'].inputs.seed === 'number', String(sandbox.__lastWf['99'].inputs.seed));
    } catch (e) {
      ok('B9-B11 自定义工作流异常', false, e.message);
    }

    // B12 工作流 JSON 非法报错
    const cfg4 = fake920.getDefaultNovelAiConfig();
    cfg4.apiFormat = 'comfyui';
    cfg4.comfyui.url = 'http://127.0.0.1:8188';
    cfg4.comfyui.workflowJson = '{bad json';
    try {
      await mod685.exports.generateNovelAiImage('x', { config: cfg4 });
      ok('B12 非法 JSON 报错', false);
    } catch (e) {
      ok('B12 非法 JSON 报错', /工作流 JSON 解析失败/.test(e.message), e.message);
    }

    // B13 其他后端兼容：openai 分支仍工作（校验通过）
    const cfg5 = fake920.getDefaultNovelAiConfig();
    cfg5.apiFormat = 'openai';
    cfg5.openai.url = 'https://api.openai.com';
    cfg5.openai.key = 'sk-test';
    cfg5.openai.model = 'gpt-image-1';
    calls.length = 0;
    sandbox.fetch = async (url, init) => {
      calls.push(String(url));
      return new sandbox.Response({ choices: [{ message: { content: [{ type: 'image_url', image_url: { url: 'https://x/y.png' } }] } }] }, { status: 200, headers: { 'content-type': 'application/json' } });
    };
    try {
      const res5 = await mod685.exports.generateNovelAiImage('cat', { config: cfg5 });
      ok('B13 openai 分支正常', !!res5 && res5.dataUrl.startsWith('https://'));
      ok('B14 请求了 chat/completions', calls.some(c => c.includes('/chat/completions')), calls.join(','));
    } catch (e) {
      ok('B13-B14 openai 异常', false, e.message);
    }

    // B15 队列入口对 comfyui 直连（不走 novelai 队列）；先恢复 comfyui fetch
    sandbox.fetch = async (url, init) => {
      calls.push(String(url));
      const u = String(url);
      if (u.endsWith('/prompt')) return new sandbox.Response({ prompt_id: 'test-123' }, { status: 200 });
      if (u.includes('/history/test-123')) return new sandbox.Response({ 'test-123': { status: { status_str: 'success', completed: true }, outputs: { '9': { images: [{ filename: 'out.png' }] } } } }, { status: 200 });
      if (u.includes('/view')) return new sandbox.Response(new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }), { status: 200 });
      throw new Error('unexpected ' + u);
    };
    try {
      const qres = await mod685.exports.queueNovelAiImageGeneration('cat', { config: cfg });
      ok('B15 队列入口 comfyui 直连返回', !!qres && qres.dataUrl.startsWith('data:image/'));
    } catch (e) {
      ok('B15 队列入口异常', false, e.message);
    }

    // ---------------------------------------------------------------- 测试 C：聊天变量存储兼容层
    console.log('\n== C) 聊天变量存储兼容层 ==');
    {
      const START = '/*__PHONE_VAR_STORAGE_START__*/';
      const END = '/*__PHONE_VAR_STORAGE_END__*/';
      const si = indexSrc.indexOf(START), ei = indexSrc.indexOf(END);
      ok('C0 兼容层已注入产物', si >= 0 && ei > si);
      const shimCode = indexSrc.slice(si, ei + END.length);

      // 每个用例独立沙箱：mock 楼层/变量 API，安装 shim 后测行为
      function buildShimSandbox() {
        const calls = { create: [], set: [], del: [] };
        const lsStore = {};
        const chatVars = {};
        const floors = {
          0: { message_id: 0, name: 'User', role: 'user', is_hidden: false, message: '你好', data: {}, extra: {} },
          1: { message_id: 1, name: 'AI', role: 'assistant', is_hidden: false, message: '<chat_history target="小明" type="private">\nname: 小明\nmessages: []\n</chat_history>', data: {}, extra: {} },
        };
        const sandbox = {
          console: { info() {}, log() {}, warn() {} },
          Promise, Math, Date, JSON, String, Number, Array, Object, RegExp, Error, parseInt,
          globalThis: undefined,
          localStorage: {
            getItem(k) { return Object.prototype.hasOwnProperty.call(lsStore, k) ? lsStore[k] : null; },
            setItem(k, v) { lsStore[k] = String(v); },
            removeItem(k) { delete lsStore[k]; },
          },
          getVariables: () => JSON.parse(JSON.stringify(chatVars)),
          insertOrAssignVariables: (obj) => { Object.assign(chatVars, JSON.parse(JSON.stringify(obj))); },
          getChatMessages: (range) => {
            const s = String(range);
            const m = s.match(/^(\d+)-(\d+)$/);
            let ids = [];
            if (m) { for (let i = +m[1]; i <= +m[2]; i++) ids.push(i); }
            else if (/^-?\d+$/.test(s)) ids = [Math.max(0, parseInt(s, 10))];
            return ids.filter((i) => floors[i]).map((i) => Object.assign({}, floors[i]));
          },
          setChatMessages: async (list) => { calls.set.push(list); for (const it of list) if (floors[it.message_id] && it.message !== undefined) floors[it.message_id].message = it.message; },
          createChatMessages: async (list) => { calls.create.push(list); let next = 2; for (const it of list) floors[next] = { message_id: next++, name: it.name || 'AI', role: it.role, is_hidden: !!it.is_hidden, message: it.message, data: {}, extra: {} }; },
          deleteChatMessages: async (ids) => { calls.del.push(ids); for (const i of ids) delete floors[i]; },
        };
        sandbox.globalThis = sandbox;
        const ctx = vm.createContext(sandbox);
        vm.runInContext(shimCode, ctx, { filename: 'phone_var_storage.js' });
        return { sandbox, calls, chatVars, floors, lsStore };
      }

      // C1 安装成功且 API 已接管
      {
        const t = buildShimSandbox();
        ok('C1 安装成功并标记', t.sandbox.__improvedPhoneVarStorageInstalled === true);
      }

      // C2 变量模式（默认开）：含块消息不建楼、块入变量
      {
        const t = buildShimSandbox();
        const block = '<chat_history target="小明" type="private">\nname: 小明\nmessages:\n- c: 你好\n</chat_history>';
        await t.sandbox.createChatMessages([{ role: 'assistant', message: block, is_hidden: false }]);
        ok('C2 含块消息不创建楼层', t.calls.create.length === 0);
        ok('C2 块已写入聊天变量', Array.isArray(t.chatVars.$phone_blocks) && t.chatVars.$phone_blocks[0] === block);
      }

      // C3 无块消息透传建楼（如"跳转时间"系统楼层）
      {
        const t = buildShimSandbox();
        await t.sandbox.createChatMessages([{ role: 'system', message: '跳转时间到 3月2日 10:00', is_hidden: false }]);
        ok('C3 无块消息透传创建楼层', t.calls.create.length === 1 && t.calls.create[0][0].message.includes('跳转时间'));
        ok('C3 聊天变量未被写入', !t.chatVars.$phone_blocks);
      }

      // C4 范围查询末尾拼接虚拟楼层
      {
        const t = buildShimSandbox();
        const b1 = '<phone_module type="diary" character="小明" timestamp="1">a: 1</phone_module>';
        const b2 = '<chat_history target="小红" type="private">a: 2</chat_history>';
        t.chatVars.$phone_blocks = [b1, b2];
        const rows = t.sandbox.getChatMessages('0-1');
        ok('C4 真实楼层原样返回', rows.length >= 2 && rows[0].message_id === 0 && rows[1].message_id === 1);
        ok('C4 末尾拼接虚拟楼层', rows.length === 4 && rows[2].message_id === 1e9 && rows[3].message_id === 1e9 + 1);
        ok('C4 虚拟楼层结构完整', rows[2].role === 'assistant' && rows[2].is_hidden === true && rows[2].message === b1);
      }

      // C5 哨兵单查返回对应虚拟楼层
      {
        const t = buildShimSandbox();
        t.chatVars.$phone_blocks = ['<phone_module type="diary">x</phone_module>'];
        const rows = t.sandbox.getChatMessages(String(1e9));
        ok('C5 哨兵单查返回虚拟楼层', rows.length === 1 && rows[0].message_id === 1e9);
        const empty = t.sandbox.getChatMessages(String(1e9 + 5));
        ok('C5 越界哨兵返回空', empty.length === 0);
      }

      // C6 哨兵 set 就地更新变量块
      {
        const t = buildShimSandbox();
        const b0 = '<chat_history target="小明" type="private">a: 1</chat_history>';
        const b1 = '<chat_history target="小明" type="private">a: 2</chat_history>';
        t.chatVars.$phone_blocks = [b0];
        await t.sandbox.setChatMessages([{ message_id: 1e9, message: b1 }]);
        ok('C6 哨兵更新写入变量', t.chatVars.$phone_blocks[0] === b1);
        ok('C6 真实楼层未被写', t.calls.set.length === 0);
      }

      // C7 真实楼层无块：新增块入变量、楼层写入被拦截
      {
        const t = buildShimSandbox();
        const block = '<phone_module type="forum" timestamp="9">a: 1</phone_module>';
        await t.sandbox.setChatMessages([{ message_id: 0, message: t.floors[0].message + '\n\n' + block }]);
        ok('C7 新增块入变量', t.chatVars.$phone_blocks && t.chatVars.$phone_blocks[0] === block);
        ok('C7 楼层写入被拦截', t.calls.set.length === 0 && t.floors[0].message === '你好');
      }

      // C8 真实楼层已有块（旧数据就地更新）：透传
      {
        const t = buildShimSandbox();
        const nb = '<chat_history target="小明" type="private">name: 小明\nmessages: []\n</chat_history>';
        await t.sandbox.setChatMessages([{ message_id: 1, message: nb }]);
        ok('C8 旧数据就地更新透传', t.calls.set.length === 1 && t.floors[1].message === nb);
        ok('C8 不写入聊天变量', !t.chatVars.$phone_blocks);
      }

      // C9 哨兵删除变量块
      {
        const t = buildShimSandbox();
        t.chatVars.$phone_blocks = ['<phone_module type="a">1</phone_module>', '<phone_module type="b">2</phone_module>'];
        await t.sandbox.deleteChatMessages([1e9 + 1]);
        ok('C9 哨兵删除对应变量块', t.chatVars.$phone_blocks.length === 1 && t.chatVars.$phone_blocks[0].includes('type="a"'));
        ok('C9 真实楼层未受影响', t.calls.del.length === 0 && !!t.floors[1]);
      }

      // C10 模式关闭：全透传
      {
        const t = buildShimSandbox();
        t.lsStore['phone_display_settings'] = JSON.stringify({ useChatVariables: false });
        const block = '<chat_history target="小明" type="private">a: 1</chat_history>';
        await t.sandbox.createChatMessages([{ role: 'assistant', message: block, is_hidden: false }]);
        ok('C10 模式关闭透传建楼', t.calls.create.length === 1);
        const rows = t.sandbox.getChatMessages('0-2');
        ok('C10 模式关闭不拼虚拟块', !rows.some((r) => r.message_id >= 1e9));
      }

      // C11 重复安装幂等
      {
        const t = buildShimSandbox();
        const first = t.sandbox.getChatMessages;
        t.sandbox.__improvedPhoneVarStorageInstall();
        ok('C11 重复安装幂等', t.sandbox.getChatMessages === first);
      }
    }

    // ---------------------------------------------------------------- 测试 D：本地 DiceBear 兜底头像
    console.log('\n== D) 本地 DiceBear 兜底头像 ==');
    {
      const r = buildModuleRunner();
      const mod2213 = r.requireModule(2213);
      const hash = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);
      // 找两个名字：一个走池分支（hash%4===0），一个走生成分支
      let poolName = null;
      let genName = null;
      for (let i = 0; i < 200 && (!poolName || !genName); i++) {
        const name = '头像混用测试' + i;
        if (0 === hash(name) % 4) {
          if (!poolName) poolName = name;
        } else if (!genName) genName = name;
      }
      const genResult = mod2213.wH(genName);
      ok('D1 兜底生成本地 dataUri 头像', genResult.startsWith('data:image/svg+xml'), genResult.slice(0, 60));
      ok(
        'D2 同名头像稳定且只生成一次（缓存）',
        genResult === mod2213.wH(genName) &&
          r.sandbox.__avatarSeeds.filter((s) => s === genName).length === 1,
      );
      ok('D3 池分支走内置随机池', mod2213.wH(poolName).startsWith('https://files.catbox.moe/'), mod2213.wH(poolName).slice(0, 50));
      let nameCn = null;
      for (let i = 0; i < 200 && !nameCn; i++) {
        const nm = '中文 种子' + i;
        if (0 !== hash(nm) % 4) nameCn = nm;
      }
      mod2213.wH(nameCn);
      ok('D4 seed 为角色名（确定性生成）', r.sandbox.__avatarSeeds.includes(nameCn));
      // 丰富度：多个不同角色名应产出彼此不同的 dataUri
      const uris = new Set();
      for (let i = 0; i < 40; i++) {
        const nm = '丰富度测试' + i;
        if (0 !== hash(nm) % 4) uris.add(mod2213.wH(nm));
      }
      ok('D5 不同角色头像彼此不同', uris.size >= 20, '唯一值 ' + uris.size + '/40');
    }

    console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
    process.exit(fail ? 1 : 0);
  })();
}
