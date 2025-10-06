
import React from 'react';
import styled from 'styled-components';
import { display_large } from '../styles/font';

const CancelCompleteButton = ({ 
  leftButton = { text: '취소', type: 'cancel' },
  rightButton = { text: '완료', type: 'accept' },
  onLeftClick,
  onRightClick
}) => {
  return (
    <ActionsContainer>
      <ActionButton 
        type={leftButton.type} 
        onClick={onLeftClick}
      >
        {leftButton.text}
      </ActionButton>
      <ActionDivider>
        <svg width="3" height="23" viewBox="0 0 3 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.04688 0.640625V22.3906H0.3125V0.640625H2.04688Z" fill="#999999"/>
        </svg>
 </ActionDivider>
      <ActionButton 
        type={rightButton.type} 
        onClick={onRightClick}
      >
        {rightButton.text}
      </ActionButton>
    </ActionsContainer>
  );
};

export default CancelCompleteButton;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ActionButton = styled.button`
  ${display_large}
  display: flex;
  padding: 0.625rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  flex: 1;

  background: none;
  border: none;
  cursor: pointer;

  color: ${props => {
    switch(props.type) {
      case 'cancel': return 'var(--gray700)';
      case 'accept': return 'var(--primary)';
      default: return 'var(--gray700)';
    }
  }};
`;

const ActionDivider = styled.span`
    ${display_large}
    color: var(--gray500);
    flex-shrink: 0;
`;