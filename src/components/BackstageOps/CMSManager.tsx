import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Utensils, 
  Megaphone, 
  Calendar, 
  Settings, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  ExternalLink, 
  Image as ImageIcon, 
  Sparkles, 
  Wifi, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Coffee,
  Flame,
  Music
} from 'lucide-react';
import { MenuItem, MenuCategory } from '../../types';
import { INITIAL_MENU_ITEMS, CAFE_INFO } from '../../data/mockData';
import { api } from '../../services/api';
import { soundService } from '../../utils/audioChime';

interface CMSManagerProps {
  showToast: (msg: string) => void;
}

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  category: 'live-music' | 'workshop' | 'cupping' | 'gathering';
  performerName: string;
  eventDate: string;
  timeSlot: string;
  ticketPrice: number;
  quota: number;
  posterUrl: string;
  isActive: boolean;
}

const formatEventDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

export const CMSManager: React.FC<CMSManagerProps> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'banners' | 'events' | 'settings' | 'reviews'>('menu');

  // ==========================================
  // STATE 1: MENU CATALOG ITEMS
  // ==========================================
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState<boolean>(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // Form State for Menu
  const [menuForm, setMenuForm] = useState<{
    name: string;
    category: MenuCategory;
    price: number;
    description: string;
    image: string;
    tasteProfile: string;
    isBestSeller: boolean;
    available: boolean;
  }>({
    name: '',
    category: 'coffee',
    price: 25000,
    description: '',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80',
    tasteProfile: 'Bold, Creamy, Aromatic',
    isBestSeller: false,
    available: true
  });

  // ==========================================
  // STATE 2: PROMO BANNERS
  // ==========================================
  const [banners, setBanners] = useState<PromoBanner[]>([
    {
      id: 'b-1',
      title: 'Diskon 20% Dine-In Siang',
      subtitle: 'Nikmati makan siang hemat setiap Senin - Jumat 11:00 s/d 14:00 WIB',
      badgeText: 'HAPPY HOUR',
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      ctaText: 'Pesan Meja Sekarang',
      ctaLink: '#reservation',
      isActive: true
    },
    {
      id: 'b-2',
      title: 'Acoustic Night Weekend',
      subtitle: 'Live performance musisi indie lokal setiap Sabtu malam pukul 19:30 WIB',
      badgeText: 'LIVE MUSIC',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      ctaText: 'Lihat Lineup',
      ctaLink: '#events',
      isActive: true
    }
  ]);
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState<boolean>(false);
  const [bannerForm, setBannerForm] = useState<Omit<PromoBanner, 'id'>>({
    title: '',
    subtitle: '',
    badgeText: 'PROMO SPESIAL',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    ctaText: 'Klaim Promo',
    ctaLink: '#menu',
    isActive: true
  });

  // ==========================================
  // STATE 3: COMMUNITY EVENTS
  // ==========================================
  const [events, setEvents] = useState<CommunityEvent[]>([
    {
      id: 'ev-1',
      title: 'Saturday Acoustic Session: The Cozie Vibe',
      category: 'live-music',
      performerName: 'The Kalisari Band & Friends',
      eventDate: '2026-09-05',
      timeSlot: '19:30 - 22:00 WIB',
      ticketPrice: 0,
      quota: 40,
      posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      isActive: true
    },
    {
      id: 'ev-2',
      title: 'Manual Brewing & Sensory Cupping Class',
      category: 'workshop',
      performerName: 'Dimas Kurniawan (Head Barista)',
      eventDate: '2026-09-12',
      timeSlot: '10:00 - 12:30 WIB',
      ticketPrice: 150000,
      quota: 12,
      posterUrl: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80',
      isActive: true
    }
  ]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
  const [eventForm, setEventForm] = useState<Omit<CommunityEvent, 'id'>>({
    title: '',
    category: 'live-music',
    performerName: '',
    eventDate: new Date().toISOString().split('T')[0],
    timeSlot: '19:30 - 22:00 WIB',
    ticketPrice: 0,
    quota: 30,
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    isActive: true
  });

  // ==========================================
  // STATE 4: CAFE SETTINGS & OPERATIONAL INFO
  // ==========================================
  const [cafeSettings, setCafeSettings] = useState({
    name: CAFE_INFO.name,
    slogan: 'Coffee, Kitchen & Creative Space Kalisari',
    wifiSsid: 'HomieCozie_Guest_5G',
    wifiPassword: 'HomieCozie#2026',
    hoursWeekday: 'Senin - Jumat: 10:00 - 23:00 WIB',
    hoursWeekend: 'Sabtu - Minggu: 08:00 - 23:30 WIB',
    phoneHotline: CAFE_INFO.phone,
    address: CAFE_INFO.address,
    googleMapsUrl: 'https://maps.app.goo.gl/homiecozie',
    instagram: '@homiecozie.id',
    tiktok: '@homiecozie_official'
  });

  // ==========================================
  // HANDLERS: MENU CRUD
  // ==========================================
  const handleToggleSoldOut = (id: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextAvail = !item.available;
        showToast(`✓ Status '${item.name}' diubah ke: ${nextAvail ? 'TERSEDIA' : 'HABIS (SOLD OUT)'}`);
        soundService.playCashRegisterSound();
        return { ...item, available: nextAvail };
      }
      return item;
    }));
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name || menuForm.price <= 0) return;

    if (editingMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingMenuItem.id 
          ? { ...item, ...menuForm }
          : item
      ));
      showToast(`✓ Menu '${menuForm.name}' berhasil diperbarui!`);
    } else {
      const newItem: MenuItem = {
        id: `m-custom-${Date.now()}`,
        ...menuForm,
        preparationTimeMinutes: 8
      };
      setMenuItems(prev => [newItem, ...prev]);
      showToast(`✓ Menu baru '${menuForm.name}' berhasil ditambahkan ke katalog!`);
    }

    soundService.playCashRegisterSound();
    setIsAddMenuModalOpen(false);
    setEditingMenuItem(null);
  };

  const handleDeleteMenu = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus menu '${name}' dari katalog?`)) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      showToast(`✓ Menu '${name}' berhasil dihapus.`);
    }
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      tasteProfile: item.tasteProfile || '',
      isBestSeller: Boolean(item.isBestSeller),
      available: Boolean(item.available)
    });
    setIsAddMenuModalOpen(true);
  };

  // ==========================================
  // HANDLERS: BANNERS & EVENTS
  // ==========================================
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner: PromoBanner = {
      id: `b-${Date.now()}`,
      ...bannerForm
    };
    setBanners(prev => [newBanner, ...prev]);
    setIsAddBannerModalOpen(false);
    soundService.playCashRegisterSound();
    showToast('✓ Banner promo baru berhasil dipublikasikan!');
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: CommunityEvent = {
      id: `ev-${Date.now()}`,
      ...eventForm
    };
    setEvents(prev => [newEvent, ...prev]);
    setIsAddEventModalOpen(false);
    soundService.playCashRegisterSound();
    showToast('✓ Jadwal event komunitas berhasil ditambahkan!');
  };

  const handleSaveCafeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    soundService.playCashRegisterSound();
    showToast('✓ Pengaturan operasional kafe & Wi-Fi berhasil diperbarui!');
  };

  // Filtered Menu
  const filteredMenuItems = menuItems.filter(item => {
    const matchCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    const matchSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                        item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-28">
      
      {/* 1. Header CMS */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 border border-amber-200 text-[#C84B27] flex items-center justify-center shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Globe className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-lg sm:text-2xl text-[#1F1A16] leading-tight">
                Content Management System (CMS)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C84B27]/10 text-[#C84B27] border border-[#C84B27]/20 shrink-0 whitespace-nowrap">
                LIVE WEB EDITOR
              </span>
            </div>
            <p className="text-xs text-[#5C5248] leading-relaxed">
              Kelola katalog menu, foto makanan, banner promo, jadwal live music, dan info Wi-Fi secara instan
            </p>
          </div>
        </div>

        {/* Quick External Preview Button */}
        <a
          href="#order"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-stone-200 border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95 shrink-0 whitespace-nowrap cursor-pointer"
        >
          <Eye className="w-4 h-4 text-[#C84B27] shrink-0" />
          <span>Lihat Website Tamu (Live Preview)</span>
        </a>
      </div>

      {/* 2. CMS Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#EAE2D8] text-xs font-bold">
        {[
          { id: 'menu', label: '🍽️ 1. Katalog Menu & Harga', count: menuItems.length },
          { id: 'banners', label: '📢 2. Banner Promo & Hero', count: banners.length },
          { id: 'events', label: '🎸 3. Jadwal Live Music & Event', count: events.length },
          { id: 'settings', label: '⚙️ 4. Info Kafe & Wi-Fi' },
          { id: 'reviews', label: '⭐ 5. Kurasi Ulasan Tamu' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C84B27] text-white shadow-xs'
                : 'text-[#5C5248] hover:bg-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MENU CATALOG MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EAE2D8] shadow-xs">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 max-w-xl">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#5C5248] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama menu, deskripsi..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-medium text-[#1F1A16] focus:outline-hidden focus:border-[#C84B27]"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl px-3 py-2 text-xs font-bold text-[#1F1A16] focus:outline-hidden focus:border-[#C84B27]"
              >
                <option value="all">Semua Kategori</option>
                <option value="coffee">Kopi Susu & Espresso</option>
                <option value="manual-brew">Manual Brew V60</option>
                <option value="non-coffee">Mocktail & Tea</option>
                <option value="kitchen-mains">Kitchen Mains</option>
                <option value="pasta-rice">Pasta & Rice</option>
                <option value="light-bites">Light Bites</option>
                <option value="pastry-dessert">Pastry & Dessert</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingMenuItem(null);
                setMenuForm({
                  name: '',
                  category: 'coffee',
                  price: 28000,
                  description: '',
                  image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80',
                  tasteProfile: 'Bold, Creamy, Aromatic',
                  isBestSeller: false,
                  available: true
                });
                setIsAddMenuModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Menu Baru</span>
            </button>
          </div>

          {/* Menu Table / Grid */}
          <div className="bg-white rounded-2xl border border-[#EAE2D8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[660px]">
                <thead className="bg-[#FAF7F2] border-b border-[#EAE2D8] font-mono text-[11px] text-[#5C5248] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 whitespace-nowrap min-w-[200px]">Menu & Foto</th>
                    <th className="p-3.5 whitespace-nowrap">Kategori</th>
                    <th className="p-3.5 whitespace-nowrap text-right">Harga Jual</th>
                    <th className="p-3.5 whitespace-nowrap text-center">Status Ketersediaan</th>
                    <th className="p-3.5 whitespace-nowrap text-center">Badge Promo</th>
                    <th className="p-3.5 text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D8]">
                  {filteredMenuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#EAE2D8] shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-[#1F1A16] block truncate">{item.name}</span>
                            <span className="text-[11px] text-[#5C5248] line-clamp-1 max-w-xs block">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EAE2D8] text-[10px] font-mono font-bold text-[#5C5248] uppercase inline-block">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#C84B27] whitespace-nowrap text-right">
                        Rp {item.price.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleSoldOut(item.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                            item.available
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-rose-50 text-rose-700 border-rose-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{item.available ? 'TERSEDIA' : 'SOLD OUT'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {item.isBestSeller ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold whitespace-nowrap inline-flex items-center gap-1 shadow-2xs">
                            <span>⭐</span>
                            <span>Best Seller</span>
                          </span>
                        ) : (
                          <span className="text-[#5C5248] font-mono text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditMenu(item)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1F1A16] transition-colors cursor-pointer shadow-2xs"
                            title="Edit Menu"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id, item.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer shadow-2xs"
                            title="Hapus Menu"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
      {/* TAB 2: PROMOTIONAL BANNERS CMS */}
      {/* ========================================================================= */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EAE2D8] shadow-xs">
            <div className="space-y-0.5">
              <h3 className="font-display font-bold text-base text-[#1F1A16]">Banner Promo & Hero Header</h3>
              <p className="text-xs text-[#5C5248]">Kelola banner promosi dan pengumuman yang muncul di beranda tamu</p>
            </div>
            <button
              onClick={() => setIsAddBannerModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Banner Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(banner => (
              <div key={banner.id} className="bg-white rounded-2xl border border-[#EAE2D8] overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="relative h-44 overflow-hidden bg-stone-900">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex flex-col justify-between">
                    <span className="self-start px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C84B27] text-white shadow-xs">
                      {banner.badgeText}
                    </span>
                    <div>
                      <h4 className="font-display font-black text-lg text-white leading-tight">{banner.title}</h4>
                      <p className="text-xs text-stone-200 mt-0.5 line-clamp-1">{banner.subtitle}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between bg-[#FAF7F2] border-t border-[#EAE2D8]">
                  <span className="text-xs font-mono text-[#5C5248]">Tombol: <strong>{banner.ctaText}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, isActive: !b.isActive } : b));
                        showToast(`✓ Status banner '${banner.title}' diperbarui.`);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border cursor-pointer transition-all ${
                        banner.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {banner.isActive ? 'AKTIF' : 'NONAKTIF'}
                    </button>
                    <button
                      onClick={() => {
                        setBanners(prev => prev.filter(b => b.id !== banner.id));
                        showToast('✓ Banner promo berhasil dihapus.');
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="Hapus Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COMMUNITY EVENTS & LIVE MUSIC */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EAE2D8] shadow-xs">
            <div className="space-y-0.5">
              <h3 className="font-display font-bold text-base text-[#1F1A16]">Jadwal Live Music & Workshop</h3>
              <p className="text-xs text-[#5C5248]">Atur agenda akustik, cupping, dan kelas barista komunitas</p>
            </div>
            <button
              onClick={() => setIsAddEventModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Jadwalkan Event Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl border border-[#EAE2D8] p-4 shadow-xs flex items-start gap-3.5 sm:gap-4">
                <img
                  src={ev.posterUrl}
                  alt={ev.title}
                  className="w-24 h-32 rounded-2xl object-cover border border-[#EAE2D8] shrink-0 shadow-2xs"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold uppercase inline-block">
                    {ev.category}
                  </span>
                  <h4 className="font-display font-bold text-sm text-[#1F1A16] leading-snug line-clamp-2">
                    {ev.title}
                  </h4>
                  <p className="text-xs text-[#5C5248] truncate">
                    Oleh: <strong className="text-[#1F1A16]">{ev.performerName}</strong>
                  </p>
                  <div className="flex flex-col gap-0.5 text-[11px] font-mono text-[#5C5248] pt-0.5">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>📅</span>
                      <span className="font-semibold text-[#5C5248]">{formatEventDate(ev.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span>⏰</span>
                      <span>{ev.timeSlot}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-[#EAE2D8]">
                    <span className="font-mono font-bold text-xs text-[#C84B27]">
                      {ev.ticketPrice === 0 ? 'FREE ENTRY' : `Rp ${ev.ticketPrice.toLocaleString('id-ID')}`}
                    </span>
                    <button
                      onClick={() => {
                        setEvents(prev => prev.filter(e => e.id !== ev.id));
                        showToast('✓ Event berhasil dihapus.');
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CAFE SETTINGS & OPERATIONAL INFO */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveCafeSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EAE2D8] shadow-xs space-y-5 max-w-3xl">
          <div className="border-b border-[#EAE2D8] pb-3">
            <h3 className="font-bold text-sm text-[#1F1A16]">Informasi Operasional Kafe & Fasilitas Tamu</h3>
            <p className="text-xs text-[#5C5248]">Pengaturan ini langsung tampil di footer dan halaman portal tamu</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Wi-Fi SSID */}
            <div className="space-y-1">
              <label className="font-bold text-[#1F1A16] flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#C84B27]" />
                <span>Nama Wi-Fi Tamu (SSID):</span>
              </label>
              <input
                type="text"
                value={cafeSettings.wifiSsid}
                onChange={(e) => setCafeSettings({ ...cafeSettings, wifiSsid: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono text-xs text-[#1F1A16]"
              />
            </div>

            {/* Wi-Fi Password */}
            <div className="space-y-1">
              <label className="font-bold text-[#1F1A16] flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#C84B27]" />
                <span>Password Wi-Fi:</span>
              </label>
              <input
                type="text"
                value={cafeSettings.wifiPassword}
                onChange={(e) => setCafeSettings({ ...cafeSettings, wifiPassword: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono font-bold text-xs text-[#C84B27]"
              />
            </div>

            {/* Hours Weekday */}
            <div className="space-y-1">
              <label className="font-bold text-[#1F1A16] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Jam Buka Weekday (Senin - Jumat):</span>
              </label>
              <input
                type="text"
                value={cafeSettings.hoursWeekday}
                onChange={(e) => setCafeSettings({ ...cafeSettings, hoursWeekday: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs text-[#1F1A16]"
              />
            </div>

            {/* Hours Weekend */}
            <div className="space-y-1">
              <label className="font-bold text-[#1F1A16] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Jam Buka Weekend (Sabtu - Minggu):</span>
              </label>
              <input
                type="text"
                value={cafeSettings.hoursWeekend}
                onChange={(e) => setCafeSettings({ ...cafeSettings, hoursWeekend: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs text-[#1F1A16]"
              />
            </div>

            {/* WhatsApp Hotline */}
            <div className="space-y-1">
              <label className="font-bold text-[#1F1A16] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>No. WhatsApp Hotline Reservasi:</span>
              </label>
              <input
                type="text"
                value={cafeSettings.phoneHotline}
                onChange={(e) => setCafeSettings({ ...cafeSettings, phoneHotline: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono text-xs text-[#1F1A16]"
              />
            </div>

            {/* Google Maps Link */}
            <div className="space-y-1">
              <label className="font-bold text-[#1F1A16] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Link Google Maps:</span>
              </label>
              <input
                type="text"
                value={cafeSettings.googleMapsUrl}
                onChange={(e) => setCafeSettings({ ...cafeSettings, googleMapsUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono text-xs text-[#1F1A16]"
              />
            </div>

          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            Simpan Pengaturan Kafe
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: REVIEWS MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-5 rounded-2xl border border-[#EAE2D8] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#1F1A16]">Kurasi Ulasan & Testimoni Pelanggan</h3>
            <p className="text-xs text-[#5C5248]">Kelola ulasan terverifikasi yang ditampilkan di section testimoni beranda</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Rangga P.', tag: 'Warga Kalisari • Verified Visit', rating: 5, text: 'Tempatnya cozy banget buat WFC, kopi susunya creamy legit, colokan banyak dan baristanya ramah!' },
              { name: 'Nadia S.', tag: 'Food Enthusiast Jakarta', rating: 5, text: 'Truffle pasta and manual brew Flores Bajawa were amazing. Suasana outdoor sore hari sejuk banget.' },
              { name: 'Adit & Komunitas Pitstop', tag: 'VIP Member Platinum', rating: 5, text: 'Basecamp nongkrong paling solid di Cijantung. Live acoustic-nya seru banget tiap malam minggu!' }
            ].map((rev, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F1A16]">{rev.name}</span>
                    <span className="text-[10px] text-[#5C5248] font-mono">({rev.tag})</span>
                  </div>
                  <div className="flex text-amber-400 text-xs mt-0.5">★★★★★</div>
                  <p className="text-xs text-[#5C5248] mt-1">"{rev.text}"</p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono">
                  TERPASANG DI WEB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT MENU ITEM */}
      {/* ========================================================================= */}
      {isAddMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D8] shadow-2xl w-full max-w-lg space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
              <h3 className="font-display font-black text-lg text-[#1F1A16]">
                {editingMenuItem ? 'Edit Menu Katalog' : 'Tambah Menu Baru ke Katalog'}
              </h3>
              <button onClick={() => setIsAddMenuModalOpen(false)} className="p-1 rounded-lg hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Nama Menu:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Susu Aren Cremosa"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold text-[#1F1A16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Kategori:</label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as MenuCategory })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold text-[#1F1A16]"
                  >
                    <option value="coffee">Kopi Susu & Espresso</option>
                    <option value="manual-brew">Manual Brew V60</option>
                    <option value="non-coffee">Mocktail & Tea</option>
                    <option value="kitchen-mains">Kitchen Mains</option>
                    <option value="pasta-rice">Pasta & Noodles</option>
                    <option value="light-bites">Light Bites</option>
                    <option value="pastry-dessert">Pastry & Dessert</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Harga Jual (Rp):</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono font-bold text-xs text-[#C84B27]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Deskripsi Menu:</label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan bahan utama, rasa, dan keunikan hidangan..."
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs text-[#1F1A16]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">URL Foto Menu (Unsplash / CDN):</label>
                <input
                  type="url"
                  value={menuForm.image}
                  onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono text-[11px] text-[#1F1A16]"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.isBestSeller}
                    onChange={(e) => setMenuForm({ ...menuForm, isBestSeller: e.target.checked })}
                    className="w-4 h-4 text-[#C84B27] rounded"
                  />
                  <span className="font-bold text-xs text-[#1F1A16]">Badge Best Seller ⭐</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.available}
                    onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-xs text-[#1F1A16]">Status Tersedia ✅</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#EAE2D8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMenuModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#5C5248] font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold shadow-xs"
                >
                  {editingMenuItem ? 'Simpan Perubahan' : 'Terbitkan Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD BANNER */}
      {/* ========================================================================= */}
      {isAddBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D8] shadow-2xl w-full max-w-md space-y-4">
            <h3 className="font-display font-black text-lg text-[#1F1A16]">Buat Banner Promo Baru</h3>
            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Judul Promo:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskon 20% WFC Siang"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Deskripsi Singkat:</label>
                <input
                  type="text"
                  placeholder="Syarat atau jam berlaku..."
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">URL Gambar Banner:</label>
                <input
                  type="url"
                  required
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono text-[11px]"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddBannerModalOpen(false)} className="px-4 py-2 rounded-xl bg-stone-100 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#C84B27] text-white font-bold">Terbitkan Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD EVENT */}
      {/* ========================================================================= */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D8] shadow-2xl w-full max-w-md space-y-4">
            <h3 className="font-display font-black text-lg text-[#1F1A16]">Jadwalkan Event Komunitas</h3>
            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Nama Acara:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Saturday Acoustic Night"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Musisi / Instruktur:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: The Kalisari Band"
                  value={eventForm.performerName}
                  onChange={(e) => setEventForm({ ...eventForm, performerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Tanggal Acara:</label>
                  <input
                    type="date"
                    required
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Jam Acara:</label>
                  <input
                    type="text"
                    required
                    placeholder="19:30 - 22:00 WIB"
                    value={eventForm.timeSlot}
                    onChange={(e) => setEventForm({ ...eventForm, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddEventModalOpen(false)} className="px-4 py-2 rounded-xl bg-stone-100 font-bold">Batal</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#C84B27] text-white font-bold">Simpan Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
