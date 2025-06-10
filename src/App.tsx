import React, { useState } from 'react';
import Home from './pages/Home';
import ListView from './pages/ListView';
import useStore from './store/useStore';
import { useTranslation } from "react-i18next";


function App() {
  const [currentView, setCurrentView] = useState('home');
  const { setCurrentList } = useStore();

  const { t, i18n } = useTranslation();

  const handleListSelect = (listId) => {
    setCurrentList(listId);
    setCurrentView('list');
  };

  const handleBackToHome = () => {
    setCurrentList(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'home' ? (
        <Home onListSelect={handleListSelect} />
      ) : (
        <ListView 
          listId={useStore.getState().currentListId} 
          onBack={handleBackToHome} 
        />
      )}
    </div>
  );
}

export default App;