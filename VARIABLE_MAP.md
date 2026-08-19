# 酒馆助手手机插件（Improved Phone Shadow）核心变量与函数全景字典

本文档深度剖析该插件（`phone_index.js` / Webpack Bundle）中所有混淆/压缩变量的真实语义、数据结构以及涉及的业务函数。

---

## 目录
1. [全局与本地持久化存储键 (Storage Keys)](#1-全局与本地持久化存储键)
2. [绘图与生图配置模块 (Module 920 & 685)](#2-绘图与生图配置模块)
3. [AI 业务交互服务模块 (Module 112)](#3-ai-业务交互服务模块)
4. [默认角色、壁纸与多媒体数据 (Module 5849 & 5756)](#4-默认角色壁纸与多媒体数据)
5. [SillyTavern 酒馆宿主交互 API](#5-sillytavern-酒馆宿主交互-api)
6. [Vue 核心状态与 Store](#6-vue-核心状态与-store)

---

## 1. 全局与本地持久化存储键

| 键名 (Key) | 类型 | 作用与业务说明 |
| :--- | :--- | :--- |
| `phone_novelai_config` | JSON 字符串 | 存储生图配置（包含 `apiFormat`、`novelai`、`openai`、`gemini`、`comfyui` 各参数）。 |
| `phone_api_config` | JSON 字符串 | 手机主 AI 模型 API 配置（支持主备双 API、视图分流映射 `viewApiMap`）。 |
| `phone_presets` | JSON 字符串 | 手机 Prompt 预设列表与当前激活的预设 ID (`activePresetId`)。 |
| `phone_other_settings` | JSON 字符串 | 格式指导（`formatGuide`）与历史消息配置（`historyConfig`）。 |
| `phone_drag_position` | JSON 字符串 | 手机窗口在屏幕上的拖拽坐标位置。 |
| `phone_stickers` | JSON 字符串 | 自定义表情包库映射字典。 |
| `phone_data` | SillyTavern 变量 | 存储手机内所有角色、群聊、用户资料、背景图库、音乐列表的完整状态树。 |

---

## 2. 绘图与生图配置模块

### 2.1 模块 920 (`configService.js`) — 变量对应表

| 压缩变量 | 还原命名 | 类型 | 实际含义与说明 |
| :--- | :--- | :--- | :--- |
| `a` | `IMAGE_ASPECT_RATIO_OPTIONS` | `Array<string>` | 支持的图片比例列表：`['auto', '1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']` |
| `r` | `GEMINI_IMAGE_SIZE_OPTIONS` | `Array<string>` | Gemini 分辨率选项：`['auto', '1K', '2K', '4K']` |
| `o` | `STORAGE_KEY` | `string` | 本地存储键 `'phone_novelai_config'` |
| `i` | `DEFAULT_API_FORMAT` | `string` | 默认生图格式 `'novelai'` |
| `s` | `DEFAULT_PROMPT_MODE` | `string` | 默认提示词模式 `'none'`（可选 `'none' | 'tags' | 'natural'`） |
| `l` | `DEFAULT_NOVELAI_CONFIG` | `Object` | NovelAI 默认参数（包含 `model`, `width`, `height`, `steps`, `cfg`, `sampler`, `seed` 等） |
| `c` | `DEFAULT_OPENAI_CONFIG` | `Object` | OpenAI 兼容接口默认参数（`url`, `key`, `model`, `aspectRatio`） |
| `A` | `DEFAULT_GEMINI_CONFIG` | `Object` | Gemini 原生生图默认参数（`url`, `key`, `model`, `imageSize`） |
| `_CF` | `DEFAULT_COMFYUI_CONFIG` | `Object` | ComfyUI 本地生图配置（`url`, `workflowJson`, 节点 ID 映射等） |
| `d()` | `getDefaultNovelAiConfig()` | `Function` | 返回全新的默认配置完整对象副本 |
| `f(e, n)` | `validateApiFormat()` | `Function` | 校验生图后端格式（有效值：`novelai`, `openai`, `gemini`, `comfyui`） |
| `b(e, n)` | `validatePromptMode()` | `Function` | 校验提示词模式（有效值：`tags`, `natural`） |
| `h(e, n)` | `sanitizeNovelAi()` | `Function` | 深度清洗并填充 NovelAI 配置默认值 |
| `B(e, n)` | `sanitizeOpenAi()` | `Function` | 深度清洗并填充 OpenAI 配置默认值 |
| `y(e, n)` | `sanitizeGemini()` | `Function` | 深度清洗并填充 Gemini 配置默认值 |
| `_h_comfy()` | `sanitizeComfyUi()` | `Function` | 深度清洗并填充 ComfyUI 配置默认值 |
| `k()` | `loadNovelAiConfig()` | `Function` | 从 LocalStorage 解析当前生图配置（带容错降级） |
| `E(e)` | `saveNovelAiConfig()` | `Function` | 将生图配置持久化保存到 LocalStorage |

---

### 2.2 模块 685 (`imageGenService.js`) — 变量与函数对应表

| 压缩变量 / 函数 | 还原命名 | 职责与业务说明 |
| :--- | :--- | :--- |
| `B` | `taskQueue` | `Array<Task>`，NovelAI 任务排队队列 |
| `y` | `isProcessingQueue` | `boolean`，队列是否正在轮询处理中 |
| `u(...e)` | `joinTagPrompts()` | 将多段 Tag 标签用逗号清洗并拼接为一个标准 Tag Prompt |
| `f(...e)` | `joinNaturalPrompts()` | 将多段自然语言提示词按换行拼接 |
| `b(blob)` | `blobToDataUrl()` | 使用 `FileReader` 将二进制 Blob 转换为 Base64 `data:image/...` URL |
| `v(buffer)` | `extractImageFromZip()` | 解析 NovelAI 返回的 ZIP 压缩包字节流，解压出 PNG 图片 |
| `x(json)` | `extractImageFromJson()` | 从 OpenAI / Gemini 返回的 JSON 中深度提取 base64 或 image_url |
| `d(res)` | `parseResponseToImage()` | 通用 HTTP 响应解析器（自动识别 JSON / Image Blob / ZIP） |
| `h(prompt, opt)` | `generateNovelAiImage()` | **核心生图分发入口**：判断 `config.apiFormat` 并发起对应请求 |
| `k(prompt, opt)` | `queueNovelAiImageGeneration()` | **上层调用统一入口**：执行队列管理并返回 Promise |
| `w()` | `clearImageGenerationQueue()` | 清空等待中的生图任务 |
| `E()` | `getImageGenerationQueueLength()` | 获取当前排队中的任务数量 |

---

## 3. AI 业务交互服务模块 (Module 112)

该模块负责手机各子应用的 AI 生成逻辑：

| 导出函数名 | 对应页面 / 功能 | 核心业务流程 |
| :--- | :--- | :--- |
| `callAiWithPreset()` | 统一 AI 交互入口 | 加载当前激活的 Prompt 预设并调用 AI 生成响应 |
| `fetchDynamicDataFromAi()` | 朋友圈 / 动态流 (`Dynamic`) | 请求 AI 生成多条朋友圈动态与各主要角色的评论回复 |
| `postUserDynamic()` | 用户发布朋友圈动态 | 将用户的动态插入列表最前，并驱动 AI 为该动态生成 6~8 条角色回复 |
| `generateDynamicReplyFromAi()` | 动态单帖后续互动 | 用户在动态下发表评论后，驱动其他角色追评 1~3 条 |
| `fetchPrivateChatDataFromAi()` | 角色私聊详情 (`Chat`) | 获取与指定角色的私聊上下文并请求对方生成回复 |
| `fetchGroupChatDataFromAi()` | 群聊消息 (`GroupChat`) | 组装群聊成员设定，请求 AI 生成群内多角色互动消息 |
| `fetchForumDataFromAi()` | 论坛首页 (`Forum`) | 获取/生成论坛帖子列表 |
| `fetchForumPostDataFromAi()` | 论坛帖子详情 (`ForumPost`) | 生成指定帖子的正文及主楼评论列表 |
| `postUserForumPost()` | 用户发布论坛新帖 | 用户发帖后，生成帖子正文并驱动主要角色在楼内跟帖 |
| `fetchLiveDataFromAi()` | 直播间互动 (`LiveRoom`) | 生成指定主播的直播内容、观众弹幕流及状态 |
| `fetchEmailDataFromAi()` | 邮箱应用 (`Email`) | 生成角色发送给用户的邮件列表 |
| `sendUserEmail()` | 用户发送邮件 | 用户向角色发信后，驱动该角色生成回信 |
| `fetchBrowserDataFromAi()` | 手机浏览器 (`Browser`) | 模拟搜索引擎，根据用户输入的关键词生成搜索结果内容 |
| `fetchMapDataFromAi()` | 地图探险 (`Map`) | 生成各地点的状态、在场角色及正在发生的事件 |
| `parseYamlFromResponse()` | 格式解析器 | 容错解析 `<plot_characters>`、`<dynamic>`、`<message>` 等 XML 标签及 YAML 内容 |
| `parseJsonFromResponse()` | 格式解析器 | 从大模型输出中提取并解析 Markdown 代码块中的 JSON |

---

## 4. 默认角色、壁纸与多媒体数据 (Module 5849 & 5756)

| 压缩对象属性 | 还原命名 | 内容与说明 |
| :--- | :--- | :--- |
| `V_.kQ` | `DEFAULT_USER` | 默认用户信息对象（`name`, `nickname`, `avatar`, `phoneBg`, `chatListBg`, `font`） |
| `V_.hg` | `DEFAULT_CHARACTERS` | 默认剧情人物列表（初始为空数组 `[]`） |
| `V_.I1` | `DEFAULT_AVATARS` | 预设随机头像 URL 数组（共 6 张） |
| `V_.sQ` | `DEFAULT_BACKGROUNDS` | 预设背景/壁纸 URL 数组（共 14 张） |
| `V_.Og` | `DEFAULT_MUSIC_LIST` | 预设网易云/海外音乐列表（包含 25 首预设歌曲及播放地址） |
| `V_.Tj` | `DEFAULT_MAP_DATA` | 预设地图城市与区域定义 |
| `V_.lG` | `DEFAULT_FONTS` | 预设字体列表（包含霞鹜文楷、Fusion Pixel 等） |

### 4.1 初始化与预置资源（当前 bundle 手术式修改入口）

| 压缩对象 | 作用 |
| :--- | :--- |
| `y5()` | 手机初始化；P18 使旧的“未检测到角色卡数据”弹窗分支不可达 |
| `b5()` | 导入默认正则 |
| `r5.kQ` / `r5.hg` / `r5.I1` / `r5.sQ` | 默认用户、角色、随机头像、背景 |
| `r5.Og` / `r5.Tj` / `r5.TN` / `r5.lG` | 默认音乐、地图、群组、字体 |
| `Yl` | 默认表情包库，写入 `phone_stickers` |
| `__improvedPhoneLoadPresetResources()` | 设置页“载入所选资源”调用的统一异步入口；基础数据与表情包共用一次 `replaceVariables()`，返回 `data/stickers/regex` 状态 |
| `OtherSettings` setup 局部 `P` / `O` / `R` / `X` / `Q` | 忙碌状态、默认数据/表情包/正则三个选项及执行动作 |
| `Q_(e)` | 原版“外置小手机已就绪”通知；P28 使正常初始化不再调用它 |

---

## 5. SillyTavern 酒馆宿主交互 API

该插件运行在 SillyTavern 前端环境，通过全局变量与酒馆通信：

* `getVariables({ type: 'character' })`：读取当前绑定角色的自定义变量（如 `phone_data`）。
* `replaceVariables(data, { type: 'character' })`：持久化写回角色变量。
* `getChatMessages(messageId)`：读取指定楼层的聊天记录内容。
* `setChatMessages([{ message_id, message }])`：修改指定楼层的聊天消息。
* `deleteChatMessages([messageId])`：删除指定楼层。
* `eventOn(tavern_events.CHAT_CHANGED, callback)`：监听酒馆切换角色/聊天事件。
* `eventOn(tavern_events.GENERATION_ENDED, callback)`：监听 AI 生成结束事件（用于自动回复触发器）。
