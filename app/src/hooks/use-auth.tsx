"use client"

import { AuthService } from '@/services/auth.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    claims: Claim;
    loading: boolean;
}

const claimsInit: Claim = {
    campus: {
        id: 0,
        name: '',
    },
    college: {
        id: 0,
        name: '',
    },
    id: 0,
    firstName: '',
    lastName: '',
    iat: 0,
    exp: 0,
    role: ''
}

type RawClaims = Partial<Claim> & {
    first_name?: string;
    last_name?: string;
    campus?: Partial<Claim["campus"]> | null;
    college?: Partial<Claim["college"]> | null;
};

function normalizeClaims(raw?: RawClaims | null): Claim {
    return {
        ...claimsInit,
        ...raw,
        firstName: raw?.firstName ?? raw?.first_name ?? '',
        lastName: raw?.lastName ?? raw?.last_name ?? '',
        campus: {
            ...claimsInit.campus,
            ...(raw?.campus ?? {}),
        },
        college: {
            ...claimsInit.college,
            ...(raw?.college ?? {}),
        },
    };
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
                setClaims(normalizeClaims(response));
            } catch {
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
