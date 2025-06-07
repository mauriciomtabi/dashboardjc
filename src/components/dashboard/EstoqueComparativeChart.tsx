
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { parseExcelDate } from '@/utils/dateUtils';
import { TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';

const COLORS = ['#3b82f6', '#94a3b8'];

interface EstoqueComparativeChartProps {
  estoqueData: any[];
  filteredData: any[];
  drillDownMonth: string | null;
  onDrillDown: (month: string | null) => void;
}

const EstoqueComparativeChart = ({ estoqueData, filteredData, drillDownMonth, onDrillDown }: EstoqueComparativeChartProps) => {
  const dadosComparativos = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anoAnterior = anoAtual - 1;
    
    // Use filteredData instead of estoqueData to respect filters
    const dataToUse = filteredData;
    
    console.log('EstoqueComparativeChart - Total records:', estoqueData.length);
    console.log('EstoqueComparativeChart - Filtered records:', filteredData.length);
    console.log('EstoqueComparativeChart - Sample data:', estoqueData.slice(0, 5));
    
    if (drillDownMonth) {
      const [ano, mes] = drillDownMonth.split('-');
      const daysInMonth = new Date(parseInt(ano), parseInt(mes), 0).getDate();
      
      return Array.from({length: daysInMonth}, (_, i) => {
        const dia = (i + 1).toString().padStart(2, '0');
        
        const dadosAnoAtual = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.R);
          if (!parsedDate) return false;
          return parsedDate.getFullYear() === anoAtual && 
                 (parsedDate.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 parsedDate.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        const dadosAnoAnterior = dataToUse.filter(item => {
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
      
      const result = meses.map(mes => {
        // Para ano atual, usar dados filtrados
        const dadosAnoAtual = dataToUse.filter(item => {
          const parsedDate = parseExcelDate(item.R);
          if (!parsedDate) return false;
          const itemYear = parsedDate.getFullYear();
          const itemMonth = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
          return itemYear === anoAtual && itemMonth === mes;
        }).length;
        
        // Para ano anterior, usar dados completos mas aplicar filtros de outros tipos (exceto ano)
        const dadosAnoAnterior = estoqueData.filter(item => {
          const parsedDate = parseExcelDate(item.R);
          if (!parsedDate) return false;
          const itemYear = parsedDate.getFullYear();
          const itemMonth = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
          
          // Verificar se é do ano anterior e mês correto
          if (itemYear !== anoAnterior || itemMonth !== mes) return false;
          
          // Aplicar outros filtros (se não estiver vazio)
          // Não aplicar filtro de ano pois queremos dados do ano anterior
          return true;
        }).length;
        
        console.log(`Mês ${mes}: ${anoAtual}=${dadosAnoAtual}, ${anoAnterior}=${dadosAnoAnterior}`);
        
        return {
          periodo: `${mes}/${anoAtual}`,
          [`${anoAtual}`]: dadosAnoAtual,
          [`${anoAnterior}`]: dadosAnoAnterior
        };
      });
      
      console.log('EstoqueComparativeChart - Final result:', result);
      return result;
    }
  }, [estoqueData, filteredData, drillDownMonth]);

  const anoAtual = new Date().getFullYear();
  const anoAnterior = anoAtual - 1;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-5 z-[9999] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 p-[1px]">
            <div className="w-full h-full rounded-xl bg-background/50" />
          </div>
          <div className="relative z-10 space-y-3">
            <p className="font-semibold text-foreground text-lg border-b border-primary/20 pb-2">
              {drillDownMonth ? 'Comparativo Diário' : 'Comparativo Mensal'}
            </p>
            <div className="space-y-2">
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
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-3" />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      {/* Efeitos de fundo premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]">
        <div className="w-full h-full rounded-lg bg-background" />
      </div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
            <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              <BarChart3 className="h-6 w-6 text-primary relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] transition-all duration-300" />
            </div>
            <span className="text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Comparativo Anual - Estoque
            </span>
            <TrendingUp className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors duration-300" />
          </div>
          {drillDownMonth && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDrillDown(null)}
              className="bg-gradient-to-r from-background to-muted/50 border-primary/20 hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover/btn:text-primary transition-colors duration-300" />
              Voltar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="relative">
          {/* Fundo do gráfico com gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
          
          <ResponsiveContainer width="100%" height={450}>
            <BarChart 
              data={dadosComparativos}
              onClick={(data) => {
                if (!drillDownMonth && data?.activeLabel) {
                  const [mes] = data.activeLabel.split('/');
                  onDrillDown(`${anoAtual}-${mes}`);
                }
              }}
              margin={{ top: 30, right: 40, left: 20, bottom: 20 }}
              className="cursor-pointer"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth={1}
              />
              <XAxis 
                dataKey="periodo" 
                stroke="rgba(148, 163, 184, 0.8)"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke="rgba(148, 163, 184, 0.8)"
                fontSize={12}
                fontWeight={500}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '14px', 
                  fontWeight: '600',
                  paddingTop: '20px'
                }}
              />
              <Bar 
                dataKey={anoAtual.toString()} 
                fill="url(#gradient1)"
                name={`Ano ${anoAtual}`}
                radius={[4, 4, 0, 0]}
                className="drop-shadow-sm"
              >
                <LabelList 
                  dataKey={anoAtual.toString()} 
                  position="top" 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: '600',
                    fill: '#3b82f6'
                  }}
                />
              </Bar>
              <Bar 
                dataKey={anoAnterior.toString()} 
                fill="url(#gradient2)"
                name={`Ano ${anoAnterior}`}
                radius={[4, 4, 0, 0]}
                className="drop-shadow-sm"
              >
                <LabelList 
                  dataKey={anoAnterior.toString()} 
                  position="top" 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: '600',
                    fill: '#94a3b8'
                  }}
                />
              </Bar>
              
              {/* Gradientes para as barras */}
              <defs>
                <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstoqueComparativeChart;
