import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import OrderCard from '../../components/OrderManagement/OrderCard';
import RequestCard from '../../components/OrderManagement/RequestCard';

import { display_xl, display_large } from '../../styles/font';

const dummyPending = [
  {
    orderId: 'f694f148-3950-41a4-8df9-b01611645c05',
    tableId: 5,
    orderedAt: '2025-10-07T16:50:11.755Z',
    status: 'PENDING',
    requestNote: '땅콩은 빼주세요.',
    items: [
      { menuId: 101, menuName: '탄탄지 샐러드', amount: 1 },
      { menuId: 105, menuName: '마라 우육면', amount: 1 },
    ],
  },
  {
    orderId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    tableId: 2,
    orderedAt: '2025-10-07T16:51:25.421Z',
    status: 'PENDING',
    requestNote: '냅킨 좀 더 챙겨주세요.',
    items: [{ menuId: 202, menuName: '어향가지', amount: 2 }],
  },
  {
    orderId: '12345678-abcd-efgh-ijkl-mnopqrstuv',
    tableId: 8,
    orderedAt: '2025-10-07T16:52:45.100Z',
    status: 'PENDING',
    requestNote: '공기밥 1개 추가요.',
    items: [
      { menuId: 301, menuName: '계란 볶음밥', amount: 1 },
      { menuId: 102, menuName: '하가우', amount: 3 },
    ],
  },
  {
    orderId: 'zyxw9876-vuts-rqpo-nmlk-jihgfedcba',
    tableId: 3,
    orderedAt: '2025-10-07T16:53:15.832Z',
    status: 'PENDING',
    requestNote: '아이 의자 하나 필요해요.',
    items: [{ menuId: 404, menuName: '꿔바로우', amount: 1 }],
  },
  {
    orderId: 'f0e1d2c3-b4a5-6789-fedc-ba9876543210',
    tableId: 11,
    orderedAt: '2025-10-07T16:54:02.555Z',
    status: 'PENDING',
    requestNote: '소스 많이 주세요!',
    items: [
      { menuId: 103, menuName: '쇼마이', amount: 2 },
      { menuId: 205, menuName: '멘보샤', amount: 1 },
    ],
  },
];

const dummyCompleted = [
  {
    orderId: 'a2c7e0f1-8c1a-4b2b-9e5d-7f4a2d3c1b0e',
    tableId: 1,
    orderedAt: '2025-10-07T14:30:55.123Z',
    status: 'COMPLETED',
    requestNote: '앞접시 2개 부탁드려요.',
    items: [
      { menuId: 201, menuName: '유린기', amount: 1 },
      { menuId: 302, menuName: '해물 짬뽕', amount: 1 },
    ],
  },
  {
    orderId: 'b3d8f1g2-9d2b-5c3c-ad6e-8g5b3e4d2c1f',
    tableId: 4,
    orderedAt: '2025-10-07T14:32:10.642Z',
    status: 'COMPLETED',
    requestNote: '단무지 많이 주세요.',
    items: [{ menuId: 303, menuName: '잡채밥', amount: 2 }],
  },
  {
    orderId: 'c4e9g2h3-ae3c-6d4d-be7f-9h6c4f5e3d2g',
    tableId: 7,
    orderedAt: '2025-10-07T14:35:05.311Z',
    status: 'COMPLETED',
    requestNote: null,
    items: [
      { menuId: 104, menuName: '소룡포', amount: 2 },
      { menuId: 401, menuName: '칭따오', amount: 1 },
    ],
  },
  {
    orderId: 'd5f0h3i4-bf4d-7e5e-cf8g-ai7d5g6f4e3h',
    tableId: 6,
    orderedAt: '2025-10-07T14:38:22.987Z',
    status: 'COMPLETED',
    requestNote: '덜 맵게 해주세요.',
    items: [{ menuId: 105, menuName: '마라 우육면', amount: 1 }],
  },
  {
    orderId: 'e6g1i4j5-cg5e-8f6f-dg9h-bj8e6h7g5f4i',
    tableId: 9,
    orderedAt: '2025-10-07T14:40:18.490Z',
    status: 'COMPLETED',
    requestNote: '고수 빼주세요.',
    items: [
      { menuId: 101, menuName: '탄탄지 샐러드', amount: 1 },
      { menuId: 404, menuName: '꿔바로우', amount: 1 },
    ],
  },
];

