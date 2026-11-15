"use client";
import { navItem } from "@/constants/navItem";
import { useAuth } from "@/contexts/hooks/useAuth";
import { logoutUser } from "@/features/auth/api/logout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { user, isLoading } = useAuth();

  if (isLoading || !user) return null;

  const filteredNavItems = navItem.filter((item) =>
    item.allowedRoles.includes(user.role),
  );

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully!");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav>
      <button
        className="lg:hidden absolute top-6 left-4 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10"
        onClick={() => setIsOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-menu"
          aria-hidden="true"
        >
          <path d="M4 5h16"></path>
          <path d="M4 12h16"></path>
          <path d="M4 19h16"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50  flex flex-col transform transition-transform duration-300  
            ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="px-5 pt-6 pb-5 border-b border-white/6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-user text-white size-7"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <div>
                <p className="font-semibold text-[13px] text-white tracking-wide">
                  Employee MS
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Management System
                </p>
              </div>
            </div>

            <button
              className="lg:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
                aria-hidden="true"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Profile info */}
        <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/3 border border-white/4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0">
              <span className="text-slate-400 text-xs font-semibold">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-200 truncate">
                Admin
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Administrator
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Navigation
          </p>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const href = item.href[user.role];

            if (!href) return null;
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                href={href}
                key={href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${
                  isActive
                    ? "bg-indigo-500/12 text-indigo-300"
                    : "text-slate-300 hover:text-white hover:bg-white/4"
                }`}
              >
                <div className="flex  gap-3">
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500"></div>
                  )}
                  {item.icon}
                  {item.label}
                </div>
                {isActive && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right w-3.5 h-3.5 text-indigo-500/50"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/6 ">
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150 cursor-pointer"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out w-[17px] h-[17px]"
              aria-hidden="true"
            >
              <path d="m16 17 5-5-5-5"></path>
              <path d="M21 12H9"></path>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </nav>
  );
};

export default Menu;
