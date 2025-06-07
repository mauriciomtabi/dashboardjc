
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseExcelDate, formatDateForDisplay } from '@/utils/dateUtils';
import FilterBar from './FilterBar';

interface EstoqueDataTableProps {
  filteredData: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EstoqueDataTable = ({ filteredData, isOpen, onOpenChange }: EstoqueDataTableProps) => {
  const [tableFilters, setTableFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    placa: [] as string[],
    operacao: [] as string[],
    estoque: [] as string[],
  });

  const formatDate = (dateValue: any) => {
    const parsedDate = parseExcelDate(dateValue);
    return parsedDate ? formatDateForDisplay(parsedDate) : '';
  };

  const formatNumber = (value: any) => {
    if (!value || isNaN(value)) return '';
    return Number(value).toLocaleString('pt-BR');
  };

  const getSituacaoName = (code: string) => {
    switch (code) {
      case 'N': return 'Novo';
      case 'U': return 'Usado';
      case 'R': return 'Recapado';
      default: return code;
    }
  };

  const handleTableFilterChange = (key: string, value: string | string[]) => {
    setTableFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply additional filters to the already filtered data
  const tableFilteredData = filteredData.filter(item => {
    const parsedDate = parseExcelDate(item.R);
    if (!parsedDate) return false;
    
    const mes = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const ano = parsedDate.getFullYear().toString();
    
    if (Array.isArray(tableFilters.mes) && tableFilters.mes.length > 0 && !tableFilters.mes.includes(mes)) return false;
    if (Array.isArray(tableFilters.ano) && tableFilters.ano.length > 0 && !tableFilters.ano.includes(ano)) return false;
    
    if (Array.isArray(tableFilters.placa) && tableFilters.placa.length > 0) {
      const hasMatchingPlaca = tableFilters.placa.some(placa => 
        item.AP?.toLowerCase().includes(placa.toLowerCase())
      );
      if (!hasMatchingPlaca) return false;
    }
    
    if (Array.isArray(tableFilters.operacao) && tableFilters.operacao.length > 0 && !tableFilters.operacao.includes(item.AB)) return false;
    if (Array.isArray(tableFilters.estoque) && tableFilters.estoque.length > 0 && !tableFilters.estoque.includes(item.N)) return false;
    
    return true;
  });

  // Get available filters for the table
  const availableTableFilters = {
    meses: [...new Set(filteredData.map(item => {
      const parsedDate = parseExcelDate(item.R);
      if (!parsedDate) return null;
      return (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    }).filter(Boolean))].sort(),
    anos: [...new Set(filteredData.map(item => {
      const parsedDate = parseExcelDate(item.R);
      if (!parsedDate) return null;
      return parsedDate.getFullYear().toString();
    }).filter(Boolean))].sort(),
    operacoes: [...new Set(filteredData.map(item => item.AB))].filter(Boolean).sort(),
    estoques: [...new Set(filteredData.map(item => item.N))].filter(Boolean).sort(),
    placas: [...new Set(filteredData.map(item => item.AP))].filter(Boolean).sort(),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">Ver Tabela Completa</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Tabela Completa - Estoque</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <FilterBar
            filters={tableFilters}
            onFilterChange={handleTableFilterChange}
            availableFilters={availableTableFilters}
            showStockFilter={true}
          />
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/10">
                <TableHead className="font-bold text-primary whitespace-nowrap">Cód Filial</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Cód Pneu</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 1</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 2</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 3</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 4</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 5</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Situação</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Estoque</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Cód Veículo</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Nome Modelo</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Data</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Nome Filial</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Km</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Nome Dimensão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableFilteredData.map((item, index) => (
                <TableRow 
                  key={index}
                  className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                >
                  <TableCell className="whitespace-nowrap">{item.B}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.D}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.G}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.H}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.I}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.K}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.L}</TableCell>
                  <TableCell className="whitespace-nowrap">{getSituacaoName(item.M)}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.N}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.P}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.Q}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(item.R)}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.AB}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatNumber(item.AK)}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.AR}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstoqueDataTable;
