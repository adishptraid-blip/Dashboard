import React, { useState } from 'react';
import { 
  Sprout, 
  Bell, 
  UserCircle, 
  ChevronDown, 
  ShieldCheck, 
  Database, 
  RefreshCw,
  Clock,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { RoleType } from '../../types/koperasi';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenNotifications: () => void;
  onOpenSupabaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  onOpenNotifications,
  onOpenSupabaseModal
}) => {
  const { 
    currentUser, 
    setCurrentUserRole, 
    usersList, 
    notifications, 
    supabaseConfig,
    resetAllDataToDefault 
  } = useKoperasi();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const unreadNotifCount = notifications.filter(n => !n.dibaca).length;

  const roles: RoleType[] = [
    'Super Admin',
    'Pengurus Koperasi',
    'Admin Toko Saprodi',
    'Admin Agribisnis',
    'Petugas Lapangan & Kasir'
  ];

  const handleResetData = () => {
    if (window.confirm('Reset seluruh data transaksi ke 93 anggota awal & setting bawaan koperasi?')) {
      resetAllDataToDefault();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="btn-sidebar-toggle"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
                  MITRA TANI BERKAH
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Produsen
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Sistem Terpadu Koperasi Pertanian Modern
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick actions, Database status, Notifications, User Role switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Database indicator */}
          <button
            id="btn-db-status"
            onClick={onOpenSupabaseModal}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              supabaseConfig.isConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Konfigurasi Database Supabase"
          >
            <Database className={`w-3.5 h-3.5 ${supabaseConfig.isConnected ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span>{supabaseConfig.isConnected ? 'Supabase Terhubung' : 'DB Lokal (Siap Supabase)'}</span>
          </button>

          {/* Reset button */}
          <button
            id="btn-reset-demo"
            onClick={handleResetData}
            title="Reset Data ke Kondisi Awal (93 Anggota)"
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors hidden sm:flex items-center gap-1 text-xs font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden xl:inline">Reset Data Awal</span>
          </button>

          {/* Notifications Button */}
          <button
            id="btn-notification-center"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Pusat Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
              </span>
            )}
          </button>

          {/* Role & User Selector */}
          <div className="relative">
            <button
              id="btn-user-role-dropdown"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/70 hover:bg-blue-50/50 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.nama.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1">
                  {currentUser.nama}
                </div>
                <div className="text-[11px] text-blue-600 font-medium leading-none mt-0.5">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                onClick={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider">
                    Ganti Hak Akses / Role Akun
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Login sebagai petugas koperasi
                  </p>
                </div>

                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => setCurrentUserRole(r)}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      currentUser.role === r ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}

                <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-[11px] text-slate-400">
                  Email: {currentUser.email}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
