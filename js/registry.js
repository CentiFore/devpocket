/* ============================================================
   DEVPOCKET — registry.js
   Tüm araçların kayıt defteri (isim, ikon, açıklama, kategori)
   ============================================================ */

window.DP = window.DP || {};

/* ---------- İKONLAR (inline SVG, Lucide stili) ---------- */
const ICONS = {
  json: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"></path><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"></path></svg>',
  base64: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>',
  url: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
  color: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>',
  uuid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
  lorem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="15" y1="12" x2="3" y2="12"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>',
  markdown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M6 15V9l3 4 3-4v6"></path><path d="M17 9v6"></path><path d="M15 13l2 2 2-2"></path></svg>',
  snippet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"></path><path d="M8 6l-6 6 6 6"></path></svg>',
  text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  timestamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
};

/* ---------- ARAÇ LİSTESİ ---------- */
DP.TOOLS = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    desc: 'Format, validate and beautify JSON data.',
    category: 'Data',
    icon: ICONS.json
  },
  {
    id: 'base64',
    name: 'Base64 Encoder',
    desc: 'Encode and decode Base64 strings safely.',
    category: 'Encoding',
    icon: ICONS.base64
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder',
    desc: 'Encode and decode URLs and query strings.',
    category: 'Encoding',
    icon: ICONS.url
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    desc: 'Convert between HEX, RGB and HSL color formats.',
    category: 'Design',
    icon: ICONS.color
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    desc: 'Generate v4 UUIDs in bulk with one click.',
    category: 'Generators',
    icon: ICONS.uuid
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    desc: 'Generate placeholder text for your designs.',
    category: 'Generators',
    icon: ICONS.lorem
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Preview',
    desc: 'Write Markdown and see live HTML preview.',
    category: 'Text',
    icon: ICONS.markdown
  },
  {
    id: 'snippet-manager',
    name: 'Snippet Manager',
    desc: 'Save, organize and reuse your code snippets.',
    category: 'Productivity',
    icon: ICONS.snippet
  },
  {
    id: 'text-counter',
    name: 'Text Counter',
    desc: 'Count words, characters, lines and more.',
    category: 'Text',
    icon: ICONS.text
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    desc: 'Convert between Unix timestamps and dates.',
    category: 'Date & Time',
    icon: ICONS.timestamp
  }
];

/* ---------- YARDIMCI: id ile araç bul ---------- */
DP.getTool = function (id) {
  return DP.TOOLS.find((t) => t.id === id);
};