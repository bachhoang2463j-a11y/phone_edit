# 手机改进Shadow (Improved Phone Shadow)

SillyTavern（酒馆助手）外置手机插件工程，提供完整的模拟手机交互界面（聊天、动态、直播、论坛、邮箱、相机、音乐等），现已支持本地 ComfyUI 及多平台 AI 生图。

---

## 一、 当前工程结构 (现状)

```text
D:/Project/phone/
├── Coding rule.md                 # Agent 协作与规范准则
├── SPEC.md                        # 当前真实边界与验收标准
├── README.md                      # 项目现状、使用方式与功能说明
├── LOG.md                         # 施工历史与决策记录
├── LOG-INDEX.md                   # 施工日志索引
├── VARIABLE_MAP.md                # 压缩变量、函数与资源映射（部分条目已被语义重命名取代）
├── BUG_ANALYSIS.md                # ComfyUI 保存卡死排查记录
├── src/                           # 还原后的可编辑源码工程（2026-10-31 起）
│   ├── index.js                   # 入口（原 bundle 顶层内联代码，P1-P41 语义已合并）
│   ├── webpack-runtime.js         # 原版 webpack 运行时（共享绑定已重命名）
│   ├── module-table.js            # 模块 id → 工厂映射（脚本自动生成）
│   └── modules/                   # 154 个 webpack 模块（920-configService / 685-imageGenService 等已语义命名）
├── vite.config.mjs                # 单入口单文件 ESM 构建配置
├── dist/phone_index.js            # 构建产物，部署此文件
├── scripts/
│   ├── extract_modules.mjs        # AST 模块切分（从 fixed bundle 重建 src/）
│   ├── rename_semantic.mjs        # 服务层语义重命名（经代码核实）
│   └── patch_comfyui.cjs          # 旧文本级补丁生成器（历史存档，语义已并入 src/）
├── tests/                         # validate.cjs + sandbox.test.cjs + gate.cjs + extract.cjs
├── phone_index.js                 # 作者 8.0 原版基准
└── phone_index_8.0_original.js    # 作者 8.0 原始文件副本
```

---

## 二、 当前能力与已完成工作

1. **原版手机功能保留**：聊天、通话、动态、论坛、直播、地图、音乐、日历、日记、邮箱、浏览器、相机等应用继续由作者 bundle 提供。
2. **ComfyUI 本地生图集成**：
   * 完成 ComfyUI API 通信协议实现（任务提交、轮询等待、Base64 转换）。
   * 支持免 Key 本地直连与模型列表自动拉取。
3. **角色卡数据与资源**：手机内容直存酒馆变量，支持用户/角色数据、背景、头像、表情包、音乐、地图、字体等随角色卡导入导出；设置页可手动载入内置预置资源。
4. **文档与变量映射**：`VARIABLE_MAP.md` 记录后续手术式修改所需的压缩变量、函数、模块和写入位置。

---

## 三、 本地导入与使用方式

1. 构建：`npx vite build`，产物为 `dist/phone_index.js`
2. 将产物放入 SillyTavern 本地目录：
   `D:\SillyTavern\SillyTavern\public\scripts\phone_index.js`
3. 在酒馆助手的脚本编辑框中导入：
   ```javascript
   import '/scripts/phone_index.js'
   ```

---

## 四、当前维护边界与手动载入预置资源

2026-10-31 起本仓库恢复为**可构建的源码工程**：作者已离开社区且无源码，经其授权自由修改与分发。原先"4MB 单行压缩 bundle + 文本级补丁"的工作流已退役——P1-P41 全部 59 处补丁的语义以源码形式合并进 `src/`（P41 兼容层保留 `/*__PHONE_VAR_STORAGE_START/END__*/` 标记注释作为锚点）。日常修改直接编辑 `src/` 下对应模块，然后 `npx vite build` 重新构建并部署 `dist/phone_index.js`。服务层已做语义命名（如 `sanitizeNovelAi`、`taskQueue`、`generateNovelAiImage`），命名依据见 `scripts/rename_semantic.mjs`；UI 组件仍为编译后的 render 函数形态（可编辑），按需渐进逆向为 .vue 模板。

