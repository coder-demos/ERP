import React, { useState } from 'react';
import { SteelERPProvider, useSteelERP } from './context/SteelERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';

// Views
import { DashboardView } from './components/views/DashboardView';
import { CustomersView } from './components/views/CustomersView';
import { ProductsView } from './components/views/ProductsView';
import { InventoryView } from './components/views/InventoryView';
import { ProductionView } from './components/views/ProductionView';
import { RawMaterialsView } from './components/views/RawMaterialsView';
import { OrdersView } from './components/views/OrdersView';
import { SuppliersView } from './components/views/SuppliersView';
import { ReportsView } from './components/views/ReportsView';

// Modals
import { CustomerModal } from './components/modals/CustomerModal';
import { ProductModal } from './components/modals/ProductModal';
import { RawMaterialModal } from './components/modals/RawMaterialModal';
import { ProductionModal } from './components/modals/ProductionModal';
import { OrderModal } from './components/modals/OrderModal';
import { SupplierModal } from './components/modals/SupplierModal';
import { StockAdjustModal } from './components/modals/StockAdjustModal';

import {
  Customer,
  SteelProduct,
  RawMaterial,
  ProductionRun,
  Order,
  Supplier
} from './types';
import { X, Factory } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, isSidebarCollapsed } = useSteelERP();

  // Mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<SteelProduct | null>(null);

  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<RawMaterial | null>(null);

  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [runToEdit, setRunToEdit] = useState<ProductionRun | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [productForAdjust, setProductForAdjust] = useState<SteelProduct | null>(null);

  // Handlers
  const handleOpenAddCustomer = () => {
    setCustomerToEdit(null);
    setIsCustomerModalOpen(true);
  };
  const handleEditCustomer = (c: Customer) => {
    setCustomerToEdit(c);
    setIsCustomerModalOpen(true);
  };

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };
  const handleEditProduct = (p: SteelProduct) => {
    setProductToEdit(p);
    setIsProductModalOpen(true);
  };

  const handleOpenAddRawMaterial = () => {
    setMaterialToEdit(null);
    setIsRawMaterialModalOpen(true);
  };
  const handleEditRawMaterial = (rm: RawMaterial) => {
    setMaterialToEdit(rm);
    setIsRawMaterialModalOpen(true);
  };

  const handleOpenAddProduction = () => {
    setRunToEdit(null);
    setIsProductionModalOpen(true);
  };
  const handleEditProductionRun = (pr: ProductionRun) => {
    setRunToEdit(pr);
    setIsProductionModalOpen(true);
  };

  const handleOpenAddOrder = () => {
    setOrderToEdit(null);
    setIsOrderModalOpen(true);
  };
  const handleEditOrder = (o: Order) => {
    setOrderToEdit(o);
    setIsOrderModalOpen(true);
  };

  const handleOpenAddSupplier = () => {
    setSupplierToEdit(null);
    setIsSupplierModalOpen(true);
  };
  const handleEditSupplier = (s: Supplier) => {
    setSupplierToEdit(s);
    setIsSupplierModalOpen(true);
  };

  const handleOpenStockAdjust = (p: SteelProduct) => {
    setProductForAdjust(p);
    setIsStockAdjustModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex w-72 flex-col bg-slate-900 text-white shadow-xl z-50">
            <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Factory className="h-5 w-5" />
                </div>
                <span className="font-bold text-white text-sm">ApexSteel ERP</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
              {[
                { id: 'dashboard', label: 'Company / Dashboard' },
                { id: 'customers', label: 'Customers' },
                { id: 'products', label: 'Steel Products' },
                { id: 'inventory', label: 'SKU & Inventory' },
                { id: 'production', label: 'Manufacturing / Production' },
                { id: 'raw-materials', label: 'Raw Materials' },
                { id: 'orders', label: 'Orders / Sales' },
                { id: 'suppliers', label: 'Suppliers' },
                { id: 'reports', label: 'Reports' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <TopHeader
          onOpenNewProductModal={handleOpenAddProduct}
          onOpenNewOrderModal={handleOpenAddOrder}
          onOpenNewProductionModal={handleOpenAddProduction}
          onOpenNewCustomerModal={handleOpenAddCustomer}
          onOpenNewRawMaterialModal={handleOpenAddRawMaterial}
          onOpenNewSupplierModal={handleOpenAddSupplier}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'customers' && (
            <CustomersView
              onOpenAddModal={handleOpenAddCustomer}
              onEditCustomer={handleEditCustomer}
            />
          )}
          {activeTab === 'products' && (
            <ProductsView
              onOpenAddModal={handleOpenAddProduct}
              onEditProduct={handleEditProduct}
              onOpenStockAdjust={handleOpenStockAdjust}
            />
          )}
          {activeTab === 'inventory' && (
            <InventoryView
              onOpenStockAdjust={handleOpenStockAdjust}
            />
          )}
          {activeTab === 'production' && (
            <ProductionView
              onOpenAddModal={handleOpenAddProduction}
              onEditProductionRun={handleEditProductionRun}
            />
          )}
          {activeTab === 'raw-materials' && (
            <RawMaterialsView
              onOpenAddModal={handleOpenAddRawMaterial}
              onEditRawMaterial={handleEditRawMaterial}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersView
              onOpenAddModal={handleOpenAddOrder}
              onEditOrder={handleEditOrder}
            />
          )}
          {activeTab === 'suppliers' && (
            <SuppliersView
              onOpenAddModal={handleOpenAddSupplier}
              onEditSupplier={handleEditSupplier}
            />
          )}
          {activeTab === 'reports' && <ReportsView />}
        </main>
      </div>

      {/* Global Steel ERP Modals */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customerToEdit={customerToEdit}
      />
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />
      <RawMaterialModal
        isOpen={isRawMaterialModalOpen}
        onClose={() => setIsRawMaterialModalOpen(false)}
        materialToEdit={materialToEdit}
      />
      <ProductionModal
        isOpen={isProductionModalOpen}
        onClose={() => setIsProductionModalOpen(false)}
        runToEdit={runToEdit}
      />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orderToEdit={orderToEdit}
      />
      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        supplierToEdit={supplierToEdit}
      />
      <StockAdjustModal
        isOpen={isStockAdjustModalOpen}
        onClose={() => setIsStockAdjustModalOpen(false)}
        product={productForAdjust}
      />
    </div>
  );
};

export default function App() {
  return (
    <SteelERPProvider>
      <MainLayout />
    </SteelERPProvider>
  );
}
