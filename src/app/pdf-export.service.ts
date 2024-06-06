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

      html2canvas(element, { scale: 1 }).then(canvas => {              //1
        const imgData = canvas.toDataURL('image/png');                 //2
        const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);       //3
        const imgProps = pdf.getImageProperties(imgData);              //4
        const ratio = imgProps.height / imgProps.width;                //5
        const canvasHeight = pdfWidth * ratio;                         //6
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeight);    //7

        if (action === 'view') {
          const pdfOutput = pdf.output('blob');                        //8
          const pdfURL = URL.createObjectURL(pdfOutput);               //9
          window.open(pdfURL);                                         //10
        } else {
          pdf.save(pdfFileName);                                       //11
        }
      }).catch(error => {
        console.error('Error generating PDF', error);
      });
    } else {
      console.error('Element not found');
    }
  }
}



/*
===========
|| NOTES ||
===========

1. html2canvas(element, { scale: 1 }).then(canvas => { ... }
===============================================================
html2canvas :
This is a JavaScript library that allows you to take screenshots of web pages
or specific HTML elements. It renders HTML elements into a canvas object.

element :
This is the HTML element you want to capture.
It could be a specific DOM element or the entire page.

{ scale: 1 } :
This is an option object passed to html2canvas.
It specifies the scaling factor for rendering the HTML element into the canvas.
Example -
{ scale: 1 } indicates that there's no scaling. The canvas size remains the same as the original HTML element. It does not increase the file size.
{ scale: 3 } would mean the canvas is scaled up by a factor of 3, resulting in a canvas three times larger than the original HTML element. It increase the file size compared to the original HTML element.

then(canvas => { ... }) :
This is part of a promise chain. Once html2canvas finishes rendering the HTML element into a canvas, it returns a promise.
The then method executes when the promise is fulfilled, receiving the resulting canvas object as its argument.

2. const imgData = canvas.toDataURL('image/png');
====================================================
canvas.toDataURL('image/png') :
This method converts the content of the canvas into a data URL representing the image in PNG format.
The data URL is a base64-encoded string of the image data.

3. const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
=============================================================
new jsPDF('p', 'mm', [pdfWidth, pdfHeight]) :
This creates a new instance of the jsPDF class, which is a JavaScript library for generating PDF files in the browser.
The parameters passed to the constructor define the orientation ('p' for portrait), unit of measurement ('mm' for millimeters),
and the dimensions of the PDF document specified as an array [pdfWidth, pdfHeight].

4. const imgProps = pdf.getImageProperties(imgData);
=======================================================
pdf.getImageProperties(imgData) :
This method of the jsPDF instance gets the properties of the image specified by the data URL imgData.
These properties include the width, height, and other metadata of the image.

5. const ratio = imgProps.height / imgProps.width;
=====================================================
This calculates the aspect ratio of the image by dividing its height by its width.
This ratio will be used to maintain the aspect ratio when adding the image to the PDF.

6. const canvasHeight = pdfWidth * ratio;
============================================
This calculates the height of the canvas in the PDF while maintaining the aspect ratio.
It multiplies the width of the PDF (pdfWidth) by the aspect ratio (ratio) to get the height.

7. pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeight);
=================================================================
pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeight) :
This method of the jsPDF instance adds an image to the PDF document.
Here is a breakdown of the parameters:

imgData :
The image data in the form of a base64-encoded data URL.

'PNG' :
The format of the image. In this case, it's PNG.

0, 0 :
The x and y coordinates on the PDF where the top-left corner of the image will be placed.
(0, 0) places the image at the top-left corner of the PDF.

pdfWidth :
The width of the image in the PDF.

canvasHeight :
The height of the image in the PDF, maintaining the aspect ratio.

This method embeds the image into the PDF document at the specified position and size.

8. const pdfOutput = pdf.output('blob');
===========================================
pdf.output('blob') :
This method converts the PDF document created by jsPDF into a binary large object (Blob).
A Blob represents raw data, and in this case, it contains the PDF data.

9. const pdfURL = URL.createObjectURL(pdfOutput);
====================================================
URL.createObjectURL(pdfOutput) :
This method creates a URL representing the Blob.
This URL can be used to reference the Blob, allowing it to be opened or downloaded.

10. window.open(pdfURL);
===========================
This method opens a new browser window or tab with the URL pointing to the Blob.
This allows the user to view or download the generated PDF.

11. pdf.save(pdfFileName);
=============================
pdf.save :
This is a method of the jsPDF instance that triggers the download of the generated PDF document.
pdfFileName :
This is a string representing the name you want to give to the saved PDF file, including the .pdf extension.

*/
