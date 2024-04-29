export const connectToEthereum: () => Promise<{
  isConnected: boolean;
  walletAddress: number | null;
  error: string | null;
}> = async () => {
  const { ethereum } = window;
  if (!ethereum?.request)
    return {
      isConnected: false,
      walletAddress: null,
      error: 'No ethereum window object',
    };

  let walletAddress;
  try {
    walletAddress = await ethereum.request({
      method: 'eth_requestAccounts',
    });
  } catch (err) {
    const { message } = err as Error;
    return {
      isConnected: false,
      walletAddress: null,
      error: message,
    };
  }
  if (walletAddress) return { isConnected: true, walletAddress, error: null };

  return {
    isConnected: false,
    walletAddress: null,
    error: 'Eth account request failed',
  };
};
