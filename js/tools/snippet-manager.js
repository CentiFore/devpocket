/* ============================================================
   DEVPOCKET — Tool: Snippet Manager
   Kod parçacıklarını kaydet / düzenle / sil (LocalStorage)
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['snippet-manager'] = {
  render(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-2);">
        <input type="search" id="smSearch" class="input" placeholder="Search snippets…" style="max-width: 320px; flex: 1;" />
        <button class="btn btn--primary" id="smNew">+ New Snippet</button>
      </div>

      <div id="smList"></div>
    `;

    const list = container.querySelector('#smList');
    const searchInput = container.querySelector('#smSearch');

    /* ---------- Liste render ---------- */
    function renderList() {
      const query = (searchInput.value || '').toLowerCase().trim();
      let snippets = DP.storage.getSnippets();

      if (query) {
        snippets = snippets.filter((s) =>
          s.title.toLowerCase().includes(query) ||
          (s.language || '').toLowerCase().includes(query) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(query))
        );
      }

      if (snippets.length === 0) {
        list.innerHTML = `
          <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
            <p style="font-size: 2rem; margin-bottom: 8px;">📝</p>
            <p>${query ? 'No snippets match your search.' : 'No snippets yet. Click "New Snippet" to create one.'}</p>
          </div>
        `;
        return;
      }

      list.innerHTML = snippets.map((s) => `
        <article style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-3);">
          <div style="display:flex; justify-content: space-between; align-items: flex-start; gap: var(--space-2); margin-bottom: var(--space-2);">
            <div style="flex: 1; min-width: 0;">
              <h3 style="font-size: 1rem; margin-bottom: 4px;">${DP.escapeHtml(s.title)}</h3>
              <div style="display:flex; gap: 6px; flex-wrap: wrap; font-size: 0.75rem; color: var(--text-muted);">
                ${s.language ? `<span style="background: var(--accent-soft); color: var(--accent-1); padding: 2px 8px; border-radius: 4px;">${DP.escapeHtml(s.language)}</span>` : ''}
                ${(s.tags || []).map((t) => `<span style="background: var(--bg-primary); padding: 2px 8px; border-radius: 4px;">#${DP.escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
            <div style="display: flex; gap: 4px;">
              <button class="btn btn--secondary btn--sm" data-action="copy" data-id="${s.id}">📋</button>
              <button class="btn btn--secondary btn--sm" data-action="edit" data-id="${s.id}">✏️</button>
              <button class="btn btn--ghost btn--sm" data-action="delete" data-id="${s.id}" style="color: var(--error);">🗑</button>
            </div>
          </div>
          <pre style="background: var(--bg-primary); border-radius: var(--radius-sm); padding: 10px; margin: 8px 0 0; font-family: var(--font-mono); font-size: 0.8125rem; overflow-x: auto; max-height: 200px;"><code>${DP.escapeHtml(s.code)}</code></pre>
        </article>
      `).join('');

      /* Event delegation */
      list.querySelectorAll('[data-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const action = btn.dataset.action;
          const snippet = DP.storage.getSnippets().find((s) => s.id === id);
          if (!snippet) return;

          if (action === 'copy') {
            DP.copy(snippet.code, 'Snippet copied');
          } else if (action === 'edit') {
            openEditor(snippet);
          } else if (action === 'delete') {
            if (confirm(`Delete "${snippet.title}"?`)) {
              DP.storage.deleteSnippet(id);
              renderList();
              DP.toast('Snippet deleted', 'success');
            }
          }
        });
      });
    }

    /* ---------- Editör (modal) ---------- */
    function openEditor(snippet = null) {
      const isEdit = !!snippet;
      const data = snippet || { id: DP.uid(), title: '', code: '', language: '', tags: [] };

      const form = document.createElement('div');

      form.innerHTML = `
        <div class="field">
          <label class="field__label">Title</label>
          <input type="text" class="input" id="smTitle" value="${DP.escapeHtml(data.title)}" placeholder="e.g. Fetch with timeout" />
        </div>
        <div class="field">
          <label class="field__label">Language</label>
          <input type="text" class="input" id="smLang" value="${DP.escapeHtml(data.language || '')}" placeholder="e.g. javascript, python" />
        </div>
        <div class="field">
          <label class="field__label">Tags (comma separated)</label>
          <input type="text" class="input" id="smTags" value="${(data.tags || []).join(', ')}" placeholder="e.g. api, async" />
        </div>
        <div class="field">
          <label class="field__label">Code</label>
          <textarea class="textarea" id="smCode" rows="10" placeholder="Paste your code here…">${DP.escapeHtml(data.code)}</textarea>
        </div>
        <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-2);">
          <button class="btn btn--ghost" id="smCancel">Cancel</button>
          <button class="btn btn--primary" id="smSave">${isEdit ? 'Save' : 'Create'}</button>
        </div>
      `;

      DP.openModal(isEdit ? 'Edit Snippet' : 'New Snippet', form);

      form.querySelector('#smCancel').addEventListener('click', DP.closeModal);
      form.querySelector('#smSave').addEventListener('click', () => {
        const title = form.querySelector('#smTitle').value.trim();
        const code = form.querySelector('#smCode').value;
        if (!title) return DP.toast('Title is required', 'error');
        if (!code.trim()) return DP.toast('Code cannot be empty', 'error');

        const updated = {
          id: data.id,
          title,
          code,
          language: form.querySelector('#smLang').value.trim(),
          tags: form.querySelector('#smTags').value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          updatedAt: Date.now()
        };

        DP.storage.saveSnippet(updated);
        DP.closeModal();
        renderList();
        DP.toast(isEdit ? 'Snippet updated' : 'Snippet created', 'success');
      });

      // Kısa süre sonra title'a odaklan
      setTimeout(() => form.querySelector('#smTitle').focus(), 50);
    }

    /* ---------- Event'ler ---------- */
    container.querySelector('#smNew').addEventListener('click', () => openEditor());
    searchInput.addEventListener('input', DP.debounce(renderList, 150));

    renderList();
  }
};