
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Package } from 'lucide-react';

interface StockFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  availableStocks: string[];
  onClear: () => void;
}

const StockFilter = ({ value, onChange, availableStocks, onClear }: StockFilterProps) => {
  const handleMultipleSelectChange = (stock: string) => {
    const currentArray = Array.isArray(value) ? value : (value ? [value] : []);
    const newValues = currentArray.includes(stock) 
      ? currentArray.filter(v => v !== stock)
      : [...currentArray, stock];
    onChange(newValues);
  };

  const getDisplayValue = () => {
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selecionado(s)` : "Todos";
    }
    return value || "Todos";
  };

  const hasValue = (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1">
          <Package className="h-3 w-3" />
          Estoque
        </Label>
        {hasValue && (
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
          {availableStocks.map((est) => {
            const isSelected = Array.isArray(value) && value.includes(est);
            return (
              <div key={est} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => handleMultipleSelectChange(est)}
                />
                <span className="text-sm">{est}</span>
              </div>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StockFilter;
