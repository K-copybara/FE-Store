// contexts/OrderProvider.jsx
import React, { useState } from 'react';
import { OrderContext } from './OrderContext';

// 더미 데이터
const dummyOrders = [
  {
    orderId: 1,
    orderTime: "15:30",
    tableNumber: "5",
    request: "덜 맵게 해주세요",
    items: [
      { name: "탄단지 샐러드", quantity: 1 },
      { name: "떡만두국", quantity: 2 }
    ],
    status: "PENDING",
    orderDate: "2025-09-24",
    totalPrice: 16000
  },
  {
    orderId: 2,
    orderTime: "15:31", 
    tableNumber: "3",
    request: null,
    items: [
      { name: "탄단지 샐러드", quantity: 1 },
      { name: "김치전", quantity: 2 },
      { name: "떡만두국", quantity: 1 }
    ],
    status: "PENDING",
    orderDate: "2025-09-24",
    totalPrice: 16000
  },
  {
    orderId: 3,
    orderTime: "15:32",
    tableNumber: "7", 
    request: "양파 빼주세요. 포장해주세요.",
    items: [
      { name: "탄단지 샐러드", quantity: 2 }
    ],
    status: "PENDING",
    orderDate: "2025-09-24",
    totalPrice: 8000
  },
  {
    orderId: 4,
    orderTime: "15:35",
    tableNumber: "2",
    request: null,
    items: [
      { name: "탄단지 샐러드", quantity: 1 }
    ],
    status: "PENDING",
    orderDate: "2025-09-24", 
    totalPrice: 8000
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(dummyOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 주문 상태 업데이트
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  // 새 주문 추가 (실시간 주문 받을 때)
  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      orderId: Date.now(), // 임시 ID 생성
      status: 'new'
    };
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
  };

  // 주문 삭제/완료 처리
  const removeOrder = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.filter(order => order.orderId !== orderId)
    );
  };

  // 새로운 주문 필터링
  const getNewOrders = () => {
    return orders.filter(order => order.status === 'new');
  };

  // 터치된 주문 필터링 
  const getTouchedOrders = () => {
    return orders.filter(order => order.status === 'touched');
  };

  // API 호출 함수 (나중에 구현)
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 나중에 실제 API 호출로 대체
      // const response = await fetch('/api/orders');
      // const ordersData = await response.json();
      // setOrders(ordersData);
      
      // 현재는 더미 데이터 사용 (로딩 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(dummyOrders);
      setLoading(false);
    } catch (error) {
      console.error('주문 데이터 가져오기 실패:', error);
      setError('주문 데이터를 가져오는데 실패했습니다.');
      setLoading(false);
    }
  };

  // 주문 접수 처리
  const acceptOrder = (orderId) => {
    updateOrderStatus(orderId, 'accepted');
  };

  // 주문 거절/취소 처리
  const rejectOrder = (orderId) => {
    removeOrder(orderId);
  };

    // 주문 완료 처리 (API 호출)
  const completeOrder = async (orderId) => {
    try {
      // API 호출
      // await fetch(`/api/orders/${orderId}/complete`, { method: 'PATCH' });
      
      // 상태 업데이트
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: 'COMPLETED' }
            : order
        )
      );
    } catch (error) {
      console.error('주문 완료 처리 실패:', error);
    }
  };
  const value = {
    orders,
    loading,
    error,
    updateOrderStatus,
    addOrder,
    removeOrder,
    fetchOrders,
    getNewOrders,
    getTouchedOrders,
    acceptOrder,
    rejectOrder,
    completeOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
