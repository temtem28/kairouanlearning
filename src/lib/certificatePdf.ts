import { jsPDF } from 'jspdf';

export interface CertificatePdfInput {
  userName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
}

/** Certificat PDF paysage (cahier des charges : nom étudiant, cours, téléchargement). */
export function downloadCertificatePdf(input: CertificatePdfInput): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, w, h, 'F');
  doc.setFillColor(212, 175, 55);
  doc.roundedRect(12, 12, w - 24, h - 24, 3, 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(16, 16, w - 32, h - 32, 2, 2, 'F');

  doc.setTextColor(6, 78, 59);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Kairouan Academy', w / 2, 42, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Certificat de réussite', w / 2, 56, { align: 'center' });

  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.4);
  doc.line(40, 64, w - 40, 64);

  doc.setFontSize(13);
  doc.text('Ce certificat est décerné à', w / 2, 82, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(input.userName, w / 2, 98, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('Pour avoir complété avec succès la formation', w / 2, 112, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  const courseLines = doc.splitTextToSize(input.courseName, w - 60);
  doc.text(courseLines, w / 2, 126, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Numéro : ${input.certificateNumber}`, w / 2, h - 38, { align: 'center' });
  doc.text(`Délivré le ${input.issuedAt}`, w / 2, h - 30, { align: 'center' });
  doc.text('Kairouan Éditions — academy.kairouaneditions.com', w / 2, h - 20, { align: 'center' });

  const safe = input.certificateNumber.replace(/[^a-zA-Z0-9-]/g, '_');
  doc.save(`certificat-${safe}.pdf`);
}
