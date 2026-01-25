import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }
    
    // Python API 서버에서 종목 정보 가져오기
    const response = await fetch(`http://localhost:5000/api/stock/price/${symbol}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Python API');
    }
    
    const stockData = await response.json();
    
    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock price' },
      { status: 500 }
    );
  }
}
