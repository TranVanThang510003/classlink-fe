import AssignmentItem from "./AssignmentItem";
import type { Assignment } from "@/types/assignment";

export default function AssignmentList({
                                           assignments,
                                       }: {
    assignments: Assignment[];
}) {
    if (!assignments.length) {
        return (
            <div className="text-center text-gray-400 italic mt-10">
                No assignments yet
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {assignments.map((a) => (
                <AssignmentItem key={a.id} assignment={a} />
            ))}
        </div>
    );
}
