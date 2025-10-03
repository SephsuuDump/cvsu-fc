"use client"

import { AuthService } from '@/services/auth.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    claims: Claim;
    loading: boolean;
}

const claimsInit = {
    campusId: 0,
    campusName: '',
    id: 0,
    iat: 0,
    exp: 0,
    role: ''
}

type AuthProviderProps = React.PropsWithChildren<object>;

const AuthContext = createContext<AuthContextType>({ claims: claimsInit, loading: true });

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [claims, setClaims] = useState(claimsInit);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const response = await AuthService.getCookie();
                setClaims(response);
            } catch (error) {
                setClaims(claimsInit);
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    return <AuthContext.Provider value={{ claims, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);