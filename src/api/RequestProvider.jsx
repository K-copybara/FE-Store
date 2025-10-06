// contexts/RequestProvider.jsx
import React, { useState } from 'react';
import { RequestContext } from './RequestContext';

const dummyRequests = [
  {
    requestId: 501,
    tableId: 12,
    requestedAt: "2025-09-14T15:30:00",
    status: "PENDING",
    requestNote: "에어컨 너무 추워요. 온도 내려주세요",
    items: [
      { name: "물티슈", amount: 1 },
      { name: "휴지", amount: 2 }
    ]
  },
  {
    requestId: 502,
    tableId: 12,
    requestedAt: "2025-09-14T15:40:00",
    status: "COMPLETED",
    requestNote: "시끄러워서 음악 줄여주세요",
    items: []
  },
{
    requestId: 503,
    tableId: 10,
    requestedAt: "2025-09-14T15:40:00",
    status: "PENDING",
    requestNote: null,
    items: [
      { name: "물티슈", amount: 1 },
      { name: "휴지", amount: 2 }
    ]
  }
];

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState(dummyRequests);

  const completeRequest = (requestId) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.requestId === requestId
          ? { ...request, status: 'COMPLETED', completedAt: new Date().toISOString() }
          : request
      )
    );
  };

    // 정렬된 요청사항 반환
  const getSortedRequests = () => {
    return [...requests].sort((a, b) => {
      // 1. 상태별 우선순위: PENDING이 먼저
      if (a.status === 'PENDING' && b.status === 'COMPLETED') return -1;
      if (a.status === 'COMPLETED' && b.status === 'PENDING') return 1;
      
      // 2. 같은 상태 내에서는 최근순
      if (a.status === 'PENDING' && b.status === 'PENDING') {
        return new Date(b.requestedAt) - new Date(a.requestedAt);
      }
      if (a.status === 'COMPLETED' && b.status === 'COMPLETED') {
        return new Date(b.completedAt || b.requestedAt) - new Date(a.completedAt || a.requestedAt);
      }
      
      return 0;
    });
  };

  const rejectRequest = (requestId) => {
    setRequests(prevRequests =>
      prevRequests.filter(request => request.requestId !== requestId)
    );
  };

  const value = {
    requests,
    sortedRequests: getSortedRequests(),
    completeRequest,
    rejectRequest
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
};
