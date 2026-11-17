/* ============================================================
   DEVPOCKET — Tool: Text Counter
   Kelime, karakter, satır, cümle sayar
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['text-counter'] = {
  render(container) {
    container.innerHTML = `
      <div class="field" style="margin-bottom: var(--space-4);">
        <label class="field__label" for="tcInput">Text</label>
        <textarea id="tcInput" class="textarea" placeholder="Start typing…" rows="10"></textarea>
      </div>

      <div class="tc-stats">
        <div class="tc-stat"><span class="tc-stat__value" id="tcChars">0</span><span class="tc-stat__label">Characters</span></div>
        <div class="tc-stat"><span class="tc-stat__value" id="tcCharsNoSpace">0</span><span class="tc-stat__label">No spaces</span></div>
        <div class="tc-stat"><span class="tc-stat__value" id="tcWords">0</span><span class="tc-stat__label">Words</span></div>
        <div class="tc-stat"><span class="tc-stat__value" id="tcSentences">0</span><span class="tc-stat__label">Sentences</span></div>
        <div class="tc-stat"><span class="tc-stat__value" id="tcLines">0</span><span class="tc-stat__label">Lines</span></div>
        <div class="tc-stat"><span class="tc-stat__value" id="tcReadTime">0s</span><span class="tc-stat__label">Read time</span></div>
      </div>

      <style>
        .tc-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--space-3);
        }
        .tc-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: var(--space-4);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .tc-stat__value {
          font-size: 1.5rem;
          font-weight: 700;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tc-stat__label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
      </style>
    `;

    const input = container.querySelector('#tcInput');
    const el = {
      chars: container.querySelector('#tcChars'),
      charsNoSpace: container.querySelector('#tcCharsNoSpace'),
      words: container.querySelector('#tcWords'),
      sentences: container.querySelector('#tcSentences'),
      lines: container.querySelector('#tcLines'),
      readTime: container.querySelector('#tcReadTime')
    };

    function update() {
      const text = input.value;

      el.chars.textContent = text.length;
      el.charsNoSpace.textContent = text.replace(/\s/g, '').length;

      /* Kelime: boşluklara göre böl, boş olanları at */
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      el.words.textContent = words;

      /* Cümle: nokta, ünlem, soru işaretine göre */
      const sentences = text.trim()
        ? (text.match(/[.!?…]+/g) || []).length || (text.trim() ? 1 : 0)
        : 0;
      el.sentences.textContent = sentences;

      /* Satır */
      el.lines.textContent = text ? text.split('\n').length : 0;

      /* Okuma süresi: ~200 kelime/dakika */
      const seconds = Math.ceil((words / 200) * 60);
      el.readTime.textContent = seconds < 60
        ? `${seconds}s`
        : `${Math.ceil(seconds / 60)}m`;
    }

    /* debounce ile her harfte değil, 80ms sonra */
    input.addEventListener('input', DP.debounce(update, 80));
    update();
  }
};