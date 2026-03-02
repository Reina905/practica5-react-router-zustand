import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export const registerUser = async (email, password, displayName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email,
            password);
        
        await updateProfile(userCredential.user, {
            displayName: displayName
        });

        return {
            success: true,
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: displayName
            }
        };

    } catch (error) {
        return {
            success: false,
            error: handleAuthError(error.code)
        };
    }
};

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email,
            password);
        return {
            success: true,
            user: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName
            }
        };

    } catch (error) {
        return {
            success: false,
            error: handleAuthError(error.code)
        };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: 'Error al cerrar sesión'
        };
    }
};

const handleAuthError = (errorCode) => {
    const errors = {
        'auth/email-already-in-use': 'Este correo ya está registrado',
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
    };
    return errors[errorCode] || 'Error de autenticación';
};