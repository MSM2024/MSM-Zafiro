const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const SRC_DIR = path.join(PROJECT_ROOT, "src");

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function pass(msg) {
  results.passed.push(msg);
  console.log(`  ✅ ${msg}`);
}

function fail(msg) {
  results.failed.push(msg);
  console.log(`  ❌ ${msg}`);
}

function warn(msg) {
  results.warnings.push(msg);
  console.log(`  ⚠️  ${msg}`);
}

// 1. Find all image references in src/
function findAllImageRefs() {
  const refs = [];
  const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg|ico|avif)(["'\s)>?])/gi;
  const localPathPattern = /(C:\\|localhost|blob:)/gi;

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        walkDir(fullPath);
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx|css)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n");
        lines.forEach((line, i) => {
          const imgMatches = line.match(imageExtensions);
          if (imgMatches) {
            refs.push({
              file: path.relative(PROJECT_ROOT, fullPath),
              line: i + 1,
              type: "image_ref",
              match: imgMatches[0],
            });
          }
          if (localPathPattern.test(line)) {
            refs.push({
              file: path.relative(PROJECT_ROOT, fullPath),
              line: i + 1,
              type: "local_path",
              match: line.trim().substring(0, 100),
            });
          }
        });
      }
    }
  }

  walkDir(SRC_DIR);
  return refs;
}

// 2. Check each image file exists
function checkImageFiles() {
  const images = [];
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        walkDir(fullPath);
      } else if (
        entry.isFile() &&
        /\.(jpg|jpeg|png|webp|gif|svg|ico|avif)$/i.test(entry.name)
      ) {
        const stat = fs.statSync(fullPath);
        const hash = crypto
          .createHash("sha256")
          .update(fs.readFileSync(fullPath))
          .digest("hex");
        images.push({
          path: path.relative(PROJECT_ROOT, fullPath),
          size: stat.size,
          hash,
        });
      }
    }
  }
  walkDir(PUBLIC_DIR);
  return images;
}

// 3. Find duplicate files by hash
function findDuplicates(images) {
  const hashMap = {};
  images.forEach((img) => {
    if (!hashMap[img.hash]) hashMap[img.hash] = [];
    hashMap[img.hash].push(img.path);
  });
  return Object.values(hashMap).filter((files) => files.length > 1);
}

// === MAIN ===
console.log("\n🔍 ZAFIRO Asset Validation\n");

// Check 1: Search for local paths
console.log("📁 Checking for local paths (C:\, localhost, blob:)...");
const refs = findAllImageRefs();
const localPathRefs = refs.filter((r) => r.type === "local_path");
if (localPathRefs.length === 0) {
  pass("No local paths (C:\, localhost, blob:) found in source code");
} else {
  localPathRefs.forEach((r) =>
    fail(`Local path in ${r.file}:${r.line}: ${r.match}`)
  );
}

// Check 2: Image file inventory
console.log("\n📦 Checking image files in public/...");
const images = checkImageFiles();
pass(`${images.length} image files found in public/`);

// Check 3: Duplicates
console.log("\n🔁 Checking for duplicate files...");
const duplicates = findDuplicates(images);
if (duplicates.length === 0) {
  pass("No duplicate image files found");
} else {
  duplicates.forEach((files) =>
    warn(`Duplicate hash: ${files.join(", ")}`)
  );
}

// Check 4: SHA-256 hashes
console.log("\n🔐 SHA-256 hashes:");
images.forEach((img) => {
  console.log(`  ${img.hash}  ${img.path} (${(img.size / 1024).toFixed(1)} KB)`);
});

// === SUMMARY ===
console.log("\n" + "=".repeat(50));
console.log("VALIDATION SUMMARY");
console.log("=".repeat(50));
console.log(`  ✅ Passed: ${results.passed.length}`);
console.log(`  ❌ Failed: ${results.failed.length}`);
console.log(`  ⚠️  Warnings: ${results.warnings.length}`);

// Generate report
const report = `# Asset Validation Report
**Date:** ${new Date().toISOString()}

## Summary
- Passed: ${results.passed.length}
- Failed: ${results.failed.length}
- Warnings: ${results.warnings.length}

## Image Files (${images.length})
${images.map((i) => `- ${i.path} (${(i.size / 1024).toFixed(1)} KB, ${i.hash})`).join("\n")}

## Issues
${results.failed.map((f) => `- ❌ ${f}`).join("\n")}
${results.warnings.map((w) => `- ⚠️ ${w}`).join("\n")}
`;

const reportPath = path.join(PROJECT_ROOT, "docs", "ASSET_VALIDATION_REPORT.md");
fs.writeFileSync(reportPath, report, "utf-8");
console.log(`\n📄 Report saved to docs/ASSET_VALIDATION_REPORT.md`);

process.exit(results.failed.length > 0 ? 1 : 0);
