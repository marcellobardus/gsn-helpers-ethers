import { Signer } from "ethers";
export declare function registerRelay(options: {
    relayHubAddress: string;
    relayerUrl: string;
    stakeEther: number;
    unstakeDelaySeconds: number;
    fundsEther: number;
}, signer: Signer): Promise<void>;
