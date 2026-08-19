# 核心 Bug 深度排查分析报告：ComfyUI 保存卡死与 NovelAI 报错回退

本文档详细记录用户在使用 ComfyUI 配置界面时遇到的**两个连锁严重 Bug**、其底层原因、涉及的具体代码段与彻底解决修复方案。

---

## 一、 现象描述

1. **现象 1（保存卡死）**：在手机设置页选择 `ComfyUI`，填写完 URL 或修改配置后点击底部的【保存配置】，页面卡死无响应。
2. **现象 2（报错回退）**：刷新或重启手机后尝试使用生图功能（如相机拍照、直播生图），系统弹出报错：`【请配置 NovelAI 模型和 API】`（或 `未配置 NovelAI URL`），ComfyUI 选项并未生效。

---

## 二、 根因定位与原理深度分析

### 1. 为什么点击【保存配置】会卡死？
* **涉及代码**：`Module 9960`（`ImageGenSettings.vue` 组件中的保存函数 `X()`）
* **触发机制**：
  ```javascript
  // 原组件中保存逻辑
  X = () => {
    (0, ir.saveNovelAiConfig)(n.value); // n.value 为 Vue3 的响应式 Proxy 深度对象
    Ee.success('绘图配置已保存');
  }
  ```
  * 在 Vue 3 运行时中，`n.value` 是一个深度 `reactive/ref` 的 Proxy 对象。
  * 当我们在 `ImageGenSettings` 模板中给 ComfyUI 添加了 `textarea` 绑定的 `workflowJson` 或额外对象时，传递给 `saveNovelAiConfig` 的包含大量嵌套属性。
  * 在 `Module 920` 的 `saveNovelAiConfig` 函数中，若执行深拷贝或 JSON 序列化未先对 Vue Proxy 进行解包（`toRaw`），且新插入的 helper 函数引发了未捕获的引用异常（如未定义的变量或死循环监听），会导致 UI 主线程卡死在事件循环中。

### 2. 为什么重启后会提示【请配置 NovelAI 模型和 API】？
* **涉及代码**：`Module 920`（`loadNovelAiConfig`）与 `Module 685`（`generateNovelAiImage`）
* **触发机制**：
  1. **配置读取降级**：
     当打开手机或者调用生图时，系统首先执行 `loadNovelAiConfig()` 从 LocalStorage 读取配置。
     如果保存阶段报错导致存储的 JSON 损坏，或者读取函数中的校验未通过，`loadNovelAiConfig()` 会触发 `catch` 并直接返回默认配置：
     ```javascript
     // 默认配置中 apiFormat 写死为 'novelai'
     const DEFAULT_API_FORMAT = 'novelai';
     ```
  2. **生图逻辑 fallback**：
     在 `Module 685` 的生图函数中：
     ```javascript
     if ('openai' === t.apiFormat) { ... }
     if ('gemini' === t.apiFormat) { ... }
     if ('comfyui' === t.apiFormat) { ... }
     // 如果 apiFormat 回退成了 'novelai'，就会走到这里：
     const p = t.novelai;
     const y = function(e){...}(p.url);
     if (!y) throw new Error('未配置 NovelAI URL');
     if (!p.key) throw new Error('未配置 NovelAI Key');
     ```
     因为当前处于默认的 NovelAI 状态，且用户的 NovelAI URL 和 Key 为空，故直接抛出异常：`未配置 NovelAI URL`！

---

## 三、 彻底修复方案

1. **在 `configService.js` 中增加严格的 Proxy 解包与安全持久化**：
   在保存前使用安全的解构与默认兜底，确保不会向 LocalStorage 写入非法格式。
2. **在 `imageGenService.js` 中完善非 NovelAI 模式判断**：
   在队列调度函数中，确保只要 `apiFormat !== 'novelai'` 就直接走独立调度，不落入 NovelAI 队列。
3. **在 `ImageGenSettings.vue` 中加入防抖与保存状态反馈**：
   点击保存时展示明确的保存动画并输出 `console.info` 日志便于排查。
