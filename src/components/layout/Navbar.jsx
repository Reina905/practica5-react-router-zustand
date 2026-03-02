import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutUser } from '../../services/authService';
import { useUIStore } from '../../store/uiStore';

export default function Navbar() {
    const { user, clearUser } = useAuthStore();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useUIStore();

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            clearUser(); // Limpiar estado de Zustand
            navigate('/login');
        }
    };

    const navBg = theme === 'dark' ? 'bg-gray-900 border-b border-gray-700' : 'bg-white';
    const navText = theme === 'dark' ? 'text-gray-100' : 'text-gray-700';
    const logoText = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';

    return (
        <nav className={`shadow-md ${navBg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo y título */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className={`text-2xl font-bold text-blue-600 ${logoText}`}>
                            Task Manager Pro
                        </Link>
                    </div>

                    {/* Usuario y botón de logout */}
                    <div className="flex items-center gap-4">
                        <span className={`${navText}`}>
                            {user?.displayName || user?.email}
                        </span>

                        <button onClick={toggleTheme} className="btn-primary">
                            Cambiar a {theme === 'dark' ? 'Light' : 'Dark'}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}