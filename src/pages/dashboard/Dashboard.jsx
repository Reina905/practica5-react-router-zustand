import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useTasks } from '../../hooks/useTasks';
import TaskStats from '../../components/tasks/TaskStats';
import { useUIStore } from '../../store/uiStore';

export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const { tasks, currentFilter, currentCategory, loading, searchQuery} = useTaskStore();
    const { theme } = useUIStore();
    
    // Hook que se suscribe a las tareas en tiempo real
    useTasks();

    // Aplicar filtros a las tareas
    const filteredTasks = tasks.filter((task) => {
        // Filtro por estado (completadas/pendientes)
        if (currentFilter === 'completed' && !task.completed) return false;
        if (currentFilter === 'pending' && task.completed) return false;
        
        // Filtro por categoría
        if (currentCategory !== 'all' && task.category !== currentCategory) return false;
        
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();

            const matchesSearch =
                task.title?.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query);

            if (!matchesSearch) return false;
        }

        return true;
    });

    if (loading) {
        return <LoadingSpinner />;
    }

    // Clases segun el tema
    const bg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
    const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

    return (
        <div className={`max-w-7xl mx-auto p-6 ${bg}`}>
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${textPrimary}`}>
                    Bienvenido, {user?.displayName || 'Usuario'}
                </h1>
                <p className={`mt-2 ${textSecondary}`}>
                    Tienes {tasks.filter(t => !t.completed).length} tareas pendientes
                </p>
            </div>

            <TaskStats />
            <TaskFilters />
            <TaskList tasks={filteredTasks} />
        </div>
    );
}