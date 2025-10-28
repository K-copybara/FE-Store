// components/RequestCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { reg14, reg24, bold24, bold36 } from '../../styles/font';
import ConfirmModal from './ConfirmModal';
import { formatDateTime } from '../../utils/formatTime';

const RequestCard = ({ request, onComplete }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };

  const handleConfirmComplete = async () => {
    try {
      onComplete(request.requestId);
      setShowCompleteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <CardWrapper status={request.status}>
        <HeaderWrapper>
          <CardHeader>
            <OrderTime>{`요청번호 (${formatDateTime(request.requestedAt)})`}</OrderTime>

            <OrderTitle>테이블</OrderTitle>
          </CardHeader>

          <CardInfo>
            <OrderNumber>{request.requestId}</OrderNumber>
            <TableNumber>{request.tableId}번</TableNumber>
          </CardInfo>
        </HeaderWrapper>

        {/* {request.requestNote} */}
        {request.requestNote && (
          <RequestNote>{request.requestNote}</RequestNote>
        )}

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
        <ButtonContainer>
        {request.status === 'PENDING' && (
          <CompleteButtonWrapper>
            <CompleteButton onClick={handleCompleteClick}>완료</CompleteButton>
          </CompleteButtonWrapper>
        )}
        </ButtonContainer>
      </CardWrapper>

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
  gap: 1rem;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  flex-shrink: 0;
  width: 30rem;
  background: var(--white);
  border-radius: 1.25rem;
  border: 2px solid var(--yellow);
  box-shadow: 0 4px 8px 0 rgba(252, 201, 0, 0.20);
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
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

const RequestNote = styled.div`
  ${reg24}
  color: var(--black);
  /* 긴 텍스트 처리 */
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;

  width: 100%;
  
  white-space: normal;  /* 줄바꿈 허용 */
  
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
`;

const CompleteButton = styled.button`
  ${bold24}
  display: flex;
  padding-top: 0.625rem;
  justify-content: center;
  align-items: center;

  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
`;