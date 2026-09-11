import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Wheat, 
  Coins, 
  Store, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { NotificationItem } from '../../types/koperasi';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useKoperasi();

  if (!isOpen) return null;

  const getIcon = (tipe: NotificationItem['tipe']) => {
    switch (tipe) {
      case 'pinjaman':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'stok':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'panen':
        return <Wheat className="w-4 h-4 text-emerald-600" />;
      case 'keuangan':
        return <Store className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pusat Notifikasi Modern</h3>
              <p className="text-[11px] text-slate-500">
                Pemberitahuan real-time transaksi koperasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsAsRead}
              className="p-1.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Tandai Semua Telah Dibaca"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-50">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Belum ada notifikasi baru.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  !n.dibaca
                    ? 'bg-blue-50/40 border-blue-200'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getIcon(n.tipe)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {n.judul}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {n.waktu}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {n.pesan}
                    </p>
                  </div>

                  {!n.dibaca && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {notifications.filter(n => !n.dibaca).length} Belum dibaca
          </span>
          <button
            onClick={markAllNotificationsAsRead}
            className="text-blue-600 font-semibold hover:underline"
          >
            Tandai Semua Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
