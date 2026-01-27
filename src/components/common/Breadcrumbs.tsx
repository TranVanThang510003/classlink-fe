'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from 'antd';

const routeNameMap: Record<string, string> = {
    assignments: 'Assignments',
    submissions: 'Submissions',
    classes: 'Classes',
};

export default function Breadcrumbs() {
    const pathname = usePathname();

    const segments = pathname
        .split('/')
        .filter(Boolean)
        // ✅ Ẩn ID (Firestore id thường dài + không có trong map)
        .filter(seg => routeNameMap[seg]);

    const items = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');

        return {
            title: (
                <Link href={href}>
                    {routeNameMap[segment]}
                </Link>
            ),
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
