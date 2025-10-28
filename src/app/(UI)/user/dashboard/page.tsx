"use client";
import { Rootstate } from '@/redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

const page = () => {
    const {user_name,role } = useSelector((state:Rootstate)=>state.user )
  return (
    <div>
      <h1 className='text-red-500'>{user_name || 'no user'} </h1>
      <h2>{role}</h2>

    </div>
  )
}

export default page

