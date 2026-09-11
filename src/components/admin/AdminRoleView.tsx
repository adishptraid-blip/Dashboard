import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  Database,
  Key,
  Globe,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Server,
  Cloud,
  FileCode,
  Terminal,
  Layers,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { RoleType } from '../../types/koperasi';
import { SUPABASE_SCHEMA_SQL, saveSupabaseConfig } from '../../utils/supabaseClient';

export const AdminRoleView: React.FC = () => {
  const {
    currentUser,
    setCurrentUserRole,
    supabaseConfig,
    updateSupabaseConfig
  } = useKoperasi();

  // Supabase Config States
  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available roles matching RoleType
  const roles: {
    id: RoleType;
    label: string;
    deskripsi: string;
    badge: string;
  }[] = [
    {
      id: 'Pengurus Koperasi',
      label: 'Ketua / Pengurus Utama',
      deskripsi: 'Akses penuh seluruh modul, persetujuan pinjaman, pencairan dana, dan pembagian SHU.',
      badge: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'Bendahara Koperasi',
      label: 'Bendahara Koperasi',
      deskripsi: 'Pengelolaan kas, jurnal keuangan, input simpanan, pencairan pinjaman, dan laporan laba rugi.',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'Admin Toko Saprodi',
      label: 'Petugas Toko Saprodi',
      deskripsi: 'Input pesanan barang, update harga harian, kelola stok pupuk/benih, dan kasir penjualan.',
      badge: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'Petugas Sewa Alsintan',
      label: 'Petugas Sewa Alsintan',
      deskripsi: 'Mencatat sewa traktor & pompa air, jadwal operasional mesin, dan laporan penerimaan sewa.',
      badge: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'Petugas Lapangan (Panen)',
      label: 'Petugas Lapangan (Panen)',
      deskripsi: 'Timbang hasil panen sayuran, potong simpanan otomatis, dan kirim nota via WhatsApp petani.',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'Kasir Loket Brilink',
      label: 'Kasir Loket Brilink',
      deskripsi: 'Melayani transfer bank, tarik tunai, top-up e-wallet, bayar listrik PLN, dan rekap fee admin.',
      badge: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'Anggota Tani',
      label: 'Anggota Tani',
      deskripsi: 'Melihat profil diri, riwayat simpanan pribadi, plafon pinjaman, dan katalog saprodi.',
      badge: 'bg-slate-100 text-slate-700'
    }
  ];

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      isConnected: Boolean(url.trim() && anonKey.trim())
    };
    updateSupabaseConfig(newConfig);
    saveSupabaseConfig(newConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Manajemen Role Pengguna & Integrasi Supabase
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola hak akses pengurus koperasi dan hubungkan database Cloud Supabase (Free Tier).
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher & Hierarchy */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Role Pengurus & Operator Saat Ini
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih role untuk mensimulasikan otorisasi tampilan antarmuka.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Aktif: {currentUser.role}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles.map(r => {
            const isSelected = currentUser.role === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setCurrentUserRole(r.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{r.label}</span>
                  {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  {r.deskripsi}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supabase Connection Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Konfigurasi Database Cloud Supabase (Free Tier)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Koperasi Mitra Tani Berkah dapat berjalan dengan persistensi cloud PostgreSQL gratisan.
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
            supabaseConfig.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${supabaseConfig.isConnected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
            {supabaseConfig.isConnected ? 'Terhubung ke Supabase' : 'Mode Penyimpanan Lokal'}
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Kredensial Supabase berhasil disimpan! Data siap disinkronkan ke Cloud Supabase.</span>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzproject.supabase.co"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:border-blue-500 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Dapat ditemukan di Supabase Dashboard → Settings → API
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:border-blue-500 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Gunakan Public `anon` key untuk akses browser yang aman
            </span>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              id="btn-save-supabase"
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Simpan Koneksi Supabase
            </button>
          </div>
        </form>
      </div>

      {/* SQL DDL Schema Generator (1-Click Copy for Supabase SQL Editor) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-600" />
              Skema DDL Database PostgreSQL / Supabase
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy skrip SQL di bawah ini dan jalankan pada <strong>SQL Editor</strong> di dashboard Supabase Anda untuk membuat seluruh tabel secara instan.
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-blue-200"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'Tersalin!' : 'Salin Skrip SQL'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed">
          {SUPABASE_SCHEMA_SQL}
        </pre>
      </div>

      {/* Hosting Guide for Free Tier (GitHub & Vercel) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          Panduan Hosting Gratisan (Vercel & GitHub)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Vercel Guide */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">▲</span>
              <span>1. Hosting Gratis di Vercel (Rekomendasi Utama)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>Buka <strong>vercel.com</strong> dan login dengan akun GitHub.</li>
              <li>Klik <strong>Add New... → Project</strong>, lalu pilih repositori proyek ini.</li>
              <li>Framework Preset akan otomatis terdeteksi sebagai <strong>Vite</strong>.</li>
              <li>Pastikan Build Command: <code className="bg-slate-200 px-1 rounded">npm run build</code> dan Output: <code className="bg-slate-200 px-1 rounded">dist</code>.</li>
              <li>Klik <strong>Deploy</strong>. Aplikasi langsung online dengan domain gratis <code className="text-blue-600">*.vercel.app</code> dan SSL HTTPS otomatis!</li>
            </ol>
          </div>

          {/* GitHub Pages Guide */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">🐙</span>
              <span>2. Hosting di GitHub Pages</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>Push seluruh source code ke GitHub.</li>
              <li>Buka menu <strong>Settings → Pages</strong> pada repositori GitHub Anda.</li>
              <li>Pilih source: <strong>GitHub Actions</strong> (Vite deployment).</li>
              <li>Situs web otomatis ter-deploy dan aktif di <code className="text-blue-600">username.github.io/repo-name</code> secara cuma-cuma selamanya.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
