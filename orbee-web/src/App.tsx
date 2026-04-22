import { AppEffectsProvider } from './components/effects';
import { AuthProvider } from './contexts/AuthProvider';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <AppEffectsProvider>
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
    </AppEffectsProvider>
  );
}

export default App;