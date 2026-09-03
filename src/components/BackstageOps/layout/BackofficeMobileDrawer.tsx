import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  FileText, 
  Lock,
  Palette,
  Sparkles,
  Radio
} from 'lucide-react';
import { UserRole } from '../../../types';
import { BackstageNavModuleId, checkRBACPermission } from '../../../utils/rbac';
import { BACKOFFICE_NAV_GROUPS } from './BackofficeSidebar';

interface BackofficeMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: BackstageNavModuleId;
  onSelectModule: (mod: BackstageNavModuleId) => void;
  userRole: UserRole;
  onNavigateToCustomerPortal: () => void;
  onOpenPitchDeck?: () => void;
  onOpenThemeCustomizer?: () => void;
  onOpenAICopilot?: () => void;
  onOpenOwnerRadar?: () => void;
}

export const BackofficeMobileDrawer: React.FC<BackofficeMobileDrawerProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  userRole,
  onNavigateToCustomerPortal,
  onOpenPitchDeck,
  onOpenThemeCustomizer,
  onOpenAICopilot,
  onOpenOwnerRadar
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-2xs"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 max-w-xs w-full bg-white border-r border-[#EAE2D8] shadow-2xl p-5 flex flex-col justify-between text-[#1F1A16]"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
                <h3 className="font-display font-black text-base text-[#1F1A16]">
                  Menu Backoffice
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-stone-100 text-[#5C5248] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation List */}
              <div className="py-3 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                {BACKOFFICE_NAV_GROUPS.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <div className="text-[10px] font-mono font-bold tracking-wider text-[#5C5248] px-2 uppercase">
                      {group.title}
                    </div>

                    <div className="space-y-1 pt-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeModule === item.id;
                        const perm = checkRBACPermission(userRole, item.moduleCode, 'L');
                        const hasAccess = perm.allowed;

                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onClose();
                              onSelectModule(item.id);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#C84B27] text-white shadow-xs'
                                : hasAccess
                                  ? 'text-[#5C5248] hover:text-[#1F1A16] hover:bg-[#FAF7F2]'
                                  : 'text-stone-400 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {!hasAccess && <Lock className="w-3 h-3 text-stone-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Executive Tools & Theme Customizer Quick Triggers */}
            <div className="pt-2 space-y-1.5">
              {onOpenAICopilot && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAICopilot();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500/10 to-[#C84B27]/10 hover:from-amber-500/20 hover:to-[#C84B27]/20 text-[#B23812] border border-[#C84B27]/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#B23812] animate-pulse" />
                    <span>AI Executive Copilot</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-[#C84B27] text-white px-1.5 py-0.5 rounded">AI</span>
                </button>
              )}

              {onOpenOwnerRadar && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenOwnerRadar();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-[#B23812] animate-pulse" />
                    <span>Owner Live Radar</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">LIVE</span>
                </button>
              )}

              {onOpenThemeCustomizer && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenThemeCustomizer();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold bg-[#FAF7F2] hover:bg-stone-200 text-[#1F1A16] border border-[#EAE2D8] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 text-[#B23812]" />
                    <span>Kustomisasi Tema & Desain</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5C5248] font-bold uppercase">Ubah</span>
                </button>
              )}
            </div>

            {/* Bottom Quick Links */}
            <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between text-xs shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToCustomerPortal();
                }}
                className="flex items-center gap-1.5 text-amber-800 hover:text-amber-900 font-bold cursor-pointer py-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Portal Tamu</span>
              </button>
              {onOpenPitchDeck && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPitchDeck();
                  }}
                  className="flex items-center gap-1.5 text-[#5C5248] hover:text-[#1F1A16] font-bold cursor-pointer py-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Dokumen PRD</span>
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
