"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck, AlertTriangle, TrendingUp, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "agent";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "agent",
    title: "Churn Alert",
    message: "3 accounts flagged as high-risk by the churn prediction agent.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Deal Won",
    message: "Acme Corp deal worth $125,000 has been marked as closed-won.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Pipeline Alert",
    message: "Monthly pipeline target is at 68% — 5 deals may slip to next quarter.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: false,
  },
  {
    id: "4",
    type: "info",
    title: "Lead Score Update",
    message: "12 new leads scored above 80 — ready for immediate outreach.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    read: true,
  },
];

function getIcon(type: Notification["type"]) {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "success":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "agent":
      return <Bot className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-blue-500" />;
  }
}

function formatTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 border-b border-gray-100 px-4 py-3 transition-colors dark:border-gray-800",
                    !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                  )}
                >
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
