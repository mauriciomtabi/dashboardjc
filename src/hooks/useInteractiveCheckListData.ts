
import { useMemo } from 'react';
import { CheckListData } from '@/contexts/DataContext';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';

export const useInteractiveCheckListData = (filteredData: CheckListData[]) => {
  const { activeFilter } = useInteractiveFilter();

  const interactiveFilteredData = useMemo(() => {
    if (!activeFilter.type || !activeFilter.value) {
      return filteredData;
    }

    return filteredData.filter(item => {
      switch (activeFilter.type) {
        case 'lista':
          return item.Y === activeFilter.value;
        case 'item':
          return item.T === activeFilter.value;
        case 'placa':
          return item.AG === activeFilter.value;
        case 'colaborador':
          return item.colaborador === activeFilter.value;
        default:
          return true;
      }
    });
  }, [filteredData, activeFilter]);

  return interactiveFilteredData;
};
