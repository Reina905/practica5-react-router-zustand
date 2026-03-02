import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { createTask, updateTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';

export default function TaskForm({ onClose, taskToEdit = null }) {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { theme } = useUIStore();

    // Determinar si estamos en modo edición
    const isEditing = !!taskToEdit;

    // Preparar valores por defecto
    const defaultValues = taskToEdit ? {
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        category: taskToEdit.category,
        priority: taskToEdit.priority,
        // Convertir Date a formato YYYY-MM-DD para el input
        dueDate: taskToEdit.dueDate
            ? taskToEdit.dueDate.toISOString().split('T')[0]
            : ''
    } : {
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        dueDate: ''
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        const taskData = {
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : null
        };

        const taskPromise = isEditing
            ? updateTask(taskToEdit.id, taskData)
            : createTask(user.uid, taskData);

        // notificaciones. Ejercicio 4
        toast.promise(taskPromise, {
            loading: isEditing ? 'Actualizando tarea...' : 'Creando tarea...',
            success: (result) => {
                if (!result.success) throw new Error(result.error);
                onClose();
                return isEditing ? 'Tarea actualizada' : 'Tarea creada con exito';
            },
            error: (err) => {
                setError(err.message || 'Ocurrió un error');
                return isEditing ? 'No se pudo actualizar' : 'No se pudo crear la tarea';
            }
        });

        try {
            await taskPromise;
        } catch (e) {
            console.error("Error en el formulario:", e);
        } finally {
            setLoading(false);
        }
    };

        // Clases según tema
        const cardBg = theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200';
        const titleText = theme === 'dark' ? 'text-white' : 'text-gray-800';
        const text = theme === 'dark' ? 'text-white' : 'text-gray-700';

    return (
        <div className={`card ${cardBg}`}>
            {/* Header del formulario */}
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold ${titleText}`}>
                    {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                    &times;
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Campo: Título */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${text}`}>
                        Título *
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Ej: Completar informe mensual"
                        {...register('title', {
                            required: 'El título es obligatorio',
                            minLength: {
                                value: 3,
                                message: 'Mínimo 3 caracteres'
                            }
                        })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Campo: Descripción */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${text}`}>
                        Descripción
                    </label>
                    <textarea
                        className="input-field"
                        rows="3"
                        placeholder="Descripción detallada de la tarea..."
                        {...register('description')}
                    />
                </div>

                {/* Grid de 3 columnas: Categoría, Prioridad, Fecha */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${text}`}>
                            Categoría *
                        </label>
                        <select
                            className="input-field"
                            {...register('category', { required: true })}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${text}`}>
                            Prioridad *
                        </label>
                        <select
                            className="input-field"
                            {...register('priority', { required: true })}
                        >
                            {PRIORITIES.map((priority) => (
                                <option key={priority.id} value={priority.id}>
                                    {priority.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${text}`}>
                            Fecha de vencimiento
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            {...register('dueDate')}
                        />
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50"
                    >
                        {loading
                            ? (isEditing ? 'Actualizando...' : 'Guardando...')
                            : (isEditing ? 'Actualizar' : 'Crear Tarea')
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}