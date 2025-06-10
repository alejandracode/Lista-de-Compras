import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      lists: [],
      currentListId: null,
      selectedCurrency: 'USD',
      selectedLocale: 'en-US',
      
      // Currency options
      currencies: [
        { code: 'USD', name: 'US Dollar', locale: 'en-US', symbol: '$' },
        { code: 'EUR', name: 'Euro', locale: 'de-DE', symbol: '€' },
        { code: 'GBP', name: 'British Pound', locale: 'en-GB', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', locale: 'ja-JP', symbol: '¥' },
        { code: 'MXN', name: 'Mexican Peso', locale: 'es-MX', symbol: '$' },
        { code: 'CAD', name: 'Canadian Dollar', locale: 'en-CA', symbol: 'C$' },
        { code: 'AUD', name: 'Australian Dollar', locale: 'en-AU', symbol: 'A$' },
        { code: 'CNY', name: 'Chinese Yuan', locale: 'zh-CN', symbol: '¥' },
        { code: 'INR', name: 'Indian Rupee', locale: 'en-IN', symbol: '₹' },
        { code: 'KRW', name: 'South Korean Won', locale: 'ko-KR', symbol: '₩' }
      ],

      // Actions
      createList: (name) => {
        const newList = {
          id: Date.now().toString(),
          name,
          products: [],
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          lists: [...state.lists, newList]
        }));
      },

      deleteList: (listId) => {
        set((state) => ({
          lists: state.lists.filter(list => list.id !== listId),
          currentListId: state.currentListId === listId ? null : state.currentListId
        }));
      },

      updateListName: (listId, newName) => {
        set((state) => ({
          lists: state.lists.map(list => 
            list.id === listId ? { ...list, name: newName } : list
          )
        }));
      },

      setCurrentList: (listId) => {
        set({ currentListId: listId });
      },

      addProduct: (listId, product) => {
        const newProduct = {
          id: Date.now().toString(),
          name: product.name,
          quantity: product.quantity || 1,
          price: product.price || 0,
          purchased: false,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { ...list, products: [...list.products, newProduct] }
              : list
          )
        }));
      },

      updateProduct: (listId, productId, updates) => {
        set((state) => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? {
                  ...list,
                  products: list.products.map(product => 
                    product.id === productId 
                      ? { ...product, ...updates }
                      : product
                  )
                }
              : list
          )
        }));
      },

      deleteProduct: (listId, productId) => {
        set((state) => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? {
                  ...list,
                  products: list.products.filter(product => product.id !== productId)
                }
              : list
          )
        }));
      },

      setCurrency: (currencyCode) => {
        const currency = get().currencies.find(c => c.code === currencyCode);
        if (currency) {
          set({
            selectedCurrency: currencyCode,
            selectedLocale: currency.locale
          });
        }
      },

      // Utility functions
      getCurrentList: () => {
        const state = get();
        return state.lists.find(list => list.id === state.currentListId);
      },

      formatCurrency: (amount) => {
        const state = get();
        return new Intl.NumberFormat(state.selectedLocale, {
          style: 'currency',
          currency: state.selectedCurrency,
          minimumFractionDigits: 2,
        }).format(amount);
      },

      getListTotal: (listId) => {
        const state = get();
        const list = state.lists.find(l => l.id === listId);
        if (!list) return 0;
        
        return list.products
          .filter(product => !product.purchased)
          .reduce((total, product) => total + (product.quantity * product.price), 0);
      }
    }),
    {
      name: 'shopping-lists-storage',
      version: 1
    }
  )
);

export default useStore;