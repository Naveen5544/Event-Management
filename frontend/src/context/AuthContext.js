import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Prevents rendering children until auth check is done

    useEffect(() => {
        // This effect runs only once on initial app load
        try {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            if (storedUser && storedToken) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
            // Clear corrupted data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false); // Auth check is complete
        }
    }, []);

    const login = (userData, userToken) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        setUser(userData);
        setToken(userToken);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
    };

    // Memoize the context value to ensure stable object reference
    const value = useMemo(() => ({
        user,
        token,
        isLoggedIn,
        loading,
        login,
        logout
    }), [user, token, isLoggedIn, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};