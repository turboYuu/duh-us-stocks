/**
 * dsh-us-stocks / host half
 *
 * 美股数据代理层（档位 A：免费日线 / 收盘 EOD）。
 *
 * 数据源（Yahoo 在中国大陆不可达，已改用下列源）：
 *   - Nasdaq 官方 API（api.nasdaq.com）      —— 个股报价、日线历史、纳斯达克指数、搜索
 *   - 东方财富（push2.eastmoney.com）        —— 标普 500 / 道琼斯 / 纳斯达克 100 指数
 *   - Finnhub（可选，需 FINNHUB_API_KEY）    —— 基本面、财报
 *   - SEC EDGAR（免费）                      —— 财报原文列表
 *
 * 只读行情/知识库路由对外公开；自选/偏好写盘到 $DSH_HOME/dsh-us-stocks.json。
 */

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

import { knowledge } from './knowledge/knowledge.js'

/** Stable cordis plugin name. */
export const name = 'us-stocks'

/** Services the routes need before they can mount. */
export const inject = ['webServer']

const API = '/api/us-stocks'
const ROUTES = {
  indices: `${API}/indices`,
  quote: `${API}/quote`,
  candles: `${API}/candles`,
  fundamentals: `${API}/fundamentals`,
  earnings: `${API}/earnings`,
  filings: `${API}/filings`,
  search: `${API}/search`,
  watchlist: `${API}/watchlist`,
  preferences: `${API}/preferences`,
  knowledge: `${API}/knowledge`,
  calendar: `${API}/calendar`,
  alerts: `${API}/alerts`,
  alertsDue: `${API}/alerts/due`,
  marketClock: `${API}/market-clock`,
  ask: `${API}/ask`,
  compare: `${API}/compare`,
  portfolio: `${API}/portfolio`,
  health: `${API}/health`,
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}

/** 浏览器 UA：Nasdaq / 东方财富 都更认浏览器特征。 */
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

/** SEC EDGAR 要求可识别的 User-Agent（名称 + 联系方式）。 */
const EDGAR_UA = 'dsh-us-stocks/0.1 (contact: example@example.com)'

const NASDAQ_HEADERS = {
  'user-agent': UA,
  accept: 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.9',
}

/** 指数：Nasdaq 覆盖纳指系，东方财富补标普/道指。VIX/罗素 暂无稳定免 key 源。 */
const INDICES = [
  { key: 'sp500', symbol: 'SPX', name: 'S&P 500', nameZh: '标普 500', source: 'eastmoney', secid: '100.SPX' },
  { key: 'dow', symbol: 'DJIA', name: 'Dow Jones', nameZh: '道琼斯工业', source: 'eastmoney', secid: '100.DJIA' },
  { key: 'ndx100', symbol: 'NDX', name: 'NASDAQ-100', nameZh: '纳斯达克 100', source: 'nasdaq' },
  { key: 'nasdaq', symbol: 'COMP', name: 'NASDAQ Composite', nameZh: '纳斯达克综合', source: 'nasdaq' },
]

/** K 线区间 → 自然日数。 */
const RANGE_DAYS = { '1mo': 31, '3mo': 92, '6mo': 183, '1y': 365, '5y': 1825, max: 3650 }

// ---------------------------------------------------------------------------
// 持久化（自选股 + 偏好），仿照 dsh-wallpaper 的写盘方式。
// ---------------------------------------------------------------------------

function statePath() {
  const home = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  return join(home, 'dsh-us-stocks.json')
}

