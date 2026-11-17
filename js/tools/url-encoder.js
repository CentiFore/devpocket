/* ============================================================
   DEVPOCKET — Tool: URL Encoder / Decoder
   URL ve sorgu parametrelerini encode/decode eder
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['url-encoder'] = {
  render(container) {
    container.innerHTML = `
      <div class="field" style="margin-bottom: var(--space-4);">
        <label class="field__label" for="urlInput">Input</label>
        <textarea id="urlInput" class="textarea" placeholder="Type or paste URL / text here…" rows="6"></textarea>
      </div>

      <div style="display:flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn btn--primary" id="urlEncode">Encode</button>
        <button class="btn btn--secondary" id="urlDecode">Decode</button>
        <button class="btn btn--ghost" id="urlClear">Clear</button>
      </div>

      <div class="field">
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <label class="field__label">Output</label>
          <button class="btn btn--secondary btn--sm" id="urlCopy">Copy</button>
        </div>
        <textarea id="urlOutput" class="textarea" rows="6" readonly></textarea>
      </div>
    `;

    const input = container.querySelector('#urlInput');
    const output = container.querySelector('#urlOutput');

    container.querySelector('#urlEncode').addEventListener('click', () => {
      const text = input.value;
      if (!text) return DP.toast('Please enter some text first', 'error');
      try {
        output.value = encodeURIComponent(text);
        DP.toast('Encoded', 'success');
      } catch (e) {
        DP.toast('Cannot encode this text', 'error');
      }
    });

    container.querySelector('#urlDecode').addEventListener('click', () => {
      const text = input.value;
      if (!text) return DP.toast('Please enter some text first', 'error');
      try {
        output.value = decodeURIComponent(text);
        DP.toast('Decoded', 'success');
      } catch (e) {
        DP.toast('Invalid URL-encoded string', 'error');
      }
    });

    container.querySelector('#urlClear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      input.focus();
    });

    container.querySelector('#urlCopy').addEventListener('click', () => {
      DP.copy(output.value, 'Output copied');
    });
  }
};