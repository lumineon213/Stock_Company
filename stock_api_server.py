from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from stock_data_service import StockDataService

app = Flask(__name__)
CORS(app, origins=["http://localhost:3001"])

stock_service = StockDataService()

@app.route('/api/stock/latest', methods=['GET'])
def get_latest_stock():
    """최신 주식 데이터 (기존 API 호환)"""
    # 기본 인기 종목 데이터 반환
    popular_stock = '005930'  # 삼성전자
    data = stock_service.get_stock_price(popular_stock)
    
    if data:
        return jsonify({
            'symbol': data['symbol'],
            'company': '삼성전자',
            'price': str(data['price']),
            'change': str(data['change']),
            'timestamp': data['timestamp']
        })
    else:
        # fallback 데이터
        return jsonify({
            'symbol': 'MOCK_STK',
            'company': 'Express Server Mock Data',
            'price': '1000.00',
            'change': '0.00',
            'timestamp': '2024-01-01T00:00:00Z'
        })

@app.route('/api/stock/price/<symbol>', methods=['GET'])
def get_stock_price(symbol):
    """특정 종목 주가 조회"""
    days = request.args.get('days', 30, type=int)
    data = stock_service.get_stock_price(symbol, days)
    
    if data:
        return jsonify(data)
    else:
        return jsonify({'error': 'Stock data not found'}), 404

@app.route('/api/stock/search', methods=['GET'])
def search_stocks():
    """종목 검색"""
    keyword = request.args.get('q', '')
    if not keyword:
        return jsonify({'error': 'Search keyword required'}), 400
    
    results = stock_service.search_stocks(keyword)
    return jsonify(results)

@app.route('/api/stock/list', methods=['GET'])
def get_stock_list():
    """전체 종목 리스트"""
    stocks = stock_service.get_stock_list()
    return jsonify(stocks)

@app.route('/api/market/kospi', methods=['GET'])
def get_kospi():
    """KOSPI 지수"""
    data = stock_service.get_market_index('KOSPI')
    if data:
        return jsonify(data)
    else:
        return jsonify({'error': 'KOSPI data not found'}), 404

@app.route('/api/market/kosdaq', methods=['GET'])
def get_kosdaq():
    """KOSDAQ 지수"""
    data = stock_service.get_market_index('KOSDAQ')
    if data:
        return jsonify(data)
    else:
        return jsonify({'error': 'KOSDAQ data not found'}), 404

@app.route('/api/stocks/us', methods=['GET'])
def get_us_stocks():
    """미국 주식 인기 종목"""
    us_stocks = stock_service.get_us_stocks()
    return jsonify(us_stocks)

@app.route('/api/stocks/kospi/all', methods=['GET'])
def get_all_kospi_stocks():
    """KOSPI 전체 종목 순위"""
    kospi_stocks = stock_service.get_all_kospi_stocks()
    return jsonify(kospi_stocks)

@app.route('/api/stocks/popular', methods=['GET'])
def get_popular_stocks():
    """인기 종목 데이터"""
    popular_symbols = ['005930', '000660', '035420', '051910', '068270']  # 삼성전자, SK하이닉스, NAVER, LG화학, 셀트리온
    
    results = []
    for symbol in popular_symbols:
        data = stock_service.get_stock_price(symbol)
        if data:
            results.append(data)
    
    return jsonify(results)

@app.route('/health', methods=['GET'])
def health_check():
    """헬스 체크"""
    return jsonify({'status': 'healthy', 'service': 'stock-data-api'})

if __name__ == '__main__':
    print("🚀 Stock Data API Server starting...")
    print("📡 Available endpoints:")
    print("  GET /api/stock/latest - Latest stock data (legacy)")
    print("  GET /api/stock/price/<symbol> - Stock price by symbol")
    print("  GET /api/stock/search?q=keyword - Search stocks")
    print("  GET /api/stock/list - All stocks list")
    print("  GET /api/market/kospi - KOSPI index")
    print("  GET /api/market/kosdaq - KOSDAQ index")
    print("  GET /api/stocks/popular - Popular stocks")
    print("  GET /health - Health check")
    print("\n🌐 Server running on http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
