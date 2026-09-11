import { 
  Anggota, 
  CommodityPrice, 
  PanenTransaction,
  SaprodiItem, 
  SaprodiCashFlow, 
  AlsintanItem, 
  AlsintanRental, 
  BrilinkTransaction, 
  LoanApplication, 
  SavingsCashFlow, 
  OperationalExpense, 
  NotificationItem,
  UserAccount
} from '../types/koperasi';

// Seed generator for 93 Members as requested
const FIRST_NAMES = [
  'Sutrisno', 'Dadang', 'Ujang', 'Asep', 'Sukarna', 'Slamet', 'Wahyudi', 'Joko', 
  'Supriadi', 'Mulyadi', 'Bambang', 'Wawan', 'Nanang', 'Endang', 'Rahmat', 'Cecep', 
  'Hasan', 'Mahmud', 'Kusnadi', 'Saepudin', 'Rustam', 'Iman', 'Agus', 'Surya', 
  'Marni', 'Siti Aminah', 'Eni Sulastri', 'Rohayati', 'Nunung', 'Titin', 'Komariah',
  'Yayan', 'Dedi', 'Budi', 'Ahmad', 'Solehudin', 'Sunardi', 'Karyono', 'Teguh',
  'Yusuf', 'Basri', 'Darmawan', 'Suherman', 'Rudi', 'Hendra', 'Haryanto', 'Fahrur'
];

const LAST_NAMES = [
  'Pratama', 'Hidayat', 'Saputra', 'Kurniawan', 'Santoso', 'Gunawan', 'Wijaya', 
  'Kusuma', 'Sanjaya', 'Permana', 'Nugraha', 'Setiawan', 'Firmansyah', 'Budiman', 
  'Subagja', 'Wibowo', 'Siregar', 'Hutagalung', 'Subekti', 'Kosasih', 'Sumarna'
];

const DESA_LIST = [
  'Desa Berkah Sari, RT 02/RW 04',
  'Desa Sukatani Makmur, RT 01/RW 02',
  'Desa Cikupa Subur, RT 03/RW 01',
  'Desa Margaluyu Asri, RT 04/RW 03',
  'Desa Pasir Mas, RT 02/RW 05',
  'Desa Lembang Tani, RT 01/RW 06',
  'Desa Rancabango, RT 05/RW 02'
];

const KOMODITAS_OPTIONS = [
  ['Bawang Daun', 'Cabai Rawit Merah'],
  ['Cabai Keriting', 'Tomat'],
  ['Pakcoy', 'Sawi', 'Buncis'],
  ['Kacang Panjang', 'Terong'],
  ['Kembang Kol', 'Selada'],
  ['Jagung Manis', 'Pare'],
  ['Aneka Cabai', 'Bawang Daun', 'Tomat'],
  ['Leunca', 'Terong', 'Pakcoy'],
  ['Cabai Rawit Merah', 'Buncis', 'Selada'],
  ['Bawang Daun', 'Pakcoy', 'Kembang Kol']
];

