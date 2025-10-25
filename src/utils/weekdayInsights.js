import OpenAI from 'openai';
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

export async function fetchWeekdayInsights(storeId, openaiApiKey) {
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

  const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true,
  });

  const jsonSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      one_line_korean: { type: 'string', maxLength: 120 },
    },
    required: ['one_line_korean'],
  };

  const resp = await openai.responses.create({
    model: 'gpt-4.1-mini',
    temperature: 0.2,
    text: {
      format: {
        type: 'json_schema',
        name: 'weekday_one_line',
        schema: jsonSchema,
        strict: true,
      },
    },
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text:
              '너는 음식점 운영 코치다. 한국어 존댓말(-요체)로 친절하고 발랄하게 말한다. 모든 주장에는 입력 데이터의 수치를 근거로 간략히 뒷받침한다. 과장/가정/외부지식 금지.' +
              '15-20자마다 줄바꿈을 하고, 단어 중간에 줄바꿈을 하지 않도록 한다.',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: '아래 2개월 요약 통계를 근거로 주문이 가장 많은 요일, 적은 요일, 평일과 주말의 차이 등을 120자 이내로 인사이트 문구를 만들어. JSON 스키마에 맞춰서만 출력.',
          },
          { type: 'input_text', text: JSON.stringify(summary) },
        ],
      },
    ],
  });

  console.log(resp);
  if (resp?.output_text) {
    const obj = JSON.parse(resp.output_text);
    console.log(obj.one_line_korean);
    return obj.one_line_korean;
  }
  return '파싱 실패';
}
