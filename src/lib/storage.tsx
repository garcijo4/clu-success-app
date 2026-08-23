'use client';

// All student data lives in this browser only. Nothing is uploaded anywhere.
// Every read/write is wrapped in try/catch so private mode never breaks the app.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppState, ChapterState, ThemeSetting } from './types';
import {
  emptyAppState,
  emptyChapterState,
  parseStoredState,
  storageReducer,
  type StorageAction,
} from './storageReducer';

const KEY = 'clu-fys-companion:v1';

function read(): { state: AppState; storageAvailable: boolean } {
  try {
    const raw = window.localStorage.getItem(KEY);
    return {
      state: parseStoredState(raw),
      storageAvailable: true,
    };
  } catch {
    return { state: emptyAppState(), storageAvailable: false };
  }
}

function write(state: AppState): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    // Storage full or blocked (private browsing). The app keeps working in memory.
    return false;
  }
}

interface StoreValue {
  state: AppState;
  /** False until localStorage has been read on the client — render skeletons while false. */
  ready: boolean;
  /** False when the browser has blocked or exhausted localStorage. */
  storageAvailable: boolean;
  chapter: (slug: string) => ChapterState;
  markGotIt: (slug: string, cardId: string) => void;
  markReviewAgain: (slug: string, cardId: string) => void;
  resetDeck: (slug: string) => void;
  saveAssessment: (
    slug: string,
    assessmentId: string,
    patch: Partial<AppState['chapters'][string]['assessments'][string]>,
  ) => void;
  touch: (slug: string, activity: 'flashcards' | 'reflect') => void;
  setTheme: (theme: ThemeSetting) => void;
  setWelcomed: () => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const stateRef = useRef<AppState>(emptyAppState());
  const [state, setState] = useState<AppState>(stateRef.current);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const storageAvailableRef = useRef(true);

  // Hydrate after mount so server and client markup match.
  useEffect(() => {
    const stored = read();
    stateRef.current = stored.state;
    setState(stored.state);
    storageAvailableRef.current = stored.storageAvailable;
    setStorageAvailable(stored.storageAvailable);
    setReady(true);
  }, []);

  const dispatch = useCallback((action: StorageAction) => {
    // Compute and write synchronously. This is what makes pagehide/visibility
    // flushes durable even if React does not get another render before suspension.
    const next = storageReducer(stateRef.current, action);
    stateRef.current = next;
    const available = write(next);
    if (available !== storageAvailableRef.current) {
      storageAvailableRef.current = available;
      queueMicrotask(() => setStorageAvailable(available));
    }
    setState(next);
  }, []);

  const chapter = useCallback(
    (slug: string) => state.chapters[slug] ?? emptyChapterState(),
    [state],
  );

  const markGotIt = useCallback(
    (slug: string, cardId: string) =>
      dispatch({ type: 'mark-got-it', slug, cardId }),
    [dispatch],
  );

  const markReviewAgain = useCallback(
    (slug: string, cardId: string) =>
      dispatch({ type: 'mark-review-again', slug, cardId }),
    [dispatch],
  );

  const resetDeck = useCallback(
    (slug: string) => dispatch({ type: 'reset-deck', slug }),
    [dispatch],
  );

  const saveAssessment: StoreValue['saveAssessment'] = useCallback(
    (slug, assessmentId, patch) =>
      dispatch({ type: 'save-assessment', slug, assessmentId, patch }),
    [dispatch],
  );

  const touch = useCallback(
    (slug: string, activity: 'flashcards' | 'reflect') =>
      dispatch({ type: 'touch', slug, activity, at: new Date().toISOString() }),
    [dispatch],
  );

  const setTheme = useCallback(
    (theme: ThemeSetting) => dispatch({ type: 'set-theme', theme }),
    [dispatch],
  );

  const setWelcomed = useCallback(
    () => dispatch({ type: 'set-welcomed' }),
    [dispatch],
  );

  const resetAll = useCallback(() => {
    let available = true;
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      available = false;
    }
    storageAvailableRef.current = available;
    setStorageAvailable(available);
    const empty = emptyAppState();
    stateRef.current = empty;
    setState(empty);
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      ready,
      storageAvailable,
      chapter,
      markGotIt,
      markReviewAgain,
      resetDeck,
      saveAssessment,
      touch,
      setTheme,
      setWelcomed,
      resetAll,
    }),
    [
      state,
      ready,
      storageAvailable,
      chapter,
      markGotIt,
      markReviewAgain,
      resetDeck,
      saveAssessment,
      touch,
      setTheme,
      setWelcomed,
      resetAll,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
