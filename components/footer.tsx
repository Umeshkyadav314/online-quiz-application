"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Online Quiz Platform</h3>
                        <p className="text-sm text-muted-foreground">
                            Test your knowledge with our comprehensive quiz platform.
                            Challenge yourself with questions across various subjects and topics.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/quiz" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Take Quiz
                                </Link>
                            </li>
                            <li>
                                <Link href="/results" className="text-muted-foreground hover:text-foreground transition-colors">
                                    View Results
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Subjects */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Subjects</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/quiz?subject=mathematics" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Mathematics
                                </Link>
                            </li>
                            <li>
                                <Link href="/quiz?subject=science" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Science
                                </Link>
                            </li>
                            <li>
                                <Link href="/quiz?subject=history" className="text-muted-foreground hover:text-foreground transition-colors">
                                    History
                                </Link>
                            </li>
                            <li>
                                <Link href="/quiz?subject=general" className="text-muted-foreground hover:text-foreground transition-colors">
                                    General Knowledge
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>support@quizplatform.com</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>123 Quiz Street, Knowledge City</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        © 2024 Online Quiz Platform. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
