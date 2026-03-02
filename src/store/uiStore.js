import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  // persist: middleware que guarda automáticamente en localStorage
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,

      // Alternar entre tema claro y oscuro
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';

          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
      
          return { theme: newTheme };
        }),

      toggleSidebar: () => set((state) => ({
        sidebarOpen: !state.sidebarOpen
      })),

      setSidebarOpen: (open) => set({ sidebarOpen: open })
    }),
    {
      name: 'ui-preferences', // clave en localStorage
      // Solo persistir el tema, no el estado del sidebar
      partialize: (state) => ({
        theme: state.theme
      })
    }
  )
);