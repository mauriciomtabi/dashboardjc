
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
  N: string | number; // Data e Hora
  T: string; // Item
  V: number; // bl_Confrm (0 ou 1)
  Y: string; // Lista
  AG: string; // Placa
}

export interface ManutencaoData {
  B: string; // Placa
  L: string; // Peça
  Q: string; // Valor
  W: string; // Data
  Z: string; // Tipo de Manutenção (C=Corretiva, P=Preventiva)
  AI: string; // Filial
  AJ: string; // Fornecedor
  AK: string; // Serviço
}

export interface PreventivaData {
  D: string; // Preventiva
  F: string; // Operação
  K: string; // Placa
  L: string; // Última Manutenção
  U: string; // Vencida (Km)
  V: string; // Vencida (dias)
}

interface DataContextType {
  laudoData: LaudoData[];
  estoqueData: EstoqueData[];
  checkListData: CheckListData[];
  manutencaoData: ManutencaoData[];
  preventivaData: PreventivaData[];
  lastUpdate: Date | null;
  setLaudoData: (data: LaudoData[]) => void;
  setEstoqueData: (data: EstoqueData[]) => void;
  setCheckListData: (data: CheckListData[]) => void;
  setManutencaoData: (data: ManutencaoData[]) => void;
  setPreventivaData: (data: PreventivaData[]) => void;
  setLastUpdate: (date: Date) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [laudoData, setLaudoData] = useState<LaudoData[]>([]);
  const [estoqueData, setEstoqueData] = useState<EstoqueData[]>([]);
  const [checkListData, setCheckListData] = useState<CheckListData[]>([]);
  const [manutencaoData, setManutencaoData] = useState<ManutencaoData[]>([]);
  const [preventivaData, setPreventivaData] = useState<PreventivaData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  return (
    <DataContext.Provider
      value={{
        laudoData,
        estoqueData,
        checkListData,
        manutencaoData,
        preventivaData,
        lastUpdate,
        setLaudoData,
        setEstoqueData,
        setCheckListData,
        setManutencaoData,
        setPreventivaData,
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
