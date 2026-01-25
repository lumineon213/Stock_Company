import requests
import json
from datetime import datetime

def test_stock_api():
    base_url = "http://localhost:5000"
    
    print("🚀 주식 데이터 API 테스트 시작...")
    print("=" * 50)
    
    # 1. 헬스 체크
    print("\n1. 헬스 체크")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ 상태: {response.json()}")
    except Exception as e:
        print(f"❌ 에러: {e}")
    
    # 2. 최신 주식 데이터
    print("\n2. 최신 주식 데이터")
    try:
        response = requests.get(f"{base_url}/api/stock/latest")
        data = response.json()
        print(f"✅ {data['symbol']} ({data['company']}): {data['price']}원 ({data['change']})")
    except Exception as e:
        print(f"❌ 에러: {e}")
    
    # 3. 특정 종목 주가 (삼성전자)
    print("\n3. 삼성전자 주가")
    try:
        response = requests.get(f"{base_url}/api/stock/price/005930")
        data = response.json()
        print(f"✅ 삼성전자: {data['price']:,}원 ({data['change_rate']:+.2f}%)")
        print(f"   시가: {data['open']:,}원 | 고가: {data['high']:,}원 | 저가: {data['low']:,}원")
    except Exception as e:
        print(f"❌ 에러: {e}")
    
    # 4. 인기 종목
    print("\n4. 인기 종목 5개")
    try:
        response = requests.get(f"{base_url}/api/stocks/popular")
        stocks = response.json()
        for i, stock in enumerate(stocks, 1):
            print(f"✅ {i}. {stock['symbol']}: {stock['price']:,}원 ({stock['change_rate']:+.2f}%)")
    except Exception as e:
        print(f"❌ 에러: {e}")
    
    # 5. KOSPI 지수
    print("\n5. KOSPI 지수")
    try:
        response = requests.get(f"{base_url}/api/market/kospi")
        data = response.json()
        print(f"✅ KOSPI: {data['price']:.2f}점 ({data['change_rate']:+.2f}%)")
    except Exception as e:
        print(f"❌ 에러: {e}")
    
    # 6. 종목 검색
    print("\n6. '삼성' 종목 검색")
    try:
        response = requests.get(f"{base_url}/api/stock/search?q=삼성")
        stocks = response.json()
        for i, stock in enumerate(stocks[:3], 1):  # 상위 3개만
            print(f"✅ {i}. {stock['symbol']}: {stock['name']} ({stock['market']})")
    except Exception as e:
        print(f"❌ 에러: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 테스트 완료!")
    print(f"📅 테스트 시간: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    test_stock_api()
