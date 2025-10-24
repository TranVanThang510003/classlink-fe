"use client";

import ManageStudentPage from "@/pages/ManageStudentPage";
import {message} from "antd";
import {useEffect} from "react";
import toast from "react-hot-toast";

export default function Page() {
  useEffect(() => {
    toast.success("✅ React Hot Toast hoạt động!");
  }, []);

  return <ManageStudentPage />;
}
