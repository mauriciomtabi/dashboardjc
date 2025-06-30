
import React, { useState } from 'react';
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

  const { filteredData, availableFilters, checkListTypeCards } = useCheckListData(filters);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDrillDown = (month: string | null) => {
    setDrillDownMonth(month);
  };

  if (checkListData.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Nenhum dado disponível</h2>
            <p className="text-muted-foreground">Faça o upload de uma planilha para visualizar os dados.</p>
          </div>
        </div>
      </div>
    );
  }

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
                value={card.value.toString()}
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
