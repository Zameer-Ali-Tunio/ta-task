import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';
import { ConversionHistoryComponent } from './conversion-history/conversion-history.component';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CurrencyConverterComponent,
    ConversionHistoryComponent,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'Currency Converter';
  @ViewChild('historyComponent') historyComponentRef?: ConversionHistoryComponent;

  ngAfterViewInit(): void {
    // Component reference will be available after view init
  }

  onTabChange(event: MatTabChangeEvent): void {
    // History will refresh when tab is selected via ngOnInit
    // But we can also manually refresh if needed
    if (event.index === 1 && this.historyComponentRef) {
      setTimeout(() => {
        this.historyComponentRef?.loadHistory();
      }, 100);
    }
  }
}
