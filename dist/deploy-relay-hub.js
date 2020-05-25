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
const RelayHub_json_1 = require("./contracts-builds/RelayHub.json");
function deployRelayHub(signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const contractFactory = new ethers_1.ContractFactory(RelayHub_json_1.abi, RelayHub_json_1.bytecode, signer);
        const instance = yield contractFactory.deploy();
        const tx = contractFactory.getDeployTransaction();
        return instance.address;
    });
}
exports.deployRelayHub = deployRelayHub;
//# sourceMappingURL=deploy-relay-hub.js.map