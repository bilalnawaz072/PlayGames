'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

export interface DataUpdateState {
  isUpdating: boolean;
  progress: number;
  message: string;
  status: 'idle' | 'updating' | 'success' | 'error';
}

export interface DataUpdateContextType {
  updateState: DataUpdateState;
  startUpdating: (message?: string) => void;
  setProgress: (progress: number) => void;
  finishUpdating: (successMessage?: string) => void;
  failUpdating: (errorMessage?: string) => void;
  triggerUpdate: <T>(asyncTask: () => Promise<T>, message?: string, successMsg?: string) => Promise<T>;
}

const DataUpdateContext = createContext<DataUpdateContextType>({
  updateState: {
    isUpdating: false,
    progress: 0,
    message: '',
    status: 'idle',
  },
  startUpdating: () => {},
  setProgress: () => {},
  finishUpdating: () => {},
  failUpdating: () => {},
  triggerUpdate: async (task) => await task(),
});

export function DataUpdateProvider({ children }: { children: React.ReactNode }) {
  const [updateState, setUpdateState] = useState<DataUpdateState>({
    isUpdating: false,
    progress: 0,
    message: '',
    status: 'idle',
  });

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
  }, []);

  const startUpdating = useCallback((message = 'Updating data...') => {
    clearTimers();
    setUpdateState({
      isUpdating: true,
      progress: 15,
      message,
      status: 'updating',
    });

    // Simulate steady progress up to 90%
    progressIntervalRef.current = setInterval(() => {
      setUpdateState((prev) => {
        if (!prev.isUpdating || prev.status !== 'updating') return prev;
        if (prev.progress >= 90) return prev;
        const nextProgress = Math.min(90, prev.progress + Math.floor(Math.random() * 12) + 5);
        return { ...prev, progress: nextProgress };
      });
    }, 250);
  }, [clearTimers]);

  const setProgress = useCallback((progress: number) => {
    setUpdateState((prev) => ({ ...prev, progress }));
  }, []);

  const finishUpdating = useCallback((successMessage = '✨ Data updated successfully!') => {
    clearTimers();
    setUpdateState({
      isUpdating: true,
      progress: 100,
      message: successMessage,
      status: 'success',
    });

    hideTimeoutRef.current = setTimeout(() => {
      setUpdateState({
        isUpdating: false,
        progress: 0,
        message: '',
        status: 'idle',
      });
    }, 2200);
  }, [clearTimers]);

  const failUpdating = useCallback((errorMessage = '❌ Failed to update data.') => {
    clearTimers();
    setUpdateState({
      isUpdating: true,
      progress: 100,
      message: errorMessage,
      status: 'error',
    });

    hideTimeoutRef.current = setTimeout(() => {
      setUpdateState({
        isUpdating: false,
        progress: 0,
        message: '',
        status: 'idle',
      });
    }, 3000);
  }, [clearTimers]);

  const triggerUpdate = useCallback(
    async <T,>(asyncTask: () => Promise<T>, message?: string, successMsg?: string): Promise<T> => {
      const startTime = Date.now();
      startUpdating(message);
      try {
        const result = await asyncTask();
        // Ensure progress bar is visible for at least 1000ms so user can register the visual feedback
        const elapsed = Date.now() - startTime;
        const minDelay = Math.max(0, 1000 - elapsed);
        if (minDelay > 0) {
          await new Promise((r) => setTimeout(r, minDelay));
        }
        finishUpdating(successMsg);
        return result;
      } catch (err) {
        failUpdating(err instanceof Error ? err.message : 'Error updating data.');
        throw err;
      }
    },
    [startUpdating, finishUpdating, failUpdating]
  );

  return (
    <DataUpdateContext.Provider
      value={{
        updateState,
        startUpdating,
        setProgress,
        finishUpdating,
        failUpdating,
        triggerUpdate,
      }}
    >
      {children}
    </DataUpdateContext.Provider>
  );
}

export const useDataUpdate = () => useContext(DataUpdateContext);
