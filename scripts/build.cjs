'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'src', name), 'utf8');
const css = read('fonts.css') + '\n' + read('styles.css');
const modules = ['model.cjs', 'view.cjs', 'controller.cjs'];
const script = `(() => {
  'use strict';
  const definitions = {
${modules.map(name => `    ${JSON.stringify('./'+name)}: (module, exports, require) => {\n${read(name)}\n    }`).join(',\n')}
  };
  const cache = Object.create(null);
  function load(id) {
    if (!Object.hasOwn(definitions, id)) throw new Error('Unknown NABRA module: ' + id);
    if (cache[id]) return cache[id].exports;
    const module = cache[id] = { exports: {} };
    definitions[id](module, module.exports, load);
    return module.exports;
  }
  load('./controller.cjs').createController({
    document, window, Blob, URL,
    SpeechSynthesisUtterance: window.SpeechSynthesisUtterance
  });
})();`;
const template = read('index.template.html');
for (const token of ['<!-- NABRA_STYLES -->', '<!-- NABRA_APP -->']) {
  if (!template.includes(token)) throw new Error('Missing build marker: ' + token);
}
// Use replacement callbacks so strings such as $1 in the UI are preserved.
const html = template
  .replace('<!-- NABRA_STYLES -->', () => '<style>\n' + css + '</style>')
  .replace('<!-- NABRA_APP -->', () => '<script>\n' + script.replace(/<\/script/gi, '<\\/script') + '\n</script>');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log('Built dist/index.html (standalone, no runtime dependencies).');
