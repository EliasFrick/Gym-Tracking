import React, { createContext, ReactNode, useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { IAppConfigContextType } from "@/types/interfaces";

export const AppConfigContext = createContext<IAppConfigContextType>({
  isConnected: false,
  setIsConnected: () => {},
});

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

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

  /*  useEffect(() => {
    console.log("Miau");
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log(state);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []); */

  return (
    <AppConfigContext.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </AppConfigContext.Provider>
  );
};
