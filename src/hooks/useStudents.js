// hooks/useStudents.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, addStudent } from '@/services/studentsService';
import { message } from 'antd';

// 📘 Lấy danh sách học sinh
export const useStudents = () => {
  return useQuery(['students'], getStudents, {
    staleTime: 1000 * 60, // 1 phút
  });
};

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
