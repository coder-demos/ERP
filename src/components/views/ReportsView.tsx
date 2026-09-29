import React, { useState } from 'react';
import {
  BarChart2,
  FileSpreadsheet,
  Printer,
  Download,
  FileText,
  Boxes,
  Flame,
  Users,
  Truck
} from 'lucide-react';
import { useSteelERP } from '../../context/SteelERPContext';

type ReportType = 'sales' | 'inventory' | 'production' | 'customers' | 'suppliers';

export const ReportsView: React.FC = () => {
  const {
    orders,
    products,
    rawMaterials,
    productionRuns,
    customers,
    suppliers,
    companyProfile
  } = useSteelERP();

  const [activeReport, setActiveReport] = useState<ReportType>('sales');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeReport === 'sales') {
      headers = ['Order Number', 'Customer', 'Date', 'Product', 'SKU', 'Quantity', 'Amount ($)', 'Status'];
      rows = orders.map((o) => {
        const item = o.items[0];
        return [
          o.orderNumber,
          `"${o.customerName}"`,
          o.orderDate,
          `"${item?.productName || ''}"`,
          o.primarySku,
          `${o.totalQuantity} ${item?.unit || ''}`,
          o.totalAmount,
          o.status
        ];
      });
    } else if (activeReport === 'inventory') {
      headers = ['SKU', 'Product Name', 'Type', 'Grade', 'Current Stock', 'Unit', 'Min Level', 'Price ($)'];
      rows = products.map((p) => [
        p.sku,
        `"${p.name}"`,
        p.productType,
        p.grade,
        p.currentStock,
        p.unit,
        p.minStockLevel,
        p.price
      ]);
    } else if (activeReport === 'production') {
      headers = ['Production Code', 'Product', 'SKU', 'Grade', 'Raw Material Used', 'Qty Produced', 'Unit', 'Date', 'Status'];
      rows = productionRuns.map((r) => [
        r.productionCode,
        `"${r.productName}"`,
        r.sku,
        r.grade,
        `"${r.rawMaterialUsed}"`,
        r.quantityProduced,
        r.unit,
        r.productionDate,
        r.status
      ]);
    } else if (activeReport === 'customers') {
      headers = ['Customer Code', 'Name', 'Contact Person', 'Type', 'Phone', 'Email', 'City'];
      rows = customers.map((c) => [
        c.customerCode,
        `"${c.name}"`,
        `"${c.contactPerson}"`,
        c.customerType,
        c.phone,
        c.email,
        c.city
      ]);
    } else if (activeReport === 'suppliers') {
      headers = ['Supplier Code', 'Company Name', 'Contact Person', 'Phone', 'Email', 'Materials Supplied'];
      rows = suppliers.map((s) => [
        s.supplierCode,
        `"${s.companyName}"`,
        `"${s.contactPerson}"`,
        s.phone,
        s.email,
        `"${s.materialsSupplied}"`
      ]);
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexSteel_${activeReport}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Steel Manufacturing Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational summaries for sales, inventory stock on floor, mill production heats, customers, and suppliers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-2xs no-print">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            { id: 'sales', label: 'Sales Report', icon: FileText },
            { id: 'inventory', label: 'Inventory Report', icon: Boxes },
            { id: 'production', label: 'Production Report', icon: Flame },
            { id: 'customers', label: 'Customer Report', icon: Users },
            { id: 'suppliers', label: 'Supplier Report', icon: Truck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id as ReportType)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Paper Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider">
              {companyProfile.companyName} · Official Steel Mill Operations Report
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5 capitalize">
              {activeReport === 'sales' && 'Steel Product Sales & Revenue Report'}
              {activeReport === 'inventory' && 'Finished Steel & Raw Stock Inventory Report'}
              {activeReport === 'production' && 'Mill Rolling & Extrusion Production Report'}
              {activeReport === 'customers' && 'Customer Directory & Accounts Report'}
              {activeReport === 'suppliers' && 'Raw Material Suppliers & Vendor Report'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Report Date: {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <div>Facility: {companyProfile.facilityCode}</div>
          </div>
        </div>

        {/* Sales Report Table */}
        {activeReport === 'sales' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Total Booked Sales</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Total Orders</span>
                <span className="font-bold text-slate-900 text-sm">{orders.length}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Completed Orders</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {orders.filter((o) => o.status === 'Completed').length}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Primary SKU</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Amount ($)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{o.orderNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{o.customerName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{o.orderDate}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{o.primarySku}</td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">{o.totalQuantity}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                        ${o.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inventory Report Table */}
        {activeReport === 'inventory' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Total Products Listed</span>
                <span className="font-bold text-slate-900 text-sm">{products.length} SKUs</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Raw Material Feedstocks</span>
                <span className="font-bold text-slate-900 text-sm">{rawMaterials.length} Types</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Low Stock Alert Count</span>
                <span className="font-bold text-amber-600 text-sm">
                  {products.filter((p) => p.currentStock <= p.minStockLevel).length} SKUs
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3 text-right">Current Stock</th>
                    <th className="py-2.5 px-3 text-right">Min Level</th>
                    <th className="py-2.5 px-3 text-right">Price / Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{p.sku}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3">{p.productType}</td>
                      <td className="py-2.5 px-3 font-mono">{p.grade}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                        {p.currentStock} {p.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500 tabular-nums">
                        {p.minStockLevel} {p.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                        ${p.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Production Report Table */}
        {activeReport === 'production' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Total Production Heats</span>
                <span className="font-bold text-slate-900 text-sm">{productionRuns.length} Runs</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">Completed Runs</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {productionRuns.filter((r) => r.status === 'Completed').length}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-sans block">In Production</span>
                <span className="font-bold text-blue-600 text-sm">
                  {productionRuns.filter((r) => r.status === 'In Production').length}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Run ID</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3">Steel Grade</th>
                    <th className="py-2.5 px-3 text-right">Output Quantity</th>
                    <th className="py-2.5 px-3">Production Date</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {productionRuns.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{r.productionCode}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{r.productName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{r.sku}</td>
                      <td className="py-2.5 px-3 font-mono">{r.grade}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                        {r.quantityProduced} {r.unit}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{r.productionDate}</td>
                      <td className="py-2.5 px-3 text-center font-medium">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customer Report Table */}
        {activeReport === 'customers' && (
          <div className="space-y-4 text-xs">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Customer / Company Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Contact Person</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">City</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{c.customerCode}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{c.name}</td>
                      <td className="py-2.5 px-3">{c.customerType}</td>
                      <td className="py-2.5 px-3">{c.contactPerson}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{c.phone}</td>
                      <td className="py-2.5 px-3">{c.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Supplier Report Table */}
        {activeReport === 'suppliers' && (
          <div className="space-y-4 text-xs">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Supplier Name</th>
                    <th className="py-2.5 px-3">Materials Supplied</th>
                    <th className="py-2.5 px-3">Contact Person</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {suppliers.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{s.supplierCode}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{s.companyName}</td>
                      <td className="py-2.5 px-3 text-slate-800">{s.materialsSupplied}</td>
                      <td className="py-2.5 px-3">{s.contactPerson}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{s.phone}</td>
                      <td className="py-2.5 px-3 text-slate-600">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
