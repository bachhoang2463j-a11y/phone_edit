# 项目技术规范与设计目标 (SPEC.md)

## 1. 项目定位与边界
* **项目名称**：Improved Phone Shadow（手机改进Shadow）
* **定位**：SillyTavern（酒馆助手）的独立外置手机界面增强插件，通过 Shadow DOM 挂载至酒馆宿主环境。
* **核心目标**：
  1. 保持作者 8.0 bundle 的完整运行行为，仅通过可回滚的文本级补丁进行局部修复。
  2. 在绘图/生图模块中集成本地 ComfyUI，并修复配置保存后的界面卡死。
  3. 保留原版全部子应用生态；不再以重建完整 Vue 源码工程作为交付目标。

## 2. 架构设计与技术栈
* **执行形态**：作者 8.0 Webpack/ES Module 单文件 bundle
* **补丁工具**：`scripts/patch_comfyui.cjs`，每个替换必须唯一命中
* **状态持久化**：
  * 本地设置：`localStorage` (`phone_novelai_config`, `phone_api_config`, `phone_presets`)
  * 剧情状态：SillyTavern 宿主角色变量 (`phone_data`)
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
  * 本地 ComfyUI 必须配置允许跨域：`--enable-cors-header "*"`。

## 4. 验收标准
1. **补丁可重现**：由 `phone_index.js` 运行补丁脚本可稳定生成 `phone_index_fixed.js`。
2. **生图模式切换与持久化**：在设置页可正常切换 NovelAI / OpenAI / Gemini / ComfyUI，配置正确存入 `phone_novelai_config` 且重启不丢失。
3. **生图可用性**：相机、动态、直播中触发生图时，正确向目标后端发起请求并将生成的图片插入相册/帖子/聊天。
4. **预置资源可控载入**：启动不弹出资源导入窗口、不自动导入正则；设置页提供基础数据、表情包、默认正则三个勾选项，并将角色资源合并后一次写入 `phone_data` / `phone_stickers`。
