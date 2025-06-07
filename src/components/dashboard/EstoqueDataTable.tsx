
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseExcelDate, formatDateForDisplay } from '@/utils/dateUtils';

interface EstoqueDataTableProps {
  filteredData: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EstoqueDataTable = ({ filteredData, isOpen, onOpenChange }: EstoqueDataTableProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">Ver Tabela Completa</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Tabela Completa - Estoque</DialogTitle>
        </DialogHeader>
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
              {filteredData.map((item, index) => (
                <TableRow 
                  key={index}
                  className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                >
                  <TableCell className="whitespace-nowrap">{item.B}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.D}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.G}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.H}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.I}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.J}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.K}</TableCell>
                  <TableCell className="whitespace-nowrap">{getSituacaoName(item.M)}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.N}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.P}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.D}</TableCell>
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
