import express from 'express';
import type { Request, Response as ExResponse } from 'express';
import cors from 'cors';
import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      nickname: string;
    }
  }
}

// Prisma 로그 옵션을 추가하면 DB 쿼리 실행 내용도 터미널에 보입니다.
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const app = express();
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
app.get('/', (_req: Request, res: ExResponse) => {
  res.status(200).send('Stock Game Backend Server is up and running!');
});

// 2. 신규 API: 요원 등록 (회원가입)
interface RegisterRequest {
  email: string;
  nickname: string;
  password: string;
}

app.post('/api/auth/register', async (req: Request<{}, {}, RegisterRequest>, res: ExResponse) => {
  const { email, nickname, password } = req.body;

  try {
    // 1. Supabase에 사용자 등록 (인증)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error('[AUTH ERROR]', authError);
      return res.status(400).json({ message: '회원가입 실패: ' + (authError?.message || '알 수 없는 오류') });
    }

    // 2. Prisma DB에 사용자 정보 저장
    const newUser = await prisma.user.create({
      data: {
        email,
        nickname,
        password, // 실제 프로덕션에서는 해시된 비밀번호를 저장해야 합니다
        balance: 1000000, // 초기 잔액
      },
    });

    // 로그 추가: 성공 완료
    console.log(`[DB] 가입 성공 완료! 생성된 ID: ${newUser.id}`);
    return res.status(201).json({ message: '회원가입 성공!', user: { email: newUser.email } });

  } catch (error) {
    // 로그 추가: 에러 상세 출력
    console.error('[REGISTER ERROR]', error);

    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      return res.status(400).json({ message: '이미 사용 중인 이메일 또는 닉네임입니다.' });
    }
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 3. 사용자 인증 (로그인 - DB 연동 버전)
interface LoginRequest {
  email: string;
  password: string;
}

app.post('/api/auth/login', async (req: Request<{}, {}, LoginRequest>, res: ExResponse) => {
  const { email, password } = req.body;
  
  // 🚀 로그 추가: 로그인 시도
  console.log(`\n[LOGIN] 로그인 요청 - Email: ${email}`);

  try {
    // 1. DB에서 해당 이메일 유저 찾기
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        balance: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      // 🚀 로그 추가: 계정 없음
      console.log(`[LOGIN FAIL] 존재하지 않는 계정: ${email}`);
      return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
    }

    // 2. 비밀번호 비교
    const isPasswordValid = await compare(password, user.password);
    
    if (isPasswordValid) {
      // 🚀 로그 추가: 로그인 성공
      console.log(`[LOGIN SUCCESS] 로그인 성공: ${user.nickname} (잔액: ${user.balance})`);
      return res.status(200).json({ 
        message: '로그인 성공!', 
        user: { nickname: user.nickname, balance: user.balance } 
      });
    } else {
      // 🚀 로그 추가: 비번 틀림
      console.log(`[LOGIN FAIL] 비밀번호 불일치: ${email}`);
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }
  } catch (error) {
    // 🚀 로그 추가: 에러 상세 출력
    console.error('[LOGIN ERROR]', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 4. 가상 주식 데이터 (기존 유지)
app.get('/api/stock/latest', (_req: Request, res: ExResponse) => {
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
  console.log(`\n🚀 [server]: Backend Server is running at http://localhost:${PORT}`);
  console.log(`🔗 [CORS]: Frontend allowed at ${FRONTEND_URL}`);
  console.log(`📂 [DB]: Prisma Client is ready to connect to Supabase\n`);
});