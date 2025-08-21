"use client";

import React from "react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Bell, Settings, LogOut, Menu, BookMarked } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect,useState } from "react";

const defaultLogo = "/assets/logo(1).jpg";

const TopBar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [clinicName, setClinicName] = useState("");
  
  // Use clinic logo if available, otherwise fallback to default
  const logo = defaultLogo;
  useEffect(() => {
    const fetchClinicName = async () => {
      const response = await fetch("/api/clinic/clinicName", {
        method: "POST",
        body: JSON.stringify({ clinicId: user?.clinic }),
      });
      const data = await response.json();
      setClinicName(data.clinicName);
    };
    fetchClinicName();
  }, [user]);

  const onSetting = () => {
    if (user?.role === "admin") {
      router.push("/admin/settings");
    } else if (user?.role === "client") {
      router.push("/client/profile");
    } else if (user?.role === "coach") {
      router.push("/coach/settings");
    } else if (user?.role === "clinic") {
      router.push("/clinic/settings");
    }
  };
  
  // Extract first name from user's full name
  const firstName = user?.name ? user.name.split(" ")[0] : "";

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Simple hamburger menu for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-200"
            onClick={onMenuClick}
          >
            <Menu size={20} className="text-gray-600" />
            <span className="sr-only">Open menu</span>
          </Button>
          
          {/* Simple logo and title section */}
          <div className="flex items-center gap-3">

              <img
                src={logo}
                alt="Client Health Tracker"
                className="h-10 w-auto"
              />
              <div className="text-xl font-bold text-gray-800">
                {clinicName}
              </div>

          </div>
          
          {/* Simple role badge */}
          <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            {user?.role === "client" ? "Client Portal" : "Staff Portal"}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Simple notification button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-200"
          >
            <Bell size={20} className="text-gray-600" />
            {/* Notification indicator */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>

          {/* Simple user dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-200 p-0"
              >
                <Avatar className="h-12 w-12 rounded-lg border-2 border-gray-200">
                  <div className="justify-center items-center h-full w-full text-3xl text-gray-700 font-bold">
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </div>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-72 bg-white border border-gray-200 shadow-lg rounded-lg p-2" 
              align="end"
            >
              {/* Simple welcome header */}
              <DropdownMenuLabel className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <BookMarked className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Welcome back!</p>
                    <p className="text-xs text-gray-600">Signed in as {user?.role}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="my-2" />
              
              {/* User info */}
              <DropdownMenuItem className="px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-sm font-medium text-gray-800 leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-gray-600">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2" />
              
              {/* Settings option */}
              <DropdownMenuItem
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={onSetting}
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-medium text-gray-700">Settings</span>
              </DropdownMenuItem>
              
              {/* Logout option */}
              <DropdownMenuItem
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer"
                onClick={() => signOut()}
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <span className="font-medium text-red-700">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
