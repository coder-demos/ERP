import {
  Customer,
  SteelProduct,
  RawMaterial,
  ProductionRun,
  Order,
  Supplier,
  SteelCompanyProfile
} from '../types';

export const INITIAL_COMPANY_PROFILE: SteelCompanyProfile = {
  companyName: 'Apex Steel Manufacturing Works',
  facilityCode: 'MILL-FAC-04',
  plantLocation: 'Rolling Mill Complex, Great Lakes Industrial Corridor',
  taxId: 'US-EIN-94-2849102',
  phone: '+1 (800) 555-IRON',
  email: 'operations@apexsteelworks.com',
  address: '4200 Heavy Metal Way, Gary, IN 46402',
  currency: 'USD',
  currencySymbol: '$',
  annualCapacityMT: 350000
};

export const INITIAL_PRODUCT_TYPES: string[] = [
  'Steel Plates',
  'Steel Sheets',
  'Steel Coils',
  'Steel Bars',
  'Steel Rods',
  'Steel Pipes',
  'Steel Tubes',
  'Steel Sections',
  'Steel Beams',
  'Rebar & Wire Rods'
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    customerCode: 'CUST-1001',
    name: 'Apex Structural Fabrication Ltd',
    contactPerson: 'Robert Miller',
    phone: '+1 (555) 349-2100',
    email: 'r.miller@apexstructuralfab.com',
    address: '8800 Industrial Parkway, Building B',
    city: 'Detroit, MI',
    customerType: 'Structural Fabricator',
    notes: 'Primary structural fabricator for Midwest logistics warehouses. Orders heavy plates & I-beams monthly.',
    createdAt: '2026-03-12'
  },
  {
    id: 'cust-2',
    customerCode: 'CUST-1002',
    name: 'Precision Automotive Pressings Inc',
    contactPerson: 'Sarah Lin',
    phone: '+1 (555) 782-9941',
    email: 's.lin@precisionautopress.com',
    address: '1420 Motor City Expressway',
    city: 'Cleveland, OH',
    customerType: 'Automotive OEM',
    notes: 'Requires strict ISO tolerance cold rolled and galvanized coils for chassis brackets.',
    createdAt: '2026-04-05'
  },
  {
    id: 'cust-3',
    customerCode: 'CUST-1003',
    name: 'Metro Infrastructure & Bridges Corp',
    contactPerson: 'David Kowalski',
    phone: '+1 (555) 601-3829',
    email: 'dkowalski@metroinfrabridges.gov',
    address: '300 State Highway Depot Road',
    city: 'Chicago, IL',
    customerType: 'Infrastructure Contractor',
    notes: 'Government certified bridge steel contractor. Mandates mill test certificates with Charpy V-notch tests.',
    createdAt: '2026-05-18'
  },
  {
    id: 'cust-4',
    customerCode: 'CUST-1004',
    name: 'Vanguard Offshore Heavy Engineering',
    contactPerson: 'Elena Rostova',
    phone: '+1 (555) 489-1120',
    email: 'e.rostova@vanguardheavy.com',
    address: '900 Port Authority Docks',
    city: 'Houston, TX',
    customerType: 'Heavy Engineering',
    notes: 'High-strength marine grade S355 and stainless 316 tubing for offshore drilling rigs.',
    createdAt: '2026-06-22'
  },
  {
    id: 'cust-5',
    customerCode: 'CUST-1005',
    name: 'Midwest Steel Distributors Group',
    contactPerson: 'James Thornton',
    phone: '+1 (555) 890-5561',
    email: 'jthornton@midweststeelstock.com',
    address: '2500 Rail Freight Yard Avenue',
    city: 'Indianapolis, IN',
    customerType: 'Steel Distributor',
    notes: 'Bulk stockist purchasing assorted hot rolled sheets and rebar bundles on net-30 terms.',
    createdAt: '2026-07-10'
  }
];

