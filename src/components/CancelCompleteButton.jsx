
import React from 'react';
import styled from 'styled-components';
import { bold24} from '../styles/font';
import DividerIcon from '../assets/icons/divider-icon.svg?react';
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
        <DividerIcon />
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
  ${bold24}
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
    ${bold24}
    color: var(--gray500);
    flex-shrink: 0;
`;