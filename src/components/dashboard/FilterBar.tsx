
import React from 'react';
import { Search } from 'lucide-react';
import MonthFilter from './filters/MonthFilter';
import YearFilter from './filters/YearFilter';
import OperationFilter from './filters/OperationFilter';
import StockFilter from './filters/StockFilter';
import PlateFilter from './filters/PlateFilter';

interface FilterBarProps {
  filters: {
    mes?: string | string[];
    ano?: string | string[];
    placa?: string | string[];
    operacao?: string | string[];
    estoque?: string | string[];
  };
  onFilterChange: (key: string, value: string | string[]) => void;
  availableFilters: {
    meses?: string[];
    anos?: string[];
    operacoes?: string[];
    estoques?: string[];
    placas?: string[];
  };
  isEstoque?: boolean;
}

const FilterBar = ({ filters, onFilterChange, availableFilters, isEstoque = false }: FilterBarProps) => {
  const clearFilter = (key: string) => {
    onFilterChange(key, []);
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 space-y-4 sticky top-0 z-10 shadow-lg border">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Search className="h-5 w-5" />
        Filtros
      </h3>
      <div className={`grid gap-4 ${isEstoque ? 'grid-cols-5' : 'grid-cols-4'}`}>
        {availableFilters.meses && (
          <MonthFilter
            value={filters.mes || []}
            onChange={(value) => onFilterChange('mes', value)}
            availableMonths={availableFilters.meses}
            onClear={() => clearFilter('mes')}
          />
        )}

        {availableFilters.anos && (
          <YearFilter
            value={filters.ano || []}
            onChange={(value) => onFilterChange('ano', value)}
            availableYears={availableFilters.anos}
            onClear={() => clearFilter('ano')}
          />
        )}

        {availableFilters.operacoes && (
          <OperationFilter
            value={filters.operacao || []}
            onChange={(value) => onFilterChange('operacao', value)}
            availableOperations={availableFilters.operacoes}
            onClear={() => clearFilter('operacao')}
            isMultiple={isEstoque}
          />
        )}

        {availableFilters.estoques && (
          <StockFilter
            value={filters.estoque || []}
            onChange={(value) => onFilterChange('estoque', value)}
            availableStocks={availableFilters.estoques}
            onClear={() => clearFilter('estoque')}
          />
        )}

        <PlateFilter
          value={filters.placa || []}
          onChange={(value) => onFilterChange('placa', value)}
          availablePlates={availableFilters.placas}
          onClear={() => clearFilter('placa')}
        />
      </div>
    </div>
  );
};

export default FilterBar;
