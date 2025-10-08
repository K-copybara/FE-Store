import styled from 'styled-components';
import { useState, useEffect} from 'react';
import { display_large, body_medium, title_semi } from '../styles/font';

const EditSection = ({ 
  title = "섹션 제목",
  type = "text", // "text" | "business-hours"
  field, //('notice' | 'businessHours  ')
  placeholder = "공지사항을 입력하세요",
  maxLength = 500
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const [businessHours, setBusinessHours] = useState([]);
  const [saving, setSaving] = useState(false);

    // 요일 순서 정의
  const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  // 요일 영어-한국어 매핑
  const dayOfWeekMap = {
    "MONDAY": "월",
    "TUESDAY": "화", 
    "WEDNESDAY": "수",
    "THURSDAY": "목",
    "FRIDAY": "금",
    "SATURDAY": "토",
    "SUNDAY": "일"
  };

  const storeInfo = [{
      storeId: 1,
      shopName: "딤딤섬",
      notice: "안녕하세요 딤딤섬입니다. 1인 2주문 해주세요.",
      businessHoursDetail: [
        {
          dayOfWeek: "MONDAY",
          openTime: "11:00",
          closeTime: "23:00",
          breakOpenTime: "15:00",
          breakCloseTime: "17:00"
        },
        {
          dayOfWeek: "TUESDAY", 
          openTime: "11:00",
          closeTime: "23:00",
          breakOpenTime: "15:00",
          breakCloseTime: "17:00"
        },
        {
          dayOfWeek: "WEDNESDAY",
          openTime: "11:00", 
          closeTime: "23:00",
          breakOpenTime: "15:00",
          breakCloseTime: "17:00"
        },
        {
          dayOfWeek: "THURSDAY",
          openTime: "11:00",
          closeTime: "23:00", 
          breakOpenTime: "15:00",
          breakCloseTime: "17:00"
        },
        {
          dayOfWeek: "FRIDAY",
          openTime: "11:00",
          closeTime: "23:00",
          breakOpenTime: "15:00", 
          breakCloseTime: "17:00"
        },
        {
          dayOfWeek: "SATURDAY",
          openTime: "10:00",
          closeTime: "24:00",
          breakOpenTime: null,
          breakCloseTime: null
        },
        {
          dayOfWeek: "SUNDAY",
          openTime: "10:00",
          closeTime: "22:00",
          breakOpenTime: null,
          breakCloseTime: null
        }
      ]
}];

  // 영업시간 업데이트 (EditSection 형식 → API 형식 변환)
  const updateBusinessHours = async (editSectionFormat) => {
    console.log('영업시간 업데이트 요청:', editSectionFormat);
  };

  // API 형식을 EditSection 형식으로 변환 (요일 순서대로 정렬)


  // 공지사항 가져오기 함수
  // const getNotice = () => {
  //   return storeInfo?.notice || '';
  // };





  //공지사항 업데이트
    const updateNotice = async (newNotice) => {
      console.log('Updating notice to:', newNotice);
  };
  // const getBusinessHoursForEdit = () => {
  //   if (!storeInfo?.businessHoursDetail) return null;

  //   // 요일 순서대로 정렬
  //   const sortedHours = DAY_ORDER.map(dayOfWeek => {
  //     const found = storeInfo.businessHoursDetail.find(item => item.dayOfWeek === dayOfWeek);
  //     return found || {
  //       dayOfWeek,
  //       openTime: "11:00",
  //       closeTime: "21:00", 
  //       breakOpenTime: "15:00",
  //       breakCloseTime: "17:00"
  //     };
  //   });

  //   return sortedHours.map(item => ({
  //     day: dayOfWeekMap[item.dayOfWeek],
  //     dayEng: item.dayOfWeek.toLowerCase(),
  //     startTime: item.openTime,
  //     endTime: item.closeTime,
  //     breakStart: item.breakOpenTime || '',
  //     breakEnd: item.breakCloseTime || ''
  //   }));
  // };
  // useEffect(() => {
  //   if (!storeInfo) return;

  //   if (type === 'text' && field === 'notice') {
  //     setValue(getNotice()); //  StoreInfoProvider 함수 사용
  //   } else if (type === 'business-hours') {
  //     const editFormat = getBusinessHoursForEdit(); //  StoreInfoProvider 함수 사용
  //     if (editFormat) {
  //       setBusinessHours(editFormat);
  //     }
  //   }
  // }, [storeInfo, type, field, getNotice, getBusinessHoursForEdit]);

  // 시간 포맷팅 함수
  const formatTimeInput = (value) => {
    const numbersOnly = value.replace(/\D/g, '');
    const limitedNumbers = numbersOnly.slice(0, 4);
    
    if (limitedNumbers.length === 0) return '';
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else {
      const hours = limitedNumbers.slice(0, 2);
      const minutes = limitedNumbers.slice(2, 4);
      return `${hours}:${minutes}`;
    }
  };

  // 시간 유효성 검사
  const validateTime = (timeString) => {
    if (!timeString || timeString.length < 3) return true;
    
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const minuteNum = parseInt(minutes || '0', 10);
    
    return hourNum >= 0 && hourNum <= 23 && minuteNum >= 0 && minuteNum <= 59;
  };

  // 완성된 시간 포맷 (저장용)
  const completeTimeFormat = (timeString) => {
    if (!timeString) return '00:00';
    
    const numbersOnly = timeString.replace(/\D/g, '');
    if (numbersOnly.length <= 2) {
      const hours = numbersOnly.padStart(2, '0');
      return `${hours}:00`;
    } else {
      const hours = numbersOnly.slice(0, 2).padStart(2, '0');
      const minutes = numbersOnly.slice(2, 4).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  };

    // 더미데이터 직접 설정
  useEffect(() => {
    if (type === 'text' && field === 'notice') {
      setValue(storeInfo[0]?.notice || '');
    } else if (type === 'business-hours') {
      // 더미데이터를 직접 변환해서 설정
      const dummyBusinessHours = DAY_ORDER.map(dayOfWeek => {
        const found = storeInfo[0].businessHoursDetail.find(item => item.dayOfWeek === dayOfWeek);
        const item = found || {
          dayOfWeek,
          openTime: "11:00",
          closeTime: "21:00", 
          breakOpenTime: "15:00",
          breakCloseTime: "17:00"
        };
        
        return {
          day: dayOfWeekMap[item.dayOfWeek],
          dayEng: item.dayOfWeek.toLowerCase(),
          startTime: item.openTime,
          endTime: item.closeTime,
          breakStart: item.breakOpenTime || '',
          breakEnd: item.breakCloseTime || ''
        };
      });
      setBusinessHours(dummyBusinessHours);
    }
  }, [type, field]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      let result;
      
      if (type === 'text' && field === 'notice') {
        result = await updateNotice(value); //  StoreInfoProvider 함수 사용
      } else if (type === 'business-hours') {
        const completedHours = businessHours.map(hour => ({
          ...hour,
          startTime: completeTimeFormat(hour.startTime),
          endTime: completeTimeFormat(hour.endTime),
          breakStart: completeTimeFormat(hour.breakStart),
          breakEnd: completeTimeFormat(hour.breakEnd)
        }));
        
        setBusinessHours(completedHours);
        result = await updateBusinessHours(completedHours); //  StoreInfoProvider 함수 사용
      }

      if (result && result.success !== false) {
        setIsEditing(false);
      } else {
        alert('저장 실패: ' + (result?.error || '알 수 없는 오류'));
      }
    } catch (error) {
      alert('저장 중 오류가 발생했습니다.');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHour = (dayIndex, fieldName, newValue) => {
    const formattedValue = formatTimeInput(newValue);
    
    if (validateTime(formattedValue)) {
      const updated = [...businessHours];
      updated[dayIndex][fieldName] = formattedValue;
      setBusinessHours(updated);
    }
  };


  return (
    <Container>
      <Header>
        <SectionTitle>{title}</SectionTitle>
        <ActionButton 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
        >
          {isEditing ? '저장' : <EditIcon />}
        </ActionButton>
      </Header>

      {isEditing ? (
        <EditingArea>
          {type === 'business-hours' ? (
            <BusinessHoursContainer>
              {businessHours.map((hour, index) => (
                <BusinessHourRow key={hour.dayEng}>
                  <DayLabel>{hour.day}</DayLabel>
                  
                  <TimeGroup>
                    <TimeInput
                      type="text"
                      value={hour.startTime}
                      onChange={(e) => updateBusinessHour(index, 'startTime', e.target.value)}
                      placeholder="0000"
                      maxLength="5"
                      inputMode="numeric"
                    />
                    <TimeSeparator>-</TimeSeparator>
                    <TimeInput
                      type="text"
                      value={hour.endTime}
                      onChange={(e) => updateBusinessHour(index, 'endTime', e.target.value)}
                      placeholder="0000"
                      maxLength="5"
                      inputMode="numeric"
                    />
                  </TimeGroup>

                  <BreakLabel>브레이크타임</BreakLabel>
                  
                  <TimeGroup>
                    <TimeInput
                      type="text"
                      value={hour.breakStart}
                      onChange={(e) => updateBusinessHour(index, 'breakStart', e.target.value)}
                      placeholder="0000"
                      maxLength="5"
                      inputMode="numeric"
                    />
                    <TimeSeparator>-</TimeSeparator>
                    <TimeInput
                      type="text"
                      value={hour.breakEnd}
                      onChange={(e) => updateBusinessHour(index, 'breakEnd', e.target.value)}
                      placeholder="0000"
                      maxLength="5"
                      inputMode="numeric"
                    />
                  </TimeGroup>
                </BusinessHourRow>
              ))}
            </BusinessHoursContainer>
          ) : (
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              autoFocus
            />
          )}
        </EditingArea>
      ) : (
        <EditingArea>
          {type === 'business-hours' ? (
            <BusinessHoursContainer>
              {businessHours.map((hour) => (
                <BusinessHourRow key={hour.dayEng}>
                    <DayLabel>{hour.day}</DayLabel>
                  <TimeGroup>
                    <TimeInput2>{hour.startTime}</TimeInput2>
                    <TimeSeparator>-</TimeSeparator>
                    <TimeInput2>{hour.endTime}</TimeInput2>
                  </TimeGroup>

                  <BreakLabel>브레이크타임</BreakLabel>
                  
                  <TimeGroup>
                    <TimeInput2>{hour.breakStart}</TimeInput2>
                    <TimeSeparator>-</TimeSeparator>
                    <TimeInput2>{hour.breakEnd}</TimeInput2>
                  </TimeGroup>
                </BusinessHourRow>
              ))}
            </BusinessHoursContainer>
          ) : (
            <TextDisplay>
              {value || <EmptyMessage>{placeholder}</EmptyMessage>}
            </TextDisplay>
          )}
        </EditingArea>
      )}
    </Container>
  );
};

export default EditSection;

// 스타일 컴포넌트들 (이전과 동일)
const Container = styled.div`
  background: var(--white);
  padding: 1.875rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled.h3`
  ${display_large}
  color: var(--black);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  flex-shrink: 0;
  ${body_medium}
  color: var(--gray500);
  &:hover {
    background: var(--gray100);
  }
`;

const EmptyMessage = styled.span`
  color: var(--gray400);
  font-style: italic;
`;

const EditingArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TextArea = styled.textarea`
  ${title_semi}
  width: 100%;
  min-height: 25vh;
  padding: 1.5rem;
  border: 1px solid var(--gray300);
  border-radius: 0.625rem;
  background: var(--gray100);
  cursor: default;
  white-space: pre-wrap;   /* 줄바꿈 유지 */
  overflow-y: auto;        /* 내용이 많을 때 스크롤 */
  box-sizing: border-box;  /* 패딩 포함한 크기 계산 */
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray300);
    border-radius: 4px;
  }
`;

const TextDisplay = styled.div`
  ${title_semi}
  width: 100%;
  height: 25vh;
  padding: 1.5rem;     /* TextArea와 동일한 패딩 */
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--white);
  cursor: default;
  white-space: pre-wrap;   /* 줄바꿈 유지 */
  overflow-y: auto;        /* 내용이 많을 때 스크롤 */
  box-sizing: border-box;  /* 패딩 포함한 크기 계산 */
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray300);
    border-radius: 4px;
  }
