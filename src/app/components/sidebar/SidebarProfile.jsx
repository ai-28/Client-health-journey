import React from "react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { User, LogOut, Settings, Building } from "lucide-react";
import { signOut } from "next-auth/react";

const SidebarProfile = ({ user, userRole, roleIcon: RoleIcon = User }) => {
  if (!user) return null;

  return (
    <div className="w-full p-4 border-t border-gray-200 bg-gray-50">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-4">
          {/* Simple avatar */}
          <div className="relative">
            <div className="bg-gray-200 h-12 w-12 rounded-lg flex items-center justify-center">
              <RoleIcon className="h-6 w-6 text-gray-700" />
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-gray-400 rounded-full border-2 border-white"></div>
          </div>
          
          {/* Simple user info */}
          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">
              {user.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {userRole}
              </span>
              {user.clinicId && user.role === "clinic_admin" && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  <Building className="h-3 w-3" />
                  <span>Clinic Admin</span>
                </span>
              )}
            </div>
          </div>
          
          {/* Simple settings button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-200"
              >
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="bg-white border border-gray-200 shadow-lg rounded-lg"
            >
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
