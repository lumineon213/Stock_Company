# 주식 게임 플랫폼 - 실시간 주식 데이터 연동

## 설치된 패키지
- ✅ finance-datareader: 한국 주식 데이터 수집
- ✅ flask & flask-cors: 주식 데이터 API 서버
- ✅ pandas: 데이터 처리

## 파일 구조
```
Stock_Company/
├── stock_data_service.py      # 주식 데이터 처리 클래스
├── stock_api_server.py        # Flask API 서버 (포트 5000)
├── start_servers.bat          # 서버 시작 스크립트
└── stock-game-website/
    └── backend/
        └── src/
            └── index.ts       # 메인 백엔드 서버 (포트 3000)
```

## API 엔드포인트

### 주식 데이터 API (Python, 포트 5000)
- `GET /api/stock/latest` - 최신 주식 데이터
- `GET /api/stock/price/<symbol>` - 특정 종목 주가
- `GET /api/stock/search?q=키워드` - 종목 검색
- `GET /api/stock/list` - 전체 종목 리스트
- `GET /api/market/kospi` - KOSPI 지수
- `GET /api/market/kosdaq` - KOSDAQ 지수
- `GET /api/stocks/popular` - 인기 종목 5개
- `GET /health` - 헬스 체크

### 메인 백엔드 API (Node.js, 포트 3000)
- `GET /api/stock/latest` - 실시간 주식 데이터 (Python API 연동)
- `GET /api/stock/price/:symbol` - 특정 종목 주가 조회
- `GET /api/stock/search?q=키워드` - 종목 검색
- `GET /api/stocks/popular` - 인기 종목 데이터
- `GET /api/market/kospi` - KOSPI 지수
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

## 실행 방법

### 1. 자동 시작 (권장)
```batch
start_servers.bat
```

### 2. 수동 시작
```bash
# 터미널 1: 주식 데이터 API 서버
python stock_api_server.py

# 터미널 2: 메인 백엔드 서버
cd stock-game-website/backend
npm run dev
```

## 테스트 방법

### API 테스트
```bash
# 주식 데이터 API 테스트
curl http://localhost:5000/api/stock/latest
curl http://localhost:5000/api/stock/price/005930
curl http://localhost:5000/api/stock/search?q=삼성
curl http://localhost:5000/api/stocks/popular

# 메인 백엔드 API 테스트
curl http://localhost:3000/api/stock/latest
curl http://localhost:3000/api/stock/price/005930
```

## 데이터 소스
- FinanceDataReader: 한국거래소(KRX), 미국(Yahoo), 일본 등 전 세계 주식 데이터
- 실시간 데이터는 5분 캐시로 저장하여 API 응답 속도 최적화
- KOSPI/KOSDAQ 전체 종목 데이터 지원

## 특징
- 실시간 주식 데이터 연동
- 종목 검색 기능
- 인기 종목 모니터링
- 지수 데이터 (KOSPI/KOSDAQ)
- 기존 백엔드와 완벽 호환
- Fallback 데이터 지원 (API 장애 시)

## 주요 종목 코드
- 005930: 삼성전자
- 000660: SK하이닉스  
- 035420: NAVER
- 051910: LG화학
- 068270: 셀트리온
