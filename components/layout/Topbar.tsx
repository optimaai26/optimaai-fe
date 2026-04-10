'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Bell,
    Menu,
    Moon,
    Search,
    Sun,
    Sparkles,
    LogOut,
    User,
    Settings,
    Globe,
    Building2,
    ChevronDown,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';
import { useUiStore } from '@/lib/stores/ui-store';
import { NAV_SECTIONS, ADMIN_NAV_ITEMS } from '@/constants/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { GlobalSearch } from '@/components/GlobalSearch';

/* ==========================================
 * Mobile Sidebar Drawer
 * ========================================== */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
    const pathname = usePathname();

    useEffect(() => {
        if (open) {
            onClose();
        }
    }, [pathname, open, onClose]);

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={onClose}
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] lg:hidden animate-slide-in-left">
                <div className="flex items-center h-16 px-4 border-b border-[var(--sidebar-border)]">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">
                            Optima<span className="text-primary-400">AI</span>
                        </span>
                    </Link>
                </div>
                <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    {NAV_SECTIONS.map((section) => (
                        <div key={section.label}>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                                {section.label}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                                isActive
                                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                            Administration
                        </p>
                        <div className="space-y-1">
                            {ADMIN_NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}

/* ==========================================
 * Topbar Component
 * ========================================== */
export function Topbar() {
    const { theme, setTheme } = useTheme();
    const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeMobileSidebar = useCallback(() => {
        setMobileSidebarOpen(false);
    }, [setMobileSidebarOpen]);

    // Close user menu on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <MobileDrawer open={mobileSidebarOpen} onClose={closeMobileSidebar} />

            <header className="sticky top-0 z-30 h-[var(--topbar-height)] border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex items-center justify-between h-full px-4 md:px-6">
                    {/* Left: Mobile toggle + Search */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                            aria-label="Open navigation"
                            suppressHydrationWarning
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <button 
                            onClick={() => useGlobalSearch.getState().toggle()}
                            className="hidden sm:flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-transparent shadow-sm text-muted-foreground w-64 transition-colors group cursor-pointer text-left"
                        >
                            <span className="flex items-center gap-2 text-sm group-hover:text-foreground transition-colors">
                                <Search className="w-4 h-4" />
                                Search...
                            </span>
                            <kbd className="hidden md:inline-flex text-[10px] font-mono bg-background rounded px-1.5 py-0.5 border border-border text-muted-foreground shadow-sm">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Toggle theme"
                            suppressHydrationWarning
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Notifications */}
                        <button
                            className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Notifications"
                            suppressHydrationWarning
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
                        </button>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
                                suppressHydrationWarning
                            >
                                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                                    U
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-12 w-56 rounded-xl bg-popover border border-border shadow-lg py-2 animate-fade-in">
                                    <div className="px-4 py-2 border-b border-border">
                                        <p className="text-sm font-medium">User Name</p>
                                        <p className="text-xs text-muted-foreground">user@company.com</p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <div className="border-t border-border mt-1 pt-1">
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 w-full text-sm text-danger hover:bg-muted transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <GlobalSearch />
        </>
    );
}
