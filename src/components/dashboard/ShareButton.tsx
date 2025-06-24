
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, FileText, MessageCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  pageTitle: string;
}

const ShareButton = ({ pageTitle }: ShareButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const capturePageAsImage = async (): Promise<string> => {
    try {
      console.log('Iniciando captura da página...');
      
      // Aguardar um pouco para garantir que a página está totalmente carregada
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = document.querySelector('.max-w-7xl') || document.body;
      console.log('Elemento para captura:', element);
      
      const canvas = await html2canvas(element as HTMLElement, {
        height: element.scrollHeight,
        width: element.scrollWidth,
        useCORS: true,
        allowTaint: true,
        background: '#ffffff',
        logging: true,
        removeContainer: true,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          console.log('Documento clonado para captura');
          // Garantir que estilos sejam aplicados no clone
          const clonedElement = clonedDoc.querySelector('.max-w-7xl') || clonedDoc.body;
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = 'none';
          }
        }
      });
      
      console.log('Canvas criado com sucesso:', canvas.width, 'x', canvas.height);
      const dataUrl = canvas.toDataURL('image/png', 0.8);
      console.log('DataURL gerado, tamanho:', dataUrl.length);
      
      return dataUrl;
    } catch (error) {
      console.error('Erro detalhado na captura:', error);
      throw new Error(`Falha na captura da página: ${error.message}`);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      console.log('=== INICIANDO GERAÇÃO DE PDF ===');
      
      toast({
        title: "Gerando PDF...",
        description: "Aguarde enquanto processamos sua solicitação.",
      });

      const imgData = await capturePageAsImage();
      console.log('Imagem capturada com sucesso para PDF');
      
      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Cabeçalho
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246);
      pdf.text(pageTitle, 20, 25);
      
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      // Linha separadora
      pdf.setDrawColor(59, 130, 246);
      pdf.line(20, 40, pdfWidth - 20, 40);
      
      // Adicionar imagem
      const imgWidth = pdfWidth - 40;
      const imgHeight = (imgWidth * 600) / 800; // Proporção fixa
      
      if (imgHeight <= pdfHeight - 60) {
        pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);
      } else {
        const scaledHeight = pdfHeight - 60;
        const scaledWidth = (scaledHeight * 800) / 600;
        pdf.addImage(imgData, 'PNG', 20, 50, scaledWidth, scaledHeight);
      }
      
      // Rodapé
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Relatório gerado automaticamente - Gestão de Pneus JC', 20, pdfHeight - 10);
      
      // Salvar
      const fileName = `${pageTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Salvando PDF:', fileName);
      pdf.save(fileName);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O arquivo foi baixado para seu dispositivo.",
      });
      
      setIsOpen(false);
      
    } catch (error) {
      console.error('=== ERRO NA GERAÇÃO DE PDF ===', error);
      toast({
        title: "Erro ao gerar PDF",
        description: `Falha: ${error.message}. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareWhatsApp = async () => {
    setIsGenerating(true);
    try {
      console.log('=== INICIANDO COMPARTILHAMENTO WHATSAPP ===');
      
      toast({
        title: "Preparando compartilhamento...",
        description: "Gerando imagem para WhatsApp.",
      });

      const imgData = await capturePageAsImage();
      console.log('Imagem capturada para WhatsApp');
      
      // Criar link para download da imagem
      const link = document.createElement('a');
      link.download = `${pageTitle.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.href = imgData;
      
      // Adicionar ao DOM temporariamente
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download da imagem iniciado');
      
      // Preparar mensagem para WhatsApp
      const whatsappMessage = encodeURIComponent(`Confira este relatório: ${pageTitle}`);
      const whatsappUrl = `https://web.whatsapp.com/send?text=${whatsappMessage}`;
      
      // Aguardar um pouco antes de abrir WhatsApp
      setTimeout(() => {
        console.log('Abrindo WhatsApp Web');
        window.open(whatsappUrl, '_blank');
      }, 1000);
      
      toast({
        title: "Imagem baixada!",
        description: "A imagem foi baixada e o WhatsApp será aberto.",
      });
      
      setIsOpen(false);
      
    } catch (error) {
      console.error('=== ERRO NO COMPARTILHAMENTO WHATSAPP ===', error);
      toast({
        title: "Erro ao compartilhar",
        description: `Falha: ${error.message}. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-primary/30 hover:border-primary/50 text-primary hover:text-primary"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Compartilhar Relatório
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex items-center gap-3 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Gerar PDF</div>
              <div className="text-xs opacity-90">Documento profissional</div>
            </div>
          </Button>
          
          <Button
            onClick={shareWhatsApp}
            disabled={isGenerating}
            className="flex items-center gap-3 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Compartilhar WhatsApp</div>
              <div className="text-xs opacity-90">Imagem da página</div>
            </div>
          </Button>
          
          {isGenerating && (
            <div className="text-center text-sm text-muted-foreground">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              Processando...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
