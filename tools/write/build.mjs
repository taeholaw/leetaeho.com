import { readFileSync, writeFileSync } from 'node:fs';
const [,, tpl, out, L] = process.argv;
const lib = (p, name) => `<script>/* ${name} — MIT License */\n${readFileSync(p, 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, '').replace(/<\/script/gi, '<\\/script')}\n</script>`;
const libs = [
  lib(`${L}/marked/lib/marked.umd.js`, 'marked (github.com/markedjs/marked)'),
  lib(`${L}/turndown/lib/turndown.browser.umd.js`, 'turndown (github.com/mixmark-io/turndown)'),
  lib(`${L}/turndown-plugin-gfm/dist/turndown-plugin-gfm.js`, 'turndown-plugin-gfm (github.com/mixmark-io/turndown-plugin-gfm)'),
].join('\n');
writeFileSync(out, readFileSync(tpl, 'utf8').replace('<!--__LIBS__-->', () => libs));
