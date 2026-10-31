#!/usr/bin/env node
/**
 * 源码工程验证（v2，替代原"补丁产物"验证）。
 * 原 v1 针对文本级补丁产物 phone_index_fixed.js；源码还原后（P1-P41 已语义合并进 src/）：
 *  - 补丁片段编译/配平对比节随之作废，由 dist 全量编译门禁取代；
 *  - 第 3 节的语义回归断言全部保留，改为对 src 全文（剥离空白后）匹配，
 *    标识符同步语义重命名的映射（b5→importDefaultRegex，Q_→notifyPhoneReady 等）。
 */
'use strict';
const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${extra ? ' :: ' + extra : ''}`); }
};

// ---- 加载 src 全文并剥离空白（语义匹配锚点） ----
const SRC_DIR = path.join(__dirname, '..', 'src');
function collectSrc(dir) {
  let out = '';
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out += collectSrc(p);
    else if (ent.name.endsWith('.js')) out += fs.readFileSync(p, 'utf8') + '\n';
  }
  return out;
}
const flat = collectSrc(SRC_DIR).replace(/\s+/g, '');
// 锚点书写约定：minified 原文形态，经 fp() 与 flat 同规则剥空白后比对；
// prettier 会给 await 链/!function 加括号、按 trailingComma:"all" 加尾逗号，此类锚点按 prettier 后形态手写
const fp = s => s.replace(/\s+/g, '');

// ---- dist 编译门禁 ----
const distPath = path.join(__dirname, '..', 'dist', 'phone_index.js');
const dist = fs.readFileSync(distPath, 'utf8');

console.log('== 1) dist 全量编译与自包含 ==');
try { new Function(dist); ok('dist 直接全量编译（无顶层 import，uuid 已内置）', true); }
catch (e) { ok('dist 直接全量编译', false, e.message.slice(0, 120)); }
ok('dist 无 CDN 依赖残留', !dist.includes('testingcf.jsdelivr'));
ok('dist 保留初始化日志', dist.includes('[Improved Phone] Initializing'));

console.log('== 2) 语义回归断言（src 全文，空白不敏感） ==');
// —— ComfyUI 设置区（原 P16/P17/P22/P24 约束）——
ok('ComfyUI 分支有稳定 key', flat.includes("{key:'comfyui',class:'settings-section'"));
ok('新增表单不占用 Vue 缓存槽位 d[149..156]', !/\d\[(?:149|15[0-6])\]/.test(flat));

const comfyStart = flat.indexOf("{key:'comfyui',class:'settings-section'");
const comfyEnd = flat.indexOf("'pollinations'===n.value.apiFormat", comfyStart);
const comfyRender = comfyStart >= 0 && comfyEnd > comfyStart ? flat.slice(comfyStart, comfyEnd) : '';
ok('ComfyUI 设置区切片有效', comfyRender.length > 500 && comfyRender.length < 10000, `长度 ${comfyRender.length}`);
// prettier 3 trailingComma:"all" 会把最后一个实参写作 `512,)`，故锚点不带右括号
ok('ComfyUI v-model 使用 NEED_PATCH 标志（6 处）', (comfyRender.match(/null,512/g) || []).length === 6,
  '实际 ' + (comfyRender.match(/null,512/g) || []).length);
ok('ComfyUI 表单不存在无动态属性列表的 PROPS 标志', !!comfyRender && !comfyRender.includes('null,8'));

// —— 保存流程（P6/P13 约束）——
ok('保存前复制普通配置快照', flat.includes(fp('const cfCfg={...n.value,novelai:{...n.value.novelai')));
ok('保存写入让出点击事件循环', flat.includes(fp('setTimeout(()=>{let t;try{t=(0,Hr.saveNovelAiConfig)(cfCfg)')));

// —— 预置资源流程（P18/P25-P29 约束）——
ok('旧版初始化资源弹窗已禁用', flat.includes("&&!1&&!(function(){try{conste=getVariables({type:'character'"));
ok('手动预置资源加载器已注册', flat.includes('globalThis.__improvedPhoneLoadPresetResources=__improvedPhoneLoadPresetResources'));
const presetStart = flat.indexOf('asyncfunction__improvedPhoneLoadPresetResources');
const presetEnd = flat.indexOf('globalThis.__improvedPhoneLoadPresetResources', presetStart);
const presetLoader = presetStart >= 0 && presetEnd > presetStart ? flat.slice(presetStart, presetEnd) : '';
ok('角色数据和表情包只执行一次变量写回', (presetLoader.match(/replaceVariables\(/g) || []).length === 1,
  '实际 ' + (presetLoader.match(/replaceVariables\(/g) || []).length);
ok('其他设置页包含三个资源勾选项', flat.includes("'加载默认数据'") && flat.includes("'加载默认表情包'") && flat.includes("'导入默认正则'"));
ok('资源按钮载入所选项目', flat.includes("P.value?'载入中...':'载入所选资源'"));
ok('资源导入不再使用浏览器确认框', !flat.includes("confirm('将用内置预置覆盖当前角色卡"));
ok('资源导入成功后静默刷新', flat.includes("if(!((!O.value||n.data)&&(!R.value||n.stickers)&&(!X.value||n.regex)))thrownewError('部分预置资源载入失败');window.location.reload()"));
ok('初始化完成通知已隐藏', flat.includes(fp('}else $_(e);const t=ke(),')));
ok('默认正则不再启动时自动导入', flat.includes('!1&&(awaitimportDefaultRegex()),awaitB5(),'));

// —— 七处运行时生图入口（P30-P32 约束）——
const legacyImageEntryLabels = flat.match(/'pollinations'===([A-Za-z_$][\w$]*)\.apiFormat\?'Pollinations':'openai'===\1\.apiFormat\?'OpenAI':'gemini'===\1\.apiFormat\?'Gemini':'NovelAI'/g) || [];
const comfyImageEntryLabels = flat.match(/'gemini'===([A-Za-z_$][\w$]*)\.apiFormat\?'Gemini':'comfyui'===\1\.apiFormat\?'ComfyUI':'NovelAI'/g) || [];
const comfyImageEntryConfigs = flat.match(/'gemini'===([A-Za-z_$][\w$]*)\.apiFormat\?\1\.gemini:'comfyui'===\1\.apiFormat\?\1\.comfyui:\1\.pollinations/g) || [];
const comfyUrlOnlyChecks = flat.match(/'comfyui'===([A-Za-z_$][\w$]*)\.apiFormat&&([A-Za-z_$][\w$]*)\.url/g) || [];
ok('所有运行时生图入口显示 ComfyUI 标签（7 处）', legacyImageEntryLabels.length === 0 && comfyImageEntryLabels.length === 7,
  `legacy=${legacyImageEntryLabels.length}, comfy=${comfyImageEntryLabels.length}`);
ok('所有运行时生图入口读取 comfyui 配置（7 处）', comfyImageEntryConfigs.length === 7, '实际 ' + comfyImageEntryConfigs.length);
ok('所有运行时生图入口对 ComfyUI 仅校验 URL（7 处）', comfyUrlOnlyChecks.length === 7, '实际 ' + comfyUrlOnlyChecks.length);

// —— P41 聊天变量存储兼容层 ——
ok('聊天变量存储兼容层已注入（含标记注释）', flat.includes('/*__PHONE_VAR_STORAGE_START__*/') && flat.includes('/*__PHONE_VAR_STORAGE_END__*/') && flat.includes('globalThis.__improvedPhoneVarStorageInstall=install'));
ok('聊天变量键为 $phone_blocks（宏不可见）', flat.includes("constVAR_KEY='$phone_blocks'"));
ok('设置默认开启聊天变量存储', flat.includes('useChatVariables:!0'));
ok('两处设置合并均含 useChatVariables', (flat.match(/useChatVariables:n\.useChatVariables\?\?r\.useChatVariables/g) || []).length === 2);
ok('设置页含聊天隐藏变量开关', flat.includes('内容存入聊天隐藏变量') && flat.includes("a('useChatVariables',ucv.value)"));
ok('新开关不占用渲染缓存槽位', flat.includes("'onUpdate:modelValue':(e)=>(ucv.value=e)"));

// ---- 源码工程结构 ----
console.log('== 3) 源码工程结构 ==');
const tableSrc = fs.readFileSync(path.join(SRC_DIR, 'module-table.js'), 'utf8');
const tableIds = (tableSrc.match(/^  (\d+): m\d+,$/gm) || []).length;
const moduleFiles = fs.readdirSync(path.join(SRC_DIR, 'modules')).filter(f => f.endsWith('.js')).length;
ok(`module-table 注册数 = 模块文件数（${tableIds}/${moduleFiles}）`, tableIds === moduleFiles && tableIds === 154);
const runtimeSrc = fs.readFileSync(path.join(SRC_DIR, 'webpack-runtime.js'), 'utf8');
ok('webpack 运行时导出 require 与 registerModules', runtimeSrc.includes('export default __webpackRequire__') && runtimeSrc.includes('export function registerModules'));

console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
