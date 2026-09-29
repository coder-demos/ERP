export interface Customer {
  id: string;
  customerCode: string;
  name: string; // Company / Customer Name
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  customerType: string; // e.g. Structural Fabricator, Automotive OEM, Infrastructure, Distributor
  notes: string;
  createdAt: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface SteelProduct {
  id: string;
  sku: string;
  name: string;
  productType: string; // Steel Sheets, Steel Plates, Steel Coils, Steel Bars, Steel Rods, Steel Pipes, Steel Tubes, Steel Sections, Steel Beams, etc.
  grade: string; // e.g. ASTM A36, AISI 304, S355JR, AISI 316, 1018, 4140
  specification: string; // e.g. Hot Rolled, Cold Rolled, Galvanized, Seamless, Welded
  dimensions: string; // e.g. 1500 x 3000 mm, 200 x 100 mm
  thickness: string; // e.g. 6.0 mm, 12.0 mm
  width: string; // e.g. 1500 mm
  length: string; // e.g. 6000 mm
  unit: string; // Tons, Pieces, Meters, Bundles
  weight: number; // Unit or batch weight in MT or kg
  price: number; // Unit price in USD
  currentStock: number;
  minStockLevel: number;
  supplier: string;
  notes: string;
  createdAt: string;
}

export type ProductionStatus = 'Planned' | 'In Production' | 'Completed' | 'Cancelled';

export interface ProductionRun {
  id: string;
  productionCode: string;
  productId: string;
  productName: string;
  sku: string;
  grade: string;
  rawMaterialUsed: string; // Raw material name or reference
  rawMaterialQuantityUsed: number;
  quantityProduced: number;
  unit: string;
  productionDate: string;
  status: ProductionStatus;
  notes: string;
}

export interface RawMaterial {
  id: string;
  materialCode: string;
  name: string;
  materialType: string; // Billets, Slabs, Scrap, Master Coil, Ferro-Alloys, Zinc
  grade: string;
  supplier: string;
  quantity: number;
  unit: string; // MT, Tons, kg
  currentStock: number;
  minStockLevel: number;
  cost: number; // Cost per unit
  notes: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  grade: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
  // Quick primary item fields for quick display / single-item reference
  primarySku: string;
  totalQuantity: number;
  totalAmount: number;
  deliveryAddress: string;
  deliveryDate: string;
  carrierInfo: string;
  status: OrderStatus;
  notes: string;
}

export interface Supplier {
  id: string;
  supplierCode: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  materialsSupplied: string; // e.g. Steel Billets, Scrap Metal, Zinc Ingots
  notes: string;
  createdAt: string;
}

export interface SteelCompanyProfile {
  companyName: string;
  plantLocation: string;
  facilityCode: string;
  taxId: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  currencySymbol: string;
  annualCapacityMT: number;
}
