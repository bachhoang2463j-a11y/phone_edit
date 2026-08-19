## [20260820-original-baseline] 2026-08-20 - 统一原版基准文件

- **变更行为**：`tests/validate.cjs` 不再读取已删除的 `phone_index.js.bak`，统一以 `phone_index.js` 作为原版配平基准。
- **对比结果**：`phone_index.js` 与 `phone_index_8.0_original.js` 长度及 SHA256 完全相同，`fc /b` 确认无字节差异；两者均不含 ComfyUI 字段。
- **验证结果**：补丁/渲染回归 30/30，ComfyUI 沙箱测试 23/23。

## [20260820-cf-vmodel] 2026-08-20 - 修复 ComfyUI 输入后 Vue 更新队列失效

- **根因**：六个新增 `v-model` 输入节点错误使用 patch flag `8`，但未提供动态属性列表；首次渲染正常，修改节点 ID 触发重渲染后 Vue patch 中断，导致父级状态虽变为 `null`，页面仍不卸载。
- **变更行为**：将 ComfyUI 的五个 input 和一个 textarea 全部改用 `512` (`NEED_PATCH`)。
- **验证结果**：bundle 语法通过；渲染/补丁回归 30/30；ComfyUI 沙箱测试 23/23。
- **产物**：`phone_index_fixed.js` SHA256 `6B2B57780B0FD20FD9F2B1D2ABAD912FB07411F519ECBA73E99A9722D5E214D8`。

## [20260820-cf-diag] 2026-08-20 - 增加 ComfyUI 保存后返回失效诊断版

- **变更行为**：新增 `scripts/make_debug.cjs`，从当前 `phone_index_fixed.js` 生成 `phone_index_debug.js`，打点节点 ID 更新、保存点击/回调、返回按钮捕获/handler、父级 `onBack` 和全局异常；诊断器只在进入绘图配置组件后挂载，不介入主界面初始化。
- **决策原因**：实机确认只有修改 ComfyUI 节点 ID 后保存才会导致返回失效，需要先区分 DOM 点击、Vue emit、父级状态切换和渲染异常所在层级。
- **验证结果**：诊断产物 `node --check` 通过，且首个代码差异位于 `ImageGenSettings.setup`；SHA256 `8458101AC5E19E8DEA1D582981B9ED5E4921D82AC78837A878B5FA8FB207746A`。

## [20260820-cf-save] 2026-08-20 - 修复 ComfyUI 配置保存后卡死

- **变更行为**：ComfyUI 条件分支增加稳定 `key`，新增表单节点不再使用手工 Vue render-cache 索引；保存时先复制普通配置快照，再通过 `setTimeout` 让出点击事件循环后写入 LocalStorage。
- **涉及文件**：`scripts/patch_comfyui.cjs`、`tests/validate.cjs`、`phone_index_fixed.js`。
- **决策原因**：隔离响应式 Proxy 与保存动作，消除新增缓存槽位和条件分支复用风险，同时保持现有配置格式与刷新后持久化行为。
- **验证结果**：`node --check phone_index_fixed.js` 通过；补丁/回归检查 28/28；ComfyUI 配置与生图沙箱测试 23/23。

## [c9f3b1d-2] 2026-08-18 - 修复实机测试三大 Bug（d 索引冲突/按钮位置/初始化弹窗记忆）

- **变更行为**：
  1. **Bug① 保存卡死**：根因是补丁 P16/P17 复用了 `d[130]-d[137]` 静态节点缓存索引，而原版 ImageGenSettings render 已用到 `d[148]`，导致 Vue 缓存双重赋值、保存重渲染时卡死。修复：P16 改用 `d[149]`，P17 区块迁移到 `d[150]-d[156]`（全部空闲索引，验证各出现 2 次=定义+引用）。
  2. **Bug② ComfyUI 标签难点击**：按钮原插入在第五个（pollinations 后），且 8.0 Home 桌面为多页滑动布局导致标签溢出屏幕。修复：P16 改为插入在 **NovelAI 之前（左侧第一个）**，复用 `format-btn` 样式。
  3. **Bug③ 初始化弹窗反复出现**：该弹窗是 **8.0 自带引导**（boot 判定：有当前 chat 且角色变量 `phone_data` 为空时弹出"未检测到角色卡数据"），确认会覆盖默认数据、跳过不写——**并非回退机制**；弹窗再次出现是因为角色变量空间（type:'character'）读不到旧数据（通常切换了聊天/角色）。修复：新增 P18-P20 三处补丁——判定前检查 localStorage `improved_phone_setup_dismissed` 记忆标记，确认/跳过回调都写 `'1'`，**弹窗只出现一次**（已确认/已跳过的用户不再被干扰，旧数据不受影响）。
  4. 新增 `tests/validate.cjs`：20 个补丁 `to` 文本的语法验证（片段类补丁由沙箱证明）+ 全局配平对比（fixed 未引入 bak 没有的不平衡）。
