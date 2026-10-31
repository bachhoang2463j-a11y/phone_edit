#!/usr/bin/env node
/**
 * 从 webpack bundle 中提取指定模块函数体。
 * 边界策略：找到 ",ID(e,n,t){" 后，向后搜索下一个 ",NNN(e,n,t){"（模块 ID 数字+固定签名）作为结束边界。
 * 模块函数体内部出现完整 ",NNN(e,n,t){" 模式的概率极低，本方案对单行压缩代码最可靠。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SRC_MODULES_DIR = path.join(__dirname, '..', 'src', 'modules');

/**
 * 从 src/modules/ 源文件加载指定模块，重建与 extractModule 相同的 "ID(params){...}" 字符串形状。
 * @param {number|string} id 目标模块 id
 * @returns {string|null} "ID(e,n,t){...}" 形状字符串，找不到返回 null
 */
function extractModuleFromSrc(id) {
  let file;
  try {
    file = fs.readdirSync(SRC_MODULES_DIR).find(f => f === `${id}.js` || f.startsWith(`${id}-`));
  } catch {
    return null;
  }
  if (!file) return null;
  const code = fs.readFileSync(path.join(SRC_MODULES_DIR, file), 'utf8');
  // 模块文件可含顶部 npm import（如 2213 的 DiceBear 本地渲染），vm 提取时剥离，由沙箱垫片代替
  const m = /^\s*\/\/[^\n]*\n*(?:import[^\n]*\n)*export default (?:async )?function\s*\(([^)]*)\)\s*\{([\s\S]*)\}\s*$/.exec(code);
  if (!m) throw new Error('src 模块文件解析失败: ' + file);
  const [, params, body] = m;
  return `${id}(${params.replace(/\s+/g, '')}){${body}}`;
}

/**
 * @param {string} code bundle 全文
 * @param {number} id 目标模块 id
 * @returns {string|null} 模块体（"ID(e,n,t){...}" 不含前导逗号），找不到返回 null
 */
function extractModule(code, id) {
  const startRe = new RegExp('(?:^|,)' + id + '\\(e,n,t\\)\\{');
  const m = startRe.exec(code);
  if (!m) return null;
  // 去掉前导逗号（若存在）
  const bodyStart = m.index + (code[m.index] === ',' ? 1 : 0) + m[0].length - 1;
  const nextRe = /,\d{1,4}\(e,n,t\)\{/g;
  nextRe.lastIndex = bodyStart;
  const nm = nextRe.exec(code);
  if (!nm) return null;
  return code.slice(m.index + (code[m.index] === ',' ? 1 : 0), nm.index);
}

module.exports = { extractModule, extractModuleFromSrc };

if (require.main === module) {
  const fs = require('fs');
  const file = process.argv[2];
  const ids = process.argv.slice(3).map(Number);
  const code = fs.readFileSync(file, 'utf8');
  for (const id of ids) {
    const body = extractModule(code, id);
    console.log(`模块 ${id}: ${body ? body.length + ' 字符' : '未找到'}`);
  }
}
