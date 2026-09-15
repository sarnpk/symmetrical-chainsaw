const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'reclaim-app', 'src');

function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) { fs.writeFileSync(p, c, 'utf8'); }

// ---- GLOBAL pattern replacements (unambiguous, decodable) ----
// CP1252 remant bytes after lost F0/9F: š=0x9A, ž=0x9E, œ=0x9C maps to U+1F6Ax / U+1F6Ex / U+1F49C family
const globalReplacements = [
  ['\uFFFD\u0161\u00A8', '\u{1F6A8}'], // �š¨ -> 🚨
  ['\uFFFD\u0161\u20AC', '\u{1F680}'], // �š€ -> 🚀
  ['\uFFFD\u0153', '\u{1F49C}'],       // �œ  -> 💜
  ['\uFFFD\u0161\u00AA', '\u{1F6AA}'], // �šª -> 🚪
  ['\uFFFD\u0161\u00AB', '\u{1F6AB}'], // �š« -> 🚫
  ['\uFFFD\u017E', '\u{1F6E1}\uFE0F'], // �ž  -> 🛡️
  ['\uFFFD\u0161', '\u{1F6A8}'],       // �š  (remaining) -> 🚨
];

// ---- PER-FILE context replacements (lossy, mapped by surrounding text) ----
const fileReplacements = {
  'app/crisis-toolkit/page.tsx': [
    ['\uFFFDx\u001C\u0013 How to use this toolkit', '\u{1F9F0} How to use this toolkit'],            // 🧰
    ['\uFFFDx\u0019\uFFFD {stats.resilience}', '\u{1F4AA} {stats.resilience}'],                        // 💪
    ['\uFFFDx\u0019: Hope Reframe', '\u{1F308} Hope Reframe'],                                          // 🌈
    ['Open \uFFFD \u0019', 'Open \u2192'],                                                             // "Open ->"
    ['\uFFFD \uFFFD Back', '\u2190 Back'],                                                             // "← Back"
    ['\uFFFD\x53\u001C Labeled as:', '\u{1F3F7}\uFE0F Labeled as:'],                                     // 🏷️
    ['\uFFFD\x53\u001C Used', '\u2705 Used'],                                                           // ✅ (x2)
    ['\uFFFD\x53\uFFFD Get AI Skill Recommendations', '\u{1F916} Get AI Skill Recommendations'],          // 🤖
    ['\uFFFD\x53\uFFFD AI Recommended for You', '\u2728 AI Recommended for You'],                         // ✨
    ['\uFFFDx\u0019\uFFFD {rec.why}', '\u{1F4A1} {rec.why}'],                                            // 💡
    ['\uFFFDx\u001D\u0060 Playing...', '\u{1F3A7} Playing...'],                                          // 🎧
    ['\uFFFDx\u007D\u0022\u000F Listen to Guided Voice', '\u{1F3A7} Listen to Guided Voice'],           // 🎧
    ['\uFFFDx\u0019\uFFFD</div>', '\u{1F389}</div>'],                                                    // 🎉 (You did it)
  ],
  'app/safety-plan/SafetyPlanContentSimplified.tsx': [
    ['\uFFFDx:\uFFFD\uFE0F Safety Plan', '\u{1F6E1}\uFE0F Safety Plan'],        // 🛡️
    ['=\uFFFD Crisis Resources', '\u{1F6A8} Crisis Resources'],                  // 🚨
    ['\uFFFDx\u001C~ Emergency Contacts', '\u{1F4DE} Emergency Contacts'],       // 📞
    ['\uFFFDx\u001C\uFFFD Safe Locations', '\u{1F4CD} Safe Locations'],          // 📍
    ['\uFFFDx\u001C\u001E Important Documents', '\u{1F4C4} Important Documents'],// 📄
    ['\uFFFDx\u0019\uFFFD Financial Resources', '\u{1F4B0} Financial Resources'],// 💰
    ['\uFFFDxa\uFFFD Escape Plan', '\u{1F6AA} Escape Plan'],                     // 🚪
    ['\uFFFDx\u0018\uFFFD Professional Support', '\u{1F91D} Professional Support'],// 🤝
    ["Support' \uFFFD\u001D", "Support' \u{1F464}"],                            // 👤
    ['\uFFFDx\u001C& Review Information', '\u{1F50D} Review Information'],       // 🔍
    ['haven\uFFFD\u0022t', "haven't"],
    ['\uFFFDx\u0018\uFFFD Professional Support Available', '\u{1F91D} Professional Support Available'],
    ['\uFFFDx\uFFFD\uFFFD Mental Health Support', '\u{1F9E0} Mental Health Support'], // 🧠
    ['\uFFFD\u0061\u0013\u000F Legal Protection', '\u2696\uFE0F Legal Protection'],   // ⚖️
  ],
  'app/auth/page.tsx': [
    ['\uFFFDx\u001D\u0019 Please sign in', '\u{1F510} Please sign in'], // 🔐
  ],
  'app/no-contact-anchor/page.tsx': [
    ['\uFFFD\x53\u0026 ', '\u2705 '], // ✅ (5 bullet lines)
  ],
};

// ---- Apply ----
let changed = 0;
const allFiles = [];
(function walk(dir, base) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, base);
    else if (/\.(tsx?|ts)$/.test(entry.name)) {
      const rel = path.relative(base, p);
      allFiles.push({ p, rel: rel.replace(/\\/g, '/') });
    }
  }
})(srcDir, srcDir);

for (const { p, rel } of allFiles) {
  let content = read(p);
  let orig = content;
  let matchedFile = false;

  for (const [find, replace] of globalReplacements) {
    if (content.includes(find)) {
      content = content.split(find).join(replace);
      matchedFile = true;
    }
  }

  const fileRules = fileReplacements[rel];
  if (fileRules) {
    for (const [find, replace] of fileRules) {
      if (content.includes(find)) {
        content = content.split(find).join(replace);
        matchedFile = true;
      }
    }
  }

  if (content !== orig) {
    write(p, content);
    changed++;
    console.log('Fixed:', rel);
  }
}

console.log('\nTotal files changed:', changed);

// ---- Verify remaining ----
let remaining = 0;
for (const { p, rel } of allFiles) {
  const content = read(p);
  const m = content.match(/\uFFFD/g);
  if (m) {
    remaining += m.length;
    const lines = content.split('\n');
    lines.forEach((ln, i) => {
      if (ln.includes('\uFFFD')) console.log('REMAIN', rel, ':', i + 1, ':', JSON.stringify(ln.trim().slice(0, 100)));
    });
  }
}
console.log('\nRemaining U+FFFD:', remaining);