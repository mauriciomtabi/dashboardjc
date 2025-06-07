
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MonthFilter from './filters/MonthFilter';
import YearFilter from './filters/YearFilter';
import OperationFilter from './filters/OperationFilter';
import StockFilter from './filters/StockFilter';
import PlateFilter from './filters/PlateFilter';

interface FilterBarProps {
  filters: {
    mes: string | string[];
    ano: string | string[];
    placa: string | string[];
    operacao?: string | string[];
    estoque?: string[];
  };
  onFilterChange: (key: string, value: string | string[]) => void;
  availableFilters: {
    meses: string[];
    anos: string[];
    operacoes: string[];
    placas: string[];
    estoques?: string[];
  };
  showStockFilter?: boolean;
}

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  availableFilters, 
  showStockFilter = true 
}: FilterBarProps) => {
  const clearFilter = (key: string) => {
    onFilterChange(key, []);
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-primary bg-card">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-6">
          <div className="min-w-[200px]">
            <MonthFilter
              value={filters.mes}
              onChange={(value) => onFilterChange('mes', value)}
              availableMonths={availableFilters.meses}
              onClear={() => clearFilter('mes')}
            />
          </div>
          
          <div className="min-w-[200px]">
            <YearFilter
              value={filters.ano}
              onChange={(value) => onFilterChange('ano', value)}
              availableYears={availableFilters.anos}
              onClear={() => clearFilter('ano')}
            />
          </div>
          
          <div className="min-w-[200px]">
            <PlateFilter
              value={filters.placa}
              onChange={(value) => onFilterChange('placa', value)}
              availablePlates={availableFilters.placas}
              onClear={() => clearFilter('placa')}
            />
          </div>
          
          <div className="min-w-[200px]">
            <OperationFilter
              value={filters.operacao || []}
              onChange={(value) => onFilterChange('operacao', value)}
              availableOperations={availableFilters.operacoes}
              onClear={() => clearFilter('operacao')}
            />
          </div>
          
          {showStockFilter && availableFilters.estoques && (
            <div className="min-w-[200px]">
              <StockFilter
                value={filters.estoque || []}
                onChange={(value) => onFilterChange('estoque', value)}
                availableStocks={availableFilters.estoques}
                onClear={() => clearFilter('estoque')}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
