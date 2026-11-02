import { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/engine';
import { useAudioState } from '../audio/useAudioState';
import type { PatchId } from '../domain/types';
import './hud.css';

interface SoundPlayerProps { playKey: string; patch: PatchId; label: string }

export default function SoundPlayer({ playKey, patch, label }: SoundPlayerProps) {
  const { playingKey, muted, supported } = useAudioState(); const canvasRef = useRef<HTMLCanvasElement>(null); const playing = playingKey === playKey;
  useEffect(() => { if (!playing) return; const canvas = canvasRef.current; const analyser = audioEngine.getAnalyser(); if (!canvas || !analyser) return; const context = canvas.getContext('2d'); if (!context) return; const bins = new Uint8Array(analyser.frequencyBinCount); let frame = 0; const draw = () => { analyser.getByteFrequencyData(bins); context.clearRect(0, 0, canvas.width, canvas.height); const barWidth = canvas.width / bins.length; bins.forEach((value, index) => { const height = (value / 255) * canvas.height; context.fillStyle = `hsl(${185 + index * 2}, 85%, 65%)`; context.fillRect(index * barWidth, canvas.height - height, Math.max(1, barWidth - 1), height); }); frame = requestAnimationFrame(draw); }; frame = requestAnimationFrame(draw); return () => cancelAnimationFrame(frame); }, [playing]);
  return <div className="sound-player"><div className="sound-player-head"><span>声音基因 · {label}</span>{supported ? <span className="sound-status">{playing ? 'PLAYING' : 'READY'}</span> : <span className="sound-status">浏览器不支持 Web Audio</span>}</div><div className="sound-controls"><button type="button" className="play-button" disabled={!supported} onClick={() => playing ? audioEngine.stop() : void audioEngine.play(playKey, patch)}>{playing ? '停止' : '试听'}</button><button type="button" className="clear-button" disabled={!supported} onClick={() => audioEngine.setMuted(!muted)}>{muted ? '取消静音' : '静音'}</button></div><canvas ref={canvasRef} className="spectrum" width="320" height="42" aria-hidden="true" /></div>;
}
