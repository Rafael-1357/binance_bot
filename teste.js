const { PSAR } = require('technicalindicators');
const WebSocket = require('ws');

const symbol = 'BTCUSDT';
const interval = '1m';
const limit = 1000;
let highs = [];
let lows = [];
let psars= [];
let currentPSAR;

const input = {
    high: highs,
    low: lows,
    step: 0.02, // valor padrão
    max: 0.2    // valor padrão
};

async function getKlines(symbol, interval, limit) {
    const endpoint = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    data.forEach(kline => {
        highs.push(parseFloat(kline[2]));
        lows.push(parseFloat(kline[3]));
    });
}

function purchase() {
        let lastTenLows = lows.slice(-10);
        let lastTenPsar = psars.slice(-10);
        let allPsarLessThanLows = lastTenPsar.every((value, index) => value < lastTenLows[index]);

        if(allPsarLessThanLows) {

        }
}

(async () => {
    await getKlines(symbol, interval, limit);

    const BinanceWebSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

    BinanceWebSocket.onmessage = async (event) => {
        let data = JSON.parse(event.data);
        let kline = data.k;

        if (kline.x) { // Quando a vela está fechada
            highs.push(parseFloat(kline.h));
            lows.push(parseFloat(kline.l));

            // Atualize o input com os arrays atualizados
            input.high = highs;
            input.low = lows;

            let psars = PSAR.calculate(input);
            currentPSAR = psars[psars.length - 1]
            console.log(psars.slice(-10))
            let isPositive = parseFloat(kline.c) > parseFloat(kline.o);
            isPositive ? "Kline fechou positivo" : "Kline fechou negativo");
            console.log('-----------------------------------------------');
        }
    };
})();
