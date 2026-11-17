/* ============================================================
   DEVPOCKET — Tool: Base64 Encoder / Decoder
   Metin ↔ Base64 dönüşümü (UTF-8 destekli)
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['base64'] = {
  render(container) {
    container.innerHTML = `
      <div class="field" style="margin-bottom: var(--space-4);">
        <label class="field__label" for="b64Input">Input</label>
        <textarea id="b64Input" class="textarea" placeholder="Type or paste text here…" rows="6"></textarea>
      </div>

      <div style="display:flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn btn--primary" id="b64Encode">Encode → Base64</button>
        <button class="btn btn--secondary" id="b64Decode">Decode ← Base64</button>
        <button class="btn btn--ghost" id="b64Clear">Clear</button>
      </div>

      <div class="field">
        <div style="display:flex; justify-content: space-between; align-items: center;">
          <label class="field__label">Output</label>
          <button class="btn btn--secondary btn--sm" id="b64Copy">Copy</button>
        </div>
        <textarea id="b64Output" class="textarea" rows="6" readonly></textarea>
      </div>
    `;

    const input = container.querySelector('#b64Input');
    const output = container.querySelector('#b64Output');
    const encodeBtn = container.querySelector('#b64Encode');
    const decodeBtn = container.querySelector('#b64Decode');
    const clearBtn = container.querySelector('#b64Clear');
    const copyBtn = container.querySelector('#b64Copy');

    /* UTF-8 güvenli encode (Türkçe karakterler için) */
    function encode(str) {
      try {
        return btoa(unescape(encodeURIComponent(str)));
      } catch (e) {
        throw new Error('Cannot encode this text.');
      }
    }

    function decode(str) {
      try {
        return decodeURIComponent(escape(atob(str.trim())));
      } catch (e) {
        throw new Error('Invalid Base64 string.');
      }
    }

    encodeBtn.addEventListener('click', () => {
      const text = input.value;
      if (!text) {
        DP.toast('Please enter some text first', 'error');
        return;
      }
      try {
        output.value = encode(text);
        DP.toast('Encoded to Base64', 'success');
      } catch (e) {
        DP.toast(e.message, 'error');
      }
    });

    decodeBtn.addEventListener('click', () => {
      const text = input.value;
      if (!text) {
        DP.toast('Please enter a Base64 string', 'error');
        return;
      }
      try {
        output.value = decode(text);
        DP.toast('Decoded from Base64', 'success');
      } catch (e) {
        DP.toast(e.message, 'error');
      }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      output.value = '';
      input.focus();
    });

    copyBtn.addEventListener('click', () => DP.copy(output.value, 'Output copied'));
  }
};