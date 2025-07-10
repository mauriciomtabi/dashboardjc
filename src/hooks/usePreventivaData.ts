import { useMemo } from 'react';
import { PreventivaData } from '@/contexts/DataContext';
import { parseExcelDate } from '@/utils/dateUtils';

interface PreventivaFilters {
  mes: string[];
  ano: string[];
  placa: string[];
  operacao: string[];
}

export const usePreventivaData = (filters: PreventivaFilters, preventivaData: PreventivaData[]) => {
  const filteredData = useMemo(() => {
    return preventivaData.filter(item => {
      const parsedDate = parseExcelDate(item.L);
      if (!parsedDate) return false;
      
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mes = monthNames[parsedDate.getMonth()];
      const ano = parsedDate.getFullYear().toString();
      
      if (Array.isArray(filters.mes) && filters.mes.length > 0 && !filters.mes.includes(mes)) return false;
      if (Array.isArray(filters.ano) && filters.ano.length > 0 && !filters.ano.includes(ano)) return false;
      
      if (Array.isArray(filters.placa) && filters.placa.length > 0) {
        const hasMatchingPlaca = filters.placa.some(placa => 
          item.K?.toLowerCase().includes(placa.toLowerCase())
        );
        if (!hasMatchingPlaca) return false;
      }
      
      if (Array.isArray(filters.operacao) && filters.operacao.length > 0 && !filters.operacao.includes(item.F)) return false;
      
      return true;
    });
  }, [preventivaData, filters]);

  const availableFilters = useMemo(() => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const meses = [...new Set(preventivaData.map(item => {
      const parsedDate = parseExcelDate(item.L);
      if (!parsedDate) return null;
      const monthIndex = parsedDate.getMonth();
      return monthNames[monthIndex];
    }).filter(Boolean))].sort((a, b) => {
      return monthNames.indexOf(a) - monthNames.indexOf(b);
    });

    const anos = [...new Set(preventivaData.map(item => {
      const parsedDate = parseExcelDate(item.L);
      if (!parsedDate) return null;
      return parsedDate.getFullYear().toString();
    }).filter(Boolean))].sort();

    const operacoes = [...new Set(preventivaData.map(item => item.F))].filter(Boolean).sort();
    const placas = [...new Set(preventivaData.map(item => item.K))].filter(Boolean).sort();

    return {
      meses,
      anos,
      operacoes,
      placas,
    };
  }, [preventivaData]);

  const operacaoCards = useMemo(() => {
    const operacoes = [...new Set(filteredData.map(item => item.F))].filter(Boolean);
    const totalItems = filteredData.length;
    
    return operacoes.map(operacao => {
      const dadosOperacao = filteredData.filter(item => item.F === operacao);
      const count = dadosOperacao.length;
      const percentage = totalItems > 0 ? (count / totalItems) * 100 : 0;

      return {
        title: operacao,
        value: count.toString(),
        percentage: parseFloat(percentage.toFixed(1)),
      };
    });
  }, [filteredData]);

  return {
    filteredData,
    availableFilters,
    operacaoCards,
  };
};