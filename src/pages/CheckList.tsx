
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import { useCheckListData } from '@/hooks/useCheckListData';
import CheckListDataInspecaoChart from '@/components/dashboard/CheckListDataInspecaoChart';
import CheckListItensChart from '@/components/dashboard/CheckListItensChart';
import CheckListListaChart from '@/components/dashboard/CheckListListaChart';
import CheckListPlacasChart from '@/components/dashboard/CheckListPlacasChart';
import CheckListDataTable from '@/components/dashboard/CheckListDataTable';

const CheckList = () => {
  const { checkListData } = useData();
  const [filters, setFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    filial: [] as string[],
    checkListType: [] as string[],
    placa: [] as string[],
  });
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [drillDownMonth, setDrillDownMonth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('CheckList - checkListData length:', checkListData.length);
  console.log('CheckList - checkListData sample:', checkListData.slice(0, 3));

  // Use effect to handle loading state and error checking
  useEffect(() => {
    console.log('CheckList useEffect - checkListData changed:', checkListData.length);
    
    try {
      const timer = setTimeout(() => {
        console.log('CheckList - Setting isLoading to false');
        setIsLoading(false);
        setError(null);
      }, 500);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('CheckList - Error in useEffect:', err);
      setError('Erro ao carregar dados do CheckList');
      setIsLoading(false);
    }
  }, [checkListData]);

  // Initialize hook with error handling
  let filteredData, availableFilters, checkListTypeCards;
  
  try {
    console.log('CheckList - Calling useCheckListData with filters:', filters);
    const hookResult = useCheckListData(filters);
    filteredData = hookResult.filteredData;
    availableFilters = hookResult.availableFilters;
    checkListTypeCards = hookResult.checkListTypeCards;
    
    console.log('CheckList - Hook result:', {
      filteredDataLength: filteredData?.length,
      availableFilters,
      checkListTypeCardsLength: checkListTypeCards?.length
    });
  } catch (err) {
    console.error('CheckList - Error in useCheckListData hook:', err);
    setError('Erro ao processar dados do CheckList');
  }

  const handleFilterChange = (key: string, value: string | string[]) => {
    console.log('CheckList - Filter change:', key, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDrillDown = (month: string | null) => {
    console.log('CheckList - Drill down:', month);
    setDrillDownMonth(month);
  };

  // Show loading state briefly to prevent flickering
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Erro</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (checkListData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Nenhum dado disponível</h2>
          <p className="text-muted-foreground">Faça o upload de uma planilha para visualizar os dados.</p>
        </div>
      </div>
    );
  }

  // Additional safety check for hook results
  if (!filteredData || !availableFilters || !checkListTypeCards) {
    console.error('CheckList - Missing hook results:', { filteredData, availableFilters, checkListTypeCards });
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Erro de Processamento</h2>
          <p className="text-muted-foreground">Erro ao processar os dados do CheckList. Verifique o console para mais detalhes.</p>
        </div>
      </div>
    );
  }

  console.log('CheckList - About to render main content');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6 pb-4">
        <h2 className="text-3xl font-bold">Check List</h2>
      </div>
      
      {/* Filtros fixos */}
      <div className="sticky top-0 z-50 bg-background border-b p-6 pt-2">
        <FilterBar
          filters={{
            mes: filters.mes,
            ano: filters.ano,
            placa: filters.placa,
            operacao: filters.filial,
          }}
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
          showStockFilter={false}
        />
      </div>

      <div className="p-6 pt-8 space-y-8">
        {/* Cards de Tipo de Check List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tipo de Check List</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {checkListTypeCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                percentage={card.percentage}
                variant="default"
              />
            ))}
          </div>
        </div>

        {/* Data de Inspeção - Largura completa */}
        <div className="w-full">
          <CheckListDataInspecaoChart 
            checkListData={checkListData}
            filteredData={filteredData}
            drillDownMonth={drillDownMonth}
            onDrillDown={handleDrillDown}
          />
        </div>

        {/* Itens Inspecionados - Largura completa */}
        <div className="w-full">
          <CheckListItensChart filteredData={filteredData} />
        </div>

        {/* Lista de Inspeção - Largura completa */}
        <div className="w-full">
          <CheckListListaChart filteredData={filteredData} />
        </div>

        {/* Placas - Largura completa */}
        <div className="w-full">
          <CheckListPlacasChart filteredData={filteredData} />
        </div>

        {/* Tabela Completa */}
        <div className="flex justify-center pt-6">
          <CheckListDataTable 
            filteredData={filteredData}
            isOpen={isTableOpen}
            onOpenChange={setIsTableOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckList;
