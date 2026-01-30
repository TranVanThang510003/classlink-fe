'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useMyClasses } from '@/hooks/class/useMyClasses';
import { useMyLearningClasses } from '@/hooks/class/useMyLearningClasses';

type ClassItem = {
    id: string;
    name: string;
};

type ClassContextType = {
    classes: ClassItem[];
    activeClassId: string | null;
    setActiveClassId: (id: string) => void;
};

const ClassContext = createContext<ClassContextType | null>(null);

export function ClassProvider({ children }: { children: React.ReactNode }) {
    const { uid, role } = useAuthContext();

    const instructorClasses = useMyClasses(
        role === 'instructor' ? uid ?? undefined : undefined
    );

    const studentClasses = useMyLearningClasses(
        role === 'student' ? uid ?? undefined : undefined
    );

    const classes =
        role === 'instructor'
            ? instructorClasses
            : studentClasses;

    const [activeClassId, setActiveClassIdState] =
        useState<string | null>(null);

    /* restore + auto select */
    useEffect(() => {
        if (classes.length === 0) return;

        const saved = localStorage.getItem('activeClassId');
        if (saved) {
            setActiveClassIdState(saved);
        } else {
            setActiveClassIdState(classes[0].id);
            localStorage.setItem('activeClassId', classes[0].id);
        }
    }, [classes]);

    const setActiveClassId = (id: string) => {
        setActiveClassIdState(id);
        localStorage.setItem('activeClassId', id);
    };

    return (
        <ClassContext.Provider
            value={{ classes, activeClassId, setActiveClassId }}
        >
            {children}
        </ClassContext.Provider>
    );
}

export function useClassContext() {
    const ctx = useContext(ClassContext);
    if (!ctx) {
        throw new Error('useClassContext must be used inside ClassProvider');
    }
    return ctx;
}
