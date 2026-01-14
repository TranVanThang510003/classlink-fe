import type { User } from "./user";

export type Student = User & {
    role: "student";
};
export type CreateStudentPayload = {
    name: string;
    email: string;
    phone: string;
    address: string;
};
export type AddStudentToClassPayload = {
    studentId: string;
    classId: string;
};
