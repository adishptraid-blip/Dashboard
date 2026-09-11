import React, { useState } from 'react';
import {
  Store,
  Tractor,
  Wheat,
  Banknote,
  PiggyBank,
  Plus,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Share2,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Search,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Tag,
  CreditCard
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import {
  PanenTransaction,
  SaprodiItem,
  SaprodiCashFlow,
  AlsintanItem,
  BrilinkTransaction,
  Anggota
} from '../../types/koperasi';
import {
  formatRupiah,
  formatAngka,
  formatTanggalIndo,
  exportToExcel,
  exportToWord,
  exportToPdf
} from '../../utils/exportUtils';
import { NotaModal } from './NotaModal';

export const UnitUsahaContainer: React.FC = () => {
  const {
    anggotaList,
    commodityPrices,
    updateHargaKomoditas,
    panenList,
    tambahTransaksiPanen,
    saprodiItems,
    tambahBarangSaprodi,
    updateBarangSaprodi,
    hapusBarangSaprodi,
    saprodiCashflow,
    tambahArusKasSaprodi,
    alsintanItems,
    tambahAlsintan,
    alsintanRentals,
    tambahSewaAlsintan,
    selesaikanSewaAlsintan,
    brilinkList,
    tambahTransaksiBrilink,
    loans,
    ajukanPinjaman,
    hitungStatistikKeuangan
  } = useKoperasi();

  const stats = hitungStatistikKeuangan();

  // Sub-tabs inside Module 4
  const [activeSubTab, setActiveSubTab] = useState<
    'saprodi' | 'alsintan' | 'agribisnis' | 'brilink' | 'simpan-pinjam'
  >('agribisnis');

  // Modal / Form States
  const [activeNota, setActiveNota] = useState<PanenTransaction | null>(null);

  // 1. Agribisnis States
  const [selectedAnggotaId, setSelectedAnggotaId] = useState<string>(anggotaList[0]?.id || '');
  const [selectedKomoditas, setSelectedKomoditas] = useState<string>('Cabai Rawit Merah');
  const [panenKg, setPanenKg] = useState<number>(100);
  const [hargaPanenCustom, setHargaPanenCustom] = useState<number>(0);
  const [tipePenjualan, setTipePenjualan] = useState<'Koperasi Mandiri' | 'BUMDes'>('Koperasi Mandiri');
  const [catatanPanen, setCatatanPanen] = useState<string>('');

  // 2. Saprodi Form States
  const [showAddSaprodiModal, setShowAddSaprodiModal] = useState(false);
  const [newSaprodi, setNewSaprodi] = useState({
    kodeBarang: '',
    namaBarang: '',
    kategori: 'Pupuk' as 'Pupuk' | 'Pestisida & Obat' | 'Benih' | 'Alat & Perlengkapan' | 'Lainnya',
    satuan: 'Karung',
    stok: 20,
    stokMinimal: 5,
    hargaBeli: 250000,
    hargaJual: 280000
  });

  // Saprodi order helper calculation (pemesanan barang saprodi)
  const [orderBarangId, setOrderBarangId] = useState<string>('');
  const [orderJumlah, setOrderJumlah] = useState<number>(10);
  const [orderModalCustom, setOrderModalCustom] = useState<number>(0);
  const [orderMarginPersenCustom, setOrderMarginPersenCustom] = useState<number>(10);

  // 3. Alsintan Form States
  const [showAddAlsintanModal, setShowAddAlsintanModal] = useState(false);
  const [newAlat, setNewAlat] = useState({
    kodeAlat: '',
    namaAlat: '',
    jenis: 'Traktor',
    hargaSewaHari: 200000,
    hargaSewaJam: 35000,
    kondisi: 'Sangat Baik' as 'Sangat Baik' | 'Baik' | 'Perlu Servis',
    lokasi: 'Gudang Utama Koperasi',
    status: 'Tersedia' as 'Tersedia' | 'Disewa' | 'Perawatan'
  });

  const [sewaAlatId, setSewaAlatId] = useState<string>('');
  const [sewaAnggotaId, setSewaAnggotaId] = useState<string>(anggotaList[0]?.id || '');
  const [sewaDurasi, setSewaDurasi] = useState<number>(1);
  const [sewaSatuan, setSewaSatuan] = useState<'Hari' | 'Jam'>('Hari');

  // 4. Brilink Form State
  const [brilinkTipe, setBrilinkTipe] = useState<
    'Top-Up E-Wallet' | 'Tarik Tunai' | 'Transfer Bank' | 'PLN / Token' | 'Pulsa & Paket Data' | 'BPJS & Lainnya'
  >('Transfer Bank');
  const [brilinkNominal, setBrilinkNominal] = useState<number>(500000);
  const [brilinkFee, setBrilinkFee] = useState<number>(6500);
  const [brilinkNasabah, setBrilinkNasabah] = useState<string>('Pak Slamet');
  const [brilinkTujuan, setBrilinkTujuan] = useState<string>('BRI 4321-xxx');

  // 5. Simpan Pinjam Quick Application
  const [pinjamAnggotaId, setPinjamAnggotaId] = useState<string>(anggotaList[0]?.id || '');
  const [pinjamJumlah, setPinjamJumlah] = useState<number>(2000000);
  const [pinjamTenor, setPinjamTenor] = useState<number>(6);
  const [pinjamTujuan, setPinjamTujuan] = useState<string>('Modal pembelian pupuk & benih');
  const [pinjamAlert, setPinjamAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync selected commodity price
  const currentCommodityObj = commodityPrices.find(c => c.nama === selectedKomoditas);
  const defaultHargaAcuan = currentCommodityObj ? currentCommodityObj.hargaAcuan : 30000;
  const activeHargaPerKg = hargaPanenCustom > 0 ? hargaPanenCustom : defaultHargaAcuan;

  // Selected member for loan or panen
  const currentPinjamMember = anggotaList.find(a => a.id === pinjamAnggotaId);
  const currentPinjamTotalSimpanan = currentPinjamMember
    ? currentPinjamMember.simpananPokok + currentPinjamMember.simpananWajib + currentPinjamMember.simpananSukarela
    : 0;
  const currentPinjamPlafon = currentPinjamTotalSimpanan * 2;

  // Handler: Input Transaksi Panen
  const handleSubmitPanen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnggotaId || panenKg <= 0) {
      alert('Pilih anggota dan masukkan berat panen yang valid!');
      return;
    }

    const newTransaction = tambahTransaksiPanen({
      anggotaId: selectedAnggotaId,
      komoditas: selectedKomoditas,
      beratKg: Number(panenKg),
      hargaPerKg: Number(activeHargaPerKg),
      tipePenjualan,
      catatan: catatanPanen
    });

    // Auto open Nota modal to send to WhatsApp!
    setActiveNota(newTransaction);
    setPanenKg(100);
    setCatatanPanen('');
  };

  // Handler: Submit Saprodi Item
  const handleAddSaprodi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaprodi.namaBarang) return;
    const kode = newSaprodi.kodeBarang || `SPD-${Date.now().toString().slice(-4)}`;
    tambahBarangSaprodi({
      ...newSaprodi,
      kodeBarang: kode
    });
    setShowAddSaprodiModal(false);
  };

  // Handler: Submit Sewa Alsintan
  const handleAddSewa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sewaAlatId || !sewaAnggotaId) {
      alert('Pilih alat dan penyewa!');
      return;
    }
    tambahSewaAlsintan({
      alsintanId: sewaAlatId,
      anggotaId: sewaAnggotaId,
      durasi: Number(sewaDurasi),
      satuanDurasi: sewaSatuan
    });
    alert('Penyewaan alsintan berhasil dicatat!');
  };

  // Handler: Submit Brilink
  const handleAddBrilink = (e: React.FormEvent) => {
    e.preventDefault();
    tambahTransaksiBrilink({
      tipe: brilinkTipe,
      nominal: Number(brilinkNominal),
      feeAdmin: Number(brilinkFee),
      namaNasabah: brilinkNasabah,
      nomorTujuan: brilinkTujuan,
      status: 'Berhasil'
    });
    alert('Transaksi Brilink berhasil dibukukan.');
  };

  // Handler: Ajukan Pinjaman
  const handleAjukanPinjaman = (e: React.FormEvent) => {
    e.preventDefault();
    const res = ajukanPinjaman({
      anggotaId: pinjamAnggotaId,
      jumlahPinjaman: Number(pinjamJumlah),
      tenorBulan: Number(pinjamTenor),
      tujuanPinjaman: pinjamTujuan
    });

    if (res.success) {
      setPinjamAlert({ type: 'success', message: res.message });
    } else {
      setPinjamAlert({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Navigation between 5 business units */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Unit Usaha Terpadu Koperasi
              </h2>
              <p className="text-[11px] text-slate-500">
                Integrasi hulu-hilir pertanian: Saprodi, Alsintan, Agribisnis Sayuran, Brilink, dan Simpan Pinjam.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            id="tab-unit-agribisnis"
            onClick={() => setActiveSubTab('agribisnis')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'agribisnis'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Wheat className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">1. Agribisnis Sayuran</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'agribisnis' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Panen & Potongan
              </div>
            </div>
          </button>

          <button
            id="tab-unit-saprodi"
            onClick={() => setActiveSubTab('saprodi')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'saprodi'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">2. Toko Saprodi</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'saprodi' ? 'text-blue-100' : 'text-slate-400'}`}>
                Stok & Dana Taktis 10%
              </div>
            </div>
          </button>

          <button
            id="tab-unit-alsintan"
            onClick={() => setActiveSubTab('alsintan')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'alsintan'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Tractor className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">3. Sewa Alsintan</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'alsintan' ? 'text-amber-100' : 'text-slate-400'}`}>
                Traktor & Mesin Tani
              </div>
            </div>
          </button>

          <button
            id="tab-unit-brilink"
            onClick={() => setActiveSubTab('brilink')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'brilink'
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Banknote className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">4. Layanan Brilink</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'brilink' ? 'text-sky-100' : 'text-slate-400'}`}>
                Top-Up & Transfer
              </div>
            </div>
          </button>

          <button
            id="tab-unit-simpanpinjam"
            onClick={() => setActiveSubTab('simpan-pinjam')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all col-span-2 sm:col-span-1 ${
              activeSubTab === 'simpan-pinjam'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <PiggyBank className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">5. Simpan Pinjam</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'simpan-pinjam' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Validasi 2x Plafon
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. AGRIBISNIS SAYURAN SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'agribisnis' && (
        <div className="space-y-6">
          {/* Rules Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <Wheat className="w-4 h-4 text-emerald-700" />
              Aturan Pemotongan Simpanan Otomatis Transaksi Panen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs text-emerald-900">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                <strong>1. Komoditas Percabaian (Rawit / Keriting / Aneka Cabai):</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Total potongan <strong>Rp 500 / Kg</strong> (Dialokasikan: <strong>Rp 400 Simpanan Sukarela</strong> & <strong>Rp 100 Simpanan Wajib</strong>).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                <strong>2. Komoditas Selain Percabaian (Sayuran Lain):</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Total potongan <strong>Rp 150 / Kg</strong> (Dialokasikan: <strong>Rp 100 Simpanan Sukarela</strong> & <strong>Rp 50 Simpanan Wajib</strong>).
                </p>
              </div>
            </div>
          </div>

          {/* Form Input Transaksi Panen & Update Harga Harian */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Input Panen (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Input Pembelian Hasil Panen (Petani ke Koperasi)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Sistem menghitung potongan simpanan otomatis, sisa bersih petani, dan siap share nota via WhatsApp.
              </p>

              <form onSubmit={handleSubmitPanen} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Pilih Petani / Anggota *
                    </label>
                    <select
                      id="select-panen-anggota"
                      value={selectedAnggotaId}
                      onChange={e => setSelectedAnggotaId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                    >
                      {anggotaList.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nomorAnggota} - {a.nama} ({a.alamat.slice(0, 20)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Komoditas Panen *
                    </label>
                    <select
                      id="select-panen-komoditas"
                      value={selectedKomoditas}
                      onChange={e => {
                        setSelectedKomoditas(e.target.value);
                        setHargaPanenCustom(0);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                    >
                      {commodityPrices.map(c => (
                        <option key={c.id} value={c.nama}>
                          {c.nama} ({c.kategori === 'percabaian' ? 'Percabaian' : 'Sayuran Lain'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Volume Berat (Kg) *
                    </label>
                    <input
                      id="input-panen-berat"
                      type="number"
                      required
                      min="1"
                      value={panenKg}
                      onChange={e => setPanenKg(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Harga Acuan Harian (Rp/Kg)
                    </label>
                    <input
                      id="input-panen-harga"
                      type="number"
                      value={activeHargaPerKg}
                      onChange={e => setHargaPanenCustom(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Saluran Penjualan
                    </label>
                    <select
                      value={tipePenjualan}
                      onChange={e => setTipePenjualan(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                    >
                      <option value="Koperasi Mandiri">Koperasi Mandiri (Pasar Induk)</option>
                      <option value="BUMDes">Kemitraan BUMDes Mitra Tani</option>
                    </select>
                  </div>
                </div>

                {/* Live calculation box */}
                {(() => {
                  const isChili = selectedKomoditas.toLowerCase().includes('cabai') || selectedKomoditas.toLowerCase().includes('cabe');
                  const potSukarela = panenKg * (isChili ? 400 : 100);
                  const potWajib = panenKg * (isChili ? 100 : 50);
                  const totalPot = potSukarela + potWajib;
                  const subtotal = panenKg * activeHargaPerKg;
                  const bersih = subtotal - totalPot;
                  const sharingProfit = panenKg * (isChili ? 350 : 200);

                  return (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">Subtotal Bruto ({panenKg} Kg × {formatRupiah(activeHargaPerKg)}):</span>
                        <span className="font-bold text-slate-900">{formatRupiah(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-blue-700">
                        <span>Potongan Simpanan Otomatis ({isChili ? 'Rp 500/kg' : 'Rp 150/kg'}):</span>
                        <span className="font-mono font-semibold">-{formatRupiah(totalPot)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-emerald-700">
                        <span>Sharing Profit Margin Koperasi:</span>
                        <span className="font-mono font-semibold">+{formatRupiah(sharingProfit)}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-900">Total Diterima Bersih Petani:</span>
                        <span className="text-emerald-700 text-base">{formatRupiah(bersih)}</span>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Catatan Kualitas / Sortir
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Petik merah super, kemasan keranjang bambu rapi"
                    value={catatanPanen}
                    onChange={e => setCatatanPanen(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>

                <button
                  id="btn-submit-panen"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Proses Transaksi & Buat Nota WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Daily Commodity Prices Manager (1 col) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Update Harga Harian
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Acuan Hari Ini</span>
              </div>

              <div className="space-y-2 mt-3 max-h-[380px] overflow-y-auto pr-1">
                {commodityPrices.map(c => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{c.nama}</div>
                      <div className="text-[10px] text-slate-400">
                        {c.kategori === 'percabaian' ? 'Percabaian (Rp500/kg)' : 'Sayuran Lain (Rp150/kg)'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="number"
                        defaultValue={c.hargaAcuan}
                        onBlur={e => updateHargaKomoditas(c.id, Number(e.target.value))}
                        className="w-20 p-1 text-xs text-right font-mono font-bold rounded-md border border-slate-200 bg-white"
                      />
                      <span className="text-[10px] text-slate-500">/Kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rekapitulasi Panen Otomatis & Export */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Rekapitulasi Transaksi Panen Sayuran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Riwayat penampungan panen, potongan simpanan otomatis, dan sharing profit koperasi & BUMDes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const data = panenList.map(p => ({
                      'Kode Nota': p.kodeNota,
                      'Tanggal': p.tanggal,
                      'Petani': p.namaAnggota,
                      'Komoditas': p.komoditas,
                      'Volume (Kg)': p.beratKg,
                      'Harga /Kg': p.hargaPerKg,
                      'Subtotal': p.subtotal,
                      'Potongan Sukarela': p.potonganSukarela,
                      'Potongan Wajib': p.potonganWajib,
                      'Total Potongan Simpanan': p.totalPotongan,
                      'Total Bersih Petani': p.totalBersihPetani,
                      'Sharing Profit Koperasi': p.sharingProfitKoperasi,
                      'Saluran Jual': p.tipePenjualan
                    }));
                    exportToExcel(data, `Rekap_Panen_Mitra_Tani_${panenList.length}`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                <button
                  onClick={() => {
                    const headers = ['No. Nota', 'Petani', 'Komoditas', 'Kg', 'Harga/Kg', 'Potongan', 'Bersih Petani', 'Profit Koperasi'];
                    const rows = panenList.map(p => [
                      p.kodeNota,
                      p.namaAnggota,
                      p.komoditas,
                      p.beratKg,
                      formatRupiah(p.hargaPerKg),
                      formatRupiah(p.totalPotongan),
                      formatRupiah(p.totalBersihPetani),
                      formatRupiah(p.sharingProfitKoperasi)
                    ]);
                    exportToPdf('REKAPITULASI TRANSAKSI PANEN SAYURAN', headers, rows, 'Rekap_Panen_Sayuran');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Nota & Tanggal</th>
                    <th className="pb-2">Petani</th>
                    <th className="pb-2">Komoditas & Volume</th>
                    <th className="pb-2 text-right">Harga/Kg</th>
                    <th className="pb-2 text-right">Potongan Simpanan</th>
                    <th className="pb-2 text-right">Bersih Petani</th>
                    <th className="pb-2 text-right">Profit Koperasi</th>
                    <th className="pb-2 text-center">Saluran</th>
                    <th className="pb-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {panenList.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 font-mono">
                        <div className="font-bold text-slate-900">{p.kodeNota}</div>
                        <div className="text-[10px] text-slate-400">{p.tanggal}</div>
                      </td>
                      <td className="py-2.5 font-medium text-slate-800">
                        {p.namaAnggota}
                      </td>
                      <td className="py-2.5">
                        <div className="font-semibold text-slate-900">{p.komoditas}</div>
                        <div className="text-[11px] text-slate-500">{formatAngka(p.beratKg)} Kg</div>
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-700">
                        {formatRupiah(p.hargaPerKg)}
                      </td>
                      <td className="py-2.5 text-right text-emerald-700 font-semibold">
                        +{formatRupiah(p.totalPotongan)}
                        <span className="block text-[9px] text-emerald-600">
                          (W:{formatRupiah(p.potonganWajib)} / S:{formatRupiah(p.potonganSukarela)})
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-900">
                        {formatRupiah(p.totalBersihPetani)}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-blue-700">
                        {formatRupiah(p.sharingProfitKoperasi)}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.tipePenjualan}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          onClick={() => setActiveNota(p)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Lihat & Kirim Nota via WhatsApp"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Nota WA</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOKO SAPRODI SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'saprodi' && (
        <div className="space-y-6">
          {/* Toko Saprodi Header & Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="text-xs text-blue-700 font-medium">Total Item Sarana Produksi</div>
              <div className="text-xl font-bold text-blue-950 mt-1">
                {saprodiItems.length} Produk Terdaftar
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">Pupuk, Benih, Pestisida, Alat</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs text-amber-800 font-medium">Peringatan Stok Menipis</div>
              <div className="text-xl font-bold text-amber-950 mt-1">
                {saprodiItems.filter(i => i.stok <= i.stokMinimal).length} Item Kritis
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">Perlu restock segera</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs text-emerald-800 font-semibold flex items-center justify-between">
                <span>Ketentuan Dana Taktis (10%)</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">Otomatis</span>
              </div>
              <div className="text-xl font-bold text-emerald-950 mt-1">
                {formatRupiah(stats.danaTaktisSaprodi10Persen)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Dipotong 10% dari laba kotor saprodi
              </div>
            </div>
          </div>

          {/* Pemesanan Barang Saprodi: Kalkulator Harga Beli, Margin, dan Harga Jual Rekomendasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-blue-600" />
              Kalkulator Pemesanan & Rekomendasi Harga Jual Saprodi
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Saat menginput pesanan barang (misalnya Pupuk), sistem secara otomatis menampilkan rincian Harga Beli, Margin, dan Harga Jual yang disarankan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Pilih Item Barang</label>
                <select
                  value={orderBarangId}
                  onChange={e => {
                    const id = e.target.value;
                    setOrderBarangId(id);
                    const item = saprodiItems.find(i => i.id === id);
                    if (item) {
                      setOrderModalCustom(item.hargaBeli);
                      setOrderMarginPersenCustom(item.marginPersen || 10);
                    }
                  }}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">-- Pilih Barang Toko --</option>
                  {saprodiItems.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.namaBarang} (Stok: {i.stok} {i.satuan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Jumlah Pemesanan (Qty)</label>
                <input
                  type="number"
                  min="1"
                  value={orderJumlah}
                  onChange={e => setOrderJumlah(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Harga Beli / Modal (Rp)</label>
                <input
                  type="number"
                  value={orderModalCustom}
                  onChange={e => setOrderModalCustom(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Margin Keuntungan (%)</label>
                <input
                  type="number"
                  value={orderMarginPersenCustom}
                  onChange={e => setOrderMarginPersenCustom(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>
            </div>

            {/* Live calculation results */}
            {orderModalCustom > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Modal Pembelian:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatRupiah(orderModalCustom * orderJumlah)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Margin per Satuan:</span>
                  <span className="text-sm font-bold text-emerald-700">
                    +{formatRupiah(Math.round(orderModalCustom * (orderMarginPersenCustom / 100)))}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Harga Jual Disarankan:</span>
                  <span className="text-sm font-bold text-blue-800">
                    {formatRupiah(Math.round(orderModalCustom * (1 + orderMarginPersenCustom / 100)))}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Potongan Dana Taktis 10%:</span>
                  <span className="text-sm font-bold text-amber-700">
                    {formatRupiah(Math.round((orderModalCustom * (orderMarginPersenCustom / 100) * orderJumlah) * 0.1))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Daftar Barang Saprodi & Stok */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-blue-600" />
                  Daftar Barang & Harga Harian Toko Saprodi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Margin keuntungan dihitung secara otomatis oleh sistem.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const data = saprodiItems.map(i => ({
                      'Kode Barang': i.kodeBarang,
                      'Nama Barang': i.namaBarang,
                      'Kategori': i.kategori,
                      'Satuan': i.satuan,
                      'Stok': i.stok,
                      'Batas Min': i.stokMinimal,
                      'Harga Beli': i.hargaBeli,
                      'Harga Jual': i.hargaJual,
                      'Margin (Rp)': i.margin,
                      'Margin (%)': `${i.marginPersen}%`,
                      'Update': i.tanggalUpdate
                    }));
                    exportToExcel(data, 'Katalog_Barang_Saprodi_Mitra_Tani');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                <button
                  onClick={() => {
                    const headers = ['Kode', 'Nama Barang', 'Kategori', 'Stok', 'Harga Beli', 'Harga Jual', 'Margin', 'Update'];
                    const rows = saprodiItems.map(i => [
                      i.kodeBarang,
                      i.namaBarang,
                      i.kategori,
                      `${i.stok} ${i.satuan}`,
                      formatRupiah(i.hargaBeli),
                      formatRupiah(i.hargaJual),
                      `${formatRupiah(i.margin)} (${i.marginPersen}%)`,
                      i.tanggalUpdate
                    ]);
                    exportToPdf('KATALOG BARANG & HARGA HARIAN SAPRODI', headers, rows, 'Katalog_Saprodi');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>PDF</span>
                </button>

                <button
                  id="btn-tambah-barang-saprodi"
                  onClick={() => setShowAddSaprodiModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Barang</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Kode</th>
                    <th className="pb-2">Nama Barang & Kategori</th>
                    <th className="pb-2 text-center">Stok</th>
                    <th className="pb-2 text-right">Harga Beli (Modal)</th>
                    <th className="pb-2 text-right">Harga Jual</th>
                    <th className="pb-2 text-right">Margin Otomatis</th>
                    <th className="pb-2 text-center">Status Stok</th>
                    <th className="pb-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {saprodiItems.map(item => {
                    const isLowStock = item.stok <= item.stokMinimal;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 font-mono font-bold text-blue-700">{item.kodeBarang}</td>
                        <td className="py-2.5">
                          <div className="font-bold text-slate-900">{item.namaBarang}</div>
                          <span className="text-[10px] text-slate-400">{item.kategori} • {item.satuan}</span>
                        </td>
                        <td className="py-2.5 text-center font-bold text-slate-800">
                          {item.stok} {item.satuan}
                        </td>
                        <td className="py-2.5 text-right font-medium text-slate-600">
                          {formatRupiah(item.hargaBeli)}
                        </td>
                        <td className="py-2.5 text-right font-bold text-slate-900">
                          {formatRupiah(item.hargaJual)}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-emerald-700">
                          +{formatRupiah(item.margin)}
                          <span className="block text-[9px] text-emerald-600 font-normal">
                            ({item.marginPersen}%)
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          {isLowStock ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                              Stok Menipis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Aman
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-center">
                          <button
                            onClick={() => {
                              const newStok = prompt(`Update stok untuk ${item.namaBarang}:`, String(item.stok));
                              if (newStok !== null) {
                                updateBarangSaprodi(item.id, { stok: Number(newStok) });
                              }
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit Stok"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Arus Kas Saprodi: Terpisah Pemasukan & Pengeluaran */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pemasukan Saprodi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  Arus Kas: Pemasukan Saprodi (Penjualan)
                </h3>
                <span className="text-[11px] font-bold text-emerald-700">
                  {formatRupiah(
                    saprodiCashflow
                      .filter(c => c.tipe === 'Pemasukan')
                      .reduce((sum, c) => sum + c.jumlah, 0)
                  )}
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-3 max-h-56 overflow-y-auto">
                {saprodiCashflow.filter(c => c.tipe === 'Pemasukan').map(c => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{c.keterangan}</div>
                      <div className="text-[10px] text-slate-400">{c.tanggal} • Ref: {c.referensi || '-'}</div>
                    </div>
                    <div className="font-bold text-emerald-700">+{formatRupiah(c.jumlah)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengeluaran Saprodi & Dana Taktis 10% */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-red-900 flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  Arus Kas: Pengeluaran Saprodi & Dana Taktis 10%
                </h3>
                <span className="text-[11px] font-bold text-red-700">
                  {formatRupiah(
                    saprodiCashflow
                      .filter(c => c.tipe === 'Pengeluaran')
                      .reduce((sum, c) => sum + c.jumlah, 0)
                  )}
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-3 max-h-56 overflow-y-auto">
                {saprodiCashflow.filter(c => c.tipe === 'Pengeluaran').map(c => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{c.keterangan}</div>
                      <div className="text-[10px] text-slate-400">{c.tanggal} • {c.kategori}</div>
                    </div>
                    <div className="font-bold text-red-700">-{formatRupiah(c.jumlah)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SEWA ALSINTAN SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'alsintan' && (
        <div className="space-y-6">
          {/* Top Banner & Action */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tractor className="w-5 h-5 text-amber-600" />
                Unit Sewa Alsintan (Alat & Mesin Pertanian)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mekanisasi olah tanah, irigasi, dan pasca panen bagi anggota kelompok tani.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddAlsintanModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Alat Baru</span>
              </button>
            </div>
          </div>

          {/* Form Sewa Baru & Katalog Mesin */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Input Sewa (1 col) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-amber-600" />
                Input Penyewaan Alsintan
              </h4>

              <form onSubmit={handleAddSewa} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Pilih Alat Mesin *</label>
                  <select
                    value={sewaAlatId}
                    onChange={e => setSewaAlatId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="">-- Pilih Alsintan --</option>
                    {alsintanItems.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.namaAlat} (Tarif: {formatRupiah(a.hargaSewaHari)}/hari)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Penyewa (Anggota) *</label>
                  <select
                    value={sewaAnggotaId}
                    onChange={e => setSewaAnggotaId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {anggotaList.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nomorAnggota} - {a.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Durasi</label>
                    <input
                      type="number"
                      min="1"
                      value={sewaDurasi}
                      onChange={e => setSewaDurasi(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Satuan</label>
                    <select
                      value={sewaSatuan}
                      onChange={e => setSewaSatuan(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Hari">Hari</option>
                      <option value="Jam">Jam</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs mt-2"
                >
                  Catat Penyewaan
                </button>
              </form>
            </div>

            {/* List Alat Mesin Tersedia (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-3">
                Inventaris Mesin & Tarif Sewa
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alsintanItems.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-slate-900 leading-tight">{item.namaAlat}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Tersedia'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Jenis: {item.jenis} • Kondisi: {item.kondisi}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-amber-700">{formatRupiah(item.hargaSewaHari)} / hari</span>
                      <span className="text-[11px] text-slate-400">{formatRupiah(item.hargaSewaJam)} / jam</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rekapitulasi Sewa Alsintan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Rekapitulasi Riwayat Sewa Alsintan
                </h4>
                <p className="text-[11px] text-slate-500">Total Pendapatan Sewa: <strong>{formatRupiah(stats.pendapatanSewaAlsintan)}</strong></p>
              </div>

              <button
                onClick={() => {
                  const data = alsintanRentals.map(r => ({
                    'Kode Sewa': r.kodeSewa,
                    'Tanggal': r.tanggal,
                    'Alat Mesin': r.namaAlat,
                    'Penyewa': r.namaPenyewa,
                    'Kontak': r.kontak,
                    'Durasi': `${r.durasi} ${r.satuanDurasi}`,
                    'Total Biaya': r.totalBiaya,
                    'Status': r.status
                  }));
                  exportToExcel(data, 'Laporan_Sewa_Alsintan');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Rekap</span>
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Kode & Tanggal</th>
                    <th className="pb-2">Nama Alat</th>
                    <th className="pb-2">Penyewa</th>
                    <th className="pb-2 text-center">Durasi</th>
                    <th className="pb-2 text-right">Total Biaya</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alsintanRentals.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      <td className="py-2 font-mono">
                        <div className="font-bold text-slate-900">{r.kodeSewa}</div>
                        <div className="text-[10px] text-slate-400">{r.tanggal}</div>
                      </td>
                      <td className="py-2 font-medium text-slate-800">{r.namaAlat}</td>
                      <td className="py-2 text-slate-700">{r.namaPenyewa}</td>
                      <td className="py-2 text-center">{r.durasi} {r.satuanDurasi}</td>
                      <td className="py-2 text-right font-bold text-amber-700">{formatRupiah(r.totalBiaya)}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        {r.status === 'Aktif' && (
                          <button
                            onClick={() => selesaikanSewaAlsintan(r.id)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 text-emerald-700 text-[10px] font-bold"
                          >
                            Kembalikan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LAYANAN BRILINK SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'brilink' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Transaksi Brilink */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-sky-600" />
                Input Transaksi Loket Brilink
              </h3>

              <form onSubmit={handleAddBrilink} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jenis Transaksi</label>
                  <select
                    value={brilinkTipe}
                    onChange={e => setBrilinkTipe(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Tarik Tunai">Tarik Tunai Bank</option>
                    <option value="Transfer Bank">Transfer Antar Bank</option>
                    <option value="Top-Up E-Wallet">Top-Up DANA / OVO / GoPay</option>
                    <option value="PLN / Token">PLN Token & Tagihan Listrik</option>
                    <option value="Pulsa & Paket Data">Pulsa Seluler</option>
                    <option value="BPJS & Lainnya">Iuran BPJS Kesehatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nominal Transaksi (Rp)</label>
                  <input
                    type="number"
                    value={brilinkNominal}
                    onChange={e => setBrilinkNominal(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Fee Admin Koperasi (Rp)</label>
                  <input
                    type="number"
                    value={brilinkFee}
                    onChange={e => setBrilinkFee(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sky-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nama Nasabah / Petani</label>
                  <input
                    type="text"
                    value={brilinkNasabah}
                    onChange={e => setBrilinkNasabah(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nomor Rekening / ID Pelanggan</label>
                  <input
                    type="text"
                    value={brilinkTujuan}
                    onChange={e => setBrilinkTujuan(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Simpan Transaksi Loket
                </button>
              </form>
            </div>

            {/* Riwayat Transaksi Brilink */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Riwayat Transaksi & Akumulasi Fee Loket
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Total Pendapatan Fee: <strong className="text-sky-700">{formatRupiah(stats.pendapatanFeeBrilink)}</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    const data = brilinkList.map(b => ({
                      'Kode': b.kodeTransaksi,
                      'Waktu': b.tanggal,
                      'Tipe': b.tipe,
                      'Nasabah': b.namaNasabah,
                      'Nominal': b.nominal,
                      'Fee Admin': b.feeAdmin,
                      'Status': b.status
                    }));
                    exportToExcel(data, 'Rekap_Brilink_Mitra_Tani');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Excel</span>
                </button>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-2">Waktu & Kode</th>
                      <th className="pb-2">Jenis Layanan</th>
                      <th className="pb-2">Nasabah</th>
                      <th className="pb-2 text-right">Nominal</th>
                      <th className="pb-2 text-right">Fee Admin</th>
                      <th className="pb-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brilinkList.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 font-mono">
                          <div className="font-bold text-slate-900">{b.kodeTransaksi}</div>
                          <div className="text-[10px] text-slate-400">{b.tanggal}</div>
                        </td>
                        <td className="py-2.5 font-medium text-slate-800">{b.tipe}</td>
                        <td className="py-2.5 text-slate-700">{b.namaNasabah}</td>
                        <td className="py-2.5 text-right font-semibold text-slate-900">{formatRupiah(b.nominal)}</td>
                        <td className="py-2.5 text-right font-bold text-sky-700">+{formatRupiah(b.feeAdmin)}</td>
                        <td className="py-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SIMPAN PINJAM SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'simpan-pinjam' && (
        <div className="space-y-6">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="text-xs text-indigo-800 font-semibold">Total Seluruh Simpanan</div>
              <div className="text-xl font-bold text-indigo-950 mt-1">
                {formatRupiah(stats.totalAkumulasiSimpanan)}
              </div>
              <div className="text-[11px] text-indigo-700 mt-0.5">Dari 93 Anggota Terdaftar</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs text-amber-800 font-semibold">Total Pinjaman Berjalan</div>
              <div className="text-xl font-bold text-amber-950 mt-1">
                {formatRupiah(stats.totalPinjamanBerjalan)}
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">Akad aktif produktif tani</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs text-emerald-800 font-semibold">Pendapatan Jasa Pinjaman (1%)</div>
              <div className="text-xl font-bold text-emerald-950 mt-1">
                {formatRupiah(stats.pendapatanJasaPinjaman)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Bagi hasil jasa koperasi</div>
            </div>
          </div>

          {/* Form Pengajuan Pinjaman dengan Validasi Otomatis Max 2x Total Simpanan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Formulir Pengajuan Pinjaman Baru (Validasi Plafon Otomatis 2x)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sistem menolak otomatis pengajuan yang melebihi 2x dari total simpanan anggota terkait.
              </p>
            </div>

            {pinjamAlert && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  pinjamAlert.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {pinjamAlert.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{pinjamAlert.message}</span>
              </div>
            )}

            <form onSubmit={handleAjukanPinjaman} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pilih Anggota Pemohon *
                  </label>
                  <select
                    id="select-pinjam-anggota"
                    value={pinjamAnggotaId}
                    onChange={e => setPinjamAnggotaId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {anggotaList.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nomorAnggota} - {a.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plafon Information Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">Total Simpanan Anggota:</span>
                    <span className="font-bold text-slate-800">{formatRupiah(currentPinjamTotalSimpanan)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-700 font-semibold block">Plafon Maksimal (2x):</span>
                    <span className="text-sm font-bold text-blue-900">{formatRupiah(currentPinjamPlafon)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Jumlah Pengajuan (Rp) *
                  </label>
                  <input
                    id="input-pinjam-jumlah"
                    type="number"
                    value={pinjamJumlah}
                    onChange={e => setPinjamJumlah(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                  {pinjamJumlah > currentPinjamPlafon && (
                    <span className="text-[10px] text-red-600 font-bold block mt-1">
                      ⚠️ Melebihi batas plafon (Maksimal: {formatRupiah(currentPinjamPlafon)})
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tenor (Bulan)</label>
                  <select
                    value={pinjamTenor}
                    onChange={e => setPinjamTenor(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan</option>
                    <option value={10}>10 Bulan</option>
                    <option value={12}>12 Bulan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Keperluan Pinjaman</label>
                  <input
                    type="text"
                    value={pinjamTujuan}
                    onChange={e => setPinjamTujuan(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="Contoh: Beli pupuk musim tanam"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="btn-ajukan-pinjaman"
                  type="submit"
                  disabled={pinjamJumlah > currentPinjamPlafon}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Ajukan Pinjaman untuk Verifikasi Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nota Share Modal */}
      {activeNota && (
        <NotaModal
          panen={activeNota}
          anggota={anggotaList.find(a => a.id === activeNota.anggotaId)}
          onClose={() => setActiveNota(null)}
        />
      )}
    </div>
  );
};
