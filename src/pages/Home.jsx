import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ListCard from '../components/ListCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import CurrencySelector from '../components/CurrencySelector';
import LanguageSelector from '../components/LanguageSelector'; // Importante
import useStore from '../store/useStore';
import { useTranslation } from 'react-i18next';

const Home = ({ onListSelect }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { lists, createList } = useStore();
  const { t } = useTranslation();

  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName('');
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Header Sticky Glassmorphism */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:h-20 gap-3 sm:gap-0">
            {/* Logo y Contador */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                {t('shoppingLists')}
              </h1>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                {lists.length}
              </span>
            </div>
            
            {/* Controles */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <LanguageSelector />
              <CurrencySelector />
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('newList')}</span>
                <span className="sm:hidden">{t('createList')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda Responsiva */}
      {lists.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar listas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>
      )}

      {/* Grid de Listas Responsivo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredLists.length === 0 ? (
          lists.length === 0 ? (
            <EmptyState
              type="lists"
              onAction={() => setIsCreateModalOpen(true)}
              actionText={t('newList')}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500">No se encontraron listas</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onClick={() => onListSelect(list.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear Lista */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewListName('');
        }}
        title={t('newList')}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nombre de la lista
            </label>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
              placeholder="ej. Supermercado Semanal"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl">{t('cancel')}</button>
            <button onClick={handleCreateList} disabled={!newListName.trim()} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50">{t('createList')}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;