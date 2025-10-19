import { useEffect, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

export function useEventSource({
  url,
  getHeaders,
  handlers,
  enabled = true,
  retryBaseMs = 2000,
  retryMaxMs = 15000,
  label = 'SSE',
}) {
  const controllerRef = useRef(null);
  const retryRef = useRef(retryBaseMs);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    let unmounted = false;

    const log = (...args) => console.log(`[${label}]`, ...args);
    const warn = (...args) => console.warn(`[${label}]`, ...args);
    const error = (...args) => console.error(`[${label}]`, ...args);

    const connect = async () => {
      // 이전 연결/타이머 정리
      if (controllerRef.current) controllerRef.current.abort();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const headers = getHeaders();
      if (!headers) {
        warn('토큰/헤더 없음. 연결 시도 중단');
        return;
      }

      controllerRef.current = new AbortController();

      log('연결 시작:', url);
      try {
        await fetchEventSource(url, {
          method: 'GET',
          headers,
          signal: controllerRef.current.signal,
          openWhenHidden: true,
          onopen: async (res) => {
            if (!res.ok) {
              if (res.status === 401) {
                warn('401 Unauthorized. onunauthorized 콜백 호출');
                handlers.onunauthorized?.();
                throw new Error(
                  `SSE open failed: ${res.status} ${res.statusText}`
                );
              }
            }
            // 연결 성공 시 백오프 초기화
            retryRef.current = retryBaseMs;
            log('연결 성공', `status=${res.status}`);
            await handlers.onopen?.(res);
          },
          onmessage: (e) => {
            handlers.onmessage(e);
            log('메시지 수신', e.event);
          },
          onerror: (err) => {
            error('연결 오류 발생:', err);
            throw err; // 재연결 트리거
          },
          onclose: () => {
            warn('서버가 연결을 닫음');
            scheduleReconnect();
          },
        });
      } catch (e) {
        error('예외로 인해 연결 종료:', e);
        scheduleReconnect();
      }
    };

    const scheduleReconnect = () => {
      if (unmounted) return;
      // 지수 백오프 + 지터
      const delay = Math.min(
        retryRef.current * (1 + Math.random()),
        retryMaxMs
      );
      timerRef.current = window.setTimeout(() => {
        retryRef.current = Math.min(retryRef.current * 2, retryMaxMs);
        log('재연결 시도 시작');
        connect();
      }, delay);
    };

    // 네트워크/탭 가시성 이벤트
    const onOnline = () => connect();
    const onVisible = () => {
      if (document.visibilityState === 'visible') connect();
    };

    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onVisible);

    connect();

    return () => {
      unmounted = true;
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisible);
      log('언마운트 → 연결/타이머 정리');
      if (timerRef.current) clearTimeout(timerRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [url, enabled, getHeaders, handlers]);
}
