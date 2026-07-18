"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, FileText, Code2,
  BarChart3, ShieldCheck, GraduationCap, LogOut,
  ChevronRight, Map,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard",       href: "/dashboard",    icon: LayoutDashboard },
  { label: "Companies",       href: "/companies",    icon: Building2 },
  { label: "My Applications", href: "/applications", icon: FileText },
  { label: "OA Tracker",      href: "/oa-tracker",   icon: Code2 },
  { label: "Analytics",       href: "/analytics",    icon: BarChart3 },
  { label: "Prep Roadmap",    href: "/roadmap",      icon: Map },
] as const;

const COORDINATOR_NAV_ITEMS = [
  { label: "Coordinator Portal", href: "/coordinator", icon: ShieldCheck },
] as const;

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user, isCoordinator, isAdmin, signOut } = useAuth();
  const showCoordinatorSection = isCoordinator || isAdmin;

  return (
    <aside className="flex h-full flex-col" style={{ background: "hsl(var(--sidebar-bg))" }}>
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 shrink-0" style={{ borderBottom: "1px solid hsl(var(--sidebar-border))" }}>
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shrink-0">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold" style={{ color: "hsl(var(--sidebar-fg))" }}>
          PlaceTrack
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" role="navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn("sidebar-item", isActive && "active")}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-50" aria-hidden="true" />}
            </Link>
          );
        })}

        {showCoordinatorSection && (
          <>
            <div className="mx-3 my-3" style={{ height: "1px", background: "hsl(var(--sidebar-border))" }} />
            <p className="px-3 pb-1 text-2xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--sidebar-muted))" }}>
              Admin
            </p>
            {COORDINATOR_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn("sidebar-item", isActive && "active")}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User + sign out */}
      <div className="shrink-0 p-3" style={{ borderTop: "1px solid hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2 mb-1">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
          >
            {user?.name ? getInitials(user.name) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium" style={{ color: "hsl(var(--sidebar-fg))" }}>
              {user?.name ?? "Loading..."}
            </p>
            <p className="truncate text-2xs" style={{ color: "hsl(var(--sidebar-muted))" }}>
              {user?.branch ?? ""}{user?.graduationYear ? ` · ${user.graduationYear}` : ""}
            </p>
          </div>
        </div>
        <button onClick={() => void signOut()} className="sidebar-item w-full text-left" aria-label="Sign out">
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
