
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
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
        let date: Date | null = null;
        
        if (typeof item.N === 'string' && item.N.includes('/')) {
          const [day, month, year] = item.N.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (typeof item.N === 'number') {
          date = new Date((item.N - 25569) * 86400 * 1000);
        } else {
          date = new Date(item.N);
        }
        
        if (date && isValid(date) && format(date, 'yyyy-MM') === drillDownMonth) {
          const day = format(date, 'dd');
          if (!acc[day]) {
            acc[day] = { conforme: 0, naoConforme: 0 };
          }
          
          if (item.V === 1) {
            acc[day].conforme++;
          } else {
            acc[day].naoConforme++;
          }
        }
        return acc;
      }, {} as Record<string, { conforme: number; naoConforme: number }>);

      return Object.entries(dailyData)
        .map(([day, counts]) => ({
          name: `Dia ${day}`,
          conforme: counts.conforme,
          naoConforme: counts.naoConforme,
        }))
        .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    } else {
      // Dados mensais - mostrar todos os meses do ano
      const allMonths = [
        '01', '02', '03', '04', '05', '06',
        '07', '08', '09', '10', '11', '12'
      ];

      const monthlyData = filteredData.reduce((acc, item) => {
        let date: Date | null = null;
        
        if (typeof item.N === 'string' && item.N.includes('/')) {
          const [day, month, year] = item.N.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (typeof item.N === 'number') {
          date = new Date((item.N - 25569) * 86400 * 1000);
        } else {
          date = new Date(item.N);
        }
        
        if (date && isValid(date)) {
          const month = format(date, 'yyyy-MM');
          if (!acc[month]) {
            acc[month] = { conforme: 0, naoConforme: 0 };
          }
          
          if (item.V === 1) {
            acc[month].conforme++;
          } else {
            acc[month].naoConforme++;
          }
        }
        return acc;
      }, {} as Record<string, { conforme: number; naoConforme: number }>);

      // Garantir que todos os meses apareçam
      const currentYear = new Date().getFullYear();
      const result = allMonths.map(month => {
        const yearMonth = `${currentYear}-${month}`;
        const counts = monthlyData[yearMonth] || { conforme: 0, naoConforme: 0 };
        
        return {
          name: format(new Date(currentYear, parseInt(month) - 1, 1), 'MMM yyyy', { locale: ptBR }),
          conforme: counts.conforme,
          naoConforme: counts.naoConforme,
          fullMonth: yearMonth,
        };
      });

      return result;
    }
  }, [filteredData, drillDownMonth]);

  const handleBarClick = (data: any) => {
    if (drillDownMonth) {
      onDrillDown(null);
    } else {
      onDrillDown(data.fullMonth);
    }
  };

  const chartConfig = {
    conforme: {
      label: "Conforme",
      color: "#10b981",
    },
    naoConforme: {
      label: "Não conforme", 
      color: "#ef4444",
    },
  };

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
          
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
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
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar 
                  dataKey="conforme" 
                  stackId="conformidade"
                  fill="#10b981"
                  onClick={handleBarClick}
                  className="cursor-pointer"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="naoConforme" 
                  stackId="conformidade"
                  fill="#ef4444"
                  onClick={handleBarClick}
                  className="cursor-pointer"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckListDataInspecaoChart;
