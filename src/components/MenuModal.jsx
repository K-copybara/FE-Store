// components/MenuModal.jsx
import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { useStores } from '../hooks/useStores';
import { title_semi, display_large, body_medium, body_small } from '../styles/font';

const MenuModal = ({ onClose, editingMenuId = null }) => { 
  //  편집 모드 확인
  const isEditMode = !!editingMenuId;

  //  통합된 폼 데이터 상태
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


  const { 
    getCategories, 
    createMenu, 
    uploadMenuImage, 
    updateMenu,
    getMenuById,
    getCategoryById 
  } = useStores();
  const categories = getCategories();


  useEffect(() => {
    if (isEditMode && editingMenuId) {
      console.log('편집 모드로 모달 열림. 메뉴 ID:', editingMenuId);
      
      const menuData = getMenuById(editingMenuId);
      console.log('기존 메뉴 데이터:', menuData);
      
      if (menuData) {
        //  기존 데이터로 폼 초기화
        setFormData({
          categoryId: menuData.categoryId,
          name: menuData.name,
          price: menuData.price.toString(),
          description: menuData.description || '',
          image: menuData.image ? 'existing' : null, // 기존 이미지가 있으면 'existing' 플래그
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

        console.log('편집 데이터 로드 완료');
      }
    }
  }, [isEditMode, editingMenuId, getMenuById, getCategoryById]);

  //  공통 데이터 업데이트 함수
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  //  파일 업로드 핸들러
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
      console.log('이미지 파일 확인됨');
      
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
        console.log('🔄 상태 업데이트 완료');
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('이미지 파일을 선택해주세요.');
    }
    
    event.target.value = '';
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    updateFormData('image', null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    updateFormData('categoryId', category.categoryId);
    setShowDropdown(false);
  };

  const [allergyInput, setAllergyInput] = useState('');
  const handleAddAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
        const newAllergies = [...formData.allergies, allergyInput.trim()];
        updateFormData('allergies', newAllergies);
        setAllergyInput('');
    }
  };
  
  //  알레르기 삭제 함수
  const handleRemoveAllergy = (allergyToRemove) => {
    const newAllergies = formData.allergies.filter(allergy => allergy !== allergyToRemove);
    updateFormData('allergies', newAllergies);
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  //가격 입력 핸들러
  const handlePriceChange = (e) => {
    // 입력값에서 숫자만 추출
    const value = e.target.value.replace(/[^\d]/g, '');
    updateFormData('price', value);
  };

  const displayPrice = (price) => {
    if (!price) return '';
    return parseInt(price).toLocaleString();
  };
  
  //  1단계 → 2단계 이동 (편집 모드에서는 이미지 검사 수정)
  const handleStep1Next = () => {
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
    
    console.log('1단계 완료:', {
      isEditMode,
      categoryId: formData.categoryId,
      name: formData.name,
      price: formData.price,
      description: formData.description,
      hasImage: !!formData.image || !!uploadedImage
    });
    
    setCurrentStep(2);
  };

  //  최종 제출 (등록/편집 모드 구분)
  const handleFinalSubmit = async () => {
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
        //  편집 모드 - 메뉴 수정
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

        console.log('수정할 데이터:', updateData);

        const result = await updateMenu(editingMenuId, updateData);

        if (!result.success) {
          throw new Error(result.error || '메뉴 수정에 실패했습니다.');
        }

        console.log(' 메뉴 정보 수정 완료');

        //  새 이미지가 있으면 별도 업로드
        if (formData.image && formData.image !== 'existing') {
          console.log('📤 새 이미지 업로드');
          
          const imageResult = await uploadMenuImage(editingMenuId, formData.image);
          
          if (!imageResult.success) {
            console.warn('⚠️ 이미지 업로드 실패:', imageResult.error);
            alert('메뉴는 수정되었지만 이미지 업로드에 실패했습니다.');
          } else {
            console.log(' 이미지 업로드 완료');
          }
        }

        console.log('🎉 메뉴 수정 프로세스 완료!');
        alert('메뉴가 성공적으로 수정되었습니다!');
        onClose();

      } else {
        //  등록 모드 (기존 로직)
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

        const menuResult = await createMenu(menuData);

        if (!menuResult.success) {
          throw new Error(menuResult.error || '메뉴 등록에 실패했습니다.');
        }

        console.log(' 메뉴 정보 등록 완료:', menuResult.data.menuId);

        //  이미지가 있으면 별도로 업로드
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
            console.log(' 이미지 업로드 완료');
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

  //  1단계 렌더링 (타이틀 편집/등록 구분)
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
                <PlusIcon />
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
                <RemoveIcon />
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

  //  2단계 렌더링 (타이틀 편집/등록 구분)
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

          {/*  알레르기 정보 (입력창으로 변경) */}
          <FormGroup>
          <AllergySection>
            <ModalHeader>
              <Label>알레르기</Label>
              <SubLabel2>음식의 재료 중 알레르기 유발할 수 있는 재료명이 있나요?</SubLabel2>
            </ModalHeader>
            
            {/*  태그 영역 (고정된 공간 확보) */}
            <AllergyTagArea>
              {formData.allergies.length > 0 && (
                <AllergyTagContainer>
                  {formData.allergies.map((allergy, index) => (
                    <AllergyTag key={index}>
                      {allergy}
                      <RemoveAllergyButton onClick={() => handleRemoveAllergy(allergy)}>
                        <RemoveAllergyIcon />
                      </RemoveAllergyButton>
                    </AllergyTag>
                  ))}
                </AllergyTagContainer>
              )}
            </AllergyTagArea>
            
            {/*  알레르기 입력창 (항상 하단에 고정) */}
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
                <PlusIcon />
              </AddAllergyButton>
            </AllergyInputContainer>
          </AllergySection>
          </FormGroup>
        </LeftSection>

        {/*  추가 정보 */}
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

  //  단계별 컨텐츠 렌더링
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
        {/*  단계별 컨텐츠 렌더링 */}
        {renderStepContent()}
      </ModalContent>
    </ModalOverlay>
  );
};

