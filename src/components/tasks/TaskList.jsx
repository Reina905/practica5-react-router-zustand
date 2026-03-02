import { useState } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { useUIStore } from '../../store/uiStore';

export default function TaskList({ tasks }) {
    const [showForm, setShowForm] = useState(false);

    const {theme} = useUIStore();

    const cardBg = theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200';
    const titleText = theme === 'dark' ? 'text-white' : 'text-gray-800';
    
    return (
        <div>
            {/* Header con contador y botón */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${titleText}`}>
                    Mis Tareas ({tasks.length})
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    + Nueva Tarea
                </button>
            </div>

            {/* Formulario de nueva tarea (condicional) */}
            {showForm && (
                <div className="mb-6">
                    <TaskForm onClose={() => setShowForm(false)} />
                </div>
            )}
            
            {/* Lista de tareas o mensaje vacío */}
            {tasks.length === 0 ? (
                <div className={`card text-center py-12 ${cardBg}`}>
                    <p className="text-gray-500 text-lg">No hay tareas para mostrar</p>
                    <p className="text-gray-400 mt-2">Crea una nueva tarea para comenzar</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
}