
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { parseExcelDate } from '@/utils/dateUtils';
import { TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
import { ManutencaoData } from '@/contexts/DataContext';

interface ManutencaoComparativeChartProps {
  manutencaoData: ManutencaoData[];
  filteredData: ManutencaoData[];
  drillDownMonth: string | null;
  onDrillDown: (month: string | null) => void;
}

const ManutencaoComparativeChart = ({ manutencaoData, filteredData, drillDownMonth, onDrillDown }: ManutencaoComparativeChartProps) => {
  const dadosComparativos = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const dataToUse = filteredData;
    
    if (drillDownMonth) {
      const [ano, mes] = drillDownMonth.split('-');
      const daysInMonth = new Date(parseInt(ano), parseInt(mes), 0).getDate();
      
      return Array.from({length: daysInMonth}, (_, i) => {
        const dia = (i + 1).toString().padStart(2, '0');
        
        const dadosDia = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.W);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAtual && 
                 (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 parsedDate.getDate().toString().padStart(2, '0') === dia;
        });

        const corretiva = dadosDia.filter(item => item.Z === 'C').reduce((acc, item) => acc + (parseFloat(item.Q) || 0), 0);
        const preventiva = dadosDia.filter(item => item.Z === 'P').reduce((acc, item) => acc + (parseFloat(item.Q) || 0), 0);
        
        return {
          periodo: `${dia}/${mes}`,
          Corretiva: corretiva,
          Preventiva: preventiva,
          total: corretiva + preventiva
        };
      });
    } else {
      const meses = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
      
      return meses.map(mes => {
        const dadosMes = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.W);
          if (!parsedDate) return false;
          const itemYear = parsedDate.getFullYear();
          const itemMonth = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
          return itemYear === anoAtual && itemMonth === mes;
        });

        const corretiva = dadosMes.filter(item => item.Z === 'C').reduce((acc, item) => acc + (parseFloat(item.Q) || 0), 0);
        const preventiva = dadosMes.filter(item => item.Z === 'P').reduce((acc, item) => acc + (parseFloat(item.Q) || 0), 0);
        
        return {
          periodo: `${mes}/${anoAtual}`,
          Corretiva: corretiva,
          Preventiva: preventiva,
          total: corretiva + preventiva
        };
      });
    }
  }, [manutencaoData, filteredData, drillDownMonth]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-5">
          <p className="font-semibold text-foreground text-lg border-b border-primary/20 pb-2">
            {drillDownMonth ? 'Custo Diário' : 'Custo Mensal'}
          </p>
          <div className="space-y-2 mt-3">
            <div className="text-sm text-muted-foreground font-medium">Período: {label}</div>
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-medium text-foreground">{entry.dataKey}</span>
                </div>
                <span className="font-bold text-lg" style={{ color: entry.color }}>
                  {entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-foreground">Total:</span>
                <span className="font-bold text-lg text-primary">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
            <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              <BarChart3 className="h-6 w-6 text-primary relative z-10" />
            </div>
            <span className="text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Custo Mensal - Manutenção
            </span>
            <TrendingUp className="h-5 w-5 text-primary/60" />
          </div>
          {drillDownMonth && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDrillDown(null)}
              className="bg-gradient-to-r from-background to-muted/50 border-primary/20 hover:border-primary/40"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={dadosComparativos}
            onClick={(data) => {
              if (!drillDownMonth && data?.activeLabel) {
                const [mes] = data.activeLabel.split('/');
                onDrillDown(`${new Date().getFullYear()}-${mes}`);
              }
            }}
            margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
            className="cursor-pointer"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="periodo" stroke="rgba(148, 163, 184, 0.8)" fontSize={12} />
            <YAxis 
              stroke="rgba(148, 163, 184, 0.8)" 
              fontSize={12}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '600', paddingTop: '20px' }} />
            <Bar dataKey="Corretiva" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Preventiva" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ManutencaoComparativeChart;
