'use client';

import { useEffect, useState } from "react";
import type { Class } from "@/types/class";
import { subscribeClassesByInstructor } from "@/services/class/classService";

export function useClasses(instructorId?: string) {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("InstructorId:", instructorId);
        if (!instructorId) {
            setClasses([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const unsub = subscribeClassesByInstructor(
            instructorId,
            (list) => {
                setClasses(list);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [instructorId]);

    return { classes, loading };
}
