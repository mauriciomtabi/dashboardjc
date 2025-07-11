import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import PreventivasTotaisChart from '@/components/dashboard/PreventivasTotaisChart';
import PreventivasKmChart from '@/components/dashboard/PreventivasKmChart';
import PreventivasDiasChart from '@/components/dashboard/PreventivasDiasChart';
import PreventivaDataTable from '@/components/dashboard/PreventivaDataTable';
import { usePreventivaData } from '@/hooks/usePreventivaData';
import { useInteractivePreventivaData } from '@/hooks/useInteractivePreventivaData';
import { InteractiveFilterProvider } from '@/contexts/InteractiveFilterContext';

const PreventivasContent = () => {
  const { preventivaData } = useData();
  const [filters, setFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    placa: [] as string[],
    operacao: [] as string[],
  });
  const [isTableOpen, setIsTableOpen] = useState(false);

  const { filteredData, availableFilters, operacaoCards } = usePreventivaData(filters, preventivaData);
  const interactiveFilteredData = useInteractivePreventivaData(filteredData);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  console.log('Preventivas - Total de dados:', preventivaData.length);
  console.log('Preventivas - Dados filtrados:', filteredData.length);
  console.log('Preventivas - Dados brutos (primeiros 3):', preventivaData.slice(0, 3));

  if (preventivaData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Nenhum dado disponível</h2>
          <p className="text-muted-foreground">Faça o upload de uma planilha com a aba "PREVENTIVAS" para visualizar os dados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6 pb-4">
        <h2 className="text-3xl font-bold">Preventivas</h2>
      </div>
      
      {/* Filtros fixos */}
      <div className="sticky top-0 z-50 bg-background border-b p-6 pt-2">
        <FilterBar
          filters={{
            mes: filters.mes,
            ano: filters.ano,
            placa: filters.placa,
            operacao: filters.operacao,
          }}
          onFilterChange={handleFilterChange}
          availableFilters={{
            meses: availableFilters.meses,
            anos: availableFilters.anos,
            operacoes: availableFilters.operacoes,
            placas: availableFilters.placas,
          }}
          showStockFilter={false}
        />
      </div>

      <div className="p-6 pt-8 space-y-8">
        {/* Cards de Operações */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preventivas por Operação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {operacaoCards.map((card, index) => (
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

        {/* Gráfico de Preventivas Totais - Largura completa, altura reduzida */}
        <div className="w-full">
          <PreventivasTotaisChart filteredData={interactiveFilteredData} />
        </div>

        {/* Gráficos de vencimento - layout vertical */}
        <div className="w-full space-y-8">
          <PreventivasKmChart filteredData={interactiveFilteredData} />
          <PreventivasDiasChart filteredData={interactiveFilteredData} />
        </div>

        {/* Tabela Completa */}
        <div className="flex justify-center pt-6">
          <PreventivaDataTable 
            filteredData={interactiveFilteredData}
            isOpen={isTableOpen}
            onOpenChange={setIsTableOpen}
          />
        </div>
      </div>
    </div>
  );
};

const Preventivas = () => {
  return (
    <InteractiveFilterProvider>
      <PreventivasContent />
    </InteractiveFilterProvider>
  );
};

export default Preventivas;