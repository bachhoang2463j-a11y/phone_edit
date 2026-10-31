// 语义重命名：按 VARIABLE_MAP.md 把服务层压缩变量还原为语义名（babel AST 作用域安全）
// 用法: node scripts/rename_semantic.mjs [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import * as traverseNS from '@babel/traverse';
import generate from '@babel/generator';

const traverse = traverseNS.traverse || traverseNS.default?.traverse || traverseNS.default;
const generateCode = generate.generate || generate.default || generate;
const DRY = process.argv.includes('--dry');

// 模块 920 — 映射已对照实际代码逐条核实（VARIABLE_MAP §2.1 有错位，以导出表与函数体为准）
// 导出名锚点: GEMINI_IMAGE_SIZE_OPTIONS:o, IMAGE_ASPECT_RATIO_OPTIONS:a, getDefaultNovelAiConfig:p,
//            loadNovelAiConfig:w, saveNovelAiConfig:N
const RENAME_920 = {
  a: 'IMAGE_ASPECT_RATIO_OPTIONS',
  o: 'GEMINI_IMAGE_SIZE_OPTIONS',
  r: 'STORAGE_KEY',
  i: 'DEFAULT_API_FORMAT',
  s: 'DEFAULT_PROMPT_MODE',
  l: 'DEFAULT_NOVELAI_CONFIG',
  c: 'DEFAULT_OPENAI_CONFIG',
  A: 'DEFAULT_GEMINI_CONFIG',
  d: 'DEFAULT_POLLINATIONS_CONFIG',
  q: 'DEFAULT_COMFYUI_CONFIG',
  p: 'getDefaultNovelAiConfig',
  w: 'loadNovelAiConfig',
  N: 'saveNovelAiConfig',
  C: 'clampNumber',
  m: 'toFiniteNumber',
  g: 'toInteger',
  u: 'clampImageDimension',
  f: 'toSeedValue',
  b: 'validateApiFormat',
  v: 'validatePromptMode',
  x: 'validateAspectRatio',
  h: 'validateImageSize',
  B: 'sanitizeNovelAi',
  y: 'sanitizeOpenAi',
  k: 'sanitizeGemini',
  E: 'sanitizePollinations',
  J: 'sanitizeComfyUi',
};
// 模块 685 — 同样逐条核实（VARIABLE_MAP §2.2 的 h/k/w/E/B/y 全部错位，以 t.d 导出表为准）
const RENAME_685 = {
  m: 'buildNaturalPromptText',
  g: 'buildNaturalPromptTextEn',
  f: 'buildPromptRequestByMode',
  A: 'buildPromptText',
  u: 'buildPromptTextByMode',
  o: 'normalizeApiBaseUrl',
  i: 'redactDataUrlForLog',
  s: 'redactDataUrlList',
  l: 'cleanStringList',
  b: 'joinTagPrompts',
  v: 'joinNaturalPrompts',
  x: 'blobToDataUrl',
  h: 'extractImageFromZip',
  B: 'extractImageFromJson',
  k: 'taskQueue',
  E: 'isProcessingQueue',
  y: 'generateNovelAiImage',
  w: 'queueNovelAiImageGeneration',
  N: 'getImageGenerationQueueLength',
  F: 'clearImageGenerationQueue',
};
// VARIABLE_MAP.md §4.1 入口级（index.js 顶层）
const RENAME_ENTRY = {
  y5: 'initPhone',
  b5: 'importDefaultRegex',
  Yl: 'DEFAULT_STICKERS',
  Q_: 'notifyPhoneReady',
  // r5 需先确认其绑定的模块来源，见 main 内校验
};

const jobs = [
  { file: 'src/modules/920-configService.js', map: RENAME_920, scope: 'factory' },
  { file: 'src/modules/685-imageGenService.js', map: RENAME_685, scope: 'factory' },
];

let totalRenamed = 0;
const problems = [];

function renameInFactory(file, map) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parse(code, { sourceType: 'module' });
  let factoryPath = null;
  traverse(ast, {
    ExportDefaultDeclaration(p) {
      factoryPath = p.get('declaration');
    },
  });
  if (!factoryPath || !factoryPath.isFunctionDeclaration()) {
    problems.push(`${file}: 默认导出不是函数声明，跳过`);
    return 0;
  }
  const fnScope = factoryPath.scope;
  let count = 0;
  for (const [oldName, newName] of Object.entries(map)) {
    const binding = fnScope.getBinding(oldName);
    if (!binding) {
      problems.push(`${file}: 未找到绑定 ${oldName} (→${newName})`);
      continue;
    }
    // 仅重命名声明在工厂函数体顶层的绑定（排除同名的嵌套/参数绑定——getBinding 已按作用域解析）
    binding.scope.rename(oldName, newName);
    count++;
  }
  if (!DRY && count) {
    fs.writeFileSync(file, generateCode(ast, { compact: false, jsescOption: { minimal: true } }).code, 'utf8');
  }
  return count;
}

// 入口：先确认 r5 的绑定来源，再做映射重命名
function renameInEntry(file, map) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parse(code, { sourceType: 'module' });
  let programScope = null;
  traverse(ast, { Program(p) { if (!programScope) programScope = p.scope; } });

  // r5 = a(5756) 或 a(5849)？定位其初始化
  const r5Binding = programScope.getBinding('r5');
  if (r5Binding) {
    const declPath = r5Binding.path;
    const init = declPath.node.init;
    const initCode = init ? generateCode(init).code : '(无初始化)';
    console.log(`r5 声明: ${declPath.node.kind ?? ''} = ${initCode.slice(0, 80)}`);
    if (/__webpackRequire__\((\d+)\)/.test(initCode)) {
      const modId = RegExp.$1;
      console.log(`r5 绑定模块 ${modId} → 重命名为 presetResources${modId === '5756' || modId === '5849' ? '（与 VARIABLE_MAP §4 一致）' : '（注意: 非 5849/5756，请人工核对！）'}`);
      map.r5 = modId === '5756' || modId === '5849' ? 'presetResources' : 'r5_' + modId;
    }
  } else {
    problems.push('entry: 未找到顶层绑定 r5');
  }

  let count = 0;
  for (const [oldName, newName] of Object.entries(map)) {
    const binding = programScope.getBinding(oldName);
    if (!binding) {
      problems.push(`${file}: 未找到顶层绑定 ${oldName} (→${newName})`);
      continue;
    }
    binding.scope.rename(oldName, newName);
    count++;
  }
  if (!DRY && count) {
    fs.writeFileSync(file, generateCode(ast, { compact: false, jsescOption: { minimal: true } }).code, 'utf8');
  }
  return count;
}

for (const job of jobs) {
  const n = renameInFactory(job.file, job.map);
  totalRenamed += n;
  console.log(`${job.file}: 重命名 ${n}/${Object.keys(job.map).length}`);
}
const entryN = renameInEntry('src/index.js', { ...RENAME_ENTRY });
totalRenamed += entryN;
console.log(`src/index.js: 重命名 ${entryN}`);

console.log(`\n合计重命名绑定: ${totalRenamed}`);
if (problems.length) {
  console.log('\n问题清单:');
  problems.forEach(p => console.log('  - ' + p));
  process.exit(2);
}
console.log(DRY ? '(dry run，未写文件)' : '已写回文件');
