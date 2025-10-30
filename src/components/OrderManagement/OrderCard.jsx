// components/OrderCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import CancelCompleteButton from './CancelCompleteButton';
import ConfirmModal from './ConfirmModal';

import { reg14, reg24, bold24, bold36 } from '../../styles/font';
import { formatDateTime } from '../../utils/formatTime';

const OrderCard = ({ order, onComplete, onCancel }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // 완료 버튼 클릭 시 모달 열기
  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };

  // 취소 버튼 클릭 시 모달 열기
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmComplete = async () => {
    try {
      onComplete(order.orderId);
      setShowCompleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      onCancel(order.orderId);
      setShowCancelModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 요청사항이 있는지 확인
  const hasRequest = order.requestNote && order.requestNote.trim() !== '';

  return (
    <>
      <CardWrapper status={order.status}>
        {/* 상단: 주문 시간과 주문 번호 */}
        <HeaderWrapper>
          <CardHeader>
            <OrderTime>{`주문번호 (${formatDateTime(order.orderedAt)})`}</OrderTime>

            <OrderTitle>테이블</OrderTitle>
          </CardHeader>

          <CardInfo>
            <OrderNumber>{order.orderId.split('-')[0]}</OrderNumber>
            <TableNumber>{order.tableId}번</TableNumber>
          </CardInfo>
        </HeaderWrapper>

        {/* 요청사항 (있을 때만 표시) */}
        {hasRequest && <RequestSection>{order.requestNote}</RequestSection>}

        {/* 메뉴 리스트 */}
        <MenuScrollContainer>
          {order.items.map((item, index) => (
            <MenuItem key={index}>
              <MenuName>{item.menuName}</MenuName>
              <MenuQuantity>{item.amount}</MenuQuantity>
            </MenuItem>
          ))}
        </MenuScrollContainer>
        <ButtonContainer>
          {/* 하단 버튼 - COMPLETED 상태면 버튼 숨김 */}
          {order.status === 'PENDING' && (
            <CancelCompleteButton
              leftButton={{ text: '취소', type: 'cancel' }}
              rightButton={{ text: '완료', type: 'accept' }}
              onLeftClick={handleCancelClick}
              onRightClick={handleCompleteClick}
            />
          )}
        </ButtonContainer>
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
        message={`주문을 취소하시겠습니까?\n손님에게 취소 사유를 전달해주세요.`}
      />
    </>
  );
};

export default OrderCard;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.9375rem 0;
  //상단 헤더 고정, 메뉴만 스크롤 align-self: stretch;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  flex-shrink: 0;

  width: 20rem;
  background: var(--white);
  border-radius: 1.25rem;
  border: 2px solid var(--secondary);
  box-shadow: 0 4px 8px 0 rgba(130, 152, 255, 0.2);
  cursor: ${(props) => (props.status === 'PENDING' ? 'pointer' : 'default')};
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1.25rem;
  padding: 0 1.25rem;
`;

//상단 헤더 고정, 메뉴만 스크롤
const MenuScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  gap: 1.25rem;
  overflow-y: auto;
  padding: 0 1.25rem;

  &::-webkit-scrollbar {
    width: 4px;
    border-radius: 6px;
    background: var(--gray300);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--secondary);
    border-radius: 6px;
  }
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  gap: 1rem;
`;

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const OrderTime = styled.span`
  ${reg14}
  color: var(--black);
  white-space: nowrap;
`;

const TableNumber = styled.div`
  ${bold36}
  color: var(--black);
  text-align: center;
`;

const OrderTitle = styled.span`
  ${reg14}
  color: var(--black);
  white-space: nowrap;
`;

const OrderNumber = styled.span`
  ${bold36}
  color: var(--black);
`;

const RequestSection = styled.div`
  ${reg24}
  display: flex;
  align-items: center;
  padding: 1rem;
  margin: 0 1.25rem 1rem;
  border-radius: 0.625rem;
  align-self: stretch;

  background: rgba(255, 77, 77, 0.1);
  color: var(--red);
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
  ${reg24}
`;

const MenuQuantity = styled.span`
  ${bold24}
  text-align: right;
  font-weight: 700;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
`;
