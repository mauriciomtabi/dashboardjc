import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import Navigation from '@/components/dashboard/Navigation';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import ComparativeChart from '@/components/dashboard/ComparativeChart';
import MotivosChart from '@/components/dashboard/MotivosChart';
import VidaPneusChart from '@/components/dashboard/VidaPneusChart';
import DOTsChart from '@/components/dashboard/DOTsChart';
import PlacasChart from '@/components/dashboard/PlacasChart';
import LaudoDataTable from '@/components/dashboard/LaudoDataTable';
import { useLaudoData } from '@/hooks/useLaudoData';
import MarcasCards from '@/components/dashboard/MarcasCards';

const GestaoLaudos = () => {
  const { laudoData } = useData();
  const [filters, setFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    placa: [] as string[],
    operacao: '',
  });
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [drillDownMonth, setDrillDownMonth] = useState<string | null>(null);

  const { filteredData, availableFilters, operacaoCards } = useLaudoData(filters);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (laudoData.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
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
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-bold">Gestão de Laudos</h2>
        
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
          showStockFilter={false}
        />

        {/* Cards de Operações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {operacaoCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              percentage={card.percentage}
            />
          ))}
        </div>

        {/* Comparativo Anual - Largura completa */}
        <div className="w-full">
          <ComparativeChart 
            laudoData={laudoData}
            filteredData={filteredData}
            drillDownMonth={drillDownMonth}
            setDrillDownMonth={setDrillDownMonth}
          />
        </div>

        {/* Top 10 Motivos de Laudo - Largura completa */}
        <div className="w-full">
          <MotivosChart filteredData={filteredData} />
        </div>

        {/* Gráficos em grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MarcasCards filteredData={filteredData} />
          <VidaPneusChart filteredData={filteredData} />
        </div>

        {/* DOTs - Largura completa */}
        <div className="w-full">
          <DOTsChart filteredData={filteredData} />
        </div>

        {/* Placas - Largura completa */}
        <div className="w-full">
          <PlacasChart filteredData={filteredData} />
        </div>

        {/* Tabela Completa */}
        <div className="flex justify-center pt-6">
          <LaudoDataTable 
            filteredData={filteredData}
            isOpen={isTableOpen}
            onOpenChange={setIsTableOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default GestaoLaudos;