初始化时不再弹出"未检测到角色卡数据"资源导入窗口，也不再自动导入默认正则。需要载入新角色卡资源时，进入手机设置的"其他设置"→"预置资源"，分别勾选"加载默认数据""加载默认表情包""导入默认正则"，再点击"载入所选资源"。基础数据和表情包使用同一份角色变量对象一次性写回，避免后一次保存覆盖前一次结果；成功后静默刷新，不显示浏览器确认框、成功 toast 或"外置小手机已就绪"通知。

该流程已于 2026-08-20 完成 SillyTavern 实机验证：默认头像、背景和表情包均可正确载入，三个选项可独立控制，静默刷新及通知隐藏行为有效。

资源写入位置：

* 基础资源写入角色变量 `phone_data`，字段来源为 `r5.kQ`、`r5.hg`、`r5.I1`、`r5.sQ`、`r5.Og`、`r5.Tj`、`r5.TN`、`r5.lG`。
* 表情包写入角色变量 `phone_stickers`，来源为 `Yl`。
* 默认正则导入函数为 `b5()`，统一入口为 `globalThis.__improvedPhoneLoadPresetResources`。
* 初始化函数为 `y5()`；旧弹窗条件已通过 P18 固定为不可达，资源导入改由设置页动作调用。

ComfyUI 配置和保存逻辑仍位于压缩模块 920，生图分发位于模块 685。ComfyUI 的正向提示词、反向提示词和采样器节点 ID 默认分别为 `6`、`7`、`3`。P21-P24 修复了 Vue 编译缓存槽位和 v-model patch flag，P6/P13 处理保存异常及工作流 JSON 超出 localStorage 配额的降级情况。

酒馆助手脚本按钮区仅保留【手机】按钮；P33 将【删最后一块】【复位】【刷新】三个辅助按钮设为 `visible:!1` 永久隐藏。脚本尾部的 `CHAT_CHANGED` 监听会在切换角色卡后整页重载并重新注册按钮，因此在管理界面手动删除会被覆盖，只能通过补丁修改。

### 聊天隐藏变量存储模式（P34-P41）

手机内容块（`<chat_history>`/`<phone_module>`）的存储有三种模式，在手机设置的"其他设置"页切换：

1. **内容存入聊天隐藏变量**（P34 起默认开启）：P41 在启动时注入兼容层，接管 `getChatMessages`/`setChatMessages`/`createChatMessages`/`deleteChatMessages` 四个 API。手机块保存为聊天变量 `$phone_blocks`（`type:'chat'`，随聊天文件导出），完全不写入楼层，正文零污染；读取时兼容层把变量块以虚拟楼层（message_id 从 1e9 起）拼回给现有解析逻辑，15+ 个读写点零改动。`$` 前缀使酒馆助手宏忽略该键，主对话提示词彻底不含手机内容（省 token）；手机自身 AI 调用的历史上下文仍能看到这些块。旧聊天中已写入楼层的块继续兼容读取，不迁移不删除。
2. **追加到最后楼层** / **新建楼层**：与作者原版行为一致；关闭"聊天隐藏变量"开关后立即恢复。

模式开关每次调用时实时读取 `localStorage`，切换即时生效无需重载。兼容层安装失败（如 API 不可重写）时自动回退楼层模式并输出 `console.warn`。Ab隐藏手机1/2 两个折叠正则在变量模式下不再需要（正则导入本就是设置页手动操作）。

局域网手机端可将 ComfyUI URL 填为电脑的局域网地址，例如 `http://192.168.110.83:8188`。P30-P32 已使私聊、动态、直播、相机等全部运行时生图入口识别 `comfyui`，读取 `cfg.comfyui`，并仅校验 URL、不要求 API Key。电脑端 ComfyUI 仍需监听局域网地址并允许跨域，例如使用 `--listen 0.0.0.0 --enable-cors-header "*"`；同时需允许 Windows 防火墙中的 8188 端口访问。

验证命令：

```text
npx vite build                    # 构建 dist/phone_index.js
node tests/validate.cjs           # dist 编译门禁 + 30 项语义回归断言 + 工程结构
node tests/sandbox.test.cjs       # 45 项模块级行为测试（920/685/P41 兼容层）
node tests/gate.cjs               # 产物快速门禁
```

注意：`node --check` 对单行 ESM 大文件存在假阴性；`tests/validate.cjs` 的全量编译与 `webpack 运行时无未声明标识符` 绑定解析检查才是可靠门禁（后者源于一次真实事故：运行时缓存变量名手误，编译门禁无感，IAB 实机执行才暴露）。
