
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';
import { List } from 'lucide-react';

interface CheckListListaChartProps {
  filteredData: CheckListData[];
}

const CheckListListaChart = ({ filteredData }: CheckListListaChartProps) => {
  
  const chartData = React.useMemo(() => {
    const listaCounts = filteredData.reduce((acc, item) => {
      if (item.Y) {
        if (!acc[item.Y]) {
          acc[item.Y] = { conforme: 0, naoConforme: 0 };
        }
        
        if (item.V === 1) {
          acc[item.Y].conforme++;
        } else {
          acc[item.Y].naoConforme++;
        }
      }
      return acc;
    }, {} as Record<string, { conforme: number; naoConforme: number }>);

    return Object.entries(listaCounts)
      .map(([lista, counts]) => ({
        name: lista,
        conforme: counts.conforme,
        naoConforme: counts.naoConforme,
        total: counts.conforme + counts.naoConforme,
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredData]);

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
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <List className="h-5 w-5 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Lista de Inspeção
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
          
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="conforme" 
                  stackId="conformidade"
                  fill="#10b981"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="naoConforme" 
                  stackId="conformidade"
                  fill="#ef4444"
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

export default CheckListListaChart;
