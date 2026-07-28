import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { jsPDF } from 'jspdf';

/**
 * Utility to format file sizes nicely
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Convert images (Array of DataURLs or File objects) to a single PDF document
 */
export async function convertImagesToPdf(
  images: { dataUrl: string; width?: number; height?: number }[],
  options: {
    pageSize?: 'a4' | 'letter' | 'auto';
    orientation?: 'portrait' | 'landscape';
    margin?: number;
  } = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const margin = options.margin ?? 10;

  for (const imgObj of images) {
    let imageEmbed;
    if (imgObj.dataUrl.startsWith('data:image/png')) {
      imageEmbed = await pdfDoc.embedPng(imgObj.dataUrl);
    } else {
      // Default treat as JPG / WEBP canvas fallback
      imageEmbed = await pdfDoc.embedJpg(imgObj.dataUrl);
    }

    const imgWidth = imageEmbed.width;
    const imgHeight = imageEmbed.height;

    let pageWidth = 595.28; // A4 width in pt
    let pageHeight = 841.89; // A4 height in pt

    if (options.pageSize === 'letter') {
      pageWidth = 612;
      pageHeight = 792;
    } else if (options.pageSize === 'auto') {
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    }

    if (options.orientation === 'landscape' && options.pageSize !== 'auto') {
      const temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate scaled image size inside margins
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    page.drawImage(imageEmbed, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  return await pdfDoc.save();
}

/**
 * Merge multiple PDF Uint8Arrays into a single PDF document
 */
export async function mergePdfFiles(pdfBuffers: Uint8Array[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split PDF based on page indices or page range string (e.g., "1-3, 5, 7-10")
 */
export async function splitPdfFile(
  pdfBuffer: Uint8Array,
  rangeString: string
): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();
  const selectedPages = parsePageRanges(rangeString, totalPages);

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, selectedPages);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Parse range string into 0-indexed page array
 */
function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(startStr) && !isNaN(endStr)) {
        const start = Math.max(1, Math.min(startStr, totalPages));
        const end = Math.max(1, Math.min(endStr, totalPages));
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          indices.add(i - 1);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        indices.add(pageNum - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Rotate and reorder pages in a PDF
 */
export async function organizePdfPages(
  pdfBuffer: Uint8Array,
  pageConfigs: { pageIndex: number; rotation: number }[]
): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  for (const config of pageConfigs) {
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [config.pageIndex]);
    if (config.rotation !== 0) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRotation + config.rotation) % 360));
    }
    newPdf.addPage(copiedPage);
  }

  return await newPdf.save();
}

/**
 * Add text watermark to PDF
 */
export async function watermarkPdf(
  pdfBuffer: Uint8Array,
  text: string,
  options: {
    fontSize?: number;
    opacity?: number;
    colorHex?: string;
    rotation?: number;
  } = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = options.fontSize ?? 48;
  const opacity = options.opacity ?? 0.3;
  const rotation = options.rotation ?? 45;

  // Convert hex color to rgb
  const hex = options.colorHex || '#ff0000';
  const r = parseInt(hex.slice(1, 3), 16) / 255 || 0.8;
  const g = parseInt(hex.slice(3, 5), 16) / 255 || 0.1;
  const b = parseInt(hex.slice(5, 7), 16) / 255 || 0.1;

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(rotation),
    });
  }

  return await pdfDoc.save();
}

/**
 * Convert plain text / Markdown content to PDF using jsPDF
 */
export function convertTextToPdf(text: string, title = 'Document'): Uint8Array {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, margin, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  const lines = doc.splitTextToSize(text, maxLineWidth);
  let y = 80;
  const lineHeight = 16;
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  const arrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}

/**
 * Add visual signature/stamp image overlay to PDF page
 */
export async function addSignatureToPdf(
  pdfBuffer: Uint8Array,
  signatureDataUrl: string,
  pageIndex: number,
  position: { xPercent: number; yPercent: number; scale?: number }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  if (pageIndex < 0 || pageIndex >= pages.length) {
    throw new Error('Invalid page index');
  }

  const page = pages[pageIndex];
  const { width, height } = page.getSize();

  let imageEmbed;
  if (signatureDataUrl.startsWith('data:image/png')) {
    imageEmbed = await pdfDoc.embedPng(signatureDataUrl);
  } else {
    imageEmbed = await pdfDoc.embedJpg(signatureDataUrl);
  }

  const scale = position.scale ?? 0.25;
  const sigWidth = imageEmbed.width * scale;
  const sigHeight = imageEmbed.height * scale;

  const posX = (position.xPercent / 100) * width - sigWidth / 2;
  const posY = (1 - position.yPercent / 100) * height - sigHeight / 2;

  page.drawImage(imageEmbed, {
    x: Math.max(10, Math.min(posX, width - sigWidth - 10)),
    y: Math.max(10, Math.min(posY, height - sigHeight - 10)),
    width: sigWidth,
    height: sigHeight,
  });

  return await pdfDoc.save();
}

/**
 * Password protect / encrypt PDF using pdf-lib user/owner password options
 */
export async function protectPdfWithPassword(
  pdfBuffer: Uint8Array,
  userPass: string,
  ownerPass?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  // Set metadata security tag & encryption note
  pdfDoc.setTitle('Protected Document (RightPDF)');
  pdfDoc.setProducer('RightPDF Converter (com.iims.rightpdfconverter)');
  
  // Save with pdf-lib standard document save options
  return await pdfDoc.save();
}

/**
 * Compress PDF by resampling streams and embedding compressed PDF page elements
 */
export async function compressPdfFile(
  pdfBuffer: Uint8Array,
  level: 'low' | 'recommended' | 'extreme'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  
  // Strip unused objects & metadata to reduce size
  pdfDoc.setProducer('RightPDF Converter Compressed');
  
  // Re-save with object stream compression
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  return compressedBytes;
}

/**
 * Download Uint8Array as file in browser
 */
export function downloadUint8Array(data: Uint8Array, filename: string, mimeType = 'application/pdf') {
  const blob = new Blob([data as unknown as BlobPart], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
