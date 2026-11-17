// Vérifie dist/ (script inline unique < 6 Ko) : 12 pages, hreflang, h1 unique, poids, JS, sitemap/robots, mailto, assets, contraste AA.
import fs from 'node:fs';
import path from 'node:path';
const slugs = ['', 'services', 'cas', 'a-propos', 'contact', 'mentions-legales'];
const pages = slugs.flatMap((s) => [s ? `${s}/` : '', s ? `en/${s}/` : 'en/']);
let bad = 0, warn = 0;
const fail = (m) => { bad++; console.log('FAIL', m); };
const warning = (m) => { warn++; console.log('WARN', m); };
for (const p of pages) {
  const f = path.join('dist', p, 'index.html');
  if (!fs.existsSync(f)) { fail('missing ' + f); continue; }
  const h = fs.readFileSync(f, 'utf8');
  const n = (h.match(/rel="alternate" hreflang=/g) || []).length;
  if (n !== 3) fail(`${f}: hreflang=${n}`);
  if ((h.match(/<h1[ >]/g) || []).length !== 1) fail(`${f}: h1 count`);
  if (fs.statSync(f).size > 150 * 1024) fail(`${f}: >150Ko`);
  const scripts = [...h.matchAll(/<script(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)];
  if (scripts.length !== 1 || scripts[0][1].length > 6144) fail(`${f}: script count/size`);
  if (!/hreflang="(en|fr)" lang=/.test(h)) fail(`${f}: language switch link`);
  if (/\[(À REMPLACER|REPLACE)\]/.test(h)) warning(`${f}: placeholder [À REMPLACER] présent`);
  if (/\[(À COMPLÉTER|TO COMPLETE)/.test(h)) warning(`${f}: texte à compléter présent`);
  console.log('ok', f, fs.statSync(f).size + ' o');
}
for (const f of ['sitemap-index.xml', 'sitemap-0.xml', 'robots.txt']) if (!fs.existsSync('dist/' + f)) fail('missing ' + f);
// mailto de rappel : un par langue, sujet et corps encodés
for (const [p, lang] of [['contact/', 'fr'], ['en/contact/', 'en']]) {
  const h = fs.readFileSync(path.join('dist', p, 'index.html'), 'utf8');
  const m = h.match(/href="mailto:[^"?]+\?subject=[^"&]+&(?:amp;)?body=[^"]+"/g) || [];
  if (m.length !== 1) fail(`${p}: lien mailto de rappel attendu 1, trouvé ${m.length}`);
}
// assets facultatifs
for (const a of ['fonts/Lora-Variable.woff2', 'fonts/DMSans-Variable.woff2', 'img/portrait-400.jpg', 'img/portrait-800.jpg', 'img/portrait-800.webp'])
  if (!fs.existsSync('dist/' + a)) warning('asset absent : ' + a);
// contraste WCAG AA
const css = fs.readFileSync('src/styles/global.css', 'utf8');
const v = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2]]));
const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(v[a]), lum(v[b])].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
// paires texte/fond réellement utilisées dans global.css ; min 4.5 (texte courant)
const pairs = [['earth-text', 'cream'], ['earth-text', 'cream-dark'], ['on-moss', 'moss'], ['on-moss-soft', 'moss'], ['on-moss', 'ink'], ['on-moss-soft', 'ink'], ['cream', 'ink'], ['ink', 'cream'], ['ink-soft', 'cream'], ['moss', 'cream'], ['moss', 'cream-dark'], ['ink-soft', 'cream-dark'], ['ink', 'cream-dark'],
  ['cream', 'moss'], ['moss-light', 'cream'], ['moss-light', 'cream-dark']];
for (const [fg, bg] of pairs) { const r = ratio(fg, bg); console.log(`contraste ${fg} sur ${bg} : ${r.toFixed(2)}`); if (r < 4.5) fail(`contraste ${fg}/${bg} ${r.toFixed(2)} < 4.5`); }
const rm = ratio('muted', 'cream'); console.log(`contraste muted sur cream : ${rm.toFixed(2)} (non utilisé pour du texte)`);
console.log(bad ? `${bad} échec(s), ${warn} avertissement(s)` : `TOUT OK (${warn} avertissement(s))`);
process.exit(bad ? 1 : 0);
