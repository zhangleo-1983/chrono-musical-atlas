import { useSyncExternalStore } from 'react';
import { audioEngine, type AudioState } from './engine';

export function useAudioState(): AudioState {
  return useSyncExternalStore(audioEngine.subscribe, audioEngine.getState, audioEngine.getState);
}
