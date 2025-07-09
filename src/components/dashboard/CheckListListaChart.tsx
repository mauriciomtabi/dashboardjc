
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';
import { List } from 'lucide-react';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';
import { useInteractiveCheckListData } from '@/hooks/useInteractiveCheckListData';

interface CheckListListaChartProps {
  filteredData: CheckListData[];
}

const CheckListListaChart = ({ filteredData }: CheckListListaChartProps) => {
  const { activeFilter, setActiveFilter, clearActiveFilter } = useInteractiveFilter();
  const interactiveFilteredData = useInteractiveCheckListData(filteredData);

  const chartData = React.useMemo(() => {
    const dataToUse = activeFilter.type === 'lista' ? filteredData : interactiveFilteredData;
    
    const listaCounts = dataToUse.reduce((acc, item) => {
      if (item.Y) {
        if (!acc[item.Y]) {
          acc[item.Y] = { conforme: 0, naoConforme: 0 };
        }
        
        if (Number(item.V) === 1) {
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
  }, [filteredData, interactiveFilteredData, activeFilter.type]);

  const handleBarClick = (data: any) => {
    if (activeFilter.type === 'lista' && activeFilter.value === data.name) {
      clearActiveFilter();
    } else {
      setActiveFilter({ type: 'lista', value: data.name });
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
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
            <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              <List className="h-5 w-5 text-primary relative z-10" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Lista de Inspeção
            </span>
          </div>
          {activeFilter.type === 'lista' && (
            <button
              onClick={clearActiveFilter}
              className="text-sm text-primary hover:underline"
            >
              Limpar filtro: {activeFilter.value}
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
          
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="conformeGradientLista" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="naoConformeGradientLista" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
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
                  fill="url(#conformeGradientLista)"
                  radius={[0, 0, 0, 0]}
                  onClick={handleBarClick}
                  className="cursor-pointer"
                />
                <Bar 
                  dataKey="naoConforme" 
                  stackId="conformidade"
                  fill="url(#naoConformeGradientLista)"
                  radius={[8, 8, 0, 0]}
                  onClick={handleBarClick}
                  className="cursor-pointer"
                >
                  <LabelList dataKey="total" position="top" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckListListaChart;
