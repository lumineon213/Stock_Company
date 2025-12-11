// backend/src/index.ts

import express from 'express';
import type { Request, Response as ExResponse } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;
// Next.js 프론트엔드 주소로 설정합니다. (Next.js는 보통 3001에서 실행됨)
const FRONTEND_URL = 'http://localhost:3001'; 

// --- 미들웨어 설정 ---
// CORS 설정: 프론트엔드 주소만 허용
const corsOptions: cors.CorsOptions = {
  origin: FRONTEND_URL, 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); // JSON 요청 본문 파싱 활성화

// --- API 라우팅 설정 ---

// 1. 서버 상태 확인
app.get('/', (req: Request, res: ExResponse) => {
  res.status(200).send('Stock Game Backend Server is up and running!');
});

// 2. 가상 주식 데이터 제공 API
app.get('/api/stock/latest', (req: Request, res: ExResponse) => {
  const fakeStockData = {
    symbol: 'MOCK_STK',
    company: 'Express Server Mock Data',
    price: (Math.random() * (1200 - 900) + 900).toFixed(2),
    change: (Math.random() * (7 - (-3)) + (-3)).toFixed(2),
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(fakeStockData);
});

// 3. 사용자 인증 (로그인 예시)
app.post('/api/auth/login', (req: Request, res: ExResponse) => {
  const { username, password } = req.body;
  
  if (username === 'test' && password === '1234') {
    return res.status(200).json({ token: 'fake-jwt-token', message: '로그인 성공!' });
  }
  
  res.status(401).json({ message: '인증 실패.' });
});


// --- 서버 시작 ---
app.listen(PORT, () => {
  console.log(`[server]: Backend Server is running at http://localhost:${PORT}`);
  console.log(`[CORS]: Frontend allowed at ${FRONTEND_URL}`);
});