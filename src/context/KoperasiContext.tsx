import React, { createContext, useContext, useState, useEffect } from 'react';
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
  RoleType,
  UserAccount,
  SupabaseConfig
} from '../types/koperasi';

import {
  INITIAL_93_MEMBERS,
  INITIAL_COMMODITY_PRICES,
  INITIAL_SAPRODI_ITEMS,
  INITIAL_SAPRODI_CASHFLOW,
  INITIAL_ALSINTAN_ITEMS,
  INITIAL_ALSINTAN_RENTALS,
  INITIAL_PANEN_TRANSACTIONS,
  INITIAL_BRILINK_TRANSACTIONS,
  INITIAL_LOAN_APPLICATIONS,
  INITIAL_SAVINGS_CASHFLOW,
  INITIAL_OPERATIONAL_EXPENSE,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS
} from '../data/initialData';

import { getStoredSupabaseConfig, saveSupabaseConfig } from '../utils/supabaseClient';

interface KoperasiContextType {
  // Anggota
  anggotaList: Anggota[];
  tambahAnggota: (data: Omit<Anggota, 'id' | 'nomorAnggota' | 'tanggalDaftar'>) => Anggota;
  updateAnggota: (id: string, data: Partial<Anggota>) => void;
  hapusAnggota: (id: string) => void;
  getNextNomorAnggota: () => string;

  // Harga Komoditas
  commodityPrices: CommodityPrice[];
  updateHargaKomoditas: (id: string, hargaBaru: number, keterangan?: string) => void;

  // Agribisnis & Panen
  panenList: PanenTransaction[];
  tambahTransaksiPanen: (data: {
    anggotaId: string;
    komoditas: string;
    beratKg: number;
    hargaPerKg: number;
    tipePenjualan: 'Koperasi Mandiri' | 'BUMDes';
    catatan?: string;
  }) => PanenTransaction;

  // Saprodi
  saprodiItems: SaprodiItem[];
  tambahBarangSaprodi: (data: Omit<SaprodiItem, 'id' | 'margin' | 'marginPersen' | 'tanggalUpdate'>) => void;
  updateBarangSaprodi: (id: string, data: Partial<SaprodiItem>) => void;
  hapusBarangSaprodi: (id: string) => void;
  saprodiCashflow: SaprodiCashFlow[];
  tambahArusKasSaprodi: (data: Omit<SaprodiCashFlow, 'id' | 'tanggal'>) => void;

  // Alsintan
  alsintanItems: AlsintanItem[];
  tambahAlsintan: (data: Omit<AlsintanItem, 'id'>) => void;
  updateAlsintan: (id: string, data: Partial<AlsintanItem>) => void;
  alsintanRentals: AlsintanRental[];
  tambahSewaAlsintan: (data: {
    alsintanId: string;
    anggotaId: string;
    durasi: number;
    satuanDurasi: 'Hari' | 'Jam';
  }) => void;
  selesaikanSewaAlsintan: (rentalId: string) => void;

  // Brilink
  brilinkList: BrilinkTransaction[];
  tambahTransaksiBrilink: (data: Omit<BrilinkTransaction, 'id' | 'kodeTransaksi' | 'tanggal'>) => void;

  // Pinjaman
  loans: LoanApplication[];
  ajukanPinjaman: (data: {
    anggotaId: string;
    jumlahPinjaman: number;
    tenorBulan: number;
    tujuanPinjaman: string;
  }) => { success: boolean; message: string; loan?: LoanApplication };
  verifikasiPinjaman: (loanId: string, status: 'Disetujui' | 'Ditolak') => void;
  cairkanPinjaman: (loanId: string) => void;

  // Simpanan & Arus Kas
  savingsCashflow: SavingsCashFlow[];
  tambahSimpananManual: (data: {
    anggotaId: string;
    jenisSimpanan: 'Simpanan Pokok' | 'Simpanan Wajib' | 'Simpanan Sukarela' | 'Penyertaan Modal Ketahanan Pangan';
    tipe: 'Masuk' | 'Keluar';
    jumlah: number;
    keterangan: string;
    metode: 'Tunai' | 'Potongan Panen' | 'Transfer';
  }) => void;

  // Operasional & Modal
  operationalExpense: OperationalExpense;
  updateOperationalExpense: (data: Partial<OperationalExpense>) => void;

  // Notifikasi
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  tambahNotifikasi: (notif: Omit<NotificationItem, 'id' | 'waktu' | 'dibaca'>) => void;

