
import React, { useState } from 'react';
import { useEstoqueData } from '@/hooks/useEstoqueData';
import Navigation from '@/components/dashboard/Navigation';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import EstoqueComparativeChart from '@/components/dashboard/EstoqueComparativeChart';
import EstoqueVidaPneusChart from '@/components/dashboard/EstoqueVidaPneusChart';
import EstoqueDataTable from '@/components/dashboard/EstoqueDataTable';

const GestaoEstoque = () => {
  const [filters, setFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    estoque: [] as string[],
    operacao: [] as string[],
    placa: [] as string[],
  });
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [drillDownMonth, setDrillDownMonth] = useState<string | null>(null);

  const { estoqueData, filteredData, availableFilters, operacaoCards, estoqueCards } = useEstoqueData(filters);

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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold">Gestão de Estoque</h2>
        
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
          isEstoque={true}
        />

        {/* Cards de Operações */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Operações</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        <div>
          <h3 className="text-lg font-semibold mb-4">Estoque</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {estoqueCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                percentage={card.percentage}
              />
            ))}
          </div>
        </div>

        {/* Comparativo Anual - Largura completa */}
        <div className="w-full">
          <EstoqueComparativeChart 
            estoqueData={estoqueData}
            filteredData={filteredData}
            drillDownMonth={drillDownMonth}
            onDrillDown={setDrillDownMonth}
          />
        </div>

        {/* Gráfico Vida dos Pneus */}
        <div className="w-full">
          <EstoqueVidaPneusChart filteredData={filteredData} />
        </div>

        {/* Tabela Completa */}
        <div className="flex justify-center">
          <EstoqueDataTable 
            filteredData={filteredData}
            isOpen={isTableOpen}
            onOpenChange={setIsTableOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default GestaoEstoque;
