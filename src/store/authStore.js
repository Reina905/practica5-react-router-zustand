import { create } from 'zustand';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = create((set) => ({
  // Estado inicial
  user: null,
  loading: true, // true mientras verificamos si hay sesión activa

  // Actualizar el usuario autenticado
  setUser: (user) => set({ user, loading: false }),

  // Limpiar usuario al cerrar sesión
  clearUser: () => set({ user: null, loading: false }),

  // Escuchar cambios de autenticación de Firebase
  // Se ejecuta cuando el usuario inicia sesión, cierra sesión o recarga la página
  initializeAuth: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  },
}));