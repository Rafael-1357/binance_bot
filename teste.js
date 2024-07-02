const { Indicators } = require('@ixjb94/indicators');
const ind = new Indicators;
const WebSocket = require('ws');

const symbol = 'BTCUSDT';
const interval = '1m';
let limit = 1000;
let highs = []
let lows = []
let psars = []

async function getKlines(symbol, interval, limit) {
    const endpoint = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.map(kline => (
        highs.push(kline[2]),
        lows.push(kline[3])
    ));
}

getKlines(symbol, interval, limit)


const BinanceWebSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

BinanceWebSocket.onmessage = async (event) => {
    let data = JSON.parse(event.data);
    let kline = data.k;

    if (kline.x) {
        highs.push(kline.h);
        lows.push(kline.l);
        console.log('-------------------')
        console.log(kline.h)
        console.log(highs.slice(-1))
        console.log(kline.l)
        console.log(lows.slice(-1))
        console.log(highs.length)
        console.log('-------------------')
    }
};