export default MenuModal;

//  기존 스타일 컴포넌트들 (그대로 유지)
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
  ${body_medium}
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
  ${body_medium}
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
  ${title_semi}
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
  ${title_semi}
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
  ${display_large}
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
  ${display_large}
  color: var(--black);
  font-weight: 400;
`;

const TextInput = styled.input`
  ${title_semi}
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
  ${title_semi}
  flex: 1;
  padding: 0.5rem 0.625rem;
  background: var(--gray100);
  border: none;
  
  &:focus {
    outline: none;
  }
`;

const PriceUnit = styled.span`
  ${title_semi}
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
  ${body_medium}
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
  ${body_medium}
  color: var(--primary);
`;

const SubLabel2 = styled.p`
  ${body_medium}
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
  ${title_semi}
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
  ${title_semi}
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

//  아이콘 컴포넌트들 (기존과 동일)
const ImageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.6667 35C10.4444 35 9.31945 34.7083 8.29167 34.125C7.29167 33.5139 6.48611 32.7083 5.875 31.7083C5.29167 30.6806 5 29.5556 5 28.3333V11.6667C5 10.4444 5.29167 9.31944 5.875 8.29166C6.48611 7.26389 7.29167 6.45833 8.29167 5.875C9.31945 5.29166 10.4444 5 11.6667 5H28.3333C29.5556 5 30.6806 5.29166 31.7083 5.875C32.7361 6.45833 33.5417 7.26389 34.125 8.29166C34.7083 9.31944 35 10.4444 35 11.6667V28.3333C35 29.5556 34.7083 30.6806 34.125 31.7083C33.5417 32.7083 32.7361 33.5139 31.7083 34.125C30.6806 34.7083 29.5556 35 28.3333 35H11.6667ZM28.3333 31.6667C29.3889 31.6667 30.2083 31.375 30.7917 30.7917C31.375 30.1806 31.6667 29.3611 31.6667 28.3333V11.6667C31.6667 10.6111 31.375 9.79167 30.7917 9.20833C30.2083 8.625 29.3889 8.33333 28.3333 8.33333H11.6667C10.6389 8.33333 9.81945 8.625 9.20833 9.20833C8.625 9.79167 8.33333 10.6111 8.33333 11.6667V28.3333C8.33333 29.3611 8.625 30.1806 9.20833 30.7917C9.81945 31.375 10.6389 31.6667 11.6667 31.6667H28.3333ZM17.875 27.8333C17.5139 28.1944 17.1111 28.375 16.6667 28.375C16.2222 28.375 15.8194 28.1944 15.4583 27.8333L11.6667 24.0417L7.83333 27.8333C7.5 28.1667 7.11111 28.3333 6.66667 28.3333C6.19444 28.3333 5.79167 28.1806 5.45833 27.875C5.15278 27.5417 5 27.1389 5 26.6667C5 26.2222 5.16667 25.8333 5.5 25.5L10.4583 20.5C10.8194 20.1389 11.2222 19.9583 11.6667 19.9583C12.1111 19.9583 12.5139 20.1389 12.875 20.5L16.6667 24.2917L23.7917 17.1667C24.1528 16.8056 24.5556 16.625 25 16.625C25.4444 16.625 25.8472 16.8056 26.2083 17.1667L34.5 25.5C34.8333 25.8333 35 26.2222 35 26.6667C35 27.1389 34.8333 27.5417 34.5 27.875C34.1944 28.1806 33.8056 28.3333 33.3333 28.3333C32.8889 28.3333 32.5 28.1667 32.1667 27.8333L25 20.7083L17.875 27.8333ZM14.2083 17.5C13.2639 17.5 12.4583 17.1806 11.7917 16.5417C11.1528 15.875 10.8333 15.0694 10.8333 14.125C10.8333 13.2083 11.1528 12.4306 11.7917 11.7917C12.4583 11.1528 13.2639 10.8333 14.2083 10.8333C15.1528 10.8333 15.9306 11.1528 16.5417 11.7917C17.1806 12.4028 17.5 13.1806 17.5 14.125C17.5 15.0694 17.1806 15.875 16.5417 16.5417C15.9028 17.1806 15.125 17.5 14.2083 17.5Z" fill="#8298FF"/>
  </svg>
);

