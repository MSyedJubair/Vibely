"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  Settings,
  ChevronDown,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "./ui/button";

const SideBar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const trpc = useTRPC();
  const {
    data: User,
    isLoading,
    isError,
  } = useQuery(trpc.user.getUser.queryOptions());

  return (
    <aside
      className={`border-r border-white/10 bg-app-bg/80 backdrop-blur-xl flex-col justify-between hidden md:flex transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div>
        <div
          className={`p-6 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} gap-2`}
        >
          <div className="flex items-center gap-3 cursor-pointer overflow-hidden">
            <div className="bg-linear-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-semibold text-xl tracking-tight whitespace-nowrap">
                Open<span className="text-white/50">Clone</span>
              </span>
            )}
          </div>
        </div>

        <nav className="px-4 space-y-2 mt-8">
          <Link
            href="/"
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-4"} px-3 py-3 bg-white/5 rounded-xl text-sm font-medium text-white transition-colors group`}
          >
            <LayoutDashboard className="w-5 h-5 text-indigo-400 shrink-0" />
            {!isSidebarCollapsed && <span>Overview</span>}
          </Link>
          <Link
            href="/projects"
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-4"} px-3 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors`}
          >
            <FolderKanban className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Projects</span>}
          </Link>
          <Link
            href="/domains"
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-4"} px-3 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors`}
          >
            <Globe className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Domains</span>}
          </Link>
          <Link
            href="/settings"
            className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-4"} px-3 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Settings</span>}
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 flex flex-col gap-4">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex items-center justify-end p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        {/* ✅ LOADING */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        )}

        {/* ❌ NOT LOGGED IN */}
        {!isLoading && (!User || isError) && <div></div>}

        {/* ✅ LOGGED IN */}
        {!isLoading && User && (
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center" : "gap-3"
            } p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-medium shrink-0">
              {User.name?.[0]?.toUpperCase()}
            </div>

            {!isSidebarCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-between w-full outline-none">
                  <div className="flex flex-col items-start min-w-0">
                    <p className="text-sm font-medium truncate text-zinc-200">
                      {User.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </DropdownMenuTrigger>

                <DropdownMenuContent side="top" className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      authClient.signOut();
                      toast("Successfully Signed Out");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
