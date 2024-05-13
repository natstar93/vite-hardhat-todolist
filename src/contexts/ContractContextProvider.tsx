import React, { ReactNode, useState } from 'react';

import ContractContext, { ContractContextType, ContractStatusType } from './ContractContext.ts';
import { contractStatusDefaultValues } from './ContractContext.ts';

interface ContractProviderProps {
  children: ReactNode;
}

const ContractContextProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [contractStatus, setContractStatus] = useState<ContractStatusType>(contractStatusDefaultValues);
  
  const contractContextValue: ContractContextType = {
    contractStatus,
    setContractStatus,
  };

  return (
    <ContractContext.Provider value={contractContextValue}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
