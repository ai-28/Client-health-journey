"use client";

import React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { BookMarked, User } from "lucide-react";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";
import {
  adminNavItems,
  clinicAdminNavItems,
  coachNavItems,
  clientNavItems,
} from "./sidebardata";
import { useAuth } from "@/app/context/AuthContext";
import { useClinic } from "@/app/context/ClinicContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
const defaultLogo = "/assets/logo(2).png";

export function Sidebar({ mobileOpen = false, onClose }) {
  const { user } = useAuth();
  const { clinic } = useClinic();
  const router = useRouter();
  // Use clinic logo if available, otherwise fallback to default
  const logo = clinic?.logoUrl || defaultLogo;
console.log("logo",logo)
  // Sidebar content
  const sidebarContent = !user ? (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50 border-r border-gray-200">
      <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
    </div>
  ) : (
    <div
      className={cn(
        "flex flex-col h-screen border-r w-full sm:w-72 w-64 transition-all duration-300 ease-in-out bg-white",
        mobileOpen
          ? "fixed z-50 top-0 left-0 h-screen w-[80vw] max-w-[320px] bg-white shadow-lg translate-x-0 sm:static sm:translate-x-0 block border-gray-200"
          : "-translate-x-full sm:translate-x-0 sm:static hidden sm:flex border-gray-200"
      )}
      style={mobileOpen ? {} : {}}>
      {/* Simple header */}
      <div className="flex items-center justify-between h-20 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 group mx-auto">
          <img
            src={logo}
            alt="Client Health Tracker"
            className="h-18 w-auto p-2"
          />
        </div>
        {/* Close button for mobile drawer */}
        {mobileOpen && (
          <button 
            onClick={onClose} 
            className="sm:hidden ml-auto p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-200"
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Navigation section */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNav
          items={
            user.role === "admin"
              ? adminNavItems
              : user.role === "clinic_admin"
              ? clinicAdminNavItems
              : user.role === "coach"
              ? coachNavItems
              : clientNavItems
          }
        />
      </div>
      
      {/* Profile section - fixed at bottom */}
      <div className="flex-shrink-0">
        <SidebarProfile
          user={user}
          userRole={user.role}
          roleIcon={User}
        />
      </div>
      <div className="text-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => router.push("https://clienthealthtracker.com")}>
        Powered by <span className="text-blue-500 font-bold">Client Health Tracker</span>
      </div>
    </div>
  );

  return sidebarContent;
}
