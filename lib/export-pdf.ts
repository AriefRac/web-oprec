import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Peserta } from '@/types/peserta';

function formatStatus(status: string, p: Peserta): string {
  switch (status) {
    case 'wawancara':
      if (p.tanggal_wawancara && p.waktu_wawancara) return 'Wawancara';
      return 'Menunggu';
    case 'lulus':
      return 'Diterima';
    case 'tidak_lulus':
      return 'Tidak Diterima';
    default:
      return status;
  }
}

export function exportPesertaPDF(pesertaList: Peserta[]) {
  const doc = new jsPDF({ orientation: 'landscape' });

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Rekap Data Peserta Open Recruitment', 14, 15);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('HMPS Informatika UIN SMH Banten', 14, 22);
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 28);
  doc.text(`Total Peserta: ${pesertaList.length}`, 14, 34);

  // Table data
  const tableData = pesertaList.map((p, index) => [
    index + 1,
    p.nim,
    p.nama,
    formatStatus(p.status, p),
    p.status === 'wawancara' && p.tanggal_wawancara
      ? `${p.hari_wawancara || ''} ${p.tanggal_wawancara}`.trim()
      : '-',
    p.status === 'wawancara' ? p.waktu_wawancara || '-' : '-',
    p.status === 'wawancara' ? (p.lokasi_wawancara || 'Ormawa Lt 1 Fakultas Sains') : '-',
    p.bidang || '-',
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['No', 'NIM', 'Nama', 'Status', 'Tanggal', 'Jam', 'Lokasi', 'Bidang']],
    body: tableData,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [88, 28, 135], // purple-900
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 243, 255], // purple-50
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { cellWidth: 25 },
      4: { cellWidth: 35 },
      5: { cellWidth: 20 },
      6: { cellWidth: 45 },
      7: { cellWidth: 30 },
    },
  });

  // Save
  const fileName = `rekap-peserta-oprec-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
