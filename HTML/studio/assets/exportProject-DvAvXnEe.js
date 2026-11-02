import{a as e,c as t,d as n,i as r,l as i,n as a,o,r as s,s as c,t as l,u}from"./index-BhV6qf4E.js";var d=`/**
 * Standalone runtime bundled by esbuild-wasm at export time.
 *
 * The generated HTML embeds a JSON config referencing node events; this file
 * has no imports and is safe to compile into a classic IIFE for file:// usage.
 */

interface LumenNativeAction {
  type: 'navigate' | 'open-url' | 'message'
  pageId?: string
  url?: string
  newTab?: boolean
  text?: string
}

interface LumenNativeConfig {
  projectName: string
  initialPageId: string
  actions: Record<string, Record<string, LumenNativeAction[]>>
  pageTitles: Record<string, string>
}

interface ViewTransitionLike {
  finished: Promise<void>
}

type DocumentWithTransitions = Document & {
  startViewTransition?: (callback: () => void) => ViewTransitionLike
}

const configElement = document.getElementById('lumen-runtime-config')
let config: LumenNativeConfig = {
  projectName: '',
  initialPageId: '',
  actions: {},
  pageTitles: {},
}

if (configElement?.textContent) {
  try {
    config = JSON.parse(configElement.textContent) as LumenNativeConfig
  } catch {
    config = { projectName: '', initialPageId: '', actions: {}, pageTitles: {} }
  }
}

const sections = Array.from(document.querySelectorAll<HTMLElement>('.lumen-page'))
const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']
let currentPageId = ''
let toastTimer = 0

function isSafeUrl(rawUrl: string): boolean {
  const value = rawUrl.trim()
  if (!value) return false
  if (value.startsWith('#')) return true
  try {
    return allowedProtocols.includes(new URL(value, window.location.href).protocol)
  } catch {
    return false
  }
}

function showToast(text: string): void {
  let toast = document.querySelector<HTMLElement>('.lumen-toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.className = 'lumen-toast'
    toast.setAttribute('role', 'status')
    document.body.appendChild(toast)
  }
  toast.textContent = text
  window.clearTimeout(toastTimer)
  requestAnimationFrame(() => toast?.classList.add('is-visible'))
  toastTimer = window.setTimeout(() => {
    toast?.classList.remove('is-visible')
  }, 3400)
}

function applyPage(pageId: string): boolean {
  const target = sections.find((section) => section.dataset.pageId === pageId)
  if (!target) return false
  for (const section of sections) {
    const active = section === target
    section.hidden = !active
    section.classList.toggle('is-active', active)
    section.setAttribute('aria-hidden', active ? 'false' : 'true')
  }
  currentPageId = pageId
  const pageTitle = config.pageTitles[pageId] || config.projectName
  document.title = config.projectName ? \`\${pageTitle} · \${config.projectName}\` : pageTitle
  window.scrollTo(0, 0)
  return true
}

function showPage(pageId: string, transition = true): void {
  if (!pageId || pageId === currentPageId) return
  const doc = document as DocumentWithTransitions
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (transition && doc.startViewTransition && !reduced) {
    try {
      const handle = doc.startViewTransition(() => {
        applyPage(pageId)
      })
      void handle.finished.catch(() => undefined)
    } catch {
      applyPage(pageId)
    }
  } else {
    applyPage(pageId)
  }
}

function openExternal(url: string, newTab: boolean): void {
  if (!isSafeUrl(url)) {
    showToast('链接地址无效，仅支持 http / https / mailto / tel。')
    return
  }
  window.open(url, newTab ? '_blank' : '_self', 'noopener,noreferrer')
}

function execute(actions: LumenNativeAction[]): void {
  for (const action of actions) {
    if (action.type === 'navigate' && action.pageId) {
      showPage(action.pageId)
    } else if (action.type === 'open-url' && action.url) {
      openExternal(action.url, Boolean(action.newTab))
    } else if (action.type === 'message') {
      showToast(action.text || '')
    }
  }
}

function bindEvents(): void {
  const wrappers = document.querySelectorAll<HTMLElement>('[data-node-id]')
  wrappers.forEach((wrapper) => {
    const nodeId = wrapper.dataset.nodeId
    if (!nodeId) return
    const nodeActions = config.actions[nodeId]
    if (!nodeActions) return
    for (const [eventName, actions] of Object.entries(nodeActions)) {
      if (!actions.length) continue
      const domEvent =
        eventName === 'focus' ? 'focusin' : eventName === 'blur' ? 'focusout' : eventName
      wrapper.addEventListener(domEvent, (event) => {
        const target = event.target
        if (!(target instanceof Element)) return
        const nearest = target.closest('[data-node-id]')
        if (nearest !== wrapper) return
        execute(actions)
      })
    }
  })
}

function init(): void {
  if (!sections.length) return
  const initial = config.initialPageId || sections[0]?.dataset.pageId || ''
  applyPage(initial)
  bindEvents()
  document.documentElement.dataset.lumenRuntime = 'ready'
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true })
} else {
  init()
}
`,f=null,p=0,m=new Map;function h(e){if(f&&f.terminate(),f=null,e){for(let t of m.values())clearTimeout(t.timer),t.reject(e);m.clear()}}function g(){return f||(f=new Worker(new URL(new URL(`build.worker-BXpdxzJH.js`,import.meta.url).href,``+import.meta.url),{type:`module`,name:`lumen-esbuild`}),f.onmessage=e=>{let t=e.data,n=m.get(t.id);n&&(m.delete(t.id),clearTimeout(n.timer),t.ok?n.resolve({js:t.js??``,css:t.css??``}):n.reject(Error(t.error||`esbuild 打包失败`)))},f.onerror=e=>{h(Error(e.message||`esbuild Web Worker 初始化失败`))},f)}function _(e,t,n){let r=g();return new Promise((i,a)=>{let o=`build-${Date.now()}-${p++}`,s=setTimeout(()=>{m.delete(o),a(Error(`esbuild 打包超时（120s），请重试。`))},12e4);m.set(o,{resolve:i,reject:a,timer:s}),r.postMessage({id:o,jsSource:e,cssSource:t,minify:n})})}function v(e){e.querySelectorAll(`input`).forEach(e=>{e.type===`checkbox`||e.type===`radio`?e.checked?e.setAttribute(`checked`,``):e.removeAttribute(`checked`):e.setAttribute(`value`,e.value),e.disabled?e.setAttribute(`disabled`,``):e.removeAttribute(`disabled`)}),e.querySelectorAll(`textarea`).forEach(e=>{e.textContent=e.value}),e.querySelectorAll(`select`).forEach(e=>{for(let t of Array.from(e.options))t.selected?t.setAttribute(`selected`,``):t.removeAttribute(`selected`);e.disabled?e.setAttribute(`disabled`,``):e.removeAttribute(`disabled`)}),e.querySelectorAll(`button`).forEach(e=>{e.disabled?e.setAttribute(`disabled`,``):e.removeAttribute(`disabled`)})}function y(e){let t={};for(let n of e.pages){let e=n=>{for(let r of n)Object.keys(r.events).length&&(t[r.id]=r.events),r.children.length&&e(r.children)};e(n.nodes)}return t}async function ee(t){let r=document.createElement(`div`);r.setAttribute(`aria-hidden`,`true`),r.style.cssText=`position:fixed;left:-200000px;top:0;visibility:hidden;pointer-events:none;z-index:-1;`,document.body.appendChild(r);let a=[];try{for(let o of t.pages){let s=document.createElement(`div`);s.style.width=`${o.width}px`,s.style.height=`${o.height}px`,r.appendChild(s);let c=i({render:()=>u(e,{page:o,theme:t.theme,mode:`preview`})});c.mount(s),await n(),await new Promise(e=>requestAnimationFrame(()=>e())),v(s),a.push({page:o,markup:s.innerHTML}),c.unmount(),s.remove()}}finally{r.remove()}return{pages:a,actions:y(t)}}var b=`html, body { width: 100%; min-height: 100%; margin: 0; }
body { overflow-x: auto; background: #0b1017; }
.lumen-export-root { min-height: 100vh; width: 100%; }
.lumen-page { position: relative; display: none; margin: 0 auto; overflow: hidden; }
.lumen-page.is-active { display: block; view-transition-name: lumen-page; }
.lumen-page[hidden] { display: none !important; }
.lumen-page:focus { outline: none; }
.lumen-toast {
  position: fixed; left: 50%; bottom: 28px; z-index: 9999; max-width: min(440px, calc(100vw - 32px));
  padding: 11px 16px; border: 1px solid rgba(255,255,255,.16); border-radius: 9px;
  background: rgba(12,17,24,.92); color: #f5f7fb; font: 13px/1.5 system-ui, sans-serif;
  box-shadow: 0 18px 52px rgba(0,0,0,.45); opacity: 0; transform: translate(-50%, 12px);
  transition: opacity 200ms ease, transform 260ms cubic-bezier(.16,1,.3,1);
  pointer-events: none; backdrop-filter: blur(14px);
}
.lumen-toast.is-visible { opacity: 1; transform: translate(-50%, 0); }
::view-transition-old(lumen-page) { animation: lumen-page-out 160ms ease both; }
::view-transition-new(lumen-page) { animation: lumen-page-in 260ms cubic-bezier(.16,1,.3,1) both; }
@keyframes lumen-page-out { to { opacity: 0; transform: scale(.987); filter: blur(2px); } }
@keyframes lumen-page-in { from { opacity: 0; transform: scale(1.008); filter: blur(2px); } }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(lumen-page), ::view-transition-new(lumen-page) { animation-duration: 1ms; }
  .lumen-toast { transition-duration: 1ms; }
}
@media print {
  .lumen-page { display: block !important; break-after: page; }
  .lumen-page[hidden] { display: block !important; }
  .lumen-toast { display: none; }
}`;function x(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function S(e){return JSON.stringify(e).replaceAll(`<`,`\\u003c`).replaceAll(`>`,`\\u003e`).replaceAll(`\u2028`,`\\u2028`).replaceAll(`\u2029`,`\\u2029`)}function C(e){return e.replace(/<\/script/gi,`<\\/script`)}function te(e){return e.replace(/<\/style/gi,`<\\/style`)}function w(e){return e.trim().toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu,`-`).replace(/^-+|-+$/g,``)||`lumen-project`}function ne(e){let t={};for(let n of e)if(typeof n.content==`string`)t[n.path]={encoding:`text`,data:n.content};else{let e=``;for(let t of n.content)e+=String.fromCharCode(t);t[n.path]={encoding:`base64`,data:btoa(e)}}return S(t)}function re(e,t){return`${b}\n\n/* ===== Lumen runtime ===== */\n${e}\n/* project: ${t.name.replaceAll(`*/`,`* /`)} */`}function ie(e,t,n,r,i,a,o=[]){let s=e.pages.find(e=>e.id===t)?.id??e.pages[0]?.id??``,c={};for(let t of e.pages)c[t.id]=t.name;let l={projectName:e.name,initialPageId:s,actions:n.actions,pageTitles:c},u=w(e.name),d=n.pages.map(({page:e,markup:t})=>{let n=e.id===s;return`<section ${[`class="lumen-page${n?` is-active`:``}"`,`data-page-id="${x(e.id)}"`,`data-page-name="${x(e.name)}"`,`role="region"`,`aria-label="${x(e.name)}"`,`aria-hidden="${n?`false`:`true`}"`,`style="width:${e.width}px;height:${e.height}px;background:${x(e.background)}"`,n?``:`hidden`].filter(Boolean).join(` `)}>${t}</section>`}).join(`
`),f=i===`single`&&a.length?`<script type="application/json" id="lumen-plugin-files">${ne(a)}<\/script>`:``,p=i===`single`?`<style>${te(r.css)}</style>`:`<link rel="stylesheet" href="assets/styles.css" />`,m=`<script type="application/json" id="lumen-runtime-config">${S(l)}<\/script>`,h=i===`single`?`${m}\n<script>${C(r.js)}<\/script>`:`${m}\n<script src="assets/app.js"><\/script>`,g=`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="generator" content="Lumen Studio" />
  <meta name="description" content="${x(e.description||e.name)}" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230b0d12'/%3E%3Cpath d='M18 46V18h9v20h19v8z' fill='%23c9f56b'/%3E%3C/svg%3E" />
  <title>${x(e.name)}</title>
  ${p}
</head>
<body>
  <div class="lumen-export-root" style="background:${x(e.theme.background)}">
${d}
  </div>
  ${f}
  ${h}
  <noscript>此页面由 Lumen Studio 导出，请启用 JavaScript 以使用页面导航与交互。</noscript>
</body>
</html>`,_=`# ${e.name}

由 Lumen Studio 导出的独立原生项目。

## 运行

- 解压后直接双击 \`index.html\`。
- 页面使用经典 IIFE 脚本与相对路径，无构建步骤，\`file://\` 协议可直接打开。

## 目录

- \`index.html\` — 页面结构、运行时配置与入口
- \`assets/styles.css\` — Renderer 与页面样式
- \`assets/app.js\` — 页面导航 / 事件动作运行时
- \`assets/\` — 可扩展的静态资源目录（当前图片均走远程 URL）

## 信息

- 页面数：${e.pages.length}
- 首次打开页面：${x(c[s]??``)}
- 生成时间：${new Date().toISOString()}
${o.length?`- 插件备注：${o.map(e=>x(e)).join(` / `)}`:``}

图片使用项目中的可配置 URL，导出不会生成或下载占位图。
`;return{files:i===`single`?[{path:`${u}.html`,content:g}]:[{path:`index.html`,content:g},{path:`assets/styles.css`,content:r.css},{path:`assets/app.js`,content:r.js},{path:`assets/README.md`,content:`将额外的图片、字体或静态文件放在这里，并使用相对路径引用。
`},{path:`README.md`,content:_},...a],html:g,notes:[`原生 HTML 使用同一 Renderer 的真实 DOM 快照，画布与导出外观一致。`]}}var ae=`import type { RuntimeAction } from '@/core/schema/types'

export interface RuntimeActionHandlers {
  navigate: (pageId: string) => void
  openUrl: (url: string, newTab: boolean) => void
  message: (text: string) => void
}

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

export function isSafeExternalUrl(rawUrl: string): boolean {
  const url = rawUrl.trim()
  if (!url) return false
  if (url.startsWith('#')) return true
  try {
    return ALLOWED_PROTOCOLS.has(new URL(url, window.location.href).protocol)
  } catch {
    return false
  }
}

/**
 * One action executor for canvas preview and the exported Vue app.
 * The native exporter ships a tiny equivalent runtime in plain JS.
 */
export function executeRuntimeActions(
  actions: RuntimeAction[],
  handlers: RuntimeActionHandlers,
): void {
  for (const action of actions) {
    if (action.type === 'navigate') {
      handlers.navigate(action.pageId)
    } else if (action.type === 'open-url') {
      if (isSafeExternalUrl(action.url)) {
        handlers.openUrl(action.url, action.newTab)
      } else {
        handlers.message('链接地址无效，仅支持 http / https / mailto / tel。')
      }
    } else if (action.type === 'message') {
      handlers.message(action.text)
    }
  }
}
`,oe=`import type { ComponentDefinition, EventDescriptor, PropField } from '@/runtime/registry/types'
import { hasComponent, registerComponent } from '@/runtime/registry/componentRegistry'
import GroupWidget from '@/runtime/components/GroupWidget.vue'
import ContainerWidget from '@/runtime/components/ContainerWidget.vue'
import CardWidget from '@/runtime/components/CardWidget.vue'
import DividerWidget from '@/runtime/components/DividerWidget.vue'
import HeadingWidget from '@/runtime/components/HeadingWidget.vue'
import TextWidget from '@/runtime/components/TextWidget.vue'
import ButtonWidget from '@/runtime/components/ButtonWidget.vue'
import BadgeWidget from '@/runtime/components/BadgeWidget.vue'
import ImageWidget from '@/runtime/components/ImageWidget.vue'
import InputWidget from '@/runtime/components/InputWidget.vue'
import SelectWidget from '@/runtime/components/SelectWidget.vue'
import SwitchWidget from '@/runtime/components/SwitchWidget.vue'
import BarChartWidget from '@/runtime/components/BarChartWidget.vue'
import LineChartWidget from '@/runtime/components/LineChartWidget.vue'

const clickEvent: EventDescriptor = { name: 'click', label: '点击' }
const formEvents: EventDescriptor[] = [
  { name: 'input', label: '输入时' },
  { name: 'change', label: '值改变' },
  { name: 'focus', label: '获得焦点' },
  { name: 'blur', label: '失去焦点' },
]

const textProp = (label: string, placeholder?: string): PropField => ({
  key: 'text',
  label,
  type: 'text',
  placeholder,
})

const accentOptions = [
  { label: '主色', value: 'primary' },
  { label: '辅助色', value: 'secondary' },
]

const definitions: ComponentDefinition[] = [
  {
    name: 'layout.container',
    label: '容器',
    icon: 'M4 5h16v14H4z M4 10h16',
    category: 'layout',
    description: '可嵌套的自由定位容器，适合分组和组织页面结构。',
    version: '1.0.0',
    component: ContainerWidget,
    acceptsChildren: true,
    propsSchema: [],
    defaultProps: {},
    events: [],
    defaultFrame: { width: 360, height: 260 },
    defaultStyle: {
      background: 'color-mix(in srgb, var(--theme-surface) 62%, transparent)',
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 18,
    },
  },
  {
    name: 'layout.card',
    label: '卡片',
    icon: 'M4 5h16v14H4z M8 9h8',
    category: 'layout',
    description: '自带柔和表面的卡片容器，可以承载任意子组件。',
    version: '1.0.0',
    component: CardWidget,
    acceptsChildren: true,
    propsSchema: [],
    defaultProps: {},
    events: [clickEvent],
    defaultFrame: { width: 340, height: 220 },
    defaultStyle: {
      background: 'var(--theme-surface)',
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 20,
      shadow: 'soft',
      overflow: 'hidden',
    },
  },
  {
    name: 'layout.divider',
    label: '分割线',
    icon: 'M3 12h18',
    category: 'layout',
    description: '带可选标题的分割线。',
    version: '1.0.0',
    component: DividerWidget,
    propsSchema: [
      { key: 'label', label: '标题', type: 'text', placeholder: '例如：能力矩阵' },
    ],
    defaultProps: { label: '' },
    events: [],
    defaultFrame: { width: 320, height: 32 },
    defaultStyle: {
      background: 'transparent',
      color: 'var(--theme-border)',
      fontSize: 12,
    },
  },
  {
    name: '$group',
    label: '编组',
    icon: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
    category: 'layout',
    description: '内部编组节点。',
    version: '1.0.0',
    component: GroupWidget,
    acceptsChildren: true,
    hiddenFromPalette: true,
    propsSchema: [],
    defaultProps: {},
    events: [],
    defaultFrame: { width: 240, height: 160 },
    defaultStyle: {
      background: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      borderStyle: 'none',
      padding: 0,
      borderRadius: 0,
    },
  },
  {
    name: 'basic.heading',
    label: '标题',
    icon: 'M5 5v14 M19 5v14 M5 12h14',
    category: 'basic',
    description: '大字号标题，适合主视觉和区块标题。',
    version: '1.0.0',
    component: HeadingWidget,
    propsSchema: [
      { key: 'text', label: '标题文本', type: 'textarea', rows: 3, hint: '支持换行；画布使用 white-space: pre-wrap 渲染。' },
    ],
    defaultProps: { text: '让想法被看见。' },
    events: [],
    defaultFrame: { width: 620, height: 84 },
    defaultStyle: {
      background: 'transparent',
      color: 'var(--theme-text)',
      fontSize: 56,
      fontWeight: 700,
      lineHeight: 1.06,
      letterSpacing: -2,
    },
  },
  {
    name: 'basic.text',
    label: '文本',
    icon: 'M5 6h14 M5 10h14 M5 14h14 M5 18h9',
    category: 'basic',
    description: '段落文本，支持多行和换行。',
    version: '1.0.0',
    component: TextWidget,
    propsSchema: [
      { key: 'text', label: '文本内容', type: 'textarea', rows: 4 },
    ],
    defaultProps: { text: '在这里写下说明。支持从右侧属性面板实时修改。' },
    events: [],
    defaultFrame: { width: 440, height: 80 },
    defaultStyle: {
      background: 'transparent',
      color: 'var(--theme-muted)',
      fontSize: 15,
      lineHeight: 1.7,
    },
  },
  {
    name: 'basic.button',
    label: '按钮',
    icon: 'M4 8h16v8H4z M9 12h6',
    category: 'basic',
    description: '主操作按钮，支持点击事件绑定。',
    version: '1.0.0',
    component: ButtonWidget,
    propsSchema: [
      textProp('按钮文字', '开始使用'),
      { key: 'hint', label: '辅助文字', type: 'text', placeholder: '可选' },
      { key: 'disabled', label: '禁用', type: 'switch' },
    ],
    defaultProps: { text: '开始使用', hint: '', disabled: false },
    events: [clickEvent],
    defaultFrame: { width: 172, height: 48 },
    defaultStyle: {
      background: 'var(--theme-primary)',
      color: '#0c1118',
      fontSize: 14,
      fontWeight: 600,
      borderRadius: 12,
      cursor: 'pointer',
    },
  },
  {
    name: 'basic.badge',
    label: '徽标',
    icon: 'M7 4h10l3 8-3 8H7l-3-8z',
    category: 'basic',
    description: '小尺寸状态标签。',
    version: '1.0.0',
    component: BadgeWidget,
    propsSchema: [textProp('文字', 'NEW · 2026')],
    defaultProps: { text: 'NEW · 2026' },
    events: [clickEvent],
    defaultFrame: { width: 150, height: 32 },
    defaultStyle: {
      background: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)',
      color: 'var(--theme-primary)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: 0.4,
      borderRadius: 999,
      borderColor: 'color-mix(in srgb, var(--theme-primary) 30%, transparent)',
      borderWidth: 1,
      borderStyle: 'solid',
    },
  },
  {
    name: 'basic.image',
    label: '图片',
    icon: 'M4 5h16v14H4z M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 17l5-5 3 3 3-4 3 5',
    category: 'basic',
    description: '使用可配置的远程 URL，不内置占位图片。',
    version: '1.0.0',
    component: ImageWidget,
    propsSchema: [
      { key: 'src', label: '图片 URL', type: 'image-url', placeholder: 'https://…' },
      { key: 'alt', label: '替代文本', type: 'text' },
      {
        key: 'fit',
        label: '填充方式',
        type: 'select',
        options: [
          { label: '裁切填充', value: 'cover' },
          { label: '完整显示', value: 'contain' },
          { label: '拉伸', value: 'fill' },
        ],
      },
    ],
    defaultProps: {
      src: '',
      alt: '可配置的远程图片',
      fit: 'cover',
    },
    events: [clickEvent],
    defaultFrame: { width: 360, height: 220 },
    defaultStyle: {
      background: 'var(--theme-surface-muted)',
      color: 'var(--theme-muted)',
      fontSize: 13,
      borderRadius: 18,
      overflow: 'hidden',
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'solid',
    },
  },
  {
    name: 'form.input',
    label: '输入框',
    icon: 'M3 7h18v10H3z M7 10v4',
    category: 'form',
    description: '单行文本输入，支持输入、失焦等事件。',
    version: '1.0.0',
    component: InputWidget,
    propsSchema: [
      { key: 'label', label: '标签', type: 'text' },
      { key: 'placeholder', label: '占位提示', type: 'text' },
      { key: 'value', label: '默认值', type: 'text' },
      {
        key: 'inputType',
        label: '输入类型',
        type: 'select',
        options: [
          { label: '文本', value: 'text' },
          { label: '邮箱', value: 'email' },
          { label: '数字', value: 'number' },
          { label: '密码', value: 'password' },
        ],
      },
      { key: 'hint', label: '底部提示', type: 'text' },
    ],
    defaultProps: {
      label: '邮箱地址',
      placeholder: 'you@example.com',
      value: '',
      inputType: 'text',
      hint: '',
    },
    events: formEvents,
    defaultFrame: { width: 330, height: 78 },
    defaultStyle: {
      background: 'var(--theme-surface-muted)',
      color: 'var(--theme-text)',
      fontSize: 14,
      padding: 12,
      borderRadius: 12,
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'solid',
    },
  },
  {
    name: 'form.select',
    label: '下拉选择',
    icon: 'M3 7h18v10H3z M15 11l2 2 2-2',
    category: 'form',
    description: '下拉选择器，选项使用逗号分隔。',
    version: '1.0.0',
    component: SelectWidget,
    propsSchema: [
      { key: 'label', label: '标签', type: 'text' },
      { key: 'options', label: '选项', type: 'textarea', rows: 3, placeholder: '用逗号分隔' },
      { key: 'value', label: '默认选中', type: 'text' },
      { key: 'placeholder', label: '占位提示', type: 'text' },
    ],
    defaultProps: {
      label: '选择方案',
      options: 'Starter,Studio,Scale',
      value: 'Studio',
      placeholder: '请选择',
    },
    events: formEvents,
    defaultFrame: { width: 330, height: 78 },
    defaultStyle: {
      background: 'var(--theme-surface-muted)',
      color: 'var(--theme-text)',
      fontSize: 14,
      padding: 12,
      borderRadius: 12,
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'solid',
    },
  },
  {
    name: 'form.switch',
    label: '开关',
    icon: 'M7 8h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8z M15 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
    category: 'form',
    description: '开关控件，使用 :has() 驱动状态样式。',
    version: '1.0.0',
    component: SwitchWidget,
    propsSchema: [
      { key: 'label', label: '标签', type: 'text' },
      { key: 'checked', label: '默认开启', type: 'switch' },
      { key: 'hint', label: '提示', type: 'text' },
    ],
    defaultProps: { label: '接收产品更新', checked: true, hint: '' },
    events: formEvents,
    defaultFrame: { width: 330, height: 70 },
    defaultStyle: {
      background: 'var(--theme-surface-muted)',
      color: 'var(--theme-text)',
      fontSize: 14,
      padding: 14,
      borderRadius: 12,
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'solid',
    },
  },
  {
    name: 'chart.bar',
    label: '柱状图',
    icon: 'M4 20V10 M10 20V4 M16 20V7 M22 20H2',
    category: 'chart',
    description: '轻量 SVG 柱状图，数据使用逗号分隔。',
    version: '1.0.0',
    component: BarChartWidget,
    propsSchema: [
      { key: 'data', label: '数据', type: 'textarea', rows: 3 },
      { key: 'labels', label: '标签', type: 'text' },
      { key: 'accent', label: '强调色', type: 'select', options: accentOptions },
    ],
    defaultProps: {
      data: '38,64,52,78,46,88,61',
      labels: '一,二,三,四,五,六,日',
      accent: 'primary',
    },
    events: [clickEvent],
    defaultFrame: { width: 400, height: 250 },
    defaultStyle: {
      background: 'var(--theme-surface)',
      color: 'var(--theme-text)',
      fontSize: 14,
      padding: 18,
      borderRadius: 18,
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'solid',
      overflow: 'hidden',
    },
  },
  {
    name: 'chart.line',
    label: '折线图',
    icon: 'M3 17l5-5 4 3 7-9 M3 21h18',
    category: 'chart',
    description: '轻量 SVG 折线图，可切换面积填充。',
    version: '1.0.0',
    component: LineChartWidget,
    propsSchema: [
      { key: 'data', label: '数据', type: 'textarea', rows: 3 },
      { key: 'labels', label: '标签', type: 'text' },
      { key: 'area', label: '面积填充', type: 'switch' },
      { key: 'accent', label: '强调色', type: 'select', options: accentOptions },
    ],
    defaultProps: {
      data: '24,42,36,58,50,74,68,92',
      labels: '一月,二月,三月,四月,五月,六月,七月,八月',
      area: true,
      accent: 'secondary',
    },
    events: [clickEvent],
    defaultFrame: { width: 400, height: 250 },
    defaultStyle: {
      background: 'var(--theme-surface)',
      color: 'var(--theme-text)',
      fontSize: 14,
      padding: 18,
      borderRadius: 18,
      borderColor: 'var(--theme-border)',
      borderWidth: 1,
      borderStyle: 'solid',
      overflow: 'hidden',
    },
  },
]

let registered = false

/** Register all first-party components exactly once. */
export function registerBuiltins(): void {
  if (registered) return
  registered = true
  for (const definition of definitions) {
    if (!hasComponent(definition.name)) registerComponent(definition)
  }
}

export const BUILTIN_COMPONENTS = definitions

/** Used by the exporter to distinguish first-party components from plugins. */
export const BUILTIN_COMPONENT_NAMES = new Set(definitions.map((definition) => definition.name))
`,se=`<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'NEW · 2026',
  },
)
<\/script>

<template>
  <span class="ui-badge">{{ text }}</span>
</template>
`,ce=`<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data?: string
    labels?: string
    accent?: 'primary' | 'secondary'
  }>(),
  {
    data: '38,64,52,78,46,88,61',
    labels: '一,二,三,四,五,六,日',
    accent: 'primary',
  },
)

const values = computed(() => {
  const parsed = props.data
    .split(',')
    .map((value) => Number.parseFloat(value.trim()))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.max(0, value))
  return parsed.length ? parsed : [0]
})

const labels = computed(() =>
  props.labels
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean),
)

const max = computed(() => Math.max(...values.value, 1))
<\/script>

<template>
  <div class="ui-chart ui-chart--bar" :data-accent="accent">
    <div class="ui-chart__head">
      <span class="ui-chart__eyebrow">每周活跃</span>
      <span class="ui-chart__stat">{{ Math.round(values.reduce((a, b) => a + b, 0) / values.length) }}<small>k</small></span>
    </div>
    <div class="ui-bars" role="img" aria-label="柱状图">
      <div v-for="(value, index) in values" :key="\`\${value}-\${index}\`" class="ui-bars__item">
        <span class="ui-bars__value">{{ value }}</span>
        <span class="ui-bars__track">
          <span
            class="ui-bars__fill"
            :style="{ height: \`\${Math.max(8, (value / max) * 100)}%\` }"
          />
        </span>
        <span class="ui-bars__label">{{ labels[index] ?? '' }}</span>
      </div>
    </div>
  </div>
</template>
`,le=`<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    disabled?: boolean
    hint?: string
  }>(),
  {
    text: '开始探索',
    disabled: false,
    hint: '',
  },
)
<\/script>

<template>
  <button class="ui-button" type="button" :disabled="disabled">
    <span>{{ text }}</span>
    <span v-if="hint" class="ui-button__hint">{{ hint }}</span>
    <span class="ui-button__arrow" aria-hidden="true">↗</span>
  </button>
</template>
`,ue=`<template>
  <div class="ui-card">
    <span class="ui-card__sheen" aria-hidden="true" />
    <slot />
  </div>
</template>
`,de=`<template>
  <div class="ui-container"><slot /></div>
</template>
`,fe=`<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: '',
  },
)
<\/script>

<template>
  <div class="ui-divider" :class="{ 'has-label': label }">
    <span v-if="label" class="ui-divider__label">{{ label }}</span>
    <span class="ui-divider__line" aria-hidden="true" />
  </div>
</template>
`,pe=`<template>
  <div class="ui-group"><slot /></div>
</template>
`,me=`<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: '让想法被看见。',
  },
)
<\/script>

<template>
  <h2 class="ui-heading">{{ text }}</h2>
</template>
`,he=`<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    fit?: 'cover' | 'contain' | 'fill'
    emptyHint?: string
  }>(),
  {
    src: '',
    alt: '可配置的远程图片',
    fit: 'cover',
    emptyHint: '在属性面板中填入图片 URL',
  },
)

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)
<\/script>

<template>
  <div class="ui-image" :class="{ 'is-empty': !src }">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      :style="{ objectFit: fit }"
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
      @error="failed = true"
    />
    <div v-else class="ui-image__empty">
      <span class="ui-image__icon" aria-hidden="true">◫</span>
      <span>{{ failed ? '图片加载失败，请检查 URL' : emptyHint }}</span>
    </div>
  </div>
</template>
`,ge=`<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    value?: string
    inputType?: 'text' | 'email' | 'number' | 'password'
    hint?: string
  }>(),
  {
    label: '邮箱地址',
    placeholder: 'you@example.com',
    value: '',
    inputType: 'text',
    hint: '',
  },
)

const localValue = ref(props.value)

watch(
  () => props.value,
  (value) => {
    if (value !== localValue.value) localValue.value = value
  },
)

const onInput = (event: Event) => {
  localValue.value = (event.target as HTMLInputElement).value
}
<\/script>

<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <input
      class="ui-field__control"
      :type="inputType"
      :value="localValue"
      :placeholder="placeholder"
      autocomplete="off"
      @input="onInput"
    />
    <span v-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>
`,_e=`<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    data?: string
    labels?: string
    area?: boolean
    accent?: 'primary' | 'secondary'
  }>(),
  {
    data: '24,42,36,58,50,74,68,92',
    labels: '一月,二月,三月,四月,五月,六月,七月,八月',
    area: true,
    accent: 'secondary',
  },
)

const values = computed(() => {
  const parsed = props.data
    .split(',')
    .map((value) => Number.parseFloat(value.trim()))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.max(0, value))
  return parsed.length > 1 ? parsed : [0, 0]
})

const points = computed(() =>
  values.value
    .map((value, index) => {
      const x = (index / Math.max(values.value.length - 1, 1)) * 100
      const y = 46 - (value / Math.max(...values.value, 1)) * 42
      return \`\${x.toFixed(2)},\${y.toFixed(2)}\`
    })
    .join(' '),
)

const areaPath = computed(() => \`M 0 50 L \${points.value.split(' ').join(' L ')} L 100 50 Z\`)
<\/script>

<template>
  <div class="ui-chart ui-chart--line" :data-accent="accent">
    <div class="ui-chart__head">
      <span class="ui-chart__eyebrow">增长趋势</span>
      <span class="ui-chart__legend"><i /> Latest</span>
    </div>
    <svg class="ui-line" viewBox="0 0 100 52" preserveAspectRatio="none" role="img" aria-label="折线图">
      <path v-if="area" class="ui-line__area" :d="areaPath" />
      <polyline class="ui-line__path" :points="points" vector-effect="non-scaling-stroke" />
      <circle
        v-for="(point, index) in points.split(' ')"
        :key="index"
        class="ui-line__dot"
        :cx="point.split(',')[0]"
        :cy="point.split(',')[1]"
        r="0.9"
        vector-effect="non-scaling-stroke"
      />
    </svg>
    <div class="ui-line__labels">
      <span v-for="(label, index) in labels.split(',').map((l) => l.trim()).filter(Boolean)" :key="label">
        {{ index % 2 === 0 ? label : '' }}
      </span>
    </div>
  </div>
</template>
`,ve=`<script setup lang="ts">
import { computed, inject } from 'vue'
import { RUNTIME_CONTEXT_KEY } from '@/runtime/renderer/context'

const props = withDefaults(
  defineProps<{
    nodeType?: string
    nodeName?: string
  }>(),
  {
    nodeType: 'unknown',
    nodeName: '未知组件',
  },
)

const runtime = inject(RUNTIME_CONTEXT_KEY, null)
const isEdit = computed(() => runtime?.mode.value !== 'preview')
<\/script>

<template>
  <div class="ui-missing">
    <strong>{{ nodeName }}</strong>
    <span v-if="isEdit">未注册的组件类型「{{ nodeType }}」</span>
    <span v-else>该组件未安装或已被停用</span>
  </div>
</template>
`,ye=`<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    options?: string
    value?: string
    placeholder?: string
  }>(),
  {
    label: '选择方案',
    options: 'Starter,Studio,Scale',
    value: 'Studio',
    placeholder: '请选择',
  },
)

const items = computed(() =>
  props.options
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
)

const localValue = ref(props.value)

watch(
  () => props.value,
  (value) => {
    localValue.value = value
  },
)

watch(items, (list) => {
  if (localValue.value && !list.includes(localValue.value)) {
    localValue.value = list[0] ?? ''
  }
})

const onChange = (event: Event) => {
  localValue.value = (event.target as HTMLSelectElement).value
}
<\/script>

<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <span class="ui-select-wrap">
      <select class="ui-field__control ui-select" :value="localValue" @change="onChange">
        <option v-if="!localValue" value="" disabled>{{ placeholder }}</option>
        <option v-for="item in items" :key="item" :value="item">{{ item }}</option>
      </select>
      <span class="ui-select__chevron" aria-hidden="true">⌄</span>
    </span>
  </label>
</template>
`,be=`<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    checked?: boolean
    hint?: string
  }>(),
  {
    label: '接收产品更新',
    checked: true,
    hint: '',
  },
)

const localChecked = ref(props.checked)

watch(
  () => props.checked,
  (value) => {
    localChecked.value = value
  },
)
<\/script>

<template>
  <label class="ui-switch">
    <span class="ui-switch__copy">
      <span class="ui-switch__label">{{ label }}</span>
      <span v-if="hint" class="ui-switch__hint">{{ hint }}</span>
    </span>
    <span class="ui-switch__control">
      <input v-model="localChecked" class="ui-switch__input" type="checkbox" />
      <span class="ui-switch__track" aria-hidden="true">
        <span class="ui-switch__thumb" />
      </span>
    </span>
  </label>
</template>
`,xe=`<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: '在这里写下说明。支持从右侧属性面板实时修改。',
  },
)
<\/script>

<template>
  <p class="ui-text">{{ text }}</p>
</template>
`,Se=`/**
 * Vue 3.6 Vapor Mode is intentionally not part of the default build.
 * The stable VDOM Renderer is used everywhere. When Vapor stabilizes, this
 * module is the single integration point for an experimental renderer.
 */
export const VAPOR_MODE_ENABLED = false

export interface VaporRendererModule {
  mount: (target: HTMLElement, schema: unknown) => Promise<() => void>
}

export async function loadVaporRenderer(): Promise<VaporRendererModule> {
  throw new Error('Vue 3.6 Vapor Mode 尚未启用，当前构建使用稳定的 VDOM 渲染路径。')
}
`,Ce=`import { markRaw, shallowReactive } from 'vue'
import MissingComponent from '@/runtime/components/MissingComponent.vue'
import {
  validateComponentDefinition,
  type ComponentDefinition,
} from '@/runtime/registry/types'

/**
 * Single source of truth for runtime components. The map is shallow-reactive so
 * palette/layer catalogs update when a plugin registers or unregisters a
 * component, while the Vue component objects stay raw (no deep proxy overhead).
 */
const registry = shallowReactive(new Map<string, ComponentDefinition>())
const rawMissing = markRaw(MissingComponent)

export class ComponentRegistryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ComponentRegistryError'
  }
}

export function registerComponent(definition: ComponentDefinition): ComponentDefinition {
  if (!validateComponentDefinition(definition)) {
    throw new ComponentRegistryError(
      '组件定义缺少必填字段（name / icon / propsSchema / defaultProps / component / events / version / label / category）。',
    )
  }
  if (definition.name.startsWith('$') && definition.name !== '$group') {
    throw new ComponentRegistryError(\`组件名 "\${definition.name}" 使用了保留前缀 "$"。\`)
  }
  if (registry.has(definition.name)) {
    throw new ComponentRegistryError(\`组件 "\${definition.name}" 已经注册，已阻止重复注册。\`)
  }
  const rawDefinition = markRaw({
    ...definition,
    component: markRaw(definition.component),
  }) as ComponentDefinition
  registry.set(definition.name, rawDefinition)
  return rawDefinition
}

export function unregisterComponent(name: string): boolean {
  return registry.delete(name)
}

export function hasComponent(name: string): boolean {
  return registry.has(name)
}

export function getComponent(name: string): ComponentDefinition | undefined {
  return registry.get(name)
}

export function resolveComponent(name: string) {
  return registry.get(name)?.component ?? rawMissing
}

export function getMissingComponent() {
  return rawMissing
}

export function listComponents(): ComponentDefinition[] {
  return [...registry.values()]
}

export function resetComponentRegistry(): void {
  registry.clear()
}
`,we=`import type { Component } from 'vue'
import type { NodeStyle } from '@/core/schema/types'

export type ComponentCategory = 'layout' | 'basic' | 'form' | 'chart' | 'extension' | (string & {})

export type PropFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'switch'
  | 'color'
  | 'image-url'
  | 'options'

export interface PropOption {
  label: string
  value: string | number
}

/**
 * A tiny JSON-schema-like field descriptor used to generate the properties
 * panel automatically. Plugin components get an inspector for free.
 */
export interface PropField {
  key: string
  label: string
  type: PropFieldType
  defaultValue?: string | number | boolean
  placeholder?: string
  hint?: string
  rows?: number
  min?: number
  max?: number
  step?: number
  options?: PropOption[]
}

export interface EventDescriptor {
  /** Native DOM event name used by the wrapper: click, change, input… */
  name: string
  label: string
  description?: string
}

/**
 * Component registration protocol.
 *
 * \`events\` describes which DOM events the property panel may bind.
 * Optional fields extend the protocol without changing its required shape.
 */
export interface ComponentDefinition<P extends Record<string, unknown> = Record<string, unknown>> {
  name: string
  icon: string
  propsSchema: PropField[]
  defaultProps: P
  component: Component
  events: EventDescriptor[]
  version: string
  /** Human-friendly palette label. */
  label: string
  category: ComponentCategory
  description?: string
  acceptsChildren?: boolean
  hiddenFromPalette?: boolean
  defaultFrame?: { width: number; height: number }
  defaultStyle?: NodeStyle
  /**
   * Optional files that allow the Vue-project exporter to reproduce a plugin
   * component as real SFC source. The entry file must export a default SFC.
   */
  exportSource?: {
    entry: string
    files: Array<{ path: string; code: string }>
  }
}

export interface ComponentCatalogGroup {
  id: ComponentCategory
  label: string
  items: ComponentDefinition[]
}

export const CATEGORY_LABELS: Record<string, string> = {
  layout: '布局',
  basic: '基础',
  form: '表单',
  chart: '图表',
  extension: '扩展',
}

export const REQUIRED_COMPONENT_FIELDS: ReadonlyArray<keyof ComponentDefinition> = [
  'name',
  'icon',
  'propsSchema',
  'defaultProps',
  'component',
  'events',
  'version',
]

export function validateComponentDefinition(def: unknown): def is ComponentDefinition {
  if (!def || typeof def !== 'object') return false
  const candidate = def as Partial<ComponentDefinition>
  return (
    typeof candidate.name === 'string' &&
    candidate.name.length > 0 &&
    typeof candidate.icon === 'string' &&
    Array.isArray(candidate.propsSchema) &&
    candidate.defaultProps !== null &&
    typeof candidate.defaultProps === 'object' &&
    Boolean(candidate.component) &&
    Array.isArray(candidate.events) &&
    typeof candidate.version === 'string' &&
    typeof candidate.label === 'string' &&
    typeof candidate.category === 'string'
  )
}
`,Te=`<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { ComponentNode } from '@/core/schema/types'
import { getComponent, resolveComponent } from '@/runtime/registry/componentRegistry'
import { RUNTIME_CONTEXT_KEY } from '@/runtime/renderer/context'
import { frameToCss, nodeStyleToCss } from '@/runtime/renderer/style'

defineOptions({ name: 'NodeView' })

const props = defineProps<{
  node: ComponentNode
}>()

const runtime = inject(RUNTIME_CONTEXT_KEY)
if (!runtime) {
  throw new Error('NodeView must be rendered inside SchemaRenderer')
}

const wrapperRef = ref<HTMLElement | null>(null)
const resolvedComponent = computed(() => resolveComponent(props.node.type))
const definition = computed(() => getComponent(props.node.type))
const acceptsChildren = computed(() => Boolean(definition.value?.acceptsChildren))
const isInteractive = computed(() => runtime.mode.value === 'preview')

const resolvedProps = computed<Record<string, unknown>>(() => {
  if (!definition.value) {
    return { nodeType: props.node.type, nodeName: props.node.name }
  }
  return {
    ...definition.value.defaultProps,
    ...props.node.props,
  }
})

const nodeStyle = computed(() => ({
  ...frameToCss(props.node.frame),
  ...nodeStyleToCss(props.node.style),
  display: props.node.hidden ? 'none' : undefined,
}))

/**
 * Runtime event wiring lives on the wrapper, not inside built-ins, so plugins
 * and third-party components get the event system for free. Nested wrappers
 * guard against parent actions firing while clicking a child.
 */
const listeners = computed<Record<string, (event: Event) => void>>(() => {
  if (!isInteractive.value) return {}
  const map: Record<string, (event: Event) => void> = {}
  for (const [eventName, actions] of Object.entries(props.node.events)) {
    if (!actions.length) continue
    // focus/blur do not bubble; listen to their bubbling counterparts instead.
    const domEvent = eventName === 'focus' ? 'focusin' : eventName === 'blur' ? 'focusout' : eventName
    map[domEvent] = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const nearest = target.closest('[data-node-id]')
      if (nearest !== wrapperRef.value) return
      runtime.dispatch(actions)
    }
  }
  return map
})
<\/script>

<template>
  <div
    ref="wrapperRef"
    class="ide-node"
    :data-node-id="node.id"
    :data-node-type="node.type"
    :data-node-name="node.name"
    :style="nodeStyle"
    v-on="listeners"
  >
    <component :is="resolvedComponent" v-bind="resolvedProps">
      <template v-if="acceptsChildren">
        <NodeView v-for="child in node.children" :key="child.id" :node="child" />
      </template>
    </component>
  </div>
</template>
`,Ee=`<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import type { PageDocument, ProjectTheme, RuntimeAction } from '@/core/schema/types'
import type { RenderMode } from '@/runtime/renderer/context'
import { RUNTIME_CONTEXT_KEY } from '@/runtime/renderer/context'
import { pageRootStyle, themeToCss } from '@/runtime/renderer/style'
import NodeView from '@/runtime/renderer/NodeView.vue'

const props = withDefaults(
  defineProps<{
    page: PageDocument
    theme: ProjectTheme
    mode?: RenderMode
  }>(),
  {
    mode: 'edit',
  },
)

const emit = defineEmits<{
  action: [actions: RuntimeAction[]]
}>()

provide(RUNTIME_CONTEXT_KEY, {
  mode: toRef(props, 'mode'),
  dispatch: (actions: RuntimeAction[]) => emit('action', actions),
})

const rootStyle = computed(() => ({
  ...themeToCss(props.theme),
  ...pageRootStyle(props.page.background),
}))
<\/script>

<template>
  <div
    class="ide-page-render"
    :class="mode === 'preview' ? 'is-preview' : 'is-edit'"
    :data-page-id="page.id"
    :style="rootStyle"
  >
    <NodeView v-for="node in page.nodes" :key="node.id" :node="node" />
    <div v-if="!page.nodes.length" class="ide-page-empty" aria-hidden="true">
      <span>EMPTY ARTBOARD</span>
    </div>
  </div>
</template>
`,De=`import type { InjectionKey, Ref } from 'vue'
import type { RuntimeAction } from '@/core/schema/types'

export type RenderMode = 'edit' | 'preview'

export interface RuntimeRenderContext {
  mode: Ref<RenderMode>
  dispatch(actions: RuntimeAction[]): void
}

export const RUNTIME_CONTEXT_KEY: InjectionKey<RuntimeRenderContext> = Symbol('lumen-runtime')
`,Oe=`import type { CSSProperties } from 'vue'
import type { NodeFrame, NodeStyle, ProjectTheme } from '@/core/schema/types'

const SHADOWS: Record<NonNullable<NodeStyle['shadow']>, string> = {
  none: 'none',
  soft: '0 10px 30px rgba(0, 0, 0, 0.18)',
  lifted: '0 24px 70px rgba(0, 0, 0, 0.34)',
  glow: '0 0 0 1px color-mix(in srgb, var(--theme-primary) 26%, transparent), 0 18px 64px color-mix(in srgb, var(--theme-primary) 16%, transparent)',
}

/**
 * Maps the serializable NodeStyle to inline CSS. Keeping all styling inline on
 * the node wrapper guarantees the WYSIWYG canvas, native export and Vue export
 * render the same values without sharing an editor stylesheet.
 */
export function nodeStyleToCss(style: NodeStyle): CSSProperties {
  const css: CSSProperties = {
    background: style.background || 'transparent',
    color: style.color || 'var(--theme-text)',
    fontFamily:
      !style.fontFamily || style.fontFamily === 'inherit'
        ? 'var(--theme-font)'
        : style.fontFamily,
    fontSize: style.fontSize === undefined ? undefined : \`\${style.fontSize}px\`,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing:
      style.letterSpacing === undefined ? undefined : \`\${style.letterSpacing}px\`,
    textAlign: style.textAlign,
    padding: style.padding === undefined ? undefined : \`\${style.padding}px\`,
    borderRadius: style.borderRadius === undefined ? undefined : \`\${style.borderRadius}px\`,
    borderWidth:
      style.borderWidth === undefined || style.borderStyle === 'none'
        ? 0
        : \`\${style.borderWidth}px\`,
    borderStyle: style.borderStyle === 'none' ? 'none' : style.borderStyle || 'solid',
    borderColor: style.borderColor || 'transparent',
    opacity: style.opacity,
    boxShadow: style.shadow ? SHADOWS[style.shadow] : undefined,
    overflow: style.overflow,
    cursor: style.cursor,
    filter: style.filter || undefined,
  }
  return css
}

export function frameToCss(frame: NodeFrame): CSSProperties {
  return {
    left: \`\${frame.x}px\`,
    top: \`\${frame.y}px\`,
    width: \`\${Math.max(1, frame.width)}px\`,
    height: \`\${Math.max(1, frame.height)}px\`,
  }
}

/** CSS variables exposed to runtime widgets and page markup. */
export function themeToCss(theme: ProjectTheme): CSSProperties & Record<\`--theme-\${string}\`, string> {
  return {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-bg': theme.background,
    '--theme-surface': theme.surface,
    '--theme-surface-muted': theme.surfaceMuted,
    '--theme-text': theme.text,
    '--theme-muted': theme.muted,
    '--theme-border': theme.border,
    '--theme-radius': \`\${theme.radius}px\`,
    '--theme-font': theme.fontFamily,
  }
}

export function pageRootStyle(background: string): CSSProperties {
  return {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    background,
  }
}
`,ke=`<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { RuntimeAction } from '@/core/schema/types'
import { executeRuntimeActions } from '@/runtime/actions'
import SchemaRenderer from '@/runtime/renderer/SchemaRenderer.vue'
import { initialPageId, project } from './data/project'

interface ViewTransitionLike {
  finished: Promise<void>
}

type DocumentWithTransitions = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransitionLike
}

const activePageId = ref(initialPageId)
const toast = ref('')
const activePage = computed(
  () => project.pages.find((page) => page.id === activePageId.value) ?? project.pages[0],
)

let toastTimer = 0

function showToast(text: string): void {
  toast.value = text
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 3400)
}

function openUrl(url: string, newTab: boolean): void {
  window.open(url, newTab ? '_blank' : '_self', 'noopener,noreferrer')
}

async function switchPage(pageId: string): Promise<void> {
  if (!project.pages.some((page) => page.id === pageId)) return
  if (pageId === activePageId.value) return
  const update = async (): Promise<void> => {
    activePageId.value = pageId
    await nextTick()
    window.scrollTo(0, 0)
  }
  const doc = document as DocumentWithTransitions
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (doc.startViewTransition && !reduced) {
    try {
      await doc.startViewTransition(update).finished
    } catch {
      await update()
    }
  } else {
    await update()
  }
}

function handleActions(actions: RuntimeAction[]): void {
  executeRuntimeActions(actions, {
    navigate: (pageId) => {
      void switchPage(pageId)
    },
    openUrl,
    message: showToast,
  })
}

onMounted(() => {
  document.title = project.name
  window.scrollTo(0, 0)
})

watch(activePage, (page) => {
  if (page) document.title = \`\${page.name} · \${project.name}\`
})
<\/script>

<template>
  <div class="lumen-site" :style="{ background: project.theme.background }">
    <section
      v-if="activePage"
      class="lumen-page"
      :key="activePage.id"
      :style="{
        width: \`\${activePage.width}px\`,
        height: \`\${activePage.height}px\`,
        background: activePage.background,
      }"
      :aria-label="activePage.name"
      role="region"
    >
      <SchemaRenderer
        :page="activePage"
        :theme="project.theme"
        mode="preview"
        @action="handleActions"
      />
    </section>

    <Transition name="lumen-toast">
      <div v-if="toast" class="lumen-toast" role="status">{{ toast }}</div>
    </Transition>
  </div>
</template>
`,Ae=`import { createApp } from 'vue'
import '@/runtime/runtime.css'
import './styles.css'
import App from './App.vue'
import { registerBuiltins } from '@/runtime/builtins'
import { registerExportedPlugins } from '@/generated/plugins'

registerBuiltins()
registerExportedPlugins()
createApp(App).mount('#app')
`,je=`html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

body {
  overflow-x: auto;
}

.lumen-site {
  min-height: 100vh;
  width: 100%;
}

.lumen-page {
  display: block;
  margin: 0 auto;
  overflow: hidden;
  view-transition-name: lumen-page;
}

.lumen-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 999;
  max-width: min(440px, calc(100vw - 32px));
  padding: 11px 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 9px;
  background: rgba(12, 17, 24, 0.92);
  color: #f5f7fb;
  font: 13px/1.5 system-ui, sans-serif;
  box-shadow: 0 18px 52px rgba(0, 0, 0, 0.45);
  transform: translateX(-50%);
  backdrop-filter: blur(14px);
}

.lumen-toast-enter-active,
.lumen-toast-leave-active {
  transition: opacity 180ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.lumen-toast-enter-from,
.lumen-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}

.lumen-toast-enter-to,
.lumen-toast-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}

::view-transition-old(lumen-page) {
  animation: lumen-page-out 160ms ease both;
}

::view-transition-new(lumen-page) {
  animation: lumen-page-in 260ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes lumen-page-out {
  to {
    opacity: 0;
    transform: scale(0.987);
    filter: blur(2px);
  }
}

@keyframes lumen-page-in {
  from {
    opacity: 0;
    transform: scale(1.008);
    filter: blur(2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(lumen-page),
  ::view-transition-new(lumen-page) {
    animation-duration: 1ms;
  }
}
`,Me=`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark light" />
    <link
      rel="icon"
      href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230b0d12'/%3E%3Cpath d='M18 46V18h9v20h19v8z' fill='%23c9f56b'/%3E%3C/svg%3E"
    />
    <title>__PROJECT_NAME__</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"><\/script>
  </body>
</html>
`,Ne=`import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
`,Pe=`{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"]
}
`,Fe=`# __PROJECT_NAME__

由 Lumen Studio 导出的 Vue 3 + Vite 工程，包含完整的 SFC 源码。

## 启动

\`\`\`bash
npm install
npm run dev
\`\`\`

打开终端显示的地址即可。构建产物：

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 结构

- \`src/App.vue\` — 独立应用入口与页面切换
- \`src/data/project.ts\` — 从画布导出的项目 JSON
- \`src/runtime/\` — 与编辑器画布共用的递归 Renderer 与内置组件
- \`src/core/schema/types.ts\` — 单一数据 schema 类型
- \`src/generated/\` — 项目中使用到的插件组件与注册代码
- \`src/styles.css\` — 页面壳、View Transitions 与 Toast

## 说明

- 图片使用项目内配置的远程 URL，不包含生成的占位图。
- 事件动作（页面导航、打开链接、消息提示）与画布预览使用同一套运行时语义。
- 页面尺寸保持画布 artboard 的固定尺寸，导出后页面居中显示；小屏会横向滚动。
- 你可以继续修改 \`src/runtime/components/\` 下的 SFC 来定制组件。

生成时间：__GENERATED_AT__
`,Ie=`node_modules
dist
.vite
*.local
.DS_Store
`,Le=`/**
 * Lumen Studio data model.
 *
 * The whole canvas is derived from one JSON-safe document (\`ProjectDocument\`).
 * No DOM nodes, Vue components or editor-only state live in this tree, which is
 * what makes import / export / snapshots / undo deterministic.
 *
 * Layout contract:
 * - Every page has a fixed artboard size (px).
 * - Every node frame is absolute and positioned inside its parent node.
 * - Coordinates are relative to the parent's padding box. Root nodes are
 *   relative to the page artboard.
 * - Array order is paint order: later siblings paint above earlier siblings.
 */
export const PROJECT_SCHEMA_VERSION = 1 as const

export type ProjectSchemaVersion = typeof PROJECT_SCHEMA_VERSION
export type NodeId = string
export type PageId = string
export type EventName = string

export type PageBackground = string

export type ProjectThemeMode = 'dark' | 'light'

/** Visual tokens inherited by the renderer / standalone export. */
export interface ProjectTheme {
  mode: ProjectThemeMode
  primary: string
  secondary: string
  background: string
  surface: string
  surfaceMuted: string
  text: string
  muted: string
  border: string
  radius: number
  fontFamily: string
}

export interface AssetReference {
  id: string
  name: string
  kind: 'image' | 'font' | 'file'
  /** Remote or data URL. Lumen never generates placeholder images. */
  url: string
}

export interface NodeFrame {
  x: number
  y: number
  width: number
  height: number
}

export type TextAlign = 'left' | 'center' | 'right'
export type BorderStyle = 'none' | 'solid' | 'dashed'
export type NodeShadow = 'none' | 'soft' | 'lifted' | 'glow'
export type NodeOverflow = 'visible' | 'hidden'
export type NodeCursor = 'default' | 'pointer' | 'text'

/**
 * A deliberately small, typed styling surface. Unknown CSS is not accepted:
 * this keeps exported HTML, the canvas renderer and the Vue export in sync.
 */
export interface NodeStyle {
  background?: string
  color?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: TextAlign
  padding?: number
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: BorderStyle
  opacity?: number
  shadow?: NodeShadow
  overflow?: NodeOverflow
  cursor?: NodeCursor
  /** A CSS filter such as \`blur(2px)\` or \`saturate(1.2)\`. */
  filter?: string
}

/**
 * Runtime actions shared by the live preview, exported native HTML and the
 * exported Vue app. Keep this union serializable.
 */
export type RuntimeAction =
  | { type: 'navigate'; pageId: PageId }
  | { type: 'open-url'; url: string; newTab: boolean }
  | { type: 'message'; text: string }

export type NodeEvents = Record<EventName, RuntimeAction[]>

export interface ComponentNode {
  id: NodeId
  /** Registered component \`name\`, e.g. \`basic.button\`; \`$group\` for groups. */
  type: string
  /** Human layer name. Required by the export validator to be non-empty. */
  name: string
  frame: NodeFrame
  props: Record<string, unknown>
  style: NodeStyle
  events: NodeEvents
  children: ComponentNode[]
  locked?: boolean
  hidden?: boolean
}

export interface PageDocument {
  id: PageId
  name: string
  width: number
  height: number
  background: PageBackground
  nodes: ComponentNode[]
}

export interface ProjectDocument {
  schemaVersion: ProjectSchemaVersion
  id: string
  name: string
  description: string
  theme: ProjectTheme
  pages: PageDocument[]
  assets: AssetReference[]
  createdAt: string
  updatedAt: string
}

/** Persisted alongside the project so a refresh restores the working session. */
export interface EditorSession {
  activePageId: string
  activeNodeIds: string[]
  zoom: number
  panX: number
  panY: number
  savedAt: string
}

export interface VersionSnapshot {
  id: string
  name: string
  createdAt: string
  pageCount: number
  nodeCount: number
  project: ProjectDocument
}

export const GROUP_NODE_TYPE = '$group'

export const DEFAULT_THEME: ProjectTheme = {
  mode: 'dark',
  primary: '#c9f56b',
  secondary: '#7dd3fc',
  background: '#0c1118',
  surface: '#151c26',
  surfaceMuted: '#1d2633',
  text: '#f5f7fb',
  muted: '#94a3b8',
  border: 'rgba(148, 163, 184, 0.22)',
  radius: 18,
  fontFamily:
    '"Inter", "SF Pro Display", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
}

export const DEFAULT_STYLE: NodeStyle = {
  background: 'transparent',
  color: '#f5f7fb',
  fontFamily: 'inherit',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlign: 'left',
  padding: 0,
  borderRadius: 0,
  borderWidth: 0,
  borderColor: 'transparent',
  borderStyle: 'none',
  opacity: 1,
  shadow: 'none',
  overflow: 'visible',
  cursor: 'default',
}
`,Re=Object.assign({"../runtime/actions.ts":ae,"../runtime/builtins.ts":oe,"../runtime/components/BadgeWidget.vue":se,"../runtime/components/BarChartWidget.vue":ce,"../runtime/components/ButtonWidget.vue":le,"../runtime/components/CardWidget.vue":ue,"../runtime/components/ContainerWidget.vue":de,"../runtime/components/DividerWidget.vue":fe,"../runtime/components/GroupWidget.vue":pe,"../runtime/components/HeadingWidget.vue":me,"../runtime/components/ImageWidget.vue":he,"../runtime/components/InputWidget.vue":ge,"../runtime/components/LineChartWidget.vue":_e,"../runtime/components/MissingComponent.vue":ve,"../runtime/components/SelectWidget.vue":ye,"../runtime/components/SwitchWidget.vue":be,"../runtime/components/TextWidget.vue":xe,"../runtime/experimental/vapor.ts":Se,"../runtime/registry/componentRegistry.ts":Ce,"../runtime/registry/types.ts":we,"../runtime/renderer/NodeView.vue":Te,"../runtime/renderer/SchemaRenderer.vue":Ee,"../runtime/renderer/context.ts":De,"../runtime/renderer/style.ts":Oe,"../runtime/runtime.css":r});function ze(e){return e.trim().toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu,`-`).replace(/^-+|-+$/g,``)||`lumen-project`}function T(e){let t=e.replaceAll(`\\`,`/`).split(`/`).filter(e=>e&&e!==`.`);return!t.length||t.some(e=>e===`..`)?null:t.join(`/`)}function Be(e){let t=new Set,n=e=>{for(let r of e)r.type&&t.add(r.type),r.children.length&&n(r.children)};for(let t of e.pages)n(t.nodes);return t}function Ve(e){let n=[...Be(e)].filter(e=>!s.has(e)),r=[],i=[],a=[],o=[];return n.forEach((e,n)=>{let s=t(e);if(!s){o.push(`跳过了未注册组件 ${e}`);return}if(!s.exportSource){o.push(`插件组件 ${e} 缺少 exportSource，已跳过。`);return}let c=`src/generated/components/${s.name.replace(/[^a-zA-Z0-9._-]/g,`_`)}`,l=T(s.exportSource.entry);if(!l){o.push(`插件组件 ${e} 的导出入口路径非法，已跳过。`);return}for(let e of s.exportSource.files){let t=T(e.path);t&&r.push({path:`${c}/${t}`,content:e.code})}let u=`PluginComponent${n}`;i.push(`import ${u} from '@/generated/components/${s.name.replace(/[^a-zA-Z0-9._-]/g,`_`)}/${l}'`);let d=Object.fromEntries(Object.entries(s).filter(([e])=>e!==`component`&&e!==`exportSource`));a.push(`  {\n    ...${JSON.stringify(d,null,2).replaceAll(`
`,`
    `)},\n    component: ${u},\n  }`)}),{source:`${i.join(`
`)}${i.length?`
`:``}import { registerComponent } from '@/runtime/registry/componentRegistry'
import type { ComponentDefinition } from '@/runtime/registry/types'

const definitions = [
${a.join(`,
`)}
] as unknown as ComponentDefinition[]

/** Register only the plugin components actually used by this project. */
export function registerExportedPlugins(): void {
  for (const definition of definitions) {
    registerComponent(definition)
  }
}
`,files:r,notes:o}}function He(e,t){let n=ze(e.name),r=e.pages.find(e=>e.id===t)?.id??e.pages[0]?.id??``,i=[`Vue 工程包含完整 SFC 源码，可直接 npm i && npm run dev。`,`运行时组件由编辑器源码直接复制，保证画布与工程渲染一致。`],a=Ve(e);i.push(...a.notes);let o=[{path:`package.json`,content:JSON.stringify({name:n,version:`1.0.0`,private:!0,type:`module`,scripts:{dev:`vite`,build:`vite build`,preview:`vite preview`},dependencies:{vue:`~3.5.44`},devDependencies:{"@vitejs/plugin-vue":`^6.0.10`,typescript:`~5.9.3`,vite:`^8.3.5`}},null,2)},{path:`index.html`,content:Me.replaceAll(`__PROJECT_NAME__`,e.name)},{path:`vite.config.ts`,content:Ne},{path:`tsconfig.json`,content:Pe},{path:`README.md`,content:Fe.replaceAll(`__PROJECT_NAME__`,e.name).replaceAll(`__GENERATED_AT__`,new Date().toISOString())},{path:`.gitignore`,content:Ie},{path:`src/main.ts`,content:Ae},{path:`src/App.vue`,content:ke},{path:`src/styles.css`,content:je},{path:`src/env.d.ts`,content:`/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
`},{path:`src/data/project.ts`,content:`import type { ProjectDocument } from '@/core/schema/types'

export const project = ${JSON.stringify(e,null,2)} as ProjectDocument
export const initialPageId = ${JSON.stringify(r)}
`},{path:`src/core/schema/types.ts`,content:Le},{path:`src/generated/plugins.ts`,content:a.source},...a.files];for(let[e,t]of Object.entries(Re)){let n=e.replace(/^\.\.\//,`src/`);o.push({path:n,content:t})}return{files:o,notes:i}}var E=Symbol(`Comlink.proxy`),Ue=Symbol(`Comlink.endpoint`),We=Symbol(`Comlink.releaseProxy`),D=Symbol(`Comlink.finalizer`),O=Symbol(`Comlink.thrown`),k=e=>typeof e==`object`&&!!e||typeof e==`function`,A=new Map([[`proxy`,{canHandle:e=>k(e)&&e[E],serialize(e){let{port1:t,port2:n}=new MessageChannel;return j(e,t),[n,[n]]},deserialize:e=>(e.start(),M(e))}],[`throw`,{canHandle:e=>k(e)&&O in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(Error(e.value.message),e.value):e.value}}]]);function j(e,t=globalThis,n=[`*`]){t.addEventListener(`message`,(function r(i){if(!i||!i.data)return;if(!function(e,t){for(let n of e)if(t===n||n===`*`||n instanceof RegExp&&n.test(t))return!0;return!1}(n,i.origin))return void console.warn(`Invalid origin '${i.origin}' for comlink proxy`);let{id:a,type:o,path:s}=Object.assign({path:[]},i.data),c=(i.data.argumentList||[]).map(H),l;try{let t=s.slice(0,-1).reduce(((e,t)=>e[t]),e),n=s.reduce(((e,t)=>e[t]),e);switch(o){case`GET`:l=n;break;case`SET`:t[s.slice(-1)[0]]=H(i.data.value),l=!0;break;case`APPLY`:l=n.apply(t,c);break;case`CONSTRUCT`:l=B(new n(...c));break;case`ENDPOINT`:{let{port1:t,port2:n}=new MessageChannel;j(e,n),l=function(e,t){return z.set(e,t),e}(t,[t])}break;case`RELEASE`:l=void 0;break;default:return}}catch(e){l={value:e,[O]:0}}Promise.resolve(l).catch((e=>({value:e,[O]:0}))).then((n=>{let[i,s]=V(n);t.postMessage(Object.assign(Object.assign({},i),{id:a}),s),o===`RELEASE`&&(t.removeEventListener(`message`,r),Ge(t),D in e&&typeof e[D]==`function`&&e[D]())})).catch((e=>{let[n,r]=V({value:TypeError(`Unserializable return value`),[O]:0});t.postMessage(Object.assign(Object.assign({},n),{id:a}),r)}))})),t.start&&t.start()}function Ge(e){(function(e){return e.constructor.name===`MessagePort`})(e)&&e.close()}function M(e,t){return L(e,[],t)}function N(e){if(e)throw Error(`Proxy has been released and is not useable`)}function P(e){return U(e,{type:`RELEASE`}).then((()=>{Ge(e)}))}var F=new WeakMap,I=`FinalizationRegistry`in globalThis&&new FinalizationRegistry((e=>{let t=(F.get(e)||0)-1;F.set(e,t),t===0&&P(e)}));function L(e,t=[],n=function(){}){let r=!1,i=new Proxy(n,{get(n,a){if(N(r),a===We)return()=>{(function(e){I&&I.unregister(e)})(i),P(e),r=!0};if(a===`then`){if(t.length===0)return{then:()=>i};let n=U(e,{type:`GET`,path:t.map((e=>e.toString()))}).then(H);return n.then.bind(n)}return L(e,[...t,a])},set(n,i,a){N(r);let[o,s]=V(a);return U(e,{type:`SET`,path:[...t,i].map((e=>e.toString())),value:o},s).then(H)},apply(n,i,a){N(r);let o=t[t.length-1];if(o===Ue)return U(e,{type:`ENDPOINT`}).then(H);if(o===`bind`)return L(e,t.slice(0,-1));let[s,c]=R(a);return U(e,{type:`APPLY`,path:t.map((e=>e.toString())),argumentList:s},c).then(H)},construct(n,i){N(r);let[a,o]=R(i);return U(e,{type:`CONSTRUCT`,path:t.map((e=>e.toString())),argumentList:a},o).then(H)}});return function(e,t){let n=(F.get(t)||0)+1;F.set(t,n),I&&I.register(e,t,e)}(i,e),i}function R(e){let t=e.map(V);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}var z=new WeakMap;function B(e){return Object.assign(e,{[E]:!0})}function V(e){for(let[t,n]of A)if(n.canHandle(e)){let[r,i]=n.serialize(e);return[{type:`HANDLER`,name:t,value:r},i]}return[{type:`RAW`,value:e},z.get(e)||[]]}function H(e){switch(e.type){case`HANDLER`:return A.get(e.name).deserialize(e.value);case`RAW`:return e.value}}function U(e,t,n){return new Promise((r=>{let i=[,,,,].fill(0).map((()=>Math.floor(Math.random()*(2**53-1)).toString(16))).join(`-`);e.addEventListener(`message`,(function t(n){n.data&&n.data.id&&n.data.id===i&&(e.removeEventListener(`message`,t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:i},t),n)}))}var W=class{constructor(e,t,n,r,i){this._name=e,this._size=t,this._path=n,this._lastModified=r,this._archiveRef=i}get name(){return this._name}get size(){return this._size}get lastModified(){return this._lastModified}extract(){return this._archiveRef.extractSingleFile(this._path)}};function G(e){if(e instanceof File||e instanceof W||e===null)return e;let t={};for(let n of Object.keys(e))t[n]=G(e[n]);return t}function K(e,t=``){let n=[];for(let r of Object.keys(e))e[r]instanceof File||e[r]instanceof W||e[r]===null?n.push({file:e[r]||r,path:t}):n.push(...K(e[r],`${t}${r}/`));return n}function q(e,t){let n=t.split(`/`);n[n.length-1]===``&&n.pop();let r=e,i=null;for(let e of n)r[e]=r[e]||{},i=r,r=r[e];return[i,n[n.length-1]]}var Ke=class{constructor(e,t,n){this._content={},this._processed=0,this.file=e,this.client=t,this.worker=n}open(){return this._content={},this._processed=0,new Promise(((e,t)=>{this.client.open(this.file,B((()=>{e(this)})))}))}async close(){var e;(e=this.worker)==null||e.terminate(),this.worker=null,this.client=null,this.file=null}async hasEncryptedData(){return await this.client.hasEncryptedData()}async usePassword(e){await this.client.usePassword(e)}async setLocale(e){await this.client.setLocale(e)}async getFilesObject(){return this._processed>0?Promise.resolve().then((()=>this._content)):((await this.client.listFiles()).forEach((e=>{let[t,n]=q(this._content,e.path);e.type===`FILE`&&(t[n]=new W(e.fileName,e.size,e.path,e.lastModified,this))})),this._processed=1,G(this._content))}getFilesArray(){return this.getFilesObject().then((e=>K(e)))}async extractSingleFile(e){if(this.worker===null)throw Error(`Archive already closed`);let t=await this.client.extractSingleFile(e);return new File([t.fileData],t.fileName,{type:`application/octet-stream`,lastModified:t.lastModified/1e6})}async extractFiles(e=void 0){var t;return this._processed>1?Promise.resolve().then((()=>this._content)):((await this.client.extractFiles()).forEach((t=>{let[n,r]=q(this._content,t.path);t.type===`FILE`&&(n[r]=new File([t.fileData],t.fileName,{type:`application/octet-stream`}),e!==void 0&&setTimeout(e.bind(null,{file:n[r],path:t.path})))})),this._processed=2,(t=this.worker)==null||t.terminate(),G(this._content))}},J,Y;(function(e){e.SEVEN_ZIP=`7zip`,e.AR=`ar`,e.ARBSD=`arbsd`,e.ARGNU=`argnu`,e.ARSVR4=`arsvr4`,e.BIN=`bin`,e.BSDTAR=`bsdtar`,e.CD9660=`cd9660`,e.CPIO=`cpio`,e.GNUTAR=`gnutar`,e.ISO=`iso`,e.ISO9660=`iso9660`,e.MTREE=`mtree`,e.MTREE_CLASSIC=`mtree-classic`,e.NEWC=`newc`,e.ODC=`odc`,e.OLDTAR=`oldtar`,e.PAX=`pax`,e.PAXR=`paxr`,e.POSIX=`posix`,e.PWB=`pwb`,e.RAW=`raw`,e.RPAX=`rpax`,e.SHAR=`shar`,e.SHARDUMP=`shardump`,e.USTAR=`ustar`,e.V7TAR=`v7tar`,e.V7=`v7`,e.WARC=`warc`,e.XAR=`xar`,e.ZIP=`zip`})(J||={}),function(e){e.B64ENCODE=`b64encode`,e.BZIP2=`bzip2`,e.COMPRESS=`compress`,e.GRZIP=`grzip`,e.GZIP=`gzip`,e.LRZIP=`lrzip`,e.LZ4=`lz4`,e.LZIP=`lzip`,e.LZMA=`lzma`,e.LZOP=`lzop`,e.UUENCODE=`uuencode`,e.XZ=`xz`,e.ZSTD=`zstd`,e.NONE=`none`}(Y||={});var X=class e{static init(t=null){return e._options=t||{},e._options}static async open(t){let n=e.getWorker(e._options);return await new Ke(t,await e.getClient(n,e._options),n).open()}static async write({files:t,outputFileName:n,compression:r,format:i,passphrase:a=null}){let o=e.getWorker(e._options),s=await(await e.getClient(o,e._options)).writeArchive(t,r,i,a);return o.terminate(),new File([s],n,{type:`application/octet-stream`})}static getWorker(e){return e.getWorker?e.getWorker():new Worker(e.workerUrl||new URL(new URL(`worker-bundle-Dx5mKZOL.js`,import.meta.url).href,``+import.meta.url),{type:`module`})}static async getClient(e,t){let n=t.createClient?.call(t,e)||M(e),{promise:r,resolve:i}=Promise.withResolvers(),a=await new n(B((()=>{i()})));return await r,a}};X._options={},Promise.withResolvers||(Promise.withResolvers=function(){var e,t,n=new this((function(n,r){e=n,t=r}));return{resolve:e,reject:t,promise:n}});var Z=!1;function qe(){if(Z)return;let e=new URL(`${`./`.endsWith(`/`)?`./`:`.//`}libarchive/worker-bundle.js`,document.baseURI).href;X.init({workerUrl:e}),Z=!0}function Je(e){return e.endsWith(`.html`)?`text/html`:e.endsWith(`.css`)?`text/css`:e.endsWith(`.js`)||e.endsWith(`.mjs`)||e.endsWith(`.ts`)?`text/javascript`:e.endsWith(`.json`)?`application/json`:e.endsWith(`.vue`)?`text/plain`:e.endsWith(`.wasm`)?`application/wasm`:e.endsWith(`.svg`)?`image/svg+xml`:`application/octet-stream`}async function Ye(e,t){qe();let n=e.map(e=>{let t=e.path.split(`/`).filter(Boolean).at(-1)||`file`,n=typeof e.content==`string`?e.content:(()=>{let t=new Uint8Array(e.content.byteLength);return t.set(e.content),t.buffer})(),r=new Blob([n],{type:Je(e.path)});return{file:new File([r],t,{type:Je(e.path)}),pathname:e.path.replace(/^\/+/,``)}}),r=await X.write({files:n,outputFileName:`archive.zip.gz`,compression:Y.GZIP,format:J.ZIP,passphrase:null}),i=new Uint8Array(await r.arrayBuffer());if(!i.length)throw Error(`ZIP 压缩失败：libarchive 返回了空数据。`);let a=new Blob([i]).stream().pipeThrough(new DecompressionStream(`gzip`)),o=new Uint8Array(await new Response(a).arrayBuffer());if(o[0]!==80||o[1]!==75)throw Error(`ZIP 压缩失败：WASM 输出不是合法的 ZIP。`);return new File([o],t,{type:`application/zip`})}var Xe=class extends Error{issues;constructor(e){super(`导出被校验错误阻止。`),this.name=`ExportBlockedError`,this.issues=e}};function Q(e,t){e.onProgress?.(t)}function Ze(e){let t=e.replaceAll(`\\`,`/`).replace(/^\/+/,``).split(`/`).filter(e=>e&&e!==`.`);return!t.length||t.some(e=>e===`..`)?null:t.join(`/`)}function $(e,t){if(!t.has(e))return e;let n=e.lastIndexOf(`/`),r=n>=0?e.slice(0,n+1):``,i=e.slice(n+1),a=i.lastIndexOf(`.`),o=a>0?i.slice(0,a):i,s=a>0?i.slice(a):``,c=2;for(;t.has(`${r}${o}-${c}${s}`);)c+=1;return`${r}${o}-${c}${s}`}function Qe(e,t){let n=new Set(e.map(e=>e.path)),r=[...e];for(let e of t){let t=Ze(e.path);if(!t)continue;let i=$(t,n);n.add(i),r.push({path:i,content:e.content})}return r}async function $e(e){let{project:t,target:n,format:i,minify:s,activePageId:u}=e;Q(e,{stage:`validating`,label:`校验项目数据`,percent:4});let f=a(t,n);if(l(f))throw new Xe(f);if(n===`vue`&&i!==`zip`)throw Error(`Vue 工程只能导出为 ZIP。`);let p=[],m=[],h=await c({project:t,target:n,singleFile:i===`single`,minify:s,notes:m,addFile:(e,t)=>{let n=Ze(e);n?p.push({path:n,content:t}):m.push(`插件导出文件路径无效：${e}`)}});for(let e of h)m.push(`插件导出钩子失败 (${e.pluginId}/${e.stage})：${e.message}`);let g=w(t.name),v,y=``,b=0,x=[];if(n===`native`){Q(e,{stage:`rendering`,label:`渲染页面 DOM`,detail:`0 / ${t.pages.length}`,percent:18});let n=await ee(t);Q(e,{stage:`bundling`,label:`在 Web Worker 中编译并压缩`,detail:`esbuild-wasm 首次会加载约 14MB WASM`,percent:42});let a=await _(d,re(r,t),s);Q(e,{stage:`generating`,label:`生成独立 HTML 资源`,percent:66});let o=new Set([`index.html`,`assets/styles.css`,`assets/app.js`,`assets/README.md`,`README.md`]),c=[];for(let e of p){let t=$(e.path,o);t!==e.path&&m.push(`插件文件路径冲突，已重命名：${e.path} → ${t}`),o.add(t),c.push({path:t,content:e.content})}let l=ie(t,u,n,a,i,c,m);m.push(...l.notes),i===`single`?(v=new Blob([l.html],{type:`text/html;charset=utf-8`}),y=`${g}.html`,b=1,x=[{path:y,content:l.html}]):(Q(e,{stage:`zipping`,label:`使用 WASM ZIP 压缩项目`,percent:82}),v=await Ye(l.files.map(e=>({path:e.path,content:e.content})),`${g}-native.zip`),y=`${g}-native.zip`,b=l.files.length,x=l.files)}else{Q(e,{stage:`generating`,label:`生成 Vue 3 + Vite 工程源码`,percent:48});let n=He(t,u);m.push(...n.notes),s&&m.push(`Vue 工程保留可读 SFC 源码，压缩选项不修改工程源码。`);let r=Qe(n.files,p);Q(e,{stage:`zipping`,label:`使用 WASM ZIP 压缩 Vue 工程`,percent:80}),v=await Ye(r.map(e=>({path:e.path,content:e.content})),`${g}-vue-vite.zip`),y=`${g}-vue-vite.zip`,b=r.length,x=r}Q(e,{stage:`done`,label:`导出完成`,percent:100});let S={fileName:y,blob:v,size:v.size,target:n,format:i,fileCount:b,notes:m,issues:f},C=await o({project:t,target:n,singleFile:i===`single`,fileName:y,files:x,notes:m});for(let e of C)m.push(`插件 afterExport 钩子失败：${e.message}`);return S}function et(e){let t=URL.createObjectURL(e.blob),n=document.createElement(`a`);n.href=t,n.download=e.fileName,n.rel=`noopener`,n.style.display=`none`,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),5e3)}export{Xe as ExportBlockedError,et as downloadResult,$e as exportProject};