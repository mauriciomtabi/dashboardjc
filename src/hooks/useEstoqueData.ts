
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { parseExcelDate } from '@/utils/dateUtils';

export const useEstoqueData = (filters: {
  mes: string | string[];
  ano: string | string[];
  estoque: string[];
  operacao: string[];
  placa: string | string[];
}) => {
  const { estoqueData } = useData();

  const filteredData = useMemo(() => {
    return estoqueData.filter(item => {
      const parsedDate = parseExcelDate(item.R);
      if (!parsedDate) return false;
      
      const mes = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const ano = parsedDate.getFullYear().toString();
      
      if (Array.isArray(filters.mes) && filters.mes.length > 0 && !filters.mes.includes(mes)) return false;
      if (typeof filters.mes === 'string' && filters.mes && mes !== filters.mes) return false;
      
      if (Array.isArray(filters.ano) && filters.ano.length > 0 && !filters.ano.includes(ano)) return false;
      if (typeof filters.ano === 'string' && filters.ano && ano !== filters.ano) return false;
      
      if (filters.estoque.length > 0 && !filters.estoque.includes(item.N)) return false;
      if (filters.operacao.length > 0 && !filters.operacao.includes(item.AB)) return false;
      
      if (Array.isArray(filters.placa) && filters.placa.length > 0) {
        const hasMatchingPlaca = filters.placa.some(placa => 
          item.AK?.toLowerCase().includes(placa.toLowerCase())
        );
        if (!hasMatchingPlaca) return false;
      } else if (typeof filters.placa === 'string' && filters.placa && !item.AK?.toLowerCase().includes(filters.placa.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [estoqueData, filters]);

  const availableFilters = useMemo(() => {
    const meses = [...new Set(estoqueData.map(item => {
      const parsedDate = parseExcelDate(item.R);
      if (!parsedDate) return null;
      return (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    }).filter(Boolean))].sort();
    
    const anos = [...new Set(estoqueData.map(item => {
      const parsedDate = parseExcelDate(item.R);
      if (!parsedDate) return null;
      return parsedDate.getFullYear().toString();
    }).filter(Boolean))].sort();
    
    const operacoes = [...new Set(estoqueData.map(item => item.AB))].filter(Boolean).sort();
    const estoques = [...new Set(estoqueData.map(item => item.N))].filter(Boolean).sort();
    const placas = [...new Set(estoqueData.map(item => item.AK))].filter(Boolean).sort();
    
    return { meses, anos, operacoes, estoques, placas };
  }, [estoqueData]);

  const operacaoCards = useMemo(() => {
    const operacoes = [...new Set(estoqueData.map(item => item.AB))].filter(Boolean);
    const total = filteredData.length;
    
    return operacoes.slice(0, 5).map(op => {
      const count = filteredData.filter(item => item.AB === op).length;
      return {
        title: op,
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    });
  }, [estoqueData, filteredData]);

  const estoqueCards = useMemo(() => {
    const estoques = [...new Set(estoqueData.map(item => item.N))].filter(Boolean);
    const total = filteredData.length;
    
    return estoques.slice(0, 4).map(est => {
      const count = filteredData.filter(item => item.N === est).length;
      return {
        title: est,
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    });
  }, [estoqueData, filteredData]);

  return {
    estoqueData,
    filteredData,
    availableFilters,
    operacaoCards,
    estoqueCards
  };
};
