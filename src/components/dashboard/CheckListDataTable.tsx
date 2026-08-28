
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckListData } from '@/contexts/DataContext';
import { Eye } from 'lucide-react';
import FilterBar from './FilterBar';
import { format, isValid } from 'date-fns';

interface CheckListDataTableProps {
  filteredData: CheckListData[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckListDataTable = ({ filteredData, isOpen, onOpenChange }: CheckListDataTableProps) => {
  const [tableFilters, setTableFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    placa: [] as string[],
    operacao: [] as string[],
  });

  const formatDate = (dateValue: any) => {
    let date: Date | null = null;
    
    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      // Formato DD/MM/YYYY
      const [day, month, year] = dateValue.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (typeof dateValue === 'number') {
      // Excel serial date
      date = new Date((dateValue - 25569) * 86400 * 1000);
    } else {
      // Tentar parseISO
      date = new Date(dateValue);
    }
    
    return date && isValid(date) ? format(date, 'dd/MM/yyyy') : '';
  };

  const handleTableFilterChange = (key: string, value: string | string[]) => {
    setTableFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply additional filters to the already filtered data
  const tableFilteredData = filteredData.filter(item => {
    let date: Date | null = null;
    
    if (typeof item.N === 'string' && item.N.includes('/')) {
      const [day, month, year] = item.N.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (typeof item.N === 'number') {
      date = new Date((item.N - 25569) * 86400 * 1000);
    } else {
      date = new Date(item.N);
    }
    
    if (!date || !isValid(date)) return false;
    
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear().toString();
    
    if (Array.isArray(tableFilters.mes) && tableFilters.mes.length > 0 && !tableFilters.mes.includes(mes)) return false;
    if (Array.isArray(tableFilters.ano) && tableFilters.ano.length > 0 && !tableFilters.ano.includes(ano)) return false;
    
    if (Array.isArray(tableFilters.placa) && tableFilters.placa.length > 0) {
      const hasMatchingPlaca = tableFilters.placa.some(placa => 
        item.AG?.toLowerCase().includes(placa.toLowerCase())
      );
      if (!hasMatchingPlaca) return false;
    }
    
    if (Array.isArray(tableFilters.operacao) && tableFilters.operacao.length > 0 && !tableFilters.operacao.includes(item.D)) return false;
    
    return true;
  });

  // Get available filters for the table
  const availableTableFilters = {
    meses: [...new Set(filteredData.map(item => {
      let date: Date | null = null;
      
      if (typeof item.N === 'string' && item.N.includes('/')) {
        const [day, month, year] = item.N.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else if (typeof item.N === 'number') {
        date = new Date((item.N - 25569) * 86400 * 1000);
      } else {
        date = new Date(item.N);
      }
      
      if (!date || !isValid(date)) return null;
      return (date.getMonth() + 1).toString().padStart(2, '0');
    }).filter(Boolean))].sort(),
    anos: [...new Set(filteredData.map(item => {
      let date: Date | null = null;
      
      if (typeof item.N === 'string' && item.N.includes('/')) {
        const [day, month, year] = item.N.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else if (typeof item.N === 'number') {
        date = new Date((item.N - 25569) * 86400 * 1000);
      } else {
        date = new Date(item.N);
      }
      
      if (!date || !isValid(date)) return null;
      return date.getFullYear().toString();
    }).filter(Boolean))].sort(),
    operacoes: [...new Set(filteredData.map(item => item.D))].filter(Boolean).sort(),
    placas: [...new Set(filteredData.map(item => item.AG))].filter(Boolean).sort(),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-foreground hover:bg-muted transition-all duration-300"
        >
          <Eye className="h-4 w-4" />
          Ver Tabela Completa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Tabela Completa - Check List</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <FilterBar
            filters={tableFilters}
            onFilterChange={handleTableFilterChange}
            availableFilters={availableTableFilters}
            showStockFilter={false}
          />
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-bold text-primary whitespace-nowrap">Filial</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Check List</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Data e Hora</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Item</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">bl_Confrm</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Lista</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Placa</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Colaborador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableFilteredData.map((item, index) => (
                <TableRow 
                  key={index}
                  className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                >
                  <TableCell className="whitespace-nowrap">{item.D}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.G}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(item.N)}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.T}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.V}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.Y}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.AG}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.colaborador || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckListDataTable;
