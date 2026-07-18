"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Bell, Search, Menu, X,
  Sun, Moon, Monitor, Check,
  GraduationCap,
} from "lucide-react";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":               "Dashboard",
  "/companies":               "Companies",
  "/applications":            "My Applications",
  "/oa-tracker":              "OA Tracker",
  "/analytics":               "Analytics",
  "/coordinator":             "Coordinator Portal",
  "/coordinator/companies":   "Manage Companies",
  "/coordinator/companies/new": "Add Company",
  "/coordinator/students":    "Student Statistics",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [route, title] of Object.entries(PAGE_TITLES)) {
    if (route !== "/" && pathname.startsWith(route)) return title;
  }
  return "PlaceTrack";
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const options = [
    { value: "light" as const,  label: "Light",  Icon: Sun },
    { value: "dark" as const,   label: "Dark",   Icon: Moon },
    { value: "system" as const, label: "System", Icon: Monitor },
  ];

  const CurrentIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <CurrentIcon className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        {options.map(({ value, label, Icon }) => (
          <button
            key={value}
            onClick={() => { setTheme(value); setOpen(false); }}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              theme === value && "text-primary font-medium"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {theme === value && <Check className="h-3 w-3 ml-auto" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

// ─── Notifications Panel ─────────────────────────────────────────────────────
function NotificationsPanel() {
  const { data } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();
  const [open, setOpen] = useState(false);

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const NOTIF_ICONS: Record<string, string> = {
    DEADLINE: "⏰",
    ANNOUNCEMENT: "📢",
    STAGE_UPDATE: "📋",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-2xs font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-2xs px-1.5 py-0">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => markAllRead.mutate()}
              isLoading={markAllRead.isPending}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium text-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground mt-0.5">No new notifications</p>
            </div>
          )}

          {notifications.map((notif, index) => (
            <div key={notif.id}>
              <button
                onClick={() => {
                  if (!notif.read) markRead.mutate(notif.id);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 transition-colors hover:bg-muted/50",
                  !notif.read && "bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5 shrink-0">
                    {NOTIF_ICONS[notif.type] ?? "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-xs leading-relaxed text-foreground line-clamp-2",
                      !notif.read && "font-medium"
                    )}>
                      {notif.message}
                    </p>
                    <p className="text-2xs text-muted-foreground mt-1">
                      {formatRelativeDate(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                </div>
              </button>
              {index < notifications.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-xl border border-border bg-popover shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="search"
            placeholder="Search companies, roles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded border border-border font-mono"
          >
            ESC
          </button>
        </div>
        <div className="px-4 py-8 text-center">
          <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {query ? `Searching for "${query}"...` : "Start typing to search"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main TopBar ─────────────────────────────────────────────────────────────
interface TopBarProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function TopBar({ onMenuToggle, isMobileMenuOpen }: TopBarProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4 shrink-0 sticky top-0 z-30">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen
            ? <X className="h-4 w-4" />
            : <Menu className="h-4 w-4" />
          }
        </button>

        {/* Mobile logo (hidden on desktop — sidebar has it) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <GraduationCap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">PlaceTrack</span>
        </div>

        {/* Page title — desktop only */}
        <h1 className="hidden lg:block text-sm font-semibold text-foreground flex-1 truncate">
          {pageTitle}
        </h1>

        <div className="flex-1 lg:flex-none" />

        {/* Search button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 h-8 rounded-lg border border-border bg-muted/50 px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search (⌘K)"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search...</span>
          <kbd className="hidden xl:inline-flex items-center rounded border border-border bg-background px-1.5 text-2xs font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Mobile search icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationsPanel />
      </header>

      {/* Search overlay */}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
