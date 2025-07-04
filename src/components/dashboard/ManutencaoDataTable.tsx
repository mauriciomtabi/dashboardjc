
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseExcelDate, formatDateForDisplay } from '@/utils/dateUtils';
import FilterBar from './FilterBar';
import { ManutencaoData } from '@/contexts/DataContext';
import { Eye } from 'lucide-react';

interface ManutencaoDataTableProps {
  filteredData: ManutencaoData[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ManutencaoDataTable = ({ filteredData, isOpen, onOpenChange }: ManutencaoDataTableProps) => {
  const [tableFilters, setTableFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    placa: [] as string[],
    operacao: [] as string[],
    tipoManutencao: [] as string[],
  });

  const formatDate = (dateValue: any) => {
    const parsedDate = parseExcelDate(dateValue);
    return parsedDate ? formatDateForDisplay(parsedDate) : '';
  };

  const formatCurrency = (value: any) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getTipoManutencaoName = (code: string) => {
    switch (code) {
      case 'C': return 'Corretiva';
      case 'P': return 'Preventiva';
      default: return code;
    }
  };

  const handleTableFilterChange = (key: string, value: string | string[]) => {
    setTableFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply additional filters to the already filtered data
  const tableFilteredData = filteredData.filter(item => {
    const parsedDate = parseExcelDate(item.W);
    if (!parsedDate) return false;
    
    const mes = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const ano = parsedDate.getFullYear().toString();
    
    if (Array.isArray(tableFilters.mes) && tableFilters.mes.length > 0 && !tableFilters.mes.includes(mes)) return false;
    if (Array.isArray(tableFilters.ano) && tableFilters.ano.length > 0 && !tableFilters.ano.includes(ano)) return false;
    
    if (Array.isArray(tableFilters.placa) && tableFilters.placa.length > 0) {
      const hasMatchingPlaca = tableFilters.placa.some(placa => 
        item.B?.toLowerCase().includes(placa.toLowerCase())
      );
      if (!hasMatchingPlaca) return false;
    }
    
    if (Array.isArray(tableFilters.operacao) && tableFilters.operacao.length > 0 && !tableFilters.operacao.includes(item.AI)) return false;
    if (Array.isArray(tableFilters.tipoManutencao) && tableFilters.tipoManutencao.length > 0 && !tableFilters.tipoManutencao.includes(item.Z)) return false;
    
    return true;
  });

  // Get available filters for the table
  const availableTableFilters = {
    meses: [...new Set(filteredData.map(item => {
      const parsedDate = parseExcelDate(item.W);
      if (!parsedDate) return null;
      return (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    }).filter(Boolean))].sort(),
    anos: [...new Set(filteredData.map(item => {
      const parsedDate = parseExcelDate(item.W);
      if (!parsedDate) return null;
      return parsedDate.getFullYear().toString();
    }).filter(Boolean))].sort(),
    operacoes: [...new Set(filteredData.map(item => item.AI))].filter(Boolean).sort(),
    placas: [...new Set(filteredData.map(item => item.B))].filter(Boolean).sort(),
    tiposManutencao: [...new Set(filteredData.map(item => item.Z))].filter(Boolean).sort(),
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
          <DialogTitle>Tabela Completa - Manutenção</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <FilterBar
            filters={{
              mes: tableFilters.mes,
              ano: tableFilters.ano,
              placa: tableFilters.placa,
              operacao: tableFilters.operacao,
              estoque: tableFilters.tipoManutencao,
            }}
            onFilterChange={(key, value) => {
              if (key === 'estoque') {
                handleTableFilterChange('tipoManutencao', value);
              } else {
                handleTableFilterChange(key, value);
              }
            }}
            availableFilters={{
              meses: availableTableFilters.meses,
              anos: availableTableFilters.anos,
              operacoes: availableTableFilters.operacoes,
              placas: availableTableFilters.placas,
              estoques: availableTableFilters.tiposManutencao,
            }}
            showStockFilter={true}
          />
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-bold text-primary whitespace-nowrap">Placa</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Peça</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Valor</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Data</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Tipo</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Filial</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Fornecedor</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Serviço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableFilteredData.map((item, index) => (
                <TableRow 
                  key={index}
                  className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                >
                  <TableCell className="whitespace-nowrap">{item.B}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.L}</TableCell>
                  <TableCell className="whitespace-nowrap font-semibold">{formatCurrency(item.Q)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(item.W)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.Z === 'C' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {getTipoManutencaoName(item.Z)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{item.AI}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.AJ}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.AK}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManutencaoDataTable;
