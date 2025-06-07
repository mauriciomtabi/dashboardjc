
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, BarChart3, Package } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const Navigation = () => {
  const location = useLocation();
  const { lastUpdate } = useData();

  const formatLastUpdate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/c824e94f-2598-484e-bf3e-a66562f273ff.png" 
                alt="JC Transportes" 
                className="h-12 w-auto"
              />
              <h1 className="text-2xl font-bold">GESTÃO DE PNEUS</h1>
            </div>
            <nav className="flex space-x-4">
              <Button 
                asChild 
                variant={location.pathname === '/upload' || location.pathname === '/' ? 'default' : 'ghost'}
              >
                <Link to="/upload" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Upload
                </Link>
              </Button>
              <Button 
                asChild 
                variant={location.pathname === '/gestao-laudos' ? 'default' : 'ghost'}
              >
                <Link to="/gestao-laudos" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Gestão de Laudos
                </Link>
              </Button>
              <Button 
                asChild 
                variant={location.pathname === '/gestao-estoque' ? 'default' : 'ghost'}
              >
                <Link to="/gestao-estoque" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Gestão de Estoque
                </Link>
              </Button>
            </nav>
          </div>
          {lastUpdate && (
            <div className="text-sm text-muted-foreground">
              Dados atualizados em: {formatLastUpdate(lastUpdate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
