
import { useMemo } from 'react';
import { CheckListData } from '@/contexts/DataContext';
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
  const processedData = useMemo(() => {
    // Aqui você receberia os dados do contexto
    // Por enquanto, vou simular alguns dados para demonstração
    const mockData: CheckListData[] = [];
    
    return mockData;
  }, []);

  const filteredData = useMemo(() => {
    return processedData.filter(item => {
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
  }, [processedData, filters]);

  const availableFilters = useMemo(() => {
    const meses = new Set<string>();
    const anos = new Set<string>();
    const filiais = new Set<string>();
    const checkListTypes = new Set<string>();
    const placas = new Set<string>();

    processedData.forEach(item => {
      const date = new Date(item.N);
      if (isValid(date)) {
        meses.add(format(date, 'MM'));
        anos.add(format(date, 'yyyy'));
      }
      
      if (item.D) filiais.add(item.D);
      if (item.G) checkListTypes.add(item.G);
      if (item.AG) placas.add(item.AG);
    });

    return {
      mes: Array.from(meses).sort(),
      ano: Array.from(anos).sort(),
      filial: Array.from(filiais).sort(),
      checkListType: Array.from(checkListTypes).sort(),
      placa: Array.from(placas).sort(),
    };
  }, [processedData]);

  const checkListTypeCards = useMemo(() => {
    const typeCounts = filteredData.reduce((acc, item) => {
      if (item.G) {
        acc[item.G] = (acc[item.G] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      title: type,
      value: count.toString(),
      percentage: '+0%', // Calcularia baseado em dados históricos
    }));
  }, [filteredData]);

  return {
    filteredData,
    availableFilters,
    checkListTypeCards,
  };
};
