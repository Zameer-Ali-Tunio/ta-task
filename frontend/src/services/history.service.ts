import { Injectable } from '@angular/core';

export interface ConversionHistory {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  date: string;
  timestamp: number;
  isHistorical: boolean;
  historicalDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly storageKey = 'currency_conversion_history';

  constructor() {}

  saveConversion(conversion: Omit<ConversionHistory, 'id' | 'timestamp'>): void {
    const history = this.getHistory();
    const newConversion: ConversionHistory = {
      ...conversion,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    history.unshift(newConversion);
    // Keep only last 100 conversions
    const trimmedHistory = history.slice(0, 100);
    localStorage.setItem(this.storageKey, JSON.stringify(trimmedHistory));
  }

  getHistory(): ConversionHistory[] {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }
}
