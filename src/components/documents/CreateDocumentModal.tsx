"use client";

import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { uploadDocument } from "@/services/documentService";
import toast from "react-hot-toast";

interface Props {
    open: boolean;
    onClose: () => void;
    classId: string;
    userId: string;
}

export default function CreateDocumentModal({
                                                open,
                                                onClose,
                                                classId,
                                                userId,
                                            }: Props) {
    const [form] = Form.useForm();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const values = await form.validateFields();
        if (!file) {
            toast.error("Vui lòng chọn file");
            return;
        }

        try {
            setLoading(true);
            await uploadDocument({
                file,
                title: values.title,
                description: values.description,
                classId,
                userId,
            });
            toast.success("Upload tài liệu thành công");
            form.resetFields();
            setFile(null);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Upload thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            title="Thêm tài liệu"
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: "Nhập tiêu đề" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Upload
                    beforeUpload={(file) => {
                        setFile(file);
                        return false;
                    }}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                </Upload>
            </Form>
        </Modal>
    );
}
