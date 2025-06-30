
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LaudoData {
  D: string; // Operação
  E: string;
  F: string;
  G: string; // DOT
  J: string; // Vida
  K: string;
  L: string;
  M: string;
  N: string;
  O: string;
  P: string; // Data
  Q: string;
  S: string; // Motivo de Laudo
  U: string;
  W: string;
  Y: string; // Marca dos Pneus
  AA: string; // Código Veículo
  AB: string; // Placa
}

export interface EstoqueData {
  B: string;
  D: string;
  F: string; // Vida dos Pneus
  G: string;
  H: string;
  I: string;
  J: string;
  K: string;
  L: string;
  M: string; // Situação (N, U, R)
  N: string; // Estoque
  P: string;
  Q: string;
  R: string; // Data
  AB: string; // Operação
  AK: string;
  AP: string; // Placa
  AR: string;
}

export interface CheckListData {
  D: string; // Filial
  G: string; // Check List
  N: string; // Data e Hora
  T: string; // Item
  V: string; // bl_Confrm
  Y: string; // Lista
  AG: string; // Placa
}

interface DataContextType {
  laudoData: LaudoData[];
  estoqueData: EstoqueData[];
  checkListData: CheckListData[];
  lastUpdate: Date | null;
  setLaudoData: (data: LaudoData[]) => void;
  setEstoqueData: (data: EstoqueData[]) => void;
  setCheckListData: (data: CheckListData[]) => void;
  setLastUpdate: (date: Date) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [laudoData, setLaudoData] = useState<LaudoData[]>([]);
  const [estoqueData, setEstoqueData] = useState<EstoqueData[]>([]);
  const [checkListData, setCheckListData] = useState<CheckListData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  return (
    <DataContext.Provider
      value={{
        laudoData,
        estoqueData,
        checkListData,
        lastUpdate,
        setLaudoData,
        setEstoqueData,
        setCheckListData,
        setLastUpdate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