export const INITIAL_93_MEMBERS: Anggota[] = Array.from({ length: 93 }, (_, index) => {
  const num = index + 1;
  const numFormatted = String(num).padStart(4, '0');
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index * 3) % LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const desa = DESA_LIST[index % DESA_LIST.length];
  const commodities = KOMODITAS_OPTIONS[index % KOMODITAS_OPTIONS.length];
  
  // Status: 88 Aktif, 5 Non-Aktif
  const isNonActive = index === 14 || index === 32 || index === 54 || index === 71 || index === 89;
  const status = isNonActive ? 'Non-Aktif' : 'Aktif';

  // Simpanan Pokok: Rp 100.000 wajib per anggota
  const simpananPokok = 100000;
  // Simpanan Wajib: Rp 300.000 - Rp 2.500.000 (kelipatan 50rb)
  const simpananWajib = 350000 + ((index * 25000) % 2000000);
  // Simpanan Sukarela: Rp 150.000 - Rp 4.500.000
  const simpananSukarela = 200000 + ((index * 45000) % 3800000);

  const nik = `3205${String(100000000000 + (index * 137459)).substring(0, 12)}`;
  const noHp = `08${12 + (index % 8)}${String(10000000 + (index * 83741)).substring(0, 8)}`;
  const luasLahan = Number((0.4 + ((index * 0.17) % 3.2)).toFixed(2));

  return {
    id: `agt-${num}`,
    nomorAnggota: `KOP-MTB ${numFormatted}`,
    nama: fullName,
    nik,
    alamat: `${desa}, Kec. Agrotani`,
    noHp,
    luasLahan,
    satuanLahan: 'Ha',
    komoditas: commodities,
    status,
    simpananPokok,
    simpananWajib,
    simpananSukarela,
    tanggalDaftar: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 25) + 1).padStart(2, '0')}`,
    catatan: isNonActive ? 'Sedang masa transisi ke luar kota' : 'Mitra petani binaan aktif'
  };
});

export const INITIAL_COMMODITY_PRICES: CommodityPrice[] = [
  { id: 'cp-1', nama: 'Cabai Rawit Merah', kategori: 'percabaian', hargaAcuan: 42000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Kualitas Grade A Super' },
  { id: 'cp-2', nama: 'Cabai Keriting', kategori: 'percabaian', hargaAcuan: 36000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Merah segar petik pagi' },
  { id: 'cp-3', nama: 'Aneka Cabai', kategori: 'percabaian', hargaAcuan: 30000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Cabai hijau & teropong campur' },
  { id: 'cp-4', nama: 'Bawang Daun', kategori: 'sayuran_lain', hargaAcuan: 14500, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Batang putih gemuk bersih' },
  { id: 'cp-5', nama: 'Buncis', kategori: 'sayuran_lain', hargaAcuan: 11000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Buncis muda baby/standar' },
  { id: 'cp-6', nama: 'Tomat', kategori: 'sayuran_lain', hargaAcuan: 9500, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Tomat apel merah ranum' },
  { id: 'cp-7', nama: 'Pakcoy', kategori: 'sayuran_lain', hargaAcuan: 6500, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Pakcoy sendok segar higienis' },
  { id: 'cp-8', nama: 'Kacang Panjang', kategori: 'sayuran_lain', hargaAcuan: 8500, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Polong hijau padat' },
  { id: 'cp-9', nama: 'Sawi', kategori: 'sayuran_lain', hargaAcuan: 5500, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Sawi manis & sawi hijau' },
  { id: 'cp-10', nama: 'Terong', kategori: 'sayuran_lain', hargaAcuan: 7000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Terong ungu mengkilap' },
  { id: 'cp-11', nama: 'Kembang Kol', kategori: 'sayuran_lain', hargaAcuan: 15000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Bunga padat putih bersih' },
  { id: 'cp-12', nama: 'Selada', kategori: 'sayuran_lain', hargaAcuan: 12500, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Selada keriting hijau renyah' },
  { id: 'cp-13', nama: 'Pare', kategori: 'sayuran_lain', hargaAcuan: 6000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Pare hijau bergerigi rata' },
  { id: 'cp-14', nama: 'Leunca', kategori: 'sayuran_lain', hargaAcuan: 13000, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Butiran hijau segar' },
  { id: 'cp-15', nama: 'Jagung Manis', kategori: 'sayuran_lain', hargaAcuan: 7500, satuan: 'Kg', tanggalUpdate: '2026-09-11', keterangan: 'Tongkol berbiji penuh' }
];

export const INITIAL_SAPRODI_ITEMS: SaprodiItem[] = [
  {
    id: 'sap-1',
    kodeBarang: 'SPD-PK-01',
    namaBarang: 'Pupuk NPK Mutiara 16-16-16 (50 Kg)',
    kategori: 'Pupuk',
    satuan: 'Karung',
    stok: 45,
    stokMinimal: 10,
    hargaBeli: 785000,
    hargaJual: 835000,
    margin: 50000,
    marginPersen: 6.37,
    tanggalUpdate: '2026-09-10'
  },
  {
    id: 'sap-2',
    kodeBarang: 'SPD-PK-02',
    namaBarang: 'Pupuk Urea Petrokimia (50 Kg)',
    kategori: 'Pupuk',
    satuan: 'Karung',
    stok: 60,
    stokMinimal: 15,
    hargaBeli: 290000,
    hargaJual: 315000,
    margin: 25000,
    marginPersen: 8.62,
    tanggalUpdate: '2026-09-10'
  },
  {
    id: 'sap-3',
    kodeBarang: 'SPD-OB-01',
    namaBarang: 'Fungisida Antracol 70WP 1 Kg',
    kategori: 'Pestisida & Obat',
    satuan: 'Bungkus',
    stok: 28,
    stokMinimal: 8,
    hargaBeli: 142000,
    hargaJual: 160000,
    margin: 18000,
    marginPersen: 12.68,
    tanggalUpdate: '2026-09-10'
  },
  {
    id: 'sap-4',
    kodeBarang: 'SPD-OB-02',
    namaBarang: 'Insektisida Curacron 500EC (500 ml)',
    kategori: 'Pestisida & Obat',
    satuan: 'Botol',
    stok: 7, // Menipis for modern notification demo!
    stokMinimal: 10,
    hargaBeli: 128000,
    hargaJual: 145000,
    margin: 17000,
    marginPersen: 13.28,
    tanggalUpdate: '2026-09-09'
  },
  {
    id: 'sap-5',
    kodeBarang: 'SPD-BN-01',
    namaBarang: 'Benih Cabai Rawit Ori 212 (10 gr)',
    kategori: 'Benih',
    satuan: 'Sachet',
    stok: 35,
    stokMinimal: 12,
    hargaBeli: 85000,
    hargaJual: 98000,
    margin: 13000,
    marginPersen: 15.29,
    tanggalUpdate: '2026-09-11'
  },
  {
    id: 'sap-6',
    kodeBarang: 'SPD-BN-02',
    namaBarang: 'Benih Tomat Servo F1 Panah Merah',
    kategori: 'Benih',
    satuan: 'Sachet',
    stok: 4, // Menipis
    stokMinimal: 10,
    hargaBeli: 110000,
    hargaJual: 125000,
    margin: 15000,
    marginPersen: 13.64,
    tanggalUpdate: '2026-09-08'
  },
  {
    id: 'sap-7',
    kodeBarang: 'SPD-AL-01',
    namaBarang: 'Mulsa Plastik Hitam Perak 80cm x 500m',
    kategori: 'Alat & Perlengkapan',
    satuan: 'Roll',
    stok: 18,
    stokMinimal: 5,
    hargaBeli: 330000,
    hargaJual: 365000,
    margin: 35000,
    marginPersen: 10.61,
    tanggalUpdate: '2026-09-07'
  }
];

export const INITIAL_SAPRODI_CASHFLOW: SaprodiCashFlow[] = [
  { id: 'scf-1', tanggal: '2026-09-08', tipe: 'Pemasukan', kategori: 'Penjualan Barang', keterangan: 'Penjualan 10 Karung NPK Mutiara ke Kelompok Tani 2', jumlah: 8350000, referensi: 'INV-SPD-089' },
  { id: 'scf-2', tanggal: '2026-09-09', tipe: 'Pengeluaran', kategori: 'Restock / Pembelian', keterangan: 'Pembelian Stok Benih dan Obat Distributor PT Tani Makmur', jumlah: 5400000, referensi: 'PO-DST-331' },
  { id: 'scf-3', tanggal: '2026-09-10', tipe: 'Pemasukan', kategori: 'Penjualan Barang', keterangan: 'Penjualan eceran fungisida, mulsa, dan benih petani', jumlah: 3450000, referensi: 'CSH-SPD-102' },
  { id: 'scf-4', tanggal: '2026-09-11', tipe: 'Pengeluaran', kategori: 'Dana Taktis 10%', keterangan: 'Alokasi Dana Taktis 10% unit saprodi untuk cadangan tak terduga', jumlah: 1180000, referensi: 'ALOK-DT-09' }
];

export const INITIAL_ALSINTAN_ITEMS: AlsintanItem[] = [
  {
    id: 'als-1',
    kodeAlat: 'ALT-TRK-01',
    namaAlat: 'Traktor Roda Dua Quick G1000 Boxer Mesin Kubota 8.5 HP',
    jenis: 'Traktor Olah Tanah',
    hargaSewaHari: 250000,
    hargaSewaJam: 40000,
    status: 'Tersedia',
    kondisi: 'Sangat Baik',
    lokasi: 'Gudang Utama Koperasi'
  },
  {
    id: 'als-2',
    kodeAlat: 'ALT-RTV-01',
    namaAlat: 'Mesin Cultivator Mini Honda F220 Penghalus Guludan',
    jenis: 'Cultivator',
    hargaSewaHari: 175000,
    hargaSewaJam: 30000,
    status: 'Disewa',
    kondisi: 'Baik',
    lokasi: 'Lahan Petani Blok Timur'
  },
  {
    id: 'als-3',
    kodeAlat: 'ALT-PMP-01',
    namaAlat: 'Pompa Air Alkon Honda 3 Inch Irigasi Sawah',
    jenis: 'Pompa Air Irigasi',
    hargaSewaHari: 120000,
    hargaSewaJam: 20000,
    status: 'Tersedia',
    kondisi: 'Sangat Baik',
    lokasi: 'Gudang Utama Koperasi'
  },
  {
    id: 'als-4',
    kodeAlat: 'ALT-PPL-01',
    namaAlat: 'Mesin Pemipil Jagung Mobile 1 Ton/Jam Mesin Bensin',
    jenis: 'Pengolah Hasil Panen',
    hargaSewaHari: 200000,
    hargaSewaJam: 35000,
    status: 'Tersedia',
    kondisi: 'Baik',
    lokasi: 'Posko Sentra Tani'
  },
  {
    id: 'als-5',
    kodeAlat: 'ALT-SPR-01',
    namaAlat: 'Hand Sprayer Baterai Elektrik CBA 16 Liter (3 Unit)',
    jenis: 'Sprayer Tanaman',
    hargaSewaHari: 45000,
    hargaSewaJam: 10000,
    status: 'Tersedia',
    kondisi: 'Sangat Baik',
    lokasi: 'Gudang Utama Koperasi'
  }
];

export const INITIAL_ALSINTAN_RENTALS: AlsintanRental[] = [
  {
    id: 'rnt-1',
    kodeSewa: 'SW-ALT-001',
    tanggal: '2026-09-08',
    alsintanId: 'als-1',
    namaAlat: 'Traktor Roda Dua Quick G1000 Boxer',
    anggotaId: 'agt-1',
    namaPenyewa: 'Sutrisno Pratama',
    kontak: '081210000000',
    durasi: 2,
    satuanDurasi: 'Hari',
    tarifSatuan: 250000,
    totalBiaya: 500000,
    status: 'Selesai',
    tanggalSelesai: '2026-09-10'
  },
  {
    id: 'rnt-2',
    kodeSewa: 'SW-ALT-002',
    tanggal: '2026-09-10',
    alsintanId: 'als-2',
    namaAlat: 'Mesin Cultivator Mini Honda F220',
    anggotaId: 'agt-4',
    namaPenyewa: 'Asep Kurniawan',
    kontak: '081210083741',
    durasi: 3,
    satuanDurasi: 'Hari',
    tarifSatuan: 175000,
    totalBiaya: 525000,
    status: 'Aktif'
  },
  {
    id: 'rnt-3',
    kodeSewa: 'SW-ALT-003',
    tanggal: '2026-09-11',
    alsintanId: 'als-3',
    namaAlat: 'Pompa Air Alkon Honda 3 Inch',
    anggotaId: 'agt-7',
    namaPenyewa: 'Wahyudi Wijaya',
    kontak: '081510502446',
    durasi: 1,
    satuanDurasi: 'Hari',
    tarifSatuan: 120000,
    totalBiaya: 120000,
    status: 'Aktif'
  }
];

export const INITIAL_PANEN_TRANSACTIONS: PanenTransaction[] = [
  {
    id: 'pn-1',
    kodeNota: 'NOTA-PNN-260901',
    tanggal: '2026-09-09',
    anggotaId: 'agt-1',
    namaAnggota: 'Sutrisno Pratama',
    noHp: '081210000000',
    komoditas: 'Cabai Rawit Merah',
    kategoriKomoditas: 'percabaian',
    beratKg: 180,
    hargaPerKg: 42000,
    subtotal: 7560000,
    potonganSukarela: 180 * 400, // 72,000
    potonganWajib: 180 * 100,    // 18,000
    totalPotongan: 90000,        // 180 * 500
    totalBersihPetani: 7470000,
    sharingProfitKoperasi: 180 * 350, // Rp 350/kg margin = 63,000
    tipePenjualan: 'Koperasi Mandiri',
    catatan: 'Petik merah grade A prima'
  },
  {
    id: 'pn-2',
    kodeNota: 'NOTA-PNN-260902',
    tanggal: '2026-09-10',
    anggotaId: 'agt-2',
    namaAnggota: 'Dadang Hidayat',
    noHp: '081310083741',
    komoditas: 'Bawang Daun',
    kategoriKomoditas: 'sayuran_lain',
    beratKg: 420,
    hargaPerKg: 14500,
    subtotal: 6090000,
    potonganSukarela: 420 * 100, // 42,000
    potonganWajib: 420 * 50,     // 21,000
    totalPotongan: 63000,        // 420 * 150
    totalBersihPetani: 6027000,
    sharingProfitKoperasi: 420 * 250, // Rp 250/kg = 105,000
    tipePenjualan: 'BUMDes',
    catatan: 'Pasokan pesanan ritel BUMDes Mitra Tani'
  },
  {
    id: 'pn-3',
    kodeNota: 'NOTA-PNN-260903',
    tanggal: '2026-09-11',
    anggotaId: 'agt-3',
    namaAnggota: 'Ujang Saputra',
    noHp: '081410167482',
    komoditas: 'Tomat',
    kategoriKomoditas: 'sayuran_lain',
    beratKg: 550,
    hargaPerKg: 9500,
    subtotal: 5225000,
    potonganSukarela: 550 * 100, // 55,000
    potonganWajib: 550 * 50,     // 27,500
    totalPotongan: 82500,        // 550 * 150
    totalBersihPetani: 5142500,
    sharingProfitKoperasi: 550 * 200, // Rp 200/kg = 110,000
    tipePenjualan: 'Koperasi Mandiri',
    catatan: 'Kondisi mulus bebas busuk pantat'
  }
];

export const INITIAL_BRILINK_TRANSACTIONS: BrilinkTransaction[] = [
  { id: 'brl-1', kodeTransaksi: 'BRL-260911-001', tanggal: '2026-09-11 08:30', tipe: 'Tarik Tunai', nominal: 1500000, feeAdmin: 8000, namaNasabah: 'Pak Slamet', nomorTujuan: 'BRI Rek 4321-xxxx', status: 'Berhasil' },
  { id: 'brl-2', kodeTransaksi: 'BRL-260911-002', tanggal: '2026-09-11 09:15', tipe: 'Transfer Bank', nominal: 2300000, feeAdmin: 10000, namaNasabah: 'Bu Marni', nomorTujuan: 'Mandiri 130-00-xxxx', status: 'Berhasil' },
  { id: 'brl-3', kodeTransaksi: 'BRL-260911-003', tanggal: '2026-09-11 10:02', tipe: 'PLN / Token', nominal: 200000, feeAdmin: 3500, namaNasabah: 'Pak Joko', nomorTujuan: 'ID Pel 32050192837', status: 'Berhasil' },
  { id: 'brl-4', kodeTransaksi: 'BRL-260910-004', tanggal: '2026-09-10 14:20', tipe: 'Top-Up E-Wallet', nominal: 500000, feeAdmin: 4000, namaNasabah: 'Cecep Nugraha', nomorTujuan: 'DANA 08128374918', status: 'Berhasil' },
  { id: 'brl-5', kodeTransaksi: 'BRL-260910-005', tanggal: '2026-09-10 16:45', tipe: 'BPJS & Lainnya', nominal: 175000, feeAdmin: 5000, namaNasabah: 'Nunung Kosasih', nomorTujuan: 'VA BPJS 8888801928', status: 'Berhasil' }
];

export const INITIAL_LOAN_APPLICATIONS: LoanApplication[] = [
  {
    id: 'ln-1',
    kodePinjaman: 'PINJ-202609-001',
    tanggalPengajuan: '2026-09-08',
    anggotaId: 'agt-1',
    namaAnggota: 'Sutrisno Pratama',
    noHp: '081210000000',
    totalSimpananSaatIni: 4850000,
    plafonMaksimal: 9700000, // 2x simpanan
    jumlahPinjaman: 6000000,
    tenorBulan: 10,
    bungaPersenPerBulan: 1.0,
    cicilanBulanan: 660000,
    tujuanPinjaman: 'Modal pengolahan lahan & pembelian benih cabai musim hujan',
    status: 'Dicairkan',
    tanggalDisetujui: '2026-09-09',
    tanggalDicairkan: '2026-09-09',
    sisaPinjaman: 5400000
  },
  {
    id: 'ln-2',
    kodePinjaman: 'PINJ-202609-002',
    tanggalPengajuan: '2026-09-10',
    anggotaId: 'agt-5',
    namaAnggota: 'Sukarna Santoso',
    noHp: '081610334964',
    totalSimpananSaatIni: 3200000,
    plafonMaksimal: 6400000,
    jumlahPinjaman: 5000000,
    tenorBulan: 6,
    bungaPersenPerBulan: 1.0,
    cicilanBulanan: 883333,
    tujuanPinjaman: 'Pemasangan instalasi pipa sprinkle kabut di kebun bawang',
    status: 'Disetujui',
    tanggalDisetujui: '2026-09-11',
    sisaPinjaman: 5000000
  },
  {
    id: 'ln-3',
    kodePinjaman: 'PINJ-202609-003',
    tanggalPengajuan: '2026-09-11',
    anggotaId: 'agt-9',
    namaAnggota: 'Supriadi Kusuma',
    noHp: '081210669928',
    totalSimpananSaatIni: 2150000,
    plafonMaksimal: 4300000,
    jumlahPinjaman: 3500000,
    tenorBulan: 5,
    bungaPersenPerBulan: 1.0,
    cicilanBulanan: 735000,
    tujuanPinjaman: 'Pembelian pupuk tambahan untuk kebun tomat masa vegetatif',
    status: 'Menunggu Persetujuan',
    sisaPinjaman: 3500000
  }
];

export const INITIAL_SAVINGS_CASHFLOW: SavingsCashFlow[] = [
  { id: 'sav-1', tanggal: '2026-09-01', anggotaId: 'agt-1', namaAnggota: 'Sutrisno Pratama', jenisSimpanan: 'Simpanan Wajib', tipe: 'Masuk', jumlah: 50000, keterangan: 'Iuran Wajib Bulanan September 2026', metode: 'Tunai' },
  { id: 'sav-2', tanggal: '2026-09-05', anggotaId: 'agt-2', namaAnggota: 'Dadang Hidayat', jenisSimpanan: 'Simpanan Sukarela', tipe: 'Masuk', jumlah: 250000, keterangan: 'Titipan tabungan hasil panen', metode: 'Transfer' },
  { id: 'sav-3', tanggal: '2026-09-09', anggotaId: 'agt-1', namaAnggota: 'Sutrisno Pratama', jenisSimpanan: 'Simpanan Sukarela', tipe: 'Masuk', jumlah: 72000, keterangan: 'Autodebet potongan panen Cabai Rawit Merah (180kg x Rp400)', metode: 'Potongan Panen' },
  { id: 'sav-4', tanggal: '2026-09-09', anggotaId: 'agt-1', namaAnggota: 'Sutrisno Pratama', jenisSimpanan: 'Simpanan Wajib', tipe: 'Masuk', jumlah: 18000, keterangan: 'Autodebet potongan panen Cabai Rawit Merah (180kg x Rp100)', metode: 'Potongan Panen' },
  { id: 'sav-5', tanggal: '2026-09-10', anggotaId: 'agt-2', namaAnggota: 'Dadang Hidayat', jenisSimpanan: 'Simpanan Sukarela', tipe: 'Masuk', jumlah: 42000, keterangan: 'Autodebet potongan panen Bawang Daun (420kg x Rp100)', metode: 'Potongan Panen' },
  { id: 'sav-6', tanggal: '2026-09-10', anggotaId: 'agt-2', namaAnggota: 'Dadang Hidayat', jenisSimpanan: 'Simpanan Wajib', tipe: 'Masuk', jumlah: 21000, keterangan: 'Autodebet potongan panen Bawang Daun (420kg x Rp50)', metode: 'Potongan Panen' }
];

export const INITIAL_OPERATIONAL_EXPENSE: OperationalExpense = {
  gajiPegawai: 7500000,       // 3 Staff operasional & kasir
  sewaTempat: 1500000,        // Kantor & posko
  listrikDanAir: 650000,      // Listrik PLN & PDAM
  biayaOperasionalLain: 850000, // ATK, internet, konsumsi rapat pengurus
  penyertaanModalPangan: 50000000 // Modal Ketahanan Pangan
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'ntf-1',
    judul: 'Pengajuan Pinjaman Baru',
    pesan: 'Pak Supriadi Kusuma mengajukan pinjaman sebesar Rp 3.500.000 (Plafon Rp 4.300.000). Memerlukan verifikasi pengurus.',
    tipe: 'pinjaman',
    waktu: '15 Menit yang lalu',
    dibaca: false,
    targetModul: 'pinjaman'
  },
  {
    id: 'ntf-2',
    judul: 'Peringatan Stok Saprodi Menipis',
    pesan: 'Stok Insektisida Curacron (sisa 7 botol) & Benih Tomat Servo F1 (sisa 4 sachet) berada di bawah batas minimum.',
    tipe: 'stok',
    waktu: '1 Jam yang lalu',
    dibaca: false,
    targetModul: 'saprodi'
  },
  {
    id: 'ntf-3',
    judul: 'Transaksi Panen Terkoreksi Otomatis',
    pesan: 'Panen Tomat 550 Kg dari Pak Ujang Saputra berhasil diproses. Potongan simpanan Rp 82.500 langsung masuk ke saldo simpanan.',
    tipe: 'panen',
    waktu: '3 Jam yang lalu',
    dibaca: false,
    targetModul: 'agribisnis'
  },
  {
    id: 'ntf-4',
    judul: 'Pembaruan Harga Komoditas Harian',
    pesan: 'Harga acuan harian komoditas sayuran telah disinkronkan untuk pasar lokal & BUMDes hari ini.',
    tipe: 'info',
    waktu: 'Hari ini, 07:00 WIB',
    dibaca: true,
    targetModul: 'agribisnis'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  { id: 'usr-1', nama: 'H. Sudrajat Mandiri', username: 'ketua.koperasi', role: 'Pengurus Koperasi', email: 'ketua@mitrataniberkah.id', status: 'Aktif' },
  { id: 'usr-2', nama: 'Adi Saputra, S.P.', username: 'admin.utama', role: 'Super Admin', email: 'admin@mitrataniberkah.id', status: 'Aktif' },
  { id: 'usr-3', nama: 'Rian Permana', username: 'admin.saprodi', role: 'Admin Toko Saprodi', email: 'saprodi@mitrataniberkah.id', status: 'Aktif' },
  { id: 'usr-4', nama: 'Dewi Sartika', username: 'admin.agri', role: 'Admin Agribisnis', email: 'agribisnis@mitrataniberkah.id', status: 'Aktif' },
  { id: 'usr-5', nama: 'Bambang Kasir', username: 'kasir.lapangan', role: 'Petugas Lapangan & Kasir', email: 'kasir@mitrataniberkah.id', status: 'Aktif' }
];

export const KOPERASI_PROFILE = {
  nama: 'KOPERASI PRODUSEN MITRA TANI BERKAH',
  skKoperasi: 'AHU-0004819.AH.01.26.TAHUN 2023',
  nib: '1904230058291',
  npwp: '31.982.472.1-429.000',
  tanggalBerdiri: '15 Maret 2021',
  alamat: 'Jl. Raya Agro Pertanian No. 88, Sentra Agrowisata Makmur',
  desaKelurahan: 'Sukatani Makmur',
  kecamatan: 'Agrotani Subur',
  kabupatenKota: 'Kabupaten Bandung Barat',
  provinsi: 'Jawa Barat',
  kodePos: '40559',
  telepon: '+62 812-3456-7890',
  email: 'sekretariat@mitrataniberkah.id',
  website: 'https://mitrataniberkah.id',
  visi: 'Menjadi koperasi produsen pertanian terdepan yang mandiri, berdaya saing global, dan menyejahterakan petani melalui ekosistem hulu-hilir agribisnis berkelanjutan.',
  misi: [
    'Menyediakan sarana produksi pertanian (saprodi) berkualitas dengan harga terjangkau dan jaminan ketersediaan tepat waktu.',
    'Membangun mekanisasi pertanian modern melalui penyediaan sewa alat mesin pertanian (alsintan) efisien.',
    'Memperkuat rantai pasok agribisnis sayuran segar dari petani mitra langsung ke pasar induk, ritel modern, dan BUMDes.',
    'Menyediakan layanan inklusi keuangan terpadu, simpan pinjam produktif, dan loket perbankan desa (Brilink).',
    'Menerapkan tata kelola koperasi yang transparan, berbasis teknologi digital, serta menjunjung tinggi asas bagi hasil dan keberkahan.'
  ],
  susunanPengurus: [
    { jabatan: 'Ketua Koperasi', nama: 'H. Sudrajat Mandiri, S.E.' },
    { jabatan: 'Sekretaris', nama: 'Ir. Hendra Gunawan' },
    { jabatan: 'Bendahara', nama: 'Hj. Siti Aminah' },
    { jabatan: 'Ketua Pengawas', nama: 'Drs. H. Mulyadi Saputra' },
    { jabatan: 'Manager Operasional', nama: 'Adi Saputra, S.P.' }
  ],
  unitUsaha: [
    { nama: 'Toko Saprodi (Sarana Produksi Pertanian)', deskripsi: 'Penyediaan pupuk, benih unggul, pestisida organik & kimia, mulsa, dan perlengkapan tani.' },
    { nama: 'Sewa Alsintan (Alat & Mesin Pertanian)', deskripsi: 'Traktor olah tanah, rotavator, cultivator mini, pompa air alkon irigasi, dan mesin pemipil.' },
    { nama: 'Agribisnis Sayuran & Hortikultura', deskripsi: 'Penampungan hasil panen petani, standarisasi sortasi grade, kemitraan BUMDes & pasar induk.' },
    { nama: 'Layanan Keuangan Terpadu Brilink', deskripsi: 'Layanan perbankan desa: tarik tunai, transfer, pembayaran listrik PLN, BPJS, dan e-wallet.' },
    { nama: 'Unit Simpan Pinjam Produktif', deskripsi: 'Pengelolaan simpanan pokok, wajib, sukarela, serta pinjaman permodalan tani maksimal 2x plafon.' }
  ]
};
