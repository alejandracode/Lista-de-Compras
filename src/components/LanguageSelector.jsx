import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white transition-all shadow-sm"
      >
        <Globe className="w-4 h-4 text-slate-600" />
        {/* En móvil oculta el nombre, en escritorio lo muestra */}
        <span className="font-medium text-slate-800 hidden sm:inline text-sm">
          {currentLanguage.name}
        </span>
        <span className="sm:hidden text-xs font-bold text-slate-800">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 flex items-center justify-between ${
                i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium text-sm">{language.name}</span>
              </div>
              {i18n.language === language.code && (
                <Check className="w-3 h-3 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;