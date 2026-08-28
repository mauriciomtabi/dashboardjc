
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
  const { setLaudoData, setEstoqueData, setCheckListData, setManutencaoData, setPreventivaData, setLastUpdate } = useData();
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
      const requiredSheets = ['R LAUDO 15568', 'R ESTOQUE 15510', 'CHECK LIST', 'MANUTENÇÃO'];
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
      
      const headerRow = (checkListJson[0] || {}) as Record<string, any>;
      
      // Função auxiliar para encontrar a coluna pelo nome do cabeçalho
      const getCheckListCol = (exactKeys: string[], fallback: string) => {
        for (const [col, val] of Object.entries(headerRow)) {
          if (typeof val === 'string') {
            const lower = val.toLowerCase().trim();
            if (exactKeys.includes(lower)) return col;
          }
        }
        return fallback;
      };

      const colFilial = getCheckListCol(['nm_filial', 'filial'], 'D');
      const colCheckList = getCheckListCol(['nm_cheklst', 'cheklst', 'checklist'], 'G');
      const colData = getCheckListCol(['dh_realiza', 'data_realiza', 'data'], 'N');
      const colItem = getCheckListCol(['nm_item', 'item'], 'T');
      const colConform = getCheckListCol(['bl_conform', 'conform', 'bl_confrm'], 'V');
      const colLista = getCheckListCol(['nm_lista', 'lista'], 'Z');
      const colPlaca = getCheckListCol(['placa'], 'AH');
      const colColaborador = getCheckListCol(['nm_usuario', 'usuario', 'colaborador', 'nm_conduto'], 'AI');

      const checkListData = checkListJson.slice(1).map((row: any) => {
        const filial = row[colFilial] || row.D || '';
        const checkList = row[colCheckList] || row.G || '';
        const dataHora = row[colData] || row.N || '';
        const item = row[colItem] || row.T || '';
        const conform = row[colConform] !== undefined ? row[colConform] : (row.V || '');
        const lista = row[colLista] || row.Z || (typeof row.Y === 'string' && isNaN(Number(row.Y)) ? row.Y : '');
        const placa = row[colPlaca] || row.AH || row.AG || '';
        const colaborador = row[colColaborador] || row.AI || row.AN || (row.AH !== placa ? row.AH : '') || '';

        return {
          D: filial,
          G: checkList,
          N: dataHora,
          T: item,
          V: conform,
          Y: lista,
          AG: placa,
          colaborador: String(colaborador).trim(),
        };
      });

      // Processar aba MANUTENÇÃO
      const manutencaoSheet = workbook.Sheets['MANUTENÇÃO'];
      const manutencaoJson = XLSX.utils.sheet_to_json(manutencaoSheet, { header: 'A' });
      const manutencaoData = manutencaoJson.slice(1).map((row: any) => ({
        B: row.B || '',
        L: row.L || '',
        Q: row.Q || '',
        W: row.W || '',
        Z: row.Z || '',
        AI: row.AI || '',
        AJ: row.AJ || '',
        AK: row.AK || '',
      }));

      // Processar aba PREVENTIVAS (opcional)
      let preventivaData: any[] = [];
      if (workbook.Sheets['PREVENTIVAS']) {
        console.log('Processando aba PREVENTIVAS...');
        const preventivaSheet = workbook.Sheets['PREVENTIVAS'];
        const preventivaJson = XLSX.utils.sheet_to_json(preventivaSheet, { header: 'A' });
        console.log('Dados brutos da aba PREVENTIVAS (primeiros 5):', preventivaJson.slice(0, 5));
        console.log('Total de linhas na aba PREVENTIVAS:', preventivaJson.length);
        
        // Filtrar apenas linhas que têm dados válidos
        preventivaData = preventivaJson.slice(1)
          .map((row: any) => ({
            preventiva: row.D || '',
            operacao: row.F || '',
            placa: row.K || '',
            ultimaManutencao: row.L || '',
            vencidaKm: row.U || '',
            vencidaDias: row.V || '',
          }))
          .filter(item => item.preventiva || item.operacao || item.placa); // Filtrar linhas vazias
          
        console.log('Dados processados de PREVENTIVAS (primeiros 3):', preventivaData.slice(0, 3));
        console.log('Total de registros válidos PREVENTIVAS:', preventivaData.length);
      } else {
        console.log('Aba PREVENTIVAS não encontrada na planilha');
        console.log('Abas disponíveis:', workbook.SheetNames);
      }

      // Salvar dados no contexto
      setLaudoData(laudoData);
      setEstoqueData(estoqueData);
      setCheckListData(checkListData);
      setManutencaoData(manutencaoData);
      setPreventivaData(preventivaData);
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
            Faça o upload da planilha Excel (.xlsx) contendo as abas "R LAUDO 15568", "R ESTOQUE 15510", "CHECK LIST", "MANUTENÇÃO" e "PREVENTIVAS"
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
              <li>• MANUTENÇÃO</li>
              <li>• PREVENTIVAS</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
