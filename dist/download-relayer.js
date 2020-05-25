"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = __importStar(require("process"));
const path_1 = require("path");
const fs_1 = require("fs");
const env_paths_1 = __importDefault(require("env-paths"));
const fs_extra_1 = require("fs-extra");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("ethers/utils");
const REPOSITORY = "OpenZeppelin/openzeppelin-gsn-helpers";
const VERSION = "v0.2.1";
const BINARY = "gsn-relay";
const BINARY_PATH = `${env_paths_1.default("gsn").cache}/${BINARY}-${VERSION}`;
const CHECKSUMS_PATH = `${env_paths_1.default("gsn").cache}/checksums.json`;
function ensureRelayer(path = BINARY_PATH) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield hasRelayer(path))
            return path;
        yield downloadRelayer(path);
        return path;
    });
}
exports.ensureRelayer = ensureRelayer;
function hasRelayer(path = BINARY_PATH) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield fs_extra_1.pathExists(path)) && (yield binaryUncorrupted(path));
    });
}
exports.hasRelayer = hasRelayer;
function downloadRelayer(path = BINARY_PATH) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs_extra_1.ensureDir(path_1.dirname(path));
        const url = getUrl();
        console.error(`Downloading relayer from ${url}`);
        yield downloadFile(url, path);
        if (!(yield binaryUncorrupted(path))) {
            fs_1.unlinkSync(path);
            fs_1.unlinkSync(CHECKSUMS_PATH);
            throw Error(`Relayer binary integrity check failed, are there network issues?`);
        }
        console.error(`Relayer downloaded to ${path}`);
        fs_1.chmodSync(path, "775");
    });
}
exports.downloadRelayer = downloadRelayer;
function getUrl() {
    const baseUrl = `https://github.com/${REPOSITORY}/releases/download/${VERSION}/${BINARY}-${getPlatform()}-${getArch()}`;
    return baseUrl + (getPlatform() === "windows" ? ".exe" : "");
}
exports.getUrl = getUrl;
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
function downloadFile(url, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const writer = fs_1.createWriteStream(path);
        const response = yield axios_1.default.get(url, { responseType: "stream" });
        response.data.pipe(writer);
        yield new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    });
}
function binaryUncorrupted(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield fs_extra_1.pathExists(CHECKSUMS_PATH))) {
            yield downloadFile(`https://github.com/${REPOSITORY}/releases/download/${VERSION}/checksums.json`, CHECKSUMS_PATH);
        }
        const checksums = JSON.parse(fs_1.readFileSync(CHECKSUMS_PATH).toString("utf8"));
        return checksums[getPlatform()][getArch()] === utils_1.keccak256(fs_1.readFileSync(path));
    });
}
//# sourceMappingURL=download-relayer.js.map