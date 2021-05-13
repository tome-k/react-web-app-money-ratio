import {DefaultSymbol} from '../constants';

const STATUS_UNAUTHORIZED = 401;

export type Rates = {
  [symbol: string]: number;
};

// https://exchangeratesapi.io/documentation/#latestrates
export type ResponseDataLatest = {
  success: boolean;
  /** Unix time */
  timestamp: number;
  /** Symbol */
  base: string;
  /** yyyy-mm-dd */
  date: string;
  rates: Rates;
};

export type Symbols = {
  [symbol: string]: string;
};

// https://exchangeratesapi.io/documentation/#supportedsymbols
export type ResponseDataSymbols = {
  success: boolean;
  symbols: Symbols;
};

export class UnauthorizedError extends Error {
  constructor (message?: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function fetchExchangeRatesAPIData <T = unknown>(
  endpoint: string,
  params: URLSearchParams,
): Promise<T> {
  const url = new URL(`http://api.exchangeratesapi.io/v1/${endpoint}`);
  url.search = params.toString();
  const response = await fetch(url.href);

  if (!response.ok) {
    if (response.status === STATUS_UNAUTHORIZED) {
      throw new UnauthorizedError('There was a problem using the API key provided');
    }
    else throw new Error('Response not OK');
  }

  const data = await response.json() as T;
  return data;
}


export async function fetchRates (apiKey: string): Promise<Rates> {
  const endpoint = 'latest';
  const params = new URLSearchParams({access_key: apiKey, base: DefaultSymbol.Base});
  const {rates} = await fetchExchangeRatesAPIData<ResponseDataLatest>(endpoint, params);
  return rates;
}

export async function fetchSymbols (apiKey: string): Promise<Symbols> {
  const endpoint = 'symbols';
  const params = new URLSearchParams({access_key: apiKey});
  const {symbols} = await fetchExchangeRatesAPIData<ResponseDataSymbols>(endpoint, params);
  return symbols;
}
