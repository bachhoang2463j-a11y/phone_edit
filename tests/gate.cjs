// 构建产物门禁：编译检查 + 结构标记核对（后续逐步扩充为完整 validate）
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'phone_index.js');
const src = fs.readFileSync(distPath, 'utf8');
let pass = 0, fail = 0;
const check = (name, ok, detail = '') => {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name} ${detail}`); }
};

console.log('[1] 全 bundle 编译门禁（剥离顶层 import 后 new Function）');
const stripped = src.replace(/^import[\s\S]*?from\s*['"][^'"]+['"];?\s*/m, (m, off) => (off === 0 || src.indexOf(m) < 200 ? '' : m));
try {
  new Function(stripped);
  check('new Function 全量编译', true);
} catch (e) {
  check('new Function 全量编译', false, e.message.slice(0, 150));
}

console.log('[2] 自包含性');
check('无顶层 import 语句（uuid 已内置）', !/^import\s/m.test(src));

console.log('[3] 关键结构标记');
const markers = [
  ['callAiWithPreset（模块112导出名）', 'callAiWithPreset'],
  ['$phone_blocks（P41 聊天变量存储）', '$phone_blocks'],
  ['useChatVariables（P41 兼容层）', 'useChatVariables'],
  ['comfyui（生图分发）', 'comfyui'],
  ['Improved Phone 初始化日志', '[Improved Phone] Initializing'],
  ['预置资源入口 __improvedPhoneLoadPresetResources', '__improvedPhoneLoadPresetResources'],
];
for (const [name, needle] of markers) check(name, src.includes(needle));

const cbCount = (src.match(/createElementBlock/g) || []).length;
check('createElementBlock 数量级（原1139）', cbCount > 1000 && cbCount < 1300, `实际 ${cbCount}`);

console.log('[4] 与原 bundle 的体量对比');
const fixed = fs.readFileSync(path.join(__dirname, '..', 'phone_index_fixed.js'), 'utf8');
console.log(`  原产物 ${(fixed.length / 1024 / 1024).toFixed(2)}MB → 新产物 ${(src.length / 1024 / 1024).toFixed(2)}MB`);

console.log(`\n结果: ${pass} 通过, ${fail} 失败`);
process.exit(fail ? 1 : 0);
