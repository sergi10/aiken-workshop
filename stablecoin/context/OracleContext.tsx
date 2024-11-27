import { States } from '@/pages/enums/oracle_states';
import React, { createContext, useContext, useState } from 'react';

interface OracleContextProps {
  oracleState: States
  oracleAddress: string;
  policyId: string;
  oracleDatum: string;
  oracleScript: string;
  oracleUTxO: string;
  setOracleState: (state: States) => void;
  setOracleAddress: (address: string) => void;
  setPolicyId: (utxo: string) => void;
  setOracleDatum: (datum: string) => void;
  setOracleScript: (script: string) => void;
  setOracleUTxO: (utxo: string) => void;
}

const OracleContext = createContext<OracleContextProps | undefined>(undefined);

export const OracleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [oracleState, setOracleState] = useState<States>(States.NotDeployed);
  const [oracleAddress, setOracleAddress] = useState<string>("");
  const [policyId, setPolicyId] = useState<string>("");
  const [oracleDatum, setOracleDatum] = useState<string>("");
  const [oracleScript, setOracleScript] = useState<string>("");
  const [oracleUTxO, setOracleUTxO] = useState<string>(""); 

  return (
    <OracleContext.Provider
      value={{
        oracleState,
        oracleAddress,
        policyId,
        oracleDatum,
        oracleScript,
        oracleUTxO,
        setOracleState,
        setOracleAddress,
        setPolicyId,
        setOracleDatum,
        setOracleScript,
        setOracleUTxO
      }}
    >
      {children}
    </OracleContext.Provider>
  );
};

export const useOracleContext = () => {
  const context = useContext(OracleContext);
  if (!context) {
    throw new Error('useOracleContext must be used within an OracleProvider');
  }
  return context;
};
