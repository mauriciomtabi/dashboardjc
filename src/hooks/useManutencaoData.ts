
import { useMemo } from 'react';
import { ManutencaoData } from '@/contexts/DataContext';
import { parseExcelDate } from '@/utils/dateUtils';

interface ManutencaoFilters {
  mes: string[];
  ano: string[];
  placa: string[];
  operacao: string[];
  tipoManutencao: string[];
}

export const useManutencaoData = (filters: ManutencaoFilters, manutencaoData: ManutencaoData[]) => {
  const filteredData = useMemo(() => {
    return manutencaoData.filter(item => {
      const parsedDate = parseExcelDate(item.W);
      if (!parsedDate) return false;
      
      const mes = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const ano = parsedDate.getFullYear().toString();
      
      if (Array.isArray(filters.mes) && filters.mes.length > 0 && !filters.mes.includes(mes)) return false;
      if (Array.isArray(filters.ano) && filters.ano.length > 0 && !filters.ano.includes(ano)) return false;
      
      if (Array.isArray(filters.placa) && filters.placa.length > 0) {
        const hasMatchingPlaca = filters.placa.some(placa => 
          item.B?.toLowerCase().includes(placa.toLowerCase())
        );
        if (!hasMatchingPlaca) return false;
      }
      
      if (Array.isArray(filters.operacao) && filters.operacao.length > 0 && !filters.operacao.includes(item.AI)) return false;
      if (Array.isArray(filters.tipoManutencao) && filters.tipoManutencao.length > 0 && !filters.tipoManutencao.includes(item.Z)) return false;
      
      return true;
    });
  }, [manutencaoData, filters]);

  const availableFilters = useMemo(() => {
    const meses = [...new Set(manutencaoData.map(item => {
      const parsedDate = parseExcelDate(item.W);
      if (!parsedDate) return null;
      return (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    }).filter(Boolean))].sort();

    const anos = [...new Set(manutencaoData.map(item => {
      const parsedDate = parseExcelDate(item.W);
      if (!parsedDate) return null;
      return parsedDate.getFullYear().toString();
    }).filter(Boolean))].sort();

    const operacoes = [...new Set(manutencaoData.map(item => item.AI))].filter(Boolean).sort();
    const placas = [...new Set(manutencaoData.map(item => item.B))].filter(Boolean).sort();
    const tiposManutencao = [...new Set(manutencaoData.map(item => item.Z))].filter(Boolean).sort();

    return {
      meses,
      anos,
      operacoes,
      placas,
      tiposManutencao,
    };
  }, [manutencaoData]);

  const operacaoCards = useMemo(() => {
    const operacoes = [...new Set(filteredData.map(item => item.AI))].filter(Boolean);
    
    return operacoes.map(operacao => {
      const dadosOperacao = filteredData.filter(item => item.AI === operacao);
      const custoTotal = dadosOperacao.reduce((acc, item) => {
        const valor = parseFloat(item.Q) || 0;
        return acc + valor;
      }, 0);

      const dadosOperacaoAnterior = manutencaoData.filter(item => {
        const parsedDate = parseExcelDate(item.W);
        if (!parsedDate) return false;
        const anoAnterior = new Date().getFullYear() - 1;
        return parsedDate.getFullYear() === anoAnterior && item.AI === operacao;
      });

      const custoAnterior = dadosOperacaoAnterior.reduce((acc, item) => {
        const valor = parseFloat(item.Q) || 0;
        return acc + valor;
      }, 0);

      const percentage = custoAnterior > 0 ? ((custoTotal - custoAnterior) / custoAnterior) * 100 : 0;

      return {
        title: operacao,
        value: custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        percentage: parseFloat(percentage.toFixed(1)),
      };
    });
  }, [filteredData, manutencaoData]);

  return {
    filteredData,
    availableFilters,
    operacaoCards,
  };
};
