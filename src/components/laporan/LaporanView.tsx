import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Layers,
  Users,
  Wallet,
  Store,
  Wheat,
  PieChart,
  CheckCircle2
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import {
  formatRupiah,
  formatAngka,
  exportToExcel,
  exportToWord,
  exportToPdf
} from '../../utils/exportUtils';

export const LaporanView: React.FC = () => {
  const {
    anggotaList,
    panenList,
    saprodiCashflow,
    hitungStatistikKeuangan,
    operationalExpense
  } = useKoperasi();

  const stats = hitungStatistikKeuangan();

  const [activeReportTab, setActiveReportTab] = useState<
    'simpanan' | 'panen' | 'aruskas' | 'labarugi'
  >('simpanan');

  // Export handlers
  const handleExportSimpananExcel = () => {
    const data = anggotaList.map(a => ({
      'Nomor Anggota': a.nomorAnggota,
      'Nama Anggota': a.nama,
      'Status': a.status,
      'Simpanan Pokok': a.simpananPokok,
      'Simpanan Wajib': a.simpananWajib,
      'Simpanan Sukarela': a.simpananSukarela,
      'Total Simpanan': a.simpananPokok + a.simpananWajib + a.simpananSukarela,
      'Plafon Maksimal Pinjaman': (a.simpananPokok + a.simpananWajib + a.simpananSukarela) * 2
    }));
    exportToExcel(data, `Laporan_Simpanan_${anggotaList.length}_Anggota`);
  };

  const handleExportSimpananPdf = () => {
    const headers = ['No. Anggota', 'Nama Petani', 'Status', 'Pokok', 'Wajib', 'Sukarela', 'Total Simpanan'];
    const rows = anggotaList.map(a => [
      a.nomorAnggota,
      a.nama,
      a.status,
      formatRupiah(a.simpananPokok),
      formatRupiah(a.simpananWajib),
      formatRupiah(a.simpananSukarela),
      formatRupiah(a.simpananPokok + a.simpananWajib + a.simpananSukarela)
    ]);
    exportToPdf('BUKU LAPORAN REKAPITULASI SIMPANAN ANGGOTA', headers, rows, 'Laporan_Simpanan');
  };

  const handleExportPanenExcel = () => {
    const data = panenList.map(p => ({
      'Kode Nota': p.kodeNota,
      'Tanggal': p.tanggal,
      'Petani': p.namaAnggota,
      'Komoditas': p.komoditas,
      'Berat (Kg)': p.beratKg,
      'Harga /Kg': p.hargaPerKg,
      'Subtotal Bruto': p.subtotal,
      'Potongan Sukarela': p.potonganSukarela,
      'Potongan Wajib': p.potonganWajib,
      'Total Potongan': p.totalPotongan,
      'Bersih Petani': p.totalBersihPetani,
      'Profit Koperasi': p.sharingProfitKoperasi
    }));
    exportToExcel(data, 'Laporan_Rekap_Panen_Sayuran');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Pusat Laporan Keuangan & Rekapitulasi
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ekspor laporan resmi dalam format Excel (.xlsx), Word (.doc), dan PDF siap cetak.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Halaman</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveReportTab('simpanan')}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeReportTab === 'simpanan'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
          }`}
        >
          <Wallet className="w-4 h-4 mb-2" />
          <div className="font-bold text-xs">1. Rekap Simpanan 93 Anggota</div>
          <div className={`text-[10px] mt-0.5 ${activeReportTab === 'simpanan' ? 'text-blue-100' : 'text-slate-400'}`}>
            Pokok, Wajib, Sukarela
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('panen')}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeReportTab === 'panen'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <Wheat className="w-4 h-4 mb-2" />
          <div className="font-bold text-xs">2. Rekap Transaksi Panen</div>
          <div className={`text-[10px] mt-0.5 ${activeReportTab === 'panen' ? 'text-emerald-100' : 'text-slate-400'}`}>
            Potongan Simpanan Otomatis
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('aruskas')}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeReportTab === 'aruskas'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
          }`}
        >
          <Store className="w-4 h-4 mb-2" />
          <div className="font-bold text-xs">3. Laporan Arus Kas Toko</div>
          <div className={`text-[10px] mt-0.5 ${activeReportTab === 'aruskas' ? 'text-amber-100' : 'text-slate-400'}`}>
            Pemasukan & Pengeluaran
          </div>
        </button>

        <button
          onClick={() => setActiveReportTab('labarugi')}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            activeReportTab === 'labarugi'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
          }`}
        >
          <PieChart className="w-4 h-4 mb-2" />
          <div className="font-bold text-xs">4. Laba Rugi & Distribusi SHU</div>
          <div className={`text-[10px] mt-0.5 ${activeReportTab === 'labarugi' ? 'text-indigo-100' : 'text-slate-400'}`}>
            Zakat 2.5% & Alokasi 35/5/30/30
          </div>
        </button>
      </div>

      {/* REPORT CONTENT: 1. SIMPANAN */}
      {activeReportTab === 'simpanan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Buku Rekapitulasi Simpanan 93 Anggota Terdaftar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Akumulasi Simpanan: <strong className="text-blue-700">{formatRupiah(stats.totalAkumulasiSimpanan)}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSimpananExcel}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Excel</span>
              </button>

              <button
                onClick={handleExportSimpananPdf}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Cetak PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">No. Anggota</th>
                  <th className="py-2.5 px-3">Nama Petani</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Simp. Pokok</th>
                  <th className="py-2.5 px-3 text-right">Simp. Wajib</th>
                  <th className="py-2.5 px-3 text-right">Simp. Sukarela</th>
                  <th className="py-2.5 px-3 text-right">Total Simpanan</th>
                  <th className="py-2.5 px-3 text-right">Plafon Pinjaman (2x)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {anggotaList.map(a => {
                  const total = a.simpananPokok + a.simpananWajib + a.simpananSukarela;
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 font-mono font-bold text-blue-700">{a.nomorAnggota}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{a.nama}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {a.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-slate-600">{formatRupiah(a.simpananPokok)}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-600">{formatRupiah(a.simpananWajib)}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-600">{formatRupiah(a.simpananSukarela)}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">{formatRupiah(total)}</td>
                      <td className="py-2 px-3 text-right font-bold text-blue-700">{formatRupiah(total * 2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 2. PANEN */}
      {activeReportTab === 'panen' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Laporan Hasil Panen & Akumulasi Potongan Simpanan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar lengkap potongan simpanan otomatis (Cabai Rp500/kg, Sayuran lain Rp150/kg).
              </p>
            </div>

            <button
              onClick={handleExportPanenExcel}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Kode Nota</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Petani</th>
                  <th className="py-2.5 px-3">Komoditas & Berat</th>
                  <th className="py-2.5 px-3 text-right">Harga/Kg</th>
                  <th className="py-2.5 px-3 text-right">Potongan Simpanan</th>
                  <th className="py-2.5 px-3 text-right">Bersih Petani</th>
                  <th className="py-2.5 px-3 text-right">Sharing Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {panenList.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{p.kodeNota}</td>
                    <td className="py-2.5 px-3 text-slate-500">{p.tanggal}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{p.namaAnggota}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold">{p.komoditas}</span> ({formatAngka(p.beratKg)} Kg)
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">{formatRupiah(p.hargaPerKg)}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-700">+{formatRupiah(p.totalPotongan)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatRupiah(p.totalBersihPetani)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-700">{formatRupiah(p.sharingProfitKoperasi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 3. ARUS KAS */}
      {activeReportTab === 'aruskas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Buku Arus Kas Harian & Transaksi Toko Saprodi
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Tipe Arus Kas</th>
                  <th className="py-2.5 px-3">Keterangan Transaksi</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {saprodiCashflow.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 text-slate-500">{c.tanggal}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.tipe === 'Pemasukan' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {c.tipe}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{c.keterangan}</td>
                    <td className="py-2.5 px-3 text-slate-500">{c.kategori}</td>
                    <td className={`py-2.5 px-3 text-right font-bold ${
                      c.tipe === 'Pemasukan' ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {c.tipe === 'Pemasukan' ? '+' : '-'}{formatRupiah(c.jumlah)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT CONTENT: 4. LABA RUGI & SHU */}
      {activeReportTab === 'labarugi' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Laporan Rekapitulasi Laba Rugi & Sisa Hasil Usaha (SHU)
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-900">Total Pendapatan Bruto (5 Unit Usaha):</span>
              <span className="text-blue-700">{formatRupiah(stats.totalPendapatanBruto)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Beban Usaha & Operasional (BOP):</span>
              <span className="text-red-700 font-semibold">-{formatRupiah(stats.totalBebanOperasional)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-800 font-semibold pt-1 border-t border-slate-200">
              <span>Laba Operasional Bersih Sebelum Zakat:</span>
              <span>{formatRupiah(stats.labaBersihSebelumZakat)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-800 font-medium">
              <span>Zakat Koperasi (2.5%):</span>
              <span className="font-semibold">-{formatRupiah(stats.zakatKoperasi2SetengahPersen)}</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-blue-900 pt-2 border-t border-slate-200">
              <span>Laba Bersih Final (Siap Bagi SHU):</span>
              <span>{formatRupiah(stats.pendapatanBersihSetelahZakat)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
