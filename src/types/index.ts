export interface BlockHeader {
  extensionId: string;
  difficulty: string;
  votes: string;
  timestamp: number;
  size: number;
  unparsedBytes: string;
  stateRoot: string;
  height: number;
  nBits: number;
  version: number;
  id: string;
  adProofsRoot: string;
  transactionsRoot: string;
  extensionHash: string;
  powSolutions: {
    pk: string;
    w: string;
    n: string;
    d: number;
  };
  adProofsId: string;
  transactionsId: string;
  parentId: string;
}

export interface NetworkState {
  lastBlockId: string;
  height: number;
  maxBoxGix: number;
  maxTxGix: number;
  params: {
    height: number;
    storageFeeFactor: number;
    minValuePerByte: number;
    maxBlockSize: number;
    maxBlockCost: number;
    blockVersion: number;
    tokenAccessCost: number;
    inputCost: number;
    dataInputCost: number;
    outputCost: number;
  };
}
