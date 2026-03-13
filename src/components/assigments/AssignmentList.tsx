"use client";

import AssignmentItem from "./AssignmentItem";
import type { Assignment } from "@/types/assignment";

interface Props {
    assignments?: Assignment[];
}

export default function AssignmentList({ assignments }: Props) {
    //  Handle undefined / null / empty
    if (!assignments || assignments.length === 0) {
        return (
            <div className="mt-16 text-center text-sm text-gray-400 italic">
                No assignments yet
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {assignments
                .filter(Boolean) // 🔥 chặn undefined từ gốc
                .map((assignment) => (
                    <AssignmentItem
                        key={assignment.id}
                        assignment={assignment}
                    />
                ))}
        </div>
    );
}
