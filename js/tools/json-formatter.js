/* ============================================================
   DEVPOCKET — Tool: JSON Formatter
   Format, validate, minify JSON (syntax highlight yok, sade)
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['json-formatter'] = {
  render(container) {
    container.innerHTML = `
      <div class="field" style="margin-bottom: var(--space-4);">
        <label class="field__label" for="jsonInput">JSON Input</label>
        <textarea id="jsonInput" class="textarea" rows="10" placeholder='{"name": "DevPocket", "version": 1}'></textarea>
      </div>

      <div style="display:flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn btn--primary" id="jsonFormat">Format</button>
        <button class="btn btn--secondary" id="jsonMinify">Minify</button>
        <button class="btn btn--secondary" id="jsonValidate">Validate</button>
        <button class="btn btn--ghost" id="jsonClear">Clear</button>
      </div>

      <div id="jsonError" style="display:none; padding: var(--space-3); background: rgba(239,68,68,0.1); border-left: 3px solid var(--error); border-radius: var(--radius-sm); color: var(--error); font-size: 0.875rem; margin-bottom: var(--space-4);"></div>

      <div class="field">
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <label class="field__label">Result</label>
          <button class="btn btn--secondary btn--sm" id="jsonCopy">Copy</button>
        </div>
        <textarea id="jsonOutput" class="textarea" rows="10" readonly></textarea>
      </div>
    `;

    const input = container.querySelector('#jsonInput');
    const output = container.querySelector('#jsonOutput');
    const errorBox = container.querySelector('#jsonError');

    /* Hata mesajını göster/gizle */
    function showError(msg) {
      errorBox.textContent = '⚠ ' + msg;
      errorBox.style.display = 'block';
    }
    function clearError() {
      errorBox.style.display = 'none';
    }

    /* Ortak işlem: veriyi al, dönüştür, sonucu yaz */
    function process(mode) {
      clearError();
      const text = input.value.trim();

      if (!text) {
        DP.toast('Please enter some JSON first', 'error');
        return;
      }

      try {
        const parsed = JSON.parse(text);

        if (mode === 'format') {
          output.value = JSON.stringify(parsed, null, 2);
          DP.toast('JSON formatted', 'success');
        } else if (mode === 'minify') {
          output.value = JSON.stringify(parsed);
          DP.toast('JSON minified', 'success');
        } else if (mode === 'validate') {
          output.value = text;
          DP.toast('✅ Valid JSON', 'success');
        }
      } catch (err) {
        output.value = '';
        showError(err.message);
        DP.toast('Invalid JSON', 'error');
      }
    }

    container.querySelector('#jsonFormat').addEventListener('click', () => process('format'));
    container.querySelector('#jsonMinify').addEventListener('click', () => process('minify'));
    container.querySelector('#jsonValidate').addEventListener('click', () => process('validate'));
    container.querySelector('#jsonClear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      clearError();
      input.focus();
    });
    container.querySelector('#jsonCopy').addEventListener('click', () => DP.copy(output.value));
  }
};