async function readState() {
  try {
    const text = await readFile(statePath(), 'utf8')
    const parsed = JSON.parse(text)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

async function writeState(state) {
  const path = statePath()
  await mkdir(dirname(path), { recursive: true })
  const temporary = `${path}.${process.pid}.tmp`
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  await rename(temporary, path)
}

// ---------------------------------------------------------------------------
// 内存缓存
// ---------------------------------------------------------------------------

const cache = new Map() // key -> { value, expires }

function cacheGet(key) {
  const entry = cache.get(key)
  if (!entry) return undefined
  if (entry.expires <= Date.now()) {
    cache.delete(key)
    return undefined
  }
  return entry.value
}

function cacheSet(key, value, ttlMs) {
  cache.set(key, { value, expires: Date.now() + ttlMs })
}

// ---------------------------------------------------------------------------
// HTTP / 数据解析
// ---------------------------------------------------------------------------

async function fetchJson(url, headers = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA, ...headers },
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

/** "$342.37" / "44,703,810" / "+1.09%" -> number | null */
function parseMoney(value) {
  if (value == null) return null
  const cleaned = String(value).replace(/[$,+%\s]/g, '')
  if (cleaned === '' || cleaned === '-' || cleaned === '--') return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

/** Nasdaq 的 "MM/DD/YYYY" -> UNIX 秒（UTC 当日 00:00）。 */
function nasdaqDateToUnix(value) {
  const [month, day, year] = String(value).split('/')
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00Z`
  return Math.floor(new Date(iso).getTime() / 1000)
}

// ---------------------------------------------------------------------------
// Nasdaq 官方 API
// ---------------------------------------------------------------------------

const NASDAQ_BASE = 'https://api.nasdaq.com/api'

async function nasdaqQuote(symbol) {
  const url = `${NASDAQ_BASE}/quote/${encodeURIComponent(symbol)}/info?assetclass=stocks`
  const data = await fetchJson(url, NASDAQ_HEADERS)
  const d = data?.data
  if (!d) throw new Error(`no nasdaq quote for ${symbol}`)
  const p = d.primaryData ?? {}
  const price = parseMoney(p.lastSalePrice)
  const change = parseMoney(p.netChange)
  const changePercent = parseMoney(p.percentageChange)
  return {
    symbol: d.symbol ?? symbol,
    name: d.companyName ?? d.symbol ?? symbol,
    price,
    change,
    changePercent,
    prevClose: price != null && change != null ? price - change : null,
    currency: 'USD',
    marketTime: p.lastTradeTimestamp ?? null,
  }
}

/** 多股对比：报价 + 近一年涨跌幅 + 基本面（有 key 时）。 */
async function compareSymbols(symbols) {
  const token = await finnhubToken()
  return Promise.all(
    symbols.map(async (symbol) => {
      const [quote, candles] = await Promise.all([
        nasdaqQuote(symbol).catch(() => null),
        nasdaqHistorical(symbol, RANGE_DAYS['1y']).catch(() => []),
      ])
      const closes = (candles || [])
        .map((candle) => candle.close)
        .filter((value) => value != null)
      const first = closes[0]
      const last = closes[closes.length - 1]
      const return1y = first && last ? (last / first - 1) * 100 : null
      let metrics = null
      if (token) {
        try {
          const data = await finnhub(`/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all`, token)
          const m = data.metric ?? {}
          metrics = {
            marketCap: m.marketCapitalization ?? null,
            peTTM: m.peTTM ?? null,
            dividendYield: m.dividendYieldIndicatedAnnual ?? null,
            beta: m.beta ?? null,
            epsTTM: m.epsTTM ?? null,
            roeTTM: m.roeTTM ?? null,
          }
        } catch {
          metrics = null
        }
      }
      return {
        symbol,
        name: quote?.name ?? symbol,
        price: quote?.price ?? null,
        changePercent: quote?.changePercent ?? null,
        return1y,
        closes: closes.slice(-120),
        metrics,
        hasFinnhub: Boolean(token),
      }
    }),
  )
}

async function nasdaqIndex(symbol) {
  const url = `${NASDAQ_BASE}/quote/${encodeURIComponent(symbol)}/info?assetclass=index`
  const data = await fetchJson(url, NASDAQ_HEADERS)
  const d = data?.data
  if (!d) throw new Error(`no nasdaq index for ${symbol}`)
  const p = d.primaryData ?? {}
  return {
    price: parseMoney(p.lastSalePrice),
    change: parseMoney(p.netChange),
    changePercent: parseMoney(p.percentageChange),
  }
}

async function nasdaqHistorical(symbol, days) {
  const to = new Date()
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const fmt = (date) => date.toISOString().slice(0, 10)
  const url =
    `${NASDAQ_BASE}/quote/${encodeURIComponent(symbol)}/historical` +
    `?assetclass=stocks&fromdate=${fmt(from)}&todate=${fmt(to)}&limit=999`
  const data = await fetchJson(url, NASDAQ_HEADERS)
  const rows = data?.data?.tradesTable?.rows ?? []
  // rows 为「新 → 旧」，反转成「旧 → 新」供图表使用。
  const candles = rows
    .map((row) => ({
      time: nasdaqDateToUnix(row.date),
      open: parseMoney(row.open),
      high: parseMoney(row.high),
      low: parseMoney(row.low),
      close: parseMoney(row.close),
      volume: parseMoney(row.volume),
    }))
    .filter((candle) => candle.open != null && candle.close != null)
    .sort((a, b) => a.time - b.time)
  return candles
}

// ---------------------------------------------------------------------------
// 财报日历（Nasdaq 官方日历，免 key）
// ---------------------------------------------------------------------------

function addDays(dateStr, days) {
  return new Date(new Date(`${dateStr}T00:00:00Z`).getTime() + days * 86400000)
    .toISOString()
    .slice(0, 10)
}

function dateRange(fromStr, toStr) {
  const out = []
  const start = new Date(`${fromStr}T00:00:00Z`).getTime()
  const end = new Date(`${toStr}T00:00:00Z`).getTime()
  for (let t = start; t <= end; t += 86400000) out.push(new Date(t).toISOString().slice(0, 10))
  return out
}

async function nasdaqEarningsCalendar(date) {
  const url = `https://api.nasdaq.com/api/calendar/earnings?date=${encodeURIComponent(date)}`
  const data = await fetchJson(url, NASDAQ_HEADERS)
  const rows = data?.data?.rows ?? []
  return rows.map((row) => ({
    date,
    symbol: row.symbol,
    name: row.name,
    time: row.time ?? '',
    epsForecast: row.epsForecast ?? null,
    marketCap: row.marketCap ?? null,
    fiscalQuarterEnding: row.fiscalQuarterEnding ?? null,
    lastYearEPS: row.lastYearEPS ?? null,
  }))
}

// ---------------------------------------------------------------------------
// 市场时钟（美东时间 / 交易时段 / 节假日 / 免打扰）
// ---------------------------------------------------------------------------

const MARKET_HOLIDAYS = new Set([
  '2026-01-01', '2026-01-19', '2026-02-16', '2026-04-03', '2026-05-25',
  '2026-06-19', '2026-07-03', '2026-09-07', '2026-11-26', '2026-12-25',
  '2027-01-01', '2027-01-18', '2027-02-15', '2027-03-26', '2027-05-31',
  '2027-06-18', '2027-07-05', '2027-09-06', '2027-11-25', '2027-12-24',
  '2027-12-31',
  '2028-01-17', '2028-02-21', '2028-04-14', '2028-05-29', '2028-06-19',
  '2028-07-04', '2028-09-04', '2028-11-23', '2028-12-25',
])

/** 盘前 / 开盘 / 收盘 / 盘后 对应的 ET 分钟数。 */
const SESSION_MINUTES = { pre: 240, open: 570, close: 960, after: 1200 }

function etParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short',
  }).formatToParts(now)
  const get = (type) => parts.find((part) => part.type === type)?.value ?? ''
  const hour = Number(get('hour')) % 24
  const minute = Number(get('minute'))
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    weekday: get('weekday'),
    hour,
    minute,
    minutesOfDay: hour * 60 + minute,
    isWeekend: get('weekday') === 'Sat' || get('weekday') === 'Sun',
  }
}

