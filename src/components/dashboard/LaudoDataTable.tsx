
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface LaudoDataTableProps {
  filteredData: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LaudoDataTable = ({ filteredData, isOpen, onOpenChange }: LaudoDataTableProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex justify-center">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg">Ver Tabela Completa</Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Tabela Completa - Laudos</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operação</TableHead>
                  <TableHead>Coluna E</TableHead>
                  <TableHead>Coluna F</TableHead>
                  <TableHead>DOT</TableHead>
                  <TableHead>Vida</TableHead>
                  <TableHead>Coluna K</TableHead>
                  <TableHead>Coluna L</TableHead>
                  <TableHead>Coluna M</TableHead>
                  <TableHead>Coluna N</TableHead>
                  <TableHead>Coluna O</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Coluna Q</TableHead>
                  <TableHead>Motivo do Laudo</TableHead>
                  <TableHead>Coluna U</TableHead>
                  <TableHead>Coluna W</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Código Veículo</TableHead>
                  <TableHead>Placa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.D}</TableCell>
                    <TableCell>{item.E}</TableCell>
                    <TableCell>{item.F}</TableCell>
                    <TableCell>{item.G}</TableCell>
                    <TableCell>{item.J}</TableCell>
                    <TableCell>{item.K}</TableCell>
                    <TableCell>{item.L}</TableCell>
                    <TableCell>{item.M}</TableCell>
                    <TableCell>{item.N}</TableCell>
                    <TableCell>{item.O}</TableCell>
                    <TableCell>{formatDate(item.P)}</TableCell>
                    <TableCell>{item.Q}</TableCell>
                    <TableCell>{item.S}</TableCell>
                    <TableCell>{item.U}</TableCell>
                    <TableCell>{item.W}</TableCell>
                    <TableCell>{item.Y}</TableCell>
                    <TableCell>{item.AA}</TableCell>
                    <TableCell>{item.AB}</TableCell>
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
