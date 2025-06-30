
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckListData } from '@/contexts/DataContext';
import { Eye } from 'lucide-react';

interface CheckListDataTableProps {
  filteredData: CheckListData[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckListDataTable = ({ filteredData, isOpen, onOpenChange }: CheckListDataTableProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-primary/20 text-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Eye className="h-4 w-4" />
          Ver Tabela Completa ({filteredData.length} registros)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] bg-gradient-to-br from-background via-background to-muted/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Dados Completos do Check List
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] w-full rounded-md border bg-gradient-to-br from-muted/5 to-muted/10">
          <Table>
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm">
              <TableRow className="border-b-2 border-primary/20">
                <TableHead className="font-semibold text-primary">Filial</TableHead>
                <TableHead className="font-semibold text-primary">Check List</TableHead>
                <TableHead className="font-semibold text-primary">Data e Hora</TableHead>
                <TableHead className="font-semibold text-primary">Item</TableHead>
                <TableHead className="font-semibold text-primary">bl_Confrm</TableHead>
                <TableHead className="font-semibold text-primary">Lista</TableHead>
                <TableHead className="font-semibold text-primary">Placa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow 
                  key={index} 
                  className="hover:bg-muted/50 transition-colors duration-200 border-b border-muted/30"
                >
                  <TableCell className="font-medium">{item.D}</TableCell>
                  <TableCell>{item.G}</TableCell>
                  <TableCell>{item.N}</TableCell>
                  <TableCell>{item.T}</TableCell>
                  <TableCell>{item.V}</TableCell>
                  <TableCell>{item.Y}</TableCell>
                  <TableCell>{item.AG}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CheckListDataTable;
