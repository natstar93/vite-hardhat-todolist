import { Dispatch, createContext, useContext } from 'react';
import { Contract } from 'ethers';

export type ContractStatusType  = {
  contract: Contract | null;
  error: string | null;
}

export type ContractContextType = {
  contractStatus: ContractStatusType
  setContractStatus: Dispatch<React.SetStateAction<ContractStatusType>>
}

export const contractStatusDefaultValues = {
  contract: null,
  error: null,
};

export const contractContextDefaultValues = {
  contractStatus: contractStatusDefaultValues,
  setContractStatus: () => {},
};

const ContractContext = createContext<ContractContextType>(
  contractContextDefaultValues
);

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error(
      'useContractContext must be used within a ContractContextProvider'
    );
  }
  return context;
};

export default ContractContext;
