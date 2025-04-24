"use client"

import { useState, useEffect } from "react"
import { HeartPulse, Pill, Stethoscope } from "lucide-react"

export default function DoctorCat() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [icon, setIcon] = useState<JSX.Element>(<HeartPulse className="h-6 w-6 text-pink-500" />)

  useEffect(() => {
    // Randomly change position every 5 seconds
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 80, // 0-80% of the screen width
        y: Math.random() * 80, // 0-80% of the screen height
      })

      // Randomly change the icon
      const icons = [
        <HeartPulse key="heart" className="h-6 w-6 text-pink-500" />,
        <Pill key="pill" className="h-6 w-6 text-blue-500" />,
        <Stethoscope key="stethoscope" className="h-6 w-6 text-green-500" />,
      ]

      setIcon(icons[Math.floor(Math.random() * icons.length)])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed z-10 transition-all duration-1000 ease-in-out"
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
        pointerEvents: "none", // Make sure it doesn't interfere with clicks
      }}
    >
      <div className="relative">
        <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
          <div className="w-12 h-12 relative">
            {/* Cat face */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center">
                {icon}
              </div>
              {/* Cat ears */}
              <div className="absolute -top-2 -left-1 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full transform rotate-45"></div>
              <div className="absolute -top-2 -right-1 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full transform -rotate-45"></div>
              {/* Cat eyes */}
              <div className="absolute top-3 left-3 w-1.5 h-2 bg-black rounded-full"></div>
              <div className="absolute top-3 right-3 w-1.5 h-2 bg-black rounded-full"></div>
              {/* Cat mouth */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
            </div>
          </div>
        </div>
        {/* Doctor hat */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-white dark:bg-blue-600 rounded-t-md"></div>
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-red-500 dark:bg-red-600 rounded-full"></div>
      </div>
    </div>
  )
}
