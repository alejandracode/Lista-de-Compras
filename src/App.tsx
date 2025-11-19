import React, { useState } from 'react';
import Home from './pages/Home';
import ListView from './pages/ListView';
import useStore from './store/useStore';
import { useTranslation } from "react-i18next";

function App() {
  const [currentView, setCurrentView] = useState('home');
  const { setCurrentList, currentListId } = useStore();
  const { t } = useTranslation();

  const handleListSelect = (listId: string) => {
    setCurrentList(listId);
    setCurrentView('list');
  };

  const handleBackToHome = () => {
    setCurrentList(null);
    setCurrentView('home');
  };

  return (
    // Fondo degradado responsivo y tipografía moderna
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 font-sans selection:bg-blue-200 selection:text-blue-900">
      {currentView === 'home' ? (
        <Home onListSelect={handleListSelect} />
      ) : (
        <ListView 
          listId={currentListId} 
          onBack={handleBackToHome} 
        />
      )}
    </div>
  );
}

export default App;