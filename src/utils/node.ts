import axios from 'axios';
import * as wasm from 'ergo-lib-wasm-nodejs';
import { BlockHeader, NetworkState } from '../types';
import { getConfig } from '../configs';

const config = getConfig();

/**
 * Retrieves the Ergo blockchain state context, including recent block headers and pre-header.
 * @returns A promise resolving to a wasm.ErgoStateContext instance.
 * @throws Error if fetching block headers fails or context creation fails.
 */
export const getErgoStateContext = async (): Promise<wasm.ErgoStateContext> => {
  const blockHeaderJson = await getLastBlockHeader();
  const blockHeaders = wasm.BlockHeaders.from_json(blockHeaderJson);
  const preHeader = wasm.PreHeader.from_block_header(blockHeaders.get(0));
  return new wasm.ErgoStateContext(preHeader, blockHeaders);
};

/**
 * Fetches the last 10 block headers from the Ergo node API.
 * @returns A promise resolving to the block headers JSON data.
 */
export const getLastBlockHeader = async (): Promise<BlockHeader[]> => {
  const response = await axios.get<BlockHeader[]>(
    `${config.general.nodeUrl}/blocks/lastHeaders/10`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};

/**
 * Retrieves the current blockchain height from the Ergo network state API.
 * @returns A promise resolving to the current blockchain height (number), or undefined if the request fails.
 * @throws Error if the API request fails; logs error and returns undefined.
 */
export const getHeight = async (): Promise<number> => {
  const response = await axios.get<NetworkState>(
    `${config.general.explorerUrl}/networkState`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data.height;
};
