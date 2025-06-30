
import { useMemo } from 'react';
import { CheckListData, useData } from '@/contexts/DataContext';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CheckListFilters {
  mes: string[];
  ano: string[];
  filial: string[];
  checkListType: string[];
  placa: string[];
}

export const useCheckListData = (filters: CheckListFilters) => {
  const { checkListData } = useData();

  const filteredData = useMemo(() => {
    return checkListData.filter(item => {
      // Filtro por mês
      if (filters.mes.length > 0) {
        const date = new Date(item.N);
        if (isValid(date)) {
          const month = format(date, 'MM');
          if (!filters.mes.includes(month)) return false;
        }
      }

      // Filtro por ano
      if (filters.ano.length > 0) {
        const date = new Date(item.N);
        if (isValid(date)) {
          const year = format(date, 'yyyy');
          if (!filters.ano.includes(year)) return false;
        }
      }

      // Filtro por filial
      if (filters.filial.length > 0 && !filters.filial.includes(item.D)) {
        return false;
      }

      // Filtro por tipo de check list
      if (filters.checkListType.length > 0 && !filters.checkListType.includes(item.G)) {
        return false;
      }

      // Filtro por placa
      if (filters.placa.length > 0 && !filters.placa.includes(item.AG)) {
        return false;
      }

      return true;
    });
  }, [checkListData, filters]);

  const availableFilters = useMemo(() => {
    const meses = new Set<string>();
    const anos = new Set<string>();
    const operacoes = new Set<string>();
    const placas = new Set<string>();

    checkListData.forEach(item => {
      const date = new Date(item.N);
      if (isValid(date)) {
        meses.add(format(date, 'MM'));
        anos.add(format(date, 'yyyy'));
      }
      
      if (item.D) operacoes.add(item.D);
      if (item.AG) placas.add(item.AG);
    });

    return {
      meses: Array.from(meses).sort(),
      anos: Array.from(anos).sort(),
      operacoes: Array.from(operacoes).sort(),
      placas: Array.from(placas).sort(),
    };
  }, [checkListData]);

  const checkListTypeCards = useMemo(() => {
    const typeCounts = filteredData.reduce((acc, item) => {
      if (item.G) {
        acc[item.G] = (acc[item.G] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const total = filteredData.length;

    return Object.entries(typeCounts).map(([type, count]) => ({
      title: type,
      value: count,
      percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
    }));
  }, [filteredData]);

  return {
    filteredData,
    availableFilters,
    checkListTypeCards,
  };
};
