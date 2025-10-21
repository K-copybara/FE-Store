import React, { useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useAlertSound } from '../../hooks/useAlertSound';
import { useEventSource } from '../../hooks/useEventSource';
import { useUserStore } from '../../store/useUserStore';

export const SSEProviders = ({ children }) => {
  const { play } = useAlertSound();
  const { storeId } = useUserStore();

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const accessToken = JSON.parse(token).accessToken;
    return {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'text/event-stream',
    };
  }, []);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const orderHandlers = useMemo(
    () => ({
      onmessage: (event) => {
        if (event.event === 'order-paid') {
          try {
            const data = JSON.parse(event.data);
            console.log('order-paid:', data);
            play();
            Swal.fire({
              icon: 'info',
              title: '주문 접수',
              text: '새로운 주문이 접수되었습니다!',
              toast: true,
              position: 'bottom-right',
              showConfirmButton: false,
              timer: 3000,
            });
            window.dispatchEvent(
              new CustomEvent('order:created', { detail: data })
            );
          } catch (e) {
            console.error(e);
          }
        }
      },
      onunauthorized: () => {
        // TODO: 토큰 리프레시 후 재연결 트리거
      },
    }),
    [play]
  );

  const requestHandlers = useMemo(
    () => ({
      onmessage: (event) => {
        if (event.event === 'request-created-notification') {
          try {
            const data = JSON.parse(event.data);
            console.log('request-created:', data);
            play();
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
              new CustomEvent('request:created', { detail: data })
            );
          } catch (e) {
            console.error(e);
          }
        }
      },
    }),
    [play]
  );

  // 주문 알림
  useEventSource({
    label: 'order',
    url: `${SERVER_URL}/alarm/api/merchant/notify/stream?storeId=${storeId}`,
    getHeaders,
    handlers: orderHandlers,
  });

  // 요청 알림
  useEventSource({
    label: 'request',
    url: `${SERVER_URL}/alarm/api/merchant/notify/request/stream?storeId=${storeId}`,
    getHeaders,
    handlers: requestHandlers,
  });

  return <>{children}</>;
};
