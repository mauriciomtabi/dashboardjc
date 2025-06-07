
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { parseExcelDate, formatDateForDisplay } from '@/utils/dateUtils';

interface LaudoDataTableProps {
  filteredData: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LaudoDataTable = ({ filteredData, isOpen, onOpenChange }: LaudoDataTableProps) => {
  const formatDate = (dateValue: any) => {
    const parsedDate = parseExcelDate(dateValue);
    return parsedDate ? formatDateForDisplay(parsedDate) : '';
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
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableHead className="font-bold text-primary whitespace-nowrap">Operação</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Tipo de Evento</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Observação</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">DOT</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Vida</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Medida</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Marca Desenho</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Sulco</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Pressão</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Posição</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Data do Evento</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Número de Série</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Motivo do Laudo</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Código do Defeito</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Descrição Técnica</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Marca</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Código Veículo</TableHead>
                  <TableHead className="font-bold text-primary whitespace-nowrap">Placa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                  >
                    <TableCell className="whitespace-nowrap">{item.D}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.E}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.F}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.G}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.J}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.K}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.L}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.M}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.N}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.O}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(item.P)}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.Q}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.S}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.U}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.W}</TableCell>
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
