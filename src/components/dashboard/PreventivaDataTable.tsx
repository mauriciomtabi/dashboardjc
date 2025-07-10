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
          <DialogTitle>Dados Completos - Preventivas</DialogTitle>
          <DialogDescription>
            Tabela com todos os dados filtrados de preventivas ({filteredData.length} registros)
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preventiva</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Última Manutenção</TableHead>
                <TableHead>Vencida (Km)</TableHead>
                <TableHead>Vencida (Dias)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.D || '-'}</TableCell>
                  <TableCell>{item.F || '-'}</TableCell>
                  <TableCell>{item.K || '-'}</TableCell>
                  <TableCell>{formatDate(item.L)}</TableCell>
                  <TableCell>{item.U || '-'}</TableCell>
                  <TableCell>{item.V || '-'}</TableCell>
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