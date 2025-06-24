
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { capturePageSections } from '@/utils/screenCapture';
import { generatePDFFromImages, downloadPDF, downloadPDFAsBlob } from '@/utils/pdfGenerator';
import { openWhatsApp, downloadImage } from '@/utils/whatsappShare';

export const useShareActions = (pageTitle: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (forWhatsApp = false) => {
    setIsGenerating(true);
    try {
      console.log('=== INICIANDO GERAÇÃO DE PDF ===');
      
      toast({
        title: forWhatsApp ? "Gerando PDF para WhatsApp..." : "Gerando PDF...",
        description: "Aguarde enquanto processamos sua solicitação.",
      });

      const images = await capturePageSections();
      console.log('Imagens capturadas com sucesso para PDF');
      
      const pdf = generatePDFFromImages(images, pageTitle);
      const fileName = `${pageTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      if (forWhatsApp) {
        downloadPDFAsBlob(pdf, fileName);
        
        setTimeout(() => {
          openWhatsApp(`Confira este relatório: ${pageTitle}`);
        }, 1000);
        
        toast({
          title: "PDF baixado para WhatsApp!",
          description: "O arquivo foi baixado e o WhatsApp será aberto.",
        });
      } else {
        downloadPDF(pdf, fileName);
        toast({
          title: "PDF gerado com sucesso!",
          description: "O arquivo foi baixado para seu dispositivo.",
        });
      }
      
    } catch (error) {
      console.error('=== ERRO NA GERAÇÃO DE PDF ===', error);
      toast({
        title: "Erro ao gerar PDF",
        description: `Falha: ${(error as Error).message}. Tente novamente.`,
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

      const images = await capturePageSections();
      console.log('Imagens capturadas para WhatsApp');
      
      const mainImage = images[0];
      const fileName = `${pageTitle.replace(/\s+/g, '_')}_${Date.now()}.png`;
      
      downloadImage(mainImage, fileName);
      
      setTimeout(() => {
        console.log('Abrindo WhatsApp Web');
        openWhatsApp(`Confira este relatório: ${pageTitle}`);
      }, 1000);
      
      toast({
        title: "Imagem baixada!",
        description: "A imagem foi baixada e o WhatsApp será aberto.",
      });
      
    } catch (error) {
      console.error('=== ERRO NO COMPARTILHAMENTO WHATSAPP ===', error);
      toast({
        title: "Erro ao compartilhar",
        description: `Falha: ${(error as Error).message}. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    shareWhatsApp,
    isGenerating
  };
};
