// components/OrderCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import CancelCompleteButton from './CancelCompleteButton';
import ConfirmModal from './ConfirmModal';

import { display_small, display_xl, display_large } from '../../styles/font';

const OrderCard = ({ order }) => {
  const [isNew, setIsNew] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCardClick = () => {
    if (order.status === 'PENDING' && isNew) {
      setIsNew(false);
    }
  };

  // 완료 버튼 클릭 시 모달 열기
  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };

  // 취소 버튼 클릭 시 모달 열기
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmComplete = () => {
    setShowCompleteModal(false);
    // 완료 api 호출
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    // 취소 api 호출
  };

  // 요청사항이 있는지 확인
  const hasRequest = order.requestNote && order.requestNote.trim() !== '';

  return (
    <>
      <CardWrapper
        status={order.status}
        isNew={isNew}
        onClick={handleCardClick}
      >
        {/* 상단: 주문 시간과 주문 번호 */}
        <CardHeader>
          <Left>
            <OrderTime>{order.orderedAt}</OrderTime>
            <TableNumber hasRequest={hasRequest}>{order.tableId}번</TableNumber>
          </Left>
          <Right>
            <OrderTitle>주문번호</OrderTitle>
            <OrderNumber>{order.orderId.substr(0, 1)}</OrderNumber>
          </Right>
        </CardHeader>

        {/* 요청사항 (있을 때만 표시) */}
        {hasRequest && <RequestSection>{order.requestNote}</RequestSection>}

        {/* 메뉴 리스트 */}

        {order.items.map((item, index) => (
          <MenuItem key={index}>
            <MenuName>{item.menuName}</MenuName>
            <MenuQuantity>{item.amount}</MenuQuantity>
          </MenuItem>
        ))}

        {/* 하단 버튼 - COMPLETED 상태면 버튼 숨김 */}
        {order.status === 'PENDING' && (
          <CancelCompleteButton
            leftButton={{ text: '취소', type: 'cancel' }}
            rightButton={{ text: '완료', type: 'accept' }}
            onLeftClick={handleCancelClick}
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
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        message="주문을 취소하시겠습니까?\n손님에게 취소 사유를 전달해주세요."
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
  border: 2px solid
    ${(props) => {
      if (props.status === 'PENDING' && props.isNew) return 'var(--yellow)';
      if (props.status === 'PENDING' && !props.isNew) return 'var(--secondary)';
      return 'var(--secondary)';
    }};
  box-shadow: ${(props) => {
    if (props.status === 'PENDING' && !props.isNew)
      return '0 4px 8px 0 rgba(252, 201, 0, 0.20)';
    if (props.status === 'PENDING' && props.isNew)
      return '0 4px 8px 0 rgba(130, 152, 255, 0.20)';
    return '0 4px 8px 0 rgba(130, 152, 255, 0.20)';
  }};
  cursor: ${(props) => (props.status === 'PENDING' ? 'pointer' : 'default')};
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
  margin-bottom: ${(props) => (props.hasRequest ? '8px' : '12px')};
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

  background: rgba(255, 77, 77, 0.1);
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
