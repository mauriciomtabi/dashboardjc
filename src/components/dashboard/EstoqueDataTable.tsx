
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
                <TableHead className="font-bold text-primary whitespace-nowrap">cd_veiculo</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">nm_modelo</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Vida</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">cd_posicao</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">cd_destino</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">cd_evento</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">bl_saida</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">bl_recauch</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">bl_compra</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">bl_inst</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Estoque</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">cd_posicao</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">cd_destino</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">dh_evento</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">bl_filial</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">Placa</TableHead>
                <TableHead className="font-bold text-primary whitespace-nowrap">bl_trent</TableHead>
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
                  <TableCell className="whitespace-nowrap">{item.F}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.G}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.H}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.I}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.J}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.K}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.L}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.M}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.N}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.P}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.Q}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(item.R)}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.AB}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.AK}</TableCell>
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
