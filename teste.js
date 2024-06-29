const { Indicators } = require('@ixjb94/indicators');
const ind = new Indicators;

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

async function psart(high, low, af, afm, size) {
    return await ind.psar(high, low, af, afm, size);
}

(async () => {
    const symbol = 'BTCUSDT';
    const interval = '1h';
    const limit = 5000;
    let highs = []
    let lows = []
    let psars = []

    const klines = await getKlines(symbol, interval, limit);

    klines.forEach(kline => {
        highs.push(kline.high)
        lows.push(kline.low)
    });

    psart(highs, lows, 0.02, 0.2, klines.length).then(result => {
        result.forEach(kline => {
            psars.push(kline);
        });

        let lastTenElementsSmall = psars.slice(-10);
        console.log(lastTenElementsSmall);

    }).catch(error => {
        console.error(error);
    });
})();