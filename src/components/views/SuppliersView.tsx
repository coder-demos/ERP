import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { Supplier } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface SuppliersViewProps {
  onOpenAddModal: () => void;
  onEditSupplier: (supplier: Supplier) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  onOpenAddModal,
  onEditSupplier
}) => {
  const { suppliers, deleteSupplier, searchQuery } = useSteelERP();

  const [selectedSupplierDetails, setSelectedSupplierDetails] = useState<Supplier | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = s.companyName.toLowerCase().includes(q);
        const matchCode = s.supplierCode.toLowerCase().includes(q);
        const matchContact = s.contactPerson.toLowerCase().includes(q);
        const matchMat = s.materialsSupplied.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchContact && !matchMat) return false;
      }
      return true;
    });
  }, [suppliers, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Steel Raw Material Suppliers & Vendors
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage iron ore, scrap metal, billet casting, and ferro-alloy vendor contracts and delivery terms
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Supplier ID</th>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Materials Supplied</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSuppliers.map((supp) => (
                <tr key={supp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {supp.supplierCode}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedSupplierDetails(supp)}
                      className="font-semibold text-slate-900 hover:text-blue-600 text-left block truncate max-w-xs"
                    >
                      {supp.companyName}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {supp.contactPerson || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                      {supp.materialsSupplied}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {supp.phone || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">
                    {supp.email || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 truncate max-w-[200px]">
                    {supp.address || '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedSupplierDetails(supp)}
                        className="rounded p-1 text-slate-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditSupplier(supp)}
                        className="rounded p-1 text-slate-400 hover:text-slate-700"
                        title="Edit Supplier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(supp.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600"
                        title="Delete Supplier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No suppliers match the current search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Supplier Details Modal */}
      {selectedSupplierDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-blue-600 font-bold text-xs">
                  {selectedSupplierDetails.supplierCode}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedSupplierDetails.companyName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSupplierDetails(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400 w-24">Contact:</span>
                <span className="font-semibold text-slate-900">{selectedSupplierDetails.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400 w-24">Phone:</span>
                <span className="font-mono">{selectedSupplierDetails.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400 w-24">Email:</span>
                <span>{selectedSupplierDetails.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="text-slate-400 w-24">Yard Address:</span>
                <span>{selectedSupplierDetails.address}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Materials Supplied
              </span>
              <p className="font-medium text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedSupplierDetails.materialsSupplied}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Contract & Delivery Terms
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedSupplierDetails.notes || 'No specific notes logged.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedSupplierDetails(null)}
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
            <h3 className="text-sm font-bold text-slate-900">Delete Supplier Record</h3>
            <p className="text-slate-600">
              Are you sure you want to remove this raw material vendor from the directory?
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
                  deleteSupplier(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
              >
                Delete Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
