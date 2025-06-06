
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

const GestaoLaudos = () => {
  const { laudoData } = useData();
  const [filters, setFilters] = useState({
    mes: '',
    ano: '',
    placa: '',
    operacao: '',
  });
  const [isTableOpen, setIsTableOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Processar dados com filtros
  const filteredData = useMemo(() => {
    return laudoData.filter(item => {
      const date = new Date(item.P);
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const ano = date.getFullYear().toString();
      
      if (filters.mes && mes !== filters.mes) return false;
      if (filters.ano && ano !== filters.ano) return false;
      if (filters.placa && !item.AB.toLowerCase().includes(filters.placa.toLowerCase())) return false;
      if (filters.operacao && item.D !== filters.operacao) return false;
      
      return true;
    });
  }, [laudoData, filters]);

  // Extrair valores únicos para filtros
  const availableFilters = useMemo(() => {
    const meses = [...new Set(laudoData.map(item => {
      const date = new Date(item.P);
      return (date.getMonth() + 1).toString().padStart(2, '0');
    }))].sort();
    
    const anos = [...new Set(laudoData.map(item => {
      const date = new Date(item.P);
      return date.getFullYear().toString();
    }))].sort();
    
    const operacoes = [...new Set(laudoData.map(item => item.D))].filter(Boolean).sort();
    
    return { meses, anos, operacoes };
  }, [laudoData]);

  // Cards de operações
  const operacaoCards = useMemo(() => {
    const operacoes = [...new Set(laudoData.map(item => item.D))].filter(Boolean);
    return operacoes.slice(0, 4).map(op => ({
      title: op,
      value: filteredData.filter(item => item.D === op).length
    }));
  }, [laudoData, filteredData]);

  // Top 10 Motivos de Laudo
  const motivosLaudo = useMemo(() => {
    const motivos = filteredData.reduce((acc, item) => {
      if (item.S) {
        acc[item.S] = (acc[item.S] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(motivos)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Distribuição por Marca
  const marcasPneus = useMemo(() => {
    const marcas = filteredData.reduce((acc, item) => {
      if (item.Y) {
        acc[item.Y] = (acc[item.Y] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(marcas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Top 20 DOTs
  const topDOTs = useMemo(() => {
    const dots = filteredData.reduce((acc, item) => {
      if (item.G) {
        acc[item.G] = (acc[item.G] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(dots)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Distribuição por Vida
  const vidaPneus = useMemo(() => {
    const vidas = filteredData.reduce((acc, item) => {
      if (item.J) {
        acc[item.J] = (acc[item.J] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(vidas).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Top 20 Placas
  const topPlacas = useMemo(() => {
    const placas = filteredData.reduce((acc, item) => {
      if (item.AB) {
        acc[item.AB] = (acc[item.AB] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(placas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  if (laudoData.length === 0) {
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
        <h2 className="text-3xl font-bold">Gestão de Laudos</h2>
        
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          availableFilters={availableFilters}
        />

        {/* Cards de Operações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {operacaoCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 10 Motivos de Laudo */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Motivos de Laudo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={motivosLaudo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Marca */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Marca dos Pneus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={marcasPneus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Vida */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Vida</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vidaPneus}
                    cx="50%"
                    cy="50%"
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

          {/* Top 20 DOTs */}
          <Card>
            <CardHeader>
              <CardTitle>Top 20 DOTs mais recorrentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <ResponsiveContainer width={Math.max(800, topDOTs.length * 40)} height={300}>
                  <BarChart data={topDOTs}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={COLORS[2]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 20 Placas com scroll horizontal */}
        <Card>
          <CardHeader>
            <CardTitle>Top 20 Placas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ResponsiveContainer width={Math.max(800, topPlacas.length * 40)} height={300}>
                <BarChart data={topPlacas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS[3]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Botão Ver Tabela Completa */}
        <div className="flex justify-center">
          <Dialog open={isTableOpen} onOpenChange={setIsTableOpen}>
            <DialogTrigger asChild>
              <Button size="lg">Ver Tabela Completa</Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Tabela Completa - Laudos</DialogTitle>
              </DialogHeader>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operação (D)</TableHead>
                      <TableHead>E</TableHead>
                      <TableHead>F</TableHead>
                      <TableHead>DOT (G)</TableHead>
                      <TableHead>Vida (J)</TableHead>
                      <TableHead>K</TableHead>
                      <TableHead>L</TableHead>
                      <TableHead>M</TableHead>
                      <TableHead>N</TableHead>
                      <TableHead>O</TableHead>
                      <TableHead>Data (P)</TableHead>
                      <TableHead>Q</TableHead>
                      <TableHead>U</TableHead>
                      <TableHead>W</TableHead>
                      <TableHead>Marca (Y)</TableHead>
                      <TableHead>Código Veículo (AA)</TableHead>
                      <TableHead>Placa (AB)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.D}</TableCell>
                        <TableCell>{item.E}</TableCell>
                        <TableCell>{item.F}</TableCell>
                        <TableCell>{item.G}</TableCell>
                        <TableCell>{item.J}</TableCell>
                        <TableCell>{item.K}</TableCell>
                        <TableCell>{item.L}</TableCell>
                        <TableCell>{item.M}</TableCell>
                        <TableCell>{item.N}</TableCell>
                        <TableCell>{item.O}</TableCell>
                        <TableCell>{item.P}</TableCell>
                        <TableCell>{item.Q}</TableCell>
                        <TableCell>{item.U}</TableCell>
                        <TableCell>{item.W}</TableCell>
                        <TableCell>{item.Y}</TableCell>
                        <TableCell>{item.AA}</TableCell>
                        <TableCell>{item.AB}</TableCell>
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

export default GestaoLaudos;
