import {Timestamp} from "firebase/firestore";

export type UserRole = "student" | "instructor";

export type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: UserRole;
    createdAt?:  Timestamp| null;
    classIds: string[];
    createdBy: string;
    updatedAt?: Timestamp| null;
};
