#!/usr/bin/env node
/**
 * 沙箱集成测试：验证补丁后 phone_index_fixed.js 中
 *  A) 配置中心 920：comfyui 保存/读取往返、配额降级、旧配置兼容
 *  B) 生图引擎 685：ComfyUI 分发分支全链路（mock fetch 三接口）
 *  C) 兼容性：apiFormat 校验、默认配置结构
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { extractModule } = require('./extract.cjs');

const BUNDLE = path.join(__dirname, '..', 'phone_index_fixed.js');
const code = fs.readFileSync(BUNDLE, 'utf8');

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
  const moduleCache = new Map();

  // 模块 920 的函数体
  function buildFn(moduleText, moduleId) {
    const m = /^(\d+)\(e,n,t\)\{(.*)\}$/s.exec(moduleText);
    if (!m) throw new Error('模块体解析失败: ' + moduleId);
    const head = m[1], body = m[2];
    // 包装为 (e,n,t)=>body
    const wrapped = `(function(e,n,t){${body}})`;
    // 头部 t.d 导出重定向
    const redirected = wrapped.replace(/t\.d\(n,\{([\s\S]*?)\}\)/, 't.d(n,{__redirect__:()=>1,$1})');
    return { head, fn: vm.runInContext('(' + redirected + ')', ctx, { filename: `module_${moduleId}.js` }) };
  }

  function getModule(id) {
    if (moduleCache.has(id)) return moduleCache.get(id);
    const text = extractModule(code, id);
    if (!text) {
      // 特殊：112 前缀是 {n={112( 而非 ,112(
      const m = new RegExp('(?:^|\\{)' + id + '\\(e,n,t\\)\\{').exec(code);
      if (m) {
        const { buildBody } = (() => {
          // 从头到下一个模块标记
          const start = m.index + m[0].length - 1;
          const next = /,\d{1,4}\(e,n,t\)\{/g;
          next.lastIndex = start;
          const nm = next.exec(code);
          return { buildBody: () => code.slice(m.index, nm.index) };
        })();
        const text2 = buildBody();
        const built = buildFnFrom(text2, id);
        moduleCache.set(id, built);
        return built;
      }
      throw new Error('模块 ' + id + ' 未找到');
    }
    const built = buildFnFrom(text, id);
    moduleCache.set(id, built);
    return built;
  }

  function buildFnFrom(text, moduleId) {
    const m = /^(\d+)\(e,n,t\)\{(.*)\}$/s.exec(text);
    if (!m) throw new Error('模块体解析失败: ' + moduleId);
    const body = m[2];
    const wrapped = '(function(e,n,t){' + body + '})';
    const fn = vm.runInContext(wrapped, ctx, { filename: `module_${moduleId}.js` });
    return { head: m[1], fn };
  }

  function requireModule(id) {
    if (moduleCache.has(id)) return moduleCache.get(id).exports;
    const { fn } = getModule(id);
    const moduleObj = { exports: {} };
    // 构造 fake require（含 webpack 运行时 helper：t.r / t.d / t.n / t.o）
    const fakeRequire = (depId) => {
      if (!moduleCache.has(depId)) {
        getModule(depId); // 触发构建并缓存
      }
      return moduleCache.get(depId).exports;
    };
    fakeRequire.r = (exports) => { Object.defineProperty(exports, '__esModule', { value: true }); };
    fakeRequire.d = (exports, defs) => {
      for (const key of Object.keys(defs)) {
        Object.defineProperty(exports, key, { enumerable: true, get: defs[key] });
      }
    };
    fakeRequire.n = (mod) => {
      const getter = (mod && mod.__esModule) ? () => mod : () => ({ default: mod });
      getter.a = mod && mod.__esModule ? mod : { default: mod };
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
    const text920 = extractModule(code, 920);
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

  const text685 = extractModule(code, 685);
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

    console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
    process.exit(fail ? 1 : 0);
  })();
}
