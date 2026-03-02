import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <div>
      {/* Notificaciones */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px' },
        }}
      />

      <AppRouter />
    </div>
  );
}

export default App;