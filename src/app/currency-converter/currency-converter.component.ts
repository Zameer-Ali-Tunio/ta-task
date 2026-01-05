import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyService, Currency } from '../../services/currency.service';
import { HistoryService, ConversionHistory } from '../../services/history.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.css',
})
export class CurrencyConverterComponent implements OnInit {
  converterForm: FormGroup;
  currencies: Currency[] = [];
  convertedAmount: number | null = null;
  exchangeRate: number | null = null;
  isLoading = false;
  isLoadingCurrencies = true;
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private historyService: HistoryService,
    private snackBar: MatSnackBar,
  ) {
    this.converterForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['USD', Validators.required],
      toCurrency: ['EUR', Validators.required],
      historicalDate: [null],
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.isLoadingCurrencies = true;
    this.currencyService.getCurrencies().subscribe({
      next: (currencies) => {
        this.currencies = currencies.sort((a, b) => a.code.localeCompare(b.code));
        this.isLoadingCurrencies = false;
      },
      error: (error) => {
        console.error('Error loading currencies:', error);
        this.snackBar.open('Failed to load currencies', 'Close', {
          duration: 3000,
        });
        this.isLoadingCurrencies = false;
      },
    });
  }

  convert(): void {
    if (this.converterForm.invalid || this.isLoading) {
      return;
    }

    const { amount, fromCurrency, toCurrency, historicalDate } =
      this.converterForm.value;

    if (fromCurrency === toCurrency) {
      this.convertedAmount = amount;
      this.exchangeRate = 1;
      return;
    }

    this.isLoading = true;
    this.convertedAmount = null;
    this.exchangeRate = null;

    const conversionObservable = historicalDate
      ? this.currencyService.getHistoricalExchangeRate(
          fromCurrency,
          toCurrency,
          this.formatDate(historicalDate),
        )
      : this.currencyService.getLatestExchangeRate(fromCurrency, toCurrency);

    conversionObservable.subscribe({
      next: (response) => {
        const rate = response.data[toCurrency];
        if (rate) {
          this.exchangeRate = rate;
          this.convertedAmount = amount * rate;

          // Save to history
          this.historyService.saveConversion({
            fromCurrency,
            toCurrency,
            amount,
            convertedAmount: this.convertedAmount,
            rate,
            date: new Date().toISOString(),
            isHistorical: !!historicalDate,
            historicalDate: historicalDate
              ? this.formatDate(historicalDate)
              : undefined,
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Conversion error:', error);
        this.snackBar.open('Failed to convert currency', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  swapCurrencies(): void {
    const fromCurrency = this.converterForm.get('fromCurrency')?.value;
    const toCurrency = this.converterForm.get('toCurrency')?.value;
    this.converterForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
    });
    if (this.converterForm.valid) {
      this.convert();
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
