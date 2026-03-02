import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTaskById, updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { formatDateTime, getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskForm from '../../components/tasks/TaskForm';
import { useUIStore } from '../../store/uiStore';

export default function TaskDetails() {
    const { taskId } = useParams(); // Obtener ID de la URL
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const { theme } = useUIStore();

    useEffect(() => {
        loadTask();
    }, [taskId]);

    const loadTask = async () => {
        setLoading(true);
        const result = await getTaskById(taskId);

        if (result.success) {
            setTask(result.task);
        } else {
            // Si no existe la tarea, volver al dashboard
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleToggleComplete = async () => {
        const result = await updateTask(taskId, {
            completed: !task.completed
        });

        if (result.success) {
            // Actualizar estado local
            setTask({ ...task, completed: !task.completed });
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
            const result = await deleteTask(taskId);

            if (result.success) {
                navigate('/dashboard');
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // Mostrar formulario de edición si editing es true
    if (editing) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <TaskForm
                    taskToEdit={task}
                    onClose={() => {
                        setEditing(false);
                        loadTask(); // Recargar tarea actualizada
                    }}
                />
            </div>
        );
    }

    const category = CATEGORIES.find(c => c.id === task.category);
    const priority = PRIORITIES.find(p => p.id === task.priority);


    // Clases segun tema
    const bgCard = theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200';
    const textPrimary = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
    const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
    const btnPrimary = theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400';
    const btnSecondary = theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
    const btnDanger = theme === 'dark' ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-red-500 text-white hover:bg-red-400';

    return (
        <div className={`max-w-4xl mx-auto p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    to="/dashboard"
                    className={`flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                >
                    Volver al Dashboard
                </Link>
            </div>

            <div className={`card ${bgCard}`}>
                {/* Header con título y botones */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>
                            {task.title}
                        </h1>

                        {/* Badges de categoría, prioridad y estado */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? `bg-${category.color}-700 text-${category.color}-200` : `bg-${category.color}-100 text-${category.color}-800`}`}>
                                {category.label}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? `bg-${priority.color}-700 text-${priority.color}-200` : `bg-${priority.color}-100 text-${priority.color}-800`}`}>
                                {priority.label}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${task.completed
                                ? (theme === 'dark' ? 'bg-green-700 text-green-200' : 'bg-green-100 text-green-800')
                                : (theme === 'dark' ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-100 text-yellow-800')}`}>
                                {task.completed ? 'Completada' : 'Pendiente'}
                            </span>
                            {task.dueDate && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isOverdue(task.dueDate, task.completed)
                                    ? (theme === 'dark' ? 'bg-red-700 text-red-200' : 'bg-red-100 text-red-800')
                                    : (theme === 'dark' ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-800')}`}>
                                    Vence: {getDueDateLabel(task.dueDate)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(true)}
                            className={`btn-secondary ${btnSecondary}`}
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`btn-danger ${btnDanger}`}
                        >
                            Eliminar
                        </button>
                    </div>
                </div>

                {/* Descripción */}
                <div className="border-t pt-6">
                <h2 className={`text-lg font-semibold mb-2 ${textSecondary}`}>Descripción</h2>
                    <p className={`whitespace-pre-wrap ${textSecondary}`}>
                        {task.description || 'Sin descripción'}
                    </p>
                </div>

                {/* Información adicional */}
                <div className="border-t pt-6 mt-6">
                    <h2 className={`text-lg font-semibold mb-4 ${textSecondary}`}>Información
                        adicional</h2>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <dt className={`text-sm font-medium ${textMuted}`}>Creada</dt>
                            <dd className={textPrimary}>{formatDateTime(task.createdAt)}</dd>
                        </div>
                        {task.dueDate && (
                            <div>
                                <dt className={`text-sm font-medium ${textMuted}`}>Fecha de
                                    vencimiento</dt>
                                <dd className={textPrimary}>{formatDateTime(task.dueDate)}</dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Botón de toggle completado */}
                <div className="border-t pt-6 mt-6">
                    <button
                        onClick={handleToggleComplete}
                        className={`w-full px-4 py-2 rounded-lg font-medium ${task.completed ? btnSecondary : btnPrimary}`}
                    >
                        {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    </button>
                </div>
            </div>
        </div>
    );
}
