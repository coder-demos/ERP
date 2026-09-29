import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react';
import { SteelProduct, StockStatus } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface InventoryViewProps {
  onOpenStockAdjust: (product: SteelProduct) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  onOpenStockAdjust
}) => {
  const { products, adjustProductStock, searchQuery } = useSteelERP();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const inventoryItems = useMemo(() => {
    return products.map((p) => {
      let status: StockStatus = 'In Stock';
      if (p.currentStock === 0) status = 'Out of Stock';
      else if (p.currentStock <= p.minStockLevel) status = 'Low Stock';

      // Total weight in metric tons
      const totalWeightMT = p.unit === 'Tons' ? p.currentStock : Number((p.currentStock * p.weight).toFixed(2));

      return {
        ...p,
        stockStatus: status,
        totalWeightMT
      };
    });
  }, [products]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchName = item.name.toLowerCase().includes(q);
        const matchGrade = item.grade.toLowerCase().includes(q);
        const matchType = item.productType.toLowerCase().includes(q);
        if (!matchSku && !matchName && !matchGrade && !matchType) return false;
      }
      if (selectedStatus !== 'all' && item.stockStatus !== selectedStatus) return false;
      return true;
    });
  }, [inventoryItems, searchQuery, selectedStatus]);

  const totalTonnageInBays = inventoryItems.reduce((sum, item) => sum + item.totalWeightMT, 0);
  const inStockCount = inventoryItems.filter((i) => i.stockStatus === 'In Stock').length;
  const lowStockCount = inventoryItems.filter((i) => i.stockStatus === 'Low Stock').length;
  const outOfStockCount = inventoryItems.filter((i) => i.stockStatus === 'Out of Stock').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            SKU & Steel Inventory Control
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical stock monitoring by SKU, available quantities, tonnage weights, and reorder levels
          </p>
        </div>
      </div>

      {/* Stock Status Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Warehouse Weight</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {totalTonnageInBays.toLocaleString()} MT
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Total finished steel on floor</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">In Stock SKUs</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {inStockCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Healthy inventory</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Low Stock SKUs</span>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {lowStockCount}
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Below minimum threshold</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Out of Stock SKUs</span>
          <div className="text-xl font-bold font-mono text-red-600 mt-1 tabular-nums">
            {outOfStockCount}
          </div>
          <span className="text-[11px] text-red-600 font-medium mt-1 block">Zero inventory recorded</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Stock Status:
            </span>
            {['all', 'In Stock', 'Low Stock', 'Out of Stock'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st === 'all' ? 'All Inventory' : st}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-mono text-xs">
            Showing {filteredItems.length} of {products.length} SKUs
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Steel Product</th>
                <th className="py-3 px-4">Type / Grade</th>
                <th className="py-3 px-4 text-right">Available Qty</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4 text-right">Estimated Weight</th>
                <th className="py-3 px-4 text-right">Min Level</th>
                <th className="py-3 px-4 text-center">Stock Status</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {item.sku}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-semibold text-slate-900 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {item.dimensions} · {item.specification}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-800 font-medium block">{item.productType}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{item.grade}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    <span
                      className={
                        item.stockStatus === 'Out of Stock'
                          ? 'text-red-600'
                          : item.stockStatus === 'Low Stock'
                          ? 'text-amber-600'
                          : 'text-slate-900'
                      }
                    >
                      {item.currentStock.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">{item.unit}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-800">
                    {item.totalWeightMT.toLocaleString()} MT
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums">
                    {item.minStockLevel} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.stockStatus === 'Out of Stock'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : item.stockStatus === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.stockStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => adjustProductStock(item.id, Math.max(0, item.currentStock - 5))}
                        title="Quick deduct 5 units"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => adjustProductStock(item.id, item.currentStock + 5)}
                        title="Quick add 5 units"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenStockAdjust(item)}
                        title="Custom stock count adjustment"
                        className="rounded p-1 text-blue-600 hover:bg-blue-50"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                    No inventory records match the current status filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
