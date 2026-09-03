import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bell, 
  ShoppingBag, 
  AlertTriangle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Order, TableItem } from '../../../types';
import { BackstageNavModuleId } from '../../../utils/rbac';

interface BackofficeNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  tables: TableItem[];
  onNavigateToModule: (mod: BackstageNavModuleId) => void;
}

export const BackofficeNotificationDrawer: React.FC<BackofficeNotificationDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  tables,
  onNavigateToModule
}) => {
  const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'pending');
  const occupiedTables = tables.filter(t => t.status === 'occupied' || t.status === 'billing');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-2xs"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 max-w-md w-full bg-white border-l border-[#EAE2D8] shadow-2xl p-5 sm:p-6 flex flex-col justify-between text-[#1F1A16]"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D8]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-[#1F1A16]">
                      Pusat Notifikasi Live
                    </h3>
                    <p className="text-[11px] text-[#5C5248]">
                      {activeOrders.length} antrean aktif • {occupiedTables.length} meja makan
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-100 text-[#5C5248] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Notification List */}
              <div className="py-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {activeOrders.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <Sparkles className="w-8 h-8 text-amber-600 mx-auto opacity-50" />
                    <p className="text-xs text-[#5C5248]">Tidak ada tiket pesanan tertunda.</p>
                  </div>
                ) : (
                  activeOrders.map(ord => (
                    <div
                      key={ord.id}
                      onClick={() => {
                        onClose();
                        onNavigateToModule('kds');
                      }}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-amber-50/60 border border-[#EAE2D8] hover:border-amber-300 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#B23812]">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          {ord.status === 'preparing' ? 'Sedang Dimasak' : 'Menunggu Dapur'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#1F1A16]">
                        {ord.customerName} • Meja #{ord.tableNumber || 'Takeaway'}
                      </div>
                      <div className="text-[11px] text-[#5C5248] truncate">
                        {ord.items.map(it => `${it.quantity}x ${it.menuItem.name}`).join(', ')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EAE2D8]">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToModule('kds');
                }}
                className="w-full py-3 rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buka Layar KDS Dapur</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
