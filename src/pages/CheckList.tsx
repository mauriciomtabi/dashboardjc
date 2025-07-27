
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { InteractiveFilterProvider } from '@/contexts/InteractiveFilterContext';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import { useCheckListData } from '@/hooks/useCheckListData';
import CheckListDataInspecaoChart from '@/components/dashboard/CheckListDataInspecaoChart';
import CheckListItensChart from '@/components/dashboard/CheckListItensChart';
import CheckListListaChart from '@/components/dashboard/CheckListListaChart';
import CheckListPlacasChart from '@/components/dashboard/CheckListPlacasChart';
import CheckListDataTable from '@/components/dashboard/CheckListDataTable';

const CheckListContent = () => {
  const { checkListData } = useData();
  const [filters, setFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    operacao: [] as string[],
    checkListType: [] as string[],
    placa: [] as string[],
    conformidade: [] as string[],
  });
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [drillDownMonth, setDrillDownMonth] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('CheckList - checkListData length:', checkListData.length);
  console.log('CheckList - checkListData sample:', checkListData.slice(0, 3));

  // Use effect to handle loading state
  useEffect(() => {
    console.log('CheckList useEffect - checkListData changed:', checkListData.length);
    setIsLoading(false);
    setError(null);
  }, [checkListData]);

  // Use hook with error handling
  const { filteredData, availableFilters, checkListTypeCards, conformidadeCards } = useCheckListData(filters);

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
            operacao: filters.operacao,
            conformidade: filters.conformidade,
          }}
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
          showStockFilter={false}
          showConformidadeFilter={true}
        />
      </div>

      <div className="p-6 pt-8 space-y-6">
        {/* Cards de Conformidade */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Conformidade das Inspeções</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conformidadeCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                percentage={card.percentage}
                variant={card.title === 'Conforme' ? 'conforme' : 'nao-conforme'}
              />
            ))}
          </div>
        </div>

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

        {/* Lista de Inspeção - Largura completa */}
        <div className="w-full">
          <CheckListListaChart filteredData={filteredData} />
        </div>

        {/* Top itens não conformes - Largura completa */}
        <div className="w-full">
          <CheckListItensChart 
            filteredData={filteredData} 
            conformidadeFilter={filters.conformidade}
          />
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

const CheckList = () => {
  return (
    <InteractiveFilterProvider>
      <CheckListContent />
    </InteractiveFilterProvider>
  );
};

export default CheckList;
