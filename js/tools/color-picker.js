/* ============================================================
   DEVPOCKET — Tool: Color Picker
   HEX ↔ RGB ↔ HSL dönüşümleri + renk önizleme
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['color-picker'] = {
  render(container) {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-4);">
        <div class="field">
          <label class="field__label" for="cpColor">Pick a color</label>
          <input type="color" id="cpColor" value="#8b5cf6"
                 style="width: 100%; height: 80px; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg-elevated); cursor: pointer; padding: 4px;" />
        </div>
        <div>
          <label class="field__label">Preview</label>
          <div id="cpPreview" style="width: 100%; height: 80px; border-radius: var(--radius-md); background: #8b5cf6; border: 1px solid var(--border);"></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-3);">
        <div class="field">
          <label class="field__label">HEX</label>
          <div style="display:flex; gap: 4px;">
            <input type="text" id="cpHex" class="input" value="#8b5cf6" />
            <button class="btn btn--secondary btn--sm" data-copy="cpHex">📋</button>
          </div>
        </div>
        <div class="field">
          <label class="field__label">RGB</label>
          <div style="display:flex; gap: 4px;">
            <input type="text" id="cpRgb" class="input" value="rgb(139, 92, 246)" readonly />
            <button class="btn btn--secondary btn--sm" data-copy="cpRgb">📋</button>
          </div>
        </div>
        <div class="field">
          <label class="field__label">HSL</label>
          <div style="display:flex; gap: 4px;">
            <input type="text" id="cpHsl" class="input" value="hsl(258, 90%, 66%)" readonly />
            <button class="btn btn--secondary btn--sm" data-copy="cpHsl">📋</button>
          </div>
        </div>
      </div>
    `;

    const colorInput = container.querySelector('#cpColor');
    const preview = container.querySelector('#cpPreview');
    const hexInput = container.querySelector('#cpHex');
    const rgbInput = container.querySelector('#cpRgb');
    const hslInput = container.querySelector('#cpHsl');

    /* HEX → RGB */
    function hexToRgb(hex) {
      const clean = hex.replace('#', '');
      const full = clean.length === 3
        ? clean.split('').map((c) => c + c).join('')
        : clean;
      const num = parseInt(full, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }

    /* RGB → HSL */
    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }

    /* Tüm alanları verilen HEX'ten güncelle */
    function updateFromHex(hex) {
      if (!/^#[0-9A-Fa-f]{3,6}$/.test(hex)) {
        DP.toast('Invalid HEX color', 'error');
        return;
      }
      const { r, g, b } = hexToRgb(hex);
      const { h, s, l } = rgbToHsl(r, g, b);

      hexInput.value = hex.toLowerCase();
      rgbInput.value = `rgb(${r}, ${g}, ${b})`;
      hslInput.value = `hsl(${h}, ${s}%, ${l}%)`;
      preview.style.background = hex;
      colorInput.value = hex.length === 4
        ? '#' + hex.slice(1).split('').map((c) => c + c).join('')
        : hex;
    }

    /* Kullanıcı renk seçicisini oynattığında */
    colorInput.addEventListener('input', () => updateFromHex(colorInput.value));

    /* Kullanıcı HEX kutusuna yazdığında */
    hexInput.addEventListener('input', () => {
      let v = hexInput.value.trim();
      if (v && !v.startsWith('#')) v = '#' + v;
      if (/^#[0-9A-Fa-f]{3,6}$/.test(v)) {
        updateFromHex(v);
      }
    });

    /* Kopyalama butonları */
    container.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = container.querySelector('#' + btn.dataset.copy);
        DP.copy(target.value);
      });
    });
  }
};