
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';

export const useEstoqueData = (filters: {
  mes: string;
  ano: string;
  estoque: string[];
  operacao: string[];
  placa: string;
}) => {
  const { estoqueData } = useData();

  const filteredData = useMemo(() => {
    return estoqueData.filter(item => {
      const date = new Date(item.R);
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const ano = date.getFullYear().toString();
      
      if (filters.mes && mes !== filters.mes) return false;
      if (filters.ano && ano !== filters.ano) return false;
      if (filters.estoque.length > 0 && !filters.estoque.includes(item.N)) return false;
      if (filters.operacao.length > 0 && !filters.operacao.includes(item.AB)) return false;
      if (filters.placa && !item.AK?.toLowerCase().includes(filters.placa.toLowerCase())) return false;
      
      return true;
    });
  }, [estoqueData, filters]);

  const availableFilters = useMemo(() => {
    const meses = [...new Set(estoqueData.map(item => {
      const date = new Date(item.R);
      return (date.getMonth() + 1).toString().padStart(2, '0');
    }))].sort();
    
    const anos = [...new Set(estoqueData.map(item => {
      const date = new Date(item.R);
      return date.getFullYear().toString();
    }))].sort();
    
    const operacoes = [...new Set(estoqueData.map(item => item.AB))].filter(Boolean).sort();
    const estoques = [...new Set(estoqueData.map(item => item.N))].filter(Boolean).sort();
    
    return { meses, anos, operacoes, estoques };
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
