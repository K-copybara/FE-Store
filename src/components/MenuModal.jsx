// components/MenuModal.jsx
import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { body_small, bold18, reg24, reg18, reg14 } from '../styles/font';

import ImageIcon from '../assets/icons/MenuModal/image-icon.svg?react';
import MenuPlusIcon from '../assets/icons/MenuModal/menuplus-icon.svg?react';
import ImageRemoveIcon from '../assets/icons/MenuModal/imageremove-icon.svg?react';
import AllergyRemoveIcon from '../assets/icons/MenuModal/allergyremove-icon.svg?react';

const MenuModal = ({ onClose, editingMenuId = null }) => { 

  //메뉴등록 (더미 함수로 변경)
  const createMenu = async (menuData) => {
    console.log('🍽️ 메뉴 등록 요청:', menuData);
    
    // 더미 응답 반환
    return {
      success: true,
      data: { menuId: Date.now() } // 더미 메뉴 ID
    };
  };

  // 편집 모드 확인
  const isEditMode = !!editingMenuId;

  // 통합된 폼 데이터 상태
  const [formData, setFormData] = useState({
    // 1단계 데이터
    categoryId: null,
    name: '',
    price: '',
    description: '',
    image: null,
    
    // 2단계 데이터  
    spicyLevel: 0,
    allergies: [],
    extraInfo: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // useStores 훅 대신 더미 함수들로 대체
  const getCategories = () => {
    console.log('📋 카테고리 목록 조회');
    return [
      { categoryId: 1, name: '신메뉴' },
      { categoryId: 2, name: '인기메뉴' },
      { categoryId: 3, name: '음료' }
    ];
  };

  const uploadMenuImage = async (menuId, imageFile) => {
    console.log('📸 이미지 업로드 요청:', { menuId, imageFile });
    return { success: true };
  };

  const updateMenu = async (menuId, updateData) => {
    console.log('✏️ 메뉴 수정 요청:', { menuId, updateData });
    return { success: true };
  };

  const getMenuById = (menuId) => {
    console.log('🔍 메뉴 조회 요청:', menuId);
    // 더미 메뉴 데이터 반환
    return {
      categoryId: 1,
      name: '더미 메뉴',
      price: 5000,
      description: '더미 설명',
      image: 'https://via.placeholder.com/300x300',
      spicyLevel: 2,
      allergies: ['견과류'],
      extraInfo: '더미 추가 정보'
    };
  };

  const getCategoryById = (categoryId) => {
    console.log('🏷️ 카테고리 조회 요청:', categoryId);
    return { categoryId: 1, name: '신메뉴' };
  };

  const categories = getCategories();

  useEffect(() => {
    if (isEditMode && editingMenuId) {
      console.log('✏️ 편집 모드로 모달 열림. 메뉴 ID:', editingMenuId);
      
      const menuData = getMenuById(editingMenuId);
      console.log('📋 기존 메뉴 데이터:', menuData);
      
      if (menuData) {
        // 기존 데이터로 폼 초기화
        setFormData({
          categoryId: menuData.categoryId,
          name: menuData.name,
          price: menuData.price.toString(),
          description: menuData.description || '',
          image: menuData.image ? 'existing' : null,
          spicyLevel: menuData.spicyLevel || 0,
          allergies: menuData.allergies || [],
          extraInfo: menuData.extraInfo || ''
        });

        // 카테고리 UI 상태 초기화
        const category = getCategoryById(menuData.categoryId);
        if (category) {
          setSelectedCategory(category.name);
        }

        // 기존 이미지 설정
        if (menuData.image) {
          setUploadedImage({
            id: 'existing-' + editingMenuId,
            url: menuData.image,
            name: 'existing-image',
            isExisting: true
          });
        }

        console.log('✅ 편집 데이터 로드 완료');
      }
    }
  }, [isEditMode, editingMenuId]);

  // 공통 데이터 업데이트 함수
  const updateFormData = (field, value) => {
    console.log('🔄 폼 데이터 업데이트:', { field, value });
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    console.log('🖱️ 파일 선택 이벤트 발생');
    const file = event.target.files[0];
    
    if (!file) {
      console.log('❌ 파일이 선택되지 않음');
      return;
    }
    
    console.log('📄 선택된 파일 정보:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    if (file.type.startsWith('image/')) {
      console.log('✅ 이미지 파일 확인됨');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + Math.random(),
          file,
          url: e.target.result,
          name: file.name
        };
        
        setUploadedImage(imageData);
        updateFormData('image', file);
        console.log('🔄 이미지 상태 업데이트 완료');
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('이미지 파일을 선택해주세요.');
    }
    
    event.target.value = '';
  };

  const handleAddImageClick = () => {
    console.log('🖼️ 이미지 추가 버튼 클릭');
    fileInputRef.current?.click();
  };

  // 미리보기 이미지 제거
  const handleRemoveImage = () => {
    console.log('🗑️ 이미지 제거');
    setUploadedImage(null);
    updateFormData('image', null);
  };

  const handleCategorySelect = (category) => {
    console.log('🏷️ 카테고리 선택:', category);
    setSelectedCategory(category.name);
    updateFormData('categoryId', category.categoryId);
    setShowDropdown(false);
  };

  const [allergyInput, setAllergyInput] = useState('');
  
  const handleAddAllergy = () => {
    console.log('🚨 알레르기 정보 추가:', allergyInput);
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      const newAllergies = [...formData.allergies, allergyInput.trim()];
      updateFormData('allergies', newAllergies);
      setAllergyInput('');
    }
  };
  
  // 알레르기 삭제 함수
  const handleRemoveAllergy = (allergyToRemove) => {
    console.log('❌ 알레르기 정보 삭제:', allergyToRemove);
    const newAllergies = formData.allergies.filter(allergy => allergy !== allergyToRemove);
    updateFormData('allergies', newAllergies);
  };
  
  const toggleDropdown = () => {
    console.log('📋 드롭다운 토글');
    setShowDropdown(!showDropdown);
  };

  // 가격 입력 핸들러
  const handlePriceChange = (e) => {
    console.log('💰 가격 입력:', e.target.value);
    const value = e.target.value.replace(/[^\d]/g, '');
    updateFormData('price', value);
  };

  const displayPrice = (price) => {
    if (!price) return '';
    return parseInt(price).toLocaleString();
  };
  
  // 1단계 → 2단계 이동
  const handleStep1Next = () => {
    console.log('➡️ 1단계에서 2단계로 이동');
    
    // 1단계 유효성 검사
    if (!formData.name.trim()) {
      alert('메뉴 이름을 입력해주세요.');
      return;
    }
    if (!formData.price) {
      alert('가격을 입력해주세요.');
      return;
    }
    if (!formData.categoryId) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    
    if (!formData.image) {
      alert('이미지를 등록해주세요.');
      return;
    }
    
    console.log('✅ 1단계 완료:', {
      isEditMode,
      categoryId: formData.categoryId,
      name: formData.name,
      price: formData.price,
      description: formData.description,
      hasImage: !!formData.image || !!uploadedImage
    });
    
    setCurrentStep(2);
  };

  // 최종 제출 (등록/편집 모드 구분)
  const handleFinalSubmit = async () => {
    console.log('🚀 최종 제출 시작');
    
    // 2단계 유효성 검사
    if (!formData.extraInfo.trim()) {
      alert('추가 정보를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('=== 최종 제출 시작 ===');
      console.log('편집 모드:', isEditMode);

      if (isEditMode) {
        // 편집 모드 - 메뉴 수정
        console.log('📤 메뉴 수정 API 호출');
        
        const updateData = {
          categoryId: formData.categoryId,
          name: formData.name,
          price: parseInt(formData.price),
          description: formData.description,
          spicyLevel: formData.spicyLevel,
          allergies: formData.allergies,
          extraInfo: formData.extraInfo
        };

        console.log('✏️ 수정할 데이터:', updateData);

        const result = await updateMenu(editingMenuId, updateData);

        if (!result.success) {
          throw new Error(result.error || '메뉴 수정에 실패했습니다.');
        }

        console.log('✅ 메뉴 정보 수정 완료');

        // 새 이미지가 있으면 별도 업로드
        if (formData.image && formData.image !== 'existing') {
          console.log('📤 새 이미지 업로드');
          
          const imageResult = await uploadMenuImage(editingMenuId, formData.image);
          
          if (!imageResult.success) {
            console.warn('⚠️ 이미지 업로드 실패:', imageResult.error);
            alert('메뉴는 수정되었지만 이미지 업로드에 실패했습니다.');
          } else {
            console.log('✅ 이미지 업로드 완료');
          }
        }

        console.log('🎉 메뉴 수정 프로세스 완료!');
        alert('메뉴가 성공적으로 수정되었습니다!');
        onClose();

      } else {
        // 등록 모드
        console.log('📤 메뉴 등록 API 호출');
        
        const menuData = {
          categoryId: formData.categoryId,
          name: formData.name,
          price: parseInt(formData.price),
          description: formData.description,
          spicyLevel: formData.spicyLevel,
          allergies: formData.allergies,
          extraInfo: formData.extraInfo
        };

        console.log('🍽️ 등록할 메뉴 데이터:', menuData);

        const menuResult = await createMenu(menuData);

        if (!menuResult.success) {
          throw new Error(menuResult.error || '메뉴 등록에 실패했습니다.');
        }

        console.log('✅ 메뉴 정보 등록 완료:', menuResult.data.menuId);

        // 이미지가 있으면 별도로 업로드
        if (formData.image) {
          console.log('📤 이미지 업로드');
          
          const imageResult = await uploadMenuImage(
            menuResult.data.menuId, 
            formData.image
          );

          if (!imageResult.success) {
            console.warn('⚠️ 이미지 업로드 실패:', imageResult.error);
            alert('메뉴는 등록되었지만 이미지 업로드에 실패했습니다.');
          } else {
            console.log('✅ 이미지 업로드 완료');
          }
        }

        console.log('🎉 메뉴 등록 프로세스 완료!');
        alert('메뉴가 성공적으로 등록되었습니다!');
        onClose();
      }
      
    } catch (error) {
      console.error('❌ 메뉴 처리 실패:', error);
      alert(`메뉴 ${isEditMode ? '수정' : '등록'}에 실패했습니다: ` + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1단계 렌더링 (타이틀 편집/등록 구분)
  const renderStep1 = () => (
    <>
      <ModalHeader>
        <ModalTitle>{isEditMode ? '메뉴 편집' : '메뉴 등록'}</ModalTitle>
      </ModalHeader>
      <FormContainer>
        <LeftSection>
          {/* 카테고리 선택 */}
          <FormGroup>
            <Label>카테고리</Label>
            <CategoryDropdownContainer>
              <CategoryDropdown onClick={toggleDropdown}>
                <CategoryInput
                  value={selectedCategory || "카테고리를 선택하세요"}
                  readOnly
                />
                <DropdownIcon $isOpen={showDropdown}>▼</DropdownIcon>
              </CategoryDropdown>
              
              {showDropdown && (
                <DropdownMenu>
                  {categories.map((category) => (
                    <DropdownItem
                      key={category.categoryId}
                      onClick={() => handleCategorySelect(category)}
                      $isSelected={formData.categoryId === category.categoryId}
                    >
                      {category.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </CategoryDropdownContainer>
          </FormGroup>

          {/* 메뉴명 */}
          <FormGroup>
            <Label>메뉴명</Label>
            <TextInput
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="메뉴명을 입력하세요"
            />
          </FormGroup>

          {/* 가격 */}
          <FormGroup>
            <Label>가격</Label>
            <PriceContainer>
              <PriceInput
                type="text"
                value={displayPrice(formData.price)}
                onChange={handlePriceChange}
                placeholder="가격을 입력하세요"
              />
              <PriceUnit>원</PriceUnit>
            </PriceContainer>
          </FormGroup>

          {/* 설명 */}
          <FormGroup>
            <Label>설명</Label>
            <DescriptionTextarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="메뉴 설명을 입력하세요"
            />
          </FormGroup>
        </LeftSection>

        <RightSection>
          <ImageSectionHeader>
            <Label>사진 업로드</Label>
            {!uploadedImage && (
              <AddImageButton onClick={handleAddImageClick}>
                <MenuPlusIcon />
              </AddImageButton>
            )}
          </ImageSectionHeader>

          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />

          {uploadedImage ? (
            <ImagePreview>
              <PreviewImage src={uploadedImage.url} alt={uploadedImage.name} />
              <RemoveImageButton onClick={handleRemoveImage}>
                <ImageRemoveIcon />
              </RemoveImageButton>
            </ImagePreview>
          ) : (
            <ImageUploadArea onClick={handleAddImageClick}>
                <ImageIcon />
            </ImageUploadArea>
          )}
        </RightSection>
      </FormContainer>

      <ModalActions>
        <NextButton onClick={handleStep1Next}>다음</NextButton>
      </ModalActions>
    </>
  );

  // 2단계 렌더링 (타이틀 편집/등록 구분)
  const renderStep2 = () => (
    <>
      <ModalHeader>
        <ModalTitle>{isEditMode ? '메뉴 편집' : '메뉴 등록'}</ModalTitle>
        <SubLabel>이 단계에서 입력되는 정보들은 AI 챗봇의 질의응답에 활용돼요</SubLabel>
      </ModalHeader>
      <FormContainer>  
        <LeftSection>
          <FormGroup>       
            <SpicyLevelContainer>
              <Label>맵기</Label>
              <SpicyButtonGroup>
                {[0, 1, 2, 3, 4].map(level => (
                <SpicyNumberButton
                  key={level}
                  $selected={formData.spicyLevel === level}
                  onClick={() => updateFormData('spicyLevel', level)}
                >
                  {level}
                </SpicyNumberButton>
                ))}
              </SpicyButtonGroup>
            </SpicyLevelContainer>
          </FormGroup>

          {/* 알레르기 정보 */}
          <FormGroup>
          <AllergySection>
            <ModalHeader>
              <Label>알레르기</Label>
              <SubLabel2>음식의 재료 중 알레르기 유발할 수 있는 재료명이 있나요?</SubLabel2>
            </ModalHeader>
            
            {/* 태그 영역 */}
            <AllergyTagArea>
              {formData.allergies.length > 0 && (
                <AllergyTagContainer>
                  {formData.allergies.map((allergy, index) => (
                    <AllergyTag key={index}>
                      {allergy}
                      <RemoveAllergyButton onClick={() => handleRemoveAllergy(allergy)}>
                        <AllergyRemoveIcon />
                      </RemoveAllergyButton>
                    </AllergyTag>
                  ))}
                </AllergyTagContainer>
              )}
            </AllergyTagArea>
            
            {/* 알레르기 입력창 */}
            <AllergyInputContainer>
              <AllergyInput
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                placeholder=""
              />
              <AddAllergyButton 
                onClick={handleAddAllergy}
                disabled={!allergyInput.trim()}
              >
                <MenuPlusIcon />
              </AddAllergyButton>
            </AllergyInputContainer>
          </AllergySection>
          </FormGroup>
        </LeftSection>

        {/* 추가 정보 */}
        <RightSection>
          <FormGroup>
            <Label>추가 정보</Label>
            <DescriptionTextarea
              value={formData.extraInfo}
              onChange={(e) => updateFormData('extraInfo', e.target.value)}
              placeholder="손님들이 자주 물어보는 질문이나, 어필하고 싶은 포인트를 입력해보세요! AI 챗봇이 대신 대답해줄거에요.&#10;ex. 향신료가 강한 음식입니다, 조리 시간이 짧아요"
            />
          </FormGroup>
        </RightSection>
      </FormContainer>

      <ModalActions>
        <BackButton onClick={() => setCurrentStep(1)}>이전</BackButton>
        <SubmitButton 
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? '수정' : '완료')}
        </SubmitButton>
      </ModalActions>
    </>
  );

  // 단계별 컨텐츠 렌더링
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return null;
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* 단계별 컨텐츠 렌더링 */}
        {renderStepContent()}
      </ModalContent>
    </ModalOverlay>
  );
};

export default MenuModal;


const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
  
  ${props => props.$active && `
    background: var(--primary);
    color: var(--white);
  `}
  
  ${props => props.$completed && `
    background: var(--success);
    color: var(--white);
  `}
  
  ${props => !props.$active && !props.$completed && `
    background: var(--gray200);
    color: var(--gray500);
  `}
`;

const BackButton = styled.button`
  ${bold18}
  padding: 0.75rem 2rem;
  background: var(--gray200);
  color: var(--black);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-right: 1rem;
  
  &:hover {
    background: var(--gray300);
  }
`;

const SubmitButton = styled.button`
  ${bold18}
  padding: 0.75rem 2rem;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: var(--secondary);
  }
`;

const CategoryDropdownContainer = styled.div`
  position: relative;
`;

const CategoryDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    .dropdown-icon {
      color: var(--primary);
    }
  }
`;

const CategoryInput = styled.input`
  ${reg18}
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--gray100);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &:hover {
    border-color: var(--primary);
  }
`;

const DropdownIcon = styled.span`
  position: absolute;
  right: 0.75rem;
  color: var(--gray500);
  pointer-events: none;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background: var(--white);
  border: 1px solid var(--gray300);
  border-radius: 0.625rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 0.625rem;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray500);
    border-radius: 0.625rem;
    
    &:hover {
      background: var(--gray500);
    }
  }
`;

const DropdownItem = styled.div`
  ${reg18}
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: ${props => props.$isSelected ? 'var(--primary)10' : 'transparent'};
  color: ${props => props.$isSelected ? 'var(--primary)' : 'var(--black)'};
  
  &:hover {
    background: var(--primary)05;
  }
  
  &:first-child {
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 0.5rem 0.5rem;
  }
`;

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
  background: var(--white);
  border-radius: 0.625rem;
  padding: 1.25rem 1.5rem;
  width: 100%;
  max-width: 50rem;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
    margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  ${bold18}
  color: var(--black);
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.125rem;
  margin-bottom: 1.88rem;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.62rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Label = styled.label`
  ${reg24}
  color: var(--black);
  font-weight: 400;
`;

const TextInput = styled.input`
  ${reg18}
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--gray100);
  
  &:focus {
    outline: none;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  overflow: hidden;
`;

const PriceInput = styled.input`
  ${reg18}
  flex: 1;
  padding: 0.5rem 0.625rem;
  background: var(--gray100);
  border: none;
  
  &:focus {
    outline: none;
  }
`;

const PriceUnit = styled.span`
  ${reg18}
  padding: 0.5rem 0.625rem;
  background: var(--gray100);
  border-left: 1px solid var(--gray300);
`;

const DescriptionTextarea = styled.textarea`
  ${body_small}
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  flex: 1;
  resize: vertical;
  background: var(--gray100);
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NextButton = styled.button`
  ${bold18}
  padding: 0.75rem 2rem;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background: var(--secondary);
  }
`;

const ImageSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddImageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: none;
  color: var(--gray500);
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    color: var(--primary);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: var(--white);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--red);
  }
`;

const ImagePreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.625rem;
  overflow: hidden;
  button {
      opacity: 1;
    }
`;

const ImageUploadArea = styled.div`
  position: relative;
  aspect-ratio: 1;
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--gray100);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
`;

const SubLabel = styled.p`
  ${reg14}
  color: var(--primary);
`;

const SubLabel2 = styled.p`
  ${reg14}
  color: var(--gray500);
`;

const SpicyLevelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const SpicyButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SpicyNumberButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--gray300);
  background: ${props => props.$selected ? 'var(--primary)' : 'var(--white)'};
  color: ${props => props.$selected ? 'var(--white)' : 'var(--black)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary);
    background: ${props => props.$selected ? 'var(--primary)' : 'var(--primary)10'};
  }
`;

const AllergySection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const AllergyTagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 0.5rem 0;
`;

const AllergyTag = styled.div`
  ${reg18}
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  gap: 0.38rem;
  background: var(--white);
  border: 1px solid var(--secondary);
  border-radius: 3.125rem;
  color: var(--black);
`;

const RemoveAllergyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
`;

const AllergyInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: auto;
`;

const AllergyTagArea = styled.div`
  margin-bottom: 9rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray400);
    border-radius: 2px;
    
    &:hover {
      background: var(--gray500);
    }
  }
`;

const AllergyInput = styled.input`
  ${reg18}
  flex: 1;
  padding: 0.75rem;
  border: 1.5px solid var(--secondary);
  background: var(--gray100);
  border-radius: 3.125rem;
  
  &:focus {
    outline: none;
  }
`;

const AddAllergyButton = styled.button`
  display: flex;
  padding: 0.75rem;
  gap: 0.625rem;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  
  border-radius: 50%;
  background: var(--primary);
  color: var(--white);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--secondary);
    border-color: var(--secondary);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: var(--gray300);
    border-color: var(--gray300);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

