import React, { useState } from 'react';
import { ArrowLeft, Plus, Filter, Eye, EyeOff } from 'lucide-react';
import ProductRow from '../components/ProductRow';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import useStore from '../store/useStore';

const ListView = ({ listId, onBack }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '1',
    price: '0'
  });

  const { getCurrentList, addProduct, formatCurrency, getListTotal } = useStore();
  const list = getCurrentList();

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">List not found</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const total = getListTotal(listId);
  const displayedProducts = showOnlyMissing 
    ? list.products.filter(product => !product.purchased)
    : list.products;

  const handleAddProduct = () => {
    if (newProduct.name.trim()) {
      addProduct(listId, {
        name: newProduct.name.trim(),
        quantity: parseFloat(newProduct.quantity) || 1,
        price: parseFloat(newProduct.price) || 0
      });
      setNewProduct({ name: '', quantity: '1', price: '0' });
      setIsAddModalOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddProduct();
    }
  };

  const formatPriceInput = (value) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  const completedCount = list.products.filter(p => p.purchased).length;
  const totalCount = list.products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{list.name}</h1>
                <p className="text-sm text-gray-500">
                  {completedCount} of {totalCount} items completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {list.products.length > 0 && (
                <button
                  onClick={() => setShowOnlyMissing(!showOnlyMissing)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    showOnlyMissing 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {showOnlyMissing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-sm">
                    {showOnlyMissing ? 'Show All' : 'Missing Only'}
                  </span>
                </button>
              )}
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-700">Total (remaining items)</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
          
          {totalCount > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{Math.round((completedCount / totalCount) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {displayedProducts.length === 0 ? (
          list.products.length === 0 ? (
            <EmptyState
              type="products"
              onAction={() => setIsAddModalOpen(true)}
              actionText="Add your first item"
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">All items completed! 🎉</p>
              <button
                onClick={() => setShowOnlyMissing(false)}
                className="mt-4 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Show all items
              </button>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {displayedProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                listId={listId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewProduct({ name: '', quantity: '1', price: '0' });
        }}
        title="Add New Item"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Milk, Bread, Apples"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                onKeyPress={handleKeyPress}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                id="price"
                type="text"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: formatPriceInput(e.target.value) })}
                onKeyPress={handleKeyPress}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                setNewProduct({ name: '', quantity: '1', price: '0' });
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProduct}
              disabled={!newProduct.name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListView;