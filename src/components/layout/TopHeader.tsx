import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Layers,
  Users,
  Flame,
  Layers3,
  FileText,
  Truck,
  RotateCcw,
  ChevronDown,
  Menu,
  Factory
} from 'lucide-react';
import { useSteelERP } from '../../context/SteelERPContext';

interface TopHeaderProps {
  onOpenNewProductModal: () => void;
  onOpenNewOrderModal: () => void;
  onOpenNewProductionModal: () => void;
  onOpenNewCustomerModal: () => void;
  onOpenNewRawMaterialModal: () => void;
  onOpenNewSupplierModal: () => void;
  onOpenMobileMenu: () => void;
}

const TAB_TITLES: Record<string, { title: string; section: string }> = {
  dashboard: { title: 'Company Overview & Operations', section: 'Executive' },
  customers: { title: 'Customer Management', section: 'Accounts' },
  products: { title: 'Steel Material & Product Catalog', section: 'Products' },
  inventory: { title: 'SKU & Inventory Control', section: 'Warehouse' },
  production: { title: 'Manufacturing & Mill Production', section: 'Operations' },
  'raw-materials': { title: 'Raw Materials & Feedstock', section: 'Procurement' },
  orders: { title: 'Sales Orders & Dispatch', section: 'Commercial' },
  suppliers: { title: 'Suppliers & Vendors', section: 'Supply Chain' },
  reports: { title: 'Operational Reports', section: 'Intelligence' }
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenNewProductModal,
  onOpenNewOrderModal,
  onOpenNewProductionModal,
  onOpenNewCustomerModal,
  onOpenNewRawMaterialModal,
  onOpenNewSupplierModal,
  onOpenMobileMenu
}) => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    resetToDemoData
  } = useSteelERP();

  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const newMenuRef = useRef<HTMLDivElement>(null);

  const currentNav = TAB_TITLES[activeTab] || { title: 'Steel ERP', section: 'Operations' };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) {
        setIsNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Zone 1: Breadcrumb and Mobile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center text-xs font-medium">
          <span className="text-slate-400">{currentNav.section}</span>
          <span className="mx-2 text-slate-300">/</span>
          <h1 className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
            {currentNav.title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Universal Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}... (SKU, product, grade, customer, supplier)`}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Quick Action Create Dropdown & Demo Reset */}
      <div className="flex items-center gap-2.5">
        {/* Quick Action Dropdown */}
        <div className="relative" ref={newMenuRef}>
          <button
            onClick={() => setIsNewMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Record</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {isNewMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg z-50 text-xs">
              <div className="px-3 py-1 text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                Create Steel Record
              </div>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewOrderModal();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <FileText className="h-4 w-4 text-slate-400" />
                <span>New Sales Order</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewProductionModal();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Flame className="h-4 w-4 text-slate-400" />
                <span>New Production Run</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewProductModal();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Layers className="h-4 w-4 text-slate-400" />
                <span>New Steel Product</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewRawMaterialModal();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Layers3 className="h-4 w-4 text-slate-400" />
                <span>New Raw Material</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewCustomerModal();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Users className="h-4 w-4 text-slate-400" />
                <span>New Customer</span>
              </button>
              <button
                onClick={() => {
                  setIsNewMenuOpen(false);
                  onOpenNewSupplierModal();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Truck className="h-4 w-4 text-slate-400" />
                <span>New Supplier</span>
              </button>
            </div>
          )}
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all steel inventory, customers, orders, and production records to demo factory data?')) {
              resetToDemoData();
            }
          }}
          title="Restore factory default data"
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>
    </header>
  );
};
