import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ListCard from '../components/ListCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import CurrencySelector from '../components/CurrencySelector';
import useStore from '../store/useStore';

const Home = ({ onListSelect }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { lists, createList } = useStore();

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {lists.length} list{lists.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <CurrencySelector />
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {lists.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredLists.length === 0 ? (
          lists.length === 0 ? (
            <EmptyState
              type="lists"
              onAction={() => setIsCreateModalOpen(true)}
              actionText="Create your first list"
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No lists found matching "{searchTerm}"</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Create List Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewListName('');
        }}
        title="Create New Shopping List"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-2">
              List Name
            </label>
            <input
              id="listName"
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Weekly Groceries"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewListName('');
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateList}
              disabled={!newListName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create List
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;