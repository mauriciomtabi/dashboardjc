
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Calendar } from 'lucide-react';

interface YearFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  availableYears: string[];
  onClear: () => void;
}

const YearFilter = ({ value, onChange, availableYears, onClear }: YearFilterProps) => {
  const handleMultipleSelectChange = (year: string) => {
    const currentArray = Array.isArray(value) ? value : (value ? [value] : []);
    const newValues = currentArray.includes(year) 
      ? currentArray.filter(v => v !== year)
      : [...currentArray, year];
    onChange(newValues);
  };

  const getDisplayValue = () => {
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selecionado(s)` : "Todos";
    }
    return value || "Todos";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Ano
        </Label>
        {Array.isArray(value) && value.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <Select value="" onValueChange={handleMultipleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={getDisplayValue()} />
        </SelectTrigger>
        <SelectContent>
          {availableYears.map((ano) => {
            const isSelected = Array.isArray(value) && value.includes(ano);
            return (
              <div key={ano} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => handleMultipleSelectChange(ano)}
                />
                <span className="text-sm">{ano}</span>
              </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearFilter;
