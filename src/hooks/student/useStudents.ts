// hooks/useStudents.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudentsToClass, createStudentAccount  } from "@/services/studentsService";

export const useAddStudentsToClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStudentsToClass,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["students", variables.classId],
      });

      queryClient.invalidateQueries({
        queryKey: ["class", variables.classId],
      });
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudentAccount,

    onSuccess: () => {
      // reload danh sách students
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });
    },
  });
};