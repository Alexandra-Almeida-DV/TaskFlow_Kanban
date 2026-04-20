import { AuthProvider } from './contexts/AuthProvider';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;