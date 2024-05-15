import { useContext } from 'react';
import { Contract } from 'ethers';
import { act, renderHook } from '@testing-library/react';

import ConnectionContext, {
  connectionContextDefaultValues,
} from './ConnectionContext.ts';

describe('ConnectionContext', () => {
  it('should have correct default value', () => {
    const { result } = renderHook(() => useContext(ConnectionContext));

    const value = result.current;

    expect(value).toEqual(connectionContextDefaultValues);
  });

  it('should update context values', () => {
    const { result } = renderHook(() => useContext(ConnectionContext));

    act(() => {
      result.current.setConnectionStatus({
        walletAddress: '123',
        isConnected: true,
        contract: jest.mocked as unknown as Contract,
        error: null,
      });
    });
    expect(result.current.connectionStatus).toEqual({
      contract: null,
      error: null,
      isConnected: false,
      walletAddress: '',
    });
  });
});
