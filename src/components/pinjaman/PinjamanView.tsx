import React, { useState } from 'react';
import {
  Coins,
  CheckCircle,
  XCircle,
  Clock,
  Banknote,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  Printer,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { LoanApplication } from '../../types/koperasi';
import {
  formatRupiah,
  exportToExcel,
  exportToWord,
  exportToPdf
} from '../../utils/exportUtils';

export const PinjamanView: React.FC = () => {
  const {
    loans,
    anggotaList,
    ajukanPinjaman,
    verifikasiPinjaman,
    cairkanPinjaman,
    hitungStatistikKeuangan
  } = useKoperasi();

  const stats = hitungStatistikKeuangan();

  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form pengajuan pinjaman
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnggotaId, setSelectedAnggotaId] = useState(anggotaList[0]?.id || '');
  const [jumlahPinjaman, setJumlahPinjaman] = useState(5000000);
  const [tenorBulan, setTenorBulan] = useState(6);
  const [tujuanPinjaman, setTujuanPinjaman] = useState('Pembelian pupuk & benih cabai musim tanam');
  const [formAlert, setFormAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedMember = anggotaList.find(a => a.id === selectedAnggotaId) || anggotaList[0];
  const totalSimpananMember = selectedMember
    ? selectedMember.simpananPokok + selectedMember.simpananWajib + selectedMember.simpananSukarela
    : 0;
  const plafonMaksimalMember = totalSimpananMember * 2;

  // Filtered loans
  const filteredLoans = loans.filter(l => {
    const matchSearch =
      l.namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.kodePinjaman.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'Semua' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmitPinjaman = (e: React.FormEvent) => {
    e.preventDefault();
    if (jumlahPinjaman > plafonMaksimalMember) {
      setFormAlert({
        type: 'error',
        message: `Pengajuan melebihi plafon! Maksimal pinjaman adalah 2x total simpanan (${formatRupiah(plafonMaksimalMember)}).`
      });
      return;
    }

    const res = ajukanPinjaman({
      anggotaId: selectedAnggotaId,
      jumlahPinjaman,
      tenorBulan,
      tujuanPinjaman
    });

    if (res.success) {
      setFormAlert({
        type: 'success',
        message: `Pengajuan pinjaman berhasil dibuat (${res.loan?.kodePinjaman}). Menunggu persetujuan Ketua/Pengurus.`
      });
      setTimeout(() => {
        setIsFormOpen(false);
        setFormAlert(null);
      }, 1500);
    } else {
      setFormAlert({ type: 'error', message: res.message });
    }
  };

  const handleExportExcel = () => {
    const data = filteredLoans.map(l => {
      const member = anggotaList.find(a => a.id === l.anggotaId);
      return {
        'Kode Pinjaman': l.kodePinjaman,
        'Tanggal': l.tanggalPengajuan,
        'Anggota': l.namaAnggota,
        'Nomor Anggota': member?.nomorAnggota || '-',
        'Jumlah Pinjaman': l.jumlahPinjaman,
        'Total Simpanan': l.totalSimpananSaatIni,
        'Plafon Maksimal': l.plafonMaksimal,
        'Tenor (Bulan)': l.tenorBulan,
        'Jasa Per Bulan (1%)': Math.round(l.jumlahPinjaman * 0.01),
        'Total Cicilan/Bulan': l.cicilanBulanan,
        'Tujuan': l.tujuanPinjaman,
        'Status': l.status
      };
    });
    exportToExcel(data, `Data_Pinjaman_Mitra_Tani_${filteredLoans.length}`);
  };

  const handleExportPdf = () => {
    const headers = ['Kode', 'Anggota', 'Pinjaman', 'Tenor', 'Cicilan/Bln', 'Status'];
    const rows = filteredLoans.map(l => [
      l.kodePinjaman,
      l.namaAnggota,
      formatRupiah(l.jumlahPinjaman),
      `${l.tenorBulan} Bln`,
      formatRupiah(l.cicilanBulanan),
      l.status
    ]);
    exportToPdf('LAPORAN PENGAJUAN DAN PENYALURAN PINJAMAN', headers, rows, 'Laporan_Pinjaman');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Pengajuan & Akad Pinjaman Anggota
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Alur verifikasi kredit usaha tani, validasi plafon (maksimal 2x total simpanan), dan persetujuan pengurus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            id="btn-tambah-pinjaman"
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Coins className="w-4 h-4" />
            <span>Ajukan Pinjaman Baru</span>
          </button>
        </div>
      </div>

      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Pinjaman Berjalan</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {formatRupiah(stats.totalPinjamanBerjalan)}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">
            Tersalurkan ke anggota produktif
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Pendapatan Jasa 1%</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            {formatRupiah(stats.pendapatanJasaPinjaman)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Kontribusi ke pendapatan unit usaha
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Menunggu Persetujuan</div>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {loans.filter(l => l.status === 'Menunggu Persetujuan').length} Berkas
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Memerlukan verifikasi Ketua/Pengurus
          </div>
        </div>
      </div>

      {/* Loan Application Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-blue-600" />
                Formulir Pengajuan Pinjaman Modal Tani
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formAlert && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold ${
                  formAlert.type === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {formAlert.message}
              </div>
            )}

            <form onSubmit={handleSubmitPinjaman} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Anggota Peminjam
                </label>
                <select
                  value={selectedAnggotaId}
                  onChange={e => setSelectedAnggotaId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                >
                  {anggotaList.map(a => {
                    const totalSimp = a.simpananPokok + a.simpananWajib + a.simpananSukarela;
                    return (
                      <option key={a.id} value={a.id}>
                        {a.nomorAnggota} - {a.nama} (Simpanan: {formatRupiah(totalSimp)} | Plafon: {formatRupiah(totalSimp * 2)})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Plafon Information Card */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                <div className="flex justify-between">
                  <span>Total Simpanan Saat Ini:</span>
                  <span className="font-bold">{formatRupiah(totalSimpananMember)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plafon Maksimal Pinjaman (2x):</span>
                  <strong className="text-blue-700">{formatRupiah(plafonMaksimalMember)}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Pinjaman (Rp)
                  </label>
                  <input
                    type="number"
                    min={500000}
                    step={100000}
                    value={jumlahPinjaman}
                    onChange={e => setJumlahPinjaman(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jangka Waktu (Tenor)
                  </label>
                  <select
                    value={tenorBulan}
                    onChange={e => setTenorBulan(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  >
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan (1 Musim)</option>
                    <option value={10}>10 Bulan</option>
                    <option value={12}>12 Bulan (1 Tahun)</option>
                  </select>
                </div>
              </div>

              {/* Simulation Box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Angsuran Pokok / Bulan:</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(Math.round(jumlahPinjaman / tenorBulan))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Jasa Koperasi (1% / Bulan):</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(Math.round(jumlahPinjaman * 0.01))}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                  <span>Estimasi Cicilan Total / Bulan:</span>
                  <span className="text-blue-600">
                    {formatRupiah(Math.round(jumlahPinjaman / tenorBulan + jumlahPinjaman * 0.01))}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tujuan Penggunaan Modal
                </label>
                <input
                  type="text"
                  value={tujuanPinjaman}
                  onChange={e => setTujuanPinjaman(e.target.value)}
                  placeholder="Contoh: Pembelian bibit cabai, mulsa, dan pupuk NPK"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari anggota / kode pinjaman..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs w-64 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['Semua', 'Menunggu Persetujuan', 'Disetujui', 'Dicairkan', 'Lunas'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">Kode & Tanggal</th>
                <th className="py-3 px-4">Anggota Peminjam</th>
                <th className="py-3 px-4 text-right">Simpanan & Plafon</th>
                <th className="py-3 px-4 text-right">Nominal Pinjaman</th>
                <th className="py-3 px-4 text-center">Tenor</th>
                <th className="py-3 px-4 text-right">Cicilan/Bulan (1% Jasa)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi / Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada berkas pinjaman ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLoans.map(l => {
                  const member = anggotaList.find(a => a.id === l.anggotaId);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900">{l.kodePinjaman}</div>
                        <div className="text-[10px] text-slate-400">{l.tanggalPengajuan}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{l.namaAnggota}</div>
                        <div className="text-[11px] text-blue-600 font-mono">
                          {member?.nomorAnggota || '-'}
                        </div>
                        <div className="text-[10px] text-slate-500 italic mt-0.5">
                          {l.tujuanPinjaman}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="text-slate-600 font-medium">
                          {formatRupiah(l.totalSimpananSaatIni)}
                        </div>
                        <div className="text-[10px] text-blue-700 font-semibold">
                          Plafon: {formatRupiah(l.plafonMaksimal)}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatRupiah(l.jumlahPinjaman)}
                      </td>

                      <td className="py-3 px-4 text-center font-medium">
                        {l.tenorBulan} Bulan
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatRupiah(l.cicilanBulanan)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            l.status === 'Dicairkan'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'Disetujui'
                              ? 'bg-blue-100 text-blue-800'
                              : l.status === 'Menunggu Persetujuan'
                              ? 'bg-amber-100 text-amber-800'
                              : l.status === 'Lunas'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {l.status === 'Menunggu Persetujuan' && (
                            <>
                              <button
                                onClick={() => verifikasiPinjaman(l.id, 'Disetujui')}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] flex items-center gap-1 transition-colors"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Setujui</span>
                              </button>
                              <button
                                onClick={() => verifikasiPinjaman(l.id, 'Ditolak')}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-red-700 font-semibold text-[10px] flex items-center gap-1 transition-colors"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}

                          {l.status === 'Disetujui' && (
                            <button
                              onClick={() => cairkanPinjaman(l.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] flex items-center gap-1 transition-colors"
                            >
                              <Banknote className="w-3 h-3" />
                              <span>Cairkan Dana</span>
                            </button>
                          )}

                          {l.status === 'Dicairkan' && (
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              Berjalan
                            </span>
                          )}

                          {l.status === 'Lunas' && (
                            <span className="text-[11px] text-slate-400 font-medium">Selesai</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
