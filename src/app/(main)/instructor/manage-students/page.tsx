"use client";

import { FaSearch } from "react-icons/fa";
import { useState } from 'react'
import AddStudentForm from "@/components/intructor/ManageStudents/AddStudentForm";
import StudentTable from "@/components/intructor/ManageStudents/StudentTable";
const ManageStudentPage = () => {
  const [showForm, setShowForm] = useState(false)

  const handleAddClick=()=> {
    setShowForm(true)
  }
  const handleCloseForm=()=>{
    setShowForm(false)
  }
  return (
      <div className="flex flex-col ">
        <h2 className="text-left font-semibold text-3xl mb-6" >Manage Student</h2>
        <div className="flex justify-between p-4  border-1 border-gray-100">
          <div className="text-2xl font-bold">4 students</div>
          <div className="flex gap-2">
            <button className=" text-blue-600 font-semibold bg-blue-50 rounded-sm border border-blue-500 px-4 py-2 " onClick={handleAddClick}>+ Add Student</button>
            <div className=" flex gap-2 bg-gray-50 rounded-sm border border-gray-400  px-4 py-2 items-center justify-center ">
              <FaSearch/>
              <div className="text-gray-700 font-normal "> filter</div>
            </div>
          </div>

        </div>
        <div className="w-full ">
          <StudentTable/>
        </div>

        {/* Form add student*/}
        {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white p-8 rounded-2xl w-full max-w-3xl relative shadow-lg animate-slideUp">
                <button
                    onClick={handleCloseForm}
                    className="absolute top-3 right-4 text-gray-500 hover:text-black text-3xl font-semibold"
                >
                  ×
                </button>
                <AddStudentForm />
              </div>
            </div>
        )}

      </div>
  )
}
export default ManageStudentPage