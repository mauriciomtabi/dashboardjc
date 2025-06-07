
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

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
          const date = new Date(item.R);
          return date.getFullYear() === anoAtual && 
                 (date.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 date.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        const dadosAnoAnterior = estoqueData.filter(item => {
          const date = new Date(item.R);
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
        const dadosAnoAtual = estoqueData.filter(item => {
          const date = new Date(item.R);
          return date.getFullYear() === anoAtual && (date.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        const dadosAnoAnterior = estoqueData.filter(item => {
          const date = new Date(item.R);
          return date.getFullYear() === anoAnterior && (date.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        return {
          mes: `${mes}/${anoAtual}`,
          anoAtual: dadosAnoAtual,
          anoAnterior: dadosAnoAnterior
        };
      });
    }
  }, [estoqueData, drillDownMonth]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Comparativo Anual
          {drillDownMonth && (
            <Button variant="outline" size="sm" onClick={() => onDrillDown(null)}>
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
                onDrillDown(`${new Date().getFullYear()}-${mes}`);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="anoAtual" fill={COLORS[0]} name="Ano Atual" />
            <Bar dataKey="anoAnterior" fill={COLORS[0]} fillOpacity={0.5} name="Ano Anterior" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EstoqueComparativeChart;
