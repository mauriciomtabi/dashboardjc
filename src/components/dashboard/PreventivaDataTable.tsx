import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PreventivaData } from '@/contexts/DataContext';
import { parseExcelDate } from '@/utils/dateUtils';

interface PreventivaDataTableProps {
  filteredData: PreventivaData[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreventivaDataTable: React.FC<PreventivaDataTableProps> = ({ 
  filteredData, 
  isOpen, 
  onOpenChange 
}) => {
  const formatDate = (dateValue: string | number) => {
    const parsedDate = parseExcelDate(dateValue);
    return parsedDate ? parsedDate.toLocaleDateString('pt-BR') : 'Data inválida';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Ver Tabela Completa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Tabela Completa - Preventivas</DialogTitle>
          <DialogDescription>
            Tabela com todos os dados filtrados de preventivas ({filteredData.length} registros)
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh] border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-foreground">Preventiva</TableHead>
                <TableHead className="font-semibold text-foreground">Operação</TableHead>
                <TableHead className="font-semibold text-foreground">Placa</TableHead>
                <TableHead className="font-semibold text-foreground">Última Manutenção</TableHead>
                <TableHead className="font-semibold text-foreground">Vencida (Km)</TableHead>
                <TableHead className="font-semibold text-foreground">Vencida (Dias)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{item.preventiva || '-'}</TableCell>
                  <TableCell>{item.operacao || '-'}</TableCell>
                  <TableCell>{item.placa || '-'}</TableCell>
                  <TableCell>{formatDate(item.ultimaManutencao)}</TableCell>
                  <TableCell>{item.vencidaKm || '-'}</TableCell>
                  <TableCell>{item.vencidaDias || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreventivaDataTable;