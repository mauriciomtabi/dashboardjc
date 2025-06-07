import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import Navigation from '@/components/dashboard/Navigation';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import EstoqueComparativeChart from '@/components/dashboard/EstoqueComparativeChart';
import EstoqueVidaPneusChart from '@/components/dashboard/EstoqueVidaPneusChart';
import EstoqueDataTable from '@/components/dashboard/EstoqueDataTable';
import { useEstoqueData } from '@/hooks/useEstoqueData';
import SituacaoPneusChart from '@/components/dashboard/SituacaoPneusChart';

const GestaoEstoque = () => {
  const { estoqueData } = useData();
  const [filters, setFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    estoque: [] as string[],
    operacao: [] as string[],
    placa: [] as string[],
  });
  const [isTableOpen, setIsTableOpen] = useState(false);

  const { filteredData, availableFilters, operacaoCards, estoqueCards } = useEstoqueData(filters);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (estoqueData.length === 0) {
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
      <div className="max-w-7xl mx-auto">
        <div className="p-6 pb-4">
          <h2 className="text-3xl font-bold">Gestão de Estoque</h2>
        </div>
        
        {/* Filtros fixos */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-6 pt-2">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            availableFilters={availableFilters}
          />
        </div>

        <div className="p-6 pt-8 space-y-8">
          {/* Cards de Operações */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Operações</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {operacaoCards.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  percentage={card.percentage}
                />
              ))}
            </div>
          </div>

          {/* Cards de Estoque */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estoque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {estoqueCards.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  percentage={card.percentage}
                  className="bg-secondary/20 border-secondary/50"
                />
              ))}
            </div>
          </div>

          {/* Comparativo Anual - Largura completa */}
          <div className="w-full">
            <EstoqueComparativeChart 
              estoqueData={estoqueData}
              filteredData={filteredData}
            />
          </div>

          {/* Gráficos em grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EstoqueVidaPneusChart filteredData={filteredData} />
            <SituacaoPneusChart filteredData={filteredData} />
          </div>

          {/* Tabela Completa */}
          <div className="flex justify-center pt-6">
            <EstoqueDataTable 
              filteredData={filteredData}
              isOpen={isTableOpen}
              onOpenChange={setIsTableOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoEstoque;
