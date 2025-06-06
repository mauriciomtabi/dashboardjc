
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface ComparativeChartProps {
  laudoData: any[];
  drillDownMonth: string | null;
  setDrillDownMonth: (month: string | null) => void;
}

const ComparativeChart = ({ laudoData, drillDownMonth, setDrillDownMonth }: ComparativeChartProps) => {
  const dadosComparativos = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anoAnterior = anoAtual - 1;
    
    if (drillDownMonth) {
      const [ano, mes] = drillDownMonth.split('-');
      const daysInMonth = new Date(parseInt(ano), parseInt(mes), 0).getDate();
      
      return Array.from({length: daysInMonth}, (_, i) => {
        const dia = (i + 1).toString().padStart(2, '0');
        
        const dadosAnoAtual = laudoData.filter(item => {
          const date = new Date(item.P);
          return date.getFullYear() === anoAtual && 
                 (date.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 date.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        const dadosAnoAnterior = laudoData.filter(item => {
          const date = new Date(item.P);
          return date.getFullYear() === anoAnterior && 
                 (date.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 date.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        return {
          mes: `${dia}/${mes}`,
          anoAtual: dadosAnoAtual,
          anoAnterior: dadosAnoAnterior
        };
      });
    } else {
      const meses = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
      
      return meses.map(mes => {
        const dadosAnoAtual = laudoData.filter(item => {
          const date = new Date(item.P);
          return date.getFullYear() === anoAtual && (date.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        const dadosAnoAnterior = laudoData.filter(item => {
          const date = new Date(item.P);
          return date.getFullYear() === anoAnterior && (date.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        return {
          mes: `${mes}/${anoAtual}`,
          anoAtual: dadosAnoAtual,
          anoAnterior: dadosAnoAnterior
        };
      });
    }
  }, [laudoData, drillDownMonth]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Comparativo Anual
          {drillDownMonth && (
            <Button variant="outline" size="sm" onClick={() => setDrillDownMonth(null)}>
              Voltar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={dadosComparativos}
            onClick={(data) => {
              if (!drillDownMonth && data?.activeLabel) {
                const [mes] = data.activeLabel.split('/');
                setDrillDownMonth(`${new Date().getFullYear()}-${mes}`);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="anoAtual" fill={COLORS[0]} name="Ano Atual">
              {dadosComparativos.map((entry, index) => (
                <Cell key={`cell-atual-${index}`} />
              ))}
            </Bar>
            <Bar dataKey="anoAnterior" fill={COLORS[0]} fillOpacity={0.5} name="Ano Anterior">
              {dadosComparativos.map((entry, index) => (
                <Cell key={`cell-anterior-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ComparativeChart;
