import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);   // { name, token }
    const [loading, setLoading] = useState(true);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('cafebuzz_token');
        const name = localStorage.getItem('cafebuzz_name');
        if (token && name) setUser({ name, token });
        setLoading(false);
    }, []);

    const login = ({ token, name }) => {
        localStorage.setItem('cafebuzz_token', token);
        localStorage.setItem('cafebuzz_name', name);
        setUser({ name, token });
    };

    const logout = () => {
        localStorage.removeItem('cafebuzz_token');
        localStorage.removeItem('cafebuzz_name');
        setUser(null);
    };

    const isAuthenticated = Boolean(user?.token);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
