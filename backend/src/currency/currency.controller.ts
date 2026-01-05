import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('api/currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('currencies')
  async getCurrencies() {
    try {
      return await this.currencyService.getCurrencies();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch currencies',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('latest')
  async getLatestExchangeRate(
    @Query('base') baseCurrency: string,
    @Query('target') targetCurrency: string,
  ) {
    if (!baseCurrency || !targetCurrency) {
      throw new HttpException(
        'Base and target currencies are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.currencyService.getLatestExchangeRate(
        baseCurrency,
        targetCurrency,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch exchange rate',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('historical')
  async getHistoricalExchangeRate(
    @Query('base') baseCurrency: string,
    @Query('target') targetCurrency: string,
    @Query('date') date: string,
  ) {
    if (!baseCurrency || !targetCurrency || !date) {
      throw new HttpException(
        'Base currency, target currency, and date are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.currencyService.getHistoricalExchangeRate(
        baseCurrency,
        targetCurrency,
        date,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch historical exchange rate',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
