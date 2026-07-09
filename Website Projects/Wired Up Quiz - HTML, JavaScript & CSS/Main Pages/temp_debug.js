const fs = require('fs');
const script = fs.readFileSync('scripts.js', 'utf8');
const match = script.match(/function formatCode[\s\S]*?\n\}/);
if (!match) {
  console.error('formatCode not found');
  process.exit(1);
}
const fnSource = match[0];
console.log('FORMAT CODE FUNCTION:');
console.log(fnSource);

const formatCode = new Function('code', fnSource + '\n return formatCode(code);');
const code = `<form>\n  <input type="email" placeholder="Enter email">\n  <button type="submit">Submit</button>\n</form>`;
console.log('OUTPUT:');
console.log(formatCode(code));
