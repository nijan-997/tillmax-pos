'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { STAFF } from './mock-data/staff';

export type SyncStatus = {
  online: boolean;
  pendingCount: number;
};

export type TillSession = {
  staff: (typeof STAFF)[0] | null;
  clockedIn: boolean;
  syncStatus: SyncStatus;
};

type SessionContextType = {
  session: TillSession;
  signIn: (staffId: string) => boolean;
  signOut: () => void;
  clockIn: () => void;
  clockOut: () => void;
  toggleSync: () => void; // prototype-only — lets reviewer toggle online/offline
  isManager: () => boolean;
};

const defaultSession: TillSession = {
  staff: null,
  clockedIn: false,
  syncStatus: { online: true, pendingCount: 0 },
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<TillSession>(defaultSession);

  const signIn = useCallback((pin: string): boolean => {
    const member = STAFF.find((s) => s.pin === pin);
    if (!member) return false;
    setSession((prev) => ({ ...prev, staff: member }));
    return true;
  }, []);

  const signOut = useCallback(() => {
    setSession(defaultSession);
  }, []);

  const clockIn = useCallback(() => {
    setSession((prev) => ({ ...prev, clockedIn: true }));
  }, []);

  const clockOut = useCallback(() => {
    setSession((prev) => ({ ...prev, clockedIn: false }));
  }, []);

  // Prototype toggle: cycles through online → 3 pending → offline → online
  const toggleSync = useCallback(() => {
    setSession((prev) => {
      const { online, pendingCount } = prev.syncStatus;
      if (online && pendingCount === 0) return { ...prev, syncStatus: { online: true, pendingCount: 3 } };
      if (online && pendingCount > 0) return { ...prev, syncStatus: { online: false, pendingCount: 3 } };
      return { ...prev, syncStatus: { online: true, pendingCount: 0 } };
    });
  }, []);

  const isManager = useCallback(() => {
    return session.staff?.role === 'Manager' || session.staff?.role === 'Administrator';
  }, [session.staff]);

  return (
    <SessionContext.Provider value={{ session, signIn, signOut, clockIn, clockOut, toggleSync, isManager }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
