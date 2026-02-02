import { Radio, DatePicker } from "antd";
import dayjs from "dayjs";

export default function QuizSettings({
    status,
    setStatus,
    openAt,
    setOpenAt,
    closeAt,
    setCloseAt,
}: any) {
    return (
        <>
            <Radio.Group
                value={status}
                onChange={e => setStatus(e.target.value)}
            >
                <Radio value="draft">Draft</Radio>
                <Radio value="published">Published</Radio>
            </Radio.Group>

            {status === "published" && (
                <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                        showTime
                        placeholder="Open at"
                        value={openAt ? dayjs(openAt) : null}
                        onChange={v => setOpenAt(v?.toDate() ?? null)}
                    />
                    <DatePicker
                        showTime
                        placeholder="Close at"
                        value={closeAt ? dayjs(closeAt) : null}
                        onChange={v => setCloseAt(v?.toDate() ?? null)}
                    />
                </div>
            )}
        </>
    );
}
