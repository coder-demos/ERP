import React, { useState, useEffect } from 'react';
import { X, Layers3 } from 'lucide-react';
import { RawMaterial } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface RawMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialToEdit?: RawMaterial | null;
}

export const RawMaterialModal: React.FC<RawMaterialModalProps> = ({
  isOpen,
  onClose,
  materialToEdit
}) => {
  const { addRawMaterial, updateRawMaterial, suppliers } = useSteelERP();

  const [name, setName] = useState('');
  const [materialType, setMaterialType] = useState('Billets');
  const [grade, setGrade] = useState('ASTM A36');
  const [supplier, setSupplier] = useState(suppliers[0]?.companyName || '');
  const [currentStock, setCurrentStock] = useState('100');
  const [minStockLevel, setMinStockLevel] = useState('50');
  const [unit, setUnit] = useState('Tons');
  const [cost, setCost] = useState('500');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (materialToEdit) {
      setName(materialToEdit.name);
      setMaterialType(materialToEdit.materialType);
      setGrade(materialToEdit.grade);
      setSupplier(materialToEdit.supplier);
      setCurrentStock(String(materialToEdit.currentStock));
      setMinStockLevel(String(materialToEdit.minStockLevel));
      setUnit(materialToEdit.unit);
      setCost(String(materialToEdit.cost));
      setNotes(materialToEdit.notes);
    } else {
      setName('');
      setMaterialType('Billets');
      setGrade('ASTM A36');
      setSupplier(suppliers[0]?.companyName || '');
      setCurrentStock('100');
      setMinStockLevel('40');
      setUnit('Tons');
      setCost('480');
      setNotes('');
    }
  }, [materialToEdit, isOpen, suppliers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      materialType,
      grade: grade.trim(),
      supplier: supplier.trim(),
      quantity: Number(currentStock) || 0,
      currentStock: Number(currentStock) || 0,
      minStockLevel: Number(minStockLevel) || 0,
      unit,
      cost: Number(cost) || 0,
      notes: notes.trim()
    };

    if (materialToEdit) {
      updateRawMaterial(materialToEdit.id, payload);
    } else {
      addRawMaterial(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {materialToEdit ? 'Edit Raw Material' : 'Add Raw Material'}
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
            <label className="block font-medium text-slate-700 mb-1">Raw Material Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Continuous Cast Steel Billets 150x150"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Material Type</label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="Billets">Billets</option>
                <option value="Slabs">Slabs</option>
                <option value="Scrap Metal">Scrap Metal (HMS 1/2)</option>
                <option value="Master Coil">Master Coil</option>
                <option value="Iron Ore Pellets">Iron Ore Pellets</option>
                <option value="Ferro-Alloys">Ferro-Alloys</option>
                <option value="Zinc Coating">Zinc Coating</option>
                <option value="Other">Other Feedstock</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Grade / Composition</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. ASTM A36 / St-37"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Supplier</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Midwest Metallurgical"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Cost per Unit ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="480"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="Tons">Tons (MT)</option>
                <option value="Pieces">Pieces</option>
                <option value="kg">kg</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Current Stock ({unit}) *</label>
              <input
                type="number"
                required
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Minimum Stock Level</label>
              <input
                type="number"
                min="0"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Procurement Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Electric arc furnace feed. Inspect for moisture upon delivery."
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
              {materialToEdit ? 'Save Changes' : 'Add Raw Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
