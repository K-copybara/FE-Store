// components/OrderCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import CancelCompleteButton from './CancelCompleteButton';
import ConfirmModal from './ConfirmModal';

import { display_small, display_xl, display_large} from "../styles/font";

const OrderCard = ({ order, onAccept, onReject }) => {
  // 로컬 터치 상태 관리 (API와 별개)
  const [isTouched, setIsTouched] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false); // 완료 애니메이션 상태

  const handleCardClick = () => {
    // PENDING 상태이고 아직 터치 안됐을 때만 터치 처리
    if (order.status === 'PENDING' && !isTouched) {
      setIsTouched(true);
      // API 호출하지 않고, 단순히 UI 상태만 변경
    }
  };

  // 완료 버튼 클릭 시 모달 열기
  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };
  //취소 버튼 클릭
    const handleRejectClick = () => {
    onReject && onReject();
  };

  const handleConfirmComplete = () => {
    setShowCompleteModal(false);
    setIsCompleting(true); // 완료 애니메이션 시작
    
    // 애니메이션 후 실제 완료 처리
    setTimeout(() => {
      onAccept && onAccept();
    }, 500); // 0.5초 후 완료 처리
  };

  // 요청사항이 있는지 확인
  const hasRequest = order.request && order.request.trim() !== '';

  return (
    <>
    <CardWrapper 
      apiStatus={order.status}  // API 상태 (PENDING/COMPLETED)
      isTouched={isTouched}     // 로컬 터치 상태
      isCompleting={isCompleting} // 완료 애니메이션 상태
      onClick={handleCardClick}
    >
      {/* 상단: 주문 시간과 주문 번호 */}
      <CardHeader>
        <Left>
          <OrderTime>{order.orderTime}</OrderTime>
          <TableNumber hasRequest={hasRequest}>
            {order.tableNumber}번
          </TableNumber>
        </Left>
        <Right>
          <OrderTitle>주문번호</OrderTitle>
          <OrderNumber>{order.orderId}</OrderNumber>
        </Right>
      </CardHeader>

      {/* 요청사항 (있을 때만 표시) */}
      {hasRequest && (
        <RequestSection>
          {order.request}
        </RequestSection>
      )}

      {/* 메뉴 리스트 */}
      
        {order.items.map((item, index) => (
          <MenuItem key={index}>
            <MenuName>{item.name}</MenuName>
            <MenuQuantity>{item.quantity}</MenuQuantity>
          </MenuItem>
        ))}


      {/* 하단 버튼 - COMPLETED 상태면 버튼 숨김 */}
      {order.status === 'PENDING' && (
        <CancelCompleteButton 
          leftButton={{ text: '취소', type: 'cancel' }}
          rightButton={{ text: '완료', type: 'accept' }}
          onLeftClick={handleRejectClick}
          onRightClick={handleCompleteClick}
        />
      )}
    </CardWrapper>

    <ConfirmModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleConfirmComplete}
        message="주문을 완료로 처리하시겠습니까?"
      />
    </>
  );
};

export default OrderCard;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.9375rem 1.25rem;
  gap: 1.25rem;
  align-self: stretch;
  align-items: center;

  background: var(--white);
  border-radius: 1.25rem;
  border: 2px solid ${props => {
    // API 상태가 PENDING이고 터치 안됐으면 노란색
    if (props.apiStatus === 'PENDING' && !props.isTouched) return 'var(--yellow)';
    // API 상태가 PENDING이고 터치됐으면 파란색
    if (props.apiStatus === 'PENDING' && props.isTouched) return 'var(--secondary)';
    // COMPLETED면 파란색
    return 'var(--secondary)';
  }};
  box-shadow: ${props => {
    if (props.apiStatus === 'PENDING' && !props.isTouched) return '0 4px 8px 0 rgba(252, 201, 0, 0.20)';
    if (props.apiStatus === 'PENDING' && props.isTouched) return '0 4px 8px 0 rgba(130, 152, 255, 0.20)';
    return '0 4px 8px 0 rgba(130, 152, 255, 0.20)';
  }};
  cursor: ${props => props.apiStatus === 'PENDING' ? 'pointer' : 'default'};

`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  `;
const OrderTime = styled.span`
  ${display_small}
  color: var(--black);
`;

const TableNumber = styled.div`
  ${display_xl}
  color: var(--black);
  text-align: center;
  margin-bottom: ${props => props.hasRequest ? '8px' : '12px'};
`;

const OrderTitle = styled.span`
  ${display_small}
  color: var(--black);
`;

const OrderNumber = styled.span`
  ${display_xl}
  color: var(--black);
`;

const RequestSection = styled.div`
  ${display_large}
  display: flex;
  align-items: center;
  padding: 1.25rem;
  border-radius: 0.625rem;
  align-self: stretch;
  
  background: rgba(255, 77, 77, 0.10);
  color: var(--red);
  text-align: center;

`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  gap: 0.62rem;
  color: var(--black);
`;

const MenuName = styled.span`
  ${display_large}
`;

const MenuQuantity = styled.span`
  ${display_large}
  text-align: right;
  font-weight: 700;
`;
