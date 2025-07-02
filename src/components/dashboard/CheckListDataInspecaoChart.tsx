
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';

interface CheckListDataInspecaoChartProps {
  checkListData: CheckListData[];
  filteredData: CheckListData[];
  drillDownMonth: string | null;
  onDrillDown: (month: string | null) => void;
}

const CheckListDataInspecaoChart = ({ 
  checkListData, 
  filteredData, 
  drillDownMonth, 
  onDrillDown 
}: CheckListDataInspecaoChartProps) => {
  
  const chartData = React.useMemo(() => {
    if (drillDownMonth) {
      // Drill down por dia
      const dailyData = filteredData.reduce((acc, item) => {
        const date = new Date(item.N);
        if (isValid(date) && format(date, 'yyyy-MM') === drillDownMonth) {
          const day = format(date, 'dd');
          acc[day] = (acc[day] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(dailyData)
        .map(([day, count]) => ({
          name: `Dia ${day}`,
          value: count,
        }))
        .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    } else {
      // Dados mensais
      const monthlyData = filteredData.reduce((acc, item) => {
        const date = new Date(item.N);
        if (isValid(date)) {
          const month = format(date, 'yyyy-MM');
          acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(monthlyData)
        .map(([month, count]) => ({
          name: format(parseISO(month + '-01'), 'MMM yyyy', { locale: ptBR }),
          value: count,
          fullMonth: month,
        }))
        .sort((a, b) => a.fullMonth.localeCompare(b.fullMonth));
    }
  }, [filteredData, drillDownMonth]);

  const handleBarClick = (data: any) => {
    if (drillDownMonth) {
      onDrillDown(null); // Voltar para visão mensal
    } else {
      onDrillDown(data.fullMonth); // Drill down para o mês
    }
  };

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      {/* Efeito de brilho premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-2 relative z-10 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <CalendarDays className="h-5 w-5 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {drillDownMonth ? 'Check Lists por Dia' : 'Data de Inspeção'}
          </span>
        </CardTitle>
        {drillDownMonth && (
          <button
            onClick={() => onDrillDown(null)}
            className="text-sm text-primary hover:underline"
          >
            ← Voltar para visão mensal
          </button>
        )}
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="relative">
          {/* Fundo do gráfico com gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
          
          <ChartContainer config={{}} className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#dataInspecaoGradient)"
                  onClick={handleBarClick}
                  className="cursor-pointer drop-shadow-lg"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList dataKey="value" position="top" className="fill-primary font-semibold" />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
                
                {/* Definindo gradiente personalizado */}
                <defs>
                  <linearGradient id="dataInspecaoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckListDataInspecaoChart;
