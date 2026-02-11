import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import type { User } from "@/types/user";
import {
    getUserProfile,
    getStudentClasses,
    getInstructorClasses,
    type ClassItem,
} from "@/services/profileService";

export function useProfile() {
    const { user } = useAuthContext();

    const [profile, setProfile] = useState<User | null>(null);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;

        const fetchData = async () => {
            try {
                const data = await getUserProfile(user.uid);
                if (!data) return;

                setProfile(data);

                /* ===== LOAD CLASSES ===== */
                if (data.role === "student" && data.classIds?.length) {
                    const studentClasses = await getStudentClasses(data.classIds);
                    setClasses(studentClasses);
                }

                if (data.role === "instructor") {
                    const instructorClasses = await getInstructorClasses(user.uid);
                    setClasses(instructorClasses);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    return { profile, classes, loading };
}
