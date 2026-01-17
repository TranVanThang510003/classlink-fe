"use client";

import { App as AntdApp } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function AntdProvider({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <AntdRegistry>
            <AntdApp>
                {children}
            </AntdApp>
        </AntdRegistry>
    );
}
