import React, { useEffect, useRef } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import Swal from 'sweetalert2';

export const SSEOrderProvider = ({ children }) => {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('토큰이 없어 SSE 연결을 시작하지 않습니다.');
      return;
    }

    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      eventSourceRef.current = new EventSourcePolyfill(
        `${import.meta.env.VITE_SERVER_URL}/api/merchant/notify/request/stream`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      eventSourceRef.current.onopen = () => {
        console.log('요청 SSE 연결이 성공적으로 열렸습니다.');
      };

      eventSourceRef.current.addEventListener(
        'request-created-notification',
        (event) => {
          try {
            const eventData = JSON.parse(event.data);
            console.log('받은 알림 : ', eventData);

            Swal.fire({
              icon: 'info',
              title: '요청 접수',
              text: `새로운 요청사항이 접수되었습니다!`,
              toast: true,
              position: 'bottom-right',
              showConfirmButton: false,
              timer: 3000,
            });
          } catch (err) {
            console.error('알림 데이터 처리 중 오류:', err);
          }
        }
      );

      eventSourceRef.current.onerror = (error) => {
        console.error('SSE 연결 오류 발생:', error);

        eventSourceRef.current.close();

        console.log('5초 후 재연결을 시도합니다.');
        setTimeout(() => connect(), 5000);
      };
    };

    connect();

    return () => {
      console.log('SSE Provider 언마운트. 연결을 종료합니다.');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return <>{children}</>;
};
