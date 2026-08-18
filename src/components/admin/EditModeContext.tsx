"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EditModeState {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

const EditModeContext = createContext<EditModeState>({
  isAdmin: false,
  editMode: false,
  setEditMode: () => {},
});

export function EditModeProvider({ isAdmin, children }: { isAdmin: boolean; children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  return (
    <EditModeContext.Provider value={{ isAdmin, editMode: isAdmin && editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
