import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types/koperasi';

const STORAGE_KEY_SUPABASE_CONFIG = 'kop_mtb_supabase_config';

export const getStoredSupabaseConfig = (): SupabaseConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUPABASE_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored Supabase config', e);
  }
  return {
    url: '',
    anonKey: '',
    isConnected: false
  };
};

export const getSupabaseConfig = getStoredSupabaseConfig;

export const saveSupabaseConfig = (config: SupabaseConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Supabase config', e);
  }
};

export const getSupabaseClient = (config?: SupabaseConfig): SupabaseClient | null => {
  const currentConfig = config || getStoredSupabaseConfig();
  if (currentConfig.url && currentConfig.anonKey) {
    try {
      return createClient(currentConfig.url, currentConfig.anonKey);
    } catch (e) {
      console.error('Invalid Supabase configuration', e);
      return null;
    }
  }
  return null;
};

/**
 * Full PostgreSQL Schema DDL Script ready to be copied and run in Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- DATABASE SCHEMA: KOPERASI PRODUSEN MITRA TANI BERKAH
-- Siap di-copy dan paste langsung ke SQL Editor di Supabase Dashboard (Free Tier)
-- =========================================================================

-- 1. Tabel Anggota
CREATE TABLE IF NOT EXISTS public.anggota (
    id TEXT PRIMARY KEY,
    nomor_anggota TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    nik TEXT NOT NULL,
    alamat TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    luas_lahan NUMERIC DEFAULT 0,
    satuan_lahan TEXT DEFAULT 'Ha',
    komoditas TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Non-Aktif')),
    simpanan_pokok NUMERIC DEFAULT 100000,
    simpanan_wajib NUMERIC DEFAULT 0,
    simpanan_sukarela NUMERIC DEFAULT 0,
    tanggal_daftar DATE DEFAULT CURRENT_DATE,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabel Harga Acuan Komoditas Harian
CREATE TABLE IF NOT EXISTS public.commodity_prices (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL CHECK (kategori IN ('percabaian', 'sayuran_lain')),
    harga_acuan NUMERIC NOT NULL,
    satuan TEXT DEFAULT 'Kg',
    tanggal_update DATE DEFAULT CURRENT_DATE,
    keterangan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabel Transaksi Panen (Agribisnis Sayuran)
CREATE TABLE IF NOT EXISTS public.panen_transactions (
    id TEXT PRIMARY KEY,
    kode_nota TEXT NOT NULL UNIQUE,
    tanggal DATE DEFAULT CURRENT_DATE,
    anggota_id TEXT REFERENCES public.anggota(id) ON DELETE SET NULL,
    nama_anggota TEXT NOT NULL,
    no_hp TEXT,
    komoditas TEXT NOT NULL,
    kategori_komoditas TEXT NOT NULL CHECK (kategori_komoditas IN ('percabaian', 'sayuran_lain')),
    berat_kg NUMERIC NOT NULL,
    harga_per_kg NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    potongan_sukarela NUMERIC NOT NULL,
    potongan_wajib NUMERIC NOT NULL,
    total_potongan NUMERIC NOT NULL,
    total_bersih_petani NUMERIC NOT NULL,
    sharing_profit_koperasi NUMERIC NOT NULL,
    tipe_penjualan TEXT NOT NULL CHECK (tipe_penjualan IN ('Koperasi Mandiri', 'BUMDes')),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabel Toko Saprodi (Barang & Stok)
CREATE TABLE IF NOT EXISTS public.saprodi_items (
    id TEXT PRIMARY KEY,
    kode_barang TEXT NOT NULL UNIQUE,
    nama_barang TEXT NOT NULL,
    kategori TEXT NOT NULL,
    satuan TEXT NOT NULL,
    stok NUMERIC DEFAULT 0,
    stok_minimal NUMERIC DEFAULT 10,
    harga_beli NUMERIC NOT NULL,
    harga_jual NUMERIC NOT NULL,
    margin NUMERIC GENERATED ALWAYS AS (harga_jual - harga_beli) STORED,
    tanggal_update DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabel Arus Kas Saprodi
CREATE TABLE IF NOT EXISTS public.saprodi_cashflow (
    id TEXT PRIMARY KEY,
    tanggal DATE DEFAULT CURRENT_DATE,
    tipe TEXT NOT NULL CHECK (tipe IN ('Pemasukan', 'Pengeluaran')),
    kategori TEXT NOT NULL,
    keterangan TEXT NOT NULL,
    jumlah NUMERIC NOT NULL,
    referensi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabel Alat & Mesin Pertanian (Alsintan)
CREATE TABLE IF NOT EXISTS public.alsintan_items (
    id TEXT PRIMARY KEY,
    kode_alat TEXT NOT NULL UNIQUE,
    nama_alat TEXT NOT NULL,
    jenis TEXT NOT NULL,
    harga_sewa_hari NUMERIC NOT NULL,
    harga_sewa_jam NUMERIC NOT NULL,
    status TEXT DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Disewa', 'Perawatan')),
    kondisi TEXT DEFAULT 'Baik',
    lokasi TEXT DEFAULT 'Gudang Koperasi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabel Sewa Alsintan
CREATE TABLE IF NOT EXISTS public.alsintan_rentals (
    id TEXT PRIMARY KEY,
    kode_sewa TEXT NOT NULL UNIQUE,
    tanggal DATE DEFAULT CURRENT_DATE,
    alsintan_id TEXT REFERENCES public.alsintan_items(id) ON DELETE SET NULL,
    nama_alat TEXT NOT NULL,
    anggota_id TEXT REFERENCES public.anggota(id) ON DELETE SET NULL,
    nama_penyewa TEXT NOT NULL,
    kontak TEXT,
    durasi NUMERIC NOT NULL,
    satuan_durasi TEXT NOT NULL CHECK (satuan_durasi IN ('Hari', 'Jam')),
    tarif_satuan NUMERIC NOT NULL,
    total_biaya NUMERIC NOT NULL,
    status TEXT DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Selesai', 'Dibatalkan')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabel Transaksi Keuangan Brilink
CREATE TABLE IF NOT EXISTS public.brilink_transactions (
    id TEXT PRIMARY KEY,
    kode_transaksi TEXT NOT NULL UNIQUE,
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tipe TEXT NOT NULL,
    nominal NUMERIC NOT NULL,
    fee_admin NUMERIC NOT NULL,
    nama_nasabah TEXT NOT NULL,
    nomor_tujuan TEXT NOT NULL,
    status TEXT DEFAULT 'Berhasil',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabel Pengajuan Pinjaman (Simpan Pinjam)
CREATE TABLE IF NOT EXISTS public.loan_applications (
    id TEXT PRIMARY KEY,
    kode_pinjaman TEXT NOT NULL UNIQUE,
    tanggal_pengajuan DATE DEFAULT CURRENT_DATE,
    anggota_id TEXT REFERENCES public.anggota(id) ON DELETE CASCADE,
    nama_anggota TEXT NOT NULL,
    no_hp TEXT,
    total_simpanan_saat_ini NUMERIC NOT NULL,
    plafon_maksimal NUMERIC NOT NULL, -- Maksimal 2x total simpanan
    jumlah_pinjaman NUMERIC NOT NULL,
    tenor_bulan INT NOT NULL,
    bunga_persen_per_bulan NUMERIC DEFAULT 1.0,
    cicilan_bulanan NUMERIC NOT NULL,
    tujuan_pinjaman TEXT NOT NULL,
    status TEXT DEFAULT 'Menunggu Persetujuan' CHECK (status IN ('Menunggu Persetujuan', 'Disetujui', 'Dicairkan', 'Ditolak', 'Lunas')),
    tanggal_disetujui DATE,
    tanggal_dicairkan DATE,
    sisa_pinjaman NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabel Arus Kas Simpanan Anggota
CREATE TABLE IF NOT EXISTS public.savings_cashflow (
    id TEXT PRIMARY KEY,
    tanggal DATE DEFAULT CURRENT_DATE,
    anggota_id TEXT REFERENCES public.anggota(id) ON DELETE CASCADE,
    nama_anggota TEXT NOT NULL,
    jenis_simpanan TEXT NOT NULL CHECK (jenis_simpanan IN ('Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela', 'Penyertaan Modal Ketahanan Pangan')),
    tipe TEXT NOT NULL CHECK (tipe IN ('Masuk', 'Keluar')),
    jumlah NUMERIC NOT NULL,
    keterangan TEXT NOT NULL,
    metode TEXT DEFAULT 'Tunai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Tabel Biaya Operasional Bulanan & Modal Pangan
CREATE TABLE IF NOT EXISTS public.operational_expenses (
    id SERIAL PRIMARY KEY,
    bulan_tahun TEXT NOT NULL,
    gaji_pegawai NUMERIC DEFAULT 0,
    sewa_tempat NUMERIC DEFAULT 0,
    listrik_air NUMERIC DEFAULT 0,
    biaya_lain NUMERIC DEFAULT 0,
    penyertaan_modal_pangan NUMERIC DEFAULT 50000000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public access for demo / anon key:
ALTER TABLE public.anggota ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Anggota" ON public.anggota FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.commodity_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Commodity" ON public.commodity_prices FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.panen_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Panen" ON public.panen_transactions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.saprodi_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Saprodi" ON public.saprodi_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.saprodi_cashflow ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Saprodi Cashflow" ON public.saprodi_cashflow FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.alsintan_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Alsintan" ON public.alsintan_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.alsintan_rentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Rental" ON public.alsintan_rentals FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.brilink_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Brilink" ON public.brilink_transactions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Loans" ON public.loan_applications FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.savings_cashflow ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Write Savings" ON public.savings_cashflow FOR ALL USING (true) WITH CHECK (true);
`;

export const SUPABASE_SCHEMA_SQL = SUPABASE_SQL_SCHEMA;