const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 13C3.58333 13 3.29167 12.8333 3.125 12.5C2.975 12.1667 2.975 11.8333 3.125 11.5C3.29167 11.1667 3.58333 11 4 11H20C20.4167 11 20.7 11.1667 20.85 11.5C21.0167 11.8333 21.0167 12.1667 20.85 12.5C20.7 12.8333 20.4167 13 20 13H4ZM11 4C11 3.58333 11.1667 3.3 11.5 3.15C11.8333 2.98333 12.1667 2.98333 12.5 3.15C12.8333 3.3 13 3.58333 13 4V20C13 20.4167 12.8333 20.7083 12.5 20.875C12.1667 21.025 11.8333 21.025 11.5 20.875C11.1667 20.7083 11 20.4167 11 20V4Z" fill="currentColor"/>
    </svg>
);

const RemoveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RemoveAllergyIcon = () => (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.0875 11.1708C2.93403 11.3243 2.7625 11.3694 2.57292 11.3062C2.38333 11.2431 2.25243 11.1212 2.18021 10.9406C2.11701 10.751 2.16667 10.575 2.32917 10.4125L9.9125 2.82917C10.066 2.67569 10.2375 2.63056 10.4271 2.69375C10.6167 2.75694 10.7431 2.88333 10.8063 3.07292C10.8785 3.25347 10.8333 3.425 10.6708 3.5875L3.0875 11.1708ZM2.32917 3.5875C2.16667 3.425 2.11701 3.25347 2.18021 3.07292C2.2434 2.88333 2.36979 2.75694 2.55938 2.69375C2.75799 2.63056 2.93403 2.67569 3.0875 2.82917L10.6708 10.4125C10.8243 10.566 10.8694 10.7375 10.8063 10.9271C10.7431 11.1167 10.6167 11.2476 10.4271 11.3198C10.2465 11.383 10.075 11.3333 9.9125 11.1708L2.32917 3.5875Z" fill="#8298FF"/>
    </svg>
);
