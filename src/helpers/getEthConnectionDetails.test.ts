import getEthConnectionDetails from './getEthConnectionDetails.ts';
import {
  ERR_WALLET_NOT_FOUND,
  ERR_USER_REJECTED,
  METHOD_ETHEREUM_REQUEST_ACCOUNTS,
  ERR_NO_WINDOW_OBJECT,
  ERR_UNKNOWN,
  ERR_REQUEST_PENDING,
} from '../constants.ts';

describe('getEthConnectionDetails', () => {
  const windowEthereum = window.ethereum;
  const ethereumRequest = jest.fn();

  afterEach(() => {
    Object.defineProperty(window, 'ethereum', {
      configurable: true,
      enumerable: true,
      value: windowEthereum,
    });
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
    });

    it('returns wallet address', async () => {
      const response = await getEthConnectionDetails();
      expect(ethereumRequest).toHaveBeenCalledWith({
        method: METHOD_ETHEREUM_REQUEST_ACCOUNTS,
      });
      expect(response).toEqual({
        error: null,
        isConnected: true,
        walletAddress: '123',
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
      const response = await getEthConnectionDetails();
      expect(response).toEqual({
        error: ERR_USER_REJECTED,
        isConnected: false,
        walletAddress: '',
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
      const response = await getEthConnectionDetails();
      expect(response).toEqual({
        error: ERR_REQUEST_PENDING,
        isConnected: false,
        walletAddress: '',
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
      const response = await getEthConnectionDetails();
      expect(response).toEqual({
        error: ERR_NO_WINDOW_OBJECT,
        isConnected: false,
        walletAddress: '',
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
      const response = await getEthConnectionDetails();
      expect(response).toEqual({
        error: ERR_WALLET_NOT_FOUND,
        isConnected: false,
        walletAddress: '',
      });
    });
  });

  describe('when ethereum throws an error with no staus code', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: ethereumRequest.mockRejectedValue(new Error()),
        },
      });
    });

    it('returns ERR_UNKNOWN error', async () => {
      const response = await getEthConnectionDetails();
      expect(response).toEqual({
        error: ERR_UNKNOWN,
        isConnected: false,
        walletAddress: '',
      });
    });
  });
});
