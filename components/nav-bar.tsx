"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Settings } from "lucide-react"

export default function NavBar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 z-[100] w-full h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        <Link
          href="/home"
          className={`inline-flex flex-col items-center justify-center px-5 ${
            isActive("/home")
              ? "text-pink-600 dark:text-pink-400"
              : "text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
          }`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/calendar"
          className={`inline-flex flex-col items-center justify-center px-5 ${
            isActive("/calendar")
              ? "text-pink-600 dark:text-pink-400"
              : "text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
          }`}
        >
          <Calendar className="w-6 h-6 mb-1" />
          <span className="text-xs">Calendar</span>
        </Link>
        <Link
          href="/settings"
          className={`inline-flex flex-col items-center justify-center px-5 ${
            isActive("/settings")
              ? "text-pink-600 dark:text-pink-400"
              : "text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
          }`}
        >
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </div>
  )
}