`;


const BusinessHoursContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BusinessHourRow = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
`;

const DayLabel = styled.div`
  ${title_semi}
  color: var(--black);
`;

const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const TimeInput2 = styled.div`
  ${title_semi}
  color: var(--black);
  width: 100%;
  text-align: center;
`;

const TimeInput = styled.input`
  ${title_semi}
  color: var(--black);
  width: 100%;
  text-align: center;

  border-radius: 0.625rem;
  transition: all 0.2s;
  background: var(--gray100);
  border: 1px solid var(--gray300);
`;

const TimeSeparator = styled.span`
    ${title_semi}
  color: var(--black);
`;

const BreakLabel = styled.div`
  ${title_semi}
  color: var(--black);
  text-align: right;
`;

const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.675 19.85C1.375 19.9333 1.09167 19.9083 0.825 19.775C0.558334 19.6417 0.358334 19.4417 0.225 19.175C0.0916668 18.9083 0.0666667 18.625 0.15 18.325L1.1 14.475L13.85 1.75C14.25 1.35 14.7083 1.08333 15.225 0.949999C15.7417 0.799999 16.2583 0.799999 16.775 0.949999C17.2917 1.08333 17.75 1.35 18.15 1.75L18.25 1.85C18.65 2.25 18.9167 2.70833 19.05 3.225C19.2 3.74167 19.2 4.25833 19.05 4.775C18.9167 5.29167 18.65 5.75 18.25 6.15L5.525 18.9L1.675 19.85ZM2.075 18.85C2.09167 18.8 2.09167 18.725 2.075 18.625C2.075 18.525 2.05833 18.4 2.025 18.25C1.99167 18.0833 1.94167 17.9167 1.875 17.75L4.475 17.1L16.85 4.75C17.1167 4.48333 17.25 4.23333 17.25 4C17.25 3.76667 17.1167 3.51667 16.85 3.25L16.75 3.15C16.4833 2.88333 16.2333 2.75 16 2.75C15.7667 2.75 15.5167 2.88333 15.25 3.15L2.9 15.525L2.075 18.85ZM12.3 4.7L13.7 3.3L16.7 6.3L15.3 7.7L12.3 4.7Z" fill="#999999"/>
    </svg>
);
