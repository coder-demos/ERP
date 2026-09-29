import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  X,
  Building2
} from 'lucide-react';
import { Customer } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface CustomersViewProps {
  onOpenAddModal: () => void;
  onEditCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onOpenAddModal,
  onEditCustomer
}) => {
  const { customers, deleteCustomer, searchQuery } = useSteelERP();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<Customer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchContact = c.contactPerson.toLowerCase().includes(q);
        const matchCity = c.city.toLowerCase().includes(q);
        const matchCode = c.customerCode.toLowerCase().includes(q);
        const matchType = c.customerType.toLowerCase().includes(q);
        if (!matchName && !matchContact && !matchCity && !matchCode && !matchType) return false;
      }
      if (selectedType !== 'all' && c.customerType !== selectedType) return false;
      return true;
    });
  }, [customers, searchQuery, selectedType]);

  const customerTypes = Array.from(new Set(customers.map((c) => c.customerType)));

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Steel Customers & Industrial Accounts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage purchasing clients, structural fabricators, automotive OEMs, and regional steel distributors
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Customer Type:
            </span>
            <button
              onClick={() => setSelectedType('all')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Types
            </button>
            {customerTypes.map((t) => (
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
            Showing {filteredCustomers.length} of {customers.length} accounts
          </div>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Customer / Company Name</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {cust.customerCode}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedCustomerDetails(cust)}
                      className="font-semibold text-slate-900 hover:text-blue-600 text-left block truncate max-w-xs"
                    >
                      {cust.name}
                    </button>
                    <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                      {cust.address}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {cust.contactPerson || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                      {cust.customerType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {cust.phone || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">
                    {cust.email || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{cust.city || '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedCustomerDetails(cust)}
                        className="rounded p-1 text-slate-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditCustomer(cust)}
                        className="rounded p-1 text-slate-400 hover:text-slate-700"
                        title="Edit Customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(cust.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No customers match the current filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Customer Details Modal */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-blue-600 font-bold text-xs">
                  {selectedCustomerDetails.customerCode}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedCustomerDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCustomerDetails(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Contact Person</span>
                <p className="font-medium text-slate-900 mt-0.5">{selectedCustomerDetails.contactPerson || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Customer Type</span>
                <p className="font-medium text-blue-700 mt-0.5">{selectedCustomerDetails.customerType}</p>
              </div>
            </div>

            <div className="space-y-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-mono">{selectedCustomerDetails.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{selectedCustomerDetails.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{selectedCustomerDetails.address}, {selectedCustomerDetails.city}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Account & Operational Notes
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedCustomerDetails.notes || 'No specific notes logged.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedCustomerDetails(null)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = selectedCustomerDetails;
                  setSelectedCustomerDetails(null);
                  onEditCustomer(target);
                }}
                className="rounded-lg bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Delete Customer Record</h3>
            <p className="text-slate-600">
              Are you sure you want to remove this customer account? This will permanently delete their record.
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
                  deleteCustomer(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
