import React, { useState, useEffect } from 'react';
import { X, FileText, Plus, Trash2 } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderToEdit?: Order | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  orderToEdit
}) => {
  const { addOrder, updateOrder, customers, products } = useSteelERP();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [customerName, setCustomerName] = useState(customers[0]?.name || '');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState('20');
  const [unitPrice, setUnitPrice] = useState(String(products[0]?.price || 840));
  const [deliveryAddress, setDeliveryAddress] = useState(customers[0]?.address || '');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [carrierInfo, setCarrierInfo] = useState('Standard Freight Truck Delivery');
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (orderToEdit) {
      setCustomerId(orderToEdit.customerId);
      setCustomerName(orderToEdit.customerName);
      setOrderDate(orderToEdit.orderDate);
      const firstItem = orderToEdit.items[0];
      if (firstItem) {
        setSelectedProductId(firstItem.productId);
        setQuantity(String(firstItem.quantity));
        setUnitPrice(String(firstItem.unitPrice));
      }
      setDeliveryAddress(orderToEdit.deliveryAddress);
      setDeliveryDate(orderToEdit.deliveryDate);
      setCarrierInfo(orderToEdit.carrierInfo);
      setStatus(orderToEdit.status);
      setNotes(orderToEdit.notes);
    } else {
      if (customers.length > 0) {
        setCustomerId(customers[0].id);
        setCustomerName(customers[0].name);
        setDeliveryAddress(customers[0].address + ', ' + customers[0].city);
      }
      if (products.length > 0) {
        setSelectedProductId(products[0].id);
        setUnitPrice(String(products[0].price));
      }
      setQuantity('20');
      setOrderDate(new Date().toISOString().split('T')[0]);
      setDeliveryDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setCarrierInfo('Flatbed Heavy Carrier');
      setStatus('Pending');
      setNotes('');
    }
  }, [orderToEdit, isOpen, customers, products]);

  if (!isOpen) return null;

  const handleCustomerChange = (cId: string) => {
    setCustomerId(cId);
    const c = customers.find((cust) => cust.id === cId);
    if (c) {
      setCustomerName(c.name);
      setDeliveryAddress(c.address + ', ' + c.city);
    }
  };

  const handleProductChange = (pId: string) => {
    setSelectedProductId(pId);
    const p = products.find((prod) => prod.id === pId);
    if (p) {
      setUnitPrice(String(p.price));
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const numQty = Number(quantity) || 0;
  const numPrice = Number(unitPrice) || 0;
  const totalAmount = Math.round(numQty * numPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !selectedProduct) return;

    const orderItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      grade: selectedProduct.grade,
      quantity: numQty,
      unit: selectedProduct.unit,
      unitPrice: numPrice,
      total: totalAmount
    };

    const payload = {
      customerId,
      customerName,
      orderDate,
      items: [orderItem],
      primarySku: selectedProduct.sku,
      totalQuantity: numQty,
      totalAmount,
      deliveryAddress,
      deliveryDate,
      carrierInfo,
      status,
      notes: notes.trim()
    };

    if (orderToEdit) {
      updateOrder(orderToEdit.id, payload);
    } else {
      addOrder(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {orderToEdit ? `Edit Order (${orderToEdit.orderNumber})` : 'Create Sales Order'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Customer / Company *</label>
              <select
                value={customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Order Date</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-3">
            <span className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider block">
              Ordered Steel Material
            </span>

            <div>
              <label className="block text-slate-600 mb-1">Select Product *</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.sku} ({p.currentStock} {p.unit} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-600 mb-1">Quantity ({selectedProduct?.unit || 'Tons'})</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-slate-900 font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-slate-900 font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Total Amount ($)</label>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono font-bold text-blue-600 tabular-nums">
                  ${totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. 8800 Industrial Pkwy, Detroit, MI"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Dispatch Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Carrier / Logistics</label>
              <input
                type="text"
                value={carrierInfo}
                onChange={(e) => setCarrierInfo(e.target.value)}
                placeholder="e.g. Norfolk Southern Rail Freight"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing / In Staging</option>
                <option value="Completed">Completed / Dispatched</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Order Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Include signed Mill Test Certificates MTR with delivery slip."
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
              {orderToEdit ? 'Save Changes' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