function marketInfo(now = new Date()) {
  const et = etParts(now)
  const isHoliday = MARKET_HOLIDAYS.has(et.date)
  const isTradingDay = !et.isWeekend && !isHoliday
  let session = 'closed'
  if (isTradingDay) {
    if (et.minutesOfDay >= 240 && et.minutesOfDay < 570) session = 'pre'
    else if (et.minutesOfDay >= 570 && et.minutesOfDay < 960) session = 'open'
    else if (et.minutesOfDay >= 960 && et.minutesOfDay < 1200) session = 'after'
  }
  let minutesToOpen = null
  let minutesToClose = null
  if (session === 'open') {
    minutesToClose = 960 - et.minutesOfDay
  } else if (isTradingDay && et.minutesOfDay < 570) {
    minutesToOpen = 570 - et.minutesOfDay
  } else {
    for (let i = 1; i <= 10; i += 1) {
      const info = etParts(new Date(now.getTime() + i * 86400000))
      if (!info.isWeekend && !MARKET_HOLIDAYS.has(info.date)) {
        minutesToOpen = i * 1440 - et.minutesOfDay + 570
        break
      }
    }
  }
  return {
    et: `${String(et.hour).padStart(2, '0')}:${String(et.minute).padStart(2, '0')}`,
    date: et.date,
    weekday: et.weekday,
    isTradingDay,
    isHoliday,
    session,
    minutesSinceMidnight: et.minutesOfDay,
    minutesToOpen,
    minutesToClose,
  }
}

function isQuietNow(quietHours) {
  if (!quietHours || quietHours.enabled === false) return false
  const from = Number(quietHours.from)
  const to = Number(quietHours.to)
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === to) return false
  const hour = new Date().getHours()
  if (from < to) return hour >= from && hour < to
  return hour >= from || hour < to
}

// ---------------------------------------------------------------------------
// 东方财富（指数补位）
// ---------------------------------------------------------------------------

async function eastmoneyIndex(secid) {
  const url =
    `https://push2.eastmoney.com/api/qt/stock/get?secid=${encodeURIComponent(secid)}` +
    `&fltt=2&fields=f43,f57,f58,f169,f170,f60`
  const data = await fetchJson(url)
  const d = data?.data
  if (!d) throw new Error(`no eastmoney data for ${secid}`)
  return {
    price: typeof d.f43 === 'number' ? d.f43 : null,
    change: typeof d.f169 === 'number' ? d.f169 : null,
    changePercent: typeof d.f170 === 'number' ? d.f170 : null,
    prevClose: typeof d.f60 === 'number' ? d.f60 : null,
  }
}

// ---------------------------------------------------------------------------
// Finnhub（基本面 / 财报，需 key）
// ---------------------------------------------------------------------------

async function finnhubToken() {
  const env = process.env.FINNHUB_API_KEY ?? ''
  if (env) return env
  const state = await readState()
  return typeof state.preferences?.finnhubKey === 'string' ? state.preferences.finnhubKey : ''
}

async function finnhub(path, token) {
  const sep = path.includes('?') ? '&' : '?'
  const url = `https://finnhub.io/api/v1${path}${sep}token=${encodeURIComponent(token)}`
  return fetchJson(url)
}

// ---------------------------------------------------------------------------
// SEC EDGAR（财报原文，免费）
// ---------------------------------------------------------------------------

async function edgarFilings(symbol) {
  const map = cacheGet('edgar:company_tickers')
  let entries
  if (map) {
    entries = Object.values(map)
  } else {
    const data = await fetchJson('https://www.sec.gov/files/company_tickers.json', {
      'user-agent': EDGAR_UA,
      'accept-encoding': 'gzip, deflate',
    })
    cacheSet('edgar:company_tickers', data, 24 * 60 * 60 * 1000)
    entries = Object.values(data)
  }
  const hit = entries.find((item) => String(item.ticker).toUpperCase() === String(symbol).toUpperCase())
  if (!hit) return { symbol, filings: [], note: 'no-cik' }
  const padded = String(hit.cik_str).padStart(10, '0')
  const submissions = await fetchJson(`https://data.sec.gov/submissions/CIK${padded}.json`, {
    'user-agent': EDGAR_UA,
    'accept-encoding': 'gzip, deflate',
  })
  const recent = submissions?.filings?.recent ?? {}
  const forms = recent.form ?? []
  const dates = recent.filingDate ?? []
  const accession = recent.accessionNumber ?? []
  const primary = recent.primaryDocument ?? []
  const filings = forms.slice(0, 20).map((form, i) => ({
    form,
    date: dates[i] ?? null,
    accession: accession[i] ?? null,
    document: primary[i] ?? null,
  }))
  return { symbol, cik: submissions.cik ?? padded, name: submissions.name ?? symbol, filings }
}

// ---------------------------------------------------------------------------
// 知识库检索
// ---------------------------------------------------------------------------

