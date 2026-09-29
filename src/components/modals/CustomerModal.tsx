import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { Customer } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customerToEdit
}) => {
  const { addCustomer, updateCustomer } = useSteelERP();

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [customerType, setCustomerType] = useState('Structural Fabricator');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name);
      setContactPerson(customerToEdit.contactPerson);
      setPhone(customerToEdit.phone);
      setEmail(customerToEdit.email);
      setAddress(customerToEdit.address);
      setCity(customerToEdit.city);
      setCustomerType(customerToEdit.customerType);
      setNotes(customerToEdit.notes);
    } else {
      setName('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setAddress('');
      setCity('');
      setCustomerType('Structural Fabricator');
      setNotes('');
    }
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      customerType,
      notes: notes.trim()
    };

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, payload);
    } else {
      addCustomer(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {customerToEdit ? 'Edit Customer' : 'Add New Customer'}
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
            <label className="block font-medium text-slate-700 mb-1">
              Customer Name / Company Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Structural Fabrication Ltd"
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
                placeholder="e.g. Robert Miller"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Customer Type</label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="Structural Fabricator">Structural Fabricator</option>
                <option value="Automotive OEM">Automotive OEM</option>
                <option value="Infrastructure Contractor">Infrastructure Contractor</option>
                <option value="Heavy Engineering">Heavy Engineering</option>
                <option value="Steel Distributor">Steel Distributor</option>
                <option value="General Industrial">General Industrial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@customer.com"
                  className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 8800 Industrial Parkway"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">City / State</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Detroit, MI"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Operational Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Requires Mill Test Certificates (MTR) with every shipment. Pre-approved for net-30 terms."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
              {customerToEdit ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
