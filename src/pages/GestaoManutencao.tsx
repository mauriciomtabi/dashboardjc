
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import ManutencaoComparativeChart from '@/components/dashboard/ManutencaoComparativeChart';
import ManutencaoVeiculosChart from '@/components/dashboard/ManutencaoVeiculosChart';
import ManutencaoFornecedoresChart from '@/components/dashboard/ManutencaoFornecedoresChart';
import ManutencaoPecasChart from '@/components/dashboard/ManutencaoPecasChart';
import ManutencaoServicosChart from '@/components/dashboard/ManutencaoServicosChart';
import ManutencaoDataTable from '@/components/dashboard/ManutencaoDataTable';
import ManutencaoTipoChart from '@/components/dashboard/ManutencaoTipoChart';
import { useManutencaoData } from '@/hooks/useManutencaoData';

const GestaoManutencao = () => {
  const { manutencaoData } = useData();
  const [filters, setFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    placa: [] as string[],
    operacao: [] as string[],
    tipoManutencao: [] as string[],
  });
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [drillDownMonth, setDrillDownMonth] = useState<string | null>(null);

  const { filteredData, availableFilters, operacaoCards } = useManutencaoData(filters, manutencaoData);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDrillDown = (month: string | null) => {
    setDrillDownMonth(month);
  };

  if (manutencaoData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Nenhum dado disponível</h2>
          <p className="text-muted-foreground">Faça o upload de uma planilha para visualizar os dados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="p-6 pb-4">
        <h2 className="text-3xl font-bold">Gestão de Manutenção</h2>
      </div>
      
      {/* Filtros fixos */}
      <div className="sticky top-0 z-50 bg-background border-b p-6 pt-2">
        <FilterBar
          filters={{
            mes: filters.mes,
            ano: filters.ano,
            placa: filters.placa,
            operacao: filters.operacao,
            estoque: filters.tipoManutencao,
          }}
          onFilterChange={(key, value) => {
            if (key === 'estoque') {
              handleFilterChange('tipoManutencao', value);
            } else {
              handleFilterChange(key, value);
            }
          }}
          availableFilters={{
            meses: availableFilters.meses,
            anos: availableFilters.anos,
            operacoes: availableFilters.operacoes,
            placas: availableFilters.placas,
            estoques: availableFilters.tiposManutencao,
          }}
          showStockFilter={true}
        />
      </div>

      <div className="p-6 pt-8 space-y-8">
        {/* Cards de Operações */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Custo por Operação</h3>
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

        {/* Comparativo Mensal - Largura completa */}
        <div className="w-full">
          <ManutencaoComparativeChart 
            manutencaoData={manutencaoData}
            filteredData={filteredData}
            drillDownMonth={drillDownMonth}
            onDrillDown={handleDrillDown}
          />
        </div>

        {/* Gráficos em grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ManutencaoVeiculosChart filteredData={filteredData} />
          <ManutencaoFornecedoresChart filteredData={filteredData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ManutencaoPecasChart filteredData={filteredData} />
          <ManutencaoServicosChart filteredData={filteredData} />
          <ManutencaoTipoChart filteredData={filteredData} />
        </div>

        {/* Tabela Completa */}
        <div className="flex justify-center pt-6">
          <ManutencaoDataTable 
            filteredData={filteredData}
            isOpen={isTableOpen}
            onOpenChange={setIsTableOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default GestaoManutencao;
