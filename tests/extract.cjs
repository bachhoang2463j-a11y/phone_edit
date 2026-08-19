#!/usr/bin/env node
/**
 * 从 webpack bundle 中提取指定模块函数体。
 * 边界策略：找到 ",ID(e,n,t){" 后，向后搜索下一个 ",NNN(e,n,t){"（模块 ID 数字+固定签名）作为结束边界。
 * 模块函数体内部出现完整 ",NNN(e,n,t){" 模式的概率极低，本方案对单行压缩代码最可靠。
 */
'use strict';

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

module.exports = { extractModule };

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
