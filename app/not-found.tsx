import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, HeartPulse } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
              <HeartPulse className="h-12 w-12 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-pink-600 dark:text-pink-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/login">
            <Button className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800">
              <Home className="mr-2 h-4 w-4" />
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
