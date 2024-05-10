import { EthersError } from 'ethers';
import {
  ERR_USER_REJECTED,
  ERR_UNKNOWN,
  ERR_REQUEST_PENDING,
} from '../constants.ts';

const getEthersErrorMessage: (code: number) => string = (code) => {
  const ethersMessages: { [key: number]: string } = {
    [4001]: ERR_USER_REJECTED,
    [-32002]: ERR_REQUEST_PENDING,
  };
  return ethersMessages[code] || ERR_UNKNOWN;
};

export const handleErrors = (err: unknown) => {
  if ((err as EthersError)?.code) {
    const ethersError = err as EthersError;
    const { code } = ethersError?.info?.error || ethersError;
    return getEthersErrorMessage(code);
  }
  if (err instanceof Error) {
    return err.message;
  }
  return ERR_UNKNOWN;
};
