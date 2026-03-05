'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plane,
  Users,
  Search,
  LogOut,
  Shield,
  Mail,
  Phone,
  Calendar,
  ArrowLeft
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  age?: number
  address?: string
  createdAt: string
  bookings: any[]
}

function getAdminFromStorage() {
  if (typeof window === 'undefined') return null
  const adminData = localStorage.getItem('admin')
  return adminData ? JSON.parse(adminData) : null
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<any>(() => getAdminFromStorage())
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!admin) {
      router.push('/admin/login')
      return
    }
    
    let isMounted = true
    
    async function loadUsers() {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok && isMounted) {
          const data = await response.json()
          setUsers(data.users)
        }
      } catch (error) {
        console.error('Failed to fetch users')
      }
    }
    
    loadUsers()
    
    return () => {
      isMounted = false
    }
  }, [admin, router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!admin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TravelTour Pro - Admin</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
            <Link href="/admin/users" className="text-blue-400 font-medium">Users</Link>
            <Link href="/admin/bookings" className="text-white/70 hover:text-white">Bookings</Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <span className="text-white/70">Welcome, {admin.name || 'Admin'}</span>
            <Button variant="ghost" onClick={handleLogout} className="text-white/70 hover:text-white">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Registered Users</h1>
          <p className="text-white/60">View and manage all registered users</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-white/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-white/20 mb-4" />
                <p className="text-white/60">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-4 text-white/60 font-medium">Name</th>
                      <th className="text-left p-4 text-white/60 font-medium">Email</th>
                      <th className="text-left p-4 text-white/60 font-medium">Phone</th>
                      <th className="text-left p-4 text-white/60 font-medium">Age</th>
                      <th className="text-left p-4 text-white/60 font-medium">Bookings</th>
                      <th className="text-left p-4 text-white/60 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/80">{user.email}</td>
                        <td className="p-4 text-white/80">{user.phone || '-'}</td>
                        <td className="p-4 text-white/80">{user.age || '-'}</td>
                        <td className="p-4">
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {user.bookings?.length || 0}
                          </Badge>
                        </td>
                        <td className="p-4 text-white/60">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
