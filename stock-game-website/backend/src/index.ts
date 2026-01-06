import express from 'express';
import type { Request, Response as ExResponse } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt'; // 비밀번호 암호화용
import { PrismaClient } from  '@prisma/client' // Prisma 연동

export const db = new PrismaClient();
const app = express();
const prisma = new PrismaClient(); // Prisma 인스턴스 생성
const PORT = 3000;
const FRONTEND_URL = 'http://localhost:3001'; 

// --- 미들웨어 설정 ---
const corsOptions: cors.CorsOptions = {
  origin: FRONTEND_URL, 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- API 라우팅 설정 ---

// 1. 서버 상태 확인
app.get('/', (req: Request, res: ExResponse) => {
  res.status(200).send('Stock Game Backend Server is up and running!');
});

// 2. 신규 API: 요원 등록 (회원가입)
app.post('/api/auth/register', async (req: Request, res: ExResponse) => {
  const { email, nickname, password } = req.body;

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // Supabase DB에 유저 생성
    const newUser = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
        balance: 1000000, // 기본 자산 100만 원 (DB Default가 있다면 생략 가능)
      },
    });

    res.status(201).json({ message: '회원가입 성공!', user: { email: newUser.email } });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '이미 존재하는 계정이거나 등록에 실패했습니다.' });
  }
});

// 3. 사용자 인증 (로그인 - DB 연동 버전)
app.post('/api/auth/login', async (req: Request, res: ExResponse) => {
  const { email, password } = req.body;
  
  try {
    // 1. DB에서 해당 이메일 유저 찾기
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
    }

    // 2. 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      return res.status(200).json({ 
        message: '로그인 성공!', 
        user: { nickname: user.nickname, balance: user.balance } 
      });
    } else {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

// 4. 가상 주식 데이터 (기존 유지)
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

// --- 서버 시작 ---
app.listen(PORT, () => {
  console.log(`[server]: Backend Server is running at http://localhost:${PORT}`);
  console.log(`[CORS]: Frontend allowed at ${FRONTEND_URL}`);
});