  // Users & Roles
  currentUser: UserAccount;
  setCurrentUserRole: (role: RoleType) => void;
  usersList: UserAccount[];

  // Supabase Config & Tools
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: SupabaseConfig) => void;
  resetAllDataToDefault: () => void;

  // Calculated Financial Metrics
  hitungStatistikKeuangan: () => {
    totalAnggotaAktif: number;
    totalAnggotaNonAktif: number;
    totalSimpananPokok: number;
    totalSimpananWajib: number;
    totalSimpananSukarela: number;
    totalModalKetahananPangan: number;
    totalAkumulasiSimpanan: number;
    totalPinjamanBerjalan: number;
    pendapatanSharingProfitSayuran: number;
    pendapatanBumdesSayuran: number;
    pendapatanSaprodiKotor: number;
    danaTaktisSaprodi10Persen: number;
    pendapatanSaprodiNetto: number;
    pendapatanSewaAlsintan: number;
    pendapatanFeeBrilink: number;
    pendapatanJasaPinjaman: number;
    totalPendapatanBruto: number;
    totalOperasionalBulanan: number;
    pendapatanBersihSebelumZakat: number;
    potonganZakat2_5: number;
    pendapatanBersihSetelahZakat: number;
    alokasiSHU35: number;
    alokasiPembinaan5: number;
    alokasiBOP30: number;
    alokasiCadangan30: number;
  };
}

const KoperasiContext = createContext<KoperasiContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kop_produsen_mitra_tani_berkah_v1';

