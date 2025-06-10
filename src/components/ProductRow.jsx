import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Check } from 'lucide-react';
import useStore from '../store/useStore';

const ProductRow = ({ product, listId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    quantity: product.quantity.toString(),
    price: product.price.toString()
  });
  const { updateProduct, deleteProduct, formatCurrency } = useStore();
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const quantity = parseFloat(editData.quantity) || 1;
    const price = parseFloat(editData.price) || 0;
    const name = editData.name.trim() || 'Unnamed Item';

    updateProduct(listId, product.id, {
      name,
      quantity,
      price
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: product.name,
      quantity: product.quantity.toString(),
      price: product.price.toString()
    });
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const togglePurchased = () => {
    updateProduct(listId, product.id, { purchased: !product.purchased });
  };

  const handleDelete = () => {
    if (window.confirm('Delete this item?')) {
      deleteProduct(listId, product.id);
    }
  };

  const formatPriceInput = (value) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <input
              ref={nameInputRef}
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Product name"
            />
          </div>
          <div>
            <input
              type="number"
              value={editData.quantity}
              onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Qty"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <input
              type="text"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: formatPriceInput(e.target.value) })}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Price"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-3">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white rounded-lg p-4 transition-all duration-200 hover:shadow-sm border border-gray-100 ${product.purchased ? 'opacity-60' : ''}`}>
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePurchased}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            product.purchased 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {product.purchased && <Check className="w-4 h-4" />}
        </button>

        <div 
          className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <div className="md:col-span-2">
            <span className={`text-gray-900 ${product.purchased ? 'line-through' : ''}`}>
              {product.name}
            </span>
          </div>
          <div>
            <span className="text-gray-600 text-sm">
              Qty: {product.quantity}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-medium">
              {formatCurrency(product.price * product.quantity)}
            </span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductRow;