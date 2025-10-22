
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvyUKJJ2WIoG-2f_3YJtZRSdO1RES622E",
  authDomain: "challenge-project-a1657.firebaseapp.com",
  projectId: "challenge-project-a1657",
  storageBucket: "challenge-project-a1657.firebasestorage.app",
  messagingSenderId: "225419567293",
  appId: "1:225419567293:web:95196f6683577024da97d4",
  measurementId: "G-CZXBD68VN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Test function
export const testFirestore = async () => {
  try {
    // Thêm document thử
    const docRef = await addDoc(collection(db, "testCollection"), { name: "Test User", time: Date.now() });
    console.log("Document written with ID:", docRef.id);

    // Lấy dữ liệu
    const snapshot = await getDocs(collection(db, "testCollection"));
    snapshot.forEach(doc => console.log(doc.id, doc.data()));

  } catch (error) {
    console.error("Error connecting to Firestore:", error);
  }
};
