#!/usr/bin/env node
/**
 * RiveMCP launcher — finds and runs the platform binary.
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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
  process.exit(1);
}

const binaryPath = path.join(__dirname, binaryName);

if (!fs.existsSync(binaryPath)) {
  console.error("RiveMCP: binary not found. Run: npm install rivemcp");
  console.error(`Or download manually from: https://github.com/paradoxsyn/rivemcp-releases/releases`);
  process.exit(1);
}

// Pass through stdio for MCP protocol
try {
  execFileSync(binaryPath, process.argv.slice(2), {
    stdio: "inherit",
    env: process.env,
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