export const KoperasiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or use defaults
  const [anggotaList, setAnggotaList] = useState<Anggota[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_anggota`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_93_MEMBERS;
  });

  const [commodityPrices, setCommodityPrices] = useState<CommodityPrice[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_prices`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMODITY_PRICES;
  });

  const [panenList, setPanenList] = useState<PanenTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_panen`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PANEN_TRANSACTIONS;
  });

  const [saprodiItems, setSaprodiItems] = useState<SaprodiItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_saprodi`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAPRODI_ITEMS;
  });

  const [saprodiCashflow, setSaprodiCashflow] = useState<SaprodiCashFlow[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_saprodi_cf`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAPRODI_CASHFLOW;
  });

  const [alsintanItems, setAlsintanItems] = useState<AlsintanItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_alsintan`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALSINTAN_ITEMS;
  });

  const [alsintanRentals, setAlsintanRentals] = useState<AlsintanRental[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_alsintan_rent`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALSINTAN_RENTALS;
  });

  const [brilinkList, setBrilinkList] = useState<BrilinkTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_brilink`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BRILINK_TRANSACTIONS;
  });

  const [loans, setLoans] = useState<LoanApplication[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_loans`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LOAN_APPLICATIONS;
  });

  const [savingsCashflow, setSavingsCashflow] = useState<SavingsCashFlow[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_savings_cf`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAVINGS_CASHFLOW;
  });

  const [operationalExpense, setOperationalExpense] = useState<OperationalExpense>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ops`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OPERATIONAL_EXPENSE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [usersList] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[1]); // Super Admin default
  const [supabaseConfig, setSupabaseConfigState] = useState<SupabaseConfig>(getStoredSupabaseConfig);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_anggota`, JSON.stringify(anggotaList));
  }, [anggotaList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_prices`, JSON.stringify(commodityPrices));
  }, [commodityPrices]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_panen`, JSON.stringify(panenList));
  }, [panenList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saprodi`, JSON.stringify(saprodiItems));
  }, [saprodiItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saprodi_cf`, JSON.stringify(saprodiCashflow));
  }, [saprodiCashflow]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_alsintan`, JSON.stringify(alsintanItems));
  }, [alsintanItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_alsintan_rent`, JSON.stringify(alsintanRentals));
  }, [alsintanRentals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_brilink`, JSON.stringify(brilinkList));
  }, [brilinkList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_loans`, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_savings_cf`, JSON.stringify(savingsCashflow));
  }, [savingsCashflow]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ops`, JSON.stringify(operationalExpense));
  }, [operationalExpense]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
  }, [notifications]);

  // Reset to initial state
  const resetAllDataToDefault = () => {
    setAnggotaList(INITIAL_93_MEMBERS);
    setCommodityPrices(INITIAL_COMMODITY_PRICES);
    setPanenList(INITIAL_PANEN_TRANSACTIONS);
    setSaprodiItems(INITIAL_SAPRODI_ITEMS);
    setSaprodiCashflow(INITIAL_SAPRODI_CASHFLOW);
    setAlsintanItems(INITIAL_ALSINTAN_ITEMS);
    setAlsintanRentals(INITIAL_ALSINTAN_RENTALS);
    setBrilinkList(INITIAL_BRILINK_TRANSACTIONS);
    setLoans(INITIAL_LOAN_APPLICATIONS);
    setSavingsCashflow(INITIAL_SAVINGS_CASHFLOW);
    setOperationalExpense(INITIAL_OPERATIONAL_EXPENSE);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const getNextNomorAnggota = (): string => {
    const nextNum = anggotaList.length + 1;
    return `KOP-MTB ${String(nextNum).padStart(4, '0')}`;
  };

  const tambahNotifikasi = (notif: Omit<NotificationItem, 'id' | 'waktu' | 'dibaca'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `ntf-${Date.now()}`,
      waktu: 'Baru saja',
      dibaca: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, dibaca: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dibaca: true })));
  };

  const setCurrentUserRole = (role: RoleType) => {
    const match = usersList.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const updateSupabaseConfig = (config: SupabaseConfig) => {
    setSupabaseConfigState(config);
    saveSupabaseConfig(config);
  };

  // Anggota CRUD
  const tambahAnggota = (data: Omit<Anggota, 'id' | 'nomorAnggota' | 'tanggalDaftar'>): Anggota => {
    const nomorAnggota = getNextNomorAnggota();
    const today = new Date().toISOString().split('T')[0];
    const newAnggota: Anggota = {
      ...data,
      id: `agt-${Date.now()}`,
      nomorAnggota,
      // Ketentuan Wajib: Pembayaran Simpanan Pokok Rp 100.000 (hanya dibayar 1x di awal)
      simpananPokok: 100000,
      tanggalDaftar: today
    };

    setAnggotaList(prev => [newAnggota, ...prev]);

    // Record the Simpanan Pokok entry to savings cash flow
    const cashflowEntry: SavingsCashFlow = {
      id: `sav-${Date.now()}`,
      tanggal: today,
      anggotaId: newAnggota.id,
      namaAnggota: newAnggota.nama,
      jenisSimpanan: 'Simpanan Pokok',
      tipe: 'Masuk',
      jumlah: 100000,
      keterangan: `Pembayaran Simpanan Pokok awal pendaftaran anggota baru (${newAnggota.nomorAnggota})`,
      metode: 'Tunai'
    };
    setSavingsCashflow(prev => [cashflowEntry, ...prev]);

    tambahNotifikasi({
      judul: 'Anggota Baru Terdaftar',
      pesan: `${newAnggota.nama} resmi terdaftar dengan nomor ${newAnggota.nomorAnggota} dan melunasi Simpanan Pokok Rp 100.000.`,
      tipe: 'anggota',
      targetModul: 'anggota'
    });

    return newAnggota;
  };

  const updateAnggota = (id: string, data: Partial<Anggota>) => {
    setAnggotaList(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a))
    );
  };

  const hapusAnggota = (id: string) => {
    setAnggotaList(prev => prev.filter(a => a.id !== id));
  };

  // Commodity price update
  const updateHargaKomoditas = (id: string, hargaBaru: number, keterangan?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setCommodityPrices(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            hargaAcuan: hargaBaru,
            tanggalUpdate: today,
            keterangan: keterangan || p.keterangan
          };
        }
        return p;
      })
    );

    tambahNotifikasi({
      judul: 'Pembaruan Harga Acuan Harian',
      pesan: `Harga acuan komoditas telah disesuaikan menjadi Rp ${hargaBaru.toLocaleString('id-ID')}/Kg.`,
      tipe: 'info',
      targetModul: 'agribisnis'
    });
  };

  // Panen Transaction & Auto Deduction
  const tambahTransaksiPanen = (data: {
    anggotaId: string;
    komoditas: string;
    beratKg: number;
    hargaPerKg: number;
    tipePenjualan: 'Koperasi Mandiri' | 'BUMDes';
    catatan?: string;
  }): PanenTransaction => {
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    const namaAnggota = anggota ? anggota.nama : 'Petani Mitra';
    const noHp = anggota ? anggota.noHp : '';

    // Check if category is percabaian or sayuran_lain
    const isPercabaian = 
      data.komoditas.toLowerCase().includes('cabai') || 
      data.komoditas.toLowerCase().includes('cabe');

    const kategoriKomoditas = isPercabaian ? 'percabaian' : 'sayuran_lain';

    // Rules from prompt:
    // Percabaian: Rp 500/kg (Rp 400 Sukarela, Rp 100 Wajib)
    // Non-Percabaian: Rp 150/kg (Rp 100 Sukarela, Rp 50 Wajib)
    const tarifSukarela = isPercabaian ? 400 : 100;
    const tarifWajib = isPercabaian ? 100 : 50;

    const potonganSukarela = data.beratKg * tarifSukarela;
    const potonganWajib = data.beratKg * tarifWajib;
    const totalPotongan = potonganSukarela + potonganWajib;

    const subtotal = data.beratKg * data.hargaPerKg;
    const totalBersihPetani = subtotal - totalPotongan;

    // Sharing Profit (Rp 100 - Rp 500/kg)
    const marginSharingPerKg = isPercabaian ? 350 : 200;
    const sharingProfitKoperasi = data.beratKg * marginSharingPerKg;

    const today = new Date().toISOString().split('T')[0];
    const kodeNota = `NOTA-PNN-${Date.now().toString().slice(-6)}`;

    const newPanen: PanenTransaction = {
      id: `pn-${Date.now()}`,
      kodeNota,
      tanggal: today,
      anggotaId: data.anggotaId,
      namaAnggota,
      noHp,
      komoditas: data.komoditas,
      kategoriKomoditas,
      beratKg: data.beratKg,
      hargaPerKg: data.hargaPerKg,
      subtotal,
      potonganSukarela,
      potonganWajib,
      totalPotongan,
      totalBersihPetani,
      sharingProfitKoperasi,
      tipePenjualan: data.tipePenjualan,
      catatan: data.catatan
    };

    setPanenList(prev => [newPanen, ...prev]);

    // Automatically update the member's savings!
    if (anggota) {
      updateAnggota(anggota.id, {
        simpananSukarela: anggota.simpananSukarela + potonganSukarela,
        simpananWajib: anggota.simpananWajib + potonganWajib
      });

      // Add to savings cash flow
      const cfSukarela: SavingsCashFlow = {
        id: `sav-${Date.now()}-1`,
        tanggal: today,
        anggotaId: anggota.id,
        namaAnggota: anggota.nama,
        jenisSimpanan: 'Simpanan Sukarela',
        tipe: 'Masuk',
        jumlah: potonganSukarela,
        keterangan: `Autodebet panen ${data.komoditas} (${data.beratKg} Kg x Rp ${tarifSukarela})`,
        metode: 'Potongan Panen'
      };

      const cfWajib: SavingsCashFlow = {
        id: `sav-${Date.now()}-2`,
        tanggal: today,
        anggotaId: anggota.id,
        namaAnggota: anggota.nama,
        jenisSimpanan: 'Simpanan Wajib',
        tipe: 'Masuk',
        jumlah: potonganWajib,
        keterangan: `Autodebet panen ${data.komoditas} (${data.beratKg} Kg x Rp ${tarifWajib})`,
        metode: 'Potongan Panen'
      };

      setSavingsCashflow(prev => [cfSukarela, cfWajib, ...prev]);
    }

    tambahNotifikasi({
      judul: 'Transaksi Panen Diproses',
      pesan: `Panen ${data.komoditas} ${data.beratKg} Kg dari ${namaAnggota} diproses. Bersih: Rp ${totalBersihPetani.toLocaleString('id-ID')}, Tabungan bertambah: Rp ${totalPotongan.toLocaleString('id-ID')}.`,
      tipe: 'panen',
      targetModul: 'agribisnis'
    });

    return newPanen;
  };

  // Saprodi CRUD
  const tambahBarangSaprodi = (data: Omit<SaprodiItem, 'id' | 'margin' | 'marginPersen' | 'tanggalUpdate'>) => {
    const margin = data.hargaJual - data.hargaBeli;
    const marginPersen = data.hargaBeli > 0 ? Number(((margin / data.hargaBeli) * 100).toFixed(2)) : 0;
    const today = new Date().toISOString().split('T')[0];

    const newItem: SaprodiItem = {
      ...data,
      id: `sap-${Date.now()}`,
      margin,
      marginPersen,
      tanggalUpdate: today
    };

    setSaprodiItems(prev => [newItem, ...prev]);

    // Check low stock
    if (newItem.stok <= newItem.stokMinimal) {
      tambahNotifikasi({
        judul: 'Peringatan Stok Saprodi Menipis',
        pesan: `Stok ${newItem.namaBarang} tersisa ${newItem.stok} ${newItem.satuan} (Batas minimum: ${newItem.stokMinimal}). Harap segera lakukan restock.`,
        tipe: 'stok',
        targetModul: 'saprodi'
      });
    }
  };

  const updateBarangSaprodi = (id: string, data: Partial<SaprodiItem>) => {
    setSaprodiItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const hargaBeli = data.hargaBeli !== undefined ? data.hargaBeli : item.hargaBeli;
          const hargaJual = data.hargaJual !== undefined ? data.hargaJual : item.hargaJual;
          const margin = hargaJual - hargaBeli;
          const marginPersen = hargaBeli > 0 ? Number(((margin / hargaBeli) * 100).toFixed(2)) : 0;
          const updated = {
            ...item,
            ...data,
            margin,
            marginPersen,
            tanggalUpdate: new Date().toISOString().split('T')[0]
          };

          // Warn if below min stock
          if (updated.stok <= updated.stokMinimal && updated.stok < item.stok) {
            tambahNotifikasi({
              judul: 'Peringatan Stok Saprodi Menipis',
              pesan: `Stok ${updated.namaBarang} tersisa ${updated.stok} ${updated.satuan}.`,
              tipe: 'stok',
              targetModul: 'saprodi'
            });
          }

          return updated;
        }
        return item;
      })
    );
  };

  const hapusBarangSaprodi = (id: string) => {
    setSaprodiItems(prev => prev.filter(item => item.id !== id));
  };

  const tambahArusKasSaprodi = (data: Omit<SaprodiCashFlow, 'id' | 'tanggal'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newCF: SaprodiCashFlow = {
      ...data,
      id: `scf-${Date.now()}`,
      tanggal: today
    };
    setSaprodiCashflow(prev => [newCF, ...prev]);
  };

  // Alsintan
  const tambahAlsintan = (data: Omit<AlsintanItem, 'id'>) => {
    const newItem: AlsintanItem = {
      ...data,
      id: `als-${Date.now()}`
    };
    setAlsintanItems(prev => [newItem, ...prev]);
  };

  const updateAlsintan = (id: string, data: Partial<AlsintanItem>) => {
    setAlsintanItems(prev =>
      prev.map(a => (a.id === id ? { ...a, ...data } : a))
    );
  };

  const tambahSewaAlsintan = (data: {
    alsintanId: string;
    anggotaId: string;
    durasi: number;
    satuanDurasi: 'Hari' | 'Jam';
  }) => {
    const alat = alsintanItems.find(a => a.id === data.alsintanId);
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    if (!alat || !anggota) return;

    const tarifSatuan = data.satuanDurasi === 'Hari' ? alat.hargaSewaHari : alat.hargaSewaJam;
    const totalBiaya = tarifSatuan * data.durasi;
    const today = new Date().toISOString().split('T')[0];
    const kodeSewa = `SW-ALT-${Date.now().toString().slice(-4)}`;

    const newRental: AlsintanRental = {
      id: `rnt-${Date.now()}`,
      kodeSewa,
      tanggal: today,
      alsintanId: alat.id,
      namaAlat: alat.namaAlat,
      anggotaId: anggota.id,
      namaPenyewa: anggota.nama,
      kontak: anggota.noHp,
      durasi: data.durasi,
      satuanDurasi: data.satuanDurasi,
      tarifSatuan,
      totalBiaya,
      status: 'Aktif'
    };

    setAlsintanRentals(prev => [newRental, ...prev]);
    updateAlsintan(alat.id, { status: 'Disewa' });

    tambahNotifikasi({
      judul: 'Penyewaan Alsintan Baru',
      pesan: `${anggota.nama} menyewa ${alat.namaAlat} untuk ${data.durasi} ${data.satuanDurasi}. Total biaya sewa: Rp ${totalBiaya.toLocaleString('id-ID')}.`,
      tipe: 'keuangan',
      targetModul: 'alsintan'
    });
  };

  const selesaikanSewaAlsintan = (rentalId: string) => {
    const rental = alsintanRentals.find(r => r.id === rentalId);
    if (!rental) return;

    const today = new Date().toISOString().split('T')[0];
    setAlsintanRentals(prev =>
      prev.map(r => (r.id === rentalId ? { ...r, status: 'Selesai', tanggalSelesai: today } : r))
    );

    updateAlsintan(rental.alsintanId, { status: 'Tersedia' });
  };

  // Brilink
  const tambahTransaksiBrilink = (data: Omit<BrilinkTransaction, 'id' | 'kodeTransaksi' | 'tanggal'>) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const kodeTransaksi = `BRL-${Date.now().toString().slice(-6)}`;

    const newTrx: BrilinkTransaction = {
      ...data,
      id: `brl-${Date.now()}`,
      kodeTransaksi,
      tanggal: dateStr
    };

    setBrilinkList(prev => [newTrx, ...prev]);
  };

  // Loan Application with strictly enforced 2x savings validation
  const ajukanPinjaman = (data: {
    anggotaId: string;
    jumlahPinjaman: number;
    tenorBulan: number;
    tujuanPinjaman: string;
  }): { success: boolean; message: string; loan?: LoanApplication } => {
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    if (!anggota) {
      return { success: false, message: 'Data anggota tidak ditemukan.' };
    }

    if (anggota.status !== 'Aktif') {
      return { success: false, message: 'Hanya anggota berstatus AKTIF yang dapat mengajukan pinjaman.' };
    }

    const totalSimpanan = anggota.simpananPokok + anggota.simpananWajib + anggota.simpananSukarela;
    const plafonMaksimal = totalSimpanan * 2;

    // Strict validation: maksimal 2x dari total simpanan
    if (data.jumlahPinjaman > plafonMaksimal) {
      return {
        success: false,
        message: `Pengajuan melebihi plafon! Maksimal pinjaman adalah 2x total simpanan (Rp ${plafonMaksimal.toLocaleString('id-ID')}). Total simpanan anggota saat ini adalah Rp ${totalSimpanan.toLocaleString('id-ID')}.`
      };
    }

    const bungaPersenPerBulan = 1.0; // 1% flat jasa koperasi per bulan
    const pokokBulanan = data.jumlahPinjaman / data.tenorBulan;
    const jasaBulanan = data.jumlahPinjaman * (bungaPersenPerBulan / 100);
    const cicilanBulanan = Math.round(pokokBulanan + jasaBulanan);

    const today = new Date().toISOString().split('T')[0];
    const kodePinjaman = `PINJ-${Date.now().toString().slice(-6)}`;

    const newLoan: LoanApplication = {
      id: `ln-${Date.now()}`,
      kodePinjaman,
      tanggalPengajuan: today,
      anggotaId: anggota.id,
      namaAnggota: anggota.nama,
      noHp: anggota.noHp,
      totalSimpananSaatIni: totalSimpanan,
      plafonMaksimal,
      jumlahPinjaman: data.jumlahPinjaman,
      tenorBulan: data.tenorBulan,
      bungaPersenPerBulan,
      cicilanBulanan,
      tujuanPinjaman: data.tujuanPinjaman,
      status: 'Menunggu Persetujuan',
      sisaPinjaman: data.jumlahPinjaman
    };

    setLoans(prev => [newLoan, ...prev]);

    tambahNotifikasi({
      judul: 'Pengajuan Pinjaman Baru',
      pesan: `${anggota.nama} mengajukan pinjaman Rp ${data.jumlahPinjaman.toLocaleString('id-ID')} (${data.tenorBulan} bulan). Memerlukan persetujuan pengurus.`,
      tipe: 'pinjaman',
      targetModul: 'pinjaman'
    });

    return {
      success: true,
      message: 'Pengajuan pinjaman berhasil diajukan dan memenuhi syarat plafon 2x simpanan.',
      loan: newLoan
    };
  };

  const verifikasiPinjaman = (loanId: string, status: 'Disetujui' | 'Ditolak') => {
    const today = new Date().toISOString().split('T')[0];
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status, tanggalDisetujui: today } : l))
    );

    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      tambahNotifikasi({
        judul: `Pinjaman ${status}`,
        pesan: `Pengajuan pinjaman ${loan.kodePinjaman} oleh ${loan.namaAnggota} telah ${status.toLowerCase()} oleh Pengurus.`,
        tipe: 'pinjaman',
        targetModul: 'pinjaman'
      });
    }
  };

  const cairkanPinjaman = (loanId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setLoans(prev =>
      prev.map(l => (l.id === loanId ? { ...l, status: 'Dicairkan', tanggalDicairkan: today } : l))
    );

    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      tambahNotifikasi({
        judul: 'Pencairan Pinjaman Berhasil',
        pesan: `Dana pinjaman sebesar Rp ${loan.jumlahPinjaman.toLocaleString('id-ID')} telah dicairkan kepada ${loan.namaAnggota}.`,
        tipe: 'keuangan',
        targetModul: 'pinjaman'
      });
    }
  };

  // Savings & Cash Flow Manual
  const tambahSimpananManual = (data: {
    anggotaId: string;
    jenisSimpanan: 'Simpanan Pokok' | 'Simpanan Wajib' | 'Simpanan Sukarela' | 'Penyertaan Modal Ketahanan Pangan';
    tipe: 'Masuk' | 'Keluar';
    jumlah: number;
    keterangan: string;
    metode: 'Tunai' | 'Potongan Panen' | 'Transfer';
  }) => {
    const anggota = anggotaList.find(a => a.id === data.anggotaId);
    const namaAnggota = anggota ? anggota.nama : 'Anggota Koperasi';
    const today = new Date().toISOString().split('T')[0];

    const newCF: SavingsCashFlow = {
      id: `sav-${Date.now()}`,
      tanggal: today,
      anggotaId: data.anggotaId,
      namaAnggota,
      jenisSimpanan: data.jenisSimpanan,
      tipe: data.tipe,
      jumlah: data.jumlah,
      keterangan: data.keterangan,
      metode: data.metode
    };

    setSavingsCashflow(prev => [newCF, ...prev]);

    // Update individual balance if it's an existing member
    if (anggota) {
      const multiplier = data.tipe === 'Masuk' ? 1 : -1;
      const delta = data.jumlah * multiplier;

      if (data.jenisSimpanan === 'Simpanan Pokok') {
        updateAnggota(anggota.id, { simpananPokok: Math.max(0, anggota.simpananPokok + delta) });
      } else if (data.jenisSimpanan === 'Simpanan Wajib') {
        updateAnggota(anggota.id, { simpananWajib: Math.max(0, anggota.simpananWajib + delta) });
      } else if (data.jenisSimpanan === 'Simpanan Sukarela') {
        updateAnggota(anggota.id, { simpananSukarela: Math.max(0, anggota.simpananSukarela + delta) });
      }
    }
  };

  const updateOperationalExpense = (data: Partial<OperationalExpense>) => {
    setOperationalExpense(prev => ({ ...prev, ...data }));
  };

  // Hitung Laba Rugi & Indikator Finansial Lengkap
  const hitungStatistikKeuangan = () => {
    // 1. Anggota
    const totalAnggotaAktif = anggotaList.filter(a => a.status === 'Aktif').length;
    const totalAnggotaNonAktif = anggotaList.filter(a => a.status === 'Non-Aktif').length;

    // 2. Simpanan
    const totalSimpananPokok = anggotaList.reduce((sum, a) => sum + (a.simpananPokok || 0), 0);
    const totalSimpananWajib = anggotaList.reduce((sum, a) => sum + (a.simpananWajib || 0), 0);
    const totalSimpananSukarela = anggotaList.reduce((sum, a) => sum + (a.simpananSukarela || 0), 0);
    const totalModalKetahananPangan = operationalExpense.penyertaanModalPangan || 0;
    const totalAkumulasiSimpanan = totalSimpananPokok + totalSimpananWajib + totalSimpananSukarela + totalModalKetahananPangan;

    // 3. Pinjaman Berjalan
    const totalPinjamanBerjalan = loans
      .filter(l => l.status === 'Dicairkan')
      .reduce((sum, l) => sum + l.sisaPinjaman, 0);

    // 4. Pendapatan Kotor (Bruto) dari seluruh unit
    // A. Agribisnis Sayuran
    const pendapatanSharingProfitSayuran = panenList
      .filter(p => p.tipePenjualan === 'Koperasi Mandiri')
      .reduce((sum, p) => sum + p.sharingProfitKoperasi, 0);

    const pendapatanBumdesSayuran = panenList
      .filter(p => p.tipePenjualan === 'BUMDes')
      .reduce((sum, p) => sum + p.sharingProfitKoperasi, 0);

    // B. Toko Saprodi (Setelah dikurangi Dana Taktis 10%)
    // Pemasukan dari penjualan barang saprodi
    const totalPemasukanSaprodi = saprodiCashflow
      .filter(cf => cf.tipe === 'Pemasukan' && cf.kategori === 'Penjualan Barang')
      .reduce((sum, cf) => sum + cf.jumlah, 0);

    // Margin estimasi penjualan toko saprodi
    const estimasiMarginSaprodi = totalPemasukanSaprodi * 0.12; // rata-rata margin 12%
    const pendapatanSaprodiKotor = estimasiMarginSaprodi > 0 ? estimasiMarginSaprodi : 2800000;
    // Ketentuan: Otomatis dipotong Dana Taktis 10%
    const danaTaktisSaprodi10Persen = pendapatanSaprodiKotor * 0.10;
    const pendapatanSaprodiNetto = pendapatanSaprodiKotor - danaTaktisSaprodi10Persen;

    // C. Alsintan (Total pendapatan sewa)
    const pendapatanSewaAlsintan = alsintanRentals
      .filter(r => r.status === 'Selesai' || r.status === 'Aktif')
      .reduce((sum, r) => sum + r.totalBiaya, 0);

    // D. Brilink (Fee Admin)
    const pendapatanFeeBrilink = brilinkList
      .filter(b => b.status === 'Berhasil')
      .reduce((sum, b) => sum + b.feeAdmin, 0);

    // E. Simpan Pinjam (Jasa Bunga 1% per bulan dari pinjaman aktif)
    const pendapatanJasaPinjaman = loans
      .filter(l => l.status === 'Dicairkan')
      .reduce((sum, l) => sum + (l.jumlahPinjaman * (l.bungaPersenPerBulan / 100)), 0);

    // Total Bruto
    const totalPendapatanBruto =
      pendapatanSharingProfitSayuran +
      pendapatanBumdesSayuran +
      pendapatanSaprodiNetto +
      pendapatanSewaAlsintan +
      pendapatanFeeBrilink +
      pendapatanJasaPinjaman;

    // Pengurangan Operasional Bulanan
    const totalOperasionalBulanan =
      (operationalExpense.gajiPegawai || 0) +
      (operationalExpense.sewaTempat || 0) +
      (operationalExpense.listrikDanAir || 0) +
      (operationalExpense.biayaOperasionalLain || 0);

    // Pendapatan Bersih (Netto Sebelum Zakat)
    const pendapatanBersihSebelumZakat = Math.max(0, totalPendapatanBruto - (totalOperasionalBulanan * 0.15)); // Proposional bulan berjalan atau bruto aktual

    // Potongan Zakat Koperasi: 2,5% dari Pendapatan Bersih
    const potonganZakat2_5 = Math.round(pendapatanBersihSebelumZakat * 0.025);

    // Total Pendapatan Bersih Bulanan (Setelah Zakat)
    const pendapatanBersihSetelahZakat = pendapatanBersihSebelumZakat - potonganZakat2_5;

    // Distribusi Keuntungan Bulanan
    // SHU: 35%
    const alokasiSHU35 = Math.round(pendapatanBersihSetelahZakat * 0.35);
    // Dana Pembinaan: 5%
    const alokasiPembinaan5 = Math.round(pendapatanBersihSetelahZakat * 0.05);
    // Biaya Operasional Pengurus (BOP): 30%
    const alokasiBOP30 = Math.round(pendapatanBersihSetelahZakat * 0.30);
    // Cadangan Kas Koperasi: 30%
    const alokasiCadangan30 = Math.round(pendapatanBersihSetelahZakat * 0.30);

    return {
      totalAnggotaAktif,
      totalAnggotaNonAktif,
      totalSimpananPokok,
      totalSimpananWajib,
      totalSimpananSukarela,
      totalModalKetahananPangan,
      totalAkumulasiSimpanan,
      totalPinjamanBerjalan,
      pendapatanSharingProfitSayuran,
      pendapatanBumdesSayuran,
      pendapatanSaprodiKotor,
      danaTaktisSaprodi10Persen,
      pendapatanSaprodiNetto,
      pendapatanSewaAlsintan,
      pendapatanFeeBrilink,
      pendapatanJasaPinjaman,
      totalPendapatanBruto,
      totalOperasionalBulanan,
      pendapatanBersihSebelumZakat,
      potonganZakat2_5,
      pendapatanBersihSetelahZakat,
      alokasiSHU35,
      alokasiPembinaan5,
      alokasiBOP30,
      alokasiCadangan30
    };
  };

  return (
    <KoperasiContext.Provider
      value={{
        anggotaList,
        tambahAnggota,
        updateAnggota,
        hapusAnggota,
        getNextNomorAnggota,
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
        updateAlsintan,
        alsintanRentals,
        tambahSewaAlsintan,
        selesaikanSewaAlsintan,
        brilinkList,
        tambahTransaksiBrilink,
        loans,
        ajukanPinjaman,
        verifikasiPinjaman,
        cairkanPinjaman,
        savingsCashflow,
        tambahSimpananManual,
        operationalExpense,
        updateOperationalExpense,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        tambahNotifikasi,
        currentUser,
        setCurrentUserRole,
        usersList,
        supabaseConfig,
        updateSupabaseConfig,
        resetAllDataToDefault,
        hitungStatistikKeuangan
      }}
    >
      {children}
    </KoperasiContext.Provider>
  );
};

export const useKoperasi = () => {
  const context = useContext(KoperasiContext);
  if (!context) {
    throw new Error('useKoperasi must be used within a KoperasiProvider');
  }
  return context;
};
