import React, { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { syncData } from "@/utils/offlineStorage";
import { processPendingWorkouts } from "@/utils/localWorkouts";
import { IAppConfigContextType } from "@/types/interfaces";

export const AppConfigContext = createContext<IAppConfigContextType>({
  isOnline: false,
  lastSync: null,
  syncDataNow: async () => {},
  onRefresh: false,
  refresh: () => {},
  isConnected: false,
  setIsConnected: () => {},
  refreshDatabase: 0,
  triggerRefreshDatabase: () => {},
});

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [onRefresh, setOnRefresh] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshDatabase, setRefreshDatabase] = useState(0);

  const refresh = () => setOnRefresh((prev) => !prev);
  const triggerRefreshDatabase = () => setRefreshDatabase((prev) => prev + 1);

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

  useEffect(() => {
    // Wenn wir wieder online gehen, synchronisieren wir die Daten
    if (isOnline) {
      syncDataNow();
    }
  }, [isOnline]);

  const syncDataNow = async () => {
    try {
      await processPendingWorkouts(); // Sync pending workouts first
      await syncData(); // Your existing sync logic
      setLastSync(new Date());
    } catch (error) {
      console.error("Sync failed:", error);
    }
  };

  return (
    <AppConfigContext.Provider
      value={{
        isOnline,
        lastSync,
        syncDataNow,
        onRefresh,
        refresh,
        isConnected,
        setIsConnected,
        refreshDatabase,
        triggerRefreshDatabase,
      }}
    >
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
