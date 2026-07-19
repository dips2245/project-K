import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../hooks/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('blissUser');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('blissUser');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('blissUser', JSON.stringify(data));
        setUser(data);
        return data;
    };

const register = async (name, email, password, phone, termsAccepted) => {
    const { data } = await authAPI.register({ name, email, password, phone, termsAccepted });
    return data;
};

    const logout = () => {
        localStorage.removeItem('blissUser');
        setUser(null);
    };

    const updateUser = (data) => {
        const updated = { ...user, ...data };
        localStorage.setItem('blissUser', JSON.stringify(updated));
        setUser(updated);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
