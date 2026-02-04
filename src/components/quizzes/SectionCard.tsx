export default function SectionCard({
    step,
    title,
    extra,
    children,
}: {
    step: number;
    title: string;
    extra?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-emerald-300 bg-white ">
            <div className="flex items-center justify-between border-b border-emerald-200 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-semibold text-white">
                        {step}
                    </div>
                    <h3 className="font-semibold text-emerald-700">
                        {title}
                    </h3>
                </div>
                {extra}
            </div>
            <div className="p-4 space-y-4">{children}</div>
        </div>
    );
}
