import React, { useState, useMemo } from 'react';
import {
  Flame,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Play,
  Check,
  Edit,
  Trash2,
  Eye,
  X,
  Layers3
} from 'lucide-react';
import { ProductionRun, ProductionStatus } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface ProductionViewProps {
  onOpenAddModal: () => void;
  onEditProductionRun: (run: ProductionRun) => void;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  onOpenAddModal,
  onEditProductionRun
}) => {
  const {
    productionRuns,
    updateProductionRun,
    completeProductionRun,
    deleteProductionRun,
    searchQuery
  } = useSteelERP();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRunDetails, setSelectedRunDetails] = useState<ProductionRun | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredRuns = useMemo(() => {
    return productionRuns.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchCode = r.productionCode.toLowerCase().includes(q);
        const matchProd = r.productName.toLowerCase().includes(q);
        const matchSku = r.sku.toLowerCase().includes(q);
        const matchGrade = r.grade.toLowerCase().includes(q);
        const matchRaw = r.rawMaterialUsed.toLowerCase().includes(q);
        if (!matchCode && !matchProd && !matchSku && !matchGrade && !matchRaw) return false;
      }
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [productionRuns, searchQuery, selectedStatus]);

  const getStatusBadge = (status: ProductionStatus) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'In Production':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Planned':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Cancelled':
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const completedTonnage = productionRuns
    .filter((r) => r.status === 'Completed' && r.unit === 'Tons')
    .reduce((sum, r) => sum + r.quantityProduced, 0);

  const activeRunsCount = productionRuns.filter((r) => r.status === 'In Production').length;
  const plannedRunsCount = productionRuns.filter((r) => r.status === 'Planned').length;

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Steel Manufacturing & Mill Production
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track rolling mill passes, scheduled extrusion heats, raw material consumption, and finished outputs
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Production Run</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Completed Mill Output</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {completedTonnage.toLocaleString()} MT
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Finished prime grade steel</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Currently In Rolling / Production</span>
          <div className="text-xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
            {activeRunsCount} Active Batches
          </div>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block">Active on mill floor</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Scheduled & Planned Runs</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {plannedRunsCount} Planned Heats
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Queued in furnace lineup</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {['all', 'Planned', 'In Production', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st === 'all' ? 'All Runs' : st}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-mono text-xs">
            Showing {filteredRuns.length} of {productionRuns.length} production runs
          </div>
        </div>
      </div>

      {/* Production Runs Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Production ID</th>
                <th className="py-3 px-4">Product / SKU</th>
                <th className="py-3 px-4">Steel Grade</th>
                <th className="py-3 px-4">Raw Material Feed</th>
                <th className="py-3 px-4 text-right">Output Produced</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {run.productionCode}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-semibold text-slate-900 block truncate">
                      {run.productName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 block truncate">
                      {run.sku}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                    {run.grade}
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
                    <div>{run.rawMaterialUsed}</div>
                    <span className="font-mono text-[10px] text-slate-400">
                      Charge: {run.rawMaterialQuantityUsed} Tons
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {run.quantityProduced.toLocaleString()} {run.unit}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{run.productionDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border ${getStatusBadge(
                        run.status
                      )}`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {run.status === 'Planned' && (
                        <button
                          onClick={() => updateProductionRun(run.id, { status: 'In Production' })}
                          className="flex items-center gap-1 rounded bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 text-[11px] font-medium hover:bg-blue-100"
                          title="Start Mill Run"
                        >
                          <Play className="h-3 w-3" />
                          <span>Start</span>
                        </button>
                      )}
                      {run.status === 'In Production' && (
                        <button
                          onClick={() => completeProductionRun(run.id)}
                          className="flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 text-[11px] font-medium hover:bg-emerald-100"
                          title="Complete and deposit to finished inventory"
                        >
                          <Check className="h-3 w-3" />
                          <span>Complete</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedRunDetails(run)}
                        className="rounded p-1 text-slate-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditProductionRun(run)}
                        className="rounded p-1 text-slate-400 hover:text-slate-700"
                        title="Edit Run"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(run.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600"
                        title="Delete Run"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRuns.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No production runs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Run Details Modal */}
      {selectedRunDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-blue-600 font-bold text-xs">
                  {selectedRunDetails.productionCode}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedRunDetails.productName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRunDetails(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">SKU</span>
                <span className="font-bold text-slate-900">{selectedRunDetails.sku}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Steel Grade</span>
                <span className="font-bold text-slate-900">{selectedRunDetails.grade}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Quantity Output</span>
                <span className="font-bold text-emerald-600">{selectedRunDetails.quantityProduced} {selectedRunDetails.unit}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Status</span>
                <span className="font-bold text-blue-600">{selectedRunDetails.status}</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-700 block">Raw Material Feedstock</span>
              <p className="text-slate-900 font-medium">{selectedRunDetails.rawMaterialUsed}</p>
              <p className="text-slate-500 font-mono text-[11px]">
                Feed Consumed: {selectedRunDetails.rawMaterialQuantityUsed} Tons
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Mill Run & Heat Notes
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedRunDetails.notes || 'No specific notes logged.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedRunDetails(null)}
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
            <h3 className="text-sm font-bold text-slate-900">Delete Production Run</h3>
            <p className="text-slate-600">
              Are you sure you want to delete this manufacturing batch record?
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
                  deleteProductionRun(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
              >
                Delete Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
