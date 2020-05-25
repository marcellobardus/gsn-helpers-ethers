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
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const child_process_1 = require("child_process");
const tmp = __importStar(require("tmp"));
const download_relayer_1 = require("./download-relayer");
function runRelayer(devMode, ethereumNodeURL, relayUrl, relayHubAddress, quiet, port, workdir, detach, gasPricePercent) {
    return __awaiter(this, void 0, void 0, function* () {
        const binPath = yield download_relayer_1.ensureRelayer();
        const workingDir = workdir || tmp.dirSync({ unsafeCleanup: true }).name;
        const args = [];
        if (ethereumNodeURL)
            args.push("-EthereumNodeUrl", ethereumNodeURL);
        if (relayHubAddress)
            args.push("-RelayHubAddress", relayHubAddress);
        args.push("-Port", getPort({ relayUrl, port }));
        args.push("-Url", getUrl({ relayUrl, port }));
        args.push("-GasPricePercent", gasPricePercent || 0);
        args.push("-Workdir", workingDir);
        if (devMode !== false)
            args.push("-DevMode");
        console.error(`Starting relayer\n${binPath}\n${lodash_1.chunk(args, 2)
            .map((arr) => " " + arr.join(" "))
            .join("\n")}`);
        return child_process_1.spawn(binPath, args, {
            stdio: quiet || detach ? "ignore" : "inherit",
            detached: !!detach,
        });
    });
}
exports.runRelayer = runRelayer;
function getPort({ relayUrl, port }) {
    if (port)
        return port;
    if (relayUrl) {
        const url = new URL(relayUrl);
        if (url.port.length > 0)
            return url.port;
        else if (url.protocol === "https")
            return 443;
        else
            return 80;
    }
    return 8090;
}
function getUrl({ relayUrl, port }) {
    if (relayUrl)
        return relayUrl;
    if (port)
        return `http://localhost:${port}`;
    return "http://localhost:8090";
}
//# sourceMappingURL=run-relayer.js.map