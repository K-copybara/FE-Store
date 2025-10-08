import styled from 'styled-components';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import OrderCard from '../../components/OrderCard';
import RequestCard from '../../components/RequestCard';

import { display_xl, display_large } from '../../styles/font';

import { useOrders } from '../../hooks/useOrders';
import { useRequests } from '../../hooks/useRequests';

const OrderManagementPage = () => {
  const { orders, completeOrder, rejectOrder } = useOrders();

  const { sortedRequests, completeRequest } = useRequests();
  const [activeTab, setActiveTab] = useState('processing');

  // 탭에 따라 주문 필터링
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'processing') {
      return order.status === 'PENDING';
    } else {
      return order.status === 'COMPLETED';
    }
  });

  const handleCompleteOrder = (orderId) => {
    completeOrder(orderId);
  };

  return (
    <>
      <OrderContainer>
        <OrderStatus>
          <OrderTitle>주문</OrderTitle>
          <TabContainer>
            <TabButton
              active={activeTab === 'processing'}
              onClick={() => setActiveTab('processing')}
            >
              처리 중
            </TabButton>
            <TabDivider>
              <svg
                width="3"
                height="23"
                viewBox="0 0 3 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.04688 0.640625V22.3906H0.3125V0.640625H2.04688Z"
                  fill="#999999"
                />
              </svg>
            </TabDivider>
            <TabButton
              active={activeTab === 'completed'}
              onClick={() => setActiveTab('completed')}
            >
              완료
            </TabButton>
          </TabContainer>
        </OrderStatus>
        {filteredOrders.length === 0 ? (
          <EmptyMessage>
            {activeTab === 'processing'
              ? '처리 중인 주문이 없습니다.'
              : '완료된 주문이 없습니다.'}
          </EmptyMessage>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onAccept={() => handleCompleteOrder(order.orderId)}
              onReject={() => rejectOrder(order.orderId)}
            />
          ))
        )}
      </OrderContainer>
      <RequestContainer>
        <OrderTitle>요청</OrderTitle>
        {sortedRequests.length === 0 ? (
          <EmptyMessage>요청사항이 없습니다.</EmptyMessage>
        ) : (
          sortedRequests.map((request) => (
            <RequestCard
              key={request.requestId}
              request={request}
              onComplete={() => completeRequest(request.requestId)}
            />
          ))
        )}
      </RequestContainer>
    </>
  );
};

export default OrderManagementPage;

const OrderContainer = styled.div`
  display: flex;
  padding: 1.25rem 1.5625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  border-radius: 1.25rem;
  background-color: var(--white);
  flex: 1;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
`;

const OrderStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 1.25rem;
`;

const OrderTitle = styled.div`
  ${display_xl}
  color: var(--black);
`;

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TabButton = styled.button`
  ${display_large}
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
  ${display_large}
  color: var(--gray300);
`;

const EmptyMessage = styled.div`
  ${display_large}
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray500);
  height: 12rem;
`;

const RequestContainer = styled.div`
  display: flex;
  padding: 1.25rem 1.5625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.75rem;

  border-radius: 1.25rem;
  background-color: var(--white);
  flex: 1;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;
