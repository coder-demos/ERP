import React, { useState, useMemo } from 'react';
import {
  Layers3,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  X,
  Minus
} from 'lucide-react';
import { RawMaterial } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface RawMaterialsViewProps {
  onOpenAddModal: () => void;
  onEditRawMaterial: (material: RawMaterial) => void;
}

export const RawMaterialsView: React.FC<RawMaterialsViewProps> = ({
  onOpenAddModal,
  onEditRawMaterial
}) => {
  const {
    rawMaterials,
    deleteRawMaterial,
    adjustRawMaterialStock,
    searchQuery
  } = useSteelERP();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMaterialDetails, setSelectedMaterialDetails] = useState<RawMaterial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredMaterials = useMemo(() => {
    return rawMaterials.filter((rm) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = rm.name.toLowerCase().includes(q);
        const matchCode = rm.materialCode.toLowerCase().includes(q);
        const matchGrade = rm.grade.toLowerCase().includes(q);
        const matchSupp = rm.supplier.toLowerCase().includes(q);
        const matchType = rm.materialType.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchGrade && !matchSupp && !matchType) return false;
      }
      if (selectedType !== 'all' && rm.materialType !== selectedType) return false;
      return true;
    });
  }, [rawMaterials, searchQuery, selectedType]);

  const materialTypes = Array.from(new Set(rawMaterials.map((rm) => rm.materialType)));
  const totalStockTons = rawMaterials
    .filter((rm) => rm.unit === 'Tons')
    .reduce((sum, rm) => sum + rm.currentStock, 0);

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Raw Materials & Furnace Feedstock
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous cast billets, heavy slabs, melting scrap, iron ore pellets, and ferro-alloy additives
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Raw Material</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Type:
            </span>
            <button
              onClick={() => setSelectedType('all')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Raw Materials ({rawMaterials.length})
            </button>
            {materialTypes.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  selectedType === t
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-mono text-xs">
            Total Raw Stock: <strong className="text-slate-900">{totalStockTons.toLocaleString()} Tons</strong>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Material ID</th>
                <th className="py-3 px-4">Material Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Cost / Unit</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Min Level</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMaterials.map((rm) => {
                const isLow = rm.currentStock <= rm.minStockLevel;
                return (
                  <tr key={rm.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {rm.materialCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <button
                        onClick={() => setSelectedMaterialDetails(rm)}
                        className="hover:text-blue-600 text-left block truncate max-w-xs"
                      >
                        {rm.name}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{rm.materialType}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{rm.grade}</td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]">{rm.supplier}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-slate-800">
                      ${rm.cost.toLocaleString()} / {rm.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={isLow ? 'text-amber-600' : 'text-slate-900'}>
                        {rm.currentStock.toLocaleString()} {rm.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500 tabular-nums">
                      {rm.minStockLevel} {rm.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isLow
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isLow ? 'Low Stock' : 'Adequate'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => adjustRawMaterialStock(rm.id, rm.currentStock + 25)}
                          title="Receive 25 units"
                          className="rounded p-1 text-slate-400 hover:text-emerald-600"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => adjustRawMaterialStock(rm.id, Math.max(0, rm.currentStock - 25))}
                          title="Consume 25 units"
                          className="rounded p-1 text-slate-400 hover:text-amber-600"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedMaterialDetails(rm)}
                          className="rounded p-1 text-slate-400 hover:text-blue-600"
                          title="View Specs"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditRawMaterial(rm)}
                          className="rounded p-1 text-slate-400 hover:text-slate-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(rm.id)}
                          className="rounded p-1 text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 italic">
                    No raw materials match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Material Details Modal */}
      {selectedMaterialDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-blue-600 font-bold text-xs">
                  {selectedMaterialDetails.materialCode} · {selectedMaterialDetails.materialType}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedMaterialDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMaterialDetails(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Current Stock</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedMaterialDetails.currentStock} {selectedMaterialDetails.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Cost per {selectedMaterialDetails.unit}</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${selectedMaterialDetails.cost}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Minimum Level</span>
                <span className="font-bold text-slate-700">
                  {selectedMaterialDetails.minStockLevel} {selectedMaterialDetails.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Grade / Standard</span>
                <span className="font-bold text-slate-700">
                  {selectedMaterialDetails.grade}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">Supplier</span>
              <p className="font-medium text-slate-900">{selectedMaterialDetails.supplier}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Material & Storage Notes
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedMaterialDetails.notes || 'No specific notes logged.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedMaterialDetails(null)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Delete Raw Material</h3>
            <p className="text-slate-600">
              Are you sure you want to remove this raw material record from the inventory?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRawMaterial(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
              >
                Delete Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
