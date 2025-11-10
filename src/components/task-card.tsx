"use client"

interface Task {
  id: number
  title: string
  icon: string
  color: string
}

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 md:p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
      {/* Icon */}
      <div className="text-4xl md:text-5xl mb-3 md:mb-4">{task.icon}</div>

      {/* Title */}
      <p className="text-center text-sm md:text-base font-semibold text-gray-800 leading-tight">{task.title}</p>
    </div>
  )
}
