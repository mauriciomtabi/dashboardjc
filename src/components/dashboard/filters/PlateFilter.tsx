
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Truck } from 'lucide-react';

interface PlateFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  availablePlates?: string[];
  onClear: () => void;
}

const PlateFilter = ({ value, onChange, availablePlates, onClear }: PlateFilterProps) => {
  const [plateSearch, setPlateSearch] = useState('');

  const filteredPlates = useMemo(() => {
    if (!availablePlates || !plateSearch) return availablePlates || [];
    return availablePlates.filter(plate => 
      plate.toLowerCase().includes(plateSearch.toLowerCase())
    );
  }, [availablePlates, plateSearch]);

  const handleMultipleSelectChange = (plate: string) => {
    const currentArray = Array.isArray(value) ? value : (value ? [value] : []);
    const newValues = currentArray.includes(plate) 
      ? currentArray.filter(v => v !== plate)
      : [...currentArray, plate];
    onChange(newValues);
  };

  const getDisplayValue = () => {
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selecionado(s)` : "Todas as placas";
    }
    return value || "Todas as placas";
  };

  const hasValue = (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1">
          <Truck className="h-3 w-3" />
          Placa
        </Label>
        {hasValue && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {availablePlates ? (
        <Select value="" onValueChange={handleMultipleSelectChange}>
          <SelectTrigger className="w-full h-8">
            <SelectValue placeholder={getDisplayValue()} />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            <div className="p-2">
              <Input
                placeholder="Pesquisar placa..."
                className="w-full mb-2"
                value={plateSearch}
                onChange={(e) => setPlateSearch(e.target.value)}
              />
            </div>
            {filteredPlates.map((placa) => {
              const isSelected = Array.isArray(value) && value.includes(placa);
              return (
                <div key={placa} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => handleMultipleSelectChange(placa)}
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
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8"
        />
      )}
    </div>
  );
};

export default PlateFilter;
