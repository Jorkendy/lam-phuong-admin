"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/auth";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: string[]; // Roles that can access this item
}

const allNavItems: NavItem[] = [
  {
    title: "Bảng điều khiển",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Địa điểm",
    href: "/locations",
    icon: MapPin,
  },
  {
    title: "Người dùng",
    href: "/users",
    icon: Users,
    requiredRole: ["Admin", "Super Admin"],
  },
];

interface SidebarProps {
  user?: User | null;
}

const SIDEBAR_STATE_KEY = "lp_sidebar_collapsed";

export function Sidebar({ user }: SidebarProps = {}) {
  const pathname = usePathname();
  
  // Initialize state from localStorage using lazy initialization
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState !== null) {
      try {
        return JSON.parse(savedState);
      } catch {
        return false;
      }
    }
    return false;
  });

  // Filter nav items based on user role
  const navItems = useMemo(() => {
    return allNavItems.filter((item) => {
      // If no requiredRole, item is accessible to all
      if (!item.requiredRole) {
        return true;
      }
      // If user is not logged in, hide restricted items
      if (!user || !user.role) {
        return false;
      }
      // Check if user's role is in the required roles
      return item.requiredRole.includes(user.role);
    });
  }, [user]);

  // Save sidebar state to localStorage when it changes
  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(newState));
  };

  return (
    <aside
      className={cn(
        "relative border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b px-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Lam Phương</h2>
          )}
          {isCollapsed && (
            <div className="mx-auto rounded-lg bg-primary p-2">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="w-full"
            title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}

