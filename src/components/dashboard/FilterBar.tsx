import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MonthFilter from './filters/MonthFilter';
import YearFilter from './filters/YearFilter';
import OperationFilter from './filters/OperationFilter';
import StockFilter from './filters/StockFilter';
import PlateFilter from './filters/PlateFilter';
import ConformidadeFilter from './filters/ConformidadeFilter';

interface FilterBarProps {
  filters: {
    mes: string | string[];
    ano: string | string[];
    placa: string | string[];
    operacao?: string | string[];
    estoque?: string[];
    conformidade?: string[];
  };
  onFilterChange: (key: string, value: string | string[]) => void;
  availableFilters: {
    meses: string[];
    anos: string[];
    operacoes: string[];
    placas: string[];
    estoques?: string[];
    conformidades?: string[];
  };
  showStockFilter?: boolean;
  showConformidadeFilter?: boolean;
}

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  availableFilters, 
  showStockFilter = true,
  showConformidadeFilter = false
}: FilterBarProps) => {
  const clearFilter = (key: string) => {
    onFilterChange(key, []);
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-primary bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <CardContent className="p-3">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[180px]">
            <MonthFilter
              value={filters.mes}
              onChange={(value) => onFilterChange('mes', value)}
              availableMonths={availableFilters.meses}
              onClear={() => clearFilter('mes')}
            />
          </div>
          
          <div className="min-w-[180px]">
            <YearFilter
              value={filters.ano}
              onChange={(value) => onFilterChange('ano', value)}
              availableYears={availableFilters.anos}
              onClear={() => clearFilter('ano')}
            />
          </div>
          
          <div className="min-w-[180px]">
            <PlateFilter
              value={filters.placa}
              onChange={(value) => onFilterChange('placa', value)}
              availablePlates={availableFilters.placas}
              onClear={() => clearFilter('placa')}
            />
          </div>
          
          <div className="min-w-[180px]">
            <OperationFilter
              value={filters.operacao || []}
              onChange={(value) => onFilterChange('operacao', value)}
              availableOperations={availableFilters.operacoes}
              onClear={() => clearFilter('operacao')}
              isMultiple={true}
            />
          </div>
          
          {showStockFilter && availableFilters.estoques && (
            <div className="min-w-[180px]">
              <StockFilter
                value={filters.estoque || []}
                onChange={(value) => onFilterChange('estoque', value)}
                availableStocks={availableFilters.estoques}
                onClear={() => clearFilter('estoque')}
              />
            </div>
          )}

          {showConformidadeFilter && availableFilters.conformidades && (
            <div className="min-w-[180px]">
              <ConformidadeFilter
                value={filters.conformidade || []}
                onChange={(value) => onFilterChange('conformidade', value)}
                availableConformidades={availableFilters.conformidades}
                onClear={() => clearFilter('conformidade')}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
