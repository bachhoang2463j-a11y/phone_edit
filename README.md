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
├── VARIABLE_MAP.md                # 压缩变量、函数与资源映射
├── BUG_ANALYSIS.md                # ComfyUI 保存卡死排查记录
├── phone_index.js                 # 作者 8.0 原版基准
├── phone_index_8.0_original.js    # 作者 8.0 原始文件副本
├── phone_index_fixed.js           # 补丁生成产物，部署此文件
├── scripts/patch_comfyui.cjs      # 文本级补丁生成器
└── tests/                         # bundle 校验与 ComfyUI 沙箱测试
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

1. 将打包或补丁后的产物放入 SillyTavern 本地目录：
   `D:\SillyTavern\SillyTavern\public\scripts\phone_index.js`
2. 在酒馆助手的脚本编辑框中导入：
   ```javascript
   import '/scripts/phone_index.js'
   ```

---

## 四、当前维护边界与手动载入预置资源

本目录不再维护一套可独立构建的完整源码。当前可执行版本是作者 8.0 压缩 bundle `phone_index.js` 加文本级补丁生成的 `phone_index_fixed.js`；`phone_index_8.0_original.js` 是作者原始 8.0 基准。修改应优先写入 `scripts/patch_comfyui.cjs`，再运行 `node scripts/patch_comfyui.cjs` 生成产物。

初始化时不再弹出“未检测到角色卡数据”资源导入窗口。需要载入新角色卡的内置背景、头像、音乐、地图、群组、字体和表情包时，进入手机设置的“其他设置”→“预置资源”→“载入预置资源”。按钮会要求确认，因为基础数据会写入当前角色卡变量并覆盖同名预置字段；默认正则同时导入为全局设置。

资源写入位置：

* 基础资源写入角色变量 `phone_data`，字段来源为 `r5.kQ`、`r5.hg`、`r5.I1`、`r5.sQ`、`r5.Og`、`r5.Tj`、`r5.TN`、`r5.lG`。
* 表情包写入角色变量 `phone_stickers`，来源为 `Yl`。
* 默认正则导入函数为 `b5()`，统一入口为 `globalThis.__improvedPhoneLoadPresetResources`。
* 初始化函数为 `y5()`；旧弹窗条件已通过 P18 固定为不可达，资源导入改由设置页动作调用。

ComfyUI 配置和保存逻辑仍位于压缩模块 920，生图分发位于模块 685。ComfyUI 的正向提示词、反向提示词和采样器节点 ID 默认分别为 `6`、`7`、`3`。P21-P24 修复了 Vue 编译缓存槽位和 v-model patch flag，P6/P13 处理保存异常及工作流 JSON 超出 localStorage 配额的降级情况。

验证命令：

```text
node scripts/patch_comfyui.cjs
node tests/validate.cjs
node tests/sandbox.test.cjs
node --check phone_index_fixed.js
```
