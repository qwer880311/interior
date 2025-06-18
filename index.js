
// interior-ai-r8-backend: 최신 Replicate API용 백엔드 서버 예제 (Node.js + Express)

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3001;
const replicateApiToken = process.env.REPLICATE_API_TOKEN;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/generate', async (req, res) => {
  const { imageBase64, model = 'tstramer/style-transfer' } = req.body;

  if (!imageBase64 || !replicateApiToken) {
    return res.status(400).json({ error: '이미지와 API 키가 필요합니다.' });
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'a9758cbf0b45db83a2417322685b459aab3c7fc5f084e557e5fc1e24baf6e6c2',
        input: { image: imageBase64 }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('에러 발생:', err);
    res.status(500).json({ error: 'AI 이미지 생성 중 오류 발생' });
  }
});

app.listen(port, () => {
  console.log(`✅ 서버가 포트 ${port}에서 실행 중입니다.`);
});
