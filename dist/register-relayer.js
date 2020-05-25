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
const RelayHub_json_1 = require("./contracts-builds/RelayHub.json");
const helpers_1 = require("./helpers");
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const utils_1 = require("ethers/utils");
const sleep_promise_1 = __importDefault(require("sleep-promise"));
function registerRelay(options, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        let relayerStatus = yield helpers_1.isRelayerRunning(options.relayerUrl);
        while (!relayerStatus) {
            sleep_promise_1.default(1000);
            relayerStatus = yield helpers_1.isRelayerRunning(options.relayerUrl);
        }
        try {
            console.error(`Funding GSN relay at ${options.relayerUrl}`);
            const response = yield axios_1.default.get(`${options.relayerUrl}/getaddr`);
            const relayAddress = response.data.RelayServerAddress;
            const relayHubInstance = new ethers_1.Contract(options.relayHubAddress, RelayHub_json_1.abi, signer);
            yield relayHubInstance.functions.stake(relayAddress, options.unstakeDelaySeconds.toString(), { value: utils_1.parseEther(options.stakeEther.toString()) });
            yield signer.sendTransaction({
                to: relayAddress,
                value: utils_1.parseEther(options.fundsEther.toString()),
            });
            yield helpers_1.waitForRelay(options.relayerUrl);
            console.error(`Relay is funded and ready!`);
        }
        catch (error) {
            throw Error(`Failed to fund relay: '${error}'`);
        }
    });
}
exports.registerRelay = registerRelay;
//# sourceMappingURL=register-relayer.js.map