window.__ModuleLoader__.load({
  id: 'dsh-us-stocks',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    let lightcharts = null;
    try {
      lightcharts = require('lightweight-charts');
    } catch (_error) {
      lightcharts = null;
    }

    const NS = 'us-stocks';
    const PANEL_ID = 'us-stocks';
    const PACKAGE_NAME = 'dsh-us-stocks';
    const VERSION = '0.6.2';
    const API = '/api/us-stocks';

    const en = {
      label: 'US Stocks',
      eyebrow: 'US Market',
      title: 'US Stocks',
      lede: 'Free end-of-day US market data, a built-in glossary, earnings calendar, indicators and alerts.',
      'eod.note': 'Closing data · not real-time',
      'tab.market': 'Market',
      'tab.ask': 'Ask',
      'tab.calendar': 'Calendar',
      'tab.alerts': 'Reminders',
      'tab.portfolio': 'Portfolio',
      'tab.knowledge': 'Knowledge',
      'portfolio.title': 'Holdings',
      'portfolio.empty': 'No holdings yet. Add a symbol, shares and average cost.',
      'portfolio.add': 'Add holding',
      'portfolio.symbol': 'Ticker',
      'portfolio.shares': 'Shares',
      'portfolio.cost': 'Avg cost',
      'portfolio.price': 'Price',
      'portfolio.value': 'Value',
      'portfolio.pnl': 'P/L',
      'portfolio.total': 'Total',
      'portfolio.remove': 'Remove',
      'portfolio.hint': 'Example: AAPL, 10 shares, avg cost 200.',
      'compare.title': 'Compare',
      'compare.placeholder': 'Symbols, comma separated (e.g. AAPL,MSFT,NVDA)',
      'compare.run': 'Compare',
      'compare.empty': 'Enter symbols to compare.',
      'compare.symbol': 'Symbol',
      'compare.price': 'Price',
      'compare.return': '1Y return',
      'compare.cap': 'Mkt cap',
      'compare.pe': 'P/E',
      'compare.dividend': 'Div yield',
      'compare.beta': 'Beta',
      'export.title': 'Export',
      'export.csv': 'CSV',
      'export.json': 'JSON',
      'export.hint': 'Download current portfolio and compare data.',
      'settings.title': 'Settings',
      'settings.finnhubKey': 'Finnhub API Key',
      'settings.finnhubHint': 'Leave empty to use the FINNHUB_API_KEY environment variable. Stored locally only.',
      'settings.save': 'Save',
      'settings.clear': 'Clear',
      'settings.saved': 'Saved',
      'settings.configured': 'Configured',
      'settings.notConfigured': 'Not configured',
      'settings.open': 'Settings',
      'clock.title': 'Market clock',
      'clock.session.pre': 'Pre-market',
      'clock.session.open': 'Open',
      'clock.session.after': 'After-hours',
      'clock.session.closed': 'Closed',
      'clock.toOpen': 'Until open',
      'clock.toClose': 'Until close',
      'clock.min': 'min',
      'clock.tradingDay': 'Trading day',
      'clock.holiday': 'Holiday',
      'alert.create': 'Create reminder',
      'alert.type.market': 'Open/Close',
      'alert.type.price': 'Price',
      'alert.event.pre': 'Pre-market',
      'alert.event.open': 'Open',
      'alert.event.close': 'Close',
      'alert.event.after': 'After-hours',
      'alert.offset': 'Minutes before',
      'alert.symbolPlaceholder': 'Ticker',
      'alert.marketLabel': 'Market reminder',
      'quiet.title': 'Quiet hours',
      'quiet.enabled': 'Enable quiet hours',
      'quiet.save': 'Save',
      'quiet.hint': 'No notifications during this range.',
      'ask.placeholder': 'Ask about a term, ticker or rule…',
      'ask.send': 'Send',
      'ask.empty': 'Try: “What is ETF?”, “AAPL quote”, “US market hours”.',
      'ask.sources': 'Sources',
      'ask.disclaimer': 'For reference only, not investment advice.',
      'indices.title': 'Indices',
      'watchlist.title': 'Watchlist',
      'watchlist.empty': 'No symbols yet. Add a ticker like AAPL or TSLA.',
      'watchlist.addPlaceholder': 'Add ticker (e.g. AAPL)',
      'watchlist.add': 'Add',
      'watchlist.remove': 'Remove',
      'detail.select': 'Select a symbol to see its chart and fundamentals.',
      'detail.chart.title': 'Daily chart (1 year)',
      'detail.fundamentals.title': 'Fundamentals',
      'detail.fundamentals.noKey': 'Set Finnhub API Key in Settings (footer) to load fundamentals.',
      'calendar.title': 'Upcoming earnings',
      'calendar.empty': 'No upcoming earnings for your watchlist (next 7 days).',
      'calendar.hint': 'Add watchlist symbols to see their earnings dates.',
      'calendar.pre': 'Pre-market',
      'calendar.post': 'After-hours',
      'calendar.eps': 'EPS est.',
      'calendar.alert': 'Alert',
      'knowledge.searchPlaceholder': 'Search a term, e.g. PE, ETF, K-line…',
      'knowledge.all': 'All',
      'knowledge.empty': 'No matching entries.',
      'knowledge.count': '{n} entries',
      'knowledge.params': 'Params',
      'knowledge.usage': 'Usage',
      'knowledge.bullish': 'Bullish',
      'knowledge.bearish': 'Bearish',
      'knowledge.neutral': 'Neutral',
      'indicator.title': 'Indicators',
      'indicator.ma': 'MA',
      'indicator.boll': 'BOLL',
      'indicator.rsi': 'RSI',
      'indicator.macd': 'MACD',
      'alert.title': 'Alerts',
      'alert.pricePlaceholder': 'Price',
      'alert.above': 'Above',
      'alert.below': 'Below',
      'alert.add': 'Add alert',
      'alert.empty': 'No alerts yet.',
      'alert.priceAlert': 'Price',
      'alert.earningsAlert': 'Earnings',
      'alert.delete': 'Delete',
      'alert.enableNotify': 'Enable notifications',
      'alert.due': 'Alert triggered',
      'metric.peTTM': 'P/E (TTM)',
      'metric.peForward': 'P/E (Forward)',
      'metric.pbTTM': 'P/B',
      'metric.psTTM': 'P/S',
      'metric.roeTTM': 'ROE',
      'metric.epsTTM': 'EPS (TTM)',
      'metric.marketCap': 'Market cap',
      'metric.dividendYield': 'Dividend yield',
      'metric.beta': 'Beta',
      'metric.grossMargin': 'Gross margin',
      'metric.netMargin': 'Net margin',
      'metric.revenueTTM': 'Revenue (TTM)',
      'metric.fcfTTM': 'Free cash flow',
      'metric.week52High': '52-week high',
      'metric.week52Low': '52-week low',
      'footer.version': 'Version {version}',
      'footer.slots': 'sidebar.panellist · main',
    };

    const zh = {
      label: '美股',
      eyebrow: '美股行情',
      title: '美股',
      lede: '免费美股日线（收盘）行情 + 内置知识库 + 财报日历 + 技术指标 + 提醒。',
      'eod.note': '收盘数据 · 非实时',
      'tab.market': '行情',
      'tab.ask': '问答',
      'tab.calendar': '日历',
      'tab.alerts': '提醒',
      'tab.portfolio': '组合',
      'tab.knowledge': '知识库',
      'portfolio.title': '持仓',
      'portfolio.empty': '还没有持仓，添加代码、股数和成本价。',
      'portfolio.add': '添加持仓',
      'portfolio.symbol': '代码',
      'portfolio.shares': '股数',
      'portfolio.cost': '成本价',
      'portfolio.price': '现价',
      'portfolio.value': '市值',
      'portfolio.pnl': '盈亏',
      'portfolio.total': '合计',
      'portfolio.remove': '移除',
      'portfolio.hint': '示例：AAPL，10 股，成本价 200。',
      'compare.title': '多股对比',
      'compare.placeholder': '代码，逗号分隔（如 AAPL,MSFT,NVDA）',
      'compare.run': '对比',
      'compare.empty': '输入代码开始对比。',
      'compare.symbol': '代码',
      'compare.price': '价格',
      'compare.return': '近一年',
      'compare.cap': '市值',
      'compare.pe': '市盈率',
      'compare.dividend': '股息率',
      'compare.beta': 'Beta',
      'export.title': '导出',
      'export.csv': 'CSV',
      'export.json': 'JSON',
      'export.hint': '下载当前持仓与对比数据。',
      'settings.title': '设置',
      'settings.finnhubKey': 'Finnhub API Key',
      'settings.finnhubHint': '留空则使用 FINNHUB_API_KEY 环境变量；Key 仅保存在本地。',
      'settings.save': '保存',
      'settings.clear': '清除',
      'settings.saved': '已保存',
      'settings.configured': '已配置',
      'settings.notConfigured': '未配置',
      'settings.open': '设置',
      'clock.title': '市场时钟',
      'clock.session.pre': '盘前',
      'clock.session.open': '盘中',
      'clock.session.after': '盘后',
      'clock.session.closed': '休市',
      'clock.toOpen': '距开盘',
      'clock.toClose': '距收盘',
      'clock.min': '分钟',
      'clock.tradingDay': '交易日',
      'clock.holiday': '休市日',
      'alert.create': '新建提醒',
      'alert.type.market': '开收盘',
      'alert.type.price': '价格',
      'alert.event.pre': '盘前',
      'alert.event.open': '开盘',
      'alert.event.close': '收盘',
      'alert.event.after': '盘后',
      'alert.offset': '提前分钟',
      'alert.symbolPlaceholder': '代码',
      'alert.marketLabel': '开收盘提醒',
      'quiet.title': '免打扰',
      'quiet.enabled': '开启免打扰',
      'quiet.save': '保存',
      'quiet.hint': '该时段内不弹出提醒。',
      'ask.placeholder': '问术语、代码或规则，如「什么是 ETF」',
      'ask.send': '发送',
      'ask.empty': '试试：「什么是 ETF」「AAPL 行情」「美股交易时间」',
      'ask.sources': '来源',
      'ask.disclaimer': '仅供参考，不构成投资建议。',
      'indices.title': '指数概览',
      'watchlist.title': '自选股',
      'watchlist.empty': '还没有自选股，添加一个代码试试，如 AAPL 或 TSLA。',
      'watchlist.addPlaceholder': '添加代码（如 AAPL）',
      'watchlist.add': '添加',
      'watchlist.remove': '移除',
      'detail.select': '点击一个自选股查看 K 线与基本面。',
      'detail.chart.title': '日 K 线（近一年）',
      'detail.fundamentals.title': '基本面',
      'detail.fundamentals.noKey': '在页脚「设置」中配置 Finnhub API Key 后可加载基本面。',
      'calendar.title': '即将发布的财报',
      'calendar.empty': '自选股未来 7 天内没有财报。',
      'calendar.hint': '添加自选股后这里会显示其财报日期。',
      'calendar.pre': '盘前',
      'calendar.post': '盘后',
      'calendar.eps': '预期 EPS',
      'calendar.alert': '提醒',
      'knowledge.searchPlaceholder': '搜索术语，如 PE、ETF、K 线…',
      'knowledge.all': '全部',
      'knowledge.empty': '没有匹配的条目。',
      'knowledge.count': '{n} 条',
      'knowledge.params': '参数',
      'knowledge.usage': '用法',
      'knowledge.bullish': '看涨',
      'knowledge.bearish': '看跌',
      'knowledge.neutral': '中性',
      'indicator.title': '技术指标',
      'indicator.ma': '均线',
      'indicator.boll': '布林带',
      'indicator.rsi': 'RSI',
      'indicator.macd': 'MACD',
      'alert.title': '提醒',
      'alert.pricePlaceholder': '价格',
      'alert.above': '高于',
      'alert.below': '低于',
      'alert.add': '添加提醒',
      'alert.empty': '暂无提醒。',
      'alert.priceAlert': '价格',
      'alert.earningsAlert': '财报',
      'alert.delete': '删除',
      'alert.enableNotify': '开启通知',
      'alert.due': '提醒已触发',
      'metric.peTTM': '市盈率（TTM）',
      'metric.peForward': '市盈率（预期）',
      'metric.pbTTM': '市净率',
      'metric.psTTM': '市销率',
      'metric.roeTTM': '净资产收益率',
      'metric.epsTTM': '每股收益（TTM）',
      'metric.marketCap': '市值',
      'metric.dividendYield': '股息率',
      'metric.beta': '贝塔系数',
      'metric.grossMargin': '毛利率',
      'metric.netMargin': '净利率',
      'metric.revenueTTM': '营收（TTM）',
      'metric.fcfTTM': '自由现金流',
      'metric.week52High': '52 周最高',
      'metric.week52Low': '52 周最低',
      'footer.version': '版本 {version}',
      'footer.slots': 'sidebar.panellist · main',
    };

    const css = `
.us-page { height: 100%; overflow: auto; box-sizing: border-box;
  background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary);
  font-size: 14px; line-height: 20px; }
.us-page * { box-sizing: border-box; }
.us-content { width: 100%; max-width: 960px; margin: 0 auto; padding: 36px 32px 64px; }
.us-eyebrow-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.us-eyebrow { font-size: 11px; line-height: 16px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--dsw-alias-label-secondary); }
.us-pill { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px 3px 7px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2); font-size: 11px; line-height: 16px;
  color: var(--dsw-alias-label-secondary); }
.us-dot { width: 6px; height: 6px; border-radius: 50%;
  background: var(--dsw-alias-state-success-primary); flex: none; }
.us-title { margin: 10px 0 0; font-size: 26px; line-height: 34px; font-weight: 600; letter-spacing: -0.01em; }
.us-lede { margin: 10px 0 0; max-width: 680px; font-size: 14px; line-height: 22px;
  color: var(--dsw-alias-label-secondary); }
.us-tabs { display: flex; gap: 4px; margin-top: 22px; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.us-tab { appearance: none; border: none; background: transparent; padding: 8px 14px;
  font: inherit; font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-secondary);
  cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.us-tab.active { color: var(--dsw-alias-brand-primary); border-bottom-color: var(--dsw-alias-brand-primary); }
.us-section { margin-top: 26px; }
.us-section-title { margin: 0 0 12px; font-size: 12px; line-height: 16px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--dsw-alias-label-secondary); }
.us-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.us-card { min-width: 0; padding: 16px 16px 14px; border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px; background: var(--dsw-alias-bg-layer-1); }
.us-card-name { font-size: 13px; line-height: 18px; font-weight: 600; }
.us-card-price { margin-top: 8px; font-size: 20px; line-height: 26px; font-weight: 600;
  font-variant-numeric: tabular-nums; }
.us-up { color: var(--dsw-alias-state-success-primary); }
.us-down { color: var(--dsw-alias-state-danger-primary, #dc2626); }
.us-card-change { margin-top: 2px; font-size: 12px; line-height: 16px; font-variant-numeric: tabular-nums; }
.us-watch-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1); cursor: pointer; }
.us-watch-row:hover { background: var(--dsw-alias-bg-layer-2); }
.us-watch-sym { font-weight: 600; font-variant-numeric: tabular-nums; min-width: 64px; }
.us-watch-price { margin-left: auto; font-variant-numeric: tabular-nums; }
.us-watch-change { font-size: 12px; font-variant-numeric: tabular-nums; min-width: 92px; text-align: right; }
.us-add-row { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.us-input { flex: 1; min-width: 0; padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 9px; background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  font: inherit; font-size: 13px; }
.us-input:focus { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.us-button { appearance: none; border: 1px solid var(--dsw-alias-border-l2); border-radius: 9px;
  background: var(--dsw-alias-bg-layer-1); color: var(--dsw-alias-label-primary);
  padding: 8px 14px; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.us-button:hover { background: var(--dsw-alias-bg-layer-2); }
.us-button-primary { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.us-button-ghost { border-color: transparent; background: transparent; color: var(--dsw-alias-label-secondary); }
.us-button-ghost:hover { background: var(--dsw-alias-bg-layer-2); }
.us-muted { color: var(--dsw-alias-label-secondary); font-size: 13px; }
.us-detail { margin-top: 26px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1); padding: 18px; }
.us-detail-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px; }
.us-detail-sym { font-size: 18px; line-height: 24px; font-weight: 600; }
.us-detail-price { font-size: 22px; line-height: 28px; font-weight: 600; font-variant-numeric: tabular-nums; }
.us-chart { width: 100%; height: 320px; margin-top: 16px; }
.us-chart-svg { width: 100%; margin-top: 16px; }
.us-toggles { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 14px; }
.us-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 16px; }
.us-metric { padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px;
  background: var(--dsw-alias-bg-layer-2); }
.us-metric-label { font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-secondary); }
.us-metric-value { margin-top: 2px; font-size: 14px; line-height: 20px; font-weight: 600;
  font-variant-numeric: tabular-nums; }
.us-k-search { width: 100%; margin-bottom: 12px; }
.us-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.us-chip { appearance: none; padding: 5px 12px; border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px; background: var(--dsw-alias-bg-layer-1); font: inherit; font-size: 12px;
  color: var(--dsw-alias-label-secondary); cursor: pointer; }
.us-chip.active { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.us-k-list { display: grid; gap: 10px; }
.us-k-card { display: flex; gap: 16px; padding: 14px 16px; border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px; background: var(--dsw-alias-bg-layer-1); }
.us-k-visual { flex: none; display: flex; align-items: center; justify-content: center; width: 64px; }
.us-candle { display: block; }
.us-k-main { flex: 1; min-width: 0; }
.us-k-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.us-k-zh { font-size: 14px; line-height: 20px; font-weight: 600; }
.us-k-en { font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.us-k-abbr { font-size: 11px; line-height: 16px; padding: 1px 7px; border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-brand-primary);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.us-k-signal { font-size: 11px; line-height: 16px; padding: 1px 7px; border-radius: 6px; }
.us-k-signal.bullish { color: var(--dsw-alias-state-success-primary); background: var(--dsw-alias-bg-layer-2); }
.us-k-signal.bearish { color: var(--dsw-alias-state-danger-primary, #dc2626); background: var(--dsw-alias-bg-layer-2); }
.us-k-signal.neutral { color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); }
.us-k-plain { margin: 6px 0 0; font-size: 13px; line-height: 20px; }
.us-k-detail { margin: 4px 0 0; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.us-cal-list { display: grid; gap: 8px; }
.us-cal-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-1); }
.us-cal-date { font-variant-numeric: tabular-nums; font-size: 12px; color: var(--dsw-alias-label-secondary); min-width: 84px; }
.us-cal-sym { font-weight: 600; min-width: 56px; }
.us-cal-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
.us-cal-tag { font-size: 11px; padding: 1px 7px; border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.us-alert-row { display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px;
  background: var(--dsw-alias-bg-layer-2); margin-top: 8px; }
.us-alert-text { flex: 1; min-width: 0; font-size: 12px; }
.us-due { margin-top: 14px; padding: 10px 14px; border: 1px solid var(--dsw-alias-brand-primary);
  border-radius: 10px; background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-brand-primary); font-size: 13px; }
.us-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.us-table th, .us-table td { padding: 8px 10px; border-bottom: 1px solid var(--dsw-alias-border-l1); text-align: right; font-variant-numeric: tabular-nums; }
.us-table th:first-child, .us-table td:first-child { text-align: left; }
.us-table th { font-size: 11px; font-weight: 600; color: var(--dsw-alias-label-secondary); text-transform: uppercase; letter-spacing: 0.06em; }
.us-table tr.us-table-total td { font-weight: 600; border-top: 2px solid var(--dsw-alias-border-l2); }
.us-clock { display: flex; flex-wrap: wrap; gap: 14px 20px; align-items: center;
  padding: 16px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1); }
.us-clock-time { font-size: 28px; line-height: 34px; font-weight: 600; font-variant-numeric: tabular-nums; }
.us-clock-meta { font-size: 12px; line-height: 16px; color: var(--dsw-alias-label-secondary); }
.us-clock-badge { font-size: 12px; line-height: 16px; padding: 2px 10px; border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); }
.us-chat { display: flex; flex-direction: column; gap: 12px; max-height: 55vh; overflow: auto; }
.us-msg { padding: 12px 14px; border-radius: 12px; font-size: 13px; line-height: 20px; white-space: pre-wrap; }
.us-msg.q { align-self: flex-end; max-width: 80%; background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); }
.us-msg.a { background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); }
.us-msg-src { margin-top: 8px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.us-sugg { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.us-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 8px 16px; margin-top: 36px; padding-top: 16px; border-top: 1px solid var(--dsw-alias-border-l1);
  font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.us-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; }
@media (max-width: 760px) {
  .us-content { padding: 28px 18px 48px; }
  .us-grid, .us-metrics { grid-template-columns: 1fr; }
  .us-k-card { flex-direction: column; }
  .us-k-visual { width: auto; }
}
`;

    function SidebarIcon({ size = 20, active = false }) {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24', width: size, height: size, fill: 'none',
          'aria-hidden': 'true', focusable: 'false',
          style: { display: 'block', flex: 'none' },
        },
        h('rect', { x: 3, y: 5, width: 18, height: 14, rx: 3, stroke: 'currentColor', strokeWidth: 1.7 }),
        h('path', {
          d: 'M6.2 17.2l3.4-4 2.6 2.1 2.9-3.6',
          stroke: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor',
          strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M13.4 11.2h1.8v1.8',
          stroke: active ? 'var(--dsw-alias-brand-primary)' : 'currentColor',
          strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
      );
    }

    function api(path, options) {
      return fetch(`${API}${path}`, options).then((r) => r.json());
    }

    function cssVar(name, fallback) {
      try {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return v || fallback;
      } catch (_error) {
        return fallback;
      }
    }

    function toDateStr(unixSeconds) {
      return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
    }

    function fmtPrice(value) {
      if (value == null) return '—';
      const abs = Math.abs(value);
      const digits = abs > 0 && abs < 1 ? 4 : 2;
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: digits, maximumFractionDigits: digits,
      });
    }

    function fmtSigned(value, suffix = '') {
      if (value == null) return '—';
      const sign = value > 0 ? '+' : '';
      return `${sign}${Number(value).toFixed(2)}${suffix}`;
    }

    function fmtCap(value) {
      if (value == null) return '—';
      const abs = Math.abs(value);
      if (abs >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
      if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
      if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
      return Number(value).toFixed(0);
    }

    function fmtPercent(value) {
      if (value == null) return '—';
      return `${Number(value).toFixed(2)}%`;
    }

    // -------------------------------------------------------------- indicators
    function smaValues(candles, n) {
      const out = [];
      let sum = 0;
      for (let i = 0; i < candles.length; i++) {
        sum += candles[i].close;
        if (i >= n) sum -= candles[i - n].close;
        out.push(i >= n - 1 ? sum / n : null);
      }
      return out;
    }

    function emaValues(candles, n) {
      const k = 2 / (n + 1);
      const out = [];
      let prev = null;
      for (let i = 0; i < candles.length; i++) {
        const close = candles[i].close;
        prev = prev == null ? close : close * k + prev * (1 - k);
        out.push(i >= n - 1 ? prev : null);
      }
      return out;
    }

    function bollValues(candles, n = 20, k = 2) {
      const mid = smaValues(candles, n);
      const upper = [];
      const lower = [];
      for (let i = 0; i < candles.length; i++) {
        if (i < n - 1) {
          upper.push(null);
          lower.push(null);
          continue;
        }
        let variance = 0;
        for (let j = i - n + 1; j <= i; j++) variance += (candles[j].close - mid[i]) ** 2;
        const sd = Math.sqrt(variance / n);
        upper.push(mid[i] + k * sd);
        lower.push(mid[i] - k * sd);
      }
      return { mid, upper, lower };
    }

    function rsiValues(candles, n = 14) {
      const out = new Array(candles.length).fill(null);
      let gain = 0;
      let loss = 0;
      for (let i = 1; i < candles.length; i++) {
        const diff = candles[i].close - candles[i - 1].close;
        const g = Math.max(diff, 0);
        const l = Math.max(-diff, 0);
        if (i <= n) {
          gain += g;
          loss += l;
          if (i === n) {
            gain /= n;
            loss /= n;
            out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
          }
        } else {
          gain = (gain * (n - 1) + g) / n;
          loss = (loss * (n - 1) + l) / n;
          out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
        }
      }
      return out;
    }

    function macdValues(candles, fast = 12, slow = 26, signal = 9) {
      const emaFast = emaValues(candles, fast);
      const emaSlow = emaValues(candles, slow);
      const macd = candles.map((c, i) =>
        emaFast[i] != null && emaSlow[i] != null ? emaFast[i] - emaSlow[i] : null,
      );
      const signalArr = new Array(candles.length).fill(null);
      const k = 2 / (signal + 1);
      let prev = null;
      let count = 0;
      for (let i = 0; i < macd.length; i++) {
        if (macd[i] == null) continue;
        prev = prev == null ? macd[i] : macd[i] * k + prev * (1 - k);
        count += 1;
        if (count >= signal) signalArr[i] = prev;
      }
      const hist = candles.map((c, i) =>
        macd[i] != null && signalArr[i] != null ? macd[i] - signalArr[i] : null,
      );
      return { macd, signal: signalArr, hist };
    }

    function SvgPattern({ candles, colorScheme }) {
      const list = Array.isArray(candles) && candles.length ? candles : [];
      if (list.length === 0) return null;
      const W = 56, H = 76, padX = 4, padY = 8;
      const max = Math.max(...list.map((c) => c.high));
      const min = Math.min(...list.map((c) => c.low));
      const span = max - min || 1;
      const y = (v) => H - padY - ((v - min) / span) * (H - 2 * padY);
      const slot = (W - padX * 2) / list.length;
      const bodyW = Math.max(5, Math.min(16, slot * 0.6));
      const upColor = colorScheme === 'cn' ? '#ef5350' : '#26a69a';
      const downColor = colorScheme === 'cn' ? '#26a69a' : '#ef5350';
      return h(
        'svg',
        { className: 'us-candle', viewBox: `0 0 ${W} ${H}`, width: W, height: H, 'aria-hidden': 'true' },
        list.map((c, i) => {
          const cx = padX + slot * (i + 0.5);
          const color = c.close >= c.open ? upColor : downColor;
          const top = y(Math.max(c.open, c.close));
          const bottom = y(Math.min(c.open, c.close));
          const bodyH = Math.max(2, bottom - top);
          return h(
            'g',
            { key: i },
            h('line', { x1: cx, x2: cx, y1: y(c.high), y2: y(c.low), stroke: color, strokeWidth: 1.5 }),
            h('rect', { x: cx - bodyW / 2, y: top, width: bodyW, height: bodyH, fill: color }),
          );
        }),
      );
    }

    function SvgChart({ candles, colorScheme }) {
      const list = Array.isArray(candles) ? candles.slice(-160) : [];
      if (list.length === 0) return null;
      const W = 720, H = 300, padY = 12, padX = 6;
      const max = Math.max(...list.map((c) => c.high));
      const min = Math.min(...list.map((c) => c.low));
      const span = max - min || 1;
      const y = (v) => H - padY - ((v - min) / span) * (H - 2 * padY);
      const slot = (W - padX * 2) / list.length;
      const bodyW = Math.max(1.5, Math.min(8, slot * 0.6));
      const upColor = colorScheme === 'cn' ? '#ef5350' : '#26a69a';
      const downColor = colorScheme === 'cn' ? '#26a69a' : '#ef5350';
      return h(
        'svg',
        { className: 'us-chart-svg', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', role: 'img', 'aria-label': 'candlestick chart' },
        list.map((c, i) => {
          const cx = padX + slot * (i + 0.5);
          const color = c.close >= c.open ? upColor : downColor;
          const top = y(Math.max(c.open, c.close));
          const bottom = y(Math.min(c.open, c.close));
          const bodyH = Math.max(1, bottom - top);
          return h(
            'g',
            { key: i },
            h('line', { x1: cx, x2: cx, y1: y(c.high), y2: y(c.low), stroke: color, strokeWidth: 1 }),
            h('rect', { x: cx - bodyW / 2, y: top, width: bodyW, height: bodyH, fill: color }),
          );
        }),
      );
    }

    function SvgLine({ values, height = 84, color = '#3b82f6', zero = false, clampMin = null, clampMax = null }) {
      const nums = (values || []).map((v) => (typeof v === 'number' && Number.isFinite(v) ? v : null));
      let min = Infinity;
      let max = -Infinity;
      nums.forEach((v) => {
        if (v == null) return;
        if (v < min) min = v;
        if (v > max) max = v;
      });
      if (clampMin != null) min = Math.min(min, clampMin);
      if (clampMax != null) max = Math.max(max, clampMax);
      if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) return null;
      const W = 720;
      const pad = 8;
      const y = (v) => height - pad - ((v - min) / (max - min)) * (height - 2 * pad);
      const x = (i) => pad + (i / Math.max(1, nums.length - 1)) * (W - 2 * pad);
      let d = '';
      nums.forEach((v, i) => {
        if (v == null) return;
        d += `${d ? ' L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
      });
      return h(
        'svg',
        { className: 'us-chart-svg', viewBox: `0 0 ${W} ${height}`, preserveAspectRatio: 'none', style: { height: `${height}px` } },
        zero ? h('line', { x1: pad, x2: W - pad, y1: y(0), y2: y(0), stroke: '#9ca3af', strokeWidth: 0.8, strokeDasharray: '3 3' }) : null,
        h('path', { d, fill: 'none', stroke: color, strokeWidth: 1.5 }),
      );
    }

    function CandlestickChart({ candles, colorScheme, indicators }) {
      const ref = React.useRef(null);
      const usable = Array.isArray(candles) && candles.length > 0;
      const useLib = Boolean(lightcharts) && usable;

      React.useEffect(() => {
        if (!useLib || !ref.current) return;
        const { createChart } = lightcharts;
        const container = ref.current;
        const up = colorScheme === 'cn' ? '#ef5350' : '#26a69a';
        const down = colorScheme === 'cn' ? '#26a69a' : '#ef5350';
        const textColor = cssVar('--dsw-alias-label-secondary', '#8a8f98');
        const borderColor = cssVar('--dsw-alias-border-l1', 'rgba(128,128,128,0.2)');
        const chart = createChart(container, {
          width: container.clientWidth || 720,
          height: 320,
          layout: { background: { type: 'solid', color: 'transparent' }, textColor, fontSize: 11 },
          grid: { vertLines: { color: borderColor }, horzLines: { color: borderColor } },
          rightPriceScale: { borderColor },
          timeScale: { borderColor },
        });
        const series = chart.addCandlestickSeries({
          upColor: up, downColor: down, borderVisible: false, wickUpColor: up, wickDownColor: down,
        });
        series.setData(
          candles.map((c) => ({
            time: toDateStr(c.time),
            open: c.open, high: c.high, low: c.low, close: c.close,
          })),
        );
        const lineData = (arr) =>
          arr
            .map((v, i) => (v == null ? null : { time: toDateStr(candles[i].time), value: v }))
            .filter(Boolean);
        if (indicators && indicators.ma) {
          [[5, '#f59e0b'], [20, '#3b82f6'], [50, '#a855f7']].forEach(([n, color]) => {
            const line = chart.addLineSeries({
              color, lineWidth: 1, priceLineVisible: false, lastValueVisible: false,
            });
            line.setData(lineData(smaValues(candles, n)));
          });
        }
        if (indicators && indicators.boll) {
          const bands = bollValues(candles, 20, 2);
          [bands.upper, bands.mid, bands.lower].forEach((arr) => {
            const line = chart.addLineSeries({
              color: '#94a3b8', lineWidth: 1, lineStyle: 2,
              priceLineVisible: false, lastValueVisible: false,
            });
            line.setData(lineData(arr));
          });
        }
        chart.timeScale().fitContent();
        const onResize = () => chart.applyOptions({ width: container.clientWidth });
        window.addEventListener('resize', onResize);
        return () => {
          window.removeEventListener('resize', onResize);
          chart.remove();
        };
      }, [useLib, candles, colorScheme, indicators.ma, indicators.boll]);

      if (!usable) return h('p', { className: 'us-muted', style: { padding: '32px 0' } }, ' ');
      return useLib ? h('div', { className: 'us-chart', ref }) : h(SvgChart, { candles, colorScheme });
    }

    function IndicatorStrip({ candles, indicators }) {
      if (!Array.isArray(candles) || !candles.length) return null;
      const rsi = indicators && indicators.rsi ? rsiValues(candles, 14) : null;
      const macd = indicators && indicators.macd ? macdValues(candles) : null;
      if (!rsi && !macd) return null;
      return h(
        React.Fragment,
        null,
        rsi
          ? h('div', null,
              h('h4', { className: 'us-section-title', style: { marginTop: 14 } }, 'RSI(14)'),
              h(SvgLine, { values: rsi, color: '#3b82f6', clampMin: 0, clampMax: 100 }),
            )
          : null,
        macd
          ? h('div', null,
              h('h4', { className: 'us-section-title', style: { marginTop: 14 } }, 'MACD(12,26,9)'),
              h(SvgLine, { values: macd.macd, color: '#3b82f6', zero: true }),
              h(SvgLine, { values: macd.signal, color: '#f59e0b', zero: true }),
            )
          : null,
      );
    }

    const METRIC_KEYS = ['peTTM', 'marketCap', 'dividendYield', 'beta', 'epsTTM', 'roeTTM', 'week52High', 'week52Low', 'peForward'];

    function formatMetric(key, value) {
      if (value == null) return '—';
      if (key === 'marketCap' || key === 'revenueTTM' || key === 'fcfTTM') return fmtCap(value);
      if (key === 'dividendYield' || key === 'grossMargin' || key === 'netMargin' || key === 'roeTTM') {
        return fmtPercent(value);
      }
      if (key === 'week52High' || key === 'week52Low' || key === 'epsTTM') return fmtPrice(value);
      return Number(value).toFixed(2);
    }

    function KnowledgeCard({ entry, t, colorScheme }) {
      const patternCandles = entry.candles ?? (entry.ohlc ? [entry.ohlc] : null);
      const signal = entry.signal;
      return h(
        'article',
        { className: 'us-k-card' },
        patternCandles
          ? h('div', { className: 'us-k-visual' }, h(SvgPattern, { candles: patternCandles, colorScheme }))
          : null,
        h(
          'div',
          { className: 'us-k-main' },
          h(
            'div',
            { className: 'us-k-head' },
            h('span', { className: 'us-k-zh' }, entry.zh),
            entry.en ? h('span', { className: 'us-k-en' }, entry.en) : null,
            entry.abbr ? h('span', { className: 'us-k-abbr' }, entry.abbr) : null,
            signal ? h('span', { className: `us-k-signal ${signal}` }, t(`knowledge.${signal}`)) : null,
          ),
          h('p', { className: 'us-k-plain' }, entry.plain),
          entry.detail ? h('p', { className: 'us-k-detail' }, entry.detail) : null,
          entry.params ? h('p', { className: 'us-k-detail' }, `${t('knowledge.params')}：${entry.params}`) : null,
          entry.usage ? h('p', { className: 'us-k-detail' }, `${t('knowledge.usage')}：${entry.usage}`) : null,
        ),
      );
    }

    function KnowledgeView({ t, categories, entries, colorScheme }) {
      const [query, setQuery] = React.useState('');
      const [cat, setCat] = React.useState('');
      const q = query.trim().toLowerCase();
      const filtered = entries.filter((entry) => {
        if (cat && entry.category !== cat) return false;
        if (!q) return true;
        const haystack = [entry.zh, entry.en, entry.abbr, entry.plain, entry.detail, ...(entry.tags || [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
      return h(
        'div',
        { className: 'us-section' },
        h('input', {
          className: 'us-input us-k-search',
          value: query,
          placeholder: t('knowledge.searchPlaceholder'),
          onChange: (e) => setQuery(e.target.value),
        }),
        h(
          'div',
          { className: 'us-chips' },
          h('button', { className: `us-chip${cat === '' ? ' active' : ''}`, type: 'button', onClick: () => setCat('') }, t('knowledge.all')),
          categories.map((category) =>
            h('button', {
              key: category.id,
              className: `us-chip${cat === category.id ? ' active' : ''}`,
              type: 'button',
              onClick: () => setCat(category.id),
            }, category.nameZh),
          ),
        ),
        h('p', { className: 'us-muted' }, t('knowledge.count', { n: filtered.length })),
        filtered.length === 0
          ? h('p', { className: 'us-muted' }, t('knowledge.empty'))
          : h('div', { className: 'us-k-list' }, filtered.map((entry) =>
              h(KnowledgeCard, { key: entry.id, entry, t, colorScheme }),
            )),
      );
    }

    function calTimeLabel(time, t) {
      const str = String(time ?? '');
      if (str.startsWith('time-pre')) return t('calendar.pre');
      if (str.startsWith('time-after')) return t('calendar.post');
      return '—';
    }

    function CalendarView({ t }) {
      const [items, setItems] = React.useState([]);
      const [loading, setLoading] = React.useState(true);
      const [hasWatchlist, setHasWatchlist] = React.useState(true);

      React.useEffect(() => {
        api('/watchlist')
          .then((r) => {
            const symbols = r.symbols || [];
            if (!symbols.length) {
              setHasWatchlist(false);
              setLoading(false);
              return null;
            }
            return api(`/calendar?symbols=${encodeURIComponent(symbols.join(','))}`);
          })
          .then((r) => {
            if (r) setItems(r.items || []);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }, []);

      const addEarningsAlert = (item) => {
        fetch(`${API}/alerts`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ add: { type: 'earnings', symbol: item.symbol, earningsDate: item.date, daysBefore: 1 } }),
        }).catch(() => {});
      };

      if (!hasWatchlist) return h('p', { className: 'us-section us-muted' }, t('calendar.hint'));
      if (loading) return h('p', { className: 'us-section us-muted' }, '…');
      if (!items.length) return h('p', { className: 'us-section us-muted' }, t('calendar.empty'));

      return h(
        'section',
        { className: 'us-section' },
        h('h2', { className: 'us-section-title' }, t('calendar.title')),
        h('div', { className: 'us-cal-list' }, items.map((item) =>
          h('div', { className: 'us-cal-row', key: `${item.date}-${item.symbol}` },
            h('span', { className: 'us-cal-date' }, item.date),
            h('span', { className: 'us-cal-sym' }, item.symbol),
            h('span', { className: 'us-cal-name' }, item.name || ''),
            h('span', { className: 'us-cal-tag' }, calTimeLabel(item.time, t)),
            h('span', { className: 'us-cal-tag' }, `${t('calendar.eps')} ${item.epsForecast ?? '—'}`),
            h('button', { className: 'us-button us-button-ghost', type: 'button', onClick: () => addEarningsAlert(item) }, t('calendar.alert')),
          ),
        )),
      );
    }

    function AskView({ t, colorScheme }) {
      const [messages, setMessages] = React.useState([]);
      const [input, setInput] = React.useState('');
      const [busy, setBusy] = React.useState(false);

      const ask = (text) => {
        const q = (text ?? input).trim();
        if (!q || busy) return;
        setInput('');
        setMessages((prev) => [...prev, { role: 'q', text: q }]);
        setBusy(true);
        api(`/ask?q=${encodeURIComponent(q)}`)
          .then((r) => setMessages((prev) => [...prev, { role: 'a', data: r }]))
          .catch(() => setMessages((prev) => [...prev, { role: 'a', data: { type: 'error', text: '请求失败，请稍后再试。' } }]))
          .finally(() => setBusy(false));
      };

      const suggestions = ['什么是 ETF', 'PE 是什么', 'AAPL 行情', '美股交易时间'];

      return h(
        'div',
        { className: 'us-section' },
        messages.length === 0
          ? h(
              React.Fragment,
              null,
              h('p', { className: 'us-muted' }, t('ask.empty')),
              h('div', { className: 'us-sugg' }, suggestions.map((s) =>
                h('button', { key: s, className: 'us-chip', type: 'button', onClick: () => ask(s) }, s),
              )),
            )
          : h('div', { className: 'us-chat' }, messages.map((msg, i) =>
              msg.role === 'q'
                ? h('div', { className: 'us-msg q', key: i }, msg.text)
                : h(
                    'div',
                    { className: 'us-msg a', key: i },
                    h('div', null, (msg.data && msg.data.text) || ''),
                    msg.data && msg.data.entries && msg.data.entries.length
                      ? h('div', { style: { marginTop: 10 } }, msg.data.entries.map((entry) =>
                          h(KnowledgeCard, { key: entry.id, entry, t, colorScheme }),
                        ))
                      : null,
                    msg.data && msg.data.sources && msg.data.sources.length
                      ? h('div', { className: 'us-msg-src' }, `${t('ask.sources')}：` + msg.data.sources.map((s) => s.label).join('、'))
                      : null,
                    h('div', { className: 'us-msg-src' }, t('ask.disclaimer')),
                  ),
            )),
        h('div', { className: 'us-add-row', style: { marginTop: 12 } },
          h('input', {
            className: 'us-input', value: input, placeholder: t('ask.placeholder'),
            onChange: (e) => setInput(e.target.value),
            onKeyDown: (e) => { if (e.key === 'Enter') ask(); },
          }),
          h('button', { className: 'us-button us-button-primary', type: 'button', onClick: () => ask(), disabled: busy }, t('ask.send')),
        ),
      );
    }

    function CompareChart({ items }) {
      const lines = (items || []).filter((item) => Array.isArray(item.closes) && item.closes.length > 1);
      if (lines.length === 0) return null;
      const W = 720;
      const H = 240;
      const pad = 16;
      const COLORS = ['#3b82f6', '#f59e0b', '#22c55e', '#a855f7', '#ef4444', '#14b8a6', '#eab308', '#ec4899'];
      const series = lines.map((item, index) => {
        const base = item.closes[0] || 1;
        const points = item.closes.map((value) => (value / base) * 100);
        return { symbol: item.symbol, points, color: COLORS[index % COLORS.length] };
      });
      const all = series.flatMap((s) => s.points);
      const min = Math.min(...all);
      const max = Math.max(...all);
      const span = max - min || 1;
      const y = (v) => H - pad - ((v - min) / span) * (H - 2 * pad);
      const x = (i, len) => pad + (i / Math.max(1, len - 1)) * (W - 2 * pad);
      return h(
        'svg',
        { className: 'us-chart-svg', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', style: { height: '240px' } },
        series.map((s) => {
          let d = '';
          s.points.forEach((v, i) => {
            d += `${d ? ' L' : 'M'}${x(i, s.points.length).toFixed(1)} ${y(v).toFixed(1)}`;
          });
          return h('path', { key: s.symbol, d, fill: 'none', stroke: s.color, strokeWidth: 1.5 });
        }),
      );
    }

    function PortfolioView({ t }) {
      const [holdings, setHoldings] = React.useState([]);
      const [quotes, setQuotes] = React.useState({});
      const [form, setForm] = React.useState({ symbol: '', shares: '', cost: '' });
      const [compareInput, setCompareInput] = React.useState('');
      const [compare, setCompare] = React.useState(null);
      const [busy, setBusy] = React.useState(false);

      const loadQuotes = React.useCallback((list) => {
        const symbols = [...new Set(list.map((holding) => holding.symbol))];
        Promise.all(symbols.map((s) => api(`/quote?symbol=${encodeURIComponent(s)}`).catch(() => null)))
          .then((res) => {
            const next = {};
            res.forEach((r) => { if (r && r.symbol) next[r.symbol] = r; });
            setQuotes(next);
          });
      }, []);

      const loadHoldings = React.useCallback(() => {
        api('/portfolio').then((r) => {
          const list = r.holdings || [];
          setHoldings(list);
          loadQuotes(list);
        }).catch(() => {});
      }, [loadQuotes]);

      React.useEffect(() => { loadHoldings(); }, [loadHoldings]);

      const add = () => {
        const symbol = form.symbol.trim().toUpperCase();
        const shares = Number(form.shares);
        const cost = Number(form.cost);
        if (!symbol || !Number.isFinite(shares) || shares <= 0 || !Number.isFinite(cost) || cost < 0) return;
        fetch(`${API}/portfolio`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ add: { symbol, shares, cost } }),
        }).then((r) => r.json()).then((r) => {
          const list = r.holdings || [];
          setHoldings(list);
          loadQuotes(list);
          setForm({ symbol: '', shares: '', cost: '' });
        }).catch(() => {});
      };

      const remove = (id) => {
        fetch(`${API}/portfolio`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ remove: id }),
        }).then((r) => r.json()).then((r) => setHoldings(r.holdings || [])).catch(() => {});
      };

      const runCompare = (symbolsArg) => {
        const raw = String(symbolsArg ?? compareInput).trim();
        if (!raw) return;
        setBusy(true);
        api(`/compare?symbols=${encodeURIComponent(raw)}`)
          .then((r) => setCompare(r.items || []))
          .catch(() => setCompare([]))
          .finally(() => setBusy(false));
      };

      const rows = holdings.map((holding) => {
        const q = quotes[holding.symbol];
        const price = q ? q.price : null;
        const value = price != null ? holding.shares * price : null;
        const costValue = holding.shares * holding.cost;
        const pnl = value != null ? value - costValue : null;
        const pnlPct = pnl != null && costValue > 0 ? (pnl / costValue) * 100 : null;
        return { ...holding, price, value, costValue, pnl, pnlPct };
      });
      const totalValue = rows.reduce((sum, row) => sum + (row.value || 0), 0);
      const totalCost = rows.reduce((sum, row) => sum + row.costValue, 0);
      const totalPnl = totalValue - totalCost;
      const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : null;

      const download = (filename, text, type = 'text/plain;charset=utf-8') => {
        const blob = new Blob([text], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      };

      const exportCsv = () => {
        const header = 'symbol,shares,cost,price,value,pnl,pnlPct';
        const lines = rows.map((row) =>
          [row.symbol, row.shares, row.cost, row.price, row.value, row.pnl, row.pnlPct]
            .map((value) => (value == null ? '' : value))
            .join(','),
        );
        download('us-stocks-portfolio.csv', [header, ...lines].join('\n'));
      };
      const exportJson = () => {
        download(
          'us-stocks-portfolio.json',
          JSON.stringify({ holdings: rows, compare, total: { value: totalValue, cost: totalCost, pnl: totalPnl, pnlPct: totalPnlPct } }, null, 2),
          'application/json;charset=utf-8',
        );
      };

      return h('div', { className: 'us-section' },
        h('h2', { className: 'us-section-title' }, t('portfolio.title')),
        h('div', { className: 'us-add-row' },
          h('input', { className: 'us-input', value: form.symbol, placeholder: t('portfolio.symbol'), onChange: (e) => setForm({ ...form, symbol: e.target.value }) }),
          h('input', { className: 'us-input', type: 'number', value: form.shares, placeholder: t('portfolio.shares'), onChange: (e) => setForm({ ...form, shares: e.target.value }) }),
          h('input', { className: 'us-input', type: 'number', value: form.cost, placeholder: t('portfolio.cost'), onChange: (e) => setForm({ ...form, cost: e.target.value }) }),
          h('button', { className: 'us-button us-button-primary', type: 'button', onClick: add }, t('portfolio.add')),
        ),
        h('p', { className: 'us-muted', style: { marginTop: -4 } }, t('portfolio.hint')),
        rows.length === 0
          ? h('p', { className: 'us-muted' }, t('portfolio.empty'))
          : h('table', { className: 'us-table' },
              h('thead', null, h('tr', null,
                h('th', null, t('portfolio.symbol')),
                h('th', null, t('portfolio.shares')),
                h('th', null, t('portfolio.cost')),
                h('th', null, t('portfolio.price')),
                h('th', null, t('portfolio.value')),
                h('th', null, t('portfolio.pnl')),
                h('th', null, ''),
              )),
              h('tbody', null,
                rows.map((row) => h('tr', { key: row.id },
                  h('td', null, row.symbol),
                  h('td', null, row.shares),
                  h('td', null, fmtPrice(row.cost)),
                  h('td', null, fmtPrice(row.price)),
                  h('td', null, fmtPrice(row.value)),
                  h('td', { className: row.pnl != null && row.pnl >= 0 ? 'us-up' : 'us-down' },
                    row.pnl == null ? '—' : `${fmtSigned(row.pnl)} (${fmtSigned(row.pnlPct, '%')})`),
                  h('td', null, h('button', { className: 'us-button us-button-ghost', type: 'button', onClick: () => remove(row.id) }, t('portfolio.remove'))),
                )),
                h('tr', { className: 'us-table-total' },
                  h('td', null, t('portfolio.total')),
                  h('td', null, ''),
                  h('td', null, fmtPrice(totalCost)),
                  h('td', null, ''),
                  h('td', null, fmtPrice(totalValue)),
                  h('td', { className: totalPnl >= 0 ? 'us-up' : 'us-down' }, `${fmtSigned(totalPnl)} (${fmtSigned(totalPnlPct, '%')})`),
                  h('td', null, ''),
                ),
              ),
            ),

        h('h2', { className: 'us-section-title', style: { marginTop: 28 } }, t('compare.title')),
        h('div', { className: 'us-add-row' },
          h('input', { className: 'us-input', value: compareInput, placeholder: t('compare.placeholder'), onChange: (e) => setCompareInput(e.target.value) }),
          h('button', { className: 'us-button us-button-primary', type: 'button', onClick: () => runCompare(), disabled: busy }, t('compare.run')),
          h('button', { className: 'us-button', type: 'button', onClick: () => runCompare(holdings.map((holding) => holding.symbol).join(',')) }, t('portfolio.title')),
        ),
        compare == null
          ? h('p', { className: 'us-muted' }, t('compare.empty'))
          : compare.length === 0
            ? h('p', { className: 'us-muted' }, t('compare.empty'))
            : h(React.Fragment, null,
                h('table', { className: 'us-table' },
                  h('thead', null, h('tr', null,
                    h('th', null, t('compare.symbol')),
                    h('th', null, t('compare.price')),
                    h('th', null, t('compare.return')),
                    h('th', null, t('compare.cap')),
                    h('th', null, t('compare.pe')),
                    h('th', null, t('compare.dividend')),
                    h('th', null, t('compare.beta')),
                  )),
                  h('tbody', null, compare.map((item) => h('tr', { key: item.symbol },
                    h('td', null, item.symbol),
                    h('td', null, fmtPrice(item.price)),
                    h('td', { className: item.return1y != null && item.return1y >= 0 ? 'us-up' : 'us-down' },
                      item.return1y == null ? '—' : fmtSigned(item.return1y, '%')),
                    h('td', null, item.metrics && item.metrics.marketCap != null ? fmtCap(item.metrics.marketCap) : '—'),
                    h('td', null, item.metrics && item.metrics.peTTM != null ? Number(item.metrics.peTTM).toFixed(1) : '—'),
                    h('td', null, item.metrics && item.metrics.dividendYield != null ? fmtPercent(item.metrics.dividendYield) : '—'),
                    h('td', null, item.metrics && item.metrics.beta != null ? Number(item.metrics.beta).toFixed(2) : '—'),
                  ))),
                ),
                !compare.some((item) => item.hasFinnhub) ? h('p', { className: 'us-muted' }, t('detail.fundamentals.noKey')) : null,
                h(CompareChart, { items: compare }),
              ),

        h('h2', { className: 'us-section-title', style: { marginTop: 28 } }, t('export.title')),
        h('div', { className: 'us-add-row' },
          h('button', { className: 'us-button', type: 'button', onClick: exportCsv }, t('export.csv')),
          h('button', { className: 'us-button', type: 'button', onClick: exportJson }, t('export.json')),
        ),
        h('p', { className: 'us-muted', style: { marginTop: -4 } }, t('export.hint')),
      );
    }

    function AlertView({ t }) {
      const [clock, setClock] = React.useState(null);
      const [quiet, setQuiet] = React.useState(false);
      const [alerts, setAlerts] = React.useState([]);
      const [type, setType] = React.useState('market');
      const [event, setEvent] = React.useState('open');
      const [offsetMinutes, setOffsetMinutes] = React.useState(10);
      const [symbol, setSymbol] = React.useState('');
      const [condition, setCondition] = React.useState('above');
      const [price, setPrice] = React.useState('');
      const [quietEnabled, setQuietEnabled] = React.useState(false);
      const [quietFrom, setQuietFrom] = React.useState(23);
      const [quietTo, setQuietTo] = React.useState(7);

      const loadAlerts = React.useCallback(() => {
        api('/alerts').then((r) => setAlerts(r.alerts || [])).catch(() => {});
      }, []);

      const loadPrefs = React.useCallback(() => {
        api('/preferences').then((r) => {
          const q = (r.preferences && r.preferences.quietHours) || {};
          setQuietEnabled(q.enabled === true);
          if (q.from != null) setQuietFrom(Number(q.from));
          if (q.to != null) setQuietTo(Number(q.to));
        }).catch(() => {});
      }, []);

      React.useEffect(() => {
        const tick = () => {
          api('/market-clock').then((r) => {
            if (r && r.clock) { setClock(r.clock); setQuiet(Boolean(r.quiet)); }
          }).catch(() => {});
        };
        tick();
        loadAlerts();
        loadPrefs();
        const timer = setInterval(tick, 30000);
        return () => clearInterval(timer);
      }, [loadAlerts, loadPrefs]);

      const add = () => {
        let payload = null;
        if (type === 'market') {
          payload = { type: 'market', event, offsetMinutes: Number(offsetMinutes) || 0 };
        } else {
          const sym = symbol.trim().toUpperCase();
          const value = Number(price);
          if (!sym || !Number.isFinite(value) || value <= 0) return;
          payload = { type: 'price', symbol: sym, condition, price: value };
        }
        if (!payload) return;
        fetch(`${API}/alerts`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ add: payload }),
        }).then((r) => r.json()).then((r) => { setAlerts(r.alerts || []); setSymbol(''); setPrice(''); }).catch(() => {});
      };

      const remove = (id) => {
        fetch(`${API}/alerts`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ remove: id }),
        }).then((r) => r.json()).then((r) => setAlerts(r.alerts || [])).catch(() => {});
      };

      const saveQuiet = () => {
        fetch(`${API}/preferences`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ preferences: { quietHours: { enabled: quietEnabled, from: Number(quietFrom), to: Number(quietTo) } } }),
        }).catch(() => {});
      };

      const sessionLabel = clock
        ? { pre: t('clock.session.pre'), open: t('clock.session.open'), after: t('clock.session.after'), closed: t('clock.session.closed') }[clock.session]
        : '';
      const countdown = clock
        ? clock.minutesToClose != null
          ? `${t('clock.toClose')} ${clock.minutesToClose} ${t('clock.min')}`
          : clock.minutesToOpen != null
            ? `${t('clock.toOpen')} ${clock.minutesToOpen} ${t('clock.min')}`
            : ''
        : '';

      const alertLabel = (alert) => {
        if (alert.type === 'market') {
          return `${t('alert.marketLabel')}：${t(`alert.event.${alert.event}`)}（${t('alert.offset')} ${alert.offsetMinutes || 0} ${t('clock.min')}）`;
        }
        if (alert.type === 'earnings') return `${alert.symbol} · ${t('alert.earningsAlert')} ${alert.earningsDate}（${alert.daysBefore} 天前）`;
        return `${alert.symbol} · ${t('alert.priceAlert')} ${alert.condition === 'below' ? '≤' : '≥'} ${fmtPrice(alert.price)}`;
      };

      return h('div', { className: 'us-section' },
        h('div', { className: 'us-clock' },
          h('div', null,
            h('div', { className: 'us-clock-time' }, clock ? clock.et : '—'),
            h('div', { className: 'us-clock-meta' }, clock ? `ET · ${clock.date}` : ''),
          ),
          h('span', { className: 'us-clock-badge' }, sessionLabel),
          countdown ? h('span', { className: 'us-clock-badge' }, countdown) : null,
          clock ? h('span', { className: 'us-clock-badge' }, clock.isTradingDay ? t('clock.tradingDay') : t('clock.holiday')) : null,
          quiet ? h('span', { className: 'us-clock-badge' }, t('quiet.title')) : null,
        ),

        h('h2', { className: 'us-section-title', style: { marginTop: 24 } }, t('alert.create')),
        h('div', { className: 'us-toggles' },
          h('button', { className: `us-chip${type === 'market' ? ' active' : ''}`, type: 'button', onClick: () => setType('market') }, t('alert.type.market')),
          h('button', { className: `us-chip${type === 'price' ? ' active' : ''}`, type: 'button', onClick: () => setType('price') }, t('alert.type.price')),
        ),
        type === 'market'
          ? h('div', null,
              h('div', { className: 'us-chips', style: { marginTop: 10 } },
                ['pre', 'open', 'close', 'after'].map((ev) =>
                  h('button', { key: ev, className: `us-chip${event === ev ? ' active' : ''}`, type: 'button', onClick: () => setEvent(ev) }, t(`alert.event.${ev}`)),
                ),
              ),
              h('div', { className: 'us-add-row' },
                h('input', { className: 'us-input', type: 'number', value: offsetMinutes, onChange: (e) => setOffsetMinutes(e.target.value), placeholder: t('alert.offset') }),
                h('button', { className: 'us-button us-button-primary', type: 'button', onClick: add }, t('alert.add')),
              ),
            )
          : h('div', { className: 'us-add-row' },
              h('input', { className: 'us-input', value: symbol, placeholder: t('alert.symbolPlaceholder'), onChange: (e) => setSymbol(e.target.value) }),
              h('select', { className: 'us-input', style: { maxWidth: 110, flex: 'none' }, value: condition, onChange: (e) => setCondition(e.target.value) },
                h('option', { value: 'above' }, t('alert.above')),
                h('option', { value: 'below' }, t('alert.below')),
              ),
              h('input', { className: 'us-input', type: 'number', value: price, placeholder: t('alert.pricePlaceholder'), onChange: (e) => setPrice(e.target.value) }),
              h('button', { className: 'us-button us-button-primary', type: 'button', onClick: add }, t('alert.add')),
            ),

        h('h2', { className: 'us-section-title', style: { marginTop: 24 } }, t('alert.title')),
        alerts.length === 0
          ? h('p', { className: 'us-muted' }, t('alert.empty'))
          : alerts.map((alert) => h('div', { className: 'us-alert-row', key: alert.id },
              h('span', { className: 'us-alert-text' }, alertLabel(alert)),
              h('button', { className: 'us-button us-button-ghost', type: 'button', onClick: () => remove(alert.id) }, t('alert.delete')),
            )),

        h('h2', { className: 'us-section-title', style: { marginTop: 24 } }, t('quiet.title')),
        h('div', { className: 'us-add-row' },
          h('label', { className: 'us-muted', style: { display: 'flex', alignItems: 'center', gap: 8 } },
            h('input', { type: 'checkbox', checked: quietEnabled, onChange: (e) => setQuietEnabled(e.target.checked) }),
            t('quiet.enabled'),
          ),
          h('select', { className: 'us-input', style: { maxWidth: 90, flex: 'none' }, value: quietFrom, onChange: (e) => setQuietFrom(e.target.value) },
            Array.from({ length: 24 }, (_, i) => h('option', { key: i, value: i }, `${String(i).padStart(2, '0')}:00`)),
          ),
          h('span', { className: 'us-muted' }, '→'),
          h('select', { className: 'us-input', style: { maxWidth: 90, flex: 'none' }, value: quietTo, onChange: (e) => setQuietTo(e.target.value) },
            Array.from({ length: 24 }, (_, i) => h('option', { key: i, value: i }, `${String(i).padStart(2, '0')}:00`)),
          ),
          h('button', { className: 'us-button', type: 'button', onClick: saveQuiet }, t('quiet.save')),
        ),
        h('p', { className: 'us-muted', style: { marginTop: 6 } }, t('quiet.hint')),
      );
    }

    function MarketView({ t, colorScheme }) {
      const [indices, setIndices] = React.useState([]);
      const [watchlist, setWatchlist] = React.useState([]);
      const [quotes, setQuotes] = React.useState({});
      const [selected, setSelected] = React.useState(null);
      const [detail, setDetail] = React.useState(null);
      const [input, setInput] = React.useState('');
      const [indicators, setIndicators] = React.useState({ ma: true, boll: false, rsi: false, macd: false });
      const [alerts, setAlerts] = React.useState([]);
      const [alertPrice, setAlertPrice] = React.useState('');
      const [alertCondition, setAlertCondition] = React.useState('above');

      const loadQuotes = React.useCallback((symbols) => {
        setQuotes({});
        Promise.all(
          symbols.map((s) => api(`/quote?symbol=${encodeURIComponent(s)}`).catch(() => null)),
        ).then((list) => {
          const next = {};
          list.forEach((r) => {
            if (r && r.symbol) next[r.symbol] = r;
          });
          setQuotes(next);
        });
      }, []);

      const loadAlerts = React.useCallback(() => {
        api('/alerts').then((r) => setAlerts(r.alerts || [])).catch(() => {});
      }, []);

      React.useEffect(() => {
        api('/indices').then((r) => r.items && setIndices(r.items)).catch(() => {});
        api('/watchlist')
          .then((r) => {
            const symbols = r.symbols || [];
            setWatchlist(symbols);
            loadQuotes(symbols);
          })
          .catch(() => {});
        loadAlerts();
      }, [loadQuotes, loadAlerts]);

      React.useEffect(() => {
        if (!selected) {
          setDetail(null);
          return;
        }
        let cancelled = false;
        Promise.all([
          api(`/candles?symbol=${encodeURIComponent(selected)}&range=1y`).catch(() => null),
          api(`/fundamentals?symbol=${encodeURIComponent(selected)}`).catch(() => null),
        ]).then(([candles, fundamentals]) => {
          if (cancelled) return;
          setDetail(candles ? { ...candles, fundamentals } : null);
        });
        return () => { cancelled = true; };
      }, [selected]);

      const addSymbol = () => {
        const sym = input.trim().toUpperCase();
        if (!sym) return;
        fetch(`${API}/watchlist`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ add: sym }),
        })
          .then((r) => r.json())
          .then((r) => {
            const symbols = r.symbols || [];
            setWatchlist(symbols);
            loadQuotes(symbols);
            setInput('');
          })
          .catch(() => {});
      };

      const removeSymbol = (sym) => {
        fetch(`${API}/watchlist`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ remove: sym }),
        })
          .then((r) => r.json())
          .then((r) => {
            const symbols = r.symbols || [];
            setWatchlist(symbols);
            loadQuotes(symbols);
            if (selected === sym) setSelected(null);
          })
          .catch(() => {});
      };

      const addPriceAlert = () => {
        const price = Number(alertPrice);
        if (!selected || !Number.isFinite(price) || price <= 0) return;
        fetch(`${API}/alerts`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ add: { type: 'price', symbol: selected, condition: alertCondition, price } }),
        })
          .then((r) => r.json())
          .then((r) => {
            setAlerts(r.alerts || []);
            setAlertPrice('');
          })
          .catch(() => {});
      };

      const removeAlert = (id) => {
        fetch(`${API}/alerts`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ remove: id }),
        })
          .then((r) => r.json())
          .then((r) => setAlerts(r.alerts || []))
          .catch(() => {});
      };

      const toggleIndicator = (key) => setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));

      return h(
        React.Fragment,
        null,
        h(
          'section',
          { className: 'us-section' },
          h('h2', { className: 'us-section-title' }, t('indices.title')),
          h('div', { className: 'us-grid' }, indices.map((idx) => {
            const up = idx.change != null && idx.change >= 0;
            return h(
              'div',
              { className: 'us-card', key: idx.key || idx.symbol },
              h('div', { className: 'us-card-name' }, idx.name),
              h('div', { className: 'us-card-price' }, fmtPrice(idx.price)),
              h('div', { className: `us-card-change ${up ? 'us-up' : 'us-down'}` },
                `${fmtSigned(idx.change)} (${fmtSigned(idx.changePercent, '%')})`),
            );
          })),
        ),

        h(
          'section',
          { className: 'us-section' },
          h('h2', { className: 'us-section-title' }, t('watchlist.title')),
          h('div', { className: 'us-add-row' },
            h('input', {
              className: 'us-input', value: input, placeholder: t('watchlist.addPlaceholder'),
              onChange: (e) => setInput(e.target.value),
              onKeyDown: (e) => { if (e.key === 'Enter') addSymbol(); },
            }),
            h('button', { className: 'us-button us-button-primary', type: 'button', onClick: addSymbol }, t('watchlist.add')),
          ),
          watchlist.length === 0
            ? h('p', { className: 'us-muted' }, t('watchlist.empty'))
            : watchlist.map((sym) => {
                const q = quotes[sym];
                const up = q && q.change != null && q.change >= 0;
                return h(
                  'div',
                  { className: 'us-watch-row', key: sym, onClick: () => setSelected(sym) },
                  h('span', { className: 'us-watch-sym' }, sym),
                  h('span', { className: 'us-watch-change' },
                    q ? `${fmtSigned(q.change)} (${fmtSigned(q.changePercent, '%')})` : '…'),
                  h('span', { className: `us-watch-price ${up ? 'us-up' : 'us-down'}` }, q ? fmtPrice(q.price) : '—'),
                  h('button', {
                    className: 'us-button us-button-ghost', type: 'button',
                    onClick: (e) => { e.stopPropagation(); removeSymbol(sym); },
                  }, t('watchlist.remove')),
                );
              }),
        ),

        h(
          'section',
          { className: 'us-detail' },
          selected && detail && detail.symbol
            ? h(React.Fragment, null,
                h('div', { className: 'us-detail-head' },
                  h('span', { className: 'us-detail-sym' }, detail.symbol),
                  h('span', { className: 'us-detail-price' }, fmtPrice(detail.price)),
                  h('span', { className: detail.change != null && detail.change >= 0 ? 'us-up' : 'us-down' },
                    `${fmtSigned(detail.change)} (${fmtSigned(detail.changePercent, '%')})`),
                  detail.fetchedAt && h('span', { className: 'us-muted' },
                    new Date(detail.fetchedAt * 1000).toLocaleString()),
                ),
                h('h3', { className: 'us-section-title', style: { marginTop: 16 } }, t('detail.chart.title')),
                h('div', { className: 'us-toggles' },
                  ['ma', 'boll', 'rsi', 'macd'].map((key) =>
                    h('button', {
                      key,
                      className: `us-chip${indicators[key] ? ' active' : ''}`,
                      type: 'button',
                      onClick: () => toggleIndicator(key),
                    }, t(`indicator.${key}`)),
                  ),
                ),
                h(CandlestickChart, { candles: detail.candles, colorScheme, indicators }),
                h(IndicatorStrip, { candles: detail.candles, indicators }),
                h('h3', { className: 'us-section-title', style: { marginTop: 16 } }, t('detail.fundamentals.title')),
                detail.fundamentals && detail.fundamentals.error
                  ? h('p', { className: 'us-muted' }, t('detail.fundamentals.noKey'))
                  : detail.fundamentals
                    ? h('div', { className: 'us-metrics' }, METRIC_KEYS.map((key) =>
                        h('div', { className: 'us-metric', key },
                          h('div', { className: 'us-metric-label' }, t(`metric.${key}`)),
                          h('div', { className: 'us-metric-value' }, formatMetric(key, detail.fundamentals[key])),
                        ),
                      ))
                    : h('p', { className: 'us-muted' }, t('detail.fundamentals.noKey')),
              )
            : h('p', { className: 'us-muted' }, t('detail.select')),
        ),

        h(
          'section',
          { className: 'us-section' },
          h('h2', { className: 'us-section-title' }, t('alert.title')),
          selected
            ? h('div', { className: 'us-add-row' },
                h('input', {
                  className: 'us-input', value: alertPrice, placeholder: t('alert.pricePlaceholder'),
                  onChange: (e) => setAlertPrice(e.target.value),
                  onKeyDown: (e) => { if (e.key === 'Enter') addPriceAlert(); },
                }),
                h('select', {
                  className: 'us-input', style: { maxWidth: 110, flex: 'none' },
                  value: alertCondition, onChange: (e) => setAlertCondition(e.target.value),
                },
                  h('option', { value: 'above' }, t('alert.above')),
                  h('option', { value: 'below' }, t('alert.below')),
                ),
                h('button', { className: 'us-button us-button-primary', type: 'button', onClick: addPriceAlert }, t('alert.add')),
              )
            : h('p', { className: 'us-muted' }, t('detail.select')),
          alerts.length === 0
            ? h('p', { className: 'us-muted' }, t('alert.empty'))
            : alerts.map((alert) => h('div', { className: 'us-alert-row', key: alert.id },
                h('span', { className: 'us-alert-text' },
                  alert.type === 'market'
                    ? `${t('alert.marketLabel')}：${t(`alert.event.${alert.event}`)}`
                    : alert.type === 'earnings'
                      ? `${alert.symbol} · ${t('alert.earningsAlert')} ${alert.earningsDate}`
                      : `${alert.symbol} · ${t('alert.priceAlert')} ${alert.condition === 'below' ? '≤' : '≥'} ${fmtPrice(alert.price)}`),
                h('button', { className: 'us-button us-button-ghost', type: 'button', onClick: () => removeAlert(alert.id) }, t('alert.delete')),
              )),
        ),
      );
    }

    function notify(title, body) {
      try {
        if (typeof Notification === 'undefined') return;
        if (Notification.permission === 'granted') new Notification(title, { body });
      } catch (_error) {
        // ignore
      }
    }

    function Panel({ t }) {
      const [tab, setTab] = React.useState('market');
      const [knowledge, setKnowledge] = React.useState({ categories: [], entries: [] });
      const [prefs, setPrefs] = React.useState({ level: 'beginner', colorScheme: 'us' });
      const [due, setDue] = React.useState([]);
      const [showSettings, setShowSettings] = React.useState(false);
      const [finnhubKey, setFinnhubKey] = React.useState('');
      const [hasFinnhubKey, setHasFinnhubKey] = React.useState(false);
      const [savedFlash, setSavedFlash] = React.useState(false);

      React.useEffect(() => {
        api('/preferences')
          .then((r) => {
            if (r && r.preferences) setPrefs((p) => ({ ...p, ...r.preferences }));
            if (r) setHasFinnhubKey(Boolean(r.hasFinnhubKey));
          })
          .catch(() => {});
        api('/knowledge')
          .then((r) => {
            if (r && Array.isArray(r.entries)) {
              setKnowledge({ categories: r.categories || [], entries: r.entries });
            }
          })
          .catch(() => {});
      }, []);

      React.useEffect(() => {
        let stopped = false;
        const poll = () => {
          api('/alerts/due')
            .then((r) => {
              if (stopped || !r.due || !r.due.length) return;
              setDue((prev) => [...prev, ...r.due]);
              r.due.forEach((alert) => {
                const body = alert.type === 'price'
                  ? `${alert.symbol} ${alert.condition === 'below' ? '≤' : '≥'} ${alert.price}`
                  : alert.type === 'market'
                    ? t(`alert.event.${alert.event}`)
                    : `${alert.symbol} ${alert.earningsDate}`;
                notify(t('alert.due'), body);
              });
            })
            .catch(() => {});
        };
        poll();
        const timer = setInterval(poll, 60000);
        return () => { stopped = true; clearInterval(timer); };
      }, [t]);

      const enableNotify = () => {
        try {
          if (typeof Notification !== 'undefined' && Notification.requestPermission) {
            Notification.requestPermission();
          }
        } catch (_error) {
          // ignore
        }
      };

      const saveKey = () => {
        fetch(`${API}/preferences`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ preferences: { finnhubKey } }),
        })
          .then((r) => r.json())
          .then((r) => {
            setHasFinnhubKey(Boolean(r.hasFinnhubKey));
            setFinnhubKey('');
            setSavedFlash(true);
            setTimeout(() => setSavedFlash(false), 2000);
          })
          .catch(() => {});
      };

      const clearKey = () => {
        fetch(`${API}/preferences`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ preferences: { finnhubKey: '' } }),
        })
          .then((r) => r.json())
          .then((r) => {
            setHasFinnhubKey(Boolean(r.hasFinnhubKey));
            setFinnhubKey('');
          })
          .catch(() => {});
      };

      return h(
        'section',
        { className: 'us-page', 'aria-label': t('title') },
        h(
          'div',
          { className: 'us-content' },
          h(
            'header',
            null,
            h('div', { className: 'us-eyebrow-row' },
              h('span', { className: 'us-eyebrow' }, t('eyebrow')),
              h('span', { className: 'us-pill' },
                h('span', { className: 'us-dot', 'aria-hidden': 'true' }),
                t('eod.note')),
            ),
            h('h1', { className: 'us-title' }, t('title')),
            h('p', { className: 'us-lede' }, t('lede')),
          ),
          h('div', { className: 'us-tabs', role: 'tablist' },
            h('button', { className: `us-tab${tab === 'market' ? ' active' : ''}`, type: 'button', role: 'tab', onClick: () => setTab('market') }, t('tab.market')),
            h('button', { className: `us-tab${tab === 'ask' ? ' active' : ''}`, type: 'button', role: 'tab', onClick: () => setTab('ask') }, t('tab.ask')),
            h('button', { className: `us-tab${tab === 'calendar' ? ' active' : ''}`, type: 'button', role: 'tab', onClick: () => setTab('calendar') }, t('tab.calendar')),
            h('button', { className: `us-tab${tab === 'alerts' ? ' active' : ''}`, type: 'button', role: 'tab', onClick: () => setTab('alerts') }, t('tab.alerts')),
            h('button', { className: `us-tab${tab === 'portfolio' ? ' active' : ''}`, type: 'button', role: 'tab', onClick: () => setTab('portfolio') }, t('tab.portfolio')),
            h('button', { className: `us-tab${tab === 'knowledge' ? ' active' : ''}`, type: 'button', role: 'tab', onClick: () => setTab('knowledge') }, t('tab.knowledge')),
          ),
          showSettings
            ? h('section', { className: 'us-section' },
                h('h2', { className: 'us-section-title' }, t('settings.title')),
                h('div', { className: 'us-add-row' },
                  h('input', {
                    className: 'us-input', type: 'password', value: finnhubKey,
                    placeholder: t('settings.finnhubKey'),
                    onChange: (e) => setFinnhubKey(e.target.value),
                  }),
                  h('button', { className: 'us-button us-button-primary', type: 'button', onClick: saveKey }, t('settings.save')),
                  h('button', { className: 'us-button', type: 'button', onClick: clearKey }, t('settings.clear')),
                ),
                h('p', { className: 'us-muted' },
                  `${hasFinnhubKey ? t('settings.configured') : t('settings.notConfigured')} · ${t('settings.finnhubHint')}`),
                savedFlash ? h('p', { className: 'us-muted' }, t('settings.saved')) : null,
              )
            : null,
          due.length
            ? h('div', { className: 'us-due' },
                `${t('alert.due')}：` + due.map((alert) =>
                  alert.type === 'price'
                    ? `${alert.symbol} ${alert.condition === 'below' ? '≤' : '≥'} ${alert.price}`
                    : alert.type === 'market'
                      ? t(`alert.event.${alert.event}`)
                      : `${alert.symbol} ${alert.earningsDate}`,
                ).join('，'),
                h('button', { className: 'us-button us-button-ghost', type: 'button', onClick: () => setDue([]), style: { marginLeft: 8 } }, '✕'),
              )
            : null,
          tab === 'market'
            ? h(MarketView, { t, colorScheme: prefs.colorScheme })
            : tab === 'ask'
              ? h(AskView, { t, colorScheme: prefs.colorScheme })
              : tab === 'calendar'
                ? h(CalendarView, { t })
                : tab === 'alerts'
                  ? h(AlertView, { t })
                  : tab === 'portfolio'
                    ? h(PortfolioView, { t })
                    : h(KnowledgeView, {
                  t,
                  categories: knowledge.categories,
                  entries: knowledge.entries,
                  colorScheme: prefs.colorScheme,
                }),
          h('footer', { className: 'us-footer' },
            h('span', { className: 'us-mono' }, PACKAGE_NAME),
            h('span', null, `${t('footer.version', { version: VERSION })} · ${t('footer.slots')}`),
            h('span', { style: { display: 'flex', gap: 8 } },
              h('button', { className: 'us-button us-button-ghost', type: 'button', onClick: () => setShowSettings((v) => !v) }, t('settings.open')),
              h('button', { className: 'us-button us-button-ghost', type: 'button', onClick: enableNotify }, t('alert.enableNotify')),
            ),
          ),
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'layout'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, { en, zh }),
          'us-stocks: locale dictionaries',
        );

        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = PACKAGE_NAME;
          tag.textContent = css;
          document.head.appendChild(tag);
          return () => { tag.remove(); };
        }, 'us-stocks: styles');

        const t = ctx.locale.bind(NS);

        ctx.slots.inject('main', () =>
          ctx.slots.register(
            { name: 'main', key: PANEL_ID, locale: NS },
            Panel,
          ),
        );

        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            { name: 'sidebar.panellist', id: PANEL_ID, order: 20, locale: NS, label: () => t('label') },
            SidebarIcon,
          ),
        );
      },
    };
  },
});
