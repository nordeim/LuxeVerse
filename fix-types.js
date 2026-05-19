import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, join, dirname } from "path";

const srcDir = resolve("apps/web/src");

function walk(dir, callback) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, callback);
    } else if (path.endsWith(".tsx") || path.endsWith(".ts")) {
      callback(path);
    }
  }
}

let fixedCount = 0;

walk(srcDir, (path) => {
  let content = readFileSync(path, "utf-8");
  let original = content;

  // Replace React.ReactElement with ReactElement
  if (!content.includes("ReactElement")) {
    // This file doesn't have the issue
    return;
  }

  // If it has React.ReactElement, that means it was converted but React isn't imported
  if (content.includes("React.ReactElement")) {
    content = content.replace(/React\.ReactElement/g, "ReactElement");

    // Add import ReactElement if not present
    if (!content.includes("ReactElement") || content.includes("import { ReactElement }") || content.includes("import type { ReactElement }")) {
      // Already has ReactElement import or it's a false positive from our regex
    } else {
      // Need to add import - find the react import line
      const reactImportMatch = content.match(/import\s*\{[^}]*\}\s*from\s*"react"/);
      if (reactImportMatch) {
        // Add ReactElement to the existing import
        const importLine = reactImportMatch[0];
        if (!importLine.includes("ReactElement")) {
          const newImportLine = importLine.replace(/\}/g, ", ReactElement}");
          content = content.replace(importLine, newImportLine);
        }
      } else {
        // No existing react import, add one at the top
        content = `import type { ReactElement } from "react";\n` + content;
      }
    }

    writeFileSync(path, content, "utf-8");
    fixedCount++;
  }
});

console.log(`Fixed ${fixedCount} files.`);
