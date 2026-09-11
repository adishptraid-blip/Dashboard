import React, { useState } from 'react';
import { KoperasiProvider } from './context/KoperasiContext';
import { Sidebar, ActiveTabType } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProfilKoperasiView } from './components/profil/ProfilKoperasiView';
import { AnggotaView } from './components/anggota/AnggotaView';
import { UnitUsahaContainer } from './components/unit-usaha/UnitUsahaContainer';
import { PinjamanView } from './components/pinjaman/PinjamanView';
import { KeuanganView } from './components/keuangan/KeuanganView';
import { LaporanView } from './components/laporan/LaporanView';
import { AdminRoleView } from './components/admin/AdminRoleView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={tab => setActiveTab(tab)}
            onOpenNotifications={() => setNotificationOpen(true)}
          />
        );
      case 'profil':
        return <ProfilKoperasiView />;
      case 'anggota':
        return <AnggotaView />;
      case 'unit-usaha':
        return <UnitUsahaContainer />;
      case 'pinjaman':
        return <PinjamanView />;
      case 'keuangan':
        return <KeuanganView />;
      case 'laporan-simpanan':
        return <LaporanView />;
      case 'admin-role':
        return <AdminRoleView />;
      default:
        return (
          <DashboardView
            onNavigate={tab => setActiveTab(tab)}
            onOpenNotifications={() => setNotificationOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={tab => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        isOpenMobile={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Body Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenNotifications={() => setNotificationOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              © 2024 - 2029 <strong>KOPERASI PRODUSEN MITRA TANI BERKAH</strong>. Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>SK Kemenkumham: AHU-0004819.AH.01.26</span>
              <span>•</span>
              <span>NIB: 1904230058291</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Supabase Cloud Ready</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modern Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <KoperasiProvider>
      <MainAppContent />
    </KoperasiProvider>
  );
}
