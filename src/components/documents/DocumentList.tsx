import { DocumentItem } from "@/types/document";

interface Props {
  documents: DocumentItem[];
}

export default function DocumentList({ documents }: Props) {
  if (!documents.length) {
    return <p className="text-gray-500">Chưa có tài liệu</p>;
  }

  return (
      <div className="space-y-3">
        {documents.map((doc) => (
            <div
                key={doc.id}
                className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{doc.title}</p>
                <p className="text-sm text-gray-500">{doc.fileName}</p>
              </div>

              <a
                  href={doc.fileUrl}
                  target="_blank"
                  className="text-blue-500 underline"
              >
                Tải xuống
              </a>
            </div>
        ))}
      </div>
  );
}
