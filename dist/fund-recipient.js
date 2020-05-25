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
const utils_1 = require("ethers/utils");
const RelayHub_json_1 = require("./contracts-builds/RelayHub.json");
function fundRecipient(options, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const relayHubInstance = new ethers_1.Contract(options.relayHubAddress, RelayHub_json_1.abi, signer);
        const fundingAmountToWei = utils_1.parseEther(options.amountEther.toString());
        const recipientCurrentBalance = new utils_1.BigNumber(yield relayHubInstance.functions.balanceOf(options.recipientAddress));
        if (recipientCurrentBalance.lt(fundingAmountToWei)) {
            const value = fundingAmountToWei.sub(recipientCurrentBalance);
            yield relayHubInstance.functions.depositFor(options.recipientAddress, {
                value,
            });
            return fundingAmountToWei;
        }
        else {
            return recipientCurrentBalance;
        }
    });
}
exports.fundRecipient = fundRecipient;
//# sourceMappingURL=fund-recipient.js.map