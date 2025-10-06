import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import EditSection from '../../components/EditSection';
import EditCategory from '../../components/EditCategory';
import MenuManagement from '../../components/MenuManagement';

const StoreInfoPage = () => {

  //어쩌다보니 죄다 컴포넌트로 만들어버린 페이지
  return (
    <Layout>
      <Sidebar />
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
      <EditCategory title="메뉴 카테고리" />
      <MenuManagement title="메뉴 관리" />
    </RightColumn>
    </ContentWrapper>
  </StoreContainer>
</Layout>
  );
};

export default StoreInfoPage;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.25rem;
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
