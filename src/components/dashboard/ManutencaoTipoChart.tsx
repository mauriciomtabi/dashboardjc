import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ManutencaoData } from '@/contexts/DataContext';

interface ManutencaoTipoChartProps {
  filteredData: ManutencaoData[];
}

const ManutencaoTipoChart = ({ filteredData }: ManutencaoTipoChartProps) => {
  const tipoData = React.useMemo(() => {
    const preventiva = filteredData.filter(item => item.Z === 'P').reduce((acc, item) => {
      const valor = parseFloat(item.Q) || 0;
      return acc + valor;
    }, 0);

    const corretiva = filteredData.filter(item => item.Z === 'C').reduce((acc, item) => {
      const valor = parseFloat(item.Q) || 0;
      return acc + valor;
    }, 0);

    return [
      {
        name: 'Preventiva',
        value: preventiva,
        color: 'hsl(var(--chart-2))',
      },
      {
        name: 'Corretiva',
        value: corretiva,
        color: 'hsl(var(--chart-1))',
      },
    ].filter(item => item.value > 0);
  }, [filteredData]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-semibold">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Distribuição por Tipo de Manutenção
        </CardTitle>
        <CardDescription>
          Distribuição dos custos entre manutenção preventiva e corretiva
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tipoData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {tipoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {value}: {formatCurrency(entry.payload.value)}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManutencaoTipoChart;