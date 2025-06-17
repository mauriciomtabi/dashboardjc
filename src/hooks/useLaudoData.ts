
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { parseExcelDate } from '@/utils/dateUtils';

interface Filters {
  mes: string | string[];
  ano: string | string[];
  placa: string | string[];
  operacao: string | string[];
  marca?: string;
}

export const useLaudoData = (filters: Filters) => {
  const { laudoData } = useData();

  const filteredData = useMemo(() => {
    return laudoData.filter(item => {
      const parsedDate = parseExcelDate(item.P);
      if (!parsedDate) return false;
      
      const mes = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const ano = parsedDate.getFullYear().toString();
      
      // Handle multiple selections for filters
      if (Array.isArray(filters.mes) && filters.mes.length > 0 && !filters.mes.includes(mes)) return false;
      if (typeof filters.mes === 'string' && filters.mes && mes !== filters.mes) return false;
      
      if (Array.isArray(filters.ano) && filters.ano.length > 0 && !filters.ano.includes(ano)) return false;
      if (typeof filters.ano === 'string' && filters.ano && ano !== filters.ano) return false;
      
      if (Array.isArray(filters.placa) && filters.placa.length > 0) {
        const hasMatchingPlaca = filters.placa.some(placa => 
          item.AB?.toLowerCase().includes(placa.toLowerCase())
        );
        if (!hasMatchingPlaca) return false;
      } else if (typeof filters.placa === 'string' && filters.placa && !item.AB?.toLowerCase().includes(filters.placa.toLowerCase())) {
        return false;
      }
      
      if (Array.isArray(filters.operacao) && filters.operacao.length > 0 && !filters.operacao.includes(item.D)) return false;
      if (typeof filters.operacao === 'string' && filters.operacao && item.D !== filters.operacao) return false;
      
      // Filtro por marca
      if (filters.marca && item.Y !== filters.marca) return false;
      
      return true;
    });
  }, [laudoData, filters]);

  const availableFilters = useMemo(() => {
    const meses = [...new Set(laudoData.map(item => {
      const parsedDate = parseExcelDate(item.P);
      if (!parsedDate) return null;
      return (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    }).filter(Boolean))].sort();
    
    const anos = [...new Set(laudoData.map(item => {
      const parsedDate = parseExcelDate(item.P);
      if (!parsedDate) return null;
      return parsedDate.getFullYear().toString();
    }).filter(Boolean))].sort();
    
    const operacoes = [...new Set(laudoData.map(item => item.D))].filter(Boolean).sort();
    const placas = [...new Set(laudoData.map(item => item.AB))].filter(Boolean).sort();
    
    return { meses, anos, operacoes, placas };
  }, [laudoData]);

  const operacaoCards = useMemo(() => {
    const operacoes = ['Bahia', 'Ceará', 'Pernambuco', 'Morare'];
    const total = filteredData.length;
    
    return operacoes.map(op => {
      const count = filteredData.filter(item => item.D === op).length;
      return {
        title: op,
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    });
  }, [filteredData]);

  return {
    filteredData,
    availableFilters,
    operacaoCards,
    laudoData
  };
};
