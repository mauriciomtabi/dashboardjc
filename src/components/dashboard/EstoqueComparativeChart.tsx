
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { parseExcelDate } from '@/utils/dateUtils';

const COLORS = ['#3b82f6', '#94a3b8'];

interface EstoqueComparativeChartProps {
  estoqueData: any[];
  drillDownMonth: string | null;
  onDrillDown: (month: string | null) => void;
}

const EstoqueComparativeChart = ({ estoqueData, drillDownMonth, onDrillDown }: EstoqueComparativeChartProps) => {
  const dadosComparativos = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anoAnterior = anoAtual - 1;
    
    if (drillDownMonth) {
      const [ano, mes] = drillDownMonth.split('-');
      const daysInMonth = new Date(parseInt(ano), parseInt(mes), 0).getDate();
      
      return Array.from({length: daysInMonth}, (_, i) => {
        const dia = (i + 1).toString().padStart(2, '0');
        
        const dadosAnoAtual = estoqueData.filter(item => {
          const parsedDate = parseExcelDate(item.R);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAtual && 
                 (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 parsedDate.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        const dadosAnoAnterior = estoqueData.filter(item => {
          const parsedDate = parseExcelDate(item.R);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAnterior && 
                 (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 parsedDate.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        return {
          periodo: `${dia}/${mes}`,
          [`${anoAtual}`]: dadosAnoAtual,
          [`${anoAnterior}`]: dadosAnoAnterior
        };
      });
    } else {
      const meses = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
      
      return meses.map(mes => {
        const dadosAnoAtual = estoqueData.filter(item => {
          const parsedDate = parseExcelDate(item.R);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAtual && (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        const dadosAnoAnterior = estoqueData.filter(item => {
          const parsedDate = parseExcelDate(item.R);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAnterior && (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        return {
          periodo: `${mes}/${anoAtual}`,
          [`${anoAtual}`]: dadosAnoAtual,
          [`${anoAnterior}`]: dadosAnoAnterior
        };
      });
    }
  }, [estoqueData, drillDownMonth]);

  const anoAtual = new Date().getFullYear();
  const anoAnterior = anoAtual - 1;

  return (
    <Card className="col-span-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Comparativo Anual - Estoque
          {drillDownMonth && (
            <Button variant="outline" size="sm" onClick={() => onDrillDown(null)}>
              Voltar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={dadosComparativos}
            onClick={(data) => {
              if (!drillDownMonth && data?.activeLabel) {
                const [mes] = data.activeLabel.split('/');
                onDrillDown(`${anoAtual}-${mes}`);
              }
            }}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey={anoAtual.toString()} 
              fill={COLORS[0]} 
              name={`Ano ${anoAtual}`}
            />
            <Bar 
              dataKey={anoAnterior.toString()} 
              fill={COLORS[1]} 
              name={`Ano ${anoAnterior}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EstoqueComparativeChart;
