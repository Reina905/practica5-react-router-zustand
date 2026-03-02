import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  // Estado
  tasks: [],
  loading: false,
  error: null,

  // Filtros activos
  currentFilter: 'all', // 'all' | 'completed' | 'pending'
  currentCategory: 'all', // 'all' | 'work' | 'personal' | 'shopping' | 'other'
  searchQuery: '',

  // Reemplazar todas las tareas (usado cuando llegan de Firestore)
  setTasks: (tasks) => set({ tasks, loading: false, error: null }),

  // Agregar una nueva tarea al array existente
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, task]
  })),

  // Actualizar una tarea por ID
  updateTask: (taskId, updatedTask) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    )
  })),

  // Eliminar una tarea por ID
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== taskId)
  })),

  // Cambiar filtro activo
  setFilter: (filter) => set({ currentFilter: filter }),

  // Cambiar categoría activa
  setCategory: (category) => set({ currentCategory: category }),

  //Ejercicio 2:
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Estados de carga y error
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false })
}));