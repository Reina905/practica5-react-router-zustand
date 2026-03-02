import { useTaskStore } from '../../store/taskStore';
import { useUIStore } from '../../store/uiStore';
import { FILTERS, CATEGORIES } from '../../utils/constants';

export default function TaskFilters() {
    const {
        currentFilter,
        currentCategory,
        searchQuery,
        setFilter,
        setCategory,
        setSearchQuery
    } = useTaskStore();

    const { theme } = useUIStore();

    // Clases según tema
    const cardBg = theme === 'dark' ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200';
    const text = theme === 'dark' ? 'text-white' : 'text-gray-700';

    return (
        <div className={`card mb-6 ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Filtro por estado */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${text}`}>
                        Filtrar por estado
                    </label>
                    <div className="flex gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setFilter(filter.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentFilter === filter.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filtro por categoría */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${text}`}>
                        Filtrar por categoría
                    </label>
                    <select
                        value={currentCategory}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">Todas las categorías</option>
                        {CATEGORIES.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buscar por nombre o por descripcion */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${text}`}>
                        Buscar tarea
                    </label>
                    <input
                        type="text"
                        placeholder="Buscar por titulo o descripcion..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>
        </div>
    );
}