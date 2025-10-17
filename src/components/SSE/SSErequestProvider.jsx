import React, { useEffect, useRef, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import Swal from 'sweetalert2';
import alertSound from '../../assets/alert_sound.mp3';

export const SSERequestProvider = ({ children }) => {
  const controllerRef = useRef(null);

  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem('soundEnabled') === 'true'
  );

  // 최초 사용자 상호작용으로 오디오 언락
  useEffect(() => {
    audioRef.current = new Audio(alertSound);
    audioRef.current.preload = 'auto';

    if (soundEnabled) return;

    const unlock = async () => {
      try {
        // 한 번 재생 → 즉시 정지로 오디오 컨텍스트 프라임
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setSoundEnabled(true);
        localStorage.setItem('soundEnabled', 'true');
      } catch (e) {
        console.warn('Sound unlock failed:', e);
      }
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, [soundEnabled]);

  // 안전 재생 함수
  const playAlertSound = () => {
    if (!soundEnabled) return;

    // 같은 소리를 연속 재생할 때 끊김 방지를 위해 새 인스턴스 사용
    try {
      const a = new Audio(audioRef.current?.src || alertSound);
      a.volume = audioRef.current?.volume ?? 0.75;
      a.play().catch(() => {});
    } catch (_) {}
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('토큰이 없어 SSE 연결을 시작하지 않습니다.');
      return;
    }
    const accessToken = JSON.parse(token).accessToken;
    const connect = async () => {
      if (controllerRef.current) {
        controllerRef.current.abort(); // 이전 연결 중단
      }

      controllerRef.current = new AbortController();

      console.log('요청 SSE 연결을 시도합니다...');

      try {
        await fetchEventSource(
          `${import.meta.env.VITE_SERVER_URL}/alarm/api/merchant/notify/request/stream?storeId=1`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'text/event-stream',
            },
            signal: controllerRef.current.signal,
            openWhenHidden: true,
            onopen: async (response) => {
              if (!response.ok) {
                throw new Error(`SSE 연결 실패: ${response.statusText}`);
              }
              console.log('요청 SSE 연결이 성공적으로 열렸습니다.');
            },
            onmessage: (event) => {
              if (event.event === 'request-created-notification') {
                try {
                  const eventData = JSON.parse(event.data);
                  console.log('받은 알림:', eventData);
                  playAlertSound();
                  Swal.fire({
                    icon: 'info',
                    title: '요청 접수',
                    text: '새로운 요청사항이 접수되었습니다!',
                    toast: true,
                    position: 'bottom-right',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  window.dispatchEvent(
                    new CustomEvent('request:created', { detail: eventData })
                  );
                } catch (err) {
                  console.error('알림 데이터 처리 중 오류:', err);
                }
              }
            },
            onerror: (error) => {
              console.error('SSE 연결 오류 발생:', error);
              throw error; // 오류 발생 시 재연결 트리거
            },
            onclose: () => {
              console.warn('SSE 연결이 서버에서 닫혔습니다.');
            },
          }
        );
      } catch (err) {
        console.error('SSE 연결 중 예외 발생:', err);
        console.log('5초 후 재연결을 시도합니다.');
        setTimeout(connect, 5000);
      }
    };

    connect();

    // 언마운트 시 정리
    return () => {
      console.log('SSE Provider 언마운트. 연결을 종료합니다.');
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [soundEnabled]);

  return <>{children}</>;
};
