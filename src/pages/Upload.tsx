
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import * as XLSX from 'xlsx';
import { Upload as UploadIcon, FileSpreadsheet } from 'lucide-react';

const Upload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setLaudoData, setEstoqueData, setCheckListData, setLastUpdate } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo Excel (.xlsx)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Verificar se as abas obrigatórias existem
      const requiredSheets = ['R LAUDO 15568', 'R ESTOQUE 15510', 'CHECK LIST'];
      const missingSheets = requiredSheets.filter(sheet => !workbook.SheetNames.includes(sheet));

      if (missingSheets.length > 0) {
        toast({
          title: "Erro",
          description: `Abas obrigatórias não encontradas: ${missingSheets.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // Processar aba R LAUDO 15568
      const laudoSheet = workbook.Sheets['R LAUDO 15568'];
      const laudoJson = XLSX.utils.sheet_to_json(laudoSheet, { header: 'A' });
      const laudoData = laudoJson.slice(1).map((row: any) => ({
        D: row.D || '',
        E: row.E || '',
        F: row.F || '',
        G: row.G || '',
        J: row.J || '',
        K: row.K || '',
        L: row.L || '',
        M: row.M || '',
        N: row.N || '',
        O: row.O || '',
        P: row.P || '',
        Q: row.Q || '',
        S: row.S || '',
        U: row.U || '',
        W: row.W || '',
        Y: row.Y || '',
        AA: row.AA || '',
        AB: row.AB || '',
      }));

      // Processar aba R ESTOQUE 15510
      const estoqueSheet = workbook.Sheets['R ESTOQUE 15510'];
      const estoqueJson = XLSX.utils.sheet_to_json(estoqueSheet, { header: 'A' });
      const estoqueData = estoqueJson.slice(1).map((row: any) => ({
        B: row.B || '',
        D: row.D || '',
        F: row.F || '',
        G: row.G || '',
        H: row.H || '',
        I: row.I || '',
        J: row.J || '',
        K: row.K || '',
        L: row.L || '',
        M: row.M || '',
        N: row.N || '',
        P: row.P || '',
        Q: row.Q || '',
        R: row.R || '',
        AB: row.AB || '',
        AK: row.AK || '',
        AP: row.AP || '',
        AR: row.AR || '',
      }));

      // Processar aba CHECK LIST
      const checkListSheet = workbook.Sheets['CHECK LIST'];
      const checkListJson = XLSX.utils.sheet_to_json(checkListSheet, { header: 'A' });
      const checkListData = checkListJson.slice(1).map((row: any) => ({
        D: row.D || '',
        G: row.G || '',
        N: row.N || '',
        T: row.T || '',
        V: row.V || '',
        Y: row.Y || '',
        AG: row.AG || '',
      }));

      // Salvar dados no contexto
      setLaudoData(laudoData);
      setEstoqueData(estoqueData);
      setCheckListData(checkListData);
      setLastUpdate(new Date());

      toast({
        title: "Sucesso",
        description: "Planilha carregada com sucesso!",
      });

      // Redirecionar para gestão de laudos
      navigate('/gestao-laudos');

    } catch (error) {
      console.error('Erro ao processar planilha:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a planilha. Verifique o formato do arquivo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 flex items-center border-b px-6 bg-background">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/65ac0d2c-d82d-4a9d-8b11-a5088ebeceec.png" 
            alt="JC Transportes Logo" 
            className="h-8 w-8"
          />
          <h1 className="font-bold text-lg">Indicadores JC Transportes</h1>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Sistema de Gestão e Análise de Dados</h1>
          <p className="text-xl text-muted-foreground">Faça o upload da sua planilha para começar</p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileSpreadsheet className="h-6 w-6" />
              Upload de Planilha
            </CardTitle>
            <CardDescription>
              Faça o upload da planilha Excel (.xlsx) contendo as abas "R LAUDO 15568", "R ESTOQUE 15510" e "CHECK LIST"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <UploadIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                size="lg"
                className="mb-4"
              >
                {isUploading ? "Processando..." : "Selecionar Arquivo Excel"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Apenas arquivos .xlsx são aceitos
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-2">Abas Obrigatórias:</h3>
              <ul className="text-sm space-y-1">
                <li>• R LAUDO 15568</li>
                <li>• R ESTOQUE 15510</li>
                <li>• CHECK LIST</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;
