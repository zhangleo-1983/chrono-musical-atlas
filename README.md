# Chrono-Musical Atlas

Chrono-Musical Atlas 是一张可交互的世界音乐文明演化地图：用时间轴、地域节点、谱系飞线、程序化声音基因、三条文明巡礼路线和双卡对比，把从公元前 7000 年至今的 34 个音乐史节点放在同一张暗黑星图上探索。远古节点还提供考古载体、律制信息和内联 SVG 博物图谱，便于从器物、记谱和声学体系切入。

在线体验：https://zhangleo-1983.github.io/chrono-musical-atlas/

## 开发命令

```bash
npm install
npm run dev       # 本地开发服务器
npm run build     # TypeScript 检查并构建生产文件
npm run preview   # 预览生产构建
npm test          # Vitest
```

项目支持桌面与手机浏览器；手机端支持双指缩放和横向拖动查看地图。地图底图、节点数据和 Web Audio 音型均打包在本地，不依赖外部地图或音频 API。

节点文案与年代是精选 MVP 内容，尚未逐条完成史实核对；外部链接仅作检索入口。Web Audio 音色用于交互试听，不能替代真实乐器录音，最终听感由用户人工确认。

## 曲目导赏与古谱边界

曲目卡片分为两类：`theme` 仅用于本轮计划逐音注明来源的三段公版材料；`evocation` 是按传统常用音阶制作的风格示意，绝不宣称原曲、复原或真实录音。现代版权曲目不提供合成旋律，只展示导赏与 Spotify/YouTube 正版检索入口。

古谱破译台只呈现有来源的记谱体系、相对音级和现代参考调。绝对音高与历史演奏不能由这些示意换算直接推出；复原存在争议或没有可解读连续记谱的节点会明确显示说明卡，不虚构符号、曲名或旋律。

## 新增音乐史节点

1. 在 `src/data/nodes.ts` 的 `RAW_NODES` 中新增一个完整的 `MusicNode`。
2. 使用唯一 `id`，填写年代、坐标、流派、音乐家、至少两项作品/乐器/特征、80–160 字摘要、机构、典籍、80–220 字故事、雷达值、音型和 `influencedBy`。
3. `src/data/index.ts` 会自动按 `startYear` 排序，并从 `influencedBy` 派生 `era` 与 `influences`；不需要手写反向边。
4. 若节点使用了新的音型，先在 `src/audio/patches.ts` 增加对应的纯数据 patch，并为边界行为补充测试。

新增节点后运行 `npm test && npm run build`，确认前驱 id 存在且前驱年代早于后继节点。

## 参与贡献

当前音色由 Web Audio 实时合成，便于零资源离线运行，但还不能替代真实乐器。欢迎贡献：

- **开放授权的乐器采样**，尤其是古琴、西非鼓、加美兰等非西方乐器；提交时请注明来源和授权。
- **更长、更有表现力的流派音型**（`src/audio/patches.ts`）。
- **节点史实核对与补充**（`src/data/nodes.ts`）。当前数据为精选 MVP，尚未逐条核对，欢迎附来源指正。

## 许可证

本项目代码基于 [Apache License 2.0](LICENSE) 开源。世界地图数据来自 `world-atlas`（Natural Earth），依赖各自遵循其许可证。
节点中的文物图片来自 Wikimedia Commons，版权归各自作者，许可证见图片弹层标注。
