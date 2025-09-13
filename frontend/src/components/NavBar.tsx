"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react"; // add logout icon
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";// custom auth hook

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/swot", label: "SWOT" },
  { href: "/progress", label: "Progress" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutUser } = useAuth(); // assume your context provides this
  const [open, setOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const handleLogout = async () => {
    await logoutUser(); // call API + clear auth state
    router.push("/login");
  };

  return (
    <header className="border-b bg-card shadow-sm sticky top-0 z-50">
      <nav
        className="container mx-auto flex items-center justify-between p-4"
        role="navigation"
        aria-label="Main"
      >
        {/* Brand / Home Link */}
        <Link
          href="/"
          className="font-bold text-lg text-primary hover:opacity-80 transition"
        >
          SwotCoach
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative px-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="active-underline"
                      className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary rounded"
                    />
                  )}
                </Link>
              </li>
            );
          })}

          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-primary focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col gap-4 px-4 pb-4"
          >
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block text-sm font-medium transition-colors hover:text-primary ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}

            {/* Mobile Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-1 rounded px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
