import { useSyncExternalStore } from 'react';

export const COMPACT_QUERY = '(max-width: 1023px)';

function getSnapshot(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(COMPACT_QUERY).matches
    : false;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;
  const media = window.matchMedia(COMPACT_QUERY);
  if (media.addEventListener) media.addEventListener('change', onStoreChange);
  else media.addListener?.(onStoreChange);
  return () => {
    if (media.removeEventListener) media.removeEventListener('change', onStoreChange);
    else media.removeListener?.(onStoreChange);
  };
}

export function useCompact(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
