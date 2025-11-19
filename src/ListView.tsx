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
    if (window.confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
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
      className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 cursor-pointer border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300 ease-out"
      onClick={onClick}
    >
      {/* Decoración superior con degradado */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-inner group-hover:from-blue-100 group-hover:to-blue-200 transition-colors flex-shrink-0">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          
          {isEditing ? (
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg font-bold text-slate-800 bg-transparent border-b-2 border-blue-400 focus:border-blue-600 outline-none px-1 w-full"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <button 
                onClick={(e) => {e.stopPropagation(); handleSave();}}
                className="p-1 hover:bg-green-100 rounded text-green-600"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {e.stopPropagation(); handleCancel();}}
                className="p-1 hover:bg-red-100 rounded text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h3 className="text-lg font-bold text-slate-800 truncate tracking-tight">
              {list.name}
            </h3>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Estimado</span>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>
        
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{itemCount} items</span>
            <span className={purchasedCount === itemCount && itemCount > 0 ? "text-green-600" : "text-blue-600"}>
              {itemCount > 0 ? Math.round((purchasedCount / itemCount) * 100) : 0}% Completado
            </span>
          </div>
          
          {/* Barra de progreso mejorada */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.4)] ${
                purchasedCount === itemCount && itemCount > 0 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-r from-blue-400 to-indigo-500'
              }`}
              style={{ width: `${itemCount > 0 ? (purchasedCount / itemCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;