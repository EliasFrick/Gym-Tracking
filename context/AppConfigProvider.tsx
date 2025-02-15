import React, { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { syncData } from "@/utils/offlineStorage";

interface AppConfigContextType {
  isOnline: boolean;
  lastSync: Date | null;
  syncDataNow: () => Promise<void>;
}

export const AppConfigContext = createContext<AppConfigContextType>({
  isOnline: false,
  lastSync: null,
  syncDataNow: async () => {},
});

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then((state) => {
      setIsOnline(!!state.isConnected);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
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
