export type KomoditasType = 
  | 'Bawang Daun'
  | 'Buncis'
  | 'Aneka Cabai'
  | 'Cabai Rawit Merah'
  | 'Cabai Keriting'
  | 'Kacang Panjang'
  | 'Pakcoy'
  | 'Pare'
  | 'Sawi'
  | 'Terong'
  | 'Tomat'
  | 'Kembang Kol'
  | 'Selada'
  | 'Leunca'
  | 'Jagung Manis';

export interface Anggota {
  id: string;
  nomorAnggota: string; // e.g. "KOP-MTB 0001"
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  luasLahan: number; // in Ha or m2
  satuanLahan: 'Ha' | 'm²';
  komoditas: string[];
  status: 'Aktif' | 'Non-Aktif';
  simpananPokok: number; // default Rp 100,000 at registration
  simpananWajib: number;
  simpananSukarela: number;
  tanggalDaftar: string;
  catatan?: string;
}

export interface CommodityPrice {
  id: string;
  nama: string;
  kategori: 'percabaian' | 'sayuran_lain';
  hargaAcuan: number;
  satuan: string;
  tanggalUpdate: string;
  keterangan?: string;
}

export interface PanenTransaction {
  id: string;
  kodeNota: string;
  tanggal: string;
  anggotaId: string;
  namaAnggota: string;
  noHp: string;
  komoditas: string;
  kategoriKomoditas: 'percabaian' | 'sayuran_lain';
  beratKg: number;
  hargaPerKg: number;
  subtotal: number;
  potonganSukarela: number; // Rp 400/kg for percabaian, Rp 100/kg for others
  potonganWajib: number;    // Rp 100/kg for percabaian, Rp 50/kg for others
  totalPotongan: number;
  totalBersihPetani: number;
  sharingProfitKoperasi: number; // Rp 100 - Rp 500/kg
  tipePenjualan: 'Koperasi Mandiri' | 'BUMDes';
  catatan?: string;
}

export interface SaprodiItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: 'Pupuk' | 'Pestisida & Obat' | 'Benih' | 'Alat & Perlengkapan' | 'Lainnya';
  satuan: string; // Karung (50kg), Botol (500ml), Bungkus, Pcs
  stok: number;
  stokMinimal: number;
  hargaBeli: number;
  hargaJual: number;
  margin: number;
  marginPersen: number;
  tanggalUpdate: string;
}

export interface SaprodiCashFlow {
  id: string;
  tanggal: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  kategori: 'Penjualan Barang' | 'Restock / Pembelian' | 'Operasional Toko' | 'Dana Taktis 10%';
  keterangan: string;
  jumlah: number;
  referensi?: string;
}

export interface AlsintanItem {
  id: string;
  kodeAlat: string;
  namaAlat: string;
  jenis: string;
  hargaSewaHari: number;
  hargaSewaJam: number;
  status: 'Tersedia' | 'Disewa' | 'Perawatan';
  kondisi: 'Sangat Baik' | 'Baik' | 'Perlu Servis';
  lokasi: string;
}

export interface AlsintanRental {
  id: string;
  kodeSewa: string;
  tanggal: string;
  alsintanId: string;
  namaAlat: string;
  anggotaId: string;
  namaPenyewa: string;
  kontak: string;
  durasi: number;
  satuanDurasi: 'Hari' | 'Jam';
  tarifSatuan: number;
  totalBiaya: number;
  status: 'Aktif' | 'Selesai' | 'Dibatalkan';
  tanggalSelesai?: string;
}

export interface BrilinkTransaction {
  id: string;
  kodeTransaksi: string;
  tanggal: string;
  tipe: 'Top-Up E-Wallet' | 'Tarik Tunai' | 'Transfer Bank' | 'PLN / Token' | 'Pulsa & Paket Data' | 'BPJS & Lainnya';
  nominal: number;
  feeAdmin: number;
  namaNasabah: string;
  nomorTujuan: string;
  status: 'Berhasil' | 'Pending' | 'Gagal';
}

export interface LoanApplication {
  id: string;
  kodePinjaman: string;
  tanggalPengajuan: string;
  anggotaId: string;
  namaAnggota: string;
  noHp: string;
  totalSimpananSaatIni: number;
  plafonMaksimal: number; // 2x total simpanan
  jumlahPinjaman: number;
  tenorBulan: number;
  bungaPersenPerBulan: number; // e.g. 1%
  cicilanBulanan: number;
  tujuanPinjaman: string;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Dicairkan' | 'Ditolak' | 'Lunas';
  tanggalDisetujui?: string;
  tanggalDicairkan?: string;
  sisaPinjaman: number;
}

export interface SavingsCashFlow {
  id: string;
  tanggal: string;
  anggotaId: string;
  namaAnggota: string;
  jenisSimpanan: 'Simpanan Pokok' | 'Simpanan Wajib' | 'Simpanan Sukarela' | 'Penyertaan Modal Ketahanan Pangan';
  tipe: 'Masuk' | 'Keluar';
  jumlah: number;
  keterangan: string;
  metode: 'Tunai' | 'Potongan Panen' | 'Transfer';
}

export interface OperationalExpense {
  gajiPegawai: number;
  sewaTempat: number;
  listrikDanAir: number;
  biayaOperasionalLain: number;
  penyertaanModalPangan: number;
}

export interface NotificationItem {
  id: string;
  judul: string;
  pesan: string;
  tipe: 'pinjaman' | 'stok' | 'panen' | 'keuangan' | 'anggota' | 'info';
  waktu: string;
  dibaca: boolean;
  targetModul?: string;
}

export type RoleType = 
  | 'Super Admin' 
  | 'Pengurus Koperasi' 
  | 'Bendahara Koperasi'
  | 'Admin Toko Saprodi' 
  | 'Admin Agribisnis' 
  | 'Petugas Lapangan & Kasir'
  | 'Petugas Sewa Alsintan'
  | 'Petugas Lapangan (Panen)'
  | 'Kasir Loket Brilink'
  | 'Anggota Tani';

export interface UserAccount {
  id: string;
  nama: string;
  username: string;
  role: RoleType;
  email: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSynced?: string;
}
