
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { parseExcelDate } from '@/utils/dateUtils';
import { TrendingUp } from 'lucide-react';

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

  return (
    <Card className="col-span-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparativo Anual - Estoque
          </div>
          {drillDownMonth && (
            <Button variant="outline" size="sm" onClick={() => onDrillDown(null)}>
              Voltar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={dadosComparativos}
            onClick={(data) => {
              if (!drillDownMonth && data?.activeLabel) {
                const [mes] = data.activeLabel.split('/');
                onDrillDown(`${anoAtual}-${mes}`);
              }
            }}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey={anoAtual.toString()} 
              fill={COLORS[0]} 
              name={`Ano ${anoAtual}`}
            >
              <LabelList dataKey={anoAtual.toString()} position="top" />
            </Bar>
            <Bar 
              dataKey={anoAnterior.toString()} 
              fill={COLORS[1]} 
              name={`Ano ${anoAnterior}`}
            >
              <LabelList dataKey={anoAnterior.toString()} position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EstoqueComparativeChart;
