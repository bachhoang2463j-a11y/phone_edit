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
## [20260820-comfyui-lan-entry] 2026-08-20 - 修复手机端局域网 ComfyUI 被错误判定为 NovelAI

- **现象**：手机端配置电脑 LAN 地址（如 `http://192.168.110.83:8188`）后，生图入口仍提示填写 NovelAI URL/API；同一手机上的其他插件可正常访问该 ComfyUI。
- **根因**：Module 685 已支持 ComfyUI 和局域网 URL，但私聊、动态、直播、相机等七处运行时入口仍只有 NovelAI/OpenAI/Gemini/Pollinations 映射；`comfyui` 被落回 Pollinations 配置并按 URL+Key 规则拦截。
- **修复**：新增 P30-P32，统一补齐 ComfyUI 标签、`cfg.comfyui` 配置选择和仅 URL 校验；其他后端校验不变。
- **验证**：补丁/渲染回归 54/54、ComfyUI 沙箱测试 23/23、完整 bundle 语法检查通过。
# [2026-09-12] 永久隐藏三个辅助脚本按钮

- **现象**：用户在酒馆助手脚本管理界面删除【删最后一块】【复位】【刷新】后，打开角色卡按钮即复原。
- **根因**：bundle 尾部启动时无条件执行 `replaceScriptButtons` 注册四个按钮；`CHAT_CHANGED` 监听在切换角色卡后整页重载并重新注册，运行时手动删除必然被覆盖。
- **修复**：新增 P33，将三个辅助按钮 `visible:!0` 改为 `visible:!1`（保留数组项以维持 `getButtonEvent` 绑定，避免中断 bootstrap 初始化），【手机】按钮保持可见。
- **验证**：`tests/validate.cjs` 55 项、`tests/sandbox.test.cjs` 23 项全部通过，`node --check phone_index_fixed.js` 通过；产物已部署至 `D:\SillyTavern\SillyTavern\public\scripts\phone_index.js` 并确认补丁生效。
# [2026-09-12] 新增聊天隐藏变量存储模式（P34-P41）

- **动机**：用户不希望手机内容写入最后一楼或新楼层（污染正文、依赖折叠正则），要求改为存入隐藏的聊天变量并设为默认，且与原有两种楼层模式可切换；主对话 AI 不需要看到手机内容块。
- **方案**：写点分散 15+ 处且 bundle 混淆，改为启动尾部注入兼容层（P41）：接管 getChatMessages/setChatMessages/createChatMessages/deleteChatMessages 四个全局 API。写入含手机块时重定向到聊天变量 `$phone_blocks`（type:'chat'，宏忽略 `$` 前缀键，不进提示词）；范围查询在真实结果末尾拼接虚拟楼层（message_id 自 1e9 起），现有正则解析零改动；哨兵 id 支持定点更新与删除；旧楼层数据就地更新透传、兼容读取；无块消息（跳转时间等）透传建楼；模式关闭全透传；安装失败回退楼层模式。
- **设置**：P34-P36 在设置默认值/加载合并/快照三处新增 `useChatVariables:!0`（默认开）；P37-P39 在 OtherSettings 增加 `ucv` ref 与保存 handler；P40 在"追加到最后楼层"开关前渲染"内容存入聊天隐藏变量"开关（不占用 n[] 缓存槽位）。
- **验证**：`tests/validate.cjs` 67 项（新增兼容层注入、$phone_blocks 键、三处合并、新开关等 6 项断言）、`tests/sandbox.test.cjs` 45 项（新增 C 组 22 项：重定向、虚拟楼层拼接、哨兵单查/更新/删除、旧数据透传、无块透传、模式关闭、幂等安装）全部通过，`node --check` 通过；产物已部署至 `D:\SillyTavern\SillyTavern\public\scripts\phone_index.js`。
- **已知边界**：CHAT_CHANGED 切卡整页重载与存储方式无关、保持不变；Ab隐藏手机1/2 正则在变量模式下不再需要；手机自身 AI 调用的历史上下文仍含手机块（getChatMessages 兼容层拼接）。
# [2026-09-12] 修复 P40 右括号错误导致整包解析失败（手机不显示）

- **现象**：P34-P41 部署后点【手机】按钮无反应。排障（chrome-devtools）确认：手机模块在 Chrome 抛 `Uncaught SyntaxError: Unexpected token ')'` 整体解析失败——按钮仅为酒馆助手持久化残留，事件绑定未生效。
- **根因**：P40 注入的"聊天隐藏变量"开关渲染片段结尾 `null,-1))])` 抄自原版 `n[20]||(n[20]=...)` 缓存结构的收尾，但新版无该缓存包装，多出一个 `)` 且少一个 `]`，在 label 子元素数组未闭合处关闭外层括号。
- **校验漏洞**（两处均未拦截）：`node --check` 对本工程单行 ESM 大文件假阴性；`validate.cjs` 配平扫描在 byte 22565 处因原版正则字面量误判提前 break，扫描不到 370 万字节后的插入点。
- **修复**：P40 收尾改为 `null,-1)])])`；`validate.cjs` 新增 2.5 节"剥离 import 后 new Function 全 bundle 编译检查"（原版基准已验证可通过、无误报）作为可靠语法门禁；README 验证命令同步说明。
- **验证**：validate 68 项、沙箱 45 项通过；实机（调试 Chrome）验证：模块正常加载、`[PhoneVarStorage] 兼容层已安装` 日志出现、Vue 应用挂载（improved-phone-shadow-host 宿主出现）、点击【手机】界面完整渲染、包装后的 getChatMessages 范围/哨兵查询行为正确、与既有聊天变量键（$mms_roster 等）共存无冲突。

## [20261031-source-restore] 2026-10-31 - 源码还原一期：4MB 压缩 bundle 重建为可构建多文件工程

- **背景**：作者已离开社区（授权自由修改分发），长期接管需可编辑源码；原"单行 bundle + 文本级补丁"工作流退役。
- **变更行为**：
  1. `scripts/extract_modules.mjs`：@babel/parser 精确切分 `phone_index_fixed.js`（结构：uuid import → 154 模块表 2.55MB → webpack 运行时 → 入口内联 1.33MB → bootstrap IIFE），共享顶层绑定作用域安全重命名（`e→uuidV4`、`a→__webpackRequire__`、`n/t→表/缓存`），产出 `src/`（154 模块 + 运行时 + module-table + index）。直接以 fixed 为基线，P1-P41 补丁语义自动并入源码，P41 标记注释事后恢复。
  2. vite 非 lib 模式构建单文件 ESM（入口加 `export {}` 防 rolldown CJS 壳）；uuid 改 npm 内置，去除 jsdelivr CDN 运行时依赖。
  3. prettier 全量格式化；`scripts/rename_semantic.mjs` 语义重命名 52 项（920 共 27 项、685 共 20 项、入口 y5/b5/Yl/Q_/r5）——**核对中发现 VARIABLE_MAP §2.1/§2.2 多处映射与当前代码错位（如 685 的 y 实为 generateNovelAiImage 而非 isProcessingQueue），已按 t.d 导出表+函数体逐条修正**。
  4. 测试套件适配：sandbox 45 项改由 `extractModuleFromSrc` 读 src 模块；validate 重写为 v2（dist 编译门禁 + 语义回归断言空白不敏感化 + 运行时绑定解析检查）；gate 9 项。
  5. IAB 实机冒烟通过：手机启动/消息列表/设置页/ComfyUI 配置页（节点 ID 等字段齐全）。**冒烟抓到真 bug：运行时缓存声明 `__webpackCache` 与重命名后引用 `__webpackCache__` 错位 → new Function 编译门禁无感、实机 ReferenceError**，已修复并加绑定解析检查防回归。
- **产物**：`dist/phone_index.js` 已部署至酒馆；源码含 prettier 3 默认 `trailingComma:"all"` 的尾逗号（函数调用尾逗号需 ES2017，原代码已用 `?.`/`catch{}`，运行环境无兼容问题）。
- **遗留**：UI 仍为 render 函数形态（可编辑），模板逆向按需渐进；VARIABLE_MAP 的 5849/5756 对象属性（`V_.kQ` 等）未重命名（跨模块属性追踪留二期）。

## [20261031-phase2-social] 2026-10-31 - 二期：论坛/动态头像跳私聊携带上下文 + 空间页人设生成

- **调研结论**：三功能大半机制已存在——地图页"跳转私聊"（src/index.js:32287 附近）、浏览器分享的 find-or-create 会话 + pendingShareMessage 注入（5565 附近）、ChatDetail 点头像进空间页（showProfile）与空间动态 AI 生成（fetchDynamicHomeDataFromAi 刷新按钮）。动态"详情"实为帖子卡片内联评论，无独立视图；论坛帖子无头像节点（作者名即入口）。
- **变更行为**：
  1. store 新增顶层 `openPrivateChatWith(name, sharePayload)`：合并两处既有跳转逻辑，无会话时按 phone_data 角色新建；`forumJumpWithPost(post, comment)` 组装帖子上下文（含回复扁平化）。
  2. 动态首页 `se()` 改为携带帖子正文+评论跳私聊（原"打开空间页"入口由私聊头像承接）；论坛首页/ForumPost 作者名加 onClick（withModifiers stop 防冒泡），上下文以 browser-share 消息注入会话，AI 私聊上下文自然可见。
  3. 模块 112 新增 `fetchCharacterProfileFromAi`：复用 plotCharacters 格式指导生成单人设，解析 `<plot_characters>` 返回首个角色。
  4. Profile 空间页新增人设卡片（render 函数 + 内联样式）：身份/外观/性格/经历/关系分区，「AI 生成/重新生成」手动按钮，结果持久化到 `phone_data.characters[].profile`。
  5. 引导兜底：脚本先于聊天恢复加载时（initial chat_id 为空）`initPhone` 被跳过且 CHAT_CHANGED 自愈因"同 id skip reload"失灵（IAB 实测必现，作者原版时序缺陷）——新增轮询等聊天就绪后重载。
