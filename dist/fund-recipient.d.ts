import { Signer } from "ethers";
import { BigNumber } from "ethers/utils";
export declare function fundRecipient(options: {
    amountEther: number;
    relayHubAddress: string;
    recipientAddress: string;
}, signer: Signer): Promise<BigNumber>;