export const INITIAL_PRODUCTS: SteelProduct[] = [
  {
    id: 'prod-1',
    sku: 'PLT-A36-12X2400',
    name: 'Heavy Structural Steel Plate 12mm',
    productType: 'Steel Plates',
    grade: 'ASTM A36',
    specification: 'Hot Rolled, Mill Edge',
    dimensions: '2400 x 6000 mm',
    thickness: '12.0 mm',
    width: '2400 mm',
    length: '6000 mm',
    unit: 'Tons',
    weight: 1.36, // Weight per piece in MT
    price: 840, // Price per Ton
    currentStock: 120, // 120 Tons
    minStockLevel: 40,
    supplier: 'Midwest Metallurgical Smelters',
    notes: 'Standard building construction plate. Low carbon with excellent weldability.',
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-2',
    sku: 'SHT-304-2X1250',
    name: 'Stainless Steel Sheet 2mm 2B Finish',
    productType: 'Steel Sheets',
    grade: 'AISI 304',
    specification: 'Cold Rolled, Annealed & Pickled (2B)',
    dimensions: '1250 x 2500 mm',
    thickness: '2.0 mm',
    width: '1250 mm',
    length: '2500 mm',
    unit: 'Pieces',
    weight: 0.05, // 50kg per piece
    price: 145, // Price per piece
    currentStock: 18, // LOW STOCK
    minStockLevel: 50,
    supplier: 'Nippon Ferro-Alloys Ltd',
    notes: 'Corrosion resistant food & chemical processing grade. High nickel alloy content.',
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-3',
    sku: 'BEAM-S355-W14X90',
    name: 'Wide Flange Structural I-Beam W14x90',
    productType: 'Steel Beams',
    grade: 'S355JR',
    specification: 'Hot Rolled Universal Beam',
    dimensions: '356 x 368 mm Section',
    thickness: '18.0 mm Web / Flange',
    width: '368 mm',
    length: '12000 mm',
    unit: 'Tons',
    weight: 1.61, // 134 kg/m x 12m
    price: 920,
    currentStock: 85,
    minStockLevel: 30,
    supplier: 'Midwest Metallurgical Smelters',
    notes: 'High-yield strength structural beam used for multi-story framing and industrial cranes.',
    createdAt: '2026-02-01'
  },
  {
    id: 'prod-4',
    sku: 'COIL-HR-CQ-3X1500',
    name: 'Hot Rolled Steel Master Coil Commercial Quality',
    productType: 'Steel Coils',
    grade: 'SAE 1008',
    specification: 'Hot Rolled, Pickled & Oiled (HRPO)',
    dimensions: '1500 mm Width x Slit OD',
    thickness: '3.0 mm',
    width: '1500 mm',
    length: 'Continuous Coil',
    unit: 'Tons',
    weight: 22.5, // Coil weight in MT
    price: 780,
    currentStock: 310,
    minStockLevel: 100,
    supplier: 'Global Ore & Minerals Mining Corp',
    notes: 'Slitting and stamping stock for brackets, drums, and ductwork manufacturing.',
    createdAt: '2026-02-14'
  },
  {
    id: 'prod-5',
    sku: 'PIPE-A106B-SCH40-6IN',
    name: 'Seamless Carbon Steel Pressure Pipe 6" SCH 40',
    productType: 'Steel Pipes',
    grade: 'ASTM A106 Grade B',
    specification: 'Seamless High-Temp Service',
    dimensions: '168.3 mm OD x 7.11 mm Wall',
    thickness: '7.11 mm',
    width: '168.3 mm OD',
    length: '6000 mm',
    unit: 'Pieces',
    weight: 0.17, // ~28 kg/m x 6m = 170 kg
    price: 290,
    currentStock: 4, // OUT OF STOCK / CRITICAL
    minStockLevel: 25,
    supplier: 'Midwest Metallurgical Smelters',
    notes: 'High pressure steam and petrochemical transport lines. Hydrostatic tested.',
    createdAt: '2026-03-01'
  },
  {
    id: 'prod-6',
    sku: 'TUBE-HSS-100X100X6',
    name: 'Hollow Structural Steel Square Tube 100x100',
    productType: 'Steel Tubes',
    grade: 'ASTM A500 Grade B',
    specification: 'Cold Formed Welded Structural Tubing',
    dimensions: '100 x 100 mm',
    thickness: '6.0 mm',
    width: '100 mm',
    length: '6000 mm',
    unit: 'Pieces',
    weight: 0.105, // 17.5 kg/m x 6m
    price: 135,
    currentStock: 140,
    minStockLevel: 45,
    supplier: 'Olympic Scrap Metals Recovery',
    notes: 'Architectural columns, trailer frames, and solar rack mountings.',
    createdAt: '2026-03-10'
  },
  {
    id: 'prod-7',
    sku: 'BAR-4140-DIA50',
    name: 'High Tensile Alloy Round Bar Dia 50mm',
    productType: 'Steel Bars',
    grade: 'AISI 4140 / 42CrMo4',
    specification: 'Quenched & Tempered (QT), Peeled & Polished',
    dimensions: 'Dia 50 mm',
    thickness: '50.0 mm',
    width: '50 mm',
    length: '6000 mm',
    unit: 'Tons',
    weight: 0.092, // ~15.4 kg/m x 6m
    price: 1380,
    currentStock: 32,
    minStockLevel: 15,
    supplier: 'Nippon Ferro-Alloys Ltd',
    notes: 'Chromium-molybdenum alloy for machining shafts, bolts, gears, and pinions.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prod-8',
    sku: 'RBAR-GR60-D25',
    name: 'Deformed Reinforcing Rebar Bar #8 (25mm)',
    productType: 'Steel Rods',
    grade: 'ASTM A615 Grade 60',
    specification: 'High Bond Deformed Concrete Rebar',
    dimensions: 'Nominal Dia 25 mm',
    thickness: '25.0 mm',
    width: '25 mm',
    length: '12000 mm',
    unit: 'Tons',
    weight: 2.0, // 2 Ton standard tied bundle
    price: 740,
    currentStock: 240,
    minStockLevel: 80,
    supplier: 'Midwest Metallurgical Smelters',
    notes: 'Heavy foundation and bridge deck reinforcement bundles with mill identification ribs.',
    createdAt: '2026-04-01'
  }
];

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    id: 'raw-1',
    materialCode: 'RM-BILLET-A36',
    name: 'Continuous Cast Steel Billets 150x150',
    materialType: 'Billets',
    grade: 'ASTM A36 / St-37',
    supplier: 'Midwest Metallurgical Smelters',
    quantity: 450,
    unit: 'Tons',
    currentStock: 450,
    minStockLevel: 150,
    cost: 510,
    notes: 'Primary feed material for hot rolling mill bar and section lines.'
  },
  {
    id: 'raw-2',
    materialCode: 'RM-SCRAP-HMS1',
    name: 'Heavy Melting Scrap Steel (HMS 1/2)',
    materialType: 'Scrap Metal',
    grade: 'ISRI 200-206 Industrial Grade',
    supplier: 'Olympic Scrap Metals Recovery',
    quantity: 680,
    unit: 'Tons',
    currentStock: 680,
    minStockLevel: 200,
    cost: 340,
    notes: 'Prepared furnace feed scrap sheared to 5ft max dimension. Electric arc furnace charge.'
  },
  {
    id: 'raw-3',
    materialCode: 'RM-SLAB-S355',
    name: 'Heavy Cast Steel Slabs 250mm Thick',
    materialType: 'Slabs',
    grade: 'S355JR Heavy Gauge',
    supplier: 'Global Ore & Minerals Mining Corp',
    quantity: 80,
    unit: 'Tons',
    currentStock: 80, // LOW STOCK
    minStockLevel: 120,
    cost: 580,
    notes: 'Feedstock for reversing heavy plate rolling mill line.'
  },
  {
    id: 'raw-4',
    materialCode: 'RM-FERRO-MN',
    name: 'High Carbon Ferro-Manganese Pellets',
    materialType: 'Ferro-Alloys',
    grade: 'Mn 75% Min, C 7.0% Max',
    supplier: 'Nippon Ferro-Alloys Ltd',
    quantity: 35,
    unit: 'Tons',
    currentStock: 35,
    minStockLevel: 20,
    cost: 1650,
    notes: 'Deoxidizer and alloying agent added in ladle metallurgy furnace during refining.'
  },
  {
    id: 'raw-5',
    materialCode: 'RM-ZINC-SHG',
    name: 'Special High Grade Zinc Ingots (99.995%)',
    materialType: 'Zinc Coating',
    grade: 'ASTM B6 SHG',
    supplier: 'Global Ore & Minerals Mining Corp',
    quantity: 12,
    unit: 'Tons',
    currentStock: 12, // LOW STOCK
    minStockLevel: 25,
    cost: 2950,
    notes: 'Feed bath ingot for hot-dip continuous galvanizing line.'
  }
];

