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

type UserProfile = {
    name: string;
    role: Role;
};

type AuthContextType = {
    user: User | null;
    profile: UserProfile | null;
    uid: string | null;
    role: Role | null;
    loading: boolean;
    isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                setUser(null);
                setProfile(null);
                setRole(null);
                setLoading(false);
                return;
            }

            setUser(firebaseUser);

            try {
                const snap = await getDoc(
                    doc(db, 'users', firebaseUser.uid)
                );

                if (snap.exists()) {
                    const data = snap.data();

                    setProfile({
                        name: data.name,
                        role: data.role,
                    });

                    setRole(data.role ?? null);
                } else {
                    setProfile(null);
                    setRole(null);
                }
            } catch (err) {
                console.error('Failed to fetch user profile', err);
                setProfile(null);
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                uid: user?.uid ?? null,
                role,
                loading,
                isLoggedIn: !!user,
            }}
        >
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
