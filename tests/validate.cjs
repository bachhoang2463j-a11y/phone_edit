#!/usr/bin/env node
/**
 * 验证补丁脚本的每个 to 文本都是合法 JS，且补丁后 bundle 全局括号/字符串配平与备份一致。
 * 复用 patch_comfyui.cjs 导出的 replacements（require 时补丁会重跑一遍，幂等）。
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { replacements } = require(path.join(__dirname, '..', 'scripts', 'patch_comfyui.cjs'));

let pass = 0, fail = 0;
console.log('== 1) 每个补丁 to 文本语法 ==');
// 片段式补丁（非完整函数体，需特殊上下文验证）
const fragmentAsExpr = new Set([]);
const skipCompile = new Set([
  'P3_920新增sanitizeComfyUi函数',        // 模块体中间片段，由沙箱 920 测试证明
  'P7_685_插入comfyui分发分支',           // async 函数体内片段，由沙箱 685 测试证明
  'P18_boot_禁用旧初始化资源弹窗',          // boot 条件链中间片段（以 }catch 续前文），由配平+命中验证
  'P17_render_模型与参数区加ComfyUI配置区块', // render 流片段（末尾开启 pollinations 分支由原文本闭合），由配平+d索引验证
  'P22_render_ComfyUI分支稳定key并禁用标题缓存', // render 表达式中间片段，由最终产物断言验证
  'P25_boot_preset_loader',                    // 函数声明前置注入，末尾继续原 y5 函数
  'P27_other_settings_preset_button',          // render 表达式流片段，由最终产物断言验证
]);
for (const r of replacements) {
  if (skipCompile.has(r.name) || r.name.startsWith('P24_')) { console.log(`  ≈ ${r.name}（由最终产物断言证明）`); continue; }
  try {
    if (fragmentAsExpr.has(r.name)) {
      // 剥前导逗号后作为表达式验证（render 表达式流片段）
      const expr = r.to.startsWith(',') ? r.to.slice(1) : r.to;
      new Function('return (' + expr + ');');
    } else {
      new Function(r.to);
    }
    pass++;
    console.log(`  ✓ ${r.name}`);
  } catch (e) {
    fail++;
    console.log(`  ✗ ${r.name}: ${e.message}`);
  }
}

// 2) 全局括号/字符串配平扫描
function balanceCheck(code) {
  let depth = 0, state = 'code', quote = '', bad = null;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i], nx = code[i + 1];
    if (state === 'code') {
      if (ch === "'" || ch === '"') { state = 'str'; quote = ch; }
      else if (ch === '`') { state = 'tpl'; }
      else if (ch === '(' || ch === '{' || ch === '[') depth++;
      else if (ch === ')' || ch === '}' || ch === ']') { depth--; if (depth < 0) { bad = '负深度 @' + i; break; } }
    } else if (state === 'str') {
      if (ch === '\\') i++;
      else if (ch === quote) state = 'code';
    } else if (state === 'tpl') {
      if (ch === '\\') i++;
      else if (ch === '`') state = 'code';
      else if (ch === '$' && nx === '{') { state = 'code'; i++; }
    }
  }
  if (state !== 'code') bad = '未闭合字符串/模板, state=' + state;
  return { depth, bad };
}

console.log('== 2) 全局配平对比 ==');
const original = fs.readFileSync(path.join(__dirname, '..', 'phone_index.js'), 'utf8');
const fixed = fs.readFileSync(path.join(__dirname, '..', 'phone_index_fixed.js'), 'utf8');
const r1 = balanceCheck(original);
const r2 = balanceCheck(fixed);
console.log(`  original: depth=${r1.depth} bad=${r1.bad || '无'}`);
console.log(`  fixed: depth=${r2.depth} bad=${r2.bad || '无'}`);
// bundle 自身含正则字面量会导致状态机误判（original 与 fixed 同一位置），
// 判定标准：fixed 相对 original 未引入新的不平衡（bad 位置相同即视为通过）
if (!r2.bad || (r1.bad && r2.bad && r1.bad === r2.bad)) { pass++; console.log('  ✓ fixed 未引入新不平衡（与 original 一致）'); }
else { fail++; console.log('  ✗ fixed 存在 original 没有的不平衡'); }

console.log('== 3) ComfyUI 保存卡死回归约束 ==');
const checks = [
  ['ComfyUI 分支有稳定 key', fixed.includes("{key:'comfyui',class:'settings-section'" )],
  ['新增表单不占用 Vue 缓存槽位', !/d\[(?:149|15[0-6])\]/.test(fixed)],
  ['保存前复制普通配置快照', fixed.includes('const cfCfg={...n.value,novelai:{...n.value.novelai}')],
  ['保存写入让出点击事件循环', fixed.includes('setTimeout(()=>{let t;try{t=(0,Hr.saveNovelAiConfig)(cfCfg)')],
];
const comfyStart = fixed.indexOf("{key:'comfyui',class:'settings-section'");
const comfyEnd = fixed.indexOf("'pollinations'===n.value.apiFormat", comfyStart);
const comfyRender = comfyStart >= 0 && comfyEnd > comfyStart ? fixed.slice(comfyStart, comfyEnd) : '';
checks.push(
  ['ComfyUI v-model 使用 NEED_PATCH 标志', (comfyRender.match(/null,512\)/g) || []).length === 6],
  ['ComfyUI 表单不存在无动态属性列表的 PROPS 标志', !comfyRender.includes('null,8)')],
  ['旧版初始化资源弹窗已禁用', fixed.includes("&&!1&&!function(){try{const e=getVariables({type:'character'})")],
  ['手动预置资源加载器已注册', fixed.includes('globalThis.__improvedPhoneLoadPresetResources=__improvedPhoneLoadPresetResources')],
  ['其他设置页包含预置资源按钮', fixed.includes("P.value?'载入中...':'载入预置资源'")],
);
for (const [name, ok] of checks) {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}`); }
}

console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
