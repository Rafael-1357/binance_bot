require('dotenv').config();
const WebSocket = require('ws');

const BinanceWebSocket = new WebSocket(`${process.env.STREAM_URL}/${process.env.SYMBOL.toLowerCase()}@kline_1m`);

let highs = [];
let lows = [];
let parabolicSAR = [];

const initialAF = process.env.INITIAL_AF;
const incrementAF = process.env.INCREMENT_AF;
const maxAF = process.env.MAX_AF;
let af = initialAF;
let uptrend = true;
let ep = 0;

function calculateParabolicSAR(highs, lows, af, ep, uptrend) {
    const sar = parabolicSAR.length > 0 ? parabolicSAR[parabolicSAR.length - 1] : lows[0];
}

BinanceWebSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const kline = data.k

    if(kline.x){
        const high = parseFloat(kline.h);
        const low = parseFloat(kline.l);
        highs.push(high);
        lows.push(low);

        console.log(highs, lows)
    }
}
