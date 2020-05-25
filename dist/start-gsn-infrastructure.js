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
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const deploy_relay_hub_1 = require("./deploy-relay-hub");
const run_relayer_1 = require("./run-relayer");
const register_relayer_1 = require("./register-relayer");
const fund_recipient_1 = require("./fund-recipient");
function startGSNInfrastructure(privateKey, ethereumProviderlUrl, relayerOptions, recipientOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const signer = new ethers_1.Wallet(privateKey, new ethers_1.providers.JsonRpcProvider(ethereumProviderlUrl));
        const relayHubAddress = yield deploy_relay_hub_1.deployRelayHub(signer);
        yield run_relayer_1.runRelayer(false, ethereumProviderlUrl, relayerOptions.url, relayHubAddress, relayerOptions.quiet);
        yield register_relayer_1.registerRelay({
            relayHubAddress,
            relayerUrl: relayerOptions.url,
            stakeEther: relayerOptions.stakeEther,
            unstakeDelaySeconds: relayerOptions.unstakeDelaySecond,
            fundsEther: relayerOptions.fundsEther,
        }, signer);
        yield fund_recipient_1.fundRecipient({
            amountEther: recipientOptions.fundsEther,
            relayHubAddress,
            recipientAddress: recipientOptions.address,
        }, signer);
        console.log("GSN relayer is setup, the recipient is ready to accept relayed transactions!");
    });
}
exports.startGSNInfrastructure = startGSNInfrastructure;
//# sourceMappingURL=start-gsn-infrastructure.js.map