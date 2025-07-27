
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';

interface ConformidadeFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  availableConformidades: string[];
  onClear: () => void;
}

const ConformidadeFilter = ({ value, onChange, availableConformidades, onClear }: ConformidadeFilterProps) => {
  const handleMultipleSelectChange = (conformidade: string) => {
    const currentArray = Array.isArray(value) ? value : (value ? [value] : []);
    const newValues = currentArray.includes(conformidade) 
      ? currentArray.filter(v => v !== conformidade)
      : [...currentArray, conformidade];
    onChange(newValues);
  };

  const getDisplayValue = () => {
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selecionado(s)` : "Todos";
    }
    return value || "Todos";
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Conformidade
        </Label>
        {Array.isArray(value) && value.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Select value="" onValueChange={handleMultipleSelectChange}>
        <SelectTrigger className="w-full h-8">
          <SelectValue placeholder={getDisplayValue()} />
        </SelectTrigger>
        <SelectContent>
          {availableConformidades.map((conformidade) => {
            const isSelected = Array.isArray(value) && value.includes(conformidade);
            return (
              <div key={conformidade} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => handleMultipleSelectChange(conformidade)}
                />
                <span className="text-sm">{conformidade}</span>
              </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConformidadeFilter;
