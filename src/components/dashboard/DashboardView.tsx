import React, { useState } from 'react';
import {
  Users,
  Wallet,
  Coins,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Wheat,
  Store,
  Tractor,
  Banknote,
  PiggyBank,
  Edit3,
  Save,
  X,
  Bell,
  Sparkles,
  Layers
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { formatRupiah, formatAngka } from '../../utils/exportUtils';
import { ActiveTabType } from '../layout/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTabType) => void;
  onOpenNotifications: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNotifications
}) => {
  const {
    anggotaList,
    hitungStatistikKeuangan,
    operationalExpense,
    updateOperationalExpense,
    notifications,
    markNotificationAsRead,
    panenList,
    loans
  } = useKoperasi();

  const stats = hitungStatistikKeuangan();

  // State for manual modal/modal ketahanan pangan editing
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [modalPanganInput, setModalPanganInput] = useState(
    operationalExpense.penyertaanModalPangan || 50000000
  );

  const handleSaveModal = () => {
    updateOperationalExpense({ penyertaanModalPangan: Number(modalPanganInput) });
    setIsEditingModal(false);
  };

  const pendingLoans = loans.filter(l => l.status === 'Menunggu Persetujuan');
  const recentHarvests = panenList.slice(0, 4);
  const unreadNotifications = notifications.filter(n => !n.dibaca).slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner with Cooperative Identity & Summary */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-500/10 pointer-events-none rounded-r-2xl transform skew-x-12 translate-x-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Operasional Digital Terpadu
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              KOPERASI PRODUSEN MITRA TANI BERKAH
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Memajukan kemandirian petani hortikultura melalui integrasi Toko Saprodi, Sewa Alsintan, Agribisnis Sayuran, Simpan Pinjam, dan Layanan Keuangan Desa.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="btn-quick-panen"
              onClick={() => onNavigate('unit-usaha')}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Wheat className="w-4 h-4" />
              <span>Input Panen Sayur</span>
            </button>

            <button
              id="btn-quick-anggota"
              onClick={() => onNavigate('anggota')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-all border border-white/20"
            >
              <Users className="w-4 h-4" />
              <span>Daftar Anggota (93)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Core Metric Cards (Statistik Anggota, Simpanan, Pinjaman, Pendapatan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Statistik Anggota */}
        <div 
          onClick={() => onNavigate('anggota')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Keanggotaan
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <div className="text-2xl font-bold text-slate-900">
              {anggotaList.length}
            </div>
            <span className="text-xs font-semibold text-blue-600">
              Anggota Terdaftar
            </span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {stats.totalAnggotaAktif} Aktif
            </span>
            <span className="text-slate-400">
              {stats.totalAnggotaNonAktif} Non-Aktif
            </span>
          </div>
        </div>

        {/* 2. Akumulasi Simpanan */}
        <div 
          onClick={() => onNavigate('laporan-simpanan')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Akumulasi Simpanan
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 truncate" title={formatRupiah(stats.totalAkumulasiSimpanan)}>
              {formatRupiah(stats.totalAkumulasiSimpanan)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pokok + Wajib + Sukarela + Modal
            </p>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Sukarela: {formatRupiah(stats.totalSimpananSukarela)}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </div>

        {/* 3. Ringkasan Pinjaman Berjalan */}
        <div 
          onClick={() => onNavigate('pinjaman')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pinjaman Berjalan
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 truncate">
              {formatRupiah(stats.totalPinjamanBerjalan)}
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">
              {loans.filter(l => l.status === 'Dicairkan').length} Akad Aktif Dicairkan
            </p>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="text-amber-600 font-medium">
              {pendingLoans.length > 0 ? `${pendingLoans.length} Menunggu Approval` : 'Plafon Max 2x Simpanan'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* 4. Pendapatan Bruto Terkini */}
        <div 
          onClick={() => onNavigate('keuangan')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pendapatan Bruto Unit
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 truncate">
              {formatRupiah(stats.totalPendapatanBruto)}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dari 5 Unit Usaha Terpadu
            </p>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-blue-600 font-semibold">
              Netto: {formatRupiah(stats.pendapatanBersihSetelahZakat)}
            </span>
            <span className="text-slate-400">SHU 35%</span>
          </div>
        </div>
      </div>

      {/* Detailed Simpanan Breakdown & Modal Ketahanan Pangan Manual Editor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-blue-600" />
              Rincian Akumulasi Simpanan & Ketahanan Pangan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola dan edit manual alokasi Simpanan Pokok, Wajib, Sukarela 93 anggota, dan Penyertaan Modal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditingModal ? (
              <button
                id="btn-edit-modal-pangan"
                onClick={() => setIsEditingModal(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Modal Pangan</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={modalPanganInput}
                  onChange={e => setModalPanganInput(Number(e.target.value))}
                  className="px-2.5 py-1 text-xs border border-blue-400 rounded-lg w-36 font-semibold"
                  placeholder="Rp..."
                />
                <button
                  id="btn-save-modal-pangan"
                  onClick={handleSaveModal}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
                <button
                  onClick={() => setIsEditingModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">1. Simpanan Pokok (Wajib Awal)</div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {formatRupiah(stats.totalSimpananPokok)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Rp 100.000 × {anggotaList.length} anggota
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">2. Simpanan Wajib</div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {formatRupiah(stats.totalSimpananWajib)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Iuran rutin + potongan panen otomatis
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 font-medium">3. Simpanan Sukarela</div>
            <div className="text-base font-bold text-slate-900 mt-1">
              {formatRupiah(stats.totalSimpananSukarela)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Alokasi panen & tabungan mandiri
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="text-xs text-blue-700 font-semibold flex items-center justify-between">
              <span>4. Modal Ketahanan Pangan</span>
              <span className="text-[10px] bg-blue-200/80 px-1.5 py-0.5 rounded text-blue-800">Manual</span>
            </div>
            <div className="text-base font-bold text-blue-950 mt-1">
              {formatRupiah(operationalExpense.penyertaanModalPangan || 0)}
            </div>
            <div className="text-[11px] text-blue-700 mt-0.5">
              Penyertaan dana ketahanan pangan
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Modern Notification Center & Recent Panen Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pusat Notifikasi Modern (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Pusat Notifikasi Modern
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pemberitahuan real-time transaksi & stok
                  </p>
                </div>
              </div>

              <button
                id="btn-open-all-notifications"
                onClick={onOpenNotifications}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Lihat Semua ({notifications.length})
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {unreadNotifications.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Semua notifikasi telah dibaca.
                </div>
              ) : (
                unreadNotifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        {n.judul}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {n.waktu}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {n.pesan}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={onOpenNotifications}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Buka Panel Notifikasi Lengkap
            </button>
          </div>
        </div>

        {/* Right: Transaksi Panen Terkini & Pembagian Unit Usaha (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Unit Usaha Performance Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  Kinerja 5 Unit Usaha Koperasi
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ringkasan kontribusi pendapatan kotor per unit usaha
                </p>
              </div>

              <button
                onClick={() => onNavigate('unit-usaha')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Buka Seluruh Unit
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-50 text-center border border-slate-100">
                <Wheat className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <div className="text-[11px] text-slate-500">Agribisnis Sayur</div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {formatRupiah(stats.pendapatanSharingProfitSayuran + stats.pendapatanBumdesSayuran)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-center border border-slate-100">
                <Store className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="text-[11px] text-slate-500">Toko Saprodi</div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {formatRupiah(stats.pendapatanSaprodiNetto)}
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">Potong 10% Taktis</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-center border border-slate-100">
                <Tractor className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                <div className="text-[11px] text-slate-500">Sewa Alsintan</div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {formatRupiah(stats.pendapatanSewaAlsintan)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-center border border-slate-100">
                <Banknote className="w-4 h-4 mx-auto text-sky-600 mb-1" />
                <div className="text-[11px] text-slate-500">Layanan Brilink</div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {formatRupiah(stats.pendapatanFeeBrilink)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-center border border-slate-100 col-span-2 sm:col-span-1">
                <PiggyBank className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <div className="text-[11px] text-slate-500">Simpan Pinjam</div>
                <div className="text-xs font-bold text-slate-900 mt-1">
                  {formatRupiah(stats.pendapatanJasaPinjaman)}
                </div>
              </div>
            </div>
          </div>

          {/* Transaksi Panen Terkini dengan Notifikasi Potongan Otomatis */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Transaksi Panen Petani Terkini
                </h3>
                <p className="text-[11px] text-slate-500">
                  Potongan simpanan otomatis (Cabai Rp500/kg, Sayuran lain Rp150/kg)
                </p>
              </div>

              <button
                onClick={() => onNavigate('unit-usaha')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Lihat Rekapitulasi
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Nota & Tanggal</th>
                    <th className="pb-2">Petani</th>
                    <th className="pb-2">Komoditas</th>
                    <th className="pb-2 text-right">Volume</th>
                    <th className="pb-2 text-right">Potongan Simpanan</th>
                    <th className="pb-2 text-right">Bersih Petani</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentHarvests.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5">
                        <div className="font-semibold text-slate-900">{p.kodeNota}</div>
                        <div className="text-[10px] text-slate-400">{p.tanggal}</div>
                      </td>
                      <td className="py-2.5 font-medium text-slate-800">
                        {p.namaAnggota}
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.komoditas}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-medium">
                        {formatAngka(p.beratKg)} Kg
                      </td>
                      <td className="py-2.5 text-right text-emerald-600 font-semibold">
                        +{formatRupiah(p.totalPotongan)}
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-900">
                        {formatRupiah(p.totalBersihPetani)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
