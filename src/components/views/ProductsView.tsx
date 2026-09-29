import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Sliders,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { SteelProduct } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface ProductsViewProps {
  onOpenAddModal: () => void;
  onEditProduct: (product: SteelProduct) => void;
  onOpenStockAdjust: (product: SteelProduct) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onOpenAddModal,
  onEditProduct,
  onOpenStockAdjust
}) => {
  const {
    products,
    deleteProduct,
    productTypes,
    addProductType,
    deleteProductType,
    searchQuery
  } = useSteelERP();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState<SteelProduct | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Type manager drawer/modal toggle
  const [isManagingTypes, setIsManagingTypes] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchGrade = p.grade.toLowerCase().includes(q);
        const matchSpec = p.specification.toLowerCase().includes(q);
        const matchType = p.productType.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchGrade && !matchSpec && !matchType) return false;
      }
      if (selectedType !== 'all' && p.productType !== selectedType) return false;
      return true;
    });
  }, [products, searchQuery, selectedType]);

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName.trim()) {
      addProductType(newTypeName.trim());
      setNewTypeName('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Steel Product & Material Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain technical metallurgical specs, grades, dimensions, weights, pricing, and stock limits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManagingTypes(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span>Manage Product Types</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Steel Product</span>
          </button>
        </div>
      </div>

      {/* Product Type Filter Tabs */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Steel Type:
            </span>
            <button
              onClick={() => setSelectedType('all')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Types ({products.length})
            </button>
            {productTypes.map((t) => {
              const count = products.filter((p) => p.productType === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                    selectedType === t
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>

          <div className="text-slate-500 font-mono text-xs">
            Showing {filteredProducts.length} items
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Steel Grade</th>
                <th className="py-3 px-4">Dimensions / Thick</th>
                <th className="py-3 px-4 text-right">Price / Unit</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => {
                const isLow = p.currentStock <= p.minStockLevel && p.currentStock > 0;
                const isOut = p.currentStock === 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {p.sku}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedProductDetails(p)}
                        className="font-semibold text-slate-900 hover:text-blue-600 text-left block truncate max-w-xs"
                      >
                        {p.name}
                      </button>
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                        {p.specification}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.productType}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-800 font-mono px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-200">
                        {p.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div>{p.dimensions}</div>
                      <span className="text-slate-400 text-[10px]">T: {p.thickness}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      ${p.price.toLocaleString()} / {p.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-900'}>
                        {p.currentStock.toLocaleString()} {p.unit}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Min: {p.minStockLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isOut
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isLow
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedProductDetails(p)}
                          className="rounded p-1 text-slate-400 hover:text-blue-600"
                          title="View Technical Specs"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenStockAdjust(p)}
                          className="rounded p-1 text-slate-400 hover:text-emerald-600"
                          title="Adjust Stock"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditProduct(p)}
                          className="rounded p-1 text-slate-400 hover:text-slate-700"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="rounded p-1 text-slate-400 hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                    No steel products found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-blue-600 font-bold text-xs">
                  {selectedProductDetails.sku} · {selectedProductDetails.productType}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedProductDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Steel Grade</span>
                <span className="font-bold text-slate-900">{selectedProductDetails.grade}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Thickness</span>
                <span className="font-bold text-slate-900">{selectedProductDetails.thickness}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Dimensions</span>
                <span className="font-bold text-slate-900">{selectedProductDetails.dimensions}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Unit Weight</span>
                <span className="font-bold text-slate-900">{selectedProductDetails.weight} MT</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Price / {selectedProductDetails.unit}</span>
                <span className="font-bold text-emerald-600">${selectedProductDetails.price}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Current Stock</span>
                <span className="font-bold text-blue-600">{selectedProductDetails.currentStock} {selectedProductDetails.unit}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Min Stock Level</span>
                <span className="font-bold text-slate-900">{selectedProductDetails.minStockLevel} {selectedProductDetails.unit}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Supplier</span>
                <span className="font-bold text-slate-900 truncate block">{selectedProductDetails.supplier}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Specification Details
              </span>
              <p className="text-slate-800 font-medium">
                {selectedProductDetails.specification}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold mb-1">
                Technical Notes & Application
              </span>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedProductDetails.notes || 'No specific technical notes logged.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = selectedProductDetails;
                  setSelectedProductDetails(null);
                  onEditProduct(target);
                }}
                className="rounded-lg bg-blue-600 px-4 py-1.5 font-semibold text-white hover:bg-blue-700"
              >
                Edit Product Specs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Product Types Modal */}
      {isManagingTypes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Customizable Steel Product Types
                </h3>
              </div>
              <button
                onClick={() => setIsManagingTypes(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-slate-500 text-[11px]">
              Add or remove steel product categories manufactured or stocked by your company.
            </p>

            {/* Add new type form */}
            <form onSubmit={handleAddType} className="flex gap-2">
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g. Steel Angles or Galvanized C-Channels"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </button>
            </form>

            <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-lg border border-slate-200 p-2">
              {productTypes.map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100"
                >
                  <span className="font-medium text-slate-800">{t}</span>
                  <button
                    onClick={() => deleteProductType(t)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete Type"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsManagingTypes(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-2xl text-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Delete Product Record</h3>
            <p className="text-slate-600">
              Are you sure you want to remove this steel product SKU from the catalog?
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
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
