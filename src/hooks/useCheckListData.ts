
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
  conformidade: string[];
}

export const useCheckListData = (filters: CheckListFilters) => {
  const { checkListData } = useData();

  console.log('useCheckListData - Input data length:', checkListData.length);
  console.log('useCheckListData - Filters:', filters);

  const filteredData = useMemo(() => {
    try {
      console.log('useCheckListData - Processing filtered data...');
      
      const result = checkListData.filter(item => {
        // Filtro por mês
        if (filters.mes.length > 0) {
          let date: Date | null = null;
          
          if (typeof item.N === 'string' && item.N.includes('/')) {
            const [day, month, year] = item.N.split('/');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else if (typeof item.N === 'number') {
            date = new Date((item.N - 25569) * 86400 * 1000);
          } else {
            date = new Date(item.N);
          }
          
          if (date && isValid(date)) {
            const month = format(date, 'MM');
            if (!filters.mes.includes(month)) return false;
          }
        }

        // Filtro por ano
        if (filters.ano.length > 0) {
          let date: Date | null = null;
          
          if (typeof item.N === 'string' && item.N.includes('/')) {
            const [day, month, year] = item.N.split('/');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else if (typeof item.N === 'number') {
            date = new Date((item.N - 25569) * 86400 * 1000);
          } else {
            date = new Date(item.N);
          }
          
          if (date && isValid(date)) {
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

        // Filtro por conformidade
        if (filters.conformidade.length > 0) {
          const conformidade = item.V === 1 ? 'Conforme' : 'Não conforme';
          if (!filters.conformidade.includes(conformidade)) {
            return false;
          }
        }

        return true;
      });
      
      console.log('useCheckListData - Filtered data length:', result.length);
      return result;
    } catch (error) {
      console.error('useCheckListData - Error filtering data:', error);
      return [];
    }
  }, [checkListData, filters]);

  const availableFilters = useMemo(() => {
    try {
      console.log('useCheckListData - Processing available filters...');
      
      const meses = new Set<string>();
      const anos = new Set<string>();
      const operacoes = new Set<string>();
      const placas = new Set<string>();

      checkListData.forEach(item => {
        try {
          let date: Date | null = null;
          
          if (typeof item.N === 'string' && item.N.includes('/')) {
            const [day, month, year] = item.N.split('/');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          } else if (typeof item.N === 'number') {
            date = new Date((item.N - 25569) * 86400 * 1000);
          } else {
            date = new Date(item.N);
          }
          
          if (date && isValid(date)) {
            meses.add(format(date, 'MM'));
            anos.add(format(date, 'yyyy'));
          }
          
          if (item.D) operacoes.add(item.D);
          if (item.AG) placas.add(item.AG);
        } catch (itemError) {
          console.warn('useCheckListData - Error processing item:', itemError, item);
        }
      });

      const result = {
        meses: Array.from(meses).sort(),
        anos: Array.from(anos).sort(),
        operacoes: Array.from(operacoes).sort(),
        placas: Array.from(placas).sort(),
        conformidades: ['Conforme', 'Não conforme'],
      };
      
      console.log('useCheckListData - Available filters:', result);
      return result;
    } catch (error) {
      console.error('useCheckListData - Error processing available filters:', error);
      return {
        meses: [],
        anos: [],
        operacoes: [],
        placas: [],
        conformidades: [],
      };
    }
  }, [checkListData]);

  const checkListTypeCards = useMemo(() => {
    try {
      console.log('useCheckListData - Processing checkListTypeCards...');
      
      const typeCounts = filteredData.reduce((acc, item) => {
        if (item.G) {
          acc[item.G] = (acc[item.G] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const total = filteredData.length;

      const result = Object.entries(typeCounts).map(([type, count]) => ({
        title: type,
        value: count,
        percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
      }));
      
      console.log('useCheckListData - CheckList type cards:', result);
      return result;
    } catch (error) {
      console.error('useCheckListData - Error processing checkListTypeCards:', error);
      return [];
    }
  }, [filteredData]);

  const conformidadeCards = useMemo(() => {
    try {
      const conforme = filteredData.filter(item => item.V === 1).length;
      const naoConforme = filteredData.filter(item => item.V === 0).length;
      const total = filteredData.length;

      return [
        {
          title: 'Conforme',
          value: conforme,
          percentage: total > 0 ? parseFloat(((conforme / total) * 100).toFixed(1)) : 0,
        },
        {
          title: 'Não conforme',
          value: naoConforme,
          percentage: total > 0 ? parseFloat(((naoConforme / total) * 100).toFixed(1)) : 0,
        }
      ];
    } catch (error) {
      console.error('useCheckListData - Error processing conformidadeCards:', error);
      return [];
    }
  }, [filteredData]);

  return {
    filteredData,
    availableFilters,
    checkListTypeCards,
    conformidadeCards,
  };
};
