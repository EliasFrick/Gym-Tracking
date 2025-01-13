import React, { createContext, ReactNode, useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { IAppConfigContextType } from "@/types/interfaces";

export const AppConfigContext = createContext<IAppConfigContextType>({
  isConnected: false,
  setIsConnected: () => {},
  refreshDatabase: 0, // Initialer Trigger-Wert
  triggerRefreshDatabase: () => {}, // Neue Funktion zum Triggern
});

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [refreshDatabase, setRefreshDatabase] = useState<number>(0); // Numerischer Trigger

  useEffect(() => {
    const checkInitialConnection = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
    };

    checkInitialConnection();

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (state.isConnected !== isConnected) {
        setIsConnected(state.isConnected);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  // Neue Funktion zum Triggern von Refreshes
  const triggerRefreshDatabase = () => {
    setRefreshDatabase((prev) => prev + 1); // Erhöht den Trigger-Wert
  };

  useEffect(() => {
    triggerRefreshDatabase();
  }, [isConnected]);

  return (
    <AppConfigContext.Provider
      value={{
        isConnected,
        setIsConnected,
        refreshDatabase,
        triggerRefreshDatabase,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
