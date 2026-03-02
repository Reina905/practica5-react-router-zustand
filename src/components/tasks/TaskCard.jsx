import { Link } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';

export default function TaskCard({ task }) {
    const category = CATEGORIES.find(c => c.id === task.category);
    const {theme} = useUIStore();

    //Manejar toggle de completado
    const handleToggleComplete = async (e) => {
        e.preventDefault(); //Evitar que el link navegue

        const result = await updateTask(task.id, {
            completed: !task.completed
        });

        if (result.success) {
            toast.success(task.completed ? 'Tarea pendiente' : 'Tarea completada');
        } else {
            toast.error('Error al actualizar tarea');
        }
    };

    //Manejar eliminacion
    const handleDelete = async (e) => {
        e.preventDefault();

        //confirmar antes de eliminar
        if (window.confirm(`Estas seguro de eliminar "${task.title}"?`)) {
            const result = await deleteTask(task.id);

            if (result.success) {
                toast.success('Tarea eliminada');
            } else {
                toast.error('Error al eliminar tarea');
            }
            //El hook useTasks() actualizara automaticamente la lista
        }
    };

    // Clases para el tema
    const cardBg = theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200';
    const titleText = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
    const descText = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

    return (
        <Link to={`/tasks/${task.id}`} className='block'>
            <div
                className={`card hover:shadow-lg transition-shadow border p-4 rounded-lg mb-4 ${cardBg} ${task.completed ? 'opacity-50' : ''} ${isOverdue(task.dueDate, task.completed) ? 'border-2 border-red-500' : ''}`}
            >
                <div className='flex items-start justify-between gap-4'>
                    {/*Contenido principal*/}
                    <div className='flex-1 min-w-0'>
                        {/* Titulo */}
                        <h3 className={`font-bold ${titleText} ${task.completed ? 'line-through opacity-60' : ''}`}>
                            {task.title}
                        </h3>
                        <p className={`text-sm mt-2 ${descText}`}>
                            {task.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-2 mt-4">
                            {/* Categoría */}
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold 
                                ${category ? `bg-${category.color}-100 text-${category.color}-800` : 'bg-gray-100 text-gray-800'}`}>
                                {task.category || 'Sin categoría'}
                            </span>

                            {/* Fecha de vencimiento) */}
                            <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 bg-gray-100">
                                {getDueDateLabel(task.dueDate)}
                            </span>

                            {/* Completada o pendiente) */}
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold 
                                ${task.completed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {task.completed ? 'Completada' : 'Pendiente'}
                            </span>
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <button
                            onClick={handleToggleComplete}
                            className={`px-3 py-1 rounded-lg text-sm font-medium mb-2
                                ${task.completed
                                    ? 'bg-green-600 text-white'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                            title={task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                        >
                            {task.completed ? 'Completada' : 'Pendiente'}
                        </button>

                        < button
                            onClick={handleDelete}
                            className="px-3 py-1 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            title="Eliminar tarea">
                            Eliminar
                        </ button>
                    </div>
                </div>

            </div>
        </Link>
    )
}