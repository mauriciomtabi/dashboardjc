
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';

interface Filters {
  mes: string | string[];
  ano: string | string[];
  placa: string | string[];
  operacao: string | string[];
}

export const useLaudoData = (filters: Filters) => {
  const { laudoData } = useData();

  const filteredData = useMemo(() => {
    return laudoData.filter(item => {
      const date = new Date(item.P);
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const ano = date.getFullYear().toString();
      
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
      
      return true;
    });
  }, [laudoData, filters]);

  const availableFilters = useMemo(() => {
    const meses = [...new Set(laudoData.map(item => {
      const date = new Date(item.P);
      return (date.getMonth() + 1).toString().padStart(2, '0');
    }))].sort();
    
    const anos = [...new Set(laudoData.map(item => {
      const date = new Date(item.P);
      return date.getFullYear().toString();
    }))].sort();
    
    const operacoes = [...new Set(laudoData.map(item => item.D))].filter(Boolean).sort();
    const placas = [...new Set(laudoData.map(item => item.AB))].filter(Boolean).sort();
    
    return { meses, anos, operacoes, placas };
  }, [laudoData]);

  const operacaoCards = useMemo(() => {
    const operacoes = [...new Set(laudoData.map(item => item.D))].filter(Boolean);
    const total = filteredData.length;
    
    return operacoes.slice(0, 4).map(op => {
      const count = filteredData.filter(item => item.D === op).length;
      return {
        title: op,
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    });
  }, [laudoData, filteredData]);

  return {
    filteredData,
    availableFilters,
    operacaoCards,
    laudoData
  };
};
