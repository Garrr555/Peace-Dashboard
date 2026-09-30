/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useLocation } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { navItems } from "../data/navItems";
import LogoutModal from "./LogoutModal";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const items = navItems(user?.role ?? "");

  useEffect(() => {
    setUserName(user?.name ?? "");
  }, []);

  //close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="p-5 border-b border-white/6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserIcon className="text-white size-7" />
            <div>
              <p className="font-semibold text-[13px] text-white tracking-wide">
                Peace Dashboard
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Management System
              </p>
            </div>
          </div>
          {/* Close Button on Mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 p-1 hover:text-white"
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      {userName && (
        <div className="mx-3 mb-4 mt-1 p-3 rounded-lg bg-white/3 border border-white-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0">
              <span className="text-slate-400 text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w0">
              <p className="text-[13px] font-medium text-slate-200 truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.role === "admin" ? "Admin" : "Member"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Navigation
        </p>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {items.map((item, i) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={i}
              to={item.href}
              className={`group flex items-center gap-3 p-3 rounded-md text-[13px] font-medium transition-all duration-150 relative
                ${isActive ? "bg-indigo-500/12 text-indigo-300" : "text-slate-300 hover:text-white hover:bg-white/4"}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-indigo-500" />
              )}
              <item.icon
                className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-300"}`}
              />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500/50" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-white/6">
        <button
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-3 p-3 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/8 transition-all duration-150"
        >
          <LogOutIcon className="w-[17px] h-[17px]" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {logoutOpen && <LogoutModal setLogoutOpen={setLogoutOpen} />}

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10"
      >
        <MenuIcon size={20} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar - Dekstop */}
      <aside className="hidden lg:flex flex-col h-full w-[260px] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-linear-to-b rom-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
