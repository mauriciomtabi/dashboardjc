
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Calendar, Building2, Truck, Package, Search } from 'lucide-react';

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
  const [placaSearch, setPlacaSearch] = useState('');

  const filteredPlacas = useMemo(() => {
    if (!availableFilters.placas || !placaSearch) return availableFilters.placas || [];
    return availableFilters.placas.filter(placa => 
      placa.toLowerCase().includes(placaSearch.toLowerCase())
    );
  }, [availableFilters.placas, placaSearch]);

  const handleMultipleSelectChange = (key: string, value: string, currentValues: string | string[]) => {
    const currentArray = Array.isArray(currentValues) ? currentValues : (currentValues ? [currentValues] : []);
    const newValues = currentArray.includes(value) 
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    onFilterChange(key, newValues);
  };

  const clearFilter = (key: string) => {
    onFilterChange(key, []);
  };

  const getDisplayValue = (values: string | string[], placeholder: string) => {
    if (Array.isArray(values)) {
      return values.length > 0 ? `${values.length} selecionado(s)` : placeholder;
    }
    return values || placeholder;
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 space-y-4 sticky top-0 z-10 shadow-lg border">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Search className="h-5 w-5" />
        Filtros
      </h3>
      <div className={`grid gap-4 ${isEstoque ? 'grid-cols-5' : 'grid-cols-4'}`}>
        {availableFilters.meses && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Mês
              </Label>
              {Array.isArray(filters.mes) && filters.mes.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('mes')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value="" onValueChange={(value) => handleMultipleSelectChange('mes', value, filters.mes || [])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getDisplayValue(filters.mes || [], "Todos")} />
              </SelectTrigger>
              <SelectContent>
                {availableFilters.meses.map((mes) => {
                  const isSelected = Array.isArray(filters.mes) && filters.mes.includes(mes);
                  return (
                    <div key={mes} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => handleMultipleSelectChange('mes', mes, filters.mes || [])}
                      />
                      <span className="text-sm">{mes}</span>
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableFilters.anos && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Ano
              </Label>
              {Array.isArray(filters.ano) && filters.ano.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('ano')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value="" onValueChange={(value) => handleMultipleSelectChange('ano', value, filters.ano || [])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getDisplayValue(filters.ano || [], "Todos")} />
              </SelectTrigger>
              <SelectContent>
                {availableFilters.anos.map((ano) => {
                  const isSelected = Array.isArray(filters.ano) && filters.ano.includes(ano);
                  return (
                    <div key={ano} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => handleMultipleSelectChange('ano', ano, filters.ano || [])}
                      />
                      <span className="text-sm">{ano}</span>
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableFilters.operacoes && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Operação
              </Label>
              {((Array.isArray(filters.operacao) && filters.operacao.length > 0) || (!Array.isArray(filters.operacao) && filters.operacao)) && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('operacao')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {isEstoque ? (
              <Select value="" onValueChange={(value) => handleMultipleSelectChange('operacao', value, filters.operacao || [])}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getDisplayValue(filters.operacao || [], "Todas")} />
                </SelectTrigger>
                <SelectContent>
                  {availableFilters.operacoes.map((op) => {
                    const isSelected = Array.isArray(filters.operacao) && filters.operacao.includes(op);
                    return (
                      <div key={op} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => handleMultipleSelectChange('operacao', op, filters.operacao || [])}
                        />
                        <span className="text-sm">{op}</span>
                      </div>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Select value={filters.operacao as string || ''} onValueChange={(value) => onFilterChange('operacao', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  {availableFilters.operacoes.map((op) => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {availableFilters.estoques && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm flex items-center gap-1">
                <Package className="h-4 w-4" />
                Estoque
              </Label>
              {((Array.isArray(filters.estoque) && filters.estoque.length > 0) || (!Array.isArray(filters.estoque) && filters.estoque)) && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('estoque')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value="" onValueChange={(value) => handleMultipleSelectChange('estoque', value, filters.estoque || [])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getDisplayValue(filters.estoque || [], "Todos")} />
              </SelectTrigger>
              <SelectContent>
                {availableFilters.estoques.map((est) => {
                  const isSelected = Array.isArray(filters.estoque) && filters.estoque.includes(est);
                  return (
                    <div key={est} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => handleMultipleSelectChange('estoque', est, filters.estoque || [])}
                      />
                      <span className="text-sm">{est}</span>
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Placa
            </Label>
            {((Array.isArray(filters.placa) && filters.placa.length > 0) || (!Array.isArray(filters.placa) && filters.placa)) && (
              <Button variant="ghost" size="sm" onClick={() => clearFilter('placa')}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          {availableFilters.placas ? (
            <Select value="" onValueChange={(value) => handleMultipleSelectChange('placa', value, filters.placa || [])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getDisplayValue(filters.placa || [], "Todas as placas")} />
              </SelectTrigger>
              <SelectContent className="max-h-48 overflow-y-auto">
                <div className="p-2">
                  <Input
                    placeholder="Pesquisar placa..."
                    className="w-full mb-2"
                    value={placaSearch}
                    onChange={(e) => setPlacaSearch(e.target.value)}
                  />
                </div>
                {filteredPlacas.map((placa) => {
                  const isSelected = Array.isArray(filters.placa) && filters.placa.includes(placa);
                  return (
                    <div key={placa} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={() => handleMultipleSelectChange('placa', placa, filters.placa || [])}
                      />
                      <span className="text-sm">{placa}</span>
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          ) : (
            <Input
              placeholder="Pesquisar placa..."
              value={typeof filters.placa === 'string' ? filters.placa : ''}
              onChange={(e) => onFilterChange('placa', e.target.value)}
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
