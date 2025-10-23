import styled from 'styled-components';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import EditSection from '../../components/EditSection';
import EditCategory from '../../components/EditCategory';
import MenuManagement from '../../components/MenuManagement';

const StoreInfoPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  //어쩌다보니 죄다 컴포넌트로 만들어버린 페이지
  //새로고침 함수
  const refreshCategories = () => {
    console.log('새로고침');
    setRefreshKey(prev => prev + 1);
  };
  return (
    <>
      <StoreContainer>
        <ContentWrapper>
          <LeftColumn>
            <EditSection
              title="가게 공지"
              type="text"
              field="notice"
              placeholder="공지사항을 입력하세요"
            />
            {/* 영업시간 편집 */}
            <EditSection
              title="영업 시간"
              type="business-hours"
              field="businessHours"
            />
          </LeftColumn>
          <Divider />
          <RightColumn>
            <EditCategory 
              title="메뉴 카테고리" 
              refreshKey={refreshKey}
            />
            <MenuManagement
              title="메뉴 관리"
              onMenuChange={refreshCategories}
            />
          </RightColumn>
        </ContentWrapper>
      </StoreContainer>
    </>
  );
};

export default StoreInfoPage;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const StoreContainer = styled.div`
  display: flex;
  padding: 1.88rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  border-radius: 1.25rem;
  background-color: var(--white);
  flex: 1;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
    display: none;
    }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const Divider = styled.div`
  width: 0.04375rem;
  background-color: var(--gray300);
  min-height: 100%;
  align-self: stretch; /* 부모 높이에 맞춰 늘어남 */
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
`;
