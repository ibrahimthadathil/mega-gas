"use client";
import { RotateCcw } from "lucide-react";
import Image from "next/image";

export default function MainCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Section - Character and Info */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          {/* Character Illustration */}
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
            <Image
              src="/image.png"
              alt="Delivery person"
              className="w-[90%] h-[90%] object-fit"
            />
          </div>
          <p className="text-gray-600 text-sm md:text-base mb-4 text-center md:text-left">
            Total no. of cylinder deliveries and installation for the day.
          </p>

          {/* Stats */}
          <div className="w-full space-y-2">
            <div className="flex justify-between md:block md:mb-2">
              <span className="font-semibold text-gray-800">Delivery -0</span>
            </div>
            <div className="flex justify-between md:block">
              <span className="font-semibold text-gray-800">
                Installation -0
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Your Tasks Circle */}
        <div className="md:col-span-1 flex justify-center items-center">
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              {/* Outer circle with border */}
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="#FF8C42"
                strokeWidth="4"
              />
              {/* Background circle */}
              <circle cx="100" cy="100" r="92" fill="#FFF5F0" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-gray-800 font-semibold text-lg md:text-xl">
                Your Tasks
              </p>
              <p className="text-5xl md:text-6xl font-bold text-[#FF8C42]">
                18
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Payment Info */}
        <div className="md:col-span-1 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-semibold">Cash / MD</span>
              <span className="text-green-600 font-bold text-lg">0 / 0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-semibold">Digital</span>
              <span className="text-green-600 font-bold text-lg">0</span>
            </div>
          </div>

          {/* Last Synced */}
          <div className="mt-6 bg-orange-100 rounded-xl p-4 flex items-center gap-3">
            <RotateCcw size={20} className="text-[#FF8C42] flex-shrink-0" />
            <p className="text-sm text-gray-800">
              Last Synced at 02:54 PM on 10 Nov&apos;25
            </p>
          </div>

          {/* Status Badges */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
              <span>00</span>
              <span className="hidden sm:inline">Error</span>
            </div>
            <div className="bg-[#FF8C42] text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
              <span>00</span>
              <span className="hidden sm:inline">Pending</span>
            </div>
            <button className="bg-[#FF8C42] text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-orange-600 transition-colors">
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
