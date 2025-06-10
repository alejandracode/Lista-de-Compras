import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';
import useStore from '../store/useStore';

const CurrencySelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currencies, selectedCurrency, setCurrency } = useStore();
  const dropdownRef = useRef(null);

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencySelect = (currencyCode) => {
    setCurrency(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <DollarSign className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-gray-900">
          {selectedCurrencyData?.code || 'USD'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency.code)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                currency.code === selectedCurrency ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{currency.name}</div>
                  <div className="text-sm text-gray-500">{currency.code}</div>
                </div>
                <span className="text-lg font-semibold text-gray-600">
                  {currency.symbol}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;