function searchKnowledge(query, category) {
  const q = String(query ?? '').trim().toLowerCase()
  const cat = String(category ?? '').trim()
  return knowledge.entries.filter((entry) => {
    if (cat && entry.category !== cat) return false
    if (!q) return true
    const haystack = [
      entry.zh, entry.en, entry.abbr, entry.plain, entry.detail,
      ...(entry.tags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

/** 问答用的知识检索：归一化 + 相关度打分，三级兜底。 */
function knowledgeSearch(query) {
  const normalized = normalizeQuestion(query)
  const q = (normalized || String(query ?? '')).toLowerCase().trim()
  if (!q) return []
  const qn = q.replace(/[^a-z0-9]/g, '')
  const scored = knowledge.entries
    .map((entry) => {
      const zh = String(entry.zh ?? '').toLowerCase()
      const en = String(entry.en ?? '').toLowerCase()
      const abbr = String(entry.abbr ?? '').toLowerCase()
      const abbrNorm = abbr.replace(/[^a-z0-9]/g, '')
      const plain = String(entry.plain ?? '').toLowerCase()
      const detail = String(entry.detail ?? '').toLowerCase()
      const tags = (entry.tags ?? []).map((tag) => String(tag).toLowerCase())
      let score = 0
      if (zh === q) score += 100
      else if (zh.includes(q)) score += 60
      if (qn && abbrNorm === qn) score += 90
      else if (qn && abbrNorm.includes(qn)) score += 50
      if (en === q) score += 80
      else if (en.includes(q)) score += 40
      if (plain.includes(q)) score += 20
      if (detail.includes(q)) score += 10
      if (tags.some((tag) => tag.includes(q))) score += 5
      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  if (scored.length) return scored.map((item) => item.entry)

  const tokens = q.split(/\s+/).filter((token) => token.length >= 2)
  if (!tokens.length) return []
  const fallback = knowledge.entries
    .map((entry) => {
      const haystack = [entry.zh, entry.en, entry.abbr, entry.plain, entry.detail, ...(entry.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const score = tokens.filter((token) => haystack.includes(token.toLowerCase())).length
      return { entry, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  return fallback.map((item) => item.entry)
}

// ---------------------------------------------------------------------------
// 响应与请求工具
// ---------------------------------------------------------------------------

function describe(error) {
  return error instanceof Error ? error.message : String(error)
}

function sendJson(response, status, payload) {
  response.writeHead(status, JSON_HEADERS)
  response.end(JSON.stringify(payload))
}

async function readBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 1024 * 1024) return undefined
    chunks.push(chunk)
  }
  if (size === 0) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return undefined
  }
}

function queryString(request) {
  const url = new URL(request.url ?? '', 'http://localhost')
  return Object.fromEntries(url.searchParams.entries())
}

function isLocal(request) {
  const address = request.socket?.remoteAddress ?? ''
  return (
    address === '::1' ||
    address === '127.0.0.1' ||
    address.startsWith('127.') ||
    address.startsWith('::ffff:127.')
  )
}

/** 写接口的额外校验：本机 + JSON content-type + 同源，降低 CSRF 风险。 */
function isTrustedWrite(request) {
  if (!isLocal(request)) return false
  const type = request.headers['content-type'] ?? ''
  if (!type.includes('application/json')) return false
  const site = request.headers['sec-fetch-site']
  if (site && site !== 'same-origin') return false
  const origin = request.headers.origin
  if (origin) {
    try {
      const host = new URL(origin).hostname
      if (!['127.0.0.1', 'localhost', '::1'].includes(host)) return false
    } catch {
      return false
    }
  }
  return true
}

/** 统一包一层：带 fetchedAt 与错误信息，便于前端降级。 */
function withStamp(handler) {
  return async (request, response) => {
    try {
      const payload = await handler(request, response)
      sendJson(response, 200, { ...payload, fetchedAt: Math.floor(Date.now() / 1000) })
    } catch (error) {
      sendJson(response, 200, { error: describe(error), fetchedAt: Math.floor(Date.now() / 1000) })
    }
  }
}

// ---------------------------------------------------------------------------
// 提醒到期检测
// ---------------------------------------------------------------------------

async function evaluateDueAlerts() {
  const state = await readState()
  const preferences = state.preferences ?? {}
  if (isQuietNow(preferences.quietHours)) return []
  const alerts = Array.isArray(state.alerts) ? state.alerts : []
  const now = Date.now()
  const due = []
  let changed = false
  const clock = marketInfo()
  for (const alert of alerts) {
    try {
      if (alert.type === 'market') {
        // 开收盘提醒按日重复：同一天只触发一次；给 5 分钟宽限，避免轮询跨分钟漏触发
        const targetMinutes = SESSION_MINUTES[alert.event]
        if (targetMinutes == null) continue
        const offset = Math.min(Math.max(Number(alert.offsetMinutes) || 0, 0), targetMinutes)
        const target = targetMinutes - offset
        const inWindow =
          clock.isTradingDay &&
          clock.minutesSinceMidnight >= target &&
          clock.minutesSinceMidnight <= targetMinutes + 5
        if (inWindow && alert.lastFiredDate !== clock.date) {
          alert.lastFiredDate = clock.date
          alert.firedAt = now
          due.push(alert)
          changed = true
        }
        continue
      }
      if (alert.firedAt) continue
      if (alert.type === 'price') {
        const quote = await nasdaqQuote(alert.symbol)
        if (quote.price != null) {
          const hit =
            alert.condition === 'below' ? quote.price <= alert.price : quote.price >= alert.price
          if (hit) {
            alert.firedAt = now
            alert.firedPrice = quote.price
            due.push(alert)
            changed = true
          }
        }
      } else if (alert.type === 'earnings' && alert.earningsDate) {
        const trigger =
          new Date(`${alert.earningsDate}T00:00:00Z`).getTime() -
          (Number(alert.daysBefore) || 0) * 86400000
        if (now >= trigger) {
          alert.firedAt = now
          due.push(alert)
          changed = true
        }
      }
    } catch {
      // 单个提醒取数失败不影响其它
    }
  }
  if (changed) {
    state.alerts = alerts
    await writeState(state)
  }
  return due
}

// ---------------------------------------------------------------------------
// 智能问答（规则引擎，供 /ask 与会话工具共用）
// ---------------------------------------------------------------------------

function fmtNum(value) {
  if (value == null || !Number.isFinite(Number(value))) return '—'
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function fmtChange(value, percent = false) {
  if (value == null || !Number.isFinite(Number(value))) return '—'
  const sign = Number(value) > 0 ? '+' : ''
  return `${sign}${Number(value).toFixed(2)}${percent ? '%' : ''}`
}

function normalizeQuestion(text) {
  return String(text ?? '')
    .replace(
      /是什么意思|什么是|什么意思|怎么读|如何理解|请解释|解释一下|的定义|定义|怎么用|如何用|怎么|如何|what is|what's|meaning|explain|美股|帮我|请问|查一下|查|看|用|的|吗|呢|\?|？|。|，|,/gi,
      ' ',
    )
    .trim()
}

const TICKER_STOPWORDS = new Set([
  'PE', 'PB', 'PS', 'PEG', 'EPS', 'ROE', 'FCF', 'ETF', 'ADR', 'IPO', 'RSI', 'MACD',
  'BOLL', 'MA', 'EMA', 'IV', 'TTM', 'YOY', 'QOQ', 'YTD', 'DPS', 'SEC', 'VIX', 'AH',
  'PM', 'HOD', 'LOD', 'DST', 'US', 'USA', 'CN', 'AI', 'OK', 'ALL', 'NEW', 'ONE',
  'CEO', 'CFO', 'USD', 'GDP', 'CPI', 'FED',
])

const KNOWN_TICKERS = [
  'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'GOOG', 'META', 'NFLX', 'AMD',
  'INTC', 'BABA', 'PDD', 'JPM', 'WMT', 'DIS', 'BA', 'KO', 'PEP', 'NKE', 'ORCL',
  'CRM', 'ADBE', 'QCOM', 'AVGO', 'MU', 'PLTR', 'COIN', 'SPY', 'QQQ', 'VOO', 'IWM',
]

function detectSymbol(text) {
  const raw = String(text ?? '')
  const upper = raw.toUpperCase()
  for (const symbol of KNOWN_TICKERS) {
    if (new RegExp(`(^|[^A-Z])${symbol}([^A-Z]|$)`).test(upper)) return symbol
  }
  // 仅当用户原文里出现大写 ticker（如 AAPL / $TSLA）时才兜底，避免把 "US"/"AI" 等当代码
  const explicit = raw.match(/\$?([A-Z]{2,5})\b/)
  if (explicit && !TICKER_STOPWORDS.has(explicit[1])) return explicit[1]
  return null
}

/** 查某代码最近的财报日（带缓存，默认未来 14 天）。 */
async function nextEarnings(symbol, days = 14) {
  const key = `earnings:${String(symbol).toUpperCase()}:${days}`
  const cached = cacheGet(key)
  if (cached !== undefined) return cached
  const today = new Date().toISOString().slice(0, 10)
  const dates = dateRange(today, addDays(today, days))
  const lists = await Promise.all(dates.map((date) => nasdaqEarningsCalendar(date).catch(() => [])))
  const target = String(symbol).toUpperCase()
  const hit = lists.flat().find((row) => String(row.symbol).toUpperCase() === target)
  const result = hit ?? null
  cacheSet(key, result, 60 * 60 * 1000)
  return result
}

async function answerQuestion(text) {
  const raw = String(text ?? '').trim()
  if (!raw) return { type: 'unknown', text: '请输入问题。' }
  const lower = raw.toLowerCase()
  const symbol = detectSymbol(raw)
  const has = (words) => words.some((word) => lower.includes(word.toLowerCase()))

  if (symbol && has(['行情', '价格', '股价', '多少钱', 'quote', 'price', '涨跌', '现价'])) {
    try {
      const quote = await nasdaqQuote(symbol)
      return {
        type: 'quote',
        symbol,
        text: `${symbol} 最新收盘价 ${fmtNum(quote.price)} 美元，涨跌 ${fmtChange(quote.change)}（${fmtChange(quote.changePercent, true)}）。数据为收盘价，非实时。`,
        quote,
        sources: [{ label: 'Nasdaq', url: `https://www.nasdaq.com/market-activity/stocks/${symbol.toLowerCase()}` }],
      }
    } catch (error) {
      return { type: 'error', symbol, text: `查询 ${symbol} 行情失败：${describe(error)}` }
    }
  }

  if (symbol && has(['市盈率', 'pe', '市值', 'eps', '股息', '市净率', '基本面', '估值', 'fundamental', 'beta', '贝塔', 'roe'])) {
    const token = await finnhubToken()
    if (!token) {
      return {
        type: 'fundamentals',
        symbol,
        text: `基本面数据需要 Finnhub Key（设置环境变量 FINNHUB_API_KEY）。当前可先看 ${symbol} 的行情或 K 线。`,
        sources: [],
      }
    }
    try {
      const data = await finnhub(`/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all`, token)
      const metric = data.metric ?? {}
      const lines = [
        `PE(TTM)：${fmtNum(metric.peTTM)}`,
        `EPS(TTM)：${fmtNum(metric.epsTTM)}`,
        `市值：${fmtNum(metric.marketCapitalization)}`,
        `股息率：${fmtNum(metric.dividendYieldIndicatedAnnual)}%`,
        `ROE：${fmtNum(metric.roeTTM)}%`,
        `Beta：${fmtNum(metric.beta)}`,
      ]
      return {
        type: 'fundamentals',
        symbol,
        text: `${symbol} 基本面：\n${lines.join('\n')}`,
        metric,
        sources: [{ label: 'Finnhub', url: 'https://finnhub.io' }],
      }
    } catch (error) {
      return { type: 'error', symbol, text: `查询 ${symbol} 基本面失败：${describe(error)}` }
    }
  }

  if (symbol && has(['财报', '业绩', 'earnings', '发财报', '财报日期', '什么时候财报'])) {
    try {
      const hit = await nextEarnings(symbol, 14)
      return {
        type: 'earnings',
        symbol,
        text: hit
          ? `${symbol} 下一次财报：${hit.date}（${hit.time === 'time-pre-market' ? '盘前' : hit.time === 'time-after-hours' ? '盘后' : '时间未定'}），预期 EPS ${hit.epsForecast ?? '—'}。`
          : `未来 14 天未查到 ${symbol} 的财报日程（可能已过或尚未公布）。`,
        sources: [{ label: 'Nasdaq Calendar', url: 'https://www.nasdaq.com/market-activity/earnings' }],
      }
    } catch (error) {
      return { type: 'error', symbol, text: `查询 ${symbol} 财报失败：${describe(error)}` }
    }
  }

  const entries = knowledgeSearch(raw)
  if (entries.length) {
    const top = entries[0]
    return {
      type: 'knowledge',
      text: `${top.zh}（${top.en}${top.abbr ? ` · ${top.abbr}` : ''}）：${top.plain}`,
      entries: entries.slice(0, 5),
      sources: [{ label: '内置知识库' }],
    }
  }

  return {
    type: 'unknown',
    text:
      '我可以回答：术语解释（如「什么是 ETF」「PE 是什么」）、个股行情（「AAPL 行情」）、基本面（「AAPL 市盈率」）、财报日期（「AAPL 财报」）、市场规则（「美股交易时间」「熔断机制」）。',
    sources: [],
  }
}

// ---------------------------------------------------------------------------
// 路由处理器
// ---------------------------------------------------------------------------

const handlers = [
  {
    kind: 'exact',
    path: ROUTES.health,
    handler: (request, response) => {
      sendJson(response, 200, { ok: true, state: statePath() })
    },
  },
  {
    kind: 'exact',
    path: ROUTES.indices,
    handler: withStamp(async () => {
      const cached = cacheGet('indices')
      if (cached) return cached
      const items = await Promise.all(
        INDICES.map(async (index) => {
          try {
            const quote =
              index.source === 'eastmoney'
                ? await eastmoneyIndex(index.secid)
                : await nasdaqIndex(index.symbol)
            return { ...index, ...quote }
          } catch (error) {
            return { ...index, error: describe(error) }
          }
        }),
      )
      const payload = { items, isEOD: true }
      cacheSet('indices', payload, 30 * 60 * 1000)
      return payload
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.quote,
    handler: withStamp(async (request) => {
      const { symbol } = queryString(request)
      if (!symbol) return { error: 'missing symbol' }
      const key = `quote:${symbol.toUpperCase()}`
      const cached = cacheGet(key)
      if (cached) return cached
      const payload = { ...(await nasdaqQuote(symbol)), isEOD: true }
      cacheSet(key, payload, 30 * 60 * 1000)
      return payload
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.candles,
    handler: withStamp(async (request) => {
      const { symbol, range = '1y' } = queryString(request)
      if (!symbol) return { error: 'missing symbol' }
      const key = `candles:${symbol.toUpperCase()}:${range}`
      const cached = cacheGet(key)
      if (cached) return cached
      const days = RANGE_DAYS[range] ?? RANGE_DAYS['1y']
      const [quote, candles] = await Promise.all([
        nasdaqQuote(symbol),
        nasdaqHistorical(symbol, days),
      ])
      const payload = { ...quote, candles, isEOD: true }
      cacheSet(key, payload, 30 * 60 * 1000)
      return payload
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.fundamentals,
    handler: withStamp(async (request) => {
      const { symbol } = queryString(request)
      if (!symbol) return { error: 'missing symbol' }
      const token = await finnhubToken()
      if (!token) return { symbol, error: 'no-finnhub-key', note: '设置 FINNHUB_API_KEY 后可用' }
      const key = `fundamentals:${symbol.toUpperCase()}`
      const cached = cacheGet(key)
      if (cached) return cached
      const m = await finnhub(`/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all`, token)
      const payload = {
        symbol,
        peTTM: m.metric?.peTTM ?? null,
        peForward: m.metric?.peForward ?? null,
        pbTTM: m.metric?.pbTTM ?? null,
        psTTM: m.metric?.psTTM ?? null,
        roeTTM: m.metric?.roeTTM ?? null,
        epsTTM: m.metric?.epsTTM ?? null,
        marketCap: m.metric?.marketCapitalization ?? null,
        dividendYield: m.metric?.dividendYieldIndicatedAnnual ?? null,
        beta: m.metric?.beta ?? null,
        grossMargin: m.metric?.grossMarginTTM ?? null,
        netMargin: m.metric?.netProfitMarginTTM ?? null,
        revenueTTM: m.metric?.revenueTTM ?? null,
        fcfTTM: m.metric?.freeCashFlowTTM ?? null,
        week52High: m.metric?.['52WeekHigh'] ?? null,
        week52Low: m.metric?.['52WeekLow'] ?? null,
      }
      cacheSet(key, payload, 24 * 60 * 60 * 1000)
      return payload
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.earnings,
    handler: withStamp(async (request) => {
      const { symbol } = queryString(request)
      if (!symbol) return { error: 'missing symbol' }
      const token = await finnhubToken()
      if (!token) return { symbol, error: 'no-finnhub-key' }
      const data = await finnhub(`/stock/earnings?symbol=${encodeURIComponent(symbol)}`, token)
      return { symbol, earnings: Array.isArray(data) ? data.slice(0, 4) : [] }
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.filings,
    handler: withStamp(async (request) => {
      const { symbol } = queryString(request)
      if (!symbol) return { error: 'missing symbol' }
      return edgarFilings(symbol)
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.search,
    handler: withStamp(async (request) => {
      const { q } = queryString(request)
      if (!q) return { items: [] }
      try {
        const data = await fetchJson(
          `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=10&newsCount=0`,
          NASDAQ_HEADERS,
        )
        const items = (data.quotes ?? [])
          .filter((item) => ['EQUITY', 'ETF', 'INDEX'].includes(item.quoteType))
          .map((item) => ({
            symbol: item.symbol,
            name: item.shortname ?? item.longname ?? item.symbol,
            type: item.quoteType,
            exchange: item.exchange ?? '',
          }))
        return { items }
      } catch {
        return { items: [], note: 'search source unavailable' }
      }
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.knowledge,
    handler: withStamp(async (request) => {
      const { q, category } = queryString(request)
      return {
        version: knowledge.version,
        updated: knowledge.updated,
        categories: knowledge.categories,
        entries: searchKnowledge(q, category),
      }
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.calendar,
    handler: withStamp(async (request) => {
      const { symbols = '', from, to } = queryString(request)
      const today = new Date().toISOString().slice(0, 10)
      const fromDate = from || today
      const toDate = to || addDays(today, 7)
      const key = `calendar:${fromDate}:${toDate}`
      let items = cacheGet(key)
      if (!items) {
        const dates = dateRange(fromDate, toDate)
        const lists = await Promise.all(
          dates.map((date) => nasdaqEarningsCalendar(date).catch(() => [])),
        )
        items = lists.flat()
        cacheSet(key, items, 60 * 60 * 1000)
      }
      const filter = String(symbols)
        .toUpperCase()
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const filtered = filter.length
        ? items.filter((item) => filter.includes(String(item.symbol).toUpperCase()))
        : items
      return { items: filtered, from: fromDate, to: toDate }
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.alerts,
    handler: async (request, response) => {
      if (request.method === 'GET') {
        const state = await readState()
        sendJson(response, 200, { alerts: Array.isArray(state.alerts) ? state.alerts : [] })
        return
      }
      if (request.method !== 'POST') {
        sendJson(response, 405, { error: `method not allowed: ${request.method}` })
        return
      }
      if (!isTrustedWrite(request)) {
        sendJson(response, 403, { error: 'local-only' })
        return
      }
      const body = await readBody(request)
      const state = await readState()
      let alerts = Array.isArray(state.alerts) ? state.alerts : []
      if (body?.remove) {
        alerts = alerts.filter((alert) => alert.id !== body.remove)
      } else if (body?.add && typeof body.add === 'object') {
        const input = body.add
        const type = ['price', 'earnings', 'market'].includes(input.type) ? input.type : 'price'
        const alert = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          symbol: String(input.symbol ?? '').toUpperCase(),
          condition: input.condition === 'below' ? 'below' : 'above',
          price: input.price == null ? null : Number(input.price),
          earningsDate: input.earningsDate ?? null,
          daysBefore: Number(input.daysBefore) || 0,
          event: ['pre', 'open', 'close', 'after'].includes(input.event) ? input.event : 'open',
          offsetMinutes: Math.min(Math.max(Number(input.offsetMinutes) || 0, 0), 720),
          createdAt: Date.now(),
          firedAt: null,
        }
        if (type === 'market' || alert.symbol) alerts = [...alerts, alert]
      }
      state.alerts = alerts
      await writeState(state)
      sendJson(response, 200, { alerts })
    },
  },
  {
    kind: 'exact',
    path: ROUTES.alertsDue,
    handler: withStamp(async () => {
      const due = await evaluateDueAlerts()
      return { due }
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.marketClock,
    handler: withStamp(async () => {
      const state = await readState()
      const preferences = state.preferences ?? {}
      return { clock: marketInfo(), quiet: isQuietNow(preferences.quietHours) }
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.ask,
    handler: withStamp(async (request) => {
      const { q } = queryString(request)
      const result = await answerQuestion(q)
      return { ...result, disclaimer: '仅供参考，不构成投资建议。' }
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.compare,
    handler: withStamp(async (request) => {
      const { symbols = '' } = queryString(request)
      const list = String(symbols)
        .toUpperCase()
        .split(',')
        .map((symbol) => symbol.trim())
        .filter(Boolean)
        .slice(0, 8)
      if (!list.length) return { items: [] }
      const key = `compare:${[...new Set(list)].sort().join(',')}`
      const cached = cacheGet(key)
      if (cached) return cached
      const items = await compareSymbols(list)
      const payload = { items }
      cacheSet(key, payload, 10 * 60 * 1000)
      return payload
    }),
  },
  {
    kind: 'exact',
    path: ROUTES.portfolio,
    handler: async (request, response) => {
      if (request.method === 'GET') {
        const state = await readState()
        sendJson(response, 200, {
          holdings: Array.isArray(state.portfolio) ? state.portfolio : [],
        })
        return
      }
      if (request.method !== 'POST') {
        sendJson(response, 405, { error: `method not allowed: ${request.method}` })
        return
      }
      if (!isTrustedWrite(request)) {
        sendJson(response, 403, { error: 'local-only' })
        return
      }
      const body = await readBody(request)
      const state = await readState()
      let holdings = Array.isArray(state.portfolio) ? state.portfolio : []
      if (body?.clear) {
        holdings = []
      } else if (body?.remove) {
        holdings = holdings.filter((holding) => holding.id !== body.remove)
      } else if (body?.add && typeof body.add === 'object') {
        const symbol = String(body.add.symbol ?? '').toUpperCase()
        const shares = Number(body.add.shares)
        const cost = Number(body.add.cost)
        if (symbol && Number.isFinite(shares) && shares > 0 && Number.isFinite(cost) && cost >= 0) {
          holdings = [
            ...holdings,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              symbol,
              shares,
              cost,
            },
          ]
        }
      } else if (body?.update && typeof body.update === 'object') {
        const target = body.update
        holdings = holdings.map((holding) =>
          holding.id === target.id
            ? {
                ...holding,
                shares: Number(target.shares) > 0 ? Number(target.shares) : holding.shares,
                cost: Number(target.cost) >= 0 ? Number(target.cost) : holding.cost,
              }
            : holding,
        )
      }
      state.portfolio = holdings
      await writeState(state)
      sendJson(response, 200, { holdings })
    },
  },
  {
    kind: 'exact',
    path: ROUTES.watchlist,
    handler: async (request, response) => {
      if (request.method === 'GET') {
        const state = await readState()
        sendJson(response, 200, { symbols: Array.isArray(state.watchlist) ? state.watchlist : [] })
        return
      }
      if (request.method !== 'POST') {
        sendJson(response, 405, { error: `method not allowed: ${request.method}` })
        return
      }
      if (!isTrustedWrite(request)) {
        sendJson(response, 403, { error: 'local-only' })
        return
      }
      const body = await readBody(request)
      const state = await readState()
      let symbols = Array.isArray(state.watchlist) ? state.watchlist : []
      if (Array.isArray(body?.symbols)) {
        symbols = body.symbols.map((s) => String(s).toUpperCase()).filter(Boolean)
      } else if (typeof body?.add === 'string') {
        const sym = body.add.toUpperCase()
        if (!symbols.includes(sym)) symbols = [...symbols, sym]
      } else if (typeof body?.remove === 'string') {
        const sym = body.remove.toUpperCase()
        symbols = symbols.filter((s) => s !== sym)
      }
      state.watchlist = [...new Set(symbols)]
      await writeState(state)
      sendJson(response, 200, { symbols: state.watchlist })
    },
  },
  {
    kind: 'exact',
    path: ROUTES.preferences,
    handler: async (request, response) => {
      if (request.method === 'GET') {
        const state = await readState()
        const preferences = state.preferences ?? {}
        const hasFinnhubKey = Boolean(preferences.finnhubKey || process.env.FINNHUB_API_KEY)
        delete preferences.finnhubKey
        sendJson(response, 200, { preferences, hasFinnhubKey })
        return
      }
      if (request.method !== 'POST') {
        sendJson(response, 405, { error: `method not allowed: ${request.method}` })
        return
      }
      if (!isTrustedWrite(request)) {
        sendJson(response, 403, { error: 'local-only' })
        return
      }
      const body = await readBody(request)
      const state = await readState()
      const merged = { ...(state.preferences ?? {}), ...(body?.preferences ?? {}) }
      if (!['beginner', 'intermediate', 'advanced'].includes(merged.level)) {
        merged.level = 'beginner'
      }
      if (!['us', 'cn'].includes(merged.colorScheme)) merged.colorScheme = 'us'
      if (typeof merged.finnhubKey === 'string') {
        merged.finnhubKey = merged.finnhubKey.trim()
        if (merged.finnhubKey === '') delete merged.finnhubKey
      }
      if (merged.quietHours && typeof merged.quietHours === 'object') {
        const clamp = (value) => Math.min(23, Math.max(0, Number(value) || 0))
        merged.quietHours = {
          enabled: merged.quietHours.enabled !== false,
          from: clamp(merged.quietHours.from),
          to: clamp(merged.quietHours.to),
        }
      }
      state.preferences = merged
      await writeState(state)
      const out = { ...merged }
      const hasFinnhubKey = Boolean(out.finnhubKey || process.env.FINNHUB_API_KEY)
      delete out.finnhubKey
      sendJson(response, 200, { preferences: out, hasFinnhubKey })
    },
  },
]

// ---------------------------------------------------------------------------
// 挂载（每个进程一次）
// ---------------------------------------------------------------------------

const MOUNTED = Symbol.for('dsh.web.mounted-dsh-us-stocks')

export function apply(ctx) {
  const registry = globalThis
  if (registry[MOUNTED] === true) return
  registry[MOUNTED] = true
  ctx.effect(
    () => () => {
      registry[MOUNTED] = false
    },
    'us-stocks: mount guard',
  )

  ctx.effect(() => {
    const disposers = handlers.map((route) => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'us-stocks: routes')
}

export { ROUTES }
