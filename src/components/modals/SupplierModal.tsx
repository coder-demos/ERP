import React, { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';
import { Supplier } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierToEdit?: Supplier | null;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  supplierToEdit
}) => {
  const { addSupplier, updateSupplier } = useSteelERP();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [materialsSupplied, setMaterialsSupplied] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (supplierToEdit) {
      setCompanyName(supplierToEdit.companyName);
      setContactPerson(supplierToEdit.contactPerson);
      setPhone(supplierToEdit.phone);
      setEmail(supplierToEdit.email);
      setAddress(supplierToEdit.address);
      setMaterialsSupplied(supplierToEdit.materialsSupplied);
      setNotes(supplierToEdit.notes);
    } else {
      setCompanyName('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setAddress('');
      setMaterialsSupplied('Continuous Cast Billets, Heavy Slabs');
      setNotes('');
    }
  }, [supplierToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    const payload = {
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      materialsSupplied: materialsSupplied.trim(),
      notes: notes.trim()
    };

    if (supplierToEdit) {
      updateSupplier(supplierToEdit.id, payload);
    } else {
      addSupplier(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}
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
            <label className="block font-medium text-slate-700 mb-1">Supplier Company Name *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Global Ore & Minerals Mining Corp"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. David Chen"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 301-8842"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supplier@company.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Facility / Yard Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 100 Mining Exchange Blvd, Duluth, MN"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Materials Supplied</label>
            <input
              type="text"
              value={materialsSupplied}
              onChange={(e) => setMaterialsSupplied(e.target.value)}
              placeholder="e.g. Continuous Cast Billets, Heavy Slabs, Pig Iron"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Supplier Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dedicated rail car delivery to our mill spur. Lead time 5 business days."
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
              {supplierToEdit ? 'Save Changes' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
