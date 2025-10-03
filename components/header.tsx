"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Upload, BarChart3 } from "lucide-react"

export default function Header() {
    const [user, setUser] = useState<{ email: string; role?: string; profileImage?: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user)
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            setUser(null)
            router.push('/')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const handleProfileImageUpload = async (file: File) => {
        if (!user) return

        const formData = new FormData()
        formData.append('profileImage', file)

        try {
            const response = await fetch('/api/user/profile-image', {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const data = await response.json()
                setUser(prev => prev ? { ...prev, profileImage: data.profileImage } : null)
            }
        } catch (error) {
            console.error('Profile image upload failed:', error)
        }
    }

    if (loading) {
        return (
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="font-semibold text-lg">
                        Online Quiz
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="font-semibold text-lg">
                    Online Quiz
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/quiz">
                                <Button variant="outline" size="sm">
                                    Take Quiz
                                </Button>
                            </Link>

                            {user.role === 'admin' && (
                                <Link href="/admin">
                                    <Button variant="outline" size="sm">
                                        Admin Dashboard
                                    </Button>
                                </Link>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.profileImage} alt={user.email} />
                                            <AvatarFallback>
                                                {user.email.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <div className="flex flex-col space-y-1 p-2">
                                        <p className="text-sm font-medium leading-none">{user.email}</p>
                                        {user.role && (
                                            <p className="text-xs leading-none text-muted-foreground capitalize">
                                                {user.role}
                                            </p>
                                        )}
                                    </div>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <label className="flex items-center cursor-pointer">
                                            <Upload className="mr-2 h-4 w-4" />
                                            <span>Upload Photo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleProfileImageUpload(file)
                                                }}
                                            />
                                        </label>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/results" className="flex items-center">
                                            <BarChart3 className="mr-2 h-4 w-4" />
                                            <span>My Results</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm hover:underline transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className="text-sm hover:underline transition-colors">
                                Register
                            </Link>
                        </>
                    )}

                    <div className="w-px h-4 bg-border"></div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