export const INITIAL_PRODUCTION_RUNS: ProductionRun[] = [
  {
    id: 'pr-1',
    productionCode: 'PR-2026-081',
    productId: 'prod-1',
    productName: 'Heavy Structural Steel Plate 12mm',
    sku: 'PLT-A36-12X2400',
    grade: 'ASTM A36',
    rawMaterialUsed: 'Continuous Cast Steel Billets 150x150',
    rawMaterialQuantityUsed: 52,
    quantityProduced: 50,
    unit: 'Tons',
    productionDate: '2026-09-24',
    status: 'Completed',
    notes: 'Rolling pass 4 through 9 completed within target thickness tolerance ±0.2mm.'
  },
  {
    id: 'pr-2',
    productionCode: 'PR-2026-082',
    productId: 'prod-3',
    productName: 'Wide Flange Structural I-Beam W14x90',
    sku: 'BEAM-S355-W14X90',
    grade: 'S355JR',
    rawMaterialUsed: 'Heavy Cast Steel Slabs 250mm Thick',
    rawMaterialQuantityUsed: 42,
    quantityProduced: 40,
    unit: 'Tons',
    productionDate: '2026-09-27',
    status: 'In Production',
    notes: 'Breakdown stand rolling active. Web cooling water nozzles calibrated.'
  },
  {
    id: 'pr-3',
    productionCode: 'PR-2026-083',
    productId: 'prod-5',
    productName: 'Seamless Carbon Steel Pressure Pipe 6" SCH 40',
    sku: 'PIPE-A106B-SCH40-6IN',
    grade: 'ASTM A106 Grade B',
    rawMaterialUsed: 'Continuous Cast Steel Billets 150x150',
    rawMaterialQuantityUsed: 15,
    quantityProduced: 80,
    unit: 'Pieces',
    productionDate: '2026-09-29',
    status: 'Planned',
    notes: 'Piercing mill scheduled for evening shift. Mandatory ultrasonic test calibration.'
  },
  {
    id: 'pr-4',
    productionCode: 'PR-2026-084',
    productId: 'prod-2',
    productName: 'Stainless Steel Sheet 2mm 2B Finish',
    sku: 'SHT-304-2X1250',
    grade: 'AISI 304',
    rawMaterialUsed: 'High Carbon Ferro-Manganese Pellets & Scrap',
    rawMaterialQuantityUsed: 10,
    quantityProduced: 60,
    unit: 'Pieces',
    productionDate: '2026-09-30',
    status: 'Planned',
    notes: 'Cold rolling batch to replenish critical inventory for precision automotive clients.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'SO-2026-1042',
    customerId: 'cust-1',
    customerName: 'Apex Structural Fabrication Ltd',
    orderDate: '2026-09-25',
    items: [
      {
        productId: 'prod-1',
        productName: 'Heavy Structural Steel Plate 12mm',
        sku: 'PLT-A36-12X2400',
        grade: 'ASTM A36',
        quantity: 24,
        unit: 'Tons',
        unitPrice: 840,
        total: 20160
      },
      {
        productId: 'prod-3',
        productName: 'Wide Flange Structural I-Beam W14x90',
        sku: 'BEAM-S355-W14X90',
        grade: 'S355JR',
        quantity: 12,
        unit: 'Tons',
        unitPrice: 920,
        total: 11040
      }
    ],
    primarySku: 'PLT-A36-12X2400',
    totalQuantity: 36,
    totalAmount: 31200,
    deliveryAddress: '8800 Industrial Parkway, Detroit, MI',
    deliveryDate: '2026-10-04',
    carrierInfo: 'Great Lakes Flatbed Logistics (Truck #FL-491)',
    status: 'Completed',
    notes: 'Delivered and signed. Mill test certificates MTR #8912 attached.'
  },
  {
    id: 'ord-2',
    orderNumber: 'SO-2026-1043',
    customerId: 'cust-2',
    customerName: 'Precision Automotive Pressings Inc',
    orderDate: '2026-09-27',
    items: [
      {
        productId: 'prod-4',
        productName: 'Hot Rolled Steel Master Coil Commercial Quality',
        sku: 'COIL-HR-CQ-3X1500',
        grade: 'SAE 1008',
        quantity: 45,
        unit: 'Tons',
        unitPrice: 780,
        total: 35100
      }
    ],
    primarySku: 'COIL-HR-CQ-3X1500',
    totalQuantity: 45,
    totalAmount: 35100,
    deliveryAddress: '1420 Motor City Expressway, Cleveland, OH',
    deliveryDate: '2026-10-06',
    carrierInfo: 'Norfolk Southern Rail Freight Car #NS-9102',
    status: 'Processing',
    notes: 'Coils prepared in bay 3 with weather protective vapor-inhibiting plastic wrap.'
  },
  {
    id: 'ord-3',
    orderNumber: 'SO-2026-1044',
    customerId: 'cust-3',
    customerName: 'Metro Infrastructure & Bridges Corp',
    orderDate: '2026-09-28',
    items: [
      {
        productId: 'prod-8',
        productName: 'Deformed Reinforcing Rebar Bar #8 (25mm)',
        sku: 'RBAR-GR60-D25',
        grade: 'ASTM A615 Grade 60',
        quantity: 50,
        unit: 'Tons',
        unitPrice: 740,
        total: 37000
      }
    ],
    primarySku: 'RBAR-GR60-D25',
    totalQuantity: 50,
    totalAmount: 37000,
    deliveryAddress: '300 State Highway Depot Road, Chicago, IL',
    deliveryDate: '2026-10-10',
    carrierInfo: 'Midwest Heavy Haul Dedicated Fleet #TR-12',
    status: 'Pending',
    notes: 'Awaiting site inspector clearance prior to dispatch.'
  },
  {
    id: 'ord-4',
    orderNumber: 'SO-2026-1045',
    customerId: 'cust-4',
    customerName: 'Vanguard Offshore Heavy Engineering',
    orderDate: '2026-09-29',
    items: [
      {
        productId: 'prod-5',
        productName: 'Seamless Carbon Steel Pressure Pipe 6" SCH 40',
        sku: 'PIPE-A106B-SCH40-6IN',
        grade: 'ASTM A106 Grade B',
        quantity: 20,
        unit: 'Pieces',
        unitPrice: 290,
        total: 5800
      }
    ],
    primarySku: 'PIPE-A106B-SCH40-6IN',
    totalQuantity: 20,
    totalAmount: 5800,
    deliveryAddress: '900 Port Authority Docks, Houston, TX',
    deliveryDate: '2026-10-15',
    carrierInfo: 'Gulf Coast Freight Lines',
    status: 'Pending',
    notes: 'Requires 3.1 inspection certification before loading.'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    supplierCode: 'SUPP-201',
    companyName: 'Global Ore & Minerals Mining Corp',
    contactPerson: 'David Chen',
    phone: '+1 (555) 301-8842',
    email: 'd.chen@globaloremining.com',
    address: '100 Mining Exchange Blvd, Duluth, MN',
    materialsSupplied: 'Iron Ore Pellets, Slabs, SHG Zinc',
    notes: 'Tier-1 primary mining and smelting provider. Direct rail spur delivery.',
    createdAt: '2026-01-05'
  },
  {
    id: 'supp-2',
    supplierCode: 'SUPP-202',
    companyName: 'Midwest Metallurgical Smelters',
    contactPerson: 'Frank Vance',
    phone: '+1 (555) 771-4210',
    email: 'fvance@midwestmetallurgical.com',
    address: '450 Smelter Basin Way, East Chicago, IN',
    materialsSupplied: 'Continuous Cast Billets, Heavy Slabs, Pig Iron',
    notes: 'Reliable continuous caster supplying certified ASTM & EN standard billets.',
    createdAt: '2026-02-11'
  },
  {
    id: 'supp-3',
    supplierCode: 'SUPP-203',
    companyName: 'Olympic Scrap Metals Recovery',
    contactPerson: 'Tony Bianchi',
    phone: '+1 (555) 912-6630',
    email: 't.bianchi@olympicscrap.com',
    address: '800 River Road Scrap Yard, Gary, IN',
    materialsSupplied: 'Heavy Melting Scrap HMS 1/2, Shredded Steel, Turnings',
    notes: 'Recycled ferrous metals processor with 5,000 MT monthly allocation.',
    createdAt: '2026-02-28'
  },
  {
    id: 'supp-4',
    supplierCode: 'SUPP-204',
    companyName: 'Nippon Ferro-Alloys Ltd',
    contactPerson: 'Kenji Sato',
    phone: '+1 (555) 440-1922',
    email: 'k.sato@nipponferroalloys.co',
    address: '220 International Trade Pier, Chicago Port, IL',
    materialsSupplied: 'Ferro-Manganese, Ferro-Silicon, Nickel Briquettes',
    notes: 'High-purity alloying elements for secondary refining and stainless steel heats.',
    createdAt: '2026-03-15'
  }
];
