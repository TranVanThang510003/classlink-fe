// hooks/useStudents.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, addStudent } from '@/services/studentsService';



// 📘 Thêm học sinh
export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStudent,
    onSuccess: (data, variables) => {
      console.log("✅ API returned:", data);
      console.log("📤 Sent payload:", variables);
      queryClient.invalidateQueries(['students']);
    },
    onError: (error) => {
      console.error('Add student failed', error);
    },
  });
};
