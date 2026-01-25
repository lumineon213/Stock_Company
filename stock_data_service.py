import FinanceDataReader as fdr
import pandas as pd
import json
from datetime import datetime, timedelta
import time

class StockDataService:
    def __init__(self):
        self.cache = {}
        self.cache_duration = 300  # 5 minutes cache
    
    def get_stock_list(self):
        """KOSPI/KOSDAQ 전체 종목 리스트 가져오기"""
        try:
            # KOSPI 종목
            kospi = fdr.StockListing('KOSPI')
            # KOSDAQ 종목  
            kosdaq = fdr.StockListing('KOSDAQ')
            
            # 합치고 필요한 정보만 선택
            all_stocks = pd.concat([kospi, kosdaq], ignore_index=True)
            
            # 컬럼 이름 확인 및 데이터 포맷팅
            result = []
            for _, stock in all_stocks.iterrows():
                result.append({
                    'symbol': stock.get('Code', stock.get('Symbol', '')),
                    'name': stock.get('Name', ''),
                    'market': stock.get('Market', ''),
                    'industry': stock.get('Industry', stock.get('Sector', ''))
                })
            
            return result
        except Exception as e:
            print(f"Error fetching stock list: {e}")
            return []
    
    def get_us_stocks(self):
        """미국 주식 인기 종목 데이터 가져오기"""
        try:
            # 미국 주요 종목
            us_stocks = [
                'AAPL',  # Apple
                'MSFT',  # Microsoft
                'GOOGL', # Alphabet
                'AMZN',  # Amazon
                'TSLA',  # Tesla
                'META',  # Meta
                'NVDA',  # NVIDIA
                'JPM',   # JPMorgan Chase
                'V',     # Visa
                'JNJ'    # Johnson & Johnson
            ]
            
            results = []
            for symbol in us_stocks:
                data = self.get_us_stock_price(symbol)
                if data:
                    results.append(data)
            
            return results
        except Exception as e:
            print(f"Error fetching US stocks: {e}")
            return []
    
    def get_us_stock_price(self, symbol: str):
        """미국 주식 특정 종목 주가 가져오기"""
        try:
            # 캐시 확인
            cache_key = f"us_{symbol}_30"
            current_time = time.time()
            
            if cache_key in self.cache:
                cached_data, cached_time = self.cache[cache_key]
                if current_time - cached_time < self.cache_duration:
                    return cached_data
            
            # 종료일 계산 (오늘)
            end_date = datetime.now()
            # 시작일 계산
            start_date = end_date - timedelta(days=30)
            
            # 데이터 가져오기
            df = fdr.DataReader(symbol, start_date, end_date)
            
            if df.empty:
                return None
            
            # 최신 데이터
            latest = df.iloc[-1]
            previous = df.iloc[-2] if len(df) > 1 else latest
            
            # 변동률 계산
            change = latest['Close'] - previous['Close']
            change_rate = (change / previous['Close']) * 100 if previous['Close'] != 0 else 0
            
            # 회사 이름 가져오기
            company_name = self.get_us_company_name(symbol)
            
            # 결과 포맷팅
            result = {
                'symbol': symbol,
                'name': company_name,
                'date': latest.name.strftime('%Y-%m-%d'),
                'price': float(latest['Close']),
                'open': float(latest['Open']),
                'high': float(latest['High']),
                'low': float(latest['Low']),
                'volume': int(latest['Volume']),
                'change': float(change),
                'change_rate': float(change_rate),
                'previous_close': float(previous['Close']),
                'timestamp': datetime.now().isoformat()
            }
            
            # 캐시에 저장
            self.cache[cache_key] = (result, current_time)
            
            return result
            
        except Exception as e:
            print(f"Error fetching US stock price for {symbol}: {e}")
            return None
    
    def get_us_company_name(self, symbol: str):
        """미국 종목 코드로 회사 이름 가져오기"""
        try:
            # 미국 주요 종목명 매핑
            us_stock_names = {
                'AAPL': 'Apple Inc.',
                'MSFT': 'Microsoft Corporation',
                'GOOGL': 'Alphabet Inc.',
                'AMZN': 'Amazon.com Inc.',
                'TSLA': 'Tesla Inc.',
                'META': 'Meta Platforms Inc.',
                'NVDA': 'NVIDIA Corporation',
                'JPM': 'JPMorgan Chase & Co.',
                'V': 'Visa Inc.',
                'JNJ': 'Johnson & Johnson',
                'WMT': 'Walmart Inc.',
                'PG': 'Procter & Gamble Co.',
                'UNH': 'UnitedHealth Group Inc.',
                'MA': 'Mastercard Inc.',
                'HD': 'Home Depot Inc.',
                'DIS': 'Walt Disney Co.',
                'BAC': 'Bank of America Corp.',
                'XOM': 'Exxon Mobil Corp.',
                'CVX': 'Chevron Corp.',
                'ADBE': 'Adobe Inc.'
            }
            
            return us_stock_names.get(symbol, f'US Stock {symbol}')
        except Exception as e:
            print(f"Error getting US company name for {symbol}: {e}")
            return f'US Stock {symbol}'
    
    def get_all_kospi_stocks(self):
        """KOSPI 전체 종목 데이터 가져오기"""
        try:
            # KOSPI 전체 종목 리스트 가져오기
            kospi_list = fdr.StockListing('KOSPI')
            
            # 상위 50개 종목만 가져오기 (성능상의 이유)
            top_stocks = kospi_list.head(50)
            
            results = []
            for _, stock in top_stocks.iterrows():
                symbol = stock['Code']
                data = self.get_stock_price(symbol)
                if data:
                    results.append(data)
            
            return results
        except Exception as e:
            print(f"Error fetching all KOSPI stocks: {e}")
            return []
    
    def get_company_name(self, symbol: str):
        """종목 코드로 회사 이름 가져오기"""
        try:
            # 주요 종목명 매핑
            stock_names = {
                '005930': '삼성전자',
                '005935': '삼성전자우',
                '000660': 'SK하이닉스',
                '035420': 'NAVER',
                '051910': 'LG화학',
                '068270': '셀트리온',
                '207940': '삼성바이오로직스',
                '003550': 'LG',
                '017670': 'SK텔레콤',
                '028260': '삼성물산',
                '032830': '삼성생명',
                '034730': 'SK',
                '058470': '리노공업',
                '066570': 'LG전자',
                '096770': 'SK이노베이션',
                '105560': 'KB금융',
                '112040': '현대차',
                '118670': '모두투어',
                '124560': '한국항공우주',
                '138940': '메리츠금융지주',
                '145960': '세아제강',
                '161890': '한국가스공사',
                '180640': '현대산업개발',
                '192820': '이마트',
                '195940': '동서',
                '207230': '동양생명',
                '227940': '쿠콘',
                '241560': '코스모신소재',
                '247560': '포스코인터내셔널',
                '263750': '한국타이어앤테크놀로지',
                '267250': '현대오토에버',
                '274250': '현대모비스',
                '285130': '삼성전기',
                '293490': '워크아웃',
                '298050': '현대제철',
                '304660': '현대위아',
                '316140': '우리금융지주',
                '323410': '카카오',
                '337790': 'SK오일앤가스',
                '347860': '알테오',
                '352820': '하림지주',
                '353320': '롯데케미칼',
                '361610': '엔씨소프트',
                '373220': 'LG이노텍',
                '378860': '한국조선해양',
                '388220': '금호석유',
                '393550': '카카오페이',
                '406300': '대한항공',
                '416740': '고려아연',
                '424710': '한국철도공사',
                '437790': '이마트',
                '450660': '기아',
                '457190': '롯데쇼핑',
                '470660': '대신증권',
                '474860': '포스코홀딩스',
                '479770': 'AK홀딩스',
                '487790': '맥쿼리인프라',
                '497700': '기업은행',
                '519360': '현대차2우B',
                '530860': 'POSCO홀딩스',
                '551550': '신한지주',
                '560970': '메리츠증권',
                '588690': '부국증권',
                '599350': '한국금융지주',
                '601570': '우리은행',
                '611990': '하나금융지주',
                '636290': 'DB손해보험',
                '643940': '대교',
                '660970': '한국콜마',
                '684060': '모나미',
                '688740': '아모레퍼시픽',
                '696270': '동국제강',
                '700570': '동부건설',
                '710740': '한국전력',
                '727040': '여수NCC',
                '734090': 'SK스퀘어',
                '7607700': 'HMM',
                '798760': '고려제약',
                '866070': 'AJ네트웍스',
                '871870': '신세계',
                '887960': '우리집단',
                '900270': '미래에셋증권',
                '950110': 'LG유플러스',
                '950290': 'BGF리테일',
                '955340': '금호타이어',
                '960370': '한국가스공사',
                '970290': 'CJ제일제당',
                '975190': '삼성화재',
                '980290': '에스원',
                '983420': '한국전력',
                '990430': 'KBS',
                '999660': '한국항공우주'
            }
            
            return stock_names.get(symbol, f'종목코드 {symbol}')
        except Exception as e:
            print(f"Error getting company name for {symbol}: {e}")
            return f'종목코드 {symbol}'
    
    def get_stock_price(self, symbol: str, days: int = 30):
        """특정 종목의 주가 데이터 가져오기"""
        try:
            # 캐시 확인
            cache_key = f"{symbol}_{days}"
            current_time = time.time()
            
            if cache_key in self.cache:
                cached_data, cached_time = self.cache[cache_key]
                if current_time - cached_time < self.cache_duration:
                    return cached_data
            
            # 종료일 계산 (오늘)
            end_date = datetime.now()
            # 시작일 계산
            start_date = end_date - timedelta(days=days)
            
            # 데이터 가져오기
            df = fdr.DataReader(symbol, start_date, end_date)
            
            if df.empty:
                return None
            
            # 최신 데이터
            latest = df.iloc[-1]
            previous = df.iloc[-2] if len(df) > 1 else latest
            
            # 변동률 계산
            change = latest['Close'] - previous['Close']
            change_rate = (change / previous['Close']) * 100 if previous['Close'] != 0 else 0
            
            # 회사 이름 가져오기
            company_name = self.get_company_name(symbol)
            
            # 결과 포맷팅
            result = {
                'symbol': symbol,
                'name': company_name,
                'date': latest.name.strftime('%Y-%m-%d'),
                'price': float(latest['Close']),
                'open': float(latest['Open']),
                'high': float(latest['High']),
                'low': float(latest['Low']),
                'volume': int(latest['Volume']),
                'change': float(change),
                'change_rate': float(change_rate),
                'previous_close': float(previous['Close']),
                'timestamp': datetime.now().isoformat()
            }
            
            # 캐시에 저장
            self.cache[cache_key] = (result, current_time)
            
            return result
            
        except Exception as e:
            print(f"Error fetching stock price for {symbol}: {e}")
            return None
    
    def get_market_index(self, market: str = 'KOSPI'):
        """주요 지수 데이터 가져오기"""
        try:
            if market == 'KOSPI':
                symbol = '^KS11'  # KOSPI 지수
            elif market == 'KOSDAQ':
                symbol = '^KQ11'  # KOSDAQ 지수
            else:
                return None
            
            return self.get_stock_price(symbol)
            
        except Exception as e:
            print(f"Error fetching market index for {market}: {e}")
            return None
    
    def search_stocks(self, keyword: str):
        """종목 검색"""
        try:
            stock_list = self.get_stock_list()
            
            # 이름 또는 코드로 검색
            filtered = [
                stock for stock in stock_list 
                if keyword.lower() in stock['name'].lower() or keyword.upper() in stock['symbol']
            ]
            
            return filtered[:20]  # 최대 20개만 반환
            
        except Exception as e:
            print(f"Error searching stocks: {e}")
            return []

# 테스트용 코드
if __name__ == "__main__":
    service = StockDataService()
    
    # 인기 종목 테스트
    popular_stocks = ['005930', '000660', '035420', '051910']  # 삼성전자, SK하이닉스, NAVER, LG화학
    
    print("=== 주식 데이터 테스트 ===")
    for symbol in popular_stocks:
        data = service.get_stock_price(symbol)
        if data:
            print(f"{symbol}: {data['price']}원 ({data['change_rate']:+.2f}%)")
    
    # 지수 테스트
    print("\n=== 지수 데이터 ===")
    kospi = service.get_market_index('KOSPI')
    if kospi:
        print(f"KOSPI: {kospi['price']}점 ({kospi['change_rate']:+.2f}%)")
    
    # 검색 테스트
    print("\n=== 검색 테스트 ===")
    search_results = service.search_stocks("삼성")
    for stock in search_results[:3]:
        print(f"{stock['symbol']}: {stock['name']}")