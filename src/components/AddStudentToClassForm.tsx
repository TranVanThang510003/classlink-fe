'use client';

import { Button, Form, Checkbox } from "antd";
import toast from "react-hot-toast";

import { useAddStudentsToClass } from "@/hooks/useStudents";
import { useStudentsByInstructor } from "@/hooks/useStudentQuery";
import { useStudentsByClass } from "@/hooks/useStudentsByClass";

type Props = {
    classId: string;
};

type FormValues = {
    studentIds: string[];
};

const AddStudentToClassForm = ({ classId }: Props) => {
    const [form] = Form.useForm<FormValues>();

    /* instructorId */
    const instructorId =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")?.id
            : null;

    /* students do instructor tạo */
    const { data: allStudents = [], isLoading } =
        useStudentsByInstructor(instructorId);

    /* students đã có trong class */
    const { students: classStudents = [] } =
        useStudentsByClass(classId);

    /* mutation */
    const mutation = useAddStudentsToClass();

    /* filter */
    const classStudentIds = new Set(classStudents.map((s) => s.id));

    const availableStudents = allStudents.filter(
        (s) => !classStudentIds.has(s.id)
    );

    /* submit */
    const onFinish = (values: FormValues) => {
        if (!values.studentIds?.length) {
            toast.error("Please select at least one student");
            return;
        }

        mutation.mutate(
            {
                studentIds: values.studentIds,
                classId,
            },
            {
                onSuccess: () => {
                    toast.success("Students added to class");
                    form.resetFields();
                },
                onError: (err: any) => {
                    toast.error(err?.message || "Failed to add students");
                },
            }
        );
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4">
                Add Students to Class
            </h3>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="studentIds"
                    label="Select Students"
                    rules={[
                        { required: true, message: "Please select students" },
                    ]}
                >
                    <Checkbox.Group className="flex flex-col gap-2">
                        {availableStudents.length === 0 ? (
                            <div className="text-gray-400">
                                All students already in this class
                            </div>
                        ) : (
                            availableStudents.map((s) => (
                                <Checkbox key={s.id} value={s.id}>
                                    {s.name} ({s.email})
                                </Checkbox>
                            ))
                        )}
                    </Checkbox.Group>
                </Form.Item>

                <div className="text-right mt-6">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={mutation.isPending}
                        disabled={availableStudents.length === 0}
                    >
                        Add Selected Students
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default AddStudentToClassForm;