- **涉及文件**：
  - `D:\Project\phone\scripts\patch_comfyui.cjs`（P16/P17 修正 + 新增 P18-P20）
  - `D:\Project\phone\tests\validate.cjs`（新增）
  - `D:\Project\phone\phone_index_fixed.js`（重新生成，MD5 `b8a5682b`）
  - `D:\SillyTavern\SillyTavern\public\scripts\phone_index.js`（已部署）
- **决策原因**：
  实机复现确认卡死根因是静态节点缓存索引冲突（文本补丁特有风险），而非保存逻辑本身；按钮位置与滑动冲突同源于 8.0 Home 多页布局。初始化弹窗问题验证为 8.0 自带行为后，采用最小侵入的记忆标记方案（不改判定逻辑、不覆盖用户数据）。验证方式升级为"补丁语法单测 + 全局配平 + 沙箱集成"三合一。

## [c9f3b1d] 2026-08-18 - 以作者原版 8.0 为基准移植 ComfyUI 本地生图（17 处文本级补丁）

- **变更行为**：
  1. 确认工作区 `phone_index.js` 已替换为作者原版 8.0（MD5 `79486eef`，4,008,412B），并以 `.bak` 备份。
  2. 编写 `scripts/patch_comfyui.cjs`：对 bundle 做 17 处文本级精确替换（每处断言唯一命中），输出 `phone_index_fixed.js`：
     - **Module 920 配置中心**：`apiFormat` 合法值加入 `comfyui`；默认配置新增 `comfyui` 对象（url 默认 `http://127.0.0.1:8188`、节点 ID 默认 6/7/3、workflowJson 可空）；新增 `sanitizeComfyUi` 深度清洗；`load`/`save` 接入 comfyui 字段；**`saveNovelAiConfig` 升级**：try/catch + `QuotaExceededError` 时剔除 `workflowJson` 降级重写 + 返回 `true/'trimmed'/false` 状态标志（根治原版"保存卡死无反馈"缺陷）。
     - **Module 685 生图引擎**：分发入口 `y()` 新增 `'comfyui'===t.apiFormat` 分支——按 SPEC 协议 `POST /prompt` → 轮询 `/history/{id}`（1s 间隔/120s 超时）→ `GET /view` 转 Base64；workflowJson 空时用内置默认文生图工作流（CheckpointLoaderSimple+CLIPTextEncode×2+KSampler+VAEDecode+SaveImage）；按节点 ID 注入正/负提示词与随机 seed；**不要求 Key**（与 8.0 的 pollinations 一致，仅校验 URL）。
     - **ImageGenSettings 设置页**：script 区 6 处（computed 当前后端、Key getter/setter、格式名、URL 占位、fetchModels 特判、保存函数按返回值给 toastr 反馈、重置函数保留 comfyui url/key）；render 区 2 处（API 格式按钮区新增 ComfyUI 按钮、模型与参数区新增 ComfyUI 配置区块，复用 `d[130]`-`d[137]` 空闲静态节点缓存索引）。
  3. 编写 `tests/extract.cjs`（webpack 模块提取器，基于下一模块标记边界）与 `tests/sandbox.test.cjs`（vm 沙箱单测）：**23 项断言全部通过**——A 组配置往返/配额降级/异常兜底、B 组 ComfyUI 三接口 mock 全链路/自定义工作流注入/非法 JSON 报错/其他后端（openai）兼容/队列直连。
  4. 部署：SillyTavern 现场原版备份为 `phone_index_8.0_original.bak`，替换为补丁版（MD5 `a34ca597` 与工作区产物一致）。
