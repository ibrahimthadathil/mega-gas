"use client"
import TaskCard from "./task-card"

export default function TaskGrid() {
  const tasks = [
    {
      id: 1,
      title: "Completed Tasks",
      icon: "📋",
      color: "text-yellow-600",
    },
    {
      id: 2,
      title: "Update Hose Pipe",
      icon: "⚙️",
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Service Area Task",
      icon: "🏗️",
      color: "text-green-600",
    },
    {
      id: 4,
      title: "Update Mobile No.",
      icon: "📱",
      color: "text-purple-600",
    },
    {
      id: 5,
      title: "DBC",
      icon: "🛢️",
      color: "text-orange-600",
    },
    {
      id: 6,
      title: "LERC Tight Joint change",
      icon: "🔧",
      color: "text-yellow-600",
    },
    {
      id: 7,
      title: "E-KYC",
      icon: "🔐",
      color: "text-purple-600",
    },
    {
      id: 8,
      title: "NFR Sale",
      icon: "📊",
      color: "text-purple-600",
    },
    {
      id: 9,
      title: "Product Upliftment",
      icon: "📈",
      color: "text-yellow-600",
    },
    {
      id: 10,
      title: "Service Log",
      icon: "📋",
      color: "text-blue-600",
    },
    {
      id: 11,
      title: "Loyalty Onboarding",
      icon: "🎁",
      color: "text-yellow-600",
    },
    {
      id: 12,
      title: "Sampark",
      icon: "📱",
      color: "text-[#FF8C42]",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
