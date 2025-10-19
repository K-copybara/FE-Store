import { useEffect, useRef, useState } from 'react';
import alertSound from '../assets/alert_sound.mp3';

export function useAlertSound() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem('soundEnabled') === 'true'
  );

  useEffect(() => {
    audioRef.current = new Audio(alertSound);
    audioRef.current.preload = 'auto';

    if (enabled) return;
    const unlock = async () => {
      try {
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setEnabled(true);
        localStorage.setItem('soundEnabled', 'true');
      } catch {}
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, [enabled]);

  const play = () => {
    if (!enabled) return;
    try {
      const a = new Audio(audioRef.current?.src || alertSound);
      a.volume = audioRef.current?.volume ?? 0.75;
      a.play().catch(() => {});
    } catch {}
  };

  return { enabled, setEnabled, play };
}
