import { useEffect } from 'react'
import { Layout } from './components/Layout'
import { useAppStore } from './stores/appStore'
import './styles/brand.css'
import './App.css'

function App() {
  const { loadModules, loadStateFromStorage, saveStateToStorage } = useAppStore();

  useEffect(() => {
    // Load modules and state on app start
    loadModules().then(() => {
      loadStateFromStorage();
    });

    // Auto-save state every 5 seconds
    const saveInterval = setInterval(() => {
      saveStateToStorage();
    }, 5000);

    // Save state on page unload
    const handleBeforeUnload = () => {
      saveStateToStorage();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [loadModules, loadStateFromStorage, saveStateToStorage]);

  return <Layout />
}

export default App
