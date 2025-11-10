"use client";
import TaskGrid from "@/components/task-grid";
import { Rootstate } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  const { user_name, role } = useSelector((state: Rootstate) => state.user);
  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      {/* <MainCard /> */}
      <TaskGrid />
    </main>
  );
};

export default page;
