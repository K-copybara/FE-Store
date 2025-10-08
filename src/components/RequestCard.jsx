// components/RequestCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import {reg14, reg24, bold24, bold36 } from "../styles/font";
import ConfirmModal from './ConfirmModal';

const RequestCard = ({ request, onComplete }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
 
  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };

  const handleConfirmComplete = () => {
    setShowCompleteModal(false);
    
    setTimeout(() => {
      onComplete && onComplete();
    }, 500);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <CardWrapper 
        status={request.status}
      >
        {/* 상단: 요청 시간과 테이블 번호 */}
        <CardHeader>
          <Left>
            <RequestTime>{formatTime(request.requestedAt)}</RequestTime>
            <TableNumber>{request.tableId}번</TableNumber>
          </Left>
        </CardHeader>

        {/* 요청 내용 */}
        {request.requestNote && (
          <RequestNote>
            {request.requestNote}
          </RequestNote>
        )}

        {/* 요청 아이템들 */}
        {request.items && request.items.length > 0 && (
          <ItemList>
            {request.items.map((item, index) => (
              <ItemRow key={index}>
                <ItemName>{item.name}</ItemName>
                <ItemQuantity>{item.amount}</ItemQuantity>
              </ItemRow>
            ))}
          </ItemList>
        )}

        {/* 완료 버튼 */}
        {request.status === 'PENDING' && (
          <CompleteButtonWrapper>
            <CompleteButton onClick={handleCompleteClick}>
              완료
            </CompleteButton>
          </CompleteButtonWrapper>
        )}
      </CardWrapper>

      {/* 완료 확인 모달 */}
      <ConfirmModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleConfirmComplete}
        message="요청을 완료로 처리하시겠습니까?"
      />
    </>
  );
};

export default RequestCard;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.9375rem 1.25rem;
  gap: 1.25rem;
  align-self: stretch;
  align-items: flex-start;

  background: var(--white);
  border-radius: 1.25rem;
  border: 1px solid ${props => {
    if (props.status === 'PENDING') return 'var(--secondary)';
    return 'var(--gray300)';
  }};
  box-shadow: ${props => {
    if (props.status === 'PENDING') return '0 4px 8px 0 rgba(25, 14, 170, 0.30)';
    return '0 2px 8px rgba(0,0,0,0.08)';
  }};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RequestTime = styled.span`
  ${reg14}
  color: var(--black);
`;

const TableNumber = styled.div`
  ${bold36}
  color: var(--black);
`;

const RequestNote = styled.div`
  ${reg24}
  color: var(--black);
  align-self: stretch;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  gap: 0.62rem;
  color: var(--black);
`;

const ItemName = styled.span`
  ${reg24}
`;

const ItemQuantity = styled.span`
  ${bold24}
  text-align: right;
  font-weight: 700;
`;

const CompleteButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  padding-top: 8px;
`;

const CompleteButton = styled.button`
  ${bold24}
  display: flex;
  padding: 0.625rem 1.5rem;
  justify-content: center;
  align-items: center;
  
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
`;

