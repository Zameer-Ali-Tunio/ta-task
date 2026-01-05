import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class CurrencyService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('CURRENCY_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('CURRENCY_API_BASE_URL') ||
      'https://api.freecurrencyapi.com/v1';

    if (!this.apiKey) {
      throw new Error('CURRENCY_API_KEY is not defined in environment variables');
    }

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  async getCurrencies() {
    try {
      const response = await this.httpClient.get('/currencies', {
        params: {
          apikey: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch currencies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getLatestExchangeRate(baseCurrency: string, targetCurrency: string) {
    try {
      const response = await this.httpClient.get('/latest', {
        params: {
          apikey: this.apiKey,
          base_currency: baseCurrency,
          currencies: targetCurrency,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch exchange rate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHistoricalExchangeRate(
    baseCurrency: string,
    targetCurrency: string,
    date: string,
  ) {
    try {
      const response = await this.httpClient.get('/historical', {
        params: {
          apikey: this.apiKey,
          base_currency: baseCurrency,
          currencies: targetCurrency,
          date: date,
        },
      });
      if (response.data && response.data.data && response.data.data[date]) {
        const historicalData = response.data.data[date];
        return {
          data: historicalData,
          query: response.data.query || {
            base_currency: baseCurrency,
            timestamp: Date.now(),
          },
        };
      }
      return response.data;
    } catch (error: any) {
      console.error('Historical exchange rate error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error?.message || 
                          error.message || 
                          'Failed to fetch historical exchange rate';
      throw new HttpException(
        errorMessage,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
