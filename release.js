// release.js
const fs = require("fs");
const path = require("path");

const changelogPath = path.join(__dirname, "changelog.json");
const type = process.argv[2];  // added / fixed / improved
const message = process.argv[3]; // message string

if (!type || !message) {
  console.error("Usage: npm run release <added|fixed|improved> \"message\"");
  process.exit(1);
}

let log = {};
if (fs.existsSync(changelogPath)) {
  log = JSON.parse(fs.readFileSync(changelogPath, "utf-8"));
}

function bumpPatch(version) {
  const [maj, min, patch] = version.split(".").map(Number);
  return `${maj}.${min}.${patch + 1}`;
}

const versions = Object.keys(log);
let newVersion;

if (versions.length === 0) {
  newVersion = "1.0.0";
} else {
  const latest = versions.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
  ).pop();
  newVersion = bumpPatch(latest);
}

if (!log[newVersion]) {
  log[newVersion] = {
    date: new Date().toISOString().slice(0, 10),
    changes: { added: [], fixed: [], improved: [] }
  };
}

log[newVersion].changes[type].push(message);

fs.writeFileSync(changelogPath, JSON.stringify(log, null, 2));
console.log(`✔️ Changelog updated: ${newVersion} (${type}: ${message})`);