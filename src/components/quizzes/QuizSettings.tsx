'use client';

import { Radio, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

type QuizStatus = "draft" | "published";

type QuizSettingsProps = {
    status: QuizStatus;
    setStatus: (v: QuizStatus) => void;
    openAt: Date | null;
    setOpenAt: (v: Date | null) => void;
    closeAt: Date | null;
    setCloseAt: (v: Date | null) => void;
};

export default function QuizSettings({
                                         status,
                                         setStatus,
                                         openAt,
                                         setOpenAt,
                                         closeAt,
                                         setCloseAt,
                                     }: QuizSettingsProps) {
    const now = dayjs();

    /* =======================
       DISABLE PAST DATE
    ======================= */
    const disablePastDate = (current: Dayjs) => {
        return current < now.startOf("day");
    };

    /* =======================
       OPEN AT: disable past time
    ======================= */
    const disableTimeAfterNow = (current: Dayjs | null) => {
        if (!current) return {};

        const isToday = current.isSame(now, "day");
        if (!isToday) return {};

        return {
            disabledHours: () =>
                Array.from({ length: now.hour() }, (_, i) => i),

            disabledMinutes: (selectedHour: number) =>
                selectedHour === now.hour()
                    ? Array.from({ length: now.minute() }, (_, i) => i)
                    : [],
        };
    };

    /* =======================
       CLOSE AT: disable < openAt
    ======================= */
    const disableTimeAfterOpenAt = (current: Dayjs | null) => {
        if (!current || !openAt) return {};

        const open = dayjs(openAt);
        const sameDay = current.isSame(open, "day");

        if (!sameDay) return {};

        return {
            disabledHours: () =>
                Array.from({ length: open.hour() }, (_, i) => i),

            disabledMinutes: (selectedHour: number) =>
                selectedHour === open.hour()
                    ? Array.from({ length: open.minute() }, (_, i) => i)
                    : [],
        };
    };

    return (
        <div className="flex flex-col gap-4">
            {/* STATUS */}
            <Radio.Group
                value={status}
                onChange={e => setStatus(e.target.value)}
            >
                <Radio value="draft">Draft</Radio>
                <Radio value="published">Published</Radio>
            </Radio.Group>

            {/* TIME SETTINGS */}
            <div className="grid grid-cols-2 gap-4">
                {/* OPEN AT */}
                <DatePicker
                    showTime
                    placeholder="Open at"
                    value={openAt ? dayjs(openAt) : null}
                    disabledDate={disablePastDate}
                    disabledTime={disableTimeAfterNow}
                    onChange={v => {
                        const date = v?.toDate() ?? null;
                        setOpenAt(date);

                        // reset closeAt nếu không hợp lệ
                        if (
                            closeAt &&
                            date &&
                            dayjs(closeAt).isBefore(date)
                        ) {
                            setCloseAt(null);
                        }
                    }}
                />

                {/* CLOSE AT */}
                <DatePicker
                    showTime
                    placeholder="Close at"
                    value={closeAt ? dayjs(closeAt) : null}
                    disabled={!openAt}
                    disabledDate={current =>
                        !openAt ||
                        current < dayjs(openAt).startOf("day")
                    }
                    disabledTime={disableTimeAfterOpenAt}
                    onChange={v => setCloseAt(v?.toDate() ?? null)}
                />
            </div>
        </div>
    );
}
