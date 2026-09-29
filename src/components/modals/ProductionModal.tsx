import React, { useState, useEffect } from 'react';
import { X, Flame } from 'lucide-react';
import { ProductionRun, ProductionStatus } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  runToEdit?: ProductionRun | null;
}

export const ProductionModal: React.FC<ProductionModalProps> = ({
  isOpen,
  onClose,
  runToEdit
}) => {
  const {
    addProductionRun,
    updateProductionRun,
    products,
    rawMaterials
  } = useSteelERP();

  const [productId, setProductId] = useState(products[0]?.id || '');
  const [productName, setProductName] = useState(products[0]?.name || '');
  const [sku, setSku] = useState(products[0]?.sku || '');
  const [grade, setGrade] = useState(products[0]?.grade || '');
  const [rawMaterialUsed, setRawMaterialUsed] = useState(rawMaterials[0]?.name || '');
  const [rawMaterialQuantityUsed, setRawMaterialQuantityUsed] = useState('25');
  const [quantityProduced, setQuantityProduced] = useState('24');
  const [unit, setUnit] = useState(products[0]?.unit || 'Tons');
  const [productionDate, setProductionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<ProductionStatus>('Planned');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (runToEdit) {
      setProductId(runToEdit.productId);
      setProductName(runToEdit.productName);
      setSku(runToEdit.sku);
      setGrade(runToEdit.grade);
      setRawMaterialUsed(runToEdit.rawMaterialUsed);
      setRawMaterialQuantityUsed(String(runToEdit.rawMaterialQuantityUsed));
      setQuantityProduced(String(runToEdit.quantityProduced));
      setUnit(runToEdit.unit);
      setProductionDate(runToEdit.productionDate);
      setStatus(runToEdit.status);
      setNotes(runToEdit.notes);
    } else if (products.length > 0) {
      const p = products[0];
      setProductId(p.id);
      setProductName(p.name);
      setSku(p.sku);
      setGrade(p.grade);
      setRawMaterialUsed(rawMaterials[0]?.name || 'Continuous Cast Billets');
      setRawMaterialQuantityUsed('30');
      setQuantityProduced('28');
      setUnit(p.unit);
      setProductionDate(new Date().toISOString().split('T')[0]);
      setStatus('Planned');
      setNotes('');
    }
  }, [runToEdit, isOpen, products, rawMaterials]);

  if (!isOpen) return null;

  const handleProductSelect = (id: string) => {
    setProductId(id);
    const p = products.find((prod) => prod.id === id);
    if (p) {
      setProductName(p.name);
      setSku(p.sku);
      setGrade(p.grade);
      setUnit(p.unit);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !sku.trim()) return;

    const payload = {
      productId,
      productName: productName.trim(),
      sku: sku.trim(),
      grade: grade.trim(),
      rawMaterialUsed: rawMaterialUsed.trim(),
      rawMaterialQuantityUsed: Number(rawMaterialQuantityUsed) || 0,
      quantityProduced: Number(quantityProduced) || 0,
      unit,
      productionDate,
      status,
      notes: notes.trim()
    };

    if (runToEdit) {
      updateProductionRun(runToEdit.id, payload);
    } else {
      addProductionRun(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {runToEdit ? 'Edit Production Run' : 'Plan Mill Production Run'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Target Steel Product *</label>
            <select
              value={productId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku} · {p.grade})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Product SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Steel Grade</label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Raw Material Feedstock Used</label>
              <select
                value={rawMaterialUsed}
                onChange={(e) => setRawMaterialUsed(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                {rawMaterials.map((rm) => (
                  <option key={rm.id} value={rm.name}>
                    {rm.name} ({rm.currentStock} {rm.unit} in stock)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Raw Material Qty Used (Tons)</label>
              <input
                type="number"
                min="0"
                value={rawMaterialQuantityUsed}
                onChange={(e) => setRawMaterialQuantityUsed(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Output Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={quantityProduced}
                onChange={(e) => setQuantityProduced(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              >
                <option value="Tons">Tons</option>
                <option value="Pieces">Pieces</option>
                <option value="Meters">Meters</option>
                <option value="Bundles">Bundles</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Production Date</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Production Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductionStatus)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
            >
              <option value="Planned">Planned</option>
              <option value="In Production">In Production</option>
              <option value="Completed">Completed (Adds to Finished Stock)</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Mill / Heat Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Rolling pass stands 4-8. Calibrate pyrometer for 1150°C furnace exit temperature."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              {runToEdit ? 'Save Changes' : 'Schedule Run'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
