import React, { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { syncData } from "@/utils/offlineStorage";

interface AppConfigContextType {
  isOnline: boolean;
  lastSync: Date | null;
  syncDataNow: () => Promise<void>;
}

export const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    // Initial sync on app start
    syncData().then(() => setLastSync(new Date()));

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected) {
        syncData().then(() => setLastSync(new Date()));
      }
    });

    return () => unsubscribe();
  }, []);

  const syncDataNow = async () => {
    await syncData();
    setLastSync(new Date());
  };

  return (
    <AppConfigContext.Provider value={{ isOnline, lastSync, syncDataNow }}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error("useAppConfig must be used within an AppConfigProvider");
  }
  return context;
}
