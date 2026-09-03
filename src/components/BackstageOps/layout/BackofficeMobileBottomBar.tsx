import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Store, 
  Menu,
  Sparkles
} from 'lucide-react';
import { BackstageNavModuleId } from '../../../utils/rbac';
import { Order } from '../../../types';

interface BackofficeMobileBottomBarProps {
  activeModule: BackstageNavModuleId;
  onSelectModule: (mod: BackstageNavModuleId) => void;
  onOpenDrawer: () => void;
  onOpenAICopilot: () => void;
  orders: Order[];
}

export const BackofficeMobileBottomBar: React.FC<BackofficeMobileBottomBarProps> = ({
  activeModule,
  onSelectModule,
  onOpenDrawer,
  onOpenAICopilot,
  orders
}) => {
  const activeKDSCount = orders.filter(o => o.status === 'preparing' || o.status === 'pending').length;

  const navItems = [
    { id: 'dashboard' as BackstageNavModuleId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos' as BackstageNavModuleId, label: 'Kasir POS', icon: ShoppingBag },
    { id: 'kds' as BackstageNavModuleId, label: 'Dapur KDS', icon: UtensilsCrossed, badge: activeKDSCount > 0 ? activeKDSCount : undefined },
    { id: 'floorplan' as BackstageNavModuleId, label: 'Meja Kafe', icon: Store }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE2D8] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer select-none ${
                isActive
                  ? 'text-[#B23812] font-black scale-105'
                  : 'text-[#5C5248] hover:text-[#1F1A16] font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#B23812]' : 'text-[#5C5248]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-[#C84B27] text-white text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#C84B27] mt-0.5" />
              )}
            </button>
          );
        })}

        {/* More / Menu Drawer Trigger */}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-[#5C5248] hover:text-[#1F1A16] transition-all cursor-pointer font-medium select-none"
        >
          <Menu className="w-5 h-5 text-[#5C5248]" />
          <span className="text-[10px] mt-0.5 tracking-tight">Semua Modul</span>
        </button>
      </div>
    </div>
  );
};
