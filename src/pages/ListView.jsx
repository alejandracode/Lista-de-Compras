import React, { useState } from 'react';
import { ArrowLeft, Plus, Eye, EyeOff, Share2 } from 'lucide-react';
import ProductRow from '../components/ProductRow';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import useStore from '../store/useStore';

const ListView = ({ listId, onBack }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  // Estado inicial con precio '0.00'
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '1', price: '0.00' });

  const { getCurrentList, addProduct, formatCurrency, getListTotal } = useStore();
  const list = getCurrentList();

  if (!list) return <div className="p-8 text-center">Lista no encontrada <button onClick={onBack} className="text-blue-600 underline">Volver</button></div>;

  const total = getListTotal(listId);
  const displayedProducts = showOnlyMissing ? list.products.filter(product => !product.purchased) : list.products;

  const handleAddProduct = () => {
    if (newProduct.name.trim()) {
      addProduct(listId, {
        name: newProduct.name.trim(),
        quantity: parseFloat(newProduct.quantity) || 1,
        price: parseFloat(newProduct.price) || 0
      });
      setNewProduct({ name: '', quantity: '1', price: '0.00' }); // Resetear a 0.00
      setIsAddModalOpen(false);
    }
  };

  // Lógica del punto automático para el modal de creación
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const intValue = parseInt(rawValue || '0', 10);
    const amount = intValue / 100;
    setNewProduct({ ...newProduct, price: amount.toFixed(2) });
  };

  const handleShare = () => {
    const header = `🛒 *${list.name}*`;
    const pending = list.products.filter(p => !p.purchased).map(p => `⬜ ${p.name} (x${p.quantity})`).join('\n');
    const done = list.products.filter(p => p.purchased).map(p => `✅ ${p.name}`).join('\n');
    const text = `${header}\n\n${pending ? '*Pendientes:*\n' + pending + '\n\n' : ''}${done ? '*Comprados:*\n' + done + '\n\n' : ''}Total: ${formatCurrency(total)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const completedCount = list.products.filter(p => p.purchased).length;

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3 overflow-hidden mr-2">
              <button onClick={onBack} className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl flex-shrink-0">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="overflow-hidden">
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 truncate">{list.name}</h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500">{completedCount}/{list.products.length} completados</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <button onClick={handleShare} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl"><Share2 className="w-5 h-5" /></button>
              {list.products.length > 0 && (
                <button onClick={() => setShowOnlyMissing(!showOnlyMissing)} className={`p-2 rounded-xl ${showOnlyMissing ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}>
                  {showOnlyMissing ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
              <button onClick={() => setIsAddModalOpen(true)} className="p-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 flex items-center">
                <Plus className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline font-bold">Añadir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-sm border border-white/50 flex justify-between items-center">
          <span className="text-slate-500 font-bold text-sm sm:text-base">Total Estimado</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {displayedProducts.length === 0 ? (
          list.products.length === 0 ? (
            <EmptyState type="products" onAction={() => setIsAddModalOpen(true)} actionText="Añadir producto" />
          ) : (
            <div className="text-center py-10 bg-white/40 rounded-2xl"><p className="text-slate-500 mb-2">¡Todo comprado! 🎉</p><button onClick={() => setShowOnlyMissing(false)} className="text-blue-600 font-bold underline">Ver todo</button></div>
          )
        ) : (
          <div className="space-y-3">
            {displayedProducts.map((product) => (
              <ProductRow key={product.id} product={product} listId={listId} />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nuevo Producto" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre del Producto</label>
            <input 
              type="text" 
              value={newProduct.name} 
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
              onKeyPress={(e) => e.key === 'Enter' && handleAddProduct()} 
              className="w-full px-4 py-3 text-lg font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none placeholder:text-slate-400" 
              autoFocus 
              placeholder="Ej. Leche, Pan..." 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cantidad</label>
              <input 
                type="number" 
                inputMode="numeric"
                value={newProduct.quantity} 
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} 
                className="w-full px-4 py-3 text-lg font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Precio</label>
              <div className="relative">
                <input 
                  type="tel"
                  inputMode="numeric"
                  value={newProduct.price} 
                  onChange={handlePriceChange} 
                  className="w-full px-4 py-3 text-lg font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
            <button onClick={handleAddProduct} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transform active:scale-95 transition-all disabled:opacity-50" disabled={!newProduct.name.trim()}>Guardar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListView;