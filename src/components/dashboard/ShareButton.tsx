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
      const element = document.body;
      const canvas = await html2canvas(element, {
        height: window.innerHeight,
        width: window.innerWidth,
        useCORS: true,
        background: '#ffffff',
        logging: false,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Erro ao capturar página:', error);
      throw error;
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      console.log('Iniciando geração de PDF...');
      const imgData = await capturePageAsImage();
      console.log('Imagem capturada com sucesso');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Adicionar cabeçalho profissional
      pdf.setFontSize(20);
      pdf.setTextColor(59, 130, 246);
      pdf.text(pageTitle, 20, 25);
      
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      // Adicionar linha separadora
      pdf.setDrawColor(59, 130, 246);
      pdf.line(20, 40, pdfWidth - 20, 40);
      
      // Calcular dimensões da imagem
      const imgWidth = pdfWidth - 40;
      const imgHeight = (imgWidth * window.innerHeight) / window.innerWidth;
      
      if (imgHeight <= pdfHeight - 60) {
        pdf.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);
      } else {
        const scaledHeight = pdfHeight - 60;
        const scaledWidth = (scaledHeight * window.innerWidth) / window.innerHeight;
        pdf.addImage(imgData, 'PNG', 20, 50, scaledWidth, scaledHeight);
      }
      
      // Adicionar rodapé
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Relatório gerado automaticamente - Gestão de Pneus JC', 20, pdfHeight - 10);
      
      const fileName = `${pageTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Salvando PDF:', fileName);
      pdf.save(fileName);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: "O arquivo foi baixado para seu dispositivo.",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro durante a geração do PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareWhatsApp = async () => {
    setIsGenerating(true);
    try {
      console.log('Iniciando compartilhamento WhatsApp...');
      const imgData = await capturePageAsImage();
      console.log('Imagem capturada para WhatsApp');
      
      // Criar um link de download da imagem
      const link = document.createElement('a');
      link.download = `${pageTitle.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Criar mensagem para WhatsApp
      const whatsappMessage = encodeURIComponent(`Confira este relatório: ${pageTitle}`);
      const whatsappUrl = `https://web.whatsapp.com/send?text=${whatsappMessage}`;
      
      // Abrir WhatsApp em nova aba
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
      
      toast({
        title: "Imagem baixada!",
        description: "A imagem foi baixada e o WhatsApp será aberto para compartilhamento.",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao compartilhar no WhatsApp:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro durante o compartilhamento. Tente novamente.",
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
