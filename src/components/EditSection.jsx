import styled from 'styled-components';
import { useState, useEffect} from 'react';
import { bold24, reg14, reg18, bold18 } from '../styles/font';

import EditIcon from '../assets/icons/EditCategory/edit-icon.svg?react';

import { getStoreInfo, patchStoreNotice, patchStoreHours } from '../api/store';

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

  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 요일 순서 정의
  const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  //요일 영어-한국어 매핑
  const dayOfWeekMap = {
    "MONDAY": "월",
    "TUESDAY": "화", 
    "WEDNESDAY": "수",
    "THURSDAY": "목",
    "FRIDAY": "금",
    "SATURDAY": "토",
    "SUNDAY": "일"
  };

  useEffect(() => {
    const fetchStoreInfo = async () => {
      setLoading(true);
      try {
        const data = await getStoreInfo();
        //console.log('가게 정보 조회 성공:', data);
        setStoreData(data);
      } catch (error) {
        setError(error);
        console.error('가게 정보 조회 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  //브레이크 타임, 영업시간 초기값 설정
  useEffect(() => {
    if (!storeData) return;
    if (type === 'text' && field === 'notice') {
      setValue(storeData.notice || '');
    } else if (type === 'business-hours') {
      const formattedBusinessHours = DAY_ORDER.map(dayOfWeek => {
        const found = storeData.businessHoursDetail.find(item => item.dayOfWeek === dayOfWeek);
        const item = found || {
          dayOfWeek,
          openTime: "00:00",
          closeTime: "00:00", 
          breakOpenTime: "00:00",
          breakCloseTime: "00:00"
        };
        
        return {
          day: dayOfWeekMap[item.dayOfWeek],
          dayEng: item.dayOfWeek.toLowerCase(),
          startTime: item.openTime || '00:00',
          endTime: item.closeTime || '00:00',
          breakStart: item.breakOpenTime || '00:00',
          breakEnd: item.breakCloseTime || '00:00'
        };
      });
      setBusinessHours(formattedBusinessHours);
    }
  }, [storeData, type, field]);


  // 영업시간 업데이트 
  const updateBusinessHours = async (editSectionFormat) => {
    try {
      const apiFormat = editSectionFormat.map(item => ({
        dayOfWeek: item.dayEng.toUpperCase(),
        openTime: item.startTime,
        closeTime: item.endTime,
        breakOpenTime: item.breakStart === '00:00' ? null : item.breakStart,
        breakCloseTime: item.breakEnd === '00:00' ? null : item.breakEnd
      }));
      
      const requestData = {
        businessHours: apiFormat
      };
      
      //console.log('영업시간 업데이트 요청:', requestData);
      
     
      await patchStoreHours(requestData);
      //console.log('영업시간 업데이트 성공:', response);
      
      return { success: true };
    } catch (error) {
      console.error('영업시간 업데이트 실패:', error);
      return { success: false, error: error.message };
    }
  };


  //공지사항 업데이트
  const updateNotice = async (newNotice) => {
    try {
      const requestData = {
        notice: newNotice 
      };
      
      //console.log('공지사항 업데이트 요청:', requestData);
      
      await patchStoreNotice(requestData);
      //console.log('공지사항 업데이트 성공:', response);
      
      return { success: true };
    } catch (error) {
      console.error('공지사항 업데이트 실패:', error);
      return { success: false, error: error.message };
    }
  };


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

    // 영업시간 입력 때 자동으로 00:00 포맷 맞추기
  const updateBusinessHour = (dayIndex, fieldName, newValue) => {
    const formattedValue = formatTimeInput(newValue);
    
    if (validateTime(formattedValue)) {
      const updated = [...businessHours];
      updated[dayIndex][fieldName] = formattedValue;
      setBusinessHours(updated);
    }
  };

  // 저장 처리
  const handleSave = async () => {
    setSaving(true);
    
    try {
      let result;
      
      if (type === 'text' && field === 'notice') {
        result = await updateNotice(value);
      } else if (type === 'business-hours') {
        const completedHours = businessHours.map(hour => ({
          ...hour,
          startTime: completeTimeFormat(hour.startTime),
          endTime: completeTimeFormat(hour.endTime),
          breakStart: completeTimeFormat(hour.breakStart),
          breakEnd: completeTimeFormat(hour.breakEnd)
        }));
        
        setBusinessHours(completedHours);
        result = await updateBusinessHours(completedHours);
      }

      if (result && result.success !== false) {
        setIsEditing(false);
        
        //저장 성공 후 최신 데이터 다시 불러오기
        const updatedData = await getStoreInfo();
        setStoreData(updatedData);
        
        alert('저장 성공'); 
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


  if (loading) return <Container></Container>;
  if (error) return <Container>에러 발생: {error.message}</Container>;

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

const Container = styled.div`
  background: var(--white);
  padding: 1.875rem;
  min-width: 0; //자식 축소 허용

    /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray300);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray300);
  }
  overflow-x: auto;
  
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
  white-space: nowrap;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  flex-shrink: 0;
  ${reg14}
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
  ${reg18}
  width: 100%;
  min-height: 25vh;
  padding: 1.5rem;
  border: 1px solid var(--gray300);
  border-radius: 0.625rem;
  background: var(--gray100);
  cursor: default;
  white-space: pre-wrap; 
  overflow-y: auto;       
  box-sizing: border-box;  
  
    /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray300);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray300);
  }
`;

const TextDisplay = styled.div`
  ${reg18}
  width: 100%;
  height: 25vh;
  padding: 1.5rem;  
  border: 1px solid var(--secondary);
  border-radius: 0.625rem;
  background: var(--white);
  cursor: default;
  white-space: pre-wrap;  
  overflow-y: auto;        
  box-sizing: border-box;
  
    /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--gray100);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gray300);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray300);
  }
`;


const BusinessHoursContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 10rem;

`;

const BusinessHourRow = styled.div`
  display: grid;
  grid-template-columns: 1rem minmax(8rem, 1fr) 6rem minmax(8rem, 1fr);
  align-items: center;
  gap: 0.75rem;
`;

const DayLabel = styled.div`
  ${bold18}
  color: var(--black);
  flex-shrink: 0;
`;

const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;
const TimeInput2 = styled.div`
  ${reg18}
  color: var(--black);
  min-width: 1rem;
  text-align: center;
`;

const TimeInput = styled.input`
  ${reg18}
  color: var(--black);
  min-width: 1rem;
  text-align: center;

  border-radius: 0.625rem;
  transition: all 0.2s;
  background: var(--gray100);
  border: 1px solid var(--gray300);
`;

const TimeSeparator = styled.span`
    ${reg18}
  color: var(--black);
  flex-shrink: 0;
`;

const BreakLabel = styled.div`
  ${bold18}
  color: var(--black);
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
`;

