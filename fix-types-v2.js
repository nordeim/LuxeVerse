import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";
import { readdirSync, statSync } from "fs";

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
let skippedCount = 0;

walk(srcDir, (path) => {
  let content = readFileSync(path, "utf-8");
  let original = content;

  // Skip if it already correctly uses ReactElement with proper import
  if (content.includes("import type { ReactElement }") || content.includes("import { ReactElement }")) {
    // Already has the import, check if it's used correctly
    return;
  }

  if (content.includes("React.ReactElement") || content.includes("ReactElement")) {
    // Could be a false positive - skip
    return;
  }

  // Find JSX.Element patterns
  if (!content.includes(": JSX.Element")) {
    return;
  }

  // Replace JSX.Element with ReactElement
  content = content.replace(/: JSX\.Element/g, ": ReactElement");

  // Add ReactElement import - find the right place
  const hasUseClient = content.startsWith('"use client"') || content.startsWith("'use client'");

  if (hasUseClient) {
    // Add import after the first line (after "use client")
    const lines = content.split("\n");
    const clientLine = lines.findIndex(l => l.trim() === '"use client"');
    if (clientLine >= 0) {
      // Check if there's already a react import
      const reactImportLine = lines.findIndex(l => l.includes("from \"react\""));
      if (reactImportLine >= 0) {
        // Add to existing import
        const importLine = lines[reactImportLine];
        if (!importLine.includes("ReactElement")) {
          lines[reactImportLine] = importLine.replace(/\}/g, ", ReactElement}");
        }
      } else {
        // Add new import after "use client"
        lines.splice(clientLine + 1, 0, `\nimport type { ReactElement } from "react";`);
      }
      content = lines.join("\n");
    }
  } else {
    // Add import at the top
    if (!content.includes("from \"react\"")) {
      content = `import type { ReactElement } from "react";\n` + content;
    } else {
      content = content.replace(/from "react"/, `from "react";\nimport type { ReactElement } from "react"`);
    }
  }

  writeFileSync(path, content, "utf-8");
  fixedCount++;
});

console.log(`Fixed ${fixedCount} files, skipped ${skippedCount}.`);
