import { States } from '@/pages/enums/reference_states';
import React, { createContext, useContext, useState } from 'react';

interface ReferenceContextProps {
  referenceTxHash: string;
  referenceState: States;
  mintingPolicyId:string;
  collateralAddress:string;
  mintingScript: string;
  setReferenceTxHash: (txHash: string) => void;
  setReferenceState: (state: States) => void;
  setMintingPolicyId: (policyId: string) => void;
  setCollateralAddress: (address: string) => void;
  setMintingScript: (script: string) => void;
}

const ReferenceContext = createContext<ReferenceContextProps | undefined>(undefined);

export const ReferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [referenceTxHash, setReferenceTxHash] = useState<string>("");
  const [referenceState, setReferenceState] = useState<States>(States.NotDeployed);
  const [mintingPolicyId, setMintingPolicyId] = useState<string>("");
  const [collateralAddress, setCollateralAddress] = useState<string>("");
  const [mintingScript, setMintingScript] = useState<string>("");

  return (
    <ReferenceContext.Provider
      value={{
        referenceTxHash,
        mintingPolicyId,
        referenceState,
        collateralAddress,
        mintingScript,
        setReferenceTxHash,
        setReferenceState,
        setMintingPolicyId,
        setCollateralAddress,
        setMintingScript
      }}
    >
      {children}
    </ReferenceContext.Provider>
  );
};

export const useReferenceContext = () => {
  const context = useContext(ReferenceContext);
  if (!context) {
    throw new Error('useReferenceContext must be used within an ReferenceProvider');
  }
  return context;
};
