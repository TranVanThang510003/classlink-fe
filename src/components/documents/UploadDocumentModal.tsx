
'use client';

import { Modal, Input, Upload, Button, Select } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useClassContext } from '@/contexts/ClassContext';
import { useUploadDocument } from '@/hooks/documents/useUploadDocument';
import { useUpdateDocument } from '@/hooks/documents/useUpdateDocument';
import toast from 'react-hot-toast';

const { TextArea } = Input;

export type FirestoreAttachment = {
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
};

export type DocumentFormValues = {
  id?: string;
  title: string;
  description?: string;
  status: 'draft' | 'published';
  attachments?: FirestoreAttachment[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<DocumentFormValues>;
  onSuccess?: () => void;
};

export default function DocumentFormModal({
  open,
  onClose,
  initialValues,
  onSuccess,
}: Props) {
  const { user } = useAuthContext();
  const { activeClassId } = useClassContext();

  const { uploadDocument, loading: creating } = useUploadDocument();
  const { updateDocument, loading: updating } = useUpdateDocument();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const isUpdateMode = useMemo(() => Boolean(initialValues?.id), [initialValues]);
  const loading = creating || updating;

  /** Convert Firestore attachments → Ant UploadFile */
  const mapAttachmentsToUpload = (attachments?: FirestoreAttachment[]): UploadFile[] => {
    if (!attachments) return [];

    return attachments.map((f, index) => ({
      uid: String(index),
      name: f.fileName,
      status: 'done',
      url: f.fileUrl,
    }));
  };

  /** Fill form when modal opens */
  useEffect(() => {
    if (!open) return;

    setTitle(initialValues?.title ?? '');
    setDescription(initialValues?.description ?? '');
    setFiles(mapAttachmentsToUpload(initialValues?.attachments));
    setStatus(initialValues?.status ?? 'draft');
  }, [open, initialValues]);

  if (!user) return null;

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFiles([]);
    setStatus('draft');
  };

  const handleSubmit = async () => {
    if (!activeClassId) {
      toast.error('Please select a class');
      return;
    }

    if (!title.trim()) {
      toast.error('Document title is required');
      return;
    }

    try {
      if (isUpdateMode && initialValues?.id) {
          await updateDocument({
              documentId: initialValues.id,
              title,
              description,
              status,
              files,
          });

          toast.success('Document updated');
      } else {
        await uploadDocument({
          classId: activeClassId,
          title,
          description,
          status,
          files,
          createdBy: user.uid,
        });

        toast.success('Document uploaded');
      }

      resetForm();
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <Modal
      open={open}
      onOk={handleSubmit}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      confirmLoading={loading}
      title={isUpdateMode ? 'Update Document' : 'Upload Document'}
      okText={isUpdateMode ? 'Update' : 'Upload'}
      destroyOnClose
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextArea
          placeholder="Document description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ]}
        />

        <Upload
          fileList={files}
          beforeUpload={() => false}
          onChange={({ fileList }) => setFiles(fileList)}
          multiple
        >
          <Button>Upload file</Button>
        </Upload>
      </div>
    </Modal>
  );
}
