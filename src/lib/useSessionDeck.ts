import { useRef } from 'react';

/**
 * Creates a deck once after client storage hydration, then deliberately freezes
 * it for the session. Progress updates must not reshuffle or replace cards while
 * a student is in the middle of a deck. Because `create` is never called until
 * `ready`, random selection also cannot differ between server and hydration.
 */
export function useSessionDeck<T>(
  ready: boolean,
  sessionKey: string,
  create: () => T[],
): T[] {
  const session = useRef<{ key: string; cards: T[] } | null>(null);
  if (!ready) return [];
  if (!session.current || session.current.key !== sessionKey) {
    session.current = { key: sessionKey, cards: create() };
  }
  return session.current.cards;
}
