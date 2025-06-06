
import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import Navigation from '@/components/dashboard/Navigation';
import FilterBar from '@/components/dashboard/FilterBar';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const GestaoEstoque = () => {
  const { estoqueData } = useData();
  const [filters, setFilters] = useState({
    mes: '',
    ano: '',
    estoque: [] as string[],
    operacao: [] as string[],
    placa: '',
  });
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [drillDownMonth, setDrillDownMonth] = useState<string | null>(null);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Processar dados com filtros
  const filteredData = useMemo(() => {
    return estoqueData.filter(item => {
      const date = new Date(item.R);
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const ano = date.getFullYear().toString();
      
      if (filters.mes && mes !== filters.mes) return false;
      if (filters.ano && ano !== filters.ano) return false;
      if (filters.estoque.length > 0 && !filters.estoque.includes(item.N)) return false;
      if (filters.operacao.length > 0 && !filters.operacao.includes(item.AB)) return false;
      if (filters.placa && !item.AK?.toLowerCase().includes(filters.placa.toLowerCase())) return false;
      
      return true;
    });
  }, [estoqueData, filters]);

  // Extrair valores únicos para filtros
  const availableFilters = useMemo(() => {
    const meses = [...new Set(estoqueData.map(item => {
      const date = new Date(item.R);
      return (date.getMonth() + 1).toString().padStart(2, '0');
    }))].sort();
    
    const anos = [...new Set(estoqueData.map(item => {
      const date = new Date(item.R);
      return date.getFullYear().toString();
    }))].sort();
    
    const operacoes = [...new Set(estoqueData.map(item => item.AB))].filter(Boolean).sort();
    const estoques = [...new Set(estoqueData.map(item => item.N))].filter(Boolean).sort();
    
    return { meses, anos, operacoes, estoques };
  }, [estoqueData]);

  // Cards de operações (5 cards) com percentual
  const operacaoCards = useMemo(() => {
    const operacoes = [...new Set(estoqueData.map(item => item.AB))].filter(Boolean);
    const total = filteredData.length;
    
    return operacoes.slice(0, 5).map(op => {
      const count = filteredData.filter(item => item.AB === op).length;
      return {
        title: op,
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    });
  }, [estoqueData, filteredData]);

  // Cards de estoque (4 cards) com percentual
  const estoqueCards = useMemo(() => {
    const estoques = [...new Set(estoqueData.map(item => item.N))].filter(Boolean);
    const total = filteredData.length;
    
    return estoques.slice(0, 4).map(est => {
      const count = filteredData.filter(item => item.N === est).length;
      return {
        title: est,
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0
      };
    });
  }, [estoqueData, filteredData]);

  // Vida dos Pneus - Gráfico de Rosca
  const vidaPneus = useMemo(() => {
    const vidas = filteredData.reduce((acc, item) => {
      if (item.F) {
        acc[item.F] = (acc[item.F] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(vidas).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Dados comparativos por ano (mensal ou diário se drill down)
  const dadosComparativos = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anoAnterior = anoAtual - 1;
    
    if (drillDownMonth) {
      // Drill down por dia do mês
      const [ano, mes] = drillDownMonth.split('-');
      const daysInMonth = new Date(parseInt(ano), parseInt(mes), 0).getDate();
      
      return Array.from({length: daysInMonth}, (_, i) => {
        const dia = (i + 1).toString().padStart(2, '0');
        
        const dadosAnoAtual = estoqueData.filter(item => {
          const date = new Date(item.R);
          return date.getFullYear() === anoAtual && 
                 (date.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 date.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        const dadosAnoAnterior = estoqueData.filter(item => {
          const date = new Date(item.R);
          return date.getFullYear() === anoAnterior && 
                 (date.getMonth() + 1).toString().padStart(2, '0') === mes &&
                 date.getDate().toString().padStart(2, '0') === dia;
        }).length;
        
        return {
          mes: `${dia}/${mes}`,
          anoAtual: dadosAnoAtual,
          anoAnterior: dadosAnoAnterior
        };
      });
    } else {
      // Dados mensais
      const meses = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
      
      return meses.map(mes => {
        const dadosAnoAtual = estoqueData.filter(item => {
          const date = new Date(item.R);
          return date.getFullYear() === anoAtual && (date.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        const dadosAnoAnterior = estoqueData.filter(item => {
          const date = new Date(item.R);
          return date.getFullYear() === anoAnterior && (date.getMonth() + 1).toString().padStart(2, '0') === mes;
        }).length;
        
        return {
          mes: `${mes}/${anoAtual}`,
          anoAtual: dadosAnoAtual,
          anoAnterior: dadosAnoAnterior
        };
      });
    }
  }, [estoqueData, drillDownMonth]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  if (estoqueData.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Nenhum dado disponível</h2>
            <p className="text-muted-foreground">Faça o upload de uma planilha para visualizar os dados.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-bold">Gestão de Estoque</h2>
        
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
          isEstoque={true}
        />

        {/* Cards de Operações */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Operações</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {operacaoCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                percentage={card.percentage}
              />
            ))}
          </div>
        </div>

        {/* Cards de Estoque */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Estoque</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {estoqueCards.map((card, index) => (
              <StatCard
                key={index}
                title={card.title}
                value={card.value}
                percentage={card.percentage}
              />
            ))}
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vida dos Pneus - Rosca */}
          <Card>
            <CardHeader>
              <CardTitle>Vida dos Pneus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vidaPneus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {vidaPneus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Comparativo Anual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Comparativo Anual
                {drillDownMonth && (
                  <Button variant="outline" size="sm" onClick={() => setDrillDownMonth(null)}>
                    Voltar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={dadosComparativos}
                  onClick={(data) => {
                    if (!drillDownMonth && data?.activeLabel) {
                      const [mes] = data.activeLabel.split('/');
                      setDrillDownMonth(`${new Date().getFullYear()}-${mes}`);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="anoAtual" fill={COLORS[0]} name="Ano Atual" />
                  <Bar dataKey="anoAnterior" fill={COLORS[0]} fillOpacity={0.5} name="Ano Anterior" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Botão Ver Tabela Completa */}
        <div className="flex justify-center">
          <Dialog open={isTableOpen} onOpenChange={setIsTableOpen}>
            <DialogTrigger asChild>
              <Button size="lg">Ver Tabela Completa</Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Tabela Completa - Estoque</DialogTitle>
              </DialogHeader>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coluna B</TableHead>
                      <TableHead>Coluna D</TableHead>
                      <TableHead>Vida</TableHead>
                      <TableHead>Coluna G</TableHead>
                      <TableHead>Coluna H</TableHead>
                      <TableHead>Coluna I</TableHead>
                      <TableHead>Coluna J</TableHead>
                      <TableHead>Coluna K</TableHead>
                      <TableHead>Coluna L</TableHead>
                      <TableHead>Coluna M</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Coluna P</TableHead>
                      <TableHead>Coluna Q</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Operação</TableHead>
                      <TableHead>Coluna AK</TableHead>
                      <TableHead>Coluna AR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.B}</TableCell>
                        <TableCell>{item.D}</TableCell>
                        <TableCell>{item.F}</TableCell>
                        <TableCell>{item.G}</TableCell>
                        <TableCell>{item.H}</TableCell>
                        <TableCell>{item.I}</TableCell>
                        <TableCell>{item.J}</TableCell>
                        <TableCell>{item.K}</TableCell>
                        <TableCell>{item.L}</TableCell>
                        <TableCell>{item.M}</TableCell>
                        <TableCell>{item.N}</TableCell>
                        <TableCell>{item.P}</TableCell>
                        <TableCell>{item.Q}</TableCell>
                        <TableCell>{formatDate(item.R)}</TableCell>
                        <TableCell>{item.AB}</TableCell>
                        <TableCell>{item.AK}</TableCell>
                        <TableCell>{item.AR}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default GestaoEstoque;