const dummyCanceled = [
  {
    orderId: 'h7i2j5k6-dh6f-9g7g-ehah-ck9f7i8h6g5j',
    tableId: 12,
    orderedAt: '2025-10-07T17:01:15.123Z',
    status: 'CANCELED',
    requestNote: '주문 실수로 취소합니다.',
    items: [{ menuId: 203, menuName: '마파두부', amount: 1 }],
  },
  {
    orderId: 'i8j3k6l7-ei7g-ah8h-fibj-dlah8j9i7h6k',
    tableId: 3,
    orderedAt: '2025-10-07T17:02:30.456Z',
    status: 'CANCELED',
    requestNote: '메뉴를 변경하려고 취소합니다.',
    items: [
      { menuId: 102, menuName: '하가우', amount: 2 },
      { menuId: 103, menuName: '쇼마이', amount: 2 },
    ],
  },
  {
    orderId: 'j9k4l7m8-fj8h-bi9i-gjck-embj9ka08i7l',
    tableId: 5,
    orderedAt: '2025-10-07T17:03:45.789Z',
    status: 'CANCELED',
    requestNote: '일행이 도착하지 않아 취소합니다.',
    items: [
      { menuId: 404, menuName: '꿔바로우', amount: 1 },
      { menuId: 301, menuName: '계란 볶음밥', amount: 2 },
    ],
  },
  {
    orderId: 'k0l5m8n9-gk9i-cjaj-hkdl-fncjakb19j8m',
    tableId: 1,
    orderedAt: '2025-10-07T17:04:55.912Z',
    status: 'CANCELED',
    requestNote: '재료 소진으로 인한 가게 측 취소',
    items: [{ menuId: 501, menuName: '오늘의 특선', amount: 1 }],
  },
  {
    orderId: 'l1m6n9o0-hlaj-dkbk-ilfm-godlbkc2ak9n',
    tableId: 10,
    orderedAt: '2025-10-07T17:05:20.333Z',
    status: 'CANCELED',
    requestNote: '요청사항 반영이 어려워 취소 처리되었습니다.',
    items: [{ menuId: 105, menuName: '마라 우육면', amount: 1 }],
  },
];

const dummyRequest = [
  {
    requestId: 2,
    tableId: 5,
    requestedAt: '2025-10-05T22:19:12.333612',
    status: 'PENDING',
    requestNote: '요청사항 들어!!',
    items: [
      {
        name: '요청사항 메뉴명',
        amount: 2,
      },
      {
        name: '메뉴명',
        amount: 1,
      },
    ],
  },
  {
    requestId: 1,
    tableId: 5,
    requestedAt: '2025-10-05T22:18:27.708145',
    status: 'PENDING',
    requestNote: null,
    items: [
      {
        name: '요청사항 메뉴명',
        amount: 2,
      },
      {
        name: '메뉴명',
        amount: 1,
      },
    ],
  },
];

const OrderManagementPage = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      //const res = await getOrders();
      if (activeTab === 'PENDING') {
        setOrders(dummyPending);
      } else if (activeTab === 'COMPLETED') {
        setOrders(dummyCompleted);
      } else {
        setOrders(dummyCanceled);
      }
    };

    fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    const fetchRequests = async () => {
      //const res = await getRequests();
      setRequests(dummyRequest);
    };

    fetchRequests();
  }, []);

  return (
    <Layout>
      <Sidebar />
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
          orders.map((order) => <OrderCard key={order.orderId} order={order} />)
        )}
      </OrderContainer>
      <RequestContainer>
        <OrderTitle>요청</OrderTitle>
        {requests.length === 0 ? (
          <EmptyMessage>요청사항이 없습니다.</EmptyMessage>
        ) : (
          requests.map((request) => (
            <RequestCard
              key={request.requestId}
              request={request}
              onComplete={() => completeRequest(request.requestId)}
            />
          ))
        )}
      </RequestContainer>
    </Layout>
  );
};

export default OrderManagementPage;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;
  height: 100%;
`;

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
