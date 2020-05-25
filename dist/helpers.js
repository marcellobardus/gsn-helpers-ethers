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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const sleep_promise_1 = __importDefault(require("sleep-promise"));
function isRelayReady(relayUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${relayUrl}/getaddr`);
            return Boolean(response.data.Ready);
        }
        catch (err) {
            return false;
        }
    });
}
exports.isRelayReady = isRelayReady;
function isRelayerRunning(relayUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${relayUrl}/getaddr`);
            if (response.data.RelayServerAddress) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    });
}
exports.isRelayerRunning = isRelayerRunning;
function waitForRelay(relayUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeout = 30;
        console.error(`Will wait up to ${timeout}s for the relay to be ready`);
        for (let i = 0; i < timeout; ++i) {
            yield sleep_promise_1.default(1000);
            if (yield isRelayReady(relayUrl)) {
                return;
            }
        }
        throw Error(`Relay not ready after ${timeout}s`);
    });
}
exports.waitForRelay = waitForRelay;
//# sourceMappingURL=helpers.js.map