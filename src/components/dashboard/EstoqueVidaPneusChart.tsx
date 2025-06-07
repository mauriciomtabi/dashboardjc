
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Gauge, TrendingUp } from 'lucide-react';

const COLORS = [
  '#3b82f6', // Azul moderno
  '#ef4444', // Vermelho vibrante  
  '#10b981', // Verde esmeralda
  '#f59e0b', // Âmbar premium
  '#8b5cf6', // Roxo sofisticado
  '#06b6d4', // Ciano elegante
  '#84cc16', // Verde lima
  '#f97316'  // Laranja energético
];

interface EstoqueVidaPneusChartProps {
  filteredData: any[];
}

const EstoqueVidaPneusChart = ({ filteredData }: EstoqueVidaPneusChartProps) => {
  const vidaPneus = useMemo(() => {
    const vidas = filteredData.reduce((acc, item) => {
      if (item.F) {
        acc[item.F] = (acc[item.F] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(vidas).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-5 z-[9999] relative overflow-hidden">
          {/* Fundo com gradiente premium */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl" />
          {/* Borda interna luminosa */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-primary/10 p-[1px]">
            <div className="w-full h-full rounded-xl bg-background/50" />
          </div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-lg" 
                style={{ backgroundColor: data.payload.fill || COLORS[0] }}
              />
              <p className="font-semibold text-foreground text-lg">{data.payload.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-primary font-bold text-xl">{data.value} pneus</p>
              <p className="text-muted-foreground text-sm font-medium">
                {((data.value / filteredData.length) * 100).toFixed(1)}% do total
              </p>
            </div>
            {/* Elemento decorativo */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-3" />
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        className="drop-shadow-lg filter"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
      >
        {name}
      </text>
    );
  };

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      {/* Efeito de brilho premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Borda luminosa sutil */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]">
        <div className="w-full h-full rounded-lg bg-background" />
      </div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl group-hover:text-primary transition-colors duration-300">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <Gauge className="h-6 w-6 text-primary relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] transition-all duration-300" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Vida dos Pneus
          </span>
          <TrendingUp className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="flex flex-col items-center space-y-8">
          {/* Container do gráfico com efeitos premium */}
          <div className="relative w-full max-w-[320px]">
            {/* Anel de luz ambiente */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
            
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={vidaPneus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={60}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                >
                  {vidaPneus.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      style={{
                        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip />}
                  wrapperStyle={{ zIndex: 9999 }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Pneu central modernizado */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-2xl border-4 border-gradient-to-br from-gray-500 to-gray-700 relative overflow-hidden">
                {/* Reflexo superior */}
                <div className="absolute top-1 left-2 right-2 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-950 rounded-full flex items-center justify-center relative overflow-hidden shadow-inner">
                  {/* Padrão de banda de rodagem modernizado */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-1 w-9 h-9">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-sm shadow-sm"></div>
                      ))}
                    </div>
                  </div>
                  {/* Círculo interno com brilho */}
                  <div className="absolute inset-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border border-gray-600 shadow-inner" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Legenda premium */}
          {vidaPneus.length > 0 && (
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-3">
                {vidaPneus.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 hover:from-muted/50 hover:to-muted/70 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm border border-muted/20 group/item">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-lg relative overflow-hidden" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300">
                        {item.name}
                      </span>
                      <span className="text-muted-foreground ml-2 font-medium tabular-nums">
                        ({Number(item.value)} - {((Number(item.value) / filteredData.length) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstoqueVidaPneusChart;
