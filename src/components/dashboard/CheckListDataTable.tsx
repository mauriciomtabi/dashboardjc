
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckListData } from '@/contexts/DataContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CheckListDataTableProps {
  filteredData: CheckListData[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckListDataTable = ({ filteredData, isOpen, onOpenChange }: CheckListDataTableProps) => {
  if (!isOpen) {
    return (
      <Button
        onClick={() => onOpenChange(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ChevronDown className="h-4 w-4" />
        Ver Tabela Completa ({filteredData.length} registros)
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dados Completos do Check List</CardTitle>
        <Button
          onClick={() => onOpenChange(false)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ChevronUp className="h-4 w-4" />
          Recolher
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto max-h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filial</TableHead>
                <TableHead>Check List</TableHead>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>bl_Confrm</TableHead>
                <TableHead>Lista</TableHead>
                <TableHead>Placa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.D}</TableCell>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckListDataTable;
