"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import EmergencyButton from "@/components/emergency-button"
import { Heart } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [familyId, setFamilyId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login - in a real app, this would connect to your auth service
    setTimeout(() => {
      // Mock successful login
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ email, familyId: "FAM12345" }))
      }
      router.push("/home")
      setLoading(false)
    }, 1000)
  }

  const handleFamilyIdLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login with family ID
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ familyId }))
      }
      router.push("/home")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-100 dark:from-pink-800 dark:to-pink-700"></div>
              <Heart className="relative z-10 h-12 w-12 text-pink-600 dark:text-pink-300 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-400">Welcome to Wellnest</h1>
          <p className="text-slate-600 dark:text-slate-300">Connect, coordinate, and care for your family</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email Login</TabsTrigger>
            <TabsTrigger value="family">Family ID</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Login with Email</CardTitle>
                <CardDescription>Sign in with your email or create a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="#" className="text-pink-500 hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle>Join with Family ID</CardTitle>
                <CardDescription>Enter your family ID to join your family&apos;s space</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFamilyIdLogin}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="familyId">Family ID</Label>
                      <Input
                        id="familyId"
                        placeholder="e.g. FAM12345"
                        value={familyId}
                        onChange={(e) => setFamilyId(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-400 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? "Joining..." : "Join Family"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-4 right-4">
        <EmergencyButton />
      </div>
    </div>
  )
}
