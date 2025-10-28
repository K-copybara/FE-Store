import OpenAI from 'openai';
import { getRequestNotes } from '../api/stats';

export async function fetchRequestInsightOneLine({
  storeId,
  apiKey,
  maxItems = 100,
}) {
  try {
    const rows = await getRequestNotes(storeId);

    // 요청이 없으면 기본 문구
    if (!rows.length) {
      return '지난 2주간 특별한 요청이 많지 않았어요. 현재 서비스 품질을 유지해볼까요?';
    }

    // 최신순으로 최대 maxItems까지만 사용
    const payload = {
      notes: rows
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, maxItems),
    };

    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    const jsonSchema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        one_line_korean: { type: 'string', maxLength: 100 },
      },
      required: ['one_line_korean'],
    };

    const resp = await openai.responses.create({
      model: 'gpt-4.1-mini',
      temperature: 0.2,
      text: {
        format: {
          type: 'json_schema',
          name: 'request_one_line',
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
                '너는 음식점 운영 코치다. 아래 손님 요청 원문 목록을 근거로' +
                '자주 나타나는 요청들을 파악하여 최대 5개 항목을 아래와 같은 형식으로 친절히 알려준다. 과장/추측 금지.' +
                '예시 : 손님들이 자주 한 요청이에요\n - 휴지 좀 채워주세요\n - 반찬 리필해주세요\n - 매장 온도 좀 내려주세요',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: '요청 원문을 그대로 준다. 이를 기반으로 요약 문구를 JSON 스키마에 맞춰 반환해라.',
            },
            { type: 'input_text', text: JSON.stringify(payload) },
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
  } catch (err) {
    console.error(err);
  }
}
