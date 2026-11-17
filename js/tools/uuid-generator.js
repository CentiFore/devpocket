/* ============================================================
   DEVPOCKET — Tool: UUID Generator
   v4 UUID üretir (toplu halde)
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['uuid-generator'] = {
  render(container) {
    container.innerHTML = `
      <div class="field" style="margin-bottom: var(--space-4);">
        <label class="field__label" for="uuidCount">How many UUIDs?</label>
        <div style="display:flex; gap: var(--space-2);">
          <input type="number" id="uuidCount" class="input" value="5" min="1" max="100" style="max-width: 120px;" />
          <button class="btn btn--primary" id="uuidGenerate">Generate</button>
        </div>
      </div>
      <div class="field">
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <label class="field__label">Result</label>
          <button class="btn btn--secondary btn--sm" id="uuidCopyAll">Copy all</button>
        </div>
        <textarea id="uuidOutput" class="textarea" rows="10" readonly style="min-height: 220px;"></textarea>
      </div>
    `;

    const countInput = container.querySelector('#uuidCount');
    const generateBtn = container.querySelector('#uuidGenerate');
    const output = container.querySelector('#uuidOutput');
    const copyBtn = container.querySelector('#uuidCopyAll');

    /* v4 UUID üretici — crypto API kullanır (güvenli) */
    function uuidv4() {
      // Modern tarayıcılarda crypto.randomUUID() var
      if (crypto.randomUUID) return crypto.randomUUID();

      // Fallback: manuel üret (eski tarayıcılar)
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    function generate() {
      const n = Math.min(Math.max(parseInt(countInput.value, 10) || 1, 1), 100);
      countInput.value = n;
      const list = Array.from({ length: n }, uuidv4);
      output.value = list.join('\n');
      DP.toast(`${n} UUID${n > 1 ? 's' : ''} generated`, 'success');
    }

    generateBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', () => DP.copy(output.value, 'All UUIDs copied'));
    countInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generate();
    });

    // Sayfa açılır açılmaz 5 tane üret
    generate();
  }
};