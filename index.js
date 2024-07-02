require('dotenv').config();
const { Indicators } = require('@ixjb94/indicators');
const WebSocket = require('ws');
const ind = new Indicators;

const symbol = 'BTCUSDT';
const interval = '1m';
const limit = 43200;
let highs = [];
let lows = [];
let psars = [];
let currentPSAR;
let purchased;

async function getKlines(symbol, interval, limit) {
    const endpoint = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.map(kline => ({
        openTime: kline[0],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
        closeTime: kline[6],
        quoteAssetVolume: kline[7],
        numberOfTrades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10],
    }));
}

async function calculatePsar(high, low, af, afm, size) {
    return await ind.psar(high, low, af, afm, size);
}

async function klinesData(){
    const klines = await getKlines(symbol, interval, limit);

    highs = []
    lows - []
    psars = []

    klines.forEach(kline => {
        highs.push(kline.high);
        lows.push(kline.low);
    });

    psars = await calculatePsar(highs, lows, 0.02, 0.2, klines.length);
    console.log(psars.slice(-10));
}

klinesData()

// function sequential() {
//         let last10Lows = lows.slice(-10);
//         let last10Psar = psars.slice(-10);

//         let allPsarLessThanLows = last10Psar.every((value, index) => value < last10Lows[index]);

//         if (allPsarLessThanLows && purchased === false) {
//             console.log("Hora de comprar");
//             purchased = true
//         } else {
//             console.log("Não é hora de comprar");
//         }
// }

const BinanceWebSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

BinanceWebSocket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    const kline = data.k;

    if (kline.x) {
        klinesData()
    //     const high = parseFloat(kline.h);
    //     const low = parseFloat(kline.l);

    //     if (highs.length >= limit) {
    //         highs.shift();
    //         lows.shift();
    //     }

    //     highs.push(high);
    //     lows.push(low);

    //     psars = await calculatePsar(highs, lows, 0.02, 0.2, highs.length);
    //     currentPSAR = psars.shift(-1)
    //     console.log(psars.slice(-1));
    //     sequential()
    // }

    // if(purchased) {
    //     if (kline.l > currentPSAR) {
    //         console.log("vendendo...");
    //         purchased = false
    //     }
    }
};
