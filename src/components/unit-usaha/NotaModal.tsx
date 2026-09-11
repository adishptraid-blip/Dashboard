import React from 'react';
import { 
  X, 
  Share2, 
  Printer, 
  Check, 
  Phone, 
  Wheat, 
  Sparkles, 
  Copy,
  ExternalLink
} from 'lucide-react';
import { PanenTransaction, Anggota } from '../../types/koperasi';
import { formatRupiah, formatAngka, formatTanggalIndo, generateWhatsAppNota } from '../../utils/exportUtils';

interface NotaModalProps {
  panen: PanenTransaction | null;
  anggota?: Anggota;
  onClose: () => void;
}

export const NotaModal: React.FC<NotaModalProps> = ({ panen, anggota, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!panen) return null;

  const nomorAnggota = anggota?.nomorAnggota || 'KOP-MTB';
  const noHp = panen.noHp || anggota?.noHp || '';

  const { text: waText, waUrl } = generateWhatsAppNota({
    kodeNota: panen.kodeNota,
    tanggal: panen.tanggal,
    namaPetani: panen.namaAnggota,
    nomorAnggota,
    noHp,
    komoditas: panen.komoditas,
    beratKg: panen.beratKg,
    hargaPerKg: panen.hargaPerKg,
    subtotal: panen.subtotal,
    potonganSukarela: panen.potonganSukarela,
    potonganWajib: panen.potonganWajib,
    totalPotongan: panen.totalPotongan,
    totalBersihPetani: panen.totalBersihPetani,
    tipePenjualan: panen.tipePenjualan
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(waText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Nota Digital Hasil Panen</h3>
              <p className="text-[11px] text-slate-500">Koperasi Produsen Mitra Tani Berkah</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Digital Receipt Layout */}
        <div className="my-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 font-sans text-xs">
          {/* Header of Nota */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight uppercase">
              Koperasi Produsen Mitra Tani Berkah
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              SK Kemenkumham: AHU-0004819.AH.01.26.TAHUN 2023 | NIB: 1904230058291
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
              BUKTI PEMBELIAN PANEN PETANI
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-dashed border-slate-300">
            <div>
              <span className="text-slate-400 block">No. Nota:</span>
              <span className="font-mono font-bold text-slate-900">{panen.kodeNota}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Tanggal:</span>
              <span className="font-medium text-slate-800">{formatTanggalIndo(panen.tanggal)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Nama Petani:</span>
              <span className="font-bold text-slate-900">{panen.namaAnggota}</span>
              <span className="text-[10px] text-blue-600 block">{nomorAnggota}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Saluran Penjualan:</span>
              <span className="font-medium text-slate-800">{panen.tipePenjualan}</span>
            </div>
          </div>

          {/* Commodity & Weight */}
          <div className="space-y-1.5 pb-3 border-b border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">{panen.komoditas}</span>
              <span className="font-mono font-semibold text-slate-700">{formatAngka(panen.beratKg)} Kg</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Harga Acuan Koperasi</span>
              <span>{formatRupiah(panen.hargaPerKg)} / Kg</span>
            </div>
            <div className="flex justify-between items-center font-bold text-slate-900 pt-1">
              <span>Subtotal Bruto</span>
              <span>{formatRupiah(panen.subtotal)}</span>
            </div>
          </div>

          {/* Automatic Deductions breakdown */}
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1.5 text-[11px]">
            <div className="font-bold text-blue-900 flex items-center justify-between">
              <span>Potongan Simpanan Otomatis</span>
              <span className="text-blue-700 font-mono">-{formatRupiah(panen.totalPotongan)}</span>
            </div>
            <div className="flex justify-between text-blue-700">
              <span>• Simpanan Sukarela ({panen.kategoriKomoditas === 'percabaian' ? 'Rp 400/kg' : 'Rp 100/kg'})</span>
              <span>{formatRupiah(panen.potonganSukarela)}</span>
            </div>
            <div className="flex justify-between text-blue-700">
              <span>• Simpanan Wajib ({panen.kategoriKomoditas === 'percabaian' ? 'Rp 100/kg' : 'Rp 50/kg'})</span>
              <span>{formatRupiah(panen.potonganWajib)}</span>
            </div>
            <p className="text-[10px] text-blue-600/90 pt-1 italic">
              *Telah otomatis dikreditkan ke buku saldo simpanan anggota di sistem koperasi.
            </p>
          </div>

          {/* Net payout */}
          <div className="p-3 rounded-xl bg-emerald-600 text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-emerald-100 block">TOTAL BERSIH PETANI:</span>
              <span className="text-base font-bold tracking-tight">{formatRupiah(panen.totalBersihPetani)}</span>
            </div>
            <div className="text-right text-[10px] text-emerald-100">
              Status: Lunas Tunai / Transfer
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-2 text-center text-[10px] text-slate-400">
            Terima kasih telah mempercayakan hasil panen kepada Koperasi Mitra Tani Berkah.
          </div>
        </div>

        {/* WhatsApp & Print Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <a
              id="btn-share-whatsapp-nota"
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim ke WhatsApp Petani ({noHp || 'No HP'})</span>
              <ExternalLink className="w-3 h-3 text-emerald-200" />
            </a>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Salin Teks Nota"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Cetak Struk"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {copied && (
            <p className="text-[11px] text-emerald-600 text-center font-medium">
              Teks nota WhatsApp berhasil disalin ke clipboard!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
