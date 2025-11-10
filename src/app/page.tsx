"use Client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#FF8C42] border-b-blue-800 border-b-8 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5">
          {/* Center - Logo/Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            IndianOil
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-168px)] px-6 py-12 sm:px-12 gap-8">
        <div className="flex flex-col items-center gap-6 text-center max-w-3xl">
          {/* Main Heading */}
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
            <img
              src="/image.png"
              alt="Delivery person"
              className="w-[90%] h-[90%] object-fit"
            />
          </div>
          <Button className="bg-white border p-3 text-black">
            <Link href="/user/login">Get Start </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-black py-8 px-6 sm:px-12 text-center">
        <p className="text-sm">
          © 2025 MEGA INDANE. All rights reserved. Powering India's Future.
        </p>
      </footer>
    </div>
  );
}
