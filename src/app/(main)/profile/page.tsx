"use client";

import { Card, Avatar, Tag, Button, Row, Col, Spin, List } from "antd";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
    const { profile, classes, loading } = useProfile();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center text-gray-500 mt-20">Profile not found</div>
        );
    }

    const isInstructor = profile.role === "instructor";

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
                <div className="flex items-center gap-4">
                    <Avatar size={72}>
                        {profile.name?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">{profile.name || "—"}</h2>
                        <p className="text-gray-500">{profile.email || "—"}</p>

                        <div className="mt-2">
                            <Tag color={isInstructor ? "blue" : "green"}>
                                {profile.role || "user"}
                            </Tag>
                        </div>
                    </div>

                    <Button type="primary">Edit</Button>
                </div>
            </Card>

            {/* Info + Classes */}
            <Row gutter={16} align="stretch">
                <Col xs={24} md={12} className="flex">
                    <Card title="Personal Information" className="w-full h-full">
                        <InfoRow label="Phone" value={profile.phone} />
                        <InfoRow label="Address" value={profile.address} />
                        <InfoRow label="Email" value={profile.email} />
                    </Card>
                </Col>

                <Col xs={24} md={12} className="flex">
                    <Card
                        title={isInstructor ? "Classes You Created" : "Classes You Joined"}
                        className="w-full h-full"
                    >
                        <List
                            dataSource={classes}
                            locale={{ emptyText: "No classes" }}
                            renderItem={(item) => (
                                <List.Item>
                                    <span className="font-medium">{item.name || item.id}</span>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium">{value || "—"}</span>
        </div>
    );
}
