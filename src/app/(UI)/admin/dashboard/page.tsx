"use client";
import { selectAuth } from "@/redux/store/selectors/authSelectors";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  const admin = useSelector(selectAuth)
  return (
    <>
    <h1>{admin.user_name}</h1>
    <h1>{admin.role}</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </>
  );
};

export default page;
