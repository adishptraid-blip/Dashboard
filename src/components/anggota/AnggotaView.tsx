import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Edit2,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Coins,
  ShieldCheck,
  CreditCard,
  Save,
  X,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { Anggota, KomoditasType } from '../../types/koperasi';
import { formatRupiah, formatAngka, exportToExcel, exportToWord, exportToPdf } from '../../utils/exportUtils';

const ALL_KOMODITAS: KomoditasType[] = [
  'Bawang Daun',
  'Buncis',
  'Aneka Cabai',
  'Cabai Rawit Merah',
  'Cabai Keriting',
  'Kacang Panjang',
  'Pakcoy',
  'Pare',
  'Sawi',
  'Terong',
  'Tomat',
  'Kembang Kol',
  'Selada',
  'Leunca',
  'Jagung Manis'
];

export const AnggotaView: React.FC = () => {
  const {
    anggotaList,
    tambahAnggota,
    updateAnggota,
    getNextNomorAnggota
  } = useKoperasi();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Aktif' | 'Non-Aktif'>('Semua');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<Anggota | null>(null);

  // Form State for Add Member
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    alamat: '',
    noHp: '',
    luasLahan: 0.5,
    satuanLahan: 'Ha' as 'Ha' | 'm²',
    komoditas: ['Bawang Daun', 'Cabai Rawit Merah'],
    status: 'Aktif' as 'Aktif' | 'Non-Aktif',
    simpananWajib: 350000,
    simpananSukarela: 200000,
    catatan: ''
  });

  // Filtered List
  const filteredList = useMemo(() => {
    return anggotaList.filter(a => {
      const matchSearch =
        a.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.nik.includes(searchTerm) ||
        a.noHp.includes(searchTerm) ||
        a.alamat.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = filterStatus === 'Semua' || a.status === filterStatus;
      const matchKomoditas =
        filterKomoditas === 'Semua' || a.komoditas.includes(filterKomoditas);

      return matchSearch && matchStatus && matchKomoditas;
    });
  }, [anggotaList, searchTerm, filterStatus, filterKomoditas]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  // Submit Add Member
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik) {
      alert('Nama lengkap dan NIK wajib diisi!');
      return;
    }

    tambahAnggota({
      nama: formData.nama,
      nik: formData.nik,
      alamat: formData.alamat,
      noHp: formData.noHp,
      luasLahan: Number(formData.luasLahan),
      satuanLahan: formData.satuanLahan,
      komoditas: formData.komoditas,
      status: formData.status,
      simpananPokok: 100000, // mandatory Rp 100k
      simpananWajib: Number(formData.simpananWajib),
      simpananSukarela: Number(formData.simpananSukarela),
      catatan: formData.catatan
    });

    setShowAddModal(false);
    // Reset form
    setFormData({
      nama: '',
      nik: '',
      alamat: '',
      noHp: '',
      luasLahan: 0.5,
      satuanLahan: 'Ha',
      komoditas: ['Bawang Daun', 'Cabai Rawit Merah'],
      status: 'Aktif',
      simpananWajib: 350000,
      simpananSukarela: 200000,
      catatan: ''
    });
  };

  // Submit Edit Member
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnggota) return;

    updateAnggota(editingAnggota.id, {
      nama: editingAnggota.nama,
      nik: editingAnggota.nik,
      alamat: editingAnggota.alamat,
      noHp: editingAnggota.noHp,
      status: editingAnggota.status,
      luasLahan: Number(editingAnggota.luasLahan),
      komoditas: editingAnggota.komoditas,
      simpananPokok: Number(editingAnggota.simpananPokok),
      simpananWajib: Number(editingAnggota.simpananWajib),
      simpananSukarela: Number(editingAnggota.simpananSukarela),
      catatan: editingAnggota.catatan
    });

    setEditingAnggota(null);
  };

  // Export handlers
  const handleExportExcel = () => {
    const data = filteredList.map(a => {
      const totalSimpanan = a.simpananPokok + a.simpananWajib + a.simpananSukarela;
      const plafon = totalSimpanan * 2;
      return {
        'Nomor Anggota': a.nomorAnggota,
        'Nama Lengkap': a.nama,
        'NIK': a.nik,
        'Status': a.status,
        'No. HP / WA': a.noHp,
        'Alamat Domisili': a.alamat,
        'Luas Lahan': `${a.luasLahan} ${a.satuanLahan}`,
        'Komoditas Tanaman': a.komoditas.join(', '),
        'Simpanan Pokok': a.simpananPokok,
        'Simpanan Wajib': a.simpananWajib,
        'Simpanan Sukarela': a.simpananSukarela,
        'Total Simpanan': totalSimpanan,
        'Plafon Maksimal Pinjaman (2x)': plafon
      };
    });
    exportToExcel(data, `Daftar_Anggota_Mitra_Tani_${filteredList.length}_petani`);
  };

  const handleExportWord = () => {
    const tableRows = filteredList
      .map(
        a => `
        <tr>
          <td>${a.nomorAnggota}</td>
          <td><strong>${a.nama}</strong><br><small>${a.nik}</small></td>
          <td>${a.status}</td>
          <td>${a.noHp}</td>
          <td>${a.komoditas.join(', ')}</td>
          <td>${formatRupiah(a.simpananPokok)}</td>
          <td>${formatRupiah(a.simpananWajib)}</td>
          <td>${formatRupiah(a.simpananSukarela)}</td>
          <td><strong>${formatRupiah(a.simpananPokok + a.simpananWajib + a.simpananSukarela)}</strong></td>
          <td><span style="color: #0284c7; font-weight: bold;">${formatRupiah((a.simpananPokok + a.simpananWajib + a.simpananSukarela) * 2)}</span></td>
        </tr>
      `
      )
      .join('');

    const html = `
      <h3>BUKU REGISTER ANGGOTA DAN REKAP SALDO SIMPANAN</h3>
      <p>Total Anggota Terdata: ${filteredList.length} Orang</p>
      <table>
        <tr>
          <th>No. Anggota</th>
          <th>Nama & NIK</th>
          <th>Status</th>
          <th>Kontak</th>
          <th>Komoditas</th>
          <th>Simp. Pokok</th>
          <th>Simp. Wajib</th>
          <th>Simp. Sukarela</th>
          <th>Total Simpanan</th>
          <th>Plafon Pinjaman (2x)</th>
        </tr>
        ${tableRows}
      </table>
    `;
    exportToWord('BUKU DATA ANGGOTA KOPERASI', html, 'Register_Anggota_Koperasi');
  };

  const handleExportPdf = () => {
    const headers = ['No. Anggota', 'Nama Petani', 'Status', 'Komoditas', 'Simp. Pokok', 'Simp. Wajib', 'Simp. Sukarela', 'Total Simpanan', 'Plafon Pinjaman (2x)'];
    const rows = filteredList.map(a => {
      const total = a.simpananPokok + a.simpananWajib + a.simpananSukarela;
      return [
        a.nomorAnggota,
        a.nama,
        a.status,
        a.komoditas.slice(0, 2).join(', '),
        formatRupiah(a.simpananPokok),
        formatRupiah(a.simpananWajib),
        formatRupiah(a.simpananSukarela),
        formatRupiah(total),
        formatRupiah(total * 2)
      ];
    });
    exportToPdf('BUKU REGISTER ANGGOTA & VALIDASI PLAFON', headers, rows, 'Register_Anggota_Koperasi');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Manajemen Keanggotaan
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {anggotaList.length} Anggota
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Data biodata 93 anggota mitra tani, profil budidaya lahan, manajemen saldo simpanan, dan validasi plafon otomatis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-export-excel-anggota"
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            id="btn-export-word-anggota"
            onClick={handleExportWord}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Word (.doc)</span>
          </button>

          <button
            id="btn-export-pdf-anggota"
            onClick={handleExportPdf}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>PDF</span>
          </button>

          <button
            id="btn-tambah-anggota"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Anggota Baru</span>
          </button>
        </div>
      </div>

      {/* Info Card: Ketentuan Wajib & Plafon Otomatis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-900">
              Ketentuan Wajib Pendaftaran Anggota Baru
            </h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Nomor Anggota otomatis digenerate berikutnya (saat ini: <strong>{getNextNomorAnggota()}</strong>). Setiap pendaftaran baru <strong>wajib membayar Simpanan Pokok sebesar Rp 100.000</strong> (satu kali di awal pendaftaran).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-900">
              Validasi Plafon Pinjaman Otomatis (2x Simpanan)
            </h4>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              Sistem menghitung plafon pinjaman maksimal secara otomatis senilai <strong>2x dari total akumulasi simpanan</strong> (Pokok + Wajib + Sukarela) masing-masing anggota.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-anggota"
            type="text"
            placeholder="Cari nama, NIK, No. Anggota, desa..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            id="select-filter-status"
            value={filterStatus}
            onChange={e => {
              setFilterStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non-Aktif">Non-Aktif</option>
          </select>

          {/* Commodity Filter */}
          <select
            id="select-filter-komoditas"
            value={filterKomoditas}
            onChange={e => {
              setFilterKomoditas(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden max-w-xs"
          >
            <option value="Semua">Semua Komoditas</option>
            {ALL_KOMODITAS.map(k => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Anggota Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">No. Anggota</th>
                <th className="py-3 px-4">Biodata & Kontak</th>
                <th className="py-3 px-4">Profil Lahan & Komoditas</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Simp. Pokok</th>
                <th className="py-3 px-4 text-right">Simp. Wajib</th>
                <th className="py-3 px-4 text-right">Simp. Sukarela</th>
                <th className="py-3 px-4 text-right">Total Simpanan</th>
                <th className="py-3 px-4 text-right">Plafon Max (2x)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data anggota yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                paginatedList.map(a => {
                  const totalSimpanan = a.simpananPokok + a.simpananWajib + a.simpananSukarela;
                  const plafon = totalSimpanan * 2;

                  return (
                    <tr key={a.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {a.nomorAnggota}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{a.nama}</div>
                        <div className="text-[11px] text-slate-400 font-mono">NIK: {a.nik}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <a
                            href={`https://wa.me/62${a.noHp.replace(/\D/g, '').replace(/^0/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline text-emerald-700 font-medium"
                          >
                            {a.noHp}
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs" title={a.alamat}>
                          {a.alamat}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {a.luasLahan} {a.satuanLahan}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                          {a.komoditas.map(k => (
                            <span
                              key={k}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-slate-700">
                        {formatRupiah(a.simpananPokok)}
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-slate-700">
                        {formatRupiah(a.simpananWajib)}
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-slate-700">
                        {formatRupiah(a.simpananSukarela)}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatRupiah(totalSimpanan)}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-blue-700 whitespace-nowrap">
                        {formatRupiah(plafon)}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setEditingAnggota(a)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Edit Biodata & Saldo Simpanan"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan {Math.min(filteredList.length, (currentPage - 1) * itemsPerPage + 1)} -{' '}
            {Math.min(filteredList.length, currentPage * itemsPerPage)} dari {filteredList.length} anggota
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-700">
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Pendaftaran Anggota Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Formulir Pendaftaran Anggota Baru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID Anggota berikutnya:{' '}
                  <span className="font-mono font-bold text-blue-700">{getNextNomorAnggota()}</span>
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Lengkap Petani *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama}
                    onChange={e => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nomor Induk Kependudukan (NIK) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="16 digit NIK KTP"
                    value={formData.nik}
                    onChange={e => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    No. Handphone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08123456789"
                    value={formData.noHp}
                    onChange={e => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Status Keanggotaan
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Alamat Domisili Lengkap & RT/RW
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Desa Sukatani Makmur RT 02/03"
                  value={formData.alamat}
                  onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Profil Lahan & Komoditas */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">
                  Profil Usaha Tani & Komoditas
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Luas Lahan Garapan
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.luasLahan}
                        onChange={e => setFormData({ ...formData, luasLahan: Number(e.target.value) })}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                      <select
                        value={formData.satuanLahan}
                        onChange={e => setFormData({ ...formData, satuanLahan: e.target.value as any })}
                        className="p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Ha">Hektar (Ha)</option>
                        <option value="m²">m²</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Pilih Komoditas Utama
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-lg border border-slate-200">
                      {ALL_KOMODITAS.map(k => {
                        const isSelected = formData.komoditas.includes(k);
                        return (
                          <button
                            type="button"
                            key={k}
                            onClick={() => {
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  komoditas: formData.komoditas.filter(item => item !== k)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  komoditas: [...formData.komoditas, k]
                                });
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {k}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ketentuan Simpanan Pokok & Wajib */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">1. Simpanan Pokok (Wajib Pertama)</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Rp 100.000 (Otomatis)
                  </span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Sesuai AD/ART Koperasi Produsen Mitra Tani Berkah, simpanan pokok Rp 100.000 hanya dibayarkan 1x di awal pendaftaran.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      2. Setoran Awal Simpanan Wajib
                    </label>
                    <input
                      type="number"
                      value={formData.simpananWajib}
                      onChange={e => setFormData({ ...formData, simpananWajib: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      3. Setoran Awal Simpanan Sukarela
                    </label>
                    <input
                      type="number"
                      value={formData.simpananSukarela}
                      onChange={e => setFormData({ ...formData, simpananSukarela: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  Daftarkan Anggota Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Biodata & Saldo 93 Anggota */}
      {editingAnggota && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  Edit Biodata & Saldo Simpanan
                </h3>
                <p className="text-xs text-blue-700 font-mono font-bold mt-0.5">
                  {editingAnggota.nomorAnggota} - {editingAnggota.nama}
                </p>
              </div>

              <button
                onClick={() => setEditingAnggota(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Anggota</label>
                  <input
                    type="text"
                    value={editingAnggota.nama}
                    onChange={e => setEditingAnggota({ ...editingAnggota, nama: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={editingAnggota.status}
                    onChange={e => setEditingAnggota({ ...editingAnggota, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">No. HP / WA</label>
                  <input
                    type="text"
                    value={editingAnggota.noHp}
                    onChange={e => setEditingAnggota({ ...editingAnggota, noHp: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Luas Lahan ({editingAnggota.satuanLahan})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAnggota.luasLahan}
                    onChange={e => setEditingAnggota({ ...editingAnggota, luasLahan: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat</label>
                <input
                  type="text"
                  value={editingAnggota.alamat}
                  onChange={e => setEditingAnggota({ ...editingAnggota, alamat: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* Saldo Simpanan (Pokok, Wajib, Sukarela) yang bisa diedit manual */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Manajemen Saldo Simpanan Anggota</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Bisa diedit & simpan manual
                  </span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-medium">Simp. Pokok</label>
                    <input
                      type="number"
                      value={editingAnggota.simpananPokok}
                      onChange={e => setEditingAnggota({ ...editingAnggota, simpananPokok: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-medium">Simp. Wajib</label>
                    <input
                      type="number"
                      value={editingAnggota.simpananWajib}
                      onChange={e => setEditingAnggota({ ...editingAnggota, simpananWajib: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1 font-medium">Simp. Sukarela</label>
                    <input
                      type="number"
                      value={editingAnggota.simpananSukarela}
                      onChange={e => setEditingAnggota({ ...editingAnggota, simpananSukarela: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-medium">Plafon Pinjaman Otomatis (2x):</span>
                  <span className="text-emerald-950 font-bold text-sm">
                    {formatRupiah((editingAnggota.simpananPokok + editingAnggota.simpananWajib + editingAnggota.simpananSukarela) * 2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAnggota(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
