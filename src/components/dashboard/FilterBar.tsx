
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilterBarProps {
  filters: {
    mes?: string;
    ano?: string;
    placa?: string;
    operacao?: string;
    estoque?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  availableFilters: {
    meses?: string[];
    anos?: string[];
    operacoes?: string[];
    estoques?: string[];
  };
}

const FilterBar = ({ filters, onFilterChange, availableFilters }: FilterBarProps) => {
  return (
    <div className="bg-card rounded-lg p-4 mb-6 space-y-4">
      <h3 className="font-semibold text-lg">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {availableFilters.meses && (
          <div className="space-y-2">
            <Label>Mês</Label>
            <Select value={filters.mes || ''} onValueChange={(value) => onFilterChange('mes', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os meses</SelectItem>
                {availableFilters.meses.map((mes) => (
                  <SelectItem key={mes} value={mes}>{mes}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableFilters.anos && (
          <div className="space-y-2">
            <Label>Ano</Label>
            <Select value={filters.ano || ''} onValueChange={(value) => onFilterChange('ano', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os anos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os anos</SelectItem>
                {availableFilters.anos.map((ano) => (
                  <SelectItem key={ano} value={ano}>{ano}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableFilters.operacoes && (
          <div className="space-y-2">
            <Label>Operação</Label>
            <Select value={filters.operacao || ''} onValueChange={(value) => onFilterChange('operacao', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as operações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as operações</SelectItem>
                {availableFilters.operacoes.map((op) => (
                  <SelectItem key={op} value={op}>{op}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableFilters.estoques && (
          <div className="space-y-2">
            <Label>Estoque</Label>
            <Select value={filters.estoque || ''} onValueChange={(value) => onFilterChange('estoque', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os estoques" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os estoques</SelectItem>
                {availableFilters.estoques.map((est) => (
                  <SelectItem key={est} value={est}>{est}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Placa</Label>
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
