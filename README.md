# Chrono-Musical Atlas

Chrono-Musical Atlas 是一张可交互的世界音乐文明演化地图：用时间轴、地域节点、谱系飞线、程序化声音基因和双卡对比，把跨越数千年的音乐史放在同一张暗黑星图上探索。

在线体验：https://zhangleo-1983.github.io/chrono-musical-atlas/

## 开发命令

```bash
npm install
npm run dev       # 本地开发服务器
npm run build     # TypeScript 检查并构建生产文件
npm run preview   # 预览生产构建
npm test          # Vitest
```

项目是桌面端 MVP，建议使用宽度至少 1024px 的浏览器。地图底图、节点数据和 Web Audio 音型均打包在本地，不依赖外部地图或音频 API。

## 新增音乐史节点

1. 在 `src/data/nodes.ts` 的 `RAW_NODES` 中新增一个完整的 `MusicNode`。
2. 使用唯一 `id`，填写年代、坐标、流派、音乐家、至少两项作品/乐器/特征、80–160 字摘要、雷达值、音型和 `influencedBy`。
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
