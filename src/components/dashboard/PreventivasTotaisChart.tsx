import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';

interface PreventivasTotaisChartProps {
  filteredData: any[];
}

const PreventivasTotaisChart: React.FC<PreventivasTotaisChartProps> = ({ filteredData }) => {
  console.log('PreventivasTotaisChart rendering with data:', filteredData?.length);
  const { setActiveFilter, activeFilter } = useInteractiveFilter();
  const data = React.useMemo(() => {
    const preventivas = filteredData.reduce((acc: { [key: string]: number }, item) => {
      const preventiva = item.preventiva || 'Não informado';
      acc[preventiva] = (acc[preventiva] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(preventivas)
      .map(([preventiva, total]) => ({
        preventiva,
        total: Number(total)
      }))
      .sort((a, b) => Number(b.total) - Number(a.total));
  }, [filteredData]);


  const handleBarClick = (data: any) => {
    if (activeFilter.type === 'preventiva' && activeFilter.value === data.preventiva) {
      setActiveFilter({ type: null, value: null });
    } else {
      setActiveFilter({ type: 'preventiva', value: data.preventiva });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preventivas por Tipo</CardTitle>
        <CardDescription>Quantidade de preventivas por tipo (maior para menor)</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="overflow-x-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
            
            <ResponsiveContainer width={Math.max(800, data.length * 60)} height={350}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="preventiva" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
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
                <Bar dataKey="total" fill="url(#barGradient)" radius={[8, 8, 0, 0]} cursor="pointer" onClick={handleBarClick} className="drop-shadow-lg">
                  <LabelList dataKey="total" position="top" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={activeFilter.type === 'preventiva' && activeFilter.value === entry.preventiva 
                        ? "hsl(var(--chart-primary) / 0.8)" 
                        : "url(#barGradient)"
                      } 
                    />
                  ))}
                </Bar>
                
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="50%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreventivasTotaisChart;