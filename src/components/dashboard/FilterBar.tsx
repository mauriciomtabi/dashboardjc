
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterBarProps {
  filters: {
    mes?: string;
    ano?: string;
    placa?: string;
    operacao?: string | string[];
    estoque?: string | string[];
  };
  onFilterChange: (key: string, value: string | string[]) => void;
  availableFilters: {
    meses?: string[];
    anos?: string[];
    operacoes?: string[];
    estoques?: string[];
  };
  isEstoque?: boolean;
}

const FilterBar = ({ filters, onFilterChange, availableFilters, isEstoque = false }: FilterBarProps) => {
  const handleMultipleSelectChange = (key: string, value: string, currentValues: string | string[]) => {
    const currentArray = Array.isArray(currentValues) ? currentValues : (currentValues ? [currentValues] : []);
    const newValues = currentArray.includes(value) 
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    onFilterChange(key, newValues);
  };

  const clearFilter = (key: string) => {
    onFilterChange(key, isEstoque && (key === 'operacao' || key === 'estoque') ? [] : '');
  };

  const getDisplayValue = (values: string | string[], placeholder: string) => {
    if (Array.isArray(values)) {
      return values.length > 0 ? `${values.length} selecionado(s)` : placeholder;
    }
    return values || placeholder;
  };

  return (
    <div className="bg-card rounded-lg p-4 mb-6 space-y-4">
      <h3 className="font-semibold text-lg">Filtros</h3>
      <div className={`grid ${isEstoque ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
        {availableFilters.meses && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Mês</Label>
              {filters.mes && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('mes')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value={filters.mes || ''} onValueChange={(value) => onFilterChange('mes', value)}>
              <SelectTrigger className={isEstoque ? 'w-20' : ''}>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {availableFilters.meses.map((mes) => (
                  <SelectItem key={mes} value={mes}>{mes}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableFilters.anos && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ano</Label>
              {filters.ano && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('ano')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value={filters.ano || ''} onValueChange={(value) => onFilterChange('ano', value)}>
              <SelectTrigger className={isEstoque ? 'w-24' : ''}>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {availableFilters.anos.map((ano) => (
                  <SelectItem key={ano} value={ano}>{ano}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableFilters.operacoes && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Operação</Label>
              {((Array.isArray(filters.operacao) && filters.operacao.length > 0) || (!Array.isArray(filters.operacao) && filters.operacao)) && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('operacao')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {isEstoque ? (
              <Select value="" onValueChange={(value) => handleMultipleSelectChange('operacao', value, filters.operacao || [])}>
                <SelectTrigger>
                  <SelectValue placeholder={getDisplayValue(filters.operacao || [], "Todas as operações")} />
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
                        <span>{op}</span>
                      </div>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : (
              <Select value={filters.operacao as string || ''} onValueChange={(value) => onFilterChange('operacao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as operações" />
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
              <Label>Estoque</Label>
              {((Array.isArray(filters.estoque) && filters.estoque.length > 0) || (!Array.isArray(filters.estoque) && filters.estoque)) && (
                <Button variant="ghost" size="sm" onClick={() => clearFilter('estoque')}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Select value="" onValueChange={(value) => handleMultipleSelectChange('estoque', value, filters.estoque || [])}>
              <SelectTrigger>
                <SelectValue placeholder={getDisplayValue(filters.estoque || [], "Todos os estoques")} />
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
                      <span>{est}</span>
                    </div>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{isEstoque ? 'Placa (AK)' : 'Placa (AB)'}</Label>
            {filters.placa && (
              <Button variant="ghost" size="sm" onClick={() => clearFilter('placa')}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Input
            placeholder="Pesquisar placa..."
            value={filters.placa || ''}
            onChange={(e) => onFilterChange('placa', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
