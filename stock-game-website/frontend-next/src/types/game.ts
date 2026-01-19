export interface StockData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface TradeHistory {
    id: string;
    type: 'BUY' | 'SELL';
    price: number;
    amount: number;
    date: string;
}