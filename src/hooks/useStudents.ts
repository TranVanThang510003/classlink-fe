// hooks/useStudents.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStudent } from '@/services/studentsService';
import type { Student } from '@/types/student';

export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Student) => addStudent(payload),

    onSuccess: (_data, variables) => {
      console.log("✅ Student added:", variables);

      // 🔥 invalidate theo class
      queryClient.invalidateQueries({
        queryKey: ['students', variables.classId],
      });
    },

    onError: (error) => {
      console.error('❌ Add student failed', error);
    },
  });
};
