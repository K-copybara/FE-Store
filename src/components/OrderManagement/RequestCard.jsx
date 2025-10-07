// components/RequestCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { display_small, display_xl, display_large } from '../../styles/font';
import ConfirmModal from './ConfirmModal';

const RequestCard = ({ request }) => {
  const [isNew, setIsNew] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };

  const handleConfirmComplete = () => {
    setShowCompleteModal(false);

    //요청 완료 api
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      <CardWrapper status={request.status} isNew={isNew}>
        <CardHeader>
          <Left>
            <RequestTime>{formatTime(request.requestedAt)}</RequestTime>
            <TableNumber>{request.tableId}번</TableNumber>
          </Left>
        </CardHeader>

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

        <CompleteButtonWrapper>
          <CompleteButton onClick={handleCompleteClick}>완료</CompleteButton>
        </CompleteButtonWrapper>
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
  gap: 1.25rem;
  align-self: stretch;
  align-items: flex-start;

  background: var(--white);
  border-radius: 1.25rem;
  border: 2px solid
    ${(props) => {
      if (props.isNew) return 'var(--yellow)';
      if (!props.isNew) return 'var(--secondary)';
      return 'var(--secondary)';
    }};
  box-shadow: ${(props) => {
    if (!props.isNew) return '0 4px 8px 0 rgba(252, 201, 0, 0.20)';
    if (props.isNew) return '0 4px 8px 0 rgba(130, 152, 255, 0.20)';
    return '0 4px 8px 0 rgba(130, 152, 255, 0.20)';
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
  ${display_small}
  color: var(--black);
`;

const TableNumber = styled.div`
  ${display_xl}
  color: var(--black);
`;

const RequestNote = styled.div`
  ${display_large}
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
  ${display_large}
`;

const ItemQuantity = styled.span`
  ${display_large}
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
  ${display_large}
  display: flex;
  padding: 0.625rem 1.5rem;
  justify-content: center;
  align-items: center;

  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
`;
