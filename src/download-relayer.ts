import * as process from "process";
import { dirname } from "path";
import { createWriteStream, chmodSync, readFileSync, unlinkSync } from "fs";

import envPaths from "env-paths";

import { pathExists, ensureDir } from "fs-extra";

import axios from "axios";

import { keccak256 as sha3 } from "ethers/utils";

const REPOSITORY = "OpenZeppelin/openzeppelin-gsn-helpers";
const VERSION = "v0.2.1";
const BINARY = "gsn-relay";
const BINARY_PATH = `${envPaths("gsn").cache}/${BINARY}-${VERSION}`;
const CHECKSUMS_PATH = `${envPaths("gsn").cache}/checksums.json`;

export async function ensureRelayer(path = BINARY_PATH) {
  if (await hasRelayer(path)) return path;
  await downloadRelayer(path);
  return path;
}

export async function hasRelayer(path = BINARY_PATH) {
  return (await pathExists(path)) && (await binaryUncorrupted(path));
}

export async function downloadRelayer(path = BINARY_PATH) {
  await ensureDir(dirname(path));

  const url = getUrl();
  console.error(`Downloading relayer from ${url}`);
  await downloadFile(url, path);

  if (!(await binaryUncorrupted(path))) {
    // Remove the corrupt binary and checksums file - the issue could be in either of them
    unlinkSync(path);
    unlinkSync(CHECKSUMS_PATH);
    throw Error(
      `Relayer binary integrity check failed, are there network issues?`
    );
  }

  console.error(`Relayer downloaded to ${path}`);
  chmodSync(path, "775");
}

export function getUrl() {
  const baseUrl = `https://github.com/${REPOSITORY}/releases/download/${VERSION}/${BINARY}-${getPlatform()}-${getArch()}`;
  return baseUrl + (getPlatform() === "windows" ? ".exe" : "");
}

function getPlatform() {
  switch (process.platform) {
    case "win32":
      return "windows";
    default:
      return process.platform;
  }
}

function getArch() {
  switch (process.arch) {
    case "x64":
      return "amd64";
    case "x32":
      return "386";
    case "ia32":
      return "386";
    default:
      return process.arch;
  }
}

async function downloadFile(url, path) {
  const writer = createWriteStream(path);
  const response = await axios.get(url, { responseType: "stream" });
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function binaryUncorrupted(path) {
  if (!(await pathExists(CHECKSUMS_PATH))) {
    await downloadFile(
      `https://github.com/${REPOSITORY}/releases/download/${VERSION}/checksums.json`,
      CHECKSUMS_PATH
    );
  }

  const checksums = JSON.parse(readFileSync(CHECKSUMS_PATH).toString("utf8"));
  return checksums[getPlatform()][getArch()] === sha3(readFileSync(path));
}
