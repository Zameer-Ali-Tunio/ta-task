import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Currency {
  code: string;
  name: string;
}

export interface CurrenciesResponse {
  data: { [key: string]: Currency };
}

export interface ExchangeRateResponse {
  data: { [key: string]: number };
  query: {
    base_currency: string;
    timestamp: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<CurrenciesResponse>(`${this.apiUrl}/currencies`).pipe(
      map((response) => {
        return Object.keys(response.data).map((code) => ({
          code,
          name: response.data[code].name,
        }));
      }),
    );
  }

  getLatestExchangeRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Observable<ExchangeRateResponse> {
    const params = new HttpParams()
      .set('base', baseCurrency)
      .set('target', targetCurrency);
    return this.http.get<ExchangeRateResponse>(`${this.apiUrl}/latest`, {
      params,
    });
  }

  getHistoricalExchangeRate(
    baseCurrency: string,
    targetCurrency: string,
    date: string,
  ): Observable<ExchangeRateResponse> {
    const params = new HttpParams()
      .set('base', baseCurrency)
      .set('target', targetCurrency)
      .set('date', date);
    return this.http.get<ExchangeRateResponse>(`${this.apiUrl}/historical`, {
      params,
    });
  }
}