- **涉及文件**：
  - `D:\Project\phone\scripts\patch_comfyui.cjs`（新增）
  - `D:\Project\phone\tests\extract.cjs`、`tests\sandbox.test.cjs`（新增）
  - `D:\Project\phone\phone_index_fixed.js`（产物）、`phone_index.js.bak`（备份）
  - `D:\SillyTavern\SillyTavern\public\scripts\phone_index.js`（已部署）、`phone_index_8.0_original.bak`（现场备份）
- **决策原因**：
  作者 8.0 已删除 ComfyUI 并改为主线 pollinations；用户明确要求以 8.0 为基准移植 ComfyUI（放弃旧版 6.0 第三方补丁）。采用黑盒文本级补丁而非重建 Vue 工程：改动最小、可回滚（双备份）、复用 bundle 内既有 Vue 运行时与样式，避免全量反编译的巨大成本。ComfyUI 无 Key 设计符合用户"不填写 key 不报错"的诉求。

## [a1f8c02] 2026-08-18 - 工作区迁移、全量变量字典提取与三件套初始化

- **变更行为**：
  1. 将工作空间全量迁移至 `D:\Project\phone`。
  2. 逆向提取原工程所有 61 个 Vue 单文件组件及其原版 CSS 样式。
  3. 解构并重构两大核心底层服务：`configService.js`（配置管理）与 `imageGenService.js`（生图引擎）。
  4. 深度整理编写 `VARIABLE_MAP.md`，全面梳理项目中所有压缩变量、存储键名、AI 接口及酒馆交互函数。
  5. 深度排查并编写 `BUG_ANALYSIS.md`，详细记录 ComfyUI 保存卡死与 NovelAI 报错回退的根因与修复思路。
  6. 严格按照 `Coding rule.md` 建立规范三件套（`README.md`、`SPEC.md`、`LOG.md`、`LOG-INDEX.md`）。
- **涉及文件**：
  - `D:\Project\phone\SPEC.md`
  - `D:\Project\phone\README.md`
  - `D:\Project\phone\LOG.md`
  - `D:\Project\phone\LOG-INDEX.md`
  - `D:\Project\phone\VARIABLE_MAP.md`
  - `D:\Project\phone\BUG_ANALYSIS.md`
  - `D:\Project\phone\src\手机改进Shadow\services\configService.js`
  - `D:\Project\phone\src\手机改进Shadow\services\imageGenService.js`
  - `D:\Project\phone\src\手机改进Shadow\apps\...` (61 个 Vue 组件)
- **决策原因**：
  原工程经过 Webpack 压缩，变量混淆严重且缺乏源码工程上下文。通过建立标准三件套与全景变量字典，为后续彻底修复 ComfyUI 保存与生图调度打下透明可维护的坚实基础。
# [2026-08-20] 将初始化资源导入改为设置页显式操作

- 禁用作者 8.0 初始化时的“未检测到角色卡数据”弹窗，避免每次进入角色卡打扰用户。
- 在 `OtherSettings` 设置页增加“预置资源”区块和确认按钮，按需载入当前角色卡的 `phone_data`、`phone_stickers` 与默认正则。
- 新增 P25-P27：统一资源加载器、设置动作、设置页按钮；P18 改为不可达条件，移除无效的 P19/P20 记忆标记补丁。
- 验证：`tests/validate.cjs` 34 项通过，`tests/sandbox.test.cjs` 23 项通过，`node --check phone_index_fixed.js` 通过。

# [2026-08-20] 修复预置资源只保留表情包并补全三项勾选 UI

- 根因：基础数据与表情包原先分别调用 `getVariables()` / `replaceVariables()`；第二次角色变量整对象写回可能使用旧快照，覆盖第一次写入的 `phone_data`。
- P25 改为在同一份角色变量对象中同时设置 `phone_data` 和 `phone_stickers`，只执行一次 `replaceVariables()`。
- P26/P27 增加“默认数据、默认表情包、默认正则”三个独立开关，移除浏览器原生确认框和成功 toast；成功后静默刷新以重新载入手机状态。
- P28 隐藏“外置小手机已就绪”通知；P29 禁止启动时自动导入默认正则，使勾选项真正按需执行。
- 验证：`tests/validate.cjs` 38 项、`tests/sandbox.test.cjs` 23 项全部通过，完整 bundle 语法检查通过。
- 实机验收：用户确认默认头像、背景、表情包均能正确载入，三个勾选项和静默刷新生效，本轮修复有效。
