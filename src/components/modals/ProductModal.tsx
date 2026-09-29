import React, { useState, useEffect } from 'react';
import { X, Layers, Plus } from 'lucide-react';
import { SteelProduct } from '../../types';
import { useSteelERP } from '../../context/SteelERPContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: SteelProduct | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit
}) => {
  const {
    addProduct,
    updateProduct,
    productTypes,
    addProductType,
    suppliers
  } = useSteelERP();

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [productType, setProductType] = useState('Steel Plates');
  const [newTypeInput, setNewTypeInput] = useState('');
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [grade, setGrade] = useState('ASTM A36');
  const [specification, setSpecification] = useState('Hot Rolled, Mill Edge');
  const [dimensions, setDimensions] = useState('2400 x 6000 mm');
  const [thickness, setThickness] = useState('12.0 mm');
  const [width, setWidth] = useState('2400 mm');
  const [length, setLength] = useState('6000 mm');
  const [unit, setUnit] = useState('Tons');
  const [weight, setWeight] = useState('1.36');
  const [price, setPrice] = useState('840');
  const [currentStock, setCurrentStock] = useState('50');
  const [minStockLevel, setMinStockLevel] = useState('20');
  const [supplier, setSupplier] = useState(suppliers[0]?.companyName || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setSku(productToEdit.sku);
      setName(productToEdit.name);
      setProductType(productToEdit.productType);
      setGrade(productToEdit.grade);
      setSpecification(productToEdit.specification);
      setDimensions(productToEdit.dimensions);
      setThickness(productToEdit.thickness);
      setWidth(productToEdit.width);
      setLength(productToEdit.length);
      setUnit(productToEdit.unit);
      setWeight(String(productToEdit.weight));
      setPrice(String(productToEdit.price));
      setCurrentStock(String(productToEdit.currentStock));
      setMinStockLevel(String(productToEdit.minStockLevel));
      setSupplier(productToEdit.supplier);
      setNotes(productToEdit.notes);
    } else {
      const randomSku = 'STL-' + Math.floor(1000 + Math.random() * 9000);
      setSku(randomSku);
      setName('');
      setProductType(productTypes[0] || 'Steel Plates');
      setGrade('ASTM A36');
      setSpecification('Hot Rolled');
      setDimensions('2000 x 6000 mm');
      setThickness('10.0 mm');
      setWidth('2000 mm');
      setLength('6000 mm');
      setUnit('Tons');
      setWeight('1.0');
      setPrice('850');
      setCurrentStock('25');
      setMinStockLevel('15');
      setSupplier(suppliers[0]?.companyName || 'Midwest Metallurgical Smelters');
      setNotes('');
    }
  }, [productToEdit, isOpen, productTypes, suppliers]);

  if (!isOpen) return null;

  const handleAddNewType = () => {
    if (newTypeInput.trim()) {
      addProductType(newTypeInput.trim());
      setProductType(newTypeInput.trim());
      setNewTypeInput('');
      setIsAddingNewType(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const payload = {
      sku: sku.trim(),
      name: name.trim(),
      productType,
      grade: grade.trim(),
      specification: specification.trim(),
      dimensions: dimensions.trim(),
      thickness: thickness.trim(),
      width: width.trim(),
      length: length.trim(),
      unit,
      weight: Number(weight) || 0,
      price: Number(price) || 0,
      currentStock: Number(currentStock) || 0,
      minStockLevel: Number(minStockLevel) || 0,
      supplier: supplier.trim(),
      notes: notes.trim()
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {productToEdit ? 'Edit Steel Product' : 'Add Steel Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">SKU *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. PLT-A36-12X2400"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Heavy Structural Steel Plate 12mm"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-700">Steel Product Type *</label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewType(!isAddingNewType)}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  {isAddingNewType ? 'Cancel' : '+ New Type'}
                </button>
              </div>

              {!isAddingNewType ? (
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {productTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newTypeInput}
                    onChange={(e) => setNewTypeInput(e.target.value)}
                    placeholder="Enter type name"
                    className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewType}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Steel Grade *</label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. ASTM A36, AISI 304, S355JR"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Specification</label>
              <input
                type="text"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                placeholder="e.g. Hot Rolled, Cold Rolled, Galvanized"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Dimensions</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 2400 x 6000 mm"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Thickness</label>
              <input
                type="text"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                placeholder="e.g. 12.0 mm"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Width</label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g. 2400 mm"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Length</label>
              <input
                type="text"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 6000 mm"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Unit of Measurement</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="Tons">Tons (MT)</option>
                <option value="Pieces">Pieces</option>
                <option value="Meters">Meters</option>
                <option value="Bundles">Bundles</option>
                <option value="Sheets">Sheets</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Weight (MT or kg)</label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="1.36"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Price per Unit ($) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="840"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Supplier</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Midwest Metallurgical"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Current Stock ({unit}) *</label>
              <input
                type="number"
                required
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono tabular-nums bg-white"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Minimum Stock Level ({unit})</label>
              <input
                type="number"
                min="0"
                value={minStockLevel}
                onChange={(e) => setMinStockLevel(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 font-mono tabular-nums bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Material / Product Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Standard building construction plate. Low carbon with excellent weldability."
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
              {productToEdit ? 'Save Changes' : 'Add Steel Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
