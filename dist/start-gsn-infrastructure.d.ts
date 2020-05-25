export declare function startGSNInfrastructure(privateKey: string, ethereumProviderlUrl: string, relayerOptions: {
    url: string;
    stakeEther: number;
    unstakeDelaySecond: number;
    fundsEther: number;
    quiet: boolean;
}, recipientOptions: {
    address: string;
    fundsEther: number;
}): Promise<void>;
