import { Contract, EthersError } from 'ethers';
import connectWallet from './connectWallet.ts';
import {
  ERR_WALLET_NOT_FOUND,
  ERR_USER_REJECTED,
  METHOD_ETHEREUM_REQUEST_ACCOUNTS,
  ERR_NO_WINDOW_OBJECT,
  ERR_UNKNOWN,
  ERR_REQUEST_PENDING,
} from '../constants.ts';

jest.mock('ethers', () => {
  const actualEthers = jest.requireActual('ethers');

  return {
    ...actualEthers,
    Contract: jest.fn(),
    BrowserProvider: jest.fn().mockImplementation(() => ({
      getSigner: jest.fn().mockResolvedValue('signer1'),
    })),
  };
});

describe('connectWallet', () => {
  const windowEthereum = window.ethereum;
  const ethereumRequest = jest.fn();

  afterEach(() => {
    Object.defineProperty(window, 'ethereum', {
      configurable: true,
      enumerable: true,
      value: windowEthereum,
    });
    (Contract as unknown as Contract).mockReset();
  });

  describe('on successful connection', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: ethereumRequest.mockReturnValueOnce(['123']),
        },
      });
      (Contract as unknown as Contract).mockImplementation(() => ({
        id: 'contract',
      }));
    });

    it('returns wallet address and contract', async () => {
      const response = await connectWallet();
      expect(ethereumRequest).toHaveBeenCalledWith({
        method: METHOD_ETHEREUM_REQUEST_ACCOUNTS,
      });
      expect(response).toEqual({
        error: null,
        isConnected: true,
        walletAddress: '123',
        contract: { id: 'contract' },
      });
    });
  });

  describe('when user rejects the connection', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: ethereumRequest.mockRejectedValue(
            Object.assign(new Error('New error message'), { code: 4001 })
          ),
        },
      });
    });

    it('returns ERR_USER_REJECTED error', async () => {
      const response = await connectWallet();
      expect(response).toEqual({
        error: ERR_USER_REJECTED,
        isConnected: false,
        walletAddress: '',
        contract: null,
      });
    });
  });

  describe('when a wallet request is already pending', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: ethereumRequest.mockRejectedValue(
            Object.assign(new Error('New error message'), { code: -32002 })
          ),
        },
      });
    });

    it('returns ERR_REQUEST_PENDING error', async () => {
      const response = await connectWallet();
      expect(response).toEqual({
        error: ERR_REQUEST_PENDING,
        isConnected: false,
        walletAddress: '',
        contract: null,
      });
    });
  });

  describe('when ethereum window object does not exist', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
      });
    });

    it('returns ERR_NO_WINDOW_OBJECT error', async () => {
      const response = await connectWallet();
      expect(response).toEqual({
        error: ERR_NO_WINDOW_OBJECT,
        isConnected: false,
        walletAddress: '',
        contract: null,
      });
    });
  });

  describe('when a wallet address is not returned', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: ethereumRequest.mockReturnValueOnce([]),
        },
      });
    });

    it('returns ERR_WALLET_NOT_FOUND error', async () => {
      const response = await connectWallet();
      expect(response).toEqual({
        error: ERR_WALLET_NOT_FOUND,
        isConnected: false,
        walletAddress: '',
        contract: null,
      });
    });
  });

  describe('when ethereum throws an error with an unknown staus code', () => {
    beforeAll(() => {
      const ethersError = new Error('Test ethers error') as EthersError;
      const mockedErrorResponse = { ...ethersError, code: 123 };
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: ethereumRequest.mockRejectedValue(mockedErrorResponse),
        },
      });
    });

    it('returns ERR_UNKNOWN error', async () => {
      const response = await connectWallet();
      expect(response).toEqual({
        error: ERR_UNKNOWN,
        isConnected: false,
        walletAddress: '',
        contract: null,
      });
    });
  });
});
