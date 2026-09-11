import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatAngka = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

export const formatTanggalIndo = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

/**
 * Export data table to Excel (.xlsx) file
 */
export const exportToExcel = (data: Record<string, any>[], fileName: string, sheetName: string = 'Laporan') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Export document to Microsoft Word (.doc) format with clean HTML formatting
 */
export const exportToWord = (title: string, htmlContent: string, fileName: string) => {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; margin: 2cm; }
        h1 { color: #0284c7; font-size: 18pt; text-align: center; margin-bottom: 4px; }
        h2 { color: #0f172a; font-size: 14pt; text-align: center; margin-top: 0; margin-bottom: 12px; }
        p.sub { text-align: center; color: #64748b; font-size: 9pt; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 15px; margin-bottom: 20px; }
        th { background-color: #0284c7; color: #ffffff; padding: 8px 10px; border: 1px solid #cbd5e1; text-align: left; font-size: 10pt; }
        td { padding: 6px 10px; border: 1px solid #cbd5e1; font-size: 9.5pt; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .summary-box { border: 1px solid #0284c7; padding: 12px; background-color: #f0f9ff; border-radius: 4px; margin-top: 15px; }
        .footer-sign { margin-top: 40px; width: 100%; }
      </style>
    </head>
    <body>
      <h1>KOPERASI PRODUSEN MITRA TANI BERKAH</h1>
      <h2>${title}</h2>
      <p class='sub'>Legalitas: SK Koperasi AHU-0004819.AH.01.26.TAHUN 2023 | NIB: 1904230058291<br>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
      <hr style="border: 1px solid #0284c7; margin-bottom: 20px;">
      ${htmlContent}
      <br><br>
      <table style="border: none; width: 100%; margin-top: 30px;">
        <tr style="border: none; background: transparent;">
          <td style="border: none; width: 50%; text-align: center;">
            Mengetahui,<br>
            <strong>Ketua Koperasi</strong><br><br><br><br>
            <u>H. Sudrajat Mandiri, S.E.</u>
          </td>
          <td style="border: none; width: 50%; text-align: center;">
            Petugas Koperasi,<br>
            <strong>Bagian Administrasi & Keuangan</strong><br><br><br><br>
            <u>Adi Saputra, S.P.</u>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', header], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export report to PDF format using jsPDF
 */
export const exportToPdf = (title: string, headers: string[], rows: (string | number)[][], fileName: string) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header
  doc.setFontSize(16);
  doc.setTextColor(2, 132, 199); // Sky/Blue 600
  doc.text('KOPERASI PRODUSEN MITRA TANI BERKAH', 14, 15);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text(title, 14, 22);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`SK AHU-0004819.AH.01.26.TAHUN 2023 | NIB: 1904230058291 | Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 27);

  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.5);
  doc.line(14, 29, 283, 29);

  // Simple auto table layout
  const startY = 35;
  const colWidth = Math.floor((283 - 14) / headers.length);
  const rowHeight = 7;
  let currentY = startY;

  // Header background
  doc.setFillColor(2, 132, 199);
  doc.rect(14, currentY, 269, rowHeight, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  headers.forEach((h, i) => {
    const x = 16 + (i * colWidth);
    doc.text(String(h).substring(0, 20), x, currentY + 5);
  });

  currentY += rowHeight;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  rows.forEach((row, rowIndex) => {
    if (currentY > 185) {
      doc.addPage();
      currentY = 20;
    }

    if (rowIndex % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 269, rowHeight, 'F');
    }

    doc.setTextColor(30, 41, 59);
    row.forEach((cell, cellIndex) => {
      const x = 16 + (cellIndex * colWidth);
      doc.text(String(cell ?? '').substring(0, 22), x, currentY + 5);
    });

    currentY += rowHeight;
  });

  doc.save(`${fileName}.pdf`);
};

/**
 * Generate formatted WhatsApp message text and direct share link for Nota Panen
 */
export const generateWhatsAppNota = (nota: {
  kodeNota: string;
  tanggal: string;
  namaPetani: string;
  nomorAnggota: string;
  noHp: string;
  komoditas: string;
  beratKg: number;
  hargaPerKg: number;
  subtotal: number;
  potonganSukarela: number;
  potonganWajib: number;
  totalPotongan: number;
  totalBersihPetani: number;
  tipePenjualan: string;
}): { text: string; waUrl: string } => {
  const cleanPhone = nota.noHp.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('0') 
    ? '62' + cleanPhone.slice(1) 
    : cleanPhone.startsWith('62') 
      ? cleanPhone 
      : '62' + cleanPhone;

  const text = `*BUKTI NOTA DIGITAL HASIL PANEN*
*KOPERASI PRODUSEN MITRA TANI BERKAH*
_SK AHU-0004819.AH.01.26.TAHUN 2023 | NIB: 1904230058291_
=================================
📄 *No. Nota:* ${nota.kodeNota}
📅 *Tanggal:* ${formatTanggalIndo(nota.tanggal)}
👤 *Nama Petani:* ${nota.namaPetani} (${nota.nomorAnggota})
🌱 *Komoditas:* ${nota.komoditas}
⚖️ *Volume Panen:* ${formatAngka(nota.beratKg)} Kg
💰 *Harga Acuan:* ${formatRupiah(nota.hargaPerKg)} /Kg
💵 *Subtotal Bruto:* ${formatRupiah(nota.subtotal)}
🤝 *Saluran Jual:* ${nota.tipePenjualan}
---------------------------------
📌 *POTONGAN SIMPANAN OTOMATIS:*
- Simpanan Sukarela: ${formatRupiah(nota.potonganSukarela)}
- Simpanan Wajib: ${formatRupiah(nota.potonganWajib)}
*Total Potongan Masuk Tabungan:* ${formatRupiah(nota.totalPotongan)}
=================================
✅ *TOTAL DITERIMA BERSIH PETANI:*
*${formatRupiah(nota.totalBersihPetani)}*
=================================
_Simpanan Anda telah otomatis ditambahkan ke buku saldo anggota di sistem Koperasi Mitra Tani Berkah._
_Terima kasih atas dedikasi dan kerja sama berkah memajukan pertanian mandiri!_`;

  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;

  return { text, waUrl };
};
