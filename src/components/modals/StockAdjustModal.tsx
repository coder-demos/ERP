import React, { useState, useEffect } from 'react';
import { X, Boxes, Plus, Minus } from 'lucide-react';
import { SteelProduct } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SteelProduct | null;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { adjustProductStock } = useSteelERP();

  const [adjustmentType, setAdjustmentType] = useState<'add' | 'deduct' | 'set'>('add');
  const [adjustmentValue, setAdjustmentValue] = useState('10');
  const [reason, setReason] = useState('Batch Production Inflow / Receipt');

  if (!isOpen || !product) return null;

  const current = product.currentStock;
  const numVal = Math.max(0, Number(adjustmentValue) || 0);

  let resultingStock = current;
  if (adjustmentType === 'add') resultingStock = current + numVal;
  else if (adjustmentType === 'deduct') resultingStock = Math.max(0, current - numVal);
  else resultingStock = numVal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustProductStock(product.id, resultingStock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Adjust Inventory Stock: {product.sku}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <p className="font-semibold text-slate-900">{product.name}</p>
          <p className="text-slate-500 text-[11px]">
            Grade: {product.grade} · Spec: {product.specification} · {product.dimensions}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAdjustmentType('add')}
              className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                adjustmentType === 'add'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              + Add Stock
            </button>
            <button
              type="button"
              onClick={() => setAdjustmentType('deduct')}
              className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                adjustmentType === 'deduct'
                  ? 'bg-amber-50 border-amber-500 text-amber-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              - Deduct Stock
            </button>
            <button
              type="button"
              onClick={() => setAdjustmentType('set')}
              className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                adjustmentType === 'set'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Set Exact Count
            </button>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Quantity to {adjustmentType === 'add' ? 'Add' : adjustmentType === 'deduct' ? 'Deduct' : 'Set'} ({product.unit})
            </label>
            <input
              type="number"
              required
              min="0"
              value={adjustmentValue}
              onChange={(e) => setAdjustmentValue(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 font-mono tabular-nums text-slate-900"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">Current Stock</span>
              <span className="font-bold text-slate-900">{current} {product.unit}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block font-sans">Resulting Stock</span>
              <span className="font-bold text-blue-600 text-sm">{resultingStock} {product.unit}</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Adjustment Reason / Reference</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Physical inventory count, production batch receipt"
              className="w-full rounded-lg border border-slate-300 p-2 text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
