// 从 phone_index_fixed.js 精确切分 webpack 模块 → src/ ES 模块工程
// 结构（已探测确认）：
//   [0] import{v4 as e}from CDN
//   [1] var n={154 个模块工厂}, t={}
//   [2] function a(e){...}              webpack require
//   [3] a.n=...,a.d=...,a.o=...,a.r=...
//   [4..末尾-1] 入口模块内联（顶层）
//   [末尾] bootstrap IIFE
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import * as _traverseNS from '@babel/traverse';
import * as _generateNS from '@babel/generator';

const traverse = _traverseNS.traverse || _traverseNS.default?.traverse || _traverseNS.default;
const generate = _generateNS.generate || _generateNS.default;
const SRC_FILE = 'phone_index_fixed.js';
const OUT_DIR = 'src';

const KNOWN_NAMES = {
  112: 'aiService',
  685: 'imageGenService',
  920: 'configService',
  5756: 'defaultData',
  5849: 'defaultData',
};

const src = fs.readFileSync(SRC_FILE, 'utf8');
const ast = parse(src, { sourceType: 'module' });
const body = ast.program.body;

// ---- 结构断言 ----
const importDecl = body[0];
if (importDecl.type !== 'ImportDeclaration') throw new Error('语句[0] 不是 import');
const tableDecl = body[1];
if (tableDecl.type !== 'VariableDeclaration' || tableDecl.declarations.length !== 2)
  throw new Error('语句[1] 形态不符: ' + tableDecl.type);
const tableInit = tableDecl.declarations[0].init;
const cacheId = tableDecl.declarations[1].id.name;
const tableId = tableDecl.declarations[0].id.name;
if (tableInit.type !== 'ObjectExpression') throw new Error('模块表不是对象字面量');
const runtimeFn = body[2];
if (runtimeFn.type !== 'FunctionDeclaration') throw new Error('语句[2] 不是 FunctionDeclaration');
const requireName = runtimeFn.id.name;
const helpersStmt = body[3];
const entryStmts = body.slice(4);
console.log(`顶层绑定: 表=${tableId} 缓存=${cacheId} require=${requireName}`);
console.log(`模块数=${tableInit.properties.length} 入口语句数=${entryStmts.length}`);

// ---- 共享绑定重命名（作用域安全）----
// 先检查新名无冲突
const NEW_NAMES = { [tableId]: '__webpackModules__', [cacheId]: '__webpackCache__', [requireName]: '__webpackRequire__' };
const importLocal = importDecl.specifiers[0].local.name; // 'e' → uuid v4
NEW_NAMES[importLocal] = 'uuidV4';
const taken = new Set();
traverse(ast, {
  Identifier(p) {
    taken.add(p.node.name);
  },
});
for (const newName of Object.values(NEW_NAMES)) {
  if (taken.has(newName)) throw new Error('新名冲突: ' + newName);
}

// 顶层绑定集合（用于审计）
const programScope = (() => {
  let ps = null;
  traverse(ast, { Program(p) { if (!ps) ps = p.scope; } });
  return ps;
})();
const programBindingNames = new Set(Object.keys(NEW_NAMES));
console.log('待重命名顶层绑定:', [...programBindingNames].join(', '));

// 审计：每个模块工厂是否引用顶层绑定（预期：无，因为 e/n/t 均被工厂参数遮蔽）
let factoryWithFreeRefs = 0;
for (const prop of tableInit.properties) {
  if (prop.type !== 'ObjectMethod' && !(prop.type === 'ObjectProperty')) throw new Error('非工厂属性: ' + prop.type);
}
// 用 traverse 找到每个工厂的 path 做作用域分析
const propPaths = [];
traverse(ast, {
  'ObjectMethod|ObjectProperty'(p) {
    if (p.parent === tableInit || p.parentPath?.node === tableInit) propPaths.push(p);
  },
});
if (propPaths.length !== tableInit.properties.length) {
  // 兜底：直接按 AST 引用判定父子关系
  propPaths.length = 0;
  traverse(ast, {
    Program(progPath) {
      for (const prop of tableInit.properties) {
        // 重新解析整棵树找不到对应 path 时，用 manual 方式
      }
    },
  });
  console.warn('警告: 工厂 path 匹配数不符, 实得', propPaths.length);
}

// 逐工厂审计（若 path 可用）
for (const p of propPaths) {
  const frees = new Set();
  p.traverse({
    ReferencedIdentifier(idPath) {
      const binding = idPath.scope.getBinding(idPath.node.name);
      if (binding && programBindingNames.has(idPath.node.name) && isProgramBinding(binding)) {
        frees.add(idPath.node.name + (isShadowedHere(idPath) ? '(遮蔽)' : ''));
      }
    },
  });
  if (frees.size) {
    factoryWithFreeRefs++;
    console.log('  工厂引用顶层绑定:', idOf(p), '→', [...frees].join(','));
  }
}
function isProgramBinding(binding) {
  let s = binding.scope;
  while (s.parent) s = s.parent;
  return s.path.node.type === 'Program';
}
function isShadowedHere(idPath) {
  // 若最近作用域里该名字是参数/局部，则 getBinding 不会返回程序级绑定——到这一步说明未遮蔽
  return false;
}
function idOf(p) {
  const k = p.node.key;
  return k.type === 'NumericLiteral' ? String(k.value) : k.name || '?';
}
console.log('引用顶层绑定的工厂数:', factoryWithFreeRefs, '(预期 0)');

