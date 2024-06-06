import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  // Define page sizes in mm
  pageSizes: any = {
    'a3': { width: 297, height: 420 },
    'a4': { width: 210, height: 297 },
    'a5': { width: 148, height: 210 },
    'b4': { width: 250, height: 353 },
    'b5': { width: 176, height: 250 },
    'letter': { width: 216, height: 279 },
    'legal': { width: 216, height: 356 },
    'ledger': { width: 279, height: 432 },
    'tabloid': { width: 279, height: 432 },
    'executive': { width: 184, height: 267 }
  };

  public exportPDF(htmlContentId: string, pdfFileName: string, action: 'view' | 'download', pageSize: string): void {
    const element = document.getElementById(htmlContentId);
    if (element) {
      const { width: pdfWidth, height: pdfHeight } = this.pageSizes[pageSize] || this.pageSizes['a4'];

      html2canvas(element, { scale: 3 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = imgProps.height / imgProps.width;

        // Calculate the height that maintains the aspect ratio
        const canvasHeight = pdfWidth * ratio;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeight);

        if (action === 'view') {
          const pdfOutput = pdf.output('blob');
          const pdfURL = URL.createObjectURL(pdfOutput);
          window.open(pdfURL);
        } else {
          pdf.save(pdfFileName);
        }
      }).catch(error => {
        console.error('Error generating PDF', error);
      });
    } else {
      console.error('Element not found');
    }
  }
}
