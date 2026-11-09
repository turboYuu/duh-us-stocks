# dsh-us-stocks

> 一个内嵌于 DeepSeek Harness（DSH）的美股助手：**行情 + 知识库 + 财报日历 + 技术指标 + 提醒 + 智能问答 + 组合对比**，覆盖从股票小白到深度投资者的全谱系用户。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![DSH Plugin](https://img.shields.io/badge/DSH-plugin-4f46e5)](https://github.com/turboYuu/dsh-us-stocks)

> 源码仓库：<https://github.com/turboYuu/dsh-us-stocks>

---

## 目录

- [简介](#简介)
- [功能说明](#功能说明)
- [界面与入口](#界面与入口)
- [数据源](#数据源)
- [安装步骤](#安装步骤)
- [配置 Finnhub API Key](#配置-finnhub-api-key)
- [代码结构](#代码结构)
- [开发与调试](#开发与调试)
- [加入 DSH 插件生态](#加入-dsh-插件生态)
- [版本历史](#版本历史)
- [开源许可](#开源许可)

---

## 简介

美股对中文用户有三重门槛：**术语看不懂、规则不熟悉、工具太分散**。本插件把「行情数据 + 内置知识库 + 规则引擎问答 + 提醒 + 组合跟踪」聚合进 DSH 面板，做到：

- **新手**：术语/缩写/K 线图解、白话解释、市场规则科普，点词即查。
- **进阶**：自选股、日 K 线、技术指标、财报日历、价格/财报/开收盘提醒。
- **深度**：多股对比、持仓盈亏、SEC 财报原文入口、CSV/JSON 导出。

> 行情为**免费日线（收盘 / EOD）数据，非实时**。界面已明确标注「收盘数据 · 非实时」。

---

## 功能说明

### 1. 行情（免费日线 / 收盘 EOD）

- **指数概览**：标普 500、道琼斯、纳斯达克 100、纳斯达克综合。
- **自选股**：添加 / 移除代码，展示收盘价、涨跌额与涨跌幅。
- **日 K 线图**：近一年日线蜡烛图。优先使用 TradingView `lightweight-charts`；若客户端无法打包该库，自动降级为 SVG 蜡烛图。
- **基本面**：市盈率、市值、股息率、贝塔系数、每股收益、ROE、52 周高低等（需 Finnhub Key）。
- **搜索**：按代码 / 名称搜索（Yahoo 搜索源，国内可能不可用，失败时静默降级）。

### 2. 知识库（内置 60+ 条，M3）

- **5 大分类**：专业术语（19）、缩写速查（17）、K 线图解（8）、技术指标（8）、市场规则（11）。
- 每条含：中文名、英文名、缩写、**白话解释**、专业解释、标签、难度等级。
- K 线条目带 **OHLC 示意图数据**，客户端自动渲染成小蜡烛图（十字星、锤子线、吞没、早晨/黄昏之星等）。
- 支持**搜索 + 分类筛选**，中英双语，跟随 DSH 语言设置。

### 3. 财报日历（M2）

- 自选股未来 7 天的财报日期（Nasdaq 官方日历，免 Key）。
- 显示：日期、代码、公司、盘前/盘后、预期 EPS。
- 每行可一键加「财报提醒」。

### 4. 技术指标（M2）

- **MA（5/20/50）**、**BOLL（20,2）** 叠加在 K 线主图。
- **RSI(14)**、**MACD(12,26,9)** 独立小图（SVG）。
- 详情页图表上方 4 个开关：均线 / 布林带 / RSI / MACD。

### 5. 提醒与日程（M5）

- **市场时钟**：美东时间、盘前/盘中/盘后/休市、距开盘/收盘倒计时、交易日/节假日、30 秒自动刷新。
- **开收盘提醒**：盘前 / 开盘 / 收盘 / 盘后 + 提前 N 分钟，按交易日每日触发一次。
- **价格提醒**：上穿 / 下穿指定价。
- **财报提醒**：自选股财报日提前 N 天。
- **免打扰时段**：该时段内不触发提醒（自动顺延）。
- **呈现**：面板内提示条 + 浏览器通知（页脚「开启通知」授权）。

### 6. 智能问答（M4）

- 面板内问答框，规则引擎路由：
  - 术语/规则/指标 → 知识库检索（带相关度打分）
  - 个股行情 → Nasdaq
  - 基本面 → Finnhub（需 Key）
  - 财报日期 → Nasdaq 财报日历
- 回答带**来源 + 时间戳 + 免责声明**；术语题附知识卡。
- 支持快捷提问：`什么是 ETF`、`PE 是什么`、`AAPL 行情`、`美股交易时间`。

### 7. 组合与对比（M6）

- **持仓跟踪**（手动录入，非实盘）：代码 / 股数 / 成本价 / 现价 / 市值 / 盈亏（额 + %），底部合计行。
- **多股对比**：价格、近一年涨跌幅、市值、PE、股息率、Beta；附**归一化走势图**（各股首日 = 100）。
- **数据导出**：一键导出 CSV / JSON。

### 8. 个性化

- **K 线配色**：支持「绿涨红跌（美股惯例）」与「红涨绿跌（A 股习惯）」切换。
- **难度等级**：小白 / 进阶 / 专业（影响默认指标与术语解释深度）。
- **主题**：跟随 DSH 明暗主题（`--dsw-alias-*` 令牌）。
- **语言**：中文 / English，跟随 DSH 设置。

### 9. 本地持久化

自选股、偏好（等级/配色/免打扰/Finnhub Key）、提醒、持仓统一写入：

```
$DSH_HOME/dsh-us-stocks.json
```

（默认 `~/.dsh/dsh-us-stocks.json`）

---

## 界面与入口

- 左侧栏出现「**美股**」入口，点击打开主面板。
- 面板顶部 6 个标签页：**行情 / 问答 / 日历 / 提醒 / 组合 / 知识库**。
- 页脚：**设置**（配置 Finnhub Key）、**开启通知**（浏览器通知授权）。

---

## 数据源

> Yahoo Finance 在中国大陆不可达（2021-11-01 起停止服务），已改用下列源。

| 数据 | 来源 | 需 Key |
| --- | --- | --- |
| 个股报价 / 日线历史 | Nasdaq 官方 API（`api.nasdaq.com`） | 否 |
| 纳斯达克指数（COMP / NDX） | Nasdaq 官方 API | 否 |
| 标普 500 / 道琼斯 | 东方财富（`push2.eastmoney.com`） | 否 |
| 财报日历 | Nasdaq 官方财报日历 | 否 |
| 基本面 / 财报数据 | Finnhub | 是（`FINNHUB_API_KEY`） |
| 财报原文（10-K/10-Q/8-K/13F） | SEC EDGAR | 否 |

---

## 安装步骤

### 环境要求

- DeepSeek Harness（DSH）桌面端 / Web 端
- Node.js ≥ 18（用于安装依赖）
- 可访问 `api.nasdaq.com`、`push2.eastmoney.com` 的网络

### 方式一：从 GitHub 克隆（推荐，开源版）

```bash
git clone https://github.com/turboYuu/dsh-us-stocks.git
cd dsh-us-stocks
npm install          # 拉取 lightweight-charts
```

然后在 DSH 中：打开 **插件管理 → 加载本地插件 → 选择 `dsh-us-stocks` 目录**。

### 方式二：下载 ZIP（无需 Git）

1. 打开仓库页面 <https://github.com/turboYuu/dsh-us-stocks>。
2. 点击 **Code → Download ZIP**，解压到任意目录。
3. `cd` 进解压目录执行 `npm install`。
4. DSH 插件管理 → 加载本地插件 → 选择该目录。

### 方式三：npm 安装（若已发布）

```bash
npm install -g dsh-us-stocks
# 或在 DSH 插件管理中输入包名 dsh-us-stocks 安装
```

### 方式四：插件市场

若已收录进 DSH 插件市场索引，可在「插件市场」中搜索 `dsh-us-stocks` 安装。

### 加载后

1. 左侧栏出现「美股」入口，点击打开面板。
2. 首次使用建议在**页脚「设置」**中填入 Finnhub Key（可选，用于基本面）。
3. 面板顶部切换标签页开始使用。

> **重要**：宿主半 `index.js` 改动后需**重载插件**（禁用→启用，或重启 DSH）才生效；客户端 `client.js` 改动刷新页面即可。

---

## 配置 Finnhub API Key

基本面 / 财报数据需要 Finnhub Key（**可选**，不配置也能用行情 / 知识库 / 提醒 / 问答的知识部分）。

**方式一（推荐，界面配置）**：

1. 打开「美股」面板 → 页脚点「**设置**」。
2. 在 Finnhub API Key 输入框填入 Key → 「保存」。
3. 状态显示「已配置」即生效。

**方式二（环境变量）**：

```bash
export FINNHUB_API_KEY=你的_key
```

> 优先级：环境变量 > 界面设置。免费 Key 可在 <https://finnhub.io> 申请。
> Key 仅保存在本机 `$DSH_HOME/dsh-us-stocks.json`（明文）。如需更强安全，可后续接入 DSH `credentials` 服务。

---

## 代码结构

```
dsh-us-stocks/
├── package.json          # 插件清单：dsh.bundle / dsh.client / 依赖 / 元数据
├── cordis.patch.yml      # DSH bundle 注册（insert 一条宿主行）
├── index.js              # 宿主半（Node）：
│                         #   - 数据代理：Nasdaq / 东方财富 / Finnhub / SEC EDGAR
│                         #   - 18 条 /api/us-stocks/* 路由
│                         #   - 内存缓存 + 市场时钟 + 提醒到期检测 + 问答规则引擎
│                         #   - 自选 / 偏好 / 提醒 / 持仓 写盘
├── client.js             # 浏览器半（React）：
│                         #   - 侧栏入口 + 主面板 6 标签
│                         #   - K 线图（lightweight-charts + SVG 降级）
│                         #   - 技术指标计算、知识库、问答、提醒、组合
├── icon.svg              # 侧栏图标
├── knowledge/
│   └── knowledge.js      # 知识库数据资产（术语 / 缩写 / K 线 / 指标 / 规则，60+ 条）
├── locale/
│   ├── zh.json           # 插件元信息（中文 title / description）
│   └── en.json           # 插件元信息（英文 title / description）
├── README.md             # 本文件
└── LICENSE               # MIT
```

### 宿主半 vs 浏览器半

| 层 | 文件 | 职责 |
| --- | --- | --- |
| 宿主半 | `index.js` | 数据代理与聚合、缓存、密钥读取、路由、持久化、市场时钟、提醒检测、问答引擎 |
| 浏览器半 | `client.js` | 侧栏入口、面板渲染、图表绘制、指标计算、术语卡片、问答交互 |

### 主要接口（宿主半）

| 路由 | 说明 |
| --- | --- |
| `GET /api/us-stocks/indices` | 指数概览 |
| `GET /api/us-stocks/quote?symbol=` | 个股报价 |
| `GET /api/us-stocks/candles?symbol=&range=` | 日线 K 线 |
| `GET /api/us-stocks/fundamentals?symbol=` | 基本面（Finnhub） |
| `GET /api/us-stocks/earnings?symbol=` | 历史财报 |
| `GET /api/us-stocks/filings?symbol=` | SEC 文件列表 |
| `GET /api/us-stocks/search?q=` | 代码搜索 |
| `GET /api/us-stocks/knowledge?q=&category=` | 知识库检索 |
| `GET /api/us-stocks/calendar?symbols=&from=&to=` | 财报日历 |
| `GET /api/us-stocks/alerts` / `POST` | 提醒 CRUD |
| `GET /api/us-stocks/alerts/due` | 到期提醒检测 |
| `GET /api/us-stocks/market-clock` | 市场时钟 |
| `GET /api/us-stocks/ask?q=` | 智能问答 |
| `GET /api/us-stocks/compare?symbols=` | 多股对比 |
| `GET /api/us-stocks/portfolio` / `POST` | 持仓 CRUD |
| `GET` / `POST /api/us-stocks/preferences` | 偏好吗（含 Finnhub Key） |
| `GET /api/us-stocks/watchlist` / `POST` | 自选股 |
| `GET /api/us-stocks/health` | 健康检查 |

---

## 开发与调试

- 宿主半改动 → **重载插件**（插件管理里禁用再启用，或重启 DSH）。
- 客户端改动 → **刷新页面**（若开启 `pnpm run dev:web`，客户端 bundle 会自动重建）。
- 调试数据接口可直接访问：`curl http://127.0.0.1:<端口>/api/us-stocks/health`。
- 插件通过 `package.json` 的 `dsh` 字段声明：

```json
"dsh": {
  "bundle": { "patch": "./cordis.patch.yml" },
  "client": {
    "platform": "web",
    "immediately": true,
    "inject": [
      "@deepseek-ai/dsh-client-locale",
      "@deepseek-ai/dsh-client-ui-layout",
      "@deepseek-ai/dsh-client-ui-sidebar",
      "@deepseek-ai/dsh-client-ui-conversation"
    ]
  }
}
```

---

## 加入 DSH 插件生态

本插件已按 DSH 插件规范打包，满足加入生态的基础条件：

| 生态要求 | 本仓库 |
| --- | --- |
| `package.json` 含 `dsh` 字段 | ✅ `dsh.bundle` + `dsh.client` |
| `keywords` 含 `dsh` / `deepseek-harness` / `plugin` | ✅ |
| 图标 `icon.svg` | ✅ |
| `locale/*.json` 含 `meta.title` / `meta.description` | ✅ |
| MIT 开源许可 | ✅ |
| `cordis.patch.yml` 注册 | ✅ |

### 发布到 npm

1. 仓库地址已配置在 `package.json` 中：
   ```json
   "repository": { "type": "git", "url": "git+https://github.com/turboYuu/dsh-us-stocks.git" },
   "bugs": { "url": "https://github.com/turboYuu/dsh-us-stocks/issues" },
   "homepage": "https://github.com/turboYuu/dsh-us-stocks#readme"
   ```
   （如仓库改名，请同步更新。）
2. 登录并发布：
   ```bash
   npm login
   npm publish --access public
   ```

### 进入 DSH 插件市场索引

DSH 插件市场索引是一个 JSON 文件，格式为：

```json
{
  "format": 1,
  "metadata": {},
  "plugins": [
    {
      "name": "dsh-us-stocks",
      "versions": ["0.6.1"],
      "icon": "https://.../icon.svg",
      "keywords": ["dsh", "deepseek-harness", "plugin", "us-stocks"],
      "labels": {}
    }
  ]
}
```

- 每个插件条目至少包含 `name` 与 `versions`（按 SemVer 倒序），可选 `icon`、`keywords`、`labels`。
- 安装时 DSH 会生成 `name@version` 的 pnpm 安装目标。
- 将条目提交到 DSH 插件市场索引仓库（或联系维护者）即可被搜索到。

### 生态建议

- 保持 `dsh` 字段与 `keywords` 完整，便于插件市场分类与搜索。
- 版本号遵循 SemVer；破坏性变更升 major。
- 在 README 与 `locale/*.json` 中写清功能与截图，便于用户发现。

---

## 版本历史

| 版本 | 内容 |
| --- | --- |
| `0.6.1` | 新增「设置」入口，可在界面配置 Finnhub API Key |
| `0.6.0` | 组合持仓跟踪、多股对比、数据导出（M6） |
| `0.5.0` | 市场时钟、开收盘提醒、免打扰时段（M5） |
| `0.4.0` | 智能问答 `/ask` 规则引擎 + 面板问答框（M4） |
| `0.3.0` | 财报日历、技术指标（MA/BOLL/RSI/MACD）、价格/财报提醒（M2） |
| `0.2.0` | 数据源切换为 Nasdaq + 东方财富；新增知识库（63 条，M3） |
| `0.1.0` | MVP：指数概览、自选股、日 K 线、基本面 |

---

## 开源许可

本项目采用 **MIT License**，详见 [LICENSE](./LICENSE)。

> 行情与投资相关内容仅供学习参考，**不构成投资建议**。数据来源与时效以各接口为准；投资有风险，决策需谨慎。
