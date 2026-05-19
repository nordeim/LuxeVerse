const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const { readdirSync, statSync } = require("fs");

const packages = ["packages/ui/src"];

function walk(dir, cb) {
  try {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      const stat = statSync(path);
      if (stat.isDirectory()) {
        walk(path, cb);
      } else if (path.endsWith(".tsx") || path.endsWith(".ts")) {
        cb(path);
      }
    }
  } catch (e) {
    // skip
  }
}

let fixedCount = 0;

for (const pkg of packages) {
  walk("/home/project/LuxeVerse/" + pkg, (path) => {
    let content = readFileSync(path, "utf-8");
    let original = content;

    // Replace ": JSX.Element" with nothing - remove explicit return type
    content = content.replace(/\): JSX\.Element\b/g, ")");
    content = content.replace(/: JSX\.Element\b/g, "");

    if (content !== original) {
      writeFileSync(path, content, "utf-8");
      fixedCount++;
    }
  });
}

console.log(`Fixed ${fixedCount} files.`);
