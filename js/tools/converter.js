/* ============================================================
   DEVPOCKET — Tool: Timestamp Converter
   Unix timestamp ↔ İnsan okunabilir tarih dönüşümü
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['timestamp-converter'] = {
  render(container) {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-4);">

        <!-- Sol: Timestamp → Date -->
        <div class="field">
          <label class="field__label" for="tsInput">Unix Timestamp (seconds)</label>
          <div style="display:flex; gap: 6px;">
            <input type="number" id="tsInput" class="input" placeholder="1700000000" />
            <button class="btn btn--primary btn--sm" id="tsToDate">→ Date</button>
          </div>
          <button class="btn btn--ghost btn--sm" id="tsNow" style="align-self: flex-start; margin-top: 4px;">Use current time</button>
        </div>

        <!-- Sağ: Date → Timestamp -->
        <div class="field">
          <label class="field__label" for="dateInput">Date → Timestamp</label>
          <div style="display:flex; gap: 6px;">
            <input type="datetime-local" id="dateInput" class="input" />
            <button class="btn btn--secondary btn--sm" id="dateToTs">→ TS</button>
          </div>
        </div>
      </div>

      <!-- Sonuç kutusu -->
      <div id="tsResult" style="display:none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
          <label class="field__label">Result</label>
          <button class="btn btn--secondary btn--sm" id="tsCopy">Copy</button>
        </div>
        <div id="tsResultContent" style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); font-family: var(--font-mono); font-size: 0.875rem; line-height: 1.8;"></div>
      </div>
    `;

    const tsInput = container.querySelector('#tsInput');
    const dateInput = container.querySelector('#dateInput');
    const result = container.querySelector('#tsResult');
    const resultContent = container.querySelector('#tsResultContent');

    /* Sonucu formatlı şekilde göster */
    function showResult(items) {
      result.style.display = 'block';
      resultContent.innerHTML = items.map(({ label, value }) => `
        <div><span style="color: var(--text-muted);">${label}:</span> <strong>${DP.escapeHtml(value)}</strong></div>
      `).join('');
    }

    /* Timestamp → Date */
    function tsToDate(ts) {
      // Saniye cinsinden mi milisaniye mi? 10 haneliyse saniye
      let ms = ts;
      if (String(ts).length <= 10) ms = ts * 1000;

      const d = new Date(ms);
      if (isNaN(d.getTime())) {
        DP.toast('Invalid timestamp', 'error');
        return;
      }

      showResult([
        { label: 'UTC',       value: d.toUTCString() },
        { label: 'ISO 8601',  value: d.toISOString() },
        { label: 'Local',     value: d.toLocaleString() },
        { label: 'Relative',  value: relativeTime(d) }
      ]);
    }

    /* Date → Timestamp */
    function dateToTs(localString) {
      const d = new Date(localString);
      if (isNaN(d.getTime())) {
        DP.toast('Invalid date', 'error');
        return;
      }
      showResult([
        { label: 'Unix (s)',  value: Math.floor(d.getTime() / 1000) },
        { label: 'Unix (ms)', value: d.getTime() },
        { label: 'ISO 8601',  value: d.toISOString() },
        { label: 'UTC',       value: d.toUTCString() }
      ]);
    }

    /* "3 gün önce" gibi relative gösterim */
    function relativeTime(date) {
      const diff = Math.floor((Date.now() - date.getTime()) / 1000);
      const abs = Math.abs(diff);
      const suffix = diff >= 0 ? 'ago' : 'from now';
      if (abs < 60) return `${abs} seconds ${suffix}`;
      if (abs < 3600) return `${Math.floor(abs / 60)} minutes ${suffix}`;
      if (abs < 86400) return `${Math.floor(abs / 3600)} hours ${suffix}`;
      if (abs < 2592000) return `${Math.floor(abs / 86400)} days ${suffix}`;
      if (abs < 31536000) return `${Math.floor(abs / 2592000)} months ${suffix}`;
      return `${Math.floor(abs / 31536000)} years ${suffix}`;
    }

    /* Butonlar */
    container.querySelector('#tsToDate').addEventListener('click', () => {
      const v = parseInt(tsInput.value, 10);
      if (isNaN(v)) return DP.toast('Please enter a number', 'error');
      tsToDate(v);
    });

    container.querySelector('#dateToTs').addEventListener('click', () => {
      if (!dateInput.value) return DP.toast('Please pick a date', 'error');
      dateToTs(dateInput.value);
    });

    container.querySelector('#tsNow').addEventListener('click', () => {
      const now = Math.floor(Date.now() / 1000);
      tsInput.value = now;
      tsToDate(now);
    });

    container.querySelector('#tsCopy').addEventListener('click', () => {
      DP.copy(resultContent.innerText, 'Result copied');
    });

    /* İlk açılışta şu anki zamanı göster */
    const now = Math.floor(Date.now() / 1000);
    tsInput.value = now;
    tsToDate(now);
  }
};