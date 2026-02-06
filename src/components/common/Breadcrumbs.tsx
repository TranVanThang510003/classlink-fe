'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from 'antd';

const routeNameMap: Record<string, string> = {
    assignments: 'Assignments',
    tests: 'Tests & Quiz',
    submissions: 'Submissions',
    classes: 'Classes',
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    const segments = pathname.split('/').filter(Boolean);

    const items = segments
        // ❗ bỏ prefix phân quyền
        .filter(seg => seg !== 'instructor')
        // ❗ bỏ firestore id
        .filter(seg => seg.length < 25)
        // ❗ chỉ render những route có label
        .filter(seg => routeNameMap[seg])
        .map((segment, index) => {
            // build href nhưng vẫn giữ prefix instructor thật
            const realIndex = segments.indexOf(segment);
            const href = '/' + segments.slice(0, realIndex + 1).join('/');

            return {
                title: <Link href={href}>{routeNameMap[segment]}</Link>,
            };
        });

    return (
        <Breadcrumb
            className="mb-4 text-sm"
            items={[
                { title: <Link href="/">Home</Link> },
                ...items,
            ]}
        />
    );
}
