
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InteractiveFilter {
  type: 'lista' | 'item' | 'placa' | 'preventiva' | 'colaborador' | null;
  value: string | null;
}

interface InteractiveFilterContextType {
  activeFilter: InteractiveFilter;
  setActiveFilter: (filter: InteractiveFilter) => void;
  clearActiveFilter: () => void;
}

const InteractiveFilterContext = createContext<InteractiveFilterContextType | undefined>(undefined);

export const useInteractiveFilter = () => {
  const context = useContext(InteractiveFilterContext);
  if (!context) {
    throw new Error('useInteractiveFilter must be used within an InteractiveFilterProvider');
  }
  return context;
};

interface InteractiveFilterProviderProps {
  children: ReactNode;
}

export const InteractiveFilterProvider = ({ children }: InteractiveFilterProviderProps) => {
  const [activeFilter, setActiveFilter] = useState<InteractiveFilter>({
    type: null,
    value: null
  });

  const clearActiveFilter = () => {
    setActiveFilter({ type: null, value: null });
  };

  return (
    <InteractiveFilterContext.Provider 
      value={{ 
        activeFilter, 
        setActiveFilter, 
        clearActiveFilter 
      }}
    >
      {children}
    </InteractiveFilterContext.Provider>
  );
};
