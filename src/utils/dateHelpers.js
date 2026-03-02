import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
* Formatear fecha en formato dd/MM/yyyy
*/
export const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy', { locale: es });
};

/**
* Formatear fecha y hora
*/
export const formatDateTime = (date) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
};

/**
* Obtener tiempo relativo (ej: "hace 2 horas")
*/
export const getRelativeTime = (date) => {
    if (!date) return '';
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
};

/**
* Verificar si una tarea está vencida
*/
export const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    return isPast(dueDate) && !isToday(dueDate);
};

/**
* Obtener etiqueta amigable para la fecha de vencimiento
*/
export const getDueDateLabel = (dueDate) => {
    if (!dueDate) return 'Sin fecha';
    if (isToday(dueDate)) return 'Hoy';
    if (isTomorrow(dueDate)) return 'Mañana';
    if (isPast(dueDate)) return 'Vencida';
    
    return formatDate(dueDate);
};