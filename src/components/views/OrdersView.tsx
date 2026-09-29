import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface OrdersViewProps {
  onOpenAddModal: () => void;
  onEditOrder: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  onOpenAddModal,
  onEditOrder
}) => {
  const {
    orders,
    deleteOrder,
    updateOrderStatus,
    companyProfile,
    searchQuery
  } = useSteelERP();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchNum = o.orderNumber.toLowerCase().includes(q);
        const matchCust = o.customerName.toLowerCase().includes(q);
        const matchSku = o.primarySku.toLowerCase().includes(q);
        const matchAddr = o.deliveryAddress.toLowerCase().includes(q);
        if (!matchNum && !matchCust && !matchSku && !matchAddr) return false;
      }
      if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
      return true;
    });
  }, [orders, searchQuery, selectedStatus]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Processing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const totalSalesRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Steel Sales Orders & Dispatch
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer purchasing orders, carrier truck dispatches, and delivery fulfillment
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Sales Order</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Booked Sales Orders</span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            ${totalSalesRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active pipeline + delivered</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Pending & In Staging</span>
          <div className="text-xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length} Orders
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting crane load / dispatch</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Completed & Shipped</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {orders.filter((o) => o.status === 'Completed').length} Orders
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Delivered with MTR documents</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {['all', 'Pending', 'Processing', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-mono text-xs">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Primary Product / SKU</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4">Delivery Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.map((ord) => {
                const firstItem = ord.items[0];
                return (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <button
                        onClick={() => setSelectedOrderDetails(ord)}
                        className="hover:text-blue-600 text-left block truncate max-w-xs"
                      >
                        {ord.customerName}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block truncate max-w-xs">
                        {firstItem ? firstItem.productName : 'Steel Order'}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {ord.primarySku}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {ord.totalQuantity} {firstItem ? firstItem.unit : 'Tons'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-blue-700">
                      ${ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{ord.deliveryDate}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="rounded p-1 text-slate-400 hover:text-blue-600"
                          title="View Dispatch Slip"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditOrder(ord)}
                          className="rounded p-1 text-slate-400 hover:text-slate-700"
                          title="Edit Order"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(ord.id)}
                          className="rounded p-1 text-slate-400 hover:text-red-600"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No orders match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Slip / Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-blue-600 font-bold text-xs">
                  Sales Order #{selectedOrderDetails.orderNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedOrderDetails.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Order Date</span>
                <span className="font-bold text-slate-900">{selectedOrderDetails.orderDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Target Dispatch</span>
                <span className="font-bold text-blue-600">{selectedOrderDetails.deliveryDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Total Invoice Value</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${selectedOrderDetails.totalAmount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Fulfillment Status</span>
                <span className="font-bold text-slate-800">{selectedOrderDetails.status}</span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Ordered Steel Materials
              </span>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-2">Product</th>
                      <th className="p-2">SKU</th>
                      <th className="p-2 text-right">Qty</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedOrderDetails.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-sans font-medium text-slate-800">{item.productName}</td>
                        <td className="p-2 text-slate-500">{item.sku}</td>
                        <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                        <td className="p-2 text-right">${item.unitPrice}</td>
                        <td className="p-2 text-right font-bold text-slate-900">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-1">
              <span className="font-semibold text-slate-700 block">Shipping & Logistics</span>
              <p className="text-slate-900">Destination: {selectedOrderDetails.deliveryAddress}</p>
              <p className="text-slate-500 text-[11px]">Carrier: {selectedOrderDetails.carrierInfo}</p>
            </div>

            {/* Status Advance */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-semibold text-slate-700">Update Status:</span>
              <div className="flex gap-1.5">
                {(['Pending', 'Processing', 'Completed', 'Cancelled'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrderDetails.id, st);
                      setSelectedOrderDetails({ ...selectedOrderDetails, status: st });
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      selectedOrderDetails.status === st
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedOrderDetails(null)}
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
            <h3 className="text-sm font-bold text-slate-900">Delete Sales Order</h3>
            <p className="text-slate-600">
              Are you sure you want to delete this sales order record?
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
                  deleteOrder(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
