import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';

const EmptyState = ({ type = 'lists', onAction, actionText = 'Create your first list' }) => {
  const content = {
    lists: {
      icon: ShoppingCart,
      title: 'No shopping lists yet',
      description: 'Create your first shopping list to get started organizing your purchases.',
      illustration: '🛒'
    },
    products: {
      icon: Plus,
      title: 'No items in this list',
      description: 'Add your first product to start building your shopping list.',
      illustration: '📝'
    }
  };

  const config = content[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">{config.illustration}</span>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-500 mb-8 max-w-md">
        {config.description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Icon className="w-5 h-5" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;