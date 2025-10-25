import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SEMINI from '../assets/semini.svg?react';
import INFO_CIRCLE from '../assets/icons/info_circle.svg?react';
import { getHourlySales } from '../api/stats';
import { getLastWeekDate, getTodayDate } from '../utils/formatTime';
import { useUserStore } from '../store/useUserStore';
import { reg14, reg18 } from '../styles/font';
import { compareTodayVsLastWeek } from '../utils/calculateData';
import { fetchWeekdayInsights } from '../utils/weekdayInsights';
import { fetchRequestInsightOneLine } from '../utils/requestInsights';

const INSIGHT_CACHE_KEY = (storeId) => `weekdayInsight:${storeId}`;
const REQ_INSIGHT_KEY = (storeId) => `requestInsight:${storeId}`;

function loadInsightFromCache(storeId) {
  try {
    if (!storeId || typeof window === 'undefined') return null;
    const key = INSIGHT_CACHE_KEY(storeId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const obj = JSON.parse(raw);
    const today = getTodayDate(); // "YYYY-MM-DD"

    // 날짜가 다르면 캐시 삭제 후 미사용
    if (obj?.date !== today) {
      window.localStorage.removeItem(key);
      return null;
    }

    // 형식 검증
    if (typeof obj?.value === 'string') return obj.value;

    // 형식 이상해도 정리
    window.localStorage.removeItem(key);
    return null;
  } catch (err) {
    console.warn('loadInsightFromCache error:', err);
    return null;
  }
}

function saveInsightToCache(storeId, value) {
  try {
    if (!storeId || typeof window === 'undefined') return;
    const key = INSIGHT_CACHE_KEY(storeId);
    const today = getTodayDate(); // "YYYY-MM-DD"
    const obj = { date: today, value, savedAt: Date.now() };
    window.localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    console.warn('saveInsightToCache error:', err);
  }
}

function loadReqInsight(storeId) {
  try {
    if (!storeId || typeof window === 'undefined') return null;
    const key = REQ_INSIGHT_KEY(storeId);
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const obj = JSON.parse(raw);
    const today = getTodayDate(); // "YYYY-MM-DD"

    // 날짜 다르면 삭제하고 미사용
    if (obj?.date !== today) {
      window.localStorage.removeItem(key);
      return null;
    }
    return typeof obj?.value === 'string' ? obj.value : null;
  } catch (e) {
    console.warn('loadReqInsight error:', e);
    return null;
  }
}

function saveReqInsight(storeId, value) {
  try {
    if (!storeId || typeof window === 'undefined') return;
    const key = REQ_INSIGHT_KEY(storeId);
    const today = getTodayDate();
    window.localStorage.setItem(
      key,
      JSON.stringify({ date: today, value, savedAt: Date.now() })
    );
  } catch (e) {
    console.warn('saveReqInsight error:', e);
  }
}

export default function CarouselBanner() {
  const { storeId } = useUserStore();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3;

  const [firstText, setFirstText] = useState('...');
  const [secondText, setSecondText] = useState('...');
  const [thirdText, setThirdText] = useState('...');

  const executedRef = useRef(false);
  const executedReqRef = useRef(false);

  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  const slides = [
    {
      id: 1,
      title: firstText,
      gradient: 'linear-gradient(to right, #93c5fd, #a5b4fc)',
    },
    {
      id: 2,
      gradient: 'linear-gradient(to right, #bef264, #86efac)',
      title: secondText,
    },
    {
      id: 3,
      title: thirdText,
      gradient: 'linear-gradient(to right, #fde047, #fcd34d)',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalPages]);

  const goToPage = (page) => setCurrentPage(page);
  const goToPrevious = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  const goToNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);

  const createFirstText = async () => {
    try {
      const today = getTodayDate(); // "YYYY-MM-DD"
      console.log(today);
      const lastweek = getLastWeekDate(); // "YYYY-MM-DD"
      console.log(lastweek);
      const nowHours = await getHourlySales(today, storeId);
      const prevHours = await getHourlySales(lastweek, storeId);

      const cmp = compareTodayVsLastWeek(nowHours, prevHours);

      const pctSales =
        cmp.pct.sales == null ? '-' : `${cmp.pct.sales.toFixed(1)}%`;
      const pctOrders =
        cmp.pct.orders == null ? '-' : `${cmp.pct.orders.toFixed(1)}%`;

      const text =
        `지금(${cmp.cutoffHour}시)까지\n` +
        `주문은 ${cmp.today.orders}건, ` +
        `매출은 ₩${cmp.today.sales.toLocaleString()}예요.\n` +
        `지난주 같은 시간대보다\n주문 ${Math.abs(cmp.diff.orders)}건 (${pctOrders}) ${cmp.diff.orders >= 0 ? '🔼' : '🔽'} ` +
        `매출  ₩${Math.abs(cmp.diff.sales).toLocaleString()} (${pctSales})${cmp.diff.sales >= 0 ? '🔼' : '🔽'}`;

      setFirstText(text);
    } catch (err) {
      console.error(err);
      setFirstText('데이터를 불러오는 중 오류가 발생했어요.');
    }
  };

  useEffect(() => {
    if (storeId) createFirstText();
  }, [storeId]);

  useEffect(() => {
    if (!storeId || !OPENAI_KEY) return;
    if (executedRef.current) return; // 동일 마운트 사이클에서 재실행 방지
    executedRef.current = true;

    // 캐시 먼저 확인
    const cached = loadInsightFromCache(storeId);
    if (cached) {
      setSecondText(cached);
      return;
    }

    // 캐시에 없으면 호출
    (async () => {
      try {
        const line = await fetchWeekdayInsights(storeId, OPENAI_KEY); // 한 줄 문구 반환
        setSecondText(line);
        saveInsightToCache(storeId, line); // 저장
      } catch (e) {
        console.error(e);
        setSecondText('요일 인사이트를 불러오는 중 오류가 발생했어요.');
      }
    })();
  }, [storeId, OPENAI_KEY]);

  useEffect(() => {
    if (!storeId || !OPENAI_KEY) return;
    if (executedReqRef.current) return;
    executedReqRef.current = true;

    // 캐시 확인
    const cached = loadReqInsight(storeId);
    if (cached) {
      setThirdText(cached);
      return;
    }

    // 캐시에 없으면 호출
    (async () => {
      try {
        const line = await fetchRequestInsightOneLine({
          storeId,
          apiKey: OPENAI_KEY,
        });
        setThirdText(line);
        saveReqInsight(storeId, line);
      } catch (e) {
        console.error(e);
        setThirdText('요청사항 요약을 불러오는 중 오류가 발생했어요.');
      }
    })();
  }, [storeId, OPENAI_KEY]);

  return (
    <CarouselContainer>
      <TopContainer>
        <Left>
          <INFO_CIRCLE />
          <InfoText>AI가 주문 데이터를 요약했어요</InfoText>
        </Left>

        <SEMINI_ICON />
      </TopContainer>

      <CarouselWrapper>
        <SlidesContainer currentPage={currentPage}>
          {slides.map((slide) => (
            <Slide key={slide.id} gradient={slide.gradient}>
              <SlideText>{slide.title}</SlideText>
            </Slide>
          ))}
        </SlidesContainer>

        <NavButton
          direction="left"
          onClick={goToPrevious}
          aria-label="이전 슬라이드"
        >
          <ChevronLeft />
        </NavButton>

        <NavButton
          direction="right"
          onClick={goToNext}
          aria-label="다음 슬라이드"
        >
          <ChevronRight />
        </NavButton>

        <DotsContainer>
          {[...Array(totalPages)].map((_, index) => (
            <Dot
              key={index}
              active={currentPage === index}
              onClick={() => goToPage(index)}
              aria-label={`${index + 1}페이지로 이동`}
            />
          ))}
        </DotsContainer>
      </CarouselWrapper>
    </CarouselContainer>
  );
}

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 1152px;
  margin-top: auto;
  margin-bottom: 1rem;

  display: flex;
  flex-direction: column;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  gap: 0.1rem;
`;

const InfoText = styled.div`
  ${reg14}
  font-size: 12px;
  color: var(--gray300);
`;

const SEMINI_ICON = styled(SEMINI)`
  width: 65px;
  height: 45px;
  margin-left: auto;
`;

const CarouselWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
`;

const SlidesContainer = styled.div`
  display: flex;
  transition: transform 500ms ease-out;
  transform: ${({ currentPage }) => `translateX(-${currentPage * 100}%)`};
`;

const Slide = styled.div`
  width: 100%;
  flex-shrink: 0;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: ${({ gradient }) => gradient};
`;

const SlideText = styled.div`
  ${reg18};
  color: white;
  white-space: pre-line;
  text-align: center;
`;

const NavButton = styled.button`
  position: absolute;
  bottom: 24px;
  ${({ direction }) => (direction === 'left' ? 'left: 16px;' : 'right: 16px;')}
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  padding: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 200ms;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 300ms;
  background-color: ${({ active }) =>
    active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)'};

  &:hover {
    background-color: ${({ active }) =>
      active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.75)'};
  }
`;
