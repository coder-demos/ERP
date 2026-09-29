import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  SteelProduct,
  RawMaterial,
  ProductionRun,
  Order,
  Supplier,
  SteelCompanyProfile
} from '../types';
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_PRODUCT_TYPES,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_PRODUCTION_RUNS,
  INITIAL_ORDERS,
  INITIAL_SUPPLIERS
} from '../data/initialSteelData';

interface SteelERPContextType {
  customers: Customer[];
  products: SteelProduct[];
  productTypes: string[];
  rawMaterials: RawMaterial[];
  productionRuns: ProductionRun[];
  orders: Order[];
  suppliers: Supplier[];
  companyProfile: SteelCompanyProfile;
  activeTab: string;
  searchQuery: string;
  isSidebarCollapsed: boolean;

  // Navigation
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;

  // Customer CRUD
  addCustomer: (data: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Product CRUD
  addProduct: (data: Omit<SteelProduct, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<SteelProduct>) => void;
  deleteProduct: (id: string) => void;
  addProductType: (typeName: string) => void;
  deleteProductType: (typeName: string) => void;

  // Inventory & Stock
  adjustProductStock: (productId: string, newStock: number) => void;

  // Raw Materials CRUD
  addRawMaterial: (data: Omit<RawMaterial, 'id' | 'materialCode'>) => void;
  updateRawMaterial: (id: string, updates: Partial<RawMaterial>) => void;
  deleteRawMaterial: (id: string) => void;
  adjustRawMaterialStock: (id: string, newStock: number) => void;

  // Production CRUD
  addProductionRun: (data: Omit<ProductionRun, 'id' | 'productionCode'>) => void;
  updateProductionRun: (id: string, updates: Partial<ProductionRun>) => void;
  deleteProductionRun: (id: string) => void;
  completeProductionRun: (id: string) => void;

  // Orders CRUD
  addOrder: (data: Omit<Order, 'id' | 'orderNumber'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Supplier CRUD
  addSupplier: (data: Omit<Supplier, 'id' | 'supplierCode' | 'createdAt'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Company Profile
  updateCompanyProfile: (updates: Partial<SteelCompanyProfile>) => void;

  // System
  resetToDemoData: () => void;
}

const SteelERPContext = createContext<SteelERPContextType | null>(null);

const STORAGE_PREFIX = 'apex_steel_erp_v2_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error('Storage load error', e);
    return fallback;
  }
}

function saveStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage save error', e);
  }
}

