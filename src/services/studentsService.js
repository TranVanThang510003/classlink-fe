import axios from "../util/axios.custom";

export const getStudents = async () => {
  const res = await axios.get('/api/students');
  return res.data;
};
export const addStudent = async (student) => {
  const res = await axios.post('/api/students', student);
  return res.data;
};

