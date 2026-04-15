import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FinancialFact } from '../types/finance';
import { formatCurrency } from './formatters';

interface ExportData {
  companyName: string;
  cik: string;
  revenues: FinancialFact[];
  netIncome: FinancialFact[];
}

export const exportToCSV = (data: ExportData) => {
  const { companyName, revenues, netIncome } = data;
  const map = new Map<number, { revenue?: number; net?: number }>();
  
  revenues.filter(f => f.form === '10-K').forEach(f => {
    map.set(f.fy, { ...map.get(f.fy), revenue: f.val });
  });
  
  netIncome.filter(f => f.form === '10-K').forEach(f => {
    map.set(f.fy, { ...map.get(f.fy), net: f.val });
  });

  const timeline = Array.from(map.keys()).sort((a, b) => b - a);
  
  let out = `Analysis: ${companyName}\nID: ${data.cik}\n\n`;
  out += `Fiscal Year,Revenue,Net Income\n`;
  
  timeline.forEach(year => {
    const d = map.get(year);
    out += `${year},${d?.revenue || 0},${d?.net || 0}\n`;
  });

  const file = new Blob([out], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = `${companyName.toLowerCase().replace(/\s+/g, '_')}_data.csv`;
  a.click();
};

export const exportToPDF = (data: ExportData) => {
  const { companyName, cik, revenues, netIncome } = data;
  const doc = new jsPDF();

  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text('Financial Profile', 14, 25);
  
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text(companyName, 14, 35);
  
  doc.setFontSize(9);
  doc.text(`Reference ID: ${cik} | Date: ${new Date().toLocaleDateString()}`, 14, 42);

  const map = new Map<number, { r?: number; n?: number }>();
  revenues.filter(f => f.form === '10-K').forEach(f => map.set(f.fy, { ...map.get(f.fy), r: f.val }));
  netIncome.filter(f => f.form === '10-K').forEach(f => map.set(f.fy, { ...map.get(f.fy), n: f.val }));
  
  const years = Array.from(map.keys()).sort((a, b) => b - a);
  const rows = years.map(yr => {
    const d = map.get(yr);
    return [
      yr.toString(),
      d?.r ? formatCurrency(d.r) : '—',
      d?.n ? formatCurrency(d.n) : '—'
    ];
  });

  autoTable(doc, {
    startY: 55,
    head: [['Year', 'Total Revenue', 'Net Income']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 5 },
  });

  doc.save(`${companyName.toLowerCase().replace(/\s+/g, '_')}_profile.pdf`);
};

