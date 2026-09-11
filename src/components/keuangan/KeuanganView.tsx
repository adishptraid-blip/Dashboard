import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  Printer,
  Sparkles,
  Edit2,
  Save,
  Layers,
  Scale,
  Building2
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import {
  formatRupiah,
  exportToExcel,
  exportToWord,
  exportToPdf
} from '../../utils/exportUtils';

export const KeuanganView: React.FC = () => {
  const {
    hitungStatistikKeuangan,
    operationalExpense,
    updateOperationalExpense
  } = useKoperasi();

  const stats = hitungStatistikKeuangan();

  // State to edit operational expenses
  const [isEditingBOP, setIsEditingBOP] = useState(false);
  const [bopForm, setBopForm] = useState({
    gajiPegawai: operationalExpense.gajiPegawai,
    sewaTempat: operationalExpense.sewaTempat,
    listrikDanAir: operationalExpense.listrikDanAir,
    biayaOperasionalLain: operationalExpense.biayaOperasionalLain,
    penyertaanModalPangan: operationalExpense.penyertaanModalPangan
  });

  const handleSaveBOP = (e: React.FormEvent) => {
    e.preventDefault();
    updateOperationalExpense(bopForm);
    setIsEditingBOP(false);
  };

  const handleExportExcel = () => {
    const data = [
      { Kategori: 'PENDAPATAN', Komponen: 'Agribisnis Sayuran (Sharing Profit)', Nominal: stats.pendapatanSharingProfitSayuran },
      { Kategori: 'PENDAPATAN', Komponen: 'Agribisnis Sayuran (Mitra BUMDes)', Nominal: stats.pendapatanBumdesSayuran },
      { Kategori: 'PENDAPATAN', Komponen: 'Toko Saprodi (Margin Bersih)', Nominal: stats.pendapatanSaprodiNetto },
      { Kategori: 'PENDAPATAN', Komponen: 'Dana Taktis Saprodi (10%)', Nominal: stats.danaTaktisSaprodi10Persen },
      { Kategori: 'PENDAPATAN', Komponen: 'Sewa Alsintan', Nominal: stats.pendapatanSewaAlsintan },
      { Kategori: 'PENDAPATAN', Komponen: 'Fee Transaksi Brilink', Nominal: stats.pendapatanFeeBrilink },
      { Kategori: 'PENDAPATAN', Komponen: 'Jasa Pinjaman Anggota (1%)', Nominal: stats.pendapatanJasaPinjaman },
      { Kategori: 'TOTAL PENDAPATAN', Komponen: 'Total Bruto 5 Unit Usaha', Nominal: stats.totalPendapatanBruto },
      { Kategori: 'BIAYA OPERASIONAL', Komponen: 'Total Beban Usaha & BOP', Nominal: stats.totalOperasionalBulanan },
      { Kategori: 'LABA OPERASIONAL', Komponen: 'Laba Bersih Sebelum Zakat', Nominal: stats.pendapatanBersihSebelumZakat },
      { Kategori: 'ZAKAT KOPERASI (2.5%)', Komponen: 'Zakat Perniagaan Otomatis', Nominal: stats.potonganZakat2_5 },
      { Kategori: 'HASIL BERSIH', Komponen: 'Netto Setelah Zakat', Nominal: stats.pendapatanBersihSetelahZakat },
      { Kategori: 'DISTRIBUSI SHU', Komponen: 'SHU Anggota (35%)', Nominal: stats.alokasiSHU35 },
      { Kategori: 'DISTRIBUSI SHU', Komponen: 'Dana Pendidikan & Pembinaan (5%)', Nominal: stats.alokasiPembinaan5 },
      { Kategori: 'DISTRIBUSI SHU', Komponen: 'Biaya Operasional BOP (30%)', Nominal: stats.alokasiBOP30 },
      { Kategori: 'DISTRIBUSI SHU', Komponen: 'Cadangan Modal Koperasi (30%)', Nominal: stats.alokasiCadangan30 }
    ];
    exportToExcel(data, 'Laporan_Keuangan_Laba_Rugi_SHU');
  };

  const handleExportPdf = () => {
    const headers = ['Pos Akun', 'Rincian / Keterangan', 'Nominal (Rp)'];
    const rows = [
      ['Pendapatan Unit', 'Agribisnis Sayuran (Sharing Profit)', formatRupiah(stats.pendapatanSharingProfitSayuran)],
      ['Pendapatan Unit', 'Agribisnis Sayuran (Kemitraan BUMDes)', formatRupiah(stats.pendapatanBumdesSayuran)],
      ['Pendapatan Unit', 'Toko Saprodi (Netto setelah taktis 10%)', formatRupiah(stats.pendapatanSaprodiNetto)],
      ['Pendapatan Unit', 'Sewa Alsintan Pertanian', formatRupiah(stats.pendapatanSewaAlsintan)],
      ['Pendapatan Unit', 'Fee Transaksi Brilink', formatRupiah(stats.pendapatanFeeBrilink)],
      ['Pendapatan Unit', 'Jasa Pinjaman Koperasi (1%)', formatRupiah(stats.pendapatanJasaPinjaman)],
      ['Total Bruto', 'Total Pendapatan 5 Unit Usaha', formatRupiah(stats.totalPendapatanBruto)],
      ['Beban', 'Total Beban Operasional', `-${formatRupiah(stats.totalOperasionalBulanan)}`],
      ['Laba Sebelum Zakat', 'Laba Bersih Usaha', formatRupiah(stats.pendapatanBersihSebelumZakat)],
      ['Zakat Koperasi', 'Zakat 2.5% Otomatis', `-${formatRupiah(stats.potonganZakat2_5)}`],
      ['Laba Bersih Final', 'Netto Setelah Zakat', formatRupiah(stats.pendapatanBersihSetelahZakat)],
      ['Alokasi SHU (35%)', 'Hak Bagi Hasil Anggota', formatRupiah(stats.alokasiSHU35)],
      ['Alokasi SHU (5%)', 'Pendidikan & Pembinaan Petani', formatRupiah(stats.alokasiPembinaan5)],
      ['Alokasi SHU (30%)', 'BOP Operasional', formatRupiah(stats.alokasiBOP30)],
      ['Alokasi SHU (30%)', 'Cadangan Modal Koperasi', formatRupiah(stats.alokasiCadangan30)]
    ];
    exportToPdf('LAPORAN LABA RUGI & DISTRIBUSI SHU KOPERASI', headers, rows, 'Laba_Rugi_SHU');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Laporan Keuangan, Margin & Distribusi SHU
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kalkulasi Laba Rugi 5 unit usaha, alokasi Dana Taktis 10%, Zakat Otomatis 2.5%, dan Pembagian SHU (35% SHU, 5% Pembinaan, 30% BOP, 30% Cadangan).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Pendapatan Bruto</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2">
            {formatRupiah(stats.totalPendapatanBruto)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dari 5 unit usaha terpadu</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Beban Operasional (BOP)</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-red-700 mt-2">
            {formatRupiah(stats.totalOperasionalBulanan)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Gaji, utilitas & operasional</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Zakat Koperasi (2.5%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700 mt-2">
            {formatRupiah(stats.potonganZakat2_5)}
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">2.5% dari laba bersih usaha</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Netto Setelah Zakat</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-900 mt-2">
            {formatRupiah(stats.pendapatanBersihSetelahZakat)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dasar distribusi SHU 100%</p>
        </div>
      </div>

      {/* SHU Distribution Scheme Cards (35%, 5%, 30%, 30%) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Ketentuan Distribusi Sisa Hasil Usaha (SHU) Koperasi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Alokasi sesuai Anggaran Dasar: 35% SHU Anggota, 5% Pendidikan & Pembinaan, 30% BOP, 30% Cadangan Modal.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            Total Netto: {formatRupiah(stats.pendapatanBersihSetelahZakat)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between text-xs text-blue-800 font-bold">
              <span>1. SHU Anggota</span>
              <span className="bg-blue-200 px-2 py-0.5 rounded font-mono">35%</span>
            </div>
            <div className="text-xl font-bold text-blue-950 mt-2">
              {formatRupiah(stats.alokasiSHU35)}
            </div>
            <p className="text-[11px] text-blue-700 mt-1">
              Dibagikan kepada 93 anggota proporsional simpanan & transaksi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
              <span>2. Dana Pembinaan</span>
              <span className="bg-emerald-200 px-2 py-0.5 rounded font-mono">5%</span>
            </div>
            <div className="text-xl font-bold text-emerald-950 mt-2">
              {formatRupiah(stats.alokasiPembinaan5)}
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">
              Pelatihan budidaya, riset benih, dan penyuluhan tani.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
              <span>3. Dana Operasional (BOP)</span>
              <span className="bg-amber-200 px-2 py-0.5 rounded font-mono">30%</span>
            </div>
            <div className="text-xl font-bold text-amber-950 mt-2">
              {formatRupiah(stats.alokasiBOP30)}
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              Pengembangan layanan dan kelancaran operasional.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
            <div className="flex items-center justify-between text-xs text-purple-800 font-bold">
              <span>4. Cadangan Koperasi</span>
              <span className="bg-purple-200 px-2 py-0.5 rounded font-mono">30%</span>
            </div>
            <div className="text-xl font-bold text-purple-950 mt-2">
              {formatRupiah(stats.alokasiCadangan30)}
            </div>
            <p className="text-[11px] text-purple-700 mt-1">
              Memperkuat modal mandiri dan mitigasi risiko usaha.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column: Breakdown Pendapatan 5 Unit Usaha & Biaya Operasional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Detail Pendapatan 5 Unit Usaha */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Rincian Pendapatan 5 Unit Usaha</span>
            <span className="text-xs font-bold text-blue-600">
              {formatRupiah(stats.totalPendapatanBruto)}
            </span>
          </h3>

          <div className="divide-y divide-slate-100 mt-3 text-xs">
            <div className="py-2.5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">1. Agribisnis Sayuran (Sharing Profit)</div>
                <div className="text-[10px] text-slate-400">Rp 100 - Rp 500 / Kg panen</div>
              </div>
              <span className="font-bold text-slate-900">
                {formatRupiah(stats.pendapatanSharingProfitSayuran)}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">2. Agribisnis Sayuran (Mitra BUMDes)</div>
                <div className="text-[10px] text-slate-400">Distribusi hasil bumi kemitraan</div>
              </div>
              <span className="font-bold text-slate-900">
                {formatRupiah(stats.pendapatanBumdesSayuran)}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">3. Toko Saprodi (Netto)</div>
                <div className="text-[10px] text-slate-400">
                  Laba kotor dipotong Dana Taktis 10% ({formatRupiah(stats.danaTaktisSaprodi10Persen)})
                </div>
              </div>
              <span className="font-bold text-slate-900">
                {formatRupiah(stats.pendapatanSaprodiNetto)}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">4. Sewa Alsintan</div>
                <div className="text-[10px] text-slate-400">Traktor, pompa air & mesin pertanian</div>
              </div>
              <span className="font-bold text-slate-900">
                {formatRupiah(stats.pendapatanSewaAlsintan)}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">5. Layanan Brilink</div>
                <div className="text-[10px] text-slate-400">Akumulasi fee transaksi loket desa</div>
              </div>
              <span className="font-bold text-slate-900">
                {formatRupiah(stats.pendapatanFeeBrilink)}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">6. Jasa Pinjaman Anggota</div>
                <div className="text-[10px] text-slate-400">Jasa 1% dari pinjaman produktif</div>
              </div>
              <span className="font-bold text-slate-900">
                {formatRupiah(stats.pendapatanJasaPinjaman)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Beban Operasional BOP (Dapat diedit manual) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Beban Operasional Usaha</h3>
              <p className="text-[11px] text-slate-500">Biaya rutin manajemen & operasional</p>
            </div>

            <button
              onClick={() => setIsEditingBOP(!isEditingBOP)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{isEditingBOP ? 'Batal' : 'Edit Biaya'}</span>
            </button>
          </div>

          {!isEditingBOP ? (
            <div className="divide-y divide-slate-100 mt-3 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-600">Gaji Karyawan & Pengelola:</span>
                <span className="font-bold text-slate-900">{formatRupiah(operationalExpense.gajiPegawai)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-600">Sewa Tempat & Kantor:</span>
                <span className="font-bold text-slate-900">{formatRupiah(operationalExpense.sewaTempat)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-600">Listrik, Air & Internet:</span>
                <span className="font-bold text-slate-900">{formatRupiah(operationalExpense.listrikDanAir)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-600">Penyertaan Modal Ketahanan Pangan:</span>
                <span className="font-bold text-slate-900">{formatRupiah(operationalExpense.penyertaanModalPangan)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-600">Biaya Operasional Lainnya:</span>
                <span className="font-bold text-slate-900">{formatRupiah(operationalExpense.biayaOperasionalLain)}</span>
              </div>
              <div className="pt-3 flex justify-between items-center font-bold text-sm text-red-700">
                <span>Total Beban Operasional:</span>
                <span>{formatRupiah(stats.totalOperasionalBulanan)}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveBOP} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">Gaji Pegawai / Pengelola</label>
                <input
                  type="number"
                  value={bopForm.gajiPegawai}
                  onChange={e => setBopForm({ ...bopForm, gajiPegawai: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Sewa Tempat & Gudang</label>
                <input
                  type="number"
                  value={bopForm.sewaTempat}
                  onChange={e => setBopForm({ ...bopForm, sewaTempat: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Listrik & Air</label>
                <input
                  type="number"
                  value={bopForm.listrikDanAir}
                  onChange={e => setBopForm({ ...bopForm, listrikDanAir: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Penyertaan Modal Ketahanan Pangan</label>
                <input
                  type="number"
                  value={bopForm.penyertaanModalPangan}
                  onChange={e => setBopForm({ ...bopForm, penyertaanModalPangan: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Biaya Operasional Lainnya</label>
                <input
                  type="number"
                  value={bopForm.biayaOperasionalLain}
                  onChange={e => setBopForm({ ...bopForm, biayaOperasionalLain: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBOP(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                >
                  Simpan Biaya
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
