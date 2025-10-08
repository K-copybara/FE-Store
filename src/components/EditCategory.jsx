import styled from 'styled-components';
import {  bold18, bold24, reg14, reg18, title_medium} from '../styles/font';
import { useState } from 'react';


const EditCategory = ({ title = "메뉴 카테고리" }) => {

    const categories = [
      {categoryId: 1, name: '신메뉴', order: 0, menuCount: 1},
      {categoryId: 2, name: '딤섬', order: 1, menuCount: 0},
      {categoryId: 3, name: '식사류', order: 2, menuCount: 0},
      {categoryId: 4, name: '음료', order: 3, menuCount: 0}
    ];

  //  카테고리 순서 변경
  const updateCategoryOrder = async (categoryOrders) => {
    console.log('카테고리 순서 변경 요청:', categoryOrders);
  };
  //  헬퍼 함수 - 현재 카테고리 정렬된 상태로 반환. 필요한가??
  const getCategories = () => {
    return categories.sort((a, b) => a.order - b.order);
  };

  //  카테고리 삭제 가능 여부 확인 (메뉴가 없는 경우에만 가능)
  const canDeleteCategory = (categoryId) => {
    console.log('카테고리 삭제 가능 여부 확인:', categoryId);
  };

  const [showModal, setShowModal] = useState(false);
  const [localCategories, setLocalCategories] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');


  //  요청사항 카테고리 자동 추가 함수
  const ensureRequestCategory = (categoriesData) => {
    const hasRequestCategory = categoriesData.some(cat => cat.name === '요청사항');
    
    if (!hasRequestCategory) {
      // 새 ID 생성
      const newCategoryId = categoriesData.length > 0 
        ? Math.max(...categoriesData.map(c => c.categoryId)) + 1 
        : 1;
      
      // 요청사항 카테고리 추가 (항상 맨 뒤에)
      const requestCategory = {
        categoryId: newCategoryId,
        name: '요청사항',
        order: categoriesData.length,
        menuCount: 0
      };
      
      return [...categoriesData, requestCategory];
    }
    
    return categoriesData;
  };

  //  카테고리 데이터 가져올 때마다 요청사항 카테고리 보장
  const getEnhancedCategories = () => {
    const originalCategories = getCategories();
    return ensureRequestCategory(originalCategories);
  };

  //  categories는 항상 요청사항이 포함된 데이터
  //const categories = getEnhancedCategories();

  //  요청사항 카테고리인지 확인하는 함수
  const isRequiredCategory = (categoryName) => {
    return categoryName === '요청사항';
  };

  const handleEditClick = () => {
    // 모달 열 때도 요청사항 카테고리 포함된 데이터로 초기화
    setLocalCategories(getEnhancedCategories());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsAddingNew(false);
    setNewCategoryName('');
    setDraggedIndex(null);
  };

  //  드래그 앤 드롭 처리 (요청사항 카테고리는 드래그 제한)
  const handleDragStart = (index) => {
    const category = localCategories[index];
    if (isRequiredCategory(category.name)) {
      return; // 요청사항 카테고리는 드래그 불가
    }
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  //  드롭 처리 (요청사항 카테고리 위치 보호)
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const dropCategory = localCategories[dropIndex];
    if (isRequiredCategory(dropCategory.name)) {
      return; // 요청사항 카테고리 위치에는 드롭 불가
    }

    const updated = [...localCategories];
    const draggedItem = updated[draggedIndex];
    
    // 드래그된 아이템 제거
    updated.splice(draggedIndex, 1);
    // 새 위치에 삽입
    updated.splice(dropIndex, 0, draggedItem);
    
    setLocalCategories(updated);
    setDraggedIndex(null);
  };

  //  카테고리 삭제 (요청사항 카테고리는 삭제 불가)
  const handleDelete = async (categoryId) => {
    // const category = localCategories.find(cat => cat.categoryId === categoryId);
    
    // if (isRequiredCategory(category?.name)) {
    //   alert('요청사항 카테고리는 삭제할 수 없습니다.');
    //   return;
    // }

    // if (!canDeleteCategory(categoryId)) {
    //   alert('메뉴가 있는 카테고리는 삭제할 수 없습니다.');
    //   return;
    // }

    // //  요청사항 카테고리는 실제 API로 삭제 요청하지 않음 (프론트에서만 존재하므로)
    // const result = await deleteCategory(categoryId);
    // if (result.success) {
    //   setLocalCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
    // } else {
    //   alert('삭제 실패: ' + result.error);
    // }
    console.log('카테고리 삭제 클릭:', categoryId);
  };

  //  새 카테고리 추가 (요청사항 중복 방지)
  const handleAddNew = () => {
    console.log('새 카테고리 추가 클릭');
  };


  //  새 카테고리 저장 처리 체크 표시. 
  // const handleSaveNew = async () => {
  //   if (!newCategoryName.trim()) {
  //     alert('카테고리명을 입력해주세요.');
  //     return;
  //   }

  //   //  요청사항 카테고리 중복 방지
  //   // if (isRequiredCategory(newCategoryName.trim())) {
  //   //   alert('요청사항 카테고리는 이미 존재합니다.');
  //   //   return;
  //   // }

  //   //  기존 카테고리명 중복 확인
  //   const isDuplicate = localCategories.some(cat => 
  //     cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
  //   );

  //   if (isDuplicate) {
  //     alert('이미 존재하는 카테고리명입니다.');
  //     return;
  //   }

  //   const result = await createCategory(newCategoryName.trim());
  //   if (result.success) {
  //     const newCategory = {
  //       categoryId: result.data.categoryId,
  //       name: newCategoryName.trim(),
  //       order: localCategories.length,
  //       menuCount: 0
  //     };
  //     setLocalCategories(prev => [...prev, newCategory]);
  //     setIsAddingNew(false);
  //     setNewCategoryName('');
  //   } else {
  //     alert('추가 실패: ' + result.error);
  //   }
  // };

  // 새 카테고리 추가 취소  X
  // const handleCancelNew = () => {
  //   setIsAddingNew(false);
  //   setNewCategoryName('');
  // };

  //저장 처리 (요청사항 카테고리는 제외하고 API 전송)
const handleSave = async () => {
  // 요청사항 카테고리 제외하고 API 전송
  const regularCategories = localCategories.filter(cat => !isRequiredCategory(cat.name));
  
  const categoryOrders = regularCategories.map((category, index) => ({
    categoryId: category.categoryId,
    order: index
  }));

  const result = await updateCategoryOrder(categoryOrders);
  if (result.success) {
    handleCloseModal();
  } else {
    alert('저장 실패: ' + result.error);
  }
};

  return (
    <>
      <Container>
        <Header>
          <SectionTitle>{title}</SectionTitle>
          <ActionButton onClick={handleEditClick}>
            <EditIcon />
          </ActionButton>
        </Header>

        <CategoryDisplay>
          {categories.map((category) => (
            <CategoryItem key={category.categoryId}>
              <CategoryName>{category.name}</CategoryName>
              <MenuCount>{category.menuCount}개</MenuCount>
            </CategoryItem>
          ))}
        </CategoryDisplay>
      </Container>

      {/* 모달 - 기존과 동일 */}
      {showModal && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>카테고리 편집</ModalTitle>
              <Save onClick={handleSave}>
                저장
              </Save>
            </ModalHeader>

            <CategoryList>
              {localCategories.map((category, index) => (
                <CategoryRow
                  key={category.categoryId}
                  draggable={!isRequiredCategory(category.name)}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                <MenuHeader>
                  {/* 드래그 핸들 */}
                  <DragHandle>
                    <DragIcon />
                  </DragHandle>

                  {/* 카테고리명 */}
                <CategoryInputName>
                {category.name}
                </CategoryInputName>

                  {/* 메뉴 개수 */}
                  <MenuCount2>{category.menuCount}개</MenuCount2>
                </MenuHeader>
                  {/*  삭제 버튼 (요청사항 카테고리는 삭제 불가) */}
                  {!isRequiredCategory(category.name) && canDeleteCategory(category.categoryId) && (
                    <DeleteButton onClick={() => handleDelete(category.categoryId)}>
                      <DeleteIcon />
                    </DeleteButton>
                  )}
                </CategoryRow>
              ))}

              {/* 새 카테고리 추가 중인 경우 */}
              {isAddingNew && (
                <CategoryRow>
                 <MenuHeader>
                  <DragHandle>
                    <DragIcon />
                  </DragHandle>
                  
                  <CategoryInput
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    autoFocus
                    // onKeyPress={(e) => {
                    //   if (e.key === 'Enter') {
                    //     handleSaveNew();
                    //   } else if (e.key === 'Escape') {
                    //     handleCancelNew();
                    //   }
                    // }}
                  />
                  <MenuCount2>0개</MenuCount2>
                    </MenuHeader>
                  {/* <ActionButtons>
                    <SaveButton onClick={handleSaveNew}>
                      <CheckIcon />
                    </SaveButton>
                    <CancelButton onClick={handleCancelNew}>
                      <CancelIcon />
                    </CancelButton>
                  </ActionButtons> */}
                </CategoryRow>
              )}
            </CategoryList>

            {/* 추가 버튼 */}
            {!isAddingNew && (
              <AddButton onClick={handleAddNew}>
                <PlusIcon />
              </AddButton>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default EditCategory;

//  기존 스타일 컴포넌트들 (변경 없음)
const Container = styled.div`
  background: var(--white);
  padding: 1.875rem;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled.h3`
  ${bold24}
  color: var(--black);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: var(--gray100);
  }
`;

const CategoryDisplay = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.75rem;
  gap: 0.625rem;
  border: 1px solid var(--gray300);
  border-radius: 0.625rem;
  background: var(--white);
`;
const MenuHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1.25rem;
`;
const CategoryName = styled.div`
  ${title_medium}
  color: var(--black);
`;

const MenuCount = styled.div`
  ${title_medium}
  color: var(--black);
`;

// Modal 스타일
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
  flex-direction: column;
  align-items: center;
  background: var(--white);
  border-radius: 0.625rem;
  padding: 1.25rem;
  gap: 1.25rem;
  width: 30%;
  max-width: 37.5rem;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  ${bold18}
  color: var(--black);
`;

const Save = styled.button`
  ${reg14}
  color: var(--gray500);
  background: none;
    border: none;
    cursor: pointer;
`;
const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  gap: 1.12rem;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  gap: 4.625rem;
  padding: 1rem 1.0625rem;
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--white);
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;
const MenuCount2 = styled.div`
  ${reg18}
  color: var(--black);
    white-space: nowrap;
  flex-shrink: 0;
`;
const DragHandle = styled.div`
  cursor: grab;
  display: flex;
  align-items: center;
  color: var(--gray400);
  
  &:active {
    cursor: grabbing;
  }
`;

const CategoryInput = styled.input`
  ${bold24}
  display: flex;
  align-items: center;
  border-radius: 0.3125rem;
  width: 90%;
  border: 1px solid var(--third);
  background: var(--gray100);
  color: var(--black);
`;

const CategoryInputName = styled.div`
   ${bold24}
    flex: 1;
    border: none;
    background: transparent;
    color: var(--black);
    &:focus {
        outline: none;
        background: var(--gray50);
        border-radius: 0.375rem;
        padding: 0.25rem 0.5rem;
    }
    
    &::placeholder {
        color: var(--gray400);
  }
`;
const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SaveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary);
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--gray500);
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  border-radius: 3.125rem;
  background: var(--gray100);
  cursor: pointer;
`;

// 아이콘 컴포넌트들 (기존과 동일)
const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.675 19.85C1.375 19.9333 1.09167 19.9083 0.825 19.775C0.558334 19.6417 0.358334 19.4417 0.225 19.175C0.0916668 18.9083 0.0666667 18.625 0.15 18.325L1.1 14.475L13.85 1.75C14.25 1.35 14.7083 1.08333 15.225 0.949999C15.7417 0.799999 16.2583 0.799999 16.775 0.949999C17.2917 1.08333 17.75 1.35 18.15 1.75L18.25 1.85C18.65 2.25 18.9167 2.70833 19.05 3.225C19.2 3.74167 19.2 4.25833 19.05 4.775C18.9167 5.29167 18.65 5.75 18.25 6.15L5.525 18.9L1.675 19.85ZM2.075 18.85C2.09167 18.8 2.09167 18.725 2.075 18.625C2.075 18.525 2.05833 18.4 2.025 18.25C1.99167 18.0833 1.94167 17.9167 1.875 17.75L4.475 17.1L16.85 4.75C17.1167 4.48333 17.25 4.23333 17.25 4C17.25 3.76667 17.1167 3.51667 16.85 3.25L16.75 3.15C16.4833 2.88333 16.2333 2.75 16 2.75C15.7667 2.75 15.5167 2.88333 15.25 3.15L2.9 15.525L2.075 18.85ZM12.3 4.7L13.7 3.3L16.7 6.3L15.3 7.7L12.3 4.7Z" fill="#999999"/>
  </svg>
);

const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M8 6h.01M8 10h.01M8 14h.01M8 18h.01M16 6h.01M16 10h.01M16 14h.01M16 18h.01" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4.66667V12C4 12.4111 4.11667 12.7389 4.35 12.9833C4.59444 13.2167 4.92222 13.3333 5.33333 13.3333H10.6667C11.0889 13.3333 11.4167 13.2167 11.65 12.9833C11.8833 12.7389 12 12.4111 12 12V4.66667H4ZM13.3333 12C13.3333 12.4889 13.2167 12.9389 12.9833 13.35C12.75 13.75 12.4278 14.0722 12.0167 14.3167C11.6056 14.55 11.1556 14.6667 10.6667 14.6667H5.33333C4.84444 14.6667 4.39444 14.55 3.98333 14.3167C3.58333 14.0722 3.26111 13.75 3.01667 13.35C2.78333 12.9389 2.66667 12.4889 2.66667 12V3.33333H13.3333V12ZM2 4.66667C1.72222 4.66667 1.52778 4.55556 1.41667 4.33333C1.31667 4.11111 1.31667 3.88889 1.41667 3.66667C1.52778 3.44444 1.72222 3.33333 2 3.33333H3.33333V4.66667H2ZM14 3.33333C14.2778 3.33333 14.4667 3.44444 14.5667 3.66667C14.6778 3.88889 14.6778 4.11111 14.5667 4.33333C14.4667 4.55556 14.2778 4.66667 14 4.66667H12.6667V3.33333H14ZM10 1.33333C10.2778 1.33333 10.4667 1.44444 10.5667 1.66667C10.6778 1.88889 10.6778 2.11111 10.5667 2.33333C10.4667 2.55556 10.2778 2.66667 10 2.66667H6C5.72222 2.66667 5.52778 2.55556 5.41667 2.33333C5.31667 2.11111 5.31667 1.88889 5.41667 1.66667C5.52778 1.44444 5.72222 1.33333 6 1.33333H10Z" fill="#999999"/>
    </svg>
);

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13C3.58333 13 3.29167 12.8333 3.125 12.5C2.975 12.1667 2.975 11.8333 3.125 11.5C3.29167 11.1667 3.58333 11 4 11H20C20.4167 11 20.7 11.1667 20.85 11.5C21.0167 11.8333 21.0167 12.1667 20.85 12.5C20.7 12.8333 20.4167 13 20 13H4ZM11 4C11 3.58333 11.1667 3.3 11.5 3.15C11.8333 2.98333 12.1667 2.98333 12.5 3.15C12.8333 3.3 13 3.58333 13 4V20C13 20.4167 12.8333 20.7083 12.5 20.875C11.1667 21.025 11.8333 21.025 11.5 20.875C11.1667 20.7083 11 20.4167 11 20V4Z" fill="#8298FF"/>
    </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