- **事故与教训**：
  1. A/B 定责实验（排除二期回归）用 `git checkout <commit> -- src/` 往返，**抹掉了未提交的人设编辑**；且 `node tests/validate.cjs | tail` 管道吞掉退出码导致带病提交。重做编辑后 amend 修正；validate 的入口函数声明检查（+4 项）即为该事故的防回归产物。
  2. IAB 冒烟曾在真实角色卡上 `/go` 模糊匹配，命中同名另一张卡新建了 7KB 空聊天（用户 253 楼完整聊天在 深夜咖啡厅1 卡目录下完好未动）。此后停止在真实聊天上做模糊操作，改用测试卡+合成角色。
- **验证**：validate 34 项、sandbox 45 项、gate 9 项全过；IAB 实机确认手机挂载/消息页/设置页正常。论坛/动态点击与人设卡片渲染因 IAB 会话中 TavernHelper 按钮容器退化未走完 UI 全链路，逻辑层已由静态断言覆盖，待用户实机复核。
- **产物**：`368e4c1`（含 17afe91），dist 已部署酒馆。

## [20261031-avatar-richness] 2026-10-31 - 头像丰富度：DiceBear 多风格兜底头像

- **背景**：AI 生成的角色大多无专设头像，兜底随机池仅 6 张内置图（5849 的 I1），名字 hash 取模导致角色一多大量撞头像。用户需求：开源头像库、多风格混搭、"像真人网友"（动漫/卡通/像素/机器人等网友常用风，非真人照片）。
- **变更行为**：模块 2213 的 `p()` 兜底函数重写——DiceBear（api.dicebear.com，开源头像库）14 种画风按角色名 hash 确定性生成（同名恒定、异名不同图），并与 `phone_data.randomAvatars` 按 hash 混用（约 1/4 走池、3/4 走生成）。生效范围覆盖动态/论坛/私聊/群聊/通话/空间页全部 `wH` 解析链；用户手动指定的头像仍最优先。
- **可达性实测**：api.dicebear.com 正常返回 SVG；source.boringavatars.com 证书过期排除。
- **沙箱骨架修复**（D 组测试连带暴露的三个预置缺陷）：①`buildFnFrom` 正则只认三参工厂（7856 等单参垫片无法加载）；②`getModule` 与 `requireModule` 共用缓存 Map 但值形态不同，依赖链模块（2213→5849）取到 undefined；③`t.n` 语义与真实 webpack 相反（CJS 应返回模块本身）；补 `YAML`/`Vue`/`_` 全局垫片。
- **验证**：sandbox 51 项（新增 D 组 6 项）、validate 34 项、gate 9 项全过；dist 已部署。
- **风险**：DiceBear 为运行时 CDN 依赖（当前网络实测可达）；不可达时生成图显示为空，池图（1/4 概率）与手动指定头像不受影响。

## [20261031-avatar-inline] 2026-10-31 - 头像兜底 DiceBear 内联本地化（去 CDN 依赖）

- **决策依据（实测）**：桌面 Node 单头像渲染 0.111ms，100 头像视图（30 唯一名带缓存）2.71ms——6 Gen 1 级按 5-10 倍折算仍为一次性几十 ms，运行时无感知。体积代价：+572KB raw / +160KB gzip（裁掉最重的 notionists/adventurer/open-peeps/lorelei 四包后，10 风格），首载解析一次性 +约 150-300ms。
- **变更行为**：
  1. 模块 2213 顶部 import @dicebear/core + 10 个风格包（avataaars/big-smile/bottts/croodles/fun-emoji/micah/miniavs/personas/pixel-art/thumbs），`p()` 兜底改为本地 `createAvatar(...).toDataUri()`，按名字确定性生成 + Map 缓存（每名仅生成一次）；池混用逻辑不变（约 1/4 走 randomAvatars）。
  2. 抛弃 api.dicebear.com 运行时 CDN 依赖，头像零外部请求（dataUri 内联）。
  3. tests/extract.cjs 支持"注释+import+export default"形态的模块文件；沙箱提供 createAvatar/风格对象垫片，D 组断言改为 dataUri 形态（D2 增加缓存只生成一次断言、D5 增加丰富度断言）。
- **验证**：sandbox 50 项、validate 34 项、gate 9 项全过；dist（4,957,785 B）已部署。
- **注意**：本次实施中发现并纠正了一次 stash 往返差点覆盖未提交编辑的操作（提交后所有检出往返均安全）。
