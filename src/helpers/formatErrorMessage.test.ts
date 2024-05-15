import { formatErrorMessage } from './formatErrorMessage.ts';
import {
  ERR_USER_REJECTED,
  ERR_UNKNOWN,
  ERR_REQUEST_PENDING,
} from '../constants.ts';
import { EthersError } from 'ethers';

describe('formatErrorMessage', () => {
  it('formats EthersError correctly', () => {
    const err = new Error('some error') as EthersError;
    const ethersError = { ...err, code: 4001 };

    const result = formatErrorMessage(ethersError);

    expect(result).toBe(ERR_USER_REJECTED);
  });

  it('formats EthersError with info object correctly', () => {
    const err = new Error('some error') as EthersError;
    const ethersError = { ...err, code: 'some code' };

    ethersError.info = { error: { code: -32002 } };

    const result = formatErrorMessage(ethersError);

    expect(result).toBe(ERR_REQUEST_PENDING);
  });

  it('formats regular Error correctly', () => {
    const error = new Error('Not an ethers error');

    const result = formatErrorMessage(error);

    expect(result).toBe('Not an ethers error');
  });

  it('handles unknown error', () => {
    const result = formatErrorMessage({});

    expect(result).toBe(ERR_UNKNOWN);
  });
});
