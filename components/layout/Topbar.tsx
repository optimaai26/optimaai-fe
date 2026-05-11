'use client';

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GlobalSearch } from '@/components/GlobalSearch';
import { useToast } from '@/components/ui/Toast';
import { NAV_SECTIONS } from '@/constants/navigation';
import { useAuth } from '@/features/auth/AuthProvider';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';

import { useUiStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils/cn';

/* ==========================================
 * Mobile Sidebar Drawer
 * ========================================== */
function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Close only when pathname *changes*, not immediately on open
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && open) {
      onClose();
    }
    prevPathnameRef.current = pathname;
  }, [pathname, open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden w-full h-full border-none cursor-default"
        aria-label="Close Sidebar"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] lg:hidden animate-slide-in-left">
        <div className="flex items-center h-20 px-4 border-b border-[var(--sidebar-border)]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/assets/logos/c3.svg" alt="OptimaAI Logo" className="h-12 w-auto" />
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { history, dismiss, clearHistory } = useToast();

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, [setMobileSidebarOpen]);

  const handleSignOut = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect platform for keyboard shortcut hint
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

  const userInitial = user?.name?.[0]?.toUpperCase() ?? 'U';

  return (
    <>
      <MobileDrawer open={mobileSidebarOpen} onClose={closeMobileSidebar} />

      <header className="sticky top-0 z-30 h-[var(--topbar-height)] border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-full px-4 md:px-6">
          {/* Left: Mobile toggle + Search */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Open navigation"
              suppressHydrationWarning
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => useGlobalSearch.getState().toggle()}
              className="hidden sm:flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-transparent shadow-sm text-muted-foreground w-64 transition-colors group cursor-pointer text-left"
            >
              <span className="flex items-center gap-2 text-sm group-hover:text-foreground transition-colors">
                <Search className="w-4 h-4" />
                Search...
              </span>
              <kbd
                className="hidden md:inline-flex text-[10px] font-mono bg-background rounded px-1.5 py-0.5 border border-border text-muted-foreground shadow-sm"
                suppressHydrationWarning
              >
                {shortcutLabel}
              </kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
              suppressHydrationWarning
            >
              {mounted ? (
                theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Notifications"
                aria-expanded={notifOpen}
                suppressHydrationWarning
              >
                <Bell className="w-5 h-5" />
                {history.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div
                  className="absolute right-0 top-12 w-80 rounded-xl bg-popover border border-border shadow-xl py-2 animate-fade-in z-50"
                  role="menu"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <p className="text-sm font-semibold">Notifications</p>
                    {history.length > 0 && (
                      <button
                        type="button"
                        onClick={() => clearHistory()}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <Bell className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    </div>
                  ) : (
                    <ul className="max-h-72 overflow-y-auto divide-y divide-border">
                      {history.map((t) => (
                        <li
                          key={t.id}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                        >
                          <span
                            className={cn(
                              'mt-0.5 w-2 h-2 rounded-full shrink-0',
                              t.type === 'success' && 'bg-success',
                              t.type === 'error' && 'bg-danger',
                              t.type === 'info' && 'bg-info',
                              t.type === 'loading' && 'bg-muted-foreground',
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{t.title}</p>
                            {t.message && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {t.message}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => dismiss(t.id)}
                            className="shrink-0 rounded-full p-1 hover:bg-muted transition-colors"
                            aria-label="Dismiss notification"
                          >
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
                suppressHydrationWarning
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
              >
                <div
                  className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold"
                  suppressHydrationWarning
                >
                  {userInitial}
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-12 w-56 rounded-xl bg-popover border border-border shadow-lg py-2 animate-fade-in"
                  role="menu"
                >
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium truncate">{user?.name ?? 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    role="menuitem"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 w-full text-sm text-danger hover:bg-muted transition-colors"
                      role="menuitem"
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
