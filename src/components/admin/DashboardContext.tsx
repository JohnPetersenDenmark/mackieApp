// DashboardContext.tsx
import React, { createContext, useContext, useState } from "react";

type DashboardContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used inside a DashboardProvider");
  }
  return context;
};

export const DashboardProvider = ({ children }: React.PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DashboardContext.Provider>
  );
};
