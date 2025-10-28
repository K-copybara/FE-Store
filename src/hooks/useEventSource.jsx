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
  const lastReasonRef = useRef('initial');

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const getHeadersRef = useRef(getHeaders);
  useEffect(() => {
    getHeadersRef.current = getHeaders;
  }, [getHeaders]);

  useEffect(() => {
    if (!enabled) return;

    let unmounted = false;

    const log = (...args) => console.log(`[${label}]`, ...args);
    const warn = (...args) => console.warn(`[${label}]`, ...args);
    const error = (...args) => console.error(`[${label}]`, ...args);

    const cleanup = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };

    const scheduleReconnect = (reason) => {
      if (unmounted) return;
      lastReasonRef.current = reason;
      const delay = Math.min(
        retryRef.current * (1 + Math.random()),
        retryMaxMs
      );
      timerRef.current = window.setTimeout(() => {
        retryRef.current = Math.min(retryRef.current * 2, retryMaxMs);
        log(
          `재연결 시도 시작 (이유: ${lastReasonRef.current}, delay=${delay.toFixed(0)}ms)`
        );
        connect();
      }, delay);
    };

    const connect = async () => {
      cleanup();

      const headers = getHeadersRef.current?.();
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
                handlersRef.current.onunauthorized?.();
                throw new Error(
                  `SSE open failed: ${res.status} ${res.statusText}`
                );
              }
            }
            retryRef.current = retryBaseMs;
            log('연결 성공', `status=${res.status}`);
            await handlersRef.current.onopen?.(res);
          },
          onmessage: (e) => {
            handlersRef.current.onmessage?.(e);
            //log('메시지 수신', e.event);
          },
          onerror: (err) => {
            error('연결 오류 발생:', err);
            scheduleReconnect('onerror');
            throw err; // 재연결 트리거
          },
          onclose: () => {
            warn('서버가 연결을 닫음');
            scheduleReconnect('onclose');
          },
        });
      } catch (e) {
        error('예외로 인해 연결 종료:', e);
        scheduleReconnect('catch');
      }
    };

    // 네트워크/탭 가시성 이벤트
    const onOnline = () => scheduleReconnect('online event');
    const onVisible = () => {
      if (document.visibilityState === 'visible')
        scheduleReconnect('visible event');
    };

    window.addEventListener('online', onOnline);

    connect();

    return () => {
      unmounted = true;
      window.removeEventListener('online', onOnline);
      log('언마운트 → 연결/타이머 정리');
      cleanup();
    };
  }, [url, enabled]);
}
