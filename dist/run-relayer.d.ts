/// <reference types="node" />
export declare function runRelayer(devMode: boolean, ethereumNodeURL: string, relayUrl: string, relayHubAddress: string, quiet: boolean, port?: number | string, workdir?: any, detach?: any, gasPricePercent?: number): Promise<import("child_process").ChildProcess>;
