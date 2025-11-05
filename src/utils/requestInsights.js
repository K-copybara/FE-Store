import axios from 'axios';
import { getRequestNotes } from '../api/stats';

export async function fetchRequestInsightOneLine({ storeId, maxItems = 100 }) {
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

    const { data } = await axios.post('/.netlify/functions/chat', {
      type: 'request_one_line',
      payload,
    });

    return data?.one_line_korean ?? '파싱 실패';
  } catch (err) {
    console.error(err);
  }
}