// 审计：入口语句对顶层绑定的引用
const entryFreeRefs = {};
for (const stmt of entryStmts) {
  // 手动遍历该语句 AST，找引用顶层绑定的标识符（此处借 traverse 全树再过滤 parentPath 链）
}
// 实际实现：在整个 AST 上找所有引用顶层绑定的位置，按归属分组
const topLevelBindings = new Map(); // name -> binding
for (const name of programBindingNames) {
  const b = programScope.getBinding(name);
  if (!b) throw new Error('顶层绑定不存在: ' + name);
  topLevelBindings.set(name, b);
}
const refsByOwner = { entry: {}, factory: {} };
traverse(ast, {
  ReferencedIdentifier(idPath) {
    const name = idPath.node.name;
    const b = idPath.scope.getBinding(name);
    if (!b || topLevelBindings.get(name) !== b) return;
    // 归属：向上找最近的工厂 path 或顶层语句
    let cur = idPath.parentPath;
    let owner = null;
    while (cur) {
      if (cur.node.type === 'ObjectMethod' || cur.node.type === 'ObjectProperty') {
        if (cur.parentPath?.node === tableInit) { owner = 'factory:' + idOf(cur); break; }
      }
      if (cur.type === 'Program' || !cur.parentPath) break;
      cur = cur.parentPath;
    }
    if (!owner) owner = 'entry';
    const bucket = owner.startsWith('factory:') ? refsByOwner.factory : refsByOwner.entry;
    (bucket[owner] = bucket[owner] || new Set()).add(name);
  },
});
const entryRefNames = new Set();
for (const [owner, names] of Object.entries(refsByOwner.entry)) {
  for (const n of names) entryRefNames.add(n);
}
console.log('入口引用的顶层绑定:', [...entryRefNames].join(', '), '(预期仅 e 和 require 名)');

// ---- 执行重命名 ----
for (const [oldName, newName] of Object.entries(NEW_NAMES)) {
  const b = programScope.getBinding(oldName);
  if (!b) throw new Error('无法重命名, 绑定缺失: ' + oldName);
  programScope.rename(oldName, newName);
}
console.log('重命名完成:', Object.entries(NEW_NAMES).map(([o, n]) => `${o}→${n}`).join(' '));

// ---- 生成工具 ----
const genOpts = { compact: false, comments: false, jsescOption: { minimal: true } };
const gen = node => generate(node, genOpts).code;

// ---- 写模块文件 ----
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT_DIR, 'modules'), { recursive: true });

const moduleEntries = [];
for (const prop of tableInit.properties) {
  const id = typeof prop.key.value === 'number' ? String(prop.key.value) : prop.key.name;
  const name = KNOWN_NAMES[id] ? `${id}-${KNOWN_NAMES[id]}.js` : `${id}.js`;
  const paramsText = prop.params.map(p => gen(p)).join(', ');
  const isAsync = prop.async ? 'async ' : '';
  let factoryCode;
  if (prop.type === 'ObjectMethod') {
    factoryCode = `export default ${isAsync}function (${paramsText}) ${gen(prop.body)}`;
  } else {
    factoryCode = `export default ${gen(prop.value)}`;
  }
  const file = path.join(OUT_DIR, 'modules', name);
  fs.writeFileSync(file, `// webpack 模块 ${id}（提取自 ${SRC_FILE}）\n${factoryCode}\n`, 'utf8');
  moduleEntries.push({ id, varName: `m${id}`, file: `./modules/${name}` });
}
console.log(`已写出 ${moduleEntries.length} 个模块文件`);

// ---- 写 webpack runtime ----
const runtimeFnCode = gen(runtimeFn); // 已重命名
const helpersCode = gen(helpersStmt); // 已重命名
const runtimeFile = `// webpack 运行时（提取自 ${SRC_FILE}，共享绑定已重命名）
const __webpackCache = {};
let __webpackModules__ = {};
export function registerModules(mods) {
  __webpackModules__ = mods;
}
${runtimeFnCode}
${helpersCode};
export default __webpackRequire__;
`;
fs.writeFileSync(path.join(OUT_DIR, 'webpack-runtime.js'), runtimeFile, 'utf8');

// ---- 写模块表 ----
const tableLines = moduleEntries.map(m => `import ${m.varName} from '${m.file}';`);
const tableObj = moduleEntries.map(m => `  ${m.id}: ${m.varName},`).join('\n');
fs.writeFileSync(
  path.join(OUT_DIR, 'module-table.js'),
  `// 自动生成：模块 id → 工厂映射（scripts/extract_modules.mjs 产物，勿手工改动顺序）\n${tableLines.join('\n')}\n\nexport default {\n${tableObj}\n};\n`,
  'utf8'
);

// ---- 写入口 index.js ----
const entryCode = entryStmts.map(s => gen(s)).join('\n\n');
const indexFile = `// 入口模块（原 bundle 顶层内联代码，提取自 ${SRC_FILE}）
import { v4 as uuidV4 } from 'uuid';
import __webpackRequire__, { registerModules } from './webpack-runtime.js';
import __modules from './module-table.js';

registerModules(__modules);

${entryCode}

// 空导出：强制 rolldown 将本入口按 ESM 内联执行，而非包 CJS 壳
export {};
`;
fs.writeFileSync(path.join(OUT_DIR, 'index.js'), indexFile, 'utf8');

// ---- 语法回验 ----
let fail = 0;
for (const f of ['index.js', 'webpack-runtime.js', 'module-table.js', ...fs.readdirSync(path.join(OUT_DIR, 'modules')).map(n => 'modules/' + n)]) {
  try {
    parse(fs.readFileSync(path.join(OUT_DIR, f), 'utf8'), { sourceType: 'module' });
  } catch (e) {
    fail++;
    console.error('语法回验失败:', f, e.message.slice(0, 200));
  }
}
console.log(fail === 0 ? '全部生成文件语法回验通过' : `语法回验失败 ${fail} 个`);
console.log('入口 uuid 引用计数:', (indexFile.match(/uuidV4/g) || []).length);
console.log('完成。');
