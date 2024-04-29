import { connectToEthereum } from './blockchainFunctions';

describe('connectToEthereum', () => {
  const windowEthereum = window.ethereum;

  describe('on successful connection', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: async () => 123,
        },
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: windowEthereum,
      });
    });

    it('returns wallet address', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: null,
        isConnected: true,
        walletAddress: 123,
      });
    });
  });

  describe('on failed connection', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: {
          request: jest.fn().mockRejectedValue(new Error('User rejected the request'))
        },
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: windowEthereum,
      });
    });

    it('returns error', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: 'User rejected the request',
        isConnected: false,
        walletAddress: null,
      });
    });
  });

  describe('when ethereum window object does not exist', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'ethereum', {
        configurable: true,
        enumerable: true,
        value: windowEthereum,
      });
    });

    it('returns error', async () => {
      const response = await connectToEthereum();
      expect(response).toEqual({
        error: 'No ethereum window object',
        isConnected: false,
        walletAddress: null,
      });
    });
  });
});
