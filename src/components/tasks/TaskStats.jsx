import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { isOverdue } from '../../utils/dateHelpers';

export default function TaskStats() {
    //Ejercicio 3:
    const { tasks } = useTaskStore();
    const {theme} = useUIStore();

    const ahora = new Date();

    const totalTareas = tasks.length;
    const tareasCompletadas = tasks.filter(t => t.completed).length;
    const tareasPendientes = tasks.filter(t => !t.completed).length;
    const tareasVencidas = tasks.filter(t => isOverdue(t.dueDate, t.completed)).length;

    const porcentajeCompletado =
        totalTareas === 0
            ? 0
            : Math.round((tareasCompletadas / totalTareas) * 100);
    
    const cardBg = theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200';
    const titleText = theme === 'dark' ? 'text-white' : 'text-gray-800';

    return (
        <div className={`card mb-6 ${cardBg}`}>
            <h2 className={`text-xl font-bold mb-4 ${titleText}`}>
                Estadisticas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">

                <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {totalTareas}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Completadas</p>
                    <p className="text-2xl font-bold text-green-600">
                        {tareasCompletadas}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {tareasPendientes}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Vencidas</p>
                    <p className="text-2xl font-bold text-red-600">
                        {tareasVencidas}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Progreso</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {porcentajeCompletado}%
                    </p>
                </div>
            </div>
        </div>
    );
}