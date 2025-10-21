// useAlertSound.js
import { useEffect, useRef, useCallback } from 'react';
import alertSound from '../assets/alert_sound.mp3';

export function useAlertSound() {
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);
  const pendingPlayRef = useRef(false);

  useEffect(() => {
    const a = new Audio(alertSound);
    a.preload = 'auto';
    a.volume = 0.75;
    audioRef.current = a;

    const unlock = async () => {
      try {
        await a.play();
        a.pause();
        a.currentTime = 0;
        unlockedRef.current = true;

        // 언락 전에 알림이 왔으면 바로 재생
        if (pendingPlayRef.current) {
          pendingPlayRef.current = false;
          a.currentTime = 0;
          a.play();
        }
      } catch (e) {
        console.error(e);
        // 실패하면 다음 제스처에서 다시 시도됨
      }
    };

    // 사용자가 아무 곳이나 클릭하면 오디오 언락됨
    window.addEventListener('pointerdown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      a.pause();
      audioRef.current = null;
      unlockedRef.current = false;
      pendingPlayRef.current = false;
    };
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;

    if (!unlockedRef.current) {
      // 아직 언락 안됐으면 대기
      pendingPlayRef.current = true;
      return;
    }

    try {
      a.currentTime = 0;
      a.play();
    } catch (e) {}
  }, []);

  return { play };
}
