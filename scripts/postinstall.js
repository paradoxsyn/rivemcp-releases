#!/usr/bin/env node
/**
 * Downloads the correct RiveMCP binary for the current platform.
 * Runs automatically on `npm install`.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

const VERSION = require("../package.json").version;
const REPO = "paradoxsyn/rivemcp-releases";
const BIN_DIR = path.join(__dirname, "..", "bin");

const PLATFORM_MAP = {
  "darwin-arm64": "rivemcp-macos-arm64",
  "darwin-x64": "rivemcp-macos-x64",
  "linux-x64": "rivemcp-linux-x64",
  "win32-x64": "rivemcp-win-x64.exe",
};

const key = `${process.platform}-${process.arch}`;
const binaryName = PLATFORM_MAP[key];

if (!binaryName) {
  console.error(`RiveMCP: unsupported platform ${key}`);
  console.error(`Supported: ${Object.keys(PLATFORM_MAP).join(", ")}`);
  process.exit(1);
}

const dest = path.join(BIN_DIR, binaryName);

// Skip if already downloaded
if (fs.existsSync(dest)) {
  process.exit(0);
}

const url = `https://github.com/${REPO}/releases/download/v${VERSION}/${binaryName}`;

console.log(`RiveMCP: downloading ${binaryName} for ${key}...`);

function download(url, dest, redirects = 0) {
  if (redirects > 5) {
    console.error("RiveMCP: too many redirects");
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : require("http");
    mod.get(url, { headers: { "User-Agent": "rivemcp-installer" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(download(res.headers.location, dest, redirects + 1));
      }

      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Download failed: HTTP ${res.statusCode}`));
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true });
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        // Make executable on Unix
        if (process.platform !== "win32") {
          fs.chmodSync(dest, 0o755);
        }
        resolve();
      });
      file.on("error", reject);
    }).on("error", reject);
  });
}

download(url, dest)
  .then(() => console.log(`RiveMCP: installed ${binaryName}`))
  .catch((err) => {
    console.error(`RiveMCP: download failed — ${err.message}`);
    console.error(`You can manually download from: https://github.com/${REPO}/releases`);
    // Don't fail the install — the launcher will show a helpful error
  });
