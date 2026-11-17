/* ============================================================
   DEVPOCKET — Tool: Markdown Previewer
   Mini markdown parser (harici kütüphane yok)
   Desteklenen: başlık, bold, italic, kod, link, liste, alıntı
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['markdown-previewer'] = {
  render(container) {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); min-height: 420px;">
        <div class="field">
          <label class="field__label">Markdown</label>
          <textarea id="mdInput" class="textarea" rows="18" style="height: 100%;"># Hello DevPocket
## A markdown previewer

Write **bold**, *italic*, \`inline code\` or [links](https://github.com).

- Item one
- Item two
- Item three

> Blockquotes work too.

\`\`\`js
console.log('code blocks too!');
\`\`\`

Enjoy!</textarea>
        </div>
        <div class="field">
          <label class="field__label">Preview</label>
          <div id="mdPreview" class="md-preview" style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); overflow-y: auto; height: 100%; min-height: 400px;"></div>
        </div>
      </div>

      <style>
        .md-preview { color: var(--text-primary); line-height: 1.65; font-size: 0.9375rem; }
        .md-preview h1, .md-preview h2, .md-preview h3 { margin: 16px 0 8px; line-height: 1.25; }
        .md-preview h1 { font-size: 1.75rem; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
        .md-preview h2 { font-size: 1.35rem; }
        .md-preview h3 { font-size: 1.1rem; }
        .md-preview p { margin: 10px 0; }
        .md-preview a { color: var(--accent-1); text-decoration: underline; }
        .md-preview code {
          background: var(--bg-primary); padding: 2px 6px;
          border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;
          color: var(--accent-1);
        }
        .md-preview pre {
          background: var(--bg-primary); padding: 12px 14px;
          border-radius: var(--radius-md); overflow-x: auto;
          border: 1px solid var(--border); margin: 12px 0;
        }
        .md-preview pre code { background: none; padding: 0; color: var(--text-primary); }
        .md-preview ul, .md-preview ol { margin: 10px 0; padding-left: 24px; }
        .md-preview ul li { list-style: disc; }
        .md-preview ol li { list-style: decimal; }
        .md-preview blockquote {
          border-left: 3px solid var(--accent-1);
          padding: 4px 12px; margin: 12px 0;
          color: var(--text-secondary);
          background: var(--accent-soft);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
      </style>
    `;

    const input = container.querySelector('#mdInput');
    const preview = container.querySelector('#mdPreview');

    /* Mini markdown parser */
    function parseMarkdown(md) {
      // 1. HTML kaçışı (XSS güvenliği için önce bunu yapıyoruz)
      let html = DP.escapeHtml(md);

      // 2. Kod blokları: ```lang \n code \n ```
      html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
      });

      // 3. Satır içi kod: `code`
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

      // 4. Başlıklar: # ## ###
      html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
      html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
      html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

      // 5. Kalın: **text** (önce bold, sonra italic ki çakışmasın)
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      // 6. İtalik: *text* veya _text_
      html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

      // 7. Linkler: [text](url)
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

      // 8. Alıntı: > text
      html = html.replace(/^&gt; (.*)$/gm, '<blockquote>$1</blockquote>');

      // 9. Listeler (basit satır bazlı)
      const lines = html.split('\n');
      let output = '';
      let inUl = false, inOl = false;

      for (const line of lines) {
        // Unordered list: - item veya * item
        const ulMatch = line.match(/^[-*] (.*)$/);
        if (ulMatch) {
          if (inOl) { output += '</ol>'; inOl = false; }
          if (!inUl) { output += '<ul>'; inUl = true; }
          output += `<li>${ulMatch[1]}</li>`;
          continue;
        }
        // Ordered list: 1. item
        const olMatch = line.match(/^\d+\. (.*)$/);
        if (olMatch) {
          if (inUl) { output += '</ul>'; inUl = false; }
          if (!inOl) { output += '<ol>'; inOl = true; }
          output += `<li>${olMatch[1]}</li>`;
          continue;
        }
        // Diğer satır → listeyi kapat
        if (inUl) { output += '</ul>'; inUl = false; }
        if (inOl) { output += '</ol>'; inOl = false; }

        // Boş satır → paragraf arası
        if (line.trim() === '') {
          output += '';
        } else if (!line.startsWith('<')) {
          output += `<p>${line}</p>`;
        } else {
          output += line;
        }
      }
      if (inUl) output += '</ul>';
      if (inOl) output += '</ol>';

      return output;
    }

    function update() {
      preview.innerHTML = parseMarkdown(input.value);
    }

    input.addEventListener('input', DP.debounce(update, 100));
    update();
  }
};