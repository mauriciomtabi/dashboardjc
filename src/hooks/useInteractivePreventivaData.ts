import { useMemo } from 'react';
import { PreventivaData } from '@/contexts/DataContext';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';

export const useInteractivePreventivaData = (filteredData: PreventivaData[]) => {
  const { activeFilter } = useInteractiveFilter();

  const interactiveFilteredData = useMemo(() => {
    if (!activeFilter.type || !activeFilter.value) {
      return filteredData;
    }

    return filteredData.filter(item => {
      switch (activeFilter.type) {
        case 'preventiva':
          return item.preventiva === activeFilter.value;
        case 'placa':
          return item.placa === activeFilter.value;
        default:
          return true;
      }
    });
  }, [filteredData, activeFilter]);

  return interactiveFilteredData;
};