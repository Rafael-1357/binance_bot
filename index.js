require('dotenv').config();

const webSocket = require('ws');
const BinanceWebSocket = new webSocket(`${process.env.STREAM_URL}/${process.env.SYMBOL.toLowerCase()}@kline_1m`)

BinanceWebSocket.onmessage = (e) => {
    console.clear();
    console.log(e.data);
}