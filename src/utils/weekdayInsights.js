import { getWeekDaySales } from '../api/stats';
import {
  mergeMonths,
  normalizeMonth,
  averageMonths,
  pickBusiestSlowest,
  weekendVsWeekdayDiff,
  effectSize,
} from './calculateData';
import { recentMonthsYYYYMM } from './formatTime';

export async function fetchWeekdayInsights(storeId) {
  const months = recentMonthsYYYYMM(2);
  const monthCount = months.length;

  // 월별 호출
  const monthDatas = [];
  for (const m of months) {
    const rows = await getWeekDaySales(m, storeId); // [{weekday, sales} x7]
    monthDatas.push(normalizeMonth(rows));
  }

  // 합산 -> 평균
  const merged = mergeMonths(monthDatas);
  const avg = averageMonths(merged, monthCount);

  // 순위/최다·최소/효과크기
  const { busiest, slowest, ranking } = pickBusiestSlowest(avg);
  const eff = effectSize(avg[busiest], avg[slowest]);

  // 주말 vs 주중
  const wkd = weekendVsWeekdayDiff(avg);

  // 요약 페이로드
  const summary = {
    period: `${months[0]}~${months[months.length - 1]}`,
    currency: 'KRW',
    month_count: monthCount,
    avg_by_weekday: avg,
    ranking_desc: ranking,
    busiest,
    slowest,
    weekend_weekday_gap_pct:
      wkd.pct === null ? null : Math.round(wkd.pct * 10) / 10,
    effect_size: {
      abs: eff.abs,
      pct: eff.pct === null ? null : Math.round(eff.pct * 10) / 10,
    },
  };

  const { data } = await axios.post('/.netlify/functions/chat', {
    type: 'weekday_one_line',
    summary,
  });

  return data?.one_line_korean ?? '파싱 실패';
}
