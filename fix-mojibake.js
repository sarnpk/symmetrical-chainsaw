const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'reclaim-app', 'src');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) results = results.concat(walkDir(filePath));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(filePath);
  });
  return results;
}

// Full CP1252 byte → Unicode codepoint mapping
const cp1252ToUnicode = {};
cp1252ToUnicode[0x80] = 0x20AC; cp1252ToUnicode[0x81] = 0x0081; cp1252ToUnicode[0x82] = 0x201A;
cp1252ToUnicode[0x83] = 0x0192; cp1252ToUnicode[0x84] = 0x201E; cp1252ToUnicode[0x85] = 0x2026;
cp1252ToUnicode[0x86] = 0x2020; cp1252ToUnicode[0x87] = 0x2021; cp1252ToUnicode[0x88] = 0x02C6;
cp1252ToUnicode[0x89] = 0x2030; cp1252ToUnicode[0x8A] = 0x0160; cp1252ToUnicode[0x8B] = 0x2039;
cp1252ToUnicode[0x8C] = 0x0152; cp1252ToUnicode[0x8D] = 0x008D; cp1252ToUnicode[0x8E] = 0x017D;
cp1252ToUnicode[0x8F] = 0x008F; cp1252ToUnicode[0x90] = 0x0090; cp1252ToUnicode[0x91] = 0x2018;
cp1252ToUnicode[0x92] = 0x2019; cp1252ToUnicode[0x93] = 0x201C; cp1252ToUnicode[0x94] = 0x201D;
cp1252ToUnicode[0x95] = 0x2022; cp1252ToUnicode[0x96] = 0x2013; cp1252ToUnicode[0x97] = 0x2014;
cp1252ToUnicode[0x98] = 0x02DC; cp1252ToUnicode[0x99] = 0x2122; cp1252ToUnicode[0x9A] = 0x0160;
cp1252ToUnicode[0x9B] = 0x203A; cp1252ToUnicode[0x9C] = 0x0152; cp1252ToUnicode[0x9D] = 0x009D;
cp1252ToUnicode[0x9E] = 0x017D; cp1252ToUnicode[0x9F] = 0x0178;
// 0xA0-0xFF map directly to Unicode

// Reverse: Unicode codepoint → CP1252 byte
const unicodeToCp1252 = new Map();
for (const [byte, codepoint] of Object.entries(cp1252ToUnicode)) {
  unicodeToCp1252.set(codepoint, parseInt(byte));
}
// ASCII printable
for (let i = 0x20; i <= 0x7E; i++) unicodeToCp1252.set(i, i);
// 0xA0-0xFF
for (let i = 0xA0; i <= 0xFF; i++) unicodeToCp1252.set(i, i);

function fixMojibake(str) {
  // Match ð (U+00F0) followed by characters that could be CP1252-encoded bytes
  // We need to be greedy but not consume non-CP1252 characters
  const cp1252Chars = '\u0080-\u009F\u00A0-\u00FF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u20AC\u2122';
  const regex = new RegExp(`\u00F0([${cp1252Chars}]+)`, 'g');
  
  return str.replace(regex, (match, rest) => {
    const bytes = [0xF0];
    let valid = true;
    
    for (const ch of rest) {
      const codepoint = ch.codePointAt(0);
      if (unicodeToCp1252.has(codepoint)) {
        bytes.push(unicodeToCp1252.get(codepoint));
      } else {
        valid = false;
        break;
      }
    }
    
    if (!valid) return match;
    
    try {
      const buf = Buffer.from(bytes);
      const decoded = buf.toString('utf8');
      if (decoded.length > 0 && decoded.codePointAt(0) > 0x7F) {
        return decoded;
      }
    } catch (e) {}
    
    return match;
  });
}

const files = walkDir(srcDir);
let count = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('\u00F0')) continue;
  
  const fixed = fixMojibake(content);
  if (fixed !== content) {
    fs.writeFileSync(file, fixed, 'utf8');
    count++;
    console.log(`Fixed: ${path.relative(path.join(__dirname, 'reclaim-app'), file)}`);
  }
}

console.log(`\nTotal: fixed ${count} files`);
