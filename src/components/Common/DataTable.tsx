import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Upload,
  Filter,
  Check,
  X,
  FileText,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { exportToCSV, exportToJSON, parseCSV, ExportColumn } from '../../utils/exportImport';

export interface ColumnDef<T> {
  id?: string;
  header: string;
  accessorKey?: keyof T | string;
  accessorFn?: (row: T) => any;
  cell?: (info: { row: T; value: any; index: number }) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  className?: string;
  headerClassName?: string;
  exportFormatter?: (val: any, row: T) => string | number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig<T> {
  id: string;
  label: string;
  options: FilterOption[];
  filterFn: (row: T, selectedValue: string) => boolean;
}

export interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'danger' | 'default';
  onClick: (selectedRows: T[], clearSelection: () => void) => void;
}

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchableKeys?: (keyof T | string)[];
  filters?: FilterConfig<T>[];
  bulkActions?: BulkAction<T>[];
  enableSelection?: boolean;
  getRowId?: (row: T, index: number) => string | number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  exportFileName?: string;
  enableExport?: boolean;
  enableImport?: boolean;
  onImport?: (importedRows: Record<string, any>[]) => void;
  importSampleColumns?: string[];
  renderCardView?: (row: T, index: number, isSelected: boolean, toggleSelect: () => void) => React.ReactNode;
  enableViewSwitcher?: boolean;
  initialViewMode?: 'table' | 'cards';
  topActions?: React.ReactNode;
  emptyStateMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  subtitle,
  searchPlaceholder = 'Cari data...',
  searchableKeys,
  filters = [],
  bulkActions = [],
  enableSelection = false,
  getRowId = (r, idx) => r.id ?? idx,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  exportFileName = 'data_export',
  enableExport = true,
  enableImport = false,
  onImport,
  importSampleColumns,
  renderCardView,
  enableViewSwitcher = false,
  initialViewMode = 'table',
  topActions,
  emptyStateMessage = 'Tidak ada data yang sesuai filter.',
  isLoading = false
}: DataTableProps<T>) {
  // Search & Filter state
  const [search, setSearch] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    filters.forEach((f) => {
      init[f.id] = 'all';
    });
    return init;
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
    accessorFn?: (row: T) => any;
  } | null>(null);

  // Pagination state
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selection state
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());

  // View Mode
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(initialViewMode);

  // Export menu dropdown
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // Import modal state
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importParsedData, setImportParsedData] = useState<Record<string, string>[] | null>(null);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract value from row
  const getCellValue = (row: T, col: ColumnDef<T>) => {
    if (col.accessorFn) return col.accessorFn(row);
    if (col.accessorKey) return row[col.accessorKey];
    return undefined;
  };

  // 1. Filtering & Searching
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search logic
      if (search.trim()) {
        const query = search.toLowerCase();
        let matches = false;

        if (searchableKeys && searchableKeys.length > 0) {
          matches = searchableKeys.some((k) => {
            const val = row[k];
            return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
          });
        } else {
          // Search across all columns
          matches = columns.some((col) => {
            const val = getCellValue(row, col);
            return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
          });
        }

        if (!matches) return false;
      }

      // Filter logic
      for (const f of filters) {
        const selectedVal = activeFilters[f.id];
        if (selectedVal && selectedVal !== 'all') {
          if (!f.filterFn(row, selectedVal)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, search, searchableKeys, columns, filters, activeFilters]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const col = columns.find(
        (c) => (c.accessorKey as string) === sortConfig.key || c.header === sortConfig.key || c.id === sortConfig.key
      );

      let valA: any;
      let valB: any;

      if (sortConfig.accessorFn) {
        valA = sortConfig.accessorFn(a);
        valB = sortConfig.accessorFn(b);
      } else if (col) {
        valA = getCellValue(a, col);
        valB = getCellValue(b, col);
      } else {
        valA = a[sortConfig.key];
        valB = b[sortConfig.key];
      }

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      // Numerical or Date or String comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (sortConfig.direction === 'asc') {
        return strA.localeCompare(strB, 'id', { numeric: true });
      } else {
        return strB.localeCompare(strA, 'id', { numeric: true });
      }
    });
  }, [filteredData, sortConfig, columns]);

  // 3. Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, validCurrentPage, pageSize]);

  // Handle Header Click for Sorting
  const handleHeaderSort = (col: ColumnDef<T>) => {
    if (!col.sortable) return;

    const colKey = (col.accessorKey as string) || col.header || col.id || '';
    setSortConfig((prev) => {
      if (!prev || prev.key !== colKey) {
        return { key: colKey, direction: 'asc', accessorFn: col.accessorFn };
      }
      if (prev.direction === 'asc') {
        return { key: colKey, direction: 'desc', accessorFn: col.accessorFn };
      }
      return null; // Reset sort
    });
  };

  // Row Selection Logic
  const allPageRowIds = paginatedData.map((r, idx) => getRowId(r, idx));
  const isAllPageSelected = allPageRowIds.length > 0 && allPageRowIds.every((id) => selectedRowIds.has(id));

  const toggleSelectAllPage = () => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (isAllPageSelected) {
        allPageRowIds.forEach((id) => next.delete(id));
      } else {
        allPageRowIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleSelectRow = (id: string | number) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedRowIds(new Set());
  };

  const selectedRowsList = useMemo(() => {
    return data.filter((row, idx) => selectedRowIds.has(getRowId(row, idx)));
  }, [data, selectedRowIds, getRowId]);

  // Handle Export to CSV
  const handleExportCSV = (selectedOnly: boolean = false) => {
    const targetData = selectedOnly ? selectedRowsList : sortedData;
    if (targetData.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    const exportCols: ExportColumn<T>[] = columns.map((col) => ({
      key: (col.accessorKey as string) || col.id || col.header,
      label: col.header,
      formatter: (_val: any, row: T) => {
        const rawVal = getCellValue(row, col);
        if (col.exportFormatter) {
          return col.exportFormatter(rawVal, row);
        }
        if (typeof rawVal === 'object' && rawVal !== null) {
          return JSON.stringify(rawVal);
        }
        return rawVal ?? '';
      }
    }));

    exportToCSV(`${exportFileName}_${selectedOnly ? 'terpilih' : 'lengkap'}`, targetData, exportCols);
    setShowExportMenu(false);
  };

  // Handle Export to JSON
  const handleExportJSON = (selectedOnly: boolean = false) => {
    const targetData = selectedOnly ? selectedRowsList : sortedData;
    if (targetData.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    exportToJSON(`${exportFileName}_${selectedOnly ? 'terpilih' : 'lengkap'}`, targetData);
    setShowExportMenu(false);
  };

  // Handle File Input for Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportError(null);

    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (Array.isArray(json)) {
            setImportParsedData(json);
          } else if (typeof json === 'object' && json !== null) {
            setImportParsedData([json]);
          } else {
            setImportError('Format file JSON tidak valid. Harus berupa array objek.');
          }
        } catch (err) {
          setImportError('Gagal membaca file JSON. Pastikan sintaks JSON valid.');
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv') || file.type === 'text/csv') {
      reader.onload = (event) => {
        try {
          const csvText = event.target?.result as string;
          const parsed = parseCSV(csvText);
          if (parsed.length === 0) {
            setImportError('File CSV kosong atau tidak memiliki baris data.');
          } else {
            setImportParsedData(parsed);
          }
        } catch (err) {
          setImportError('Gagal mengurai file CSV.');
        }
      };
      reader.readAsText(file);
    } else {
      setImportError('Format file tidak didukung. Silakan gunakan format .csv atau .json.');
    }
  };

  const handleConfirmImport = () => {
    if (!importParsedData || importParsedData.length === 0) return;
    if (onImport) {
      onImport(importParsedData);
    }
    setShowImportModal(false);
    setImportParsedData(null);
    setImportFileName('');
    setImportError(null);
  };

  return (
    <div className="space-y-4 text-[#1F1A16] w-full min-w-0">
      {/* Top Header Card (Title, Subtitle, Search, Dynamic Filters, Toolbar Actions) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EAE2D8] shadow-xs space-y-4 w-full min-w-0">
        {/* Title & Top Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 border-b border-[#EAE2D8] pb-4">
          <div className="space-y-1 min-w-0">
            {title && (
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-black text-base sm:text-xl text-[#1F1A16] leading-tight">
                  {title}
                </h3>
                <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                  {filteredData.length} Data
                </span>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-[#5C5248] leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0 w-full lg:w-auto">
            {topActions && (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                {topActions}
              </div>
            )}

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              {/* View Mode Switcher */}
              {enableViewSwitcher && renderCardView && (
                <div className="p-1 bg-[#FAF7F2] rounded-xl sm:rounded-2xl border border-[#EAE2D8] flex items-center shadow-2xs shrink-0">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                      viewMode === 'table' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                    }`}
                    title="Tampilan Tabel Data"
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                      viewMode === 'cards' ? 'bg-[#C84B27] text-white shadow-xs' : 'text-[#5C5248] hover:text-[#1F1A16]'
                    }`}
                    title="Tampilan Bento Cards"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Import Button */}
              {enableImport && onImport && (
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#FAF7F2] hover:bg-stone-200 border border-[#EAE2D8] text-xs font-bold text-[#1F1A16] flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5 text-[#C84B27]" />
                  <span>Impor Data</span>
                </button>
              )}

                  {/* Export Dropdown */}
                  {enableExport && (
                    <div className="relative flex-1 sm:flex-none">
                      <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="w-full sm:w-auto px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#C84B27] hover:bg-[#B23E1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Ekspor</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>

                      {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-[#EAE2D8] rounded-2xl shadow-xl z-30 p-1.5 space-y-1 animate-in zoom-in-95 duration-100">
                          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[#8C7E72] uppercase border-b border-[#EAE2D8]">
                            Format Ekspor Data
                          </div>
                          <button
                            onClick={() => handleExportCSV(false)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1F1A16] hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 cursor-pointer"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Ekspor ke CSV / Excel</span>
                          </button>
                          <button
                            onClick={() => handleExportJSON(false)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1F1A16] hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 cursor-pointer"
                          >
                            <FileCode className="w-4 h-4 text-[#C84B27] shrink-0" />
                            <span>Ekspor ke JSON</span>
                          </button>
                          {selectedRowsList.length > 0 && (
                            <>
                              <div className="border-t border-[#EAE2D8] my-1" />
                              <button
                                onClick={() => handleExportCSV(true)}
                                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1F1A16] hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 cursor-pointer"
                              >
                                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Ekspor ({selectedRowsList.length}) Terpilih (CSV)</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search & Custom Filter Selectors Bar */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between pt-1">
          {/* Real-time Search input */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-8 py-2.5 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-xs text-[#1F1A16] placeholder:text-[#8C7E72] focus:outline-none focus:border-[#C84B27] shadow-2xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7E72] hover:text-[#1F1A16] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {filters.map((filter) => (
                <div key={filter.id} className="relative flex-1 sm:flex-initial">
                  <select
                    value={activeFilters[filter.id] || 'all'}
                    onChange={(e) => {
                      setActiveFilters((prev) => ({ ...prev, [filter.id]: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full sm:w-auto px-3 py-2 bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl text-xs font-bold text-[#1F1A16] focus:outline-none focus:border-[#C84B27] cursor-pointer shadow-2xs min-w-[130px]"
                  >
                    <option value="all">Semua {filter.label}</option>
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Reset filter button if any active */}
              {(search || Object.values(activeFilters).some((v) => v !== 'all')) && (
                <button
                  onClick={() => {
                    setSearch('');
                    const reset: Record<string, string> = {};
                    filters.forEach((f) => (reset[f.id] = 'all'));
                    setActiveFilters(reset);
                    setCurrentPage(1);
                  }}
                  className="p-2 rounded-2xl bg-[#FAF7F2] text-[#8C7E72] hover:text-[#C84B27] border border-[#EAE2D8] text-xs font-bold cursor-pointer transition-colors shadow-2xs shrink-0"
                  title="Reset Semua Filter"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating / Active Bulk Selection Bar */}
      {enableSelection && selectedRowIds.size > 0 && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-[10px]">
              {selectedRowIds.size}
            </span>
            <span className="font-bold">
              {selectedRowIds.size} Baris Data Terpilih
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(selectedRowsList, clearSelection)}
                className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  action.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                    : action.variant === 'primary'
                    ? 'bg-[#C84B27] hover:bg-[#B23E1C] text-white shadow-xs'
                    : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 shadow-xs'
                }`}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}

            <button
              onClick={clearSelection}
              className="px-3 py-2 rounded-xl bg-white hover:bg-amber-100 text-[#5C5248] border border-amber-300 font-bold cursor-pointer transition-colors"
            >
              Batalkan Pilihan
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Table View or Cards View */}
      {viewMode === 'cards' && renderCardView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedData.map((row, idx) => {
            const rowId = getRowId(row, idx);
            const isSelected = selectedRowIds.has(rowId);
            return (
              <div key={rowId}>
                {renderCardView(row, idx, isSelected, () => toggleSelectRow(rowId))}
              </div>
            );
          })}
        </div>
      ) : (
        /* Data Table View with robust horizontal scrolling & min-width safety */
        <div className="bg-white rounded-3xl border border-[#EAE2D8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto scroll-smooth w-full">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EAE2D8] text-[11px] font-mono font-bold text-[#5C5248] uppercase tracking-wider">
                  {/* Select All Checkbox */}
                  {enableSelection && (
                    <th className="py-3.5 px-4 w-12 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isAllPageSelected}
                        onChange={toggleSelectAllPage}
                        className="w-4 h-4 rounded-md accent-[#C84B27] cursor-pointer"
                      />
                    </th>
                  )}

                  {columns.map((col, idx) => {
                    const colKey = (col.accessorKey as string) || col.header;
                    const isSorted = sortConfig && sortConfig.key === colKey;

                    return (
                      <th
                        key={col.id ?? idx}
                        style={{
                          width: col.width,
                          minWidth: col.minWidth || '120px',
                          maxWidth: col.maxWidth
                        }}
                        className={`py-3.5 px-4 select-none whitespace-nowrap ${col.headerClassName || ''} ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.sortable ? 'cursor-pointer hover:text-[#C84B27] transition-colors' : ''}`}
                        onClick={() => handleHeaderSort(col)}
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 ${
                            col.align === 'right'
                              ? 'justify-end'
                              : col.align === 'center'
                              ? 'justify-center'
                              : 'justify-start'
                          }`}
                        >
                          <span>{col.header}</span>
                          {col.sortable && (
                            <span className="text-[#8C7E72] shrink-0">
                              {isSorted ? (
                                sortConfig?.direction === 'asc' ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-[#C84B27]" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-[#C84B27]" />
                                )
                              ) : (
                                <ChevronsUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EAE2D8] text-xs text-[#1F1A16]">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (enableSelection ? 1 : 0)}
                      className="py-14 px-4 text-center text-[#8C7E72]"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Layers className="w-8 h-8 text-stone-300" />
                        <span className="font-medium text-xs">{emptyStateMessage}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, rowIdx) => {
                    const rowId = getRowId(row, rowIdx);
                    const isSelected = selectedRowIds.has(rowId);

                    return (
                      <tr
                        key={rowId}
                        className={`transition-colors hover:bg-amber-50/30 ${
                          isSelected ? 'bg-amber-50/70' : ''
                        }`}
                      >
                        {/* Row Selection Checkbox */}
                        {enableSelection && (
                          <td className="py-3.5 px-4 text-center whitespace-nowrap align-middle">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(rowId)}
                              className="w-4 h-4 rounded-md accent-[#C84B27] cursor-pointer"
                            />
                          </td>
                        )}

                        {/* Cell Data */}
                        {columns.map((col, colIdx) => {
                          const val = getCellValue(row, col);

                          return (
                            <td
                              key={col.id ?? colIdx}
                              style={{
                                width: col.width,
                                minWidth: col.minWidth || '120px',
                                maxWidth: col.maxWidth
                              }}
                              className={`py-3.5 px-4 align-middle ${col.className || ''} ${
                                col.align === 'right'
                                  ? 'text-right'
                                  : col.align === 'center'
                                  ? 'text-center'
                                  : 'text-left'
                              }`}
                            >
                              {col.cell
                                ? col.cell({ row, value: val, index: rowIdx })
                                : String(val ?? '-')}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="bg-white p-4 rounded-3xl border border-[#EAE2D8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Total & Page Size Selector */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-[#5C5248] text-center md:text-left">
          <span>
            Menampilkan{' '}
            <strong className="font-mono text-[#1F1A16]">
              {sortedData.length === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1}
            </strong>{' '}
            -{' '}
            <strong className="font-mono text-[#1F1A16]">
              {Math.min(validCurrentPage * pageSize, sortedData.length)}
            </strong>{' '}
            dari <strong className="font-mono text-[#1F1A16]">{sortedData.length}</strong> data
          </span>

          <div className="flex items-center gap-1.5 pl-2 sm:border-l border-[#EAE2D8]">
            <span className="text-[11px]">Tampilkan:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1 bg-[#FAF7F2] border border-[#EAE2D8] rounded-xl text-xs font-bold text-[#1F1A16] focus:outline-none focus:border-[#C84B27] cursor-pointer shadow-2xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} baris
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center justify-center gap-1 shrink-0 overflow-x-auto max-w-full pb-1 md:pb-0">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={validCurrentPage === 1}
            className="p-1.5 rounded-xl border border-[#EAE2D8] bg-[#FAF7F2] hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage === 1}
            className="p-1.5 rounded-xl border border-[#EAE2D8] bg-[#FAF7F2] hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (validCurrentPage <= 3) pageNum = i + 1;
              else if (validCurrentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = validCurrentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer ${
                    validCurrentPage === pageNum
                      ? 'bg-[#C84B27] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#5C5248] hover:bg-stone-200 border border-[#EAE2D8]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage === totalPages}
            className="p-1.5 rounded-xl border border-[#EAE2D8] bg-[#FAF7F2] hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={validCurrentPage === totalPages}
            className="p-1.5 rounded-xl border border-[#EAE2D8] bg-[#FAF7F2] hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE2D8] rounded-3xl p-6 max-w-xl w-full text-[#1F1A16] space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#C84B27]" />
                <h3 className="font-display font-black text-lg text-[#1F1A16]">
                  Impor Berkas Data (CSV / JSON)
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportParsedData(null);
                  setImportFileName('');
                  setImportError(null);
                }}
                className="p-1 rounded-lg hover:bg-stone-100 text-[#5C5248] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#5C5248]">
                Unggah berkas data dalam format <strong>CSV (Comma Separated Values)</strong> atau <strong>JSON</strong> untuk diintegrasikan secara instan ke dalam sistem.
              </p>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#EAE2D8] hover:border-[#C84B27] rounded-2xl p-6 text-center bg-[#FAF7F2] cursor-pointer transition-colors space-y-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.json,text/csv,application/json"
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#C84B27] border border-amber-200 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="font-bold text-[#1F1A16]">
                  {importFileName ? `File Terpilih: ${importFileName}` : 'Klik untuk Pilih File CSV / JSON'}
                </div>
                <p className="text-[11px] text-[#8C7E72]">
                  Mendukung berkas CSV dengan pemisah koma atau format array JSON standar
                </p>
              </div>

              {/* Import Error Banner */}
              {importError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Parsed Preview */}
              {importParsedData && importParsedData.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1F1A16]">
                    <span>Pratinjau Data ({importParsedData.length} Baris Terdeteksi):</span>
                    <span className="text-emerald-700 font-mono text-[11px]">✓ Valid untuk Diimpor</span>
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-[#EAE2D8] rounded-xl bg-[#FAF7F2] p-2 text-[11px] font-mono">
                    <pre className="whitespace-pre-wrap text-[#1F1A16]">
                      {JSON.stringify(importParsedData.slice(0, 3), null, 2)}
                    </pre>
                    {importParsedData.length > 3 && (
                      <div className="text-center text-[#8C7E72] pt-1">
                        ... dan {importParsedData.length - 3} baris lainnya
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2D8]">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportParsedData(null);
                  setImportFileName('');
                  setImportError(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-[#1F1A16] cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={!importParsedData || importParsedData.length === 0}
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-xl bg-[#C84B27] hover:bg-[#B23E1C] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Konfirmasi Masukkan Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
