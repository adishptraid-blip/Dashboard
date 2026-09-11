import React from 'react';
import {
  Building2,
  FileCheck2,
  Users,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Calendar,
  CheckCircle,
  Download,
  Printer,
  ShieldAlert
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { KOPERASI_PROFILE } from '../../data/initialData';
import { exportToWord, exportToPdf } from '../../utils/exportUtils';

export const ProfilKoperasiView: React.FC = () => {
  const { anggotaList } = useKoperasi();

  const handleExportWord = () => {
    const html = `
      <h3>LEGALITAS RESMI</h3>
      <p><strong>SK Koperasi:</strong> ${KOPERASI_PROFILE.skKoperasi}</p>
      <p><strong>Nomor Induk Berusaha (NIB):</strong> ${KOPERASI_PROFILE.nib}</p>
      <p><strong>NPWP:</strong> ${KOPERASI_PROFILE.npwp}</p>
      <p><strong>Tanggal Berdiri:</strong> ${KOPERASI_PROFILE.tanggalBerdiri}</p>
      <hr/>
      <h3>VISI</h3>
      <p>${KOPERASI_PROFILE.visi}</p>
      <h3>MISI</h3>
      <ul>
        ${KOPERASI_PROFILE.misi.map(m => `<li>${m}</li>`).join('')}
      </ul>
      <hr/>
      <h3>SUSUNAN PENGURUS</h3>
      <table>
        <tr><th>Jabatan</th><th>Nama Lengkap</th></tr>
        ${KOPERASI_PROFILE.susunanPengurus.map(p => `<tr><td>${p.jabatan}</td><td>${p.nama}</td></tr>`).join('')}
      </table>
      <hr/>
      <h3>UNIT USAHA TERPADU</h3>
      <ul>
        ${KOPERASI_PROFILE.unitUsaha.map(u => `<li><strong>${u.nama}:</strong> ${u.deskripsi}</li>`).join('')}
      </ul>
    `;
    exportToWord('PROFIL DAN LEGALITAS KOPERASI', html, 'Profil_Koperasi_Produsen_Mitra_Tani_Berkah');
  };

  const handleExportPdf = () => {
    const headers = ['Komponen', 'Keterangan & Rincian'];
    const rows = [
      ['Nama Koperasi', KOPERASI_PROFILE.nama],
      ['SK Kemenkumham', KOPERASI_PROFILE.skKoperasi],
      ['NIB (Berusaha)', KOPERASI_PROFILE.nib],
      ['NPWP Koperasi', KOPERASI_PROFILE.npwp],
      ['Total Anggota', `${anggotaList.length} Petani Terdaftar`],
      ['Ketua Koperasi', 'H. Sudrajat Mandiri, S.E.'],
      ['Manager Operasional', 'Adi Saputra, S.P.'],
      ['Unit Usaha', '5 Unit (Saprodi, Alsintan, Agribisnis, Brilink, Simpan Pinjam)'],
      ['Alamat Kantor', `${KOPERASI_PROFILE.alamat}, ${KOPERASI_PROFILE.kabupatenKota}`]
    ];
    exportToPdf('PROFIL DAN IDENTITAS RESMI KOPERASI', headers, rows, 'Profil_Koperasi_Mitra_Tani');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Profil & Legalitas Resmi Koperasi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Informasi identitas hukum, visi misi, tata kelola, dan struktur organisasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-profil-word"
            onClick={handleExportWord}
            className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-blue-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Word (.doc)</span>
          </button>

          <button
            id="btn-export-profil-pdf"
            onClick={handleExportPdf}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Legalitas Card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <FileCheck2 className="w-4 h-4" />
              Legalitas Badan Hukum Terverifikasi
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {KOPERASI_PROFILE.nama}
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm max-w-2xl">
              Badan hukum koperasi produsen sektor pertanian hortikultura terdaftar resmi di Kementerian Hukum dan HAM Republik Indonesia serta OSS BKPM.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
              <div className="text-[11px] text-blue-200">Nomor SK Koperasi</div>
              <div className="text-xs font-bold font-mono text-white mt-1">
                {KOPERASI_PROFILE.skKoperasi}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
              <div className="text-[11px] text-blue-200">Nomor Induk Berusaha (NIB)</div>
              <div className="text-xs font-bold font-mono text-white mt-1">
                {KOPERASI_PROFILE.nib}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-blue-300 text-[11px] block">NPWP Koperasi</span>
            <span className="font-semibold">{KOPERASI_PROFILE.npwp}</span>
          </div>
          <div>
            <span className="text-blue-300 text-[11px] block">Tanggal Berdiri</span>
            <span className="font-semibold">{KOPERASI_PROFILE.tanggalBerdiri}</span>
          </div>
          <div>
            <span className="text-blue-300 text-[11px] block">Jumlah Anggota Aktif</span>
            <span className="font-semibold">{anggotaList.length} Anggota Terdaftar</span>
          </div>
          <div>
            <span className="text-blue-300 text-[11px] block">Jumlah Unit Usaha</span>
            <span className="font-semibold">5 Unit Usaha Mandiri</span>
          </div>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Visi Koperasi</h3>
          </div>
          <blockquote className="mt-4 p-4 rounded-xl bg-blue-50/60 border-l-4 border-blue-600 text-slate-800 text-sm italic leading-relaxed">
            "{KOPERASI_PROFILE.visi}"
          </blockquote>

          <div className="mt-6">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Prinsip Pokok Kerja Sama
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium text-slate-700">
                ✓ Kejujuran & Transparansi
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium text-slate-700">
                ✓ Bagi Hasil Berkeadilan
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium text-slate-700">
                ✓ Gotong Royong Petani
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium text-slate-700">
                ✓ Ketahanan Pangan Desa
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Misi Koperasi</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {KOPERASI_PROFILE.misi.map((m, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                  {idx + 1}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Struktur Pengurus & Unit Usaha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Susunan Pengurus */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Susunan Pengurus Koperasi
            </h3>
          </div>

          <div className="divide-y divide-slate-100 mt-3">
            {KOPERASI_PROFILE.susunanPengurus.map((p, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{p.nama}</div>
                  <div className="text-[11px] text-blue-600 font-medium">{p.jabatan}</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700">
                  Periode 2024 - 2029
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Unit Usaha */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Store className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              5 Unit Usaha Terpadu Koperasi
            </h3>
          </div>

          <div className="space-y-3 mt-3">
            {KOPERASI_PROFILE.unitUsaha.map((u, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs font-bold text-slate-900">{u.nama}</div>
                <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {u.deskripsi}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alamat & Kontak Resmi */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          Kantor Sekretariat & Alamat Resmi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-slate-400 font-medium">Alamat Lengkap</div>
            <div className="text-slate-800 font-semibold mt-1">
              {KOPERASI_PROFILE.alamat}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {KOPERASI_PROFILE.kecamatan}, {KOPERASI_PROFILE.kabupatenKota}, {KOPERASI_PROFILE.provinsi} {KOPERASI_PROFILE.kodePos}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-slate-400 font-medium">Kontak Telepon / WA</div>
            <div className="text-slate-800 font-semibold mt-1">
              {KOPERASI_PROFILE.telepon}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Layanan Administrasi & Petani
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-slate-400 font-medium">Email Resmi</div>
            <div className="text-slate-800 font-semibold mt-1">
              {KOPERASI_PROFILE.email}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Korespondensi Hukum & Mitra
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-slate-400 font-medium">Sistem Digital</div>
            <div className="text-slate-800 font-semibold mt-1">
              {KOPERASI_PROFILE.website}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Cloud Ready & Server Terpadu
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
