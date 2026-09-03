import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  RotateCw, 
  TrendingDown, 
  DollarSign, 
  Coffee, 
  X,
  FileSpreadsheet,
  Edit,
  ShoppingCart,
  Scan,
  Truck
} from 'lucide-react';
import { INVENTORY_ITEMS } from '../../data/mockData';
import { DataTable, ColumnDef, FilterConfig, BulkAction } from '../Common/DataTable';
import { SupplierPOModal } from './inventory/SupplierPOModal';
import { BarcodeScannerModal } from './inventory/BarcodeScannerModal';

export const InventoryStock: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(5);
  const [showPOModal, setShowPOModal] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  // New Item Modal State
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('coffee');
  const [newItemCurrentStock, setNewItemCurrentStock] = useState<number>(10);
  const [newItemMinStock, setNewItemMinStock] = useState<number>(5);
  const [newItemUnit, setNewItemUnit] = useState<string>('kg');
  const [newItemCost, setNewItemCost] = useState<number>(85000);
  const [newItemSupplier, setNewItemSupplier] = useState<string>('PT Kopi Nusantara');

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const handleRestock = () => {
    if (!restockModalItem) return;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === restockModalItem.id) {
          const newQty = it.currentStock + restockAmount;
          const status = newQty >= it.minStock ? 'optimal' : 'warning';
          return { ...it, currentStock: newQty, status };
        }
        return it;
      })
    );
    setRestockModalItem(null);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const status = newItemCurrentStock <= newItemMinStock * 0.5 ? 'critical' : newItemCurrentStock <= newItemMinStock ? 'warning' : 'optimal';
    const created: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      currentStock: newItemCurrentStock,
      minStock: newItemMinStock,
      unit: newItemUnit,
      costPerUnit: newItemCost,
      supplier: newItemSupplier,
      status
    };

    setItems((prev) => [created, ...prev]);
    setShowAddItemModal(false);
    setNewItemName('');
  };

  const handleImportInventory = (importedRows: Record<string, any>[]) => {
    const newItems: InventoryItem[] = importedRows.map((row, idx) => {
      const current = Number(row.currentStock || row['Stok Saat Ini'] || 10);
      const min = Number(row.minStock || row['Batas Minimum'] || 5);
      const status = current <= min * 0.5 ? 'critical' : current <= min ? 'warning' : 'optimal';

      return {
        id: row.id || `inv-${Date.now()}-${idx}`,
        name: row.name || row['Nama Bahan'] || 'Bahan Baku Baru',
        category: (row.category || row['Kategori'] || 'coffee').toLowerCase(),
        currentStock: current,
        minStock: min,
        unit: row.unit || row['Satuan'] || 'kg',
        costPerUnit: Number(row.costPerUnit || row['HPP/Unit'] || 50000),
        supplier: row.supplier || row['Vendor Supplier'] || 'Supplier Lokal',
        status
      };
    });

    setItems((prev) => [...newItems, ...prev]);
  };

  const criticalItems = items.filter((i) => i.status === 'critical' || i.status === 'warning');

  // 1. Column Definitions for DataTable
  const columns: ColumnDef<InventoryItem>[] = [
    {
      header: 'Bahan Baku & SKU',
      accessorKey: 'name',
      sortable: true,
      minWidth: '220px',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-[#B23812] flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-[#1F1A16] truncate">{row.name}</div>
            <span className="text-[10px] text-[#5C5248] font-mono uppercase tracking-wider block">{row.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Vendor / Supplier',
      accessorKey: 'supplier',
      sortable: true,
      minWidth: '150px',
      cell: ({ row }) => (
        <span className="text-xs font-mono text-[#5C5248] font-medium whitespace-nowrap block truncate max-w-[150px]">{row.supplier}</span>
      )
    },
    {
      header: 'Stok Fisik',
      accessorKey: 'currentStock',
      sortable: true,
      minWidth: '120px',
      align: 'right',
      cell: ({ row }) => (
        <div className="text-right font-mono whitespace-nowrap">
          <div className="font-bold text-sm text-[#1F1A16]">
            {row.currentStock} {row.unit}
          </div>
          <span className="text-[10px] text-[#5C5248] block">Min: {row.minStock} {row.unit}</span>
        </div>
      )
    },
    {
      header: 'Biaya HPP / Unit',
      accessorKey: 'costPerUnit',
      sortable: true,
      minWidth: '130px',
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-[#1F1A16] text-xs whitespace-nowrap">
          {formatRupiah(row.costPerUnit)} / {row.unit}
        </span>
      )
    },
    {
      header: 'Total Nilai Stok',
      sortable: true,
      minWidth: '130px',
      accessorFn: (row) => row.currentStock * row.costPerUnit,
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono font-bold text-emerald-900 text-xs whitespace-nowrap">
          {formatRupiah(row.currentStock * row.costPerUnit)}
        </span>
      )
    },
    {
      header: 'Status Reorder',
      accessorKey: 'status',
      sortable: true,
      minWidth: '110px',
      align: 'center',
      cell: ({ row }) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border whitespace-nowrap inline-block ${
          row.status === 'optimal'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : row.status === 'warning'
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Aksi',
      align: 'center',
      minWidth: '110px',
      cell: ({ row }) => (
        <button
          onClick={() => {
            setRestockModalItem(row);
            setRestockAmount(5);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#C84B27] hover:text-white text-[#1F1A16] font-bold text-[11px] inline-flex items-center gap-1 border border-[#EAE2D8] transition-all cursor-pointer shadow-2xs whitespace-nowrap"
        >
          <Plus className="w-3 h-3" />
          <span>Restock</span>
        </button>
      )
    }
  ];

  // 2. Filter Configs
  const filters: FilterConfig<InventoryItem>[] = [
    {
      id: 'category',
      label: 'Kategori Bahan',
      options: [
        { label: 'Coffee & Beans', value: 'coffee' },
        { label: 'Dairy & Milk', value: 'dairy' },
        { label: 'Meat & Protein', value: 'meat' },
        { label: 'Syrup & Sweetener', value: 'syrup' },
        { label: 'Food & Groceries', value: 'food' }
      ],
      filterFn: (row, val) => row.category.toLowerCase() === val.toLowerCase()
    },
    {
      id: 'status',
      label: 'Status Level',
      options: [
        { label: 'Optimal', value: 'optimal' },
        { label: 'Warning (Perlu Restock)', value: 'warning' },
        { label: 'Critical (Kritis Menipis)', value: 'critical' }
      ],
      filterFn: (row, val) => row.status === val
    }
  ];

  // 3. Bulk Actions
  const bulkActions: BulkAction<InventoryItem>[] = [
    {
      label: 'Buat PO Massal Terpilih',
      icon: <ShoppingCart className="w-3.5 h-3.5" />,
      variant: 'primary',
      onClick: (selected, clear) => {
        const names = selected.map((s) => s.name).join(', ');
        alert(`Draft Purchase Order (PO) dibuat untuk: ${names}`);
        clear();
      }
    }
  ];

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
      
      {/* Top Banner Warning if any low stock */}
      {criticalItems.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 to-amber-50/40 border border-rose-200/80 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 text-xs shadow-xs w-full min-w-0 overflow-hidden">
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold text-xs sm:text-sm text-[#1F1A16] leading-tight">
                  Peringatan Stok Menipis
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                  {criticalItems.length} Bahan Kritis
                </span>
              </div>
              <p className="text-rose-800 text-[11px] leading-relaxed line-clamp-2 sm:line-clamp-1 font-medium">
                {criticalItems.map((c) => `${c.name} (${c.currentStock} ${c.unit})`).join(' • ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (criticalItems[0]) {
                setRestockModalItem(criticalItems[0]);
                setRestockAmount(10);
              }
            }}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Restock Segera</span>
            <span className="font-mono">→</span>
          </button>
        </div>
      )}

      {/* Main Inventory DataTable */}
      <DataTable<InventoryItem>
        data={items}
        columns={columns}
        title="Inventori Bahan Baku & Kontrol COGS"
        subtitle="Monitoring ketersediaan bahan racikan espresso, kitchen mains, food cost, dan reorder point vendor"
        searchPlaceholder="Cari nama bahan baku, SKU, supplier vendor..."
        searchableKeys={['name', 'category', 'supplier', 'unit']}
        filters={filters}
        bulkActions={bulkActions}
        enableSelection={true}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        exportFileName="HomieCozie_Inventory_Stock"
        enableExport={true}
        enableImport={true}
        onImport={handleImportInventory}
        enableViewSwitcher={true}
        topActions={
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            <button
              onClick={() => setShowScannerModal(true)}
              className="flex-1 sm:flex-none px-2.5 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Scan className="w-3.5 h-3.5 text-[#B23812] shrink-0" />
              <span>Scan Barcode</span>
            </button>

            <button
              onClick={() => setShowPOModal(true)}
              className="flex-1 sm:flex-none px-2.5 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-900 shrink-0" />
              <span>Buat PO (WA)</span>
            </button>

            <button
              onClick={() => setShowAddItemModal(true)}
              className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Tambah Item</span>
            </button>
          </div>
        }
        renderCardView={(it, _, isSelected, toggleSelect) => (
          <div
            className={`bg-white p-5 rounded-2xl border shadow-xs flex flex-col justify-between space-y-4 transition-all ${
              isSelected ? 'border-[#C84B27] ring-2 ring-[#C84B27]/20 bg-amber-50/20' : 'border-[#EAE2D8] hover:border-[#C84B27]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={toggleSelect}
                    className="w-4 h-4 rounded-md accent-[#C84B27] cursor-pointer"
                  />
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#B23812]">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#1F1A16] leading-snug">{it.name}</h5>
                    <span className="text-[10px] text-[#5C5248] font-mono uppercase">{it.category}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                  it.status === 'optimal'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : it.status === 'warning'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {it.status}
                </span>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Stok Saat Ini:</span>
                  <span className="font-bold text-[#1F1A16] text-sm">{it.currentStock} {it.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Batas Minimum:</span>
                  <span className="text-amber-800 font-semibold">{it.minStock} {it.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Biaya / Unit (HPP):</span>
                  <span className="text-emerald-900 font-semibold">{formatRupiah(it.costPerUnit)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#EAE2D8]">
                  <span className="text-[#5C5248]">Vendor:</span>
                  <span className="text-[#1F1A16] text-[11px] truncate max-w-[140px]">{it.supplier}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setRestockModalItem(it);
                setRestockAmount(5);
              }}
              className="w-full py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#C84B27] hover:text-white text-[#1F1A16] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#EAE2D8] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Stok (Restock PO)</span>
            </button>
          </div>
        )}
      />

      {/* Restock Modal */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE2D8] rounded-3xl p-6 max-w-md w-full text-[#1F1A16] space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#B23812]" />
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Restock: {restockModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setRestockModalItem(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Stok Sekarang:</span>
                  <span className="font-bold text-[#1F1A16]">{restockModalItem.currentStock} {restockModalItem.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5248]">Supplier Resmi:</span>
                  <span className="text-amber-800">{restockModalItem.supplier}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#1F1A16]">Jumlah Tambahan ({restockModalItem.unit}):</label>
                <input
                  type="number"
                  min="1"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  className="w-full p-3 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-xs text-[#1F1A16] font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex justify-between font-mono">
                <span className="text-[#5C5248]">Estimasi Biaya PO:</span>
                <span className="font-bold text-[#B23812]">{formatRupiah(restockAmount * restockModalItem.costPerUnit)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRestockModalItem(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#1F1A16] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleRestock}
                className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Masuk Stok</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Raw Material Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewItem} className="bg-white border border-[#EAE2D8] rounded-3xl p-6 max-w-lg w-full text-[#1F1A16] space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#B23812]" />
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Tambah Bahan Baku Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Nama Bahan Baku:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Biji Kopi Gayo Single Origin 1kg"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Kategori:</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  >
                    <option value="coffee">Coffee & Espresso</option>
                    <option value="dairy">Dairy & Milk</option>
                    <option value="meat">Meat & Protein</option>
                    <option value="syrup">Syrup & Sweetener</option>
                    <option value="food">Groceries & Food</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Satuan (Unit):</label>
                  <input
                    type="text"
                    required
                    placeholder="kg, liter, pack, box"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Stok Awal:</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemCurrentStock}
                    onChange={(e) => setNewItemCurrentStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">Batas Minimum:</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1F1A16] block mb-1">HPP / Unit (Rp):</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#C84B27]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1F1A16] block mb-1">Nama Vendor / Supplier:</label>
                <input
                  type="text"
                  placeholder="Nama PT / Distributor pemasok"
                  value={newItemSupplier}
                  onChange={(e) => setNewItemSupplier(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs text-[#1F1A16] focus:outline-none focus:border-[#C84B27]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2D8]">
              <button
                type="button"
                onClick={() => setShowAddItemModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-[#5C5248] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Simpan Bahan Baku
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Supplier Purchase Order (PO) Modal */}
      <SupplierPOModal
        isOpen={showPOModal}
        onClose={() => setShowPOModal(false)}
        inventoryItems={items}
      />

      {/* Barcode / QR Scanner Restock Modal */}
      <BarcodeScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        inventoryItems={items}
        onRestockItem={(itemId, addedQty) => {
          setItems(prev => prev.map(it => {
            if (it.id === itemId) {
              const newQty = it.currentStock + addedQty;
              const status = newQty >= it.minStock ? 'optimal' : 'warning';
              return { ...it, currentStock: newQty, status };
            }
            return it;
          }));
        }}
      />

    </div>
  );
};
