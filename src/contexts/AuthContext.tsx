'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Role = 'student' | 'instructor';

type AuthContextType = {
    user: User | null;
    uid: string | null;
    role: Role | null;
    loading: boolean;
    isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setRole(null);
                setLoading(false);
                return;
            }

            setUser(firebaseUser);

            try {
                const snap = await getDoc(
                    doc(db, 'users', firebaseUser.uid)
                );
                setRole(snap.data()?.role ?? null);
            } catch (err) {
                console.error('Failed to fetch user role', err);
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    const value: AuthContextType = {
        user,
        uid: user?.uid ?? null,
        role,
        loading,
        isLoggedIn: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error(
            'useAuthContext must be used inside AuthProvider'
        );
    }
    return ctx;
}
