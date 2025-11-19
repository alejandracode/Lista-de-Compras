import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Check, Edit2 } from 'lucide-react';
import useStore from '../store/useStore';

const ProductRow = ({ product, listId }) => {
  const [isEditing, setIsEditing] = useState(false);
  // IMPORTANTE: Inicializamos el precio con toFixed(2) para que empiece como "0.00"
  const [editData, setEditData] = useState({
    name: product.name,
    quantity: product.quantity,
    price: (product.price || 0).toFixed(2) 
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
    const name = editData.name.trim() || 'Item sin nombre';

    updateProduct(listId, product.id, { name, quantity, price });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: product.name,
      quantity: product.quantity,
      price: (product.price || 0).toFixed(2)
    });
    setIsEditing(false);
  };

  // --- LÓGICA DEL PUNTO AUTOMÁTICO ---
  const handlePriceChange = (e) => {
    // 1. Quitar todo lo que no sea números
    const rawValue = e.target.value.replace(/\D/g, '');
    // 2. Convertir a entero
    const intValue = parseInt(rawValue || '0', 10);
    // 3. Dividir entre 100 para poner el punto
    const amount = intValue / 100;
    // 4. Guardar como string con 2 decimales
    setEditData({ ...editData, price: amount.toFixed(2) });
  };

  const togglePurchased = (e) => {
    e.stopPropagation(); 
    updateProduct(listId, product.id, { purchased: !product.purchased });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('¿Borrar este producto?')) {
      deleteProduct(listId, product.id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white/90 backdrop-blur-md border-2 border-blue-300 rounded-2xl p-4 shadow-lg transition-all scale-[1.02] mb-3">
        <div className="space-y-3">
          <input
            ref={nameInputRef}
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full text-lg font-bold text-slate-800 bg-transparent border-b-2 border-blue-200 focus:border-blue-500 outline-none placeholder-slate-300"
            placeholder="Nombre del producto"
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <label className="block text-xs font-bold text-slate-400 uppercase">Cant.</label>
              <input
                type="number"
                value={editData.quantity}
                onChange={(e) => setEditData({ ...editData, quantity: parseFloat(e.target.value) })}
                className="w-full bg-transparent font-semibold text-slate-700 outline-none"
              />
            </div>
            
            <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <label className="block text-xs font-bold text-slate-400 uppercase">Precio</label>
              <input
                type="tel" // Teclado numérico en móvil
                inputMode="numeric"
                value={editData.price}
                onChange={handlePriceChange} // <--- Aquí usamos la función mágica
                className="w-full bg-transparent font-semibold text-slate-700 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleCancel} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative flex items-center p-4 bg-white/70 backdrop-blur-sm border border-white/50 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:bg-white/90 ${
        product.purchased ? 'opacity-75 bg-slate-50/50' : ''
      }`}
    >
      <button
        onClick={togglePurchased}
        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 mr-4 ${
          product.purchased 
            ? 'bg-green-500 border-green-500 scale-110 shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
            : 'border-slate-300 hover:border-blue-400 bg-white'
        }`}
      >
        <Check className={`w-5 h-5 text-white transition-transform duration-300 ${product.purchased ? 'scale-100' : 'scale-0'}`} strokeWidth={3} />
      </button>

      <div 
        className="flex-1 cursor-pointer min-w-0"
        onClick={() => setIsEditing(true)}
      >
        <div className="flex justify-between items-start">
          <div className="pr-2">
            <h4 className={`text-lg font-bold text-slate-800 leading-tight transition-all ${product.purchased ? 'line-through text-slate-400 decoration-2 decoration-slate-300' : ''}`}>
              {product.name}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-sm font-medium text-slate-500">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">
                x{product.quantity}
              </span>
              {product.price > 0 && (
                <span className="text-slate-400">
                   a {formatCurrency(product.price)} c/u
                </span>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0 pl-2">
            <span className={`block text-xl font-extrabold tracking-tight ${product.purchased ? 'text-slate-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600'}`}>
              {formatCurrency(product.price * product.quantity)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0 bg-white/90 backdrop-blur p-1 rounded-lg shadow-lg border border-slate-100 sm:flex-row sm:static sm:bg-transparent sm:shadow-none sm:border-none sm:translate-y-0 sm:opacity-0 sm:group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Editar"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductRow;