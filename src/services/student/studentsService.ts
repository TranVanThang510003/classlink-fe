import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {AddStudentsToClassPayload, CreateStudentPayload} from "@/types/student";
import {getAuth} from "firebase/auth";


export const createStudentAccount = async (
    payload: CreateStudentPayload
) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Not authenticated");
  }
  // 1️⃣ Check email đã tồn tại chưa
  const q = query(
      collection(db, "users"),
      where("email", "==", payload.email)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    throw new Error("Email đã tồn tại");
  }
  console.log("CREATE STUDENT PAYLOAD:", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    role: "student",
    createdBy: user.uid,
    classIds: [],
  });

  // 2️⃣ Tạo student account
  const docRef = await addDoc(collection(db, "users"), {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,

    role: "student",
    createdBy: user.uid, //  lấy từ auth
    // học sinh có thể học nhiều lớp
    classIds: [],

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    role: "student",
  };
};




export const addStudentsToClass = async ({
                                           studentIds,
                                           classId,
                                         }: AddStudentsToClassPayload) => {
  const classRef = doc(db, "classes", classId);

  for (const studentId of studentIds) {
    const studentRef = doc(db, "users", studentId);

    // add class vào student
    await updateDoc(studentRef, {
      classIds: arrayUnion(classId),
    });

    // add student vào class
    await updateDoc(classRef, {
      studentIds: arrayUnion(studentId),
    });
  }

  return true;
};