export const SteelERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [companyProfile, setCompanyProfile] = useState<SteelCompanyProfile>(() =>
    loadStorage('companyProfile', INITIAL_COMPANY_PROFILE)
  );
  const [productTypes, setProductTypes] = useState<string[]>(() =>
    loadStorage('productTypes', INITIAL_PRODUCT_TYPES)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadStorage('customers', INITIAL_CUSTOMERS)
  );
  const [products, setProducts] = useState<SteelProduct[]>(() =>
    loadStorage('products', INITIAL_PRODUCTS)
  );
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() =>
    loadStorage('rawMaterials', INITIAL_RAW_MATERIALS)
  );
  const [productionRuns, setProductionRuns] = useState<ProductionRun[]>(() =>
    loadStorage('productionRuns', INITIAL_PRODUCTION_RUNS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStorage('orders', INITIAL_ORDERS)
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    loadStorage('suppliers', INITIAL_SUPPLIERS)
  );

  useEffect(() => { saveStorage('companyProfile', companyProfile); }, [companyProfile]);
  useEffect(() => { saveStorage('productTypes', productTypes); }, [productTypes]);
  useEffect(() => { saveStorage('customers', customers); }, [customers]);
  useEffect(() => { saveStorage('products', products); }, [products]);
  useEffect(() => { saveStorage('rawMaterials', rawMaterials); }, [rawMaterials]);
  useEffect(() => { saveStorage('productionRuns', productionRuns); }, [productionRuns]);
  useEffect(() => { saveStorage('orders', orders); }, [orders]);
  useEffect(() => { saveStorage('suppliers', suppliers); }, [suppliers]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // Customer CRUD
  const addCustomer = (data: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>) => {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      customerCode: `CUST-${codeNum}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Product CRUD
  const addProduct = (data: Omit<SteelProduct, 'id' | 'createdAt'>) => {
    const newProd: SteelProduct = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<SteelProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProductType = (typeName: string) => {
    if (!typeName.trim()) return;
    setProductTypes((prev) => (prev.includes(typeName.trim()) ? prev : [...prev, typeName.trim()]));
  };

  const deleteProductType = (typeName: string) => {
    setProductTypes((prev) => prev.filter((t) => t !== typeName));
  };

  // Stock Adjustments
  const adjustProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, currentStock: Math.max(0, newStock) } : p))
    );
  };

  // Raw Materials CRUD
  const addRawMaterial = (data: Omit<RawMaterial, 'id' | 'materialCode'>) => {
    const codeNum = Math.floor(100 + Math.random() * 900);
    const newRM: RawMaterial = {
      ...data,
      id: `raw-${Date.now()}`,
      materialCode: `RM-${codeNum}`
    };
    setRawMaterials((prev) => [newRM, ...prev]);
  };

  const updateRawMaterial = (id: string, updates: Partial<RawMaterial>) => {
    setRawMaterials((prev) => prev.map((rm) => (rm.id === id ? { ...rm, ...updates } : rm)));
  };

  const deleteRawMaterial = (id: string) => {
    setRawMaterials((prev) => prev.filter((rm) => rm.id !== id));
  };

  const adjustRawMaterialStock = (id: string, newStock: number) => {
    setRawMaterials((prev) =>
      prev.map((rm) => (rm.id === id ? { ...rm, currentStock: Math.max(0, newStock) } : rm))
    );
  };

  // Production CRUD
  const addProductionRun = (data: Omit<ProductionRun, 'id' | 'productionCode'>) => {
    const codeNum = Math.floor(100 + Math.random() * 900);
    const newRun: ProductionRun = {
      ...data,
      id: `pr-${Date.now()}`,
      productionCode: `PR-2026-${codeNum}`
    };
    setProductionRuns((prev) => [newRun, ...prev]);

    // If marked completed right away, increment product stock
    if (newRun.status === 'Completed' && newRun.productId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === newRun.productId ? { ...p, currentStock: p.currentStock + newRun.quantityProduced } : p
        )
      );
    }
  };

  const updateProductionRun = (id: string, updates: Partial<ProductionRun>) => {
    setProductionRuns((prev) => prev.map((pr) => (pr.id === id ? { ...pr, ...updates } : pr)));
  };

  const deleteProductionRun = (id: string) => {
    setProductionRuns((prev) => prev.filter((pr) => pr.id !== id));
  };

  const completeProductionRun = (id: string) => {
    const run = productionRuns.find((r) => r.id === id);
    if (!run || run.status === 'Completed') return;

    setProductionRuns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Completed' } : r))
    );

    // Increment product stock
    if (run.productId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === run.productId
            ? { ...p, currentStock: p.currentStock + run.quantityProduced }
            : p
        )
      );
    }
  };

  // Orders CRUD
  const addOrder = (data: Omit<Order, 'id' | 'orderNumber'>) => {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newOrd: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber: `SO-2026-${codeNum}`
    };
    setOrders((prev) => [newOrd, ...prev]);

    // Automatically deduct finished stock when an order is created or processed
    if (data.items && data.items.length > 0) {
      data.items.forEach((item) => {
        if (item.productId) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === item.productId
                ? { ...p, currentStock: Math.max(0, p.currentStock - item.quantity) }
                : p
            )
          );
        }
      });
    }
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // Suppliers CRUD
  const addSupplier = (data: Omit<Supplier, 'id' | 'supplierCode' | 'createdAt'>) => {
    const codeNum = Math.floor(100 + Math.random() * 900);
    const newSupp: Supplier = {
      ...data,
      id: `supp-${Date.now()}`,
      supplierCode: `SUPP-${codeNum}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSuppliers((prev) => [newSupp, ...prev]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  const updateCompanyProfile = (updates: Partial<SteelCompanyProfile>) => {
    setCompanyProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setCompanyProfile(INITIAL_COMPANY_PROFILE);
    setProductTypes(INITIAL_PRODUCT_TYPES);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setRawMaterials(INITIAL_RAW_MATERIALS);
    setProductionRuns(INITIAL_PRODUCTION_RUNS);
    setOrders(INITIAL_ORDERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setActiveTab('dashboard');
    setSearchQuery('');
  };

  return (
    <SteelERPContext.Provider
      value={{
        customers,
        products,
        productTypes,
        rawMaterials,
        productionRuns,
        orders,
        suppliers,
        companyProfile,
        activeTab,
        searchQuery,
        isSidebarCollapsed,

        setActiveTab,
        setSearchQuery,
        toggleSidebar,

        addCustomer,
        updateCustomer,
        deleteCustomer,

        addProduct,
        updateProduct,
        deleteProduct,
        addProductType,
        deleteProductType,
        adjustProductStock,

        addRawMaterial,
        updateRawMaterial,
        deleteRawMaterial,
        adjustRawMaterialStock,

        addProductionRun,
        updateProductionRun,
        deleteProductionRun,
        completeProductionRun,

        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,

        addSupplier,
        updateSupplier,
        deleteSupplier,

        updateCompanyProfile,
        resetToDemoData
      }}
    >
      {children}
    </SteelERPContext.Provider>
  );
};

export const useSteelERP = (): SteelERPContextType => {
  const context = useContext(SteelERPContext);
  if (!context) {
    throw new Error('useSteelERP must be used within a SteelERPProvider');
  }
  return context;
};
