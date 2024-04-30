import {
  connectToEthereum,
  WALLET_NOT_FOUND,
  USER_REJECTED,
  METHOD_ETHEREUM_REQUEST_ACCOUNTS,
  NO_WINDOW_OBJECT,
  UNKNOWN_ERROR,
  WALLET_REQUEST_PENDING,
} from './blockchainFunctions';

describe('connectToEthereum', () => {
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
          request: ethereumRequest.mockReturnValueOnce([123]),
        },
      });
    });

    it('returns wallet address', async () => {
      const response = await connectToEthereum();
      expect(ethereumRequest).toHaveBeenCalledWith({
        method: METHOD_ETHEREUM_REQUEST_ACCOUNTS,
      });
      expect(response).toEqual({
        error: null,
        isConnected: true,
        walletAddress: 123,
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

    it('returns USER_REJECTED error', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: USER_REJECTED,
        isConnected: false,
        walletAddress: null,
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

    it('returns WALLET_REQUEST_PENDING error', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: WALLET_REQUEST_PENDING,
        isConnected: false,
        walletAddress: null,
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

    it('returns NO_WINDOW_OBJECT error', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: NO_WINDOW_OBJECT,
        isConnected: false,
        walletAddress: null,
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

    it('returns WALLET_NOT_FOUND error', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: WALLET_NOT_FOUND,
        isConnected: false,
        walletAddress: null,
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

    it('returns UNKNOWN_ERROR error', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: UNKNOWN_ERROR,
        isConnected: false,
        walletAddress: null,
      });
    });
  });
});
