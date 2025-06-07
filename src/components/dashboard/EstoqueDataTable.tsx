
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface EstoqueDataTableProps {
  filteredData: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EstoqueDataTable = ({ filteredData, isOpen, onOpenChange }: EstoqueDataTableProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
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
              <TableRow>
                <TableHead>Coluna B</TableHead>
                <TableHead>Coluna D</TableHead>
                <TableHead>Vida</TableHead>
                <TableHead>Coluna G</TableHead>
                <TableHead>Coluna H</TableHead>
                <TableHead>Coluna I</TableHead>
                <TableHead>Coluna J</TableHead>
                <TableHead>Coluna K</TableHead>
                <TableHead>Coluna L</TableHead>
                <TableHead>Coluna M</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Coluna P</TableHead>
                <TableHead>Coluna Q</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Coluna AK</TableHead>
                <TableHead>Coluna AR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.B}</TableCell>
                  <TableCell>{item.D}</TableCell>
                  <TableCell>{item.F}</TableCell>
                  <TableCell>{item.G}</TableCell>
                  <TableCell>{item.H}</TableCell>
                  <TableCell>{item.I}</TableCell>
                  <TableCell>{item.J}</TableCell>
                  <TableCell>{item.K}</TableCell>
                  <TableCell>{item.L}</TableCell>
                  <TableCell>{item.M}</TableCell>
                  <TableCell>{item.N}</TableCell>
                  <TableCell>{item.P}</TableCell>
                  <TableCell>{item.Q}</TableCell>
                  <TableCell>{formatDate(item.R)}</TableCell>
                  <TableCell>{item.AB}</TableCell>
                  <TableCell>{item.AK}</TableCell>
                  <TableCell>{item.AR}</TableCell>
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
