import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';

interface PreventivasKmChartProps {
  filteredData: any[];
}

const PreventivasKmChart: React.FC<PreventivasKmChartProps> = ({ filteredData }) => {
  const { setActiveFilter, activeFilter } = useInteractiveFilter();
  const data = React.useMemo(() => {
    return filteredData
      .map(item => ({
        placa: item.placa || 'Não informado',
        kmVencida: parseInt(item.vencidaKm) || 0,
      }))
      .filter(item => item.kmVencida > 0)
      .sort((a, b) => b.kmVencida - a.kmVencida);
  }, [filteredData]);


  const handleBarClick = (data: any) => {
    if (activeFilter.type === 'placa' && activeFilter.value === data.placa) {
      setActiveFilter({ type: null, value: null });
    } else {
      setActiveFilter({ type: 'placa', value: data.placa });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vencimento por KM</CardTitle>
        <CardDescription>Placas mais próximas do vencimento por quilometragem</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="overflow-x-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
            
            <ResponsiveContainer width={Math.max(800, data.length * 40)} height={350}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="placa" 
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
                <Bar dataKey="kmVencida" fill="url(#kmGradient)" radius={[8, 8, 0, 0]} cursor="pointer" onClick={handleBarClick} className="drop-shadow-lg">
                  <LabelList dataKey="kmVencida" position="top" className="fill-primary font-semibold" />
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={activeFilter.type === 'placa' && activeFilter.value === entry.placa 
                        ? "hsl(var(--chart-primary) / 0.8)" 
                        : "url(#kmGradient)"
                      } 
                    />
                  ))}
                </Bar>
                
                <defs>
                  <linearGradient id="kmGradient" x1="0" y1="0" x2="0" y2="1">
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

export default PreventivasKmChart;