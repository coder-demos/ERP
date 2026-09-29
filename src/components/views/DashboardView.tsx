import React from 'react';
import {
  Users,
  Layers,
  Boxes,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  TrendingUp,
  Factory
} from 'lucide-react';
import { useSteelERP } from '../../context/SteelERPContext';

export const DashboardView: React.FC = () => {
  const {
    customers,
    products,
    rawMaterials,
    orders,
    productionRuns,
    setActiveTab,
    companyProfile
  } = useSteelERP();

  // Metrics
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  // Total finished stock tonnage/count
  const totalStockQuantity = products.reduce((sum, p) => sum + p.currentStock, 0);

  // Low stock products
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockLevel);
  const lowStockRawMaterials = rawMaterials.filter((rm) => rm.currentStock <= rm.minStockLevel);
  const totalLowStockCount = lowStockProducts.length + lowStockRawMaterials.length;

  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Mill Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Steel Manufacturing Operations Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {companyProfile.companyName} · {companyProfile.plantLocation}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-slate-700 shadow-2xs">
            <Factory className="h-4 w-4 text-blue-600" />
            <span>Facility Status: <strong className="text-emerald-600">Active Production</strong></span>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Total Customers */}
        <div
          onClick={() => setActiveTab('customers')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Customers</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalCustomers}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active steel accounts</span>
        </div>

        {/* 2. Total Products */}
        <div
          onClick={() => setActiveTab('products')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Products</span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalProducts}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Catalog steel SKUs</span>
        </div>

        {/* 3. Current Stock */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Current Stock</span>
            <Boxes className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalStockQuantity.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Units / Tons in bays</span>
        </div>

        {/* 4. Low Stock Items */}
        <div
          onClick={() => setActiveTab('inventory')}
          className={`rounded-xl border p-4 shadow-2xs hover:border-amber-400 cursor-pointer transition-all ${
            totalLowStockCount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-amber-900">Low Stock Items</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
            {totalLowStockCount}
          </div>
          <span className="text-[11px] text-amber-800 mt-1 block">Needs mill reorder</span>
        </div>

        {/* 5. Pending Orders */}
        <div
          onClick={() => setActiveTab('orders')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pending Orders</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {pendingOrders}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Queued / Processing</span>
        </div>

        {/* 6. Completed Orders */}
        <div
          onClick={() => setActiveTab('orders')}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Completed Orders</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {completedOrders}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Dispatched & Settled</span>
        </div>
      </div>

      {/* Low Stock Items Attention Table & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                Low Stock Alert (Immediate Reorder Required)
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <span>View Inventory</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-2 px-3">Item / SKU</th>
                  <th className="py-2 px-3">Grade</th>
                  <th className="py-2 px-3 text-right">Current Stock</th>
                  <th className="py-2 px-3 text-right">Min Level</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-medium text-slate-900">
                      <span className="block truncate">{p.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                    </td>
                    <td className="py-2 px-3">{p.grade}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-red-600 tabular-nums">
                      {p.currentStock} {p.unit}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500 tabular-nums">
                      {p.minStockLevel} {p.unit}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {p.currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}

                {lowStockRawMaterials.map((rm) => (
                  <tr key={rm.id} className="hover:bg-slate-50 bg-amber-50/20">
                    <td className="py-2 px-3 font-medium text-slate-900">
                      <span className="block truncate">{rm.name}</span>
                      <span className="font-mono text-[10px] text-amber-700">Raw: {rm.materialCode}</span>
                    </td>
                    <td className="py-2 px-3">{rm.grade}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-700 tabular-nums">
                      {rm.currentStock} {rm.unit}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-500 tabular-nums">
                      {rm.minStockLevel} {rm.unit}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                        Low Raw
                      </span>
                    </td>
                  </tr>
                ))}

                {lowStockProducts.length === 0 && lowStockRawMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                      All products and raw material stockpiles are above minimum threshold.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Sales & Orders Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">Recent Sales & Dispatch Orders</h3>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-2 px-3">Order #</th>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3 text-right">Amount</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {ord.orderNumber}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 truncate max-w-[160px]">
                      {ord.customerName}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-slate-900">
                      ${ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      {ord.orderDate}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ord.status === 'Processing'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                      No sales orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
