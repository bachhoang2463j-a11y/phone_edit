# 项目技术规范与设计目标 (SPEC.md)

## 1. 项目定位与边界
* **项目名称**：Improved Phone Shadow（手机改进Shadow）
* **定位**：SillyTavern（酒馆助手）的独立外置手机界面增强插件，通过 Shadow DOM 挂载至酒馆宿主环境。
* **核心目标**：
  1. 维护可构建、可编辑的多文件源码工程（`src/`），由 vite 构建为单文件 ESM 产物部署，运行行为与作者 8.0 bundle 保持一致。（2026-10-31 源码还原后修订；作者已离开社区且无源码，本项目长期接管）
  2. 在绘图/生图模块中集成本地 ComfyUI，并修复配置保存后的界面卡死。
  3. 保留原版全部子应用生态；Vue 模板逆向（render 函数 → .vue SFC）按需渐进进行，不设强制期限。

## 2. 架构设计与技术栈
* **执行形态**：vite 构建的单文件 ESM bundle（`dist/phone_index.js`，部署至酒馆 `public/scripts/`）
* **源码工程**：`src/`——154 个 webpack 模块（`src/modules/*.js`）+ 原版 webpack 运行时（`src/webpack-runtime.js`）+ 入口内联代码（`src/index.js`）；模块 id → 工厂映射由 `src/module-table.js` 自动维护
* **提取工具**：`scripts/extract_modules.mjs`（AST 精确切分），`scripts/rename_semantic.mjs`（服务层语义重命名）；旧文本级补丁 P1-P41 的语义已全部合并进源码，`scripts/patch_comfyui.cjs` 仅作历史存档
* **依赖变更**：uuid 由 CDN 动态 import 改为 npm 打包内置
* **状态持久化**：
  * 本地设置：`localStorage` (`phone_novelai_config`, `phone_api_config`, `phone_presets`)
  * 剧情状态：SillyTavern 宿主角色变量 (`phone_data`)
  * 手机内容块：三种模式可切换（P34-P41）——聊天隐藏变量 `$phone_blocks`（默认，不写楼层、不进提示词）、追加到最后楼层、新建楼层
* **宿主挂载**：通过 Shadow DOM 隔离 CSS，避免与酒馆宿主样式产生命名冲突。

## 3. ComfyUI 生图接入规范
* **协议与通信**：
  * 任务提交：`POST /prompt`（带 `workflow_json` 与 `client_id`）
  * 状态监听：轮询 `GET /history/{prompt_id}`
  * 图像获取：`GET /view?filename=...&type=output`（自动通过 FileReader 转换为 Base64 `dataUrl`）
* **节点映射设计**：
  * 正向提示词节点：默认节点 `6` (CLIPTextEncode)
  * 反向提示词节点：默认节点 `7` (CLIPTextEncode)
  * 采样器/种子节点：默认节点 `3` (KSampler，生图前自动注入随机 Seed)
  * 模型选择：自动拉取 `/object_info/CheckpointLoaderSimple` 支持在线选择模型。
* **边界与约束**：
  * 本机访问可使用 `127.0.0.1:8188`；局域网手机访问必须改用电脑 LAN IP，不能使用手机自身的 `127.0.0.1`。
  * ComfyUI 必须监听局域网并允许跨域，例如：`--listen 0.0.0.0 --enable-cors-header "*"`。
  * 运行时所有生图入口必须将 `comfyui` 映射到 `cfg.comfyui`，且只校验 URL，不要求 API Key。

## 4. 验收标准
1. **构建可重现**：`npx vite build` 从 `src/` 稳定产出 `dist/phone_index.js`；三件套全绿——`node tests/validate.cjs`（编译门禁 + 语义回归断言）、`node tests/sandbox.test.cjs`（模块级行为）、`node tests/gate.cjs`（产物门禁）。
2. **生图模式切换与持久化**：在设置页可正常切换 NovelAI / OpenAI / Gemini / ComfyUI，配置正确存入 `phone_novelai_config` 且重启不丢失。
3. **生图可用性**：相机、动态、直播中触发生图时，正确向目标后端发起请求并将生成的图片插入相册/帖子/聊天。
4. **预置资源可控载入**：启动不弹出资源导入窗口、不自动导入正则；设置页提供基础数据、表情包、默认正则三个勾选项，并将角色资源合并后一次写入 `phone_data` / `phone_stickers`。
5. **真机冒烟**：手机启动、消息/私聊、设置页、ComfyUI 配置页在酒馆实机环境正常渲染。
