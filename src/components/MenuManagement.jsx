import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MenuModal from './MenuModal';
import ConfirmModal from './ConfirmModal';
import { body_large, bold24, reg24, bold18, reg18, reg14 } from '../styles/font';

import MenuEditIcon from '../assets/icons/menuedit-icon.svg?react';

const MenuManagement = ({ title = "메뉴 관리" }) => {
    const menusdummy = [
      {
      "menuId": 1,
      "name": "아메리카노",
      "menuInfo" :"~~~~~",
      "price": 4000,
      "status": "ON_SALE"
    },
    {
      "menuId": 2,
      "name": "카페라떼",
      "menuInfo" :"~~~~~",
      "price": 4500,
      "status": "SOLD_OUT"
    }
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  
  //  편집 관련 상태
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  //  삭제 확인 모달 상태 추가
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

  
  //  드롭다운 위치 계산을 위한 ref
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const editButtonRefs = useRef({});

  //  드롭다운 토글
  const handleDropdownToggle = (menuId, event) => {
    event.stopPropagation();
    
    if (openDropdownId === menuId) {
      setOpenDropdownId(null);
    } else {
      //  버튼 위치 계산
      const buttonElement = editButtonRefs.current[menuId];
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.right + window.scrollX - 140
        });
      }
      setOpenDropdownId(menuId);
    }
  };

  //  메뉴 편집
  const handleEditMenu = (menuId) => {
    // setEditingMenuId(menuId);
    // setShowEditModal(true);
    // setOpenDropdownId(null);
    console.log('메뉴 편집 클릭:', menuId);
  };

  //  일시품절 토글 (SOLD_OUT ↔ ON_SALE)
  const handleToggleOutOfStock = async (menuId) => {
    console.log('일시품절 토글 클릭:', menuId);
  };

  //  메뉴 삭제
  const handleDeleteMenuClick = (menuId) => {
    console.log('삭제 클릭:', menuId);
  };
  //  삭제 확인 시 실제 삭제 실행
  const handleConfirmDelete = async () => {
    console.log('삭제 확인:', menuToDelete);
  };

  //  삭제 취소
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setMenuToDelete(null);
  };
  //  외부 클릭 시 드롭다운 닫기
  const handleOutsideClick = () => {
    setOpenDropdownId(null);
  };

  //  스크롤 시 드롭다운 닫기
  useEffect(() => {
    const handleScroll = () => {
      setOpenDropdownId(null);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container onClick={handleOutsideClick}>
      <Header>
        <SectionTitle>{title}</SectionTitle>
        <AddButton onClick={() => setShowAddModal(true)}>등록</AddButton>
      </Header>

     <MenuList>
      {menusdummy.length === 0 ? (
        <EmptyState>등록된 메뉴가 없습니다.</EmptyState>
      ) : (
        menusdummy.map((menu) => {
          const detail = menu;
          
          // SOLD_OUT 상태 확인
          const isSoldOut = detail?.status === 'SOLD_OUT';
          
          return (
            <MenuCard key={menu.menuId} $isSoldOut={isSoldOut}>
              {/* 일시품절 오버레이 */}
              {isSoldOut && <OutOfStockOverlay />}
              
              <MenuContent>
                {/* 카테고리 */}
                <CategoryTag>
                  신메뉴
                </CategoryTag>

                {/* 메뉴 이미지 */}
                <MenuImage 
                  src={menu.image}
                  alt={menu.name}
                  onError={(e) => {
                    e.target.src = "src/assets/images/mandoo.svg";
                  }}
                />

                {/* 메뉴 상세 정보 */}
                <MenuInfo>
                  <MenuName>{menu.name}</MenuName>
                  <MenuDescription>{detail?.description || menu.menuInfo}</MenuDescription>
                </MenuInfo>

                {/* 가격 */}
                <MenuPrice>{menu.price.toLocaleString()}원</MenuPrice>
              </MenuContent>

              {/* 편집 버튼 */}
              <EditButton 
                ref={(el) => editButtonRefs.current[menu.menuId] = el}
                onClick={(e) => handleDropdownToggle(menu.menuId, e)}
                $isActive={openDropdownId === menu.menuId}
              >
                <MenuEditIcon />
              </EditButton>
            </MenuCard>
          );
        })
      )}
    </MenuList>

      {/*  Portal을 사용한 드롭다운 메뉴 */}
      {openDropdownId && createPortal(
        <DropdownMenuPortal
          style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 99999
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/*  메뉴 편집 (항상 표시) */}
          <DropdownItem onClick={() => handleEditMenu(openDropdownId)}>
            메뉴 편집
          </DropdownItem>
          
          {/*  일시품절 설정/해제 (상태에 따라 텍스트 변경) */}
          <DropdownItem onClick={() => handleToggleOutOfStock(openDropdownId)}>
            일시품절 설정
          </DropdownItem>
          
          {/*  메뉴 삭제 (항상 표시) */}
          <DropdownItem 
            onClick={() => handleDeleteMenuClick(openDropdownId)}
            $isDanger={true}
          >
            메뉴 삭제
          </DropdownItem>
        </DropdownMenuPortal>,
        document.body
      )}

      {/*  메뉴 등록 모달 */}
      {showAddModal && (
        <MenuModal onClose={() => setShowAddModal(true)} />
      )}

      {/*  메뉴 편집 모달 */}
      {showEditModal && editingMenuId && (
        <MenuModal 
          onClose={() => {
            setShowEditModal(false);
            setEditingMenuId(null);
          }}
          editingMenuId={editingMenuId}
        />
      )}
      {/*  삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={menuToDelete ? `'${menuToDelete.name}' 메뉴를\n정말로 삭제하시겠습니까?` : ''}
      />
    </Container>
  );
};

export default MenuManagement;

//  스타일 컴포넌트들 (수정된 부분)
const Container = styled.div`
  background: var(--white);
  padding: 1.875rem;
  gap: 2rem;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  ${bold24}
  color: var(--black);
`;

const AddButton = styled.button`
  ${reg24}
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: var(--secondary);
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

const EmptyState = styled.div`
  ${bold24}
  color: var(--gray500);
  text-align: center;
  padding: 3rem;
`;

//  SOLD_OUT 상태 지원으로 변수명 변경
const MenuCard = styled.div`
  position: relative;
  display: flex;
  padding: 0.6875rem 1.5rem;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border: 1px solid var(--third);
  border-radius: 0.625rem;
  background: var(--white);
  
  &:hover {
    border-color: var(--primary);
  }
  
  ${props => props.$isSoldOut && `
    opacity: 0.7;
  `}
`;

const OutOfStockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gray100);
  opacity: 0.8;
  z-index: 1;
`;

const CategoryTag = styled.div`
  ${bold18}
  color: var(--black);
  text-align: center;
  padding: 0.5rem 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 15%;
`;

const MenuContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;
  flex: 1;
  position: relative;
  z-index: 2;
`;

const MenuImage = styled.img`
  height: 100%;
  aspect-ratio: 1;
  max-width: 60px;
  max-height: 60px;
  min-width: 60px;
  min-height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
  background: var(--gray100);
  flex-shrink: 0;
`;

const MenuInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const MenuName = styled.h4`
  ${reg18}
  color: var(--black);
  margin: 0;
`;

const MenuDescription = styled.p`
  ${reg14}
  color: var(--gray600);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const MenuPrice = styled.div`
  ${bold18}
  color: var(--black);
  flex-shrink: 0;
  margin-right: 1rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: var(--gray500);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  
  &:hover {
    background: var(--gray100);
    color: var(--gray700);
  }
  
  ${props => props.$isActive && `
    background: var(--gray100);
    color: var(--gray700);
  `}
`;

const DropdownMenuPortal = styled.div`
  min-width: 140px;
  background: var(--white);
  border: 1px solid var(--gray300);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  
  animation: dropdownFadeIn 0.15s ease-out;
  
  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.button`
  ${body_large}
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${props => props.$isDanger ? 'var(--red)' : 'var(--black)'};
  
  &:hover {
    background: ${props => props.$isDanger ? 'var(--red)05' : 'var(--gray100)'};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--gray200);
  }
`;


