import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Python API 서버에서 데이터 가져오기
    const response = await fetch('http://localhost:5000/api/stocks/popular');
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Python API');
    }
    
    const stockData = await response.json();
    
    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Error fetching popular stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular stocks' },
      { status: 500 }
    );
  }
}
