
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, Building2 } from 'lucide-react';

interface OperationFilterProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  availableOperations: string[];
  onClear: () => void;
  isMultiple?: boolean;
}

const OperationFilter = ({ value, onChange, availableOperations, onClear, isMultiple = false }: OperationFilterProps) => {
  const handleMultipleSelectChange = (operation: string) => {
    const currentArray = Array.isArray(value) ? value : (value ? [value] : []);
    const newValues = currentArray.includes(operation) 
      ? currentArray.filter(v => v !== operation)
      : [...currentArray, operation];
    onChange(newValues);
  };

  const getDisplayValue = () => {
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selecionado(s)` : "Todas";
    }
    return value || "Todas";
  };

  const hasValue = (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm flex items-center gap-1">
          <Building2 className="h-4 w-4" />
          Operação
        </Label>
        {hasValue && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {isMultiple ? (
        <Select value="" onValueChange={handleMultipleSelectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={getDisplayValue()} />
          </SelectTrigger>
          <SelectContent>
            {availableOperations.map((op) => {
              const isSelected = Array.isArray(value) && value.includes(op);
              return (
                <div key={op} className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer">
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => handleMultipleSelectChange(op)}
                  />
                  <span className="text-sm">{op}</span>
                </div>
              );
            })}
          </SelectContent>
        </Select>
      ) : (
        <Select value={value as string || ''} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {availableOperations.map((op) => (
              <SelectItem key={op} value={op}>{op}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default OperationFilter;
