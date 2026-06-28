import React, { createContext, useContext, useMemo, useState } from 'react';

export interface UIActions {
  toggleSound?: () => void;
  soundEnabled?: boolean;
  toggleHaptics?: () => void;
  hapticsEnabled?: boolean;
}

interface UIActionsContextValue {
  actions: UIActions;
  setActions: React.Dispatch<React.SetStateAction<UIActions>>;
}

const UIActionsContext = createContext<UIActionsContextValue | undefined>(undefined);

export const UIActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<UIActions>({});
  const value = useMemo(() => ({ actions, setActions }), [actions]);
  return <UIActionsContext.Provider value={value}>{children}</UIActionsContext.Provider>;
};

export const useUIActions = () => {
  const context = useContext(UIActionsContext);
  if (!context) {
    throw new Error('useUIActions must be used within a UIActionsProvider');
  }
  return context;
};
