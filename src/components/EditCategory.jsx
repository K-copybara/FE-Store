import styled from 'styled-components';
import {  bold18, bold24, reg14, reg18, title_medium} from '../styles/font';
import { useState } from 'react';

import EditIcon from '../assets/icons/EditCategory/edit-icon.svg?react';
import DragIcon from '../assets/icons/EditCategory/drag-icon.svg?react';
import DeleteIcon from '../assets/icons/EditCategory/delete-icon.svg?react';
import PlusIcon from '../assets/icons/EditCategory/categoryplus-icon.svg?react';

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


