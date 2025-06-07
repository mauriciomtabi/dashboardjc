
export const parseExcelDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  // If it's a number (Excel serial date)
  if (typeof dateValue === 'number') {
    // Excel date starts from 1900-01-01, but JavaScript Date starts from 1970-01-01
    // Excel serial 1 = 1900-01-01, so we need to convert
    const excelEpoch = new Date(1900, 0, 1);
    const jsDate = new Date(excelEpoch.getTime() + (dateValue - 1) * 24 * 60 * 60 * 1000);
    return jsDate;
  }
  
  // If it's a string, try to parse it
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  return null;
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};
