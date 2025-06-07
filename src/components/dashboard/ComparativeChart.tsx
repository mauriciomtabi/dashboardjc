
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { parseExcelDate } from '@/utils/dateUtils';
import { TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#94a3b8'];

interface ComparativeChartProps {
  laudoData: any[];
  filteredData: any[];
  drillDownMonth: string | null;
  setDrillDownMonth: (month: string | null) => void;
}

const ComparativeChart = ({ laudoData, filteredData, drillDownMonth, setDrillDownMonth }: ComparativeChartProps) => {
  const dadosComparativos = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anoAnterior = anoAtual - 1;
    
    // Use filteredData instead of laudoData to respect filters
    const dataToUse = filteredData;
    
    if (drillDownMonth) {
      const [ano, mes] = drillDownMonth.split('-');
      const daysInMonth = new Date(parseInt(ano), parseInt(mes), 0).getDate();
      
      return Array.from({length: daysInMonth}, (_, i) => {
        const dia = (i + 1).toString().padStart(2, '0');
        
        const dadosAnoAtual = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.P);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAtual && 
                 (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 parsedDate.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        const dadosAnoAnterior = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.P);
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
        const dadosAnoAtual = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.P);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAtual && (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        const dadosAnoAnterior = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.P);
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
  }, [filteredData, drillDownMonth]);

  const anoAtual = new Date().getFullYear();
  const anoAnterior = anoAtual - 1;

  return (
    <Card className="col-span-full shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      {/* Efeito de brilho premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
            <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              <TrendingUp className="h-5 w-5 text-primary relative z-10" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Comparativo Anual - Laudos
            </span>
          </div>
          {drillDownMonth && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDrillDownMonth(null)}
              className="bg-gradient-to-r from-background to-muted/50 border-primary/20 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Voltar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="relative">
          {/* Fundo do gráfico com gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={dadosComparativos}
              onClick={(data) => {
                if (!drillDownMonth && data?.activeLabel) {
                  const [mes] = data.activeLabel.split('/');
                  setDrillDownMonth(`${anoAtual}-${mes}`);
                }
              }}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth={1}
              />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              />
              <Legend />
              <Bar 
                dataKey={anoAtual.toString()} 
                fill="url(#comparativeGradient1)" 
                name={`Ano ${anoAtual}`}
                radius={[4, 4, 0, 0]}
                className="drop-shadow-lg"
              >
                <LabelList dataKey={anoAtual.toString()} position="top" className="fill-primary font-semibold" />
              </Bar>
              <Bar 
                dataKey={anoAnterior.toString()} 
                fill="url(#comparativeGradient2)" 
                name={`Ano ${anoAnterior}`}
                radius={[4, 4, 0, 0]}
                className="drop-shadow-lg"
              >
                <LabelList dataKey={anoAnterior.toString()} position="top" className="fill-muted-foreground font-semibold" />
              </Bar>
              
              {/* Definindo gradientes personalizados */}
              <defs>
                <linearGradient id="comparativeGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="comparativeGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={1}/>
                  <stop offset="50%" stopColor="#94a3b8" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#64748b" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparativeChart;
