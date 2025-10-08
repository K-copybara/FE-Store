// components/ConfirmModal.jsx
import React from 'react';
import styled from 'styled-components';
import {reg24 } from '../styles/font';
import CancelCompleteButton from './CancelCompleteButton';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Message>{message}</Message>
        <CancelCompleteButton
          leftButton={{ text: '취소', type: 'cancel' }}
          rightButton={{ text: '확인', type: 'accept' }}
          onLeftClick={onClose}
          onRightClick={onConfirm}
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  padding: 5.96875rem 5.125rem 1.625rem 5.125rem;
  width: 31.25rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5.90625rem;
  
  background: var(--white);
  border-radius: 1.25rem;
  min-width: 25rem;
`;

const Message = styled.div`
  ${reg24}
  text-align: center;
  color: var(--black);
  white-space: pre-wrap;
`;
