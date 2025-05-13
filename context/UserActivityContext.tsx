"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Activity = {
  type: string;
  payload: any;
  timestamp: number;
};

type UserActivityContextType = {
  logActivity: (type: string, payload: any) => void;
  getSuggestions: () => any[];
  recentActivities: Activity[];
};

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user_activities");
    if (stored) setRecentActivities(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("user_activities", JSON.stringify(recentActivities));
  }, [recentActivities]);

  const logActivity = (type: string, payload: any) => {
    const activity = { type, payload, timestamp: Date.now() };
    setRecentActivities((prev) => [activity, ...prev].slice(0, 50));
  };

  const getSuggestions = () => {
    const seen = new Set();
    return recentActivities
      .filter(a => a.type.endsWith("_view"))
      .filter(a => {
        const id = a.payload?.id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map(a => a.payload)
      .slice(0, 5);
  };

  return (
    <UserActivityContext.Provider value={{ logActivity, getSuggestions, recentActivities }}>
      {children}
    </UserActivityContext.Provider>
  );
};

export const useUserActivity = () => {
  const ctx = useContext(UserActivityContext);
  if (!ctx) throw new Error("useUserActivity must be used within UserActivityProvider");
  return ctx;
};