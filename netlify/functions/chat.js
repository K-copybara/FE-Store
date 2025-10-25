import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { type, payload, summary } = JSON.parse(event.body || '{}');

    if (type === 'request_one_line') {
      const jsonSchema = {
        type: 'object',
        additionalProperties: false,
        properties: { one_line_korean: { type: 'string', maxLength: 100 } },
        required: ['one_line_korean'],
      };

      const body = {
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
              { type: 'input_text', text: JSON.stringify(payload ?? {}) },
            ],
          },
        ],
      };

      const resp = await openAIResponses(body);
      const one = extractOneLine(resp, '파싱 실패');
      return json({ one_line_korean: one });
    }

    if (type === 'weekday_one_line') {
      const jsonSchema = {
        type: 'object',
        additionalProperties: false,
        properties: { one_line_korean: { type: 'string', maxLength: 120 } },
        required: ['one_line_korean'],
      };

      const body = {
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
              { type: 'input_text', text: JSON.stringify(summary ?? {}) },
            ],
          },
        ],
      };

      const resp = await openAIResponses(body);
      const one = extractOneLine(resp, '파싱 실패');
      return json({ one_line_korean: one });
    }

    return { statusCode: 400, body: 'Unknown type' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

async function openAIResponses(body) {
  const { data } = await axios.post(
    'https://api.openai.com/v1/responses',
    body,
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return data;
}

function extractOneLine(openaiData, fallback) {
  try {
    if (openaiData?.output_text) {
      const obj = JSON.parse(openaiData.output_text);
      return obj?.one_line_korean ?? fallback;
    }
    // 혹시 output_text가 없을 때 대비
    const text =
      openaiData?.output?.[0]?.content?.[0]?.text ??
      openaiData?.choices?.[0]?.message?.content;
    if (typeof text === 'string') {
      const obj = JSON.parse(text);
      return obj?.one_line_korean ?? fallback;
    }
  } catch {}
  return fallback;
}

function json(obj) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  };
}
