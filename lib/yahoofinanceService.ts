import { formatDate } from "date-fns";

export interface Asset {
    id: string;
    isin: string;
    name: string;
    quoteType: string;
    price?: string;
    priceChange?: string;
    priceChangePercent?: string;
    rank: string;
    wkn: string;
    symbol: string;
    historicalData: Map<string, number>;
    investments: Investment[];
}

export interface Investment {
    id: string;
    assetId: string;
    type: 'single' | 'periodic';
    amount: number;
    date?: Date;
    periodicGroupId?: string;
}

interface YahooQuoteDocument {
    symbol: string;
    shortName: string;
    rank: string;
    regularMarketPrice: {
        raw: number;
        fmt: string;
    };
    regularMarketChange: {
        raw: number;
        fmt: string;
    };
    regularMarketPercentChange: {
        raw: number;
        fmt: string;
    };
    exchange: string;
    quoteType: string;
}

export interface YahooSearchResponse {
    finance: {
        result: [{
            documents: YahooQuoteDocument[];
        }];
        error: null | string;
    };
}

export interface YahooChartResult {
    timestamp: number[];
    meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        fullExchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        hasPrePostMarketData: boolean;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        fiftyTwoWeekHigh: number;
        fiftyTwoWeekLow: number;
        regularMarketDayHigh: number;
        regularMarketDayLow: number;
        regularMarketVolume: number;
        longName: string;
        shortName: string;
        chartPreviousClose: number;
        priceHint: number;
        currentTradingPeriod: {
            pre: {
                timezone: string;
                start: number;
                end: number;
                gmtoffset: number;
            };
            regular: {
                timezone: string;
                start: number;
                end: number;
                gmtoffset: number;
            };
            post: {
                timezone: string;
                start: number;
                end: number;
                gmtoffset: number;
            };
        };
        dataGranularity: string;
        range: string;
        validRanges: string[];
    }
    indicators: {
        quote: [{
            close: number[];
        }];
    };
}

const formatDateToISO = (date: Date, lessThenADay: boolean = false) => lessThenADay ? formatDate(date, 'yyyy-MM-dd_HH:mm') : formatDate(date, 'yyyy-MM-dd');


const isProd = process.env.NEXT_PUBLIC_USE_PROXYURL;

const CORS_PROXY = 'https://corsproxy.io/?url=';
const YAHOO_API = 'https://query1.finance.yahoo.com';
const API_BASE =  isProd ? `${CORS_PROXY}${encodeURIComponent(YAHOO_API)}` : YAHOO_API;

export const EQUITY_TYPES = {
    all: "etf,equity,mutualfund,index,currency,cryptocurrency,future",
    ETF: "etf",
    Stock: "equity",
    "Etf or Stock": "etf,equity",
    Mutualfund: "mutualfund",
    Index: "index",
    Currency: "currency",
    Cryptocurrency: "cryptocurrency",
    Future: "future",
};

export const searchAssets = async (query: string, equityType: string): Promise<Asset[]> => {
    try {
        // Log input parameters for debugging
        const params = new URLSearchParams({
            query,
            lang: 'en-US',
            type: equityType,
            longName: 'true',
        });

        const url = `${API_BASE}/v1/finance/lookup${!isProd ? encodeURIComponent(`?${params}`) : `?${params}`}`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Network error: ${response.status} ${response.statusText}`);
            throw new Error('Network response was not ok');
        }

        const data = await response.json() as YahooSearchResponse;

        if (data.finance.error) {
            console.error(`API error: ${data.finance.error}`);
            throw new Error(data.finance.error);
        }

        if (!data.finance.result?.[0]?.documents) {
            return [];
        }

        const equityTypes = equityType.split(",").map(v => v.toLowerCase());

        return data.finance.result[0].documents
            .filter(quote => {
                const matches = equityTypes.includes(quote.quoteType.toLowerCase());
                return matches;
            })
            .map((quote) => ({
                id: quote.symbol,
                isin: '', // not provided by Yahoo Finance API
                wkn: '', // not provided by Yahoo Finance API
                name: quote.shortName,
                rank: quote.rank,
                symbol: quote.symbol,
                quoteType: quote.quoteType,
                price: quote.regularMarketPrice.fmt,
                priceChange: quote.regularMarketChange.fmt,
                priceChangePercent: quote.regularMarketPercentChange.fmt,
                exchange: quote.exchange,
                historicalData: new Map(),
                investments: [],
            }));
    } catch (error) {
        console.error('Error searching assets:', error);
        return [];
    }
};

export const getHistoricalData = async (symbol: string, startDate: Date, endDate: Date, interval: string = "1d") => {
    try {
        const start = Math.floor(startDate.getTime() / 1000);
        const end = Math.floor(endDate.getTime() / 1000);

        const params = new URLSearchParams({
            period1: start.toString(),
            period2: end.toString(),
            interval: interval,
        });

        const url = `${API_BASE}/v8/finance/chart/${symbol}${!isProd ? encodeURIComponent(`?${params}`) : `?${params}`}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok (${response.status} - ${response.statusText} - ${await response.text().catch(() => 'No text')})`);

        const data = await response.json();
        const { timestamp = [], indicators, meta } = data.chart.result[0] as YahooChartResult;
        const quotes = indicators.quote[0];

        const lessThenADay = ["60m", "1h", "90m", "45m", "30m", "15m", "5m", "2m", "1m"].includes(interval);
        return {
            historicalData: new Map(timestamp.map((time: number, index: number) => [formatDateToISO(new Date(time * 1000), lessThenADay), quotes.close[index]])),
            longName: meta.longName,
            currency: meta.currency || symbol.toUpperCase().includes("USD") ? "USD" : symbol.toUpperCase().includes("GBP") ? "GBP" : symbol.toUpperCase().includes("EUR") ? "EUR" : null,
            lastPrice: meta.chartPreviousClose
        }
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return { historicalData: new Map<string, number>(), longName: '' };
    }
};
