/* ============================================================
   DEVPOCKET — Tool: Lorem Ipsum Generator
   Klasik latin placeholder metin üretir
   ============================================================ */

window.DP = window.DP || {};
DP.tools = DP.tools || {};

DP.tools['lorem-ipsum'] = {
  render(container) {
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-4);">
        <div class="field">
          <label class="field__label" for="liType">Type</label>
          <select id="liType" class="select">
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="liCount">Count</label>
          <input type="number" id="liCount" class="input" value="3" min="1" max="50" />
        </div>
        <div class="field">
          <label class="field__label" for="liStart">Start with "Lorem ipsum…"</label>
          <select id="liStart" class="select">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div style="display:flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4);">
        <button class="btn btn--primary" id="liGenerate">Generate</button>
        <button class="btn btn--secondary" id="liCopy">Copy</button>
      </div>

      <div class="field">
        <label class="field__label">Result</label>
        <textarea id="liOutput" class="textarea" rows="12" readonly></textarea>
      </div>
    `;

    /* Klasik lorem ipsum kelime havuzu */
    const WORDS = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
      'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
      'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
      'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
      'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    const OPENING = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

    function randomWord() {
      return WORDS[Math.floor(Math.random() * WORDS.length)];
    }

    function randomSentence() {
      const len = 8 + Math.floor(Math.random() * 8);
      const words = Array.from({ length: len }, randomWord);
      const s = words.join(' ');
      return s.charAt(0).toUpperCase() + s.slice(1) + '.';
    }

    function randomParagraph() {
      const len = 3 + Math.floor(Math.random() * 3);
      return Array.from({ length: len }, randomSentence).join(' ');
    }

    const typeSelect = container.querySelector('#liType');
    const countInput = container.querySelector('#liCount');
    const startSelect = container.querySelector('#liStart');
    const output = container.querySelector('#liOutput');

    function generate() {
      const type = typeSelect.value;
      const count = Math.min(Math.max(parseInt(countInput.value, 10) || 1, 1), 50);
      const startWithLorem = startSelect.value === 'yes';

      let result = '';

      if (type === 'words') {
        const words = Array.from({ length: count }, randomWord);
        if (startWithLorem) {
          const fixed = OPENING.toLowerCase().split(' ').slice(0, count);
          result = fixed.length
            ? fixed.join(' ') + (count > fixed.length ? ' ' + words.slice(fixed.length).join(' ') : '')
            : words.join(' ');
        } else {
          result = words.join(' ');
        }
        result = result.charAt(0).toUpperCase() + result.slice(1) + '.';
      } else if (type === 'sentences') {
        const sents = Array.from({ length: count }, randomSentence);
        if (startWithLorem) sents[0] = OPENING + '.';
        result = sents.join(' ');
      } else {
        const paras = Array.from({ length: count }, randomParagraph);
        if (startWithLorem) paras[0] = OPENING + '. ' + paras[0];
        result = paras.join('\n\n');
      }

      output.value = result;
      DP.toast('Generated', 'success');
    }

    container.querySelector('#liGenerate').addEventListener('click', generate);
    container.querySelector('#liCopy').addEventListener('click', () => DP.copy(output.value));

    generate();
  }
};