import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-12 sm:py-8 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">MI</span>
          </div>
          <h2 className="text-xl font-bold text-black hidden sm:block">
            MEGA INDANE
          </h2>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12 sm:px-12 gap-8">
        <div className="flex flex-col items-center gap-6 text-center max-w-3xl">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black text-balance">
              MEGA INDANE
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-medium">
              Powering India's Energy Future
            </p>
          </div>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl">
            Welcome to MEGA INDANE, your trusted partner in clean, reliable gas
            energy. We're committed to delivering excellence and sustainability
            to every home and business across India.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white px-8"
            >
              <Link href="/admin"> Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-black text-black hover:bg-gray-100 px-8 bg-white"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl pt-12">
          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">
              Reliable Supply
            </h3>
            <p className="text-sm text-gray-600">
              24/7 consistent and dependable gas supply for your needs
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">
              Eco-Friendly
            </h3>
            <p className="text-sm text-gray-600">
              Sustainable energy solutions for a greener tomorrow
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">
              Safety First
            </h3>
            <p className="text-sm text-gray-600">
              Industry-leading safety standards and certifications
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6 sm:px-12 text-center">
        <p className="text-sm">
          © 2025 MEGA INDANE. All rights reserved. Powering India's Future.
        </p>
      </footer>
    </div>
  );
}
