
import { jsPDF } from 'jspdf';

export const generatePDFFromImages = (images: string[], pageTitle: string): jsPDF => {
  const pdf = new jsPDF('l', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  // Add header
  pdf.setFontSize(24);
  pdf.setTextColor(59, 130, 246);
  pdf.text(pageTitle, 20, 25);
  
  pdf.setFontSize(12);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, 35);
  
  pdf.setDrawColor(59, 130, 246);
  pdf.line(20, 40, pdfWidth - 20, 40);
  
  let currentY = 50;
  const maxImageHeight = pdfHeight - 80;
  const maxImageWidth = pdfWidth - 40;
  
  images.forEach((imgData, index) => {
    if (index > 0) {
      pdf.addPage();
      currentY = 20;
    }
    
    const imgWidth = Math.min(maxImageWidth, 250);
    const imgHeight = Math.min(maxImageHeight, 150);
    const x = (pdfWidth - imgWidth) / 2;
    
    pdf.addImage(imgData, 'PNG', x, currentY, imgWidth, imgHeight);
  });
  
  // Add footer to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Relatório gerado automaticamente - Gestão de Pneus JC', 20, pdfHeight - 10);
    pdf.text(`Página ${i} de ${totalPages}`, pdfWidth - 40, pdfHeight - 10);
  }
  
  return pdf;
};

export const downloadPDF = (pdf: jsPDF, fileName: string): void => {
  pdf.save(fileName);
};

export const downloadPDFAsBlob = (pdf: jsPDF, fileName: string): void => {
  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
