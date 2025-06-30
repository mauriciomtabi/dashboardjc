
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          {drillDownMonth ? 'Check Lists por Dia' : 'Data de Inspeção'}
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
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Quantidade",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="value" 
                fill="var(--color-value)"
                onClick={handleBarClick}
                className="cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CheckListDataInspecaoChart;
