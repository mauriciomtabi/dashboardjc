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
      
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mes = monthNames[parsedDate.getMonth()];
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
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const meses = [...new Set(manutencaoData.map(item => {
      const parsedDate = parseExcelDate(item.W);
      if (!parsedDate) return null;
      const monthIndex = parsedDate.getMonth();
      return monthNames[monthIndex];
    }).filter(Boolean))].sort((a, b) => {
      return monthNames.indexOf(a) - monthNames.indexOf(b);
    });

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
    
    // Calcular custo total de todas as operações
    const custoTotalGeral = filteredData.reduce((acc, item) => {
      const valor = parseFloat(item.Q) || 0;
      return acc + valor;
    }, 0);
    
    return operacoes.map(operacao => {
      const dadosOperacao = filteredData.filter(item => item.AI === operacao);
      const custoTotal = dadosOperacao.reduce((acc, item) => {
        const valor = parseFloat(item.Q) || 0;
        return acc + valor;
      }, 0);

      // Calcular percentual sobre o total
      const percentage = custoTotalGeral > 0 ? (custoTotal / custoTotalGeral) * 100 : 0;

      return {
        title: operacao,
        value: custoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
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