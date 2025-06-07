
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { parseExcelDate, formatDateForDisplay } from '@/utils/dateUtils';
import FilterBar from './FilterBar';

interface LaudoDataTableProps {
  filteredData: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LaudoDataTable = ({ filteredData, isOpen, onOpenChange }: LaudoDataTableProps) => {
  const [tableFilters, setTableFilters] = useState({
    mes: [] as string[],
    ano: [] as string[],
    placa: [] as string[],
    operacao: [] as string[],
  });

  const formatDate = (dateValue: any) => {
    const parsedDate = parseExcelDate(dateValue);
    return parsedDate ? formatDateForDisplay(parsedDate) : '';
  };

  const formatNumber = (value: any) => {
    if (!value || isNaN(value)) return '';
    return Number(value).toLocaleString('pt-BR');
  };

  const handleTableFilterChange = (key: string, value: string | string[]) => {
    setTableFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply additional filters to the already filtered data
  const tableFilteredData = filteredData.filter(item => {
    const parsedDate = parseExcelDate(item.P);
    if (!parsedDate) return false;
    
    const mes = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const ano = parsedDate.getFullYear().toString();
    
    if (Array.isArray(tableFilters.mes) && tableFilters.mes.length > 0 && !tableFilters.mes.includes(mes)) return false;
    if (Array.isArray(tableFilters.ano) && tableFilters.ano.length > 0 && !tableFilters.ano.includes(ano)) return false;
    
    if (Array.isArray(tableFilters.placa) && tableFilters.placa.length > 0) {
      const hasMatchingPlaca = tableFilters.placa.some(placa => 
        item.AB?.toLowerCase().includes(placa.toLowerCase())
      );
      if (!hasMatchingPlaca) return false;
    }
    
    if (Array.isArray(tableFilters.operacao) && tableFilters.operacao.length > 0 && !tableFilters.operacao.includes(item.D)) return false;
    
    return true;
  });

  // Get available filters for the table
  const availableTableFilters = {
    meses: [...new Set(filteredData.map(item => {
      const parsedDate = parseExcelDate(item.P);
      if (!parsedDate) return null;
      return (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    }).filter(Boolean))].sort(),
    anos: [...new Set(filteredData.map(item => {
      const parsedDate = parseExcelDate(item.P);
      if (!parsedDate) return null;
      return parsedDate.getFullYear().toString();
    }).filter(Boolean))].sort(),
    operacoes: [...new Set(filteredData.map(item => item.D))].filter(Boolean).sort(),
    placas: [...new Set(filteredData.map(item => item.AB))].filter(Boolean).sort(),
  };

  return (
    <div className="flex justify-center">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="shadow-lg">Ver Tabela Completa</Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Tabela Completa - Laudos</DialogTitle>
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
                  <TableHead className="font-bold text-primary whitespace-nowrap">Operação</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Cód Pneu</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Nº Série</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">DOT</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 1</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 2</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 3</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 4</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Sulco 5</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Km</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Motivo do Laudo</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Modelo Pneu</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Nome Dimensão</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Marca</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Cód Veículo</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Placa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableFilteredData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                  >
                    <TableCell className="whitespace-nowrap">{item.D}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.E}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.Q}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.G}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.M}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.N}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.O}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.P}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.U}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatNumber(item.W)}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.S}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.K}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.L}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.Y}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.AA}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.AB}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaudoDataTable;
