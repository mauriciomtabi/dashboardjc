
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Calendar } from 'lucide-react';

interface MonthFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  availableMonths: string[];
  onClear: () => void;
}

const MonthFilter = ({ value, onChange, availableMonths, onClear }: MonthFilterProps) => {
  const handleMultipleSelectChange = (month: string) => {
    const currentArray = Array.isArray(value) ? value : (value ? [value] : []);
    const newValues = currentArray.includes(month) 
      ? currentArray.filter(v => v !== month)
      : [...currentArray, month];
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
          Mês
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
          {availableMonths.map((mes) => {
            const isSelected = Array.isArray(value) && value.includes(mes);
            return (
              <div key={mes} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => handleMultipleSelectChange(mes)}
                />
                <span className="text-sm">{mes}</span>
              </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthFilter;
