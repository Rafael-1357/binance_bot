const { PSAR } = require('technicalindicators');
const WebSocket = require('ws');

const symbol = 'BTCUSDT';
const interval = '1m';
const limit = 1000;
let highs = [];
let lows = [];
let psars = [];
let currentPSAR;
let stop;
let purchased = false;

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
        purchased = true
        console.log('Comprado');
    }

}

(async () => {
    await getKlines(symbol, interval, limit);

    // Inicia comunicação WEBSOCKET com a binance
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

            // Calcular o parabolic SAR
            psars = PSAR.calculate(input);

            // Verificação para realizar compra
            purchase();

            // Último PSAR
            currentPSAR = psars.at(-1);
            console.log(psars.at(-1));

            // Verifica se o último kline é positivo
            let isPositive = parseFloat(kline.c) > parseFloat(kline.o);
            if (isPositive) { stop = kline.l }
            console.log(stop)
            console.log('-----------------------------------------------');
        }

        if (purchased) {
            if (kline.l > stop) {
                console.log('vendendo...')
                purchased = false
            }
        }
    };
})();
