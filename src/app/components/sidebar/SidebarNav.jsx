"use client";
import { useAuth } from "@/app/context/AuthContext";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../components/ui/scroll-area";
import NotificationBadge from "../badge";
import { useState } from "react";

const SidebarNav = ({ items }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMessage, setIsMessage] = useState(false);
  
  const handleClick = async (item) => {
    // if (item.title == "Messages") {
    //   setIsMessage(true);
    //   const markAsRead = async () => {
    //     await fetch(`/api/message/mark`, {
    //       method: "POST",
    //       body: JSON.stringify({ email: user?.email }),
    //     });
    //   };
    //   markAsRead();
    // } else {
    //   setIsMessage(false);
    // }
  };
  
  return (
    <ScrollArea className="flex-1 py-4">
      <nav className="grid gap-2 px-4">
        {items.map((item, index) => (
          <Link
            onClick={() => handleClick(item)}
            key={index}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
              "hover:bg-gray-100",
              pathname === item.href 
                ? "bg-gray-200 text-gray-900 border-l-4 border-gray-600" 
                : "text-gray-700 hover:text-gray-900"
            )}
          >
            {/* Simple icon */}
            <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
              <item.icon className="h-5 w-5" />
            </div>
            
            {/* Simple text */}
            <span className="font-medium">
              {item.title}
            </span>
            
            {/* Notification badge for messages */}
            {item.title == "Messages" ? (
              <NotificationBadge
                email={user?.email}
                isMessage={isMessage}
              />
            ) : (
              ""
            )}
            

          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
};

export default SidebarNav;
