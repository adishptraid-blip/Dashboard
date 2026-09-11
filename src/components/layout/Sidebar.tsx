import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Store,
  CreditCard,
  PieChart,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  TrendingUp,
  Tractor,
  Wheat,
  Banknote,
  PiggyBank
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';

export type ActiveTabType = 
  | 'dashboard'
  | 'profil'
  | 'anggota'
  | 'unit-usaha'
  | 'pinjaman'
  | 'keuangan'
  | 'laporan-simpanan'
  | 'admin';

interface SidebarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile
}) => {
  const { notifications, loans } = useKoperasi();

  const pendingLoansCount = loans.filter(l => l.status === 'Menunggu Persetujuan').length;
  const unreadNotifCount = notifications.filter(n => !n.dibaca).length;

  const menuItems = [
    {
      id: 'dashboard' as ActiveTabType,
      label: '1. Dashboard Utama',
      sublabel: 'Statistik & Ringkasan',
      icon: LayoutDashboard,
      badge: unreadNotifCount > 0 ? `${unreadNotifCount} baru` : null,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'profil' as ActiveTabType,
      label: '2. Profil Koperasi',
      sublabel: 'Legalitas SK & NIB',
      icon: Building2
    },
    {
      id: 'anggota' as ActiveTabType,
      label: '3. Keanggotaan',
      sublabel: '93 Anggota & Saldo',
      icon: Users,
      badge: '93',
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'unit-usaha' as ActiveTabType,
      label: '4. Unit Usaha Terpadu',
      sublabel: 'Saprodi, Alsintan, Panen',
      icon: Store,
      badge: '5 Unit',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'pinjaman' as ActiveTabType,
      label: '5. Pengajuan Pinjaman',
      sublabel: 'Validasi Plafon 2x',
      icon: CreditCard,
      badge: pendingLoansCount > 0 ? `${pendingLoansCount} tunggu` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'keuangan' as ActiveTabType,
      label: '6. Keuangan & Margin',
      sublabel: 'Laba Rugi, SHU, Zakat',
      icon: PieChart
    },
    {
      id: 'laporan-simpanan' as ActiveTabType,
      label: '7. Laporan Simpanan',
      sublabel: 'Rekap & Arus Kas',
      icon: FileSpreadsheet
    },
    {
      id: 'admin' as ActiveTabType,
      label: '8. Admin & Database',
      sublabel: 'Role, Supabase, Deploy',
      icon: Settings
    }
  ];

  const handleSelect = (id: ActiveTabType) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Backdrop on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Operasional
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-slate-700/80'}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs tracking-tight truncate leading-snug">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 ml-2">
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50">
          <div className="rounded-xl p-2.5 bg-slate-900 border border-slate-800 text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span>Status Koperasi</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Operasional
              </span>
            </div>
            <div className="text-slate-300 font-medium truncate">
              Produsen Mitra Tani Berkah
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              NIB: 1904230058291
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
