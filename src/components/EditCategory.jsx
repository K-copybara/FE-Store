import styled from 'styled-components';
import {  bold18, bold24, reg14, reg18, title_medium} from '../styles/font';
import { useState, useEffect} from 'react';

import EditIcon from '../assets/icons/EditCategory/edit-icon.svg?react';
import DragIcon from '../assets/icons/EditCategory/drag-icon.svg?react';
import DeleteIcon from '../assets/icons/EditCategory/delete-icon.svg?react';
import PlusIcon from '../assets/icons/EditCategory/categoryplus-icon.svg?react';
import CheckIcon from '../assets/icons/EditCategory/check-icon.svg?react';
import CancelIcon from '../assets/icons/EditCategory/cancel-icon.svg?react';

import { getCategories, postCategory, deleteCategory, patchCategoryOrder } from '../api/store';

const EditCategory = ({ title = "메뉴 카테고리", refreshKey = 0 }) => {
console.log('📁 [EditCategory] 렌더링, refreshKey:', refreshKey);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [localCategories, setLocalCategories] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // 카테고리 조회 함수 분리
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      console.log('카테고리 조회 성공:', data);
      setCategories(data);
    } catch (error) {
      setError(error);
      console.error('카테고리 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 refreshKey 변경 시 재조회
  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);  // refreshKey가 변경될 때마다 재조회
  

  // 새 카테고리 추가
  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewCategoryName('');
  };

  // 새 카테고리 저장
  const handleSaveNew = () => {
    if (!newCategoryName.trim()) {
      alert('카테고리명을 입력해주세요.');
      return;
    }

    // 요청사항 카테고리 중복 방지
    if (isRequiredCategory(newCategoryName.trim())) {
      alert('요청사항 카테고리는 이미 존재합니다.');
      return;
    }

    // 기존 카테고리명 중복 확인
    const isDuplicate = localCategories.some(cat => 
      cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert('이미 존재하는 카테고리명입니다.');
      return;
    }

    //localCategories에만 추가
    const tempId = -Date.now(); // 임시 ID (음수로 구분)
    const newCategory = {
      categoryId: tempId,
      name: newCategoryName.trim(),
      order: localCategories.length,
      menuCount: 0,
      isNew: true  // ← 새로 추가된 항목 표시
    };
    
    setLocalCategories(prev => [...prev, newCategory]);
    setIsAddingNew(false);
    setNewCategoryName('');
    
    console.log('임시 카테고리 추가:', newCategory);
  };

  // 새 카테고리 추가 취소  X
  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewCategoryName('');
  };

  // 카테고리 삭제 가능 여부 확인
  const canDeleteCategory = (categoryId) => {
    const category = localCategories.find(cat => cat.categoryId === categoryId);
    
    // 요청사항 카테고리는 항상 삭제 불가
    if (isRequiredCategory(category?.name)) {
      return false;
    }
    
    // 메뉴가 없으면 삭제 가능
    return category?.menuCount === 0;
  };

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

  const getCategoriesSorted = () => {
    return [...categories].sort((a, b) => a.order - b.order);
  };

  //  카테고리 데이터 가져올 때마다 요청사항 카테고리 보장
  const getEnhancedCategories = () => {
    const originalCategories = getCategoriesSorted();
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

  //  카테고리 삭제
  const handleDelete = async (categoryId) => {
    const category = localCategories.find(cat => cat.categoryId === categoryId);

    // 새로 추가한 항목 (아직 저장 안 함)
    if (category?.isNew) {
      // API 호출 없이 localCategories에서만 제거
      setLocalCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
      return;
    }

    // 삭제 확인
    const confirmDelete = window.confirm(`'${category.name}' 카테고리를 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    try {
      console.log('카테고리 삭제 요청:', categoryId);
      
      await deleteCategory(categoryId);
      
      console.log('카테고리 삭제 성공');
      
      // localCategories에서 제거
      setLocalCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
      
      // 전체 카테고리 다시 조회
      const refreshedCategories = await getCategories();
      setCategories(refreshedCategories);
      
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
      alert('카테고리 삭제에 실패했습니다.');
    }
  };


  const handleSave = async () => {
    // 새 카테고리 확인
    const newCategories = localCategories.filter(cat => cat.isNew);
    
    //순서 변경 확인
    const originalOrder = getEnhancedCategories(); // 원래 순서
    const currentOrder = localCategories; // 현재 순서
    
    const orderChanged = originalOrder.some((cat, index) => 
      cat.categoryId !== currentOrder[index]?.categoryId
    );
    
    console.log('새 카테고리:', newCategories.length);
    console.log('순서 변경:', orderChanged);
    
    // 변경사항이 없으면 그냥 닫기
    if (newCategories.length === 0 && !orderChanged) {
      handleCloseModal();
      return;
    }
    
    try {
      // 새 카테고리 생성
      if (newCategories.length > 0) {
        const createdCategories = [];
        for (const newCat of newCategories) {
          console.log('카테고리 생성 요청:', { name: newCat.name });
          const result = await postCategory({ name: newCat.name });
          createdCategories.push({
            tempId: newCat.categoryId,
            realId: result.categoryId
          });
        }
        
        // 임시 ID를 실제 ID로 교체
        const updatedCategories = localCategories.map(cat => {
          if (cat.isNew) {
            const created = createdCategories.find(c => c.tempId === cat.categoryId);
            return {
              ...cat,
              categoryId: created.realId,
              isNew: false
            };
          }
          return cat;
        });
        
        setLocalCategories(updatedCategories);
      }
      
      // 순서 변경 (항상 실행)
      const regularCategories = localCategories
        .filter(cat => !isRequiredCategory(cat.name))
        .filter(cat => !cat.isNew); // 새 카테고리는 제외 (아직 ID가 없음)
      
      if (regularCategories.length > 0) {
        const categoryOrders = regularCategories.map((category, index) => ({
          categoryId: category.categoryId,
          order: index
        }));
        
        console.log('카테고리 순서 변경 요청:', categoryOrders);
        await patchCategoryOrder({ categoryOrders });
        console.log('카테고리 순서 변경 성공');
      }
      
      // 전체 카테고리 다시 조회
      const refreshedCategories = await getCategories();
      setCategories(refreshedCategories);
      
      // 모달 닫기
      setShowModal(false);
      setIsAddingNew(false);
      setNewCategoryName('');
      setDraggedIndex(null);
      
      alert('저장되었습니다.');
      
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };



  if (loading) return <Container></Container>;
  if (error) return <Container>에러 발생: {error.message}</Container>;
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

      {/* 모달 */}
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
                  />
                  <MenuCount2>0개</MenuCount2>
                  </MenuHeader>
                  <ActionButtons>
                    <SaveButton onClick={handleSaveNew}>
                      <CheckIcon />
                    </SaveButton>
                    <CancelButton onClick={handleCancelNew}>
                      <CancelIcon />
                    </CancelButton>
                  </ActionButtons>
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
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    row-gap: 0.75rem;
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
  padding: 0.5rem;
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


