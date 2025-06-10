import React, { useState } from 'react';
import { ShoppingCart, Edit2, Trash2, Check, X } from 'lucide-react';
import useStore from '../store/useStore';

const ListCard = ({ list, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(list.name);
  const { deleteList, updateListName, formatCurrency, getListTotal } = useStore();

  const total = getListTotal(list.id);
  const itemCount = list.products.length;
  const purchasedCount = list.products.filter(p => p.purchased).length;

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editName.trim()) {
      updateListName(list.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(list.name);
    setIsEditing(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this list?')) {
      deleteList(list.id);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200 group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none px-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {list.name}
            </h3>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-xl font-bold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
          {purchasedCount > 0 && (
            <span className="text-green-600 font-medium">
              {purchasedCount} completed
            </span>
          )}
        </div>
        
        {itemCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(purchasedCount / itemCount) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListCard;