"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Trophy,
  Moon,
  Sun,
  CircleUser,
  GitPullRequestArrow,
  LucideHome,
  Joystick,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Navigation() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useUser();
  const username = user ? user.given_name || user.nickname || user.name || "User" : "Guest";

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { label: "Home", icon: LucideHome, onClick: () => router.push("/") },
    { label: "Play The Game", icon: Joystick, onClick: () => router.push("/game") },
    { label: "Profile", icon: CircleUser, onClick: () => router.push("/profile") },
    { label: "Leaderboard", icon: Trophy, onClick: () => router.push("/leaderboard") },
    { label: "Contributors", icon: GitPullRequestArrow, onClick: () => router.push("/contributors") },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-border/60 bg-background/85 px-3 backdrop-blur-md sm:px-6 lg:px-8 h-[var(--nav-height)] flex items-center justify-between">
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="hidden min-w-0 text-sm lg:block">
          <span className="hidden xl:inline">Logged in as: </span>
          <kbd className="inline-block max-w-32 truncate rounded border border-primary/20 bg-primary/10 px-2 py-1">{username}</kbd>
        </span>
        {isLoading ? null : user ? (
          <a
            href="/auth/logout"
            className="min-h-10 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:text-sm"
          >
            Log out
          </a>
        ) : (
          <a
            href="/auth/login"
            className="min-h-10 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:px-4 sm:text-sm"
          >
            Sign in
          </a>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden items-center gap-1 md:flex">
        {navItems.map(({ label, icon: Icon, onClick }) => (
          <Button
            key={label}
            variant="ghost"
            size="sm"
            className="gap-2 px-2.5 text-primary hover:bg-accent hover:text-accent-foreground lg:px-3"
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden lg:inline">{label}</span>
          </Button>
        ))}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-accent hover:text-accent-foreground"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="absolute left-0 top-[var(--nav-height)] w-full border-b border-border/60 bg-background p-3 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-md flex-col gap-1">
          {navItems.map(({ label, icon: Icon, onClick }) => (
            <Button
              key={label}
              variant="ghost"
              className="min-h-11 w-full justify-start text-primary hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                onClick();
                setMobileOpen(false);
              }}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </Button>
          ))}

          {/* Theme Toggle Mobile */}
          <Button
            variant="ghost"
            className="min-h-11 w-full justify-start text-primary hover:bg-accent hover:text-accent-foreground"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="ml-2">Toggle Theme</span>
          </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
