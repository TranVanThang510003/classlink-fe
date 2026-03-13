
'use client';

import { Spin } from 'antd';
import { useParams } from 'next/navigation';

import { useAssignmentDetail } from '@/hooks/assignment/useAssignmentDetail';
import { useInstructorAssignmentSubmissions } from '@/hooks/assignment/useInstructorAssignmentSubmissions';
import AssignmentSubmissionList from '@/components/assigments/AssignmentSubmissionList';

export default function AssignmentSubmissionsPage() {
    const { assignmentId } = useParams() as { assignmentId: string };
    const { assignment, loading: assignmentLoading } =
        useAssignmentDetail(assignmentId);

    const { submissions, loading: submissionsLoading } =
        useInstructorAssignmentSubmissions(
            assignmentId,
            assignment?.classId
        );
    console.log('Submissions:', submissions);

    if (assignmentLoading || submissionsLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!assignment) {
        return <div className="text-center text-red-500">Assignment not found</div>;
    }

    return (
        <div className="flex flex-col gap-6">

            <div>
                <h2 className="text-2xl font-semibold">
                    Submissions – {assignment.title}
                </h2>
                <p className="text-gray-500 text-sm">
                    {/*Class: {assignment.className}*/}
                </p>
            </div>

            {/* ===== LIST ===== */}
            <AssignmentSubmissionList submissions={submissions} />
        </div>
    );
}
