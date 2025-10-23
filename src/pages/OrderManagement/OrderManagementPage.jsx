import styled from 'styled-components';
import { useEffect, useMemo, useState, useCallback } from 'react';
import OrderCard from '../../components/OrderManagement/OrderCard';
import RequestCard from '../../components/OrderManagement/RequestCard';
import { bold36, bold24, reg24 } from '../../styles/font';
import {
  getOrders,
  getRequests,
  postRequestComplete,
  postOrderCancel,
  postOrderComplete,
} from '../../api/order';
import { useUserStore } from '../../store/useUserStore';

const OrderManagementPage = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [activeReq, setActiveReq] = useState('PENDING');
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const { storeId } = useUserStore();

  // 주문, 요청사항 불러오기
  const fetchOrders = useCallback(async () => {
    const res = await getOrders(storeId, activeTab);
    setOrders(res);
  }, [storeId, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchRequests = useCallback(async () => {
    const res = await getRequests(storeId);
    setRequests(res);
  }, [storeId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // 알림 수신 시 주문 요청 다시 불러오기
  useEffect(() => {
    const onOrderCreated = () => {
      fetchOrders();
    };
    window.addEventListener('order:created', onOrderCreated);
    return () => window.removeEventListener('order:created', onOrderCreated);
  }, [fetchOrders]);

  useEffect(() => {
    const onRequestCreated = () => {
      fetchRequests();
    };
    window.addEventListener('request:created', onRequestCreated);
    return () =>
      window.removeEventListener('request:created', onRequestCreated);
  }, [fetchRequests]);

  const completeOrder = async (orderId) => {
    try {
      const res = await postOrderComplete(orderId);
      await fetchOrders();
    } catch (err) {
      alert('처리에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await postOrderCancel(orderId);
      await fetchOrders();
    } catch (err) {
      alert('처리에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  const completeRequest = async (requestId) => {
    try {
      const res = await postRequestComplete(requestId);
      await fetchRequests();
    } catch (err) {
      alert('처리에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => r.status === activeReq);
  }, [requests, activeReq]);

  return (
    <>
      <OrderContainer>
        <OrderStatus>
          <OrderTitle>주문</OrderTitle>
          <TabContainer>
            <TabButton
              active={activeTab === 'PENDING'}
              onClick={() => setActiveTab('PENDING')}
            >
              처리 중
            </TabButton>
            <TabDivider>|</TabDivider>
            <TabButton
              active={activeTab === 'COMPLETED'}
              onClick={() => setActiveTab('COMPLETED')}
            >
              완료
            </TabButton>
            <TabDivider>|</TabDivider>
            <TabButton
              active={activeTab === 'CANCELED'}
              onClick={() => setActiveTab('CANCELED')}
            >
              취소
            </TabButton>
          </TabContainer>
        </OrderStatus>
        {orders.length === 0 ? (
          <EmptyMessage>
            {activeTab === 'PENDING'
              ? '처리 중인 주문이 없습니다.'
              : activeTab === 'COMPLETED'
                ? '완료된 주문이 없습니다.'
                : '취소된 주문이 없습니다.'}
          </EmptyMessage>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onComplete={completeOrder}
              onCancel={cancelOrder}
            />
          ))
        )}
      </OrderContainer>
      <OrderContainer>
        <OrderStatus>
          <OrderTitle>요청</OrderTitle>
          <TabContainer>
            <TabButton
              active={activeReq === 'PENDING'}
              onClick={() => setActiveReq('PENDING')}
            >
              처리 중
            </TabButton>
            <TabDivider>|</TabDivider>
            <TabButton
              active={activeReq === 'COMPLETED'}
              onClick={() => setActiveReq('COMPLETED')}
            >
              완료
            </TabButton>
          </TabContainer>
        </OrderStatus>
        {filteredRequests.length === 0 ? (
          <EmptyMessage>
            {activeReq === 'PENDING'
              ? '처리 중인 요청이 없습니다.'
              : '완료된 요청이 없습니다.'}
          </EmptyMessage>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard
              key={request.requestId}
              request={request}
              onComplete={completeRequest}
            />
          ))
        )}
      </OrderContainer>
    </>
  );
};

export default OrderManagementPage;

const OrderContainer = styled.div`
  display: flex;
  padding: 1.25rem 1.5625rem;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;

  border-radius: 1.25rem;
  background-color: var(--white);
  flex: 1;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
    display: none;
    }
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const OrderStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 1.25rem;
`;

const OrderTitle = styled.div`
  ${bold36}
  color: var(--black);
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  ${bold24}
  background: none;
  border: none;
  color: ${(props) => (props.active ? 'var(--primary)' : 'var(--gray500)')};
  cursor: pointer;
  padding: 0.5rem 0;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`;

const TabDivider = styled.span`
  ${bold24}
  color: var(--gray300);
`;

const EmptyMessage = styled.div`
  ${reg24}
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray500);
  height: 12rem;
`;
