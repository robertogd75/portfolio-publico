import { useState } from 'react'
import { useTranslation } from '../../i18n/I18nContext.jsx'

// ── Security helper ────────────────────────────────────────────────
function sanitizeUrl(url) {
  const t = url.trim().toLowerCase()
  if (t.startsWith('javascript:') || t.startsWith('data:')) return '#'
  return url.trim()
}

// ── Minimal Markdown parser ────────────────────────────────────────
function parseInline(raw) {
  // HTML-escape first to block injected markup
  const text = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,         '<em>$1</em>')
    .replace(/`([^`]+)`/g,         '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, txt, url) =>
      `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${txt}</a>`
    )
}

function parseMarkdown(md) {
  const lines = md.split('\n')
  let html = ''
  let inCode = false
  let codeLang = ''
  let codeLines = []
  let inList = false
  let listType = ''

  const closeList = () => {
    if (inList) { html += `</${listType}>\n`; inList = false; listType = '' }
  }

  for (const line of lines) {
    // Code fence
    if (line.startsWith('```')) {
      if (!inCode) {
        closeList()
        inCode = true
        codeLang = line.slice(3).trim()
        codeLines = []
      } else {
        const escaped = codeLines.join('\n').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        html += `<pre><code class="lang-${codeLang}">${escaped}</code></pre>\n`
        inCode = false
      }
      continue
    }
    if (inCode) { codeLines.push(line); continue }

    // Headings
    const h3 = line.match(/^### (.+)/)
    const h2 = line.match(/^## (.+)/)
    const h1 = line.match(/^# (.+)/)
    if (h1) { closeList(); html += `<h1>${parseInline(h1[1])}</h1>\n`; continue }
    if (h2) { closeList(); html += `<h2>${parseInline(h2[1])}</h2>\n`; continue }
    if (h3) { closeList(); html += `<h3>${parseInline(h3[1])}</h3>\n`; continue }

    // Blockquote
    if (line.startsWith('> ')) {
      closeList()
      html += `<blockquote>${parseInline(line.slice(2))}</blockquote>\n`
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      closeList(); html += '<hr />\n'; continue
    }

    // Unordered list
    const ulM = line.match(/^[-*+] (.+)/)
    if (ulM) {
      if (!inList || listType !== 'ul') { closeList(); html += '<ul>\n'; inList = true; listType = 'ul' }
      html += `  <li>${parseInline(ulM[1])}</li>\n`; continue
    }

    // Ordered list
    const olM = line.match(/^\d+\. (.+)/)
    if (olM) {
      if (!inList || listType !== 'ol') { closeList(); html += '<ol>\n'; inList = true; listType = 'ol' }
      html += `  <li>${parseInline(olM[1])}</li>\n`; continue
    }

    // Empty line → close lists, no extra element
    if (line.trim() === '') { closeList(); html += '<br />\n'; continue }

    // Paragraph
    closeList()
    html += `<p>${parseInline(line)}</p>\n`
  }

  closeList()
  if (inCode && codeLines.length) {
    const escaped = codeLines.join('\n').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    html += `<pre><code>${escaped}</code></pre>\n`
  }
  return html
}

// ── Default content ────────────────────────────────────────────────
const DEFAULT_MD_BY_LANG = {
  es: `# Markdown Previewer

Escribe en el panel izquierdo y el resultado aparece aquí.

## Sintaxis soportada

- **Negrita** — \`**texto**\`
- *Cursiva* — \`*texto*\`
- \`Código inline\` — backticks
- [Enlace](https://example.com) — \`[texto](url)\`

## Bloque de código

\`\`\`js
const greet = name => \`Hello, \${name}!\`
console.log(greet('World'))
\`\`\`

> Blockquote de ejemplo.

---

1. Lista ordenada
2. Segundo elemento
3. Tercero
`,
  en: `# Markdown Previewer

Write in the left panel and the result appears here.

## Supported syntax

- **Bold** — \`**text**\`
- *Italic* — \`*text*\`
- \`Inline code\` — backticks
- [Link](https://example.com) — \`[text](url)\`

## Code block

\`\`\`js
const greet = name => \`Hello, \${name}!\`
console.log(greet('World'))
\`\`\`

> Blockquote example.

---

1. Ordered list
2. Second item
3. Third
`,
  de: `# Markdown Previewer

Schreibe im linken Panel und das Ergebnis erscheint hier.

## Unterstützte Syntax

- **Fett** — \`**text**\`
- *Kursiv* — \`*text*\`
- \`Inline-Code\` — Backticks
- [Link](https://example.com) — \`[text](url)\`

## Codeblock

\`\`\`js
const greet = name => \`Hello, \${name}!\`
console.log(greet('World'))
\`\`\`

> Blockquote-Beispiel.

---

1. Geordnete Liste
2. Zweites Element
3. Drittes
`,
}

// ── Styles injected once ───────────────────────────────────────────
const PREVIEW_CSS = `
  .md-preview h1 { font-size: 1.5rem; margin: 0.8rem 0 0.5rem; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; }
  .md-preview h2 { font-size: 1.2rem; margin: 0.75rem 0 0.4rem; color: var(--text-primary); }
  .md-preview h3 { font-size: 1rem; margin: 0.65rem 0 0.35rem; color: var(--neon-cyan); }
  .md-preview p  { margin: 0.35rem 0; color: var(--text-secondary); line-height: 1.75; }
  .md-preview strong { color: var(--text-primary); }
  .md-preview em { color: var(--neon-purple); font-style: italic; }
  .md-preview code { background: rgba(255,255,255,0.08); padding: 0.1em 0.4em; border-radius: 4px; font-family: var(--font-mono); font-size: 0.84em; color: var(--neon-cyan); }
  .md-preview pre { background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 0.5rem 0; }
  .md-preview pre code { background: none; padding: 0; color: var(--text-primary); }
  .md-preview ul, .md-preview ol { padding-left: 1.4rem; margin: 0.35rem 0; color: var(--text-secondary); }
  .md-preview li { margin: 0.2rem 0; line-height: 1.65; }
  .md-preview blockquote { border-left: 3px solid var(--neon-purple); margin: 0.5rem 0; padding: 0.35rem 0 0.35rem 1rem; color: var(--text-muted); font-style: italic; background: rgba(168,85,247,0.05); border-radius: 0 6px 6px 0; }
  .md-preview hr { border: none; border-top: 1px solid var(--border); margin: 0.75rem 0; }
  .md-preview a { color: var(--neon-cyan); }
`

// ── Component ──────────────────────────────────────────────────────
export default function MarkdownPreviewer() {
  const { lang } = useTranslation()
  const [md, setMd] = useState(() => DEFAULT_MD_BY_LANG[lang] ?? DEFAULT_MD_BY_LANG.en)

  const panelStyle = {
    flex: '1 1 300px', background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)', borderRadius: 10,
    padding: '1rem', minHeight: 440, overflow: 'auto',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%' }}>
      <style>{PREVIEW_CSS}</style>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Editor */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Editor
          </div>
          <textarea
            value={md}
            onChange={e => setMd(e.target.value)}
            spellCheck={false}
            style={{
              ...panelStyle, resize: 'none',
              color: 'var(--text-primary)', fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem', lineHeight: 1.65, outline: 'none',
            }}
          />
        </div>

        {/* Preview */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{
            color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Preview
          </div>
          <div
            className="md-preview"
            style={{ ...panelStyle, fontSize: '0.9rem' }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(md) }}
          />
        </div>
      </div>
    </div>
  )
}
