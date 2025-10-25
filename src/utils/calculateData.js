import dayjs from 'dayjs';

const WEEKDAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

// ✅ (추가) 유틸: 현재 시간(HH)까지 자르기
function trimToCurrentHour(data, cutoffHour = dayjs().format('HH')) {
  return Array.isArray(data) ? data.filter((d) => d.hour <= cutoffHour) : [];
}
// ✅ (추가) 유틸: 합계
function summarizeHourRows(data) {
  return data.reduce(
    (acc, cur) => {
      acc.sales += cur?.sales || 0;
      acc.orders += cur?.orderCount || 0;
      return acc;
    },
    { sales: 0, orders: 0 }
  );
}
// ✅ (추가) 유틸: 오늘 vs 지난주(같은 요일) "현재 시각까지" 비교
export const compareTodayVsLastWeek = (todayHours, lastWeekHours) => {
  const cutoffHour = dayjs().format('HH');
  const tCut = trimToCurrentHour(todayHours, cutoffHour);
  const lCut = trimToCurrentHour(lastWeekHours, cutoffHour);

  const t = summarizeHourRows(tCut);
  const l = summarizeHourRows(lCut);

  const diffSales = t.sales - l.sales;
  const diffOrders = t.orders - l.orders;

  const pctSales = l.sales === 0 ? null : (diffSales / l.sales) * 100;
  const pctOrders = l.orders === 0 ? null : (diffOrders / l.orders) * 100;

  return {
    cutoffHour,
    today: t,
    lastWeek: l,
    diff: { sales: diffSales, orders: diffOrders },
    pct: { sales: pctSales, orders: pctOrders },
  };
};

export function normalizeMonth(rows) {
  const m = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]));
  for (const r of rows || []) {
    if (WEEKDAYS.includes(r.weekday) && typeof r.sales === 'number') {
      m[r.weekday] += r.sales;
    }
  }
  return m;
}

export function mergeMonths(months) {
  const merged = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]));
  for (const m of months) {
    for (const d of WEEKDAYS) merged[d] += m[d];
  }
  return merged;
}

export function averageMonths(merged, monthCount) {
  const avg = Object.fromEntries(WEEKDAYS.map((d) => [d, 0]));
  for (const d of WEEKDAYS) avg[d] = Math.round(merged[d] / monthCount);
  return avg;
}

export function rankDesc(data) {
  return [...WEEKDAYS].sort((a, b) => data[b] - data[a]);
}

export function pickBusiestSlowest(data) {
  const ranking = rankDesc(data);
  return { busiest: ranking[0], slowest: ranking[6], ranking };
}

export function weekendVsWeekdayDiff(avgData) {
  const weekend = avgData['SATURDAY'] + avgData['SUNDAY'];
  const weekday =
    avgData['MONDAY'] +
    avgData['TUESDAY'] +
    avgData['WEDNESDAY'] +
    avgData['THURSDAY'] +
    avgData['FRIDAY'];
  const weekendAvg = Math.round(weekend / 2);
  const weekdayAvg = Math.round(weekday / 5);
  const pct =
    weekdayAvg === 0 ? null : ((weekendAvg - weekdayAvg) / weekdayAvg) * 100;
  return { weekendAvg, weekdayAvg, pct };
}

export function effectSize(maxV, minV) {
  const abs = maxV - minV;
  const pct = minV === 0 ? null : (abs / minV) * 100;
  return { abs, pct };
}
